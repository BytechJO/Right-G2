import { createPortal } from "react-dom";
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import React, { useState, useEffect, useRef } from "react";
// import "./WB_Unit1_Page4_Q1.css";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex E 3.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex C 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex C 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex C 4.svg";
import img from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex C 4.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import {
  DragDropContext,
  Droppable,
  Draggable,
  useMouseSensor,
  useTouchSensor,
} from "@hello-pangea/dnd";
//..
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 1/Page 4 - C/Item_001_who.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 1/Page 4 - C/Item_002_he.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 1/Page 4 - C/Item_003_she.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 1/Page 4 - C/Item_004_is.mp3";

// Keep the score dialog's return focus on an enabled action in this exercise.
// Keep the actual draggable in viewport coordinates; the inert source keeps its exact bank position.
// eslint-disable-next-line react-refresh/only-export-components -- Exercise-local drag presentation.
function BankDragItem({ provided, snapshot, freeze, normalStyle, children }) {
  const appearance = useRef({});
  const originalRef = children.props.ref;
  const measure = (node) => {
    if (!node || snapshot.isDragging) return;
    const computed = window.getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    const scale = node.offsetWidth ? rect.width / node.offsetWidth : 1;
    const next = { fontFamily: computed.fontFamily, fontWeight: computed.fontWeight, color: computed.color };
    for (const key of ['fontSize', 'lineHeight', 'letterSpacing', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderRadius']) {
      const value = parseFloat(computed[key]);
      if (Number.isFinite(value)) next[key] = value * scale;
    }
    appearance.current = next;
  };
  const ref = (node) => {
    if (typeof originalRef === 'function') originalRef(node);
    else if (originalRef) originalRef.current = node;
    measure(node);
  };
  const element = React.cloneElement(children, {
    ref,
    onPointerDownCapture: (event) => {
      children.props.onPointerDownCapture?.(event);
      measure(event.currentTarget);
    },
    style: {
      ...normalStyle,
      ...(snapshot.isDragging ? appearance.current : {}),
      ...provided.draggableProps.style,
      ...(snapshot.isDragging
        ? { opacity: 1, visibility: 'visible', zIndex: 2147483647, pointerEvents: 'none' }
        : freeze ? { transform: 'none', transition: 'none' } : {}),
    },
  });
  if (!snapshot.isDragging) return element;
  const space = React.createElement(children.type, {
    'aria-hidden': true,
    className: children.props.className,
    style: { ...normalStyle, visibility: 'hidden', pointerEvents: 'none' },
  }, children.props.children);
  return <>{space}{createPortal(element, document.fullscreenElement || document.body)}</>;
}

function showCheckFeedback(root, kind, ...messages) {
  if (kind === "success") {
    const returnTarget =
      root?.querySelector(".try-again-button:not(:disabled)") ||
      root?.querySelector(".show-answer-btn:not(:disabled)");
    returnTarget?.focus({ preventScroll: true });
  }
  ValidationAlert[kind](...messages);
}


const IMAGE_DESCRIPTIONS = {
  [img1]: "A woman wearing glasses and an orange top.",
  [img2]: "A child with dark hair tied up and a blue top.",
  [img3]: "A man in a blue shirt and vest holding one hand up.",
  [img4]: "A man in a blue shirt and vest holding one hand up.",
  [img]: "A man in a blue shirt and vest holding one hand up.",
};

const focusClass =
  "focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!";
// eslint-disable-next-line react-refresh/only-export-components -- Keep this indicator local.
const SpeakerBadge = () => (
  <span
    aria-hidden="true"
    style={{
      position: "absolute",
      top: -10,
      right: -10,
      width: 22,
      height: 22,
      borderRadius: "50%",
      background: "white",
      color: "black",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
      zIndex: 3,
      boxShadow: "0 1px 3px rgba(0,0,0,.25)",
    }}
  >
    <FaVolumeUp size={12} />
  </span>
);
const release = (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    e.stopPropagation();
  }
};
function useExerciseAudio() {
  const rootRef = useRef(null),
    ownerRef = useRef(Symbol("workbook-exercise")),
    tokenRef = useRef(0);
  const [playingKey, setPlayingKey] = useState(null);
  const stopAudio = () => {
    tokenRef.current++;
    stopGlobalAudio(ownerRef.current);
    setPlayingKey(null);
  };
  const playSound = (key, src) => {
    if (!src) return;
    stopAudio();
    rootRef.current
      ?.querySelectorAll("audio")
      .forEach((audio) => audio.pause());
    const token = tokenRef.current;
    setPlayingKey(key);
    try {
      playGlobalAudio(src, {
        owner: ownerRef.current,
        onFinish: () => {
          if (tokenRef.current === token) setPlayingKey(null);
        },
      });
    } catch {
      stopAudio();
    }
  };
  useEffect(() => {
    const tokenState = tokenRef,
      owner = ownerRef.current;
    const onPlay = (e) => {
      if (e.target?.tagName !== "AUDIO") return;
      tokenRef.current++;
      stopGlobalAudio(ownerRef.current);
      setPlayingKey(null);
    };
    document.addEventListener("play", onPlay, true);
    return () => {
      document.removeEventListener("play", onPlay, true);
      tokenState.current++;
      stopGlobalAudio(owner);
    };
  }, []);
  return {
    rootRef,
    playingKey,
    playSound,
    stopAudio,
  };
}

function useTokenOrder(questions, sounds) {
  const initial = Object.fromEntries(questions.map((q) => [q.id, []]));
  const [inputs, setInputs] = useState(initial),
    [results, setResults] = useState({}),
    [revealed, setRevealed] = useState(false),
    [picked, setPicked] = useState(null),
    [message, setMessage] = useState("");
  const audio = useExerciseAudio(),
    bankRefs = useRef({}),
    slotRefs = useRef({}),
    frame = useRef(null),
    suppress = useRef(false);
  const cancelFocus = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  };
  const focus = (get) => {
    cancelFocus();
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      suppress.current = true;
      try {
        get()?.focus();
      } finally {
        suppress.current = false;
      }
    });
  };
  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );
  const locked = (id) => revealed || results[id] === "correct",
    tokens = (q) =>
      q.scrambled.map((t, i) =>
        typeof t === "string"
          ? {
              id: q.id + "-" + t + "-" + i,
              value: t,
            }
          : t,
      );
  const place = (id, tokenId) => {
    const q = questions.find((q) => String(q.id) === String(id)),
      item = q && tokens(q).find((t) => t.id === tokenId);
    if (
      !item ||
      locked(id) ||
      inputs[id].some((t) => t.id === tokenId) ||
      inputs[id].length >= tokens(q).length
    )
      return;
    const next = [...inputs[id], item];
    setInputs((prev) => ({
      ...prev,
      [id]: next,
    }));
    setResults((prev) => ({
      ...prev,
      [id]: null,
    }));
    setPicked(null);
    setMessage(item.value + " placed.");
    return next;
  };
  const remove = (id, tokenId) => {
    if (locked(id)) return;
    setInputs((prev) => ({
      ...prev,
      [id]: prev[id].filter((t) => t.id !== tokenId),
    }));
    setResults((prev) => ({
      ...prev,
      [id]: null,
    }));
    setMessage("Item returned to the bank.");
  };
  const cancel = () => {
    if (picked) focus(() => bankRefs.current[picked.token]);
    setPicked(null);
    setMessage("Selection cancelled.");
  };
  const bankProps = (q, item, pendingMatch = false) => ({
    role: "button",
    tabIndex: pendingMatch || picked ? -1 : 0,
    "aria-pressed": picked?.token === item.id,
    "aria-disabled": locked(q.id) || inputs[q.id].some((t) => t.id === item.id),
    "aria-label": item.value + ". Choose for question " + q.id,
    onClick: () => audio.playSound("bank-" + item.id, sounds[item.value]),
    onFocus: (e) => {
      if (!suppress.current && e.currentTarget.matches(":focus-visible"))
        audio.playSound("bank-" + item.id, sounds[item.value]);
    },
    onKeyDown: (e) => {
      if (e.key === "Escape" && picked) {
        e.preventDefault();
        e.stopPropagation();
        cancel();
        return;
      }
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      e.stopPropagation();
      if (
        e.repeat ||
        locked(q.id) ||
        inputs[q.id].some((t) => t.id === item.id)
      )
        return;
      audio.playSound("bank-" + item.id, sounds[item.value]);
      setPicked({
        qid: q.id,
        token: item.id,
      });
      setMessage(
        item.value + " chosen. Press Enter or Space in the answer field.",
      );
      focus(() => slotRefs.current[q.id]);
    },
    onKeyUp: release,
  });
  const slotProps = (q, snapshot, pendingMatch = false) => ({
    role: "button",
    tabIndex: pendingMatch || (picked && picked.qid !== q.id) ? -1 : 0,
    "aria-label":
      "Question " +
      q.id +
      " answer: " +
      (inputs[q.id].map((t) => t.value).join(q.separator) || "Empty") +
      (locked(q.id) ? ". Correct and locked" : ""),
    "aria-disabled": locked(q.id),
    onClick: (e) => {
      if (e.target === e.currentTarget && !locked(q.id) && inputs[q.id].length)
        remove(q.id, inputs[q.id].at(-1).id);
    },
    onKeyDown: (e) => {
      if (e.key === "Escape" && picked) {
        e.preventDefault();
        e.stopPropagation();
        cancel();
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        e.stopPropagation();
        if (!e.repeat && results[q.id] === "wrong" && inputs[q.id].length)
          remove(q.id, inputs[q.id].at(-1).id);
        return;
      }
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      e.stopPropagation();
      if (e.repeat || locked(q.id)) return;
      if (picked) {
        if (picked.qid !== q.id) return;
        const next = place(q.id, picked.token);
        if (next) {
          const token = tokens(q).find((t) => !next.some((v) => v.id === t.id));
          focus(() => bankRefs.current[token?.id || picked.token]);
        }
      } else if (inputs[q.id].length) remove(q.id, inputs[q.id].at(-1).id);
    },
    onKeyUp: release,
    style: {
      borderRadius: 0,
      position: "relative",
      ...(locked(q.id)
        ? {
            borderBottomColor: "#16a34a",
            boxShadow: "inset 0 0px #16a34a",
          }
        : results[q.id] === "wrong"
          ? { borderBottomColor: "#ef4444" }
          : {}),
      ...(snapshot?.isDraggingOver && !locked(q.id)
        ? {
            outline: "3px dashed #2563eb",
            outlineOffset: 2,
            backgroundColor: "#dbeafe",
          }
        : {}),
    },
  });
  const evaluate = () => {
    cancelFocus();
    setPicked(null);
    audio.stopAudio();
    const next = Object.fromEntries(
      questions.map((q) => [
        q.id,
        results[q.id] === "correct" ||
        inputs[q.id].map((t) => t.value).join(q.separator) === q.correctSentence
          ? "correct"
          : "wrong",
      ]),
    );
    setResults(next);
    return next;
  };
  const show = () => {
    cancelFocus();
    audio.stopAudio();
    setPicked(null);
    const solved = Object.fromEntries(
      questions.map((q) => {
        const remaining = tokens(q);
        return [
          q.id,
          q.correctSentence.split(q.separator).map((value) => {
            const index = remaining.findIndex((t) => t.value === value);
            return remaining.splice(index, 1)[0];
          }),
        ];
      }),
    );
    setInputs(solved);
    setResults(Object.fromEntries(questions.map((q) => [q.id, "correct"])));
    setRevealed(true);
    setMessage("Correct answers shown and locked.");
  };
  const reset = () => {
    cancelFocus();
    audio.stopAudio();
    setPicked(null);
    setInputs(initial);
    setResults({});
    setRevealed(false);
    setMessage("Exercise reset.");
  };
  const dragStart = () => {
    cancelFocus();
    setPicked(null);
  };
  return {
    ...audio,
    bankRefs,
    slotRefs,
    inputs,
    results,
    revealed,
    picked,
    message,
    setMessage,
    tokens,
    locked,
    place,
    remove,
    bankProps,
    slotProps,
    evaluate,
    show,
    reset,
    dragStart,
    cancelFocus,
  };
}

const WB_Unit1_Page4_Q1 = () => {
  const completedCheckRef = useRef(null);
  const completeCheck = (event) => {
    const button = event?.currentTarget;
    if (!completedCheckRef.current || (button?.style && completedCheckRef.current.button !== button)) {
      completedCheckRef.current = { button, cursor: button?.style?.cursor, aria: button?.getAttribute?.("aria-disabled") };
    }
    if (button?.style) {
      button.style.cursor = "not-allowed";
      button.setAttribute("aria-disabled", "true");
    }
  };
  const resetCompletedCheck = () => {
    const previous = completedCheckRef.current;
    if (previous?.button?.style) {
      previous.button.style.cursor = previous.cursor || "";
      if (previous.aria == null) previous.button.removeAttribute("aria-disabled");
      else previous.button.setAttribute("aria-disabled", previous.aria);
    }
    completedCheckRef.current = null;
  };

  const questions = [
    {
      id: 1,
      matchWord: "He is my father.",
      correctSentence: "who is he",
      scrambled: ["who", "he", "is"],
      image: img3,
    },
    {
      id: 2,
      matchWord: "She is my aunt.",
      correctSentence: "who is she",
      scrambled: ["who", "she", "is"],
      image: img1,
    },
    {
      id: 3,
      matchWord: "He is my brother.",
      correctSentence: "who is he",
      scrambled: ["who", "he", "is"],
      image: img4,
    },
    {
      id: 4,
      matchWord: "She is my sister.",
      correctSentence: "who is she",
      scrambled: ["who", "she", "is"],
      image: img2,
    },
  ];
  const order = useTokenOrder(
    questions.map((q) => ({ ...q, separator: " " })),
    { who: clip0, he: clip1, she: clip2, is: clip3 },
  );
  const { rootRef, message, playingKey } = order;
  const userInputs = Object.fromEntries(
    Object.entries(order.inputs).map(([id, items]) => [
      id,
      items.map((t) => t.value),
    ]),
  );
  const wrongInputs = Object.keys(order.results).filter(
    (id) => order.results[id] === "wrong",
  );
  const handleRemoveWord = (id, index) =>
    order.remove(id, order.inputs[id][index].id);
  const onDragEnd = ({ destination, draggableId }) => {
    if (!destination?.droppableId.startsWith("sentence-")) return;
    const id = destination.droppableId.replace("sentence-", "");
    const q = questions.find((q) => String(q.id) === id);
    if (!q) return;
    const token = order
      .tokens(q)
      .find((t) => draggableId === q.id + "-" + t.value);
    if (token) order.place(id, token.id);
  };
  const checkAnswers = (checkEvent) => {
    if (completedCheckRef.current) { completeCheck(checkEvent); return; }

    if (order.revealed) return;
    order.dragStart();
    order.stopAudio();
    if (Object.values(order.inputs).some((arr) => !arr.length)) {
      ValidationAlert.info("Oops!", "Please complete all sentences.");
      order.setMessage("Please complete all sentences.");
      return;
    }
    const checked = order.evaluate(),
      score = Object.values(checked).filter((x) => x === "correct").length,
      msg = `Score: ${score} / 4`;
    order.setMessage(msg);
    if (score === 4) (completeCheck(checkEvent), showCheckFeedback(rootRef.current, "success", msg));
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };
  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onDragStart={order.dragStart}
      enableDefaultSensors={false}
      sensors={[useMouseSensor, useTouchSensor]}
    >
      <div
        ref={rootRef}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
        }}
      >
        <div className="div-forall" style={{ gap: "25px" }}>
          <div
            className="sr-only"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {message}
          </div>
          <ExerciseHeader
            isWorkbook
            sectionLetter="C"
            title={<> Look, trace, read, and write.</>}
            subTitle={
              "Trace each question from left to right, then connect it to the family sentence that answers it."
            }
          />
          <div className="flex w-full gap-1 items-center">
            <div
              className="container12"
              // ref={containerRef}
              style={{
                position: "relative",
                width: "50%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "15px",
              }}
            >
              {questions.map((q) => (
                <div
                  className="CB-unit5-p6-q1-row"
                  key={q.id}
                  style={{
                    position: "relative",
                    width: "100%",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                    }}
                  >
                    <span className="CB-unit5-p6-q1-number">{q.id}</span>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "60%",
                        // gap: "10px",
                      }}
                    >
                      {/* Word Bank */}
                      <Droppable droppableId={`bank-${q.id}`} direction="horizontal">
                        {(provided, bankSnapshot) => <div ref={provided.innerRef} {...provided.droppableProps} className="CB-unit5-p6-q1-word-bank flex gap-5">
                            {q.scrambled.map((word, i) => {
      const isUsed = userInputs[q.id]?.includes(word);
      return <Draggable key={word} draggableId={`${q.id}-${word}`} index={i} isDragDisabled={order.locked(q.id) || isUsed}>
                                  {(provided, snapshot) => <BankDragItem provided={provided} snapshot={snapshot} freeze={!!bankSnapshot.draggingFromThisWith} normalStyle={{
          background: isUsed ? "#ccc" : "white",
          opacity: isUsed ? 0.6 : 1,
          cursor: isUsed ? "not-allowed" : "grab",
          position: "relative",
          ...(order.picked?.token === order.tokens(q)[i].id ? {
            outline: "4px solid #2563eb",
            backgroundColor: "#dbeafe"
          } : {})
        }}><div ref={el => {
            provided.innerRef(el);
            order.bankRefs.current[order.tokens(q)[i].id] = el;
          }} {...provided.draggableProps} {...provided.dragHandleProps} {...order.bankProps(q, order.tokens(q)[i])} className={`WB-word-bank flex items-center ${focusClass}`}>
                                      {word}
                                      {playingKey === `bank-${order.tokens(q)[i].id}` && <SpeakerBadge />}
                                    </div></BankDragItem>}
                                </Draggable>;
    })}
                            {bankSnapshot.draggingFromThisWith ? <span aria-hidden="true" style={{
      display: "none"
    }}>{provided.placeholder}</span> : provided.placeholder}
                          </div>}
                      </Droppable>

                      {/* Sentence Input Area */}
                      <div style={{ position: "relative" }}>
                        <Droppable
                          droppableId={`sentence-${q.id}`}
                          isDropDisabled={order.locked(q.id)}
                          direction="horizontal"
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={(el) => {
                                provided.innerRef(el);
                                order.slotRefs.current[q.id] = el;
                              }}
                              {...provided.droppableProps}
                              {...order.slotProps(
                                { ...q, separator: " " },
                                snapshot,
                              )}
                              className={`CB-unit5-p6-q1-unscramble-input w-full ${focusClass} ${wrongInputs.includes(String(q.id)) ? "wrong-input" : ""}`}
                              style={
                                order.slotProps(
                                  { ...q, separator: " " },
                                  snapshot,
                                ).style
                              }
                            >
                              {userInputs[q.id]?.map((word, index) => (
                                <span
                                  key={index}
                                  onClick={() => handleRemoveWord(q.id, index)}
                                  style={{
                                    cursor: "pointer",
                                    marginRight: "6px",
                                  }}
                                >
                                  {word}
                                </span>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>

                        {/* أيقونة الخطأ (X أبيض في دائرة حمراء) */}
                        {wrongInputs.includes(String(q.id)) && (
                          <div
                            style={{
                              position: "absolute",
                              top: "-10px",
                              right: "16px",
                              backgroundColor: "red",
                              color: "white",
                              borderRadius: "50%",
                              width: "20px",
                              height: "20px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              fontSize: "12px",
                              fontWeight: "bold",
                              zIndex: 10,
                              boxShadow: "0 0 5px rgba(0,0,0,0.3)",
                              border: "2px solid white",
                            }}
                          >
                            ✕
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* RIGHT MATCHING */}
            <div
              className="flex justify-center items-stretch"
              style={{ width: "100%" }}
            >
              <img
                src={img}
                alt={IMAGE_DESCRIPTIONS[img] || ""}
                className="w-full h-full object-contain"
                style={{ height: "100%", width: "100%" }}
              />
            </div>
          </div>

          <div className="action-buttons-container">
            <button onClick={(checkEvent) => { resetCompletedCheck(); (order.reset)(checkEvent); }} className="try-again-button">
              Start Again ↻
            </button>

            <button
              onClick={order.show}
              className="show-answer-btn swal-continue"
            >
              Show Answer
            </button>

            <button onClick={checkAnswers} className="check-button2">
              Check Answer ✓
            </button>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default WB_Unit1_Page4_Q1;

/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 7/Page 39 - B/Item_001_eight.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 7/Page 39 - B/Item_002_It's.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 7/Page 39 - B/Item_003_thirty.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 7/Page 39 - B/Item_004_four.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 7/Page 39 - B/Item_005_o'clock.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 7/Page 39 - B/Item_006_quarter.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 7/Page 39 - B/Item_007_two.mp3";
import clip7 from "../../../assets/audio/WorkBook/Unit 7/Page 39 - B/Item_008_a.mp3";
import clip8 from "../../../assets/audio/WorkBook/Unit 7/Page 39 - B/Item_009_past.mp3";
import clip9 from "../../../assets/audio/WorkBook/Unit 7/Page 39 - B/Item_010_to.mp3";
import { createPortal } from "react-dom";
import React, { useState, useRef, useEffect } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 39/Ex B 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 39/Ex B 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 39/Ex B 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 39/Ex B 4.svg";
import {
  DndContext,
  PointerSensor,
  useSensors,
  useSensor,
  useDraggable,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
const IMAGE_DESCRIPTIONS = {
  [img1]: "An analogue clock.",
  [img2]: "An analogue clock.",
  [img3]: "An analogue clock.",
  [img4]: "An analogue clock.",
};
const focusClass =
  "focus-visible:outline-solid! focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!";
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
const activate = (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  e.preventDefault();
  e.stopPropagation();
  if (!e.repeat) e.currentTarget.click();
};
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
function useCheckButton(rootRef, checkDisabled) {
  useEffect(() => {
    const button = rootRef.current?.querySelector(".check-button2");
    if (!button) return;
    button.disabled = checkDisabled;
    button.style.cursor = checkDisabled ? "not-allowed" : "";
    button.setAttribute("aria-disabled", String(checkDisabled));
  }, [rootRef, checkDisabled]);
}
function showCheckFeedback(root, kind, ...messages) {
  if (kind === "success") {
    const returnTarget =
      root?.querySelector(".try-again-button:not(:disabled)") ||
      root?.querySelector(".show-answer-btn:not(:disabled)");
    returnTarget?.focus({
      preventScroll: true,
    });
  }
  ValidationAlert[kind](...messages);
}
const SOUNDS = {
  eight: clip0,
  "it's": clip1,
  thirty: clip2,
  four: clip3,
  "o'clock": clip4,
  quarter: clip5,
  two: clip6,
  a: clip7,
  past: clip8,
  to: clip9,
};
const normalized = (text) =>
  String(text)
    .toLowerCase()
    .replaceAll("’", "'")
    .replace(/:/g, " ")
    .replace(/[.,!?]/g, "")
    .replace(/\s+/g, " ")
    .trim();
const soundFor = (text) => SOUNDS[normalized(text)];
function useTokenOrder(questions, sounds, crossRow = false) {
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
  const used = (tokenId) =>
    Object.entries(inputs).some(
      ([id, items]) =>
        results[id] !== "wrong" && items.some((t) => t.id === tokenId),
    );
  const place = (id, tokenId, index) => {
    const q = questions.find((q) => String(q.id) === String(id)),
      item =
        q &&
        (crossRow
          ? questions.filter((other) => other.kind === q.kind).flatMap(tokens)
          : tokens(q)
        ).find((t) => t.id === tokenId);
    if (
      Object.entries(inputs).some(
        ([zone, items]) => locked(zone) && items.some((t) => t.id === tokenId),
      )
    )
      return;
    if (
      !item ||
      locked(id) ||
      inputs[id].some((t) => t.id === tokenId) ||
      inputs[id].length >= tokens(q).length
    )
      return;
    const next = [...inputs[id]];
    next.splice(index ?? next.length, 0, item);
    setInputs((prev) => ({
      ...Object.fromEntries(
        Object.entries(prev).map(([zone, items]) => [
          zone,
          zone === String(id) ? items : items.filter((t) => t.id !== tokenId),
        ]),
      ),
      [id]: next,
    }));
    setResults((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([zone, result]) => [
          zone,
          zone === String(id) || inputs[zone]?.some((t) => t.id === tokenId)
            ? null
            : result,
        ]),
      ),
    );
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
    cancelFocus();
    if (picked) focus(() => bankRefs.current[picked.token]);
    setPicked(null);
    setMessage("Selection cancelled.");
  };
  const bankProps = (q, item, pendingMatch = false) => ({
    role: "button",
    tabIndex: pendingMatch || picked ? -1 : 0,
    "aria-pressed": picked?.token === item.id,
    "aria-disabled": locked(q.id) || used(item.id),
    "aria-label": item.value + ". Choose for question " + q.id,
    onClick: () => audio.playSound("bank-" + item.id, soundFor(item.value)),
    onFocus: (e) => {
      if (!suppress.current && e.currentTarget.matches(":focus-visible"))
        audio.playSound("bank-" + item.id, soundFor(item.value));
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
      if (e.repeat) return;
      audio.playSound("bank-" + item.id, soundFor(item.value));
      if (locked(q.id) || used(item.id)) return;
      setPicked({
        qid: q.id,
        token: item.id,
      });
      setMessage(
        item.value + " chosen. Press Enter or Space in the answer field.",
      );
      const target = questions.find(
        (other) =>
          (crossRow ? other.kind === q.kind : other.id === q.id) &&
          !locked(other.id) &&
          inputs[other.id].length < tokens(other).length,
      );
      if (target) focus(() => slotRefs.current[target.id]);
    },
    onKeyUp: release,
  });
  const slotProps = (q, snapshot, pendingMatch = false) => ({
    role: "button",
    tabIndex:
      pendingMatch ||
      (picked &&
        !(crossRow
          ? questions.find((other) => other.id === picked.qid)?.kind === q.kind
          : picked.qid === q.id))
        ? -1
        : 0,
    "aria-label":
      "Question " +
      q.id +
      " answer: " +
      (inputs[q.id].map((t) => t.value).join(q.separator) || "Empty") +
      (locked(q.id) ? ". Correct and locked" : ""),
    "aria-disabled": locked(q.id),
    onClick: (e) => {
      e.stopPropagation();
      if (!locked(q.id) && inputs[q.id].length)
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
        if (
          crossRow
            ? questions.find((other) => other.id === picked.qid)?.kind !==
              q.kind
            : picked.qid !== q.id
        )
          return;
        const next = place(q.id, picked.token);
        if (next) {
          const token = tokens(q).find(
            (t) => t.id !== picked.token && !used(t.id),
          );
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
            borderColor: "#16a34a",
            borderBottomColor: "#16a34a",
            boxShadow: "inset 0 0px #16a34a",
          }
        : results[q.id] === "wrong"
          ? {
              borderBottomColor: "#ef4444",
            }
          : {}),
      ...(snapshot?.isDraggingOver && !locked(q.id)
        ? {
            outline: "3px dashed #2563eb",
            outlineOffset: 2,
            borderRadius: 4,
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
        inputs[q.id]
          .map((t) => t.value)
          .join(q.separator)
          .toLowerCase() === q.correctSentence.toLowerCase()
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
            const index = remaining.findIndex(
              (t) => t.value.toLowerCase() === value.toLowerCase(),
            );
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
  const reorder = (id, from, to) => {
    if (locked(id)) return;
    const next = [...inputs[id]],
      item = next.splice(from, 1)[0];
    if (!item) return;
    next.splice(to, 0, item);
    setInputs((p) => ({
      ...p,
      [id]: next,
    }));
    setResults((p) => ({
      ...p,
      [id]: null,
    }));
  };
  return {
    used,
    reorder,
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
function useDragState(place, clear) {
  const [active, setActive] = useState(null),
    current = useRef(null);
  const stop = () => {
    current.current = null;
    setActive(null);
    clear();
  };
  return {
    active,
    stop,
    start: (e) => {
      clear();
      current.current = e.active.id;
      const r = e.active.rect?.current?.initial;
      setActive({
        id: e.active.id,
        ...(r
          ? {
              width: r.width,
              height: r.height,
            }
          : {}),
      });
    },
    end: (e) => {
      const id = current.current;
      current.current = null;
      setActive(null);
      if (id === e.active.id && e.over) place(e.over.id, id);
    },
    cancel: stop,
  };
}
function DragPreview({ drag, className, children }) {
  return createPortal(
    <DragOverlay
      style={{
        zIndex: 2147483647,
      }}
      dropAnimation={null}
    >
      {drag.active ? (
        <div
          className={className}
          style={{
            width: drag.active.width,
            height: drag.active.height,
            boxSizing: "border-box",
            pointerEvents: "none",
          }}
        >
          {children}
        </div>
      ) : null}
    </DragOverlay>,
    document.fullscreenElement || document.body,
  );
}
const exerciseDataL = {
  sentences: [
    {
      id: "l1",
      correctSentence: "It's eight thirty.",
      words: ["eight", "It's", "thirty."],
    },
    {
      id: "l2",
      correctSentence: "It's four o'clock.",
      words: ["four", "It's", "o'clock."],
    },
    {
      id: "l3",
      correctSentence: "It's a quarter past two.",
      words: ["quarter", "two.", "It's", "a", "past"],
    },
    {
      id: "l4",
      correctSentence: "It's a quarter to two.",
      words: ["two.", "quarter", "It's", "a", "to"],
    },
  ],
};
const DraggableWord = ({ q, item, order, drag }) => {
  const id = item.id,
    used = order.used(id),
    disabled = used || order.locked(q.id);
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
    disabled,
  });
  const props = order.bankProps(q, item);
  return (
    <button
      type="button"
      ref={(el) => {
        setNodeRef(el);
        order.bankRefs.current[id] = el;
      }}
      {...attributes}
      {...listeners}
      {...props}
      style={{
        touchAction: "none",
        borderRadius: 8,
        position: "relative",
        opacity: drag.active?.id === id ? 0 : used ? 0.5 : 1,
        ...(order.picked?.token === id
          ? {
              outline: "3px solid #2563eb",
              outlineOffset: 2,
              backgroundColor: "#dbeafe",
            }
          : {}),
      }}
      className={
        focusClass +
        " WB-word-bank " +
        (used
          ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
          : "border-2 border-blue-900 hover:bg-gray-300 cursor-grab")
      }
    >
      {item.value}
      {order.playingKey === "bank-" + id && <SpeakerBadge />}
    </button>
  );
};
const DropZone = ({ q, children, order, drag }) => {
  const { setNodeRef, isOver } = useDroppable({
      id: q.id,
      disabled: order.locked(q.id),
    }),
    props = order.slotProps(q, {
      isDraggingOver: isOver && !!drag.active,
    });
  return (
    <div className="relative ">
      <div
        type="button"
        ref={(el) => {
          setNodeRef(el);
          order.slotRefs.current[q.id] = el;
        }}
        {...props}
        className={
          focusClass +
          " focus-visible:rounded-sm! min-h-8 border-b-2 p-2 w-80 border-gray-500"
        }
      >
        {children}
      </div>
    </div>
  );
};
const WB_Unit7_Page39_Q2 = () => {
  const questions = exerciseDataL.sentences.map((s) => ({
    id: s.id,
    scrambled: s.words.map((value, i) => ({
      id: s.id + "-word-" + i,
      value,
    })),
    correctSentence: s.correctSentence,
    separator: " ",
  }));
  const order = useTokenOrder(questions, SOUNDS);
  const { rootRef, message } = order;
  const drag = useDragState(
    (id, token) => order.place(id, token),
    order.dragStart,
  );
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
  );
  const complete = questions.every((q) => order.results[q.id] === "correct");
  const completionRef = useRef(false);
  completionRef.current = complete || order.revealed;
  useCheckButton(rootRef, complete || order.revealed);
  const checkAnswers = () => {
    if (completionRef.current) return;
    drag.stop();
    order.stopAudio();
    if (
      questions.some(
        (q) => order.inputs[q.id].length !== order.tokens(q).length,
      )
    ) {
      order.setMessage(
        "Please complete all sentences before checking your answers.",
      );
      ValidationAlert.info(
        "Please complete all sentences before checking your answers.",
      );
      return;
    }
    const result = order.evaluate(),
      score = questions.filter((q) => result[q.id] === "correct").length,
      total = questions.length;
    completionRef.current = score === total;
    order.setMessage(
      "Score " + score + " out of " + total + ". Correct answers are locked.",
    );
    showCheckFeedback(
      rootRef.current,
      score === total ? "success" : score ? "warning" : "error",
      "Score: " + score + " / " + total,
    );
  };
  const handleShowAnswer = () => {
      drag.stop();
      order.show();
    },
    handleStartAgain = () => {
      drag.stop();
      order.reset();
    };
  const images = [img1, img2, img3, img4];
  const userAnswers = Object.fromEntries(
    questions.map((q) => [q.id, order.inputs[q.id].map((t) => t.value)]),
  );
  const isWrongSentence = (sentence) => order.results[sentence.id] === "wrong";
  const handleRemoveWord = (id, index) => {
    const item = order.inputs[id][index];
    if (!item) return;
    order.playSound(
      (order.locked(id) ? "answer-" : "bank-") + item.id,
      soundFor(item.value),
    );
    order.remove(id, item.id);
  };
  return (
    <DndContext
      sensors={sensors}
      onDragStart={drag.start}
      onDragEnd={drag.end}
      onDragCancel={drag.cancel}
    >
      <div className="main-container-component" ref={rootRef}>
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {message}
        </div>
        <div
          className="div-forall mb-10"
          style={{
            gap: "25px",
          }}
        >
          {" "}
          <ExerciseHeader
            isWorkbook
            sectionLetter="B"
            title="Look and write sentences."
            subTitle={
              "Read each clock, say the time aloud, then write the complete time sentence."
            }
          />
          <div className="grid grid-cols-2 gap-16 mb-8">
            {exerciseDataL.sentences.map((sentence, idx) => {
              return (
                <div key={sentence.id} className="space-y-4">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-xl text-blue-900 mb-4">
                      {idx + 1}
                    </span>

                    <img
                      src={images[idx]}
                      className="object-cover"
                      style={{
                        height: "130px",
                      }}
                      alt={
                        IMAGE_DESCRIPTIONS[images[idx]] ||
                        "Illustration for this exercise"
                      }
                    />
                  </div>

                  {/* WORD BANK */}
                  <div className="flex flex-wrap gap-3 min-h-14 p-2 rounded-lg bg-white">
                    {sentence.words.map((word, i) => {
                      return (
                        <DraggableWord
                          key={`bank-${sentence.id}-${i}`}
                          q={questions.find((q) => q.id === sentence.id)}
                          item={
                            order.tokens(
                              questions.find((q) => q.id === sentence.id),
                            )[i]
                          }
                          order={order}
                          drag={drag}
                        />
                      );
                    })}
                  </div>

                  {/* ANSWER */}
                  <div className="relative">
                    <DropZone
                      q={questions.find((q) => q.id === sentence.id)}
                      order={order}
                      drag={drag}
                    >
                      <div className="flex flex-wrap gap-2 mb-1">
                        {(userAnswers[sentence.id] || []).map((word, i) => (
                          <button
                            key={`answer-${word}-${i}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveWord(sentence.id, i);
                            }}
                            style={{
                              position: "relative",
                            }}
                            className={
                              focusClass +
                              " rounded-sm " +
                              "cursor-pointer hover:bg-red-50"
                            }
                            type="button"
                            aria-label={word + ". Return to bank."}
                            aria-disabled={order.locked(sentence.id)}
                            onKeyDown={(e) => {
                              e.stopPropagation();
                              if (["Delete", "Backspace"].includes(e.key)) {
                                e.preventDefault();
                                if (
                                  !e.repeat &&
                                  order.results[sentence.id] === "wrong"
                                )
                                  handleRemoveWord(sentence.id, i);
                              } else activate(e);
                            }}
                            onKeyUp={release}
                          >
                            {word}
                            {order.playingKey ===
                              "answer-" + order.inputs[sentence.id][i]?.id && (
                              <SpeakerBadge />
                            )}
                          </button>
                        ))}
                      </div>
                    </DropZone>

                    {isWrongSentence(sentence) && (
                      <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shadow-md border-2 border-white">
                        <span className="text-white text-sm font-bold leading-none">
                          ✕
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleStartAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
      <DragPreview
        drag={drag}
        className="WB-word-bank px-4 py-2 shadow-lg bg-white"
      >
        {
          questions.flatMap(order.tokens).find((t) => t.id === drag.active?.id)
            ?.value
        }
      </DragPreview>
    </DndContext>
  );
};
export default WB_Unit7_Page39_Q2;

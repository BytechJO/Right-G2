import { createPortal } from "react-dom";
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import React, { useState, useRef, useEffect } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 5/Ex G 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 5/Ex G 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 5/Ex G 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 5/Ex G 4.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import {
  DragDropContext,
  Droppable,
  Draggable,
  useMouseSensor,
  useTouchSensor,
} from "@hello-pangea/dnd";

import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 1/Page 5 - G/Item_001_she.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 1/Page 5 - G/Item_002_he.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 1/Page 5 - G/Item_003_She's.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 1/Page 5 - G/Item_004_He's.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 1/Page 5 - G/Item_005_Who's.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 1/Page 5 - G/Item_006_Stella.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 1/Page 5 - G/Item_007_Sarah.mp3";

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
    // offsetWidth rounds to whole pixels, which can enlarge the portalled text
    // just enough to wrap inside the library's exact (fractional) width.
    const cssWidth = parseFloat(computed.width);
    const borderBoxWidth = computed.boxSizing === 'border-box'
      ? cssWidth
      : cssWidth + ['paddingLeft', 'paddingRight', 'borderLeftWidth', 'borderRightWidth']
        .reduce((sum, key) => sum + (parseFloat(computed[key]) || 0), 0);
    const layoutWidth = Number.isFinite(borderBoxWidth) && borderBoxWidth > 0
      ? borderBoxWidth : node.offsetWidth;
    const scale = layoutWidth ? rect.width / layoutWidth : 1;
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
        ? {
          display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', opacity: 1, visibility: 'visible', zIndex: 2147483647, pointerEvents: 'none' }
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
  [img1]: "A girl with an orange headband wearing blue and pink.",
  [img2]: "A child with dark hair tied up, a blue top, and brown trousers.",
  [img3]: "A boy in a red top and blue trousers.",
  [img4]: "A boy in a purple top and brown trousers.",
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
// eslint-disable-next-line react-refresh/only-export-components -- Keep this control local.
const AudioText = ({
  children,
  audioKey,
  src,
  playSound,
  playingKey,
  className = "",
  style = {},
  tabIndex = 0,
}) => (
  <span
    role="button"
    tabIndex={tabIndex}
    aria-label={String(children) + ". Hear it."}
    className={className + " " + focusClass}
    onClick={() => playSound(audioKey, src)}
    onKeyDown={activate}
    onKeyUp={release}
    style={{
      // borderRadius: "8px",
      ...style,
      position: "relative",
      cursor: "pointer",
      ...(playingKey === audioKey
        ? { boxShadow: "0 0 0 3px #2563eb", backgroundColor: "#dbeafe" }
        : {}),
    }}
  >
    {children}
    {playingKey === audioKey && <SpeakerBadge />}
  </span>
);

function useWordPlacement({
  initialAnswers,
  correctAnswers,
  bank,
  sounds,
  limits = {},
  labels = {},
  missingMessage,
}) {
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

  const [values, setValues] = useState(initialAnswers),
    [results, setResults] = useState({}),
    [revealed, setRevealed] = useState(false),
    [picked, setPicked] = useState(null),
    [message, setMessage] = useState("");
  const { rootRef, playingKey, playSound, stopAudio } = useExerciseAudio();
  const bankRefs = useRef({}),
    slotRefs = useRef({}),
    focusFrame = useRef(null),
    suppressFocus = useRef(false);
  const slotIds = Object.keys(correctAnswers),
    locked = (id) => revealed || results[id] === "correct";
  const cancelFocus = () => {
    if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
    focusFrame.current = null;
  };
  const focus = (el) => {
    cancelFocus();
    focusFrame.current = requestAnimationFrame(() => {
      focusFrame.current = null;
      suppressFocus.current = true;
      try {
        el()?.focus();
      } finally {
        suppressFocus.current = false;
      }
    });
  };
  useEffect(
    () => () => {
      if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
    },
    [],
  );
  const used = (word, current = values) =>
    Object.entries(current).filter(
      ([id, v]) => v === word && results[id] !== "wrong",
    ).length >= (limits[word] || 1);
  const available = (word) => bank.includes(word) && !revealed && !used(word);
  const place = (id, word) => {
    if (!slotIds.includes(id) || locked(id) || !bank.includes(word)) return;
    if (
      Object.entries(values).filter(
        ([slot, v]) => slot !== id && v === word && locked(slot),
      ).length >= (limits[word] || 1)
    )
      return;
    const next = {
        ...values,
      },
      affected = [id];
    if ((limits[word] || 1) === 1) {
      for (const slot of slotIds)
        if (slot !== id && next[slot] === word && !locked(slot)) {
          next[slot] = "";
          affected.push(slot);
        }
    } else {
      const occupied = slotIds.filter(
        (slot) => slot !== id && next[slot] === word,
      );
      while (occupied.length >= limits[word]) {
        const prior = occupied.find((slot) => !locked(slot));
        if (!prior) return;
        next[prior] = "";
        affected.push(prior);
        occupied.splice(occupied.indexOf(prior), 1);
      }
    }
    next[id] = word;
    setValues(next);
    setResults((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(([slot]) => !affected.includes(slot)),
      ),
    );
    setPicked(null);
    setMessage((labels[word] || word) + " placed in the blank.");
    return next;
  };
  const remove = (id) => {
    if (locked(id) || !values[id]) return;
    setValues((prev) => ({
      ...prev,
      [id]: "",
    }));
    setResults((prev) => ({
      ...prev,
      [id]: null,
    }));
    setPicked(null);
    setMessage((labels[values[id]] || values[id]) + " returned to the bank.");
  };
  const cancel = () => {
    const old = picked;
    setPicked(null);
    setMessage("Selection cancelled.");
    if (old) focus(() => bankRefs.current[old]);
  };
  const wordLabel = (word) => labels[word] || word;
  const bankProps = (word) => ({
    "data-word-id": word,
    role: "button",
    tabIndex: picked ? -1 : 0,
    "aria-pressed": picked === word,
    "aria-disabled": !available(word),
    "aria-label":
      wordLabel(word) + ". Choose with Enter or Space, then place in a blank.",
    onClick: () => playSound("bank-" + word, sounds[word]),
    onFocus: (e) => {
      if (!suppressFocus.current && e.currentTarget.matches(":focus-visible"))
        playSound("bank-" + word, sounds[word]);
    },
    onKeyDown: (e) => {
      if (e.key === "Escape") {
        if (picked) {
          e.preventDefault();
          e.stopPropagation();
          cancel();
        }
        return;
      }
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      e.stopPropagation();
      if (e.repeat) return;
      playSound("bank-" + word, sounds[word]);
      if (!available(word)) return;
      const target =
        slotIds.find((id) => !locked(id) && !values[id]) ||
        slotIds.find((id) => !locked(id));
      if (!target) return;
      setPicked(word);
      setMessage(
        wordLabel(word) +
          " chosen. Press Enter or Space on a blank to place it.",
      );
      focus(() => slotRefs.current[target]);
    },
    onKeyUp: release,
  });
  const slotProps = (id, snapshot) => ({
    "data-slot-id": id,
    role: "button",
    tabIndex: 0,
    "aria-disabled": locked(id),
    "aria-label":
      "Blank " +
      (slotIds.indexOf(id) + 1) +
      ". " +
      (wordLabel(values[id]) || "Empty") +
      ". " +
      (locked(id)
        ? "Correct and locked."
        : results[id] === "wrong"
          ? "Incorrect, editable."
          : "Editable."),
    onClick: () => {
      if (locked(id)) {
        playSound("slot-" + id, sounds[values[id]]);
        return;
      }
      remove(id);
    },
    onKeyDown: (e) => {
      if (e.key === "Tab" && picked) {
        const editable = slotIds.filter((slot) => !locked(slot)),
          at = editable.indexOf(id),
          next = at + (e.shiftKey ? -1 : 1);
        if (next >= 0 && next < editable.length) {
          e.preventDefault();
          e.stopPropagation();
          focus(() => slotRefs.current[editable[next]]);
        }
        return;
      }
      if (e.key === "Escape" && picked) {
        e.preventDefault();
        e.stopPropagation();
        cancel();
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        e.stopPropagation();
        if (!e.repeat && results[id] === "wrong") remove(id);
        return;
      }
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      e.stopPropagation();
      if (e.repeat) return;
      if (locked(id)) {
        playSound("slot-" + id, sounds[values[id]]);
        return;
      }
      if (picked) {
        const word = picked,
          next = place(id, word);
        if (next)
          focus(
            () => bankRefs.current[bank.find((w) => !used(w, next)) || word],
          );
      } else remove(id);
    },
    onKeyUp: release,
    style: {
      position: "relative",
      borderRadius: 0,
      ...(results[id] === "correct" || revealed
        ? {
            borderBottomColor: "#16a34a",
            boxShadow: "inset 0 0px #16a34a",
          }
        : {}),
      ...(snapshot?.isDraggingOver && !locked(id)
        ? {
            outline: "3px dashed #2563eb",
            outlineOffset: 2,
            backgroundColor: "#dbeafe",
          }
        : {}),
    },
  });
  const check = (checkEvent) => {
    if (completedCheckRef.current) { completeCheck(checkEvent); return; }

    if (revealed) return;
    cancelFocus();
    setPicked(null);
    stopAudio();
    if (slotIds.some((id) => !values[id])) {
      ValidationAlert.info(missingMessage);
      setMessage(missingMessage);
      return;
    }
    const next = Object.fromEntries(
      slotIds.map((id) => [
        id,
        results[id] === "correct" || values[id] === correctAnswers[id]
          ? "correct"
          : "wrong",
      ]),
    );
    setResults(next);
    const score = Object.values(next).filter((x) => x === "correct").length,
      total = slotIds.length,
      msg = `Score: ${score} / ${total}`;
    setMessage(
      msg + ". Correct answers are locked; incorrect answers can be changed.",
    );
    if (score === total) (completeCheck(checkEvent), showCheckFeedback(rootRef.current, "success", msg));
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };
  const show = () => {
    cancelFocus();
    stopAudio();
    setPicked(null);
    setValues({
      ...correctAnswers,
    });
    setResults(Object.fromEntries(slotIds.map((id) => [id, "correct"])));
    setRevealed(true);
    setMessage("Correct answers shown and locked.");
  };
  const reset = () => {
    resetCompletedCheck();

    cancelFocus();
    stopAudio();
    setPicked(null);
    setValues({
      ...initialAnswers,
    });
    setResults({});
    setRevealed(false);
    setMessage("Exercise reset. All answers and results cleared.");
  };
  const dragStart = () => {
    cancelFocus();
    setPicked(null);
  };
  const bankStyle = (word) => ({
    position: "relative",
    ...(picked === word
      ? {
          outline: "4px solid #2563eb",
          outlineOffset: 2,
          backgroundColor: "#dbeafe",
        }
      : {}),
  });
  return {
    values,
    results,
    revealed,
    picked,
    message,
    rootRef,
    playingKey,
    playSound,
    stopAudio,
    bankRefs,
    slotRefs,
    locked,
    used,
    place,
    bankProps,
    slotProps,
    check,
    show,
    reset,
    dragStart,
    bankStyle,
  };
}

const WB_Unit1_Page5_Q2 = () => {
  const words = [
    { id: "she", text: "she" },
    { id: "he", text: "he" },
    { id: "shes", text: "She's" },
    { id: "hes", text: "He's" },
  ];
  const correctAnswers = {
    1: { q: "she", a: "She's" },
    2: { q: "she", a: "She's" },
    3: { q: "he", a: "He's" },
    4: { q: "he", a: "He's" },
  };
  const WORD_LIMITS = {
    she: 2,
    he: 2,
    "She's": 2,
    "He's": 2,
  };
  const data = [
    { id: 1, img: img1, name: "Stella." },
    { id: 2, img: img2, name: "Sarah." },
    { id: 3, img: img3, name: "John." },
    { id: 4, img: img4, name: "Jack." },
  ];
  const flatCorrect = Object.fromEntries(
    Object.entries(correctAnswers).flatMap(([id, row]) =>
      Object.entries(row).map(([field, value]) => [`${id}-${field}`, value]),
    ),
  );
  const interaction = useWordPlacement({
    initialAnswers: Object.fromEntries(
      Object.keys(flatCorrect).map((id) => [id, ""]),
    ),
    correctAnswers: flatCorrect,
    bank: words.map((w) => w.text),
    limits: WORD_LIMITS,
    sounds: { she: clip0, he: clip1, "She's": clip2, "He's": clip3 },
    missingMessage: "Please complete all answers first.",
  });
  const { rootRef, message, playingKey, playSound } = interaction;
  const userAnswers = Object.fromEntries(
    Object.keys(correctAnswers).map((id) => [
      id,
      { q: interaction.values[`${id}-q`], a: interaction.values[`${id}-a`] },
    ]),
  );
  const showAnswers = interaction.revealed;
  const checkAnswers = interaction.check,
    handleShowAnswer = interaction.show,
    handleStartAgain = interaction.reset;
  const onDragEnd = ({ destination, draggableId }) => {
    if (destination) interaction.place(destination.droppableId, draggableId);
  };
//...
  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onDragStart={interaction.dragStart}
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
        <div className="div-forall" style={{ gap: "20px" }}>
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
            sectionLetter="G"
            title={<>Look, read, and complete.</>}
            subTitle={
              "Look at the person first, choose he or she, then complete both parts of each family sentence."
            }
          />

          <div>
            <div className="flex justify-center">
              <Droppable droppableId="words" direction="horizontal" isDragDisabled={false}>
                {(provided, bankSnapshot) => <div ref={provided.innerRef} {...provided.droppableProps} style={{
    display: "flex",
    gap: "30px",
    padding: "10px",
    // border: "2px dashed #ccc",
    borderRadius: "10px",
    marginBottom: "30px",
    alignItems: "center",
    justifyContent: "center",
    width: "80%"
  }}>
                    {words.map((word, index) => {
      const isUsed = interaction.used(word.text);
      return <Draggable key={word.id} draggableId={word.text} index={index} isDragDisabled={showAnswers || isUsed}>
                          {(provided, snapshot) => <BankDragItem provided={provided} snapshot={snapshot} freeze={!!bankSnapshot.draggingFromThisWith} normalStyle={{
          background: isUsed ? "#ccc" : "white",
          opacity: isUsed ? 0.6 : 1,
          cursor: isUsed ? "not-allowed" : "grab",
          ...interaction.bankStyle(word.text)
        }}><div ref={el => {
            provided.innerRef(el);
            interaction.bankRefs.current[word.text] = el;
          }} {...provided.draggableProps} {...provided.dragHandleProps} {...interaction.bankProps(word.text)} className={`WB-word-bank ${focusClass}`}>
                                {word.text}
                                {playingKey === `bank-${word.text}` && <SpeakerBadge />}
                              </div></BankDragItem>}
                        </Draggable>;
    })}
                    {bankSnapshot.draggingFromThisWith ? <span aria-hidden="true" style={{
      display: "none"
    }}>{provided.placeholder}</span> : provided.placeholder}
                  </div>}
              </Droppable>
            </div>

            <div className="grid grid-cols-2 gap-x-20 gap-y-10 lg:ml-10">
              {data.map((item) => {
                const wrongQ =
                  interaction.results[`${item.id}-q`] === "wrong" &&
                  userAnswers[item.id].q &&
                  userAnswers[item.id].q.toLowerCase().trim() !==
                    correctAnswers[item.id].q.toLowerCase();

                const wrongA =
                  interaction.results[`${item.id}-a`] === "wrong" &&
                  userAnswers[item.id].a &&
                  userAnswers[item.id].a.toLowerCase().trim() !==
                    correctAnswers[item.id].a.toLowerCase();
                return (
                  <div
                    key={item.id}
                    className="flex flex-col items-center gap-6"
                  >
                    <div className="flex items-start gap-4 w-full justify-evenly ">
                      <span className="font-bold text-blue-900 text-2xl">
                        {item.id}
                      </span>
                      <img
                        src={item.img}
                        alt={IMAGE_DESCRIPTIONS[item.img] || ""}
                        style={{ height: "160px", width: "90px" }}
                      />
                    </div>

                    <div className="flex flex-col gap-4 w-[75%] text-xl text-gray-800">
                      <div className="flex items-center gap-2 relative">
                        <AudioText
                          tabIndex={interaction.picked ? -1 : 0}
                          audioKey={`who-${item.id}`}
                          src={clip4}
                          playSound={playSound}
                          playingKey={playingKey}
                        >
                          Who's
                        </AudioText>
                        <Droppable
                          droppableId={`${item.id}-q`}
                          isDropDisabled={interaction.locked(`${item.id}-q`)}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={(el) => {
                                provided.innerRef(el);
                                interaction.slotRefs.current[`${item.id}-q`] =
                                  el;
                              }}
                              {...provided.droppableProps}
                              {...interaction.slotProps(
                                `${item.id}-q`,
                                snapshot,
                              )}
                              className={`WB-unit1-p5-q2-input ${focusClass} ${
                                snapshot.isDraggingOver ? "drag-over-cell" : ""
                              }`}
                            >
                              {" "}
                              {wrongQ && (
                                <div className="wb-wrong-icon-unit1-page5-q2">
                                  ✕
                                </div>
                              )}
                              {userAnswers[item.id].q}
                              {playingKey === `slot-${item.id}-q` && (
                                <SpeakerBadge />
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                        <span>?</span>
                      </div>
                      <div className="flex items-center gap-2 relative">
                        <Droppable
                          droppableId={`${item.id}-a`}
                          isDropDisabled={interaction.locked(`${item.id}-a`)}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={(el) => {
                                provided.innerRef(el);
                                interaction.slotRefs.current[`${item.id}-a`] =
                                  el;
                              }}
                              {...provided.droppableProps}
                              {...interaction.slotProps(
                                `${item.id}-a`,
                                snapshot,
                              )}
                              className={`WB-unit1-p5-q2-input ${focusClass} ${
                                snapshot.isDraggingOver ? "drag-over-cell" : ""
                              }`}
                            >
                              {" "}
                              {wrongA && (
                                <div className="wb-wrong-icon-unit1-page5-q2">
                                  ✕
                                </div>
                              )}
                              {userAnswers[item.id].a}
                              {playingKey === `slot-${item.id}-a` && (
                                <SpeakerBadge />
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                        {[1, 2].includes(item.id) ? (
                          <AudioText
                            tabIndex={interaction.picked ? -1 : 0}
                            audioKey={`name-${item.id}`}
                            src={item.id === 1 ? clip5 : clip6}
                            playSound={playSound}
                            playingKey={playingKey}
                          >
                            {item.name}
                          </AudioText>
                        ) : (
                          <span>{item.name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-16 flex justify-center">
            <Button
              handleShowAnswer={handleShowAnswer}
              handleStartAgain={handleStartAgain}
              checkAnswers={checkAnswers}
            />
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default WB_Unit1_Page5_Q2;

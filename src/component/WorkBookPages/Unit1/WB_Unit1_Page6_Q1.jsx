import { createPortal } from "react-dom";
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import React, { useState, useRef, useEffect } from "react";
import img from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 6/Ex H 1.svg";

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
import clip0 from "../../../assets/audio/WorkBook/Unit 1/Page 6 - H/Item_001_Stella.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 1/Page 6 - H/Item_002_he_is.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 1/Page 6 - H/Item_003_is.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 1/Page 6 - H/Item_004_uncle.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 1/Page 6 - H/Item_005_she_is_stella's.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 1/Page 6 - H/Item_006_is_stella's.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 1/Page 6 - H/Item_007_she_is.mp3";
import clip7 from "../../../assets/audio/WorkBook/Unit 1/Page 6 - H/Item_008_sister.mp3";
import clip8 from "../../../assets/audio/WorkBook/Unit 1/Page 6 - H/Item_009_stella's_mother.mp3";
import clip9 from "../../../assets/audio/WorkBook/Unit 1/Page 6 - H/Item_010_is_John.mp3";
import clip10 from "../../../assets/audio/WorkBook/Unit 1/Page 6 - H/Item_011_He.mp3";
import clip11 from "../../../assets/audio/WorkBook/Unit 1/Page 6 - H/Item_012_Stella's.mp3";
import clip12 from "../../../assets/audio/WorkBook/Unit 1/Page 6 - H/Item_013_aunt.mp3";
import clip13 from "../../../assets/audio/WorkBook/Unit 1/Page 6 - H/Item_014_dad.mp3";

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
  [img]:
    "A family in a living room: two children use game controllers, two adults read, and three people sit on a pink sofa with a doll.",
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
      borderRadius: "8px",
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

const WB_Unit1_Page6_Q1 = () => {
  const words = [
    "Stella",
    "she is stella's",
    "stella's mother",
    "uncle",
    "he is",
    "is stella's",
    "sister",
    "is",
    "she is",
  ];
  const correctAnswers = {
    1: "Stella",
    2: "he is",
    3: "is",
    4: "uncle",
    5: "she is stella's",
    6: "is stella's",
    7: "she is",
    8: "sister",
    9: "stella's mother",
  };
  const flatCorrect = correctAnswers;
  const interaction = useWordPlacement({
    initialAnswers: Object.fromEntries(
      Object.keys(flatCorrect).map((id) => [id, ""]),
    ),
    correctAnswers: flatCorrect,
    bank: words,
    sounds: Object.fromEntries(
      words.map((word, i) => [
        word,
        [clip0, clip1, clip2, clip3, clip4, clip5, clip6, clip7, clip8][i],
      ]),
    ),
    missingMessage: "Please complete all answers first.",
  });
  const { rootRef, message, playingKey, playSound } = interaction;
  const userAnswers = interaction.values;
  const showAnswers = interaction.revealed;
  const checkAnswers = interaction.check,
    handleShowAnswer = interaction.show,
    handleStartAgain = interaction.reset;
  const onDragEnd = ({ destination, draggableId }) => {
    if (destination) interaction.place(destination.droppableId, draggableId);
  };
  const isWrongAnswer = (id) => interaction.results[id] === "wrong";

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
            sectionLetter="H"
            title={<>Look, read, and complete.</>}
            subTitle={
              "Use the numbered family picture first, then complete each sentence with the matching person or relationship."
            }
          />
          <div className="flex flex-col">
            <Droppable droppableId="words" direction="horizontal">
              {(provided, bankSnapshot) => <div ref={provided.innerRef} {...provided.droppableProps} style={{
    display: "flex",
    gap: "10px",
    padding: "10px",
    // border: "2px dashed #ccc",
    borderRadius: "10px",
    // margin: "10px 0",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap"
  }}>
                  {words.map((word, index) => {
      const isUsed = interaction.used(word);
      return <Draggable key={word} draggableId={word} index={index} isDragDisabled={showAnswers || isUsed} className="touch-none">
                        {(provided, snapshot) => <BankDragItem provided={provided} snapshot={snapshot} freeze={!!bankSnapshot.draggingFromThisWith} normalStyle={{
          background: isUsed ? "#ccc" : "white",
          opacity: isUsed ? 0.6 : 1,
          cursor: isUsed ? "not-allowed" : "grab",
          // fontSize: "17px",
          ...interaction.bankStyle(word)
        }}><div ref={el => {
            provided.innerRef(el);
            interaction.bankRefs.current[word] = el;
          }} {...provided.draggableProps} {...provided.dragHandleProps} {...interaction.bankProps(word)} className={`WB-word-bank ${focusClass}`}>
                              {word}
                              {playingKey === `bank-${word}` && <SpeakerBadge />}
                            </div></BankDragItem>}
                      </Draggable>;
    })}
                  {bankSnapshot.draggingFromThisWith ? <span aria-hidden="true" style={{
      display: "none"
    }}>{provided.placeholder}</span> : provided.placeholder}
                </div>}
            </Droppable>
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Family Image with Numbers */}
              <div className="relative overflow-hidden">
                <img
                  alt={IMAGE_DESCRIPTIONS[img] || ""}
                  src={img}
                  className="max-w-full max-h-87"
                />
                {/* Simplified representation of numbers on image */}
                <div className="absolute inset-0 pointer-events-none"></div>
              </div>

              {/* Sentences */}
              <div className="flex-1 bg-white border-2 border-gray-300 rounded-2xl p-6 space-y-4 text-xl">
                <div className="flex items-center gap-2">
                  <span>
                    1.{" "}
                    <AudioText
                      tabIndex={interaction.picked ? -1 : 0}
                      audioKey="she-is-1"
                      src={clip6}
                      playSound={playSound}
                      playingKey={playingKey}
                    >
                      She is
                    </AudioText>
                  </span>
                  <Droppable
                    droppableId="1"
                    isDropDisabled={interaction.locked("1")}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={(el) => {
                          provided.innerRef(el);
                          interaction.slotRefs.current["1"] = el;
                        }}
                        {...provided.droppableProps}
                        {...interaction.slotProps("1", snapshot)}
                        className={`relative ${focusClass} border-b-2 w-30 text-center min-h-[30px] ${
                          snapshot.isDraggingOver ? "bg-yellow-100" : ""
                        } ${isWrongAnswer(1) ? "border-red-500" : "border-gray-400"}`}
                        style={{
                          ...interaction.slotProps("1", snapshot).style,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {interaction.results["1"] === "wrong" &&
                          userAnswers[1] &&
                          userAnswers[1].toLowerCase().trim() !==
                            correctAnswers[1].toLowerCase() && (
                            <div className="wb-wrong-icon-unit1-page6-q1">
                              ✕
                            </div>
                          )}
                        {userAnswers[1]}
                        {playingKey === "slot-1" && <SpeakerBadge />}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  <span>.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>2.</span>
                  <Droppable
                    droppableId="2"
                    isDropDisabled={interaction.locked("2")}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={(el) => {
                          provided.innerRef(el);
                          interaction.slotRefs.current["2"] = el;
                        }}
                        {...provided.droppableProps}
                        {...interaction.slotProps("2", snapshot)}
                        className={`relative ${focusClass} border-b-2 w-30 text-center min-h-[30px] ${
                          snapshot.isDraggingOver ? "bg-yellow-100" : ""
                        } ${isWrongAnswer(2) ? "border-red-500" : "border-gray-400"}`}
                        style={{
                          ...interaction.slotProps("2", snapshot).style,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {interaction.results["2"] === "wrong" &&
                          userAnswers[2] &&
                          userAnswers[2].toLowerCase().trim() !==
                            correctAnswers[2].toLowerCase() && (
                            <div className="wb-wrong-icon-unit1-page6-q1">
                              ✕
                            </div>
                          )}
                        {userAnswers[2]}
                        {playingKey === "slot-2" && <SpeakerBadge />}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  <AudioText
                    tabIndex={interaction.picked ? -1 : 0}
                    audioKey="is John."
                    src={clip9}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    is John.
                  </AudioText>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex w-[50px]">
                    3.{" "}
                    <AudioText
                      tabIndex={interaction.picked ? -1 : 0}
                      audioKey="he-3"
                      src={clip10}
                      playSound={playSound}
                      playingKey={playingKey}
                    >
                      He
                    </AudioText>
                  </span>
                  <Droppable
                    droppableId="3"
                    isDropDisabled={interaction.locked("3")}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={(el) => {
                          provided.innerRef(el);
                          interaction.slotRefs.current["3"] = el;
                        }}
                        {...provided.droppableProps}
                        {...interaction.slotProps("3", snapshot)}
                        className={`relative ${focusClass} border-b-2 w-30 text-center min-h-[30px] ${
                          snapshot.isDraggingOver ? "bg-yellow-100" : ""
                        } ${isWrongAnswer(3) ? "border-red-500" : "border-gray-400"}`}
                        style={{
                          ...interaction.slotProps("3", snapshot).style,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {interaction.results["3"] === "wrong" &&
                          userAnswers[3] &&
                          userAnswers[3].toLowerCase().trim() !==
                            correctAnswers[3].toLowerCase() && (
                            <div className="wb-wrong-icon-unit1-page6-q1">
                              ✕
                            </div>
                          )}
                        {userAnswers[3]}
                        {playingKey === "slot-3" && <SpeakerBadge />}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  <AudioText
                    tabIndex={interaction.picked ? -1 : 0}
                    audioKey="Stella's"
                    src={clip11}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    Stella's
                  </AudioText>
                  <Droppable
                    droppableId="4"
                    isDropDisabled={interaction.locked("4")}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={(el) => {
                          provided.innerRef(el);
                          interaction.slotRefs.current["4"] = el;
                        }}
                        {...provided.droppableProps}
                        {...interaction.slotProps("4", snapshot)}
                        className={`relative ${focusClass} border-b-2 w-30 text-center min-h-[30px] ${
                          snapshot.isDraggingOver ? "bg-yellow-100" : ""
                        } ${isWrongAnswer(4) ? "border-red-500" : "border-gray-400"}`}
                        style={{
                          ...interaction.slotProps("4", snapshot).style,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {interaction.results["4"] === "wrong" &&
                          userAnswers[4] &&
                          userAnswers[4].toLowerCase().trim() !==
                            correctAnswers[4].toLowerCase() && (
                            <div className="wb-wrong-icon-unit1-page6-q1">
                              ✕
                            </div>
                          )}
                        {userAnswers[4]}
                        {playingKey === "slot-4" && <SpeakerBadge />}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
                <div className="flex items-center gap-2">
                  <span>4.</span>
                  <Droppable
                    droppableId="5"
                    isDropDisabled={interaction.locked("5")}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={(el) => {
                          provided.innerRef(el);
                          interaction.slotRefs.current["5"] = el;
                        }}
                        {...provided.droppableProps}
                        {...interaction.slotProps("5", snapshot)}
                        className={`relative ${focusClass} border-b-2 w-30 text-center min-h-[30px] ${
                          snapshot.isDraggingOver ? "bg-yellow-100" : ""
                        } ${isWrongAnswer(5) ? "border-red-500" : "border-gray-400"}`}
                        style={{
                          ...interaction.slotProps("5", snapshot).style,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {interaction.results["5"] === "wrong" &&
                          userAnswers[5] &&
                          userAnswers[5].toLowerCase().trim() !==
                            correctAnswers[5].toLowerCase() && (
                            <div className="wb-wrong-icon-unit1-page6-q1">
                              ✕
                            </div>
                          )}
                        {userAnswers[5]}
                        {playingKey === "slot-5" && <SpeakerBadge />}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  <AudioText
                    tabIndex={interaction.picked ? -1 : 0}
                    audioKey="aunt."
                    src={clip12}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    aunt.
                  </AudioText>
                </div>
                <div className="flex items-center gap-2">
                  <span>
                    5.{" "}
                    <AudioText
                      tabIndex={interaction.picked ? -1 : 0}
                      audioKey="he-5"
                      src={clip10}
                      playSound={playSound}
                      playingKey={playingKey}
                    >
                      He
                    </AudioText>
                  </span>
                  <Droppable
                    droppableId="6"
                    isDropDisabled={interaction.locked("6")}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={(el) => {
                          provided.innerRef(el);
                          interaction.slotRefs.current["6"] = el;
                        }}
                        {...provided.droppableProps}
                        {...interaction.slotProps("6", snapshot)}
                        className={`relative ${focusClass} border-b-2 w-30 text-center min-h-[30px] ${
                          snapshot.isDraggingOver ? "bg-yellow-100" : ""
                        } ${isWrongAnswer(6) ? "border-red-500" : "border-gray-400"}`}
                        style={{
                          ...interaction.slotProps("6", snapshot).style,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {interaction.results["6"] === "wrong" &&
                          userAnswers[6] &&
                          userAnswers[6].toLowerCase().trim() !==
                            correctAnswers[6].toLowerCase() && (
                            <div className="wb-wrong-icon-unit1-page6-q1">
                              ✕
                            </div>
                          )}
                        {userAnswers[6]}
                        {playingKey === "slot-6" && <SpeakerBadge />}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  <AudioText
                    tabIndex={interaction.picked ? -1 : 0}
                    audioKey="dad."
                    src={clip13}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    dad.
                  </AudioText>
                </div>
                <div className="flex items-center gap-2  relative">
                  <span>6.</span>
                  <Droppable
                    droppableId="7"
                    isDropDisabled={interaction.locked("7")}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={(el) => {
                          provided.innerRef(el);
                          interaction.slotRefs.current["7"] = el;
                        }}
                        {...provided.droppableProps}
                        {...interaction.slotProps("7", snapshot)}
                        className={`relative ${focusClass} border-b-2 w-30 text-center min-h-[30px] ${
                          snapshot.isDraggingOver ? "bg-yellow-100" : ""
                        } ${isWrongAnswer(7) ? "border-red-500" : "border-gray-400"}`}
                        style={{
                          ...interaction.slotProps("7", snapshot).style,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {interaction.results["7"] === "wrong" &&
                          userAnswers[7] &&
                          userAnswers[7].toLowerCase().trim() !==
                            correctAnswers[7].toLowerCase() && (
                            <div className="wb-wrong-icon-unit1-page6-q1">
                              ✕
                            </div>
                          )}
                        {userAnswers[7]}
                        {playingKey === "slot-7" && <SpeakerBadge />}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  <AudioText
                    tabIndex={interaction.picked ? -1 : 0}
                    audioKey="Stella's."
                    src={clip11}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    Stella's.
                  </AudioText>
                  <Droppable
                    droppableId="8"
                    isDropDisabled={interaction.locked("8")}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={(el) => {
                          provided.innerRef(el);
                          interaction.slotRefs.current["8"] = el;
                        }}
                        {...provided.droppableProps}
                        {...interaction.slotProps("8", snapshot)}
                        className={`relative ${focusClass} border-b-2 w-30 text-center min-h-[30px] ${
                          snapshot.isDraggingOver ? "bg-yellow-100" : ""
                        } ${isWrongAnswer(8) ? "border-red-500" : "border-gray-400"}`}
                        style={{
                          ...interaction.slotProps("8", snapshot).style,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {interaction.results["8"] === "wrong" &&
                          userAnswers[8] &&
                          userAnswers[8].toLowerCase().trim() !==
                            correctAnswers[8].toLowerCase() && (
                            <div className="wb-wrong-icon-unit1-page6-q1">
                              ✕
                            </div>
                          )}
                        {userAnswers[8]}
                        {playingKey === "slot-8" && <SpeakerBadge />}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
                <div className="flex items-center gap-2 relative">
                  <span>
                    7.{" "}
                    <AudioText
                      tabIndex={interaction.picked ? -1 : 0}
                      audioKey="she-is-7"
                      src={clip6}
                      playSound={playSound}
                      playingKey={playingKey}
                    >
                      She is
                    </AudioText>
                  </span>
                  <Droppable
                    droppableId="9"
                    isDropDisabled={interaction.locked("9")}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={(el) => {
                          provided.innerRef(el);
                          interaction.slotRefs.current["9"] = el;
                        }}
                        {...provided.droppableProps}
                        {...interaction.slotProps("9", snapshot)}
                        className={`relative ${focusClass} border-b-2 w-30 text-center min-h-[30px] ${
                          snapshot.isDraggingOver ? "bg-yellow-100" : ""
                        } ${isWrongAnswer(9) ? "border-red-500" : "border-gray-400"}`}
                        style={{
                          ...interaction.slotProps("9", snapshot).style,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {interaction.results["9"] === "wrong" &&
                          userAnswers[9] &&
                          userAnswers[9].toLowerCase().trim() !==
                            correctAnswers[9].toLowerCase() && (
                            <div className="wb-wrong-icon-unit1-page6-q1">
                              ✕
                            </div>
                          )}
                        {userAnswers[9]}
                        {playingKey === "slot-9" && <SpeakerBadge />}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  <span>.</span>
                </div>
              </div>
            </div>
          </div>
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleStartAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </DragDropContext>
  );
};

export default WB_Unit1_Page6_Q1;

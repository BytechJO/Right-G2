import { createPortal } from "react-dom";
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit1_Page4_Q2.css";

import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex D 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex D 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex D 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex D 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex D 5.svg";

import {
  DragDropContext,
  Droppable,
  Draggable,
  useMouseSensor,
  useTouchSensor,
} from "@hello-pangea/dnd";

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

const WORD_BANK = ["sister", "mother", "play", "brother", "father"];

const data = [
  {
    parts: [
      {
        before: "She’s my",
        middleImg: img1,
        blank: 1,
        after: ".",
      },
      {
        before: "He’s my",
        middleImg: img2,
        blank: 2,
        after: "I want no other.",
      },
    ],
    correct: ["mother", "father"],
  },
  {
    parts: [
      {
        before: "This is my",
        middleImg: img3,
        blank: 1,
        after: "and",
      },
      {
        before: "my",
        middleImg: img4,
        blank: 2,
        after: "who like to",
      },
      {
        before: " ",
        middleImg: img5,
        blank: 3,
        after: ".",
      },
    ],
    correct: ["sister", "brother", "play"],
  },
];

import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 1/Page 4 - D/Item_001_mother.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 1/Page 4 - D/Item_002_father.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 1/Page 4 - D/Item_003_sister.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 1/Page 4 - D/Item_004_brother.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 1/Page 4 - D/Item_005_play.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 1/Page 4 - D/Item_006_She's_my.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 1/Page 4 - D/Item_007_He's_my.mp3";
import clip7 from "../../../assets/audio/WorkBook/Unit 1/Page 4 - D/Item_008_I_want_no_other.mp3";
import clip8 from "../../../assets/audio/WorkBook/Unit 1/Page 4 - D/Item_009_This_is_my.mp3";
import clip9 from "../../../assets/audio/WorkBook/Unit 1/Page 4 - D/Item_010_and.mp3";
import clip10 from "../../../assets/audio/WorkBook/Unit 1/Page 4 - D/Item_011_my.mp3";
import clip11 from "../../../assets/audio/WorkBook/Unit 1/Page 4 - D/Item_012_who_like_to.mp3";

// Keep the score dialog's return focus on an enabled action in this exercise.
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
  [img2]: "A man in a blue shirt and vest.",
  [img3]: "A child with dark hair tied up and a blue top.",
  [img4]: "A boy in a red top.",
  [img5]: "Two children kneeling with a doll and a teddy bear.",
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
  //...
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

const WB_Unit1_Page4_Q2 = () => {
  const correctAnswers = Object.fromEntries(
    data.flatMap((d, qi) =>
      d.correct.map((word, bi) => [`slot-${qi}-${bi}`, word]),
    ),
  );
  const interaction = useWordPlacement({
    initialAnswers: Object.fromEntries(
      Object.keys(correctAnswers).map((id) => [id, ""]),
    ),
    correctAnswers,
    bank: WORD_BANK,
    sounds: {
      mother: clip0,
      father: clip1,
      sister: clip2,
      brother: clip3,
      play: clip4,
    },
    missingMessage: "Please fill in all blanks before checking!",
  });
  const { rootRef, message, playingKey, playSound } = interaction;
  const answers = data.map((d, qi) =>
    d.correct.map((_, bi) => interaction.values[`slot-${qi}-${bi}`]),
  );
  const wrongInputs = Object.keys(interaction.results)
      .filter((id) => interaction.results[id] === "wrong")
      .map((id) => id.replace("slot-", "")),
    locked = interaction.revealed;
  const checkAnswers = interaction.check,
    showAnswer = interaction.show;
  const onDragEnd = ({ destination, draggableId }) => {
    if (destination)
      interaction.place(
        destination.droppableId,
        draggableId.replace("letter-", ""),
      );
  };
  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onDragStart={interaction.dragStart}
      enableDefaultSensors={false}
      sensors={[useMouseSensor, useTouchSensor]}
    >
      <div ref={rootRef} className="page8-wrapper">
        <div className="div-forall">
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
            sectionLetter="D"
            title={<>Look and complete. Read.</>}
            subTitle={
              "Read the whole family rhyme first, then use the pictures and word bank to fill each blank."
            }
          />

          <div>
            <Droppable droppableId="letters" isDropDisabled>
              {(provided, bankSnapshot) => <div ref={provided.innerRef} {...provided.droppableProps} style={{
    display: "flex",
    gap: "30px",
    padding: "10px",
    // border: "2px dashed #ccc",
    borderRadius: "10px",
    marginBottom: "10px",
    alignItems: "center",
    width: "100%",
    justifyContent: "center"
  }}>
                  {WORD_BANK.map((l, i) => {
      const isUsed = interaction.used(l);
      return <Draggable key={l} draggableId={`letter-${l}`} index={i} isDragDisabled={locked || isUsed}>
                          {(provided, snapshot) => <BankDragItem provided={provided} snapshot={snapshot} freeze={!!bankSnapshot.draggingFromThisWith} normalStyle={{
          background: isUsed ? "#ccc" : "white",
          opacity: isUsed ? 0.6 : 1,
          cursor: isUsed ? "not-allowed" : "grab",
          ...interaction.bankStyle(l)
        }}><span ref={el => {
            provided.innerRef(el);
            interaction.bankRefs.current[l] = el;
          }} {...provided.draggableProps} {...provided.dragHandleProps} {...interaction.bankProps(l)} className={`WB-word-bank ${focusClass}`}>
                              {l}
                              {playingKey === `bank-${l}` && <SpeakerBadge />}
                            </span></BankDragItem>}
                        </Draggable>;
    })}
                  {bankSnapshot.draggingFromThisWith ? <span aria-hidden="true" style={{
      display: "none"
    }}>{provided.placeholder}</span> : provided.placeholder}
                </div>}
            </Droppable>

            {data.map((item, qIndex) => (
              <div className="row-missing" key={qIndex}>
                <div className="sentence-wb-unit1-page4-q2">
                  <span className="num">{qIndex + 1}.</span>
                  {item.parts.map((p, blankIndex) => (
                    <span key={blankIndex} className="sentence-part">
                      {p.before.trim() ? (
                        <AudioText
                          tabIndex={interaction.picked ? -1 : 0}
                          audioKey={`before-${qIndex}-${blankIndex}`}
                          src={
                            {
                              "She’s my": clip5,
                              "He’s my": clip6,
                              "This is my": clip8,
                              my: clip10,
                            }[p.before]
                          }
                          playSound={playSound}
                          playingKey={playingKey}
                        >
                          {p.before}
                        </AudioText>
                      ) : (
                        p.before
                      )}

                      <div className={`input-wrapper-review4-p2-q1`}>
                        <Droppable
                          droppableId={`slot-${qIndex}-${blankIndex}`}
                          isDropDisabled={interaction.locked(
                            `slot-${qIndex}-${blankIndex}`,
                          )}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={(el) => {
                                provided.innerRef(el);
                                interaction.slotRefs.current[
                                  `slot-${qIndex}-${blankIndex}`
                                ] = el;
                              }}
                              {...provided.droppableProps}
                              {...interaction.slotProps(
                                `slot-${qIndex}-${blankIndex}`,
                                snapshot,
                              )}
                              className={`missing-input-review4-p2-q1 ${focusClass} ${
                                snapshot.isDraggingOver ? "drag-over-cell" : ""
                              }`}
                            >
                              {answers[qIndex][blankIndex] && (
                                <Draggable
                                  draggableId={`filled-${answers[qIndex][blankIndex]}`}
                                  index={0}
                                  isDragDisabled={true}
                                >
                                  {(provided) => (
                                    <span
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      {answers[qIndex][blankIndex]}
                                    </span>
                                  )}
                                </Draggable>
                              )}
                              {playingKey ===
                                `slot-slot-${qIndex}-${blankIndex}` && (
                                <SpeakerBadge />
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>

                        {wrongInputs.includes(`${qIndex}-${blankIndex}`) && (
                          <span className="wrong-icon-review4-p2-q1">✕</span>
                        )}
                      </div>

                      {["I want no other.", "and", "who like to"].includes(
                        p.after,
                      ) ? (
                        <AudioText
                          tabIndex={interaction.picked ? -1 : 0}
                          audioKey={`after-${qIndex}-${blankIndex}`}
                          src={
                            {
                              "I want no other.": clip7,
                              and: clip9,
                              "who like to": clip11,
                            }[p.after]
                          }
                          playSound={playSound}
                          playingKey={playingKey}
                        >
                          {p.after}
                        </AudioText>
                      ) : (
                        p.after
                      )}
                      <img
                        src={p.middleImg}
                        className="middle-img"
                        alt={IMAGE_DESCRIPTIONS[p.middleImg] || ""}
                      />
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="action-buttons-container">
          <button className="try-again-button" onClick={interaction.reset}>
            Start Again ↻
          </button>

          {/* ⭐⭐⭐ NEW BUTTON */}
          <button
            onClick={showAnswer}
            className="show-answer-btn swal-continue"
          >
            Show Answer
          </button>

          <button className="check-button2" onClick={checkAnswers}>
            Check Answers ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default WB_Unit1_Page4_Q2;

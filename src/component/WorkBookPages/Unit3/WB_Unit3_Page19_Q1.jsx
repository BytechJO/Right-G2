import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import sound0 from "../../../assets/audio/WorkBook/Unit 3/Page 19 - I/Item_001_Can_it_fly.mp3";
import sound1 from "../../../assets/audio/WorkBook/Unit 3/Page 19 - I/Item_002_Can_they_run.mp3";
import sound2 from "../../../assets/audio/WorkBook/Unit 3/Page 19 - I/Item_003_Can_they_walk.mp3";
import sound3 from "../../../assets/audio/WorkBook/Unit 3/Page 19 - I/Item_004_Can_it_swim.mp3";
import sound4 from "../../../assets/audio/WorkBook/Unit 3/Page 19 - I/Item_005_No,_it_can't.mp3";
import sound5 from "../../../assets/audio/WorkBook/Unit 3/Page 19 - I/Item_006_Yes,_they_can.mp3";
import sound6 from "../../../assets/audio/WorkBook/Unit 3/Page 19 - I/Item_007_No,_they_can't.mp3";
import sound7 from "../../../assets/audio/WorkBook/Unit 3/Page 19 - I/Item_008_Yes,_it_can.mp3";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  DragDropContext,
  Droppable,
  Draggable,
  useMouseSensor,
  useTouchSensor,
} from "@hello-pangea/dnd";
import "./WB_Unit3_Page19_Q1.css";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Ex I 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Ex I 3.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Ex I 2.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Ex I 4.svg";

// Keep the score dialog's return focus on an enabled action in this exercise.
// eslint-disable-next-line react-refresh/only-export-components -- Exercise-local drag presentation.
function BankDragItem({ provided, snapshot, freeze, normalStyle, children, preserveSpace = true }) {
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
          // The bank makes this span a flex item; retain its single-line text
          // alignment when the actual draggable is moved into the portal.
          display: 'flex', alignItems: 'center', whiteSpace: 'nowrap',
          opacity: 1, visibility: 'visible', zIndex: 2147483647, pointerEvents: 'none',
        }
        : freeze ? { transform: 'none', transition: 'none' } : {}),
    },
  });
  if (!snapshot.isDragging) return element;
  if (!preserveSpace) return createPortal(element, document.fullscreenElement || document.body);
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


const fillInQuestions = [
  {
    id: "i1",
    img: img1,
    endText: "fly?",
    answer: "No, it can't.",
    correctAnswer: "Can it",
  },
  {
    id: "i2",
    img: img2,
    endText: "run?",
    answer: "Yes, they can.",
    correctAnswer: "Can they",
  },
  {
    id: "i3",
    img: img3,
    endText: "walk?",
    answer: "No, they can't.",
    correctAnswer: "Can they",
  },
  {
    id: "i4",
    img: img4,
    endText: "swim?",
    answer: "Yes, it can.",
    correctAnswer: "Can it",
  },
];
const initialWords = {
  wordBank: [
    {
      id: "w1",
      text: "Can it",
      disabled: false,
    },
    {
      id: "w2",
      text: "Can they",
      disabled: false,
    },
    {
      id: "w3",
      text: "Can they",
      disabled: false,
    },
    {
      id: "w4",
      text: "Can it",
      disabled: false,
    },
  ],
  i1: [],
  i2: [],
  i3: [],
  i4: [],
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
  label,
  src,
  playSound,
  playingKey,
  className = "",
  style = {},
  tabIndex = 0,
}) => {
  if (!src)
    return (
      <span className={className} style={style}>
        {children}
      </span>
    );
  return (
    <span
      role="button"
      tabIndex={tabIndex}
      aria-label={label || String(children) + ". Hear it."}
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
          ? {
              boxShadow: "0 0 0 3px #2563eb",
              backgroundColor: "#dbeafe",
            }
          : {}),
      }}
    >
      {children}
      {playingKey === audioKey && <SpeakerBadge />}
    </span>
  );
};
const SOUNDS = {
  "can it fly": sound0,
  "can they run": sound1,
  "can they walk": sound2,
  "can it swim": sound3,
  "no, it can't": sound4,
  "yes, they can": sound5,
  "no, they can't": sound6,
  "yes, it can": sound7,
};
const IMAGE_DESCRIPTIONS = {
  [img1]: "A green snake.",
  [img2]: "A boy and a girl running.",
  [img3]: "Two children sitting in a stroller.",
  [img4]: "A hippopotamus in water.",
};
function useCheckButton(rootRef, checkDisabled) {
  useEffect(() => {
    const button = rootRef.current?.querySelector(".check-button2");
    if (!button) return;
    button.disabled = checkDisabled;
    button.style.cursor = checkDisabled ? "not-allowed" : "";
    button.setAttribute("aria-disabled", String(checkDisabled));
  }, [rootRef, checkDisabled]);
}
function useWordPlacement({
  initialAnswers,
  correctAnswers,
  bank,
  sounds,
  limits = {},
  labels = {},
  missingMessage,
  allowed = () => true,
  scoreGroups = null,
}) {
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
  const complete = slotIds.every((id) => results[id] === "correct");
  useCheckButton(rootRef, revealed || complete);
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
    if (
      !slotIds.includes(id) ||
      locked(id) ||
      !bank.includes(word) ||
      !allowed(id, word)
    )
      return;
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
        slotIds.find((id) => !locked(id) && allowed(id, word) && !values[id]) ||
        slotIds.find((id) => !locked(id) && allowed(id, word));
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
    tabIndex: picked && (locked(id) || !allowed(id, picked)) ? -1 : 0,
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
        const editable = slotIds.filter(
            (slot) => !locked(slot) && allowed(slot, picked),
          ),
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
  const check = () => {
    if (revealed || complete) return;
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
        results[id] === "correct" ||
        (labels[values[id]] || values[id]) ===
          (labels[correctAnswers[id]] || correctAnswers[id])
          ? "correct"
          : "wrong",
      ]),
    );
    setResults(next);
    const groups = scoreGroups || slotIds.map((id) => [id]);
    const score = groups.filter((ids) =>
        ids.every((id) => next[id] === "correct"),
      ).length,
      total = groups.length,
      msg = `Score: ${score} / ${total}`;
    setMessage(
      msg + ". Correct answers are locked; incorrect answers can be changed.",
    );
    if (score === total) showCheckFeedback(rootRef.current, "success", msg);
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
    borderRadius: 8,
    ...(picked === word
      ? {
          outline: "4px solid #2563eb",
          outlineOffset: 2,
          backgroundColor: "#dbeafe",
        }
      : {}),
  });
  const move = (source, target) => {
    if (
      locked(source) ||
      locked(target) ||
      !values[source] ||
      !slotIds.includes(target)
    )
      return;
    setValues({
      ...values,
      [source]: values[target] || "",
      [target]: values[source],
    });
    setResults((p) => ({
      ...p,
      [source]: null,
      [target]: null,
    }));
    setPicked(null);
  };
  return {
    move,
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
const WB_Unit3_Page19_Q1 = () => {
  const labels = Object.fromEntries(
    initialWords.wordBank.map((w) => [w.id, w.text]),
  );
  const bankOrder = ["w3", "w1", "w4", "w2"];
  const interaction = useWordPlacement({
    initialAnswers: {},
    correctAnswers: Object.fromEntries(
      fillInQuestions.map((q, i) => [q.id, initialWords.wordBank[i].id]),
    ),
    bank: bankOrder,
    labels,
    sounds: Object.fromEntries(
      initialWords.wordBank.map((w) => [
        w.id,
        SOUNDS[w.text.slice(0, -1).toLowerCase()],
      ]),
    ),
    missingMessage: "Please complete all answers first.",
  });
  const { rootRef, message, playSound, playingKey } = interaction;
  const items = {
    wordBank: bankOrder.map((id) =>
      initialWords.wordBank.find((w) => w.id === id),
    ),
    ...Object.fromEntries(
      fillInQuestions.map((q) => [
        q.id,
        interaction.values[q.id]
          ? [
              {
                id: interaction.values[q.id],
                text: labels[interaction.values[q.id]],
              },
            ]
          : [],
      ]),
    ),
  };
  const showResults =
    interaction.revealed ||
    fillInQuestions.every((q) => interaction.locked(q.id));
  const isWrong = (id) => interaction.results[id] === "wrong";
  const handleShowAnswer = interaction.show,
    handleStartAgain = interaction.reset,
    checkAnswers = interaction.check;
  const onDragEnd = ({ source, destination, draggableId }) => {
    if (!destination) return;
    if (
      source.droppableId !== "wordBank" &&
      interaction.locked(source.droppableId)
    )
      return;
    const word = draggableId.split("-")[0];
    if (destination.droppableId === "wordBank") {
      if (source.droppableId !== "wordBank")
        interaction.slotProps(source.droppableId).onClick();
      return;
    }
    interaction.place(destination.droppableId, word);
  };
  return (
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
        className="div-forall"
        style={{
          gap: "25px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="I"
          title={<> Look, read, and drag the correct word.</>}
          subTitle={"Check whether the picture shows one thing or more than one, then drag Can it or Can they."}
        />

        <DragDropContext
          enableDefaultSensors={false}
          sensors={[useMouseSensor, useTouchSensor]}
          onDragEnd={onDragEnd}
          onBeforeDragStart={interaction.dragStart}
        >
          {/* Word Bank */}
          <div className="p-2 rounded-xl min-h-[42px]">
            <Droppable droppableId="wordBank" direction="horizontal">
              {(provided, bankSnapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-wrap justify-center gap-10"
                >
                  {items.wordBank.map((word, index) => {
                    const isUsed = interaction.used(word.id);
                    return (
                      <Draggable
                        key={word.id}
                        draggableId={`${word.id}-${index}`}
                        index={index}
                        isDragDisabled={isUsed || showResults}
                      >
                        {(provided, snapshot) => {
                          const tile = (
                            <div
                              ref={(el) => {
                                provided.innerRef(el);
                                interaction.bankRefs.current[word.id] = el;
                              }}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              {...interaction.bankProps(word.id)}
                              style={{...interaction.bankStyle(word.id)}}
                              className={`${focusClass} WB-word-bank
  ${isUsed ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60 border border-blue-800" : "bg-white text-gray-800 cursor-grab border border-blue-800 hover:bg-gray-50"}`}
                            >
                              {word.text}
                              {playingKey === "bank-" + word.id && (
                                <SpeakerBadge />
                              )}
                            </div>
                          );
                          return <BankDragItem provided={provided} snapshot={snapshot} normalStyle={tile.props.style} freeze={!!bankSnapshot.draggingFromThisWith}>{tile}</BankDragItem>;
                        }}
                      </Draggable>
                    );
                  })}
                  {bankSnapshot.draggingFromThisWith ? <span aria-hidden="true" style={{ display: "none" }}>{provided.placeholder}</span> : provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fillInQuestions.map((q, index) => (
              <div key={q.id} className="relative">
                <div className="flex items-center gap-4">
                  <div className="flex gap-5">
                    <span className="font-bold text-blue-900 text-xl">
                      {index + 1}
                    </span>

                    <img
                      src={q.img}
                      alt={IMAGE_DESCRIPTIONS[q.img]}
                      style={{
                        height: "120px",
                        width: "120px",
                      }}
                    />
                  </div>
                  <Droppable
                    droppableId={q.id}
                    isDropDisabled={interaction.locked(q.id)}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={(el) => {
                          provided.innerRef(el);
                          interaction.slotRefs.current[q.id] = el;
                        }}
                        {...provided.droppableProps}
                        {...interaction.slotProps(q.id, snapshot)}
                        className={`${focusClass} 
        min-w-[90px] min-h-[42px] border-b-2 flex items-center justify-center 
        transition-all duration-200
        ${snapshot.isDraggingOver && !interaction.locked(q.id) ? "bg-blue-100 border-dashed border-blue-400" : isWrong(q.id) ? "border-red-500" : "border-gray-400"}
      `}
                      >
                        {items[q.id].map((word, i) => (
                          <Draggable
                            key={word.id}
                            draggableId={word.id}
                            index={i}
                            isDragDisabled={true}
                          >
                            {(provided, snapshot) => {
                              const tile = (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  tabIndex={-1}
                                  style={{
                                    ...provided.draggableProps.style,
                                    ...(snapshot.isDragging
                                      ? {
                                          zIndex: 2147483647,
                                        }
                                      : {}),
                                  }}
                                  className="px-3 py-1 rounded text-[20px]"
                                >
                                  {word.text}
                                </div>
                              );
                              return snapshot.isDragging
                                ? createPortal(
                                    tile,
                                    document.fullscreenElement || document.body,
                                  )
                                : tile;
                            }}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {playingKey === "slot-" + q.id && <SpeakerBadge />}
                      </div>
                    )}
                  </Droppable>
                  {isWrong(q.id) && (
                    <div className="absolute top-3 right-43 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold shadow-lg border-2 border-white">
                      ✕
                    </div>
                  )}
                  <AudioText
                    tabIndex={interaction.picked ? -1 : 0}
                    audioKey={"question-" + q.id}
                    src={
                      SOUNDS[
                        (q.correctAnswer + " " + q.endText)
                          .slice(0, -1)
                          .toLowerCase()
                      ]
                    }
                    playSound={playSound}
                    playingKey={playingKey}
                    label={
                      "Hear question: " + q.correctAnswer + " " + q.endText
                    }
                    className="text-[20px]"
                  >
                    {q.endText}
                  </AudioText>
                </div>

                <p className="ml-12 text-gray-600 text-[20px]">
                  <AudioText
                    tabIndex={interaction.picked ? -1 : 0}
                    audioKey={"answer-" + q.id}
                    src={SOUNDS[q.answer.slice(0, -1).toLowerCase()]}
                    playSound={playSound}
                    playingKey={playingKey}
                    className=""
                  >
                    {q.answer}
                  </AudioText>
                </p>
              </div>
            ))}
          </div>
        </DragDropContext>

        <Button
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={handleStartAgain}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
};
export default WB_Unit3_Page19_Q1;

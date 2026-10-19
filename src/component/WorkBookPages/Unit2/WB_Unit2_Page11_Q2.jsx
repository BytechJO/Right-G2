import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import sound0 from "../../../assets/audio/WorkBook/Unit 2/Page 11 - F/Item_001_birds.mp3";
import sound1 from "../../../assets/audio/WorkBook/Unit 2/Page 11 - F/Item_002_clock.mp3";
import sound2 from "../../../assets/audio/WorkBook/Unit 2/Page 11 - F/Item_003_clouds.mp3";
import sound3 from "../../../assets/audio/WorkBook/Unit 2/Page 11 - F/Item_004_ducks.mp3";
import sound4 from "../../../assets/audio/WorkBook/Unit 2/Page 11 - F/Item_005_apples.mp3";
import sound5 from "../../../assets/audio/WorkBook/Unit 2/Page 11 - F/Item_006_Those_are.mp3";
import sound6 from "../../../assets/audio/WorkBook/Unit 2/Page 11 - F/Item_007_in_the_tree.mp3";
import sound7 from "../../../assets/audio/WorkBook/Unit 2/Page 11 - F/Item_008_in_the_sky.mp3";
import sound8 from "../../../assets/audio/WorkBook/Unit 2/Page 11 - F/Item_009_in_the_pond.mp3";
import sound9 from "../../../assets/audio/WorkBook/Unit 2/Page 11 - F/Item_010_That_is_a.mp3";
import { createPortal } from "react-dom";
import React, { useState, useRef, useEffect } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 11/Ex F 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 11/Ex F 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 11/Ex F 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 11/Ex F 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 11/Asset 1.svg";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import {
  DragDropContext,
  Droppable,
  Draggable,
  useMouseSensor,
  useTouchSensor,
} from "@hello-pangea/dnd";

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



const initialWords = [
  { id: "birds", text: "birds", isUsed: false },
  { id: "clock", text: "clock", isUsed: false },
  { id: "clouds", text: "clouds", isUsed: false },
  { id: "ducks", text: "ducks", isUsed: false },
  { id: "apples", text: "apples", isUsed: false },
];

const correctAnswers = {
  sentence1: "apples",
  sentence2: "birds",
  sentence3: "ducks",
  sentence4: "clock",
  sentence5: "clouds",
};

const sentenceData = [
  {
    id: "sentence1",
    textBefore: "Those are",
    textAfter: "in the tree.",
    img: img1,
  },
  {
    id: "sentence2",
    textBefore: "Those are",
    textAfter: "in the sky.",
    img: img2,
  },
  {
    id: "sentence3",
    textBefore: "Those are",
    textAfter: "in the pond.",
    img: img3,
  },
  { id: "sentence4", textBefore: "That is a", textAfter: ".", img: img5 },
  { id: "sentence5", textBefore: "Those are dark", textAfter: ".", img: img4 },
];

const IMAGE_DESCRIPTIONS = {
  [img1]: "A tree with red fruit.",
  [img2]: "Three blue birds flying.",
  [img3]: "Ducks swimming in a pond.",
  [img4]: "Dark clouds with rain falling.",
  [img5]: "A square green clock.",
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

const SOUNDS = {
  birds: sound0,
  clock: sound1,
  clouds: sound2,
  ducks: sound3,
  apples: sound4,
  "those are": sound5,
  "in the tree": sound6,
  "in the sky": sound7,
  "in the pond": sound8,
  "that is a": sound9,
};
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
    if (
      !completedCheckRef.current ||
      (button?.style && completedCheckRef.current.button !== button)
    ) {
      completedCheckRef.current = {
        button,
        cursor: button?.style?.cursor,
        aria: button?.getAttribute?.("aria-disabled"),
      };
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
      if (previous.aria == null)
        previous.button.removeAttribute("aria-disabled");
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
    if (completedCheckRef.current) {
      completeCheck(checkEvent);
      return;
    }

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
    if (score === total)
      (completeCheck(checkEvent), showCheckFeedback(rootRef.current, "success", msg));
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

const WB_Unit2_Page11_Q2 = () => {
  const interaction = useWordPlacement({
    initialAnswers: Object.fromEntries(
      Object.keys(correctAnswers).map((id) => [id, ""]),
    ),
    correctAnswers,
    bank: initialWords.map((w) => w.text),
    sounds: SOUNDS,
    missingMessage: "Please complete all blanks first!",
  });
  const { rootRef, message, playingKey, playSound } = interaction;
  const answers = interaction.values,
    wordBank = initialWords.map((w) => ({
      ...w,
      isUsed: interaction.used(w.text),
    }));
  const checkAnswers = interaction.check,
    handleShowAnswer = interaction.show,
    handleStartAgain = interaction.reset;
  const isWrongAnswer = (id) => interaction.results[id] === "wrong";
  const onDragEnd = ({ source, destination, draggableId }) => {
    if (!destination) return;
    if (source.droppableId === "wordBank") {
      const w = initialWords.find((w) => w.id === draggableId);
      if (w && destination.droppableId !== "wordBank")
        interaction.place(destination.droppableId, w.text);
    } else if (destination.droppableId === "wordBank")
      interaction.slotProps(source.droppableId).onClick();
    else interaction.move(source.droppableId, destination.droppableId);
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
      <div className="div-forall" style={{ gap: "20px" }}>
        <ExerciseHeader
          isWorkbook
          sectionLetter="F"
          title={<>Look, read, and complete. Use the words from the box.</>}
          subTitle={"Read the whole sentence first, then use the picture or word bank to complete the park answer."}
        />

        <div className="family-completion-activity" dir="ltr">
          <DragDropContext
            onDragEnd={onDragEnd}
            onDragStart={interaction.dragStart}
            enableDefaultSensors={false}
            sensors={[useMouseSensor, useTouchSensor]}
          >
            <Droppable droppableId="wordBank" direction="horizontal">
              {(provided, bankSnapshot) => <div className="words-box mb-5 rounded-xl flex flex-wrap gap-5 justify-center items-center min-h-[65px]" ref={provided.innerRef} {...provided.droppableProps}>
                  {wordBank.map((word, index) => <Draggable key={word.id} draggableId={word.id} index={index} isDragDisabled={interaction.revealed || word.isUsed}>
                      {(provided, snapshot) => <BankDragItem provided={provided} snapshot={snapshot} freeze={!!bankSnapshot.draggingFromThisWith} normalStyle={{
        borderRadius: 8,
        ...interaction.bankStyle(word.text)
      }}><span ref={el => {
          provided.innerRef(el);
          interaction.bankRefs.current[word.text] = el;
        }} {...provided.draggableProps} {...provided.dragHandleProps} {...interaction.bankProps(word.text)} className={`WB-word-bank ${focusClass} ${word.isUsed ? "bg-gray-200 text-gray-400 cursor-not-allowed" : snapshot.isDragging ? "bg-blue-50 text-blue-900 border-blue-900 cursor-grab" : "bg-white text-blue-900 border-blue-900 cursor-grab hover:bg-blue-50"}`}>
                            {word.text}
                            {playingKey === "bank-" + word.text && <SpeakerBadge />}
                          </span></BankDragItem>}
                    </Draggable>)}
                  {bankSnapshot.draggingFromThisWith ? <span aria-hidden="true" style={{
      display: "none"
    }}>{provided.placeholder}</span> : provided.placeholder}
                </div>}
            </Droppable>

            <div className="sentences">
              {sentenceData.map((sentence, index) => (
                <div
                  key={sentence.id}
                  className="flex items-center gap-4 rounded-xl"
                >
                  <div className="flex-1">
                    <p className="text-xl text-gray-800 flex items-center flex-wrap gap-2">
                      <span className="font-semibold text-blue-600 mr-2">
                        {index + 1}.
                      </span>

                      {sentence.textBefore === "Those are dark" ? (
                        <span>
                          <AudioText
                            tabIndex={interaction.picked ? -1 : 0}
                            audioKey={sentence.id + "-before"}
                            src={SOUNDS["those are"]}
                            playSound={playSound}
                            playingKey={playingKey}
                          >
                            Those are
                          </AudioText>
                          {" dark"}
                        </span>
                      ) : (
                        <AudioText
                          tabIndex={interaction.picked ? -1 : 0}
                          audioKey={sentence.id + "-before"}
                          src={SOUNDS[sentence.textBefore.toLowerCase()]}
                          playSound={playSound}
                          playingKey={playingKey}
                        >
                          {sentence.textBefore}
                        </AudioText>
                      )}

                      <Droppable
                        droppableId={sentence.id}
                        isDropDisabled={interaction.locked(sentence.id)}
                      >
                        {(provided, snapshot) => (
                          <span
                            ref={(el) => {
                              provided.innerRef(el);
                              interaction.slotRefs.current[sentence.id] = el;
                            }}
                            {...provided.droppableProps}
                            {...interaction.slotProps(sentence.id, snapshot)}
                            className={`${focusClass} relative inline-flex items-center justify-center w-[100px] h-[40px] px-2 py-2 border-b-2 ${
                              snapshot.isDraggingOver
                                ? "border-blue-500 bg-blue-50"
                                : isWrongAnswer(sentence.id)
                                  ? "border-red-500"
                                  : "border-gray-300"
                            }`}
                          >
                            {answers[sentence.id] && (
                              <Draggable
                                draggableId={`${sentence.id}-${answers[sentence.id]}{playingKey === "slot-"+sentence.id && <SpeakerBadge />}`}
                                index={0}
                                isDragDisabled={interaction.locked(sentence.id)}
                              >
                                {(provided, snapshot) => {
                                  const element = (
                                    <span
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      tabIndex={-1}
                                      onKeyDown={(e) => e.stopPropagation()}
                                      style={{
                                        ...provided.draggableProps.style,
                                        ...(snapshot.isDragging
                                          ? {
                                              zIndex: 2147483647,
                                              opacity: 1,
                                              visibility: "visible",
                                              pointerEvents: "none",
                                            }
                                          : {}),
                                      }}
                                      className="text-lg font-medium text-gray-800 cursor-grab whitespace-nowrap"
                                    >
                                      {answers[sentence.id]}
                                    </span>
                                  );
                                  return snapshot.isDragging
                                    ? createPortal(
                                        element,
                                        document.fullscreenElement ||
                                          document.body,
                                      )
                                    : element;
                                }}
                              </Draggable>
                            )}

                            {isWrongAnswer(sentence.id) && (
                              <div className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-base font-bold shadow-lg border-2 border-white">
                                ✕
                              </div>
                            )}

                            {provided.placeholder}
                          </span>
                        )}
                      </Droppable>

                      <AudioText
                        tabIndex={interaction.picked ? -1 : 0}
                        audioKey={sentence.id + "-after"}
                        src={
                          SOUNDS[
                            sentence.textAfter.replace(/\.$/, "").toLowerCase()
                          ]
                        }
                        playSound={playSound}
                        playingKey={playingKey}
                      >
                        {sentence.textAfter}
                      </AudioText>
                    </p>
                  </div>

                  <div className="relative">
                    <img
                      src={sentence.img}
                      className="max-w-24 max-h-24 object-contain"
                      alt={IMAGE_DESCRIPTIONS[sentence.img] || ""}
                    />
                  </div>
                </div>
              ))}
            </div>
          </DragDropContext>

          <div className="mt-10">
            <Button
              handleShowAnswer={handleShowAnswer}
              handleStartAgain={handleStartAgain}
              checkAnswers={checkAnswers}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WB_Unit2_Page11_Q2;

import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import sound0 from "../../../assets/audio/WorkBook/Unit 2/Page 14 - B/Item_001_box.mp3";
import sound1 from "../../../assets/audio/WorkBook/Unit 2/Page 14 - B/Item_002_sock.mp3";
import sound2 from "../../../assets/audio/WorkBook/Unit 2/Page 14 - B/Item_003_fox.mp3";
import sound3 from "../../../assets/audio/WorkBook/Unit 2/Page 14 - B/Item_004_cap.mp3";
import sound4 from "../../../assets/audio/WorkBook/Unit 2/Page 14 - B/Item_005_queen.mp3";
import sound5 from "../../../assets/audio/WorkBook/Unit 2/Page 14 - B/Item_006_ox.mp3";
import { createPortal } from "react-dom";
import React, { useState, useRef, useEffect } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  closestCenter,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import queenImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex B 1.svg";
import foxImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex B 2.svg";
import oxImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex B 3.svg";
import capImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex B 4.svg";
import sockImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex B 5.svg";
import boxImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex B 6.svg";

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



// 👇 مهم
const initialWordBank = [
  { text: "cap", used: false },
  { text: "queen", used: false },
  { text: "ox", used: false },
  { text: "box", used: false },
  { text: "sock", used: false },
  { text: "fox", used: false },
];

const writeQuestions = [
  { id: "w1", img: queenImg, correctAnswer: "queen" },
  { id: "w2", img: foxImg, correctAnswer: "fox" },
  { id: "w3", img: oxImg, correctAnswer: "ox" },
  { id: "w4", img: capImg, correctAnswer: "cap" },
  { id: "w5", img: sockImg, correctAnswer: "sock" },
  { id: "w6", img: boxImg, correctAnswer: "box" },
];

// eslint-disable-next-line react-refresh/only-export-components -- Keep the local draggable and its original bank styles.
function DraggableWord({ word, interaction }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: word.text,
    data: { word },
    disabled: word.used || interaction.revealed,
  });
  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        interaction.bankRefs.current[word.text] = el;
      }}
      {...attributes}
      {...listeners}
      {...interaction.bankProps(word.text)}
      className={`WB-word-bank ${focusClass} ${word.used ? "text-gray-400 cursor-not-allowed opacity-50" : "text-gray-700 cursor-grab active:cursor-grabbing"}`}
      style={{
        ...interaction.bankStyle(word.text),
        borderRadius: 8,
        touchAction: "none",
        ...(isDragging ? { opacity: 0 } : {}),
      }}
    >
      {word.text}
      {interaction.playingKey === "bank-" + word.text && <SpeakerBadge />}
    </div>
  );
}
// eslint-disable-next-line react-refresh/only-export-components -- Keep the original drop-zone layout.
function DropZone({ id, children, className, interaction }) {
  const bank = id === "word-bank";
  const { isOver, setNodeRef } = useDroppable({
    id,
    disabled: !bank && interaction.locked(id),
  });
  const props = bank
    ? {}
    : interaction.slotProps(id, { isDraggingOver: isOver });
  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        if (!bank) interaction.slotRefs.current[id] = el;
      }}
      {...props}
      className={className + (bank ? "" : " " + focusClass)}
      style={{ fontSize: "22px", fontWeight: "600", ...props.style }}
    >
      {children}
      {!bank && interaction.playingKey === "slot-" + id && <SpeakerBadge />}
    </div>
  );
}

const IMAGE_DESCRIPTIONS = {
  [queenImg]: "A woman wearing a crown.",
  [foxImg]: "An orange fox.",
  [oxImg]: "A pale blue ox.",
  [capImg]: "A red cap.",
  [sockImg]: "A striped sock.",
  [boxImg]: "An open cardboard box.",
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

const SOUNDS = {
  box: sound0,
  sock: sound1,
  fox: sound2,
  cap: sound3,
  queen: sound4,
  ox: sound5,
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
      button.disabled = true;
      button.style.cursor = "not-allowed";
      button.setAttribute("aria-disabled", "true");
    }
  };
  const resetCompletedCheck = () => {
    const previous = completedCheckRef.current;
    if (previous?.button?.style) {
      previous.button.disabled = false;
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

const WB_Unit2_Page14_Q2 = () => {
  const interaction = useWordPlacement({
    initialAnswers: {},
    correctAnswers: Object.fromEntries(
      writeQuestions.map((q) => [q.id, q.correctAnswer]),
    ),
    bank: initialWordBank.map((w) => w.text),
    sounds: SOUNDS,
    missingMessage: "Please answer all questions first!",
  });
  const { rootRef, message } = interaction;
  const checkDisabled =
    interaction.revealed ||
    writeQuestions.every(
      (question) => interaction.results[question.id] === "correct",
    );
  useEffect(() => {
    const button = rootRef.current?.querySelector(".check-button2");
    if (!button) return;
    button.disabled = checkDisabled;
    button.style.cursor = checkDisabled ? "not-allowed" : "";
    button.setAttribute("aria-disabled", String(checkDisabled));
  }, [checkDisabled, rootRef]);
  const [dragWord, setDragWord] = useState(null),
    [dragSize, setDragSize] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );
  const wordBank = initialWordBank.map((w) => ({
      ...w,
      used: interaction.used(w.text),
    })),
    placedWords = interaction.values;
  const checkAnswers = (checkEvent) => {
      if (checkDisabled) return;
      setDragWord(null);
      interaction.check(checkEvent);
    },
    handleShowAnswer = () => {
      setDragWord(null);
      interaction.show();
    },
    handleStartAgain = () => {
      setDragWord(null);
      interaction.reset();
    };
  const getDropZoneClass = (id) =>
    interaction.results[id] === "wrong"
      ? "border-red-500"
      : interaction.locked(id)
        ? "border-green-600"
        : "border-gray-400";
  const handleDragEnd = ({ active, over }) => {
    setDragWord(null);
    if (over && over.id !== "word-bank")
      interaction.place(String(over.id), String(active.id));
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        interaction.dragStart();
        setDragWord(String(active.id));
        const r = active.rect.current.initial;
        setDragSize(r ? { width: r.width, height: r.height } : null);
      }}
      onDragCancel={() => setDragWord(null)}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
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
        <div className="div-forall" style={{ gap: "25px" }}>
          <ExerciseHeader
            isWorkbook
            sectionLetter="B"
            title={<> Look, read, and write.</>}
            subTitle={"Say each picture word and listen for c, q, -ck, or -x before writing the missing letters."}
          />

          <div className="flex flex-col gap-5">
            {/* WORD BANK */}
            <DropZone
              interaction={interaction}
              id="word-bank"
              className="flex flex-wrap justify-center items-center gap-4 p-4 rounded-lg"
            >
              {wordBank.map((word) => (
                <DraggableWord
                  key={word.text}
                  word={word}
                  interaction={interaction}
                />
              ))}
            </DropZone>

            {/* QUESTIONS */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {writeQuestions.map((q, index) => {
                const isWrong = interaction.results[q.id] === "wrong";

                return (
                  <div
                    key={q.id}
                    className="text-center flex flex-col items-center relative"
                  >
                    <div className="flex gap-5">
                      <span className="text-blue-900 text-xl font-bold">
                        {index + 1}
                      </span>

                      <img
                        src={q.img}
                        className="my-2"
                        style={{ height: "100px" }}
                        alt={IMAGE_DESCRIPTIONS[q.img] || ""}
                      />
                    </div>
                    <DropZone
                      interaction={interaction}
                      id={q.id}
                      className={`h-8 w-full border-b-2 ${getDropZoneClass(q.id)}`}
                    >
                      {placedWords[q.id]}
                    </DropZone>

                    {/* ❌ ICON */}
                    {isWrong && (
                      <div className="absolute top-36 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                        <span className="text-white text-base font-bold">
                          ✕
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-10 flex justify-center">
            <Button
              handleStartAgain={handleStartAgain}
              checkAnswers={checkAnswers}
              handleShowAnswer={handleShowAnswer}
            />
          </div>
        </div>
      </div>
      {createPortal(
        <DragOverlay dropAnimation={null} zIndex={2147483647}>
          {dragWord ? (
            <div
              className="WB-word-bank"
              style={{
                ...dragSize,
                boxSizing: "border-box",
                cursor: "grabbing",
              }}
            >
              {dragWord}
              {interaction.playingKey === "bank-" + dragWord && (
                <SpeakerBadge />
              )}
            </div>
          ) : null}
        </DragOverlay>,
        document.fullscreenElement || document.body,
      )}
    </DndContext>
  );
};

export default WB_Unit2_Page14_Q2;

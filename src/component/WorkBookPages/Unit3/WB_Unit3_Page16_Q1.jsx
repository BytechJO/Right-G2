import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import sound0 from "../../../assets/audio/WorkBook/Unit 3/Page 16 - C/Item_001_drum.mp3";
import sound1 from "../../../assets/audio/WorkBook/Unit 3/Page 16 - C/Item_002_kite.mp3";
import sound2 from "../../../assets/audio/WorkBook/Unit 3/Page 16 - C/Item_003_sandwich.mp3";
import sound3 from "../../../assets/audio/WorkBook/Unit 3/Page 16 - C/Item_004_bench.mp3";
import sound4 from "../../../assets/audio/WorkBook/Unit 3/Page 16 - C/Item_005_pond.mp3";
import sound5 from "../../../assets/audio/WorkBook/Unit 3/Page 16 - C/Item_006_bike.mp3";
import sound6 from "../../../assets/audio/WorkBook/Unit 3/Page 16 - C/Item_007_paint.mp3";
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
import { createPortal } from "react-dom";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import mainPic from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 16/Asset 62.svg";

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


// بيانات التمرين
const wordBankWords = [
  "drum",
  "kite",
  "sandwich",
  "bench",
  "pond",
  "bike",
  "paint",
];
const correctAnswers = {
  1: "bench",
  2: "sandwich",
  3: "pond",
  4: "drum",
  5: "paint",
  6: "kite",
  7: "bike",
};
const questionNumbers = [1, 2, 3, 4, 5, 6, 7];

// eslint-disable-next-line react-refresh/only-export-components -- Keep drag presentation local.
const DraggableWord = ({ word, isUsed, showResults, interaction }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: word,
    data: {
      word,
    },
    disabled: showResults || isUsed,
  });
  return (
    <div
      {...attributes}
      {...listeners}
      {...interaction.bankProps(word)}
      ref={(el) => {
        setNodeRef(el);
        interaction.bankRefs.current[word] = el;
      }}
      style={{
        ...interaction.bankStyle(word),
        touchAction: "none",
        visibility: isDragging ? "hidden" : undefined,
      }}
      className={`WB-word-bank ${focusClass} ${showResults || isUsed ? "opacity-40 cursor-not-allowed" : "cursor-grab active:cursor-grabbing bg-white"}`}
    >
      {word}
      {interaction.playingKey === "bank-" + word && <SpeakerBadge />}
    </div>
  );
};
// eslint-disable-next-line react-refresh/only-export-components -- Keep drop presentation local.
const DropZone = ({ id, children, borderColor, interaction }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    disabled: interaction.locked(String(id)),
  });
  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        interaction.slotRefs.current[id] = el;
      }}
      {...interaction.slotProps(String(id), {
        isDraggingOver: isOver,
      })}
      className={`w-full border-b-2 pb-1 transition-all duration-200 ${focusClass} ${borderColor}`}
    >
      {children}
      {interaction.playingKey === "slot-" + id && <SpeakerBadge />}
    </div>
  );
};
const focusClass =
  "focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4! ";
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

//.
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
  drum: sound0,
  kite: sound1,
  sandwich: sound2,
  bench: sound3,
  pond: sound4,
  bike: sound5,
  paint: sound6,
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
const WB_Unit3_Page16_Q1 = () => {
  const interaction = useWordPlacement({
    initialAnswers: {},
    correctAnswers,
    bank: wordBankWords,
    sounds: SOUNDS,
    missingMessage: "Please fill in all answers first.",
  });
  const { rootRef, message } = interaction;
  const [dragWord, setDragWord] = useState(null),
    [dragSize, setDragSize] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

 
  const placedWords = interaction.values,
    showResults =
      interaction.revealed ||
      questionNumbers.every((id) => interaction.locked(String(id)));
  const handleShowAnswer = () => {
      setDragWord(null);
      interaction.show();
    },
    handleStartAgain = () => {
      setDragWord(null);
      interaction.reset();
    },
    checkAnswers = () => {
      if (showResults) return;
      setDragWord(null);
      interaction.check();
    };
  const getBorderColor = (id) =>
    interaction.results[id] === "correct"
      ? "border-green-600"
      : interaction.results[id] === "wrong"
        ? "border-red-500"
        : "border-gray-300";
  const handleDragEnd = ({ active, over }) => {
    setDragWord(null);
    if (over) interaction.place(String(over.id), String(active.id));
  };
  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        interaction.dragStart();
        setDragWord(String(active.id));
        const rect = active.rect.current.initial;
        setDragSize(
          rect
            ? {
                width: rect.width,
                height: rect.height,
              }
            : null,
        );
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
        <div
          className="div-forall"
          style={{
            gap: "25px",
          }}
        >
          <ExerciseHeader
            isWorkbook
            sectionLetter="C"
            title={
              "Look, read, and label the pictures. Use the words from the box."
            }
            subTitle={"Say each picnic action or object, then drag or write the correct label under its picture."}
          />
    
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap justify-center gap-5 p-3 mb-6 rounded-lg">
              {wordBankWords.map((word) => (
                <DraggableWord
                  key={word}
                  word={word}
                  isUsed={interaction.used(word)}
                  interaction={interaction}
                  showResults={showResults}
                />
              ))}
            </div>

            <img
              src={mainPic}
              alt="A park with a boy playing a drum, a person painting, a child in a pool, a bicycle, a kite, and a picnic table."
              style={{
                height: "250px",
                width: "auto",
              }}
            />

            <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-lg">
              {questionNumbers.map((qId) => (
                <div
                  key={qId}
                  className="flex justify-center items-end gap-3 relative"
                >
                  <span className="font-bold text-blue-600">{qId}</span>
                  <DropZone
                    interaction={interaction}
                    id={qId}
                    borderColor={getBorderColor(qId)}
                  >
                    <div className="w-full text-center text-xl font-semibold pb-1">
                      {placedWords[qId] || (
                        <span className="text-transparent">.</span>
                      )}
                    </div>
                  </DropZone>
                  {interaction.results[qId] === "wrong" && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold shadow-lg border-2 border-white">
                      ✕
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-20 flex justify-center">
            <Button
              handleShowAnswer={handleShowAnswer}
              handleStartAgain={handleStartAgain}
              checkAnswers={checkAnswers}
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
                position: "relative",
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
export default WB_Unit3_Page16_Q1;

/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import Button from "../Button";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import sound from "../../../assets/audio/WorkBook/p56q1.mp3";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 56/Ex A 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 56/Ex A 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 56/Ex A 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 56/Ex A 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 56/Ex A 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 56/Ex A 6.svg";
import { useState, useRef, useEffect } from "react";
import ExerciseHeader from "../../ExerciseHeader";
import ValidationAlert from "../../Popup/ValidationAlert";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import {
  DndContext,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
  pointerWithin,
} from "@dnd-kit/core";
import { createPortal } from "react-dom";
import clip0 from "../../../assets/audio/WorkBook/Unit 9/Page 56 - A/Item_001_game.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 9/Page 56 - A/Item_002_cap.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 9/Page 56 - A/Item_003_pain.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 9/Page 56 - A/Item_004_sad.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 9/Page 56 - A/Item_005_man.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 9/Page 56 - A/Item_006_may.mp3";
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
const normalized = (text) =>
  String(text)
    .toLowerCase()
    .replaceAll("’", "'")
    .replace(/[.,!?]/g, "")
    .replace(/\s+/g, " ")
    .trim();
const SOUNDS = {
  game: clip0,
  cap: clip1,
  pain: clip2,
  sad: clip3,
  man: clip4,
  may: clip5,
};
const soundFor = (text) => SOUNDS[normalized(text)];
const IMAGE_DESCRIPTIONS = {
  [img3]: "A red-and-yellow calendar with a date circled.",
  [img1]: "A blue hat with a red brim.",
  [img2]: "A checkered board with playing pieces.",
  [img4]: "A child with a downturned mouth and lowered eyes.",
  [img5]: "A boy holding his wrist with lines drawn beside it.",
  [img6]: "An adult with short dark hair wearing a blue jacket.",
};
const questions = [
  {
    id: 1,
    src: img1,
    correct: "cap",
  },
  {
    id: 2,
    src: img2,
    correct: "game",
  },
  {
    id: 3,
    src: img3,
    correct: "may",
  },
  {
    id: 4,
    src: img4,
    correct: "sad",
  },
  {
    id: 5,
    src: img5,
    correct: "pain",
  },
  {
    id: 6,
    src: img6,
    correct: "man",
  },
];
const wordBank = ["game", "cap", "pain", "sad", "man", "may"];
const correctAnswers = {
  1: "cap",
  2: "game",
  3: "may",
  4: "sad",
  5: "pain",
  6: "man",
};
// Every placement is validated against registered slots/tokens, including cancelled drags.
function useDropExercise(
  tokens,
  correct,
  missing = "Please fill all answers!",
) {
  const audio = useExerciseAudio();
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [revealed, setRevealed] = useState(false);
  const [picked, setPicked] = useState(null);
  const [active, setActive] = useState(null);
  const [message, setMessage] = useState("");
  const bankRefs = useRef({}),
    slotRefs = useRef({}),
    frame = useRef(null),
    pointer = useRef(null),
    completionRef = useRef(false);
  const targets = Object.keys(correct),
    token = (id) => tokens.find((t) => t.id === id);
  const targetLocked = (id) => revealed || results[id] === "correct";
  const itemLocked = (id) =>
    revealed ||
    Object.entries(answers).some(
      ([slot, value]) => value === id && targetLocked(slot),
    );
  const used = (id) =>
    Object.entries(answers).some(
      ([slot, value]) => value === id && results[slot] !== "wrong",
    );
  const accepts = (slot, id) =>
    targets.includes(String(slot)) &&
    !!token(id) &&
    (!token(id).targets || token(id).targets.includes(String(slot)));
  const complete = targets.every((id) => results[id] === "correct");
  completionRef.current = complete || revealed;
  useCheckButton(audio.rootRef, complete || revealed);
  const cancelFocus = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  };
  const focus = (get) => {
    cancelFocus();
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      get()?.focus();
    });
  };
  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );
  const clearSelection = () => {
    cancelFocus();
    setPicked(null);
  };
  const cancel = () => {
    const source = picked;
    clearSelection();
    if (source) focus(() => bankRefs.current[source]);
    setMessage("Choice cancelled.");
  };
  const place = (slot, id) => {
    slot = String(slot);
    if (!accepts(slot, id) || targetLocked(slot) || itemLocked(id)) return;
    const next = {
        ...answers,
      },
      cleared = [];
    for (const previous of targets)
      if (next[previous] === id && !targetLocked(previous)) {
        delete next[previous];
        cleared.push(previous);
      }
    next[slot] = id;
    setAnswers(next);
    setResults((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(
          ([key]) => key !== slot && !cleared.includes(key),
        ),
      ),
    );
    setPicked(null);
    setMessage(`${token(id).value} placed in answer field ${slot}.`);
    return next;
  };
  const remove = (slot) => {
    if (targetLocked(slot) || !answers[slot]) return;
    const id = answers[slot];
    setAnswers((prev) => {
      const next = {
        ...prev,
      };
      delete next[slot];
      return next;
    });
    setResults((prev) => ({
      ...prev,
      [slot]: null,
    }));
    setMessage(`${token(id).value} returned to its word bank.`);
    return id;
  };
  const listen = (id, key) => audio.playSound(key, soundFor(token(id)?.value));
  const bankProps = (id) => ({
    role: "button",
    tabIndex: picked ? -1 : 0,
    "aria-label": `${token(id).value}. Press Enter or Space to choose, then activate an answer field.`,
    "aria-pressed": picked === id,
    "aria-disabled": used(id) || itemLocked(id),
    onClick: () => listen(id, "bank-" + id),
    onKeyDown: (event) => {
      if (event.key === "Escape" && picked) {
        event.preventDefault();
        event.stopPropagation();
        cancel();
        return;
      }
      if (!["Enter", " "].includes(event.key)) return;
      event.preventDefault();
      event.stopPropagation();
      if (event.repeat) return;
      listen(id, "bank-" + id);
      if (used(id) || itemLocked(id)) return;
      setPicked(id);
      setMessage(`${token(id).value} selected. Choose an answer field.`);
      const target =
        targets.find(
          (slot) => accepts(slot, id) && !targetLocked(slot) && !answers[slot],
        ) || targets.find((slot) => accepts(slot, id) && !targetLocked(slot));
      if (target) focus(() => slotRefs.current[target]);
    },
    onKeyUp: release,
    style: {
      position: "relative",
      ...(picked === id
        ? {
            outline: "3px solid #2563eb",
            outlineOffset: 2,
            backgroundColor: "#dbeafe",
          }
        : {}),
    },
  });
  const slotProps = (slot, over = false) => ({
    role: "button",
    tabIndex: picked && (targetLocked(slot) || !accepts(slot, picked)) ? -1 : 0,
    "aria-label": `Answer field ${slot}. ${token(answers[slot])?.value || "Empty"}.${targetLocked(slot) ? " Correct and locked." : results[slot] === "wrong" ? " Not correct." : ""}`,
    "aria-disabled": targetLocked(slot),
    onClick: () => {
      if (answers[slot]) {
        listen(answers[slot], "answer-" + slot);
        remove(slot);
      }
    },
    onKeyDown: (event) => {
      if (event.key === "Escape" && picked) {
        event.preventDefault();
        event.stopPropagation();
        cancel();
        return;
      }
      if (["Delete", "Backspace"].includes(event.key)) {
        event.preventDefault();
        event.stopPropagation();
        if (!event.repeat && results[slot] === "wrong") remove(slot);
        return;
      }
      if (!["Enter", " "].includes(event.key)) return;
      event.preventDefault();
      event.stopPropagation();
      if (event.repeat) return;
      if (targetLocked(slot)) {
        if (answers[slot]) listen(answers[slot], "answer-" + slot);
        return;
      }
      if (picked) {
        const id = picked,
          next = place(slot, id);
        if (next) {
          const available = tokens.find(
            (t) =>
              !Object.entries(next).some(
                ([key, value]) => value === t.id && results[key] !== "wrong",
              ),
          );
          focus(() => bankRefs.current[available?.id || id]);
        }
      } else if (answers[slot]) {
        listen(answers[slot], "answer-" + slot);
        remove(slot);
      }
    },
    onKeyUp: release,
    style: {
      position: "relative",
      borderRadius: 0,
      ...(results[slot]
        ? {
            borderBottomColor:
              results[slot] === "correct" ? "#16a34a" : "#ef4444",
          }
        : {}),
      ...(over && !targetLocked(slot) && (!active || accepts(slot, active.id))
        ? {
            outline: "3px dashed #2563eb",
            outlineOffset: 2,
            backgroundColor: "#dbeafe",
            borderRadius: 4,
          }
        : {}),
    },
  });
  const stopDrag = () => {
    pointer.current = null;
    setActive(null);
    clearSelection();
  };
  const dragStart = (event) => {
    clearSelection();
    const id = event.active.id;
    if (!token(id) || itemLocked(id) || used(id)) return;
    pointer.current = { id };
    const rect = event.active.rect?.current?.initial;
    const node = bankRefs.current[id],
      computed = node && window.getComputedStyle?.(node),
      scale = node?.offsetWidth && rect ? rect.width / node.offsetWidth : 1;
    setActive({
      id,
      value: token(id).value,
      width: rect?.width,
      height: rect?.height,
      fontSize: computed ? parseFloat(computed.fontSize) * scale : undefined,
    });
  };
  const dragEnd = (event) => {
    const source = pointer.current;
    pointer.current = null;
    setActive(null);
    if (!source || source.id !== event.active.id || !event.over) return;
    // pointerWithin uses the current viewport coordinates, including after scrolling.
    // Drag delta also includes scroll adjustment and must not be added to the pointer.
    place(String(event.over.id), source.id);
  };
  const check = () => {
    if (completionRef.current) return;
    stopDrag();
    audio.stopAudio();
    if (targets.some((id) => !answers[id])) {
      setMessage(missing);
      ValidationAlert.info(missing);
      return;
    }
    const next = Object.fromEntries(
      targets.map((id) => [
        id,
        results[id] === "correct" || token(answers[id])?.value === correct[id]
          ? "correct"
          : "wrong",
      ]),
    );
    setResults(next);
    const score = targets.filter((id) => next[id] === "correct").length;
    completionRef.current = score === targets.length;
    setMessage(
      `Score ${score} out of ${targets.length}. Correct answers are locked; incorrect answers can be changed.`,
    );
    showCheckFeedback(
      audio.rootRef.current,
      score === targets.length ? "success" : score ? "warning" : "error",
      `Score: ${score} / ${targets.length}`,
    );
  };
  const show = () => {
    completionRef.current = true;
    stopDrag();
    audio.stopAudio();
    const solved = Object.fromEntries(
      targets.map((slot) => [
        slot,
        tokens.find((t) => accepts(slot, t.id) && t.value === correct[slot]).id,
      ]),
    );
    setAnswers(solved);
    setResults(Object.fromEntries(targets.map((id) => [id, "correct"])));
    setRevealed(true);
    setMessage("Correct answers shown and locked.");
  };
  const reset = () => {
    completionRef.current = false;
    stopDrag();
    audio.stopAudio();
    setAnswers({});
    setResults({});
    setRevealed(false);
    setMessage("Exercise reset. All answers and results cleared.");
  };
  return {
    ...audio,
    answers,
    results,
    revealed,
    picked,
    active,
    message,
    setMessage,
    tokens,
    bankRefs,
    slotRefs,
    targetLocked,
    itemLocked,
    used,
    accepts,
    bankProps,
    slotProps,
    cancel,
    place,
    remove,
    dragStart,
    dragEnd,
    stopDrag,
    check,
    show,
    reset,
    value: (slot) => token(answers[slot])?.value || "",
  };
}
// Overlay stays in viewport coordinates outside the Book's transformed container.
function DragPreview({ interaction, className }) {
  return createPortal(
    <DragOverlay
      dropAnimation={null}
      style={{
        zIndex: 2147483647,
      }}
    >
      {interaction.active ? (
        <div
          className={className}
          style={{
            width: interaction.active.width,
            height: interaction.active.height,
            boxSizing: "border-box",
            pointerEvents: "none",
            fontSize: interaction.active.fontSize,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        >
          {interaction.active.value}
        </div>
      ) : null}
    </DragOverlay>,
    document.fullscreenElement || document.body,
  );
}
function DraggableWord({ word, value, type, parentId, interaction }) {
  const tokenId = word;
  const disabled = interaction.itemLocked(tokenId) || interaction.used(tokenId);
  const props = interaction.bankProps(tokenId);
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: tokenId,
    data: {
      word: word || value,
      type,
      value,
      parentId,
    },
    disabled,
  });
  return (
    <div
      className={
        `WB-word-bank touch-none
        ${disabled ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white cursor-grab hover:bg-blue-50 border-blue-900"}
      ` +
        " " +
        focusClass
      }
      ref={(element) => {
        setNodeRef(element);
        interaction.bankRefs.current[tokenId] = element;
      }}
      {...attributes}
      {...listeners}
      {...props}
      style={{
        ...props.style,
        padding: "5px 22px",
        touchAction: "none",
      }}
    >
      {word}
      <>{interaction.playingKey === "bank-" + tokenId && <SpeakerBadge />}</>
    </div>
  );
}
function DropZone({ id, value, interaction }) {
  const target = String(id);
  const { setNodeRef, isOver: over } = useDroppable({
    id: target,
    disabled: interaction.targetLocked(target),
  });
  const isOver =
      !!interaction.active && over && !interaction.targetLocked(target),
    isWrong = interaction.results[target] === "wrong";
  const props = interaction.slotProps(target, isOver);
  return (
    <div
      className={
        "relative w-full text-center border-b-2 border-gray-400 pb-1 min-h-[28px]" +
        " focus-visible:rounded-md! " +
        focusClass
      }
      ref={(element) => {
        setNodeRef(element);
        interaction.slotRefs.current[target] = element;
      }}
      {...props}
    >
      {value ? (
        <span className="font-bold text-base text-blue-900">{value}</span>
      ) : (
        <span className="text-gray-300 text-sm">_ _ _</span>
      )}

      {isWrong && (
        <span className="absolute -top-2 right-0 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg">
          ✕
        </span>
      )}
      <>{interaction.playingKey === "answer-" + target && <SpeakerBadge />}</>
    </div>
  );
}
function WB_Unit9_Page56_Q1() {
  const tokens = wordBank.map((value) => ({
    id: value,
    value,
  }));
  const a = useDropExercise(
    tokens,
    Object.fromEntries(questions.map((q) => [q.id, q.correct])),
  );
  const { rootRef, message } = a;
  const answers = Object.fromEntries(
    questions.map((q) => [q.id, a.value(String(q.id))]),
  );
  const checked = Object.values(a.results).some(Boolean),
    showResult = checked;
  const usedWords = Object.values(answers);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
  );
  const checkAnswers = a.check,
    handleShowAnswer = a.show,
    handleStartAgain = a.reset;
  const captions = [
    {
      start: 0.6,
      end: 3.38,
      text: "Page 56, phonics exercise A.",
    },
    {
      start: 4.24,
      end: 6,
      text: "Look, listen, and write.",
    },
    {
      start: 6.5,
      end: 8.56,
      text: "1.cap.",
    },
    {
      start: 9.72,
      end: 11.6,
      text: "2.game.",
    },
    {
      start: 11.7,
      end: 14.1,
      text: "3.may.",
    },
    {
      start: 14.8,
      end: 16.88,
      text: "4.sad.",
    },
    {
      start: 17.9,
      end: 20.04,
      text: "5.pain.",
    },
    {
      start: 21.1,
      end: 22.96,
      text: "6.man.",
    },
  ];
  const getCardClass = (id) =>
    "rounded-2xl p-4 flex flex-col items-center gap-3 border-2 " +
    (a.results[id] === "correct"
      ? "border-green-600"
      : a.results[id] === "wrong"
        ? "border-red-400"
        : "border-transparent");
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={a.dragStart}
      onDragEnd={a.dragEnd}
      onDragCancel={a.stopDrag}
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
            sectionLetter="A"
            title={<>Look, listen, and write.</>}
            subTitle={
              "Listen once for meaning, then replay and write the missing short- or long-a word."
            }
          />
          <QuestionAudioPlayer
            src={sound}
            captions={captions}
            stopAtSecond={6.1}
            pageId="wb_unit9_page56_q1"
          />
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap justify-center gap-8 rounded-lg p-4">
              {wordBank.map((word) => {
                const isUsed = usedWords.includes(word);
                return (
                  <DraggableWord
                    key={word}
                    word={word}
                    disabled={isUsed || showResult}
                    interaction={a}
                  />
                );
              })}
            </div>

            {/* Questions grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {questions.map((q) => (
                <div key={q.id} className={getCardClass(q.id)}>
                  {/* Number */}
                  <span className="text-xl font-bold text-blue-900 self-start">
                    {q.id}
                  </span>

                  <img
                    src={q.src}
                    className="max-w-24 max-h-24"
                    alt={
                      IMAGE_DESCRIPTIONS[q.src] ||
                      "Illustration for this question"
                    }
                  />

                  {/* Answer line */}
                  <DropZone
                    id={q.id}
                    value={answers[q.id]}
                    correct={correctAnswers[q.id]}
                    showResult={showResult}
                    interaction={a}
                  />
                </div>
              ))}
            </div>
          </div>
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleStartAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
      <DragPreview
        interaction={a}
        className="px-6 py-2 bg-white border-2 border-blue-500 rounded-xl shadow-2xl text-blue-700 font-bold scale-105"
      />
    </DndContext>
  );
}
export default WB_Unit9_Page56_Q1;

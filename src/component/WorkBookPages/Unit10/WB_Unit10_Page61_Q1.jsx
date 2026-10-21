/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import Button from "../Button";
import img from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 61/SVG/Asset 1.svg";
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
import clip0 from "../../../assets/audio/WorkBook/Unit 10/Page 61 - H/Item_001_making.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 10/Page 61 - H/Item_002_searching.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 10/Page 61 - H/Item_003_writing.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 10/Page 61 - H/Item_004_watching.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 10/Page 61 - H/Item_005_drawing.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 10/Page 61 - H/Item_006_reading.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 10/Page 61 - H/Item_007_She_is.mp3";
import clip7 from "../../../assets/audio/WorkBook/Unit 10/Page 61 - H/Item_008_He_is.mp3";
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
      onClick={(e) => {
        e.stopPropagation();
        playSound(audioKey, src);
      }}
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
  making: clip0,
  searching: clip1,
  writing: clip2,
  watching: clip3,
  drawing: clip4,
  reading: clip5,
  "she is": clip6,
  "he is": clip7,
};
const soundFor = (text) => SOUNDS[normalized(text)];
const IMAGE_DESCRIPTIONS = {
  [img]:
    "Six numbered children in a classroom: one writing, one looking outside, one making a model, one with an open book, one drawing on the board and one searching among pencils.",
};
const wordBank = [
  "making",
  "searching",
  "writing",
  "watching",
  "drawing",
  "reading",
];
const questions = [
  {
    id: 1,
    subject: "She",
    correct: "She is writing.",
  },
  {
    id: 2,
    subject: "She",
    correct: "She is watching.",
  },
  {
    id: 3,
    subject: "He",
    correct: "He is making.",
  },
  {
    id: 4,
    subject: "She",
    correct: "She is reading",
  },
  {
    id: 5,
    subject: "He",
    correct: "He is drawing.",
  },
  {
    id: 6,
    subject: "He",
    correct: "He is searching.",
  },
];
const correctAnswers = {
  1: "writing",
  2: "watching",
  3: "making",
  4: "reading",
  5: "drawing",
  6: "searching",
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
              t.draggable !== false &&
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
    pointer.current = {
      id,
    };
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
    // pointerWithin already checks viewport coordinates after scrolling.
    // event.delta also includes scroll adjustment, so it is not a pointer offset.
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
function DraggableWord({ word, interaction }) {
  const tokenId = word;
  const isUsed = interaction.used(tokenId),
    disabled = isUsed || interaction.itemLocked(tokenId);
  const props = interaction.bankProps(tokenId);
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: tokenId,
    disabled,
  });
  return (
    <div
      className={
        `WB-word-bank touch-none
        ${disabled ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-200" : "bg-white cursor-grab hover:bg-blue-50 border-blue-900 text-blue-900"}
      ` +
        " " +
        focusClass
      }
      ref={(el) => {
        setNodeRef(el);
        interaction.bankRefs.current[tokenId] = el;
      }}
      {...attributes}
      {...listeners}
      {...props}
      style={{
        ...props.style,
        padding: "9px 22px",
        opacity: isUsed ? 0.5 : 1,
        touchAction: "none",
      }}
    >
      {word}
      <>{interaction.playingKey === "bank-" + tokenId && <SpeakerBadge />}</>
    </div>
  );
}
function DropZone({ id, value, subject, interaction }) {
  const target = String(id);
  const { setNodeRef, isOver: over } = useDroppable({
    id: target,
    disabled: interaction.targetLocked(target),
  });
  const isOver = !!interaction.active && over,
    isSubmitted = !!interaction.results[target],
    showResult = isSubmitted,
    isWrong = interaction.results[target] === "wrong";
  const props = interaction.slotProps(target, isOver);
  return (
    <div
      className={
        `relative border-b-2 pb-1 mb-3 min-h-[38px] flex items-center gap-1 transition-all duration-300
      
      ${!showResult || !value ? "border-gray-300" : ""}
      ${showResult && interaction.results[target] === "correct" ? "border-gray-400" : ""}
      
      // 🔥 hover أثناء السحب
      ${isOver ? "bg-blue-100  border-blue-600 " : ""}
      
      // ❌ خطأ
      ${isWrong ? "border-red-500 bg-white" : ""}
      ` +
        " " +
        focusClass +
        " focus-visible:rounded-md!"
      }
      ref={(el) => {
        setNodeRef(el);
        interaction.slotRefs.current[target] = el;
      }}
      {...props}
    >
      {isWrong && (
        <div className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow">
          ✕
        </div>
      )}

      <span className="text-gray-900 text-lg font-semibold">
        <AudioText
          audioKey={"subject-" + id}
          src={soundFor(subject + " is")}
          playSound={interaction.playSound}
          playingKey={interaction.playingKey}
          tabIndex={interaction.picked ? -1 : 0}
        >
          {subject} is
        </AudioText>
      </span>

      {value && (
        <span className="font-bold text-lg ml-1 text-blue-900">{value}.</span>
      )}
      <>{interaction.playingKey === "answer-" + target && <SpeakerBadge />}</>
    </div>
  );
}
function WB_Unit10_Page61_Q1() {
  const tokens = wordBank.map((value) => ({
    id: value,
    value,
  }));
  const a = useDropExercise(tokens, correctAnswers);
  const { rootRef, message } = a;
  const answers = Object.fromEntries(
    Object.keys(correctAnswers).map((id) => [id, a.value(id)]),
  );
  const showResults = Object.values(a.results).some(Boolean),
    showResult = showResults;
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
  const usedWords = tokens.filter((t) => a.used(t.id)).map((t) => t.id);
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
            gap: "35px",
          }}
        >
          <ExerciseHeader
            isWorkbook
            sectionLetter="H"
            title={<>Look and write sentences.</>}
            subTitle={
              "Use the numbered scene and action bank together, then write one complete sentence for each person."
            }
          />

          <div className="flex flex-col gap-5">
            <img
              src={img}
              style={{
                height: "240px",
              }}
              alt={IMAGE_DESCRIPTIONS[img] || "Illustration for this question"}
            />

            <div className="flex flex-col gap-5">
              {/* Global Word Bank */}
              <div className="flex flex-wrap justify-center gap-2 rounded-lg p-3">
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

              <div className="space-y-6">
                {/* الجملة الأولى ثابتة */}

                {questions.map((q) => (
                  <div key={q.id} className="flex items-start gap-3">
                    <span className="text-blue-900 text-xl font-bold w-5 shrink-0 pt-2">
                      {q.id}
                    </span>

                    <div className="flex-1">
                      <DropZone
                        id={q.id}
                        value={answers[q.id]}
                        correct={correctAnswers[q.id]}
                        showResult={showResult}
                        subject={q.subject}
                        interaction={a}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DragPreview
            interaction={a}
            className="px-4 py-2 bg-white border-2 border-blue-500 rounded-lg shadow-xl font-semibold"
          />
          <div>
            <Button
              handleStartAgain={handleStartAgain}
              checkAnswers={checkAnswers}
              handleShowAnswer={handleShowAnswer}
            />
          </div>
        </div>
      </div>
    </DndContext>
  );
}
export default WB_Unit10_Page61_Q1;

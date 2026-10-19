/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import Button from "../Button";
// check
// check
import imgMath from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 58/SVG/Asset 6-1.svg";
import imgSoccer from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 58/SVG/Asset 9-1.svg";
import imgEnglish from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 58/SVG/Asset 7-1.svg";
import imgScience from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 58/SVG/Asset 8-1.svg";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 58/SVG/Asset 1.svg";
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
import { SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import clip0 from "../../../assets/audio/WorkBook/Unit 10/Page 58 - B/Item_001_What_lesson_are_they_having.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 10/Page 58 - B/Item_003_What_are_they_doing.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 10/Page 58 - B/Item_004_They're.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 10/Page 58 - B/Item_005_They're_having.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 10/Page 58 - B/Item_006_They're_playing.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 10/Page 58 - B/Item_007_science_class.mp3";
import clip7 from "../../../assets/audio/WorkBook/Unit 10/Page 58 - B/Item_008_English_class.mp3";
import clip8 from "../../../assets/audio/WorkBook/Unit 10/Page 58 - B/Item_009_math_class.mp3";
import clip9 from "../../../assets/audio/WorkBook/Unit 10/Page 58 - B/Item_010_soccer.mp3";
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
  "what lesson are they having": clip0,
  "they're having": clip4,
  "what are they doing": clip2,
  "they're": clip3,
  "they're playing": clip5,
  "science class": clip6,
  "english class": clip7,
  "math class": clip8,
  soccer: clip9,
};
const soundFor = (text) => SOUNDS[normalized(text)];
const IMAGE_DESCRIPTIONS = {
  [imgMath]: "A teacher standing by a board with a child at a desk.",
  [imgSoccer]: "Children playing soccer on grass.",
  [imgEnglish]: "A teacher standing by a blackboard.",
  [imgScience]: "A woman pointing to a projected picture while children watch.",
  [img1]: "A smiling girl with an orange headband and a smiling boy.",
};
const ACTIVITIES_B = [
  {
    id: "b1",
    text: "math class",
    full: "They're having math class.",
  },
  {
    id: "b2",
    text: "soccer",
    full: "They're playing soccer.",
  },
  {
    id: "b3",
    text: "English class",
    full: "He is having English class.",
  },
  {
    id: "b4",
    text: "science class",
    full: "They're having science class.",
  },
];
const CORRECT_B = {
  q1: "b1",
  q2: "b2",
  q3: "b3",
  q4: "b4",
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
function DraggableItem({ item, interaction }) {
  const tokenId = item.id;
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
        `px-4 py-2 bg-white border-2 border-gray-300 rounded-lg shadow-sm cursor-grab touch-none text-blue-700 font-bold text-sm ${isUsed ? "bg-gray-100 text-gray-400 " : "hover:border-blue-400"}` +
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
        opacity: isUsed ? 0.5 : 1,
        touchAction: "none",
      }}
    >
      {item.text}
      <>{interaction.playingKey === "bank-" + tokenId && <SpeakerBadge />}</>
    </div>
  );
}
function DropSlot({ id, content, prefix, interaction }) {
  const target = String(id);
  const { setNodeRef, isOver: over } = useDroppable({
    id: target,
    disabled: interaction.targetLocked(target),
  });
  const isOver = !!interaction.active && over,
    isSubmitted = !!interaction.results[target],
    isCorrect = interaction.results[target] === "correct";
  const borderColor = isSubmitted
    ? isCorrect
      ? "border-green-600"
      : "border-red-500"
    : "border-gray-300";
  const props = interaction.slotProps(target, isOver);
  return (
    <div className="space-y-2">
      <div
        className={
          `relative w-full min-h-[45px] border-b-2 flex items-center px-2 transition-all ${borderColor}` +
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
        {/* ❌ Wrong Answer Icon */}
        {isSubmitted && content && !isCorrect && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow">
            ✕
          </div>
        )}
        <span className="text-gray-700 mr-2">
          <AudioText
            audioKey={"prefix-" + id}
            src={soundFor(prefix)}
            playSound={interaction.playSound}
            playingKey={interaction.playingKey}
            tabIndex={interaction.picked ? -1 : 0}
          >
            {prefix}
          </AudioText>
        </span>
        {content ? (
          <span className="text-blue-900 font-semibold text-lg">
            {ACTIVITIES_B.find((a) => a.id === content).text}.
          </span>
        ) : (
          <span className="text-gray-200 italic text-sm">drop here...</span>
        )}
        <>{interaction.playingKey === "answer-" + target && <SpeakerBadge />}</>
      </div>
    </div>
  );
}
function WB_Unit10_Page58_Q1() {
  const tokens = ACTIVITIES_B.map((item) => ({
    id: item.id,
    value: item.text,
    targets: Object.keys(CORRECT_B).filter(() => true),
  }));
  const a = useDropExercise(
    tokens,
    Object.fromEntries(
      Object.entries(CORRECT_B).map(([id, value]) => [
        id,
        ACTIVITIES_B.find((item) => item.id === value).text,
      ]),
    ),
  );
  const { rootRef, message } = a;
  const answers = Object.fromEntries(
    Object.keys(CORRECT_B).map((id) => [id, a.answers[id] || null]),
  );
  const showResults = Object.values(a.results).some(Boolean);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );
  const checkAnswers = a.check,
    handleShowAnswer = a.show,
    handleReset = () => {
      a.reset();
      setShuffledActivities(shuffleArray(ACTIVITIES_B));
    };
  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);
  const [shuffledActivities, setShuffledActivities] = useState(() =>
    shuffleArray(ACTIVITIES_B),
  );
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
            gap: "45px",
          }}
        >
          <ExerciseHeader
            isWorkbook
            sectionLetter="B"
            title={<>Look, ask, and answer. Then write.</>}
            subTitle={
              "Ask both questions aloud for each picture, then write the lesson and action that match the scene."
            }
          />
          <img
            src={img1}
            className="object-cover rounded-xl"
            style={{
              height: "auto",
              width: "auto",
            }}
            alt={IMAGE_DESCRIPTIONS[img1] || "Illustration for this question"}
          />

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-[3] grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <img
                  src={imgMath}
                  className="max-w-full max-h-32 object-cover rounded-xl"
                  alt={
                    IMAGE_DESCRIPTIONS[imgMath] ||
                    "Illustration for this question"
                  }
                />
                <DropSlot
                  id="q1"
                  prefix="They're having"
                  content={answers.q1}
                  isCorrect={answers.q1 === CORRECT_B.q1}
                  isSubmitted={showResults}
                  interaction={a}
                />
              </div>
              <div className="space-y-4">
                <img
                  src={imgSoccer}
                  className="max-w-full max-h-32 object-cover rounded-xl"
                  alt={
                    IMAGE_DESCRIPTIONS[imgSoccer] ||
                    "Illustration for this question"
                  }
                />
                <DropSlot
                  id="q2"
                  prefix="They're playing"
                  content={answers.q2}
                  isCorrect={answers.q2 === CORRECT_B.q2}
                  isSubmitted={showResults}
                  interaction={a}
                />
              </div>
              <div className="space-y-4">
                <img
                  src={imgEnglish}
                  className="max-w-full max-h-32 object-cover rounded-xl"
                  alt={
                    IMAGE_DESCRIPTIONS[imgEnglish] ||
                    "Illustration for this question"
                  }
                />
                <DropSlot
                  id="q3"
                  prefix="He is having"
                  content={answers.q3}
                  isCorrect={answers.q3 === CORRECT_B.q3}
                  isSubmitted={showResults}
                  interaction={a}
                />
              </div>
              <div className="space-y-4">
                <img
                  src={imgScience}
                  className="max-w-full max-h-32 object-cover rounded-xl"
                  alt={
                    IMAGE_DESCRIPTIONS[imgScience] ||
                    "Illustration for this question"
                  }
                />
                <DropSlot
                  id="q4"
                  prefix="They're having"
                  content={answers.q4}
                  isCorrect={answers.q4 === CORRECT_B.q4}
                  isSubmitted={showResults}
                  interaction={a}
                />
              </div>
            </div>

            <div className="flex-1 bg-blue-50 p-5 rounded-2xl border-2 border-blue-100 h-fit">
              <h3 className="font-bold text-blue-800 mb-4 text-center">
                Activities Bank
              </h3>
              <div className="flex flex-col gap-3">
                <SortableContext items={shuffledActivities.map((a) => a.id)}>
                  {shuffledActivities.map((act) => (
                    <DraggableItem
                      key={act.id}
                      item={act}
                      // ✨ تعديل
                      isUsed={Object.values(answers)
                        .filter(Boolean)
                        .includes(act.id)}
                      interaction={a}
                    />
                  ))}
                </SortableContext>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              handleStartAgain={handleReset}
              checkAnswers={checkAnswers}
              handleShowAnswer={handleShowAnswer}
            />
          </div>
        </div>
      </div>
      <DragPreview
        interaction={a}
        className="px-4 py-2 bg-white border-2 border-blue-500 rounded-lg shadow-xl text-blue-700 font-bold scale-105"
      />
    </DndContext>
  );
}
export default WB_Unit10_Page58_Q1;

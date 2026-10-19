/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 8/Page 49 - J/Item_001_How_many_pairs_of_shoes_does_she_have.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 8/Page 49 - J/Item_002_She_has_four_pairs_of_shoes.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 8/Page 49 - J/Item_003_How_many_shirts_does_she_have.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 8/Page 49 - J/Item_004_She_has_five_skirts.mp3";
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
import React, { useState, useRef, useEffect } from "react";
import { SortableContext } from "@dnd-kit/sortable";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import imgBedroom from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/page 49/Asset54.svg";
const IMAGE_DESCRIPTIONS = {
  [imgBedroom]: "A bedroom with a wardrobe, bed and desk.",
};
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
const activate = (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  e.preventDefault();
  e.stopPropagation();
  if (!e.repeat) e.currentTarget.click();
};
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
const SOUNDS = {
  "how many pairs of shoes does she have": clip0,
  "she has four pairs of shoes": clip1,
  "how many shirts does she have": clip2,
  "she has five skirts": clip3,
};
const normalized = (text) =>
  String(text)
    .toLowerCase()
    .replaceAll("’", "'")
    .replace(/[.,!?]/g, "")
    .replace(/\s+/g, " ")
    .trim();
const soundFor = (text) => SOUNDS[normalized(text)];
function useDropAnswers(
  tokens,
  targets,
  isCorrect,
  multiple = false,
  limits = {},
) {
  const audio = useExerciseAudio(),
    [answers, setAnswers] = useState(
      Object.fromEntries(targets.map((id) => [id, []])),
    ),
    [results, setResults] = useState({}),
    [revealed, setRevealed] = useState(false),
    [picked, setPicked] = useState(null),
    [message, setMessage] = useState("");
  const bankRefs = useRef({}),
    slotRefs = useRef({}),
    frame = useRef(null),
    suppress = useRef(false);
  const token = (id) => tokens.find((t) => t.id === id),
    resultKey = (target, id) => (multiple ? id : String(target)),
    targetLocked = (id) => revealed || (!multiple && results[id] === "correct");
  const limit = (id) => limits[id] || 1;
  const itemLocked = (id) =>
    revealed ||
    Object.entries(answers).filter(
      ([target, ids]) => ids.includes(id) && results[target] === "correct",
    ).length >= limit(id);
  const used = (id) =>
    Object.entries(answers).filter(
      ([target, ids]) => ids.includes(id) && results[target] !== "wrong",
    ).length >= limit(id);
  const cancelFocus = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  };
  const focus = (get) => {
    cancelFocus();
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      suppress.current = true;
      try {
        get()?.focus({
          preventScroll: true,
        });
      } finally {
        suppress.current = false;
      }
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
  const place = (target, id) => {
    target = String(target);
    if (
      !targets.map(String).includes(target) ||
      !token(id) ||
      targetLocked(target) ||
      itemLocked(id)
    )
      return;
    const next = Object.fromEntries(
      Object.entries(answers).map(([key, ids]) => [key, [...ids]]),
    );
    if (next[target].includes(id)) return;
    const occurrences = Object.keys(next).filter(
      (key) => key !== target && next[key].includes(id),
    );
    if (occurrences.length >= limit(id)) {
      const previous =
        occurrences.find(
          (key) => !targetLocked(key) && results[key] === "wrong",
        ) || occurrences.find((key) => !targetLocked(key));
      if (!previous) return;
      next[previous] = next[previous].filter((value) => value !== id);
    }
    next[target] = [id];
    setAnswers(next);
    setResults((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(([key]) =>
          multiple
            ? key !== id
            : key !== target &&
              !(answers[key]?.includes(id) && !next[key]?.includes(id)),
        ),
      ),
    );
    setPicked(null);
    setMessage(token(id).value + " placed.");
    return next;
  };
  const remove = (target, id) => {
    if (targetLocked(target) || itemLocked(id)) return;
    setAnswers((prev) => ({
      ...prev,
      [target]: prev[target].filter((v) => v !== id),
    }));
    setResults((prev) => ({
      ...prev,
      [resultKey(target, id)]: null,
    }));
    setMessage(token(id).value + " returned to the bank.");
  };
  const play = (id, where = "bank") =>
    audio.playSound(where + "-" + id, soundFor(token(id).value));
  const bankProps = (id, source = "bank") => ({
    role: "button",
    tabIndex: picked ? -1 : 0,
    "aria-label": token(id).value + ". Choose to place.",
    "aria-pressed": picked === id,
    "aria-disabled": itemLocked(id) || (source === "bank" && used(id)),
    onClick: (e) => {
      e.stopPropagation();
      play(id, source);
      if (source !== "bank") remove(source, id);
    },
    onFocus: (e) => {
      if (!suppress.current && e.currentTarget.matches(":focus-visible"))
        play(id, source);
    },
    onKeyDown: (e) => {
      if (e.key === "Escape" && picked) {
        e.preventDefault();
        e.stopPropagation();
        cancel();
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        e.stopPropagation();
        if (
          !e.repeat &&
          source !== "bank" &&
          results[resultKey(source, id)] === "wrong"
        )
          remove(source, id);
        return;
      }
      if (!["Enter", " "].includes(e.key)) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.repeat) return;
      play(id, source);
      if (itemLocked(id)) return;
      if (source !== "bank") {
        remove(source, id);
        return;
      }
      if (used(id)) return;
      setPicked(id);
      setMessage(token(id).value + " selected. Choose an answer field.");
      const target =
        targets.find((t) => !targetLocked(t) && !answers[t].length) ??
        targets.find((t) => !targetLocked(t));
      if (target !== undefined) focus(() => slotRefs.current[target]);
    },
    onKeyUp: release,
    style: {
      position: "relative",
      borderRadius: 8,
      ...(picked === id
        ? {
            outline: "3px solid #2563eb",
            outlineOffset: 2,
            backgroundColor: "#dbeafe",
          }
        : {}),
      ...(source !== "bank" && results[resultKey(source, id)] === "correct"
        ? {
            borderBottomColor: "#16a34a",
          }
        : {}),
    },
  });
  const slotProps = (target, over = false) => ({
    role: "button",
    tabIndex: picked && targetLocked(target) ? -1 : 0,
    "aria-label":
      "Answer field " +
      target +
      ": " +
      (answers[target].map((id) => token(id).value).join(" ") || "Empty") +
      (targetLocked(target) ? ". Correct and locked." : ""),
    "aria-disabled": targetLocked(target),
    onClick: (e) => {
      e.stopPropagation();
      const id = answers[target].at(-1);
      if (id) {
        audio.playSound(
          targetLocked(target) ? "answer-" + target : "bank-" + id,
          soundFor(token(id).value),
        );
        remove(target, id);
      }
    },
    onKeyDown: (e) => {
      if (e.key === "Escape" && picked) {
        e.preventDefault();
        e.stopPropagation();
        cancel();
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        e.stopPropagation();
        const id = answers[target].findLast(
          (id) => results[resultKey(target, id)] === "wrong",
        );
        if (!e.repeat && id) remove(target, id);
        return;
      }
      if (!["Enter", " "].includes(e.key)) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.repeat) return;
      if (targetLocked(target)) {
        const id = answers[target][0];
        if (id) audio.playSound("answer-" + target, soundFor(token(id).value));
        return;
      }
      if (picked) {
        const id = picked,
          next = place(target, id);
        if (next) {
          const available = tokens.find(
            (t) => !Object.values(next).some((ids) => ids.includes(t.id)),
          );
          focus(() => bankRefs.current[available?.id || id]);
        }
      } else {
        const id = answers[target].at(-1);
        if (id) {
          audio.playSound(
            targetLocked(target) ? "answer-" + target : "bank-" + id,
            soundFor(token(id).value),
          );
          remove(target, id);
        }
      }
    },
    onKeyUp: release,
    style: {
      position: "relative",
      borderRadius: 4,
      ...(!multiple && results[target]
        ? {
            borderBottomColor:
              results[target] === "correct" ? "#16a34a" : "#ef4444",
          }
        : {}),
      ...(over && !targetLocked(target)
        ? {
            outline: "3px dashed #2563eb",
            outlineOffset: 2,
            backgroundColor: "#dbeafe",
          }
        : {}),
    },
  });
  const evaluate = () => {
    clearSelection();
    audio.stopAudio();
    const next = multiple
      ? Object.fromEntries(
          Object.entries(answers).flatMap(([target, ids]) =>
            ids.map((id) => [
              id,
              isCorrect(target, token(id)) ? "correct" : "wrong",
            ]),
          ),
        )
      : Object.fromEntries(
          targets.map((target) => [
            target,
            results[target] === "correct" ||
            (answers[target].length &&
              isCorrect(String(target), token(answers[target][0])))
              ? "correct"
              : "wrong",
          ]),
        );
    setResults(next);
    return next;
  };
  const show = (solved) => {
    clearSelection();
    audio.stopAudio();
    setAnswers(solved);
    setResults(
      multiple
        ? Object.fromEntries(tokens.map((t) => [t.id, "correct"]))
        : Object.fromEntries(targets.map((t) => [t, "correct"])),
    );
    setRevealed(true);
    setMessage("Correct answers shown and locked.");
  };
  const reset = () => {
    clearSelection();
    audio.stopAudio();
    setAnswers(Object.fromEntries(targets.map((id) => [id, []])));
    setResults({});
    setRevealed(false);
    setMessage("Activity reset.");
  };
  return {
    ...audio,
    answers,
    results,
    revealed,
    picked,
    message,
    setMessage,
    token,
    itemLocked,
    targetLocked,
    used,
    place,
    remove,
    bankProps,
    slotProps,
    evaluate,
    show,
    reset,
    clearSelection,
    cancel,
    bankRefs,
    slotRefs,
  };
}
function useDragState(place, clear) {
  const [active, setActive] = useState(null),
    current = useRef(null);
  const stop = () => {
    current.current = null;
    setActive(null);
    clear();
  };
  return {
    active,
    stop,
    start: (e) => {
      clear();
      current.current = { id: e.active.id };
      const r = e.active.rect?.current?.initial;
      setActive({
        id: e.active.id,
        ...(r
          ? {
              width: r.width,
              height: r.height,
            }
          : {}),
      });
    },
    end: (e) => {
      const source = current.current;
      current.current = null;
      setActive(null);
      if (!source || source.id !== e.active.id || !e.over) return;
      // pointerWithin uses the current viewport coordinates, including after scrolling.
      // Drag delta also includes scroll adjustment and must not be added to the pointer.
      place(String(e.over.id), e.active.id);
    },
    cancel: stop,
  };
}
function DragPreview({ drag, className, children }) {
  return createPortal(
    <DragOverlay
      style={{
        zIndex: 2147483647,
      }}
      dropAnimation={null}
    >
      {drag.active ? (
        <div
          className={className}
          style={{
            width: drag.active.width,
            height: drag.active.height,
            boxSizing: "border-box",
            pointerEvents: "none",
          }}
        >
          {children}
        </div>
      ) : null}
    </DragOverlay>,
    document.fullscreenElement || document.body,
  );
}
const SENTENCES_J = [
  {
    id: "j1",
    text: "She has four pairs of shoes.",
  },
  {
    id: "j2",
    text: "She has four shirts.",
  },
  {
    id: "j3",
    text: "She has five skirts.",
  },
];
const CORRECT_J = {
  q1: "j1",
  q2: "j2",
  q3: "j3",
};
function DraggableSentence({ item, isUsed, interaction, drag }) {
  const tokenId = item.id;
  const props = interaction.bankProps(tokenId);
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: tokenId,
    disabled: interaction.itemLocked(tokenId) || interaction.used(tokenId),
  });
  const isDragging = drag.active?.id === tokenId;
  isUsed = interaction.used(tokenId);
  const style = {
    ...props.style,
    touchAction: "none",
    opacity: isDragging ? 0 : interaction.used(tokenId) ? 0.5 : 1,
  };
  return (
    <div
      {...attributes}
      {...listeners}
      // 👇✨ هذا يمنع الكليك من أنه يتحول drag
      className={
        focusClass +
        " " +
        `p-3 bg-white border-2 border-gray-200 rounded-xl shadow-sm cursor-grab text-blue-700 font-medium text-[16px] touch-none ${
          // 👇✨ مهم: ما نخليها disabled إلا إذا فعلاً مستخدمة
          isUsed && !isDragging
            ? "bg-gray-50 text-gray-300 cursor-not-allowed"
            : "hover:border-blue-400 hover:shadow-md transition-all"
        }`
      }
      ref={(el) => {
        setNodeRef(el);
        interaction.bankRefs.current[tokenId] = el;
      }}
      {...props}
      style={{
        ...style,
      }}
    >
      {item.text}
      {interaction.playingKey === "bank-" + tokenId && <SpeakerBadge />}
    </div>
  );
}
function DropSlot({ id, content, interaction, drag }) {
  const { setNodeRef, isOver: over } = useDroppable({
    id,
    disabled: interaction.targetLocked(id),
  });
  const isOver = !!drag.active && over && !interaction.targetLocked(id);
  const props = interaction.slotProps(id, isOver);
  const isCorrect = interaction.results[id] === "correct",
    isSubmitted = !!interaction.results[id];
  return (
    <div
      className={
        focusClass +
        " focus-visible:rounded-sm! " +
        `w-full min-h-[45px] border-b-2 flex items-center justify-between px-4 transition-all duration-300
      
      border-blue-400
      
      // 🔥 Hover أثناء السحب
      ${isOver ? "bg-blue-100 border-blue-600" : ""}
      
      // ❌ غلط بعد التصحيح
      ${isSubmitted && !isCorrect ? "border-red-500 bg-white" : ""}
      `
      }
      ref={(el) => {
        setNodeRef(el);
        interaction.slotRefs.current[id] = el;
      }}
      {...props}
      style={{
        ...props.style,
        borderRadius: isOver ? 4 : 0,
      }}
    >
      {content ? (
        <>
          <span className="text-blue-900 font-bold text-lg">
            {SENTENCES_J.find((s) => s.id === content)?.text}
          </span>

          {isSubmitted && !isCorrect && (
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white text-sm font-bold shadow-sm border-2 border-white">
              ✕
            </div>
          )}
        </>
      ) : (
        <span className="text-gray-300 italic text-sm">
          Drop your answer here...
        </span>
      )}
      {interaction.playingKey === "answer-" + id && <SpeakerBadge />}
    </div>
  );
}
const WB_Unit8_Page49_Q1 = () => {
  const [shuffledItems, setShuffledItems] = useState(() =>
    [...SENTENCES_J].sort(() => Math.random() - 0.5),
  );
  const tokens = SENTENCES_J.map((t) => ({
      id: t.id,
      value: t.text,
    })),
    targets = Object.keys(CORRECT_J);
  const interaction = useDropAnswers(
    tokens,
    targets,
    (target, t) => t.id === CORRECT_J[target],
    false,
    {},
  );
  const { rootRef, message, playingKey, playSound } = interaction;
  const answers = Object.fromEntries(
    targets.map((id) => [id, interaction.answers[id][0] || null]),
  );
  const drag = useDragState(interaction.place, interaction.clearSelection);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );
  const complete = targets.every((id) => interaction.results[id] === "correct"),
    completionRef = useRef(false);
  completionRef.current = complete || interaction.revealed;
  useCheckButton(rootRef, complete || interaction.revealed);
  const checkAnswers = () => {
    if (completionRef.current) return;
    drag.stop();
    interaction.stopAudio();
    if (targets.some((id) => !interaction.answers[id].length)) {
      interaction.setMessage("Please complete all answers before checking.");
      ValidationAlert.info("Please complete all answers before checking.");
      return;
    }
    const result = interaction.evaluate(),
      score = Object.values(result).filter((r) => r === "correct").length;
    completionRef.current = score === targets.length;
    interaction.setMessage(
      "Score " +
        score +
        " out of " +
        targets.length +
        ". Correct answers are locked.",
    );
    showCheckFeedback(
      rootRef.current,
      score === targets.length ? "success" : score ? "warning" : "error",
      "Score: " + score + " / " + targets.length,
    );
  };
  const handleShowAnswer = () => {
    completionRef.current = true;
    drag.stop();
    interaction.show(
      Object.fromEntries(targets.map((id) => [id, [CORRECT_J[id]]])),
    );
  };
  const handleReset = () => {
    completionRef.current = false;
    drag.stop();
    interaction.reset();
    setShuffledItems([...SENTENCES_J].sort(() => Math.random() - 0.5));
  };
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={drag.start}
      onDragEnd={drag.end}
      onDragCancel={drag.cancel}
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
            marginBottom: "10px",
            gap: "20px",
          }}
        >
          <ExerciseHeader
            isWorkbook
            sectionLetter="J"
            title="Read, look, and write the answers."
            subTitle={
              "Count each clothing item once, then write the number in a complete How many...? answer."
            }
          />

          <div className="flex flex-col gap-8">
            <div className="w-full flex justify-center">
              <img
                src={imgBedroom}
                className="max-h-[300px] w-full object-cover rounded-2xl border-2 border-gray-900"
                alt={
                  IMAGE_DESCRIPTIONS[imgBedroom] ||
                  "Illustration for this exercise"
                }
              />
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-8">
                <div className="space-y-2">
                  <p className="text-gray-700 font-medium">
                    <AudioText
                      audioKey={"fragment-1"}
                      src={soundFor("How many pairs of shoes does she have?")}
                      playSound={playSound}
                      playingKey={playingKey}
                      tabIndex={interaction.picked ? -1 : 0}
                    >
                      {"1. How many pairs of shoes does she have?"}
                    </AudioText>
                  </p>
                  <DropSlot
                    id="q1"
                    content={answers.q1}
                    interaction={interaction}
                    drag={drag}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-gray-700 font-medium">
                    <AudioText
                      audioKey={"fragment-2"}
                      src={soundFor("How many shirts does she have?")}
                      playSound={playSound}
                      playingKey={playingKey}
                      tabIndex={interaction.picked ? -1 : 0}
                    >
                      {"2. How many shirts does she have?"}
                    </AudioText>
                  </p>
                  <DropSlot
                    id="q2"
                    content={answers.q2}
                    interaction={interaction}
                    drag={drag}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-gray-700 font-medium">
                    3. How many skirts does she have?
                  </p>
                  <DropSlot
                    id="q3"
                    content={answers.q3}
                    interaction={interaction}
                    drag={drag}
                  />
                </div>
              </div>

              <div className="w-full md:w-72 bg-blue-50 p-5 rounded-2xl border-2 border-blue-100 h-fit">
                <h3 className="font-bold text-blue-800 mb-4 text-center">
                  Answers Bank
                </h3>

                <div className="flex flex-col gap-3">
                  <SortableContext items={shuffledItems.map((s) => s.id)}>
                    {shuffledItems.map((s) => (
                      <DraggableSentence
                        key={s.id}
                        item={s}
                        interaction={interaction}
                        drag={drag}
                      />
                    ))}
                  </SortableContext>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              handleShowAnswer={handleShowAnswer}
              handleStartAgain={handleReset}
              checkAnswers={checkAnswers}
            />
          </div>
        </div>
      </div>

      <DragPreview
        drag={drag}
        className="p-3 bg-white border-2 border-blue-500 rounded-xl shadow-2xl text-blue-700 font-bold text-sm scale-105"
      >
        {tokens.find((t) => t.id === drag.active?.id)?.value}
      </DragPreview>
    </DndContext>
  );
};
export default WB_Unit8_Page49_Q1;

/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 8/Page 47 - G/Item_001_two.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 8/Page 47 - G/Item_002_I_don't_have.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 8/Page 47 - G/Item_003_I_have.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 8/Page 47 - G/Item_004_has.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 8/Page 47 - G/Item_005_doesn't_have.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 8/Page 47 - G/Item_006_Hello!_This_is_my_closet._I_have.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 8/Page 47 - G/Item_007_shirts,_but.mp3";
import clip7 from "../../../assets/audio/WorkBook/Unit 8/Page 47 - G/Item_008_any.mp3";
import clip8 from "../../../assets/audio/WorkBook/Unit 8/Page 47 - G/Item_009_skirts.mp3";
import clip9 from "../../../assets/audio/WorkBook/Unit 8/Page 47 - G/Item_010_a_big_hat._It.mp3";
import clip10 from "../../../assets/audio/WorkBook/Unit 8/Page 47 - G/Item_011_a_feather.mp3";
import clip11 from "../../../assets/audio/WorkBook/Unit 8/Page 47 - G/Item_012_This_is_John's_closet._He.mp3";
import clip12 from "../../../assets/audio/WorkBook/Unit 8/Page 47 - G/Item_013_a_tie._He.mp3";
import clip13 from "../../../assets/audio/WorkBook/Unit 8/Page 47 - G/Item_014_a_cap._He.mp3";
import clip14 from "../../../assets/audio/WorkBook/Unit 8/Page 47 - G/Item_015_a_pair_of_pants.mp3";
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
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import imgSueClosetG from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 47/Ex G 1.svg";
import imgJohnClosetG from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 47/Ex G 2.svg";
import imgSue from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 47/Ex G 3.svg";
const IMAGE_DESCRIPTIONS = {
  [imgSueClosetG]: "An open blue wardrobe with clothes and hats.",
  [imgJohnClosetG]: "An open wardrobe containing clothes.",
  [imgSue]: "A girl with a headband.",
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
  two: clip0,
  "i don't have": clip1,
  "i have": clip2,
  has: clip3,
  "doesn't have": clip4,
  "hello this is my closet i have": clip5,
  "shirts but": clip6,
  any: clip7,
  skirts: clip8,
  "a big hat it": clip9,
  "a feather": clip10,
  "this is john's closet he": clip11,
  "a tie he": clip12,
  "a cap he": clip13,
  "a pair of pants": clip14,
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
const WORD_LIMITS = {
  g1: 1,
  g2: 1,
  g3: 1,
  g4: 3,
  // 👈 has
  g5: 1,
  g6: 1,
  g7: 1,
};
const WORDS_G = [
  {
    id: "g1",
    text: "two",
  },
  {
    id: "g2",
    text: "I don't have",
  },
  {
    id: "g3",
    text: "I have",
  },
  {
    id: "g4",
    text: "has",
  },
  // 👈 وحدة بس
  {
    id: "g5",
    text: "doesn't have",
  },
];
const CORRECT_G = {
  g1: "g1",
  g2: "g2",
  g3: "g3",
  g4: "g4",
  g5: "g5",
  g6: "g4",
  // 👈 has
  g7: "g4", // 👈 has
};
function DraggableWord({ item, isUsed, isDisabled, interaction, drag }) {
  const tokenId = item.id;
  const props = interaction.bankProps(tokenId);
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: tokenId,
    disabled: interaction.itemLocked(tokenId) || interaction.used(tokenId),
  });
  const isDragging = drag.active?.id === tokenId;
  isUsed = interaction.used(tokenId);
  isDisabled = isUsed;
  const style = {
    ...props.style,
    touchAction: "none",
    opacity: isDragging ? 0 : interaction.used(tokenId) ? 0.5 : 1,
    padding: "5px 23px",
  };
  return (
    <div
      {...attributes}
      {...listeners}
      // 👇🔥 يمنع الكليك نهائياً
      className={
        focusClass +
        " " +
        `WB-word-bank ${isDisabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border-blue-900 text-blue-900 cursor-grab hover:bg-blue-100"}`
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
function DropSlotG({ id, content, interaction, drag }) {
  const { setNodeRef, isOver: over } = useDroppable({
    id,
    disabled: interaction.targetLocked(id),
  });
  const isOver = !!drag.active && over && !interaction.targetLocked(id);
  const props = interaction.slotProps(id, isOver);
  const isWrong = interaction.results[id] === "wrong";
  return (
    <div className="relative inline-block">
      <div
        className={
          focusClass +
          " focus-visible:rounded-sm! " +
          `inline-block min-w-[80px] h-7 border-b-2 mx-1 px-1 text-center align-bottom transition-all ${isWrong ? "border-red-500" : isOver ? "border-blue-900 bg-blue-50" : "border-blue-400"}`
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
          <span className="font-bold text-lg text-blue-800">
            {WORDS_G.find((w) => w.id === content).text}
          </span>
        ) : (
          <span className="text-gray-200 italic text-xs">____</span>
        )}
        {interaction.playingKey === "answer-" + id && <SpeakerBadge />}
      </div>

      {isWrong && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow border-2 border-white">
          ✕
        </div>
      )}
    </div>
  );
}
const WB_Unit8_Page47_Q2 = () => {
  const tokens = WORDS_G.map((t) => ({
      id: t.id,
      value: t.text,
    })),
    targets = Object.keys(CORRECT_G);
  const interaction = useDropAnswers(
    tokens,
    targets,
    (target, t) => t.id === CORRECT_G[target],
    false,
    WORD_LIMITS,
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
      Object.fromEntries(targets.map((id) => [id, [CORRECT_G[id]]])),
    );
  };
  const handleReset = () => {
    completionRef.current = false;
    drag.stop();
    interaction.reset();
  };
  //.
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
            gap: "10px",
          }}
        >
          <div className="mb-10">
            <ExerciseHeader
              isWorkbook
              sectionLetter="G"
              title="Read and write."
              subTitle={"Read the whole sentence first, then use the picture or word bank to complete the clothing and quantities answer."}
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="flex flex-col gap-8">
              <div className="flex flex-wrap justify-center gap-2 rounded-xl ">
                {WORDS_G.map((w) => (
                  <DraggableWord
                    key={w.id}
                    item={w}
                    interaction={interaction}
                    drag={drag}
                  />
                ))}
              </div>
              {/* فقرة سو */}
              <div className="flex-1 space-y-6">
                <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 relative shadow-sm">
                  <p className="text-lg leading-relaxed">
                    <AudioText
                      audioKey={"fragment-1"}
                      src={soundFor("Hello! This is my closet. I have")}
                      playSound={playSound}
                      playingKey={playingKey}
                      tabIndex={interaction.picked ? -1 : 0}
                    >
                      {"Hello! This is my closet. I have"}
                    </AudioText>{" "}
                    <DropSlotG
                      id="g1"
                      content={answers.g1}
                      interaction={interaction}
                      drag={drag}
                    />{" "}
                    <AudioText
                      audioKey={"fragment-2"}
                      src={soundFor("shirts, but")}
                      playSound={playSound}
                      playingKey={playingKey}
                      tabIndex={interaction.picked ? -1 : 0}
                    >
                      {"shirts, but"}
                    </AudioText>{" "}
                    <DropSlotG
                      id="g2"
                      content={answers.g2}
                      interaction={interaction}
                      drag={drag}
                    />{" "}
                    <>
                      <AudioText
                        audioKey={"fragment-any"}
                        src={soundFor("any")}
                        playSound={playSound}
                        playingKey={playingKey}
                        tabIndex={interaction.picked ? -1 : 0}
                      >
                        {"any"}
                      </AudioText>{" "}
                      <AudioText
                        audioKey={"fragment-skirts"}
                        src={soundFor("skirts")}
                        playSound={playSound}
                        playingKey={playingKey}
                        tabIndex={interaction.picked ? -1 : 0}
                      >
                        {"skirts."}
                      </AudioText>
                    </>
                    <DropSlotG
                      id="g3"
                      content={answers.g3}
                      interaction={interaction}
                      drag={drag}
                    />{" "}
                    <AudioText
                      audioKey={"fragment-3"}
                      src={soundFor("a big hat. It")}
                      playSound={playSound}
                      playingKey={playingKey}
                      tabIndex={interaction.picked ? -1 : 0}
                    >
                      {"a big hat. It"}
                    </AudioText>{" "}
                    <DropSlotG
                      id="g4"
                      content={answers.g4}
                      interaction={interaction}
                      drag={drag}
                    />{" "}
                    <AudioText
                      audioKey={"fragment-4"}
                      src={soundFor("a feather.")}
                      playSound={playSound}
                      playingKey={playingKey}
                      tabIndex={interaction.picked ? -1 : 0}
                    >
                      {"a feather."}
                    </AudioText>
                  </p>
                  <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[15px] border-t-transparent border-l-[20px] border-l-gray-200 border-b-[15px] border-b-transparent"></div>
                </div>

                <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 relative shadow-sm">
                  <p className="text-lg leading-relaxed">
                    <AudioText
                      audioKey={"fragment-5"}
                      src={soundFor("This is John's closet. He")}
                      playSound={playSound}
                      playingKey={playingKey}
                      tabIndex={interaction.picked ? -1 : 0}
                    >
                      {"This is John's closet. He"}
                    </AudioText>
                    <DropSlotG
                      id="g5"
                      content={answers.g5}
                      interaction={interaction}
                      drag={drag}
                    />{" "}
                    <AudioText
                      audioKey={"fragment-6"}
                      src={soundFor("a tie. He")}
                      playSound={playSound}
                      playingKey={playingKey}
                      tabIndex={interaction.picked ? -1 : 0}
                    >
                      {"a tie. He"}
                    </AudioText>{" "}
                    <DropSlotG
                      id="g6"
                      content={answers.g6}
                      interaction={interaction}
                      drag={drag}
                    />{" "}
                    <AudioText
                      audioKey={"fragment-7"}
                      src={soundFor("a cap. He")}
                      playSound={playSound}
                      playingKey={playingKey}
                      tabIndex={interaction.picked ? -1 : 0}
                    >
                      {"a cap. He"}
                    </AudioText>{" "}
                    <DropSlotG
                      id="g7"
                      content={answers.g7}
                      interaction={interaction}
                      drag={drag}
                    />{" "}
                    <AudioText
                      audioKey={"fragment-8"}
                      src={soundFor("a pair of pants.")}
                      playSound={playSound}
                      playingKey={playingKey}
                      tabIndex={interaction.picked ? -1 : 0}
                    >
                      {"a pair of pants."}
                    </AudioText>
                  </p>
                  <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[15px] border-t-transparent border-l-[20px] border-l-gray-200 border-b-[15px] border-b-transparent"></div>
                </div>
              </div>
            </div>
            {/* الشخصية والخزائن */}
            <div className="flex flex-col items-center gap-4">
              <img
                src={imgSue}
                className="max-w-40 max-h-40"
                alt={
                  IMAGE_DESCRIPTIONS[imgSue] || "Illustration for this exercise"
                }
              />
            </div>

            <div className="flex flex-col gap-4">
              <img
                src={imgSueClosetG}
                className="max-w-48 max-h-48 rounded-xl border shadow-sm"
                alt={
                  IMAGE_DESCRIPTIONS[imgSueClosetG] ||
                  "Illustration for this exercise"
                }
              />
              <img
                src={imgJohnClosetG}
                className="max-w-48 max-h-48 rounded-xl border shadow-sm"
                alt={
                  IMAGE_DESCRIPTIONS[imgJohnClosetG] ||
                  "Illustration for this exercise"
                }
              />
            </div>
          </div>

          <div className="mt-10 flex justify-center">
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
        className="px-3 py-1 bg-white border-2 border-blue-500 rounded-lg shadow-xl text-blue-600 font-bold text-xs"
      >
        {tokens.find((t) => t.id === drag.active?.id)?.value}
      </DragPreview>
    </DndContext>
  );
};
export default WB_Unit8_Page47_Q2;

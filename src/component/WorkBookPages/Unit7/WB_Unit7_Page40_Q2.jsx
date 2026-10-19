/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 7/Page 40 - D/Item_001_What_time_is_it.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 7/Page 40 - D/Item_002_It_is_four_thirty_in_the_afternoon.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 7/Page 40 - D/Item_003_It's_eight_o'clock.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 7/Page 40 - D/Item_004_It_is_one_o'clock_in_the.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 7/Page 40 - D/Item_005_It_is_twelve_o'clock.mp3";
import { createPortal } from "react-dom";
import React, { useState, useRef, useEffect } from "react";
import {
  DndContext,
  useDraggable,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  // 🔧 إضافة
  MouseSensor,
  // 🔧 إضافة
  DragOverlay,
  useDroppable, // 🔧 إضافة
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 40/Ex D 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 40/Ex D 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 40/Ex D 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 40/Ex D 4.svg";
const IMAGE_DESCRIPTIONS = {
  [img1]: "A smiling boy wearing a blue shirt.",
  [img2]: "A smiling girl wearing a purple shirt.",
  [img3]: "A smiling boy wearing a blue shirt.",
  [img4]: "A smiling girl wearing a purple shirt.",
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
const SOUNDS = {
  "what time is it": clip0,
  "it is four thirty in the afternoon": clip1,
  "it's eight o'clock": clip2,
  "it is one o'clock in the": clip3,
  "it is twelve o'clock": clip4,
};
const normalized = (text) =>
  String(text)
    .toLowerCase()
    .replaceAll("’", "'")
    .replace(/:/g, " ")
    .replace(/[.,!?]/g, "")
    .replace(/\s+/g, " ")
    .trim();
const soundFor = (text) => SOUNDS[normalized(text)];
function useDropAnswers(tokens, targets, isCorrect, multiple = false) {
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
  const itemLocked = (id) =>
    revealed ||
    Object.entries(answers).some(
      ([target, ids]) =>
        ids.includes(id) && results[resultKey(target, id)] === "correct",
    );
  const used = (id) =>
    Object.entries(answers).some(
      ([target, ids]) =>
        ids.includes(id) && results[resultKey(target, id)] !== "wrong",
    );
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
      Object.entries(answers).map(([key, ids]) => [
        key,
        ids.filter((t) => t !== id),
      ]),
    );
    next[target] = multiple ? [...next[target], id] : [id];
    setAnswers(next);
    setResults((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(([key]) =>
          multiple ? key !== id : key !== target && !answers[key]?.includes(id),
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
      current.current = e.active.id;
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
      const id = current.current;
      current.current = null;
      setActive(null);
      if (id === e.active.id && e.over) place(e.over.id, id);
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
const images = [
  {
    id: "img1",
    src: img1,
  },
  {
    id: "img2",
    src: img2,
  },
  {
    id: "img3",
    src: img3,
  },
  {
    id: "img4",
    src: img4,
  },
];
const QUESTIONS = [
  {
    id: "q1",
    text: "1 What time is it?",
  },
  {
    id: "q2",
    text: "2 What time is it?",
  },
  {
    id: "q3",
    text: "3 What time is it?",
  },
  {
    id: "q4",
    text: "4 What time is it?",
  },
];
const ANSWERS_POOL = [
  {
    id: "a1",
    text: "It is four thirty in the afternoon",
  },
  {
    id: "a2",
    text: "It's eight o'clock",
  },
  {
    id: "a3",
    text: "It is one o'clock in the",
  },
  {
    id: "a4",
    text: "It is twelve o'clock",
  },
];
const CORRECT_MAP = {
  q1: "a1",
  q2: "a4",
  q3: "a2",
  q4: "a3",
};
const DraggableSentence = ({ answer, interaction, drag }) => {
  const id = answer.id,
    isUsed = interaction.used(id);
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
    disabled: interaction.itemLocked(id) || isUsed,
  });
  const props = interaction.bankProps(id);
  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        interaction.bankRefs.current[id] = el;
      }}
      {...attributes}
      {...listeners}
      {...props}
      className={
        `p-3 md:p-2 border rounded shadow-sm text-base md:text-sm transition touch-none ${isUsed ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60" : "bg-white text-blue-700 cursor-grab hover:border-blue-500"}` +
        " " +
        focusClass
      }
      style={{
        ...props.style,
        touchAction: "none",
        opacity: drag.active?.id === id ? 0 : isUsed ? 0.5 : 1,
      }}
    >
      {answer.text}
      {interaction.playingKey === "bank-" + id && <SpeakerBadge />}
    </div>
  );
};

// 🔧 استبدلنا useSortable بـ useDroppable
const AnswerDropZone = ({ id, content, interaction, drag }) => {
  const target = String(id);
  const { setNodeRef, isOver } = useDroppable({
    id: target,
    disabled: interaction.targetLocked(target),
  });
  const props = interaction.slotProps(target, isOver && !!drag.active);
  const wrong = interaction.results[target] === "wrong";
  return (
    <div className="relative">
      <div
        ref={(el) => {
          setNodeRef(el);
          interaction.slotRefs.current[target] = el;
        }}
        {...props}
        className={
          "mt-1 min-h-[40px] border-b-2 p-2 transition-all bg-gray-50 border-gray-300" +
          " " +
          focusClass +
          " focus-visible:rounded-sm!"
        }
        style={{
          ...props.style,
          borderRadius: isOver && drag.active ? 4 : 0,
        }}
      >
        {content ? (
          <span className="text-blue-800 font-medium">
            {ANSWERS_POOL.find((a) => a.id === content).text}
          </span>
        ) : (
          <span className="text-gray-300 italic text-sm">
            Drag answer here...
          </span>
        )}
        {interaction.playingKey === "answer-" + target && <SpeakerBadge />}
      </div>
      {wrong && (
        <div
          aria-hidden="true"
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-md z-10 border-2 border-white"
        >
          <span className="text-white text-xs font-bold leading-none">✕</span>
        </div>
      )}
    </div>
  );
};
const WB_Unit7_Page40_Q2 = () => {
  const tokens = ANSWERS_POOL.map((a) => ({
      id: a.id,
      value: a.text,
    })),
    targets = Object.keys(CORRECT_MAP);
  const interaction = useDropAnswers(
    tokens,
    targets,
    (target, t) => t.id === CORRECT_MAP[target],
  );
  const { rootRef, message, playingKey, playSound } = interaction;
  const placedAnswers = Object.fromEntries(
    targets.map((id) => [id, interaction.answers[id][0] || null]),
  );
  const drag = useDragState(
    (target, id) => interaction.place(String(target).replace(/^drop-/, ""), id),
    interaction.clearSelection,
  );
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
  );
  const complete = targets.every((id) => interaction.results[id] === "correct");
  const completionRef = useRef(false);
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
    drag.stop();
    interaction.show(
      Object.fromEntries(targets.map((id) => [id, [CORRECT_MAP[id]]])),
    );
  };
  const handleTryAgain = () => {
    drag.stop();
    interaction.reset();
  };
  const checked = Object.keys(interaction.results).length > 0;
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
          gap: "10px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="D"
          title="Look and complete the conversations."
          subTitle={
            "Use the clock and time-of-day clue together, then complete each conversation."
          }
        />

        <DndContext
          sensors={sensors}
          onDragStart={drag.start}
          onDragEnd={drag.end}
          onDragCancel={drag.cancel}
        >
          <div className="p-6 max-w-5xl flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-6">
              {QUESTIONS.map((q, index) => (
                <div key={q.id} className="flex items-center gap-4 pl-4">
                  <img
                    src={images[index].src}
                    className="max-w-45 max-h-24 object-contain"
                    alt={
                      IMAGE_DESCRIPTIONS[images[index].src] ||
                      "Illustration for this exercise"
                    }
                  />

                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      <AudioText
                        audioKey={"question-" + q.id}
                        src={soundFor(q.text.replace(/^\d+\s*/, ""))}
                        playSound={playSound}
                        playingKey={playingKey}
                        tabIndex={interaction.picked ? -1 : 0}
                      >
                        {q.text}
                      </AudioText>
                    </p>

                    <AnswerDropZone
                      id={q.id}
                      content={placedAnswers[q.id]}
                      isCorrect={placedAnswers[q.id] === CORRECT_MAP[q.id]}
                      isSubmitted={checked}
                      interaction={interaction}
                      drag={drag}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full md:w-65 space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <h3 className="font-bold text-blue-800 mb-3 text-center">
                  Answers Bank
                </h3>

                <div className="space-y-2">
                  <SortableContext items={ANSWERS_POOL.map((a) => a.id)}>
                    {ANSWERS_POOL.map((ans) => (
                      <DraggableSentence
                        key={ans.id}
                        answer={ans}
                        interaction={interaction}
                        drag={drag}
                      />
                    ))}
                  </SortableContext>
                </div>
              </div>
            </div>
          </div>

          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleTryAgain}
            checkAnswers={checkAnswers}
          />

          {/* 🔧 تحسين overlay */}
          <DragPreview
            drag={drag}
            className="WB-word-bank px-4 py-2 shadow-lg bg-white"
          >
            {tokens.find((t) => t.id === drag.active?.id)?.value}
          </DragPreview>
        </DndContext>
      </div>
    </div>
  );
};
export default WB_Unit7_Page40_Q2;

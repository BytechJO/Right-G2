/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 6/Page 33 - B/Item_001_What_time_does_she_have_lunch.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 6/Page 33 - B/Item_002_What_time_does_she_go_to_school.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 6/Page 33 - B/Item_003_What_time_does_she_get_up.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 6/Page 33 - B/Item_004_What_time_do_they_do_their_homework.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 6/Page 33 - B/Item_005_What_time_do_they_go_home.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 6/Page 33 - B/Item_006_What_time_do_they_have_dinner.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 6/Page 33 - B/Item_007_She_has_lunch_at_twelve_o'clock.mp3";
import clip7 from "../../../assets/audio/WorkBook/Unit 6/Page 33 - B/Item_008_She_goes_to_school_at_7_30.mp3";
import clip8 from "../../../assets/audio/WorkBook/Unit 6/Page 33 - B/Item_009_She_gets_up_at_6_00.mp3";
import clip9 from "../../../assets/audio/WorkBook/Unit 6/Page 33 - B/Item_010_They_do_their_homework_at_4_00.mp3";
import clip10 from "../../../assets/audio/WorkBook/Unit 6/Page 33 - B/Item_011_They_go_home_at_2_00.mp3";
import clip11 from "../../../assets/audio/WorkBook/Unit 6/Page 33 - B/Item_012_They_have_dinner_at_8_30.mp3";
import clip12 from "../../../assets/audio/WorkBook/Unit 6/Page 33 - B/Item_013_get_up.mp3";
import clip13 from "../../../assets/audio/WorkBook/Unit 6/Page 33 - B/Item_014_wash_face.mp3";
import clip14 from "../../../assets/audio/WorkBook/Unit 6/Page 33 - B/Item_015_have_lunch.mp3";
import { createPortal } from "react-dom";
import React, { useState, useRef, useEffect } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 33/Asset 19.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 33/Asset 20.svg";
const IMAGE_DESCRIPTIONS = {
  [img1]: "A girl with brown pigtails wearing a blue shirt.",
  [img2]: "A girl with brown pigtails wearing a blue shirt.",
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
  "what time does she have lunch": clip0,
  "what time does she go to school": clip1,
  "what time does she get up": clip2,
  "what time do they do their homework": clip3,
  "what time do they go home": clip4,
  "what time do they have dinner": clip5,
  "she has lunch at twelve o'clock": clip6,
  "she goes to school at 7 30": clip7,
  "she gets up at 6 00": clip8,
  "they do their homework at 4 00": clip9,
  "they go home at 2 00": clip10,
  "they have dinner at 8 30": clip11,
  "get up": clip12,
  "wash face": clip13,
  "have lunch": clip14,
};
const normalized = (text) =>
  String(text)
    .toLowerCase()
    .replaceAll("’", "'")
    .replaceAll("â€™", "'")
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
      const id = answers[target].findLast((id) => !itemLocked(id));
      if (id) remove(target, id);
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
      if (e.repeat || targetLocked(target)) return;
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
        const id = answers[target].findLast((id) => !itemLocked(id));
        if (id) remove(target, id);
      }
    },
    onKeyUp: release,
    style: {
      position: "relative",
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
const QUESTIONS = [
  {
    id: "q1",
    text: "1 What time does she have lunch?",
  },
  {
    id: "q2",
    text: "2 What time does she go to school?",
  },
  {
    id: "q3",
    text: "3 What time does she get up?",
  },
  {
    id: "q4",
    text: "4 What time do they do their homework?",
  },
  {
    id: "q5",
    text: "5 What time do they go home?",
  },
  {
    id: "q6",
    text: "6 What time do they have dinner?",
  },
];
const ANSWERS_POOL = [
  {
    id: "a1",
    text: "She has lunch at twelve o'clock.",
  },
  {
    id: "a2",
    text: "She goes to school at 7:30.",
  },
  {
    id: "a3",
    text: "She gets up at 6:00.",
  },
  {
    id: "a4",
    text: "They do their homework at 4:00.",
  },
  {
    id: "a5",
    text: "They go home at 2:00.",
  },
  {
    id: "a6",
    text: "They have dinner at 8:30.",
  },
];
const CORRECT_MAP = {
  q1: "a1",
  q2: "a2",
  q3: "a3",
  q4: "a4",
  q5: "a5",
  q6: "a6",
};
function DraggableSentence({ answer, isUsed, interaction }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: answer.id,
    disabled: interaction.itemLocked(answer.id) || interaction.used(answer.id),
  });
  const props = interaction.bankProps(answer.id);
  const style = {
    ...props.style,
    touchAction: "none",
    opacity: isDragging ? 0 : isUsed ? 0.5 : 1,
  };
  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        interaction.bankRefs.current[answer.id] = el;
      }}
      {...props}
      style={style}
      {...attributes}
      {...listeners}
      className={`${focusClass} w-full p-2 border rounded shadow-sm text-sm transition
        ${isUsed ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-blue-700 cursor-grab hover:border-blue-500"}`}
    >
      {answer.text}
      {interaction.playingKey === "bank-" + answer.id && <SpeakerBadge />}
    </div>
  );
}
function AnswerDropZone({ id, content, interaction }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    disabled: interaction.targetLocked(id),
  });
  const props = interaction.slotProps(id, isOver);
  const isWrong = interaction.results[id] === "wrong";
  const bg =
    isOver && !interaction.targetLocked(id)
      ? "bg-blue-50 border-blue-400"
      : "bg-gray-50 border-gray-300";
  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        interaction.slotRefs.current[id] = el;
      }}
      {...props}
      style={{
        ...props.style,
        borderRadius: 0,
      }}
      className={`${focusClass} focus-visible:rounded-sm! relative mt-1 min-h-[40px] border-b-2 p-2 transition-all ${bg}`}
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

      {/* ✕ إذا الجواب غلط */}
      {isWrong && (
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow border-2 border-white">
          <span className="text-white text-sm font-bold">✕</span>
        </div>
      )}
    </div>
  );
}
const WB_Unit6_Page33_Q2 = () => {
  const tokens = ANSWERS_POOL.map((t) => ({
      id: t.id,
      value: t.text,
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
  const isSubmitted = Object.keys(interaction.results).length > 0;
  const [activeId, setActiveId] = useState(null),
    [dragSize, setDragSize] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
  );
  const handleDragStart = (e) => {
    interaction.clearSelection();
    setActiveId(e.active.id);
    const r = e.active.rect?.current?.initial;
    setDragSize(
      r
        ? {
            width: r.width,
            height: r.height,
          }
        : null,
    );
  };
  const handleDragEnd = (e) => {
    setActiveId(null);
    if (e.over) interaction.place(e.over.id, e.active.id);
  };
  const complete = targets.every((id) => interaction.results[id] === "correct");
  useCheckButton(rootRef, complete || interaction.revealed);
  const checkAnswers = () => {
    if (complete || interaction.revealed) return;
    interaction.clearSelection();
    interaction.stopAudio();
    if (targets.some((id) => !interaction.answers[id].length)) {
      interaction.setMessage("Please complete all answers before checking.");
      ValidationAlert.info("Please complete all answers before checking.");
      return;
    }
    const result = interaction.evaluate(),
      score = Object.values(result).filter((r) => r === "correct").length;
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
    setActiveId(null);
    interaction.show(
      Object.fromEntries(targets.map((id) => [id, [CORRECT_MAP[id]]])),
    );
  };
  const handleReset = () => {
    setActiveId(null);
    interaction.reset();
  };
  return (
    <div ref={rootRef} className="main-container-component">
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {message}
      </div>
      <div
        className="div-forall mb-10"
        style={{
          gap: "25px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="B"
          title={<>Read and write.</>}
          subTitle={
            "Use the timetable first, then answer each What time...? question with the matching time."
          }
        />

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragCancel={() => {
            setActiveId(null);
            interaction.clearSelection();
          }}
          onDragEnd={handleDragEnd}
        >
          <div className="p-6 max-w-5xl flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-6">
              {QUESTIONS.map((q) => (
                <div key={q.id} className="border-l-4 border-blue-500 pl-4">
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
                    interaction={interaction}
                    id={q.id}
                    content={placedAnswers[q.id]}
                    isCorrect={placedAnswers[q.id] === CORRECT_MAP[q.id]}
                    isSubmitted={isSubmitted}
                  />
                </div>
              ))}
            </div>

            {/* القسم الأيمن: بنك الإجابات والجداول المساعدة */}
            <div className="flex flex-col items-center w-full md:w-90 space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <h3 className="font-bold text-blue-800 mb-3 text-center">
                  Answers Bank
                </h3>
                <div className="space-y-2">
                  <SortableContext items={ANSWERS_POOL.map((a) => a.id)}>
                    {["a4", "a1", "a6", "a2", "a5", "a3"]
                      .map((id) => ANSWERS_POOL.find((a) => a.id === id))
                      .map((ans) => (
                        <DraggableSentence
                          interaction={interaction}
                          key={ans.id}
                          answer={ans}
                          isUsed={interaction.used(ans.id)}
                        />
                      ))}
                  </SortableContext>
                </div>
              </div>

              <img
                src={img1}
                style={{
                  height: "200px",
                  width: "70%",
                }}
                alt={IMAGE_DESCRIPTIONS[img1]}
              />

              <img
                src={img2}
                style={{
                  height: "200px",
                  width: "70%",
                }}
                alt={IMAGE_DESCRIPTIONS[img2]}
              />
            </div>
          </div>

          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleReset}
            checkAnswers={checkAnswers}
          />

          {createPortal(
            <DragOverlay
              style={{
                zIndex: 2147483647,
              }}
            >
              {activeId ? (
                <div
                  className="p-2 bg-white border-2 border-blue-500 rounded shadow-xl text-blue-800 text-sm font-bold"
                  style={{
                    ...dragSize,
                    boxSizing: "border-box",
                    pointerEvents: "none",
                  }}
                >
                  {ANSWERS_POOL.find((a) => a.id === activeId).text}
                </div>
              ) : null}
            </DragOverlay>,
            document.fullscreenElement || document.body,
          )}
        </DndContext>
      </div>
    </div>
  );
};
export default WB_Unit6_Page33_Q2;

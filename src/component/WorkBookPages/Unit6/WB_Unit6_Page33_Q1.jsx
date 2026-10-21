/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 6/Page 33 - A/Item_001_wash.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 6/Page 33 - A/Item_002_go.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 6/Page 33 - A/Item_003_say.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 6/Page 33 - A/Item_004_brush.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 6/Page 33 - A/Item_005_get_up.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 6/Page 33 - A/Item_006_eat.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 6/Page 33 - A/Item_007_at_six_o'clock.mp3";
import clip7 from "../../../assets/audio/WorkBook/Unit 6/Page 33 - A/Item_008_breakfast.mp3";
import clip8 from "../../../assets/audio/WorkBook/Unit 6/Page 33 - A/Item_009_goodbye_to_Mom_and_Dad_and.mp3";
import clip9 from "../../../assets/audio/WorkBook/Unit 6/Page 33 - A/Item_010_to_school.mp3";
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
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 33/Ex A 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 33/Ex A 2.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
const IMAGE_DESCRIPTIONS = {
  [img1]: "A girl stretching in bed.",
  [img2]: "A girl eating at a table.",
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
  wash: clip0,
  go: clip1,
  say: clip2,
  brush: clip3,
  "get up": clip4,
  eat: clip5,
  "at six o'clock": clip6,
  breakfast: clip7,
  "goodbye to mom and dad and": clip8,
  "to school": clip9,
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
const WORDS = [
  {
    id: "wash",
    text: "wash",
  },
  {
    id: "go",
    text: "go",
  },
  {
    id: "say",
    text: "say",
  },
  {
    id: "brush",
    text: "brush",
  },
  {
    id: "getup",
    text: "get up",
  },
  {
    id: "eat",
    text: "eat",
  },
];
const CORRECT_ANSWERS = {
  drop1: "getup",
  drop2: "brush",
  drop3: "wash",
  drop4: "eat",
  drop5: "say",
  drop6: "go",
};
function DraggableWord({ word, isUsed, interaction }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: word.id,
    disabled: interaction.itemLocked(word.id) || interaction.used(word.id),
  });
  const props = interaction.bankProps(word.id);
  const style = {
    ...props.style,
    touchAction: "none",
    opacity: isDragging ? 0 : isUsed ? 0.5 : 1,
    padding: "5px 23px",
  };
  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        interaction.bankRefs.current[word.id] = el;
      }}
      {...props}
      style={style}
      {...attributes}
      {...listeners}
      className={`${focusClass} WB-word-bank  ${isUsed ? "cursor-not-allowed bg-gray-100" : "hover:border-blue-400"}`}
    >
      {word.text}
      {interaction.playingKey === "bank-" + word.id && <SpeakerBadge />}
    </div>
  );
}
function DropSlot({ id, content, interaction }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    disabled: interaction.targetLocked(id),
  });
  const props = interaction.slotProps(id, isOver);
  const isWrong = interaction.results[id] === "wrong";
  return (
    <div className="relative inline-block align-bottom mx-1">
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
        className={`${focusClass} focus-visible:rounded-sm! inline-block min-w-[80px] h-8 border-b-2 px-2 text-center transition-colors ${isWrong && "border-red-500"}`}
      >
        {content ? (
          <span className="text-blue-700">
            {WORDS.find((w) => w.id === content).text}
          </span>
        ) : (
          <span className="text-transparent">____</span>
        )}
      </div>

      {isWrong && (
        <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-md border-2 border-white">
          <span className="text-white text-sm font-bold leading-none">✕</span>
        </div>
      )}
    </div>
  );
}
const WB_Unit6_Page33_Q1 = () => {
  const tokens = WORDS.map((t) => ({
      id: t.id,
      value: t.text,
    })),
    targets = Object.keys(CORRECT_ANSWERS);
  const interaction = useDropAnswers(
    tokens,
    targets,
    (target, t) => t.id === CORRECT_ANSWERS[target],
  );
  const { rootRef, message, playingKey, playSound } = interaction;
  const placedWords = Object.fromEntries(
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
      Object.fromEntries(targets.map((id) => [id, [CORRECT_ANSWERS[id]]])),
    );
  };
  const handleReset = () => {
    setActiveId(null);
    interaction.reset();
  };

  //....
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragCancel={() => {
        setActiveId(null);
        interaction.clearSelection();
      }}
      onDragEnd={handleDragEnd}
    >
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
          className="div-forall"
          style={{
            gap: "15px",
          }}
        >
          <ExerciseHeader
            isWorkbook
            sectionLetter="A"
            title={<>Describe Stella's day. Read and write.</>}
            subTitle={
              "Follow Stella's routine from morning onward, then use the word bank to complete each sentence."
            }
          />

          <div className="p-6 max-w-4xl mx-auto font-sans">
            <div className="flex flex-wrap justify-center gap-3 mb-6 w-full">
              <SortableContext items={WORDS.map((w) => w.id)}>
                {WORDS.map((word) => (
                  <DraggableWord
                    interaction={interaction}
                    key={word.id}
                    word={word}
                    isUsed={interaction.used(word.id)}
                  />
                ))}
              </SortableContext>
            </div>

            <div className="space-y-8">
              <div className="w-full gap-4">
                <img
                  src={img1}
                  className="max-h-28 object-contain"
                  alt={IMAGE_DESCRIPTIONS[img1]}
                />
              </div>

              <p className="text-xl leading-relaxed">
                I{" "}
                <DropSlot
                  interaction={interaction}
                  id="drop1"
                  content={placedWords.drop1}
                  isCorrect={placedWords.drop1 === CORRECT_ANSWERS.drop1}
                  isSubmitted={isSubmitted}
                />{" "}
                <AudioText
                  audioKey={"fragment-at six o'clock."}
                  src={soundFor("at six o'clock.")}
                  playSound={playSound}
                  playingKey={playingKey}
                  tabIndex={interaction.picked ? -1 : 0}
                >
                  {"at six o'clock."}
                </AudioText>{" "}
                I{" "}
                <DropSlot
                  interaction={interaction}
                  id="drop2"
                  content={placedWords.drop2}
                  isCorrect={placedWords.drop2 === CORRECT_ANSWERS.drop2}
                  isSubmitted={isSubmitted}
                />{" "}
                my teeth and{" "}
                <DropSlot
                  interaction={interaction}
                  id="drop3"
                  content={placedWords.drop3}
                  isCorrect={placedWords.drop3 === CORRECT_ANSWERS.drop3}
                  isSubmitted={isSubmitted}
                />{" "}
                my face.
              </p>

              <div className="w-full  gap-4">
                <img
                  src={img2}
                  className="max-h-28 object-contain"
                  alt={IMAGE_DESCRIPTIONS[img2]}
                />
              </div>

              <p className="text-xl leading-relaxed">
                I{" "}
                <DropSlot
                  interaction={interaction}
                  id="drop4"
                  content={placedWords.drop4}
                  isCorrect={placedWords.drop4 === CORRECT_ANSWERS.drop4}
                  isSubmitted={isSubmitted}
                />{" "}
                <AudioText
                  audioKey={"fragment-breakfast."}
                  src={soundFor("breakfast.")}
                  playSound={playSound}
                  playingKey={playingKey}
                  tabIndex={interaction.picked ? -1 : 0}
                >
                  {"breakfast."}
                </AudioText>{" "}
                I{" "}
                <DropSlot
                  interaction={interaction}
                  id="drop5"
                  content={placedWords.drop5}
                  isCorrect={placedWords.drop5 === CORRECT_ANSWERS.drop5}
                  isSubmitted={isSubmitted}
                />{" "}
                <AudioText
                  audioKey={"fragment-goodbye to Mom and Dad and"}
                  src={soundFor("goodbye to Mom and Dad and")}
                  playSound={playSound}
                  playingKey={playingKey}
                  tabIndex={interaction.picked ? -1 : 0}
                >
                  {"goodbye to Mom and Dad and"}
                </AudioText>{" "}
                <DropSlot
                  interaction={interaction}
                  id="drop6"
                  content={placedWords.drop6}
                  isCorrect={placedWords.drop6 === CORRECT_ANSWERS.drop6}
                  isSubmitted={isSubmitted}
                />{" "}
                <AudioText
                  audioKey={"fragment-to school."}
                  src={soundFor("to school.")}
                  playSound={playSound}
                  playingKey={playingKey}
                  tabIndex={interaction.picked ? -1 : 0}
                >
                  {"to school."}
                </AudioText>
              </p>
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
                  className="px-4 py-1 bg-white border-2 border-blue-500 rounded-full shadow-lg text-blue-600 font-bold"
                  style={{
                    ...dragSize,
                    boxSizing: "border-box",
                    pointerEvents: "none",
                  }}
                >
                  {WORDS.find((w) => w.id === activeId).text}
                </div>
              ) : null}
            </DragOverlay>,
            document.fullscreenElement || document.body,
          )}
        </div>
      </div>
    </DndContext>
  );
};
export default WB_Unit6_Page33_Q1;

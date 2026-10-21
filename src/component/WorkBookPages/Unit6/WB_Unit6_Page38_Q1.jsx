/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 6/Page 38 - A/Item_001_bike.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 6/Page 38 - A/Item_002_five.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 6/Page 38 - A/Item_003_kite.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 6/Page 38 - A/Item_004_light.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 6/Page 38 - A/Item_005_night.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 6/Page 38 - A/Item_006_tight.mp3";
import { createPortal } from "react-dom";
import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 38/Ex A 1.svg";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
const IMAGE_DESCRIPTIONS = {
  [img]:
    "Children at an outdoor campsite beside a lake, with a kite, bicycles and a numbered sign.",
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
  bike: clip0,
  five: clip1,
  kite: clip2,
  light: clip3,
  night: clip4,
  tight: clip5,
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
const DraggableWord = ({ word, used, interaction }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: word,
    disabled: interaction.itemLocked(word) || interaction.used(word),
  });
  const props = interaction.bankProps(word);
  const style = {
    ...props.style,
    touchAction: "none",
    opacity: isDragging ? 0 : used ? 0.5 : 1,
  };
  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        interaction.bankRefs.current[word] = el;
      }}
      {...props}
      {...listeners}
      {...attributes}
      style={style}
      className={`${focusClass} WB-word-bank
      ${used ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60" : "border-2 border-blue-900 cursor-grab hover:bg-blue-100"}`}
    >
      {word}
      {interaction.playingKey === "bank-" + word && <SpeakerBadge />}
    </div>
  );
};
const DropZone = ({ id, children, interaction }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    disabled: interaction.targetLocked(id),
  });
  const props = interaction.slotProps(id, isOver);
  const isWrong = interaction.results[id] === "wrong";
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
      className={`${focusClass} focus-visible:rounded-sm! relative flex items-center gap-3 p-1 border-b-2
      ${isWrong ? "border-red-500" : children ? "border-blue-300" : "border-dashed border-gray-300"}
      ${isOver ? "bg-blue-50" : ""}
    `}
    >
      {children}
    </div>
  );
};
const WB_Unit6_Page38_Q1 = () => {
  const correctAnswers = {
    1: "kite",
    2: "night",
    3: "bike",
    4: "five",
    5: "tight",
    6: "light",
  };
  const wordBank = [
    {
      id: 1,
      word: "bike",
    },
    {
      id: 2,
      word: "five",
    },
    {
      id: 3,
      word: "kite",
    },
    {
      id: 4,
      word: "light",
    },
    {
      id: 5,
      word: "night",
    },
    {
      id: 6,
      word: "tight",
    },
  ];
  const tokens = wordBank.map((t) => ({
      id: t.word,
      value: t.word,
    })),
    targets = Object.keys(correctAnswers);
  const interaction = useDropAnswers(
    tokens,
    targets,
    (target, t) => t.id === correctAnswers[target],
  );
  const { rootRef, message } = interaction;
  const answers = Object.fromEntries(
    targets.map((id) => [id, interaction.answers[id][0] || null]),
  );
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
      Object.fromEntries(targets.map((id) => [id, [correctAnswers[id]]])),
    );
  };
  const handleReset = () => {
    setActiveId(null);
    interaction.reset();
  };
  const handleStartAgain = handleReset;
  const isWrongAnswer = (num) => interaction.results[num] === "wrong";
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
            gap: "25px",
          }}
        >
          {" "}
          <ExerciseHeader
            isWorkbook
            sectionLetter="A"
            title={<>Look, read, and write. Use the words from the box. </>}
            subTitle={"Read the whole sentence first, then use the picture or word bank to complete the daily routine and time answer."}
          />
          <div>
            {/* WORD BANK */}
            <div className="mb-6 flex items-center justify-center">
              <div className="flex flex-wrap gap-10 p-3 rounded-lg">
                {wordBank.map((item) => {
                  const isUsed = interaction.used(item.word);
                  return (
                    <DraggableWord
                      interaction={interaction}
                      key={item.id}
                      word={item.word}
                      used={isUsed}
                    />
                  );
                })}
              </div>
            </div>
            {/* QUESTIONS */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <img
                  src={img}
                  className="object-contain"
                  style={{
                    height: "300px",
                    width: "auto",
                  }}
                  alt={IMAGE_DESCRIPTIONS[img]}
                />
              </div>

              <div className="md:w-1/2">
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <DropZone
                      interaction={interaction}
                      key={num}
                      id={`${num}`}
                      isWrong={isWrongAnswer(num)}
                    >
                      <span className="text-xl text-blue-900 font-semibold w-8">
                        {num}.
                      </span>

                      <div className="flex-1 min-h-[45px] flex items-center">
                        {answers[num] ? (
                          <span className="text-lg font-medium text-blue-700">
                            {answers[num]}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            Drop word here
                          </span>
                        )}
                      </div>

                      {isWrongAnswer(num) && (
                        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shadow-md z-10 border-2 border-white">
                          <span className="text-white text-sm font-bold leading-none">
                            ✕
                          </span>
                        </div>
                      )}
                    </DropZone>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleStartAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
      {createPortal(
        <DragOverlay
          style={{
            zIndex: 2147483647,
          }}
        >
          {activeId ? (
            <div
              className="WB-word-bank px-4 py-2 shadow-lg bg-white"
              style={{
                ...dragSize,
                boxSizing: "border-box",
                pointerEvents: "none",
              }}
            >
              {activeId}
            </div>
          ) : null}
        </DragOverlay>,
        document.fullscreenElement || document.body,
      )}
    </DndContext>
  );
};
export default WB_Unit6_Page38_Q1;

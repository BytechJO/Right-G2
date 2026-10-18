/* eslint-disable react-refresh/only-export-components -- Keep exercise controls local. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 5/Page 32 - C/Item_001_bee.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 5/Page 32 - C/Item_002_leaf.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 5/Page 32 - C/Item_003_sheep.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 5/Page 32 - C/Item_004_sleep.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 5/Page 32 - C/Item_005_tree.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 5/Page 32 - C/Item_006_meat.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 5/Page 32 - C/Item_007_beach.mp3";
import clip7 from "../../../assets/audio/WorkBook/Unit 5/Page 32 - C/Item_008_read.mp3";
import clip8 from "../../../assets/audio/WorkBook/Unit 5/Page 32 - C/Item_009_feet.mp3";
import clip9 from "../../../assets/audio/WorkBook/Unit 5/Page 32 - C/Item_010_beak.mp3";
import { createPortal } from "react-dom";
// ExerciseC.jsx

import React, { useState, useRef, useEffect } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex C 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex C 2.svg";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
const wordBank = [
  "bee",
  "leaf",
  "sheep",
  "sleep",
  "tree",
  "meat",
  "beach",
  "read",
];
const correctAnswers = {
  feet: ["bee", "sheep", "sleep", "tree"],
  beak: ["leaf", "meat", "beach", "read"],
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
  bee: clip0,
  leaf: clip1,
  sheep: clip2,
  sleep: clip3,
  tree: clip4,
  meat: clip5,
  beach: clip6,
  read: clip7,
  feet: clip8,
  beak: clip9,
};
const normalized = (text) =>
  String(text)
    .toLowerCase()
    .replaceAll("’", "'")
    .replace(/[.,!?]/g, "")
    .trim()
    .replace(/\s+/g, " ");
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
      if (e.target !== e.currentTarget) return;
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
const DraggableWord = ({
  id,
  word,
  source = "bank",
  disabled,
  className,
  interaction,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: source + ":" + id,
    data: {
      tokenId: id,
      source,
    },
    disabled: disabled || (source === "bank" && interaction.used(id)),
  });
  const props = interaction.bankProps(id, source);
  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        if (source === "bank") interaction.bankRefs.current[id] = el;
      }}
      {...attributes}
      {...listeners}
      {...props}
      style={{
        ...props.style,
        touchAction: "none",
        opacity: isDragging ? 0 : undefined,
      }}
      className={className + " " + focusClass}
    >
      {word}
      {interaction.playingKey === source + "-" + id && <SpeakerBadge />}
    </div>
  );
};
const DropZone = ({ id, children, className, interaction }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    disabled:
      id === "bank" ? interaction.revealed : interaction.targetLocked(id),
  });
  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        if (id !== "bank") interaction.slotRefs.current[id] = el;
      }}
      {...(id === "bank" ? {} : interaction.slotProps(id, isOver))}
      className={className + (id === "bank" ? "" : " " + focusClass)}
    >
      {children}
    </div>
  );
};
const IMAGE_DESCRIPTIONS = {
  [img1]: "Two bare feet.",
  [img2]: "A chicken.",
};
export default function WB_Unit5_Page32_Q3() {
  const tokens = wordBank.map((value) => ({
      id: value,
      value,
    })),
    targets = ["feet", "beak"];
  const interaction = useDropAnswers(
    tokens,
    targets,
    (target, t) => correctAnswers[target].includes(t.value),
    true,
  );
  const { rootRef, message, playingKey, playSound } = interaction;
  const [activeItem, setActiveItem] = useState(null),
    [dragSize, setDragSize] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
  );
  const handleDndStart = (e) => {
    interaction.clearSelection();
    const t = interaction.token(e.active.data.current.tokenId);
    setActiveItem(t?.value || null);
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
  const handleDndEnd = (e) => {
    setActiveItem(null);
    if (e.over?.id === "bank" && e.active.data.current.source !== "bank")
      interaction.remove(
        e.active.data.current.source,
        e.active.data.current.tokenId,
      );
    else if (e.over)
      interaction.place(e.over.id, e.active.data.current.tokenId);
  };
  const columns = interaction.answers,
    complete = wordBank.every(
      (word) => interaction.results[word] === "correct",
    );
  useCheckButton(rootRef, complete || interaction.revealed);
  const isWordUsed = interaction.used,
    isWordWrong = (col, word) => interaction.results[word] === "wrong";
  const getWordClass = (col, word) =>
    "px-3 py-2 rounded-lg text-lg font-semibold cursor-move transition-all border-2 " +
    (interaction.results[word] === "correct"
      ? "border-green-600"
      : interaction.results[word] === "wrong"
        ? "bg-blue-500 text-white border-red-500"
        : "border-blue-900 hover:bg-blue-100");
  const getColClass = () =>
    "border-2 border-dashed border-gray-300 rounded-xl p-4 min-h-[160px] transition-all border-gray-300 bg-white hover:border-blue-400";
  const checkAnswers = () => {
    if (complete || interaction.revealed) return;
    if (Object.values(columns).flat().length !== wordBank.length) {
      interaction.setMessage("Please place all words first.");
      ValidationAlert.info("Please place all words first.");
      return;
    }
    const next = interaction.evaluate(),
      score = Object.values(next).filter((v) => v === "correct").length;
    interaction.setMessage(
      "Score " +
        score +
        " out of " +
        wordBank.length +
        ". Correct words are locked.",
    );
    showCheckFeedback(
      rootRef.current,
      score === wordBank.length ? "success" : score ? "warning" : "error",
      "Score: " + score + "/" + wordBank.length,
    );
  };
  const handleShowAnswer = () => {
      setActiveItem(null);
      interaction.show(correctAnswers);
    },
    handleStartAgain = () => {
      setActiveItem(null);
      interaction.reset();
    };
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDndStart}
      onDragCancel={() => {
        setActiveItem(null);
        interaction.clearSelection();
      }}
      onDragEnd={handleDndEnd}
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
            gap: "40px",
          }}
        >
          <ExerciseHeader
            isWorkbook
            sectionLetter="C"
            title={<> Write the words in the correct column.</>}
            subTitle={"Say each long-e word, then sort it under ee or ea by its spelling."}
          />

          {/* Word Bank */}
          <div>
            <DropZone
              interaction={interaction}
              id="bank"
              className="flex flex-wrap gap-3 p-4 rounded-xl min-h-[80px] justify-between"
            >
              {wordBank.map((word) => {
                const used = isWordUsed(word);
                return (
                  <DraggableWord
                    id={word}
                    key={word}
                    interaction={interaction}
                    word={word}
                    source="bank"
                    disabled={
                      interaction.revealed ||
                      interaction.itemLocked(word) ||
                      used
                    }
                    className={`WB-word-bank
  ${used ? "bg-gray-100 text-gray-400 opacity-60" : "bg-white border-gray-300 hover:bg-blue-50"}`}
                  />
                );
              })}
            </DropZone>
          </div>

          {/* Columns */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {[
              {
                key: "feet",
                img: img1,
              },
              {
                key: "beak",
                img: img2,
              },
            ].map((col, id) => (
              <div key={id}>
                <div className="flex items-center gap-2 mb-3">
                  <img
                    src={col.img}
                    style={{
                      height: "120px",
                    }}
                    alt={IMAGE_DESCRIPTIONS[col.img]}
                  />

                  <span className="font-bold text-gray-700 text-xl">
                    <AudioText
                      tabIndex={interaction.picked ? -1 : 0}
                      audioKey={"heading-" + col.key}
                      src={soundFor(col.key)}
                      playingKey={playingKey}
                      playSound={playSound}
                    >
                      {col.key}
                    </AudioText>
                  </span>
                  <span className="text-xs text-gray-400">
                    ({col.key === "feet" ? "ee" : "ea"})
                  </span>
                </div>

                <DropZone
                  interaction={interaction}
                  id={col.key}
                  className={getColClass(col.key)}
                >
                  <div className="flex flex-wrap gap-2">
                    {columns[col.key].map((word) => (
                      <div key={word} className="relative">
                        <DraggableWord
                          id={word}
                          interaction={interaction}
                          word={word}
                          source={col.key}
                          disabled={interaction.itemLocked(word)}
                          className={getWordClass(col.key, word)}
                        />

                        {/* ✕ فوق الكلمة الغلط */}
                        {isWordWrong(col.key, word) && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow border-2 border-white">
                            <span className="text-white text-sm font-bold">
                              ✕
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {columns[col.key].length === 0 && (
                    <div className="text-gray-400 text-sm mt-2">
                      Drag words here
                    </div>
                  )}
                </DropZone>
              </div>
            ))}
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
          {activeItem ? (
            <div
              style={{
                ...dragSize,
                boxSizing: "border-box",
                pointerEvents: "none",
              }}
              className="WB-word-bank bg-white shadow-lg"
            >
              {activeItem.word}
            </div>
          ) : null}
        </DragOverlay>,
        document.fullscreenElement || document.body,
      )}
    </DndContext>
  );
}

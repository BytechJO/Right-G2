/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 7/Page 44 - B/Item_001_row.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 7/Page 44 - B/Item_002_goat.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 7/Page 44 - B/Item_003_globe.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 7/Page 44 - B/Item_004_note.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 7/Page 44 - B/Item_005_grow.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 7/Page 44 - B/Item_006_home.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 7/Page 44 - B/Item_007_soap.mp3";
import clip7 from "../../../assets/audio/WorkBook/Unit 7/Page 44 - B/Item_008_road.mp3";
import clip8 from "../../../assets/audio/WorkBook/Unit 7/Page 44 - B/Item_009_snow.mp3";
import clip9 from "../../../assets/audio/WorkBook/Unit 7/Page 44 - B/Item_010_coat.mp3";
import clip10 from "../../../assets/audio/WorkBook/Unit 7/Page 44 - B/Item_011_bone.mp3";
import clip11 from "../../../assets/audio/WorkBook/Unit 7/Page 44 - B/Item_012_bow.mp3";
import { createPortal } from "react-dom";
import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import coatImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 44/Ex B 1.svg";
import boneImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 44/Ex B 2.svg";
import bowImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 44/Ex B 3.svg";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
const IMAGE_DESCRIPTIONS = {
  [coatImg]: "A green coat.",
  [boneImg]: "A bone.",
  [bowImg]: "A patterned bow tie.",
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
  row: clip0,
  goat: clip1,
  globe: clip2,
  note: clip3,
  grow: clip4,
  home: clip5,
  soap: clip6,
  road: clip7,
  snow: clip8,
  coat: clip9,
  bone: clip10,
  bow: clip11,
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
const exerciseBWords = [
  "row",
  "goat",
  "globe",
  "note",
  "grow",
  "home",
  "soap",
  "road",
  "snow",
];
const exerciseBColumns = [
  {
    id: "oa",
    title: "coat",
    image: coatImg,
    correctWords: ["goat", "soap", "road"],
  },
  {
    id: "o-e",
    title: "bone",
    image: boneImg,
    correctWords: ["globe", "note", "home"],
  },
  {
    id: "ow",
    title: "bow",
    image: bowImg,
    correctWords: ["row", "grow", "snow"],
  },
];
const DraggableWord = ({ word, interaction, drag }) => {
  const id = word,
    isUsed = interaction.used(id),
    used = isUsed;
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
        `WB-word-bank ${used ? "text-gray-400 opacity-60" : "cursor-grab hover:text-blue-600"}` +
        " " +
        focusClass
      }
      style={{
        ...props.style,
        touchAction: "none",
        opacity: drag.active?.id === id ? 0 : isUsed ? 0.5 : 1,
      }}
    >
      {word}
      {interaction.playingKey === "bank-" + id && <SpeakerBadge />}
    </div>
  );
};
const DropSlot = ({ columnId, index, children, interaction, drag }) => {
  const target = columnId + "__" + index;
  const { setNodeRef, isOver } = useDroppable({
    id: target,
    disabled: interaction.targetLocked(target),
  });
  const props = interaction.slotProps(target, isOver && !!drag.active);
  return (
    <div className="relative">
      <div
        ref={(el) => {
          setNodeRef(el);
          interaction.slotRefs.current[target] = el;
        }}
        {...props}
        className={
          "relative h-12 border-b-2 flex items-center justify-center text-xl italic border-gray-300" +
          " " +
          focusClass +
          " focus-visible:rounded-sm!"
        }
        style={{
          ...props.style,
          borderRadius: isOver && drag.active ? 4 : 0,
        }}
      >
        {children}
        {interaction.playingKey === "answer-" + target && <SpeakerBadge />}
      </div>
    </div>
  );
};
const WB_Unit7_Page44_Q2 = () => {
  const tokens = exerciseBWords.map((word) => ({
      id: word,
      value: word,
    })),
    targets = exerciseBColumns.flatMap((c) =>
      [0, 1, 2].map((i) => c.id + "__" + i),
    );
  const interaction = useDropAnswers(tokens, targets, (target, t) =>
    exerciseBColumns
      .find((c) => c.id === target.split("__")[0])
      .correctWords.includes(t.value),
  );
  const { rootRef, message, playingKey, playSound } = interaction;
  const columnsB = Object.fromEntries(
    exerciseBColumns.map((c) => [
      c.id,
      [0, 1, 2].map((i) => interaction.answers[c.id + "__" + i][0]),
    ]),
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
      Object.fromEntries(
        exerciseBColumns.flatMap((c) =>
          c.correctWords.map((word, i) => [c.id + "__" + i, [word]]),
        ),
      ),
    );
  };
  const handleTryAgain = () => {
    drag.stop();
    interaction.reset();
  };
//.
  return (
    <DndContext
      sensors={sensors}
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
        </div>{" "}
        <div
          className="div-forall"
          style={{
            gap: "25px",
            marginBottom:"50px"
          }}
        >
          {" "}
          <ExerciseHeader
            isWorkbook
            sectionLetter="B"
            title="Look, read, and write the words under the correct column."
            subTitle={"Say each word first, then sort it under the long-o spelling pattern it uses."}
          />
          <div className="flex flex-col gap-2">
            {/* WORD BANK */}
            <div className="rounded-full px-8 py-4 flex flex-wrap justify-center gap-4">
              {exerciseBWords.map((word) => {
                return (
                  <DraggableWord
                    key={word}
                    word={word}
                    interaction={interaction}
                    drag={drag}
                  />
                );
              })}
            </div>
            {/* COLUMNS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {exerciseBColumns.map((col) => (
                <div key={col.id} className="flex flex-col items-center">
                  <img
                    src={col.image}
                    className="max-w-32 max-h-24 object-contain"
                    alt={
                      IMAGE_DESCRIPTIONS[col.image] ||
                      "Illustration for this exercise"
                    }
                  />

                  <span className="font-bold text-2xl text-gray-700">
                    <AudioText
                      audioKey={"heading-" + col.id}
                      src={soundFor(col.title)}
                      playSound={playSound}
                      playingKey={playingKey}
                      tabIndex={interaction.picked ? -1 : 0}
                    >
                      {col.title}
                    </AudioText>
                  </span>

                  <div className="w-full flex flex-col gap-3 min-h-[180px] p-4">
                    {[0, 1, 2].map((idx) => {
                      const word = columnsB[col.id][idx];
                      const isWrong =
                        interaction.results[col.id + "__" + idx] === "wrong";
                      return (
                        <DropSlot
                          columnId={col.id}
                          index={idx}
                          isWrong={isWrong}
                          interaction={interaction}
                          drag={drag}
                        >
                          {word && (
                            <div className="relative">
                              <button
                                // key={`answer-${word}-${i}`}
                                tabIndex={-1}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  interaction.remove(col.id + "__" + idx, word);
                                }}
                                className="cursor-pointer hover:bg-red-50"
                              >
                                {word}
                              </button>
                            </div>
                          )}
                        </DropSlot>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              handleShowAnswer={handleShowAnswer}
              handleStartAgain={handleTryAgain}
              checkAnswers={checkAnswers}
            />
          </div>
        </div>
      </div>
      <DragPreview
        drag={drag}
        className="WB-word-bank px-4 py-2 shadow-lg bg-white"
      >
        {tokens.find((t) => t.id === drag.active?.id)?.value}
      </DragPreview>
    </DndContext>
  );
};
export default WB_Unit7_Page44_Q2;

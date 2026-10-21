/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 6/Page 34 - C/Item_001_Helen_gets_up.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 6/Page 34 - C/Item_002_She_brushes_her_teeth.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 6/Page 34 - C/Item_003_Helen_washes_her_face.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 6/Page 34 - C/Item_004_She_brushes_her_hair.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 6/Page 34 - C/Item_005_She_eats_breakfast.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 6/Page 34 - C/Item_006_Helen_goes_to_school.mp3";
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
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 34/Ex C 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 34/Ex C 4.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 34/Ex C 2.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 34/Ex C 5.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 34/Ex C 3.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 34/Ex C 6.svg";
const IMAGE_DESCRIPTIONS = {
  [img1]: "A girl brushing her teeth.",
  [img2]: "A girl stretching in bed.",
  [img3]: "A girl brushing her hair.",
  [img4]: "A girl washing her face at a sink.",
  [img5]: "A girl wearing a backpack outside a school.",
  [img6]: "A girl eating at a table.",
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
  "helen gets up": clip0,
  "she brushes her teeth": clip1,
  "helen washes her face": clip2,
  "she brushes her hair": clip3,
  "she eats breakfast": clip4,
  "helen goes to school": clip5,
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
            borderColor: "#16a34a",
            backgroundColor:"white"
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
            borderColor: results[target] === "correct" ? "#16a34a" : "#ef4444",
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
const NUMBERS = [
  {
    id: "n1",
    val: "1",
  },
  {
    id: "n2",
    val: "2",
  },
  {
    id: "n3",
    val: "3",
  },
  {
    id: "n4",
    val: "4",
  },
  {
    id: "n5",
    val: "5",
  },
  {
    id: "n6",
    val: "6",
  },
];
const CORRECT_ANSWERS = {
  slot_getup: "n1",
  slot_brushteeth: "n2",
  slot_washface: "n3",
  slot_brushhair: "n4",
  slot_eatbreakfast: "n5",
  slot_goschool: "n6",
};
function DraggableNumber({ num, isUsed, interaction }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: num.id,
    disabled: interaction.itemLocked(num.id) || interaction.used(num.id),
  });
  const props = interaction.bankProps(num.id);
  const style = {
    ...props.style,
    touchAction: "none",
    opacity: isDragging ? 0 : isUsed ? 0.5 : 1,
  };
  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        interaction.bankRefs.current[num.id] = el;
      }}
      {...props}
      style={style}
      {...attributes}
      {...listeners}
      className={`${focusClass} w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full font-bold text-xl cursor-grab shadow-md ${isUsed ? "opacity-30 cursor-not-allowed" : "hover:scale-110"}`}
    >
      {num.val}
      {interaction.playingKey === "bank-" + num.id && <SpeakerBadge />}
    </div>
  );
}

function ImageSlot({ id, imgSrc, content, interaction }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    disabled: interaction.targetLocked(id),
  });
  const props = interaction.slotProps(id, isOver);
  const isWrong = interaction.results[id] === "wrong";
  const borderColor =
    isOver && !interaction.targetLocked(id)
      ? "border-blue-500"
      : "border-gray-200";
  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        interaction.slotRefs.current[id] = el;
      }}
      {...props}
      style={{
        ...props.style,
        borderRadius: "50%",
      }}
      className={`${focusClass} rounded-full relative group`}
    >
      <img
        src={imgSrc}
        className={`max-w-32 max-h-32 rounded-full border-4 object-cover transition-all ${borderColor}`}
        alt={IMAGE_DESCRIPTIONS[imgSrc]}
      />

      <div
        style={{
          borderColor:
            interaction.results[id] === "correct"
              ? "#16a34a"
              : isWrong
                ? "#ef4444"
                : undefined,
                backgroundClip: interaction.results[id] === "correct"
              ? "#e4ffee"
              : isWrong
                ? "#ffdcdc"
                : undefined,
        }}
        className={`absolute bottom-0 right-0 w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-lg shadow-inner ${content ?  interaction.results[id] === "correct"
              ? "bg-[#16a34a] text-white "
              : isWrong
                ? "bg-red-500 text-white"
                : "bg-blue-500 text-white border-blue-600" : "bg-white border-gray-300"}`}
      >
        {content ? NUMBERS.find((n) => n.id === content).val : ""}
      </div>

      {isWrong && (
        <div className="absolute top-1 right-1 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shadow border-2 border-white">
          <span className="text-white text-lg font-bold">✕</span>
        </div>
      )}
    </div>
  );
}
const WB_Unit6_Page34_Q1 = () => {
  const tokens = NUMBERS.map((t) => ({
      id: t.id,
      value: t.val,
    })),
    targets = [
      "slot_brushteeth",
      "slot_getup",
      "slot_brushhair",
      "slot_washface",
      "slot_goschool",
      "slot_eatbreakfast",
    ];
  const interaction = useDropAnswers(
    tokens,
    targets,
    (target, t) => t.id === CORRECT_ANSWERS[target],
  );
  const { rootRef, message, playingKey, playSound } = interaction;
  const placedNumbers = Object.fromEntries(
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
        className="div-forall"
        style={{
          gap: "25px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="C"
          title={<>Read, look, and number.</>}
          subTitle={"Read the routine steps in order, then number the pictures to match Helen's day."}
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
          <div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-6 text-xl font-medium text-gray-600">
                <p className="flex gap-3">
                  <span className="text-blue-900 text-xl font-bold">1</span>
                  <AudioText
                    audioKey={"sentence-Helen gets up."}
                    src={soundFor("Helen gets up.")}
                    playSound={playSound}
                    playingKey={playingKey}
                    tabIndex={interaction.picked ? -1 : 0}
                  >
                    {"Helen gets up."}
                  </AudioText>
                </p>
                <p className="flex gap-3">
                  <span className="text-blue-900 text-xl font-bold">2</span>
                  <AudioText
                    audioKey={"sentence-She brushes her teeth."}
                    src={soundFor("She brushes her teeth.")}
                    playSound={playSound}
                    playingKey={playingKey}
                    tabIndex={interaction.picked ? -1 : 0}
                  >
                    {"She brushes her teeth."}
                  </AudioText>
                </p>
                <p className="flex gap-3">
                  <span className="text-blue-900 text-xl font-bold">3</span>
                  <AudioText
                    audioKey={"sentence-Helen washes her face."}
                    src={soundFor("Helen washes her face.")}
                    playSound={playSound}
                    playingKey={playingKey}
                    tabIndex={interaction.picked ? -1 : 0}
                  >
                    {"Helen washes her face."}
                  </AudioText>
                </p>
                <p className="flex gap-3">
                  <span className="text-blue-900 text-xl font-bold">4</span>
                  <AudioText
                    audioKey={"sentence-She brushes her hair."}
                    src={soundFor("She brushes her hair.")}
                    playSound={playSound}
                    playingKey={playingKey}
                    tabIndex={interaction.picked ? -1 : 0}
                  >
                    {"She brushes her hair."}
                  </AudioText>
                </p>
                <p className="flex gap-3">
                  <span className="text-blue-900 text-xl font-bold">5</span>
                  <AudioText
                    audioKey={"sentence-She eats breakfast."}
                    src={soundFor("She eats breakfast.")}
                    playSound={playSound}
                    playingKey={playingKey}
                    tabIndex={interaction.picked ? -1 : 0}
                  >
                    {"She eats breakfast."}
                  </AudioText>
                </p>
                <p className="flex gap-3">
                  <span className="text-blue-900 text-xl font-bold">6</span>
                  <AudioText
                    audioKey={"sentence-Helen goes to school."}
                    src={soundFor("Helen goes to school.")}
                    playSound={playSound}
                    playingKey={playingKey}
                    tabIndex={interaction.picked ? -1 : 0}
                  >
                    {"Helen goes to school."}
                  </AudioText>
                </p>

                <div className="mt-10 p-4 bg-blue-50 rounded-lg border-2 border-dashed border-blue-200">
                  <p className="text-sm text-blue-600 mb-3 text-center font-bold">
                    Drag numbers to the images:
                  </p>
                  <div className="flex justify-center gap-3">
                    <SortableContext items={NUMBERS.map((n) => n.id)}>
                      {NUMBERS.map((n) => (
                        <DraggableNumber
                          interaction={interaction}
                          key={n.id}
                          num={n}
                          isUsed={interaction.used(n.id)}
                        />
                      ))}
                    </SortableContext>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <ImageSlot
                  interaction={interaction}
                  id="slot_brushteeth"
                  imgSrc={img1}
                  content={placedNumbers.slot_brushteeth}
                  isCorrect={
                    placedNumbers.slot_brushteeth ===
                    CORRECT_ANSWERS.slot_brushteeth
                  }
                  isSubmitted={isSubmitted}
                />
                <ImageSlot
                  interaction={interaction}
                  id="slot_getup"
                  imgSrc={img2}
                  content={placedNumbers.slot_getup}
                  isCorrect={
                    placedNumbers.slot_getup === CORRECT_ANSWERS.slot_getup
                  }
                  isSubmitted={isSubmitted}
                />
                <ImageSlot
                  interaction={interaction}
                  id="slot_brushhair"
                  imgSrc={img3}
                  content={placedNumbers.slot_brushhair}
                  isCorrect={
                    placedNumbers.slot_brushhair ===
                    CORRECT_ANSWERS.slot_brushhair
                  }
                  isSubmitted={isSubmitted}
                />
                <ImageSlot
                  interaction={interaction}
                  id="slot_washface"
                  imgSrc={img4}
                  content={placedNumbers.slot_washface}
                  isCorrect={
                    placedNumbers.slot_washface ===
                    CORRECT_ANSWERS.slot_washface
                  }
                  isSubmitted={isSubmitted}
                />
                <ImageSlot
                  interaction={interaction}
                  id="slot_goschool"
                  imgSrc={img5}
                  content={placedNumbers.slot_goschool}
                  isCorrect={
                    placedNumbers.slot_goschool ===
                    CORRECT_ANSWERS.slot_goschool
                  }
                  isSubmitted={isSubmitted}
                />
                <ImageSlot
                  interaction={interaction}
                  id="slot_eatbreakfast"
                  imgSrc={img6}
                  content={placedNumbers.slot_eatbreakfast}
                  isCorrect={
                    placedNumbers.slot_eatbreakfast ===
                    CORRECT_ANSWERS.slot_eatbreakfast
                  }
                  isSubmitted={isSubmitted}
                />
              </div>
            </div>

            <Button
              handleShowAnswer={handleShowAnswer}
              handleStartAgain={handleReset}
              checkAnswers={checkAnswers}
            />
          </div>

          {createPortal(
            <DragOverlay
              style={{
                zIndex: 2147483647,
              }}
            >
              {activeId ? (
                <div
                  className="w-10 h-10 flex items-center justify-center bg-orange-600 text-white rounded-full font-bold text-xl shadow-2xl scale-110"
                  style={{
                    ...dragSize,
                    boxSizing: "border-box",
                    pointerEvents: "none",
                  }}
                >
                  {NUMBERS.find((n) => n.id === activeId).val}
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
export default WB_Unit6_Page34_Q1;

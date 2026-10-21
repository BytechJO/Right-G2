/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 52/Ex D 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 52/Ex D 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 52/Ex D 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 52/Ex D 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 52/Ex D 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 52/Ex D 6.svg";
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
import { createPortal } from "react-dom";
import clip0 from "../../../assets/audio/WorkBook/Unit 9/Page 52 - D/Item_001_watch.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 9/Page 52 - D/Item_002_watching.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 9/Page 52 - D/Item_003_climb.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 9/Page 52 - D/Item_004_climbing.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 9/Page 52 - D/Item_005_walk.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 9/Page 52 - D/Item_006_walking.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 9/Page 52 - D/Item_007_play.mp3";
import clip7 from "../../../assets/audio/WorkBook/Unit 9/Page 52 - D/Item_008_playing.mp3";
import clip8 from "../../../assets/audio/WorkBook/Unit 9/Page 52 - D/Item_009_run.mp3";
import clip9 from "../../../assets/audio/WorkBook/Unit 9/Page 52 - D/Item_010_running.mp3";
import clip10 from "../../../assets/audio/WorkBook/Unit 9/Page 52 - D/Item_011_sleep.mp3";
import clip11 from "../../../assets/audio/WorkBook/Unit 9/Page 52 - D/Item_012_sleeping.mp3";
import clip12 from "../../../assets/audio/WorkBook/Unit 9/Page 52 - D/Item_013_is_watching.mp3";
import clip13 from "../../../assets/audio/WorkBook/Unit 9/Page 52 - D/Item_014_is_climbing.mp3";
import clip14 from "../../../assets/audio/WorkBook/Unit 9/Page 52 - D/Item_015_is_walking.mp3";
import clip15 from "../../../assets/audio/WorkBook/Unit 9/Page 52 - D/Item_016_is_playing.mp3";
import clip16 from "../../../assets/audio/WorkBook/Unit 9/Page 52 - D/Item_017_is_running.mp3";
import clip17 from "../../../assets/audio/WorkBook/Unit 9/Page 52 - D/Item_018_is_sleeping.mp3";
import clip18 from "../../../assets/audio/WorkBook/Unit 9/Page 52 - D/Item_019_Tom.mp3";
import clip19 from "../../../assets/audio/WorkBook/Unit 9/Page 52 - D/Item_020_home.mp3";
import clip20 from "../../../assets/audio/WorkBook/Unit 9/Page 52 - D/Item_021_Stella.mp3";
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
const normalized = (text) =>
  String(text)
    .toLowerCase()
    .replaceAll("’", "'")
    .replace(/[.,!?]/g, "")
    .replace(/\s+/g, " ")
    .trim();
const SOUNDS = {
  watch: clip0,
  watching: clip1,
  climb: clip2,
  climbing: clip3,
  walk: clip4,
  walking: clip5,
  play: clip6,
  playing: clip7,
  run: clip8,
  running: clip9,
  sleep: clip10,
  sleeping: clip11,
  "is watching": clip12,
  "is climbing": clip13,
  "is walking": clip14,
  "is playing": clip15,
  "is running": clip16,
  "is sleeping": clip17,
  tom: clip18,
  home: clip19,
  stella: clip20,
};
const soundFor = (text) => SOUNDS[normalized(text)];
const IMAGE_DESCRIPTIONS = {
  [img1]: "A boy walking along a path beside a house.",
  [img2]: "A girl lying in a bed under a pink blanket.",
  [img3]: "A white cat partway up a tree trunk.",
  [img4]: "A woman sitting on a couch facing a television.",
  [img5]: "A boy running on grass.",
  [img6]: "Two men seated across a chessboard.",
};
const exerciseData = [
  {
    id: 1,
    name: "Tom",
    before: "",
    after: "home.",
    correct: "is walking",
    image: img1,
  },
  {
    id: 2,
    name: "Stella",
    before: "",
    after: ".",
    correct: "is sleeping",
    image: img2,
  },
  {
    id: 3,
    name: "The cat",
    before: "",
    after: ".",
    correct: "is climbing",
    image: img3,
  },
  {
    id: 4,
    name: "Mom",
    before: "",
    after: "TV.",
    correct: "is watching",
    image: img4,
  },
  {
    id: 5,
    name: "John",
    before: "",
    after: ".",
    correct: "is running",
    image: img5,
  },
  {
    id: 6,
    name: "Dad",
    before: "",
    after: "with my uncle.",
    correct: "is playing",
    image: img6,
  },
];
const wordBank = [
  "is watching",
  "is climbing",
  "is walking",
  "is playing",
  "is running",
  "is sleeping",
];
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
function DraggableWord({ word, value, type, parentId, interaction }) {
  const tokenId = word;
  const disabled = interaction.itemLocked(tokenId) || interaction.used(tokenId);
  const props = interaction.bankProps(tokenId);
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: tokenId,
    data: {
      word: word || value,
      type,
      value,
      parentId,
    },
    disabled,
  });
  return (
    <div
      // style={style}
      className={
        `WB-word-bank  touch-none
        ${disabled ? "bg-gray-100 text-gray-300 border-gray-200" : "bg-white border-blue-900 text-blue-900 cursor-grab"}
      ` +
        " " +
        focusClass
      }
      ref={(element) => {
        setNodeRef(element);
        interaction.bankRefs.current[tokenId] = element;
      }}
      {...attributes}
      {...listeners}
      {...props}
      style={{
        ...props.style,
        padding: "9px 15px",
        touchAction: "none",
      }}
    >
      {word}
      <>{interaction.playingKey === "bank-" + tokenId && <SpeakerBadge />}</>
    </div>
  );
}
function DropZone({ id, value, interaction }) {
  const target = String(id);
  const { setNodeRef, isOver: over } = useDroppable({
    id: target,
    disabled: interaction.targetLocked(target),
  });
  const isOver =
      !!interaction.active && over && !interaction.targetLocked(target),
    isWrong = interaction.results[target] === "wrong";
  const props = interaction.slotProps(target, isOver);
  return (
    <div
      className={
        `w-full h-10 border-b-2 flex items-center justify-center px-2 relative transition-all duration-300
      
      ${!value ? "border-gray-400" : "border-gray-400 bg-blue-50"}
      
      // 🔥 تأثير أثناء السحب
      ${isOver ? "bg-blue-100  border-blue-600 " : ""}
      
      // ❌ خطأ بعد التصحيح
      ${isWrong ? "border-red-500 bg-white" : ""}
      ` +
        " focus-visible:rounded-md! " +
        focusClass
      }
      ref={(element) => {
        setNodeRef(element);
        interaction.slotRefs.current[target] = element;
      }}
      {...props}
    >
      <span className="font-bold">{value}</span>

      {isWrong && (
        <span className="absolute -top-2 -right-2 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-white shadow">
          ✕
        </span>
      )}
      <>{interaction.playingKey === "answer-" + target && <SpeakerBadge />}</>
    </div>
  );
}
function WB_Unit9_Page52_Q2() {
  const tokens = wordBank.map((value) => ({
    id: value,
    value,
  }));
  const a = useDropExercise(
    tokens,
    Object.fromEntries(exerciseData.map((q) => [q.id, q.correct])),
  );
  const { rootRef, message, playingKey, playSound } = a;
  const userAnswers = Object.fromEntries(
    exerciseData.map((q) => [q.id, a.value(String(q.id))]),
  );
  const checked = Object.values(a.results).some(Boolean),
    locked = false;
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
  );
  const checkAnswers = a.check,
    handleShowAnswer = a.show,
    handleTryAgain = a.reset;
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
            gap: "25px",
          }}
        >
          <ExerciseHeader
            isWorkbook
            sectionLetter="D"
            title={<>Look and write.</>}
            subTitle={"Look at the picture or sentence clue, say the present activities answer first, then write or select it carefully."}
          />
          <div className="flex flex-col gap-6">
            <div className="border-2 border-gray-800 rounded-xl overflow-hidden shadow-sm">
              <div className="grid grid-cols-3 divide-x-2 divide-gray-800">
                <div className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between text-lg font-medium">
                    <span>
                      <AudioText
                        audioKey={"table-watch"}
                        src={soundFor("watch")}
                        playSound={playSound}
                        playingKey={playingKey}
                        tabIndex={a.picked ? -1 : 0}
                      >
                        {"watch"}
                      </AudioText>
                    </span>{" "}
                    <span>-</span>{" "}
                    <span className="text-blue-700">
                      <AudioText
                        audioKey={"table-watching"}
                        src={soundFor("watching")}
                        playSound={playSound}
                        playingKey={playingKey}
                        tabIndex={a.picked ? -1 : 0}
                      >
                        {"watching"}
                      </AudioText>
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-medium">
                    <span>
                      <AudioText
                        audioKey={"table-play"}
                        src={soundFor("play")}
                        playSound={playSound}
                        playingKey={playingKey}
                        tabIndex={a.picked ? -1 : 0}
                      >
                        {"play"}
                      </AudioText>
                    </span>{" "}
                    <span>-</span>{" "}
                    <span className="text-blue-700">
                      <AudioText
                        audioKey={"table-playing"}
                        src={soundFor("playing")}
                        playSound={playSound}
                        playingKey={playingKey}
                        tabIndex={a.picked ? -1 : 0}
                      >
                        {"playing"}
                      </AudioText>
                    </span>
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between text-lg font-medium">
                    <span>
                      <AudioText
                        audioKey={"table-climb"}
                        src={soundFor("climb")}
                        playSound={playSound}
                        playingKey={playingKey}
                        tabIndex={a.picked ? -1 : 0}
                      >
                        {"climb"}
                      </AudioText>
                    </span>{" "}
                    <span>-</span>{" "}
                    <span className="text-blue-700">
                      <AudioText
                        audioKey={"table-climbing"}
                        src={soundFor("climbing")}
                        playSound={playSound}
                        playingKey={playingKey}
                        tabIndex={a.picked ? -1 : 0}
                      >
                        {"climbing"}
                      </AudioText>
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-medium">
                    <span>
                      <AudioText
                        audioKey={"table-run"}
                        src={soundFor("run")}
                        playSound={playSound}
                        playingKey={playingKey}
                        tabIndex={a.picked ? -1 : 0}
                      >
                        {"run"}
                      </AudioText>
                    </span>{" "}
                    <span>-</span>{" "}
                    <span className="text-blue-700">
                      <AudioText
                        audioKey={"table-running"}
                        src={soundFor("running")}
                        playSound={playSound}
                        playingKey={playingKey}
                        tabIndex={a.picked ? -1 : 0}
                      >
                        {"running"}
                      </AudioText>
                    </span>
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between text-lg font-medium">
                    <span>
                      <AudioText
                        audioKey={"table-walk"}
                        src={soundFor("walk")}
                        playSound={playSound}
                        playingKey={playingKey}
                        tabIndex={a.picked ? -1 : 0}
                      >
                        {"walk"}
                      </AudioText>
                    </span>{" "}
                    <span>-</span>{" "}
                    <span className="text-blue-700">
                      <AudioText
                        audioKey={"table-walking"}
                        src={soundFor("walking")}
                        playSound={playSound}
                        playingKey={playingKey}
                        tabIndex={a.picked ? -1 : 0}
                      >
                        {"walking"}
                      </AudioText>
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-medium">
                    <span>
                      <AudioText
                        audioKey={"table-sleep"}
                        src={soundFor("sleep")}
                        playSound={playSound}
                        playingKey={playingKey}
                        tabIndex={a.picked ? -1 : 0}
                      >
                        {"sleep"}
                      </AudioText>
                    </span>{" "}
                    <span>-</span>{" "}
                    <span className="text-blue-700">
                      <AudioText
                        audioKey={"table-sleeping"}
                        src={soundFor("sleeping")}
                        playSound={playSound}
                        playingKey={playingKey}
                        tabIndex={a.picked ? -1 : 0}
                      >
                        {"sleeping"}
                      </AudioText>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Word Bank (Draggable) */}
            <div className="flex flex-wrap justify-center gap-4 mb-2 p-4">
              {wordBank.map((word) => {
                const isUsed = Object.values(userAnswers).includes(word);
                return (
                  <DraggableWord
                    key={word}
                    word={word}
                    disabled={locked || isUsed}
                    interaction={a}
                  />
                );
              })}
            </div>

            {/* Sentences Grid */}
            <div className="grid gap-x-16 gap-y-10">
              {exerciseData.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-blue-800 w-6">
                    {item.id}
                  </span>

                  <div className="flex items-center gap-4 w-full">
                    <div className="overflow-hidden shrink-0">
                      <img
                        src={item.image}
                        className="object-contain"
                        style={{
                          height: "100px",
                          width: "auto",
                        }}
                        alt={
                          IMAGE_DESCRIPTIONS[item.image] ||
                          "Illustration for this question"
                        }
                      />
                    </div>

                    <div className="flex items-center gap-2 text-lg font-medium text-gray-800 w-full">
                      <span className="text-lg">
                        <AudioText
                          audioKey={"item.name" + "-" + item.id}
                          src={soundFor(item.name)}
                          playSound={playSound}
                          playingKey={playingKey}
                          tabIndex={a.picked ? -1 : 0}
                        >
                          {item.name}
                        </AudioText>
                      </span>
                      <DropZone
                        id={`${item.id}`} // 🔥 حوله string
                        value={userAnswers[item.id]}
                        correct={item.correct}
                        checked={checked}
                        locked={locked}
                        interaction={a}
                      />
                      <span className="text-lg w-[180px]">
                        <AudioText
                          audioKey={"item.after" + "-" + item.id}
                          src={soundFor(item.after)}
                          playSound={playSound}
                          playingKey={playingKey}
                          tabIndex={a.picked ? -1 : 0}
                        >
                          {item.after}
                        </AudioText>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DragPreview
            interaction={a}
            className="px-6 py-2 bg-white border-2 border-blue-400 rounded-lg shadow-xl text-blue-700"
          />
          {/* Controls */}
          <div className="mt-16 flex justify-center">
            <Button
              handleShowAnswer={handleShowAnswer}
              handleStartAgain={handleTryAgain}
              checkAnswers={checkAnswers}
            />
          </div>
        </div>
      </div>
    </DndContext>
  );
}
export default WB_Unit9_Page52_Q2;

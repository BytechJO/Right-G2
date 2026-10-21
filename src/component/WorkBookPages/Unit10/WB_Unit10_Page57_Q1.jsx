/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import Button from "../Button";
// check
// check
import imgShower from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 57/SVG/1.svg";
import imgBike from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 57/SVG/Asset 2.svg";
import imgSoccer from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 57/SVG/Asset 3.svg";
import imgFlowers from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 57/SVG/Asset 4.svg";
import imgNewspaper from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 57/SVG/Asset 5.svg";
import imgTV from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 57/SVG/Asset 6.svg";
import imgJacket from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 57/SVG/Asset 7.svg";
import imgCooking from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 57/SVG/Asset 8.svg";
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
import { SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import clip0 from "../../../assets/audio/WorkBook/Unit 10/Page 57 - A/Item_001_What's_he_doing.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 10/Page 57 - A/Item_002_What's_she_doing.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 10/Page 57 - A/Item_003_What_are_they_doing.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 10/Page 57 - A/Item_004_She's_cooking.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 10/Page 57 - A/Item_005_They're_playing_soccer.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 10/Page 57 - A/Item_006_She's_riding_her_bike.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 10/Page 57 - A/Item_007_He's_putting_on_his_jacket.mp3";
import clip7 from "../../../assets/audio/WorkBook/Unit 10/Page 57 - A/Item_008_He's_reading_the_newspaper.mp3";
import clip8 from "../../../assets/audio/WorkBook/Unit 10/Page 57 - A/Item_009_She's_watering_the_flowers.mp3";
import clip9 from "../../../assets/audio/WorkBook/Unit 10/Page 57 - A/Item_010_He's_taking_a_shower.mp3";
import clip10 from "../../../assets/audio/WorkBook/Unit 10/Page 57 - A/Item_011_She's_watching_TV.mp3";
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
      onClick={(e) => {
        e.stopPropagation();
        playSound(audioKey, src);
      }}
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
  "what's he doing": clip0,
  "what's she doing": clip1,
  "what are they doing": clip2,
  "she's cooking": clip3,
  "they're playing soccer": clip4,
  "she's riding her bike": clip5,
  "he's putting on his jacket": clip6,
  "he's reading the newspaper": clip7,
  "she's watering the flowers": clip8,
  "he's taking a shower": clip9,
  "she's watching tv": clip10,
};
const soundFor = (text) => SOUNDS[normalized(text)];
const IMAGE_DESCRIPTIONS = {
  [imgShower]: "A boy standing behind a shower curtain.",
  [imgBike]: "A person stirring a pot on a stove.",
  [imgSoccer]: "A child riding a bicycle.",
  [imgFlowers]: "Two children running near a soccer ball.",
  [imgNewspaper]: "A girl watering flowers.",
  [imgTV]: "A man seated with an open newspaper.",
  [imgJacket]: "A child seated facing a television.",
  [imgCooking]: "A man putting on a jacket.",
};
const ACTIVITIES = [
  {
    id: "act1",
    text: "He's taking a shower.",
  },
  {
    id: "act2",
    text: "She's riding her bike.",
  },
  {
    id: "act3",
    text: "They're playing soccer.",
  },
  {
    id: "act4",
    text: "She's watering the flowers.",
  },
  {
    id: "act5",
    text: "He's reading the newspaper.",
  },
  {
    id: "act6",
    text: "She's watching TV.",
  },
  {
    id: "act7",
    text: "He's putting on his jacket.",
  },
  {
    id: "act8",
    text: "She's cooking.",
  },
];
const CORRECT_ANSWERS = {
  q1: "act1",
  q2: "act2",
  q3: "act3",
  q4: "act4",
  q5: "act5",
  q6: "act6",
  q7: "act7",
  q8: "act8",
};
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
              t.draggable !== false &&
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
function DraggableActivity({ item, interaction }) {
  const tokenId = item.id;
  const isUsed = interaction.used(tokenId),
    disabled = isUsed || interaction.itemLocked(tokenId);
  const props = interaction.bankProps(tokenId);
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: tokenId,
    disabled,
  });
  return (
    <div
      className={
        `p-2 bg-white border-2 border-gray-200 rounded-xl shadow-sm cursor-grab text-blue-700 font-medium text-base text-center touch-none ${isUsed ? "bg-gray-50 text-gray-300 " : "hover:border-blue-400 hover:shadow-md transition-all"}` +
        " " +
        focusClass
      }
      ref={(el) => {
        setNodeRef(el);
        interaction.bankRefs.current[tokenId] = el;
      }}
      {...attributes}
      {...listeners}
      {...props}
      style={{
        ...props.style,
        opacity: isUsed ? 0.5 : 1,
        touchAction: "none",
      }}
    >
      {item.text}
      <>{interaction.playingKey === "bank-" + tokenId && <SpeakerBadge />}</>
    </div>
  );
}
function DropSlot({ id, content, interaction }) {
  const target = String(id);
  const { setNodeRef, isOver: over } = useDroppable({
    id: target,
    disabled: interaction.targetLocked(target),
  });
  const isOver = !!interaction.active && over,
    isSubmitted = !!interaction.results[target],
    isCorrect = interaction.results[target] === "correct";
  const borderColor = isSubmitted
    ? isCorrect
      ? "border-green-600"
      : "border-red-500"
    : "border-gray-300";
  const props = interaction.slotProps(target, isOver);
  return (
    <div
      className={
        `relative w-full min-h-[40px] border-b-2 flex items-center justify-center px-2 transition-all ${borderColor}` +
        " " +
        focusClass +
        " focus-visible:rounded-md!"
      }
      ref={(el) => {
        setNodeRef(el);
        interaction.slotRefs.current[target] = el;
      }}
      {...props}
    >
      {/* ❌ Wrong Answer Icon */}
      {isSubmitted && content && !isCorrect && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow">
          ✕
        </div>
      )}

      {content ? (
        <span className="text-blue-900 text-[17px] text-center">
          {ACTIVITIES.find((a) => a.id === content).text}
        </span>
      ) : (
        <span className="text-gray-300 italic text-xs">
          Drop answer here...
        </span>
      )}
      <>{interaction.playingKey === "answer-" + target && <SpeakerBadge />}</>
    </div>
  );
}
function WB_Unit10_Page57_Q1() {
  const QUESTIONS = [
    {
      id: "q1",
      text: "1. What's he doing?",
      img: imgShower,
    },
    {
      id: "q2",
      text: "2. What's she doing?",
      img: imgSoccer,
    },
    {
      id: "q3",
      text: "3. What are they doing?",
      img: imgFlowers,
    },
    {
      id: "q4",
      text: "4. What's she doing?",
      img: imgNewspaper,
    },
    {
      id: "q5",
      text: "5. What's he doing?",
      img: imgTV,
    },
    {
      id: "q6",
      text: "6. What's she doing?",
      img: imgJacket,
    },
    {
      id: "q7",
      text: "7. What's he doing?",
      img: imgCooking,
    },
    {
      id: "q8",
      text: "8. What's she doing?",
      img: imgBike,
    },
  ];
  const tokens = ACTIVITIES.map((item) => ({
    id: item.id,
    value: item.text,
    targets: Object.keys(CORRECT_ANSWERS).filter(() => true),
  }));
  const a = useDropExercise(
    tokens,
    Object.fromEntries(
      Object.entries(CORRECT_ANSWERS).map(([id, value]) => [
        id,
        ACTIVITIES.find((item) => item.id === value).text,
      ]),
    ),
  );
  const { rootRef, message, playingKey, playSound } = a;
  const answers = Object.fromEntries(
    Object.keys(CORRECT_ANSWERS).map((id) => [id, a.answers[id] || null]),
  );
  const showResults = Object.values(a.results).some(Boolean);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );
  const checkAnswers = a.check,
    handleShowAnswer = a.show,
    handleReset = () => {
      a.reset();
      setShuffledActivities(shuffleArray(ACTIVITIES));
    };
  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);
  const [shuffledActivities, setShuffledActivities] = useState(() =>
    shuffleArray(ACTIVITIES),
  );
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
            sectionLetter="A"
            title={<>Look and write.</>}
            subTitle={
              "Look at each action picture, ask What is he/she doing?, then choose or write the matching answer."
            }
          />

          <div className="flex flex-col lg:flex-row gap-8">
            {/* شبكة الأسئلة */}
            <div className="flex-[2] grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {QUESTIONS.map((q) => (
                <div key={q.id} className="space-y-3">
                  <p className="text-gray-700 text-[16px]">
                    <AudioText
                      audioKey={"question-" + q.id}
                      src={soundFor(q.text.replace(/^\d+\.\s*/, ""))}
                      playSound={playSound}
                      playingKey={playingKey}
                      tabIndex={a.picked ? -1 : 0}
                    >
                      {q.text}
                    </AudioText>
                  </p>
                  <div className="p-2 rounded-xl flex justify-center">
                    <img
                      src={q.img}
                      className="object-contain rounded-lg"
                      style={{
                        height: "85px",
                      }}
                      alt={
                        IMAGE_DESCRIPTIONS[q.img] ||
                        "Illustration for this question"
                      }
                    />
                  </div>
                  <DropSlot
                    id={q.id}
                    content={answers[q.id]}
                    isCorrect={answers[q.id] === CORRECT_ANSWERS[q.id]}
                    isSubmitted={showResults}
                    interaction={a}
                  />
                </div>
              ))}
            </div>

            {/* بنك الإجابات */}
            <div className="flex-1 bg-blue-50 p-5 rounded-2xl border-2 border-blue-100 h-fit sticky top-4">
              <h3 className="font-bold text-blue-800 mb-4 text-center">
                Activities Bank
              </h3>
              <div className="grid grid-cols-1 gap-2">
                <SortableContext items={shuffledActivities.map((a) => a.id)}>
                  {shuffledActivities.map((act) => (
                    <DraggableActivity
                      key={act.id}
                      item={act}
                      // ✨ تعديل: تجاهل القيم الفاضية
                      isUsed={Object.values(answers)
                        .filter(Boolean)
                        .includes(act.id)}
                      interaction={a}
                    />
                  ))}
                </SortableContext>
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <Button
              handleStartAgain={handleReset}
              checkAnswers={checkAnswers}
              handleShowAnswer={handleShowAnswer}
            />
          </div>
        </div>
      </div>

      <DragPreview
        interaction={a}
        className="p-3 bg-white border-2 border-blue-500 rounded-xl shadow-2xl text-blue-700 font-bold text-xs scale-105"
      />
    </DndContext>
  );
}
export default WB_Unit10_Page57_Q1;

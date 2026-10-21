/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import Button from "../Button";
import imgEating from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 59/SVG/Asset 1.svg";
import imgJacket from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 59/SVG/Asset 2.svg";
import imgSoccer from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 59/SVG/Asset 3.svg";
import imgClimbing from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 59/SVG/Asset 4.svg";
import imgTV from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 59/SVG/Asset 5.svg";
import imgReading from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 59/SVG/Asset 6.svg";
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
import clip0 from "../../../assets/audio/WorkBook/Unit 10/Page 59 - D/Item_001_What's_..._doing.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 10/Page 59 - D/Item_002_What_..._doing.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 10/Page 59 - D/Item_003_It's_climbing.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 10/Page 59 - D/Item_004_They're_playing_soccer.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 10/Page 59 - D/Item_005_She's_watching_TV.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 10/Page 59 - D/Item_006_She's_eating.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 10/Page 59 - D/Item_007_He's_putting_on_a_jacket.mp3";
import clip7 from "../../../assets/audio/WorkBook/Unit 10/Page 59 - D/Item_008_He's_reading_a_book.mp3";
const activate = (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  e.preventDefault();
  e.stopPropagation();
  if (!e.repeat) e.currentTarget.click();
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
const normalized = (text) =>
  String(text)
    .toLowerCase()
    .replaceAll("’", "'")
    .replace(/[.,!?]/g, "")
    .replace(/\s+/g, " ")
    .trim();
const SOUNDS = {
  "what's doing": clip0,
  "what doing": clip1,
  "it's climbing": clip2,
  "they're playing soccer": clip3,
  "she's watching tv": clip4,
  "she's eating": clip5,
  "he's putting on a jacket": clip6,
  "he's reading a book": clip7,
};
const soundFor = (text) => SOUNDS[normalized(text)];
const IMAGE_DESCRIPTIONS = {
  [imgEating]: "A girl holding an apple near her mouth.",
  [imgJacket]: "A man putting on a jacket.",
  [imgSoccer]: "Two children running beside a soccer ball.",
  [imgClimbing]: "An orange cat climbing along a tree branch.",
  [imgTV]: "A woman on a couch facing a television.",
  [imgReading]: "A boy holding an open book.",
};
const ANSWERS_D = [
  {
    id: "ans1",
    text: "She's eating.",
  },
  {
    id: "ans2",
    text: "He's putting on a jacket.",
  },
  {
    id: "ans3",
    text: "They're playing soccer.",
  },
  {
    id: "ans4",
    text: "It's climbing.",
  },
  {
    id: "ans5",
    text: "She's watching TV.",
  },
  {
    id: "ans6",
    text: "He's reading a book.",
  },
];
const CORRECT_D = {
  q1_sel: "she",
  q1_drop: "ans1",
  q2_sel: "he",
  q2_drop: "ans2",
  q3_sel: "are they",
  q3_drop: "ans3",
  q4_sel: "is it",
  q4_drop: "ans4",
  q5_sel: "is she",
  q5_drop: "ans5",
  q6_sel: "is he",
  q6_drop: "ans6",
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
function DraggableAnswer({ item, interaction }) {
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
      // التعديل: أضفنا شرط pointer-events-none فقط إذا كان العنصر مستخدم فعلياً
      className={
        `p-2 bg-white border-2 border-gray-200 rounded-lg shadow-sm cursor-grab text-blue-700 text-[17px] text-center touch-none ${isUsed ? "bg-gray-50 text-gray-300 " : "hover:border-blue-400"}` +
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
function DropZone({ id, content, interaction }) {
  const target = String(id);
  const { setNodeRef, isOver: over } = useDroppable({
    id: target,
    disabled: interaction.targetLocked(target),
  });
  const isOver = !!interaction.active && over,
    isSubmitted = !!interaction.results[target],
    isCorrect = interaction.results[target] === "correct";
  const props = interaction.slotProps(target, isOver);
  return (
    <div
      className={
        `relative w-full min-h-[35px] border-b-2 flex items-center px-2 ${isSubmitted && content && !isCorrect ? "border-red-500" : "border-gray-300"}` +
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
      {isSubmitted && content && !isCorrect && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow">
          ✕
        </div>
      )}

      {content ? (
        <span className="text-lg">
          {ANSWERS_D.find((a) => a.id === content).text}
        </span>
      ) : (
        <span className="text-gray-300 italic text-[16px]">
          drop answer here...
        </span>
      )}
      <>{interaction.playingKey === "answer-" + target && <SpeakerBadge />}</>
    </div>
  );
}
function WB_Unit10_Page59_Q1() {
  const QUESTIONS = [
    {
      id: "q1",
      img: imgEating,
      prefix: "What's ",
      suffix: " doing?",
      options: ["she", "he", "it"],
    },
    {
      id: "q2",
      img: imgJacket,
      prefix: "What's ",
      suffix: " doing?",
      options: ["she", "he", "it"],
    },
    {
      id: "q3",
      img: imgSoccer,
      prefix: "What ",
      suffix: " doing?",
      options: ["are they", "is he", "is she"],
    },
    {
      id: "q4",
      img: imgClimbing,
      prefix: "What ",
      suffix: " doing?",
      options: ["is it", "is he", "is she"],
    },
    {
      id: "q5",
      img: imgTV,
      prefix: "What ",
      suffix: " doing?",
      options: ["is she", "is he", "are they"],
    },
    {
      id: "q6",
      img: imgReading,
      prefix: "What ",
      suffix: " doing?",
      options: ["is he", "is she", "is it"],
    },
  ];

  // التعديل: استخراج قائمة المعرفات المستخدمة فعلياً في الـ DropZones فقط
  // هذا يضمن أن العنصر لا يظهر كـ "مستخدم" إلا إذا كان داخل أحد المربعات
  const tokens = [
    ...ANSWERS_D.map((item) => ({
      id: item.id,
      value: item.text,
      targets: Object.keys(CORRECT_D).filter((id) => id.endsWith("_drop")),
    })),
    ...QUESTIONS.flatMap((q) =>
      q.options.map((value) => ({
        id: q.id + "-select-" + value,
        value,
        targets: [q.id + "_sel"],
        draggable: false,
      })),
    ),
  ];
  const a = useDropExercise(
    tokens,
    Object.fromEntries(
      Object.entries(CORRECT_D).map(([id, value]) => [
        id,
        id.endsWith("_sel")
          ? value
          : ANSWERS_D.find((item) => item.id === value).text,
      ]),
    ),
  );
  const { rootRef, message, playingKey } = a;
  const answers = Object.fromEntries(
    Object.keys(CORRECT_D).map((id) => [
      id,
      id.endsWith("_sel") ? a.value(id) : a.answers[id] || null,
    ]),
  );
  const showResults = Object.values(a.results).some(Boolean);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );
  const checkAnswers = a.check,
    handleShowAnswer = a.show,
    handleReset = () => {
      a.reset();
    };
  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);
  const [shuffledAnswers] = useState(() => shuffleArray(ANSWERS_D));
  const usedAnswerIds = tokens.filter((t) => a.used(t.id)).map((t) => t.id);
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
            gap: "45px",
          }}
        >
          <ExerciseHeader
            isWorkbook
            sectionLetter="D"
            title={<>Look. Write the questions and then the answers.</>}
            subTitle={
              "Choose the correct subject word first, then complete the question and match the answer."
            }
          />

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-[2] space-y-6">
              {QUESTIONS.map((q, idx) => (
                <div key={q.id} className="flex items-start gap-4 p-3 ">
                  <span className="font-bold text-xl text-blue-900 w-4">
                    {idx + 1}
                  </span>
                  <img
                    src={q.img}
                    className="h-10 object-cover"
                    style={{
                      height: "90px",
                    }}
                    alt={
                      IMAGE_DESCRIPTIONS[q.img] ||
                      "Illustration for this question"
                    }
                  />
                  <div className="flex-1 space-y-2">
                    <div
                      role="group"
                      tabIndex={a.picked ? -1 : 0}
                      aria-label={"Hear question " + q.id + " prompt"}
                      onClick={(e) => {
                        if (!e.target.closest("select"))
                          a.playSound(
                            "prompt-" + q.id,
                            soundFor(q.prefix + " doing"),
                          );
                      }}
                      onKeyDown={(e) => {
                        if (e.target === e.currentTarget) activate(e);
                      }}
                      onKeyUp={(e) => {
                        if (e.target === e.currentTarget) release(e);
                      }}
                      style={{
                        position: "relative",
                        borderRadius: 8,
                        ...(playingKey === "prompt-" + q.id
                          ? {
                              boxShadow: "0 0 0 3px #2563eb",
                              backgroundColor: "#dbeafe",
                            }
                          : {}),
                      }}
                      className={"flex items-center text-lg " + focusClass}
                    >
                      <span className="text-gray-700">{q.prefix}</span>
                      <div className="relative inline-block mx-4">
                        {a.results[q.id + "_sel"] === "wrong" &&
                          answers[`${q.id}_sel`] &&
                          answers[`${q.id}_sel`] !==
                            CORRECT_D[`${q.id}_sel`] && (
                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow">
                              ✕
                            </div>
                          )}

                        <select
                          className={
                            `p-1 border-b-2 border-gray-300 bg-transparent w-25 focus:outline-none font-bold ${a.results[q.id + "_sel"] === "wrong" && answers[`${q.id}_sel`] && answers[`${q.id}_sel`] !== CORRECT_D[`${q.id}_sel`] && "border-red-500"}` +
                            " " +
                            focusClass +
                            " focus-visible:rounded-sm!"
                          }
                          value={a.value(q.id + "_sel")}
                          disabled={a.targetLocked(q.id + "_sel")}
                          tabIndex={a.picked ? -1 : 0}
                          aria-label={"Question " + q.id + " question word"}
                          onChange={(e) => {
                            const t = tokens.find(
                              (t) =>
                                t.targets?.includes(q.id + "_sel") &&
                                t.value === e.target.value,
                            );
                            if (t) a.place(q.id + "_sel", t.id);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.stopPropagation();
                              if (e.repeat) e.preventDefault();
                            }
                          }}
                          onKeyUp={(e) => {
                            if (e.key === "Enter" || e.key === " ")
                              e.stopPropagation();
                          }}
                          style={{
                            borderRadius: 0,
                            ...(a.results[q.id + "_sel"]
                              ? {
                                  borderBottomColor:
                                    a.results[q.id + "_sel"] === "correct"
                                      ? "#16a34a"
                                      : "#ef4444",
                                }
                              : {}),
                          }}
                        >
                          <option value="">...</option>
                          {q.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                      <span className="text-gray-700">{q.suffix}</span>
                      <>{playingKey === "prompt-" + q.id && <SpeakerBadge />}</>
                    </div>
                    <DropZone
                      id={`${q.id}_drop`}
                      content={answers[`${q.id}_drop`]}
                      isCorrect={
                        answers[`${q.id}_drop`] === CORRECT_D[`${q.id}_drop`]
                      }
                      isSubmitted={showResults}
                      interaction={a}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex-1 bg-blue-50 p-5 rounded-2xl border-2 border-blue-100 h-fit sticky top-4">
              <h3 className="font-bold text-blue-800 mb-4 text-center">
                Answers Bank
              </h3>
              <div className="grid grid-cols-1 gap-2">
                <SortableContext items={ANSWERS_D.map((a) => a.id)}>
                  {shuffledAnswers.map((ans) => (
                    <DraggableAnswer
                      key={ans.id}
                      item={ans}
                      // التعديل: نمرر حالة الاستخدام بناءً على وجود المعرف في الـ DropZones فقط
                      isUsed={usedAnswerIds.includes(ans.id)}
                      interaction={a}
                    />
                  ))}
                </SortableContext>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
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
        className="p-2 border-2 border-blue-500 rounded-lg shadow-xl text-blue-700 font-bold text-xs bg-white"
      />
    </DndContext>
  );
}
export default WB_Unit10_Page59_Q1;

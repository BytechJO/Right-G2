/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import Button from "../Button";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 54/Ex H 1.svg";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 54/Ex H 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 54/Ex H 3.svg";
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
import clip0 from "../../../assets/audio/WorkBook/Unit 9/Page 54 - H/Item_001_He_isn't_wearing_boots.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 9/Page 54 - H/Item_002_He_isn't_wearing_a_watch.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 9/Page 54 - H/Item_003_She_isn't_holding_flowers.mp3";
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
  "he isn't wearing boots": clip0,
  "he isn't wearing a watch": clip1,
  "she isn't holding flowers": clip2,
};
const soundFor = (text) => SOUNDS[normalized(text)];
const IMAGE_DESCRIPTIONS = {
  [img2]: "A comparison strip of a man with and without a wristwatch.",
  [img1]: "A comparison strip of a seated boy with and without boots.",
  [img3]:
    "A comparison strip of a girl holding flowers and a girl without flowers.",
};
const exerciseHData = [
  {
    id: 1,
    image: img1,
    correctLetter: "C",
    correctSentence: "He isn't wearing boots.",
    options: ["A", "B", "C", "D"],
  },
  {
    id: 2,
    image: img2,
    correctLetter: "D",
    correctSentence: "He isn't wearing a watch.",
    options: ["A", "B", "C", "D"],
  },
  {
    id: 3,
    image: img3,
    correctLetter: "A",
    correctSentence: "She isn't holding flowers.",
    options: ["A", "B", "C", "D"],
  },
];
const sentenceBank = [
  "He isn't wearing a watch.",
  "She isn't holding flowers.",
  "He isn't wearing boots.",
];
const INITIAL = {
  1: {
    letter: "",
    sentence: "",
  },
  2: {
    letter: "",
    sentence: "",
  },
  3: {
    letter: "",
    sentence: "",
  },
};

/* 🔹 Draggable */
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
    pointer.current = { id };
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
    // pointerWithin uses the current viewport coordinates, including after scrolling.
    // Drag delta also includes scroll adjustment and must not be added to the pointer.
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
function DraggableItem({ word, value, type, parentId, children, interaction }) {
  const tokenId = type + "-" + value + "-" + (parentId || "bank");
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
      className={
        `WB-word-bank touch-none
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-grab hover:bg-blue-50"}
        
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
        padding: "9px 22px",
        touchAction: "none",
      }}
    >
      {children}
      <>{interaction.playingKey === "bank-" + tokenId && <SpeakerBadge />}</>
    </div>
  );
}
function DropZone({ id, type, children, interaction }) {
  const target = type + "-" + id;
  const { setNodeRef, isOver } = useDroppable({
    id: target,
    disabled: interaction.targetLocked(target),
  });
  const props = interaction.slotProps(target, !!interaction.active && isOver);
  return (
    <div
      ref={(element) => {
        setNodeRef(element);
        interaction.slotRefs.current[target] = element;
      }}
      {...props}
      className={"transition-all focus-visible:rounded-md! " + focusClass}
    >
      {children}
      {interaction.playingKey === "answer-" + target && <SpeakerBadge />}
    </div>
  );
}
function WB_Unit9_Page54_Q2() {
  const tokens = [
    ...sentenceBank.map((value) => ({
      id: "sentence-" + value + "-bank",
      value,
      targets: exerciseHData.map((q) => "sentence-" + q.id),
    })),
    ...exerciseHData.flatMap((q) =>
      q.options.map((value) => ({
        id: "letter-" + value + "-" + q.id,
        value,
        targets: ["letter-" + q.id],
      })),
    ),
  ];
  const a = useDropExercise(
    tokens,
    Object.fromEntries(
      exerciseHData.flatMap((q) => [
        ["letter-" + q.id, q.correctLetter],
        ["sentence-" + q.id, q.correctSentence],
      ]),
    ),
  );
  const { rootRef, message } = a;
  const answers = Object.fromEntries(
    exerciseHData.map((q) => [
      q.id,
      {
        letter: a.value("letter-" + q.id),
        sentence: a.value("sentence-" + q.id),
      },
    ]),
  );
  const locked = false;
  const usedSentences = new Set(
    sentenceBank.filter((value) => a.used("sentence-" + value + "-bank")),
  );
  const usedLetters = new Set(
    exerciseHData.flatMap((q) =>
      (q.options || [])
        .filter((v) => a.used("letter-" + v + "-" + q.id))
        .map((v) => q.id + "-" + v),
    ),
  );
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
            sectionLetter="H"
            title={<>Which one is different? Look and write.</>}
            subTitle={"Find the one picture that does not match the others, then write the sentence that explains why."}
          />
          <div className="flex flex-col gap-5">
            {/* Sentence Bank */}
            <div className="p-4 flex flex-wrap justify-center gap-4">
              {sentenceBank.map((s) => {
                const isUsed = usedSentences.has(s);
                return (
                  <DraggableItem
                    key={s}
                    type="sentence"
                    value={s}
                    disabled={locked || isUsed}
                    interaction={a}
                  >
                    {s}
                  </DraggableItem>
                );
              })}
            </div>

            {/* Rows */}
            <div className="flex flex-col gap-8">
              {exerciseHData.map((item) => (
                <div key={item.id} className="flex gap-6 items-center">
                  {/* الصورة + الحروف */}
                  <div className="rounded-2xl p-4">
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

                    <div className="flex justify-around mt-2 font-bold text-gray-600">
                      {item.options.map((opt) => {
                        const isUsed = usedLetters.has(`${item.id}-${opt}`);
                        return (
                          <DraggableItem
                            key={opt}
                            type="letter"
                            value={opt}
                            parentId={item.id}
                            disabled={locked || isUsed}
                            interaction={a}
                          >
                            {opt}
                          </DraggableItem>
                        );
                      })}
                    </div>
                  </div>

                  {/* Drop Zones */}
                  <div className="flex gap-4 flex-1">
                    <DropZone id={item.id} type="letter" interaction={a}>
                      <div className="relative">
                        <div
                          className={`w-12 h-12 border-2 rounded-xl flex items-center justify-center font-bold text-xl ${a.results["letter-" + item.id] === "wrong" && answers[item.id].letter && answers[item.id].letter !== item.correctLetter && "border-red-500"}`}
                          style={{
                            ...(a.results["letter-" + item.id]
                              ? {
                                  borderColor:
                                    a.results["letter-" + item.id] === "correct"
                                      ? "#16a34a"
                                      : "#ef4444",
                                }
                              : {}),
                          }}
                        >
                          {answers[item.id].letter}
                        </div>

                        {a.results["letter-" + item.id] === "wrong" &&
                          answers[item.id].letter &&
                          answers[item.id].letter !== item.correctLetter && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-lg">
                              ✕
                            </div>
                          )}
                      </div>
                    </DropZone>

                    <DropZone id={item.id} type="sentence" interaction={a}>
                      <div className="relative">
                        <div
                          className={`min-w-[250px] h-[50px] border-b-2 px-2 py-2 text-lg ${a.results["sentence-" + item.id] === "wrong" && answers[item.id].sentence && answers[item.id].sentence !== item.correctSentence && "border-red-500"}`}
                          style={{
                            ...(a.results["sentence-" + item.id]
                              ? {
                                  borderColor:
                                    a.results["sentence-" + item.id] ===
                                    "correct"
                                      ? "#16a34a"
                                      : "#ef4444",
                                }
                              : {}),
                          }}
                        >
                          {answers[item.id].sentence}
                        </div>

                        {a.results["sentence-" + item.id] === "wrong" &&
                          answers[item.id].sentence &&
                          answers[item.id].sentence !==
                            item.correctSentence && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-lg">
                              ✕
                            </div>
                          )}
                      </div>
                    </DropZone>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-16 flex justify-center">
            <Button
              handleShowAnswer={handleShowAnswer}
              handleStartAgain={handleTryAgain}
              checkAnswers={checkAnswers}
            />
          </div>
        </div>
      </div>

      <DragPreview
        interaction={a}
        className="px-4 py-2 bg-white border-2 border-blue-500 rounded-lg shadow-xl font-serif italic"
      />
    </DndContext>
  );
}
export default WB_Unit9_Page54_Q2;

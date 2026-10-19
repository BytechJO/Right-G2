import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import sound0 from "../../../assets/audio/WorkBook/Unit 2/Page 10 - D/Item_001_this.mp3";
import sound1 from "../../../assets/audio/WorkBook/Unit 2/Page 10 - D/Item_002_a.mp3";
import sound2 from "../../../assets/audio/WorkBook/Unit 2/Page 10 - D/Item_003_Is.mp3";
import sound3 from "../../../assets/audio/WorkBook/Unit 2/Page 10 - D/Item_004_bird.mp3";
import sound4 from "../../../assets/audio/WorkBook/Unit 2/Page 10 - D/Item_005_these.mp3";
import sound5 from "../../../assets/audio/WorkBook/Unit 2/Page 10 - D/Item_006_Are.mp3";
import sound6 from "../../../assets/audio/WorkBook/Unit 2/Page 10 - D/Item_007_dogs.mp3";
import sound7 from "../../../assets/audio/WorkBook/Unit 2/Page 10 - D/Item_008_clouds.mp3";
import sound8 from "../../../assets/audio/WorkBook/Unit 2/Page 10 - D/Item_009_those.mp3";
import sound9 from "../../../assets/audio/WorkBook/Unit 2/Page 10 - D/Item_010_pond.mp3";
import sound10 from "../../../assets/audio/WorkBook/Unit 2/Page 10 - D/Item_011_that.mp3";
import sound11 from "../../../assets/audio/WorkBook/Unit 2/Page 10 - D/Item_012_Yes,_it_is.mp3";
import sound12 from "../../../assets/audio/WorkBook/Unit 2/Page 10 - D/Item_013_No,_it_isn't.mp3";
import sound13 from "../../../assets/audio/WorkBook/Unit 2/Page 10 - D/Item_014_Yes,_they_are.mp3";
import sound14 from "../../../assets/audio/WorkBook/Unit 2/Page 10 - D/Item_015_No,_they_aren't.mp3";
import { createPortal } from "react-dom";
import React, { useState, useRef, useEffect } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 10/Ex D 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 10/Ex D 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 10/Ex D 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 10/Ex D 4.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import {
  DragDropContext,
  Droppable,
  Draggable,
  useMouseSensor,
  useTouchSensor,
} from "@hello-pangea/dnd";

// Keep the score dialog's return focus on an enabled action in this exercise.
// Keep the actual draggable in viewport coordinates; the inert source keeps its exact bank position.
// eslint-disable-next-line react-refresh/only-export-components -- Exercise-local drag presentation.
function BankDragItem({ provided, snapshot, freeze, normalStyle, children }) {
  const appearance = useRef({});
  const originalRef = children.props.ref;
  const measure = (node) => {
    if (!node || snapshot.isDragging) return;
    const computed = window.getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    const scale = node.offsetWidth ? rect.width / node.offsetWidth : 1;
    const next = { fontFamily: computed.fontFamily, fontWeight: computed.fontWeight, color: computed.color };
    for (const key of ['fontSize', 'lineHeight', 'letterSpacing', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderRadius']) {
      const value = parseFloat(computed[key]);
      if (Number.isFinite(value)) next[key] = value * scale;
    }
    appearance.current = next;
  };
  const ref = (node) => {
    if (typeof originalRef === 'function') originalRef(node);
    else if (originalRef) originalRef.current = node;
    measure(node);
  };
  const element = React.cloneElement(children, {
    ref,
    onPointerDownCapture: (event) => {
      children.props.onPointerDownCapture?.(event);
      measure(event.currentTarget);
    },
    style: {
      ...normalStyle,
      ...(snapshot.isDragging ? appearance.current : {}),
      ...provided.draggableProps.style,
      ...(snapshot.isDragging
        ? { opacity: 1, visibility: 'visible', zIndex: 2147483647, pointerEvents: 'none' }
        : freeze ? { transform: 'none', transition: 'none' } : {}),
    },
  });
  if (!snapshot.isDragging) return element;
  const space = React.createElement(children.type, {
    'aria-hidden': true,
    className: children.props.className,
    style: { ...normalStyle, visibility: 'hidden', pointerEvents: 'none' },
  }, children.props.children);
  return <>{space}{createPortal(element, document.fullscreenElement || document.body)}</>;
}

function showCheckFeedback(root, kind, ...messages) {
  if (kind === "success") {
    const returnTarget =
      root?.querySelector(".try-again-button:not(:disabled)") ||
      root?.querySelector(".show-answer-btn:not(:disabled)");
    returnTarget?.focus({ preventScroll: true });
  }
  ValidationAlert[kind](...messages);
}



const exerciseData = [
  {
    id: 1,
    scrambled: "this/ a/ Is/ bird /?",
    correctQuestion: "Is this a bird?",
    options: ["Yes, it is.", "No, it isn't."],
    correctOption: "No, it isn't.",
    image: img1,
  },
  {
    id: 2,
    scrambled: "these /Are /dogs /?",
    correctQuestion: "Are these dogs?",
    options: ["Yes, they are.", "No, they aren't."],
    correctOption: "No, they aren't.",
    image: img2,
  },
  {
    id: 3,
    scrambled: "clouds /those /Are /?",
    correctQuestion: "Are those clouds?",
    options: ["Yes, they are.", "No, they aren't."],
    correctOption: "Yes, they are.",
    image: img3,
  },
  {
    id: 4,
    scrambled: "pond /a /that/ Is /?",
    correctQuestion: "Is that a pond?",
    options: ["Yes, it is.", "No, it isn't."],
    correctOption: "No, it isn't.",
    image: img4,
  },
];

const buildQuestionFromWords = (words) => {
  return words
    .map((w) => w.text)
    .join(" ")
    .replace(/\s+\?/g, "?")
    .trim();
};

const IMAGE_DESCRIPTIONS = {
  [img1]: "A blue flower.",
  [img2]: "Three brown rabbits.",
  [img3]: "Three grey clouds.",
  [img4]: "Two children in a swimming pool.",
};
const focusClass =
  "focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!";
// eslint-disable-next-line react-refresh/only-export-components -- Keep this indicator local.
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

const SOUNDS = {
  this: sound0,
  a: sound1,
  is: sound2,
  bird: sound3,
  these: sound4,
  are: sound5,
  dogs: sound6,
  clouds: sound7,
  those: sound8,
  pond: sound9,
  that: sound10,
  "yes, it is": sound11,
  "no, it isn't": sound12,
  "yes, they are": sound13,
  "no, they aren't": sound14,
};
function useSelectAnswers(correct, missingMessage) {
  const completedCheckRef = useRef(null);
  const completeCheck = (event) => {
    const button = event?.currentTarget;
    if (
      !completedCheckRef.current ||
      (button?.style && completedCheckRef.current.button !== button)
    ) {
      completedCheckRef.current = {
        button,
        cursor: button?.style?.cursor,
        aria: button?.getAttribute?.("aria-disabled"),
      };
    }
    if (button?.style) {
      button.style.cursor = "not-allowed";
      button.setAttribute("aria-disabled", "true");
    }
  };
  const resetCompletedCheck = () => {
    const previous = completedCheckRef.current;
    if (previous?.button?.style) {
      previous.button.style.cursor = previous.cursor || "";
      if (previous.aria == null)
        previous.button.removeAttribute("aria-disabled");
      else previous.button.setAttribute("aria-disabled", previous.aria);
    }
    completedCheckRef.current = null;
  };

  const [values, setValues] = useState({}),
    [results, setResults] = useState({}),
    [revealed, setRevealed] = useState(false),
    [message, setMessage] = useState("");
  const audio = useExerciseAudio();
  const locked = (id) => revealed || results[id] === "correct";
  const choose = (id, value) => {
    audio.rootRef.current?.querySelectorAll("audio").forEach((a) => a.pause());
    if (locked(id)) {
      setMessage("This answer is correct and locked.");
      return;
    }
    setValues((p) => ({
      ...p,
      [id]: value,
    }));
    setResults((p) => ({
      ...p,
      [id]: null,
    }));
    setMessage("Question " + id + ": " + value + " selected.");
  };
  const check = (checkEvent) => {
    if (completedCheckRef.current) {
      completeCheck(checkEvent);
      return;
    }

    if (revealed) return;
    audio.stopAudio();
    if (
      Object.keys(correct).some(
        (id) => values[id] === undefined || values[id] === "",
      )
    ) {
      ValidationAlert.info(missingMessage);
      setMessage(missingMessage);
      return;
    }
    const next = Object.fromEntries(
      Object.keys(correct).map((id) => [
        id,
        results[id] === "correct" || values[id] === correct[id]
          ? "correct"
          : "wrong",
      ]),
    );
    setResults(next);
    const score = Object.values(next).filter((x) => x === "correct").length,
      total = Object.keys(correct).length,
      msg = "Score: " + score + " / " + total;
    setMessage(
      msg + ". Correct answers are locked. Incorrect answers can be changed.",
    );
    ((score === total ? "success" : score ? "warning" : "error") ===
      "success" && completeCheck(checkEvent),
      showCheckFeedback(audio.rootRef.current, score === total ? "success" : score ? "warning" : "error", msg));
  };
  const show = () => {
    audio.stopAudio();
    setValues({
      ...correct,
    });
    setResults(
      Object.fromEntries(Object.keys(correct).map((id) => [id, "correct"])),
    );
    setRevealed(true);
    setMessage("Correct answers shown and locked.");
  };
  const reset = () => {
    resetCompletedCheck();

    audio.stopAudio();
    audio.rootRef.current?.querySelectorAll("audio").forEach((a) => a.pause());
    setValues({});
    setResults({});
    setRevealed(false);
    setMessage("Exercise reset.");
  };
  const props = (id, value, src) => ({
    role: "button",
    tabIndex: 0,
    "aria-pressed": values[id] === value,
    "aria-disabled": locked(id),
    "aria-label":
      "Question " +
      id +
      ": " +
      value +
      (locked(id)
        ? ". Correct answer locked."
        : results[id] === "wrong"
          ? ". Incorrect. Choose another answer."
          : ""),
    onKeyDown: activate,
    onKeyUp: release,
    onClick: () => {
      if (src) audio.playSound("choice-" + id + "-" + value, src);
      choose(id, value);
    },
    style: {
      position: "relative",
      ...(values[id] === value && results[id]
        ? {
            boxShadow:
              "inset 0 0 0 2px " +
              (results[id] === "correct" ? "#16a34a" : "#ef4444"),
            borderColor: results[id] === "correct" ? "#16a34a" : "#ef4444",
            borderBottomColor:
              results[id] === "correct" ? "#16a34a" : "#ef4444",
          }
        : {}),
      ...(audio.playingKey === "choice-" + id + "-" + value
        ? {
            backgroundColor: "#dbeafe",
          }
        : {}),
    },
  });
  const nativeProps = (id) => ({
    "aria-label": "Answer " + id + (locked(id) ? ". Correct and locked." : ""),
    disabled: locked(id),
    value: values[id] ?? "",
    onChange: (e) => choose(id, e.target.value),
    style: {
      borderRadius: 0,
      ...(results[id]
        ? {
            borderColor: results[id] === "correct" ? "#16a34a" : "#ef4444",
          }
        : {}),
    },
  });
  const evaluate = () => {
    const next = Object.fromEntries(
      Object.keys(correct).map((id) => [
        id,
        results[id] === "correct" || values[id] === correct[id]
          ? "correct"
          : "wrong",
      ]),
    );
    setResults(next);
    return next;
  };
  return {
    evaluate,
    ...audio,
    values,
    results,
    revealed,
    message,
    locked,
    choose,
    check,
    show,
    reset,
    props,
    nativeProps,
  };
}
function useTokenOrder(questions, sounds) {
  const initial = Object.fromEntries(questions.map((q) => [q.id, []]));
  const [inputs, setInputs] = useState(initial),
    [results, setResults] = useState({}),
    [revealed, setRevealed] = useState(false),
    [picked, setPicked] = useState(null),
    [message, setMessage] = useState("");
  const audio = useExerciseAudio(),
    bankRefs = useRef({}),
    slotRefs = useRef({}),
    frame = useRef(null),
    suppress = useRef(false);
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
        get()?.focus();
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
  const locked = (id) => revealed || results[id] === "correct",
    tokens = (q) =>
      q.scrambled.map((t, i) =>
        typeof t === "string"
          ? {
              id: q.id + "-" + t + "-" + i,
              value: t,
            }
          : t,
      );
  const place = (id, tokenId, index) => {
    const q = questions.find((q) => String(q.id) === String(id)),
      item = q && tokens(q).find((t) => t.id === tokenId);
    if (
      !item ||
      locked(id) ||
      inputs[id].some((t) => t.id === tokenId) ||
      inputs[id].length >= tokens(q).length
    )
      return;
    const next = [...inputs[id]];
    next.splice(index ?? next.length, 0, item);
    setInputs((prev) => ({
      ...prev,
      [id]: next,
    }));
    setResults((prev) => ({
      ...prev,
      [id]: null,
    }));
    setPicked(null);
    setMessage(item.value + " placed.");
    return next;
  };
  const remove = (id, tokenId) => {
    if (locked(id)) return;
    setInputs((prev) => ({
      ...prev,
      [id]: prev[id].filter((t) => t.id !== tokenId),
    }));
    setResults((prev) => ({
      ...prev,
      [id]: null,
    }));
    setMessage("Item returned to the bank.");
  };
  const cancel = () => {
    if (picked) focus(() => bankRefs.current[picked.token]);
    setPicked(null);
    setMessage("Selection cancelled.");
  };
  const bankProps = (q, item, pendingMatch = false) => ({
    role: "button",
    tabIndex: pendingMatch || picked ? -1 : 0,
    "aria-pressed": picked?.token === item.id,
    "aria-disabled": locked(q.id) || inputs[q.id].some((t) => t.id === item.id),
    "aria-label": item.value + ". Choose for question " + q.id,
    onClick: () =>
      audio.playSound("bank-" + item.id, sounds[item.value.toLowerCase()]),
    onFocus: (e) => {
      if (!suppress.current && e.currentTarget.matches(":focus-visible"))
        audio.playSound("bank-" + item.id, sounds[item.value.toLowerCase()]);
    },
    onKeyDown: (e) => {
      if (e.key === "Escape" && picked) {
        e.preventDefault();
        e.stopPropagation();
        cancel();
        return;
      }
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      e.stopPropagation();
      if (
        e.repeat ||
        locked(q.id) ||
        inputs[q.id].some((t) => t.id === item.id)
      )
        return;
      audio.playSound("bank-" + item.id, sounds[item.value.toLowerCase()]);
      setPicked({
        qid: q.id,
        token: item.id,
      });
      setMessage(
        item.value + " chosen. Press Enter or Space in the answer field.",
      );
      focus(() => slotRefs.current[q.id]);
    },
    onKeyUp: release,
  });
  const slotProps = (q, snapshot, pendingMatch = false) => ({
    role: "button",
    tabIndex: pendingMatch || (picked && picked.qid !== q.id) ? -1 : 0,
    "aria-label":
      "Question " +
      q.id +
      " answer: " +
      (inputs[q.id].map((t) => t.value).join(q.separator) || "Empty") +
      (locked(q.id) ? ". Correct and locked" : ""),
    "aria-disabled": locked(q.id),
    onClick: (e) => {
      if (e.target === e.currentTarget && !locked(q.id) && inputs[q.id].length)
        remove(q.id, inputs[q.id].at(-1).id);
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
        if (!e.repeat && results[q.id] === "wrong" && inputs[q.id].length)
          remove(q.id, inputs[q.id].at(-1).id);
        return;
      }
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      e.stopPropagation();
      if (e.repeat || locked(q.id)) return;
      if (picked) {
        if (picked.qid !== q.id) return;
        const next = place(q.id, picked.token);
        if (next) {
          const token = tokens(q).find((t) => !next.some((v) => v.id === t.id));
          focus(() => bankRefs.current[token?.id || picked.token]);
        }
      } else if (inputs[q.id].length) remove(q.id, inputs[q.id].at(-1).id);
    },
    onKeyUp: release,
    style: {
      borderRadius: 0,
      position: "relative",
      ...(locked(q.id)
        ? {
            borderColor: "#16a34a",
            borderBottomColor: "#16a34a",
            boxShadow: "inset 0 0px #16a34a",
          }
        : results[q.id] === "wrong"
          ? {
              borderBottomColor: "#ef4444",
            }
          : {}),
      ...(snapshot?.isDraggingOver && !locked(q.id)
        ? {
            outline: "3px dashed #2563eb",
            outlineOffset: 2,
            backgroundColor: "#dbeafe",
          }
        : {}),
    },
  });
  const evaluate = () => {
    cancelFocus();
    setPicked(null);
    audio.stopAudio();
    const next = Object.fromEntries(
      questions.map((q) => [
        q.id,
        results[q.id] === "correct" ||
        inputs[q.id].map((t) => t.value).join(q.separator) === q.correctSentence
          ? "correct"
          : "wrong",
      ]),
    );
    setResults(next);
    return next;
  };
  const show = () => {
    cancelFocus();
    audio.stopAudio();
    setPicked(null);
    const solved = Object.fromEntries(
      questions.map((q) => {
        const remaining = tokens(q);
        return [
          q.id,
          q.correctSentence.split(q.separator).map((value) => {
            const index = remaining.findIndex((t) => t.value === value);
            return remaining.splice(index, 1)[0];
          }),
        ];
      }),
    );
    setInputs(solved);
    setResults(Object.fromEntries(questions.map((q) => [q.id, "correct"])));
    setRevealed(true);
    setMessage("Correct answers shown and locked.");
  };
  const reset = () => {
    cancelFocus();
    audio.stopAudio();
    setPicked(null);
    setInputs(initial);
    setResults({});
    setRevealed(false);
    setMessage("Exercise reset.");
  };
  const dragStart = () => {
    cancelFocus();
    setPicked(null);
  };
  const reorder = (id, from, to) => {
    if (locked(id)) return;
    const next = [...inputs[id]],
      item = next.splice(from, 1)[0];
    if (!item) return;
    next.splice(to, 0, item);
    setInputs((p) => ({
      ...p,
      [id]: next,
    }));
    setResults((p) => ({
      ...p,
      [id]: null,
    }));
  };
  return {
    reorder,
    ...audio,
    bankRefs,
    slotRefs,
    inputs,
    results,
    revealed,
    picked,
    message,
    setMessage,
    tokens,
    locked,
    place,
    remove,
    bankProps,
    slotProps,
    evaluate,
    show,
    reset,
    dragStart,
    cancelFocus,
  };
}

const WB_Unit2_Page10_Q2 = () => {
  const completedCheckRef = useRef(null);
  const completeCheck = (event) => {
    const button = event?.currentTarget;
    if (
      !completedCheckRef.current ||
      (button?.style && completedCheckRef.current.button !== button)
    ) {
      completedCheckRef.current = {
        button,
        cursor: button?.style?.cursor,
        aria: button?.getAttribute?.("aria-disabled"),
      };
    }
    if (button?.style) {
      button.style.cursor = "not-allowed";
      button.setAttribute("aria-disabled", "true");
    }
  };
  const resetCompletedCheck = () => {
    const previous = completedCheckRef.current;
    if (previous?.button?.style) {
      previous.button.style.cursor = previous.cursor || "";
      if (previous.aria == null)
        previous.button.removeAttribute("aria-disabled");
      else previous.button.setAttribute("aria-disabled", previous.aria);
    }
    completedCheckRef.current = null;
  };

  const orderedQuestions = exerciseData.map((q) => ({
    id: q.id,
    scrambled: q.scrambled
      .split("/")
      .map((w) => w.trim())
      .filter(Boolean),
    correctSentence: q.correctQuestion.replace(/\?/, " ?"),
    separator: " ",
  }));
  const order = useTokenOrder(orderedQuestions, SOUNDS);
  const selection = useSelectAnswers(
    Object.fromEntries(exerciseData.map((q) => [q.id, q.correctOption])),
    "Please complete all answers!",
  );
  const { rootRef, message, playingKey } = order;
  const userAnswers = Object.fromEntries(
    exerciseData.map((q) => [
      q.id,
      {
        arrangedWords: order.inputs[q.id].map((t) => ({
          ...t,
          text: t.value,
        })),
        wordBank: order
          .tokens(orderedQuestions.find((v) => v.id === q.id))
          .map((t) => ({
            ...t,
            text: t.value,
            isUsed: order.inputs[q.id].some((v) => v.id === t.id),
          })),
        selectedOption: selection.values[q.id],
      },
    ]),
  );
  const checked = false;
  const onDragEnd = ({ source, destination, draggableId }) => {
    if (!destination) return;
    const id = Number(destination.droppableId.split("-")[1]);
    if (Number(source.droppableId.split("-")[1]) !== id || order.locked(id))
      return;
    if (destination.droppableId.startsWith("bank-")) {
      if (source.droppableId.startsWith("answer-"))
        order.remove(id, draggableId.replace(/^answer-/, ""));
      return;
    }
    if (source.droppableId.startsWith("answer-"))
      order.reorder(id, source.index, destination.index);
    else order.place(id, draggableId, destination.index);
  };
  const handleShowAnswer = () => {
      order.show();
      selection.show();
    },
    handleTryAgain = () => {
      order.reset();
      selection.reset();
    };
  const checkAnswers = (checkEvent) => {
    if (completedCheckRef.current) {
      completeCheck(checkEvent);
      return;
    }

    if (order.revealed) return;
    order.dragStart();
    order.stopAudio();
    selection.stopAudio();
    if (
      exerciseData.some(
        (q) =>
          !order.inputs[q.id].length || selection.values[q.id] === undefined,
      )
    ) {
      ValidationAlert.info("Please complete all answers!");
      order.setMessage("Please complete all answers!");
      return;
    }
    const a = order.evaluate(),
      b = selection.evaluate();
    const score = [...Object.values(a), ...Object.values(b)].filter(
        (r) => r === "correct",
      ).length,
      msg = "Score: " + score + "/8";
    order.setMessage(
      msg + ". Correct answers are locked; incorrect answers can be changed.",
    );
    ((score === 8 ? "success" : score ? "warning" : "error") === "success" &&
      completeCheck(checkEvent),
      showCheckFeedback(rootRef.current, score === 8 ? "success" : score ? "warning" : "error", msg));
  };

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onDragStart={order.dragStart}
      enableDefaultSensors={false}
      sensors={[useMouseSensor, useTouchSensor]}
    >
      <div
        className="main-container-component"
        ref={(el) => {
          rootRef.current = el;
          selection.rootRef.current = el;
        }}
      >
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {message || selection.message}
        </div>
        <div className="div-forall mb-10" style={{ gap: "30px" }}>
          <ExerciseHeader
            isWorkbook
            sectionLetter="D"
            title={"Unscramble, look, write, and answer."}
            subTitle={
              "Reorder the question first, use the picture to decide the answer, then write both correctly."
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 ">
            {exerciseData.map((item) => {
              const builtQuestion = buildQuestionFromWords(
                userAnswers[item.id].arrangedWords,
              );
              const questionCorrect =
                builtQuestion.toLowerCase() ===
                item.correctQuestion.toLowerCase();

              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 relative w-[80%]"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-blue-700 font-bold text-xl mt-[20px]">
                      {item.id}
                    </span>

                    <div className="flex flex-col gap-3 w-full">
                      <Droppable droppableId={`bank-${item.id}`} direction="horizontal" isDropDisabled={true}>
                        {(provided, bankSnapshot) => <div ref={provided.innerRef} {...provided.droppableProps} className="min-h-[56px] w-full rounded-lg p-3 flex flex-wrap justify-between">
                            {userAnswers[item.id].wordBank.map((word, index) => <Draggable key={word.id} draggableId={word.id} index={index} isDragDisabled={order.locked(item.id) || word.isUsed} // ✅ updated
    >
                                  {(provided, snapshot) => <BankDragItem provided={provided} snapshot={snapshot} freeze={!!bankSnapshot.draggingFromThisWith} normalStyle={{
        position: "relative",
        borderRadius: 8,
        ...(order.picked?.token === word.id ? {
          outline: "4px solid #2563eb",
          backgroundColor: "#dbeafe"
        } : {})
      }}><div ref={el => {
          provided.innerRef(el);
          order.bankRefs.current[word.id] = el;
        }} {...provided.draggableProps} {...provided.dragHandleProps} {...order.bankProps(orderedQuestions.find(q => q.id === item.id), word)} className={`${focusClass} WB-word-bank
                                    ${word.isUsed ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white cursor-grab"}`}>
                                        {word.text}
                                        {playingKey === "bank-" + word.id && <SpeakerBadge />}
                                      </div></BankDragItem>}
                                </Draggable>)}
                            {bankSnapshot.draggingFromThisWith ? <span aria-hidden="true" style={{
      display: "none"
    }}>{provided.placeholder}</span> : provided.placeholder}
                          </div>}
                      </Droppable>

                      <Droppable
                        droppableId={`answer-${item.id}`}
                        isDropDisabled={order.locked(item.id)}
                        direction="horizontal"
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={(el) => {
                              provided.innerRef(el);
                              order.slotRefs.current[item.id] = el;
                            }}
                            {...provided.droppableProps}
                            {...order.slotProps(
                              orderedQuestions.find((q) => q.id === item.id),
                              snapshot,
                            )}
                            className={`${focusClass} min-h-[56px] w-full border-2 rounded-lg p-3 flex flex-wrap gap-2 bg-white
                          ${
                            checked
                              ? questionCorrect
                                ? "border-gray-400"
                                : "border-red-400"
                              : "border-gray-300"
                          }`}
                          >
                            {userAnswers[item.id].arrangedWords.map(
                              (word, index) => (
                                <Draggable
                                  key={word.id}
                                  draggableId={`answer-${word.id}`}
                                  index={index}
                                  isDragDisabled={order.locked(item.id)}
                                >
                                  {(provided, snapshot) => {
                                    const element = (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        tabIndex={-1}
                                        onKeyDown={(e) => e.stopPropagation()}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          order.remove(item.id, word.id);
                                        }}
                                        className="rounded-md text-[18px]cursor-pointer hover:text-red-500 transition"
                                        style={{
                                          ...provided.draggableProps.style,
                                          ...(snapshot.isDragging
                                            ? {
                                                zIndex: 2147483647,
                                                visibility: "visible",
                                                opacity: 1,
                                                pointerEvents: "none",
                                              }
                                            : {}),
                                        }}
                                      >
                                        {word.text}
                                      </div>
                                    );
                                    return snapshot.isDragging
                                      ? createPortal(
                                          element,
                                          document.fullscreenElement ||
                                            document.body,
                                        )
                                      : element;
                                  }}
                                </Draggable>
                              ),
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      {order.results[item.id] === "wrong" && (
                        <span className="text-lg">
                          {questionCorrect ? (
                            ""
                          ) : (
                            <span className="absolute top-16 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg border-2 border-white">
                              ✕
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center mt-2 justify-between">
                    <div className="flex flex-col gap-2">
                      {item.options.map((option) => {
                        const isSelected =
                          userAnswers[item.id].selectedOption === option;
                        const isCorrectOption = option === item.correctOption;
                        const isWrongOption =
                          selection.results[item.id] === "wrong" &&
                          isSelected &&
                          !isCorrectOption;
                        return (
                          <div
                            key={option}
                            {...selection.props(
                              item.id,
                              option,
                              SOUNDS[option.replace(/\.$/, "").toLowerCase()],
                            )}
                            className={`
    relative ${focusClass}
    cursor-pointer px-4 py-1 rounded-full border-2 transition-all text-lg

    ${
      isSelected
        ? isWrongOption
          ? "border-red-500 bg-red-50"
          : "border-gray-500 bg-green-50"
        : "border-transparent hover:bg-gray-50"
    }
  `}
                          >
                            {option}
                            {selection.playingKey ===
                              "choice-" + item.id + "-" + option && (
                              <SpeakerBadge />
                            )}
                            {isWrongOption && (
                              <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg border-2 border-white">
                                ✕
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={IMAGE_DESCRIPTIONS[item.image] || ""}
                        className="object-contain"
                        style={{ height: "90px", width: "100px" }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={(checkEvent) => {
              resetCompletedCheck();
              handleTryAgain(checkEvent);
            }}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </DragDropContext>
  );
};

export default WB_Unit2_Page10_Q2;

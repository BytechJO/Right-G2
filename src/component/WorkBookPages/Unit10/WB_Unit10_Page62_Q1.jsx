/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 62/SVG/Asset 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 62/SVG/Asset 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 62/SVG/Asset 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 62/SVG/Asset 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 62/SVG/Asset 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 62/SVG/Asset 6.svg";
import img7 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 62/SVG/Asset 7.svg";
import img8 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 62/SVG/Asset 8.svg";
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
import clip0 from "../../../assets/audio/WorkBook/Unit 10/Page 62 - A/Item_001_sleep.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 10/Page 62 - A/Item_002_feet.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 10/Page 62 - A/Item_003_ten.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 10/Page 62 - A/Item_004_bed.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 10/Page 62 - A/Item_005_net.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 10/Page 62 - A/Item_006_read.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 10/Page 62 - A/Item_007_bread.mp3";
import clip7 from "../../../assets/audio/WorkBook/Unit 10/Page 62 - A/Item_008_green.mp3";
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
function useAnswers(correct, options = {}) {
  const audio = useExerciseAudio();
  const [values, setValues] = useState({}),
    [results, setResults] = useState({}),
    [revealed, setRevealed] = useState(false),
    [message, setMessage] = useState("");
  const ids = Object.keys(correct),
    complete = ids.every((id) => results[id] === "correct");
  const completionRef = useRef(false);
  completionRef.current = complete || revealed;
  useCheckButton(audio.rootRef, complete || revealed);
  const locked = (id) => revealed || results[id] === "correct";
  const chosen = (id, value) =>
    Array.isArray(correct[id])
      ? (values[id] || []).includes(value)
      : values[id] === value;
  const choose = (id, value) => {
    if (locked(id)) return;
    audio.rootRef.current
      ?.querySelectorAll("audio")
      .forEach((player) => player.pause());
    let next = value;
    if (Array.isArray(correct[id])) {
      const current = values[id] || [];
      if (current.includes(value)) next = current.filter((v) => v !== value);
      else {
        if (options.limit && current.length >= options.limit) return;
        next = [...current, value];
      }
    }
    setValues((prev) => ({
      ...prev,
      [id]: next,
    }));
    setResults((prev) => ({
      ...prev,
      [id]: null,
    }));
    setMessage("Answer " + id + " updated.");
  };
  const stop = () => {
    audio.stopAudio();
    audio.rootRef.current?.querySelectorAll("audio").forEach((a) => a.pause());
  };
  const check = () => {
    if (completionRef.current) return;
    stop();
    if (
      ids.some((id) =>
        Array.isArray(correct[id])
          ? !values[id]?.length
          : values[id] === undefined || values[id] === "",
      )
    ) {
      const text = options.missing || "Please complete all answers first.";
      setMessage(text);
      ValidationAlert.info(text);
      return;
    }
    const same = (actual, expected) =>
      Array.isArray(expected)
        ? actual.length === expected.length &&
          expected.every((v) => actual.includes(v))
        : options.normalize
          ? normalized(actual) === normalized(expected)
          : actual === expected;
    const next = Object.fromEntries(
      ids.map((id) => [
        id,
        results[id] === "correct" || same(values[id], correct[id])
          ? "correct"
          : "wrong",
      ]),
    );
    setResults(next);
    const score = Object.values(next).filter((v) => v === "correct").length;
    completionRef.current = score === ids.length;
    setMessage(
      "Score " +
        score +
        " out of " +
        ids.length +
        ". Correct answers are locked.",
    );
    showCheckFeedback(
      audio.rootRef.current,
      score === ids.length ? "success" : score ? "warning" : "error",
      "Score: " + score + " / " + ids.length,
    );
  };
  const show = () => {
    completionRef.current = true;
    stop();
    setValues(
      Object.fromEntries(
        ids.map((id) => [
          id,
          Array.isArray(correct[id]) ? [...correct[id]] : correct[id],
        ]),
      ),
    );
    setResults(Object.fromEntries(ids.map((id) => [id, "correct"])));
    setRevealed(true);
    setMessage("Correct answers shown and locked.");
  };
  const reset = () => {
    completionRef.current = false;
    stop();
    setValues({});
    setResults({});
    setRevealed(false);
    setMessage("Exercise reset.");
  };
  const resultStyle = (id, value) =>
    chosen(id, value) && results[id]
      ? {
          borderColor: results[id] === "correct" ? "#16a34a" : "#ef4444",
          boxShadow:
            "inset 0 0 0 1px " +
            (results[id] === "correct" ? "#16a34a" : "#ef4444"),
        }
      : {};
  const props = (id, value, src, label = String(value)) => ({
    role: "button",
    tabIndex: 0,
    "aria-label":
      "Question " +
      id +
      ": " +
      label +
      (locked(id) ? ". Correct and locked." : ""),
    "aria-pressed": chosen(id, value),
    "aria-disabled": locked(id),
    onKeyDown: activate,
    onKeyUp: release,
    onClick: () => {
      options.beforeInteract?.();
      if (src) audio.playSound("choice-" + id + "-" + value, src);
      else audio.stopAudio();
      choose(id, value);
    },
    style: {
      position: "relative",
      ...(chosen(id, value) && !results[id]
        ? {
            backgroundColor: "#dbeafe",
          }
        : {}),
      ...resultStyle(id, value),
    },
  });
  const nativeProps = (id) => ({
    "aria-label": "Answer " + id + (locked(id) ? ". Correct and locked." : ""),
    disabled: locked(id),
    value: values[id] ?? "",
    onChange: (e) => {
      const value = options.numeric ? Number(e.target.value) : e.target.value;
      choose(id, value);
      const src = soundFor(value === "doesnt" ? "doesn't have" : value);
      if (src) audio.playSound("answer-" + id, src);
    },
    onKeyDown: (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.stopPropagation();
        if (e.repeat) e.preventDefault();
      }
    },
    onKeyUp: (e) => {
      if (e.key === "Enter" || e.key === " ") e.stopPropagation();
    },
    style: {
      borderRadius: 0,
      ...(results[id]
        ? {
            borderBottomColor:
              results[id] === "correct" ? "#16a34a" : "#ef4444",
          }
        : {}),
    },
  });
  return {
    ...audio,
    setResults,
    setMessage,
    completionRef,
    values,
    results,
    revealed,
    message,
    locked,
    chosen,
    choose,
    check,
    show,
    reset,
    resultStyle,
    props,
    nativeProps,
  };
}
// Percentages follow the inspected SVG artwork, so regions scale with each picture.
// The larger detail buttons below are alternatives to the compact picture regions.
const SOUNDS = {
  sleep: clip0,
  feet: clip1,
  ten: clip2,
  bed: clip3,
  net: clip4,
  read: clip5,
  bread: clip6,
  green: clip7,
};
const soundFor = (text) => SOUNDS[normalized(text)];
const IMAGE_DESCRIPTIONS = {
  [img1]: "A bottle with a red spill.",
  [img2]: "A loaf and slices on a plate.",
  [img3]: "Two large digits, one and zero.",
  [img4]: "A bed with a pink pillow.",
  [img5]: "A child resting in bed.",
  [img6]: "A long-handled mesh scoop.",
  [img7]: "A child holding an open book.",
  [img8]: "A bottle with a green spill.",
};
const wordImages = {
  red: img1,
  bread: img2,
  ten: img3,
  bed: img4,
  sleep: img5,
  net: img6,
  read: img7,
  green: img8,
};
const wordBank = [
  "red",
  "bread",
  "ten",
  "bed",
  "sleep",
  "net",
  "read",
  "green",
];
const fixedWords = {
  ee: [],
  e: [],
  ea: [],
};
const correctAnswers = {
  ee: ["green", "sleep"],
  e: ["red", "ten", "bed", "net"],
  ea: ["read", "bread"],
};
const columns = [
  {
    id: "ee",
    label: "ee",
  },
  {
    id: "e",
    label: "e",
  },
  {
    id: "ea",
    label: "ea",
  },
]; // Overlay stays in viewport coordinates outside the Book's transformed container.
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
function useWordSorting(words, columns, correct) {
  const expected = Object.fromEntries(
    words.map((word) => [
      word,
      columns.find((c) => correct[c.id].includes(word)).id,
    ]),
  );
  const a = useAnswers(expected),
    [picked, setPicked] = useState(null),
    [active, setActive] = useState(null),
    [columnResults, setColumnResults] = useState({});
  const bankRefs = useRef({}),
    slotRefs = useRef({}),
    frame = useRef(null),
    drag = useRef(null);
  const placed = Object.fromEntries(
    columns.map((c) => [c.id, words.filter((w) => a.values[w] === c.id)]),
  );
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
  const clear = () => {
    cancelFocus();
    setPicked(null);
    setActive(null);
    drag.current = null;
  };
  const cancel = () => {
    const word = picked;
    clear();
    if (word) focus(() => bankRefs.current[word]);
    a.setMessage("Choice cancelled.");
  };
  const columnLocked = (id) => a.revealed || columnResults[id] === "correct";
  const move = (word, id) => {
    if (
      !words.includes(word) ||
      !columns.some((c) => c.id === id) ||
      a.locked(word) ||
      columnLocked(id)
    )
      return false;
    const old = a.values[word];
    a.choose(word, id);
    setColumnResults((prev) => ({
      ...prev,
      [old]: null,
      [id]: null,
    }));
    setPicked(null);
    a.setMessage(word + " placed under " + id + ".");
    return true;
  };
  const remove = (word) => {
    if (a.locked(word) || !a.values[word]) return;
    const old = a.values[word];
    a.choose(word, undefined);
    setColumnResults((prev) => ({
      ...prev,
      [old]: null,
    }));
    a.setMessage(word + " returned to the word bank.");
  };
  const bankProps = (word) => ({
    role: "button",
    tabIndex: picked ? -1 : 0,
    "aria-label": word + ". Choose this word, then a spelling column.",
    "aria-pressed": picked === word,
    "aria-disabled":
      a.locked(word) || (!!a.values[word] && a.results[word] !== "wrong"),
    onClick: () => a.playSound("bank-" + word, soundFor(word)),
    onKeyDown: (e) => {
      if (e.key === "Escape" && picked) {
        e.preventDefault();
        e.stopPropagation();
        cancel();
        return;
      }
      if (!["Enter", " "].includes(e.key)) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.repeat) return;
      a.playSound("bank-" + word, soundFor(word));
      if (a.locked(word) || (a.values[word] && a.results[word] !== "wrong"))
        return;
      setPicked(word);
      const col = columns.find((c) => !columnLocked(c.id));
      if (col) focus(() => slotRefs.current[col.id]);
      a.setMessage(word + " selected. Choose e, ee, or ea.");
    },
    onKeyUp: release,
    style: {
      position: "relative",
      ...(picked === word
        ? {
            outline: "3px solid #2563eb",
            outlineOffset: 2,
            backgroundColor: "#dbeafe",
          }
        : {}),
    },
  });
  const placedProps = (word, col) => ({
    role: "button",
    tabIndex: picked ? -1 : 0,
    "aria-label":
      word +
      " under " +
      col +
      (a.locked(word) ? ". Correct and locked." : ". Return to the word bank."),
    "aria-disabled": a.locked(word),
    onClick: (e) => {
      a.playSound("answer-" + word, soundFor(word));
      if (a.locked(word)) return;
      remove(word);
      if (e.detail === 0) focus(() => bankRefs.current[word]);
    },
    onKeyDown: (e) => {
      if (["Delete", "Backspace"].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        if (!e.repeat && a.results[word] === "wrong") {
          remove(word);
          focus(() => bankRefs.current[word]);
        }
        return;
      }
      activate(e);
    },
    onKeyUp: release,
    style: {
      position: "relative",
      ...(a.results[word]
        ? {
            borderColor: a.results[word] === "correct" ? "#16a34a" : "#ef4444",
            borderBottomWidth: 3,
          }
        : {}),
    },
  });
  const columnProps = (id, over) => ({
    role: "button",
    tabIndex: picked && columnLocked(id) ? -1 : 0,
    "aria-label":
      id +
      " column. " +
      placed[id].join(", ") +
      (columnLocked(id) ? ". Correct and locked." : ""),
    "aria-disabled": columnLocked(id),
    onKeyDown: (e) => {
      if (e.target !== e.currentTarget) return;
      if (e.key === "Escape" && picked) {
        e.preventDefault();
        e.stopPropagation();
        cancel();
        return;
      }
      if (!["Enter", " "].includes(e.key)) return;
      e.preventDefault();
      e.stopPropagation();
      if (!e.repeat && picked) {
        const word = picked;
        if (move(word, id)) {
          const next = words.find(
            (w) => w !== word && !a.values[w] && !a.locked(w),
          );
          focus(() => bankRefs.current[next || word]);
        }
      }
    },
    onKeyUp: (e) => {
      if (e.target === e.currentTarget) release(e);
    },
    style: {
      ...(columnResults[id]
        ? {
            borderColor:
              columnResults[id] === "correct" ? "#16a34a" : "#ef4444",
          }
        : {}),
      ...(over && active && !columnLocked(id)
        ? {
            outline: "3px dashed #2563eb",
            outlineOffset: 2,
            backgroundColor: "#dbeafe",
          }
        : {}),
    },
  });
  const dragStart = (e) => {
    clear();
    const word = e.active.data.current?.word;
    if (!words.includes(word) || a.locked(word)) return;
    drag.current = {
      id: e.active.id,
      word,
    };
    const r = e.active.rect?.current?.initial,
      node = bankRefs.current[word],
      computed = node && window.getComputedStyle?.(node),
      scale = node?.offsetWidth && r ? r.width / node.offsetWidth : 1;
    setActive({
      id: e.active.id,
      value: word,
      width: r?.width,
      height: r?.height,
      fontSize: computed ? parseFloat(computed.fontSize) * scale : undefined,
    });
  };
  const dragEnd = (e) => {
    const source = drag.current;
    drag.current = null;
    setActive(null);
    setPicked(null);
    if (source?.id === e.active.id && e.over)
      move(source.word, String(e.over.id).replace(/^drop-/, ""));
  };
  const check = () => {
    if (a.completionRef.current) return;
    clear();
    a.stopAudio();
    if (words.some((w) => !a.values[w])) {
      a.setMessage("Please place all words before checking your answers.");
      ValidationAlert.info(
        "Please place all words before checking your answers.",
      );
      return;
    }
    const next = Object.fromEntries(
      words.map((w) => [w, a.values[w] === expected[w] ? "correct" : "wrong"]),
    );
    a.setResults(next);
    const cols = Object.fromEntries(
      columns.map((c) => [
        c.id,
        placed[c.id].length === correct[c.id].length &&
        correct[c.id].every((w) => placed[c.id].includes(w))
          ? "correct"
          : "wrong",
      ]),
    );
    setColumnResults(cols);
    const score = Object.values(cols).filter((v) => v === "correct").length;
    a.completionRef.current = score === columns.length;
    a.setMessage(
      "Score " +
        score +
        " out of " +
        columns.length +
        ". Correct words are locked; incorrect words can be moved.",
    );
    showCheckFeedback(
      a.rootRef.current,
      score === columns.length ? "success" : score ? "warning" : "error",
      "Score: " + score + " / " + columns.length,
    );
  };
  const show = () => {
    clear();
    a.show();
    setColumnResults(Object.fromEntries(columns.map((c) => [c.id, "correct"])));
  };
  const reset = () => {
    clear();
    setColumnResults({});
    a.reset();
  };
  return {
    ...a,
    placed,
    picked,
    active,
    bankRefs,
    slotRefs,
    columnLocked,
    columnResults,
    bankProps,
    placedProps,
    columnProps,
    dragStart,
    dragEnd,
    stopDrag: clear,
    check,
    show,
    reset,
  };
}
function DraggableWord({ id, word, className, interaction, column }) {
  const disabled =
    interaction.locked(word) ||
    (!column &&
      !!interaction.values[word] &&
      interaction.results[word] !== "wrong");
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
    disabled,
    data: {
      word,
    },
  });
  const props = column
    ? interaction.placedProps(word, column)
    : interaction.bankProps(word);
  return (
    <button
      type="button"
      ref={(el) => {
        setNodeRef(el);
        if (!column) interaction.bankRefs.current[word] = el;
      }}
      {...attributes}
      {...listeners}
      {...props}
      style={{
        ...props.style,
        touchAction: "none",
      }}
      className={className + " " + focusClass}
    >
      {word}
      {interaction.playingKey === (column ? "answer-" : "bank-") + word && (
        <SpeakerBadge />
      )}
    </button>
  );
}
function DroppableColumn({ id, className, children, interaction }) {
  const { setNodeRef, isOver } = useDroppable({
    id: "drop-" + id,
    disabled: interaction.columnLocked(id),
  });
  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        interaction.slotRefs.current[id] = el;
      }}
      {...interaction.columnProps(id, isOver)}
      className={className + " " + focusClass}
    >
      {children}
    </div>
  );
}
function WB_Unit10_Page62_Q1() {
  const a = useWordSorting(wordBank, columns, correctAnswers);
  const { rootRef, message, placed } = a;
  const usedWords = Object.keys(a.values).filter(
    (w) => a.values[w] && a.results[w] !== "wrong",
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
    handleStartAgain = a.reset;
  const getPlacedWordClass = (col, word) =>
    "px-3 py-1 rounded-lg text-lg w-20 font-semibold border-2 transition-all text-blue " +
    (a.results[word] === "correct"
      ? "border-green-600 cursor-default"
      : a.results[word] === "wrong"
        ? "border-red-400 cursor-grab"
        : "border-blue-900 cursor-grab active:cursor-grabbing hover:bg-blue-100");
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
            marginBottom: "30px",
            gap: "15px",
          }}
        >
          <ExerciseHeader
            isWorkbook
            sectionLetter="A"
            title={
              "What are the middle letters of these words? Look and write the words in the correct place."
            }
            subTitle={
              "Say each word, listen to the middle sound, then place it under ee, e, or ea."
            }
          />

          <div className="grid grid-cols-4 gap-2 border-blue-100 rounded-xl mb-6">
            {wordBank.map((word) => {
              const isUsed = usedWords.includes(word);
              return (
                <div key={word} className="flex flex-col items-center gap-1">
                  <img
                    src={wordImages[word]}
                    className="object-contain pointer-events-none"
                    style={{
                      height: "90px",
                      width: "90px",
                    }}
                    alt={
                      IMAGE_DESCRIPTIONS[wordImages[word]] ||
                      "Illustration for this question"
                    }
                  />

                  <DraggableWord
                    id={`bank-${word}`}
                    word={word}
                    className={`WB-word-bank  ${isUsed ? "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed" : "bg-white text-gray-600 border-blue-900 cursor-grab active:cursor-grabbing hover:bg-blue-50"}`}
                    interaction={a}
                  />
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {columns.map((col) => {
              const isWrong = a.columnResults[col.id] === "wrong";
              return (
                <DroppableColumn
                  key={col.id}
                  id={col.id}
                  className="relative border-2 border-gray-400 rounded-2xl p-4 min-h-[160px]"
                  interaction={a}
                >
                  {isWrong && (
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow">
                      ✕
                    </div>
                  )}

                  <div className="flex justify-center mb-3">
                    <span className="px-4 py-1 w-15 text-center rounded-lg border-2 border-gray-400 text-gray-800 font-bold text-lg bg-white">
                      {col.label}
                    </span>
                  </div>

                  {fixedWords[col.id].map((w) => (
                    <p
                      key={w}
                      className="text-center text-green-500 font-semibold underline text-lg mb-1"
                    >
                      {w}
                    </p>
                  ))}

                  <div className="flex flex-col items-center gap-2 mb-3">
                    {placed[col.id].map((word) => (
                      <DraggableWord
                        id={`placed-${col.id}-${word}`}
                        key={word}
                        word={word}
                        className={getPlacedWordClass(col.id, word)}
                        interaction={a}
                        column={col.id}
                      />
                    ))}
                  </div>
                </DroppableColumn>
              );
            })}
          </div>

          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleStartAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
      <DragPreview
        interaction={a}
        className="px-3 py-1 rounded-lg text-lg w-20 font-semibold border-2 text-blue border-blue-500 bg-white shadow-lg touch-none"
      />
    </DndContext>
  );
}
export default WB_Unit10_Page62_Q1;

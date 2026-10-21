/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 61/SVG/Asset 2.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 61/SVG/Asset 3.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 61/SVG/Asset 5.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 61/SVG/Asset 6.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 61/SVG/Asset 7.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 61/SVG/Asset 8.svg";
import Button from "../Button";

/* 🔹 Draggable */
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
import { createPortal } from "react-dom"; // Every placement is validated against registered slots/tokens, including cancelled drags.
import clip0 from "../../../assets/audio/WorkBook/Unit 10/Page 61 - I/Item_001_a_book.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 10/Page 61 - I/Item_002_a_hat.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 10/Page 61 - I/Item_003_a_computer.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 10/Page 61 - I/Item_004_a_bag.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 10/Page 61 - I/Item_005_What's_he_reading.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 10/Page 61 - I/Item_006_What's_he_wearing.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 10/Page 61 - I/Item_007_What's_he_watching.mp3";
import clip7 from "../../../assets/audio/WorkBook/Unit 10/Page 61 - I/Item_008_He's_reading.mp3";
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
  "a book": clip0,
  "a hat": clip1,
  "a computer": clip2,
  "a bag": clip3,
  "what's he reading": clip4,
  "what's he wearing": clip5,
  "what's he watching": clip6,
  "he's reading": clip7,
};
const soundFor = (text) => SOUNDS[normalized(text)];
const IMAGE_DESCRIPTIONS = {
  [img1]: "An outline of a boy holding his hands near dotted guides.",
  [img2]: "An outline of a smiling face with dotted guides above its head.",
  [img3]: "An outline of a boy at a desk facing a blank monitor.",
  [img4]: "An outline of a boy with his hands beside dotted guides.",
  [img5]: "Children asking and answering a question about reading.",
  [img6]: "A smiling boy with swept dark hair.",
};
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
function useDrawingBoard(pictures, announce) {
  const boards = useRef({}),
    session = useRef(null),
    mounted = useRef(false);
  const picturesRef = useRef(pictures),
    announceRef = useRef(announce);
  announceRef.current = announce;
  const [tools, setTools] = useState({}),
    [revision, setRevision] = useState(0);
  const refresh = () => setRevision((v) => v + 1);
  const draw = (id) => {
    const b = boards.current[id];
    if (!b?.canvas) return;
    const ctx = b.canvas.getContext("2d"),
      ink = b.ink.getContext("2d");
    ctx.clearRect(0, 0, 200, 180);
    if (b.loaded) ctx.drawImage(b.image, 0, 0, 200, 180);
    ink.clearRect(0, 0, 200, 180);
    const ops = [
      ...b.ops,
      ...(session.current?.id === id ? [session.current.stroke] : []),
    ];
    for (const op of ops) {
      if (!op.points.length) continue;
      ink.save();
      ink.globalCompositeOperation =
        op.tool === "Eraser" ? "destination-out" : "source-over";
      ink.strokeStyle = "#FF6B6B";
      ink.fillStyle = "#FF6B6B";
      ink.lineWidth = op.tool === "Eraser" ? 14 : 2;
      ink.lineCap = "round";
      ink.lineJoin = "round";
      ink.beginPath();
      ink.moveTo(...op.points[0]);
      for (const point of op.points.slice(1)) ink.lineTo(...point);
      if (op.points.length === 1) {
        ink.arc(...op.points[0], ink.lineWidth / 2, 0, 2 * Math.PI);
        ink.fill();
      } else ink.stroke();
      ink.restore();
    }
    ctx.drawImage(b.ink, 0, 0);
    if (b.keyboard) {
      const [x, y] = b.cursor;
      ctx.save();
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 2]);
      ctx.beginPath();
      ctx.moveTo(x - 6, y);
      ctx.lineTo(x + 6, y);
      ctx.moveTo(x, y - 6);
      ctx.lineTo(x, y + 6);
      ctx.stroke();
      ctx.restore();
    }
  };
  const finish = (commit = true) => {
    const s = session.current;
    if (!s) return;
    session.current = null;
    const b = boards.current[s.id];
    if (commit && s.stroke.points.length) {
      b.history.push(b.ops);
      b.ops = [...b.ops, s.stroke];
      refresh();
    }
    if (s.pointer !== undefined && b.canvas.hasPointerCapture?.(s.pointer))
      b.canvas.releasePointerCapture(s.pointer);
    draw(s.id);
  };
  useEffect(() => {
    mounted.current = true;
    const registered = boards.current;
    for (const p of picturesRef.current) {
      const b = boards.current[p.id];
      if (!b) continue;
      const image = new Image();
      b.image = image;
      image.onload = () => {
        if (mounted.current && boards.current[p.id] === b) {
          b.loaded = true;
          draw(p.id);
        }
      };
      image.onerror = () => {
        if (mounted.current)
          announceRef.current(
            "Drawing background could not load for picture " + p.id + ".",
          );
      };
      image.src = p.src;
    }
    return () => {
      mounted.current = false;
      session.current = null;
      for (const b of Object.values(registered)) {
        b.image.onload = null;
        b.image.onerror = null;
      }
    };
  }, []);
  const register = (id, node) => {
    if (!node) {
      if (boards.current[id]) boards.current[id].canvas = null;
      return;
    }
    let b = boards.current[id];
    if (!b) {
      b = {
        ops: [],
        history: [],
        cursor: [100, 90],
        keyboard: false,
        ink: document.createElement("canvas"),
      };
      b.ink.width = 200;
      b.ink.height = 180;
      boards.current[id] = b;
    }
    b.canvas = node;
    draw(id);
  };
  const start = (id, pointer) => {
    if (session.current) return;
    const b = boards.current[id];
    session.current = {
      id,
      pointer,
      stroke: {
        tool: tools[id] || "Pen",
        points: [[...b.cursor]],
      },
    };
    draw(id);
  };
  const coords = (id, e) => {
    const r = boards.current[id].canvas.getBoundingClientRect();
    return [
      Math.max(0, Math.min(200, ((e.clientX - r.left) * 200) / r.width)),
      Math.max(0, Math.min(180, ((e.clientY - r.top) * 180) / r.height)),
    ];
  };
  const props = (id) => ({
    tabIndex: 0,
    role: "group",
    "aria-label":
      "Drawing " +
      id +
      ". " +
      picturesRef.current.find((p) => p.id === id).question +
      " " +
      IMAGE_DESCRIPTIONS[picturesRef.current.find((p) => p.id === id).src] +
      " Use arrows to move the pen. Enter or Space starts and finishes a stroke; Escape cancels. Drawing is not graded.",
    style: {
      touchAction: "none",
    },
    onPointerDown: (e) => {
      if (session.current || e.button !== 0) return;
      e.preventDefault();
      const b = boards.current[id];
      b.keyboard = false;
      b.cursor = coords(id, e);
      e.currentTarget.focus({
        preventScroll: true,
      });
      e.currentTarget.setPointerCapture(e.pointerId);
      start(id, e.pointerId);
    },
    onPointerMove: (e) => {
      const s = session.current;
      if (!s || s.id !== id || s.pointer !== e.pointerId) return;
      e.preventDefault();
      const b = boards.current[id];
      b.cursor = coords(id, e);
      s.stroke.points.push([...b.cursor]);
      draw(id);
    },
    onPointerUp: (e) => {
      if (
        session.current?.id === id &&
        session.current.pointer === e.pointerId
      ) {
        e.preventDefault();
        finish();
      }
    },
    onPointerCancel: (e) => {
      if (session.current?.id === id && session.current.pointer === e.pointerId)
        finish(false);
    },
    onLostPointerCapture: (e) => {
      if (session.current?.id === id && session.current.pointer === e.pointerId)
        finish(false);
    },
    onFocus: (e) => {
      if (e.currentTarget.matches(":focus-visible")) {
        boards.current[id].keyboard = true;
        draw(id);
      }
    },
    onBlur: () => {
      if (session.current?.id === id && session.current.pointer === undefined)
        finish();
      boards.current[id].keyboard = false;
      draw(id);
    },
    onKeyDown: (e) => {
      const arrows = {
        ArrowLeft: [-4, 0],
        ArrowRight: [4, 0],
        ArrowUp: [0, -4],
        ArrowDown: [0, 4],
      };
      if (!arrows[e.key] && !["Enter", " ", "Escape"].includes(e.key)) return;
      e.preventDefault();
      e.stopPropagation();
      if (session.current?.pointer !== undefined) return;
      const b = boards.current[id];
      b.keyboard = true;
      if (arrows[e.key]) {
        const d = arrows[e.key];
        b.cursor = [
          Math.max(0, Math.min(200, b.cursor[0] + d[0])),
          Math.max(0, Math.min(180, b.cursor[1] + d[1])),
        ];
        if (session.current?.id === id)
          session.current.stroke.points.push([...b.cursor]);
        draw(id);
      } else if (!e.repeat) {
        if (e.key === "Escape") {
          finish(false);
          announce("Drawing stroke cancelled.");
        } else if (session.current) {
          finish();
          announce("Drawing stroke completed.");
        } else {
          start(id);
          announce(
            "Drawing started. Use arrows, then Enter or Space to finish.",
          );
        }
      }
    },
    onKeyUp: release,
  });
  const command = (id, name) => {
    finish();
    const b = boards.current[id];
    if (name === "Pen" || name === "Eraser")
      setTools((prev) => ({
        ...prev,
        [id]: name,
      }));
    else if (name === "Undo") {
      if (b.history.length) b.ops = b.history.pop();
    } else if (name === "Clear" && b.ops.length) {
      b.history.push(b.ops);
      b.ops = [];
    }
    draw(id);
    refresh();
    announce(name + " selected for drawing " + id + ".");
  };
  const reset = () => {
    finish(false);
    for (const [id, b] of Object.entries(boards.current)) {
      b.ops = [];
      b.history = [];
      b.keyboard = false;
      draw(Number(id));
    }
    refresh();
  };
  return {
    register,
    props,
    command,
    reset,
    tool: (id) => tools[id] || "Pen",
    canUndo: (id) => revision >= 0 && !!boards.current[id]?.history.length,
  };
}
function DraggableWord({ word, interaction }) {
  const disabled = interaction.used(word) || interaction.itemLocked(word);
  const { setNodeRef, attributes, listeners } = useDraggable({
    id: word,
    disabled,
  });
  const props = interaction.bankProps(word);
  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        interaction.bankRefs.current[word] = el;
      }}
      {...attributes}
      {...listeners}
      {...props}
      style={{
        ...props.style,
        padding: "9px 22px",
        touchAction: "none",
        opacity: disabled ? 0.6 : 1,
      }}
      className={
        "WB-word-bank touch-none " +
        focusClass +
        (disabled
          ? " bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
          : " cursor-pointer hover:scale-105")
      }
    >
      {word}
      {interaction.playingKey === "bank-" + word && <SpeakerBadge />}
    </div>
  );
}
function DropInput({ id, value, interaction }) {
  const target = "drop-" + id;
  const { setNodeRef, isOver } = useDroppable({
    id: target,
    disabled: interaction.targetLocked(target),
  });
  const props = interaction.slotProps(target, !!interaction.active && isOver);
  return (
    <div
      ref={setNodeRef}
      className="flex-1 relative transition-all duration-200"
    >
      <input
        type="text"
        value={value}
        readOnly
        placeholder="Drop here..."
        {...props}
        ref={(el) => {
          interaction.slotRefs.current[target] = el;
        }}
        style={{
          ...props.style,
          borderRadius: 8,
          ...(interaction.results[target]
            ? {
                borderColor:
                  interaction.results[target] === "correct"
                    ? "#16a34a"
                    : "#ef4444",
              }
            : {}),
        }}
        className={
          "w-full px-4 py-2 border-2 rounded-lg font-semibold transition-all border-gray-300 bg-white " +
          focusClass
        }
      />
      {interaction.results[target] === "wrong" && (
        <div
          aria-hidden="true"
          className="absolute -top-2 right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold border-2 border-white shadow"
        >
          ?
        </div>
      )}
      {interaction.playingKey === "answer-" + target && <SpeakerBadge />}
    </div>
  );
}
function WB_Unit10_Page61_Q2() {
  const images = [
    {
      id: 1,
      src: img1,
      question: "What's he reading?",
      correctAnswer: "a book",
      hint: "reading",
    },
    {
      id: 2,
      src: img2,
      question: "What's he wearing?",
      correctAnswer: "a hat",
      hint: "wearing",
    },
    {
      id: 3,
      src: img3,
      question: "What's he watching?",
      correctAnswer: "a computer",
      hint: "watching",
    },
    {
      id: 4,
      src: img4,
      question: "What's he carrying?",
      correctAnswer: "a bag",
      hint: "carrying",
    },
  ];
  const a = useDropExercise(
    images.map((i) => ({
      id: i.correctAnswer,
      value: i.correctAnswer,
    })),
    Object.fromEntries(images.map((i) => ["drop-" + i.id, i.correctAnswer])),
    "Please complete all answers before checking your answers.",
  );
  const { rootRef, message, playingKey, playSound } = a;
  const drawing = useDrawingBoard(images, a.setMessage);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
  );
  const handleCheckAnswers = a.check,
    handleShowAnswer = a.show,
    handleReset = () => {
      drawing.reset();
      a.reset();
    };
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
          className="div-forall flex flex-row"
          style={{
            marginBottom: "10px",
            gap: "20px",
          }}
        >
          {/* Header */}

          <ExerciseHeader
            isWorkbook
            sectionLetter="I"
            title={<>Draw, and then ask and answer.</>}
            subTitle={
              "Finish the drawing first, then ask the question aloud and match or write the correct object answer."
            }
          />

          <div className="flex flex-col gap-5">
            {/* Word Bank */}
            <div>
              <div className="bg-white rounded-2xl p-2 inline-block w-full">
                <div className="flex gap-4 flex-wrap flex justify-center items-center">
                  {images.map((word) => (
                    <DraggableWord
                      key={word.correctAnswer}
                      word={word.correctAnswer}
                      interaction={a}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Drawing + Questions */}
            <div className="grid grid-cols-3 gap-8 mb-8">
              {images.map((image) => (
                <div key={image.id} className="w-full">
                  {/* Canvas */}
                  <div className="mb-4 flex justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <canvas
                        width={200}
                        className={
                          "border-2 border-gray-300 rounded-lg cursor-crosshair" +
                          " " +
                          focusClass
                        }
                        height={180}
                        ref={(el) => drawing.register(image.id, el)}
                        {...drawing.props(image.id)}
                        tabIndex={a.picked ? -1 : 0}
                      />
                      <div
                        role="group"
                        aria-label={"Drawing tools for picture " + image.id}
                        className="flex flex-wrap justify-center gap-1"
                      >
                        {["Pen", "Eraser", "Undo", "Clear"].map((tool) => (
                          <button
                            key={tool}
                            type="button"
                            aria-pressed={
                              tool === "Pen" || tool === "Eraser"
                                ? drawing.tool(image.id) === tool
                                : undefined
                            }
                            disabled={
                              tool === "Undo" && !drawing.canUndo(image.id)
                            }
                            onClick={() => drawing.command(image.id, tool)}
                            onKeyDown={activate}
                            onKeyUp={release}
                            className={
                              "px-2 py-1 border rounded-lg text-sm " +
                              focusClass
                            }
                            style={{
                              backgroundColor:
                                drawing.tool(image.id) === tool
                                  ? "#dbeafe"
                                  : undefined,
                            }}
                            tabIndex={a.picked ? -1 : 0}
                          >
                            {tool}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Input */}
                  <div>
                    <p className="text-base font-bold text-gray-800 mb-3">
                      <AudioText
                        audioKey={"question-" + image.id}
                        src={soundFor(image.question)}
                        playSound={playSound}
                        playingKey={playingKey}
                        tabIndex={a.picked ? -1 : 0}
                      >
                        {image.question}
                      </AudioText>
                    </p>

                    <div className="flex gap-2">
                      <DropInput
                        id={image.id}
                        value={a.value("drop-" + image.id)}
                        interaction={a}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* ⭐ الصورة الخامسة */}
              <div className="col-span-2 flex justify-center">
                <img
                  src={img5}
                  className="object-contain"
                  style={{
                    height: "200px",
                  }}
                  alt={
                    IMAGE_DESCRIPTIONS[img5] || "Illustration for this question"
                  }
                />
              </div>
            </div>
          </div>
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleReset}
            checkAnswers={handleCheckAnswers}
          />
        </div>
      </div>

      <DragPreview
        interaction={a}
        className="px-6 py-2 bg-white border-2 border-blue-500 rounded-xl shadow-2xl text-blue-700 font-bold"
      />
    </DndContext>
  );
}
export default WB_Unit10_Page61_Q2;

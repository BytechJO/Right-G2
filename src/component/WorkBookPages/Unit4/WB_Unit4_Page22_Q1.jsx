/* eslint-disable react-refresh/only-export-components -- Exercise-local controls preserve the shared components. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import sound0 from "../../../assets/audio/WorkBook/Unit 4/Page 22 - C/Item_001_pilot.mp3";
import sound1 from "../../../assets/audio/WorkBook/Unit 4/Page 22 - C/Item_002_he.mp3";
import sound2 from "../../../assets/audio/WorkBook/Unit 4/Page 22 - C/Item_003_a.mp3";
import sound3 from "../../../assets/audio/WorkBook/Unit 4/Page 22 - C/Item_004_is.mp3";
import sound4 from "../../../assets/audio/WorkBook/Unit 4/Page 22 - C/Item_005_clerk.mp3";
import sound5 from "../../../assets/audio/WorkBook/Unit 4/Page 22 - C/Item_006_I.mp3";
import sound6 from "../../../assets/audio/WorkBook/Unit 4/Page 22 - C/Item_007_am.mp3";
import sound7 from "../../../assets/audio/WorkBook/Unit 4/Page 22 - C/Item_008_photographer.mp3";
import sound8 from "../../../assets/audio/WorkBook/Unit 4/Page 22 - C/Item_009_are.mp3";
import sound9 from "../../../assets/audio/WorkBook/Unit 4/Page 22 - C/Item_010_vet.mp3";
import sound10 from "../../../assets/audio/WorkBook/Unit 4/Page 22 - C/Item_011_you.mp3";
import { createPortal } from "react-dom";
import React, { useState, useRef, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  useMouseSensor,
  useTouchSensor,
} from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page22/Ex C 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page22/Ex C 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page22/Ex C 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page22/Ex C 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page22/Ex C 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page22/Ex C 6.svg";
import img7 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page22/Ex C 7.svg";
import img8 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page22/Ex C 8.svg";
const IMAGE_DESCRIPTIONS = {
  [img1]: "A person holding a camera up to one eye.",
  [img2]: "A man in a blue uniform and cap.",
  [img3]: "A man examining a cat.",
  [img4]: "A woman at a cash register.",
  [img5]: "An airplane.",
  [img6]: "A cash register with papers.",
  [img7]: "A camera.",
  [img8]: "A stethoscope.",
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
  pilot: sound0,
  he: sound1,
  a: sound2,
  is: sound3,
  clerk: sound4,
  i: sound5,
  am: sound6,
  photographer: sound7,
  are: sound8,
  vet: sound9,
  you: sound10,
};
const soundFor = (text) =>
  SOUNDS[
    String(text)
      .toLowerCase()
      .replace(/[.,!?]/g, "")
      .trim()
  ];
function useTokenOrder(questions, sounds, crossRow = false) {
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
  const used = (tokenId) =>
    Object.entries(inputs).some(
      ([id, items]) =>
        results[id] !== "wrong" && items.some((t) => t.id === tokenId),
    );
  const place = (id, tokenId, index) => {
    const q = questions.find((q) => String(q.id) === String(id)),
      item =
        q &&
        (crossRow
          ? questions.filter((other) => other.kind === q.kind).flatMap(tokens)
          : tokens(q)
        ).find((t) => t.id === tokenId);
    if (
      Object.entries(inputs).some(
        ([zone, items]) => locked(zone) && items.some((t) => t.id === tokenId),
      )
    )
      return;
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
      ...Object.fromEntries(
        Object.entries(prev).map(([zone, items]) => [
          zone,
          zone === String(id) ? items : items.filter((t) => t.id !== tokenId),
        ]),
      ),
      [id]: next,
    }));
    setResults((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([zone, result]) => [
          zone,
          zone === String(id) || inputs[zone]?.some((t) => t.id === tokenId)
            ? null
            : result,
        ]),
      ),
    );
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
    "aria-disabled": locked(q.id) || used(item.id),
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
      if (e.repeat) return;
      audio.playSound("bank-" + item.id, sounds[item.value.toLowerCase()]);
      if (locked(q.id) || used(item.id)) return;
      setPicked({
        qid: q.id,
        token: item.id,
      });
      setMessage(
        item.value + " chosen. Press Enter or Space in the answer field.",
      );
      const target = questions.find(
        (other) =>
          (crossRow ? other.kind === q.kind : other.id === q.id) &&
          !locked(other.id) &&
          inputs[other.id].length < tokens(other).length,
      );
      if (target) focus(() => slotRefs.current[target.id]);
    },
    onKeyUp: release,
  });
  const slotProps = (q, snapshot, pendingMatch = false) => ({
    role: "button",
    tabIndex:
      pendingMatch ||
      (picked &&
        !(crossRow
          ? questions.find((other) => other.id === picked.qid)?.kind === q.kind
          : picked.qid === q.id))
        ? -1
        : 0,
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
        if (
          crossRow
            ? questions.find((other) => other.id === picked.qid)?.kind !==
              q.kind
            : picked.qid !== q.id
        )
          return;
        const next = place(q.id, picked.token);
        if (next) {
          const token = questions
            .flatMap(tokens)
            .find((t) => t.id !== picked.token && !used(t.id));
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
            borderRadius: 4,
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
        inputs[q.id]
          .map((t) => t.value)
          .join(q.separator)
          .toLowerCase() === q.correctSentence.toLowerCase()
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
            const index = remaining.findIndex(
              (t) => t.value.toLowerCase() === value.toLowerCase(),
            );
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
    used,
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
function useMatching(correct, imageOrder, textSide = "left") {
  const [matches, setMatches] = useState({}),
    [results, setResults] = useState({}),
    [source, setSource] = useState(null),
    [preview, setPreview] = useState(null),
    [revealed, setRevealed] = useState(false),
    [message, setMessage] = useState("");
  const containerRef = useRef(null),
    leftDots = useRef({}),
    rightDots = useRef({}),
    leftRefs = useRef({}),
    rightRefs = useRef({}),
    frame = useRef(null);
  const [, setGeometry] = useState(0),
    refresh = () => setGeometry((v) => v + 1),
    ids = Object.keys(correct),
    rightIds = imageOrder.map(String);
  const locked = (side, id) =>
    revealed ||
    (side === "left"
      ? results[id] === "correct"
      : Object.entries(matches).some(
          ([left, right]) =>
            String(right) === String(id) && results[left] === "correct",
        ));
  const cancelFocus = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  };
  const focus = (side, id) => {
    cancelFocus();
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      (side === "left" ? leftRefs : rightRefs).current[id]?.focus();
    });
  };
  useEffect(() => {
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(refresh);
    if (containerRef.current) observer?.observe(containerRef.current);
    window.addEventListener("resize", refresh);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", refresh);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);
  useEffect(() => {
    const id = requestAnimationFrame(refresh);
    return () => cancelAnimationFrame(id);
  }, [matches, source, preview]);
  const cancel = () => {
    cancelFocus();
    setSource(null);
    setPreview(null);
    setMessage("Connection cancelled.");
  };
  const choose = (side, id, keyboard = false) => {
    id = String(id);
    if (locked(side, id)) return;
    if (!source || source.side === side) {
      if (source?.side === side && source.id === id) {
        cancel();
        return;
      }
      setSource({
        side,
        id,
      });
      setPreview(null);
      setMessage("Selected. Choose an endpoint on the opposite side.");
      if (keyboard) {
        const other = side === "left" ? "right" : "left",
          next = (other === "left" ? ids : rightIds).find(
            (id) => !locked(other, id),
          );
        if (next !== undefined) focus(other, next);
      }
      return;
    }
    const left = side === "left" ? id : source.id,
      right = side === "right" ? id : source.id;
    if (locked("left", left) || locked("right", right)) return;
    const next = {
        ...matches,
      },
      affected = [left];
    for (const [previous, value] of Object.entries(next))
      if (String(value) === right && previous !== left) {
        if (locked("left", previous)) return;
        delete next[previous];
        affected.push(previous);
      }
    next[left] = right;
    setMatches(next);
    setResults((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(([id]) => !affected.includes(id)),
      ),
    );
    setSource(null);
    setPreview(null);
    setMessage("Pair connected.");
    if (keyboard) {
      const nextId = (textSide === "left" ? ids : rightIds).find(
        (id) => !locked(textSide, id),
      );
      if (nextId) focus(textSide, nextId);
    }
  };
  const endpointProps = (side, id, label) => ({
    role: "button",
    tabIndex: source && (source.side === side || locked(side, id)) ? -1 : 0,
    "aria-label":
      label +
      (locked(side, id) ? ". Correct and locked." : ". Matching endpoint."),
    "aria-disabled": locked(side, id),
    "aria-pressed": source?.side === side && source.id === String(id),
    onKeyDown: (e) => {
      if (e.key === "Escape" && source) {
        e.preventDefault();
        e.stopPropagation();
        cancel();
        return;
      }
      if (["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        const list = side === "left" ? ids : rightIds,
          step = e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 1;
        for (let n = 1; n <= list.length; n++) {
          const next =
            list[
              (list.indexOf(String(id)) + step * n + list.length) % list.length
            ];
          if (!locked(side, next)) {
            focus(side, next);
            break;
          }
        }
        return;
      }
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      e.stopPropagation();
      if (!e.repeat) choose(side, id, true);
    },
    onKeyUp: release,
    onFocus: () => {
      if (source && source.side !== side && !locked(side, id))
        setPreview({
          side,
          id: String(id),
        });
    },
    onMouseEnter: () => {
      if (source && source.side !== side && !locked(side, id))
        setPreview({
          side,
          id: String(id),
        });
    },
    onMouseLeave: () => setPreview(null),
    style: {
      position: "relative",
      borderRadius: "8px",
      ...(source?.side === side && source.id === String(id)
        ? {
            outline: "3px solid #2563eb",
            backgroundColor: "#dbeafe",
            outlineOffset: 2,
          }
        : {}),
      ...(locked(side, id)
        ? {
            boxShadow: "inset 0 0 0 2px #16a34a",
          }
        : {}),
    },
  });
  const point = (side, id) => {
    const el = (side === "left" ? leftDots : rightDots).current[id],
      root = containerRef.current;
    if (!el || !root) return null;
    const r = el.getBoundingClientRect(),
      c = root.getBoundingClientRect();
    return {
      x:
        ((side === "left" ? r.right : r.left) - c.left) /
        (root.clientWidth ? c.width / root.clientWidth : 1),
      y:
        (r.top + r.height / 2 - c.top) /
        (root.clientHeight ? c.height / root.clientHeight : 1),
    };
  };
  const line = (left, right) => {
    const a = point("left", left),
      b = point("right", right);
    return a && b
      ? {
          left,
          x1: a.x,
          y1: a.y,
          x2: b.x,
          y2: b.y,
        }
      : null;
  };
  const lines = Object.entries(matches)
    .map(([left, right]) => line(left, right))
    .filter(Boolean);
  const previewLine =
    source && preview && source.side !== preview.side
      ? line(
          source.side === "left" ? source.id : preview.id,
          source.side === "right" ? source.id : preview.id,
        )
      : null;
  const evaluate = () => {
    cancel();
    const next = Object.fromEntries(
      ids.map((id) => [
        id,
        results[id] === "correct" || String(matches[id]) === String(correct[id])
          ? "correct"
          : "wrong",
      ]),
    );
    setResults(next);
    return next;
  };
  const show = () => {
    cancel();
    setMatches(
      Object.fromEntries(
        Object.entries(correct).map(([left, right]) => [left, String(right)]),
      ),
    );
    setResults(Object.fromEntries(ids.map((id) => [id, "correct"])));
    setRevealed(true);
    setMessage("Correct connections shown and locked.");
  };
  const reset = () => {
    cancel();
    setMatches({});
    setResults({});
    setRevealed(false);
    setMessage("Exercise reset.");
  };
  return {
    matches,
    results,
    source,
    preview,
    revealed,
    message,
    setMessage,
    containerRef,
    leftDots,
    rightDots,
    leftRefs,
    rightRefs,
    choose,
    endpointProps,
    lines,
    previewLine,
    evaluate,
    show,
    reset,
    cancel,
    cancelFocus,
    locked,
    refresh,
  };
}
const WB_Unit4_Page22_Q1 = () => {
  const data = {
    questions: [
      {
        id: 1,
        correct: "He is a pilot",
        text: "pilot he a is",
        img: img5,
      },
      {
        id: 2,
        correct: "I am a clerk",
        text: "a clerk I am",
        img: img6,
      },
      {
        id: 3,
        correct: "He is a photographer",
        text: "photographer a is he",
        img: img7,
      },
      {
        id: 4,
        correct: "You are a vet",
        text: "are vet you a",
        img: img8,
      },
    ],
    answers: [
      {
        id: 1,
        img: img1,
      },
      {
        id: 2,
        img: img2,
      },
      {
        id: 3,
        img: img3,
      },
      {
        id: 4,
        img: img4,
      },
    ],
  };
  const correctMatches = {
    1: 3,
    2: 1,
    3: 4,
    4: 2,
  };
  const questions = data.questions.map((q) => ({
    id: q.id,
    scrambled: q.text.split(" ").map((value, i) => ({
      id: q.id + "-" + i,
      value,
    })),
    correctSentence: q.correct,
    separator: " ",
  }));
  const order = useTokenOrder(questions, SOUNDS),
    match = useMatching(
      correctMatches,
      data.questions.map((q) => q.id),
      "right",
    );
  const { rootRef, playingKey } = order;
  const message = order.message + " " + match.message,
    containerRef = match.containerRef;
  const matches = match.matches,
    lines = match.lines;
  const complete =
    questions.every((q) => order.results[q.id] === "correct") &&
    data.answers.every((a) => match.results[a.id] === "correct");
  useCheckButton(rootRef, complete || order.revealed);
  const selectedLeft =
    match.source?.side === "left" ? Number(match.source.id) : null;
  const items = Object.fromEntries(
    questions.flatMap((q) => [
      [
        "bank-" + q.id,
        order.tokens(q).map((t) => ({
          id: t.id,
          text: t.value,
        })),
      ],
      [
        "answer-" + q.id,
        order.inputs[q.id].map((t) => ({
          id: t.id,
          text:
            order.revealed && t === order.inputs[q.id][0]
              ? t.value[0].toUpperCase() + t.value.slice(1)
              : t.value,
        })),
      ],
    ]),
  );
  const usedWordsPerQuestion = (id) =>
    order.results[id] === "wrong" ? [] : items["answer-" + id];
  const isWrongSentence = (id) => order.results[id] === "wrong",
    isWrongMatch = (id) => match.results[id] === "wrong";
  const handleLeftClick = (id) => {
      order.dragStart();
      match.choose("left", id);
    },
    handleRightClick = (id) => {
      order.dragStart();
      match.choose("right", id);
    };
  const endpoint = (side, id, label) => {
    const p = match.endpointProps(side, id, label);
    return {
      ...p,
      tabIndex: order.picked ? -1 : p.tabIndex,
      onClick: () =>
        side === "left" ? handleLeftClick(id) : handleRightClick(id),
      onKeyDown: (e) => {
        if (["Enter", " "].includes(e.key) && !e.repeat) order.dragStart();
        p.onKeyDown(e);
      },
    };
  };
  const onDragEnd = (r) => {
    if (!r.destination || match.source) return;
    const id = Number(r.destination.droppableId.replace("answer-", ""));
    if (!r.destination.droppableId.startsWith("answer-")) return;
    const q = questions.find((q) => q.id === id);
    const token =
      q &&
      order.tokens(q).find((t) => "bank-" + id + "-" + t.id === r.draggableId);
    if (token) order.place(id, token.id, r.destination.index);
  };
  const handleBankWordClick = (id, word) => {
    order.playSound("bank-" + word.id, soundFor(word.text));
    if (!match.source) order.place(id, word.id);
  };
  const checkAnswers = () => {
    if (complete || order.revealed) return;
    order.dragStart();
    order.stopAudio();
    match.cancel();
    if (
      questions.some(
        (q) => order.inputs[q.id].length !== order.tokens(q).length,
      ) ||
      data.answers.some((a) => !matches[a.id])
    ) {
      order.setMessage("Please complete all answers and connections first.");
      ValidationAlert.info(
        "Please complete all answers and connections first.",
      );
      return;
    }
    const results = [
        ...Object.values(order.evaluate()),
        ...Object.values(match.evaluate()),
      ],
      score = results.filter((v) => v === "correct").length;
    order.setMessage(
      "Score " + score + " out of 8. Correct answers are locked.",
    );
    showCheckFeedback(
      rootRef.current,
      score === 8 ? "success" : score ? "warning" : "error",
      "Score: " + score + " / 8",
    );
  };
  const handleShowAnswer = () => {
      order.show();
      match.show();
    },
    handleStartAgain = () => {
      order.reset();
      match.reset();
    };
  const tokenProps = (id, word) => ({
    role: "button",
    tabIndex: match.source || order.picked ? -1 : 0,
    "aria-disabled": order.locked(id),
    "aria-label": word.text + ". Return to bank.",
    onKeyDown: (e) => {
      if (["Delete", "Backspace"].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        if (!e.repeat && order.results[id] === "wrong")
          order.remove(id, word.id);
      } else if (["Enter", " "].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        if (!e.repeat) e.currentTarget.click();
      }
    },
    onKeyUp: release,
    onClick: (e) => {
      e.stopPropagation();
      order.remove(id, word.id);
    },
    style: {
      borderRadius: 4,
    },
  });
  return (
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
          gap: "30px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="C"
          title={<> Look, unscramble, and write. Match.</>}
          subTitle={
            "Say the correct jobs and wants word or sentence first, then rearrange the pieces into that order."
          }
        />

        <DragDropContext
          enableDefaultSensors={false}
          sensors={[useMouseSensor, useTouchSensor]}
          onDragStart={() => {
            order.dragStart();
            match.cancel();
          }}
          onDragEnd={onDragEnd}
        >
          <div
            ref={containerRef}
            className="flex justify-between w-full relative"
          >
            {/* LEFT */}
            <div className="flex flex-col items-start justify-center space-y-8 w-80">
              {data.answers.map((a) => (
                <div key={a.id} className="flex items-center gap-4 relative">
                  <span>{a.id}</span>
                  <img
                    src={a.img}
                    {...endpoint("left", a.id, IMAGE_DESCRIPTIONS[a.img])}
                    ref={(el) => {
                      match.leftRefs.current[a.id] = el;
                    }}
                    alt={IMAGE_DESCRIPTIONS[a.img]}
                    onLoad={match.refresh}
                    className={`${focusClass} w-12 h-12 rounded-full cursor-pointer transition
    ${selectedLeft === a.id ? "ring-4 ring-blue-600 scale-105" : "hover:scale-105"}
  `}
                    style={{
                      ...endpoint("left", a.id, IMAGE_DESCRIPTIONS[a.img])
                        .style,
                      borderRadius: "50%",
                      height: "90px",
                      width: "90px",
                    }}
                  />
                  <div
                    ref={(el) => (match.leftDots.current[a.id] = el)}
                    onClick={() => handleLeftClick(a.id)}
                    style={{
                      backgroundColor: match.locked("left", a.id)
                        ? "#16a34a"
                        : undefined,
                    }}
                    className={`w-4 h-4 rounded-full cursor-pointer transition
    ${selectedLeft === a.id ? "bg-red-600 scale-125 ring-4 ring-red-600" : "bg-red-500 hover:scale-110"}
  `}
                  />

                  {isWrongMatch(a.id) && (
                    <span className="absolute -top-2 -right-6 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold shadow border-2 border-white">
                      ✕
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* RIGHT */}
            <div className="flex-1 space-y-5.5">
              {data.questions.map((q) => (
                <div key={q.id}>
                  <div className="flex items-center gap-3">
                    <div
                      ref={(el) => {
                        match.rightDots.current[q.id] = el;
                      }}
                      onClick={() => handleRightClick(q.id)}
                      style={{
                        backgroundColor: match.locked("right", q.id)
                          ? "#16a34a"
                          : undefined,
                      }}
                      className={`w-[4%] h-4 rounded-full cursor-pointer transition
    ${Object.values(matches).some((id) => String(id) === String(q.id)) ? "bg-red-600 scale-105" : "bg-red-500 hover:scale-125"}
  `}
                    />

                    <img
                      src={q.img}
                      alt={IMAGE_DESCRIPTIONS[q.img]}
                      {...endpoint(
                        "right",
                        q.id,
                        "Match this picture with the sentence: " + q.text,
                      )}
                      ref={(el) => {
                        match.rightRefs.current[q.id] = el;
                      }}
                      onLoad={match.refresh}
                      className={`${focusClass} w-12 h-12 rounded-full cursor-pointer transition
    ${Object.values(matches).includes(q.id) ? "scale-105" : "hover:scale-125 active:ring-4 active:ring-red-600 "}
  `}
                      style={{
                        ...endpoint("right", q.id, IMAGE_DESCRIPTIONS[q.img])
                          .style,
                        borderRadius: "50%",
                        height: "90px",
                        width: "90px",
                      }}
                    />

                    <div className="flex flex-col w-[90%]">
                      {/* WORD BANK */}
                      <Droppable
                        droppableId={`bank-${q.id}`}
                        type={`group-${q.id}`}
                        direction="horizontal"
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="flex items-center justify-start gap-2 mt-2 rounded p-2 min-h-[52px]"
                          >
                            {items[`bank-${q.id}`].map((word, i) => {
                              const isUsed = usedWordsPerQuestion(q.id).some(
                                (w) => w.id === word.id,
                              );
                              return (
                                <Draggable
                                  key={word.id}
                                  draggableId={`bank-${q.id}-${word.id}`}
                                  index={i}
                                  isDragDisabled={
                                    isUsed ||
                                    order.locked(q.id) ||
                                    !!match.source
                                  } // 🔒
                                >
                                  {(provided, snapshot) => {
                                    const token = {
                                      id: word.id,
                                      value: word.text,
                                    };
                                    const props = order.bankProps(
                                      questions.find(
                                        (item) => item.id === q.id,
                                      ),
                                      token,
                                      !!match.source,
                                    );
                                    const node = (
                                      <span
                                        ref={(el) => {
                                          provided.innerRef(el);
                                          order.bankRefs.current[word.id] = el;
                                        }}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        {...props}
                                        // ✅ كبسة على كلمة الورد بانك = تحطها بآخر الجملة
                                        onClick={() =>
                                          handleBankWordClick(q.id, word)
                                        }
                                        className={`${focusClass} WB-word-bank 
            ${isUsed || order.locked(q.id) ? "text-gray-400 border border-blue-900 cursor-not-allowed opacity-60" : "bg-gray-200 text-black cursor-pointer border border-blue-900"}`}
                                        style={{
                                          padding: "1px 14px",
                                          ...{
                                            borderRadius: 8,
                                            position: "relative",
                                            ...(order.picked?.token === token.id
                                              ? {
                                                  outline: "3px solid #2563eb",
                                                  outlineOffset: 2,
                                                  backgroundColor: "#dbeafe",
                                                }
                                              : {}),
                                          },
                                          ...provided.draggableProps.style,
                                          ...(snapshot.isDragging
                                            ? {
                                                zIndex: 2147483647,
                                              }
                                            : {}),
                                        }}
                                      >
                                        {word.text}
                                        {playingKey === "bank-" + word.id && (
                                          <SpeakerBadge />
                                        )}
                                      </span>
                                    );
                                    return snapshot.isDragging
                                      ? createPortal(
                                          node,
                                          document.fullscreenElement ||
                                            document.body,
                                        )
                                      : node;
                                  }}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      {/* sentence drop */}
                      <Droppable
                        isDropDisabled={order.locked(q.id) || !!match.source}
                        droppableId={`answer-${q.id}`}
                        type={`group-${q.id}`}
                        direction="horizontal"
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={(el) => {
                              provided.innerRef(el);
                              order.slotRefs.current[q.id] = el;
                            }}
                            {...provided.droppableProps}
                            {...order.slotProps(
                              questions.find((item) => item.id === q.id),
                              snapshot,
                              !!match.source,
                            )}
                            className={`${focusClass} focus-visible:rounded-sm! relative min-h-[40px] w-50 border-b-2 border-gray-400 flex w-full`}
                          >
                            {items[`answer-${q.id}`].map((word, i) => (
                              <Draggable
                                key={word.id}
                                draggableId={word.id}
                                index={i}
                                isDragDisabled={true}
                              >
                                {(provided) => (
                                  <span
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    // ✅ كبسة على كلمة جوا الجملة = ترجعها للبانك
                                    {...tokenProps(q.id, word)}
                                    className={`${focusClass} px-2 py-1 rounded transition
  ${!order.locked(q.id) ? "cursor-pointer hover:text-red-500" : "opacity-60 cursor-not-allowed"}
`}
                                  >
                                    {word.text}
                                  </span>
                                )}
                              </Draggable>
                            ))}

                            {isWrongSentence(q.id) && (
                              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold shadow border-2 border-white">
                                ✕
                              </span>
                            )}

                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* LINES */}
            <svg
              aria-hidden="true"
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
            >
              {match.previewLine && (
                <line
                  {...match.previewLine}
                  stroke="#2563eb"
                  strokeDasharray="6 4"
                  strokeWidth="2"
                />
              )}
              {lines.map((line, i) => (
                <line
                  key={i}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke={
                    match.results[line.left] === "correct" ? "#16a34a" : "red"
                  }
                  strokeWidth="2"
                />
              ))}
            </svg>
          </div>
        </DragDropContext>

        <Button
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={handleStartAgain}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
};
export default WB_Unit4_Page22_Q1;

import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import React, { useState, useRef, useEffect } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 3/Ex B 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 3/Ex B 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 3/Ex B 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 3/Ex B 4.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import {
  DragDropContext,
  Droppable,
  Draggable,
  useMouseSensor,
  useTouchSensor,
} from "@hello-pangea/dnd";
import "./WB_Unit1_Page3_Q2.css";

import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 1/Page 3 - B/Item_001_tisesr.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 1/Page 3 - B/Item_002_aftreh.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 1/Page 3 - B/Item_003_lapy.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 1/Page 3 - B/Item_004_thomer.mp3";

// Keep the score dialog's return focus on an enabled action in this exercise.
function showCheckFeedback(root, kind, ...messages) {
  if (kind === "success") {
    const returnTarget =
      root?.querySelector(".try-again-button:not(:disabled)") ||
      root?.querySelector(".show-answer-btn:not(:disabled)");
    returnTarget?.focus({ preventScroll: true });
  }
  ValidationAlert[kind](...messages);
}


const IMAGE_DESCRIPTIONS = {
  [img1]: "Two children kneeling with a doll and a teddy bear.",
  [img2]: "A woman with dark hair and an orange headband wearing green.",
  [img3]: "A child with dark hair tied up and a blue top.",
  [img4]: "A man in a blue shirt and vest holding one hand up.",
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
// eslint-disable-next-line react-refresh/only-export-components -- Keep this control local.
const AudioText = ({
  children,
  audioKey,
  src,
  playSound,
  playingKey,
  className = "",
  style = {},
}) => (
  <span
    role="button"
    tabIndex={0}
    aria-label={String(children) + ". Hear it."}
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
        ? { boxShadow: "0 0 0 3px #2563eb", backgroundColor: "#dbeafe" }
        : {}),
    }}
  >
    {children}
    {playingKey === audioKey && <SpeakerBadge />}
  </span>
);
//.....
function useMatching(correct, imageOrder) {
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
    window.addEventListener("resize", refresh);
    return () => {
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
      const nextId = ids.find((id) => !locked("left", id));
      if (nextId) focus("left", nextId);
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
            outline: "3px solid #eb533c",
            outlineOffset: 2,
          }
        : {}),
      ...(locked(side, id)
        ? {
            boxShadow: "inset 0 0px #16a34a",
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
      x: r.left + r.width / 2 - c.left,
      y: r.top + r.height / 2 - c.top,
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
  const place = (id, tokenId) => {
    const q = questions.find((q) => String(q.id) === String(id)),
      item = q && tokens(q).find((t) => t.id === tokenId);
    if (
      !item ||
      locked(id) ||
      inputs[id].some((t) => t.id === tokenId) ||
      inputs[id].length >= tokens(q).length
    )
      return;
    const next = [...inputs[id], item];
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
    onClick: () => audio.playSound("bank-" + item.id, sounds[item.value]),
    onFocus: (e) => {
      if (!suppress.current && e.currentTarget.matches(":focus-visible"))
        audio.playSound("bank-" + item.id, sounds[item.value]);
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
      audio.playSound("bank-" + item.id, sounds[item.value]);
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
            borderBottomColor: "#16a34a",
            boxShadow: "inset 0 0px #16a34a",
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
  return {
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

const WB_Unit1_Page3_Q2 = () => {
  const completedCheckRef = useRef(null);
  const completeCheck = (event) => {
    const button = event?.currentTarget;
    if (!completedCheckRef.current || (button?.style && completedCheckRef.current.button !== button)) {
      completedCheckRef.current = { button, cursor: button?.style?.cursor, aria: button?.getAttribute?.("aria-disabled") };
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
      if (previous.aria == null) previous.button.removeAttribute("aria-disabled");
      else previous.button.setAttribute("aria-disabled", previous.aria);
    }
    completedCheckRef.current = null;
  };

  const initialQuestions = [
    {
      id: 1,
      matchWord: "tisesr",
      correctSentence: "sister",
      scrambled: ["t", "i", "s", "e", "s", "r"].map((char, index) => ({
        id: `1-${char}-${index}`,
        value: char,
      })),
      image: img4,
    },
    {
      id: 2,
      matchWord: "aftreh",
      correctSentence: "father",
      scrambled: ["a", "f", "t", "r", "e", "h"].map((char, index) => ({
        id: `2-${char}-${index}`,
        value: char,
      })),
      image: img3,
    },
    {
      id: 3,
      matchWord: "lapy",
      correctSentence: "play",
      scrambled: ["l", "a", "p", "y"].map((char, index) => ({
        id: `3-${char}-${index}`,
        value: char,
      })),
      image: img1,
    },
    {
      id: 4,
      matchWord: "thomer",
      correctSentence: "mother",
      scrambled: ["t", "h", "o", "m", "e", "r"].map((char, index) => ({
        id: `4-${char}-${index}`,
        value: char,
      })),
      image: img2,
    },
  ];
  const correctMatches = [
    { word: "sister", image: "img2" },
    { word: "father", image: "img1" },
    { word: "play", image: "img3" },
    { word: "mother", image: "img4" },
  ];
  const ErrorMark = () => (
    <div className="absolute -top-2 -right-2 z-20 flex items-center justify-center w-6 h-6 bg-red-500 border-2 border-white rounded-full shadow-md">
      <span className="text-white text-xs font-bold">✕</span>
    </div>
  );
  const questionsState = initialQuestions;
  const order = useTokenOrder(
      questionsState.map((q) => ({ ...q, separator: "" })),
      {},
    ),
    match = useMatching(
      Object.fromEntries(
        correctMatches.map((pair, i) => [i + 1, pair.image.replace("img", "")]),
      ),
      questionsState.map((q) => q.id),
    );
  const { containerRef } = match;
  const userInputs = order.inputs,
    showAnswer = order.revealed;
  const wrongWords = Object.keys(order.results).filter(
      (id) => order.results[id] === "wrong",
    ),
    wrongImages = Object.keys(match.results)
      .filter((id) => match.results[id] === "wrong")
      .map((id) => "word-" + id);
  const selectedWord =
      match.source?.side === "left" ? Number(match.source.id) : null,
    selectedWordDot = match.source?.side === "left" ? match.source.id : null,
    selectedImage =
      match.source?.side === "right" ? Number(match.source.id) : null,
    selectedImageDot = match.source?.side === "right" ? match.source.id : null;
  const lines = match.lines.map((line) => ({
    ...line,
    wordId: "word-" + line.left,
  }));
  const handleStartDotClick = (e) => {
      order.dragStart();
      match.choose("left", e.currentTarget.dataset.wordId.replace("word-", ""));
    },
    handleEndDotClick = (e) => {
      order.dragStart();
      match.choose("right", e.currentTarget.dataset.image.replace("img", ""));
    };
  const handleRemoveLetter = (id, token) => order.remove(id, token);
  const onDragEnd = ({ destination, draggableId }) => {
    if (!destination?.droppableId.startsWith("sentence-")) return;
    order.place(destination.droppableId.replace("sentence-", ""), draggableId);
  };
  const checkAnswers2 = (checkEvent) => {
    if (completedCheckRef.current) { completeCheck(checkEvent); return; }

    if (showAnswer) return;
    order.dragStart();
    match.cancel();
    order.stopAudio();
    if (Object.keys(match.matches).length < 4) {
      ValidationAlert.info(
        "Oops!",
        "Please connect all the pairs before checking.",
      );
      order.setMessage("Please connect all the pairs before checking.");
      return;
    }
    const words = order.evaluate(),
      pairs = match.evaluate(),
      score = Object.values(pairs).filter((x) => x === "correct").length,
      msg = `Score: ${score} / 4`;
    order.setMessage(
      msg + ". Correct pairs and correct words are locked independently.",
    );
    if (score === 4 && Object.values(words).every((x) => x === "correct"))
      (completeCheck(checkEvent), showCheckFeedback(order.rootRef.current, "success", msg));
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };
  const show = () => {
      order.show();
      match.show();
    },
    reset = () => {
      order.reset();
      match.reset();
    };

    //....
  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onDragStart={() => {
        order.dragStart();
        match.cancel();
      }}
      enableDefaultSensors={false}
      sensors={[useMouseSensor, useTouchSensor]}
    >
      <div ref={order.rootRef} className="main-container-component">
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {order.message} {match.message}
        </div>
        <div className="div-forall mb-10" style={{ gap: "20px" }}>
          <ExerciseHeader
            isWorkbook
            sectionLetter="B"
            title={<>Read and match.</>}
            subTitle={"Unscramble one family word at a time, say it aloud, then connect it to the correct picture."}
          />

          <div
            className="CB-review3-p1-q2-wrapper relative w-full min-h-96"
            ref={containerRef}
          >
            <div className="flex flex-col gap-5 w-full">
              {questionsState.map((q) => (
                <div
                  key={q.id}
                  className="flex flex-row gap-4 items-center justify-between w-full"
                >
                  <div className="flex items-center w-[100%]">
                    <div className="flex flex-col gap-3 items-start w-70">
                      <div className="flex flex-row items-center gap-2 whitespace-nowrap flex-shrink-0 relative">
                        <span className="flex items-center justify-center w-7 h-7 text-xl font-bold">
                          {q.id}
                        </span>

                        <span
                          className={`${focusClass} text-base font-bold letter-spacing-1  transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                            showAnswer || match.locked("left", q.id)
                              ? "opacity-60 cursor-not-allowed"
                              : "text-gray-800 hover:text-red-600 hover:underline cursor-pointer"
                          } ${
                            selectedWord === q.id
                              ? "scale-125 text-red-600 font-bold underline decoration-red-600 decoration-2 underline-offset-2"
                              : ""
                          }`}
                          onClick={() => {
                            order.dragStart();
                            order.playSound(
                              `word-${q.id}`,
                              [clip0, clip1, clip2, clip3][q.id - 1],
                            );
                            match.choose("left", q.id);
                          }}
                          ref={(el) => {
                            match.leftRefs.current[q.id] = el;
                          }}
                          {...match.endpointProps("left", q.id, q.matchWord)}
                          onKeyDown={(e) => {
                            if (
                              (e.key === "Enter" || e.key === " ") &&
                              !e.repeat
                            ) {
                              order.dragStart();
                              order.playSound(
                                `word-${q.id}`,
                                [clip0, clip1, clip2, clip3][q.id - 1],
                              );
                            }
                            match
                              .endpointProps("left", q.id, q.matchWord)
                              .onKeyDown(e);
                          }}
                        >
                          {q.matchWord}
                          {order.playingKey === `word-${q.id}` && (
                            <SpeakerBadge />
                          )}
                        </span>

                        {/* علامة الخطأ فوق الكلمة إذا كان التوصيل خاطئاً */}
                        {wrongImages.includes(`word-${q.id}`) && <ErrorMark />}
                      </div>

                      <Droppable
                        droppableId={`bank-${q.id}`}
                        direction="horizontal"
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="flex flex-row gap-2 flex-wrap"
                          >
                            {q.scrambled.map((letterObj, i) => {
                              const isUsed = userInputs[q.id]?.some(
                                (item) => item.id === letterObj.id,
                              );
                              return (
                                <Draggable
                                  key={letterObj.id}
                                  draggableId={letterObj.id}
                                  isDragDisabled={order.locked(q.id) || isUsed}
                                  index={i}
                                >
                                  {(provided) => (
                                    <div
                                      ref={(el) => {
                                        provided.innerRef(el);
                                        order.bankRefs.current[letterObj.id] =
                                          el;
                                      }}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      {...order.bankProps(
                                        q,
                                        letterObj,
                                        !!match.source,
                                      )}
                                      className={`${focusClass} flex items-center justify-center w-8 h-8 border-1 border-gray-300 rounded text-lg font-bold transition-all touch-none ${
                                        isUsed || showAnswer
                                          ? "bg-gray-400 opacity-60 cursor-not-allowed"
                                          : "bg-white cursor-grab hover:border-blue-900 hover:shadow-md"
                                      }`}
                                      style={{
                                        ...provided.draggableProps.style,
                                        ...(order.picked?.token === letterObj.id
                                          ? {
                                              outline: "4px solid #2563eb",
                                              backgroundColor: "#dbeafe",
                                            }
                                          : {}),
                                      }}
                                    >
                                      {letterObj.value}
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      <Droppable
                        droppableId={`sentence-${q.id}`}
                        isDropDisabled={order.locked(q.id)}
                        direction="horizontal"
                      >
                        {(provided, snapshot) => (
                          <div className="relative w-full">
                            <div
                              ref={(el) => {
                                provided.innerRef(el);
                                order.slotRefs.current[q.id] = el;
                              }}
                              {...provided.droppableProps}
                              {...order.slotProps(
                                { ...q, separator: "" },
                                snapshot,
                                !!match.source,
                              )}
                              className={`${focusClass} flex flex-row gap-1 p-2 h-8 items-center transition-all flex-wrap w-full ${
                                snapshot.isDraggingOver
                                  ? "bg-blue-100 border-b-2 border-blue-600 shadow-md"
                                  : "bg-white border-b-2 border-gray-300"
                              }`}
                            >
                              {userInputs[q.id]?.map((item) => (
                                <span
                                  key={item.id}
                                  onClick={() =>
                                    handleRemoveLetter(q.id, item.id)
                                  }
                                  className="flex items-center justify-center w-2 h-7 text-xl text-black cursor-pointer transition-all hover:text-red-500 hover:border-red-600 flex-shrink-0"
                                >
                                  {item.value}
                                </span>
                              ))}
                              {provided.placeholder}
                            </div>
                            {/* علامة الخطأ فوق حقل الإدخال إذا كان الترتيب خاطئاً */}
                            {wrongWords.includes(String(q.id)) && <ErrorMark />}
                          </div>
                        )}
                      </Droppable>
                    </div>

                    <div className="flex items-end justify-start w-8 h-8 flex-shrink-0">
                      <div
                        className={`rounded-full cursor-pointer transition-all shadow-md ${
                          selectedWordDot === q.id.toString()
                            ? "w-5 h-5 bg-red-600 shadow-xl scale-125"
                            : "w-3.5 h-3.5 bg-red-600 hover:w-5 hover:h-5 hover:shadow-lg"
                        }`}
                        ref={(el) => {
                          match.leftDots.current[q.id] = el;
                        }}
                        id={`dot-word-${q.id}`}
                        data-word-id={`word-${q.id}`}
                        onClick={handleStartDotClick}
                      />
                    </div>
                  </div>

                  <div className="flex flex-row gap-3 items-center justify-end flex-shrink-0">
                    <div className="flex items-center justify-center w-8 h-8 flex-shrink-0">
                      <div
                        className={`rounded-full cursor-pointer transition-all shadow-md ${
                          selectedImageDot === q.id.toString()
                            ? "w-5 h-5 bg-red-600 shadow-xl scale-125"
                            : "w-3.5 h-3.5 bg-red-600 hover:w-5 hover:h-5 hover:shadow-lg"
                        }`}
                        data-image={`img${q.id}`}
                        ref={(el) => {
                          match.rightDots.current[q.id] = el;
                        }}
                        id={`img${q.id}-dot`}
                        onClick={handleEndDotClick}
                      />
                    </div>

                    <div
                      className={`flex items-center justify-center flex-shrink-0 w-40 transition-all ${focusClass} ${
                        selectedImage === q.id
                          ? "scale-95 border-2 border-red-600 rounded-lg shadow-xl"
                          : "border-2 border-gray-300 rounded-lg"
                      }`}
                      onClick={() => {
                        order.dragStart();
                        match.choose("right", q.id);
                      }}
                      ref={(el) => {
                        match.rightRefs.current[q.id] = el;
                      }}
                      {...match.endpointProps("right", q.id, `Image ${q.id}`)}
                      onKeyDown={(e) => {
                        if ((e.key === "Enter" || e.key === " ") && !e.repeat)
                          order.dragStart();
                        match
                          .endpointProps("right", q.id, `Image ${q.id}`)
                          .onKeyDown(e);
                      }}
                      style={{ position: "relative" }}
                    >
                      <img
                        src={q.image}
                        alt={IMAGE_DESCRIPTIONS[q.image] || ""}
                        className={`object-contain transition-all ${
                          showAnswer || match.locked("right", q.id)
                            ? "opacity-60 cursor-not-allowed"
                            : "cursor-pointer hover:scale-105 hover:brightness-110"
                        }`}
                        onLoad={match.refresh}
                        style={{ height: "120px", width: "auto" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <svg
              aria-hidden="true"
              className="lines-layer absolute top-0 left-0 w-full h-full pointer-events-none z-10"
            >
              {match.previewLine && (
                <line
                  {...match.previewLine}
                  stroke="#eb533c"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                />
              )}
              {lines.map((l, i) => (
                <line
                  key={i}
                  x1={l.x1}
                  y1={l.y1}
                  x2={l.x2}
                  y2={l.y2}
                  stroke={
                    match.results[l.left] === "correct" ? "#16a34a" : "red"
                  }
                  strokeWidth="3"
                />
              ))}
            </svg>
          </div>
        </div>

        <div className="action-buttons-container mt-8">
          <button onClick={(checkEvent) => { resetCompletedCheck(); (reset)(checkEvent); }} className="try-again-button">
            Start Again ↻
          </button>
          <button onClick={show} className="show-answer-btn swal-continue">
            Show Answer
          </button>
          <button onClick={checkAnswers2} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default WB_Unit1_Page3_Q2;

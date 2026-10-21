/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 7/Page 42 - H/Item_001_1.My_momisa_Igtihf_tedatnatn.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 7/Page 42 - H/Item_002_She_can_pack_her_seactius.mp3";
import { createPortal } from "react-dom";
import React, { useState, useRef, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 42/Ex G 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 42/Ex G 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 42/Ex G 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 42/Ex G 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 42/Ex G 5.svg";
const IMAGE_DESCRIPTIONS = {
  [img1]: "A woman in uniform carrying a suitcase.",
  [img2]: "A woman packing a suitcase on a bed.",
  [img3]: "A customer and an assistant in a shop.",
  [img4]: "An airplane.",
  [img5]: "A pilot in uniform.",
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
  "1my momisa igtihf tedatnatn": clip0,
  "she can pack her seactius": clip1,
};
const normalized = (text) =>
  String(text)
    .toLowerCase()
    .replaceAll("’", "'")
    .replace(/:/g, " ")
    .replace(/[.,!?]/g, "")
    .replace(/\s+/g, " ")
    .trim();
const soundFor = (text) => SOUNDS[normalized(text)];
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
    cancelFocus();
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
    onClick: () => audio.playSound("bank-" + item.id, soundFor(item.value)),
    onFocus: (e) => {
      if (!suppress.current && e.currentTarget.matches(":focus-visible"))
        audio.playSound("bank-" + item.id, soundFor(item.value));
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
      audio.playSound("bank-" + item.id, soundFor(item.value));
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
      e.stopPropagation();
      if (!locked(q.id) && inputs[q.id].length)
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
          const token = tokens(q).find(
            (t) => t.id !== picked.token && !used(t.id),
          );
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
function useDragState(place, clear) {
  const [active, setActive] = useState(null),
    current = useRef(null);
  const stop = () => {
    current.current = null;
    setActive(null);
    clear();
  };
  return {
    active,
    stop,
    start: (e) => {
      clear();
      current.current = e.active.id;
      const r = e.active.rect?.current?.initial;
      setActive({
        id: e.active.id,
        ...(r
          ? {
              width: r.width,
              height: r.height,
            }
          : {}),
      });
    },
    end: (e) => {
      const id = current.current;
      current.current = null;
      setActive(null);
      if (id === e.active.id && e.over) place(e.over.id, id);
    },
    cancel: stop,
  };
}
function DragPreview({ drag, className, children }) {
  return createPortal(
    <DragOverlay
      style={{
        zIndex: 2147483647,
      }}
      dropAnimation={null}
    >
      {drag.active ? (
        <div
          className={className}
          style={{
            width: drag.active.width,
            height: drag.active.height,
            boxSizing: "border-box",
            pointerEvents: "none",
          }}
        >
          {children}
        </div>
      ) : null}
    </DragOverlay>,
    document.fullscreenElement || document.body,
  );
}
const exerciseData = {
  sentences: [
    {
      id: "1",
      words: [
        {
          scrambled: ["l", "g", "t", "i", "h", "f"],
          correct: "flight",
        },
        {
          scrambled: ["t", "e", "d", "a", "t", "n", "a", "t", "n"],
          correct: "attendant",
        },
      ],
      questionParts: ["My mom is a ", " ", "."],
    },
    {
      id: "2",
      words: [
        {
          scrambled: ["s", "e", "a", "c", "t", "i", "u", "s"],
          correct: "suitcase",
        },
      ],
      questionParts: ["She can pack her ", "."],
    },
    {
      id: "3",
      words: [
        {
          scrambled: ["n", "i", "r", "v", "e", "u", "o", "s"],
          correct: "souvenir",
        },
        {
          scrambled: ["p", "o", "s", "h"],
          correct: "shop",
        },
      ],
      questionParts: ["He is looking at the things in the ", " ", "."],
    },
    {
      id: "4",
      words: [
        {
          scrambled: ["l", "v", "a", "i", "r", "r", "a"],
          correct: "arrival",
        },
        {
          scrambled: ["n", "e", "a", "l", "p", "r", "i", "a"],
          correct: "airplane",
        },
      ],
      questionParts: ["We saw the ", " of the ", "."],
    },
    {
      id: "5",
      words: [
        {
          scrambled: ["l", "t", "o", "p", "i"],
          correct: "pilot",
        },
      ],
      questionParts: ["The ", " walked to the plane."],
    },
  ],
};
const images = [img1, img2, img3, img4, img5];
const DraggableLetter = ({ q, item, order, drag }) => {
  const id = item.id,
    used = order.used(id),
    disabled = used || order.locked(q.id);
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
    disabled,
  });
  const props = order.bankProps(q, item);
  return (
    <button
      type="button"
      ref={(el) => {
        setNodeRef(el);
        order.bankRefs.current[id] = el;
      }}
      {...attributes}
      {...listeners}
      {...props}
      style={{
        touchAction: "none",
        borderRadius: 8,
        position: "relative",
        opacity: drag.active?.id === id ? 0 : used ? 0.5 : 1,
        ...(order.picked?.token === id
          ? {
              outline: "3px solid #2563eb",
              outlineOffset: 2,
              backgroundColor: "#dbeafe",
            }
          : {}),
      }}
      className={
        focusClass +
        " WB-word-bank " +
        (used
          ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
          : "border-blue-900 text-gray-800 cursor-grab active:cursor-grabbing hover:bg-gray-300")
      }
    >
      {item.value}
      {order.playingKey === "bank-" + id && <SpeakerBadge />}
    </button>
  );
};
const WordDropZone = ({ q, order, drag }) => {
  const { setNodeRef, isOver } = useDroppable({
      id: q.id,
      disabled: order.locked(q.id),
    }),
    props = order.slotProps(q, {
      isDraggingOver: isOver && !!drag.active,
    });
  return (
    <div className="relative inline-block w-full">
      <button
        type="button"
        ref={(el) => {
          setNodeRef(el);
          order.slotRefs.current[q.id] = el;
        }}
        {...props}
        className={
          focusClass +
          " focus-visible:rounded-sm! w-full min-h-[40px] px-4 py-2 border-b-2 font-semibold text-xl text-center transition-colors border-gray-400 text-gray-800 bg-white"
        }
      >
        {order.inputs[q.id].map((t) => t.value).join("")}
      </button>
      {order.results[q.id] === "wrong" && (
        <div
          aria-hidden="true"
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow border-2 border-white"
        >
          ✕
        </div>
      )}
    </div>
  );
};
const WB_Unit7_Page42_Q2 = () => {
  const questions = exerciseData.sentences.flatMap((s) =>
    s.words.map((w, i) => ({
      id: "drop-" + s.id + "-" + i,
      scrambled: w.scrambled.map((value, j) => ({
        id: "letter-" + s.id + "-" + i + "-" + j,
        value,
      })),
      correctSentence: w.correct,
      separator: "",
    })),
  );
  const order = useTokenOrder(questions, SOUNDS);
  const { rootRef, message, playingKey, playSound } = order;
  const drag = useDragState(
    (id, token) => order.place(id, token),
    order.dragStart,
  );
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
  );
  const complete = questions.every((q) => order.results[q.id] === "correct");
  const completionRef = useRef(false);
  completionRef.current = complete || order.revealed;
  useCheckButton(rootRef, complete || order.revealed);
  const checkAnswers = () => {
    if (completionRef.current) return;
    drag.stop();
    order.stopAudio();
    if (
      questions.some(
        (q) => order.inputs[q.id].length !== order.tokens(q).length,
      )
    ) {
      order.setMessage(
        "Please complete all sentences before checking your answers.",
      );
      ValidationAlert.info(
        "Please complete all sentences before checking your answers.",
      );
      return;
    }
    const result = order.evaluate(),
      score = exerciseData.sentences.filter((s) =>
        s.words.every((w, i) => result["drop-" + s.id + "-" + i] === "correct"),
      ).length,
      total = exerciseData.sentences.length;
    completionRef.current = score === total;
    order.setMessage(
      "Score " + score + " out of " + total + ". Correct answers are locked.",
    );
    showCheckFeedback(
      rootRef.current,
      score === total ? "success" : score ? "warning" : "error",
      "Score: " + score + " / " + total,
    );
  };
  const handleShowAnswer = () => {
      drag.stop();
      order.show();
    },
    handleStartAgain = () => {
      drag.stop();
      order.reset();
    };

// 
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
          gap: "25px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="H"
          title="Read and look. Unscramble the word. Rewrite the sentence."
          subTitle={"Unscramble the airport word first, then rewrite the whole sentence with the correct spelling."}
        />

        <DndContext
          collisionDetection={closestCenter}
          sensors={sensors}
          onDragStart={drag.start}
          onDragEnd={drag.end}
          onDragCancel={drag.cancel}
        >
          <div className="p-6 space-y-6">
            {exerciseData.sentences.map((sentence, idx) => {
              return (
                <div
                  key={sentence.id}
                  className="border-blue-900 border-2 p-4 rounded-lg flex gap-6 items-start w-full"
                >
                  <div className="flex flex-col w-full">
                    <p
                      className={focusClass + " " + "text-lg leading-10"}
                      role={idx < 2 ? "button" : undefined}
                      tabIndex={idx < 2 ? (order.picked ? -1 : 0) : undefined}
                      aria-label={"Hear sentence " + (idx + 1)}
                      onClick={() => {
                        if (idx < 2)
                          playSound(
                            "sentence-" + sentence.id,
                            idx === 0 ? clip0 : clip1,
                          );
                      }}
                      onKeyDown={activate}
                      onKeyUp={release}
                      style={{
                        position: "relative",
                        borderRadius: 8,
                        ...(playingKey === "sentence-" + sentence.id
                          ? {
                              boxShadow: "0 0 0 3px #2563eb",
                              backgroundColor: "#dbeafe",
                            }
                          : {}),
                      }}
                    >
                      <span className="font-bold">{idx + 1}.</span>{" "}
                      {sentence.questionParts.map((part, partIndex) => (
                        <React.Fragment key={partIndex}>
                          {part}
                          {partIndex < sentence.words.length && (
                            <span className="inline-block mx-1 px-1 border-b-2 border-gray-500 font-semibold tracking-wide">
                              {sentence.words[partIndex].scrambled.join("")}
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                      {playingKey === "sentence-" + sentence.id && (
                        <SpeakerBadge />
                      )}
                    </p>

                    <div
                      className="space-y-2 flex flex-col flex-wrap"
                      style={{
                        justifyContent: "space-around",
                      }}
                    >
                      {sentence.words.map((word, wordIndex) => {
                        return (
                          <div
                            key={`${sentence.id}-${wordIndex}`}
                            className="space-y-4"
                          >
                            <WordDropZone
                              q={questions.find(
                                (q) =>
                                  q.id === `drop-${sentence.id}-${wordIndex}`,
                              )}
                              order={order}
                              drag={drag}
                            />

                            <div className="flex flex-wrap gap-2 w-full">
                              {word.scrambled.map((letter, letterIndex) => {
                                return (
                                  <DraggableLetter
                                    key={`letter-${sentence.id}-${wordIndex}-${letterIndex}`}
                                    q={questions.find(
                                      (q) =>
                                        q.id ===
                                        `drop-${sentence.id}-${wordIndex}`,
                                    )}
                                    item={
                                      order.tokens(
                                        questions.find(
                                          (q) =>
                                            q.id ===
                                            `drop-${sentence.id}-${wordIndex}`,
                                        ),
                                      )[letterIndex]
                                    }
                                    order={order}
                                    drag={drag}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="ml-auto w-[50%] flex justify-end">
                    <img
                      src={images[idx]}
                      style={{
                        width: "auto",
                        height: "240px",
                        objectFit: "contain",
                      }}
                      alt={
                        IMAGE_DESCRIPTIONS[images[idx]] ||
                        "Illustration for this exercise"
                      }
                    />
                  </div>
                </div>
              );
            })}

            <Button
              handleStartAgain={handleStartAgain}
              handleShowAnswer={handleShowAnswer}
              checkAnswers={checkAnswers}
            />
          </div>
          <DragPreview drag={drag} className="WB-word-bank bg-white shadow-lg">
            {
              questions
                .flatMap(order.tokens)
                .find((t) => t.id === drag.active?.id)?.value
            }
          </DragPreview>
        </DndContext>
      </div>
    </div>
  );
};
export default WB_Unit7_Page42_Q2;

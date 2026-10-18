/* eslint-disable react-refresh/only-export-components -- Exercise-local controls preserve the shared components. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import sound0 from "../../../assets/audio/WorkBook/Unit 4/Page 22 - D/Item_001_What's_their_job.mp3";
import sound1 from "../../../assets/audio/WorkBook/Unit 4/Page 22 - D/Item_002_They're_police_officers.mp3";
import sound2 from "../../../assets/audio/WorkBook/Unit 4/Page 22 - D/Item_003_What's_his_job.mp3";
import sound3 from "../../../assets/audio/WorkBook/Unit 4/Page 22 - D/Item_004_He's_a_taxi_driver.mp3";
import sound4 from "../../../assets/audio/WorkBook/Unit 4/Page 22 - D/Item_005_He's_a_teacher.mp3";
import { createPortal } from "react-dom";
import React, { useState, useRef, useEffect } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page22/Ex D 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page22/Ex D 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page22/Ex D 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page22/Ex D 4.svg";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
const exerciseData = [
  {
    id: "q1",
    img: img1,
    correctQuestion: "What's their job?",
    correctAnswer: "They're police officers.",
    questionWords: ["their", "job?", "What's"],
    answerWords: ["police", "They're", "officers."],
  },
  {
    id: "q2",
    img: img2,
    correctQuestion: "What's his job?",
    correctAnswer: "He's a taxi driver.",
    questionWords: ["job?", "What's", "his"],
    answerWords: ["a", "He's", "driver.", "taxi"],
  },
  {
    id: "q3",
    img: img3,
    correctQuestion: "What's his job?",
    correctAnswer: "He's a teacher.",
    questionWords: ["his", "job?", "What's"],
    answerWords: ["a", "He's", "teacher."],
  },
  {
    id: "q4",
    img: img4,
    correctQuestion: "What's his job?",
    correctAnswer: "He's a farmer.",
    questionWords: ["his", "What's", "job?"],
    answerWords: ["farmer.", "He's", "a"],
  },
];
const DraggableWord = ({ id, word, disabled, zoneType, order, q }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: {
      wordId: id,
      zoneType,
    },
    disabled,
  });
  const token = {
      id,
      value: word,
    },
    props = order.bankProps(q, token);
  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        order.bankRefs.current[id] = el;
      }}
      {...attributes}
      {...listeners}
      {...props}
      style={{
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
        touchAction: "none",
        opacity: isDragging ? 0 : undefined,
      }}
      className={`WB-word-bank ${focusClass} ${disabled ? "bg-gray-200 text-gray-400" : "bg-white cursor-grab"}`}
    >
      {word}
      {order.playingKey === "bank-" + id && <SpeakerBadge />}
    </div>
  );
};
const DropZone = ({ id, children, className = "", order, q }) => {
  const { setNodeRef, isOver, active } = useDroppable({
    id,
    disabled: order.locked(id),
  });
  const props = order.slotProps(q, {
    isDraggingOver: isOver && order.tokens(q).some((t) => t.id === active?.id),
  });
  const hear = () =>
    order.playSound("sentence-" + id, soundFor(q.correctSentence));
  if (order.playingKey === "sentence-" + id) {
    props.style = {
      ...props.style,
      outline: "3px solid #2563eb",
      outlineOffset: 2,
      borderRadius: 4,
      backgroundColor: "#dbeafe",
    };
  }
  if (order.locked(id)) {
    props.onClick = hear;
    props.onKeyDown = (e) => {
      if (["Enter", " "].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        if (!e.repeat) hear();
      }
    };
  }
  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        order.slotRefs.current[id] = el;
      }}
      {...props}
      className={className + " " + focusClass + " focus-visible:rounded-sm!"}
    >
      {children}
      {order.playingKey === "sentence-" + id && <SpeakerBadge />}
    </div>
  );
};
const IMAGE_DESCRIPTIONS = {
  [img1]: "Two uniformed officers beside a patrol car.",
  [img2]: "A driver in a taxi.",
  [img3]: "A man standing in front of a blackboard.",
  [img4]: "A man holding baskets of vegetables.",
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
  "what's their job": sound0,
  "they're police officers": sound1,
  "what's his job": sound2,
  "he's a taxi driver": sound3,
  "he's a teacher": sound4,
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
const WB_Unit4_Page22_Q2 = () => {
  const questions = exerciseData.flatMap((q) => [
    {
      id: q.id + "-question",
      kind: "question",
      scrambled: q.questionWords.map((value, i) => ({
        id: q.id + "-q-" + i + "|" + value,
        value,
      })),
      correctSentence: q.correctQuestion,
      separator: " ",
    },
    {
      id: q.id + "-answer",
      kind: "answer",
      scrambled: q.answerWords.map((value, i) => ({
        id: q.id + "-a-" + i + "|" + value,
        value,
      })),
      correctSentence: q.correctAnswer,
      separator: " ",
    },
  ]);
  const order = useTokenOrder(questions, {});
  const [activeWord, setActiveWord] = useState(null),
    [dragSize, setDragSize] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
  );
  const message = order.message;
  const { rootRef } = order;
  const complete = questions.every((q) => order.results[q.id] === "correct");
  useCheckButton(rootRef, complete || order.revealed);
  const checkAnswers = () => {
    if (complete || order.revealed) return;
    order.dragStart();
    order.stopAudio();
    if (
      questions.some(
        (q) => order.inputs[q.id].length !== order.tokens(q).length,
      )
    ) {
      order.setMessage("Please complete all answers first.");
      ValidationAlert.info("Please complete all answers first.");
      return;
    }
    const next = order.evaluate(),
      score = Object.values(next).filter((v) => v === "correct").length,
      total = questions.length;
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
      setActiveWord(null);
      order.show();
    },
    handleStartAgain = () => {
      setActiveWord(null);
      order.reset();
    };
  const droppedWords = Object.fromEntries(
    questions.map((q) => [q.id, order.inputs[q.id].map((t) => t.id)]),
  );
  const extractText = (id) => id.split("|")[1];
  const isWrong = (id) => order.results[id] === "wrong";
  const handleDragStart = (e) => {
    order.dragStart();
    setActiveWord(e.active.id);
    const box = e.active.rect?.current?.initial;
    setDragSize(
      box
        ? {
            width: box.width,
            height: box.height,
          }
        : null,
    );
  };
  const handleDragEnd = (e) => {
    setActiveWord(null);
    if (e.over) order.place(e.over.id, e.active.id);
  };
  const tokenProps = (id, token) => ({
    type: "button",
    tabIndex: order.picked ? -1 : 0,
    "aria-label": extractText(token) + ". Return to bank.",
    "aria-disabled": order.locked(id),
    onKeyDown: (e) => {
      if (["Delete", "Backspace"].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        if (!e.repeat && order.results[id] === "wrong") order.remove(id, token);
      } else if (["Enter", " "].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        if (!e.repeat) e.currentTarget.click();
      }
    },
    onKeyUp: release,
    onClick: (e) => {
      if (order.locked(id)) return;
      e.stopPropagation();
      order.remove(id, token);
    },
    style: {
      borderRadius: 4,
    },
  });
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragCancel={() => {
        setActiveWord(null);
        order.dragStart();
      }}
      onDragEnd={handleDragEnd}
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
            marginBottom: "10px",
            gap: "30px",
          }}
        >
          <ExerciseHeader
            isWorkbook
            sectionLetter="D"
            title={<>Look and write the question and answer.</>}
            subTitle={
              "Look at the job picture, form the What's their job? question, then complete the answer."
            }
          />

          <div>
            {exerciseData.map((q, index) => {
              const usedQ = droppedWords[`${q.id}-question`] || [];
              const usedA = droppedWords[`${q.id}-answer`] || [];
              return (
                <div key={q.id} className="space-y-4 flex mb-10">
                  <div className="flex items-start gap-4">
                    <span className="text-[22px] text-blue-900 font-semibold">
                      {index + 1}
                    </span>
                    <img
                      alt={IMAGE_DESCRIPTIONS[q.img]}
                      src={q.img}
                      className="max-h-32"
                      style={{
                        width: "150px",
                      }}
                    />
                  </div>

                  <div className="flex justify-around w-full items-center">
                    <div className="w-[40%]">
                      {/* Question Word Bank */}
                      <div className="flex flex-wrap gap-2 p-2 rounded">
                        {q.questionWords.map((word, i) => {
                          const id = `${q.id}-q-${i}|${word}`;
                          const isUsed = order.used(id);
                          return (
                            <DraggableWord
                              key={id}
                              id={id}
                              order={order}
                              q={questions.find(
                                (q) =>
                                  q.id ===
                                  id.split("-")[0] +
                                    "-" +
                                    (id.includes("-q-")
                                      ? "question"
                                      : "answer"),
                              )}
                              word={word}
                              disabled={isUsed || complete || order.revealed}
                              zoneType="question"
                            />
                          );
                        })}
                      </div>

                      {/* Question Drop */}
                      <div className="relative">
                        <DropZone
                          id={`${q.id}-question`}
                          order={order}
                          q={questions.find(
                            (item) => item.id === `${q.id}-question`,
                          )}
                          className={`flex flex-wrap gap-2 p-2 border-b-2 min-h-[40px]`}
                        >
                          {usedQ.map((word) => (
                            <button
                              key={word}
                              {...tokenProps(`${q.id}-question`, word)}
                              className={`${focusClass} hover:text-red-500`}
                            >
                              {extractText(word)}
                            </button>
                          ))}
                        </DropZone>

                        {isWrong(`${q.id}-question`, q.correctQuestion) && (
                          <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            ✕
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="w-[40%]">
                      {/* Answer Word Bank */}
                      <div className="flex flex-wrap gap-2 p-2 rounded">
                        {q.answerWords.map((word, i) => {
                          const id = `${q.id}-a-${i}|${word}`;
                          const isUsed = order.used(id);
                          return (
                            <DraggableWord
                              key={id}
                              id={id}
                              order={order}
                              q={questions.find(
                                (q) =>
                                  q.id ===
                                  id.split("-")[0] +
                                    "-" +
                                    (id.includes("-q-")
                                      ? "question"
                                      : "answer"),
                              )}
                              word={word}
                              disabled={isUsed || complete || order.revealed}
                              zoneType="answer"
                            />
                          );
                        })}
                      </div>

                      {/* Answer Drop */}
                      <div className="relative">
                        <DropZone
                          id={`${q.id}-answer`}
                          order={order}
                          q={questions.find(
                            (item) => item.id === `${q.id}-answer`,
                          )}
                          className={`flex flex-wrap gap-2 p-2 border-b-2 min-h-[40px]`}
                        >
                          {usedA.map((word) => (
                            <button
                              key={word}
                              {...tokenProps(`${q.id}-answer`, word)}
                              className={`${focusClass} hover:text-red-500 transition`}
                            >
                              {extractText(word)}
                            </button>
                          ))}
                        </DropZone>

                        {/* ❌ error */}
                        {isWrong(`${q.id}-answer`, q.correctAnswer) && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow border-2 border-white">
                            ✕
                          </div>
                        )}
                      </div>
                    </div>{" "}
                  </div>
                </div>
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

      {createPortal(
        <DragOverlay
          style={{
            zIndex: 2147483647,
          }}
        >
          {activeWord ? (
            <div
              style={{
                ...dragSize,
                boxSizing: "border-box",
                pointerEvents: "none",
              }}
              className="WB-word-bank bg-white shadow-xl"
            >
              {extractText(activeWord)}
            </div>
          ) : null}
        </DragOverlay>,
        document.fullscreenElement || document.body,
      )}
    </DndContext>
  );
};
export default WB_Unit4_Page22_Q2;

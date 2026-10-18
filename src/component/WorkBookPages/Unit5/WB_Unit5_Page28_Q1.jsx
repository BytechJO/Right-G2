/* eslint-disable react-refresh/only-export-components -- Keep exercise controls local. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 5/Page 28 - C/Item_001_Does_he_like_chicken.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 5/Page 28 - C/Item_002_No,_he_doesn't.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 5/Page 28 - C/Item_003_Does_she_like_fruit.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 5/Page 28 - C/Item_004_No,_she_doesn't.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 5/Page 28 - C/Item_005_Does_he_like_cheese.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 5/Page 28 - C/Item_006_Does_she_like_tea.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 5/Page 28 - C/Item_007_Yes,_she_does.mp3";
import React, { useState, useRef, useEffect } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page28/Ex C 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page28/Ex C 3.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page28/Ex C 2.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page28/Ex C 4.svg";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
const exerciseData = [
  {
    id: "q1",
    img: img1,
    correctQuestion: "Dose he like chicken?",
    correctAnswer: "No, he doesn't.",
    questionWords: ["Dose", "like", "chicken?", "he"],
    answerWords: ["No,", "doesn't.", "he"],
  },
  {
    id: "q2",
    img: img2,
    correctQuestion: "Dose she like fruit?",
    correctAnswer: "No, she doesn't.",
    questionWords: ["she", "Dose", "fruit?", "like"],
    answerWords: ["No,", "she", "doesn't."],
  },
  {
    id: "q3",
    img: img3,
    correctQuestion: "Dose he like cheese?",
    correctAnswer: "No, he doesn't",
    questionWords: ["cheese?", "like", "Dose", "he"],
    answerWords: ["No,", "doesn't", "he"],
  },
  {
    id: "q4",
    img: img4,
    correctQuestion: "Dose she like tea?",
    correctAnswer: "Yes, she does",
    questionWords: ["she", "Dose", "like", "tea?"],
    answerWords: ["Yes,", "does", "she"],
  },
];
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
  "does he like chicken": clip0,
  "no he doesn't": clip1,
  "does she like fruit": clip2,
  "no she doesn't": clip3,
  "does he like cheese": clip4,
  "does she like tea": clip5,
  "yes she does": clip6,
};
  // Match each question to its recording independently of the existing "Dose" spelling.
  const QUESTION_SOUNDS = {
    "q1-question": clip0,
    "q2-question": clip2,
    "q3-question": clip4,
    "q4-question": clip5,
  };
const normalized = (text) =>
  String(text)
    .toLowerCase()
    .replaceAll("’", "'")
    .replace(/[.,!?]/g, "")
    .trim()
    .replace(/\s+/g, " ");
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
function tokenProps(order, id, token) {
  return {
    role: "button",
    type: "button",
    tabIndex: order.picked ? -1 : 0,
    "aria-label": token.value + ". Return to bank.",
    "aria-disabled": order.locked(id),
    onClick: (e) => {
        if (order.locked(id)) return;
      e.stopPropagation();
      order.remove(id, token.id);
    },
    onKeyDown: (e) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        e.stopPropagation();
        if (!e.repeat && order.results[id] === "wrong")
          order.remove(id, token.id);
      } else activate(e);
    },
    onKeyUp: release,
    style: {
      borderRadius: 4,
    },
  };
}
const IMAGE_DESCRIPTIONS = {
  [img1]: "A boy seated at a table with a roast chicken.",
  [img2]: "A girl seated at a table with a bowl of fruit.",
  [img3]: "A boy seated at a table with a piece of cheese.",
  [img4]: "A girl seated in a chair holding a cup.",
};
const WB_Unit5_Page28_Q1 = () => {
  const questions = exerciseData.flatMap((q) => [
    {
      id: q.id + "-question",
      scrambled: q.questionWords.map((value, i) => ({
        id: q.id + "-q-" + i + "|" + value,
        value,
      })),
      correctSentence: q.correctQuestion,
      separator: " ",
    },
    {
      id: q.id + "-answer",
      scrambled: q.answerWords.map((value, i) => ({
        id: q.id + "-a-" + i + "|" + value,
        value,
      })),
      correctSentence: q.correctAnswer,
      separator: " ",
    },
  ]);
  const order = useTokenOrder(questions, {});
  const { rootRef, message, playingKey, playSound } = order;
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
  const handleShowAnswer = order.show,
    handleStartAgain = order.reset;
  const droppedWords = Object.fromEntries(
    questions.map((q) => [q.id, order.inputs[q.id].map((t) => t.id)]),
  );
  const extractText = (id) => id.split("|")[1];
  const isWrong = (id) => order.results[id] === "wrong";
  const getZoneClass = (id) =>
    order.results[id] === "correct"
      ? "border-green-600"
      : order.results[id] === "wrong"
        ? "border-red-500"
        : "border-gray-400";
  const propsForBank = (id, word) => {
    const q = questions.find((q) => q.id === id);
    const t = order.tokens(q).find((t) => t.id === word);
    return {
      ...order.bankProps(q, t),
      ref: (el) => {
        order.bankRefs.current[t.id] = el;
      },
      onClick: () => order.place(id, t.id),
      style: {
        position: "relative",
        borderRadius: 8,
        ...(order.picked?.token === t.id
          ? {
              outline: "3px solid #2563eb",
              outlineOffset: 2,
              backgroundColor: "#dbeafe",
            }
          : {}),
      },
    };
  };
  const propsForSlot = (id) => {
    const q = questions.find((q) => q.id === id),
        props = order.slotProps(q),
        src = QUESTION_SOUNDS[id] || soundFor(q.correctSentence);
      if (order.locked(id) && src) {
      const hear = () =>
          playSound("sentence-" + id, src);
      props.onClick = hear;
      props.onKeyDown = (e) => {
        if (["Enter", " "].includes(e.key)) {
          e.preventDefault();
          e.stopPropagation();
          if (!e.repeat) hear();
        }
      };
    }
    return {
      ...props,
      ref: (el) => {
        order.slotRefs.current[id] = el;
      },
      style: {
        ...props.style,
        ...(playingKey === "sentence-" + id
          ? {
              outline: "3px solid #2563eb",
              borderRadius: 4,
              backgroundColor: "#dbeafe",
            }
          : {}),
      },
    };
  };
  return (
    <div ref={rootRef} className="main-container-component">
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
          marginBottom: "50px",
          gap: "35px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="C"
          title={<> Look, read, and write.</>}
          subTitle={"Look at each food picture, form the likes/doesn't like question, then write the matching answer."}
        />

        <div className="space-y-5">
          {exerciseData.map((q, index) => {
            const usedQ = droppedWords[`${q.id}-question`] || [];
            const usedA = droppedWords[`${q.id}-answer`] || [];
            return (
              <div key={q.id} className="space-y-4 flex items-center">
                <div className="flex items-start gap-4">
                  <span className="text-xl text-blue-900 font-semibold">
                    {index + 1}
                  </span>
                  <img
                    src={q.img}
                    style={{
                      height: "100px",
                    }}
                    alt={IMAGE_DESCRIPTIONS[q.img]}
                  />
                </div>
                <div className="flex w-full justify-around">
                  <div>
                    {/* Question Word Bank */}
                    <div className="flex flex-wrap gap-2 p-2 rounded">
                      {q.questionWords.map((word, i) => {
                        const id = `${q.id}-q-${i}|${word}`;
                        const isUsed = usedQ.some((w) =>
                          w.startsWith(`${q.id}-q-${i}|`),
                        );
                        return (
                          <div
                            key={id}
                            {...propsForBank(`${q.id}-question`, id)}
                            className={`${focusClass} WB-word-bank 
          ${isUsed ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`}
                          >
                            {word}
                          </div>
                        );
                      })}
                    </div>

                    {/* Question Drop */}
                    <div className="relative">
                      <div
                        {...propsForSlot(`${q.id}-question`)}
                        className={`${focusClass} focus-visible:rounded-sm! flex flex-wrap gap-2 p-2 border-b-2 min-h-[40px] ${getZoneClass(`${q.id}-question`, q.correctQuestion)}`}
                      >
                        {playingKey === "sentence-" + q.id + "-question" && (
                          <SpeakerBadge />
                        )}
                        {usedQ.map((word) => (
                          <span
                            key={word}
                            {...tokenProps(order, `${q.id}-question`, {
                              id: word,
                              value: extractText(word),
                            })}
                            className={`${focusClass} cursor-pointer hover:text-red-500`}
                          >
                            {extractText(word)}
                          </span>
                        ))}
                      </div>

                      {isWrong(`${q.id}-question`, q.correctQuestion) && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                          ✕
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    {/* Answer Word Bank */}
                    <div className="flex flex-wrap gap-2 p-2 rounded">
                      {q.answerWords.map((word, i) => {
                        const id = `${q.id}-a-${i}|${word}`;
                        const isUsed = usedA.some((w) =>
                          w.startsWith(`${q.id}-a-${i}|`),
                        );
                        return (
                          <div
                            key={id}
                            {...propsForBank(`${q.id}-answer`, id)}
                            className={`${focusClass} WB-word-bank 
          ${isUsed ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`}
                          >
                            {word}
                          </div>
                        );
                      })}
                    </div>
                    {/* Answer Drop */}
                    <div className="relative">
                      <div
                        {...propsForSlot(`${q.id}-answer`)}
                        className={`${focusClass} focus-visible:rounded-sm! flex flex-wrap gap-2 p-2 border-b-2 min-h-[40px] ${getZoneClass(`${q.id}-answer`, q.correctAnswer)}`}
                      >
                        {playingKey === "sentence-" + q.id + "-answer" && (
                          <SpeakerBadge />
                        )}
                        {usedA.map((word) => (
                          <span
                            key={word}
                            {...tokenProps(order, `${q.id}-answer`, {
                              id: word,
                              value: extractText(word),
                            })}
                            className={`${focusClass} cursor-pointer hover:text-red-500`}
                          >
                            {extractText(word)}
                          </span>
                        ))}
                      </div>

                      {isWrong(`${q.id}-answer`, q.correctAnswer) && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                          ✕
                        </div>
                      )}
                    </div>
                  </div>
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
  );
};
export default WB_Unit5_Page28_Q1;

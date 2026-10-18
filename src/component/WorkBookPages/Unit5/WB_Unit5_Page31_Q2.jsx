/* eslint-disable react-refresh/only-export-components -- Keep exercise controls local. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";

import clip7 from "../../../assets/audio/WorkBook/Unit 5/Page 31 - J/Item_001_an_He_apple_wants.mp3";
import clip8 from "../../../assets/audio/WorkBook/Unit 5/Page 31 - J/Item_002_ice_wants_She_cream.mp3";
import clip9 from "../../../assets/audio/WorkBook/Unit 5/Page 31 - J/Item_003_She_tea_wants.mp3";
import React, { useState, useRef, useEffect } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
const SentenceBuilder = ({ q, order }) => {
  const availableWords = order.tokens(q).map((t) => ({
      id: t.id,
      text: t.value,
    })),
    chosenWords = order.inputs[q.id].map((t) => ({
      id: t.id,
      text: t.value,
    }));
  const isUsed = (id) => order.used(id),
    isIncorrectAnswer = () => order.results[q.id] === "wrong",
    getBoxClassName = () =>
      order.results[q.id] === "correct"
        ? "border-gray-300 bg-white"
        : "border-gray-300 bg-white";
  const bankProps = (word) => {
    const token = {
      id: word.id,
      value: word.text,
    };
    return {
      ...order.bankProps(q, token),
      ref: (el) => {
        order.bankRefs.current[word.id] = el;
      },
      onClick: () => {
        order.playSound("bank-" + word.id, soundFor(word.text));
        order.place(q.id, word.id);
      },
      style: {
        position: "relative",
        borderRadius: 8,
        ...(order.picked?.token === word.id
          ? {
              outline: "3px solid #2563eb",
              outlineOffset: 2,
              backgroundColor: "#dbeafe",
            }
          : {}),
      },
    };
  };
  const bankSource = soundFor(
    q.scrambled
      .map((t) => t.value)
      .join(" ")
      .replace(/\s+/g, " "),
  );
  const groupProps = {
    role: "group",
    tabIndex: order.picked ? -1 : bankSource ? 0 : -1,
    "aria-label": "Hear the scrambled words for sentence " + q.id,
    onClick: (e) => {
      if (e.target === e.currentTarget)
        order.playSound("group-" + q.id, bankSource);
    },
    onKeyDown: (e) => {
      if (e.target === e.currentTarget && ["Enter", " "].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        if (!e.repeat) order.playSound("group-" + q.id, bankSource);
      }
    },
    onKeyUp: release,
    style: {
      position: "relative",
      ...(order.playingKey === "group-" + q.id
        ? {
            outline: "3px solid #2563eb",
            outlineOffset: 2,
            backgroundColor: "#dbeafe",
          }
        : {}),
    },
  };
  return (
    <div className="space-y-3">
      {/* WORD BANK */}{" "}
      <div
        {...groupProps}
        className={`${focusClass} flex flex-wrap gap-2 p-3 rounded-lg min-h-[50px] items-center`}
      >
        {order.playingKey === "group-" + q.id && <SpeakerBadge />}
        {availableWords.map((word) => {
          const used = isUsed(word.id);
          return (
            <button
              key={word.id}
              {...bankProps(word)}
              className={`${focusClass} WB-word-bank 
            ${used ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60" : "bg-white border-blue-900 hover:bg-blue-100 cursor-pointer"}`}
            >
              {word.text}
              {order.playingKey === "bank-" + word.id && <SpeakerBadge />}
            </button>
          );
        })}
      </div>
      {/* ANSWER */}
      <div className="relative">
        <div
          {...order.slotProps(q)}
          ref={(el) => {
            order.slotRefs.current[q.id] = el;
          }}
          style={{
            ...order.slotProps(q).style,
            borderRadius: 8,
            borderColor: undefined,
            borderBottomColor:
              order.results[q.id] === "correct"
                ? "#16a34a"
                : order.results[q.id] === "wrong"
                  ? "#ef4444"
                  : undefined,
          }}
          className={`${focusClass} flex flex-wrap gap-2 p-3 text-lg border-2 rounded-lg min-h-[60px] ${getBoxClassName()} ${isIncorrectAnswer() && "border-red-500"}`}
        >
          {chosenWords.map((word) => (
            <button
              key={word.id}
              {...tokenProps(order, q.id, {
                id: word.id,
                value: word.text,
              })}
              className={`${focusClass} px-1 py-1 rounded-md cursor-pointer hover:text-red-500`}
            >
              {word.text}
            </button>
          ))}
        </div>

        {isIncorrectAnswer() && (
          <div className="absolute top-1/2 right-3 -translate-y-1/2 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shadow-md border-2 border-white">
            <span className="text-white text-sm font-bold">✕</span>
          </div>
        )}
      </div>
    </div>
  );
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
  "an he apple wants": clip7,
  "ice wants she cream": clip8,
  "she tea wants": clip9,
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
const WB_Unit5_Page31_Q2 = () => {
  const exerciseSentences = [
    {
      id: "s0",
      scrambled: "an He apple . wants",
      correct: "He wants an apple .",
    },
    {
      id: "s1",
      scrambled: "ice . wants She cream",
      correct: "She wants ice cream .",
    },
    {
      id: "s2",
      scrambled: "She tea . wants",
      correct: "She wants tea .",
    },
    {
      id: "s3",
      scrambled: "wants . yogurt He",
      correct: "He wants yogurt .",
    },
  ];
  const questions = exerciseSentences.map((q) => ({
    id: q.id,
    scrambled: q.scrambled.split(" ").map((value, i) => ({
      id: q.id + "-word-" + i,
      value,
    })),
    correctSentence: q.correct,
    separator: " ",
  }));
  const order = useTokenOrder(questions, SOUNDS);
  const { rootRef, message } = order;
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
        className="div-forall mb-10"
        style={{
          gap: "15px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="J"
          title={<>Unscramble and write.</>}
          subTitle={
            "Say the correct food preferences word or sentence first, then rearrange the pieces into that order."
          }
        />

        <div>
          {exerciseSentences.map((sentence, index) => (
            <div
              key={sentence.id}
              className="flex items-start gap-4 p-4 rounded-xl transition-all hover:bg-gray-50"
            >
              <span className="font-bold text-blue-900 text-xl pt-4">
                {index + 1}.
              </span>
              <div className="flex-1">
                <SentenceBuilder
                  q={questions.find((q) => q.id === sentence.id)}
                  order={order}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Button
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={handleStartAgain}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
};
export default WB_Unit5_Page31_Q2;

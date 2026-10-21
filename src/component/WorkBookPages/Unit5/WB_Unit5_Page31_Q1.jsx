/* eslint-disable react-refresh/only-export-components -- Keep exercise controls local. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 5/Page 31 - I/Item_001_likes.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 5/Page 31 - I/Item_002_doesn't_like.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 5/Page 31 - I/Item_003_She.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 5/Page 31 - I/Item_004_He.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 5/Page 31 - I/Item_005_cheese.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 5/Page 31 - I/Item_006_cake.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 5/Page 31 - I/Item_007_yogurt.mp3";
// ExerciseI.jsx  —  Look, Read and Circle

import React, { useState, useRef, useEffect } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 31/Ex I 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 31/Ex I 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 31/Ex I 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 31/Ex I 4.svg";
const questions = [
  {
    id: 1,
    src: img1,
    subject: "She",
    food: "cheese",
    correct: "likes",
  },
  {
    id: 2,
    src: img2,
    subject: "He",
    food: "cake",
    correct: "doesn't like",
  },
  {
    id: 3,
    src: img3,
    subject: "She",
    food: "yogurt",
    correct: "doesn't like",
  },
  {
    id: 4,
    src: img4,
    subject: "She",
    food: "pizza",
    correct: "likes",
  },
];
const correctAnswers = {
  1: "likes",
  2: "likes",
  3: "doesn't like",
  4: "likes",
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
  likes: clip0,
  "doesn't like": clip1,
  she: clip2,
  he: clip3,
  cheese: clip4,
  cake: clip5,
  yogurt: clip6,
};
const normalized = (text) =>
  String(text)
    .toLowerCase()
    .replaceAll("’", "'")
    .replace(/[.,!?]/g, "")
    .trim()
    .replace(/\s+/g, " ");
const soundFor = (text) => SOUNDS[normalized(text)];
function useAnswers(correct, options = {}) {
  const audio = useExerciseAudio();
  const [values, setValues] = useState({}),
    [results, setResults] = useState({}),
    [revealed, setRevealed] = useState(false),
    [message, setMessage] = useState("");
  const ids = Object.keys(correct),
    complete = ids.every((id) => results[id] === "correct");
  useCheckButton(audio.rootRef, complete || revealed);
  const locked = (id) => revealed || results[id] === "correct";
  const chosen = (id, value) =>
    Array.isArray(correct[id])
      ? (values[id] || []).includes(value)
      : values[id] === value;
  const choose = (id, value) => {
    if (locked(id)) return;
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
    if (complete || revealed) return;
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
      choose(id, value);
    },
    style: {
      position: "relative",
      ...resultStyle(id, value),
    },
  });
  const nativeProps = (id) => ({
    "aria-label": "Answer " + id + (locked(id) ? ". Correct and locked." : ""),
    disabled: locked(id),
    value: values[id] ?? "",
    onChange: (e) => choose(id, e.target.value),
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
const IMAGE_DESCRIPTIONS = {
  [img1]: "A piece of cheese.",
  [img2]: "A cake with frosting and a cherry.",
  [img3]: "A woman with dark shoulder-length hair.",
  [img4]: "A smiling woman with short brown hair.",
};
export default function WB_Unit5_Page31_Q1() {
  const a = useAnswers(correctAnswers);
  const { rootRef, message, playingKey, playSound } = a;
  const handleShowAnswer = a.show,
    handleStartAgain = a.reset,
    checkAnswers = a.check;
  const answers = a.values;
  const isWrong = (id) => a.results[id] === "wrong";
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
          gap: "25px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="I"
          title={<>Look, read and circle.</>}
          subTitle={"Read the clue and look at the picture, then tap the food preferences answer you would circle."}
        />

        {/* Questions */}
        <div className="space-y-5">
          {questions.map((q) => {
            const selected = answers[q.id];
            return (
              <div
                key={q.id}
                className="flex items-center justify-between w-full gap-30 rounded-xl p-4 text-[20px]"
              >
                <div className="flex items-start">
                  {/* Number */}
                  <span className="font-bold w-5 shrink-0 text-xl text-blue-900">
                    {q.id}
                  </span>

                  <img
                    src={q.src}
                    className="object-contain "
                    style={{
                      height: "100px",
                      width: "250px",
                    }}
                    alt={IMAGE_DESCRIPTIONS[q.src]}
                  />
                </div>
                <div className="relative flex flex-wrap items-center gap-2 flex-1">
                  <span className="font-semibold text-gray-700">
                    <AudioText
                      audioKey={"subject-" + q.id}
                      src={soundFor(q.subject)}
                      playSound={playSound}
                      playingKey={playingKey}
                      className=""
                    >
                      {q.subject}
                    </AudioText>
                  </span>
                  <div className="flex flex-col gap-5">
                    <button
                      {...a.props(q.id, "likes", soundFor("likes"))}
                      style={{
                        ...a.props(q.id, "likes").style,
                        borderRadius: "9999px",
                      }}
                      className={`${focusClass} px-3 py-1 rounded-full font-semibold text-[18px] border-2
${selected === "likes" ? (isWrong(q.id) ? "border-red-500 text-black" : "border-blue-900 text-black") : "border-gray-300 hover:border-blue-900 text-gray-600"}`}
                    >
                      likes
                      {playingKey === "choice-" + q.id + "-" + "likes" && (
                        <SpeakerBadge />
                      )}
                    </button>

                    <button
                      {...a.props(
                        q.id,
                        "doesn't like",
                        soundFor("doesn't like"),
                      )}
                      style={{
                        ...a.props(q.id, "doesn't like").style,
                        borderRadius: "9999px",
                      }}
                      className={`${focusClass} px-3 py-1 rounded-full font-semibold text-[18px] border-2
${selected === "doesn't like" ? (isWrong(q.id) ? "border-red-500 text-black" : "border-blue-900 text-black") : "border-gray-300 hover:border-blue-900 text-gray-600"}`}
                    >
                      doesn't like
                      {playingKey ===
                        "choice-" + q.id + "-" + "doesn't like" && (
                        <SpeakerBadge />
                      )}
                    </button>
                  </div>
                  {isWrong(q.id) && (
                    <div className="absolute top-0 left-45 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow border-2 border-white">
                      ✕
                    </div>
                  )}
                  <span className="font-semibold text-gray-700">
                    <AudioText
                      audioKey={"food-" + q.id}
                      src={soundFor(q.food)}
                      playSound={playSound}
                      playingKey={playingKey}
                      className=""
                    >
                      {q.food}
                    </AudioText>
                    .
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <div className="mt-6">
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleStartAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
}

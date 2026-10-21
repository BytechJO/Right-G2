/* eslint-disable react-refresh/only-export-components -- Keep exercise controls local. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 5/Page 32 - A/Item_001_b.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 5/Page 32 - A/Item_002_f_t.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 5/Page 32 - A/Item_003_m_t.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 5/Page 32 - A/Item_004_t.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 5/Page 32 - A/Item_005_sl_p.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 5/Page 32 - A/Item_006_r_d.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 5/Page 32 - A/Item_007_ee.mp3";
import clip7 from "../../../assets/audio/WorkBook/Unit 5/Page 32 - A/Item_008_ea.mp3";
// ExerciseA.jsx

import React, { useState, useRef, useEffect } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex A 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex A 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex A 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex A 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex A 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex A 6.svg";
const questions = [
  {
    id: 1,
    src: img1,
    prefix: "b",
    suffix: "",
    blank: "ee",
    display: "b __ __",
    correct: "ee",
  },
  {
    id: 2,
    src: img2,
    prefix: "f",
    suffix: "t",
    blank: "ee",
    display: "f __ __ t",
    correct: "ee",
  },
  {
    id: 3,
    src: img3,
    prefix: "m",
    suffix: "t",
    blank: "ea",
    display: "m __ __ t",
    correct: "ea",
  },
  {
    id: 4,
    src: img4,
    prefix: "t",
    suffix: "",
    blank: "ea",
    display: "t __ __",
    correct: "ea",
  },
  {
    id: 5,
    src: img5,
    prefix: "sl",
    suffix: "p",
    blank: "ee",
    display: "sl __ __ p",
    correct: "ee",
  },
  {
    id: 6,
    src: img6,
    prefix: "r",
    suffix: "d",
    blank: "ea",
    display: "r __ __ d",
    correct: "ea",
  },
];
const correctAnswers = {
  1: "ee",
  2: "ee",
  3: "ea",
  4: "ea",
  5: "ee",
  6: "ea",
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
  b: clip0,
  "f t": clip1,
  "m t": clip2,
  t: clip3,
  "sl p": clip4,
  "r d": clip5,
  ee: clip6,
  ea: clip7,
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

//....
const IMAGE_DESCRIPTIONS = {
  [img1]: "A bee.",
  [img2]: "Two bare feet.",
  [img3]: "A plate of meat.",
  [img4]: "A steaming cup on a saucer.",
  [img5]: "A child asleep in a bed.",
  [img6]: "A child holding an open book.",
};
export default function WB_Unit5_Page32_Q1() {
  const a = useAnswers(correctAnswers);
  const { rootRef, message, playingKey, playSound } = a;
  const handleShowAnswer = a.show,
    handleStartAgain = a.reset,
    checkAnswers = a.check;
  const answers = a.values;
  const isIncorrect = (id) => a.results[id] === "wrong";
  const getBtnClass = (id, value) =>
    a.chosen(id, value)
      ? "px-3 py-1 rounded-lg border-2 border-blue-800"
      : "px-3 py-1 rounded-lg border-2 border-gray-300 text-gray-600 hover:border-blue-900 transition-all";
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
          sectionLetter="A"
          title={"Look and write ee or ea to complete the words."}
          subTitle={
            "Say each picture word, listen for the long-e sound, then add ee or ea."
          }
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
          {questions.map((q) => (
            <div
              key={q.id}
              className="relative flex flex-col items-center gap-2 rounded-xl p-4"
            >
              {isIncorrect(q.id) && (
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shadow-md border-2 border-white">
                  <span className="text-white text-sm font-bold">✕</span>
                </div>
              )}
              <div className="flex gap-4">
                <p className="text-xl text-blue-900 font-bold">{q.id}</p>
                <img
                  src={q.src}
                  style={{
                    height: "100px",
                    width: "120px",
                  }}
                  alt={IMAGE_DESCRIPTIONS[q.src]}
                />
              </div>
              <p
                role="button"
                tabIndex={0}
                aria-label={"Question " + q.id + ". Hear the word."}
                onClick={() =>
                  playSound(
                    "word-" + q.id,
                    soundFor((q.prefix + " " + q.suffix).trim()),
                  )
                }
                onKeyDown={activate}
                onKeyUp={release}
                style={{
                  position: "relative",
                  borderRadius: 4,
                  ...(playingKey === "word-" + q.id
                    ? {
                        outline: "3px solid #2563eb",
                        outlineOffset: 2,
                        backgroundColor: "#dbeafe",
                      }
                    : {}),
                }}
                className={`${focusClass} text-2xl font-bold text-gray-700 tracking-widest`}
              >
                {q.prefix}
                <span
                  className={`mx-1 px-1 rounded ${answers[q.id] ? "text-blue-800" : "text-gray-300"}`}
                >
                  {answers[q.id] || "__"}
                </span>
                {q.suffix}
                {playingKey === "word-" + q.id && <SpeakerBadge />}
              </p>

              {/* Choice buttons */}
              <div className="flex gap-2">
                {["ee", "ea"].map((opt) => (
                  <button
                    key={opt}
                    {...a.props(q.id, opt, soundFor(opt))}
                    style={{
                      ...a.props(q.id, opt).style,
                      borderRadius: 8,
                    }}
                    className={`${focusClass} ${getBtnClass(q.id, opt)} text-lg text-blue-800 font-bold`}
                  >
                    {opt}
                    {playingKey === "choice-" + q.id + "-" + opt && (
                      <SpeakerBadge />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Button
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={handleStartAgain}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
}

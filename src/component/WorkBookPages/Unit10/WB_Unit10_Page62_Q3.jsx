/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 62/SVG/Asset 13.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 62/SVG/Asset 14.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 62/SVG/Asset 15.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 62/SVG/Asset 16.svg";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import sound from "../../../assets/audio/WorkBook/p62q3.mp3";
import { useState, useRef, useEffect } from "react";
import ExerciseHeader from "../../ExerciseHeader";
import ValidationAlert from "../../Popup/ValidationAlert";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 10/Page 62 - C/Item_001_seal_sell.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 10/Page 62 - C/Item_002_ben_bean.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 10/Page 62 - C/Item_003_seat_set.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 10/Page 62 - C/Item_004_teen_ten.mp3";
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
  "seal sell": clip0,
  "ben bean": clip1,
  "seat set": clip2,
  "teen ten": clip3,
};
const soundFor = (text) => SOUNDS[normalized(text)];
const IMAGE_DESCRIPTIONS = {
  [img1]: "A brown sea animal with flippers.",
  [img2]: "A green pod and several seeds.",
  [img3]: "A boy sitting on a chair.",
  [img4]: "Two large digits, one and zero.",
};
const questions = [
  {
    id: 1,
    emoji: img1,
    options: ["seal", "sell"],
    correct: "seal",
  },
  {
    id: 2,
    emoji: img2,
    options: ["ben", "bean"],
    correct: "bean",
  },
  {
    id: 3,
    emoji: img3,
    options: ["seat", "set"],
    correct: "seat",
  },
  {
    id: 4,
    emoji: img4,
    options: ["teen", "ten"],
    correct: "ten",
  },
];
const correctAnswers = {
  1: "seal",
  2: "bean",
  3: "seat",
  4: "ten",
};
function WB_Unit10_Page62_Q3() {
  const captions = [
    {
      start: 0.56,
      end: 3.52,
      text: "Page 62, phonics exercise C.",
    },
    {
      start: 4.7,
      end: 7.62,
      text: "Listen, look, and circle the correct word.",
    },
    {
      start: 8.62,
      end: 10.8,
      text: "1.seal.",
    },
    {
      start: 11.1,
      end: 13.6,
      text: "2.bean.",
    },
    {
      start: 14.6,
      end: 16.3,
      text: "3.seat.",
    },
    {
      start: 16.9,
      end: 18.66,
      text: " 4.ten.",
    },
  ];
  const a = useAnswers(correctAnswers);
  const { rootRef, message, playingKey } = a;
  const answers = a.values;
  const checkAnswers = a.check,
    handleShowAnswer = a.show,
    handleStartAgain = a.reset;
  const getCircleClass = (id, value) =>
    "px-2 py-2 rounded-full border-2 text-xl font-bold transition-all cursor-pointer select-none " +
    (!a.chosen(id, value)
      ? "border-transparent text-gray-600 hover:border-blue-900"
      : a.results[id] === "wrong"
        ? "border-red-500"
        : a.results[id] === "correct"
          ? "border-green-600 text-blue-900"
          : "border-blue-900 text-blue-900");
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
          gap: "45px",
        }}
      >
        {" "}
        <ExerciseHeader
          isWorkbook
          sectionLetter="C"
          title={<>Listen, look, and circle the correct word.</>}
          subTitle={
            "Listen to each item, compare the two printed words, then circle the word you actually hear."
          }
        />
        <QuestionAudioPlayer
          src={sound}
          captions={captions}
          stopAtSecond={7.8}
          pageId="wb_unit10_page62_q3"
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {questions.map((q) => (
            <div
              key={q.id}
              className="relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-gray-300"
            >
              {/* ❌ Wrong Answer */}
              {!!a.results[q.id] &&
                answers[q.id] &&
                answers[q.id] !== correctAnswers[q.id] && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow">
                    ✕
                  </div>
                )}

              <span className="text-lg font-bold text-blue-800 self-start">
                {q.id}
              </span>
              <img
                src={q.emoji}
                style={{
                  height: "100px",
                }}
                alt={
                  IMAGE_DESCRIPTIONS[q.emoji] ||
                  "Illustration for this question"
                }
              />

              {/* Words with circle effect */}
              <div
                className={
                  "flex gap-1 items-center flex-wrap justify-center" +
                  " " +
                  focusClass
                }
                role="group"
                tabIndex={0}
                aria-label={
                  "Hear both words: " +
                  q.options.join(", ") +
                  ". Press Enter or Space."
                }
                onClick={(e) => {
                  if (!e.target.closest("button,select"))
                    a.playSound("pair-" + q.id, soundFor(q.options.join(" ")));
                }}
                onKeyDown={(e) => {
                  if (e.target === e.currentTarget) activate(e);
                }}
                onKeyUp={(e) => {
                  if (e.target === e.currentTarget) release(e);
                }}
                style={{
                  ...{},
                  position: "relative",
                  borderRadius: 8,
                  ...(playingKey === "pair-" + q.id
                    ? {
                        boxShadow: "0 0 0 3px #2563eb",
                        backgroundColor: "#dbeafe",
                      }
                    : {}),
                }}
              >
                {q.options.map((opt, idx) => (
                  <span key={opt} className="flex items-center gap-1">
                    <button
                      className={getCircleClass(q.id, opt) + " " + focusClass}
                      type="button"
                      {...a.props(q.id, opt, soundFor(opt), opt)}
                    >
                      {opt}
                      <>
                        {playingKey === "choice-" + q.id + "-" + opt && (
                          <SpeakerBadge />
                        )}
                      </>
                    </button>
                    {idx < q.options.length - 1 && (
                      <span className="text-gray-400 text-sm">/</span>
                    )}
                  </span>
                ))}
                <>{playingKey === "pair-" + q.id && <SpeakerBadge />}</>
              </div>
            </div>
          ))}
        </div>
        <Button
          handleStartAgain={handleStartAgain}
          checkAnswers={checkAnswers}
          handleShowAnswer={handleShowAnswer}
        />
      </div>
    </div>
  );
}
export default WB_Unit10_Page62_Q3;

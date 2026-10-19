/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 62/SVG/Asset 9.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 62/SVG/Asset 10.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 62/SVG/Asset 11.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 62/SVG/Asset 12.svg";
import { useState, useRef, useEffect } from "react";
import ExerciseHeader from "../../ExerciseHeader";
import ValidationAlert from "../../Popup/ValidationAlert";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 10/Page 62 - B/Item_001_d_sk.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 10/Page 62 - B/Item_002_gr_n.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 10/Page 62 - B/Item_003_p_n.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 10/Page 62 - B/Item_004_r_d.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 10/Page 62 - B/Item_005_e.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 10/Page 62 - B/Item_006_ee.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 10/Page 62 - B/Item_007_ea.mp3";
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
  "d sk": clip0,
  "gr n": clip1,
  "p n": clip2,
  "r d": clip3,
  e: clip4,
  ee: clip5,
  ea: clip6,
};
const soundFor = (text) => SOUNDS[normalized(text)];
const IMAGE_DESCRIPTIONS = {
  [img1]: "A desk with an attached seat.",
  [img2]: "A bottle with a green spill.",
  [img3]: "A red pen.",
  [img4]: "A child holding an open book.",
};
const questions = [
  {
    id: 1,
    emoji: img1,
    parts: ["d", "sk"],
    options: ["e", "ee", "ea"],
    correct: "e",
  },
  {
    id: 2,
    emoji: img2,
    parts: ["gr", "n"],
    options: ["e", "ee", "ea"],
    correct: "ee",
  },
  {
    id: 3,
    emoji: img3,
    parts: ["p", "n"],
    options: ["e", "ee", "ea"],
    correct: "e",
  },
  {
    id: 4,
    emoji: img4,
    parts: ["r", "d"],
    options: ["e", "ee", "ea"],
    correct: "ea",
  },
];
const correctAnswers = {
  1: "e",
  2: "ee",
  3: "e",
  4: "ea",
};
function WB_Unit10_Page62_Q2() {
  const a = useAnswers(correctAnswers);
  const { rootRef, message, playingKey } = a;
  const answers = a.values;
  const checkAnswers = a.check,
    handleShowAnswer = a.show,
    handleStartAgain = a.reset;
  const getCardClass = (id) =>
    "relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-gray-300 transition-all duration-300 " +
    (a.results[id] === "correct"
      ? "border-green-600"
      : a.results[id] === "wrong"
        ? "border-red-500"
        : "border-blue-900");
  const getOptClass = (id, value) =>
    "px-3 py-1 rounded-lg border-2 text-lg font-bold transition-all cursor-pointer " +
    (a.chosen(id, value)
      ? a.results[id] === "wrong"
        ? "border-red-500"
        : a.results[id] === "correct"
          ? "border-green-600 bg-blue-100 text-blue-900"
          : "border-blue-900"
      : "border-gray-300 hover:border-blue-900");
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
          gap: "90px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="B"
          title={<>Look and write the missing letters.</>}
          subTitle={
            "Say desk, green, pen, and read, then choose e, ee, or ea to complete each word."
          }
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 w-full">
          {questions.map((q) => (
            <div key={q.id} className={`${getCardClass(q.id)} w-full`}>
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
                className="max-w-45 max-h-30"
                alt={
                  IMAGE_DESCRIPTIONS[q.emoji] ||
                  "Illustration for this question"
                }
              />

              {/* Word */}
              <p
                className={
                  "text-xl font-bold text-gray-700 tracking-wide" +
                  " " +
                  focusClass
                }
                role="group"
                tabIndex={0}
                aria-label={"Hear the missing-letter word for question " + q.id}
                onClick={(e) => {
                  if (!e.target.closest("button,select"))
                    a.playSound("word-" + q.id, soundFor(q.parts.join(" ")));
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
                  ...(playingKey === "word-" + q.id
                    ? {
                        boxShadow: "0 0 0 3px #2563eb",
                        backgroundColor: "#dbeafe",
                      }
                    : {}),
                }}
              >
                {q.parts[0]}
                <span className="mx-1 px-1 rounded font-bold text-blue-600">
                  {answers[q.id] || "__"}
                </span>
                {q.parts[1]}
                <>{playingKey === "word-" + q.id && <SpeakerBadge />}</>
              </p>

              {/* Options */}

              <div className="flex gap-1 flex-wrap justify-center">
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    className={getOptClass(q.id, opt) + " " + focusClass}
                    type="button"
                    {...a.props(q.id, opt, soundFor(opt), opt)}
                    onClick={() => {
                      const src = soundFor(opt);
                      if (src) a.playSound("choice-" + q.id + "-" + opt, src);
                      if (!a.locked(q.id))
                        a.choose(q.id, a.chosen(q.id, opt) ? undefined : opt);
                    }}
                  >
                    {opt}
                    <>
                      {playingKey === "choice-" + q.id + "-" + opt && (
                        <SpeakerBadge />
                      )}
                    </>
                  </button>
                ))}
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
export default WB_Unit10_Page62_Q2;

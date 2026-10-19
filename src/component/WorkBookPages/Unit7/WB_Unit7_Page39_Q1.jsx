/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 7/Page 39 - A/Item_001_It's_a_quarter_to_nine.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 7/Page 39 - A/Item_002_It's_a_quarter_past_two_in_the_afternoon.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 7/Page 39 - A/Item_003_It's_six_o'clock_in_the_morning.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 7/Page 39 - A/Item_004_It's_half_past_ten_in_the_morning.mp3";
import React, { useState, useRef, useEffect } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 39/Ex A 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 39/Ex A 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 39/Ex A 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 39/Ex A 4.svg";
const IMAGE_DESCRIPTIONS = {
  [img1]: "An analogue clock.",
  [img2]: "An analogue clock.",
  [img3]: "An analogue clock.",
  [img4]: "An analogue clock.",
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
  "it's a quarter to nine": clip0,
  "it's a quarter past two in the afternoon": clip1,
  "it's six o'clock in the morning": clip2,
  "it's half past ten in the morning": clip3,
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
    onChange: (e) => {
      const value = options.numeric ? Number(e.target.value) : e.target.value;
      choose(id, value);
      const src = soundFor(value);
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
const exerciseDataK = {
  questions: [
    {
      id: "k1",
      text: "It's a quarter to nine.",
      correctNumber: 2,
    },
    {
      id: "k2",
      text: "It's a quarter past two in the afternoon.",
      correctNumber: 3,
    },
    {
      id: "k3",
      text: "It's six o'clock in the morning.",
      correctNumber: 1,
    },
    {
      id: "k4",
      text: "It's half past ten in the morning.",
      correctNumber: 4,
    },
  ],
};
const images = [img1, img2, img3, img4];
export default function WB_Unit7_Page39_Q1() {
  const a = useAnswers(
    Object.fromEntries(
      exerciseDataK.questions.map((q) => [q.id, q.correctNumber]),
    ),
    {
      numeric: true,
    },
  );
  const { rootRef, message, playingKey, playSound } = a;
  const checkAnswers = a.check,
    handleShowAnswer = a.show,
    handleStartAgain = a.reset;
  const isWrongAnswer = (id) => a.results[id] === "wrong";
  const getSelectClass = () =>
    "cursor-pointer border-b-1 border-black px-3 py-2 font-semibold";
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
          gap: "35px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="A"
          title="Look and read. Write the number."
          subTitle={"Read each written time first, then match it to the digital or clock display."}
        />
        <div className="flex flex-col">
          {/* Images */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex flex-col items-center">
                <div className="w-40 h-40 flex items-center justify-center mb-2">
                  <img
                    src={images[num - 1]}
                    className="max-w-45 max-h-45 object-contain"
                    alt={
                      IMAGE_DESCRIPTIONS[images[num - 1]] ||
                      "Illustration for this exercise"
                    }
                  />
                </div>
                <span className="font-bold text-lg text-gray-700">{num}</span>
              </div>
            ))}
          </div>

          {/* Questions */}
          <div className="space-y-6 mb-8">
            {exerciseDataK.questions.map((question, idx) => (
              <div key={question.id} className="flex items-center gap-4">
                <span className="font-bold text-xl text-black">
                  {String.fromCharCode(97 + idx)}.
                </span>
                <div className="relative">
                  <select
                    className={
                      getSelectClass(question.id) +
                      " " +
                      focusClass +
                      " focus-visible:rounded-sm!"
                    }
                    {...a.nativeProps(question.id)}
                  >
                    <option value="">Select a number</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>

                  {isWrongAnswer(question.id) && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-md z-10 border-2 border-white">
                      <span className="text-white text-xs font-bold leading-none">
                        ✕
                      </span>
                    </div>
                  )}
                  {playingKey === "answer-" + question.id && <SpeakerBadge />}
                </div>
                <p className="text-xl text-gray-900 flex-1">
                  <AudioText
                    audioKey={"question-" + question.id}
                    src={soundFor(question.text)}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    {question.text}
                  </AudioText>
                </p>
              </div>
            ))}
          </div>
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

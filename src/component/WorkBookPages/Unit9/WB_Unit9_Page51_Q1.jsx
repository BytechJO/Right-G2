/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */

import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 51/Ex A 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 51/Ex A 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 51/Ex A 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 51/Ex A 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 51/Ex A 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 51/Ex A 6.svg";
import img7 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 51/Ex A 7.svg";
import trueIcon from "../../../assets/imgs/true.svg";
import falseIcon from "../../../assets/imgs/false.svg";
import { useState, useRef, useEffect } from "react";
import ExerciseHeader from "../../ExerciseHeader";
import ValidationAlert from "../../Popup/ValidationAlert";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 9/Page 51 - A/Item_001_Mom_is_cooking.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 9/Page 51 - A/Item_002_Grandpa_is_listening_to_the_radio.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 9/Page 51 - A/Item_003_They_are_watching_TV.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 9/Page 51 - A/Item_004_She_is_eating_an_apple.mp3";
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
      position: "relative",
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
  "mom is cooking": clip0,
  "grandpa is listening to the radio": clip1,
  "they are watching tv": clip2,
  "she is eating an apple": clip3,
};
const soundFor = (text) => SOUNDS[normalized(text)];
const IMAGE_DESCRIPTIONS = {
  [img1]: "A woman ironing a pink garment.",
  [img2]: "An older man reading a book in a chair.",
  [img3]: "Two adults and two children facing a television.",
  [img4]: "A girl holding an apple near her mouth.",
  [img5]: "Two children writing at a desk.",
  [img6]: "A girl using a laptop at a desk.",
  [img7]: "Three hens pecking scattered kernels.",
};
const exerciseQuestions = [
  {
    id: "q1",
    text: "Mom is cooking.",
    img: img1,
    correctAnswer: false,
  },
  {
    id: "q2",
    text: "Grandpa is listening to the radio.",
    img: img2,
    correctAnswer: false,
  },
  {
    id: "q3",
    text: "They are watching TV.",
    img: img3,
    correctAnswer: true,
  },
  {
    id: "q4",
    text: "She is eating an apple.",
    img: img4,
    correctAnswer: true,
  },
  {
    id: "q5",
    text: "They aren’t studying.",
    img: img5,
    correctAnswer: true,
  },
  {
    id: "q6",
    text: "Helen is working on the computer.",
    img: img6,
    correctAnswer: true,
  },
  {
    id: "q7",
    text: "They aren’t eating corn.",
    img: img7,
    correctAnswer: false,
  },
];
const WB_Unit9_Page51_Q1 = () => {
  const a = useAnswers(
    Object.fromEntries(exerciseQuestions.map((q) => [q.id, q.correctAnswer])),
  );
  const { rootRef, message, playingKey, playSound } = a;
  const userAnswers = a.values;
  const checkAnswers = a.check,
    handleShowAnswer = a.show,
    handleStartAgain = a.reset;
  const getCheckboxClass = (id, value) =>
    a.chosen(id, value)
      ? a.results[id] === "wrong"
        ? "border-red-500"
        : a.results[id] === "correct"
          ? "border-green-600"
          : "border-blue-900"
      : "border-gray-300 bg-white hover:border-blue-900";
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
          marginBottom: "10px",
          gap: "20px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="A"
          title={"Look, read, and write ✓ or ✗."}
          subTitle={
            "Compare each statement with the picture or text before choosing Check, X, True, or False."
          }
        />

        <div>
          {exerciseQuestions.map((question, index) => (
            <div
              key={question.id}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-x-6 p-3 rounded-lg hover:bg-gray-50"
            >
              <img
                src={question.img}
                className="object-contain"
                style={{
                  height: "100px",
                  width: "auto",
                }}
                alt={
                  IMAGE_DESCRIPTIONS[question.img] ||
                  "Illustration for this question"
                }
              />

              <div className="flex items-center gap-3">
                <span className="font-bold text-blue-900 text-[22px]">
                  {index + 1}
                </span>
                <p className="text-[20px] text-gray-800">
                  <AudioText
                    audioKey={"question-" + question.id}
                    src={soundFor(question.text)}
                    playSound={playSound}
                    playingKey={playingKey}
                    tabIndex={a.picked ? -1 : 0}
                  >
                    {question.text}
                  </AudioText>
                </p>
              </div>

              <div className="flex items-center gap-x-4">
                <div className="flex flex-col items-center">
                  {index === 0 && (
                    <span className="font-semibold text-blue-800 mb-1 text-2xl">
                      <img
                        src={trueIcon}
                        style={{
                          height: "25px",
                        }}
                        alt=""
                        aria-hidden="true"
                      />
                    </span>
                  )}

                  <div className="relative">
                    <button
                      className={
                        `w-[45px] h-[45px] border-2 rounded-md cursor-pointer flex items-center justify-center transition-all ${getCheckboxClass(question.id, true)}` +
                        " " +
                        focusClass
                      }
                      {...a.props(
                        question.id,
                        true,
                        soundFor(String(true)),
                        question.text + " " + "True",
                      )}
                      type="button"
                    >
                      {userAnswers[question.id] === true && (
                        <span className="text-2xl text-blue-600">
                          {" "}
                          <img
                            src={trueIcon}
                            style={{
                              height: "25px",
                            }}
                            alt=""
                            aria-hidden="true"
                          />
                        </span>
                      )}
                      <>
                        {playingKey ===
                          "choice-" + question.id + "-" + true && (
                          <SpeakerBadge />
                        )}
                      </>
                    </button>

                    {/* ❌ */}
                    {!!a.results[question.id] &&
                      userAnswers[question.id] === true &&
                      exerciseQuestions.find((q) => q.id === question.id)
                        .correctAnswer !== true && (
                        <span className="absolute -top-2 -right-2 text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold border-2 border-white shadow">
                          ✕
                        </span>
                      )}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  {index === 0 && (
                    <span className="font-semibold text-blue-800 mb-1 text-2xl">
                      <img
                        src={falseIcon}
                        style={{
                          height: "25px",
                        }}
                        alt=""
                        aria-hidden="true"
                      />
                    </span>
                  )}

                  <div className="relative">
                    <button
                      className={
                        `w-[45px] h-[45px] border-2 rounded-md cursor-pointer flex items-center justify-center transition-all ${getCheckboxClass(question.id, false)}` +
                        " " +
                        focusClass
                      }
                      {...a.props(
                        question.id,
                        false,
                        soundFor(String(false)),
                        question.text + " " + "False",
                      )}
                      type="button"
                    >
                      {userAnswers[question.id] === false && (
                        <span className="text-2xl text-blue-600">
                          {" "}
                          <img
                            src={falseIcon}
                            style={{
                              height: "25px",
                            }}
                            alt=""
                            aria-hidden="true"
                          />
                        </span>
                      )}
                      <>
                        {playingKey ===
                          "choice-" + question.id + "-" + false && (
                          <SpeakerBadge />
                        )}
                      </>
                    </button>

                    {/* ❌ */}
                    {!!a.results[question.id] &&
                      userAnswers[question.id] === false &&
                      exerciseQuestions.find((q) => q.id === question.id)
                        .correctAnswer !== false && (
                        <span className="absolute -top-2 -right-2 text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold border-2 border-white shadow">
                          ✕
                        </span>
                      )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleStartAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};
export default WB_Unit9_Page51_Q1;

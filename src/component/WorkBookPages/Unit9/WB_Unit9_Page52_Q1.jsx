/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import img from "../../../assets/imgs/test6.png";
import Button from "../Button";
import trueIcon from "../../../assets/imgs/true.svg";
import { useState, useRef, useEffect } from "react";
import ExerciseHeader from "../../ExerciseHeader";
import ValidationAlert from "../../Popup/ValidationAlert";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 9/Page 52 - C/Item_001_My_mom_is_listening_to_the_radio_in_her_bedroom._Dad_is_on_the_computer.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 9/Page 52 - C/Item_002_True.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 9/Page 52 - C/Item_003_False.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 9/Page 52 - C/Item_004_Dad_is_listening_to_the_radio.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 9/Page 52 - C/Item_005_My_brother_is_playing_chess.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 9/Page 52 - C/Item_006_Mom_is_cooking_dinner.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 9/Page 52 - C/Item_007_My_little_sister_is_looking_for_her_doll.mp3";
import clip7 from "../../../assets/audio/WorkBook/Unit 9/Page 52 - C/Item_008_I'm_ironing_clothes.mp3";
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
  "my mom is listening to the radio in her bedroom dad is on the computer":
    clip0,
  true: clip1,
  false: clip2,
  "dad is listening to the radio": clip3,
  "my brother is playing chess": clip4,
  "mom is cooking dinner": clip5,
  "my little sister is looking for her doll": clip6,
  "i'm ironing clothes": clip7,
};
const soundFor = (text) => SOUNDS[normalized(text)];
const exerciseQuestions = [
  {
    id: "q1",
    text: "Dad is listening to the radio.",
    img: img,
    correctAnswer: false,
  },
  {
    id: "q2",
    text: "My brother is playing chess.",
    img: img,
    correctAnswer: false,
  },
  {
    id: "q3",
    text: "Mom is cooking dinner.",
    img: img,
    correctAnswer: false,
  },
  {
    id: "q4",
    text: "My little sister is looking for her doll.",
    img: img,
    correctAnswer: true,
  },
  {
    id: "q5",
    text: "I’m ironing clothes.",
    img: img,
    correctAnswer: true,
  },
];
const WB_Unit9_Page52_Q1 = () => {
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
          gap: "5px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="C"
          title={"Read and write ✓ for true or false."}
          subTitle={"Read the paragraph first, then compare each statement with the text before choosing True or False."}
        />

        <div className="space-y-0">
          <p className="text-[17px] leading-7 text-gray-800 mt-6 ml-10">
            <AudioText
              audioKey={"paragraph"}
              src={clip0}
              playSound={playSound}
              playingKey={playingKey}
              tabIndex={a.picked ? -1 : 0}
            >
              {
                "My mom is listening to the radio in her bedroom. Dad is on the computer sending an e-mail. My brother is playing football with his friends. My little sister is looking for her doll. I’m ironing clothes for my mom."
              }
            </AudioText>
          </p>

          {exerciseQuestions.map((question, index) => (
            <div
              key={question.id}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-x-6 p-3 rounded-lg hover:bg-gray-50"
            >
              <div></div>

              <div className="flex items-center gap-3">
                <span className="font-bold text-blue-900 text-[20px]">
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
                    <span className="font-semibold text-blue-800 mb-1">
                      True
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
                        <span className="absolute -top-2 -right-3 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-white shadow">
                          ✕
                        </span>
                      )}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  {index === 0 && (
                    <span className="font-semibold text-blue-800 mb-1">
                      False
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
                        <span className="absolute -top-2 -right-3 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-white shadow">
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
export default WB_Unit9_Page52_Q1;

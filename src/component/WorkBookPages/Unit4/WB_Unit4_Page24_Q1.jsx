/* eslint-disable react-refresh/only-export-components -- Exercise-local controls preserve the shared components. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import sound0 from "../../../assets/audio/WorkBook/Unit 4/Page 24 - G/Item_001_Do_you_want_a_chocolate_bar.mp3";
import sound1 from "../../../assets/audio/WorkBook/Unit 4/Page 24 - G/Item_002_Do_you_want_a_yo-yo.mp3";
import sound2 from "../../../assets/audio/WorkBook/Unit 4/Page 24 - G/Item_003_Do_you_want_a_ball.mp3";
import sound3 from "../../../assets/audio/WorkBook/Unit 4/Page 24 - G/Item_004_Yes,_I_do.mp3";
import sound4 from "../../../assets/audio/WorkBook/Unit 4/Page 24 - G/Item_005_No,_I_don't.mp3";
import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page24/Ex G 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page24/Ex G 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page24/Ex G 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page24/Ex G 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page24/Ex G 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page24/Ex G 6.svg";
import trueIcon from "../../../assets/imgs/true.svg";
const questions = [
  {
    id: 1,
    question: "Do you want a chocolate bar?",
    correct: "no",
  },
  {
    id: 2,
    question: "Do you want a yo-yo?",
    correct: "yes",
  },
  {
    id: 3,
    question: "Do you want a ball?",
    correct: "no",
  },
];
const IMAGE_DESCRIPTIONS = {
  [img1]: "A woman with dark shoulder-length hair.",
  [img2]: "A girl with two ponytails.",
  [img3]: "A smiling boy with brown hair.",
  [img4]: "A woman with short dark hair.",
  [img5]: "A smiling child wearing a yellow shirt.",
  [img6]: "A boy wearing a red shirt.",
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
  "do you want a chocolate bar": sound0,
  "do you want a yo-yo": sound1,
  "do you want a ball": sound2,
  "yes i do": sound3,
  "no i don't": sound4,
};
const soundFor = (text) =>
  SOUNDS[
    String(text)
      .toLowerCase()
      .replace(/[.,!?]/g, "")
      .trim()
  ];
function useSelectAnswers(
  correct,
  missingMessage,
  groups = null,
  missingKind = "info",
) {
  const [values, setValues] = useState({}),
    [results, setResults] = useState({}),
    [revealed, setRevealed] = useState(false),
    [message, setMessage] = useState("");
  const audio = useExerciseAudio();
  const completed = Object.keys(correct).every(
    (id) => results[id] === "correct",
  );
  useCheckButton(audio.rootRef, revealed || completed);
  const locked = (id) => revealed || results[id] === "correct";
  const choose = (id, value) => {
    audio.rootRef.current?.querySelectorAll("audio").forEach((a) => a.pause());
    if (locked(id)) {
      setMessage("Correct answer locked.");
      return;
    }
    setValues((p) => ({
      ...p,
      [id]: value,
    }));
    setResults((p) => ({
      ...p,
      [id]: null,
    }));
    setMessage("Answer " + id + ": " + value + " selected.");
  };
  const check = () => {
    if (revealed || completed) return;
    audio.stopAudio();
    if (
      Object.keys(correct).some(
        (id) => values[id] === undefined || values[id] === "",
      )
    ) {
      ValidationAlert[missingKind](missingMessage);
      setMessage(missingMessage);
      return;
    }
    const next = Object.fromEntries(
      Object.keys(correct).map((id) => [
        id,
        results[id] === "correct" || values[id] === correct[id]
          ? "correct"
          : "wrong",
      ]),
    );
    setResults(next);
    const units = groups || Object.keys(correct).map((id) => [id]),
      score = units.filter((ids) =>
        ids.every((id) => next[id] === "correct"),
      ).length,
      total = units.length,
      msg = "Score: " + score + " / " + total;
    setMessage(
      msg + ". Correct answers are locked; incorrect answers can be changed.",
    );
    showCheckFeedback(
      audio.rootRef.current,
      score === total ? "success" : score ? "warning" : "error",
      msg,
    );
  };
  const show = () => {
    audio.stopAudio();
    setValues({
      ...correct,
    });
    setResults(
      Object.fromEntries(Object.keys(correct).map((id) => [id, "correct"])),
    );
    setRevealed(true);
    setMessage("Correct answers shown and locked.");
  };
  const reset = () => {
    audio.stopAudio();
    audio.rootRef.current?.querySelectorAll("audio").forEach((a) => a.pause());
    setValues({});
    setResults({});
    setRevealed(false);
    setMessage("Exercise reset.");
  };
  const resultStyle = (id) =>
    results[id]
      ? {
          borderColor: results[id] === "correct" ? "#16a34a" : "#ef4444",
          boxShadow:
            "inset 0 0 0 2px " +
            (results[id] === "correct" ? "#16a34a" : "#ef4444"),
        }
      : {};
  const props = (id, value, src, label = String(value)) => ({
    role: "button",
    tabIndex: 0,
    "aria-pressed": values[id] === value,
    "aria-disabled": locked(id),
    "aria-label":
      "Question " +
      id +
      ": " +
      label +
      (locked(id)
        ? ". Correct and locked."
        : results[id] === "wrong"
          ? ". Incorrect. Choose again."
          : ""),
    onKeyDown: activate,
    onKeyUp: release,
    onClick: () => {
      if (src) audio.playSound("choice-" + id + "-" + value, src);
      choose(id, value);
    },
    style: {
      position: "relative",
      ...(values[id] === value ? resultStyle(id) : {}),
      ...(typeof value === "boolean" && values[id] === value && !results[id]
        ? {
            backgroundColor: "#dbeafe",
          }
        : {}),
    },
  });
  const nativeProps = (id) => ({
    "aria-label": "Answer " + id + (locked(id) ? ". Correct and locked." : ""),
    disabled: locked(id),
    value: values[id] ?? "",
    onChange: (e) => choose(id, e.target.value),
    onKeyUp: (e) => {
      if (e.key === "Enter" || e.key === " ") e.stopPropagation();
    },
    onKeyDown: (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.stopPropagation();
        if (e.repeat) e.preventDefault();
      }
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
    choose,
    check,
    show,
    reset,
    props,
    nativeProps,
    resultStyle,
  };
}
const WB_Unit4_Page24_Q1 = () => {
  const pairedImages = [
    [img1, img4],
    [img2, img5],
    [img3, img6],
  ];
  const interaction = useSelectAnswers(
    Object.fromEntries(questions.map((q) => [q.id, q.correct])),
    "Please answer all questions first.",
  );
  const { rootRef, message, playingKey, playSound } = interaction;
  const answers = interaction.values;
  const isWrong = (q) => interaction.results[q.id] === "wrong";
  const handleShowAnswer = interaction.show,
    handleStartAgain = interaction.reset,
    checkAnswers = interaction.check;
  const answerLabel = (value) =>
    value === "yes" ? "Yes, I do." : "No, I don't.";
  const labelProps = (q, value) => ({
    ...interaction.props(
      q.id,
      value,
      soundFor(answerLabel(value)),
      answerLabel(value),
    ),
    onClick: (e) => {
      e.preventDefault();
      interaction
        .props(q.id, value, soundFor(answerLabel(value)), answerLabel(value))
        .onClick();
    },
    style: {
      position: "relative",
      borderRadius: 4,
    },
  });
  const checkboxStyle = (q, value) => ({
    ...(answers[q.id] === value
      ? {
          backgroundColor: interaction.results[q.id] ? undefined : "#dbeafe",
          ...interaction.resultStyle(q.id),
        }
      : {}),
  });
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
          sectionLetter="G"
          title={<>Look, read, and write ✓.</>}
          subTitle={
            "Read the jobs and wants instruction carefully and finish each item before using Check Answer."
          }
        />

        <div className="space-y-1">
          {questions.map((q) => (
            <div key={q.id} className="flex flex-col">
              <p className={`mr-50 text-[20px] font-medium`}>
                {q.id}.{" "}
                <AudioText
                  audioKey={"question-" + q.id}
                  src={soundFor(q.question)}
                  playSound={playSound}
                  playingKey={playingKey}
                  className=""
                >
                  {q.question}
                </AudioText>
              </p>

              <div className="grid grid-cols-2 items-center gap-45">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {pairedImages[q.id - 1].map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={IMAGE_DESCRIPTIONS[img]}
                      style={{
                        width: i === 1 ? "120px" : "100px",
                        height: i === 1 ? "120px" : "80px",
                        objectFit: "contain",
                      }}
                    />
                  ))}
                </div>
                <div className="flex flex-col gap-5">
                  <div className="relative">
                    <label
                      {...labelProps(q, "yes")}
                      className={`flex items-center gap-2 cursor-pointer text-xl ${focusClass}`}
                    >
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        checked={answers[q.id] === "yes"}
                        onChange={() => interaction.choose(q.id, "yes")}
                        aria-hidden="true"
                        tabIndex={-1}
                        disabled={interaction.locked(q.id)}
                        className="hidden"
                      />
                      <span
                        style={checkboxStyle(q, "yes")}
                        className={`relative w-10 h-10 border-2 border-gray-400 rounded-sm flex items-center justify-center text-2xl font-bold text-blue-800 ${answers[q.id] === "yes" ? "text-red" : "text-transparent"}
                         ${isWrong(q) && answers[q.id] === "yes" && "border-red-500 "}`}
                      >
                        {answers[q.id] === "yes" && (
                          <img
                            alt=""
                            aria-hidden="true"
                            src={trueIcon}
                            style={{
                              height: "25px",
                            }}
                          />
                        )}
                        {isWrong(q) && answers[q.id] === "yes" && (
                          <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow border-2 border-white">
                            ✕
                          </div>
                        )}
                      </span>
                      Yes, I do.
                      {playingKey === "choice-" + q.id + "-yes" && (
                        <SpeakerBadge />
                      )}
                    </label>
                  </div>
                  <div className="relative">
                    <label
                      {...labelProps(q, "no")}
                      className={`flex items-center gap-2 cursor-pointer text-xl ${focusClass}`}
                    >
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        checked={answers[q.id] === "no"}
                        onChange={() => interaction.choose(q.id, "no")}
                        aria-hidden="true"
                        tabIndex={-1}
                        disabled={interaction.locked(q.id)}
                        className="hidden"
                      />
                      <span
                        style={checkboxStyle(q, "no")}
                        className={`relative w-10 h-10 border-2 border-gray-400 rounded-sm flex items-center justify-center text-2xl font-bold text-blue-800 ${answers[q.id] === "no" ? "text-red" : "text-transparent"}
                      ${isWrong(q) && answers[q.id] === "no" && "border-red-500 "}`}
                      >
                        {answers[q.id] === "no" && (
                          <img
                            alt=""
                            aria-hidden="true"
                            src={trueIcon}
                            style={{
                              height: "25px",
                            }}
                          />
                        )}
                        {isWrong(q) && answers[q.id] === "no" && (
                          <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow border-2 border-white">
                            ✕
                          </div>
                        )}
                      </span>
                      No, I don’t.
                      {playingKey === "choice-" + q.id + "-no" && (
                        <SpeakerBadge />
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          checkAnswers={checkAnswers}
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={handleStartAgain}
        />
      </div>
    </div>
  );
};
export default WB_Unit4_Page24_Q1;

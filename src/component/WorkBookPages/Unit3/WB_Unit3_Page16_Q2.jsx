import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import sound0 from "../../../assets/audio/WorkBook/Unit 3/Page 16 - D/Item_001_Can_she_make_sandwiches.mp3";
import sound1 from "../../../assets/audio/WorkBook/Unit 3/Page 16 - D/Item_002_Can_he_play_the_drum.mp3";
import sound2 from "../../../assets/audio/WorkBook/Unit 3/Page 16 - D/Item_003_Can_it_swim.mp3";
import sound3 from "../../../assets/audio/WorkBook/Unit 3/Page 16 - D/Item_004_Can_he_use_chopsticks.mp3";
import sound4 from "../../../assets/audio/WorkBook/Unit 3/Page 16 - D/Item_005_Yes,_she_can.mp3";
import sound5 from "../../../assets/audio/WorkBook/Unit 3/Page 16 - D/Item_006_No,_she_can't.mp3";
import sound6 from "../../../assets/audio/WorkBook/Unit 3/Page 16 - D/Item_007_Yes,_he_can.mp3";
import sound7 from "../../../assets/audio/WorkBook/Unit 3/Page 16 - D/Item_008_No,_he_can't.mp3";
import sound8 from "../../../assets/audio/WorkBook/Unit 3/Page 16 - D/Item_009_Yes,_it_can.mp3";
import sound9 from "../../../assets/audio/WorkBook/Unit 3/Page 16 - D/Item_010_No,_it_can't.mp3";
import React, { useState, useRef, useEffect } from "react";

// استيراد الصور ومكونات الأزرار والتنبيهات
import sandwichImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 16/Asset 27.svg";
import drumImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 16/Asset 28.svg";
import swimImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 16/Asset 29.svg";
import chopsticksImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 16/Asset 30.svg";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import trueIcon from "../../../assets/imgs/true.svg";

// Keep the score dialog's return focus on an enabled action in this exercise.
function showCheckFeedback(root, kind, ...messages) {
  if (kind === "success") {
    const returnTarget =
      root?.querySelector(".try-again-button:not(:disabled)") ||
      root?.querySelector(".show-answer-btn:not(:disabled)");
    returnTarget?.focus({ preventScroll: true });
  }
  ValidationAlert[kind](...messages);
}


// بيانات التمرين
const questions = [
  {
    id: "q1",
    text: "Can she make sandwiches?",
    img: sandwichImg,
    correctAnswer: true,
  },
  {
    id: "q2",
    text: "Can he play the drum?",
    img: drumImg,
    correctAnswer: false,
  },
  {
    id: "q3",
    text: "Can it swim?",
    img: swimImg,
    correctAnswer: false,
  },
  {
    id: "q4",
    text: "Can he use chopsticks?",
    img: chopsticksImg,
    correctAnswer: false,
  },
];
//.
const focusClass =
  "focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!";
// eslint-disable-next-line react-refresh/only-export-components -- Keep this indicator local.
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

// eslint-disable-next-line react-refresh/only-export-components -- Keep this control local.
const AudioText = ({
  children,
  audioKey,
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
      aria-label={String(children) + ". Hear it."}
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
const SOUNDS = {
  "can she make sandwiches": sound0,
  "can he play the drum": sound1,
  "can it swim": sound2,
  "can he use chopsticks": sound3,
  "yes, she can": sound4,
  "no, she can't": sound5,
  "yes, he can": sound6,
  "no, he can't": sound7,
  "yes, it can": sound8,
  "no, it can't": sound9,
};
const IMAGE_DESCRIPTIONS = {
  [sandwichImg]: "A girl preparing sandwiches at a counter.",
  [drumImg]: "A boy playing a drum beside another boy covering his ears.",
  [swimImg]: "An orange cat in a pool.",
  [chopsticksImg]: "A boy holding chopsticks above a bowl of rice.",
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
function useSelectAnswers(correct, missingMessage, groups = null) {
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
      ValidationAlert.info(missingMessage);
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
    showCheckFeedback(audio.rootRef.current, score === total ? "success" : score ? "warning" : "error", msg);
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
      ...resultStyle(id),
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
const WB_Unit3_Page16_Q2 = () => {
  const interaction = useSelectAnswers(
    Object.fromEntries(questions.map((q) => [q.id, q.correctAnswer])),
    "Please answer all questions first.",
  );
  const { rootRef, message, playingKey, playSound } = interaction;
  const selections = interaction.values;
  const handleShowAnswer = interaction.show,
    handleStartAgain = interaction.reset,
    checkAnswers = interaction.check;
  const getCheckboxClass = (id, choice) =>
    selections[id] === choice
      ? "border-blue-500 bg-blue-100"
      : "border-gray-300 bg-white";
  const answerText = (q, choice) =>
    (choice ? "Yes, " : "No, ") +
    (q.id === "q1" ? "she" : q.id === "q3" ? "it" : "he") +
    (choice ? " can." : " can't.");
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
      <div className="div-forall">
        {" "}
        <ExerciseHeader
          isWorkbook
          sectionLetter="D"
          title={"Read, look, and write ✓."}
          subTitle={
            "Read the Can...? question and picture together, then choose Yes or No."
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
          {questions.map((q, index) => (
            <div key={q.id} className="flex items-start gap-4">
              <span className="font-bold text-blue-800 text-xl">
                {index + 1}
              </span>

              <div className="flex-1">
                <p className="mb-4 text-gray-800 text-[20px]">
                  <AudioText
                    audioKey={"question-" + q.id}
                    src={SOUNDS[q.text.slice(0, -1).toLowerCase()]}
                    playSound={playSound}
                    playingKey={playingKey}
                    className=""
                  >
                    {q.text}
                  </AudioText>
                </p>

                {/* image + options */}
                <div className="flex items-start gap-6">
                  <img
                    src={q.img}
                    alt={IMAGE_DESCRIPTIONS[q.img]}
                    className="object-contain rounded-lg shadow-sm"
                    style={{
                      height: "120px",
                      width: "auto",
                    }}
                  />

                  <div className="space-y-4 lg:mt-5">
                    {/* Yes option */}
                    <div
                      {...interaction.props(
                        q.id,
                        true,
                        SOUNDS[answerText(q, true).slice(0, -1).toLowerCase()],
                        answerText(q, true),
                      )}
                      className={`${focusClass} relative flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-all ${getCheckboxClass(q.id, true)}`}
                    >
                      <div className="w-6 h-6 border-2 border-gray-400 rounded flex items-center justify-center">
                        {playingKey === "choice-" + q.id + "-true" && (
                          <SpeakerBadge />
                        )}
                        {selections[q.id] === true && (
                          <img
                            alt=""
                            aria-hidden="true"
                            src={trueIcon}
                            style={{
                              height: "25px",
                            }}
                          />
                        )}
                      </div>

                      <span>
                        Yes,{" "}
                        {q.id === "q1" ? "she" : q.id === "q3" ? "it" : "he"}{" "}
                        can.
                        {interaction.results[q.id] === "wrong" &&
                          selections[q.id] === true &&
                          selections[q.id] !== q.correctAnswer && (
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold shadow-lg border-2 border-white">
                              ✕
                            </div>
                          )}
                      </span>
                    </div>

                    {/* No option */}
                    <div
                      {...interaction.props(
                        q.id,
                        false,
                        SOUNDS[answerText(q, false).slice(0, -1).toLowerCase()],
                        answerText(q, false),
                      )}
                      className={`${focusClass} relative flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-all ${getCheckboxClass(q.id, false)}`}
                    >
                      <div className="w-6 h-6 border-2 border-gray-400 rounded flex items-center justify-center">
                        {playingKey === "choice-" + q.id + "-false" && (
                          <SpeakerBadge />
                        )}
                        {selections[q.id] === false && (
                          <img
                            alt=""
                            aria-hidden="true"
                            src={trueIcon}
                            style={{
                              height: "25px",
                            }}
                          />
                        )}
                      </div>

                      <span>
                        No,{" "}
                        {q.id === "q1" ? "she" : q.id === "q3" ? "it" : "he"}{" "}
                        can't.
                        {interaction.results[q.id] === "wrong" &&
                          selections[q.id] === false &&
                          selections[q.id] !== q.correctAnswer && (
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold shadow-lg border-2 border-white">
                              ✕
                            </div>
                          )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center">
        <Button
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={handleStartAgain}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
};
export default WB_Unit3_Page16_Q2;

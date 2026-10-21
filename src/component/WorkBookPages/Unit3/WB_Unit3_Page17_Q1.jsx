import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import sound0 from "../../../assets/audio/WorkBook/Unit 3/Page 17 - E/Item_001_make.mp3";
import sound1 from "../../../assets/audio/WorkBook/Unit 3/Page 17 - E/Item_002_take.mp3";
import sound2 from "../../../assets/audio/WorkBook/Unit 3/Page 17 - E/Item_003_a_sandwich.mp3";
import sound3 from "../../../assets/audio/WorkBook/Unit 3/Page 17 - E/Item_004_paint.mp3";
import sound4 from "../../../assets/audio/WorkBook/Unit 3/Page 17 - E/Item_005_play.mp3";
import sound5 from "../../../assets/audio/WorkBook/Unit 3/Page 17 - E/Item_006_the_drum.mp3";
import sound6 from "../../../assets/audio/WorkBook/Unit 3/Page 17 - E/Item_007_fly.mp3";
import sound7 from "../../../assets/audio/WorkBook/Unit 3/Page 17 - E/Item_008_ride.mp3";
import sound8 from "../../../assets/audio/WorkBook/Unit 3/Page 17 - E/Item_009_a_bike.mp3";
import sound9 from "../../../assets/audio/WorkBook/Unit 3/Page 17 - E/Item_010_a_kite.mp3";
import React, { useState, useRef, useEffect } from "react";

// استيراد الصور ومكونات الأزرار والتنبيهات
import sandwichImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 17/Ex E 1.svg";
import drumImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 17/Ex E 2.svg";
import bikeImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 17/Ex E 3.svg";
import kiteImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 17/Ex E 4.svg";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";

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
const circleQuestions = [
  {
    id: "q1",
    img: sandwichImg,
    options: ["make", "take"],
    phrase: "a sandwich",
    correctAnswer: "make",
  },
  {
    id: "q2",
    img: drumImg,
    options: ["paint", "play"],
    phrase: "the drum",
    correctAnswer: "play",
  },
  {
    id: "q3",
    img: bikeImg,
    options: ["fly", "ride"],
    phrase: "a bike",
    correctAnswer: "ride",
  },
  {
    id: "q4",
    img: kiteImg,
    options: ["play", "fly"],
    phrase: "a kite",
    correctAnswer: "fly",
  },
];
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
  make: sound0,
  take: sound1,
  "a sandwich": sound2,
  paint: sound3,
  play: sound4,
  "the drum": sound5,
  fly: sound6,
  ride: sound7,
  "a bike": sound8,
  "a kite": sound9,
};
const IMAGE_DESCRIPTIONS = {
  [sandwichImg]: "A girl preparing sandwiches at a counter.",
  [drumImg]: "A boy playing a drum.",
  [bikeImg]: "A girl wearing a helmet and riding a bicycle.",
  [kiteImg]: "A girl holding a kite string.",
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
const WB_Unit3_Page17_Q1 = () => {
  const interaction = useSelectAnswers(
    Object.fromEntries(circleQuestions.map((q) => [q.id, q.correctAnswer])),
    "Please complete all answers first.",
  );
  const { rootRef, message, playingKey, playSound } = interaction;
  const selections = interaction.values;
  const writtenAnswers = Object.fromEntries(
    circleQuestions.map((q) => [
      q.id,
      selections[q.id] ? selections[q.id] + " " + q.phrase : "",
    ]),
  );
  const getButtonClass = (id, choice) =>
    selections[id] === choice
      ? "border-2 border-blue-900"
      : "border-gray-300 bg-white";
  const handleShowAnswer = interaction.show,
    handleStartAgain = interaction.reset,
    checkAnswers = interaction.check;
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
        <ExerciseHeader
          isWorkbook
          sectionLetter="E"
          title={<>Look, read and circle. Write.</>}
          subTitle={"Read the clue and look at the picture, then tap the picnic and ability answer you would circle."}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          {circleQuestions.map((q, index) => (
            <div key={q.id} className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="font-bold text-blue-600 text-[20px]">
                  {index + 1}
                </span>
                <img
                  src={q.img}
                  alt={IMAGE_DESCRIPTIONS[q.img]}
                  className="object-contain rounded-lg shadow-sm"
                  style={{
                    height: "120px",
                    width: "auto",
                  }}
                />
                <div className="flex flex-col items-start gap-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      {...interaction.props(q.id, opt, SOUNDS[opt])}
                      style={{
                        ...interaction.props(q.id, opt).style,
                        borderRadius: "9999px",
                      }}
                      className={`${focusClass} w-20 px-4 py-1 border-1 rounded-full font-semibold transition-all ${getButtonClass(q.id, opt)}`}
                    >
                      {opt}
                      {playingKey === "choice-" + q.id + "-" + opt && (
                        <SpeakerBadge />
                      )}
                    </button>
                  ))}
                </div>
                <AudioText
                  audioKey={"phrase-" + q.id}
                  src={SOUNDS[q.phrase]}
                  playSound={playSound}
                  playingKey={playingKey}
                  className="text-gray-700 text-[20px]"
                >
                  {q.phrase}
                </AudioText>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={writtenAnswers[q.id] || ""}
                  aria-label={`Question ${index + 1}: completed phrase`}
                  style={{
                    borderRadius: 0,
                    ...(interaction.results[q.id]
                      ? {
                          borderColor:
                            interaction.results[q.id] === "correct"
                              ? "#16a34a"
                              : "#ef4444",
                        }
                      : {}),
                  }}
                  className={`text-[20px] w-full bg-transparent border-b-2 pb-1 focus:outline-none transition-colors
  ${interaction.results[q.id] === "wrong" && writtenAnswers[q.id]?.trim().toLowerCase() !== `${q.correctAnswer} ${q.phrase}`.toLowerCase() ? "border-red-500" : "border-gray-300"}
`}
                  readOnly
                />

                {/* ✕ */}
                {interaction.results[q.id] === "wrong" &&
                  writtenAnswers[q.id] &&
                  writtenAnswers[q.id].trim().toLowerCase() !==
                    `${q.correctAnswer} ${q.phrase}`.toLowerCase() && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold shadow-lg border-2 border-white">
                      ✕
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
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
export default WB_Unit3_Page17_Q1;

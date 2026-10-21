/* eslint-disable react-refresh/only-export-components -- Exercise-local controls preserve the shared components. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import sound0 from "../../../assets/audio/WorkBook/Unit 4/Page 26 - A/Item_001_ai.mp3";
import sound1 from "../../../assets/audio/WorkBook/Unit 4/Page 26 - A/Item_002_ay.mp3";
import sound2 from "../../../assets/audio/WorkBook/Unit 4/Page 26 - A/Item_003_a-e.mp3";
import React, { useState, useRef, useEffect } from "react";
import sound from "../../../assets/audio/WorkBook/p26q1.mp3";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page26/Ex A 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page26/Ex A 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page26/Ex A 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page26/Ex A 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page26/Ex A 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page26/Ex A 6.svg";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
const exerciseData = [
  {
    id: "a1",
    img: img1,
    word: "rain",
    options: ["ay", "ai"],
    correctAnswer: "ai",
    audioSrc: "/audio/rain.mp3",
  },
  {
    id: "a2",
    img: img2,
    word: "play",
    options: ["a-e", "ay"],
    correctAnswer: "ay",
    audioSrc: "/audio/play.mp3",
  },
  {
    id: "a3",
    img: img3,
    word: "cake",
    options: ["ay", "a-e"],
    correctAnswer: "a-e",
    audioSrc: "/audio/cake.mp3",
  },
  {
    id: "a4",
    img: img4,
    word: "paint",
    options: ["ai", "ay"],
    correctAnswer: "ai",
    audioSrc: "/audio/paint.mp3",
  },
  {
    id: "a5",
    img: img5,
    word: "May",
    options: ["ay", "a-e"],
    correctAnswer: "ay",
    audioSrc: "/audio/may.mp3",
  },
  {
    id: "a6",
    img: img6,
    word: "lake",
    options: ["a-e", "ai"],
    correctAnswer: "a-e",
    audioSrc: "/audio/lake.mp3",
  },
];
const IMAGE_DESCRIPTIONS = {
  [img1]: "Dark clouds with raindrops.",
  [img2]: "Two boys playing with a ball.",
  [img3]: "A cake with frosting and a candle.",
  [img4]: "A hand holding a paintbrush with colourful paint.",
  [img5]: "A desk calendar showing May.",
  [img6]: "A pond surrounded by grass and trees.",
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
  ai: sound0,
  ay: sound1,
  "a-e": sound2,
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
const WB_Unit4_Page26_Q1 = () => {
  const interaction = useSelectAnswers(
    Object.fromEntries(exerciseData.map((q) => [q.id, q.correctAnswer])),
    "Please choose an answer for all questions first.",
  );
  const { rootRef, message, playingKey } = interaction;
  const [forceStop, setForceStop] = useState(0);
  const stopMain = () => setForceStop((n) => n + 1);
  const selections = interaction.values;
  const stopAtSecond = 8;

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0,
      end: 3.7,
      text: "Page 26, phonics, exercise A.  ",
    },
    {
      start: 4.28,
      end: 7.92,
      text: "Listen and circle the correct long A sound.  ",
    },
    {
      start: 9.06,
      end: 10.721,
      text: "1-rain.",
    },
    {
      start: 10.72,
      end: 12.08,
      text: "2-play.",
    },
    {
      start: 14.38,
      end: 15.68,
      text: "3-cake.",
    },
    {
      start: 16.5,
      end: 18.49,
      text: "4-paint.",
    },
    {
      start: 19.5,
      end: 21.8,
      text: "5-may.",
    },
    {
      start: 22.5,
      end: 24.92,
      text: "6-lake.",
    },
  ];
  const getButtonClass = (id, value) =>
    selections[id] === value
      ? "border-blue-900"
      : "border-gray-300 bg-white hover:border-blue-900";
  const isWrong = (id, value) =>
    interaction.results[id] === "wrong" && selections[id] === value;
  const handleShowAnswer = () => {
      stopMain();
      interaction.show();
    },
    handleStartAgain = () => {
      stopMain();
      interaction.reset();
    },
    checkAnswers = () => {
      if (
        interaction.revealed ||
        exerciseData.every((q) => interaction.results[q.id] === "correct")
      )
        return;
      stopMain();
      interaction.check();
    };
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
          gap: "25px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="A"
          title={<>Listen and circle the correct long a sound.</>}
          subTitle={"Replay the word and listen for the long-a sound before choosing ai, ay, or a-e."}
        />

        <QuestionAudioPlayer
          pageId="wb_unit4_page26_q1"
          forceStop={forceStop}
          src={sound}
          captions={captions}
          stopAtSecond={stopAtSecond}
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-15">
          {exerciseData.map((item, index) => (
            <div key={item.id} className="flex items-center text-center gap-2">
              <div className="flex items-start gap-2">
                <span className="font-bold text-blue-900 text-xl">
                  {index + 1}
                </span>
                <img
                  src={item.img}
                  alt={IMAGE_DESCRIPTIONS[item.img]}
                  className="object-contain rounded-lg p-1"
                  style={{
                    height: "120px",
                    width: "100px",
                  }}
                />
              </div>
              <div className="flex flex-col justify-center gap-4">
                {item.options.map((opt) => (
                  <div key={opt} className="relative">
                    <button
                      key={opt}
                      {...interaction.props(item.id, opt, soundFor(opt))}
                      onClick={() => {
                        stopMain();
                        interaction
                          .props(item.id, opt, soundFor(opt))
                          .onClick();
                      }}
                      style={{
                        ...interaction.props(item.id, opt).style,
                        borderRadius: "9999px",
                      }}
                      className={`${focusClass} w-16 h-10 flex items-center justify-center text-lg font-semibold rounded-full border-2 transition-all ${getButtonClass(item.id, opt)} ${isWrong(item.id, opt) && "border-red-500 bg-white"}`}
                    >
                      {opt}
                      {playingKey === "choice-" + item.id + "-" + opt && (
                        <SpeakerBadge />
                      )}
                    </button>

                    {/* ❌ Wrong Icon */}
                    {isWrong(item.id, opt) && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold shadow border-2 border-white">
                        ✕
                      </div>
                    )}
                  </div>
                ))}
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
export default WB_Unit4_Page26_Q1;

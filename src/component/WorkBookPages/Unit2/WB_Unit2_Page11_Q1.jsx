import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import sound0 from "../../../assets/audio/WorkBook/Unit 2/Page 11 - E/Item_001_Is_that_a_duck.mp3";
import sound1 from "../../../assets/audio/WorkBook/Unit 2/Page 11 - E/Item_002_Is_that_a_bird.mp3";
import sound2 from "../../../assets/audio/WorkBook/Unit 2/Page 11 - E/Item_003_Is_that_a_sun.mp3";
import sound3 from "../../../assets/audio/WorkBook/Unit 2/Page 11 - E/Item_004_Is_that_a_flower.mp3";
import sound4 from "../../../assets/audio/WorkBook/Unit 2/Page 11 - E/Item_005_Is_that_a_pond.mp3";
import sound5 from "../../../assets/audio/WorkBook/Unit 2/Page 11 - E/Item_006_yes,_it_is.mp3";
import sound6 from "../../../assets/audio/WorkBook/Unit 2/Page 11 - E/Item_007_no,_it_isn't.mp3";
import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";

import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 11/Ex E 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 11/Ex E 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 11/Ex E 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 11/Ex E 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 11/Ex E 5.svg";

import "./WB_Unit2_Page11_Q1.css";

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



const exerciseData = [
  {
    id: 1,
    questionText: "Is that a duck?",
    correctQuestion: "yes, it is",
    src: img1,
  },
  {
    id: 2,
    questionText: "Is that a bird?",
    correctQuestion: "no, it isn't",
    src: img2,
  },
  {
    id: 3,
    questionText: "Is that a sun?",
    correctQuestion: "no, it isn't",
    src: img3,
  },
  {
    id: 4,
    questionText: "Is that a flower?",
    correctQuestion: "no, it isn't",
    src: img4,
  },
  {
    id: 5,
    questionText: "Is that a pond?",
    correctQuestion: "yes, it is",
    src: img5,
  },
];

const IMAGE_DESCRIPTIONS = {
  [img1]: "A duck swimming in water.",
  [img2]: "A yellow sun with orange rays.",
  [img3]: "A blue flower.",
  [img4]: "A bird perched on a branch.",
  [img5]: "A pond with grass and stones.",
};
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
          ? { boxShadow: "0 0 0 3px #2563eb", backgroundColor: "#dbeafe" }
          : {}),
      }}
    >
      {children}
      {playingKey === audioKey && <SpeakerBadge />}
    </span>
  );
};
const SOUNDS = {
  "is that a duck": sound0,
  "is that a bird": sound1,
  "is that a sun": sound2,
  "is that a flower": sound3,
  "is that a pond": sound4,
  "yes, it is": sound5,
  "no, it isn't": sound6,
};
function useSelectAnswers(correct, missingMessage) {
  const completedCheckRef = useRef(null);
  const completeCheck = (event) => {
    const button = event?.currentTarget;
    if (
      !completedCheckRef.current ||
      (button?.style && completedCheckRef.current.button !== button)
    ) {
      completedCheckRef.current = {
        button,
        cursor: button?.style?.cursor,
        aria: button?.getAttribute?.("aria-disabled"),
      };
    }
    if (button?.style) {
      button.style.cursor = "not-allowed";
      button.setAttribute("aria-disabled", "true");
    }
  };
  const resetCompletedCheck = () => {
    const previous = completedCheckRef.current;
    if (previous?.button?.style) {
      previous.button.style.cursor = previous.cursor || "";
      if (previous.aria == null)
        previous.button.removeAttribute("aria-disabled");
      else previous.button.setAttribute("aria-disabled", previous.aria);
    }
    completedCheckRef.current = null;
  };

  const [values, setValues] = useState({}),
    [results, setResults] = useState({}),
    [revealed, setRevealed] = useState(false),
    [message, setMessage] = useState("");
  const audio = useExerciseAudio();
  const locked = (id) => revealed || results[id] === "correct";
  const choose = (id, value) => {
    audio.rootRef.current?.querySelectorAll("audio").forEach((a) => a.pause());
    if (locked(id)) {
      setMessage("This answer is correct and locked.");
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
    setMessage("Question " + id + ": " + value + " selected.");
  };
  const check = (checkEvent) => {
    if (completedCheckRef.current) {
      completeCheck(checkEvent);
      return;
    }

    if (revealed) return;
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
    const score = Object.values(next).filter((x) => x === "correct").length,
      total = Object.keys(correct).length,
      msg = "Score: " + score + " / " + total;
    setMessage(
      msg + ". Correct answers are locked. Incorrect answers can be changed.",
    );
    ((score === total ? "success" : score ? "warning" : "error") ===
      "success" && completeCheck(checkEvent),
      showCheckFeedback(audio.rootRef.current, score === total ? "success" : score ? "warning" : "error", msg));
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
    resetCompletedCheck();

    audio.stopAudio();
    audio.rootRef.current?.querySelectorAll("audio").forEach((a) => a.pause());
    setValues({});
    setResults({});
    setRevealed(false);
    setMessage("Exercise reset.");
  };
  const props = (id, value, src) => ({
    role: "button",
    tabIndex: 0,
    "aria-pressed": values[id] === value,
    "aria-disabled": locked(id),
    "aria-label":
      "Question " +
      id +
      ": " +
      value +
      (locked(id)
        ? ". Correct answer locked."
        : results[id] === "wrong"
          ? ". Incorrect. Choose another answer."
          : ""),
    onKeyDown: activate,
    onKeyUp: release,
    onClick: () => {
      if (src) audio.playSound("choice-" + id + "-" + value, src);
      choose(id, value);
    },
    style: {
      position: "relative",
      ...(values[id] === value && results[id]
        ? {
            boxShadow:
              "inset 0 0 0 2px " +
              (results[id] === "correct" ? "#16a34a" : "#ef4444"),
            borderColor: results[id] === "correct" ? "#16a34a" : "#ef4444",
            borderBottomColor:
              results[id] === "correct" ? "#16a34a" : "#ef4444",
          }
        : {}),
      ...(audio.playingKey === "choice-" + id + "-" + value
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
    style: {
      borderRadius: 0,
      ...(results[id]
        ? {
            borderColor: results[id] === "correct" ? "#16a34a" : "#ef4444",
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
  };
}
const WB_Unit2_Page11_Q1 = () => {
  const interaction = useSelectAnswers(
    Object.fromEntries(exerciseData.map((q) => [q.id, q.correctQuestion])),
    "Please answer all questions first!",
  );
  const { rootRef, message, playingKey, playSound } = interaction;
  const userAnswers = interaction.values;
  const checkAnswers = interaction.check,
    handleShowAnswer = interaction.show,
    handleTryAgain = interaction.reset;

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
      <div className="div-forall" style={{ gap: "45px" }}>
        <ExerciseHeader
          isWorkbook
          sectionLetter="E"
          title={"Look and answer the questions."}
          subTitle={"Use the picture or chart first, then write a short complete park answer for each question."}
        />
        <div className="grid grid-cols-2 gap-5 ">
          {exerciseData.map((item) => {
            const isWrong = interaction.results[item.id] === "wrong";

            return (
              <div
                key={item.id}
                className="mb-6 flex items-center gap-4"
                style={{ justifyContent: "flex-start" }}
              >
                <div className="relative flex gap-5 items-center">
                  <div className="flex flex-col gap-5">
                    <label className="block text-xl font-medium">
                      <span className="text-2xl text-blue-900 font-semibold">
                        {" "}
                        {item.id}.
                      </span>{" "}
                      <AudioText
                        audioKey={"question-" + item.id}
                        src={
                          SOUNDS[
                            item.questionText.replace(/\?$/, "").toLowerCase()
                          ]
                        }
                        playSound={playSound}
                        playingKey={playingKey}
                      >
                        {item.questionText}
                      </AudioText>
                    </label>

                    {/* ⭐ Buttons بدل select */}
                    <div style={{ display: "flex", gap: "20px" }}>
                      {["yes, it is", "no, it isn't"].map((option) => (
                        <button
                          key={option}
                          {...interaction.props(
                            item.id,
                            option,
                            SOUNDS[option],
                          )}
                          aria-disabled={interaction.locked(item.id)}
                          className={`option-btn-wb-unit2-page11-q1 ${focusClass} ${
                            userAnswers[item.id] === option ? "selected" : ""
                          }`}
                        >
                          {option}
                          {playingKey ===
                            "choice-" + item.id + "-" + option && (
                            <SpeakerBadge />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* ❌ Wrong icon */}
                  {isWrong && (
                    <div className="wrong-icon-unit2-page11-q1">✕</div>
                  )}
                  <img
                    src={item.src}
                    className="object-contain"
                    style={{ height: "100px", width: "100px" }}
                    alt={IMAGE_DESCRIPTIONS[item.src] || ""}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center">
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleTryAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};

export default WB_Unit2_Page11_Q1;

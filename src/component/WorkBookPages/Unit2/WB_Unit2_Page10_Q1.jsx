import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import sound0 from "../../../assets/audio/WorkBook/Unit 2/Page 10 - C/Item_001_This.mp3";
import sound1 from "../../../assets/audio/WorkBook/Unit 2/Page 10 - C/Item_002_That.mp3";
import sound2 from "../../../assets/audio/WorkBook/Unit 2/Page 10 - C/Item_003_Those.mp3";
import sound3 from "../../../assets/audio/WorkBook/Unit 2/Page 10 - C/Item_004_These.mp3";
import sound4 from "../../../assets/audio/WorkBook/Unit 2/Page 10 - C/Item_005_is_a_flower.mp3";
import sound5 from "../../../assets/audio/WorkBook/Unit 2/Page 10 - C/Item_006_are_trees.mp3";
import sound6 from "../../../assets/audio/WorkBook/Unit 2/Page 10 - C/Item_007_is_a_clock.mp3";
import sound7 from "../../../assets/audio/WorkBook/Unit 2/Page 10 - C/Item_008_is_a_dog.mp3";
import sound8 from "../../../assets/audio/WorkBook/Unit 2/Page 10 - C/Item_009_are_queens.mp3";
import sound9 from "../../../assets/audio/WorkBook/Unit 2/Page 10 - C/Item_010_is_a_fox.mp3";
import React, { useState, useRef, useEffect } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 10/Ex C 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 10/Ex C 4.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 10/Ex C 2.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 10/Ex C 5.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 10/Ex C 3.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 10/Ex C 6.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import "./WB_Unit2_Page10_Q1.css";

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


const IMAGE_DESCRIPTIONS = {
  [img1]: "A boy holding a picture of a red flower.",
  [img2]: "A girl looking at a picture of several trees.",
  [img3]: "A girl holding a picture of a clock.",
  [img4]: "A boy looking at a picture of a dog.",
  [img5]: "A boy holding a picture of crowned women.",
  [img6]: "A girl looking at a picture of a fox.",
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
  this: sound0,
  that: sound1,
  those: sound2,
  these: sound3,
  "is a flower": sound4,
  "are trees": sound5,
  "is a clock": sound6,
  "is a dog": sound7,
  "are queens": sound8,
  "is a fox": sound9,
};
function useSelectAnswers(correct, missingMessage) {
  const completedCheckRef = useRef(null);
  const completeCheck = (event) => {
    const button = event?.currentTarget;
    if (!completedCheckRef.current || (button?.style && completedCheckRef.current.button !== button)) {
      completedCheckRef.current = { button, cursor: button?.style?.cursor, aria: button?.getAttribute?.("aria-disabled") };
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
      if (previous.aria == null) previous.button.removeAttribute("aria-disabled");
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
    if (completedCheckRef.current) { completeCheck(checkEvent); return; }

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
    (((score === total ? "success" : score ? "warning" : "info") === "success") && completeCheck(checkEvent), showCheckFeedback(audio.rootRef.current, score === total ? "success" : score ? "warning" : "info", msg));
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
const WB_Unit2_Page10_Q1 = () => {
  const data = [
    {
      id: 1,
      img: img1,
      options: ["This", "That"],
      correct: "This",
      sentence: "is a flower.",
    },
    {
      id: 2,
      img: img2,
      options: ["Those", "These"],
      correct: "Those",
      sentence: "are trees.",
    },
    {
      id: 3,
      img: img3,
      options: ["This", "That"],
      correct: "This",
      sentence: "is a clock.",
    },
    {
      id: 4,
      img: img4,
      options: ["This", "That"],
      correct: "That",
      sentence: "is a dog.",
    },
    {
      id: 5,
      img: img5,
      options: ["Those", "These"],
      correct: "These",
      sentence: "are queens.",
    },
    {
      id: 6,
      img: img6,
      options: ["That", "This"],
      correct: "That",
      sentence: "is a fox.",
    },
  ];

  const interaction = useSelectAnswers(
    Object.fromEntries(data.map((q) => [q.id, q.correct])),
    "Please answer all questions!",
  );
  const { rootRef, message, playingKey, playSound } = interaction;
  const userSelections = interaction.values,
    showAnswers = interaction.revealed,
    wrongAnswers = Object.fromEntries(
      Object.entries(interaction.results).map(([id, r]) => [id, r === "wrong"]),
    );
  const checkAnswers = interaction.check,
    handleShowAnswer = interaction.show,
    handleStartAgain = interaction.reset;

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
      <div className="div-forall" style={{ gap: "70px" }}>
        <ExerciseHeader
          isWorkbook
          sectionLetter="C"
          title={<>Look, read, and circle.</>}
          subTitle={"Check whether the picture shows one or more items, then choose This, That, These, or Those."}
        />

        <div
          className="grid grid-cols-2 gap-10"
          style={{ justifyItems: "start" }}
        >
          {data.map((item) => (
            <div key={item.id} className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-3 text-lg text-gray-800 justify-center">
                <span className="font-bold text-blue-900 text-2xl">
                  {item.id}
                </span>
                <img
                  src={item.img}
                  alt={IMAGE_DESCRIPTIONS[item.img] || ""}
                  className="object-contain rounded-xl"
                  style={{ height: "100px", width: "120px" }}
                />
                <div className="flex flex-col rounded-2xl gap-5 w-30">
                  {item.options.map((option) => (
                    <button
                      key={option}
                      {...interaction.props(
                        item.id,
                        option,
                        SOUNDS[option.toLowerCase()],
                      )}
                      className={`relative ${focusClass} px-4 py-1 rounded-xl transition-all border-2 ${
                        userSelections[item.id] === option
                          ? "border-blue-500"
                          : "border-gray-300 hover:border-blue-400"
                      } ${showAnswers && option === item.correct ? "border-green-500" : ""}`}
                    >
                      {option}
                      {playingKey === "choice-" + item.id + "-" + option && (
                        <SpeakerBadge />
                      )}
                      {/* ❌ علامة الخطأ */}
                      {wrongAnswers[item.id] &&
                        userSelections[item.id] === option && (
                          <div className="wrong-icon-unit2-p10-q1">✕</div>
                        )}
                    </button>
                  ))}
                </div>
                <h6 style={{ whiteSpace: "nowrap" }}>
                  <AudioText
                    audioKey={"text-" + item.id}
                    src={SOUNDS[item.sentence.replace(/\.$/, "").toLowerCase()]}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    {item.sentence}
                  </AudioText>
                </h6>
              </div>
            </div>
          ))}
        </div>

        <div>
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

export default WB_Unit2_Page10_Q1;

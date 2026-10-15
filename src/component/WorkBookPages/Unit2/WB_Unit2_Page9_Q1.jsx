import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import sound0 from "../../../assets/audio/WorkBook/Unit 2/Page 9 - A/Item_001_tree.mp3";
import sound1 from "../../../assets/audio/WorkBook/Unit 2/Page 9 - A/Item_002_sun.mp3";
import sound2 from "../../../assets/audio/WorkBook/Unit 2/Page 9 - A/Item_003_duck.mp3";
import sound3 from "../../../assets/audio/WorkBook/Unit 2/Page 9 - A/Item_004_bird.mp3";
import sound4 from "../../../assets/audio/WorkBook/Unit 2/Page 9 - A/Item_005_cloud.mp3";
import sound5 from "../../../assets/audio/WorkBook/Unit 2/Page 9 - A/Item_006_butterfly.mp3";
import sound6 from "../../../assets/audio/WorkBook/Unit 2/Page 9 - A/Item_007_flower.mp3";
import React, { useState, useRef, useEffect } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 9/Ex A 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 9/Ex A 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 9/Ex A 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 9/Ex A 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 9/Ex A 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 9/Ex A 6.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import "./WB_Unit2_Page9_Q1.css";

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
  [img1]: "A yellow sun with orange rays.",
  [img2]: "A duck swimming in water.",
  [img3]: "Three grey clouds.",
  [img4]: "A colourful butterfly.",
  [img5]: "A blue flower with two leaves.",
  [img6]: "A bird perched on a branch.",
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

const SOUNDS = {
  tree: sound0,
  sun: sound1,
  duck: sound2,
  bird: sound3,
  cloud: sound4,
  butterfly: sound5,
  flower: sound6,
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
    (((score === total ? "success" : score ? "warning" : "error") === "success") && completeCheck(checkEvent), showCheckFeedback(audio.rootRef.current, score === total ? "success" : score ? "warning" : "error", msg));
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
const WB_Unit2_Page9_Q1 = () => {
  const data = [
    {
      id: 1,
      img: img1,
      options: ["tree", "sun"],
      correct: "sun",
    },
    {
      id: 2,
      img: img2,
      options: ["duck", "bird"],
      correct: "duck",
    },
    {
      id: 3,
      img: img3,
      options: ["cloud", "bird"],
      correct: "cloud",
    },
    {
      id: 4,
      img: img4,
      options: ["cloud", "butterfly"],
      correct: "butterfly",
    },
    {
      id: 5,
      img: img5,
      options: ["flower", "sun"],
      correct: "flower",
    },
    {
      id: 6,
      img: img6,
      options: ["flower", "bird"],
      correct: "bird",
    },
  ];

  const interaction = useSelectAnswers(
    Object.fromEntries(data.map((q) => [q.id, q.correct])),
    "Please answer all questions!",
  );
  const { rootRef, message, playingKey } = interaction;
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
      <div className="div-forall" style={{ gap: "25px" }}>
        <ExerciseHeader
          isWorkbook
          sectionLetter="A"
          title={"Look, read, and circle."}
          subTitle={"Read the clue and look at the picture, then tap the park answer you would circle."}
        />

        <div className="grid grid-cols-2 gap-12">
          {data.map((item) => (
            <div key={item.id} className="flex flex-col items-center gap-6">
              <div
                className="flex items-center gap-3 text-xl text-gray-800 flex-wrap justify-center"
                style={{ width: "100%" }}
              >
                <span className="font-bold text-blue-900 text-2xl">
                  {item.id}
                </span>
                <img
                  src={item.img}
                  alt={IMAGE_DESCRIPTIONS[item.img] || ""}
                  className="max-w-32 max-h-32 object-contain rounded-xl"
                />
                <div
                  className="flex flex-col rounded-2xl"
                  style={{ width: "40%" }}
                >
                  {item.options.map((option) => (
                    <button
                      key={option}
                      {...interaction.props(
                        item.id,
                        option,
                        SOUNDS[option.toLowerCase()],
                      )}
                      className={`relative rounded-md ${focusClass} px-4 py-1 transition-all ${
                        userSelections[item.id] === option
                          ? "border-blue-500 bg-blue-100"
                          : "border-gray-300 hover:border-blue-400"
                      } ${
                        showAnswers && option === item.correct
                          ? "border-green-500"
                          : ""
                      }`}
                    >
                      {option}
                      {playingKey === "choice-" + item.id + "-" + option && (
                        <SpeakerBadge />
                      )}{" "}
                      {wrongAnswers[item.id] &&
                        userSelections[item.id] === option && (
                          <div className="wrong-icon-unit2-page9-q1">✕</div>
                        )}
                    </button>
                  ))}
                </div>
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

export default WB_Unit2_Page9_Q1;

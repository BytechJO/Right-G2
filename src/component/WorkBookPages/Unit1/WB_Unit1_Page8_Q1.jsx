import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 1/Page 8 - A/Item_001_emon.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 1/Page 8 - A/Item_002_at.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 1/Page 8 - A/Item_003_abbit.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 1/Page 8 - A/Item_004_obot.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 1/Page 8 - A/Item_005_amp.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 1/Page 8 - A/Item_006_uler.mp3";
import React, { useState, useEffect, useRef } from "react";
import "./WB_Unit1_Page8_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex A 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex A 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex A 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex A 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex A 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex A 6.svg";

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
  [img1]: "A yellow citrus fruit cut into two pieces.",
  [img2]: "A brown animal with whiskers and a long thin tail.",
  [img3]: "A brown animal with long upright ears.",
  [img4]: "A silver mechanical figure with antennae.",
  [img5]: "An electric light with a curved silver stand.",
  [img6]: "A blue measuring tool with numbered markings.",
};

const data = [
  { img: img1, answer: "l", pattern: "emon" },
  { img: img2, answer: "r", pattern: "at" },
  { img: img3, answer: "r", pattern: "abbit" },
  { img: img4, answer: "r", pattern: "obot" },
  { img: img5, answer: "l", pattern: "amp" },
  { img: img6, answer: "r", pattern: "uler" },
];

const options = ["r", "l"];

const focusClass =
  "focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!";
// eslint-disable-next-line react-refresh/only-export-components -- Local audio indicator keeps changes scoped to this exercise.
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
// eslint-disable-next-line react-refresh/only-export-components -- Local audio control preserves this exercise layout.
const AudioText = ({
  children,
  audioKey,
  src,
  playSound,
  playingKey,
  className = "",
  style = {},
}) => (
  <span
    role="button"
    tabIndex={0}
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

const WB_Unit1_Page8_Q1 = () => {
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

  const [inputs, setInputs] = useState(Array(data.length).fill(""));
  const [wrongInputs, setWrongInputs] = useState(
    Array(data.length).fill(false),
  );
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctInputs, setCorrectInputs] = useState([]);
  const [message, setMessage] = useState("");
  const { rootRef, playingKey, playSound, stopAudio } = useExerciseAudio();

  const handleChange = (value, index) => {
    if (showAnswer || correctInputs.includes(index)) return;
    setMessage(`Question ${index + 1}: ${value} selected.`);
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);

    setWrongInputs((prev) =>
      prev.map((wrong, i) => (i === index ? false : wrong)),
    );
  };

  const checkAnswers = (checkEvent) => {
    if (completedCheckRef.current) { completeCheck(checkEvent); return; }

    if (showAnswer) return;
    stopAudio();
    if (inputs.some((val) => val === "")) {
      ValidationAlert.info(
        "Oops!",
        "Please fill in all the answers before checking.",
      );
      setMessage("Please fill in all the answers before checking.");
      return;
    }

    let correctCount = 0;
    const wrongFlags = [];

    data.forEach((item, index) => {
      if (inputs[index] === item.answer) {
        correctCount++;
        wrongFlags[index] = false;
      } else {
        wrongFlags[index] = true;
      }
    });

    setWrongInputs(wrongFlags);
    setCorrectInputs(
      data.flatMap((item, i) => (inputs[i] === item.answer ? [i] : [])),
    );
    setMessage(
      `Score ${correctCount} out of ${data.length}. Correct answers are locked.`,
    );
    const total = data.length;
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size: 20px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) (completeCheck(checkEvent), showCheckFeedback(rootRef.current, "success", scoreMessage));
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  const handleShowAnswer = () => {
    const correct = data.map((item) => item.answer);
    stopAudio();
    setCorrectInputs(data.map((_, i) => i));
    setMessage("Correct answers shown and locked.");
    setInputs(correct);
    setWrongInputs(Array(data.length).fill(false));
    setShowAnswer(true);
  };
//....
  const reset = () => {
    stopAudio();
    setCorrectInputs([]);
    setMessage("Exercise reset.");
    setInputs(Array(data.length).fill(""));
    setWrongInputs(Array(data.length).fill(false));
    setShowAnswer(false);
  };

  return (
    <div
      ref={rootRef}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {message}
      </div>
      <div className="div-forall" style={{ gap: "80px" }}>
        <ExerciseHeader
          isWorkbook
          sectionLetter="A"
          title={"Look and write the missing letters. Read."}
          subTitle={"Say each picture word aloud, listen to its first sound, then add l or r."}
        />

        <div className="unscramble-row-wb-unit1-p8-q1">
          {data.map((item, index) => (
            <div className="unscramble-box" key={index}>
              <div className="WB-unit1-p8-q1-middle-section">
                {/* الصف العلوي */}
                <div className="input-row-wb-unit1-p8-q1">
                  <span className="num">{index + 1}</span>

                  {/* ⭐ input */}
                  <div className="input-wrapper-wb-unit1-page8-q1">
                    <div
                      className="WB-unit1-p8-q1-input"
                      style={
                        correctInputs.includes(index)
                          ? {
                              borderColor: "#16a34a",
                              boxShadow: "inset 0 -1px #16a34a",
                            }
                          : wrongInputs[index]
                            ? { borderColor: "#ef4444" }
                            : undefined
                      }
                    >
                      {inputs[index]}
                    </div>

                    {wrongInputs[index] && (
                      <div className="error-icon-wb-unit1-p8-q1">✕</div>
                    )}
                  </div>
                  <AudioText
                    audioKey={`pattern-${index}`}
                    src={[clip0, clip1, clip2, clip3, clip4, clip5][index]}
                    playSound={playSound}
                    playingKey={playingKey}
                    className="WB-unit1-p8-q1-pattern"
                  >
                    {item.pattern}
                  </AudioText>
                </div>

                {/* الكلمة + الصورة */}

                <div className="img-box-wb-unit1-p8-q1">
                  <img
                    src={item.img}
                    alt={IMAGE_DESCRIPTIONS[item.img] || ""}
                  />
                </div>
              </div>

              {/* ⭐ الخيارات تحت */}
              <div className="WB-unit1-p8-q1-choices">
                {options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleChange(opt, index)}
                    type="button"
                    aria-disabled={showAnswer || correctInputs.includes(index)}
                    aria-pressed={inputs[index] === opt}
                    aria-label={`Question ${index + 1}: ${opt}${correctInputs.includes(index) ? ", correct and locked" : ""}`}
                    onKeyDown={activate}
                    onKeyUp={release}
                    style={
                      inputs[index] === opt &&
                      (correctInputs.includes(index) || wrongInputs[index])
                        ? {
                            borderColor: correctInputs.includes(index)
                              ? "#16a34a"
                              : "#ef4444",
                            boxShadow: `inset 0 0 0 1px ${correctInputs.includes(index) ? "#16a34a" : "#ef4444"}`,
                          }
                        : undefined
                    }
                    className={`WB-unit1-p8-q1-choice-btn ${focusClass} ${
                      inputs[index] === opt ? "selected" : ""
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="action-buttons-container">
          <button onClick={(checkEvent) => { resetCompletedCheck(); (reset)(checkEvent); }} className="try-again-button">
            Start Again ↻
          </button>

          <button onClick={handleShowAnswer} className="show-answer-btn">
            Show Answer
          </button>

          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default WB_Unit1_Page8_Q1;

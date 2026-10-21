import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 1/Page 5 - F/Item_001_This_is_Stella's.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 1/Page 5 - F/Item_002_brother.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 1/Page 5 - F/Item_003_sister.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 1/Page 5 - F/Item_004_uncle.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 1/Page 5 - F/Item_005_aunt.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 1/Page 5 - F/Item_006_mother.mp3";
import React, { useState, useEffect, useRef } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 5/Ex F 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 5/Ex F 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 5/Ex F 3.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";

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
  [img1]: "A child with dark hair tied up and a blue top.",
  [img2]: "A man in a cream shirt.",
  [img3]: "A woman wearing glasses and an orange top.",
};

const focusClass =
  "focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!";
// eslint-disable-next-line react-refresh/only-export-components -- Local audio indicator keeps changes scoped to this exercise.
const SpeakerBadge = () => (
  <span
    aria-hidden="true"
    style={{
      position: "absolute",
      top: 0,
      right: 0,
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

const WB_Unit1_Page5_Q1 = () => {
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

  const [userSelections, setUserSelections] = useState({
    1: null,
    2: null,
    3: null,
  });
  const [results, setResults] = useState({});
  const [message, setMessage] = useState("");
  const { rootRef, playingKey, playSound, stopAudio } = useExerciseAudio();

  const [showAnswers, setShowAnswers] = useState(false);

  const data = [
    { id: 1, img: img1, options: ["brother.", "sister."], correct: "sister." },
    { id: 2, img: img2, options: ["uncle.", "aunt."], correct: "uncle." },
    { id: 3, img: img3, options: ["mother.", "aunt."], correct: "aunt." },
  ];

  const handleSelect = (id, option) => {
    if (!showAnswers && results[id] !== "correct") {
      setResults((prev) => ({ ...prev, [id]: null }));
      setMessage(`Question ${id}: ${option} selected.`);
      setUserSelections({ ...userSelections, [id]: option });
    }
  };

  const checkAnswers = (checkEvent) => {
    if (completedCheckRef.current) { completeCheck(checkEvent); return; }

    if (showAnswers) return;
    stopAudio();
    const totalQuestions = data.length;
    const selectedAnswers = Object.values(userSelections);

    const hasEmptyAnswers = selectedAnswers.some((answer) => !answer);

    if (hasEmptyAnswers) {
      ValidationAlert.info("Please complete all answers first.");
      setMessage("Please complete all answers first.");
      return;
    }

    let currentScore = 0;

    data.forEach((item) => {
      const userAnswer = userSelections[item.id];
      const correctAnswer = item.correct;

      if (userAnswer === correctAnswer) {
        currentScore += 1;
      }
    });

    setResults(
      Object.fromEntries(
        data.map((item) => [
          item.id,
          userSelections[item.id] === item.correct ? "correct" : "wrong",
        ]),
      ),
    );
    setMessage(
      `Score ${currentScore} out of ${totalQuestions}. Correct answers are locked; wrong answers can be changed.`,
    );

    if (currentScore === totalQuestions) {
      (completeCheck(checkEvent), showCheckFeedback(rootRef.current, "success", `Score: ${currentScore} / ${totalQuestions}`));
    } else if (currentScore > 0) {
      ValidationAlert.warning(`Score: ${currentScore} / ${totalQuestions}`);
    } else {
      ValidationAlert.error(`Score: ${currentScore} / ${totalQuestions}`);
    }
  };

  const handleShowAnswer = () => {
    const answers = {};
    data.forEach((item) => (answers[item.id] = item.correct));
    setUserSelections(answers);
    stopAudio();
    setResults(Object.fromEntries(data.map((item) => [item.id, "correct"])));
    setMessage("Correct answers shown and locked.");
    setShowAnswers(true);
  };

  const handleStartAgain = () => {
    setUserSelections({ 1: null, 2: null, 3: null });
    stopAudio();
    setResults({});
    setMessage("Exercise reset. All answers and results cleared.");
    setShowAnswers(false);
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
      <div className="div-forall" style={{ gap: "120px" }}>
        <ExerciseHeader
          isWorkbook
          sectionLetter="F"
          title={<>Look, read, and circle.</>}
          subTitle={"Read the clue and look at the picture, then tap the family answer you would circle."}
        />

        <div className="grid grid-cols-3 gap-12">
          {data.map((item) => {
            const isWrong =
              results[item.id] === "wrong" &&
              userSelections[item.id] &&
              userSelections[item.id] !== item.correct;
            return (
              <div
                key={item.id}
                className="flex flex-col items-center justify-center gap-6 relative"
              >
                <div className="flex items-start gap-4 w-full justify-center">
                  <span className="font-bold text-blue-900 text-2xl">
                    {item.id}
                  </span>
                  <img
                    src={item.img}
                    alt={IMAGE_DESCRIPTIONS[item.img] || ""}
                    className="max-w-32 max-h-32 object-contain rounded-xl"
                  />
                </div>

                <div className="flex items-center gap-2 text-xl text-gray-800 flex-col justify-center">
                  <AudioText
                    audioKey={`text-${item.id}`}
                    src={clip0}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    This is Stella's
                  </AudioText>
                  <div className="flex flex-col border-2 border-gray-400 rounded-2xl  w-[130px]">
                    {item.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={userSelections[item.id] === option}
                        aria-disabled={
                          showAnswers || results[item.id] === "correct"
                        }
                        aria-label={`Question ${item.id}: ${option}${results[item.id] === "correct" ? ", correct and locked" : ""}`}
                        onKeyDown={activate}
                        onKeyUp={release}
                        style={{
                          borderRadius: "8px",
                          position: "relative",
                          ...(userSelections[item.id] === option &&
                          results[item.id]
                            ? {
                                boxShadow: `inset 0 0 0 2px ${results[item.id] === "correct" ? "#16a34a" : "#ef4444"}`,
                              }
                            : {}),
                        }}
                        onClick={() => {
                          playSound(
                            `choice-${item.id}-${option}`,
                            {
                              "brother.": clip1,
                              "sister.": clip2,
                              "uncle.": clip3,
                              "aunt.": clip4,
                              "mother.": clip5,
                            }[option],
                          );
                          handleSelect(item.id, option);
                        }}
                        className={`px-4 py-1 transition-all relative ${focusClass} ${
                          userSelections[item.id] === option
                            ? "bg-blue-500 text-white"
                            : "hover:bg-gray-100"
                        } ${results[item.id] === "correct" && option === item.correct ? "bg-green-500 text-white" : ""}`}
                      >
                        {option}
                        {playingKey === `choice-${item.id}-${option}` && (
                          <SpeakerBadge />
                        )}
                      </button>
                    ))}
                    {isWrong && (
                      <div className="wb-wrong-icon-unit1-page5-q1">✕</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-16 flex justify-center">
        <Button
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={(checkEvent) => { resetCompletedCheck(); (handleStartAgain)(checkEvent); }}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
};

export default WB_Unit1_Page5_Q1;

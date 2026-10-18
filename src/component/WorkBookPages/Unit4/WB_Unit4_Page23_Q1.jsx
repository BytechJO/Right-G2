/* eslint-disable react-refresh/only-export-components -- Exercise-local controls preserve the shared components. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import yesAudio from "../../../assets/audio/WorkBook/Unit 4/Page 24 - G/Item_004_Yes,_I_do.mp3";
import noAudio from "../../../assets/audio/WorkBook/Unit 4/Page 24 - G/Item_005_No,_I_don't.mp3";
import sound0 from "../../../assets/audio/WorkBook/Unit 4/Page 23 - E/Item_001_Do_you_want_teddy_bears.mp3";
import sound1 from "../../../assets/audio/WorkBook/Unit 4/Page 23 - E/Item_002_Do_you_want_trains.mp3";
import sound2 from "../../../assets/audio/WorkBook/Unit 4/Page 23 - E/Item_003_Do_you_want_tennis_rackets.mp3";
import sound3 from "../../../assets/audio/WorkBook/Unit 4/Page 23 - E/Item_004_Do_you_want_a_basketball.mp3";
import React, { useState, useRef, useEffect } from "react";
import { toPng } from "html-to-image";
import ValidationAlert from "../../Popup/ValidationAlert";
import { FaDownload } from "react-icons/fa6";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page23/Ex E 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page23/Ex E 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page23/Ex E 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page23/Ex E 4.svg";
const activityData = [
  {
    id: "e1",
    item: "teddy bears",
    img: img1,
    isPlural: true,
  },
  {
    id: "e2",
    item: "trains",
    img: img2,
    isPlural: true,
  },
  {
    id: "e3",
    item: "tennis rackets",
    img: img3,
    isPlural: true,
  },
  {
    id: "e4",
    item: "a basketball",
    img: img4,
    isPlural: false,
  },
];
const IMAGE_DESCRIPTIONS = {
  [img1]: "Two teddy bears.",
  [img2]: "A toy train.",
  [img3]: "Two tennis rackets.",
  [img4]: "A basketball.",
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
  "do you want teddy bears": sound0,
  "do you want trains": sound1,
  "do you want tennis rackets": sound2,
  "do you want a basketball": sound3,
};
const soundFor = (text) =>
  SOUNDS[
    String(text)
      .toLowerCase()
      .replace(/[.,!?]/g, "")
      .trim()
  ];
const WB_Unit4_Page23_Q1 = () => {
  const [choices, setChoices] = useState({});
  const captureRef = useRef(null);
  const { rootRef, playingKey, playSound, stopAudio } = useExerciseAudio();
  const [message, setMessage] = useState("");
  const [showResults, setShowResults] = useState(false);
  useCheckButton(rootRef, showResults);
  const handleChoice = (itemId, mood) => {
    playSound(
      "choice-" + itemId + "-" + mood,
      mood === "happy" ? yesAudio : noAudio,
    );
    if (showResults) return;
    setChoices((prev) => ({
      ...prev,
      [itemId]: mood,
    }));
    setMessage(
      (mood === "happy" ? "Yes, I do." : "No, I don’t.") + " selected.",
    );
  };
  const handleStartAgain = () => {
    stopAudio();
    setMessage("Activity reset.");
    setChoices({});
    setShowResults(false);
  };
  const checkAnswers = () => {
    if (showResults) return;

    // ✅ تحقق إنو كل الأسئلة متجاوبة
    const allAnswered = activityData.every((item) => choices[item.id]);
    if (!allAnswered) {
      setMessage("Please answer all questions first.");
      ValidationAlert.info("Please answer all questions first.");
      return;
    }

    // ✅ إذا كله معبّي
    stopAudio();
    setMessage("All choices completed.");
    showCheckFeedback(rootRef.current, "success", "Good Job!!");
    setShowResults(true);
  };
  const handledownload = async () => {
    const element = captureRef.current;
    const dataUrl = await toPng(element);
    const link = document.createElement("a");
    link.download = "activity.png";
    link.href = dataUrl;
    link.click();
  };
  return (
    <div ref={captureRef}>
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
            title={
              <>
                What do you want? Circle and write "Yes, I do." or "No, I
                don't."
              </>
            }
            subTitle={"Read the clue and look at the picture, then tap the jobs and wants answer you would circle."}
          />

          <div className="space-y-6">
            {activityData.map((item, index) => {
              const currentChoice = choices[item.id];
              let answerText = "";
              if (currentChoice === "happy") answerText = "Yes, I do.";
              if (currentChoice === "sad") answerText = "No, I don't.";
              return (
                <div key={item.id} className="flex items-center gap-4">
                  <span className="font-bold text-blue-600 text-xl">
                    {index + 1}
                  </span>
                  <p className="text-xl">
                    <AudioText
                      label={"Do you want " + item.item + "? Hear it."}
                      audioKey={"question-" + item.id}
                      src={soundFor("Do you want " + item.item)}
                      playSound={playSound}
                      playingKey={playingKey}
                      className=""
                    >
                      Do you want {item.item}?
                    </AudioText>
                  </p>
                  <img
                    src={item.img}
                    alt={IMAGE_DESCRIPTIONS[item.img]}
                    className="max-w-16 max-h-16 object-contain"
                  />

                  {/* الوجوه القابلة للنقر */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      aria-pressed={currentChoice === "happy"}
                      aria-disabled={showResults}
                      aria-label={"Question " + (index + 1) + ". Yes, I do."}
                      onKeyDown={activate}
                      onKeyUp={release}
                      style={{
                        borderRadius: 4,
                        position: "relative",
                      }}
                      onClick={() => handleChoice(item.id, "happy")}
                      className={`${focusClass} text-3xl transition-transform transform ${currentChoice === "happy" ? "scale-125" : "opacity-50 hover:opacity-100"}`}
                    >
                      🙂
                      {playingKey === "choice-" + item.id + "-happy" && (
                        <SpeakerBadge />
                      )}
                    </button>
                    <button
                      type="button"
                      aria-pressed={currentChoice === "sad"}
                      aria-disabled={showResults}
                      aria-label={"Question " + (index + 1) + ". No, I don’t."}
                      onKeyDown={activate}
                      onKeyUp={release}
                      style={{
                        borderRadius: 4,
                        position: "relative",
                      }}
                      onClick={() => handleChoice(item.id, "sad")}
                      className={`${focusClass} text-3xl transition-transform transform ${currentChoice === "sad" ? "scale-125" : "opacity-50 hover:opacity-100"}`}
                    >
                      ☹️
                      {playingKey === "choice-" + item.id + "-sad" && (
                        <SpeakerBadge />
                      )}
                    </button>
                  </div>

                  {/* مربع الحوار */}
                  <div className="flex-1 h-12 px-4 flex items-center bg-gray-100 rounded-full border border-gray-300 relative">
                    <p className="text-xl font-medium text-gray-700">
                      {answerText}
                    </p>
                    {/* شكل ذيل مربع الحوار */}
                    <div className="absolute left-0 -ml-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-gray-300"></div>
                    <div className="absolute left-0 -ml-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-gray-100"></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="action-buttons-container">
            <button onClick={handleStartAgain} className="try-again-button">
              Start Again ↻
            </button>
            <button
              aria-label="Download your answers as an image"
              onClick={handledownload}
              className="flex items-center justify-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 shadow-md px-10"
            >
              <FaDownload />
            </button>
            <button
              disabled={showResults}
              style={{
                cursor: showResults ? "not-allowed" : undefined,
              }}
              onClick={checkAnswers}
              className="check-button2"
            >
              Finish ✓
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default WB_Unit4_Page23_Q1;

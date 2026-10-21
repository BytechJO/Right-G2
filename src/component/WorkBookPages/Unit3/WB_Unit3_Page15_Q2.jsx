import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import sound0 from "../../../assets/audio/WorkBook/Unit 3/Page 15 - B/Item_001_Yes,_I_can.mp3";
import sound1 from "../../../assets/audio/WorkBook/Unit 3/Page 15 - B/Item_002_No,_I_can't.mp3";
import sound2 from "../../../assets/audio/WorkBook/Unit 3/Page 15 - B/Item_003_Can_you_climb_a_tree.mp3";
import sound3 from "../../../assets/audio/WorkBook/Unit 3/Page 15 - B/Item_004_Can_you_swim.mp3";
import sound4 from "../../../assets/audio/WorkBook/Unit 3/Page 15 - B/Item_005_Can_you_ride_a_bike.mp3";
import sound5 from "../../../assets/audio/WorkBook/Unit 3/Page 15 - B/Item_006_Can_you_play_the_drum.mp3";
import React, { useState, useRef, useEffect } from "react";
import trueIcon from "../../../assets/imgs/true.svg";
const questions = [
  {
    id: "q1",
    text: "Can you climb a tree?",
  },
  {
    id: "q2",
    text: "Can you swim?",
  },
  {
    id: "q3",
    text: "Can you ride a bike?",
  },
  {
    id: "q4",
    text: "Can you play the drum?",
  },
];

const focusClass =
  "focus-visible:outline-2! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-2! focus-visible:z-20";
const choiceFocusClass =
  "focus-visible:outline-2! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-[-2px]! focus-visible:z-20";
// eslint-disable-next-line react-refresh/only-export-components -- Keep this indicator local.
const SpeakerBadge = ({ inset = false }) => (
  <span
    aria-hidden="true"
    style={{
      position: "absolute",
      top: inset ? 4 : -10,
      right: inset ? 4 : -10,
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
              boxShadow: "0 0 0 1px #2563eb",
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

//.....
const SOUNDS = {
  "yes, i can": sound0,
  "no, i can't": sound1,
  "can you climb a tree": sound2,
  "can you swim": sound3,
  "can you ride a bike": sound4,
  "can you play the drum": sound5,
};
const WB_Unit3_Page15_Q2 = () => {
  const [selections, setSelections] = useState({}),
    [message, setMessage] = useState("");
  const { rootRef, playingKey, playSound, stopAudio } = useExerciseAudio();
  const writtenAnswers = Object.fromEntries(
    questions.map((q) => [
      q.id,
      selections[q.id] === undefined
        ? ""
        : q.text + (selections[q.id] ? " Yes, I can." : " No, I can't."),
    ]),
  );
  const handleSelect = (id, choice) => {
    setSelections((p) => ({
      ...p,
      [id]: choice,
    }));
    playSound(
      "choice-" + id + "-" + choice,
      SOUNDS[choice ? "yes, i can" : "no, i can't"],
    );
    setMessage(
      questions.find((q) => q.id === id).text +
        " " +
        (choice ? "Yes, I can." : "No, I can't."),
    );
  };
  const choiceProps = (id, choice) => ({
    role: "button",
    tabIndex: 0,
    "aria-pressed": selections[id] === choice,
    "aria-label":
      questions.find((q) => q.id === id).text +
      " " +
      (choice ? "Yes, I can." : "No, I can't."),
    onKeyDown: activate,
    onKeyUp: release,
    style: {
      position: "relative",
      borderRadius: 8,
    },
  });
  const getCellClass = (id, choice) =>
    selections[id] === choice
      ? "bg-blue-100 border-blue-400"
      : "bg-white hover:bg-gray-50";
  const handleStartAgain = () => {
    stopAudio();
    setSelections({});
    setMessage("Exercise reset.");
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
          gap: "35px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="B"
          title={"Read and write ✓. Write the question and answer."}
          subTitle={
            "Build the Can you...? question first, then choose the answer that is true for you."
          }
        />

        {/* جدول الاختيارات */}
        <div className="w-full min-w-0 max-w-full">
          <table className="w-full table-fixed border border-gray-300 text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-r border-gray-300 w-1/2"></th>
                <th className="p-3 border-r border-gray-300 font-semibold text-gray-700">
                  Yes, I can.
                </th>
                <th className="p-3 font-semibold text-gray-700">
                  No, I can't.
                </th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, index) => (
                <tr key={q.id} className="border-t border-gray-300">
                  <td className="p-3 border-r border-gray-300 text-left text-gray-800 break-words">
                    <span className="font-bold mr-2">{index + 1}</span>
                    <AudioText
                      audioKey={"question-" + q.id}
                      src={SOUNDS[q.text.slice(0, -1).toLowerCase()]}
                      playSound={playSound}
                      playingKey={playingKey}
                      className=""
                    >
                      {q.text}
                    </AudioText>
                  </td>
                  <td
                    {...choiceProps(q.id, true)}
                    onClick={() => handleSelect(q.id, true)}
                    className={`p-3 ${choiceFocusClass} border-r border-gray-300 cursor-pointer transition-colors ${getCellClass(q.id, true)}`}
                  >
                    {playingKey === "choice-" + q.id + "-true" && (
                      <SpeakerBadge inset />
                    )}
                    {selections[q.id] === true && (
                      <div className="flex justify-center items-center ">
                        <img
                          alt=""
                          aria-hidden="true"
                          src={trueIcon}
                          style={{
                            height: "25px",
                          }}
                        />
                      </div>
                    )}
                  </td>
                  <td
                    {...choiceProps(q.id, false)}
                    onClick={() => handleSelect(q.id, false)}
                    className={`p-3 ${choiceFocusClass} cursor-pointer transition-colors ${getCellClass(q.id, false)}`}
                  >
                    {playingKey === "choice-" + q.id + "-false" && (
                      <SpeakerBadge inset />
                    )}
                    {selections[q.id] === false && (
                      <div className="flex justify-center items-center ">
                        {" "}
                        <img
                          alt=""
                          aria-hidden="true"
                          src={trueIcon}
                          style={{
                            height: "25px",
                          }}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* قسم الكتابة */}
        <div className="space-y-4">
          {questions.map((q, index) => (
            <div key={`write-${q.id}`} className="flex items-center gap-3">
              <span className="font-bold text-gray-600">{index + 1}</span>
              <input
                type="text"
                value={writtenAnswers[q.id]}
                aria-label={`Question ${index + 1}: your answer`}
                style={{
                  borderRadius: 0,
                }}
                placeholder="Your answer will appear here..."
                className="w-full min-w-0 bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-lg text-gray-800 pb-1"
                readOnly
              />
            </div>
          ))}
        </div>
        <div className="action-buttons-container">
          <button onClick={handleStartAgain} className="try-again-button">
            Start Again ↻
          </button>
        </div>
      </div>
    </div>
  );
};
export default WB_Unit3_Page15_Q2;

/* eslint-disable react-refresh/only-export-components -- Exercise-local controls preserve the shared components. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import sound0 from "../../../assets/audio/WorkBook/Unit 4/Page 23 - F/Item_001_Do_you_want_a_car.mp3";
import sound1 from "../../../assets/audio/WorkBook/Unit 4/Page 23 - F/Item_002_dolls.mp3";
import sound2 from "../../../assets/audio/WorkBook/Unit 4/Page 23 - F/Item_003_teddy_bear.mp3";
import sound3 from "../../../assets/audio/WorkBook/Unit 4/Page 23 - F/Item_004_tennis_rackets.mp3";
import sound4 from "../../../assets/audio/WorkBook/Unit 4/Page 23 - F/Item_005_soccer_ball.mp3";
import sound5 from "../../../assets/audio/WorkBook/Unit 4/Page 23 - F/Item_006_computer.mp3";
import sound6 from "../../../assets/audio/WorkBook/Unit 4/Page 23 - F/Item_007_car.mp3";
import React, { useState, useRef, useEffect } from "react";
import { toPng } from "html-to-image";
import ValidationAlert from "../../Popup/ValidationAlert";
import { FaDownload } from "react-icons/fa6";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page23/Ex F 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page23/Ex F 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page23/Ex F 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page23/Ex F 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page23/Ex F 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page23/Ex F 6.svg";
const friendActivityData = [
  {
    id: "f1",
    item: "dolls",
    img: img1,
  },
  {
    id: "f2",
    item: "teddy bear",
    img: img2,
  },
  {
    id: "f3",
    item: "tennis rackets",
    img: img3,
  },
  {
    id: "f4",
    item: "soccer ball",
    img: img4,
  },
  {
    id: "f5",
    item: "computer",
    img: img5,
  },
  {
    id: "f6",
    item: "car",
    img: img6,
  },
];
const IMAGE_DESCRIPTIONS = {
  [img1]: "A doll.",
  [img2]: "A teddy bear wearing a scarf.",
  [img3]: "Two tennis rackets.",
  [img4]: "A soccer ball.",
  [img5]: "A desktop computer with a keyboard and mouse.",
  [img6]: "A red car.",
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
  "do you want a car": sound0,
  dolls: sound1,
  "teddy bear": sound2,
  "tennis rackets": sound3,
  "soccer ball": sound4,
  computer: sound5,
  car: sound6,
};
const soundFor = (text) =>
  SOUNDS[
    String(text)
      .toLowerCase()
      .replace(/[.,!?]/g, "")
      .trim()
  ];
const WB_Unit4_Page23_Q2 = () => {
  const [friendAnswers, setFriendAnswers] = useState({});
  const [askedItem, setAskedItem] = useState("");
  const [showResults, setShowResults] = useState(false);
  const captureRef = useRef(null);
  const { rootRef, playingKey, playSound, stopAudio } = useExerciseAudio();
  const [message, setMessage] = useState("");
  useCheckButton(rootRef, showResults);
  const handleCellClick = (itemId, friend) => {
    if (showResults) return;
    const cellId = `${itemId}-${friend}`;
    setMessage(
      itemId +
        ", " +
        friend +
        ": " +
        (friendAnswers[cellId] === "Yes"
          ? "No"
          : friendAnswers[cellId] === "No"
            ? "Empty"
            : "Yes"),
    );
    setFriendAnswers((prev) => {
      const currentAnswer = prev[cellId];
      if (currentAnswer === "Yes")
        return {
          ...prev,
          [cellId]: "No",
        };
      if (currentAnswer === "No")
        return {
          ...prev,
          [cellId]: undefined,
        };
      return {
        ...prev,
        [cellId]: "Yes",
      };
    });
  };
  const handleStartAgain = () => {
    stopAudio();
    setMessage("Activity reset.");
    setFriendAnswers({});
    setAskedItem("");
    setShowResults(false);
  };
  const checkAnswers = () => {
    if (showResults) return;

    // ✅ تحقق من كل الخانات
    const allFilled = friendActivityData.every((item) => {
      const f1 = friendAnswers[`${item.id}-friend1`];
      const f2 = friendAnswers[`${item.id}-friend2`];
      return f1 && f2;
    });
    if (!allFilled) {
      setMessage("Please answer all cells first.");
      ValidationAlert.info("Please answer all cells first.");
      return;
    }

    // ✅ إذا كله تمام
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
        <div
          className="div-forall"
          style={{
            gap: "35px",
          }}
        >
          <ExerciseHeader
            isWorkbook
            sectionLetter="F"
            title={<>Ask your friend. Write "Yes" or "No."</>}
            subTitle={"Ask each question aloud and record your partner's Yes or No answer in the correct box."}
          />
          <div className="flex flex-col gap-5">
            <div className="mb-4 p-3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center gap-2">
              <p className="text-lg font-medium">Do you want</p>
              <input
                type="text"
                value={askedItem}
                onChange={(e) => setAskedItem(e.target.value)}
                aria-label="Item to ask your friends about"
                placeholder="a car"
                style={{
                  borderRadius: 0,
                }}
                className={`${focusClass} focus-visible:rounded-sm! w-32 text-center bg-transparent border-b-2 border-gray-400 focus:border-blue-500 text-lg font-semibold`}
              />
              <p className="text-lg font-medium">?</p>
            </div>

            <table className="w-full border-collapse mb-20">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border border-gray-300 text-left text-lg">
                    Item
                  </th>
                  <th className="p-3 border border-gray-300 text-lg">
                    friend 1
                  </th>
                  <th className="p-3 border border-gray-300 text-lg">
                    friend 2
                  </th>
                </tr>
              </thead>
              <tbody>
                {friendActivityData.map((item) => (
                  <tr key={item.id} className="text-center">
                    <td className="p-3 border border-gray-300 flex items-center justify-between">
                      <AudioText
                        audioKey={"item-" + item.id}
                        src={soundFor(item.item)}
                        playSound={playSound}
                        playingKey={playingKey}
                        className="text-lg"
                      >
                        {item.item}
                      </AudioText>
                      <img
                        src={item.img}
                        alt={IMAGE_DESCRIPTIONS[item.img]}
                        className="max-w-12 max-h-12"
                      />
                    </td>
                    <td
                      className={`${focusClass} p-3 border border-gray-300 cursor-pointer hover:bg-gray-50`}
                      role="button"
                      tabIndex={0}
                      aria-label={
                        item.item +
                        ", friend 1: " +
                        (friendAnswers[item.id + "-friend1"] || "Empty") +
                        ". Press to cycle Yes, No, Empty."
                      }
                      aria-disabled={showResults}
                      onKeyDown={activate}
                      onKeyUp={release}
                      style={{
                        borderRadius: 4,
                      }}
                      onClick={() => handleCellClick(item.id, "friend1")}
                    >
                      <span
                        className={`text-xl font-bold ${friendAnswers[`${item.id}-friend1`] === "Yes" ? "text-green-600" : "text-red-600"}`}
                      >
                        {friendAnswers[`${item.id}-friend1`]}
                      </span>
                    </td>
                    <td
                      className={`${focusClass} p-3 border border-gray-300 cursor-pointer hover:bg-gray-50`}
                      role="button"
                      tabIndex={0}
                      aria-label={
                        item.item +
                        ", friend 2: " +
                        (friendAnswers[item.id + "-friend2"] || "Empty") +
                        ". Press to cycle Yes, No, Empty."
                      }
                      aria-disabled={showResults}
                      onKeyDown={activate}
                      onKeyUp={release}
                      style={{
                        borderRadius: 4,
                      }}
                      onClick={() => handleCellClick(item.id, "friend2")}
                    >
                      <span
                        className={`text-xl font-bold ${friendAnswers[`${item.id}-friend2`] === "Yes" ? "text-green-600" : "text-red-600"}`}
                      >
                        {friendAnswers[`${item.id}-friend2`]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
export default WB_Unit4_Page23_Q2;

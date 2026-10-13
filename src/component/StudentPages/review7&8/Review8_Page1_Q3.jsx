import React, { useEffect, useRef, useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";
import img1 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 72/Ex B 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 72/Ex B 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 72/Ex B 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 72/Ex B 4.svg";
import img5 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 72/Ex B 5.svg";
import img6 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 72/Ex B 6.svg";
import trueIcon from "../../../assets/imgs/true.svg";
import falseIcon from "../../../assets/imgs/false.svg";
import sound1 from "../../../assets/audio/ClassBook/U 8/Page 72 - C/Item_001_I_have_three_dresses.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 8/Page 72 - C/Item_002_She_has_two_pairs_of_shoes.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 8/Page 72 - C/Item_003_She_has_two_skirts.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 8/Page 72 - C/Item_004_She_has_six_skirts.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 8/Page 72 - C/Item_005_I_have_two_caps.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 8/Page 72 - C/Item_006_He_has_five_pairs_of_pants.mp3";

const items = [
  {
    img: img1,
    text: "I have three dresses.",
    correct: "yes",
    audio: sound1,
    alt: "Blue, orange, and green dresses hanging in a wardrobe.",
  },
  {
    img: img4,
    text: "She has two pairs of shoes.",
    correct: "yes",
    audio: sound2,
    alt: "Pink and yellow pairs of shoes on a shelf.",
  },
  {
    img: img2,
    text: "She has two skirts.",
    correct: "no",
    audio: sound3,
    alt: "A girl holding a red skirt beside yellow, pink, and green skirts.",
  },
  {
    img: img5,
    text: "She has six skirts.",
    correct: "no",
    audio: sound4,
    alt: "Red, yellow, and blue skirts hanging in a wardrobe.",
  },
  {
    img: img3,
    text: "I have two caps.",
    correct: "yes",
    audio: sound5,
    alt: "A girl wearing a straw hat and holding a green cap, with a brown cap on display.",
  },
  {
    img: img6,
    text: "He has five pairs of pants.",
    correct: "no",
    audio: sound6,
    alt: "Two boys holding shorts beside a rack of shorts.",
  },
];
const focusClass =
  " rounded-md focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!";
const isActivateKey = (e) => e.key === "Enter" || e.key === " ";

const Review8_Page1_Q3 = () => {
  const [selected, setSelected] = useState(Array(items.length).fill(""));
  const [locked, setLocked] = useState(false);
  const [results, setResults] = useState(Array(items.length).fill(null));
  const [announcement, setAnnouncement] = useState("");
  const [playingKey, setPlayingKey] = useState(null);
  const audioRef = useRef(null);
  const isLocked = (i) => locked || results[i] === "correct";
  const stopAudio = () => {
    const audio = audioRef.current;
    audioRef.current = null;
    setPlayingKey(null);
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
    }
  };
  const playSentence = (i) => {
    stopAudio();
    const audio = new Audio(items[i].audio);
    audioRef.current = audio;
    setPlayingKey(i);
    const finish = () => {
      if (audioRef.current !== audio) return;
      audioRef.current = null;
      audio.onended = null;
      audio.onerror = null;
      setPlayingKey(null);
    };
    const fail = () => {
      if (audioRef.current !== audio) return;
      finish();
      setAnnouncement("Audio could not be played. Please try again.");
    };
    audio.onended = finish;
    audio.onerror = fail;
    try {
      audio.play().catch(fail);
    } catch {
      fail();
    }
  };
  useEffect(
    () => () => {
      const audio = audioRef.current;
      audioRef.current = null;
      if (audio) {
        audio.onended = null;
        audio.onerror = null;
        audio.pause();
      }
    },
    [],
  );

  const choose = (i, value) => {
    if (isLocked(i)) {
      setAnnouncement(
        `Question ${i + 1} is locked. Press Start Again to try again.`,
      );
      return;
    }
    setSelected((previous) =>
      previous.map((answer, index) => (index === i ? value : answer)),
    );
    setResults((previous) =>
      previous.map((result, index) => (index === i ? null : result)),
    );
    setAnnouncement(
      `Question ${i + 1}: ${value === "yes" ? "tick" : "cross"} selected.`,
    );
  };
  const checkAnswers = () => {
    if (locked) return;
    stopAudio();
    if (selected.includes("")) {
      ValidationAlert.info("Please answer all questions.");
      setAnnouncement("Please answer all questions.");
      return;
    }
    const nextResults = items.map((item, i) =>
      results[i] === "correct" || selected[i] === item.correct
        ? "correct"
        : "wrong",
    );
    setResults(nextResults);
    const score = nextResults.filter((result) => result === "correct").length;
    const total = items.length;
    const color = score === total ? "green" : score === 0 ? "red" : "orange";
    const msg = `<div style="font-size:20px;text-align:center;"><span style="color:${color};font-weight:bold">Score: ${score} / ${total}</span></div>`;
    if (score === total) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
    setLocked(score === total);
    setAnnouncement(
      [
        `Score ${score} out of ${total}.`,
        ...nextResults.map(
          (result, i) =>
            `Question ${i + 1} is ${result === "correct" ? "correct and locked" : "incorrect"}.`,
        ),
        score < total
          ? "You can change the incorrect answers and check again."
          : "",
      ]
        .filter(Boolean)
        .join(" "),
    );
  };
  const showAnswers = () => {
    stopAudio();
    setSelected(items.map((item) => item.correct));
    setResults(Array(items.length).fill("correct"));
    setLocked(true);
    setAnnouncement("All correct answers shown and locked.");
  };
  const reset = () => {
    stopAudio();
    setSelected(Array(items.length).fill(""));
    setResults(Array(items.length).fill(null));
    setLocked(false);
    setAnnouncement("Activity reset. All answers and results cleared.");
  };
  const choiceProps = (i, value) => ({
    type: "button",
    "aria-pressed": selected[i] === value,
    "aria-disabled": isLocked(i),
    "aria-label": `Question ${i + 1}: ${value === "yes" ? "Tick, sentence matches the picture" : "Cross, sentence does not match the picture"}${selected[i] === value && results[i] ? (results[i] === "correct" ? ", correct and locked" : ", incorrect, you can change it") : ""}`,
    style:
      selected[i] === value && results[i]
        ? {
            borderColor: results[i] === "correct" ? "#16a34a" : "#ef4444",
            boxShadow: results[i] === "correct" ? "0 2px 0 #16a34a" : undefined,
          }
        : undefined,
    onKeyDown: (e) => {
      if (!isActivateKey(e)) return;
      e.preventDefault();
      e.stopPropagation();
      if (!e.repeat) e.currentTarget.click();
    },
    onKeyUp: (e) => {
      if (!isActivateKey(e)) return;
      e.preventDefault();
      e.stopPropagation();
    },
  });

  return (
    <div className="main-container-component">
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>
      <div className="div-forall" style={{gap:"10px"}}>
        <ExerciseHeader
          sectionLetter="C"
          isReview={true}
          title={"Look, read, and write ✓ or ✗."}
          subTitle={
            "Read the clue completely, then tap the option that best matches it."
          }
        />
        <div className="grid grid-cols-2 gap-x-16 gap-y-2 w-full">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 w-full"
              style={{ justifyContent: "space-between" }}
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xl w-4">{i + 1}</span>
                  <img
                    src={item.img}
                    alt={item.alt}
                    style={{ width: "auto", height: "90px" }}
                    className="rounded-lg"
                  />
                </div>
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`${item.text} Press Enter or Space to listen.`}
                  className={`relative ml-10 text-[20px] w-[60%] cursor-pointer${focusClass}`}
                  style={
                    playingKey === i
                      ? {
                          outline: "4px solid #2563eb",
                          outlineOffset: 2,
                          backgroundColor: "#dbeafe",
                        }
                      : undefined
                  }
                  onClick={() => playSentence(i)}
                  onKeyDown={(e) => {
                    if (isActivateKey(e)) {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!e.repeat) playSentence(i);
                    }
                  }}
                  onKeyUp={(e) => {
                    if (isActivateKey(e)) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                >
                  {item.text}
                  {playingKey === i && (
                    <span
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        top: -10,
                        right: -10,
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        pointerEvents: "none",
                        zIndex: 3,
                        background: "#fff",
                        color: "#000",
                        boxShadow: "0 1px 3px rgba(0,0,0,.25)",
                      }}
                    >
                      <FaVolumeUp size={12} />
                    </span>
                  )}
                </span>
              </div>
              <div className="flex flex-col gap-2 justify-center h-[150px]">
                {["yes", "no"].map((value) => (
                  <div key={value} className="relative">
                    <button
                      {...choiceProps(i, value)}
                      onClick={() => choose(i, value)}
                      className={`w-10 h-10 border flex items-center justify-center rounded text-lg ${selected[i] === value ? "border-2 border-blue-800 bg-blue-100 text-black" : ""}${focusClass}`}
                    >
                      <img
                        src={value === "yes" ? trueIcon : falseIcon}
                        alt=""
                        aria-hidden="true"
                        style={{ height: "25px", width: "auto" }}
                      />
                    </button>
                    {results[i] === "wrong" && selected[i] === value && (
                      <div
                        aria-hidden="true"
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow border-2 border-white"
                      >
                        ✕
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>
          <button onClick={showAnswers} className="show-answer-btn">
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
export default Review8_Page1_Q3;

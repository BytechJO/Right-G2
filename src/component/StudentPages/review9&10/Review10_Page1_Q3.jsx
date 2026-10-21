import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 90/Ex C 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 90/Ex C 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 90/Ex C 3.svg";

import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/ClassBook/U 10/Page 90 - C/Item_001_Is_she_cooking.mp3";
import clip1 from "../../../assets/audio/ClassBook/U 10/Page 90 - C/Item_002_Yes,_she_is.mp3";
import clip2 from "../../../assets/audio/ClassBook/U 10/Page 90 - C/Item_003_No,_she_isn't.mp3";
import clip3 from "../../../assets/audio/ClassBook/U 10/Page 90 - C/Item_004_Is_he_sleeping.mp3";
import clip4 from "../../../assets/audio/ClassBook/U 10/Page 90 - C/Item_005_Yes,_he_is.mp3";
import clip5 from "../../../assets/audio/ClassBook/U 10/Page 90 - C/Item_006_No,_he_isn't.mp3";
import clip6 from "../../../assets/audio/ClassBook/U 10/Page 90 - C/Item_007_Are_they_listening_to_a_song.mp3";
import clip7 from "../../../assets/audio/ClassBook/U 10/Page 90 - C/Item_008_Yes,_they_are.mp3";
import clip8 from "../../../assets/audio/ClassBook/U 10/Page 90 - C/Item_009_No,_they_aren't.mp3";
const clips = {
  "Is she cooking": clip0,
  "Yes, she is": clip1,
  "No, she isn't": clip2,
  "Is he sleeping": clip3,
  "Yes, he is": clip4,
  "No, he isn't": clip5,
  "Are they listening to a song": clip6,
  "Yes, they are": clip7,
  "No, they aren't": clip8,
};
const Review10_Page1_Q3 = () => {
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

  const [announcement, setAnnouncement] = useState("");
  const [playingKey, setPlayingKey] = useState(null);
  const audioRef = useRef(null),
    scopeRef = useRef(null);
  const normalizeAudioText = (text) =>
    text.replaceAll("’", "'").replace(/[.?!]$/, "");
  const stopAudio = () => {
    const a = audioRef.current;
    audioRef.current = null;
    setPlayingKey(null);
    if (a) {
      a.onended = null;
      a.onerror = null;
      a.pause();
    }
    scopeRef.current?.querySelectorAll("audio").forEach((a) => {
      a.pause();
      try {
        a.currentTime = 0;
      } catch {
        /* media unavailable */
      }
    });
  };
  const listen = (key, text) => {
    const src = clips[normalizeAudioText(text)];
    if (!src) return;
    stopAudio();
    const a = new Audio(src);
    audioRef.current = a;
    setPlayingKey(key);
    const finish = () => {
      if (audioRef.current !== a) return;
      audioRef.current = null;
      a.onended = null;
      a.onerror = null;
      setPlayingKey(null);
    };
    const fail = () => {
      if (audioRef.current !== a) return;
      a.pause();
      finish();
      setAnnouncement("Audio could not be played. Please try again.");
    };
    a.onended = finish;
    a.onerror = fail;
    try {
      a.play().catch(fail);
    } catch {
      fail();
    }
  };
  useEffect(() => {
    const otherPlay = (e) => {
      const a = audioRef.current;
      if (!a || e.target === a) return;
      audioRef.current = null;
      a.onended = null;
      a.onerror = null;
      a.pause();
      setPlayingKey(null);
    };
    document.addEventListener("play", otherPlay, true);
    return () => {
      document.removeEventListener("play", otherPlay, true);
      const a = audioRef.current;
      audioRef.current = null;
      if (a) {
        a.onended = null;
        a.onerror = null;
        a.pause();
      }
    };
  }, []);
  const badge = (key) =>
    playingKey === key && (
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
          background: "white",
          color: "black",
          pointerEvents: "none",
          zIndex: 3,
          boxShadow: "0 1px 3px rgba(0,0,0,.25)",
        }}
      >
        <FaVolumeUp size={12} />
      </span>
    );
  const activation = (e, action) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      if (!e.repeat) action();
    }
  };
  const activationUp = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  const feedbackStyle = (selected, result) => ({
    ...(selected && result
      ? {
          borderColor: result === "correct" ? "#16a34a" : "#ef4444",
          boxShadow: result === "correct" ? "0 3px 0 #16a34a" : undefined,
        }
      : {}),
    ...(selected ? { backgroundColor: "#dbeafe" } : {}),
  });

  const items = [
    {
      img: img1,
      text: "Is she cooking?",
      sentence: ["Yes, she is.", "No, she isn’t."],
      correct: "No, she isn’t.",
    },
    {
      img: img2,
      text: "Is he sleeping?",
      sentence: ["Yes, he is.", "No, he isn’t."],
      correct: "No, he isn’t.",
    },
    {
      img: img3,
      text: "Are they listening to a song?",
      sentence: ["Yes, they are.", "No, they aren’t."],
      correct: "Yes, they are.",
    },
  ];

  const [selected, setSelected] = useState(Array(items.length).fill(""));
  const [, setShowWrongMarks] = useState(false);
  const [results, setResults] = useState([]);
  const [locked, setLocked] = useState(false);
  const choose = (index, value) => {
    listen("choice-" + index + "-" + value, value);
    if (locked || results[index] === "correct") return;
    setSelected((prev) => prev.map((v, i) => (i === index ? value : v)));
    setResults((prev) => prev.map((v, i) => (i === index ? null : v)));
    setAnnouncement("Question " + (index + 1) + ": " + value + " selected.");
  };
  const checkAnswers = (checkEvent) => {
    if (completedCheckRef.current) { completeCheck(checkEvent); return; }

    if (locked) return;
    stopAudio();

    if (selected.includes("")) {
      ValidationAlert.info("Please answer all questions.");
      setAnnouncement("Please answer all questions.");
      return;
    }

    let score = 0;

    items.forEach((item, i) => {
      if (selected[i] === item.correct) score++;
    });

    const total = items.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
        Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) (completeCheck(checkEvent), ValidationAlert.success(msg));
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
    setShowWrongMarks(true);
    setResults(
      items.map((item, i) =>
        selected[i] === item.correct ? "correct" : "wrong",
      ),
    );
    setLocked(score === total);
    setAnnouncement(`Score ${score} out of ${total}.`);
  };

  const reset = () => {
    stopAudio();
    setResults([]);
    setAnnouncement("Activity reset. All answers cleared.");
    setSelected(Array(items.length).fill(""));
    setLocked(false);
    setShowWrongMarks(false);
  };

  const showAnswers = () => {
    stopAudio();
    setResults(items.map(() => "correct"));
    setAnnouncement("All correct answers shown and locked.");
    setSelected(items.map((i) => i.correct));
    setLocked(true);
    setShowWrongMarks(false);
  };
  const choiceProps = (index, value) => ({
    role: "button",
    tabIndex: 0,
    "aria-pressed": selected[index] === value,
    "aria-disabled": locked || results[index] === "correct",
    "aria-label":
      "Question " +
      (index + 1) +
      ": " +
      value +
      (locked || results[index] === "correct" ? ". Answer locked." : ""),
    className:
      "rounded-full focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!",
    onKeyDown: (e) => activation(e, () => choose(index, value)),
    onKeyUp: activationUp,
  });
  return (
    <div ref={scopeRef} className="main-container-component">
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>
      <div className="div-forall">
        <div className="header-title-page8 mb-10">
          <ExerciseHeader
            isReview={true}
            sectionLetter="C"
            title={"Look, read, and circle."}
            subTitle={"Read the clue and check the picture, then tap the one answer that matches."}
          />
        </div>

        {/* GRID */}
        <div className="grid grid-cols-3 gap-3">
          {items.map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-xl mb-2">
                <span
                  style={{
                    fontWeight: "bold",
                    marginRight: "4px",
                  }}
                >
                  {i + 1}{" "}
                </span>
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`Hear ${item.text}`}
                  className="relative rounded-md focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!"
                  onClick={() => listen(`question-${i}`, item.text)}
                  onKeyDown={(e) =>
                    activation(e, () => listen(`question-${i}`, item.text))
                  }
                  onKeyUp={activationUp}
                >
                  {item.text}
                  {badge(`question-${i}`)}
                </span>
              </div>

              <img
                src={item.img}
                alt={
                  [
                    "A girl running.",
                    "A boy throwing a ball.",
                    "Two children dancing beside musical notes.",
                  ][i]
                }
                style={{
                  display: "block",
                  margin: "0 auto",
                  marginBottom: "1rem",
                  width: "auto",
                  height: "200px",
                }}
              />

              {/* الخيارات */}
              <div className="bg-[#e6d1c3] p-3 rounded-xl inline-block">
                {item.sentence.map((opt, idx) => {
                  const isSelected = selected[i] === opt;

                  const isWrong =
                    results[i] === "wrong" &&
                    isSelected &&
                    opt !== item.correct;

                  return (
                    <div
                      key={idx}
                      {...choiceProps(i, opt)}
                      style={feedbackStyle(isSelected, results[i])}
                      onClick={() => choose(i, opt)}
                      className={`cursor-pointer focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4! px-3 py-1 rounded-full mb-1 relative
        ${isSelected ? "border-2 border-red-500" : ""}
      `}
                    >
                      {opt}
                      {badge(`choice-${i}-${opt}`)}

                      {isWrong && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow border-2 border-white">
                          ✕
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* buttons */}
        <div className="action-buttons-container">
          <button onClick={(checkEvent) => { resetCompletedCheck(); (reset)(checkEvent); }} className="try-again-button">
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

export default Review10_Page1_Q3;

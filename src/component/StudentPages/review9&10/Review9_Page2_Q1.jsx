import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 89/Ex D 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 89/Ex D 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 89/Ex D 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 89/Ex D 4.svg";
import img5 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 89/Ex D 5.svg";
import sound1 from "../../../assets/audio/ClassBook/U 10/cd62pg89-instuction1-adult-lady_WFBZXKxh.mp3";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";

import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/ClassBook/U 10/Page 89 - D/Item_001_short_a.mp3";
import clip1 from "../../../assets/audio/ClassBook/U 10/Page 89 - D/Item_002_long_a.mp3";
const clips = { "short a": clip0, "long a": clip1 };
const Review9_Page2_Q1 = () => {
  const [announcement, setAnnouncement] = useState("");
  const [playingKey, setPlayingKey] = useState(null);
  const [forceStopAudio, setForceStopAudio] = useState(false);
  const audioRef = useRef(null),
    scopeRef = useRef(null);
  const normalizeAudioText = (text) =>
    text.replaceAll("’", "'").replace(/[.?!]$/, "");
  const stopAudio = (resetInstruction = false) => {
    setForceStopAudio(true);
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
      if (!resetInstruction) return;
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

  const stopAtSecond = 9.1;

  const captions = [
    {
      start: 0.5,
      end: 9.099,
      text: "Page eighty-nine, review 9, exercise D. Does it have a short or long A? Listen, read, and circle.",
    },
    { start: 10.179, end: 11.619, text: "1, train." },
    { start: 12.719, end: 21.899, text: "2, ant. 3, cane. 4, cap. 5, hat." },
  ];
  const questions = [
    { img: img1, answer: "long" },
    { img: img2, answer: "short" },
    { img: img3, answer: "long" },
    { img: img4, answer: "short" },
    { img: img5, answer: "short" },
  ];

  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [results, setResults] = useState([]);
  const [locked, setLocked] = useState(false);
  const [, setShowWrongMarks] = useState(false);

  const choose = (index, value) => {
    if (locked || results[index] === "correct") return;
    listen(`choice-${index}-${value}`, value + " a");
    setResults((prev) => prev.map((r, i) => (i === index ? null : r)));
    setAnnouncement(`Question ${index + 1}: ${value} selected.`);

    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const resetAll = () => {
    stopAudio(true);
    setResults([]);
    setAnnouncement("Activity reset. All answers cleared.");
    setAnswers(Array(questions.length).fill(""));
    setLocked(false);
    setShowWrongMarks(false);
  };

  const showAnswers = () => {
    stopAudio();
    setResults(questions.map(() => "correct"));
    setAnnouncement("All correct answers shown and locked.");
    setAnswers(questions.map((q) => q.answer));
    setLocked(true);
    setShowWrongMarks(false);
  };

  const checkAnswers = () => {
    if (locked) return;
    stopAudio();

    if (answers.includes("")) {
      ValidationAlert.info("Please complete all answers");
      setAnnouncement("Please complete all answers");
      return;
    }

    let score = 0;

    answers.forEach((a, i) => {
      if (a === questions[i].answer) score++;
    });

    const total = questions.length;
    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const message = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) ValidationAlert.success(message);
    else if (score === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);

    setShowWrongMarks(true);
    setResults(
      questions.map((q, i) => (answers[i] === q.answer ? "correct" : "wrong")),
    );
    setLocked(score === total);
    setAnnouncement(
      `Score ${score} out of ${total}. Incorrect answers can be changed.`,
    );
  };

  const choiceProps = (index, value) => ({
    role: "button",
    tabIndex: 0,
    "aria-pressed": answers[index] === value,
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
    <div ref={scopeRef} className="main-container-component" onPlayCapture={() => setForceStopAudio(false)}>
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>
      <div className="div-forall" style={{ gap: "20px" }}>
        <div className="header-title-page8 mb-10">
          <ExerciseHeader
            isReview={true}
            sectionLetter="D"
            title={
              "Does it have a short a or long a? Listen, read, and circle."
            }
            subTitle={
              "Listen to both sounds carefully, then choose Yes/No only after comparing them."
            }
          />
        </div>
        <div className="flex flex-col gap-10">
          <QuestionAudioPlayer
            pageId="sb_review9_page2_q1"
            forceStop={forceStopAudio}
            onInteract={() => setForceStopAudio(false)}
            src={sound1}
            captions={captions}
            stopAtSecond={stopAtSecond}
          />

          <div className="grid grid-cols-5 gap-6 text-center mt-5">
            {questions.map((q, index) => {
              const isWrong =
                results[index] === "wrong" &&
                answers[index] !== "" &&
                answers[index] !== q.answer;

              return (
                <div key={index} className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <img
                      src={q.img}
                      alt={
                        [
                          "A colourful toy train.",
                          "An ant.",
                          "A curved wooden walking stick.",
                          "A red cap.",
                          "A pink hat with a flower.",
                        ][index]
                      }
                      style={{
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />

                    <div className="absolute -top-3 -left-3 font-bold text-lg">
                      {index + 1}
                    </div>
                  </div>

                  <div className="bg-[#ead6cc] rounded-xl px-4 py-2 flex flex-col gap-1">
                    {["short", "long"].map((type) => {
                      const selected = answers[index] === type;

                      return (
                        <div key={type} className="relative">
                          <div
                            {...choiceProps(index, type)}
                            style={feedbackStyle(selected, results[index])}
                            onClick={() => choose(index, type)}
                            className={`cursor-pointer focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4! px-2 py-1 rounded-full relative
                            ${
                              selected
                                ? "border-2 border-red-500"
                                : "border-2 border-transparent"
                            }`}
                          >
                            {type} a{badge(`choice-${index}-${type}`)}
                          </div>

                          {selected && isWrong && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold shadow-md border-2 border-white">
                              ✕
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="action-buttons-container mt-10">
        <button onClick={resetAll} className="try-again-button">
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
  );
};

export default Review9_Page2_Q1;

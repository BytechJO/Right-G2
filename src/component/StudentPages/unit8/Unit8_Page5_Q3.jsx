import React, { useEffect, useRef, useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";
import img from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 68/Ex B 1.svg";
import booksAudio from "../../../assets/audio/ClassBook/U 8/Page 68 - B/Item_001_How_many_books_do_you_have.mp3";
import eightAudio from "../../../assets/audio/ClassBook/U 8/Page 68 - B/Item_002_eight.mp3";
import nineAudio from "../../../assets/audio/ClassBook/U 8/Page 68 - B/Item_003_nine.mp3";
import tenAudio from "../../../assets/audio/ClassBook/U 8/Page 68 - B/Item_004_ten.mp3";
import crayonsAudio from "../../../assets/audio/ClassBook/U 8/Page 68 - B/Item_005_How_many_crayons_do_you_have.mp3";
import elevenAudio from "../../../assets/audio/ClassBook/U 8/Page 68 - B/Item_006_eleven.mp3";
import pensAudio from "../../../assets/audio/ClassBook/U 8/Page 68 - B/Item_007_How_many_pens_do_you_have.mp3";
import twoAudio from "../../../assets/audio/ClassBook/U 8/Page 68 - B/Item_008_two.mp3";
import threeAudio from "../../../assets/audio/ClassBook/U 8/Page 68 - B/Item_009_three.mp3";
import fourAudio from "../../../assets/audio/ClassBook/U 8/Page 68 - B/Item_010_four.mp3";

const keyboardFocusClass =
  "rounded focus-visible:outline-2! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-2!";
const optionAudio = {
  eight: eightAudio,
  nine: nineAudio,
  ten: tenAudio,
  eleven: elevenAudio,
  two: twoAudio,
  three: threeAudio,
  four: fourAudio,
};

const Unit8_Page5_Q3 = () => {
  const questions = [
    {
      id: 1,
      question: "How many books do you have?",
      answer: "nine",
      options: ["eight", "nine", "ten"],
      type: "books",
      audio: booksAudio,
    },
    {
      id: 2,
      question: "How many crayons do you have?",
      answer: "ten",
      options: ["nine", "ten", "eleven"],
      type: "crayons",
      audio: crayonsAudio,
    },
    {
      id: 3,
      question: "How many pens do you have?",
      answer: "three",
      options: ["two", "three", "four"],
      type: "pens",
      audio: pensAudio,
    },
  ];

  const [answers, setAnswers] = useState({
    1: "",
    2: "",
    3: "",
  });
  const [results, setResults] = useState({});
  const [locked, setLocked] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [playingKey, setPlayingKey] = useState(null);
  const audioRef = useRef(null);
  const isLocked = (id) => locked || results[id] === "correct";
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
  const playAudio = (src, key) => {
    if (!src) return;
    stopAudio();
    document.querySelectorAll("audio").forEach((audio) => audio.pause());
    const audio = new Audio(src);
    audioRef.current = audio;
    setPlayingKey(key);
    const finish = () => {
      if (audioRef.current !== audio) return;
      audioRef.current = null;
      setPlayingKey(null);
      audio.onended = null;
      audio.onerror = null;
    };
    const fail = () => {
      if (audioRef.current !== audio) return;
      finish();
      setAnnouncement("Audio could not be played. Please try again.");
    };
    audio.onended = finish;
    audio.onerror = fail;
    audio.play().catch(fail);
  };
  useEffect(() => {
    const onOtherPlay = (event) => {
      if (event.target === audioRef.current) return;
      const audio = audioRef.current;
      audioRef.current = null;
      setPlayingKey(null);
      if (audio) {
        audio.onended = null;
        audio.onerror = null;
        audio.pause();
      }
    };
    document.addEventListener("play", onOtherPlay, true);
    return () => {
      document.removeEventListener("play", onOtherPlay, true);
      const audio = audioRef.current;
      audioRef.current = null;
      if (audio) {
        audio.onended = null;
        audio.onerror = null;
        audio.pause();
      }
    };
  }, []);
  const onActivateKeyDown = (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    e.stopPropagation();
    if (!e.repeat) e.currentTarget.click();
  };
  const onActivateKeyUp = (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    e.stopPropagation();
  };
  const selectAnswer = (q, opt) => {
    playAudio(optionAudio[opt], `option-${q.id}-${opt}`);
    if (isLocked(q.id)) {
      setAnnouncement(
        `Question ${q.id} is locked. Press Start Again to try again.`,
      );
      return;
    }
    setAnswers((previous) => ({ ...previous, [q.id]: opt }));
    setResults((previous) => ({ ...previous, [q.id]: null }));
    setAnnouncement(`Question ${q.id}: ${opt} selected.`);
  };

  const speakerBadge = (key) =>
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
          pointerEvents: "none",
          zIndex: 3,
          lineHeight: 1,
          background: "#fff",
          color: "#000",
          boxShadow: "0 1px 3px rgba(0,0,0,.25)",
        }}
      >
        <FaVolumeUp size={12} />
      </span>
    );

  const reset = () => {
    stopAudio();
    setAnswers({ 1: "", 2: "", 3: "" });
    setLocked(false);
    setResults({});
    setAnnouncement(
      "Exercise reset. All answers, locks, and feedback are cleared.",
    );
  };

  const showAnswers = () => {
    stopAudio();
    const filled = {};
    questions.forEach((q) => {
      filled[q.id] = q.answer;
    });
    setAnswers(filled);
    setLocked(true);
    setResults(Object.fromEntries(questions.map((q) => [q.id, "correct"])));
    setAnnouncement(
      "Correct answers are shown and locked. Press Start Again to try again.",
    );
  };

  const checkAnswers = () => {
    if (locked) return;
    stopAudio();
    if (questions.some((q) => !answers[q.id])) {
      ValidationAlert.info("Please complete all answers.");
      setAnnouncement("Please complete all answers.");
      return;
    }

    let correct = 0;
    const checked = {};

    questions.forEach((q) => {
      checked[q.id] =
        results[q.id] === "correct" || answers[q.id] === q.answer
          ? "correct"
          : "wrong";
      if (checked[q.id] === "correct") correct++;
    });

    const total = questions.length;

    const color =
      correct === total ? "green" : correct === 0 ? "red" : "orange";

    const message = `
<div style="font-size:20px;text-align:center;">
<b style="color:${color};">Score: ${correct} / ${total}</b>
</div>
`;

    if (correct === total) ValidationAlert.success(message);
    else if (correct === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);

    setLocked(correct === total);
    setResults(checked);
    setAnnouncement(
      `Score ${correct} out of ${total}. ${questions
        .map(
          (q) =>
            `Question ${q.id}: ${checked[q.id] === "correct" ? "correct and locked" : "incorrect, you can change it"}.`,
        )
        .join(" ")}`,
    );
  };
  const isWrong = (id) => {
    return results[id] === "wrong";
  };
  return (
    <div
      className="main-container-component"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") e.stopPropagation();
      }}
      onKeyUp={(e) => {
        if (e.key === "Enter" || e.key === " ") e.stopPropagation();
      }}
    >
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>
      <p id="u8p5q3-help" className="sr-only">
        Use Tab and Shift+Tab to move between questions and options. Press Enter
        or Space on a question to listen, or on an option to listen and select
        it. After checking, correct answers are locked and incorrect answers can
        be changed.
      </p>
      <div className="div-forall" style={{ gap: "40px" }}>
        <div className="mb-8">
          <ExerciseHeader
            sectionLetter="B"
            title="Count and write."
            subTitle={"Count each item once from left to right, then tap the matching number."}
          />
        </div>

        {/* WORD BANK */}

        <div className="flex gap-10 items-center">
          {/* QUESTIONS */}

          <div className="flex-1">
            {questions.map((q) => (
              <div
                key={q.id}
                className="mb-2"
                role="group"
                aria-label={`Question ${q.id}`}
                aria-describedby="u8p5q3-help"
              >
                <div className="flex gap-3 text-lg items-center">
                  <span className="text-[#2e3192] font-bold">{q.id}</span>
                  <div className="flex w-full justify-between items-center">
                    <p
                      role="button"
                      tabIndex={0}
                      className={`relative ${keyboardFocusClass}`}
                      aria-label={`${q.question} Press Enter or Space to listen.`}
                      onClick={() => playAudio(q.audio, `question-${q.id}`)}
                      onKeyDown={onActivateKeyDown}
                      onKeyUp={onActivateKeyUp}
                    >
                      {q.question}
                      {speakerBadge(`question-${q.id}`)}
                    </p>
                    {/* OPTIONS FOR THIS QUESTION */}

                    <div className="flex gap-3 mt-3">
                      {q.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          aria-pressed={answers[q.id] === opt}
                          aria-disabled={isLocked(q.id)}
                          aria-label={`Question ${q.id}: ${opt}${
                            answers[q.id] === opt && results[q.id]
                              ? results[q.id] === "correct"
                                ? ", correct and locked"
                                : ", incorrect, you can change it"
                              : ""
                          }`}
                          onClick={() => selectAnswer(q, opt)}
                          onKeyDown={onActivateKeyDown}
                          onKeyUp={onActivateKeyUp}
                          style={
                            answers[q.id] === opt && results[q.id]
                              ? {
                                  borderColor:
                                    results[q.id] === "correct"
                                      ? "#16a34a"
                                      : "#ef4444",
                                  boxShadow:
                                    results[q.id] === "correct"
                                      ? "0 2px 0 #16a34a"
                                      : undefined,
                                }
                              : undefined
                          }
                          className={`relative px-3 py-1 rounded-lg border-2 ${keyboardFocusClass} ${answers[q.id] === opt ? "border-blue-900" : "border-gray-400"}`}
                        >
                          {opt}
                          {speakerBadge(`option-${q.id}-${opt}`)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="relative mt-2 h-10">
                  {/* ❌ */}
                  {isWrong(q.id) && (
                    <span
                      aria-hidden="true"
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-md"
                    >
                      ✕
                    </span>
                  )}

                  <div
                    className={`border-b-2 py-1 text-lg h-10 ${isWrong(q.id) ? "border-red-500" : results[q.id] === "correct" ? "border-green-600" : "border-black"}`}
                  >
                    <span className="text-blue-900 font-semibold">
                      {answers[q.id] && `I have ${answers[q.id]} ${q.type}.`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* IMAGE */}

          <img
            src={img}
            alt="A backpack with books, crayons, and pens scattered beside it."
            style={{ height: "300px", width: "auto" }}
          />
        </div>

        {/* BUTTONS */}

        <div className="action-buttons-container mt-10">
          <button
            type="button"
            onClick={reset}
            className={`try-again-button ${keyboardFocusClass}`}
          >
            Start Again ↻
          </button>

          <button
            onClick={showAnswers}
            type="button"
            className={`show-answer-btn swal-continue ${keyboardFocusClass}`}
          >
            Show Answer
          </button>

          <button
            type="button"
            onClick={checkAnswers}
            aria-disabled={locked}
            className={`check-button2 ${keyboardFocusClass}`}
          >
            Check Answer ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unit8_Page5_Q3;

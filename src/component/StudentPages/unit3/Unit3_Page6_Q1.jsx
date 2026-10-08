import React, { useState, useRef, useEffect } from "react";
import "./Unit3_Page6_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import img1 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 27/Ex D 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 27/Ex D 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 27/Ex D 3.svg";

// 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";

import sheSound from "../../../assets/audio/ClassBook/U 3/Page 27 - D/She.mp3";
import heSound from "../../../assets/audio/ClassBook/U 3/Page 27 - D/He.mp3";
import canSound from "../../../assets/audio/ClassBook/U 3/Page 27 - D/can.mp3";
import cantSound from "../../../assets/audio/ClassBook/U 3/Page 27 - D/can't.mp3";
import climbSound from "../../../assets/audio/ClassBook/U 3/Page 27 - D/climb a tree..mp3";
import drawSound from "../../../assets/audio/ClassBook/U 3/Page 27 - D/draw a picture..mp3";
import basketballSound from "../../../assets/audio/ClassBook/U 3/Page 27 - D/play basketball..mp3";
import drumSound from "../../../assets/audio/ClassBook/U 3/Page 27 - D/play the drum..mp3";
import rideSound from "../../../assets/audio/ClassBook/U 3/Page 27 - D/ride a bike..mp3";
import singSound from "../../../assets/audio/ClassBook/U 3/Page 27 - D/sing a song..mp3";
import photoSound from "../../../assets/audio/ClassBook/U 3/Page 27 - D/take a photo..mp3";

// 🔊 true = الصوت يشتغل تلقائياً لما الطالب يوقف على الخيار بالتاب
const PLAY_ON_FOCUS = true;

/* ================= DATA ================= */

// صوت كل خيار (بالنص نفسه الموجود بـ options)
const audioOf = {
  She: sheSound,
  He: heSound,
  can: canSound,
  "can't": cantSound,
  "climb a tree.": climbSound,
  "draw a picture.": drawSound,
  "play basketball.": basketballSound,
  "play the drum.": drumSound,
  "ride a bike.": rideSound,
  "sing a song.": singSound,
  "take a photo.": photoSound,
};

// ⚠️ الـ alt مؤقت: عدّليه حسب الصور (بدون ما تكتبي الجواب)
const questions = [
  {
    id: 1,
    alt: "A boy outdoors at a picnic",
    parts: [
      { type: "blank", options: ["She", "He"] },
      { type: "blank", options: ["can", "can't"] },
      {
        type: "blank",
        options: ["draw a picture.", "ride a bike.", "sing a song."],
      },
      { type: "text", value: "." },
    ],
    correct: ["He", "can't", "sing a song."],
    image: img1,
  },
  {
    id: 2,
    alt: "A boy outdoors at a picnic",
    parts: [
      { type: "blank", options: ["She", "He"] },
      { type: "blank", options: ["can", "can't"] },
      {
        type: "blank",
        options: ["play the drum.", "ride a bike.", "climb a tree."],
      },
      { type: "text", value: "." },
    ],
    correct: ["He", "can", "play the drum."],
    image: img2,
  },
  {
    id: 3,
    alt: "A girl outdoors at a picnic",
    parts: [
      { type: "blank", options: ["She", "He"] },
      { type: "blank", options: ["can", "can't"] },
      {
        type: "blank",
        options: ["draw a picture.", "take a photo.", "play basketball."],
      },
      { type: "text", value: "." },
    ],
    correct: ["She", "can", "take a photo."],
    image: img3,
  },
];

/* ================= HELPERS (خارج الكومبوننت) ================= */

// كل سؤال: مصفوفة بطول عدد الفراغات (null = ما اختار)
const emptyAnswers = () => questions.map((q) => q.correct.map(() => null));

const key = (qi, bi) => `${qi}-${bi}`;

const highlightStyle = {
  outline: "2px solid #2c5287",
  outlineOffset: "2px",
  borderRadius: "10px",
};

// eslint-disable-next-line react-refresh/only-export-components
const SpeakerIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    aria-hidden="true"
    style={{
      position: "absolute",
      top: "-6px",
      right: "-6px",
      background: "white",
      borderRadius: "50%",
    }}
  >
    <path
      fill="currentColor"
      d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"
    />
  </svg>
);

const Unit3_Page6_Q1 = () => {
  const [answers, setAnswers] = useState(emptyAnswers);
  const [results, setResults] = useState({}); // { "qi-bi": "correct" | "wrong" }
  const [score, setScore] = useState(null); // بينحسب بـ Check بس
  const [finished, setFinished] = useState(false); // كل شي صح بعد Check
  const [answerShown, setAnswerShown] = useState(false);
  const [message, setMessage] = useState(""); // رسائل لقارئ الشاشة
  const [activeId, setActiveId] = useState(null); // أي خيار صوته شغّال

  const disabled = finished || answerShown;

  // 🔒 الفراغ الصح مقفول، الغلط بيضل قابل للتعديل
  const isLocked = (qi, bi) => disabled || results[key(qi, bi)] === "correct";

  /* ================= AUDIO ================= */

  const audioOwner = useRef({}).current;

  const stopAudio = () => {
    stopGlobalAudio(audioOwner);
    setActiveId(null);
  };

  const playOption = (opt, id) => {
    const src = audioOf[opt];

    if (!src) {
      stopGlobalAudio();
      setActiveId(null);
      return;
    }

    playGlobalAudio(src, {
      owner: audioOwner,
      onFinish: () => setActiveId((prev) => (prev === id ? null : prev)),
    });

    setActiveId(id);
  };

  // وقف الصوت إذا سكرت الصفحة
  useEffect(() => () => stopGlobalAudio(audioOwner), [audioOwner]);

  // 🔊 الصوت لما الطالب يوقف على الخيار بالتاب (مش بالماوس)
  const handleOptionFocus = (e, opt, id) => {
    if (!PLAY_ON_FOCUS) return;
    if (!e.currentTarget.matches(":focus-visible")) return;
    playOption(opt, id);
  };

  /* ================= SELECT ================= */

  // اختيار واحد فقط لكل فراغ (الخيار الجديد بيستبدل القديم)
  const handleSelect = (qIndex, blankIndex, option, id) => {
    playOption(option, id); // الصوت دايماً

    if (isLocked(qIndex, blankIndex)) {
      setMessage(
        answerShown
          ? "Correct answers are shown. Press Start Again to try again."
          : finished
            ? "All answers are correct and locked."
            : `Question ${qIndex + 1}, choice ${blankIndex + 1} is correct and locked.`,
      );
      return;
    }

    setAnswers((prev) =>
      prev.map((row, qi) =>
        qi === qIndex
          ? row.map((a, bi) => (bi === blankIndex ? option : a))
          : row,
      ),
    );

    // تعديل إجابة غلط: بيشيل علامة الغلط
    setResults((prev) => ({ ...prev, [key(qIndex, blankIndex)]: null }));

    setMessage(
      `Question ${qIndex + 1}, choice ${blankIndex + 1}: ${option} selected.`,
    );
  };

  /* ================= CHECK ================= */

  const checkAnswers = () => {
    // بعد Show Answer أو بعد ما كل شي صح: ما في شي نعمله
    if (disabled) return;

    const selectedCount = answers.flat().filter((a) => a !== null).length;
    if (selectedCount === 0) {
      const msg = "Please choose at least one answer before checking.";
      ValidationAlert.info("Oops!", msg);
      setMessage(msg);
      return;
    }

    stopAudio();

    const newResults = {};
    let correct = 0;
    let total = 0;
    const details = [];

    questions.forEach((q, qIndex) => {
      const row = [];

      q.correct.forEach((correctAns, blankIndex) => {
        total++;
        const k = key(qIndex, blankIndex);
        const chosen = answers[qIndex][blankIndex];

        if (chosen === null) {
          newResults[k] = null;
          row.push(`choice ${blankIndex + 1} not answered`);
        } else if (chosen === correctAns) {
          newResults[k] = "correct";
          correct++;
          row.push(`choice ${blankIndex + 1} correct`);
        } else {
          newResults[k] = "wrong";
          row.push(`choice ${blankIndex + 1} incorrect`);
        }
      });

      details.push(`Question ${q.id}: ${row.join(", ")}.`);
    });

    setResults(newResults);
    setScore(correct);
    if (correct === total) setFinished(true);

    // 🔊 فيدباك مسموع لقارئ الشاشة (لكل فراغ + السكور)
    setMessage(
      `Score ${correct} out of ${total}. ${details.join(" ")}${
        correct < total
          ? " Correct answers are locked. Change the answers marked with a cross, then press Check Answer again."
          : ""
      }`,
    );

    const color =
      correct === total ? "green" : correct === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size: 20px; margin-top: 10px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${correct} / ${total}
        </span>
      </div>
    `;

    if (correct === total) ValidationAlert.success(scoreMessage);
    else if (correct === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  /* ================= SHOW ANSWER ================= */

  // بيعرض الإجابات الصح بدون ما يغيّر السكور
  const showAnswers = () => {
    stopAudio();
    setAnswers(questions.map((q) => [...q.correct]));
    setResults({});
    setFinished(false);
    setAnswerShown(true);
    setMessage("Correct answers are shown.");
  };

  /* ================= START AGAIN ================= */

  const reset = () => {
    stopAudio();

    setAnswers(emptyAnswers());
    setResults({});
    setScore(null);
    setFinished(false);
    setAnswerShown(false);
    setMessage("Exercise reset. All answers, feedback and score are cleared.");
  };

  // const totalBlanks = questions.reduce((sum, q) => sum + q.correct.length, 0);

  /* ================= RENDER ================= */

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      {/* 📢 رسائل لقارئ الشاشة */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {message}
      </div>

      <div className="div-forall" style={{ gap: "20px" }}>
        <ExerciseHeader
          sectionLetter="D"
          title="Look, read, and circle."
          subTitle="Read the clue completely, then tap the option that best matches it."
        />

        <p id="u3p6q1-help" className="sr-only">
          Press Tab to move between the choices. Each choice plays its sound
          when it is focused. Press Enter or Space to choose it. Choose one
          answer in each group. After checking, correct answers are locked and
          wrong answers can be changed.
        </p>

        <div
          className="content-container-CB-unit3-p6-q1"
          role="group"
          aria-label="Questions"
          aria-describedby="u3p6q1-help"
        >
          {questions.map((q, qIndex) => (
            <div
              className="question-row-CB-unit3-p6-q1"
              key={q.id}
              role="group"
              aria-label={`Question ${q.id}`}
            >
              <div className="sentence-CB-unit3-p6-q1">
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    className="header-title-page8"
                    aria-hidden="true"
                    style={{
                      color: "#2c5287",
                      fontWeight: "700",
                      fontSize: "25px",
                    }}
                  >
                    {q.id}
                  </span>

                  <img
                    src={q.image}
                    alt={`Picture ${q.id}: ${q.alt}`}
                    className="question-img-CB-unit3-p6-q1"
                    style={{ width: "300px", height: "150px" }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  {q.parts.map((part, pIndex) => {
                    if (part.type === "text") {
                      return (
                        <span
                          key={pIndex}
                          className="sentence-text-CB-unit3-p6-q1"
                          aria-hidden="true"
                        >
                          {part.value}
                        </span>
                      );
                    }

                    // part.type === "blank"
                    const blankCount = q.parts.filter(
                      (p) => p.type === "blank",
                    ).length;
                    const blankIndex = q.parts
                      .slice(0, pIndex)
                      .filter((p) => p.type === "blank").length;
                    const isLastBlank = blankIndex === blankCount - 1;
                    const k = key(qIndex, blankIndex);
                    const result = answerShown ? null : results[k];
                    const optLocked = isLocked(qIndex, blankIndex);

                    return (
                      <span
                        key={pIndex}
                        role="group"
                        aria-label={`Question ${q.id}, choice ${blankIndex + 1} of ${blankCount}. Choose one.`}
                        className={`blank-options-CB-unit3-p6-q1 ${
                          isLastBlank ? "last-blank !border-none" : ""
                        }`}
                      >
                        {part.options.map((opt, optIndex) => {
                          const isSelected = answers[qIndex][blankIndex] === opt;
                          const isCorrectPick =
                            isSelected && (answerShown || result === "correct");
                          const isWrongPick =
                            isSelected && !answerShown && result === "wrong";
                          const oid = `${k}-${optIndex}`;
                          const isPlaying = activeId === oid;

                          return (
                            <div
                              key={optIndex}
                              className="option-wrapper-CB-unit3-p6-q1"
                              style={{ position: "relative" }}
                            >
                              {/* 🔘 البطاقة كاملة = زر (مش بس المربع الصغير) */}
                              <button
                                type="button"
                                className={`option-word-CB-unit3-p6-q1 ${
                                  isSelected ? "selected" : ""
                                } ${isCorrectPick ? "is-correct" : ""} ${
                                  isWrongPick ? "is-wrong" : ""
                                }`}
                                aria-pressed={isSelected}
                                aria-disabled={optLocked}
                                aria-label={`${opt}${
                                  isCorrectPick && answerShown
                                    ? ", correct answer"
                                    : isCorrectPick
                                      ? ", correct and locked"
                                      : isWrongPick
                                        ? ", incorrect, you can change it"
                                        : ""
                                }`}
                                style={isPlaying ? highlightStyle : undefined}
                                onClick={() =>
                                  handleSelect(qIndex, blankIndex, opt, oid)
                                }
                                onFocus={(e) =>
                                  handleOptionFocus(e, opt, oid)
                                }
                              >
                                {opt}
                              </button>

                             
                              {isWrongPick && (
                                <div
                                  className="wrong-mark-CB-unit3-p6-q1"
                                  aria-hidden="true"
                                >
                                  ✕
                                </div>
                              )}

                              {/* 🔊 السبيكر فوق يمين الخيار */}
                              {isPlaying && <SpeakerIcon />}
                            </div>
                          );
                        })}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* السكور بعد Check بس (Show Answer ما بيغيّره) */}
        {score !== null && !answerShown && (
          <p className="CB-unit3-p6-q1-score" aria-hidden="true">
           
          </p>
        )}
      </div>

      <div className="action-buttons-container">
        <button type="button" className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>

        <button
          type="button"
          onClick={showAnswers}
          className="show-answer-btn"
        >
          Show Answer
        </button>

        <button
          type="button"
          onClick={checkAnswers}
          className="check-button2"
          aria-disabled={disabled}
          style={disabled ? { cursor: "not-allowed" } : undefined}
        >
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit3_Page6_Q1;
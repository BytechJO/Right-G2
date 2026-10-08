import React, { useEffect, useRef, useState } from "react";
import "./Unit4_Page5_Q2.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 32/Ex A 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 32/Ex A 3.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 32/Asset 5 (1).svg";

import sound1 from "../../../assets/audio/ClassBook/U 4/cd24pg32-instruction1-adult-lady_rQFKnvRt.mp3";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";

// ========================================
// AUDIO (إعادة تشغيل صوت الكلمة الصحيحة لكل عنصر)
// ========================================

import { FaVolumeUp } from "react-icons/fa";
// 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
import { stopGlobalAudio } from "../../audioManager";
import ExerciseHeader from "../../ExerciseHeader";

// ⚠️ ما عرفت أسماء ملفات صوت الكلمات (snake / train / day).
// فكّي الكومنت عن الـ imports تحت، عدّلي المسارات، وبدّلي الـ null بالمتغيرات.
// import snakeAudio from "../../../assets/audio/ClassBook/U 4/Page 32 - A/snake.mp3";
// import trainAudio from "../../../assets/audio/ClassBook/U 4/Page 32 - A/train.mp3";
// import dayAudio from "../../../assets/audio/ClassBook/U 4/Page 32 - A/day.mp3";
const snakeAudio = null;
const trainAudio = null;
const dayAudio = null;

// ========================================
// QUESTIONS
// ========================================

const questions = [
  {
    id: 1,
    parts: [
      { type: "text", value: "sn" },
      { type: "blank", options: ["aik", "ake"] },
      { type: "text", value: "." },
    ],
    correct: ["ake"],
    image: img1,
    // ⚠️ تأكدي إن الوصف مطابق للصورة
    imageAlt: "A snake",
    audio: snakeAudio,
    word: "snake",
  },
  {
    id: 2,
    parts: [
      { type: "text", value: "tr" },
      { type: "blank", options: ["ain", "ayn"] },
      { type: "text", value: "." },
    ],
    correct: ["ain"],
    image: img2,
    // ⚠️ تأكدي إن الوصف مطابق للصورة
    imageAlt: "A train",
    audio: trainAudio,
    word: "train",
  },
  {
    id: 3,
    parts: [
      { type: "text", value: "d" },
      { type: "blank", options: ["ay", "ae"] },
      { type: "text", value: "." },
    ],
    correct: ["ay"],
    image: img3,
    // ⚠️ ما عرفت شو بتظهر الصورة (Asset 5 (1).svg): عدّلي الوصف
    imageAlt: "A bright sunny day",
    audio: dayAudio,
    word: "day",
  },
];

const emptyAnswers = () => questions.map((q) => q.correct.map(() => null));

const emptyFeedback = () => questions.map(() => null);

const focusClasses =
  "focus-visible:outline-4 focus-visible:outline-blue-600 focus-visible:outline-offset-2";

// ========================================
// MAIN
// ========================================

const Unit4_Page5_Q2 = () => {
  const [answers, setAnswers] = useState(emptyAnswers);
  // per item: null | "correct" | "incorrect" | "unanswered" | "shown"
  const [feedback, setFeedback] = useState(emptyFeedback);
  const [, setScore] = useState(null); // { correct, total } | null
  // true بعد Show Answer فقط: بيقفل كل العناصر
  const [locked, setLocked] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [, setPlayingItem] = useState(null);
  const [announcement, setAnnouncement] = useState("");

  const audioOwner = useRef({}).current;

  /* ================ audio logic (التعليمات) =========================*/

  const stopAtSecond = 7.9;

  const captions = [
    {
      start: 0.52,
      end: 7.9,
      text: "Page 32, write activities. Exercise A, number 2. Listen and circle.",
    },
    { start: 8.96, end: 10.36, text: "1, snake." },
    { start: 11.4, end: 15.94, text: "2, train. 3, day." },
  ];

  // ========================================
  // ITEM AUDIO
  // ========================================

  const stopAudio = () => {
    stopGlobalAudio(audioOwner);
    setPlayingItem(null);
  };

  // وقف الصوت إذا سكرت الصفحة
  useEffect(() => () => stopGlobalAudio(audioOwner), [audioOwner]);

  // ========================================
  // ITEM LOCK
  // العنصر الصح بعد Check (أو بعد Show Answer) بينقفل،
  // والعنصر الغلط أو اللي ما انجاوب بيضل يتعدّل.
  // ========================================

  const isItemLocked = (qIndex) =>
    locked || feedback[qIndex] === "correct" || feedback[qIndex] === "shown";

  // ========================================
  // SELECT (mouse / touch / Enter / Space)
  // ========================================

  const handleSelect = (qIndex, blankIndex, option) => {
    if (isItemLocked(qIndex)) return;

    setAnswers((prev) => {
      const updated = prev.map((row) => [...row]);
      updated[qIndex][blankIndex] = option;
      return updated;
    });

    // التغيير بيشيل فيدباك هالعنصر والسكور القديم
    setFeedback((prev) => prev.map((f, i) => (i === qIndex ? null : f)));
    setScore(null);
    setActiveItem(qIndex);
    setAnnouncement(`Item ${questions[qIndex].id}: ${option} selected.`);
  };

  const handleOptionKeyDown = (e, qIndex, blankIndex, option) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(qIndex, blankIndex, option);
    }
  };

  // ========================================
  // CHECK
  // ========================================

  const checkAnswers = () => {
    if (locked) return;

    const selectedCount = answers.flat().filter((a) => a !== null).length;

    if (selectedCount === 0) {
      ValidationAlert.info(
        "Oops!",
        "Please make at least one choice before checking.",
      );
      setAnnouncement("Please make at least one choice before checking.");
      return;
    }

    stopAudio();

    let correct = 0;
    let total = 0;

    const nextFeedback = questions.map((q, qIndex) => {
      const itemCorrect = q.correct.every(
        (ans, blankIndex) => answers[qIndex][blankIndex] === ans,
      );
      const itemAnswered = q.correct.every(
        (_, blankIndex) => answers[qIndex][blankIndex] !== null,
      );

      total += q.correct.length;
      q.correct.forEach((ans, blankIndex) => {
        if (answers[qIndex][blankIndex] === ans) correct++;
      });

      if (itemCorrect) return "correct";
      return itemAnswered ? "incorrect" : "unanswered";
    });

    setFeedback(nextFeedback);
    setScore({ correct, total });

    const color =
      correct === total ? "green" : correct === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size: 20px; margin-top: 10px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${correct} / ${total}
        </span>
      </div>
    `;

    // الفيدباك المنطوق (screen reader) لكل عنصر + السكور
    const spoken = nextFeedback
      .map(
        (f, i) =>
          `Item ${questions[i].id}: ${
            f === "correct"
              ? "correct, locked"
              : f === "incorrect"
                ? "incorrect, you can change it"
                : "not answered"
          }.`,
      )
      .join(" ");

    setAnnouncement(`${spoken} Score ${correct} out of ${total}.`);

    if (correct === total) {
      ValidationAlert.success(scoreMessage);
    } else if (correct === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  // ========================================
  // SHOW ANSWER
  // ========================================

  const showAnswers = () => {
    stopAudio();
    setAnswers(questions.map((q) => [...q.correct]));
    setFeedback(questions.map(() => "shown"));
    setScore(null);
    setLocked(true);
    setActiveItem(null);
    setAnnouncement("All answers shown.");
  };

  // ========================================
  // START AGAIN: بيوقف الصوت وبيمسح الاختيارات، الفيدباك، والسكور
  // ========================================

  const reset = () => {
    stopAudio();
    setAnswers(emptyAnswers());
    setFeedback(emptyFeedback());
    setScore(null);
    setLocked(false);
    setActiveItem(null);
    setAnnouncement(
      "Activity reset. All choices, feedback and score are cleared.",
    );
  };

  // ========================================
  // JSX
  // ========================================

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
      {/* Screen Reader */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>

      <div className="div-forall" style={{ gap: "54px" }}>
        <ExerciseHeader
          // sectionLetter="A"
          questionNumber="2"
          title="Listen and circle."
          subTitle="Read the clue completely, then tap the option that best matches it."
        />

        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
          pageId={"sb-unit4-page5-q2"}
        />

        <div className="flex gap-18">
          {questions.map((q, qIndex) => {
            const isActive = activeItem === qIndex;
            const itemLocked = isItemLocked(qIndex);

            return (
              <div className="flex gap-5" key={q.id}>
                <div
                  className="sentence-CB-unit4-p5-q2"
                  style={{
                    borderRadius: "12px",
                    boxShadow: isActive ? "0 0 0 3px #2c5287" : undefined,
                    padding: isActive ? "4px" : undefined,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      className="header-title-page8"
                      style={{
                        color: "black",
                        fontWeight: "700",
                        fontSize: "20px",
                      }}
                    >
                      {q.id}
                    </span>

                    <img
                      src={q.image}
                      alt={q.imageAlt}
                      className="question-img-CB-unit3-p6-q1"
                      style={{ width: "150px", height: "150px" }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    {q.parts.map((part, pIndex) => {
                      if (part.type === "text") {
                        return (
                          <span
                            key={pIndex}
                            className="sentence-text-CB-unit3-p6-q1"
                          >
                            {part.value}
                          </span>
                        );
                      }

                      if (part.type === "blank") {
                        const blankIndex = q.parts
                          .filter((p) => p.type === "blank")
                          .indexOf(part);

                        return (
                          <span
                            key={pIndex}
                            role="group"
                            aria-label={`Item ${q.id}: choose the correct letters`}
                            className="blank-options-CB-unit4-p5-q2"
                          >
                            {part.options.map((opt, optIndex) => {
                              const isSelected =
                                answers[qIndex][blankIndex] === opt;

                              const isWrongSelected =
                                feedback[qIndex] === "incorrect" &&
                                isSelected &&
                                opt !== q.correct[blankIndex];
                              const isCorrectSelected =
                                isSelected &&
                                opt === q.correct[blankIndex] &&
                                (feedback[qIndex] === "correct" ||
                                  feedback[qIndex] === "shown");
                              return (
                                <div
                                  key={optIndex}
                                  className="option-wrapper-CB-unit3-p6-q1"
                                >
                                  <span
                                    role="button"
                                    tabIndex={itemLocked ? -1 : 0}
                                    aria-pressed={isSelected}
                                    aria-disabled={itemLocked}
                                    aria-label={`Item ${q.id}, ${opt}${
                                      isSelected
                                        ? feedback[qIndex] === "correct"
                                          ? ", selected, correct"
                                          : isWrongSelected
                                            ? ", selected, incorrect"
                                            : ", selected"
                                        : ""
                                    }`}
                                   className={`option-word-CB-unit3-p6-q1 ${focusClasses} ${
  isSelected ? "selected" : ""
} ${isCorrectSelected ? "option-correct-CB-unit4-p5-q2" : ""}`}
                                    style={{ touchAction: "manipulation" }}
                                    onFocus={() => setActiveItem(qIndex)}
                                    onClick={() =>
                                      handleSelect(qIndex, blankIndex, opt)
                                    }
                                    onKeyDown={(e) =>
                                      handleOptionKeyDown(
                                        e,
                                        qIndex,
                                        blankIndex,
                                        opt,
                                      )
                                    }
                                  >
                                    {opt}
                                  </span>

                                  {isWrongSelected && !locked && (
                                    <div
                                      className="wrong-mark-CB-unit4-p5-q2"
                                      aria-hidden="true"
                                    >
                                      ✕
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </span>
                        );
                      }

                      return null;
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="action-buttons-container">
        <button className="try-again-button" onClick={reset}>
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

export default Unit4_Page5_Q2;

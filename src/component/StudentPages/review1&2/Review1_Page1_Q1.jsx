import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 16/Ex A 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 16/Ex A 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 16/Ex A 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 16/Ex A 4.svg";
import img5 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 16/Ex A 5.svg";
import img6 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 16/Ex A 6.svg";
import "./Review1_Page1_Q1.css";
import ExerciseHeader from "../../ExerciseHeader";

// 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";

import brotherSound from "../../../assets/audio/ClassBook/U 2/Page 16 - A/brother.mp3";
import fatherSound from "../../../assets/audio/ClassBook/U 2/Page 16 - A/father.mp3";
import grandmaSound from "../../../assets/audio/ClassBook/U 2/Page 16 - A/grandma.mp3";
import grandpaSound from "../../../assets/audio/ClassBook/U 2/Page 16 - A/grandpa.mp3";
import motherSound from "../../../assets/audio/ClassBook/U 2/Page 16 - A/mother.mp3";
import sisterSound from "../../../assets/audio/ClassBook/U 2/Page 16 - A/sister.mp3";

// 🔊 true = الصوت يشتغل تلقائياً لما الطالب يوقف على الكلمة بالتاب
const PLAY_ON_FOCUS = true;
/* ================= DATA ================= */

const sounds = {
  sister: sisterSound,
  mother: motherSound,
  brother: brotherSound,
  father: fatherSound,
  grandma: grandmaSound,
  grandpa: grandpaSound,
};

// alt = وصف الشخص بالصورة (الجواب الصح هو الكلمة، فما بنكتبه بالـ alt)
const items = [
  {
    img: img1,
    alt: "A girl with long hair",
    options: ["sister", "mother"],
    correctIndex: 0,
  },
  {
    img: img4,
    alt: "An older man with a white beard",
    options: ["grandpa", "father"],
    correctIndex: 0,
  },
  {
    img: img2,
    alt: "A boy with short hair",
    options: ["mother", "brother"],
    correctIndex: 0,
  },
  {
    img: img5,
    alt: "A young person smiling",
    options: ["brother", "sister"],
    correctIndex: 0,
  },
  {
    img: img3,
    alt: "An older woman with gray hair",
    options: ["grandpa", "grandma"],
    correctIndex: 1,
  },
  {
    img: img6,
    alt: "A man with short dark hair",
    options: ["mother", "father"],
    correctIndex: 1,
  },
];

const total = items.length;

const Review1_Page1_Q1 = () => {
  /*
    answers: مصفوفة، لكل سؤال index الخيار المختار (أو null)
    results: مصفوفة، لكل سؤال null | "correct" | "wrong"

    - "correct" → السؤال مثبّت (مقفول) بعد Check
    - "wrong"   → ✕ والطالب بيقدر يعدّله
  */
  const [answers, setAnswers] = useState(Array(total).fill(null));
  const [results, setResults] = useState(Array(total).fill(null));

  // 🔒 بعد Show Answer كل شي مقفول
  const [showAnswered, setShowAnswered] = useState(false);

  // 📢 رسالة لقارئ الشاشة (فيها السكور بعد Check)
  const [message, setMessage] = useState("");

  const isLocked = (i) => showAnswered || results[i] === "correct";

  const allCorrect = results.every((r) => r === "correct");

  const audioOwner = useRef({}).current;
  const [activeId, setActiveId] = useState(null); // الخيار اللي صوته شغّال

  const stopAudio = () => {
    stopGlobalAudio(audioOwner);
    setActiveId(null);
  };

  const playAudio = (word, id) => {
    const src = sounds[word];
    if (!src) return;

    playGlobalAudio(src, {
      owner: audioOwner,
      onFinish: () => setActiveId((prev) => (prev === id ? null : prev)),
    });

    setActiveId(id);
  };

  // وقف الصوت إذا سكرت الصفحة
  useEffect(() => () => stopGlobalAudio(audioOwner), [audioOwner]);

  const SpeakerIcon = () => (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      style={{
        position: "absolute",
        top: "-6px",
        right: "-6px",
        background: "white",
        borderRadius: "50%",
        padding: "2px",
      }}
    >
      <path
        fill="currentColor"
        d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"
      />
    </svg>
  );

  /* =====================================================
     SELECT (كليك / لمس / Enter / Space)
     كل سؤال = اختيار واحد فقط → radio group
     البطاقة كاملة هي الخيار القابل للاختيار
  ===================================================== */

  const handleSelect = (qIndex, optIndex) => {
    if (isLocked(qIndex)) return;

    // نفس الاختيار: ما في تغيير (✕ بتضل لحد ما يختار غيره)
    if (answers[qIndex] === optIndex) return;

    setAnswers((prev) => {
      const copy = [...prev];
      copy[qIndex] = optIndex;
      return copy;
    });

    // نشيل ✕ بس عن السؤال الي تغيّر
    setResults((prev) => {
      if (prev[qIndex] === null) return prev;
      const copy = [...prev];
      copy[qIndex] = null;
      return copy;
    });

    setMessage(
      `Picture ${qIndex + 1}: ${items[qIndex].options[optIndex]} selected.`,
    );
  };

  // يختار (إلا إذا مقفول) + يشغّل الصوت دايماً
  const activateOption = (qIndex, optIndex) => {
    playAudio(items[qIndex].options[optIndex], `q${qIndex}-${optIndex}`);
    handleSelect(qIndex, optIndex);
  };

  const handleKeyDown = (e, qIndex, optIndex) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activateOption(qIndex, optIndex);
    }
  };

  // 🔊 الصوت لما الطالب يوقف على الكلمة بالتاب (مش بالماوس)
  const handleFocus = (e, qIndex, optIndex) => {
    if (!PLAY_ON_FOCUS) return;
    if (!e.currentTarget.matches(":focus-visible")) return;
    playAudio(items[qIndex].options[optIndex], `q${qIndex}-${optIndex}`);
  };

  /* =====================================================
     CHECK
     - الصح بينثبّت
     - الغلط بيضل قابل للتعديل (✕)، وما بنكشف الجواب الصح
     - السكور بينحسب من كل الأسئلة (المثبّتة + الجديدة)
  ===================================================== */

  const checkAnswers = () => {
    // بعد Show Answer أو بعد ما كل شي صح: ما في شي نعمله
    if (showAnswered || allCorrect) return;

    if (answers.includes(null)) {
      ValidationAlert.info("Oops!", "Please circle all words first.");
      setMessage("Please circle all words first.");
      return;
    }

    const res = answers.map((ans, i) =>
      ans === items[i].correctIndex ? "correct" : "wrong",
    );

    const correctCount = res.filter((r) => r === "correct").length;
    const toFix = res
      .map((r, i) => (r === "wrong" ? i + 1 : null))
      .filter(Boolean);

    setResults(res);

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    setMessage(
      correctCount === total
        ? `Score ${correctCount} out of ${total}. All answers are correct.`
        : `Score ${correctCount} out of ${total}. Correct answers are locked. Please fix pictures: ${toFix.join(", ")}.`,
    );

    if (correctCount === total) ValidationAlert.success(msg);
    else if (correctCount === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  /* =====================================================
     SHOW ANSWER
     بيعرض الإجابات الصح بدون ما يحسب سكور جديد
  ===================================================== */

  const showAnswers = () => {
    stopAudio();

    setAnswers(items.map((item) => item.correctIndex));
    setResults(Array(total).fill("correct"));
    setShowAnswered(true);
    setMessage("Correct answers are shown.");
  };

  /* =====================================================
     START AGAIN
     بيمسح الاختيارات + النتائج + القفل + السكور (الرسالة)
  ===================================================== */

  const reset = () => {
    stopAudio();

    setAnswers(Array(total).fill(null));
    setResults(Array(total).fill(null));
    setShowAnswered(false);
    setMessage("Exercise reset. All answers are cleared.");
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      {/* 📢 رسائل لقارئ الشاشة */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {message}
      </div>

      <div className="div-forall" style={{ marginBottom: "50px", gap: "20px" }}>
        <ExerciseHeader
          sectionLetter="A"
          // questionNumber="1"
          title="Look, read, and circle."
          subTitle="Read the clue completely, then tap the option that best matches it."
          isReview="true"
        />

        <div className="CB-review1-p1-q1-container">
          {items.map((q, i) => {
            const locked = isLocked(i);

            return (
              <div key={i} className="CB-review1-p1-q1-question">
                <div className="CB-review1-p1-q1-left">
                  <span className="CB-review1-p1-q1-index" aria-hidden="true">
                    {i + 1}
                  </span>
                  {/* ⚠️ alt مؤقت: الصورة هي السؤال، فما بنكتب اسم الشخص */}
                  <img
                    src={q.img}
                    alt={`Picture ${i + 1}: ${q.alt}`}
                    className="CB-review1-p1-q1-image"
                  />
                </div>

                {/* كل سؤال = اختيار واحد فقط → radio group */}
                <div
                  className="CB-review1-p1-q1-options"
                  role="radiogroup"
                  aria-readonly={locked}
                  aria-label={`Picture ${i + 1}. Choose one word.`}
                >
                  {q.options.map((word, optIndex) => {
                    const isSelected = answers[i] === optIndex;
                    const isCorrect = results[i] === "correct" && isSelected;
                    const isWrong = results[i] === "wrong" && isSelected;
                    const id = `q${i}-${optIndex}`;
                    const isPlaying = activeId === id;

                    const stateLabel = isWrong
                      ? ", selected, incorrect. Try again"
                      : isCorrect
                        ? ", selected, correct and locked"
                        : isSelected
                          ? ", selected"
                          : "";

                    return (
                      <div
                        key={optIndex}
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={`${word}${stateLabel}`}
                        /* ضل قابل للتركيز حتى بعد القفل عشان الطالب يسمع الصوت بالتاب */
                        tabIndex={0}
                        className={`
    CB-review1-p1-q1-option
    ${isSelected ? "is-selected" : ""}
    ${isWrong ? "is-wrong" : ""}
    ${isCorrect ? "is-correct" : ""}
  `}
                        style={{
                          cursor: locked ? "default" : "pointer",
                          position: "relative",
                          ...(isPlaying
                            ? {
                                outline: "2px solid #2c5287",
                                outlineOffset: "3px",
                                borderRadius: "10px",
                              }
                            : {}),
                        }}
                        onClick={() => activateOption(i, optIndex)}
                        onKeyDown={(e) => handleKeyDown(e, i, optIndex)}
                        onFocus={(e) => handleFocus(e, i, optIndex)}
                      >
                        <span aria-hidden="true">{word}</span>

                        {isWrong && (
                          <span
                            className="CB-review1-p1-q1-wrong-x"
                            aria-hidden="true"
                          >
                            ✕
                          </span>
                        )}

                        {/* 🔊 السبيكر فوق يمين الكلمة */}
                        {isPlaying && <SpeakerIcon />}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* الأزرار */}
      <div className="action-buttons-container">
        <button type="button" className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>
        <button type="button" onClick={showAnswers} className="show-answer-btn">
          Show Answer
        </button>
        <button type="button" className="check-button2" onClick={checkAnswers}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Review1_Page1_Q1;

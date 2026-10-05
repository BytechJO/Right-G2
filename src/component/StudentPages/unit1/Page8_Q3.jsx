import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Page8_Q3.css";
import img1 from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex B 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex B 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex B 3.svg";

import sheSound from "../../../assets/audio/ClassBook/U 1/Page 8 - B/she.mp3";
import heSound from "../../../assets/audio/ClassBook/U 1/Page 8 - B/he.mp3";
import ExerciseHeader from "../../ExerciseHeader";

// 🔊 true = الصوت يشتغل تلقائياً لما الطالب يوقف على he / she بالتاب
// (غيّرها لـ false إذا بدك الصوت بس عند Enter / Space / كليك)
const PLAY_ON_FOCUS = true;

const Page8_Q3 = () => {
  // 🔥 الداتا المطابقة للصورة
  const items = [
    {
      img: img1,
      alt: "A boy", // ✏️ عدّل الوصف حسب الصورة الفعلية
      text: "",
      options: ["he", "she"],
      correctIndex: 0,
    },
    {
      img: img2,
      alt: "A girl",
      text: "",
      options: ["he", "she"],
      correctIndex: 1,
    },
    {
      img: img3,
      alt: "A boy",
      text: "",
      options: ["he", "she"],
      correctIndex: 0,
    },
  ];

  const total = items.length;
  const falses = () => Array(total).fill(false);

  // الكلمة → ملف الصوت
  const soundByWord = { he: heSound, she: sheSound };

  const [answers, setAnswers] = useState(Array(total).fill(null));

  // 🔒 الأسئلة الصح بعد Check بتنقفل
  const [lockedQ, setLockedQ] = useState(falses());
  // ✕ الأسئلة الغلط (بتضل قابلة للتعديل)
  const [wrongQ, setWrongQ] = useState(falses());
  // 🔒 بعد Show Answer كل شي مقفول
  const [showAnswer, setShowAnswer] = useState(false);

  // 📢 رسالة لقارئ الشاشة
  const [message, setMessage] = useState("");

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);
  // الخيار الي اشتغل صوته → بيظهر عليه البوردر + أيقونة الصوت
  const [activeId, setActiveId] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  const playAudio = (src, id) => {
    stopAudio();
    setActiveId(id);
    if (!src) return;

    const audio = new Audio(src);
    audioRef.current = audio;
    // لما يخلص الصوت بتختفي أيقونة الصوت
    audio.onended = () => setActiveId((prev) => (prev === id ? null : prev));
    audio.play().catch(() => setActiveId(null));
  };

  // وقف الصوت إذا سكرت الصفحة
  useEffect(() => stopAudio, []);

  const SpeakerIcon = () => (
    <svg
      className="CB-unit1-p8-q3-speaker"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"
      />
    </svg>
  );

  /* =====================================================
     SELECT (كليك / Enter / Space)
  ===================================================== */

  const handleSelect = (qIndex, optionIndex, word) => {
    if (showAnswer || lockedQ[qIndex]) return;

    const newAns = [...answers];
    newAns[qIndex] = optionIndex;
    setAnswers(newAns);

    // نشيل ✕ فقط عن السؤال الي تغيّر
    setWrongQ((prev) => prev.map((w, i) => (i === qIndex ? false : w)));

    setMessage(`Picture ${qIndex + 1}: ${word} selected.`);
  };

  const activateOption = (qIndex, optionIndex, word) => {
    handleSelect(qIndex, optionIndex, word); // يختار (إلا إذا مقفول)
    playAudio(soundByWord[word], `q${qIndex}-o${optionIndex}`); // ويشغّل الصوت
  };

  const handleKeyDown = (e, qIndex, optionIndex, word) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault(); // يمنع سكرول الصفحة عند Space
      activateOption(qIndex, optionIndex, word);
    }
  };

  // 🔊 الصوت لما الطالب يوقف على الخيار بالتاب (مش بالماوس)
  const handleFocus = (e, qIndex, optionIndex, word) => {
    if (!PLAY_ON_FOCUS) return;
    if (!e.currentTarget.matches(":focus-visible")) return; // تجاهل تركيز الماوس
    playAudio(soundByWord[word], `q${qIndex}-o${optionIndex}`);
  };

  /* =====================================================
     CHECK
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswer) return;

    if (answers.includes(null)) {
      ValidationAlert.info(
        "Oops!",
        "Please choose he or she for every picture first.",
      );
      return;
    }

    let score = 0;
    const newLocked = [...lockedQ];
    const newWrong = falses();
    const wrongItems = [];

    items.forEach((item, i) => {
      if (answers[i] === item.correctIndex) {
        score++;
        newLocked[i] = true; // 🔒 الصح بينقفل
      } else {
        newWrong[i] = true; // ✕ وبيضل قابل للتعديل
        wrongItems.push(i + 1);
      }
    });

    setLockedQ(newLocked);
    setWrongQ(newWrong);

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    setMessage(
      score === total
        ? `Score ${score} out of ${total}. All answers are correct.`
        : `Score ${score} out of ${total}. Correct answers are locked. Pictures to fix: ${wrongItems.join(", ")}.`,
    );

    if (score === total) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  /* =====================================================
     START AGAIN / SHOW ANSWER
  ===================================================== */

  const reset = () => {
    stopAudio();
    setActiveId(null);
    setAnswers(Array(total).fill(null));
    setLockedQ(falses());
    setWrongQ(falses());
    setShowAnswer(false);
    setMessage("Exercise reset. All answers are cleared.");
  };

  const showAnswers = () => {
    stopAudio();
    setActiveId(null);
    setAnswers(items.map((item) => item.correctIndex));
    setLockedQ(Array(total).fill(true));
    setWrongQ(falses());
    setShowAnswer(true);
    setMessage("Correct answers are shown.");
  };

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

      <div className="div-forall" style={{gap:"120px"}}>
        <div>
        
           <ExerciseHeader
          sectionLetter="B"
          // questionNumber="2"
          title="Look and circle."
          subTitle="Read the clue and check the picture, then tap the one answer that matches."
        />
        </div>
        <div className="container-CB-unit1-p8-q3">
          {items.map((q, i) => {
            const qLocked = showAnswer || lockedQ[i];

            return (
              <div
                key={i}
                className="question-CB-unit1-p8-q3"
                style={{ width: "100%" }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexDirection: "row",
                    alignItems: "center",
                    width: "80%",
                  }}
                ></div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "30px",
                    flexDirection: "column",
                  }}
                >
                  <div className="flex">
                    <span
                      aria-hidden="true"
                      style={{
                        color: "#2c5287",
                        fontSize: "20px",
                        fontWeight: "700",
                      }}
                    >
                      {i + 1}
                    </span>
                    <div className="img-div-CB-unit1-p8-q3">
                      <img
                        src={q.img}
                        alt={q.alt}
                        className="q3-image-CB-unit1-p8-q3"
                        style={{ height: "150px", width: "auto" }}
                      />
                    </div>
                  </div>

                  <div
                    className="options-row-CB-unit1-p8-q3"
                    role="radiogroup"
                    aria-label={`Picture ${i + 1}. Choose he or she.`}
                  >
                    {q.options.map((word, optIndex) => {
                      const isSelected = answers[i] === optIndex;
                      const isCorrect = optIndex === q.correctIndex;
                      const id = `q${i}-o${optIndex}`;

                      return (
                        <p
                          key={optIndex}
                          role="radio"
                          aria-checked={isSelected}
                          aria-disabled={qLocked}
                          tabIndex={qLocked ? -1 : 0}
                          aria-label={`${word}${
                            isSelected && qLocked
                              ? ", correct and locked"
                              : isSelected && wrongQ[i]
                                ? ", incorrect. Try again"
                                : ""
                          }`}
                          className={`
                    option-word-CB-unit1-p8-q3
                    ${isSelected ? "selected" : ""}
                    ${wrongQ[i] && isSelected ? "wrong" : ""}
                    ${qLocked && isCorrect ? "correct locked" : ""}
                    ${activeId === id ? "sound-active" : ""}
                  `}
                          onClick={() => activateOption(i, optIndex, word)}
                          onKeyDown={(e) => handleKeyDown(e, i, optIndex, word)}
                          onFocus={(e) => handleFocus(e, i, optIndex, word)}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                          }}
                        >
                          {word}
                          {wrongQ[i] && isSelected && !qLocked && (
                            <span
                              className="wrong-x-CB-unit1-p8-q3"
                              aria-hidden="true"
                            >
                              ✕
                            </span>
                          )}
                          {activeId === id && <SpeakerIcon />}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
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

export default Page8_Q3;
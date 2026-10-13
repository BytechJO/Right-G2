import React, { useEffect, useRef, useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit4_Page5_Q3.css";
import img1 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 32/Ex B 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 32/Ex B 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 32/Ex B 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 32/Ex B 4.svg";
import ExerciseHeader from "../../ExerciseHeader";

// ========================================
// AUDIO (صوت لكل جملة / خيار)
// ========================================

import { FaVolumeUp } from "react-icons/fa";
// 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";

// ⚠️ أسماء الملفات فيها نقطتين قبل .mp3 (متل ما هي بالفولدر)
import heChef from "../../../assets/audio/ClassBook/U 4/Page 32 - B/He's a chef..mp3";
import heClerk from "../../../assets/audio/ClassBook/U 4/Page 32 - B/He's a clerk..mp3";
import heNurse from "../../../assets/audio/ClassBook/U 4/Page 32 - B/He's a nurse..mp3";
import hePilot from "../../../assets/audio/ClassBook/U 4/Page 32 - B/He's a pilot..mp3";
import heTaxiDriver from "../../../assets/audio/ClassBook/U 4/Page 32 - B/He's a taxi driver..mp3";
import heVet from "../../../assets/audio/ClassBook/U 4/Page 32 - B/He's a vet..mp3";
import imPhotographer from "../../../assets/audio/ClassBook/U 4/Page 32 - B/I'm a photographer..mp3";
import imPoliceOfficer from "../../../assets/audio/ClassBook/U 4/Page 32 - B/I'm a police officer..mp3";
import imTeacher from "../../../assets/audio/ClassBook/U 4/Page 32 - B/I'm a teacher..mp3";
import sheClerk from "../../../assets/audio/ClassBook/U 4/Page 32 - B/She's a clerk..mp3";
import sheNurse from "../../../assets/audio/ClassBook/U 4/Page 32 - B/She's a nurse..mp3";
import sheTaxiDriver from "../../../assets/audio/ClassBook/U 4/Page 32 - B/She's a taxi driver..mp3";

// ========================================
// ITEMS
// ========================================

const items = [
  {
    img: img1,
    // ⚠️ alt محايد عن قصد (بدون ما نكشف المهنة): عدّليه إذا بدك
    imageAlt: "Picture 1: a person at work",
    text: "She can",
    options: [
      "a I’m a teacher.",
      "b I’m a police officer.",
      "c I’m a photographer.",
    ],
    audios: [imTeacher, imPoliceOfficer, imPhotographer],
    correctIndex: 0,
  },
  {
    img: img2,
    imageAlt: "Picture 2: a person at work",
    text: "He can’t",
    options: ["a He’s a nurse.", "b He’s a chef.", "c He’s a clerk."],
    audios: [heNurse, heChef, heClerk],
    correctIndex: 1,
  },
  {
    img: img3,
    imageAlt: "Picture 3: a person at work",
    text: "It can",
    options: ["a He’s a taxi driver.", "b He’s a vet.", "c He’s a pilot"],
    audios: [heTaxiDriver, heVet, hePilot],
    correctIndex: 2,
  },
  {
    img: img4,
    imageAlt: "Picture 4: a person at work",
    text: "She can",
    options: ["a She’s a nurse.", "b She’s a taxi driver.", "c She’s a clerk."],
    audios: [sheNurse, sheTaxiDriver, sheClerk],
    correctIndex: 0,
  },
];

const emptyAnswers = () => items.map(() => null);
const emptyFeedback = () => items.map(() => null);

// ========================================
// FEEDBACK (نص + أيقونة، مش بس لون)
// ========================================

const FEEDBACK = {
  correct: { icon: "✓", text: "Correct!", color: "#2e7d32" },
  incorrect: { icon: "✕", text: "Not quite. Try again.", color: "#c62828" },
  unanswered: { icon: "!", text: "Choose an answer.", color: "#b45309" },
  shown: { icon: "✓", text: "Answer shown.", color: "#2c5287" },
};

const focusClasses =
  "focus-visible:outline-4 focus-visible:outline-blue-600 focus-visible:outline-offset-2";

// ========================================
// MAIN
// ========================================

const Unit4_Page5_Q3 = () => {
  const [answers, setAnswers] = useState(emptyAnswers);
  // per item: null | "correct" | "incorrect" | "unanswered"
  const [feedback, setFeedback] = useState(emptyFeedback);
  const [score, setScore] = useState(null); // { correct, total } | null
  // true بعد Show Answer: بيقفل كل العناصر، وما بيغيّر إجابات الطالب ولا السكور
  const [revealed, setRevealed] = useState(false);
  const [playingOpt, setPlayingOpt] = useState(null); // "i-k" | null
  const [announcement, setAnnouncement] = useState("");

  const audioOwner = useRef({}).current;
  const optRefs = useRef({});

  // ========================================
  // AUDIO
  // ========================================

  const stopAudio = () => {
    stopGlobalAudio(audioOwner);
    setPlayingOpt(null);
  };

  // playGlobalAudio بيوقف أي صوت شغّال قبل ما يبدأ الجديد: ما في تداخل
  const playOptionAudio = (i, k) => {
    const audio = items[i].audios[k];
    if (!audio) return;

    playGlobalAudio(audio, {
      owner: audioOwner,
      onFinish: () => setPlayingOpt(null),
    });

    // أيقونة السبيكر بتظهر على الخيار طول ما الصوت شغّال
    setPlayingOpt(`${i}-${k}`);
  };

  // وقف الصوت إذا سكرت الصفحة
  useEffect(() => () => stopGlobalAudio(audioOwner), [audioOwner]);

  // ========================================
  // ITEM LOCK
  // العنصر الصح بعد Check بينقفل، والغلط أو اللي ما انجاوب بيضل يتعدّل.
  // بعد Show Answer كل العناصر بتنقفل.
  // ========================================

  const isItemLocked = (i) => revealed || feedback[i] === "correct";

  const allLocked = items.every((_, i) => isItemLocked(i));

  // ========================================
  // SELECT (اختيار واحد بس لكل سؤال)
  // ========================================

  const handleSelect = (i, optIndex) => {
    if (isItemLocked(i)) return;

    setAnswers((prev) => prev.map((a, idx) => (idx === i ? optIndex : a)));

    // التغيير بيشيل فيدباك هالعنصر والسكور القديم
    setFeedback((prev) => prev.map((f, idx) => (idx === i ? null : f)));
    setScore(null);
    setAnnouncement(
      `Item ${i + 1}: option ${items[i].options[optIndex].charAt(0)} selected.`,
    );
  };

  // ضغطة وحدة (tap أو click أو Enter أو Space) = اختيار + صوت مرة وحدة
  // ملاحظة: بنستخدم onClick بس (بدون touch/pointer handlers منفصلة)،
  // فاللمس والكليك ما بيشغّلوا الصوت مرتين.
  // الصوت بيشتغل حتى لو العنصر مقفول (للاستماع بس، من غير ما يتغير الاختيار).
  const handleOptionActivate = (i, optIndex) => {
    playOptionAudio(i, optIndex);
    handleSelect(i, optIndex);
  };

  const handleOptionKeyDown = (e, i, optIndex) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOptionActivate(i, optIndex);
      return;
    }

    const count = items[i].options.length;
    let next = null;

    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      next = (optIndex + 1) % count;
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      next = (optIndex - 1 + count) % count;
    }

    if (next === null) return;

    e.preventDefault();
    if (isItemLocked(i)) return;

    handleOptionActivate(i, next);

    requestAnimationFrame(() => {
      optRefs.current[`${i}-${next}`]?.focus();
    });
  };

  // ========================================
  // CHECK
  // ========================================

  const checkAnswers = () => {
    if (allLocked) return;

    // لو في سؤال واحد أو أكتر مش مجاوب: validation info وما بنفحص
    if (answers.some((a) => a === null)) {
      ValidationAlert.info("Oops!", "Please answer all the questions first.");
      setAnnouncement("Please answer all the questions first.");
      return;
    }

    stopAudio();

    const nextFeedback = items.map((item, i) => {
      if (answers[i] === null) return "unanswered";
      return answers[i] === item.correctIndex ? "correct" : "incorrect";
    });

    const correct = nextFeedback.filter((f) => f === "correct").length;
    const total = items.length;

    setFeedback(nextFeedback);
    setScore({ correct, total });

    const color =
      correct === total ? "green" : correct === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${correct} / ${total}
        </span>
      </div>
    `;

    // الفيدباك المنطوق (screen reader) لكل عنصر + السكور
    const spoken = nextFeedback
      .map(
        (f, i) =>
          `Item ${i + 1}: ${
            f === "correct"
              ? "correct, locked"
              : f === "incorrect"
                ? "incorrect, you can change it"
                : "not answered"
          }.`,
      )
      .join(" ");

    setAnnouncement(`${spoken} Score ${correct} out of ${total}.`);

    if (correct === total) ValidationAlert.success(msg);
    else if (correct === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  // ========================================
  // SHOW ANSWER
  // بيعرض الإجابة الصحيحة لكل عنصر بدون ما يلمس إجابات الطالب أو السكور
  // ========================================

  const showAnswers = () => {
    stopAudio();
    setRevealed(true);
    setAnnouncement("All answers shown.");
  };

  // ========================================
  // START AGAIN: بيوقف الصوت وبيمسح الاختيارات، النتائج، والسكور
  // ========================================

  const reset = () => {
    stopAudio();
    setAnswers(emptyAnswers());
    setFeedback(emptyFeedback());
    setScore(null);
    setRevealed(false);
    setAnnouncement(
      "Activity reset. All choices, results and score are cleared.",
    );
  };

  // ========================================
  // RENDER
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

      <div className="div-forall">
        <ExerciseHeader
          sectionLetter="B"
          title="Look, read, and circle."
          subTitle="Read the clue and check the picture, then tap the one answer that matches."
        />

        <div className="container-CB-unit4-p5-q3">
          {items.map((q, i) => {
            const itemLocked = isItemLocked(i);
            const focusIdx = answers[i] !== null ? answers[i] : 0;

            return (
              <div
                key={i}
                className="question-box-CB-unit4-p5-q3"
                style={{ width: "100%" }}
              >
                <div style={{ display: "flex", gap: "10px" }}>
                  <div className="img-div-CB-unit4-p5-q3">
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        width: "80%",
                      }}
                    >
                      <span style={{ fontSize: "20px", fontWeight: "700" }}>
                        {i + 1}
                      </span>
                    </div>
                    <img
                      src={q.img}
                      alt={q.imageAlt}
                      className="q3-image-CB-unit4-p5-q3"
                      style={{ height: "150px", width: "auto" }}
                    />
                  </div>

                  <div
                    className="options-row-CB-unit4-p5-q3"
                    role="radiogroup"
                    aria-label={`Item ${i + 1}: choose the correct job`}
                  >
                    {q.options.map((word, optIndex) => {
                      const isSelected = answers[i] === optIndex;
                      const isCorrect = optIndex === q.correctIndex;

                      // الصح بيظهر: لما الطالب يختاره وانفحص، أو بعد Show Answer
                      const showCorrect =
                        isCorrect &&
                        (revealed || (isSelected && feedback[i] === "correct"));

                      // الغلط بيظهر لاختيار الطالب الغلط بعد Check أو Show Answer
                      const showWrong =
                        isSelected &&
                        !isCorrect &&
                        (feedback[i] === "incorrect" || revealed);

                      const key = `${i}-${optIndex}`;
                      const isPlaying = playingOpt === key;

                      // الكرت كله قابل للاختيار مش بس الحرف
                      return (
                        <p
                          key={optIndex}
                          ref={(node) => {
                            optRefs.current[key] = node;
                          }}
                          role="radio"
                          aria-checked={isSelected}
                          aria-disabled={itemLocked}
                          tabIndex={
                            itemLocked ? -1 : optIndex === focusIdx ? 0 : -1
                          }
                          aria-label={`Item ${i + 1}, option ${word.charAt(0)}: ${word
                            .slice(1)
                            .trim()}${
                            showCorrect
                              ? ", correct"
                              : showWrong
                                ? ", incorrect"
                                : isSelected
                                  ? ", selected"
                                  : ""
                          }`}
                          className={`
                            option-word-CB-unit4-p5-q3
                            ${focusClasses}
                            ${isSelected ? "selected3" : ""}
                            ${showWrong ? "wrong" : ""}
                            ${showCorrect ? "correct" : ""}
                          `}
                          onClick={() => handleOptionActivate(i, optIndex)}
                          onKeyDown={(e) => handleOptionKeyDown(e, i, optIndex)}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                            cursor: itemLocked ? "default" : "pointer",
                            touchAction: "manipulation",
                          }}
                        >
                          <>
                            <span
                              style={{ fontWeight: "700", marginRight: "10px" }}
                            >
                              {word.charAt(0)}
                            </span>
                            {word.slice(1)}
                          </>

                          {/* 🔊 أيقونة السبيكر: فوق يمين الخيار طول ما الصوت شغّال */}
                          {isPlaying && (
                            <span
                              aria-hidden="true"
                              style={{
                                position: "absolute",
                                top: "-3px",
                                right: "-3px",
                                display: "inline-flex",
                                // color: "#2c5287",
                                backgroundColor: "white",
                                borderRadius: "50%",
                                fontSize: "16px",
                              }}
                            >
                              <FaVolumeUp />
                            </span>
                          )}

                          {showWrong && (
                            <span
                              className="wrong-x-CB-unit4-p5-q3"
                              aria-hidden="true"
                            >
                              ✕
                            </span>
                          )}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Score */}
      </div>

      <div className="action-buttons-container">
        <button className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>
        <button onClick={showAnswers} className="show-answer-btn">
          Show Answer
        </button>
        <button className="check-button2" onClick={checkAnswers}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit4_Page5_Q3;
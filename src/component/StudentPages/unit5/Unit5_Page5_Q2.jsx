import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import "./Unit5_Page5_Q2.css";

import img1a from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 44/Ex A2-1.svg";
import img1b from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 44/Ex A2-2.svg";
import img1c from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 44/Ex A2-3.svg";
import img1d from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 44/Ex A2-4.svg";

import img2a from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 44/Ex A2-5.svg";
import img2b from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 44/Ex A2-6.svg";
import img2c from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 44/Ex A2-7.svg";
import img2d from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 44/Ex A2-8.svg";

// 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
// ⚠️ عدّل المسار حسب مكان الملف عندك
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";

/* ================= DATA ================= */

// ⚠️ alt: وصف عام لكل صورة (بدون ما تذكري اسم الشي لو بتكشف الجواب).
//    طول ما فاضي، قارئ الشاشة بيقول "Picture 3" بس.
// ⚠️ audio: ضيفي import للملف وحطيه هون (مثلاً audio: catAudio).
//    طول ما null، ما بيشتغل صوت.
// different = index الصورة اللي صوت حرف العلة الطويل فيها مختلف
const GROUPS = [
  {
    id: 1,
    different: 2,
    images: [
      { src: img1a, alt: "", audio: null },
      { src: img1b, alt: "", audio: null },
      { src: img1c, alt: "", audio: null },
      { src: img1d, alt: "", audio: null },
    ],
  },
  {
    id: 2,
    different: 0,
    images: [
      { src: img2a, alt: "", audio: null },
      { src: img2b, alt: "", audio: null },
      { src: img2c, alt: "", audio: null },
      { src: img2d, alt: "", audio: null },
    ],
  },
];

const COUNT = GROUPS.length;

const emptyArr = () => Array(COUNT).fill(null);

/* ================= HELPERS (خارج الكومبوننت) ================= */

const pictureName = (gIndex, iIndex) => {
  const alt = GROUPS[gIndex].images[iIndex].alt;
  return alt ? `Picture ${iIndex + 1}: ${alt}` : `Picture ${iIndex + 1}`;
};

const Unit5_Page5_Q2 = () => {
  const [selected, setSelected] = useState(emptyArr()); // index الصورة المختارة لكل مجموعة
  const [results, setResults] = useState(emptyArr()); // null | "correct" | "wrong"
  const [finished, setFinished] = useState(false); // كل شي صح بعد Check
  const [answerShown, setAnswerShown] = useState(false);
  const [message, setMessage] = useState("");
  const [playingKey, setPlayingKey] = useState(null); // "مجموعة-صورة" اللي صوتها شغّال

  // مالك الصوت: بيعرّف الـ audioManager إنو هاد الصوت تابع للكومبوننت
  const audioOwner = useRef({}).current;

  const disabled = finished || answerShown;

  // 🔒 المجموعة الصح مقفولة، الغلط بيضل قابل للتعديل
  const isLocked = (g) => disabled || results[g] === "correct";

  /* ================= AUDIO ================= */

  const stopSound = () => {
    stopGlobalAudio(audioOwner);
    setPlayingKey(null);
  };

  // playGlobalAudio بيوقف أي صوت ثاني شغّال قبل ما يشغّل هاد
  const playImage = (image, key) => {
    if (!image.audio) return;

    playGlobalAudio(image.audio, {
      owner: audioOwner,
      onFinish: () => setPlayingKey((prev) => (prev === key ? null : prev)),
    });

    setPlayingKey(key);
  };

  // وقف الصوت إذا سكرت الصفحة
  useEffect(() => () => stopGlobalAudio(audioOwner), [audioOwner]);

  /* ================= INTERACTIONS ================= */

  // فوكس بالتاب على الصورة = شغّل صوتها (الماوس/اللمس بيروحوا على onClick)
  const onImageFocus = (e, image, key) => {
    if (e.currentTarget.matches(":focus-visible")) playImage(image, key);
  };

  const selectImage = (gIndex, iIndex) => {
    if (isLocked(gIndex)) {
      setMessage(
        answerShown
          ? "Correct answers are shown. Press Start Again to try again."
          : finished
            ? "All answers are correct and locked."
            : `Group ${gIndex + 1} is correct and locked.`,
      );
      return;
    }

    setSelected((prev) => prev.map((s, i) => (i === gIndex ? iIndex : s)));

    // تعديل إجابة غلط: بيشيل علامة الغلط
    setResults((prev) => prev.map((r, i) => (i === gIndex ? null : r)));

    setMessage(
      `Group ${gIndex + 1}: picture ${iIndex + 1} marked with a cross.`,
    );
  };

  // كليك / لمس / Enter / Space: صوت + اختيار (الصوت بيشتغل حتى بعد القفل)
  const activateImage = (gIndex, iIndex, image) => {
    playImage(image, `${GROUPS[gIndex].id}-${iIndex}`);
    selectImage(gIndex, iIndex);
  };

  /* ================= CHECK ================= */

  const checkAnswers = () => {
    // بعد Show Answer أو بعد ما كل شي صح: ما في شي نعمله
    if (disabled) return;

    if (selected.some((s) => s === null)) {
      const msg = "Please choose a picture in each group!";
      ValidationAlert.info("Oops!", msg);
      setMessage(msg);
      return;
    }

    stopSound();

    // الصح القديم بيضل مقفول، والباقي بينقيّم
    const newResults = GROUPS.map((g, i) =>
      results[i] === "correct" || selected[i] === g.different
        ? "correct"
        : "wrong",
    );

    const correct = newResults.filter((r) => r === "correct").length;

    setResults(newResults);

    if (correct === COUNT) setFinished(true);

    // 🔊 فيدباك مسموع لكل مجموعة + السكور (للغلط ما بنكشف الجواب لأنو بيقدر يعدّل)
    const details = GROUPS.map(
      (g, i) =>
        `Group ${g.id}: ${
          newResults[i] === "correct"
            ? `Correct! Picture ${g.different + 1} has a different long vowel sound.`
            : "Not quite. Try another picture."
        }`,
    ).join(" ");

    setMessage(
      `Score ${correct} out of ${COUNT}. ${details}${
        correct < COUNT
          ? " Correct answers are locked. Change the answers marked with a cross, then press Check Answer again."
          : ""
      }`,
    );

    const color = correct === COUNT ? "green" : correct === 0 ? "red" : "orange";

    ValidationAlert[
      correct === COUNT ? "success" : correct === 0 ? "error" : "warning"
    ](
      `<div style="font-size:20px;text-align:center">
        <b style="color:${color}">Score: ${correct} / ${COUNT}</b>
      </div>`,
    );
  };

  /* ================= SHOW ANSWER ================= */

  const showAnswers = () => {
    stopSound();

    setSelected(GROUPS.map((g) => g.different));
    setResults(emptyArr());
    setFinished(false);
    setAnswerShown(true);
    setMessage(
      "Correct answers are shown. The different picture in each group is marked with a cross.",
    );
  };

  /* ================= START AGAIN ================= */

  const reset = () => {
    stopSound();

    setSelected(emptyArr());
    setResults(emptyArr());
    setFinished(false);
    setAnswerShown(false);
    setMessage("Exercise reset. All answers, feedback and score are cleared.");
  };

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

      <div className="div-forall" style={{ marginBottom: "35px" }}>
        <ExerciseHeader
          // sectionLetter="A"
          questionNumber="2"
          title="Which picture has a different long vowel sound? Write ✗."
          subTitle="Listen to every option once, then tap the picture whose sound is different."
        />

        <p id="u5p5q2-help" className="sr-only">
          There are two groups of pictures. Press Tab to move between the
          pictures. If a picture has a sound, it plays when it is focused. Press
          Enter or Space on a picture to mark it with a cross. Choose one
          picture in each group. After checking, correct answers are locked and
          wrong answers can be changed.
        </p>

        <div
          className="exercise-row-CB-unit5-p5-2"
          role="group"
          aria-label="Picture groups"
          aria-describedby="u5p5q2-help"
        >
          {GROUPS.map((group, gIndex) => {
            const locked = isLocked(gIndex);
            const result = results[gIndex];

            return (
              <div
                className="ds-group-box-CB-unit5-p5-2"
                key={group.id}
                role="group"
                aria-label={`Group ${group.id}: choose the picture with a different long vowel sound`}
              >
                <span
                  aria-hidden="true"
                  style={{ color: "darkblue", fontWeight: "700" }}
                >
                  {group.id}
                </span>

                {group.images.map((image, iIndex) => {
                  const key = `${group.id}-${iIndex}`;
                  const isSelected = selected[gIndex] === iIndex;
                  const isPlaying = playingKey === key;

                  const isWrong = isSelected && result === "wrong";
                  const isCorrect =
                    isSelected && (answerShown || result === "correct");

                  return (
                    <button
                      key={iIndex}
                      type="button"
                      className={`ds-image-wrapper-CB-unit5-p5-2 CB-u5p5q2-choice ${
                        isSelected ? "is-selected" : ""
                      } ${isPlaying ? "is-playing" : ""} ${
                        isCorrect ? "is-correct" : ""
                      } ${isWrong ? "is-wrong" : ""}`}
                      aria-pressed={isSelected}
                      aria-disabled={locked}
                      aria-label={`Group ${group.id}, ${pictureName(
                        gIndex,
                        iIndex,
                      )}.${
                        isSelected && result === "correct"
                          ? " Marked with a cross, correct and locked."
                          : isSelected && result === "wrong"
                            ? " Marked with a cross, incorrect, you can change it."
                            : isSelected && answerShown
                              ? " Marked with a cross, correct answer."
                              : isSelected
                                ? " Marked with a cross."
                                : " Press to mark it with a cross."
                      }`}
                      onClick={() => activateImage(gIndex, iIndex, image)}
                      onFocus={(e) => onImageFocus(e, image, key)}
                    >
                      <img
                        src={image.src}
                        alt=""
                        aria-hidden="true"
                        draggable="false"
                        className="ds-image-CB-unit5-p5-2"
                      />

                      {/* ✗ اللي كتبه الطالب على الصورة المختارة */}
                      {isSelected && (
                        <span className="ds-x-CB-unit5-p5-2" aria-hidden="true">
                          ✕
                        </span>
                      )}

                      {/* ❌ دائرة حمراء فيها ✕ بيضاء للغلط (الإيفيكت القديم) */}
                      {isWrong && (
                        <span
                          className="wrong-x-circle-CB-unit5-p5-2"
                          aria-hidden="true"
                        >
                          ✕
                        </span>
                      )}

                      {/* ✅ علامة الصح (بعد Check بس) */}
                      {/* {!answerShown && isSelected && result === "correct" && (
                        <span className="CB-u5p5q2-badge" aria-hidden="true">
                          ✓
                        </span>
                      )} */}

                      {/* 🔊 أيقونة السبيكر (بتظهر بس إذا الصورة إلها صوت) */}
                      {image.audio && (
                        <span
                          className={`CB-u5p5q2-speaker ${
                            isPlaying ? "playing" : ""
                          }`}
                          aria-hidden="true"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            width="16"
                            height="16"
                            fill="currentColor"
                          >
                            <path d="M3 9v6h4l5 5V4L7 9H3z" />
                            <path
                              d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="action-buttons-container">
          <button type="button" onClick={reset} className="try-again-button">
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
            style={
              disabled ? {  cursor: "not-allowed" } : undefined
            }
          >
            Check Answer ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unit5_Page5_Q2;
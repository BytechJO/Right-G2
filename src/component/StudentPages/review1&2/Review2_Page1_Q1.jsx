import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page18/Ex A 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page18/Ex A 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page18/Ex A 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page18/Ex A 4.svg";

import ducksAudio from "../../../assets/audio/ClassBook/U 2/Page 18 - A 1/Those are ducks..mp3";
import birdAudio from "../../../assets/audio/ClassBook/U 2/Page 18 - A 1/This is a blue bird..mp3";
import flowerAudio from "../../../assets/audio/ClassBook/U 2/Page 18 - A 1/That is a blue flower..mp3";
import sunAudio from "../../../assets/audio/ClassBook/U 2/Page 18 - A 1/That is the sun..mp3";
import trueAudio from "../../../assets/audio/ClassBook/U 2/Page 18 - A 1/true.mp3";
import falseAudio from "../../../assets/audio/ClassBook/U 2/Page 18 - A 1/false.mp3";

import "./Review2_Page1_Q1.css";
import ExerciseHeader from "../../ExerciseHeader";

/* ================= DATA ================= */

// ⚠️ عدّل وصف الصور (alt) حسب اللي بتظهر فيه كل صورة، بدون ما تكشف الجواب
const ITEMS = [
  {
    id: 1,
    img: img1,
    alt: "Picture of birds near water",
    text: "Those are ducks.",
    audio: ducksAudio,
    correctIndex: 1,
  },
  {
    id: 2,
    img: img2,
    alt: "Picture of a bird",
    text: "This is a blue bird.",
    audio: birdAudio,
    correctIndex: 1,
  },
  {
    id: 3,
    img: img3,
    alt: "Picture of a flower",
    text: "That is a blue flower.",
    audio: flowerAudio,
    correctIndex: 0,
  },
  {
    id: 4,
    img: img4,
    alt: "Picture of something bright in the sky",
    text: "That is the sun.",
    audio: sunAudio,
    correctIndex: 0,
  },
];

const OPTIONS = ["true", "false"];
const OPTION_AUDIO = { true: trueAudio, false: falseAudio };

const COUNT = ITEMS.length;
const nullArr = () => Array(COUNT).fill(null);

/* ================= HELPERS / SUB-COMPONENTS (خارج الكومبوننت) ================= */

const pauseOtherAudio = () => {
  document.querySelectorAll("audio").forEach((el) => el.pause());
};

// eslint-disable-next-line react-refresh/only-export-components
const SpeakerIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M3 9v6h4l5 5V4L7 9H3z" />
    <path
      d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const Review2_Page1_Q1 = () => {
  const [answers, setAnswers] = useState(nullArr()); // 0 = true, 1 = false
  const [results, setResults] = useState(nullArr()); // null | "correct" | "wrong"
  const [finished, setFinished] = useState(false); // كل شي صح بعد Check
  const [answerShown, setAnswerShown] = useState(false);
  const [message, setMessage] = useState("");
  const [playingId, setPlayingId] = useState(null);

  const audioRef = useRef(null);
  const tokenRef = useRef(0); // بيلغي أي تشغيل معلّق

  const disabled = finished || answerShown;

  const lockedMessage = () =>
    answerShown
      ? "Correct answers are shown. Press Start Again to try again."
      : "All answers are correct and locked.";

  /* ================= AUDIO ================= */

  const stopSound = () => {
    tokenRef.current += 1;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingId(null);
  };

  // تشغيل (أو إعادة تشغيل من الأول) بدون تداخل مع أي صوت ثاني
  const playSound = (src, id) => {
    if (!src) return;

    stopSound();
    pauseOtherAudio();

    const token = tokenRef.current;
    const audio = new Audio(src);
    audioRef.current = audio;
    setPlayingId(id);

    audio.onended = () => {
      if (token === tokenRef.current) setPlayingId(null);
    };
    audio.onerror = () => {
      if (token === tokenRef.current) setPlayingId(null);
    };
    audio.play().catch(() => {
      if (token === tokenRef.current) setPlayingId(null);
    });
  };

  // لو اشتغل أي صوت ثاني بالصفحة نوقف صوتنا، وعند الخروج من الصفحة نوقف كل شي
  useEffect(() => {
    const onOtherPlay = (e) => {
      if (e.target !== audioRef.current) {
        tokenRef.current += 1;
        audioRef.current?.pause();
        setPlayingId(null);
      }
    };

    document.addEventListener("play", onOtherPlay, true);

    return () => {
      document.removeEventListener("play", onOtherPlay, true);
      tokenRef.current += 1;
      audioRef.current?.pause();
    };
  }, []);

  // فوكس بالتاب = شغّل الصوت (الماوس/اللمس بيروحوا على onClick)
  const onFocusSound = (e, src, id) => {
    if (e.currentTarget.matches(":focus-visible")) playSound(src, id);
  };

  /* ================= SELECT ================= */

  const selectOption = (qIndex, optionIndex) => {
    const word = OPTIONS[optionIndex];

    // الصوت يشتغل دايماً (حتى لو التمرين مقفول)
    playSound(OPTION_AUDIO[word], `o-${qIndex}-${optionIndex}`);

    if (disabled) {
      setMessage(lockedMessage());
      return;
    }

    if (results[qIndex] === "correct") {
      setMessage(`Sentence ${qIndex + 1} is correct and locked.`);
      return;
    }

    setAnswers((prev) => prev.map((a, i) => (i === qIndex ? optionIndex : a)));
    setResults((prev) => prev.map((r, i) => (i === qIndex ? null : r)));
    setMessage(`Sentence ${qIndex + 1}: ${word} selected.`);
  };

  /* ================= CHECK ================= */

  const checkAnswers = () => {
    // بعد Show Answer أو بعد ما كل شي صح: ما في شي نعمله
    if (disabled) return;

    if (answers.includes(null)) {
      const msg = "Please choose true or false for all sentences!";
      ValidationAlert.info("Oops!", msg);
      setMessage(msg);
      return;
    }

    stopSound();

    // الصح القديم بيضل مقفول، والباقي بينقيّم
    const newResults = ITEMS.map((item, i) =>
      results[i] === "correct" || answers[i] === item.correctIndex
        ? "correct"
        : "wrong",
    );

    const score = newResults.filter((r) => r === "correct").length;

    setResults(newResults);
    if (score === COUNT) setFinished(true);

    // فيدباك لكل جملة
    const details = ITEMS.map(
      (_, i) =>
        `Sentence ${i + 1}: ${OPTIONS[answers[i]]} ${
          newResults[i] === "correct" ? "correct" : "incorrect"
        }`,
    ).join(". ");

    setMessage(
      `Score ${score} out of ${COUNT}. ${details}.${
        score < COUNT
          ? " Correct answers are locked. Fix the ones marked with a cross."
          : ""
      }`,
    );

    const color = score === COUNT ? "green" : score === 0 ? "red" : "orange";

    ValidationAlert[
      score === COUNT ? "success" : score === 0 ? "error" : "warning"
    ](
      `<div style="font-size:20px;text-align:center">
        <b style="color:${color}">Score: ${score} / ${COUNT}</b>
      </div>`,
    );
  };

  /* ================= SHOW ANSWER ================= */

  const showAnswers = () => {
    stopSound();
    setAnswers(ITEMS.map((item) => item.correctIndex));
    setResults(ITEMS.map(() => "correct"));
    setFinished(false);
    setAnswerShown(true);
    setMessage("Correct answers are shown.");
  };

  /* ================= START AGAIN ================= */

  const resetAll = () => {
    stopSound();
    pauseOtherAudio();
    setAnswers(nullArr());
    setResults(nullArr());
    setFinished(false);
    setAnswerShown(false);
    setMessage("Exercise reset. All answers are cleared.");
  };

  /* ================= RENDER ================= */

  const showBadges = !answerShown;

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
          sectionLetter="A"
          title="Read and circle true or false."
          subTitle="Read each statement and compare it with the picture or story before choosing True or False."
          isReview="true"
        />

        <div
          className="CB-review1-p1-q1-container"
          role="group"
          aria-label="Questions"
          aria-describedby="r2p1q1-help"
        >
          {ITEMS.map((q, i) => {
            const res = results[i];
            const sentenceId = `s-${i}`;

            return (
              <div
                key={q.id}
                role="group"
                aria-label={`Question ${q.id}`}
                className="CB-review2-p1-q1-question"
              >
                <div className="CB-review2-p1-q1-left">
                  <span className="CB-review1-p1-q1-index" aria-hidden="true">
                    {q.id}
                  </span>

                  {/* 🔊 الجملة: زر بيشغّل الصوت */}
                  <button
                    type="button"
                    className={`CB-review2-p1-q1-sentence ${
                      playingId === sentenceId ? "is-playing" : ""
                    }`}
                    aria-label={`Sentence ${q.id}: ${q.text} Press Enter to listen again`}
                    onClick={() => playSound(q.audio, sentenceId)}
                    onFocus={(e) => onFocusSound(e, q.audio, sentenceId)}
                  >
                    <span className="CB-review2-p1-q1-text" aria-hidden="true">
                      {q.text}
                    </span>
                    <span
                      className={`CB-review2-p1-q1-speaker ${
                        playingId === sentenceId ? "playing" : ""
                      }`}
                      aria-hidden="true"
                    >
                      <SpeakerIcon />
                    </span>
                  </button>
                </div>

                <div className="CB-review2-p1-q1-image-container">
                  <img
                    src={q.img}
                    alt={q.alt}
                    className="CB-review1-p1-q1-image"
                    style={{ width: "170px" }}
                    draggable="false"
                  />

                  <div
                    className="CB-review2-p1-q1-options"
                    style={{ fontSize: "20px" }}
                    role="group"
                    aria-label={`Sentence ${q.id}: choose true or false`}
                  >
                    {OPTIONS.map((word, optIndex) => {
                      const isSelected = answers[i] === optIndex;
                      const state = isSelected && res ? res : "";
                      const optId = `o-${i}-${optIndex}`;

                      return (
                        <button
                          key={word}
                          type="button"
                          className={`CB-review2-p1-q1-option ${
                            isSelected ? "is-selected" : ""
                          } ${playingId === optId ? "is-playing" : ""} ${
                            state === "correct"
                              ? "is-correct"
                              : state === "wrong"
                                ? "is-wrong"
                                : ""
                          }`}
                          aria-pressed={isSelected}
                          aria-disabled={disabled || res === "correct"}
                          aria-label={`${word}${
                            state === "correct"
                              ? ", correct and locked"
                              : state === "wrong"
                                ? ", incorrect, you can change it"
                                : ""
                          }`}
                          // style={{
                          //   borderColor:
                          //     state === "correct"
                          //       ? "green"
                          //       : "red",
                          // }}
                          onClick={() => selectOption(i, optIndex)}
                          onFocus={(e) =>
                            onFocusSound(e, OPTION_AUDIO[word], optId)
                          }
                        >
                          <span aria-hidden="true">{word}</span>

                          <span
                            className={`CB-review2-p1-q1-speaker ${
                              playingId === optId ? "playing" : ""
                            }`}
                            aria-hidden="true"
                          >
                            <SpeakerIcon />
                          </span>

                          {showBadges && state === "wrong" && (
                            <span
                              className="CB-review1-p1-q1-wrong-x"
                              aria-hidden="true"
                            >
                              ✕
                            </span>
                          )}
                          {/* {showBadges && state === "correct" && (
                            <span
                              className="CB-review2-p1-q1-ok"
                              aria-hidden="true"
                            >
                              ✓
                            </span>
                          )} */}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="action-buttons-container">
          <button type="button" className="try-again-button" onClick={resetAll}>
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
            className="check-button2"
            onClick={checkAnswers}
          >
            Check Answer ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review2_Page1_Q1;

import React, { useState, useRef, useEffect } from "react";
import img1 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 26/Ex A 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 26/Ex A 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 26/Ex A 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 26/Ex A 4.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import sound1 from "../../../assets/audio/ClassBook/U 3/cd19pg26question.mp3";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import "./Unit3_Page5_Q1.css";

/* ================= DATA ================= */

const stopAtSecond = 11.5;

const captions = [
  {
    start: 0.44,
    end: 11.5,
    text: "Page 26, Right Activities. Exercise A, number 1. Does it begin with J or Y? Listen and write.",
  },
  { start: 12.68, end: 14.04, text: "1, jump." },
  { start: 15.08, end: 21.92, text: "2, juice. 3, jeep. 4, yarn." },
];

const LETTERS = ["j", "y"];

// ⚠️ alt وصف عام بدون اسم الشي (لأنو اسمه بيكشف الحرف الأول) وأنا ما شفت الصور، فتأكدي منه
// ⚠️ audio.start / audio.end = مقطع كل سؤال من نفس ملف الصوت (بالثواني)
// السؤال 1 من الـ captions مباشرة، والأسئلة 2 و3 و4 تقديرية (الـ caption بيجمعهم 15.08 إلى 21.92): عدّليها بعد ما تسمعي الملف
const QUESTIONS = [
  {
    id: 1,
    image: img1,
    alt: "a child leaping into the air",
    word: "jump",
    correct: "j",
    audio: { start: 12.68, end: 14.04 },
  },
  {
    id: 2,
    image: img2,
    alt: "a glass of orange drink",
    word: "juice",
    correct: "j",
    audio: { start: 15.08, end: 17.4 },
  },
  {
    id: 3,
    image: img3,
    alt: "a small open-top car for rough roads",
    word: "jeep",
    correct: "j",
    audio: { start: 17.6, end: 19.6 },
  },
  {
    id: 4,
    image: img4,
    alt: "a ball of wool thread for knitting",
    word: "yarn",
    correct: "y",
    audio: { start: 19.8, end: 21.92 },
  },
];

const COUNT = QUESTIONS.length;

const emptyArr = () => Array(COUNT).fill("");
const nullArr = () => Array(COUNT).fill(null);

/* ================= HELPERS (خارج الكومبوننت) ================= */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const feedbackText = (q, result) =>
  result === "correct"
    ? `Correct! ${cap(q.word)} begins with ${q.correct}.`
    : `Not quite. ${cap(q.word)} begins with ${q.correct}.`;

const pauseOtherAudio = () => {
  document.querySelectorAll("audio").forEach((el) => el.pause());
};

const Unit3_Page5_Q1 = () => {
  const [answers, setAnswers] = useState(emptyArr()); // "j" | "y" | ""
  const [results, setResults] = useState(nullArr()); // null | "correct" | "wrong"
  const [finished, setFinished] = useState(false); // كل شي صح بعد Check
  const [answerShown, setAnswerShown] = useState(false);
  const [message, setMessage] = useState("");
  const [activeId, setActiveId] = useState(null); // آخر سؤال تعاملت معه
  const [playingId, setPlayingId] = useState(null); // أي سؤال صوته شغّال

  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const tokenRef = useRef(0); // بيلغي أي تشغيل معلّق

  const disabled = finished || answerShown;

  // 🔒 السؤال الصح مقفول، الغلط بيضل قابل للتعديل
  const isLocked = (i) => disabled || results[i] === "correct";

  /* ================= AUDIO ================= */

  const getAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(sound1);
      audioRef.current.preload = "auto";
    }
    return audioRef.current;
  };

  const stopItemSound = () => {
    tokenRef.current += 1;
    clearInterval(timerRef.current);
    audioRef.current?.pause();
    setPlayingId(null);
  };

  // تشغيل (أو إعادة تشغيل) مقطع السؤال، بدون تداخل مع أي صوت ثاني
  const playItem = (q) => {
    stopItemSound();
    pauseOtherAudio();

    const token = tokenRef.current;
    const audio = getAudio();

    const start = () => {
      if (token !== tokenRef.current) return;
      audio.currentTime = q.audio.start;
      audio
        .play()
        .then(() => {
          if (token !== tokenRef.current) return;
          setPlayingId(q.id);
          timerRef.current = setInterval(() => {
            if (audio.currentTime >= q.audio.end || audio.ended) {
              stopItemSound();
            }
          }, 50);
        })
        .catch(() => {
          if (token === tokenRef.current) setPlayingId(null);
        });
    };

    if (audio.readyState >= 1) {
      start();
    } else {
      audio.addEventListener("loadedmetadata", start, { once: true });
      audio.load();
    }
  };

  // لو اشتغل أي صوت ثاني بالصفحة (مشغّل التعليمات) نوقف صوت الأسئلة
  // وعند الخروج من الصفحة نوقف كل شي
  useEffect(() => {
    const onOtherPlay = (e) => {
      if (e.target !== audioRef.current) {
        tokenRef.current += 1;
        clearInterval(timerRef.current);
        audioRef.current?.pause();
        setPlayingId(null);
      }
    };

    document.addEventListener("play", onOtherPlay, true);

    return () => {
      document.removeEventListener("play", onOtherPlay, true);
      tokenRef.current += 1;
      clearInterval(timerRef.current);
      audioRef.current?.pause();
    };
  }, []);

  /* ================= INTERACTIONS ================= */

  // فوكس بالتاب على الصورة = شغّل صوتها (الماوس/اللمس بيروحوا على onClick)
  const onPictureFocus = (e, q) => {
    setActiveId(q.id);
    if (e.currentTarget.matches(":focus-visible")) playItem(q);
  };

  const onPictureClick = (q) => {
    setActiveId(q.id);
    playItem(q);
  };

  const selectLetter = (i, letter) => {
    setActiveId(QUESTIONS[i].id);

    if (isLocked(i)) {
      setMessage(
        answerShown
          ? "Correct answers are shown. Press Start Again to try again."
          : finished
            ? "All answers are correct and locked."
            : `Question ${i + 1} is correct and locked.`,
      );
      return;
    }

    setAnswers((prev) => prev.map((a, idx) => (idx === i ? letter : a)));

    // تعديل إجابة غلط: بيشيل علامة الغلط
    setResults((prev) => prev.map((r, idx) => (idx === i ? null : r)));

    setMessage(`Question ${i + 1}: letter ${letter} selected.`);
  };

  /* ================= CHECK ================= */

  const checkAnswers = () => {
    // بعد Show Answer أو بعد ما كل شي صح: ما في شي نعمله
    if (disabled) return;

    if (answers.some((a) => a === "")) {
      const msg = "Please choose j or y for all questions!";
      ValidationAlert.info("Oops!", msg);
      setMessage(msg);
      return;
    }

    stopItemSound();

    // الصح القديم بيضل مقفول، والباقي بينقيّم
    const newResults = QUESTIONS.map((q, i) =>
      results[i] === "correct" || answers[i] === q.correct
        ? "correct"
        : "wrong",
    );

    const correct = newResults.filter((r) => r === "correct").length;

    setResults(newResults);

    if (correct === COUNT) setFinished(true);

    // 🔊 فيدباك مسموع لقارئ الشاشة (لكل سؤال + السكور)
    const details = QUESTIONS.map(
      (q, i) => `Question ${q.id}: ${feedbackText(q, newResults[i])}`,
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

  const showAnswer = () => {
    stopItemSound();
    setAnswers(QUESTIONS.map((q) => q.correct));
    setResults(nullArr());
    setFinished(false);
    setAnswerShown(true);
    setMessage("Correct answers are shown.");
  };

  /* ================= START AGAIN ================= */

  const reset = () => {
    stopItemSound();
    pauseOtherAudio();

    setAnswers(emptyArr());
    setResults(nullArr());
    setFinished(false);
    setAnswerShown(false);
    setActiveId(null);
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
          sectionLetter="A"
          questionNumber="1"
          title="Does it begin with j or y? Listen and write."
          subTitle="Replay the audio, say the word quietly, then tap the sound or letter that matches."

        />

        <p id="u3p5q1-help" className="sr-only">
          Press Tab to move between the pictures and the letters. When a
          picture is focused, its sound plays. Press Enter or Space on a
          picture to hear it again. Press Enter or Space on j or y to choose
          it. After checking, correct answers are locked and wrong answers can
          be changed.
        </p>

        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
          pageId={"sb-unit3-page5-q1"}
        />

        <div
          className="CB-u3p5q1-list"
          role="group"
          aria-label="Questions"
          aria-describedby="u3p5q1-help"
        >
          {QUESTIONS.map((q, i) => {
            const chosen = answers[i];
            const result = results[i];
            const locked = isLocked(i);
            const isActive = activeId === q.id;
            const isPlaying = playingId === q.id;

            return (
              <div
                key={q.id}
                role="group"
                aria-label={`Question ${q.id}`}
                className={`CB-u3p5q1-item ${isActive ? "is-active" : ""}`}
              >
                <span className="CB-u3p5q1-num" aria-hidden="true">
                  {q.id}.
                </span>

                {/* 🖼️ الصورة كاملة = زر لإعادة الصوت */}
                <button
                  type="button"
                  className={`CB-u3p5q1-pic ${isPlaying ? "is-playing" : ""}`}
                  aria-label={`Picture ${q.id}: ${q.alt}. Press to listen again.`}
                  onClick={() => onPictureClick(q)}
                  onFocus={(e) => onPictureFocus(e, q)}
                >
                  <img
                    src={q.image}
                    alt=""
                    aria-hidden="true"
                    draggable="false"
                  />

                  <span
                    className={`CB-u3p5q1-speaker ${isPlaying ? "playing" : ""}`}
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
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
                </button>

                {/* j / y */}
                <div className="CB-u3p5q1-letters">
                  {LETTERS.map((letter) => {
                    const isSelected = chosen === letter;
                    const state =
                      isSelected && result
                        ? result === "correct"
                          ? "is-correct"
                          : "is-wrong"
                        : "";

                    return (
                      <div key={letter} className="CB-u3p5q1-letter-wrap">
                        <button
                          type="button"
                          className={`CB-u3p5q1-letter ${
                            isSelected ? "is-selected" : ""
                          } ${state}`}
                          aria-pressed={isSelected}
                          aria-disabled={locked}
                          aria-label={`Letter ${letter}${
                            isSelected && result === "correct"
                              ? ", correct and locked"
                              : isSelected && result === "wrong"
                                ? ", incorrect, you can change it"
                                : ""
                          }`}
                          onClick={() => selectLetter(i, letter)}
                          onFocus={() => setActiveId(q.id)}
                        >
                          <span aria-hidden="true">{letter}</span>
                        </button>

                        {/* ✅❌ أيقونة النتيجة: فوق يمين الحرف المختار */}
                        {!answerShown && isSelected && result && (
                          <span
                            className={`CB-u3p5q1-badge ${result}`}
                            aria-hidden="true"
                          >
                            {result === "correct" ? "" : "✕"}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
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
            onClick={showAnswer}
            className="show-answer-btn swal-continue"
          >
            Show Answer
          </button>
          <button
            type="button"
            onClick={checkAnswers}
            className="check-button2"
            aria-disabled={disabled}
            style={
              disabled ? { cursor: "not-allowed" } : undefined
            }
          >
            Check Answer ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unit3_Page5_Q1;
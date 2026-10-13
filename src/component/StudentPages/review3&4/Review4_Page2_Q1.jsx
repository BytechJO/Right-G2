import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import img1 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 38/Asset 30.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 38/Asset 31.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 38/Asset 32.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 38/Asset 33.svg";
import img5 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 38/Asset 34.svg";
import sound1 from "../../../assets/audio/ClassBook/U 4/cd26pg37-instruction1-adult-lady_NPuiMbFv.mp3";
import trueIcon from "../../../assets/imgs/true.svg";
import falseIcon from "../../../assets/imgs/false.svg";
import "./Review4_Page2_Q1.css";

/* ================= DATA ================= */

const stopAtSecond = 11.0;

const captions = [
  { start: 0.54, end: 4.48, text: "Page 37, review 4, exercise C." },
  {
    start: 5.64,
    end: 11.0,
    text: "Does it have long A? Listen and write ✓ or X.",
  },
  { start: 12.28, end: 14.2, text: "1, pie." },
  { start: 15.26, end: 20.08, text: "2, train. 3, grapes." },
  { start: 21.12, end: 25.34, text: "4, eight. 5, tree." },
];

const TICK = "✓";
const CROSS = "✗";

// ⚠️ alt وصف عام بدون اسم الشي (لأنو اسمه بيكشف الجواب) وأنا ما شفت الصور، فتأكدي منه
// ⚠️ audio.start / audio.end = مقطع كل سؤال من نفس ملف الصوت (بالثواني)
// السؤال 1 من الـ captions مباشرة، والأسئلة 2 و3 و4 و5 تقديرية (الـ caption بيجمع كل اثنين): عدّليها بعد ما تسمعي الملف
const QUESTIONS = [
  {
    id: 1,
    image: img1,
    alt: "a round baked dessert with a golden crust",
    word: "pie",
    correct: CROSS,
    audio: { start: 12.28, end: 14.2 },
  },
  {
    id: 2,
    image: img2,
    alt: "a long vehicle with many carriages that runs on rails",
    word: "train",
    correct: TICK,
    audio: { start: 15.26, end: 17.4 },
  },
  {
    id: 3,
    image: img3,
    alt: "a bunch of small round fruits hanging from a stem",
    word: "grapes",
    correct: TICK,
    audio: { start: 17.6, end: 20.08 },
  },
  {
    id: 4,
    image: img4,
    alt: "the number that comes after seven",
    word: "eight",
    correct: TICK,
    audio: { start: 21.12, end: 23.2 },
  },
  {
    id: 5,
    image: img5,
    alt: "a tall plant with a thick trunk and green leaves",
    word: "tree",
    correct: CROSS,
    audio: { start: 23.4, end: 25.34 },
  },
];

const COUNT = QUESTIONS.length;

const emptyArr = () => Array(COUNT).fill("");
const nullArr = () => Array(COUNT).fill(null);

/* ================= HELPERS (خارج الكومبوننت) ================= */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const feedbackText = (q, result) => {
  const fact = `${cap(q.word)} ${
    q.correct === TICK ? "has long a" : "does not have long a"
  }.`;

  return result === "correct" ? `Correct! ${fact}` : `Not quite. ${fact}`;
};

const choiceName = (value) =>
  value === TICK ? "Tick, has long a" : "Cross, does not have long a";

const pauseOtherAudio = () => {
  document.querySelectorAll("audio").forEach((el) => el.pause());
};

const Review4_Page2_Q1 = () => {
  const [answers, setAnswers] = useState(emptyArr()); // "✓" | "✗" | ""
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

  const selectAnswer = (i, value) => {
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

    setAnswers((prev) => prev.map((a, idx) => (idx === i ? value : a)));

    // تعديل إجابة غلط: بيشيل علامة الغلط
    setResults((prev) => prev.map((r, idx) => (idx === i ? null : r)));

    setMessage(
      `Question ${i + 1}: ${value === TICK ? "tick" : "cross"} selected.`,
    );
  };

  /* ================= CHECK ================= */

  const checkAnswers = () => {
    // بعد Show Answer أو بعد ما كل شي صح: ما في شي نعمله
    if (disabled) return;

    if (answers.some((a) => a === "")) {
      const msg = "Please choose ✓ or ✗ for all questions!";
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

  const showAnswers = () => {
    stopItemSound();
    setAnswers(QUESTIONS.map((q) => q.correct));
    setResults(nullArr());
    setFinished(false);
    setAnswerShown(true);
    setMessage("Correct answers are shown.");
  };

  /* ================= START AGAIN ================= */

  const resetAnswers = () => {
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
          sectionLetter="C"
          title="Does it have long a? Listen and write ✓ or ✗."
          subTitle="Listen to both sounds carefully, then choose Yes/No only after comparing them."
          isReview="true"
        />

        <p id="r4p2q1-help" className="sr-only">
          Press Tab to move between the pictures and the answer buttons. When a
          picture is focused, its sound plays. Press Enter or Space on a
          picture to hear it again. Press Enter or Space on tick or cross to
          choose it. After checking, correct answers are locked and wrong
          answers can be changed.
        </p>

        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
          pageId={"sb-review4-page2-q1"}
        />

        <div
          className="CB-r4p2q1-list"
          role="group"
          aria-label="Questions"
          aria-describedby="r4p2q1-help"
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
                className={`CB-r4p2q1-item ${isActive ? "is-active" : ""}`}
              >
                <span className="CB-r4p2q1-num" aria-hidden="true">
                  {q.id}
                </span>

                {/* 🖼️ الصورة كاملة = زر لإعادة الصوت */}
                <button
                  type="button"
                  className={`CB-r4p2q1-pic ${isPlaying ? "is-playing" : ""}`}
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
                    className={`CB-r4p2q1-speaker ${isPlaying ? "playing" : ""}`}
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

                {/* ✓ / ✗ */}
                <div className="CB-r4p2q1-choices">
                  {[TICK, CROSS].map((value) => {
                    const isSelected = chosen === value;
                    const state =
                      isSelected && result
                        ? result === "correct"
                          ? "is-correct"
                          : "is-wrong"
                        : "";

                    return (
                      <div key={value} className="CB-r4p2q1-choice-wrap">
                        <button
                          type="button"
                          className={`CB-r4p2q1-choice ${
                            isSelected ? "is-selected" : ""
                          } ${state}`}
                          aria-pressed={isSelected}
                          aria-disabled={locked}
                          aria-label={`${choiceName(value)}${
                            isSelected && result === "correct"
                              ? ", correct and locked"
                              : isSelected && result === "wrong"
                                ? ", incorrect, you can change it"
                                : ""
                          }`}
                          onClick={() => selectAnswer(i, value)}
                          onFocus={() => setActiveId(q.id)}
                        >
                          <img
                            src={value === TICK ? trueIcon : falseIcon}
                            alt=""
                            aria-hidden="true"
                            draggable="false"
                          />
                        </button>

                        {/* ✅❌ أيقونة النتيجة: فوق يمين الخيار المختار */}
                        {!answerShown && isSelected && result && (
                          <span
                            className={`CB-r4p2q1-badge ${result}`}
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
          <button
            type="button"
            onClick={resetAnswers}
            className="try-again-button"
          >
            Start Again ↻
          </button>
          <button
            type="button"
            onClick={showAnswers}
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

export default Review4_Page2_Q1;
import React, { useState, useRef, useEffect } from "react";
import "./Review1_Page2_Q2.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 17/Ex D 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 17/Ex D 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 17/Ex D 3.svg";
import sound1 from "../../../assets/audio/ClassBook/U 2/cd11pg17-instruction1-adult-lady_0dI0ldka.mp3";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import trueIcon from "../../../assets/imgs/true.svg";
import falseIcon from "../../../assets/imgs/false.svg";
import ExerciseHeader from "../../ExerciseHeader";

/* ================= DATA ================= */

const stopAtSecond = 13.74;

const captions = [
  { start: 0.62, end: 5.66, text: "Page 17, review 1, exercise D." },
  {
    start: 6.94,
    end: 13.74,
    text: "Do they both begin with the same sound? Listen and write, ✓ or X.",
  },
  { start: 14.9, end: 22.08, text: "1, lion, lamp. 2, radio, log." },
  { start: 23.1, end: 26.86, text: "3, robot,rainbow." },
];

const TICK = "✓";
const CROSS = "✗";

// ⚠️ audio.start / audio.end = مقطع كل سؤال من نفس ملف الصوت (بالثواني)
// الأرقام تقديرية من الـ captions، عدّليها بعد ما تسمعي الملف
const QUESTIONS = [
  {
    id: 1,
    image: img1,
    alt: "a lion and a lamp",
    words: ["lion", "lamp"],
    correct: TICK,
    audio: { start: 14.9, end: 18.3 },
  },
  {
    id: 2,
    image: img2,
    alt: "a radio and a log",
    words: ["radio", "log"],
    correct: CROSS,
    audio: { start: 18.4, end: 22.1 },
  },
  {
    id: 3,
    image: img3,
    alt: "a robot and a rainbow",
    words: ["robot", "rainbow"],
    correct: TICK,
    audio: { start: 23.1, end: 26.86 },
  },
];

/* ================= HELPERS (خارج الكومبوننت) ================= */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const feedbackText = (q, result) => {
  const same = q.correct === TICK;
  const fact = `${cap(q.words.join(" and "))} ${
    same ? "begin with the same sound" : "do not begin with the same sound"
  }.`;
  return result === "correct" ? `Correct! ${fact}` : `Not quite. ${fact}`;
};

const choiceName = (value) =>
  value === TICK ? "Tick, same sound" : "Cross, different sound";

const pauseOtherAudio = () => {
  document.querySelectorAll("audio").forEach((el) => el.pause());
};

const Review1_Page2_Q2 = () => {
  const [answers, setAnswers] = useState({}); // { [id]: "✓" | "✗" }
  const [results, setResults] = useState({}); // { [id]: "correct" | "wrong" }
  const [setScore] = useState(null); // { correct, total } | null
  const [answerShown, setAnswerShown] = useState(false); // بعد Show Answer = كل شي مقفول
  const [finished, setFinished] = useState(false); // كل شي صح بعد Check
  const [message, setMessage] = useState("");
  const [activeId, setActiveId] = useState(null); // آخر سؤال تعاملت معه
  const [playingId, setPlayingId] = useState(null); // أي سؤال صوته شغّال

  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const tokenRef = useRef(0); // بيلغي أي تشغيل معلّق

  const disabled = finished || answerShown;
  // 🔒 السؤال الصح مقفول، الغلط بيضل قابل للتعديل
  const isLocked = (id) => answerShown || results[id] === "correct";

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

  const selectAnswer = (id, value) => {
    setActiveId(id);

  if (isLocked(id)) {
  setMessage(
    answerShown
      ? "Correct answers are shown. Press Start Again to try again."
      : `Question ${id} is correct and locked.`,
  );
  return;
}

    setAnswers((prev) => ({ ...prev, [id]: value }));

    // تعديل إجابة غلط: بيشيل علامة الغلط والسكور القديم
    setResults((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setScore(null);

    setMessage(
      `Question ${id}: ${value === TICK ? "tick" : "cross"} selected.`,
    );
  };

  /* ================= SHOW ANSWER ================= */

  const showAnswers = () => {
    stopItemSound();

    const corrects = {};
    QUESTIONS.forEach((q) => {
      corrects[q.id] = q.correct;
    });

    setAnswers(corrects);
    setResults({});
    setScore(null);
    setAnswerShown(true);
    setFinished(false);
    setMessage("Correct answers are shown.");
  };

  /* ================= CHECK ================= */

  const checkAnswers = () => {
    // بعد Show Answer أو بعد ما كل شي صح: ما في شي نعمله
    if (disabled) return;

    if (QUESTIONS.some((q) => !answers[q.id])) {
      const msg = "Please choose ✓ or ✗ for all questions!";
      ValidationAlert.info("Oops!", msg);
      setMessage(msg);
      return;
    }

    stopItemSound();

    // الصح القديم بيضل مقفول، والباقي بينقيّم
    const checked = {};
    QUESTIONS.forEach((q) => {
      checked[q.id] =
        results[q.id] === "correct"
          ? "correct"
          : answers[q.id] === q.correct
            ? "correct"
            : "wrong";
    });

    const total = QUESTIONS.length;
    const correct = Object.values(checked).filter(
      (r) => r === "correct",
    ).length;

    setResults(checked);

    if (correct === total) setFinished(true);

    // فيدباك لكل سؤال
    const details = QUESTIONS.map(
      (q) => `Question ${q.id}: ${feedbackText(q, checked[q.id])}`,
    ).join(" ");

    setMessage(
      `Score ${correct} out of ${total}. ${details}${
        correct < total
          ? " Correct answers are locked. Fix the answers marked with a cross."
          : ""
      }`,
    );

    const color =
      correct === total ? "green" : correct === 0 ? "red" : "orange";

    ValidationAlert[
      correct === total ? "success" : correct === 0 ? "error" : "warning"
    ](
      `<div style="font-size:20px;text-align:center">
      <b style="color:${color}">Score: ${correct} / ${total}</b>
    </div>`,
    );
  };

  /* ================= START AGAIN ================= */

  const resetAnswers = () => {
    // بس نوقف أي صوت شغّال (بدون ما نلمس مشغّل التعليمات)
    stopItemSound();
    pauseOtherAudio();
    setFinished(false);
    setAnswers({});
    setResults({});
    setScore(null);
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
          sectionLetter="D"
          // questionNumber="1"
          title="Do they both begin with the same sound? Listen and write ✓ or ✗."
          subTitle="Replay the audio, say the word quietly, then tap the sound or letter that matches."
          isReview="true"
        />

        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
          pageId={"sb-review1-page2-q2"}
        />

        <div
          className="CB-r1p2q2-list"
          role="group"
          aria-label="Questions"
          aria-describedby="r1p2q2-help"
        >
          {QUESTIONS.map((q) => {
            const chosen = answers[q.id];
            const result = results[q.id];
            const locked = isLocked(q.id);
            const isActive = activeId === q.id;
            const isPlaying = playingId === q.id;

            return (
              <div
                key={q.id}
                role="group"
                aria-label={`Question ${q.id}`}
                className={`CB-r1p2q2-item ${isActive ? "is-active" : ""}`}
              >
                <span className="CB-r1p2q2-num" aria-hidden="true">
                  {q.id}.
                </span>

                {/* 🖼️ الصورة كاملة = زر لإعادة الصوت */}
                <button
                  type="button"
                  className={`CB-r1p2q2-pic ${isPlaying ? "is-playing" : ""}`}
                  aria-label={`Picture ${q.id}: ${q.alt}. Press to listen again.`}
                  onClick={() => onPictureClick(q)}
                  onFocus={(e) => onPictureFocus(e, q)}
                >
                  <img src={q.image} alt={q.alt} draggable="false" />

                  <span
                    className={`CB-r1p2q2-speaker ${isPlaying ? "playing" : ""}`}
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
                <div className="CB-r1p2q2-choices">
                  {[TICK, CROSS].map((value) => {
                    const isSelected = chosen === value;
                    const state =
                      isSelected && result
                        ? result === "correct"
                          ? "is-correct"
                          : "is-wrong"
                        : "";

                    return (
                      <div key={value} className="CB-r1p2q2-choice-wrap">
                        <button
                          type="button"
                          className={`CB-r1p2q2-choice ${
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
                          onClick={() => selectAnswer(q.id, value)}
                          onFocus={() => setActiveId(q.id)}
                        >
                          <img
                            src={value === TICK ? trueIcon : falseIcon}
                            alt=""
                            aria-hidden="true"
                            draggable="false"
                          />
                        </button>

                        {/* ✅❌ أيقونة النتيجة: فوق يمين البوكس المختار */}
                        {isSelected && result && (
                          <span
                            className={`CB-r1p2q2-badge ${result}`}
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
          >
            Check Answer ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review1_Page2_Q2;

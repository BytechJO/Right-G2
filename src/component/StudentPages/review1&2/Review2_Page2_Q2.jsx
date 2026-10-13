import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import sound1 from "../../../assets/audio/ClassBook/U 2/cd13pg19-instruction2-adult-lady_wzkLPOcn.mp3";
import img1 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 19/Ex F 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 19/Ex F 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 19/Ex F 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 19/Ex F 4.svg";
import "./Review2_Page2_Q2.css";

/* ================= DATA ================= */

const stopAtSecond = 11.3;

const captions = [
  {
    start: 0.52,
    end: 11.3,
    text: "Page 19, review 2, exercise F. Does it end with -ck or -x? Listen and circle.",
  },
  { start: 12.38, end: 14.04, text: "1, ox." },
  { start: 15.08, end: 19.3, text: "2, back. 3, fox." },
  { start: 20.36, end: 22.04, text: "4, truck." },
];

const OPTIONS = ["-ck", "-x"];

// ⚠️ alt وصف عام بدون اسم الشي (لأنو اسمه بيكشف النهاية) وأنا ما شفت الصور، فتأكدي منه
// ⚠️ audio.start / audio.end = مقطع كل سؤال من نفس ملف الصوت (بالثواني)
// السؤال 1 و4 من الـ captions مباشرة، والسؤال 2 و3 تقديريين (الـ caption بيجمعهم): عدّليهم بعد ما تسمعي الملف
const ITEMS = [
  {
    id: 1,
    img: img1,
    alt: "a large farm animal with horns",
    word: "ox",
    correct: "-x",
    audio: { start: 12.38, end: 14.04 },
  },
  {
    id: 2,
    img: img2,
    alt: "the rear part of a person's body",
    word: "back",
    correct: "-ck",
    audio: { start: 15.08, end: 17.2 },
  },
  {
    id: 3,
    img: img3,
    alt: "a wild animal with a bushy tail",
    word: "fox",
    correct: "-x",
    audio: { start: 17.5, end: 19.3 },
  },
  {
    id: 4,
    img: img4,
    alt: "a big vehicle that carries heavy loads",
    word: "truck",
    correct: "-ck",
    audio: { start: 20.36, end: 22.04 },
  },
];

const COUNT = ITEMS.length;

const emptyArr = () => Array(COUNT).fill("");
const nullArr = () => Array(COUNT).fill(null);

/* ================= HELPERS (خارج الكومبوننت) ================= */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const feedbackText = (item, result) =>
  result === "correct"
    ? `Correct! ${cap(item.word)} ends with ${item.correct}.`
    : `Not quite. ${cap(item.word)} ends with ${item.correct}.`;

const pauseOtherAudio = () => {
  document.querySelectorAll("audio").forEach((el) => el.pause());
};

const Review2_Page2_Q2 = () => {
  const [answers, setAnswers] = useState(emptyArr()); // "-ck" | "-x" | ""
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
  const playItem = (item) => {
    stopItemSound();
    pauseOtherAudio();

    const token = tokenRef.current;
    const audio = getAudio();

    const start = () => {
      if (token !== tokenRef.current) return;
      audio.currentTime = item.audio.start;
      audio
        .play()
        .then(() => {
          if (token !== tokenRef.current) return;
          setPlayingId(item.id);
          timerRef.current = setInterval(() => {
            if (audio.currentTime >= item.audio.end || audio.ended) {
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
  const onPictureFocus = (e, item) => {
    setActiveId(item.id);
    if (e.currentTarget.matches(":focus-visible")) playItem(item);
  };

  const onPictureClick = (item) => {
    setActiveId(item.id);
    playItem(item);
  };

  const selectOption = (i, option) => {
    setActiveId(ITEMS[i].id);

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

    setAnswers((prev) => prev.map((a, idx) => (idx === i ? option : a)));

    // تعديل إجابة غلط: بيشيل علامة الغلط
    setResults((prev) => prev.map((r, idx) => (idx === i ? null : r)));

    setMessage(`Question ${i + 1}: ${option} selected.`);
  };

  /* ================= CHECK ================= */

  const checkAnswers = () => {
    // بعد Show Answer أو بعد ما كل شي صح: ما في شي نعمله
    if (disabled) return;

    if (answers.some((a) => a === "")) {
      const msg = "Please answer all items first.";
      ValidationAlert.info("Oops!", msg);
      setMessage(msg);
      return;
    }

    stopItemSound();

    // الصح القديم بيضل مقفول، والباقي بينقيّم
    const newResults = ITEMS.map((item, i) =>
      results[i] === "correct" || answers[i] === item.correct
        ? "correct"
        : "wrong",
    );

    const correct = newResults.filter((r) => r === "correct").length;

    setResults(newResults);

    if (correct === COUNT) setFinished(true);

    // 🔊 فيدباك مسموع لقارئ الشاشة (لكل سؤال + السكور)
    const details = ITEMS.map(
      (item, i) => `Question ${item.id}: ${feedbackText(item, newResults[i])}`,
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
    setAnswers(ITEMS.map((item) => item.correct));
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
          sectionLetter="F"
          title="Does it end with -ck or -x? Listen and circle."
          subTitle="Read the clue completely, then tap the option that best matches it."
          isReview="true"
        />

        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
          pageId={"sb-review2-page2-q2"}
        />

        <div
          className="CB-r2p2q2-list"
          role="group"
          aria-label="Questions"
          aria-describedby="r2p2q2-help"
        >
          {ITEMS.map((item, i) => {
            const chosen = answers[i];
            const result = results[i];
            const locked = isLocked(i);
            const isActive = activeId === item.id;
            const isPlaying = playingId === item.id;

            return (
              <div
                key={item.id}
                role="group"
                aria-label={`Question ${item.id}`}
                className={`CB-r2p2q2-item ${isActive ? "is-active" : ""}`}
              >
                <span className="CB-r2p2q2-num" aria-hidden="true">
                  {item.id}
                </span>

                {/* 🖼️ الصورة كاملة = زر لإعادة الصوت */}
                <button
                  type="button"
                  className={`CB-r2p2q2-pic ${isPlaying ? "is-playing" : ""}`}
                  aria-label={`Picture ${item.id}: ${item.alt}. Press to listen again.`}
                  onClick={() => onPictureClick(item)}
                  onFocus={(e) => onPictureFocus(e, item)}
                >
                  <img
                    src={item.img}
                    alt=""
                    aria-hidden="true"
                    draggable="false"
                  />

                  <span
                    className={`CB-r2p2q2-speaker ${isPlaying ? "playing" : ""}`}
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

                {/* -ck / -x */}
                <div className="CB-r2p2q2-options">
                  {OPTIONS.map((option) => {
                    const isSelected = chosen === option;
                    const state =
                      isSelected && result
                        ? result === "correct"
                          ? "is-correct"
                          : "is-wrong"
                        : "";

                    return (
                      <div key={option} className="CB-r2p2q2-option-wrap">
                        <button
                          type="button"
                          className={`CB-r2p2q2-option ${
                            isSelected ? "is-selected" : ""
                          } ${state}`}
                          aria-pressed={isSelected}
                          aria-disabled={locked}
                          aria-label={`Ending ${option}${
                            isSelected && result === "correct"
                              ? ", correct and locked"
                              : isSelected && result === "wrong"
                                ? ", incorrect, you can change it"
                                : ""
                          }`}
                          onClick={() => selectOption(i, option)}
                          onFocus={() => setActiveId(item.id)}
                        >
                          <span aria-hidden="true">{option}</span>
                        </button>

                        {/* ✅❌ أيقونة النتيجة: فوق يمين الخيار المختار */}
                        {!answerShown && isSelected && result && (
                          <span
                            className={`CB-r2p2q2-badge ${result}`}
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
              disabled ? {cursor: "defualt" } : undefined
            }
          >
            Check Answer ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review2_Page2_Q2;
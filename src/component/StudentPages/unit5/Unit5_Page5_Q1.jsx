import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import sound1 from "../../../assets/audio/ClassBook/U 5/cd31pg44-instruction1-adult-lady_F1jeK53D.mp3";
import img1 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 44/Ex A1-1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 44/Ex A1-2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 44/Ex A1-3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 44/Ex A1-4.svg";
import img5 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 44/Ex A1-5.svg";
import img6 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 44/Ex A1-6.svg";
import "./Unit5_Page5_Q1.css";

/* ================= DATA ================= */

const stopAtSecond = 11.019;

const captions = [
  {
    start: 0.539,
    end: 5.799,
    text: "Page 44. Right Activities. Exercise A, Number 1.",
  },
  {
    start: 6.839,
    end: 11.019,
    text: "Which picture has long E? Listen and circle.",
  },
  { start: 12.099, end: 16.5, text: "1, bee, pen." },
  { start: 17.879, end: 21.34, text: "2, bed, read." },
  { start: 22.42, end: 24.34, text: "3, tea, hen" },
];

// ⚠️ alt وصف عام بدون اسم الشي (لأنو اسمه بيكشف الجواب) وأنا ما شفت الصور، فتأكدي منه
// ⚠️ audio.start / audio.end = مقطع كل كلمة من نفس ملف الصوت (بالثواني)
// الأرقام تقديرية من الـ captions (الـ caption بيجمع كلمتين): عدّليها بعد ما تسمعي الملف
// longE = الصورة اللي كلمتها فيها صوت e الطويل
const QUESTIONS = [
  {
    id: 1,
    choices: [
      {
        img: img1,
        word: "bee",
        longE: true,
        alt: "a small striped insect with wings",
        audio: { start: 12.9, end: 14.4 },
      },
      {
        img: img2,
        word: "pen",
        longE: false,
        alt: "a thin writing tool with a pointed tip",
        audio: { start: 14.6, end: 16.5 },
      },
    ],
  },
  {
    id: 2,
    choices: [
      {
        img: img3,
        word: "bed",
        longE: false,
        alt: "a soft place to sleep, with a pillow and a blanket",
        audio: { start: 18.8, end: 20.0 },
      },
      {
        img: img4,
        word: "read",
        longE: true,
        alt: "a boy sitting and looking at an open book",
        audio: { start: 20.0, end: 21.34 },
      },
    ],
  },
  {
    id: 3,
    choices: [
      {
        img: img5,
        word: "tea",
        longE: true,
        alt: "a hot drink in a cup",
        audio: { start: 23.0, end: 23.8 },
      },
      {
        img: img6,
        word: "hen",
        longE: false,
        alt: "a farm bird with feathers and a red comb",
        audio: { start: 23.8, end: 24.34 },
      },
    ],
  },
];

const COUNT = QUESTIONS.length;

const emptyArr = () => Array(COUNT).fill(null);

/* ================= HELPERS (خارج الكومبوننت) ================= */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const correctWordOf = (q) => q.choices.find((c) => c.longE).word;

const pauseOtherAudio = () => {
  document.querySelectorAll("audio").forEach((el) => el.pause());
};

const Unit5_Page5_Q1 = () => {
  const [selected, setSelected] = useState(emptyArr()); // index الصورة المختارة لكل سؤال
  const [results, setResults] = useState(emptyArr()); // null | "correct" | "wrong"
  const [finished, setFinished] = useState(false); // كل شي صح بعد Check
  const [answerShown, setAnswerShown] = useState(false);
  const [message, setMessage] = useState("");
  const [playingKey, setPlayingKey] = useState(null); // "سؤال-صورة" اللي صوتها شغّال

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
    setPlayingKey(null);
  };

  // تشغيل (أو إعادة تشغيل) مقطع الكلمة، بدون تداخل مع أي صوت ثاني
  const playChoice = (choice, key) => {
    stopItemSound();
    pauseOtherAudio();

    const token = tokenRef.current;
    const audio = getAudio();

    const start = () => {
      if (token !== tokenRef.current) return;
      audio.currentTime = choice.audio.start;
      audio
        .play()
        .then(() => {
          if (token !== tokenRef.current) return;
          setPlayingKey(key);
          timerRef.current = setInterval(() => {
            if (audio.currentTime >= choice.audio.end || audio.ended) {
              stopItemSound();
            }
          }, 50);
        })
        .catch(() => {
          if (token === tokenRef.current) setPlayingKey(null);
        });
    };

    if (audio.readyState >= 1) {
      start();
    } else {
      audio.addEventListener("loadedmetadata", start, { once: true });
      audio.load();
    }
  };

  // لو اشتغل أي صوت ثاني بالصفحة (مشغّل التعليمات) نوقف صوت الصور
  // وعند الخروج من الصفحة نوقف كل شي
  useEffect(() => {
    const onOtherPlay = (e) => {
      if (e.target !== audioRef.current) {
        tokenRef.current += 1;
        clearInterval(timerRef.current);
        audioRef.current?.pause();
        setPlayingKey(null);
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
  const onChoiceFocus = (e, choice, key) => {
    if (e.currentTarget.matches(":focus-visible")) playChoice(choice, key);
  };

  const selectChoice = (qIndex, chIndex) => {
    if (isLocked(qIndex)) {
      setMessage(
        answerShown
          ? "Correct answers are shown. Press Start Again to try again."
          : finished
            ? "All answers are correct and locked."
            : `Question ${qIndex + 1} is correct and locked.`,
      );
      return;
    }

    setSelected((prev) => prev.map((s, i) => (i === qIndex ? chIndex : s)));

    // تعديل إجابة غلط: بيشيل علامة الغلط
    setResults((prev) => prev.map((r, i) => (i === qIndex ? null : r)));

    setMessage(`Question ${qIndex + 1}: picture ${chIndex + 1} selected.`);
  };

  // كليك / لمس / Enter / Space: صوت + اختيار (الصوت بيشتغل حتى بعد القفل)
  const activateChoice = (qIndex, chIndex, choice) => {
    playChoice(choice, `${QUESTIONS[qIndex].id}-${chIndex}`);
    selectChoice(qIndex, chIndex);
  };

  /* ================= CHECK ================= */

  const checkAnswers = () => {
    // بعد Show Answer أو بعد ما كل شي صح: ما في شي نعمله
    if (disabled) return;

    if (selected.some((s) => s === null)) {
      const msg = "Please choose a picture for all the questions!";
      ValidationAlert.info("Oops!", msg);
      setMessage(msg);
      return;
    }

    stopItemSound();

    // الصح القديم بيضل مقفول، والباقي بينقيّم
    const newResults = QUESTIONS.map((q, i) =>
      results[i] === "correct" || q.choices[selected[i]].longE
        ? "correct"
        : "wrong",
    );

    const correct = newResults.filter((r) => r === "correct").length;

    setResults(newResults);

    if (correct === COUNT) setFinished(true);

    // 🔊 فيدباك مسموع لكل سؤال + السكور (للغلط ما بنكشف الجواب لأنو بيقدر يعدّل)
    const details = QUESTIONS.map(
      (q, i) =>
        `Question ${q.id}: ${
          newResults[i] === "correct"
            ? `Correct! ${cap(correctWordOf(q))} has the long e sound.`
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

  const showAnswer = () => {
    stopItemSound();

    setSelected(
      QUESTIONS.map((q) => q.choices.findIndex((choice) => choice.longE)),
    );
    setResults(emptyArr());
    setFinished(false);
    setAnswerShown(true);
    setMessage("Correct answers are shown.");
  };

  /* ================= START AGAIN ================= */

  const resetAnswers = () => {
    stopItemSound();
    pauseOtherAudio();

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
        marginBottom: "30px",
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

      <div className="div-forall">
        <ExerciseHeader
          sectionLetter="A"
          questionNumber="1"
          title="Which picture has long e? Listen and circle."
          subTitle="Replay the audio, say the word quietly, then tap the sound or letter that matches."
        />

        <p id="u5p5q1-help" className="sr-only">
          Press Tab to move between the pictures. When a picture is focused, its
          word plays. Press Enter or Space on a picture to choose it and hear it
          again. After checking, correct answers are locked and wrong answers
          can be changed.
        </p>

        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
          pageId={"sb-unit5-page5-q1"}
        />

        <div
          className="imgFeild"
          style={{
            display: "flex",
            gap: "13px",
            flexDirection: "column",
          }}
        >
          <div
            className="CB-unit5-p5-q1-container"
            role="group"
            aria-label="Questions"
            aria-describedby="u5p5q1-help"
          >
            {QUESTIONS.map((q, qIndex) => {
              const locked = isLocked(qIndex);
              const result = results[qIndex];

              return (
                <div
                  key={q.id}
                  className="ds-group-box-CB-unit5-p5-2"
                  role="group"
                  aria-label={`Question ${q.id}: choose the picture with the long e sound`}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      fontWeight: "700",
                      fontSize: "22px",
                    }}
                  >
                    {q.id}
                  </span>

                  <div className="CB-unit5-p5-q1-options">
                    {q.choices.map((choice, chIndex) => {
                      const key = `${q.id}-${chIndex}`;
                      const isSelected = selected[qIndex] === chIndex;
                      const isPlaying = playingKey === key;

                      const isWrong = isSelected && result === "wrong";
                      const isCorrect =
                        isSelected && (answerShown || result === "correct");

                      return (
                        <div
                          key={chIndex}
                          className={`CB-unit5-p5-q1-word ${
                            isSelected ? "selected" : ""
                          } ${isWrong ? "wrong" : ""}`}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          {/* 🖼️ الصورة كاملة = زر الاختيار */}
                          <button
                            type="button"
                            className={`CB-u5p5q1-choice ${
                              isSelected ? "is-selected" : ""
                            } ${isPlaying ? "is-playing" : ""} ${
                              isCorrect ? "is-correct" : ""
                            }${
                              isWrong ? "is-wrong" : ""
                            }`}
                            aria-pressed={isSelected}
                            aria-disabled={locked}
                            aria-label={`Question ${q.id}, picture ${
                              chIndex + 1
                            }: ${choice.alt}.${
                              isSelected && result === "correct"
                                ? " Correct and locked."
                                : isSelected && result === "wrong"
                                  ? " Incorrect, you can change it."
                                  : isSelected && answerShown
                                    ? " Correct answer."
                                    : isSelected
                                      ? " Selected."
                                      : ""
                            } Press to hear it and choose it.`}
                            onClick={() => activateChoice(qIndex, chIndex, choice)}
                            onFocus={(e) => onChoiceFocus(e, choice, key)}
                          >
                            <img
                              src={choice.img}
                              alt=""
                              aria-hidden="true"
                              draggable="false"
                              className={`CB-unit5-p5-q1-img ${
                                isSelected ? "selected" : ""
                              } ${isWrong ? "wrong" : ""}`}
                            />

                            {/* 🔊 أيقونة السبيكر */}
                            <span
                              className={`CB-u5p5q1-speaker ${
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

                            {/* ✅ علامة الصح (بعد Check بس) */}
                            {/* {!answerShown &&
                              isSelected &&
                              result === "correct" && (
                                <span
                                  className="CB-u5p5q1-badge"
                                  aria-hidden="true"
                                >
                                  ✓
                                </span>
                              )} */}
                          </button>

                          {/* ❌ الإيفيكت القديم للغلط */}
                          {isWrong && (
                            <span
                              className="CB-unit5-p5-q1-wrong-x"
                              aria-hidden="true"
                            >
                              ✕
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
        </div>
      </div>

      <div className="action-buttons-container">
        <button type="button" onClick={resetAnswers} className="try-again-button">
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
            disabled ? {  cursor: "not-allowed" } : undefined
          }
        >
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit5_Page5_Q1;
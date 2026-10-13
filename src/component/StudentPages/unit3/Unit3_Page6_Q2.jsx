import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import img1 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 27/Asset 16.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 27/Asset 17.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 27/Asset 18.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 27/Asset 19.svg";
import img5 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 27/Asset 20.svg";
import img6 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 27/Asset 21.svg";
import trueIcon from "../../../assets/imgs/true.svg";

import paintAudio from "../../../assets/audio/ClassBook/U 3/Page 27 - E/They can paint..mp3";
import kiteAudio from "../../../assets/audio/ClassBook/U 3/Page 27 - E/She can fly a kite..mp3";
import benchAudio from "../../../assets/audio/ClassBook/U 3/Page 27 - E/He can stand on the bench..mp3";
import bikeAudio from "../../../assets/audio/ClassBook/U 3/Page 27 - E/I can ride a bike..mp3";
import sandwichesAudio from "../../../assets/audio/ClassBook/U 3/Page 27 - E/We can make sandwiches..mp3";
import drumAudio from "../../../assets/audio/ClassBook/U 3/Page 27 - E/He can play the drum..mp3";

import "./Unit3_Page6_Q2.css";

/* ================= DATA ================= */

// true = بيظهر اسم كل خيار جنب المربع (بيسهّل التمرين لأنو بيصير مطابقة كلمة بكلمة)
const SHOW_OPTION_LABELS = false;

// ⚠️ الـ alt مبني على أسماء الخيارات وأنا ما شفت الصور، فتأكدي إنو كل صورة فيها
// صورتين بنفس ترتيب الخيارات (الأولى ثم الثانية)
const QUESTIONS = [
  {
    id: 1,
    src: img1,
    alt: "Two pictures. First: a child eating. Second: children painting.",
    text: "They can paint.",
    audio: paintAudio,
    options: [
      { label: "eat", answer: false },
      { label: "paint", answer: true },
    ],
  },
  {
    id: 2,
    src: img2,
    alt: "Two pictures. First: a girl flying a kite. Second: a child riding.",
    text: "She can fly a kite.",
    audio: kiteAudio,
    options: [
      { label: "kite", answer: true },
      { label: "ride", answer: false },
    ],
  },
  {
    id: 3,
    src: img3,
    alt: "Two pictures. First: a boy playing a drum. Second: a boy standing on a bench.",
    text: "He can stand on the bench.",
    audio: benchAudio,
    options: [
      { label: "drum", answer: false },
      { label: "bench", answer: true },
    ],
  },
  {
    id: 4,
    src: img4,
    alt: "Two pictures. First: a child riding a bike. Second: a child taking a photo.",
    text: "I can ride a bike.",
    audio: bikeAudio,
    options: [
      { label: "bike", answer: true },
      { label: "photo", answer: false },
    ],
  },
  {
    id: 5,
    src: img5,
    alt: "Two pictures. First: children making sandwiches. Second: a child swimming.",
    text: "We can make sandwiches.",
    audio: sandwichesAudio,
    options: [
      { label: "sandwiches", answer: true },
      { label: "swim", answer: false },
    ],
  },
  {
    id: 6,
    src: img6,
    alt: "Two pictures. First: a child painting. Second: a boy playing a drum.",
    text: "He can play the drum.",
    audio: drumAudio,
    options: [
      { label: "paint", answer: false },
      { label: "drum", answer: true },
    ],
  },
];

const TOTAL = QUESTIONS.length;

/* ================= HELPERS (خارج الكومبوننت) ================= */

const correctIndexOf = (q) => q.options.findIndex((o) => o.answer);

const pauseOtherAudio = () => {
  document.querySelectorAll("audio").forEach((el) => el.pause());
};

const Unit3_Page6_Q2 = () => {
  const [selected, setSelected] = useState({}); // { [id]: indexOfChosenOption }
  const [results, setResults] = useState({}); // { [id]: "correct" | "wrong" }
  const [finished, setFinished] = useState(false); // كل شي صح بعد Check
  const [answerShown, setAnswerShown] = useState(false);
  const [message, setMessage] = useState("");
  const [activeId, setActiveId] = useState(null); // آخر سؤال تعاملت معه
  const [playingId, setPlayingId] = useState(null); // أي جملة صوتها شغّال

  const audioRef = useRef(null);
  const tokenRef = useRef(0); // بيلغي أي تشغيل معلّق

  const disabled = finished || answerShown;

  // 🔒 السؤال الصح مقفول، الغلط بيضل قابل للتعديل
  const isLocked = (q) => disabled || results[q.id] === "correct";

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
  const playSentence = (q) => {
    if (!q.audio) return;

    stopSound();
    pauseOtherAudio();

    const token = tokenRef.current;
    const audio = new Audio(q.audio);
    audioRef.current = audio;
    setPlayingId(q.id);

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

  /* ================= INTERACTIONS ================= */

  // فوكس بالتاب على الجملة = شغّل صوتها (الماوس/اللمس بيروحوا على onClick)
  const onSentenceFocus = (e, q) => {
    setActiveId(q.id);
    if (e.currentTarget.matches(":focus-visible")) playSentence(q);
  };

  const onSentenceClick = (q) => {
    setActiveId(q.id);
    playSentence(q);
  };

  // اختيار واحد لكل سؤال: الخيار الجديد بيحل مكان القديم
  const selectOption = (q, index) => {
    setActiveId(q.id);

    if (isLocked(q)) {
      setMessage(
        answerShown
          ? "Correct answers are shown. Press Start Again to try again."
          : finished
            ? "All answers are correct and locked."
            : `Question ${q.id} is correct and locked.`,
      );
      return;
    }

    setSelected((prev) => ({ ...prev, [q.id]: index }));

    // تعديل إجابة غلط: بيشيل علامة الغلط من هالسؤال بس
    setResults((prev) => {
      const next = { ...prev };
      delete next[q.id];
      return next;
    });

    setMessage(`Question ${q.id}: ${q.options[index].label} selected.`);
  };

  /* ================= CHECK ================= */

  const checkAnswers = () => {
    // بعد Show Answer أو بعد ما كل شي صح: ما في شي نعمله
    if (disabled) return;

    if (QUESTIONS.some((q) => selected[q.id] === undefined)) {
      const msg = "Please choose an answer for all the questions!";
      ValidationAlert.info("Oops!", msg);
      setMessage(msg);
      return;
    }

    stopSound();

    // الصح القديم بيضل مقفول، والباقي بينقيّم
    const newResults = {};
    QUESTIONS.forEach((q) => {
      newResults[q.id] =
        results[q.id] === "correct" || q.options[selected[q.id]].answer
          ? "correct"
          : "wrong";
    });

    const correct = QUESTIONS.filter(
      (q) => newResults[q.id] === "correct",
    ).length;

    setResults(newResults);

    if (correct === TOTAL) setFinished(true);

    // 🔊 فيدباك مسموع لكل سؤال + السكور
    const details = QUESTIONS.map(
      (q) =>
        `Question ${q.id}: ${
          newResults[q.id] === "correct" ? "correct" : "incorrect"
        }`,
    ).join(". ");

    setMessage(
      `Score ${correct} out of ${TOTAL}. ${details}.${
        correct < TOTAL
          ? " Correct answers are locked. Change the answers marked with a cross, then press Check Answer again."
          : ""
      }`,
    );

    const color = correct === TOTAL ? "green" : correct === 0 ? "red" : "orange";

    ValidationAlert[
      correct === TOTAL ? "success" : correct === 0 ? "error" : "warning"
    ](
      `<div style="font-size:20px;text-align:center">
        <b style="color:${color}">Score: ${correct} / ${TOTAL}</b>
      </div>`,
    );
  };

  /* ================= SHOW ANSWER ================= */

  // بيعرض الحل بس: ما بيحسب سكور وما بيعرض نتائج، وبيقفل التمرين
  const showAnswers = () => {
    stopSound();

    const correctSelection = {};
    QUESTIONS.forEach((q) => {
      correctSelection[q.id] = correctIndexOf(q);
    });

    setSelected(correctSelection);
    setResults({});
    setFinished(false);
    setAnswerShown(true);
    setMessage(
      "Correct answers are shown. This does not count as your score. Press Start Again to try again.",
    );
  };

  /* ================= START AGAIN ================= */

  const reset = () => {
    stopSound();
    pauseOtherAudio();

    setSelected({});
    setResults({});
    setFinished(false);
    setAnswerShown(false);
    setActiveId(null);
    setMessage("Exercise reset. All answers and results are cleared.");
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
          sectionLetter="E"
          title="Read and write ✓."
          subTitle="Read the clue and check the picture, then tap the one answer that matches."
        />

        <p id="u3p6q2-help" className="sr-only">
          Press Tab to move between the sentences and the boxes. When a
          sentence is focused, its sound plays. Press Enter or Space on a
          sentence to hear it again. Press Enter or Space on a box to choose
          it. You can choose only one box for each question. After checking,
          correct answers are locked and wrong answers can be changed.
        </p>

        <div
          className="CB-u3p6q2-list"
          role="group"
          aria-label="Questions"
          aria-describedby="u3p6q2-help"
        >
          {QUESTIONS.map((q) => {
            const chosen = selected[q.id];
            const result = results[q.id];
            const locked = isLocked(q);
            const isActive = activeId === q.id;
            const isPlaying = playingId === q.id;

            return (
              <div
                key={q.id}
                role="group"
                aria-label={`Question ${q.id}`}
                className={`CB-u3p6q2-card ${isActive ? "is-active" : ""}`}
              >
                <span className="CB-u3p6q2-num" aria-hidden="true">
                  {q.id}
                </span>

                <img
                  src={q.src}
                  alt={q.alt}
                  className="CB-u3p6q2-img"
                  draggable="false"
                />

                {/* 🔊 الجملة = زر لسماعها */}
                <button
                  type="button"
                  className={`CB-u3p6q2-sentence ${
                    isPlaying ? "is-playing" : ""
                  }`}
                  aria-label={`Sentence ${q.id}: ${q.text} Press to listen.`}
                  onClick={() => onSentenceClick(q)}
                  onFocus={(e) => onSentenceFocus(e, q)}
                >
                  <span aria-hidden="true">{q.text}</span>

                  <span
                    className={`CB-u3p6q2-speaker ${
                      isPlaying ? "playing" : ""
                    }`}
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
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

                {/* الخيارات: كل خيار زر كبير */}
                <div
                  className="CB-u3p6q2-options"
                  role="group"
                  aria-label={`Question ${q.id}: choose the correct box`}
                >
                  {q.options.map((opt, index) => {
                    const isSelected = chosen === index;
                    const state =
                      isSelected && result
                        ? result === "correct"
                          ? "is-correct"
                          : "is-wrong"
                        : "";
                    const isAnswer = answerShown && isSelected;

                    return (
                      <div key={index} className="CB-u3p6q2-option-wrap">
                        <button
                          type="button"
                          className={`CB-u3p6q2-option ${
                            isSelected ? "is-selected" : ""
                          } ${state} ${isAnswer ? "is-answer" : ""}`}
                          aria-pressed={isSelected}
                          aria-disabled={locked}
                          aria-label={`Choice ${index + 1} of ${
                            q.options.length
                          }: ${opt.label}${
                            isSelected && result === "correct"
                              ? ", correct and locked"
                              : isSelected && result === "wrong"
                                ? ", incorrect, you can change it"
                                : isAnswer
                                  ? ", correct answer"
                                  : ""
                          }`}
                          onClick={() => selectOption(q, index)}
                          onFocus={() => setActiveId(q.id)}
                        >
                          <span className="CB-u3p6q2-box" aria-hidden="true">
                            {isSelected && (
                              <img src={trueIcon} alt="" draggable="false" />
                            )}
                          </span>

                          {SHOW_OPTION_LABELS && (
                            <span
                              className="CB-u3p6q2-label"
                              aria-hidden="true"
                            >
                              {opt.label}
                            </span>
                          )}
                        </button>

                        {/* ✅❌ نتيجة السؤال: فوق يمين الخيار المختار */}
                        {!answerShown && isSelected && result && (
                          <span
                            className={`CB-u3p6q2-badge ${result}`}
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

export default Unit3_Page6_Q2;
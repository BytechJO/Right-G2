import React, { useState, useRef, useEffect } from "react";
import img1 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 14/Ex B1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 14/Ex B2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 14/Ex B3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 14/Ex B 4.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit2_Page5_Q2.css";
import trueIcon from "../../../assets/imgs/true.svg";
import sound1 from "../../../assets/audio/ClassBook/U 2/Page 14 - B/That is a red apple..mp3";
import sound2 from "../../../assets/audio/ClassBook/U 2/Page 14 - B/That’s a green tree..mp3";
import sound3 from "../../../assets/audio/ClassBook/U 2/Page 14 - B/That’s a red flower..mp3";
import sound4 from "../../../assets/audio/ClassBook/U 2/Page 14 - B/These are blue birds..mp3";
import sound5 from "../../../assets/audio/ClassBook/U 2/Page 14 - B/This is a blue bird..mp3";
import sound6 from "../../../assets/audio/ClassBook/U 2/Page 14 - B/This is a red apple..mp3";
import sound7 from "../../../assets/audio/ClassBook/U 2/Page 14 - B/Those are green trees..mp3";
import sound8 from "../../../assets/audio/ClassBook/U 2/Page 14 - B/Those are red flowers..mp3";

// 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import ExerciseHeader from "../../ExerciseHeader";

// 🔊 true = الصوت يشتغل تلقائياً لما الطالب يوقف على الجملة بالتاب
// (غيّرها لـ false إذا بدك الصوت بس عند Enter / Space / كليك)
const PLAY_ON_FOCUS = true;

// ⚠️ الـ alt مؤقت: عدّليه حسب الصور الفعلية
const questions = [
  {
    id: 1,
    image: img1,
    alt: "A red apple",
    items: [
      { text: "This is a red apple.", correct: "✓", audio: sound6 },
      { text: "That is a red apple.", correct: "x", audio: sound1 },
    ],
  },
  {
    id: 2,
    image: img2,
    alt: "Green trees",
    items: [
      { text: "Those are green trees.", correct: "✓", audio: sound7 },
      { text: "That’s a green tree.", correct: "x", audio: sound2 },
    ],
  },
  {
    id: 3,
    image: img3,
    alt: "Blue birds",
    items: [
      { text: "These are blue birds.", correct: "✓", audio: sound4 },
      { text: "This is a blue bird.", correct: "x", audio: sound5 },
    ],
  },
  {
    id: 4,
    image: img4,
    alt: "Red flowers",
    items: [
      { text: "That’s a red flower.", correct: "x", audio: sound3 },
      { text: "Those are red flowers.", correct: "✓", audio: sound8 },
    ],
  },
];

const total = questions.length;

const Unit2_Page5_Q2 = () => {
  /*
    answers: { [qId]: index }
    results: { [qId]: "correct" | "wrong" }

    - "correct" → السؤال مثبّت (مقفول) بعد Check
    - "wrong"   → ✕ والطالب بيقدر يعدّله
  */
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});

  // 🔒 بعد Show Answer كل شي مقفول
  const [showAnswered, setShowAnswered] = useState(false);

  // 📢 رسالة لقارئ الشاشة (فيها السكور بعد Check)
  const [message, setMessage] = useState("");

  const isQuestionLocked = (qId) => showAnswered || results[qId] === "correct";

  const allCorrect = questions.every((q) => results[q.id] === "correct");

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioOwner = useRef({}).current;

  // الجملة الي اشتغل صوتها → بيظهر عليها البوردر + أيقونة السبيكر
  const [activeId, setActiveId] = useState(null);

  const stopAudio = () => stopGlobalAudio(audioOwner);

  const playAudio = (src, id) => {
    if (!src) {
      stopGlobalAudio();
      setActiveId(null);
      return;
    }

    playGlobalAudio(src, {
      owner: audioOwner,
      onFinish: () => setActiveId((prev) => (prev === id ? null : prev)),
    });

    setActiveId(id);
  };

  // وقف صوت هاي الكومبونينت إذا سكرت الصفحة
  useEffect(() => () => stopGlobalAudio(audioOwner), [audioOwner]);

  const SpeakerIcon = () => (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      style={{
        position: "absolute",
        top: "-6px",
        right: "-6px",
        background: "white",
        borderRadius: "50%",
        padding: "2px",
      }}
    >
      <path
        fill="currentColor"
        d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"
      />
    </svg>
  );

  /* =====================================================
     SELECT (كليك / لمس / Enter / Space)
     - الصح (بعد Check) مثبّت: ما بينغيّر
     - الغلط بيضل قابل للتعديل، و✕ بتنشال لما الطالب يغيّر اختياره
  ===================================================== */

  const handleSelect = (qId, idx) => {
    if (isQuestionLocked(qId)) return;

    // نفس الاختيار: ما في تغيير (✕ بتضل لحد ما يختار غيره)
    if (answers[qId] === idx) return;

    setAnswers((prev) => ({ ...prev, [qId]: idx }));

    // نشيل ✕ بس عن السؤال الي تغيّر
    setResults((prev) => {
      if (prev[qId] === undefined) return prev;

      const updated = { ...prev };
      delete updated[qId];

      return updated;
    });
  };

  // يختار (إلا إذا مقفول) + يشغّل الصوت دايماً (حتى بعد Check أو Show Answer)
  const activateOption = (qId, idx, audio) => {
    handleSelect(qId, idx);
    playAudio(audio, `q${qId}-${idx}`);
  };

  const handleKeyDown = (e, qId, idx, audio) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault(); // يمنع سكرول الصفحة عند Space
      activateOption(qId, idx, audio);
    }
  };

  // 🔊 الصوت لما الطالب يوقف على الجملة بالتاب (مش بالماوس)
  const handleFocus = (e, qId, idx, audio) => {
    if (!PLAY_ON_FOCUS) return;
    if (!e.currentTarget.matches(":focus-visible")) return; // تجاهل تركيز الماوس
    playAudio(audio, `q${qId}-${idx}`);
  };

  /* =====================================================
     CHECK
     - الصح بينثبّت
     - الغلط بيضل قابل للتعديل (✕)
     - السكور بينحسب من كل الأسئلة (المثبّتة + الجديدة)
  ===================================================== */

  const checkAnswers = () => {
    // بعد Show Answer أو بعد ما كل شي صح: ما في شي نعمله
    if (showAnswered || allCorrect) return;

    const incomplete = questions.some((q) => answers[q.id] === undefined);

    if (incomplete) {
      ValidationAlert.info("Please answer all questions!");
      setMessage("Please answer all questions first.");
      return;
    }

    const res = {};
    const toFix = [];
    let correctCount = 0;

    questions.forEach((q) => {
      const isCorrect = q.items[answers[q.id]].correct === "✓";

      res[q.id] = isCorrect ? "correct" : "wrong";

      if (isCorrect) correctCount++;
      else toFix.push(`picture ${q.id}`);
    });

    setResults(res);

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    setMessage(
      correctCount === total
        ? `Score ${correctCount} out of ${total}. All answers are correct.`
        : `Score ${correctCount} out of ${total}. Correct answers are locked. Please fix: ${toFix.join(", ")}.`,
    );

    if (correctCount === total) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  /* =====================================================
     START AGAIN
  ===================================================== */

  const reset = () => {
    stopAudio();
    setActiveId(null);
    setAnswers({});
    setResults({});
    setShowAnswered(false);
    setMessage("Exercise reset. All answers are cleared.");
  };

  /* =====================================================
     SHOW ANSWER
     بيعرض الإجابات الصح بدون ما يحسب سكور جديد
  ===================================================== */

  const showAnswer = () => {
    stopAudio();
    setActiveId(null);

    const correctSelections = {};
    const res = {};

    questions.forEach((q) => {
      correctSelections[q.id] = q.items.findIndex((i) => i.correct === "✓");
      res[q.id] = "correct";
    });

    setAnswers(correctSelections);
    setResults(res);
    setShowAnswered(true);
    setMessage("Correct answers are shown.");
  };

  /* =====================================================
     RENDER
  ===================================================== */

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

      <div className="div-forall mb-10" style={{ gap: "0px" }}>
        <ExerciseHeader
          sectionLetter="B"
          // questionNumber="1"
          title="Look, read, and write ✓."
          subTitle="Start with one picture or phrase, then match it to the partner that means the same thing."
        />

        <div className="CB-unit2-p5-q2-grid">
          {questions.map((q) => {
            const locked = isQuestionLocked(q.id);

            return (
              <div key={q.id} className="CB-unit2-p5-q2-box">
                <div className="CB-unit2-p5-q2-img-container">
                  <span
                    aria-hidden="true"
                    style={{
                      color: "#2e3192",
                      fontSize: "20px",
                      fontWeight: "700",
                    }}
                  >
                    {q.id}
                  </span>
                  <img
                    src={q.image}
                    alt={`Picture ${q.id}: ${q.alt}`}
                    className="CB-unit2-p5-q2-img"
                  />
                </div>

                {/* كل سؤال = اختيار واحد فقط → radio group */}
                <div
                  className="flex flex-col gap-2"
                  role="radiogroup"
                  aria-readonly={locked}
                  aria-label={`Picture ${q.id}. Choose one sentence.`}
                >
                  {q.items.map((item, idx) => {
                    const isSelected = answers[q.id] === idx;
                    const result = results[q.id];

                    const isCorrect = result === "correct" && isSelected;
                    const isWrong = result === "wrong" && isSelected;

                    const id = `q${q.id}-${idx}`;
                    const isPlaying = activeId === id;

                    const stateLabel = isWrong
                      ? ", selected, incorrect. Try again"
                      : isCorrect
                        ? ", selected, correct and locked"
                        : isSelected
                          ? ", selected"
                          : "";

                    return (
                      <div
                        key={idx}
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={`${item.text}${stateLabel}`}
                        /*
                          ضل قابل للتركيز حتى بعد القفل
                          عشان الطالب يقدر يسمع الصوت بالتاب.
                        */
                        tabIndex={0}
                        className="CB-unit2-p5-q2-row focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c5287] focus-visible:ring-offset-2"
                        style={{
                          position: "relative",
                          cursor: "pointer",
                          ...(isPlaying
                            ? {
                                outline: "2px solid #2c5287",
                                outlineOffset: "3px",
                                borderRadius: "10px",
                              }
                            : {}),
                        }}
                        onClick={() => activateOption(q.id, idx, item.audio)}
                        onKeyDown={(e) =>
                          handleKeyDown(e, q.id, idx, item.audio)
                        }
                        onFocus={(e) => handleFocus(e, q.id, idx, item.audio)}
                      >
                        <div
                          className={`CB-unit2-p5-q2-input-box ${
                            isCorrect ? "CB-unit2-p5-q2-input-box-correct" : ""
                          }`}
                        >
                          {/* المربع للشكل فقط، الاختيار بيصير على الصف كامل */}
                          <input
                            type="text"
                            readOnly
                            value=""
                            tabIndex={-1}
                            aria-hidden="true"
                            className="CB-unit2-p5-q2-input"
                            style={{ pointerEvents: "none" }}
                          />

                          {isSelected && (
                            <img
                              src={trueIcon}
                              alt=""
                              aria-hidden="true"
                              className="CB-unit2-p14-q2-true"
                            />
                          )}

                          {isWrong && (
                            <span
                              className="CB-unit2-p5-q2-x"
                              aria-hidden="true"
                            >
                              ✕
                            </span>
                          )}
                        </div>

                        <span className="CB-unit2-p5-q2-text">{item.text}</span>

                        {/* 🔊 أيقونة السبيكر فوق يمين الجملة */}
                        {isPlaying && <SpeakerIcon />}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
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

        <button type="button" onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit2_Page5_Q2;

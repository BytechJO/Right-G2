import React, { useState, useRef, useEffect } from "react";
import img1 from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 9/Page9-Ex D 2.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 9/Page9-Ex D 1.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import trueIcon from "../../../assets/imgs/true.svg";
import "./Page9_Q1.css";
import ExerciseHeader from "../../ExerciseHeader";
import sound1 from "../../../assets/audio/ClassBook/U 1/Page 9 - D/He’s my brother..mp3";
import sound2 from "../../../assets/audio/ClassBook/U 1/Page 9 - D/He’s Stella’s brother..mp3";
import sound3 from "../../../assets/audio/ClassBook/U 1/Page 9 - D/She’s my sister..mp3";
import sound4 from "../../../assets/audio/ClassBook/U 1/Page 9 - D/She’s Stella’s brother..mp3";
import sound5 from "../../../assets/audio/ClassBook/U 1/Page 9 - D/Who’s he.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 1/Page 9 - D/Who’s she.mp3";

// 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
// ⚠️ عدّل المسار حسب مكان الملف عندك
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";

// 🔊 true = الصوت يشتغل تلقائياً لما الطالب يوقف على الجملة بالتاب
// (غيّرها لـ false إذا بدك الصوت بس عند Enter / Space / كليك)
const PLAY_ON_FOCUS = true;

const Page9_Q1 = () => {
  // الـ alt وصف بصري بدون كلمتَي brother / sister (لأنهم موجودين بالجمل)،
  // ومعه الجنس (boy / girl) لأنو الطالب بيحتاجه ليختار he أو she.
  const questions = [
    {
      id: 1,
      image: img1,
      alt: "A boy with dark hair lying on his tummy on an orange rug in front of a blue sofa, using a laptop, with a yellow book beside him.",
      items1: [
        { text: "Who’s he?", correct: "✓", audio: sound5 },
        { text: "Who’s she?", correct: "x", audio: sound6 },
      ],
      items2: [
        { text: "He’s Stella’s brother.", correct: "✓", audio: sound2 },
        { text: "She’s Stella’s brother.", correct: "x", audio: sound4 },
      ],
    },
    {
      id: 2,
      image: img2,
      alt: "A girl with her hair tied up sitting on a purple floor in front of a green sofa, holding a doll, with a colorful ball and a toy car beside her.",
      items1: [
        { text: "Who’s he?", correct: "x", audio: sound5 },
        { text: "Who’s she?", correct: "✓", audio: sound6 },
      ],
      items2: [
        { text: "He’s my brother.", correct: "x", audio: sound1 },
        { text: "She’s my sister.", correct: "✓", audio: sound3 },
      ],
    },
  ];

  const total = questions.length * 2; // part1 + part2 لكل سؤال

  /*
    answers: { [qId]: { part1: index, part2: index } }
    results: { [qId]: { part1: "correct" | "wrong", part2: ... } }

    - "correct" → الجزء مثبّت (مقفول) بعد Check
    - "wrong"   → ✕ والطالب بيقدر يعدّله
  */
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});

  // 🔒 بعد Show Answer كل شي مقفول
  const [showAnswered, setShowAnswered] = useState(false);

  // 📢 رسالة لقارئ الشاشة (فيها السكور بعد Check)
  const [message, setMessage] = useState("");

  /*
    الجزء مقفول إذا:
    - انعمل Show Answer
    - أو جوابه صح بعد Check
  */
  const isGroupLocked = (qId, part) =>
    showAnswered || results[qId]?.[part] === "correct";

  // كل الأجزاء صح ومثبّتة؟
  const allCorrect = questions.every(
    (q) =>
      results[q.id]?.part1 === "correct" && results[q.id]?.part2 === "correct",
  );

  /* =====================================================
     AUDIO
     - أي صوت جديد بيوقف الصوت القديم (حتى من كومبونينت ثانية)
     - الأيقونة بتختفي لما الصوت ينتهي أو ينوقف
  ===================================================== */

  // هوية هاي الكومبونينت عند مدير الصوت (للـ cleanup)
  const audioOwner = useRef({}).current;

  // الجملة الي اشتغل صوتها → بيظهر عليها البوردر + أيقونة السبيكر
  const [activeId, setActiveId] = useState(null);

  const stopAudio = () => stopGlobalAudio(audioOwner);

  const playAudio = (src, id) => {
    // ما في صوت: وقّف أي صوت شغّال وشيل الأيقونة
    if (!src) {
      stopGlobalAudio();
      setActiveId(null);
      return;
    }

    /*
      أول: بنشغّل الجديد (بيوقف القديم وبينظف أيقونته)،
      بعدين بنفعّل أيقونة الجديد.
      الترتيب مهم عشان لو ضغط على نفس الجملة مرتين
      ما تضيع الأيقونة.
    */
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
      className="CB-unit1-p9-q1-speaker"
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
        // color: "#2c5287",
      }}
    >
      <path
        fill="currentColor"
        d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"
      />
    </svg>
  );

  /* =====================================================
     SELECT
     كل جزء (part) = اختيار واحد فقط → radio group
     (كليك / لمس / Enter / Space)

     - الجزء الصح (بعد Check) مثبّت: ما بينغيّر
     - الجزء الغلط بيضل قابل للتعديل، و✕ بتنشال لما الطالب يغيّر اختياره
  ===================================================== */

  const handleSelect = (qId, part, idx) => {
    if (isGroupLocked(qId, part)) return;

    // نفس الاختيار: ما في تغيير (✕ بتضل لحد ما يختار غيره)
    if (answers[qId]?.[part] === idx) return;

    setAnswers((prev) => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        [part]: idx,
      },
    }));

    // نشيل ✕ بس عن الجزء الي تغيّر
    setResults((prev) => {
      if (!prev[qId] || prev[qId][part] === undefined) return prev;

      const updatedQuestion = { ...prev[qId] };

      delete updatedQuestion[part];

      return { ...prev, [qId]: updatedQuestion };
    });
  };

  /*
    كليك / لمس / Enter / Space:
    يختار (إلا إذا مقفول) + يشغّل الصوت دايماً
    (حتى بعد Check أو Show Answer)
  */
  const activateOption = (qId, part, idx, audio) => {
    handleSelect(qId, part, idx);
    playAudio(audio, `q${qId}-${part}-${idx}`);
  };

  const handleKeyDown = (e, qId, part, idx, audio) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault(); // يمنع سكرول الصفحة عند Space
      activateOption(qId, part, idx, audio);
    }
  };

  // 🔊 الصوت لما الطالب يوقف على الجملة بالتاب (مش بالماوس)
  const handleFocus = (e, qId, part, idx, audio) => {
    if (!PLAY_ON_FOCUS) return;
    if (!e.currentTarget.matches(":focus-visible")) return; // تجاهل تركيز الماوس
    playAudio(audio, `q${qId}-${part}-${idx}`);
  };

  /* =====================================================
     CHECK
     - الصح بينثبّت
     - الغلط بيضل قابل للتعديل (✕)
     - السكور بينحسب من كل الأجزاء (المثبّتة + الجديدة)
     - السكور بينحسب هون فقط (مش بـ Show Answer)
  ===================================================== */

  const checkAnswers = () => {
    // بعد Show Answer أو بعد ما كل شي صح: ما في شي نعمله
    if (showAnswered || allCorrect) return;

    const incomplete = questions.some((q) => {
      const answer = answers[q.id];

      return (
        !answer || answer.part1 === undefined || answer.part2 === undefined
      );
    });

    if (incomplete) {
      ValidationAlert.info("Please answer all questions!");

      setMessage("Please answer all questions first.");

      return;
    }

    const res = {};
    const toFix = [];
    let correctCount = 0;

    questions.forEach((q) => {
      const answer = answers[q.id];

      const correct1 = q.items1[answer.part1].correct === "✓";
      const correct2 = q.items2[answer.part2].correct === "✓";

      res[q.id] = {
        part1: correct1 ? "correct" : "wrong",
        part2: correct2 ? "correct" : "wrong",
      };

      if (correct1) correctCount++;
      else toFix.push(`picture ${q.id} question`);

      if (correct2) correctCount++;
      else toFix.push(`picture ${q.id} answer`);
    });

    setResults(res);

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const msg = `
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

    if (correctCount === total) ValidationAlert.success(msg);
    else if (correctCount === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  /* =====================================================
     START AGAIN
     بيمسح الاختيارات + النتائج + القفل + السكور (الرسالة) + الصوت
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
      correctSelections[q.id] = {
        part1: q.items1.findIndex((i) => i.correct === "✓"),
        part2: q.items2.findIndex((i) => i.correct === "✓"),
      };

      res[q.id] = { part1: "correct", part2: "correct" };
    });

    setAnswers(correctSelections);
    setResults(res);
    setShowAnswered(true);
    setMessage("Correct answers are shown.");
  };

  /* =====================================================
     GROUP (part1 / part2)
     الكارد كامل (المربع + النص) هو الخيار القابل للاختيار
  ===================================================== */

  const renderGroup = (q, part, items) => {
    const groupLocked = isGroupLocked(q.id, part);

    return (
      <div
        className="flex flex-col"
        role="radiogroup"
        aria-readonly={groupLocked}
        aria-label={`Picture ${q.id}, ${
          part === "part1" ? "question" : "answer"
        }. Choose one.`}
      >
        {items.map((item, idx) => {
          const isSelected = answers[q.id]?.[part] === idx;
          const result = results[q.id]?.[part];

          const isCorrect = result === "correct" && isSelected;
          const isWrong = result === "wrong" && isSelected;

          const id = `q${q.id}-${part}-${idx}`;
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
              className="CB-unit1-p9-q1-row focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c5287] focus-visible:ring-offset-2"
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
              onClick={() => activateOption(q.id, part, idx, item.audio)}
              onKeyDown={(e) => handleKeyDown(e, q.id, part, idx, item.audio)}
              onFocus={(e) => handleFocus(e, q.id, part, idx, item.audio)}
            >
              <div className="CB-unit1-p9-q1-input-box">
                {/* المربع للشكل فقط، الاختيار بيصير على الكارد كامل */}
                <input
                  type="text"
                  readOnly
                  value=""
                  tabIndex={-1}
                  aria-hidden="true"
                  className="CB-unit1-p9-q1-input"
                  style={{ pointerEvents: "none" }}
                />

                {/* أيقونة ✓ ديكور: الحالة بتنقرأ من aria-label على الصف */}
                {isSelected && (
                  <img
                    src={trueIcon}
                    alt=""
                    aria-hidden="true"
                    className="CB-unit1-p9-q1-true"
                  />
                )}

                {isWrong && (
                  <span className="CB-unit1-p9-q1-x" aria-hidden="true">
                    ✕
                  </span>
                )}
              </div>

              <span className="CB-unit1-p9-q1-text">{item.text}</span>

              {/* 🔊 أيقونة السبيكر فوق يمين الجملة */}
              {isPlaying && <SpeakerIcon />}
            </div>
          );
        })}
      </div>
    );
  };

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

      <div
        className="div-forall"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          // width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <ExerciseHeader
          sectionLetter="D"
          // questionNumber="1"
          title="Look, read, and write ✓."
          subTitle="Read the clue and check the picture, then tap the one answer that matches."
        />

        <div className="CB-unit1-p9-q1-grid">
          {questions.map((q) => (
            <div key={q.id} className="CB-unit1-p9-q1-box">
              {/* 🖼️ الصورة الرئيسية: هون الـ alt الحقيقي */}
              <img src={q.image} alt={q.alt} className="CB-unit1-p9-q1-img" />

              <div className="flex flex-col gap-6">
                {renderGroup(q, "part1", q.items1)}
                {renderGroup(q, "part2", q.items2)}
              </div>
            </div>
          ))}
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

export default Page9_Q1;
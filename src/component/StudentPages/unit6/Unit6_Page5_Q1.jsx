/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useRef, useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit6_Page5_Q1.css";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import { FaVolumeUp } from "react-icons/fa";
// 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import audio from "../../../assets/audio/ClassBook/U 6/cd36pg50-instruction1-adult-lady_FI6JMTVT.mp3";
import trueIcon from "../../../assets/imgs/true.svg";

// ========================================
// AUDIO (Page 50 - A)
// ========================================

import wordBike from "../../../assets/audio/ClassBook/U 6/Page 50 - A/Item_001_bike.mp3";
import wordKite from "../../../assets/audio/ClassBook/U 6/Page 50 - A/Item_002_kite.mp3";
import wordNight from "../../../assets/audio/ClassBook/U 6/Page 50 - A/Item_003_night.mp3";
import wordLight from "../../../assets/audio/ClassBook/U 6/Page 50 - A/Item_004_light.mp3";
import wordFive from "../../../assets/audio/ClassBook/U 6/Page 50 - A/Item_005_five.mp3";
import wordTight from "../../../assets/audio/ClassBook/U 6/Page 50 - A/Item_006_tight.mp3";
import ExerciseHeader from "../../ExerciseHeader";

// صوت كل كلمة (المفتاح = الكلمة بحروف صغيرة)
const wordAudio = {
  bike: wordBike,
  kite: wordKite,
  night: wordNight,
  light: wordLight,
  five: wordFive,
  tight: wordTight,
};

// ========================================
// DATA
// ========================================

const questions = [
  { id: 1, optionA: "bike", optionB: "kite", correct: "A" },
  { id: 2, optionA: "night", optionB: "light", correct: "B" },
  { id: 3, optionA: "five", optionB: "bike", correct: "A" },
  { id: 4, optionA: "tight", optionB: "night", correct: "A" },
  { id: 5, optionA: "light", optionB: "night", correct: "B" },
  { id: 6, optionA: "kite", optionB: "five", correct: "A" },
];

const captions = [
  {
    start: 0.419,
    end: 8.779,
    text: "Page 50, Right Activities. Exercise A, Number 1. Listen, read, and write ✓.",
  },
  { start: 9.819, end: 16.34, text: "1, bike. 2, light. 3, five." },
  { start: 17.379, end: 19.059, text: "4, tight." },
  { start: 20.079, end: 24.5, text: "5, night. 6, kite" },
];

const TOTAL = questions.length;

// ========================================
// BADGES
// ========================================

// سبيكر أسود داخل دائرة بيضا: بيظهر بس وقت ما صوت الكلمة شغّال
const SpeakerBadge = () => (
  <span
    aria-hidden="true"
    style={{
      position: "absolute",
      top: -10,
      right: -10,
      width: 22,
      height: 22,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
      zIndex: 2,
      lineHeight: 1,
      background: "#fff",
      color: "#000",
      // border: "2px solid #4caf50",
      boxShadow: "0 1px 3px rgba(0,0,0,.25)",
    }}
  >
    <FaVolumeUp size={12} />
  </span>
);

// ========================================
// MAIN
// ========================================

const Unit6_Page5_Q1 = () => {
  // { رقم السؤال: "A" | "B" }
  const [answers, setAnswers] = useState({});

  // الأسئلة اللي إجابتها صح بعد Check (بتنقفل) أو كلها بعد Show Answer
  const [lockedRows, setLockedRows] = useState(() => new Set());

  // الأسئلة الغلط بعد آخر Check (بتضل قابلة للتعديل)
  const [wrongRows, setWrongRows] = useState([]);

  const [score, setScore] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const [playingKey, setPlayingKey] = useState(null);
  const [announcement, setAnnouncement] = useState("");

  const optionRefs = useRef({});
  const audioOwner = useRef({}).current;

  const allCorrect = lockedRows.size === TOTAL;

  // ========================================
  // KEYBOARD ACTIVATION (Enter / Space)
  //
  // بنعالج Enter و Space بإيدينا ونوقّف انتشار الحدث (stopPropagation)،
  // لأن الكتاب غالباً عنده مستمع كيبورد عام بياخد هالمفتاحين ويمنع الكليك الطبيعي.
  // keyedRef بيمنع التنفيذ مرتين (keydown + click اللي بييجي بعد Space)
  // ========================================

  const keyedRef = useRef(false);

  const markKeyed = (ms) => {
    keyedRef.current = true;

    setTimeout(() => {
      keyedRef.current = false;
    }, ms);
  };

  const press = (action) => ({
    onClick: (e) => {
      // detail === 0 يعني click جاي من الكيبورد وإحنا عالجناه بالـ keydown
      if (e.detail === 0 && keyedRef.current) return;
      action(e);
    },
    onKeyDown: (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;

      e.preventDefault();
      e.stopPropagation();

      if (e.repeat) return;

      markKeyed(700);
      action(e);
    },
    onKeyUp: (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;

      e.stopPropagation();
      markKeyed(60);
    },
  });

  // ========================================
  // AUDIO
  // ========================================

  const stopAudio = () => {
    stopGlobalAudio(audioOwner);
    setPlayingKey(null);
  };

  // playGlobalAudio بيوقف أي صوت ثاني شغّال قبل ما يشغّل هاد
const playWordAudio = (qId, word) => {
  const src = wordAudio[word.toLowerCase()];

  if (!src) return;

  // ⏹ وقف صوت التعليمات (QuestionAudioPlayer) إذا كان شغّال
  document.querySelectorAll("audio").forEach((el) => {
    if (!el.paused) el.pause();
  });

  const key = `w:${qId}:${word}`;

  playGlobalAudio(src, {
    owner: audioOwner,
    onFinish: () => setPlayingKey((prev) => (prev === key ? null : prev)),
  });

  setPlayingKey(key);
};

  // وقف الصوت إذا سكرت الصفحة (Previous / Next / Close)
  useEffect(() => () => stopGlobalAudio(audioOwner), [audioOwner]);

  // فوكس بالتاب على كلمة = شغّل صوتها (الماوس/اللمس بيروحوا على onClick)
  const onOptionFocus = (e, qId, word) => {
    if (e.currentTarget.matches(":focus-visible")) playWordAudio(qId, word);
  };

  // ========================================
  // SELECT
  // ========================================

  const handleSelect = (q, choice) => {
    const word = choice === "A" ? q.optionA : q.optionB;

    playWordAudio(q.id, word);

    // الإجابة الصح مقفلة بعد Check / Show Answer
    if (lockedRows.has(q.id)) return;

    if (answers[q.id] === choice) {
      setAnnouncement(`${word} is already selected for question ${q.id}.`);
      return;
    }

    setAnswers((prev) => ({ ...prev, [q.id]: choice }));

    // تعديل إجابة غلط بيشيل علامة ✕ تبعتها
    setWrongRows((prev) => prev.filter((id) => id !== q.id));

    setAnnouncement(`${word} selected for question ${q.id}.`);
  };

  // ========================================
  // CHECK
  // الصح بينقفل (بوردر أخضر)، الغلط بيضل ✕ وبيقدر الطالب يعدّله
  // ========================================

  const checkAnswers = () => {
    if (showAnswer || allCorrect) return;

    stopAudio();

    const firstUnanswered = questions.find((q) => !answers[q.id]);

    if (firstUnanswered) {
      const msg = "Please answer all questions first.";

      ValidationAlert.info("Oops!", msg);
      setAnnouncement(`${msg} Question ${firstUnanswered.id} has no answer.`);
      optionRefs.current[`${firstUnanswered.id}-A`]?.focus?.();
      return;
    }

    const nextLocked = new Set(lockedRows);
    const wrongIds = [];

    questions.forEach((q) => {
      if (nextLocked.has(q.id)) return;

      if (answers[q.id] === q.correct) nextLocked.add(q.id);
      else wrongIds.push(q.id);
    });

    const nextScore = nextLocked.size;

    setLockedRows(nextLocked);
    setWrongRows(wrongIds);
    setScore(nextScore);

    setAnnouncement(
      [
        `Score ${nextScore} out of ${TOTAL}.`,
        wrongIds.length
          ? `Question ${wrongIds.join(", ")} is not correct. You can change ${
              wrongIds.length > 1 ? "them" : "it"
            } and check again.`
          : "All answers are correct.",
      ].join(" "),
    );

    const color =
      nextScore === TOTAL ? "green" : nextScore === 0 ? "red" : "orange";

    const message = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${nextScore} / ${TOTAL}
        </span>
      </div>
    `;

    if (nextScore === TOTAL) ValidationAlert.success(message);
    else if (nextScore === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);
  };

  // ========================================
  // SHOW ANSWER / START AGAIN
  // ========================================

  const handleShowAnswer = () => {
    stopAudio();

    setAnswers(Object.fromEntries(questions.map((q) => [q.id, q.correct])));
    setLockedRows(new Set(questions.map((q) => q.id)));
    setWrongRows([]);
    setScore(null);
    setShowAnswer(true);

    setAnnouncement("All answers shown. Every correct word is selected.");
  };

  const handleStartAgain = () => {
    stopAudio();

    setAnswers({});
    setLockedRows(new Set());
    setWrongRows([]);
    setScore(null);
    setShowAnswer(false);

    setAnnouncement("Activity reset. All answers and score are cleared.");
  };

  // ========================================
  // RENDER
  // ========================================

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
      {/* Screen Reader */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>

      <div className="div-forall">
        <div>
          <ExerciseHeader
            sectionLetter="A"
            questionNumber="1"
            title="Listen, read, and write ✓."
            subTitle="Read the clue completely, then tap the option that best matches it."
          />
        </div>

        <QuestionAudioPlayer
          src={audio}
          captions={captions}
          stopAtSecond={9}
          pageId={"sb-unit6-page5-q1"}
        />

        <p id="u6p5q1-help" className="sr-only">
          For each number, press Tab to reach a word. Press Enter or Space to
          hear it and select it. After checking, correct answers are locked and
          wrong answers can be changed.
        </p>

        <div
          className="CB-unit6-p5-q1-container"
          style={{ marginTop: "20px" }}
          aria-describedby="u6p5q1-help"
        >
          {questions.map((q) => {
            const rowLocked = lockedRows.has(q.id);
            const rowWrong = wrongRows.includes(q.id);

            return (
              <div
                key={q.id}
                className="CB-unit6-p5-q1-row"
                role="group"
                aria-label={`Question ${q.id}. Choose the correct word.`}
              >
                <span
                  className="text-xl font-bold text-blue-900"
                  style={{ width: "20px" }}
                  aria-hidden="true"
                >
                  {q.id}
                </span>

                {["A", "B"].map((choice) => {
                  const word = choice === "A" ? q.optionA : q.optionB;
                  const selected = answers[q.id] === choice;
                  const isWrong = rowWrong && selected;
                  const isCorrectLocked = rowLocked && selected;
                  const isPlaying = playingKey === `w:${q.id}:${word}`;

                  const state = isCorrectLocked
                    ? "Selected. Correct."
                    : isWrong
                      ? "Selected. Not correct. Press another word to change it."
                      : selected
                        ? "Selected."
                        : rowLocked
                          ? "Not selected. Press to hear it."
                          : "Not selected. Press to hear it and select it.";

                  return (
                    <div
                      key={choice}
                      role="button"
                      tabIndex={0}
                      ref={(node) => {
                        optionRefs.current[`${q.id}-${choice}`] = node;
                      }}
                      aria-pressed={selected}
                      aria-label={`${word}. ${state}`}
                      className="CB-unit6-p5-q1-options focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb]"
                      {...press(() => handleSelect(q, choice))}
                      onFocus={(e) => onOptionFocus(e, q.id, word)}
                      style={{
                        position: "relative",
                        minHeight: 56,
                        padding: "6px 12px",
                        borderRadius: 10,
                        cursor: rowLocked ? "default" : "pointer",
                        userSelect: "none",
                        background:
                          selected && !rowLocked ? "#e8f0fe" : undefined,
                        outline: isPlaying ? "2px solid #b3cfff" : undefined,
                      }}
                    >
                      <span>{word}</span>

                      <div className="CB-unit6-p5-q1-input-wrapper">
                        {/* المربع شكل بس: التفاعل كله على الـ div اللي فوق */}
                        <input
                          readOnly
                          tabIndex={-1}
                          aria-hidden="true"
                          className={`CB-unit6-p5-q1-blank ${
                            selected ? "selected" : ""
                          }`}
                          value=""
                          style={{
                            pointerEvents: "none",
                            ...(isCorrectLocked
                              ? { borderBottom: "3px solid #4caf50" }
                              : {}),
                          }}
                        />

                        {selected && (
                          <img
                            className="absolute top-0 left-4"
                            src={trueIcon}
                            alt=""
                            aria-hidden="true"
                            draggable="false"
                            style={{ height: "25px", width: "auto" }}
                          />
                        )}

                        {isWrong && (
                          <span
                            className="CB-unit6-p5-q1-wrong-icon"
                            aria-hidden="true"
                          >
                            ✕
                          </span>
                        )}
                      </div>

                      {/* 🔊 السبيكر بيظهر بس وقت ما صوت الكلمة شغّال */}
                      {isPlaying && <SpeakerBadge />}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="action-buttons-container">
        <button
          type="button"
          onClick={handleStartAgain}
          className="try-again-button"
        >
          Start Again ↻
        </button>

        <button
          type="button"
          onClick={handleShowAnswer}
          className="show-answer-btn swal-continue"
        >
          Show Answer
        </button>

        <button
          type="button"
          onClick={checkAnswers}
          className="check-button2"
          style={
            showAnswer || allCorrect ? { cursor: "not-allowed" } : undefined
          }
        >
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit6_Page5_Q1;

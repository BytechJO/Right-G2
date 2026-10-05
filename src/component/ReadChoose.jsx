import React, { useState, useRef } from "react";
import "./ReadChoose.css";
import read from "../assets/Page 01/P1 listen and repeat 01.svg";
const letters = ["a", "b", "c", "d", "e", "f"];
import ValidationAlert from "./Popup/ValidationAlert";

const ReadChoose = ({ data }) => {
  const [answers, setAnswers] = useState(Array(data.questions.length).fill(""));

  // 🔒 الأسئلة الصح بعد Check بتنقفل
  const [lockedQuestions, setLockedQuestions] = useState(
    Array(data.questions.length).fill(false),
  );
  const [wrongQuestions, setWrongQuestions] = useState([]);

  // 🔒 بعد Show Answer كل شي مقفول
  const [showAnswer, setShowAnswer] = useState(false);

  const allLocked = showAnswer || lockedQuestions.every(Boolean);
  const handleSelect = (qIndex, option) => {
    if (showAnswer || lockedQuestions[qIndex]) return;

    const updated = [...answers];
    updated[qIndex] = option;
    setAnswers(updated);

    // نشيل علامة الغلط عن هاد السؤال لأنو الطالب عدّل
    setWrongQuestions((prev) => prev.filter((i) => i !== qIndex));
  };

  // 🔊 تشغيل الصوت القادم مع الداتا (q.audio)
  const audioRef = useRef(null);
  // العنصر الي اشتغل صوته حالياً (سؤال أو خيار) → بيظهر عليه البوردر + أيقونة الصوت
  const [activeId, setActiveId] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  const playAudio = (src, id) => {
    stopAudio();
    setActiveId(id);
    if (!src) return;

    const audio = new Audio(src);
    audioRef.current = audio;
    // لما يخلص الصوت بتختفي أيقونة الصوت
    audio.onended = () => setActiveId((prev) => (prev === id ? null : prev));
    audio.play().catch(() => setActiveId(null));
  };

  const SpeakerIcon = () => (
    <svg
      className="RCU-unit-read-choose-speaker"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"
      />
    </svg>
  );

  // الخيار ممكن يكون نص عادي أو object: { text, audio }
  const getOptionText = (opt) => (typeof opt === "string" ? opt : opt.text);
  const getOptionAudio = (opt) => (typeof opt === "string" ? null : opt.audio);

  const activateOption = (qIndex, oIndex, opt) => {
    handleSelect(qIndex, getOptionText(opt));
    playAudio(getOptionAudio(opt), `q${qIndex}-o${oIndex}`); // صوت الخيار نفسه
  };

  // ⌨️ Enter / Space (Tab بيشتغل تلقائياً مع tabIndex)
  const handleOptionKeyDown = (e, qIndex, oIndex, opt) => {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault(); // يمنع سكرول الصفحة عند Space
      activateOption(qIndex, oIndex, opt);
    }
  };

  const handleQuestionKeyDown = (e, q, qIndex) => {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      playAudio(q.audio, `q${qIndex}`);
    }
  };

  const checkAnswers = () => {
    if (allLocked) return;

    // الأسئلة الصح المقفولة مليانة أصلاً، فهاد بيفحص بس الفاضية
    const hasEmpty = answers.some((ans) => ans === "");

    if (hasEmpty) {
      ValidationAlert.info("Please answer all questions first.");
      return;
    }

    const newLocked = [...lockedQuestions];
    const wrong = [];
    let correctCount = 0;

    data.questions.forEach((q, index) => {
      if (lockedQuestions[index] || answers[index] === q.correct) {
        newLocked[index] = true; // الصح بينقفل
        correctCount++;
      } else {
        wrong.push(index); // الغلط بيضل مفتوح مع ✕
      }
    });

    setLockedQuestions(newLocked);
    setWrongQuestions(wrong);

    const total = data.questions.length;
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    ValidationAlert[
      correctCount === total
        ? "success"
        : correctCount === 0
          ? "error"
          : "warning"
    ](`
    <div style="font-size:20px;text-align:center;">
      <span style="color:${color};font-weight:bold;">
        Score: ${correctCount} / ${total}
      </span>
    </div>
  `);
  };

  const showCorrectAnswers = () => {
    stopAudio();
    setActiveId(null);
    setAnswers(data.questions.map((q) => q.correct));
    setLockedQuestions(Array(data.questions.length).fill(true));
    setWrongQuestions([]);
    setShowAnswer(true);
  };

  const reset = () => {
    stopAudio();
    setActiveId(null);
    setAnswers(Array(data.questions.length).fill(""));
    setLockedQuestions(Array(data.questions.length).fill(false));
    setWrongQuestions([]);
    setShowAnswer(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="RCU-unit-read-choose-wrapper"
        style={{
          display: "flex",
          flexDirection: "column",
          width: "52%",
          justifyContent: "flex-start",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
          <img src={read} alt="" style={{ height: "130px", width: "130px" }} />{" "}
          <h3 className="RCU-unit-read-choose-title">{data.title}</h3>
        </div>
        <div className="border-2 border-red-600 rounded-xl p-10 flex flex-col gap-10 mb-10">
          {data.questions.map((q, qIndex) => (
            <div key={qIndex} className="RCU-unit-read-choose-question">
              <div className="flex gap-2 items-center">
                <span className="RCU-unit-read-choose-q-number">
                  {qIndex + 1}.
                </span>

                <span
                  className={`RCU-unit-read-choose-q-text ${
                    activeId === `q${qIndex}` ? "RCU-active" : ""
                  }`}
                  id={`rc-q-${qIndex}`}
                  tabIndex={0}
                  role="button"
                  onClick={() => playAudio(q.audio, `q${qIndex}`)}
                  onKeyDown={(e) => handleQuestionKeyDown(e, q, qIndex)}
                >
                  {q.text}
                  <SpeakerIcon />
                </span>
              </div>
              <div
                className="RCU-unit-read-choose-options"
                role="radiogroup"
                aria-labelledby={`rc-q-${qIndex}`}
              >
                {q.options.map((opt, oIndex) => {
                  const option = getOptionText(opt);
                  const isSelected = answers[qIndex] === option;
                  const isLocked = lockedQuestions[qIndex];
                  const isWrong = wrongQuestions.includes(qIndex) && isSelected;
                  const isCorrectLocked = isLocked && isSelected;

                  return (
                    <div
                      key={oIndex}
                      role="radio"
                      aria-checked={isSelected}
                      aria-disabled={isLocked}
                      tabIndex={0}
                      className={`RCU-unit-read-choose-option
        ${isSelected ? "RCU-selected" : ""}
        ${activeId === `q${qIndex}-o${oIndex}` ? "RCU-active" : ""}
        ${isWrong ? "RCU-wrong" : ""}
        ${isCorrectLocked ? "RCU-correct" : ""}
      `}
                      style={{ cursor: isLocked ? "default" : "pointer" }}
                      onClick={() => activateOption(qIndex, oIndex, opt)}
                      onKeyDown={(e) =>
                        handleOptionKeyDown(e, qIndex, oIndex, opt)
                      }
                    >
                      <span className="RCU-unit-read-choose-circle">
                        {letters[oIndex]}
                      </span>
                      <span className="RCU-unit-read-choose-option-text">
                        {option}
                      </span>
                      <SpeakerIcon />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="action-buttons-container">
        {/* الأزرار native <button> فبتستجيب لـ Tab / Enter / Space تلقائياً */}
        <button type="button" className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>

        <button
          type="button"
          className="show-answer-btn swal-continue"
          onClick={showCorrectAnswers}
        >
          Show Answer
        </button>

        <button type="button" className="check-button2" onClick={checkAnswers}>
          Check Answers ✓
        </button>
      </div>
    </div>
  );
};

export default ReadChoose;

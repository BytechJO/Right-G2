import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit6_Page5_Q1.css";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import audio from "../../../assets/audio/ClassBook/U 6/cd36pg50-instruction1-adult-lady_FI6JMTVT.mp3";
import trueIcon from "../../../assets/imgs/true.svg";

const Unit6_Page5_Q1 = () => {
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
  const [answers, setAnswers] = useState({});
  const [wrongRows, setWrongRows] = useState([]);
  const [locked, setLocked] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // ============================
  // اختيار مربع
  // ============================
  const handleSelect = (id, choice) => {
    if (locked || showAnswer) return;

    setAnswers((prev) => ({
      ...prev,
      [id]: choice,
    }));
  };

  // ============================
  // Check Answer
  // ============================
  const checkAnswers = () => {
    if (locked || showAnswer) return;

    // ⭐ تحقق إذا في سؤال فاضي
    if (Object.keys(answers).length !== questions.length) {
      ValidationAlert.info("Oops!", "Please answer all questions first.");
      return;
    }

    let correctCount = 0;
    let wrongTemp = [];

    questions.forEach((q) => {
      if (answers[q.id] === q.correct) correctCount++;
      else wrongTemp.push(q.id);
    });

    setWrongRows(wrongTemp);
    setLocked(true);

    const total = questions.length;

    let color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const message = `
    <div style="font-size:20px;text-align:center;">
      <span style="color:${color};font-weight:bold;">
        Score: ${correctCount} / ${total}
      </span>
    </div>
  `;

    if (correctCount === total) ValidationAlert.success(message);
    else if (correctCount === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);
  };

  // ============================
  // Show Answer
  // ============================
  const handleShowAnswer = () => {
    const filled = Object.fromEntries(questions.map((q) => [q.id, q.correct]));

    setAnswers(filled);
    setShowAnswer(true);
    setLocked(true);
    setWrongRows([]);
  };

  // ============================
  // Start Again
  // ============================
  const handleStartAgain = () => {
    setAnswers({});
    setWrongRows([]);
    setLocked(false);
    setShowAnswer(false);
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
      <div className="div-forall">
        <div>
          <h5 className="header-title-page8">
            <span className="ex-A">A</span>{" "}
            <span style={{ color: "#2e3192" }}>1</span> Listen, read, and write
            <span style={{ color: "#2e3192" }}>✓</span>.
          </h5>
        </div>

        <QuestionAudioPlayer src={audio} captions={captions} stopAtSecond={5} />
        <div className="CB-unit6-p5-q1-container" style={{ marginTop: "20px" }}>
          {questions.map((q, i) => (
            <div key={q.id} className="CB-unit6-p5-q1-row">
              <span className="text-xl font-bold text-blue-900" style={{ width: "20px" }}>{q.id}</span>

              {/* Option A */}
              <div className="CB-unit6-p5-q1-options">
                <span >{q.optionA}</span>

                <div className="CB-unit6-p5-q1-input-wrapper">
                  <input
                    readOnly
                    className={`CB-unit6-p5-q1-blank ${
                      answers[q.id] === "A" ? "selected" : ""
                    }`}
                    onClick={() => handleSelect(q.id, "A")}
                    value={""}
                  />
                  {answers[q.id] === "A" && (
                    <img className="absolute top-0 left-4"
                      src={trueIcon}
                      style={{ height: "25px", width: "auto" }}
                    />
                  )}
                  {locked && answers[q.id] === "A" && q.correct !== "A" && (
                    <span className="CB-unit6-p5-q1-wrong-icon">✕</span>
                  )}
                </div>
              </div>

              {/* Option B */}
              <div className="CB-unit6-p5-q1-options">
                <span>{q.optionB}</span>

                <div className="CB-unit6-p5-q1-input-wrapper">
                  <input
                    readOnly
                    className={`CB-unit6-p5-q1-blank ${
                      answers[q.id] === "B" ? "selected" : ""
                    }`}
                    onClick={() => handleSelect(q.id, "B")}
                    value={""}
                  />
                  {answers[q.id] === "B" && (
                    <img className="absolute top-0 left-4"
                      src={trueIcon}
                      style={{ height: "25px", width: "auto" }}
                    />
                  )}
                  {locked && answers[q.id] === "B" && q.correct !== "B" && (
                    <span className="CB-unit6-p5-q1-wrong-icon">✕</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="action-buttons-container">
        <button onClick={handleStartAgain} className="try-again-button">
          Start Again ↻
        </button>
        {/* ⭐⭐⭐ NEW: زر Show Answer */}
        <button
          onClick={handleShowAnswer}
          className="show-answer-btn swal-continue"
        >
          Show Answer
        </button>

        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit6_Page5_Q1;

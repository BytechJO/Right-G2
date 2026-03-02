import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit6_Page5_Q1.css";
const Unit6_Page5_Q1 = () => {
  const questions = [
    { id: 1, optionA: "bike", optionB: "kite", correct: "A" },
    { id: 2, optionA: "night", optionB: "light", correct: "B" },
    { id: 3, optionA: "five", optionB: "bike", correct: "A" },
    { id: 4, optionA: "tight", optionB: "night", correct: "A" },
    { id: 5, optionA: "light", optionB: "night", correct: "B" },
    { id: 6, optionA: "kite", optionB: "five", correct: "A" },
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
      <div
        className="div-forall"
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          width: "60%",
          gap: "30px",
        }}
      >
        <div>
          <h5 className="header-title-page8">
            <span className="ex-A">A</span>{" "}
            <span style={{ color: "#2e3192" }}>1</span> Which picture has{" "}
            <span style={{ color: "#2e3192" }}>long e</span>? Listen and circle.
          </h5>
        </div>
        <div className="CB-unit6-p5-q1-container" style={{ marginTop: "20px" }}>
          {questions.map((q, i) => (
            <div key={q.id} className="CB-unit6-p5-q1-row">
              <span style={{ width: "20px" }}>{q.id}</span>

              {/* Option A */}
              <div className="CB-unit6-p5-q1-options">
                <span>{q.optionA}</span>

                <div className="CB-unit6-p5-q1-input-wrapper">
                  <input
                    readOnly
                    className={`CB-unit6-p5-q1-blank ${
                      answers[q.id] === "A" ? "selected" : ""
                    }`}
                    onClick={() => handleSelect(q.id, "A")}
                    value={answers[q.id] === "A" ? "✓" : ""}
                  />

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
                    value={answers[q.id] === "B" ? "✓" : ""}
                  />

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

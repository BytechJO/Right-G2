import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/test6.png";
import img2 from "../../../assets/imgs/test6.png";

const Review9_Page1_Q3 = () => {
  const questions = [
    {
      id: 0,
      img: img1,
      options: [
        { key: "a", text: "He’s doing his homework." },
        { key: "b", text: "He’s washing the dishes." },
      ],
      correct: "a",
    },
    {
      id: 1,
      img: img2,
      options: [
        { key: "a", text: "They’re ironing the clothes." },
        { key: "b", text: "They’re playing soccer." },
      ],
      correct: "b",
    },
  ];

  const [answers, setAnswers] = useState({});
  const [locked, setLocked] = useState(false);

  const selectAnswer = (qId, key) => {
    if (locked) return;

    setAnswers((prev) => ({
      ...prev,
      [qId]: key,
    }));
  };

  const reset = () => {
    setAnswers({});
    setLocked(false);
  };

  const showAnswers = () => {
    const correctAnswers = {};
    questions.forEach((q) => {
      correctAnswers[q.id] = q.correct;
    });
    setAnswers(correctAnswers);
    setLocked(true);
  };

  const checkAnswers = () => {
    if (locked) return;

    // تحقق إذا كل الأسئلة متجاوبة
    const empty = questions.some((q) => !answers[q.id]);

    if (empty) {
      ValidationAlert.info("Please complete all answers.");
      return;
    }

    let correctCount = 0;

    questions.forEach((q) => {
      if (answers[q.id] === q.correct) {
        correctCount++;
      }
    });

    const total = questions.length;

    const msg = `
    <div style="font-size:20px;text-align:center;">
      <b>Score: ${correctCount} / ${total}</b>
    </div>
  `;

    if (correctCount === total) {
      ValidationAlert.success(msg);
    } else if (correctCount === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }

    setLocked(true);
  };
  return (
    <div style={{ padding: "30px", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "70%" }}>
        {/* HEADER */}
        <h5 className="header-title-page8 mb-10">
          <span style={{ marginRight: "20px" }}>C</span>
          Look and circle.
        </h5>

        {questions.map((q, index) => (
          <div
            key={q.id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "30px",
            }}
          >
            {/* TEXT */}
            <div style={{ flex: 1, fontSize: "20px" }}>
              {q.options.map((opt, i) => {
                const isSelected = answers[q.id] === opt.key;

                return (
                  <div
                    key={opt.key}
                    onClick={() => selectAnswer(q.id, opt.key)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "8px",
                      cursor: "pointer",
                    }}
                  >
                    {i === 0 && (
                      <span style={{ marginRight: "10px", fontWeight: "bold" }}>
                        {index + 1}
                      </span>
                    )}

                    {i !== 0 && <span style={{ width: "20px" }}></span>}
                    <span style={{ marginRight: "8px", fontWeight: "bold" }}>
                      {opt.key}
                    </span>

                    <span
                      style={{
                        padding: "2px 6px",
                        borderRadius: "10px",
                        border: isSelected
                          ? "2px solid red"
                          : "2px solid transparent",
                      }}
                    >
                      {opt.text}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* IMAGE */}
            <img
              src={q.img}
              style={{
                height: "150px",
                objectFit: "cover",
                borderRadius: "10px",
                border: "2px solid red",
              }}
            />
          </div>
        ))}

        {/* BUTTONS */}
        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>

          <button onClick={showAnswers} className="show-answer-btn">
            Show Answer
          </button>

          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review9_Page1_Q3;

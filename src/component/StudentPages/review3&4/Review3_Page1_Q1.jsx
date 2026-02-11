import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/test.png";
import img2 from "../../../assets/imgs/test.png";
import img3 from "../../../assets/imgs/test.png";
import img4 from "../../../assets/imgs/test.png";
import img5 from "../../../assets/imgs/test.png";
import img6 from "../../../assets/imgs/test.png";
import "./Review1_Page1_Q1.css";

const Review1_Page1_Q1 = () => {
  const [answers, setAnswers] = useState(Array(6).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [locked, setLocked] = useState(false);

  const items = [
    { img: img1, options: ["sister", "mother"], correctIndex: 0 },
    { img: img2, options: ["grandpa", "father"], correctIndex: 0 },
    { img: img3, options: ["mother", "brother"], correctIndex: 0 },
    { img: img4, options: ["brother", "sister"], correctIndex: 0 },
    { img: img5, options: ["grandpa", "grandma"], correctIndex: 1 },
    { img: img6, options: ["mother", "father"], correctIndex: 1 },
  ];

  const handleSelect = (qIndex, optionIndex) => {
    if (locked || showResult) return;
    const copy = [...answers];
    copy[qIndex] = optionIndex;
    setAnswers(copy);
    setShowResult(false);
  };

  const checkAnswers = () => {
    if (locked || showResult) return;
    if (answers.includes(null)) {
      ValidationAlert.info("Oops!", "Please circle all words first.");
      return;
    }

    const correctCount = answers.filter(
      (ans, i) => ans === items[i].correctIndex,
    ).length;

    const total = items.length;
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) ValidationAlert.success(msg);
    else if (correctCount === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);

    setShowResult(true);
  };

  const showAnswers = () => {
    setAnswers(items.map((item) => item.correctIndex));
    setShowResult(true);
    setLocked(true);
  };

  const reset = () => {
    setAnswers(Array(items.length).fill(null));
    setShowResult(false);
    setLocked(false);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      <div className="div-forall" style={{ width: "60%" }}>
        {/* الهيدر كما هو */}
        <h5 className="header-title-page8">
          <span style={{ marginRight: "20px"}}>A</span>Look,
          read, and circle.
        </h5>

        <div className="CB-review1-p1-q1-container">
          {items.map((q, i) => (
            <div key={i} className="CB-review1-p1-q1-question">
              <div className="CB-review1-p1-q1-left">
                <span className="CB-review1-p1-q1-index">{i + 1}</span>
                <img src={q.img} alt="" className="CB-review1-p1-q1-image" />
              </div>

              <div className="CB-review1-p1-q1-options">
                {q.options.map((word, optIndex) => {
                  const isSelected = answers[i] === optIndex;
                  const isCorrect = optIndex === q.correctIndex;

                  return (
                    <p
                      key={optIndex}
                      className={`
                        CB-review1-p1-q1-option
                        ${isSelected ? "is-selected" : ""}
                        ${showResult && isSelected && !isCorrect ? "is-wrong" : ""}
                        ${showResult && isCorrect ? "is-correct" : ""}
                      `}
                      onClick={() => handleSelect(i, optIndex)}
                    >
                      {word}
                      {showResult && isSelected && !isCorrect && !locked && (
                        <span className="CB-review1-p1-q1-wrong-x">✕</span>
                      )}
                    </p>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* الأزرار كما هي */}
      <div className="action-buttons-container">
        <button className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>
        <button onClick={showAnswers} className="show-answer-btn">
          Show Answer
        </button>
        <button className="check-button2" onClick={checkAnswers}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Review1_Page1_Q1;

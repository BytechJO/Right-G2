import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit4_Page5_Q3.css";
import img1 from "../../../assets/imgs/test.png";
import img2 from "../../../assets/imgs/test.png";
import img3 from "../../../assets/imgs/test.png";
import img4 from "../../../assets/imgs/test.png";
import img5 from "../../../assets/imgs/test.png";
const Unit4_Page5_Q3 = () => {
  const [answers, setAnswers] = useState(Array(4).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [locked, setLocked] = useState(false);

  // 🔥 الداتا المطابقة للصورة
  const items = [
    {
      img: img1,
      text: "She can",
      options: [
        "a I’m a teacher.",
        "b I’m a police officer.",
        "c I’m a photographer.",
      ],
      correctIndex: 0,
    },
    {
      img: img2,
      text: "He can’t",
      options: ["a He’s a nurse.", "b He’s a chef.", "c He’s a clerk."],
      correctIndex: 1,
    },
    {
      img: img3,
      text: "It can",
      options: ["a He’s a taxi driver.", "b He’s a vet.", "c He’s a pilot"],
      correctIndex: 2,
    },
    {
      img: img4,
      text: "She can",
      options: [
        "a She’s a nurse.",
        "b She’s a taxi driver.",
        "c She’s a clerk.",
      ],
      correctIndex: 0,
    },
  ];

  const handleSelect = (qIndex, optionIndex) => {
    if (locked || showResult) return; // ❌ لا يسمح بالتعديل بعد Show Answer
    const newAns = [...answers];
    newAns[qIndex] = optionIndex;
    setAnswers(newAns);
    setShowResult(false);
  };

  const checkAnswers = () => {
    if (locked || showResult) return; // ❌ لا يسمح بالتعديل بعد Show Answer
    if (answers.includes(null)) {
      ValidationAlert.info("Oops!", "Please circle all words first.");
      return;
    }

    let correctCount = answers.filter(
      (ans, i) => ans === items[i].correctIndex,
    ).length;

    const total = items.length;

    let color =
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

  const reset = () => {
    setAnswers(Array(items.length).fill(null));
    setShowResult(false);
    setLocked(false);
  };
  const showAnswers = () => {
    // كل سؤال → نضع correctIndex بدل null
    const filled = items.map((item) => item.correctIndex);

    setAnswers(filled);
    setShowResult(true);
    setLocked(true); // 🔒 قفل الإجابات
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
          gap: "30px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <div>
          <h5 className="header-title-page8">
            <span className="ex-A">B</span>Look, read, and circle.
          </h5>
        </div>
        <div className="container-CB-unit4-p5-q3">
          {items.map((q, i) => (
            <div
              key={i}
              className="question-box-CB-unit4-p5-q3"
              style={{ width: "100%" }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: "row",
                  alignItems: "center",
                  width: "80%",
                }}
              >
                <span
                  style={{
                    color: "#2c5287",
                    fontSize: "20px",
                    fontWeight: "700",
                  }}
                >
                  {i + 1}
                </span>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <div className="img-div-CB-unit4-p5-q3">
                  <img
                    src={q.img}
                    className="q3-image-CB-unit4-p5-q3"
                    style={{ height: "150px", width: "auto" }}
                  />
                </div>

                <div className="options-row-CB-unit4-p5-q3">
                  {q.options.map((word, optIndex) => {
                    const isSelected = answers[i] === optIndex;
                    const isCorrect = optIndex === q.correctIndex;

                    return (
                      <p
                        key={optIndex}
                        className={`
                  option-word-CB-unit4-p5-q3
                  ${isSelected ? "selected3" : ""}
                  ${showResult && isSelected && !isCorrect ? "wrong" : ""}
                  ${showResult && isCorrect ? "correct" : ""}
                `}
                        onClick={() => handleSelect(i, optIndex)}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          position: "relative",
                        }}
                      >
                        <>
                          <span style={{ fontWeight: "700",marginRight:"10px" }}>
                            {word.charAt(0)}
                          </span>
                          {word.slice(1)}
                        </>

                        {showResult && isSelected && !isCorrect && !locked && (
                          <span className="wrong-x-CB-unit4-p5-q3">✕</span>
                        )}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
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

export default Unit4_Page5_Q3;

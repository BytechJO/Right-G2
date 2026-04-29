import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 88/Ex C 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 88/Ex C 2.svg";

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

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${correctCount} / ${total}
        </span>
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
  const isWrongOption = (q, optKey) => {
    if (!locked) return false;

    const selected = answers[q.id];
    if (!selected) return false;

    return selected === optKey && optKey !== q.correct;
  };
  return (
    <div className="main-container-component">
      <div className="div-forall" style={{gap:"16px"}}>
        {/* HEADER */}
        <h5 className="header-title-page8 mb-10">
          <span style={{ marginRight: "20px" }}>C</span>
          Look and circle.
        </h5>
         <div className="flex flex-col gap-5">
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
            <div style={{ flex: 1, fontSize: "20px"}}>
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
                      position: "relative", // 🔥 مهم
                      width:"50%" 
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
                        textWrap:"nowrap",
                        border: isSelected
                          ? "2px solid red"
                          : "2px solid transparent",
                      }}
                    >
                      {opt.text}
                    </span>

                    {isWrongOption(q, opt.key) && (
                      <div
                        style={{
                          position: "absolute",
                          top: "-8px",
                          right: "13px",
                          width: "25px",
                          height: "25px",
                          background: "red",
                          color: "white",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "18px",
                          fontWeight: "bold",
                          border: "2px solid white",
                          zIndex: 10,
                        }}
                      >
                        ✕
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* IMAGE */}
            <img
              src={q.img}
              style={{
                height: "150px",
                width: "auto",
                // objectFit: "cover",
                borderRadius: "10px",
                // border: "2px solid red",
              }}
            />
          </div>
        ))}
</div>
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

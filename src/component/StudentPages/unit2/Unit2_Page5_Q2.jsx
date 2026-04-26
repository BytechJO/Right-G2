import React, { useState } from "react";
import img1 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 14/Ex B1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 14/Ex B2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 14/Ex B3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 14/Ex B 4.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit2_Page5_Q2.css";
import trueIcon from "../../../assets/imgs/true.svg"
const Unit2_Page5_Q2 = () => {
  const questions = [
    {
      id: 1,
      image: img1,
      items: [
        { text: "This is a red apple.", correct: "✓" },
        { text: "That is a red apple.", correct: "x" },
      ],
    },
    {
      id: 2,
      image: img2,
      items: [
        { text: "Those are green trees.", correct: "✓" },
        { text: "That’s a green tree.", correct: "x" },
      ],
    },
    {
      id: 3,
      image: img3,
      items: [
        { text: "These are blue birds.", correct: "✓" },
        { text: "This is a blue bird.", correct: "x" },
      ],
    },
    {
      id: 4,
      image: img4,
      items: [
        { text: "That’s a red flower.", correct: "x" },
        { text: "Those are red flowers.", correct: "✓" },
      ],
    },
  ];

  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [locked, setLocked] = useState(false); // ⭐ NEW — قفل التعديل

  const handleSelect = (qId, idx) => {
    if (locked) return; // ⭐ NEW — منع التعديل بعد Show Answer

    setAnswers({
      ...answers,
      [qId]: idx,
    });
    setResults({});
  };

  const checkAnswers = () => {
    if (locked) return; // ⭐ NEW — منع التعديل بعد Show Answer
    const temp = {};
    let correctCount = 0;
    let total = questions.length;

    questions.forEach((q) => {
      const chosenIndex = answers[q.id];

      if (chosenIndex === undefined) {
        temp[q.id] = "empty";
        return;
      }

      const isCorrect = q.items[chosenIndex].correct.toLowerCase() === "✓";

      temp[q.id] = isCorrect ? "correct" : "wrong";

      if (isCorrect) correctCount++;
    });

    setResults(temp);

    if (Object.values(temp).includes("empty")) {
      ValidationAlert.info("Please answer all questions!");
      return;
    }

    let color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size:20px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${correctCount} / ${total}
      </span>
    </div>
  `;

    if (correctCount === total) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);

    setLocked(true); // ⭐ NEW — منع التعديل بعد Check
  };

  const reset = () => {
    setAnswers({});
    setResults({});
    setLocked(false); // ⭐ NEW — إعادة التعديل
  };

  // ⭐⭐⭐ NEW — showAnswer
  const showAnswer = () => {
    const correctSelections = {};

    questions.forEach((q) => {
      const correctIdx = q.items.findIndex((item) => item.correct === "✓");
      correctSelections[q.id] = correctIdx;
    });

    setAnswers(correctSelections);
    setResults(() => {
      const res = {};
      questions.forEach((q) => (res[q.id] = "correct"));
      return res;
    });

    setLocked(true); // قفل التعديل
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
        <h4 className="header-title-page8">
          <span className="ex-A">B</span> Look, read, and write{" "}
          <span style={{ color: "#2e3192" }}>✓</span>.{" "}
        </h4>
        <div className="CB-unit2-p5-q2-grid">
          {questions.map((q) => (
            <div key={q.id} className="CB-unit2-p5-q2-box">
              <div className="CB-unit2-p5-q2-img-container">
                <span style={{ color: "#2e3192" ,fontSize:"20px" ,fontWeight:"700"}}>{q.id}</span>
              <img src={q.image} alt="" className="CB-unit2-p5-q2-img" />

              </div>

              <div className="flex flex-col gap-2">
                {q.items.map((item, idx) => {
                  const isSelected = answers[q.id] === idx;
                  const isWrong = results[q.id] === "wrong" && isSelected;

                  return (
                    <div key={idx} className="CB-unit2-p5-q2-row">
                      <div className="CB-unit2-p5-q2-input-box">
                        <input
                          type="text"
                          readOnly
                          value={""}
                          onFocus={() => handleSelect(q.id, idx)}
                          className="CB-unit2-p5-q2-input"
                        />
{isSelected && (
                          <img
                            src={trueIcon}
                            alt="true"
                            className="CB-unit2-p14-q2-true"
                          />
                        )}

                        {isWrong && <span className="CB-unit2-p5-q2-x">✕</span>}
                      </div>
                      <span className="CB-unit2-p5-q2-text">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="action-buttons-container">
        <button onClick={reset} className="try-again-button">
          Start Again ↻
        </button>

        {/* ⭐⭐⭐ NEW BUTTON */}
        <button onClick={showAnswer} className="show-answer-btn swal-continue">
          Show Answer
        </button>

        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit2_Page5_Q2;

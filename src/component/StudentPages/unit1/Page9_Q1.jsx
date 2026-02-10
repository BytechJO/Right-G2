import React, { useState } from "react";
import img1 from "../../../assets/imgs/test.png";
import img2 from "../../../assets/imgs/test.png";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Page9_Q1.css";

const Page9_Q1 = () => {
  const questions = [
    {
      id: 1,
      image: img1,
      items1: [
        { text: "Who’s he?", correct: "✓" },
        { text: "Who’s she?", correct: "x" },
      ],
      items2: [
        { text: "He’s Stella’s brother.", correct: "✓" },
        { text: "She’s Stella’s brother.", correct: "x" },
      ],
    },
    {
      id: 2,
      image: img2,
      items1: [
        { text: "Who’s he?", correct: "x" },
        { text: "Who’s she?", correct: "✓" },
      ],
      items2: [
        { text: "He’s my brother.", correct: "x" },
        { text: "She’s my sister.", correct: "✓" },
      ],
    },
  ];

  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [locked, setLocked] = useState(false); // ⭐ NEW — قفل التعديل

  const handleSelect = (qId, part, idx) => {
    if (locked) return;

    setAnswers((prev) => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        [part]: idx,
      },
    }));

    setResults({});
  };

  const checkAnswers = () => {
    if (locked) return;

    const temp = {};
    let correctCount = 0;
    const total = questions.length * 2; // item1 + item2

    questions.forEach((q) => {
      const answer = answers[q.id];

      if (!answer || answer.part1 === undefined || answer.part2 === undefined) {
        temp[q.id] = "empty";
        return;
      }

      const correct1 = q.items1[answer.part1].correct === "✓";
      const correct2 = q.items2[answer.part2].correct === "✓";

      temp[q.id] = {
        part1: correct1 ? "correct" : "wrong",
        part2: correct2 ? "correct" : "wrong",
      };

      if (correct1) correctCount++;
      if (correct2) correctCount++;
    });

    setResults(temp);

    if (Object.values(temp).some((r) => r === "empty")) {
      ValidationAlert.info("Please answer all questions!");
      return;
    }

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

    setLocked(true);
  };

  const reset = () => {
    setAnswers({});
    setResults({});
    setLocked(false); // ⭐ NEW — إعادة التعديل
  };

  // ⭐⭐⭐ NEW — showAnswer
  const showAnswer = () => {
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
    setLocked(true);
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
        <h5 className="header-title-page8">
          <span className="ex-A">D</span> Look, read, and write{" "}
          <span style={{ color: "#2e3192" }}>✓</span>.
        </h5>

        <div className="CB-unit1-p9-q1-grid">
          {questions.map((q) => (
            <div key={q.id} className="CB-unit1-p9-q1-box">
              <img src={q.image} alt="" className="CB-unit1-p9-q1-img" />
              <div>
                {q.items1.map((item, idx) => {
                  const isSelected = answers[q.id]?.part1 === idx;
                  const isWrong =
                    results[q.id]?.part1 === "wrong" && isSelected;

                  return (
                    <div key={idx} className="CB-unit1-p9-q1-row">
                      <div className="CB-unit1-p9-q1-input-box">
                        <input
                          type="text"
                          readOnly
                          value={isSelected ? "✓" : ""}
                          onFocus={() => handleSelect(q.id, "part1", idx)}
                          className="CB-unit1-p9-q1-input"
                        />

                        {isWrong && <span className="CB-unit1-p9-q1-x">✕</span>}
                      </div>
                      <span className="CB-unit1-p9-q1-text">{item.text}</span>
                    </div>
                  );
                })}

                {q.items2.map((item, idx) => {
                  const isSelected = answers[q.id]?.part2 === idx;
                  const isWrong =
                    results[q.id]?.part2 === "wrong" && isSelected;

                  return (
                    <div key={idx} className="CB-unit1-p9-q1-row">
                      <div className="CB-unit1-p9-q1-input-box">
                        <input
                          type="text"
                          readOnly
                          value={isSelected ? "✓" : ""}
                          onFocus={() => handleSelect(q.id, "part2", idx)}
                          className="CB-unit1-p9-q1-input"
                        />

                        {isWrong && <span className="CB-unit1-p9-q1-x">✕</span>}
                      </div>
                      <span className="CB-unit1-p9-q1-text">{item.text}</span>
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

export default Page9_Q1;

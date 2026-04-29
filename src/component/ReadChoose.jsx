import React, { useState } from "react";
import "./ReadChoose.css";
import read from "../assets/Page 01/P1 listen and repeat 01.svg";
const letters = ["a", "b", "c", "d", "e", "f"];
import ValidationAlert from "./Popup/ValidationAlert";

const ReadChoose = ({ data }) => {
  const [answers, setAnswers] = useState(Array(data.questions.length).fill(""));

  const [checked, setChecked] = useState(false);
  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const handleSelect = (qIndex, option) => {
    if (checked) return;

    const updated = [...answers];
    updated[qIndex] = option;
    setAnswers(updated);
  };
  const checkAnswers = () => {
    if (checked) return;

    // ✅ تحقق إذا في أسئلة مش مجاوبة
    const hasEmpty = answers.some((ans) => ans === "");

    if (hasEmpty) {
      ValidationAlert.info("Please answer all questions first.");
      return;
    }

    let wrong = [];
    let correctCount = 0;

    data.questions.forEach((q, index) => {
      if (answers[index] === q.correct) {
        correctCount++;
      }
    });

    setWrongQuestions(wrong);
    setChecked(true);
    setScore(correctCount);

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
    const correctAnswers = data.questions.map((q) => q.correct);

    setAnswers(correctAnswers);
    setWrongQuestions([]);
    setChecked(true);
  };
  const reset = () => {
    setAnswers(Array(data.questions.length).fill(""));
    setWrongQuestions([]);
    setChecked(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        // padding: "30px",
        // marginTop:"40px"
      }}
    >
      <div
        className="RCU-unit-read-choose-wrapper"
        style={{
          display: "flex",
          flexDirection: "column",
          // gap: "40px",
          width: "52%",
          justifyContent: "flex-start",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
          <img src={read} style={{ height: "130px", width: "130px" }} />{" "}
          <h3 className="RCU-unit-read-choose-title">{data.title}</h3>
        </div>
        <div className="border-2 border-red-600 rounded-xl p-10 flex flex-col gap-10 mb-10">
          {data.questions.map((q, qIndex) => (
            <div key={qIndex} className="RCU-unit-read-choose-question">
              <div className="flex gap-2 items-center">
                <span className="RCU-unit-read-choose-q-number">
                  {qIndex + 1}.
                </span>

                <span className="RCU-unit-read-choose-q-text">{q.text}</span>
              </div>
              <div className="RCU-unit-read-choose-options">
                {q.options.map((option, oIndex) => {
                  const isSelected = answers[qIndex] === option;
                  const isWrong = checked && isSelected && option !== q.correct;

                  const isCorrect = checked && option === q.correct;

                  return (
                    <div
                      key={oIndex}
                      className={`RCU-unit-read-choose-option
        ${isSelected ? "RCU-selected" : ""}

        ${isWrong ? "RCU-wrong" : ""}
      `}
                      onClick={() => {
                        if (!checked) {
                          handleSelect(qIndex, option);
                        }
                      }}
                    >
                      <span className="RCU-unit-read-choose-circle">
                        {letters[oIndex]}
                      </span>
                      <span className="RCU-unit-read-choose-option-text">
                        {option}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="action-buttons-container">
        <button className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>

        {/* ⭐ زر الشو أنسر */}
        <button
          className="show-answer-btn swal-continue"
          onClick={showCorrectAnswers}
        >
          Show Answer
        </button>

        <button className="check-button2" onClick={checkAnswers}>
          Check Answers ✓
        </button>
      </div>
    </div>
  );
};

export default ReadChoose;

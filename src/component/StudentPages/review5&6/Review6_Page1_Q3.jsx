import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 54/Ex c 1.svg";
import "./Review6_Page1_Q3.css";

const Review6_Page1_Q3 = () => {
  const passage = `
Sheila gets up at seven o’clock in the morning. 
She goes to school at eight thirty. 
She comes home at three thirty. 
She eats dinner at seven thirty in the evening. 
She does her homework at eight o’clock. 
She goes to bed at nine.
`;

  const questions = [
    {
      text: "Sheila does her homework at 8:00 p.m.",
      correct: "True",
    },
    {
      text: "Sheila goes to school at 8:30 p.m.",
      correct: "False",
    },
    {
      text: "Sheila comes home at 3:30 p.m.",
      correct: "True",
    },
    {
      text: "Sheila eats dinner at 7:30 a.m.",
      correct: "False",
    },
    {
      text: "Sheila goes to bed at 9:00 p.m.",
      correct: "True",
    },
  ];

  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [locked, setLocked] = useState(false);

  const selectAnswer = (index, value) => {
    if (locked) return;

    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const checkAnswers = () => {
    if (locked) return;

    if (answers.includes(null)) {
      ValidationAlert.info("Please answer all questions.");
      return;
    }

    let score = 0;

    answers.forEach((ans, i) => {
      if (ans === questions[i].correct) score++;
    });

    const total = questions.length;
   const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const message = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
        Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) ValidationAlert.success(message);
    else if (score === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);

    setShowResult(true);
    setLocked(true);
  };

  const showAnswers = () => {
    const correct = questions.map((q) => q.correct);
    setAnswers(correct);
    setShowResult(true);
    setLocked(true);
  };

  const reset = () => {
    setAnswers(Array(questions.length).fill(null));
    setShowResult(false);
    setLocked(false);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall">
        <h5 className="header-title-page8">
          <span style={{ marginRight: "20px" }}>C</span>
          Read and circle <span style={{ color: "#0b0f7bff" }}>
            true
          </span> or <span style={{ color: "#0b0f7bff" }}>false</span>.
        </h5>
          
          <div className="flex flex-col gap-5">
        {/* passage + image */}
        <div className="flex items-center gap-[30px] mb-[30px]">
          <div className="border-2 border-[#e23d3d] rounded-[10px] p-[15px] leading-[1.6] text-[18px] flex-1">
            {passage}
          </div>

          <img
            src={img1}
            alt=""
            style={{
              width: "170px",
              height: "auto",
            }}
          />
        </div>

        {/* questions */}
        <div>
          {questions.map((q, i) => {
            const isCorrect = answers[i] === q.correct;

            return (
              <div key={i} className="flex items-center gap-2.5 mb-2.5">
                <span className="font-bold text-xl">{i + 1}</span>

                <span className="flex-1 text-xl">{q.text}</span>

                <div className="flex gap-5">
                  <span
                    onClick={() => selectAnswer(i, "True")}
                    className={`relative text-[20px] cursor-pointer px-2 py-[3px] ${
                      answers[i] === "True"
                        ? "font-bold border-2 border-blue-500 rounded-full"
                        : "hover:bg-gray-100 rounded-full"
                    } `}
                  >
                    True
                    {showResult && answers[i] === "True" && !isCorrect && (
                      <div className="absolute -top-2 -right-2 ml-3 w-6 h-6 bg-red-500 rounded-full flex items-center text-sm justify-center text-white font-bold border-2 border-white shadow-lg">
                        ✕
                      </div>
                    )}
                  </span>

                  <span
                    onClick={() => selectAnswer(i, "False")}
                    className={`relative text-[20px] cursor-pointer px-2 py-[3px] ${
                      answers[i] === "False"
                        ? "font-bold border-2 border-blue-500 rounded-full"
                        : "hover:bg-gray-100 rounded-full"
                    }`}
                  >
                    False
                    {showResult && answers[i] === "False" && !isCorrect && (
                      <div className="absolute -top-2 -right-2 ml-3 w-6 h-6 bg-red-500 rounded-full flex items-center text-sm justify-center text-white font-bold border-2 border-white shadow-lg">
                        ✕
                      </div>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </div>

      {/* buttons */}

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

export default Review6_Page1_Q3;

import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 70/Ex A 1.svg";

const Review7_Page1_Q1 = () => {
  const questions = [
    {
      options: ["pilot", "suitcase", "flight attendant"],
      answer: "flight attendant",
    },
    {
      options: ["reception", "pilot", "souvenir shop"],
      answer: "pilot",
    },
    {
      options: ["carry", "arrival", "suitcase"],
      answer: "suitcase",
    },
    {
      options: ["reception", "suitcase", "roll"],
      answer: "reception",
    },
    {
      options: ["suitcase", "souvenir shop", "roll"],
      answer: "roll",
    },
    {
      options: ["reception", "hold", "airplane"],
      answer: "airplane",
    },
  ];

  const [answers, setAnswers] = useState(Array(6).fill(""));
  const [locked, setLocked] = useState(false);

  const choose = (qIndex, value) => {
    if (locked) return;

    const updated = [...answers];
    updated[qIndex] = value;

    setAnswers(updated);
  };

  const resetAll = () => {
    setAnswers(Array(6).fill(""));
    setLocked(false);
  };

  const showAnswers = () => {
    setAnswers(questions.map((q) => q.answer));
    setLocked(true);
  };

  const checkAnswers = () => {
    if (locked) return;
    if (answers.includes("")) {
      ValidationAlert.info("Please complete all answers");
      return;
    }

    let score = 0;

    answers.forEach((a, i) => {
      if (a === questions[i].answer) score++;
    });

    const total = questions.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const message = `
<div style="font-size:20px;text-align:center;">
<b style="color:${color};">Score: ${score} / ${total}</b>
</div>
`;
    if (score === total) ValidationAlert.success(message);
    else if (score === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);

    setLocked(true);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{gap:"45px"}}>
        <h5 className="header-title-page8">
          <span style={{ marginRight: "20px" }}>A</span>
          Look and circle.
        </h5>

        {/* IMAGE */}

        <div className="flex justify-center">
          <img
            src={img1}
            className="object-contain rounded-xl"
            style={{ height: "190px", width: "auto" }}
          />
        </div>

        {/* OPTIONS */}

        <div className="grid grid-cols-6 gap-4">
          {questions.map((q, qIndex) => {
            return (
              <div
                key={qIndex}
                className="bg-[#f9e5dd] rounded-xl p-3 text-center flex flex-col gap-1"
              >
                <div className="font-bold">{qIndex + 1}</div>

                {q.options.map((word) => {
                  const isSelected = answers[qIndex] === word;
                  const isWrong =
                    locked && isSelected && word !== questions[qIndex].answer;

                  return (
                    <div
                      key={word}
                      onClick={() => choose(qIndex, word)}
                      className={`cursor-pointer px-2 py-1 relative
${isSelected ? "border-2 border-blue-500 rounded-full px-3 py-1" : ""}
`}
                    >
                      {word}

                      {isWrong && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                          <span className="text-white text-sm font-bold">
                            ✕
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* BUTTONS */}

      <div className="action-buttons-container mt-10">
        <button onClick={resetAll} className="try-again-button">
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
  );
};

export default Review7_Page1_Q1;

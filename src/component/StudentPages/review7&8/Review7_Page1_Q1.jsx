import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/test6.png";

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
      answer: "souvenir shop",
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

    const message = `
<div style="font-size:20px;text-align:center;">
<span style="color:#2e7d32;font-weight:bold;">
Score: ${score} / ${total}
</span>
</div>
`;

    if (score === total) ValidationAlert.success(message);
    else if (score === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);

    setLocked(true);
  };

  return (
    <div className="flex flex-col items-center p-8">
      <div className="w-[85%]">
        <h5 className="header-title-page8">
          <span style={{ marginRight: "20px" }} >
            A
          </span>
          Look and circle.
        </h5>

        {/* IMAGE */}

        <div className="flex justify-center mb-8">
          <img
            src={img1}
            className="w-[900px]! h-[250px]! object-contain border border-red-400 rounded-xl"
          />
        </div>

        {/* OPTIONS */}

        <div className="grid grid-cols-6 gap-4">
          {questions.map((q, qIndex) => (
            <div
              key={qIndex}
              className="bg-[#ead6cc] rounded-xl p-3 text-center flex flex-col gap-1"
            >
              <div className="font-bold">{qIndex + 1}</div>

              {q.options.map((word) => {
                const selected = answers[qIndex] === word;

                return (
                  <div
                    key={word}
                    onClick={() => choose(qIndex, word)}
                    className={`cursor-pointer px-2 py-1 relative
${selected ? "border-2 border-red-500 rounded-full px-3 py-1" : ""}
`}
                  >
                    {word}
                  </div>
                );
              })}
            </div>
          ))}
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

import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

const Review8_Page2_Q3 = () => {
  const questions = [
    {
      sentence: "_____ is my best friend.",
      options: ["Sue", "glue"],
      correct: "Sue",
    },
    {
      sentence: "My favorite color is _____.",
      options: ["tune", "blue"],
      correct: "blue",
    },
    {
      sentence: "The summer vacation starts in _____.",
      options: ["June", "December"],
      correct: "June",
    },
  ];

  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [locked, setLocked] = useState(false);

  const selectAnswer = (i, value) => {
    if (locked) return;

    const updated = [...answers];
    updated[i] = value;
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

    let color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size: 20px; text-align:center; margin-top: 8px;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${score}/${total}
        </span>
      </div>
    `;

    if (score === total) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);

    setLocked(true);
  };

  const showAnswers = () => {
    setAnswers(questions.map((q) => q.correct));
    setLocked(true);
  };

  const reset = () => {
    setAnswers(Array(questions.length).fill(null));
    setLocked(false);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{gap:"120px"}}>
        {" "}
        {/* العنوان */}
        <h5 className="header-title-page8">
          <span style={{ marginRight: "15px" }}>G</span>
          Circle and write.
        </h5>
        {/* الأسئلة */}
        <div className="space-y-18">
          {questions.map((q, i) => {
            const parts = q.sentence.split("_____");
            const isWrong =
              locked && answers[i] !== null && answers[i] !== q.correct;
            return (
              <div key={i} className="flex items-center gap-4 ">
                <span className="font-bold text-xl">{i + 1}</span>

                <span className="flex-1 text-xl">
                  {parts[0]}

                  <span className="relative inline-block">
                    {answers[i] ? (
                      <span
                        className={`border-b-2 border-black px-2 ${
                          answers[i] === q.correct
                            ? "border-b-2 border-black"
                            : isWrong
                              ? "border-red-500"
                              : "border-black"
                        }`}
                      >
                        {answers[i]}
                      </span>
                    ) : (
                      <span className="border-b-2 border-black px-10 inline-block"></span>
                    )}

                    {/* ❌ WRONG ICON */}
                    {isWrong && (
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow border-2 border-white">
                        ✕
                      </span>
                    )}
                  </span>

                  {parts[1]}
                </span>

                <div className="flex gap-20 text-xl w-[30%]" style={{justifyContent:"flex-start"}}>
                  {q.options.map((opt, idx) => (
                    <span
                      key={idx}
                      onClick={() => selectAnswer(i, opt)}
                      className={`cursor-pointer ${
                        answers[i] === opt
                          ? "border-2 border-blue-700 rounded-full px-2 font-bold"
                          : ""
                      }`}
                    >
                      <span className="font-bold mr-1">
                        {idx === 0 ? "a" : "b"}
                      </span>
                      {opt}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
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

export default Review8_Page2_Q3;

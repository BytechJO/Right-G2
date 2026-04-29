import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import trueIcon from "../../../assets/imgs/true.svg";

import img1 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 81/Ex E 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 81/Ex E 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 81/Ex E 3.svg";

const Unit9_Page6_Q2 = () => {
  const questions = [
    {
      id: 1,
      img: img1,
      options: ["They're watching TV.", "They're studying English."],
      correct: "They're studying English.",
    },
    {
      id: 2,
      img: img2,
      options: ["We're playing chess.", "We're cooking lunch."],
      correct: "We're playing chess.",
    },
    {
      id: 3,
      img: img3,
      options: ["They're watching TV.", "They're listening to the radio."],
      correct: "They're watching TV.",
    },
  ];

  const [answers, setAnswers] = useState({});
  const [locked, setLocked] = useState(false);
  const [checked, setChecked] = useState(false);
  const handleSelect = (qId, option) => {
    if (locked) return;

    setAnswers((prev) => ({
      ...prev,
      [qId]: option,
    }));
  };

  const reset = () => {
    setAnswers({});
    setLocked(false);
    setChecked(false);
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

    const empty = questions.some((q) => !answers[q.id]);

    if (empty) {
      ValidationAlert.info("Please answer all questions.");
      return;
    }

    let score = 0;

    questions.forEach((q) => {
      if (answers[q.id] === q.correct) score++;
    });
const total = questions.length;
    const color = score === total ? "green" : score === 0 ? "red" : "orange";
    
    const message = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${score} / ${total}
      </span>
    </div>
  `;

    if (score === questions.length) ValidationAlert.success(message);
    else if (score === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);
    setChecked(true);
    setLocked(true);
    setLocked(true);
  };
  const isWrongOption = (q, opt) => {
    if (!checked) return false;

    return answers[q.id] === opt && opt !== q.correct;
  };
  return (
    <div className="main-container-component mb-10">
      <div className="div-forall" style={{gap:"50px"}}>
        <h5 className="header-title-page8">
          <span className="ex-A me-4">E</span>Look, read, and write
          <span style={{ color: "#2e3192" }}>✓</span>.
        </h5>
        <div className="flex flex-col gap-5">
        {questions.map((q) => (
          <div key={q.id} className="flex items-center gap-6 ">
            {/* الرقم + الصورة */}
            <div className="flex items-start gap-3">
              <span className="font-bold w-5">{q.id}</span>

              <img
                src={q.img}
                style={{ height: "auto", width: "250px", objectFit: "cover" }}
              />
            </div>

            {/* الخيارات */}
            <div className="flex flex-col gap-3">
              {q.options.map((opt, i) => {
                const isSelected = answers[q.id] === opt;
                const isCorrect = opt === q.correct;

                return (
                  <div
                    key={i}
                    onClick={() => handleSelect(q.id, opt)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    {/* checkbox */}
                    <div
                      className={`relative w-[45px] h-[45px] rounded-lg border-2 flex items-center justify-center transition
    ${
      isSelected
        ? checked
          ? isCorrect
            ? "border-blue-800"
            : "border-red-600"
          : "border-blue-800 bg-blue-50"
        : "border-gray-400 bg-white"
    }
  `}
                    >
                      {isSelected && (
                        <span
                          className={`text-xl font-bold leading-none ${
                            checked
                              ? isCorrect
                                ? "text-blue-800"
                                : "text-blue-800"
                              : "text-blue-800"
                          }`}
                        >
                          <img
                        src={trueIcon}
                        style={{ height: "25px", width: "auto" }}
                      />
                          {isWrongOption(q, opt) && (
                            <div
                              className="
      absolute -top-2 -right-2
      w-5 h-5
      bg-red-500 text-white
      rounded-full
      flex items-center justify-center
      text-xs font-bold
      border-2 border-white
      z-10
    "
                            >
                              ✕
                            </div>
                          )}
                        </span>
                      )}
                    </div>

                    {/* النص */}
                    <span className="text-[20px]">{opt}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div></div>

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
  );
};

export default Unit9_Page6_Q2;

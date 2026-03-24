import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/test6.png";
import img2 from "../../../assets/imgs/test6.png";
import img3 from "../../../assets/imgs/test6.png";

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

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:#2e7d32;font-weight:bold;">
          Score: ${score} / ${questions.length}
        </span>
      </div>
    `;

    if (score === questions.length) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
    setChecked(true);
    setLocked(true);
    setLocked(true);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      <div className="div-forall" style={{ width: "60%" }}>
        <h5 className="header-title-page8">
          <span className="ex-A me-4">E</span>Look, read, and write
          <span style={{ color: "#2e3192" }}>✓</span>.
        </h5>

        {questions.map((q) => (
          <div key={q.id} className="flex items-center gap-6 mb-6">
            {/* الرقم + الصورة */}
            <div className="flex items-center gap-3">
              <span className="font-bold w-5">{q.id}</span>

              <img
                src={q.img}
                style={{ height: "auto", width: "300px", objectFit: "cover" }}
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
                      className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition
    ${
      isSelected
        ? checked
          ? isCorrect
            ? "border-green-600 bg-green-50"
            : "border-red-600 bg-red-50"
          : "border-red-500 bg-red-50"
        : "border-gray-400 bg-white"
    }
  `}
                    >
                      {isSelected && (
                        <span
                          className={`text-xl font-bold leading-none ${
                            checked
                              ? isCorrect
                                ? "text-green-600"
                                : "text-red-600"
                              : "text-red-500"
                          }`}
                        >
                          ✓
                        </span>
                      )}
                    </div>

                    {/* النص */}
                    <span className="text-[16px]">{opt}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
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
  );
};

export default Unit9_Page6_Q2;

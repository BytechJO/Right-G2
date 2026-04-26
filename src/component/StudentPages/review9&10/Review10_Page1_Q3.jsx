import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 90/Ex C 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 90/Ex C 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 90/Ex C 3.svg";

const Review8_Page1_Q3 = () => {
  const items = [
    {
      img: img1,
      text: "Is she cooking?",
      sentence: ["Yes, she is.", "No, she isn’t."],
      correct: "No, she isn’t.",
    },
    {
      img: img2,
      text: "Is he sleeping?",
      sentence: ["Yes, he is.", "No, he isn’t."],
      correct: "No, he isn’t.",
    },
    {
      img: img3,
      text: "Are they listening to a song?",
      sentence: ["Yes, they are.", "No, they aren’t."],
      correct: "Yes, they are.",
    },
  ];

  const [selected, setSelected] = useState(Array(items.length).fill(""));
  const [showWrongMarks, setShowWrongMarks] = useState(false);
  const [locked, setLocked] = useState(false);
  const checkAnswers = () => {
    if (locked) return;

    if (selected.includes("")) {
      ValidationAlert.info("Please answer all questions.");
      return;
    }

    let score = 0;

    items.forEach((item, i) => {
      if (selected[i] === item.correct) score++;
    });

    const total = items.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
        Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);

   setShowWrongMarks(true);
setLocked(true);
  };

const reset = () => {
  setSelected(Array(items.length).fill(""));
  setLocked(false);
  setShowWrongMarks(false);
};

const showAnswers = () => {
  setSelected(items.map((i) => i.correct));
  setLocked(true);
  setShowWrongMarks(false);
};
  return (
      <div className="main-container-component">
        <div className="div-forall">
        <h5 className="header-title-page8 mb-10">
          <span style={{ marginRight: "20px" }}>C</span>
          Look, read, and circle.
        </h5>

        {/* GRID */}
        <div className="grid grid-cols-3 gap-3">
          {items.map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-xl mb-2">
                <span
                  style={{
                    fontWeight: "bold",
                    marginRight: "4px",
                  }}
                >
                  {i + 1}{" "}
                </span>
                {item.text}
              </div>

              <img
                src={item.img}
                style={{
                  display: "block",
                  margin: "0 auto",
                  marginBottom: "1rem",
                  width: "auto",
                  height: "200px",
                }}
              />

              {/* الخيارات */}
              <div className="bg-[#e6d1c3] p-3 rounded-xl inline-block">
                {item.sentence.map((opt, idx) => {
  const isSelected = selected[i] === opt;

  const isWrong =
    showWrongMarks &&
    isSelected &&
    opt !== item.correct;

  return (
    <div
      key={idx}
      onClick={() => {
        if (!locked) {
          const newSelected = [...selected];
          newSelected[i] = opt;
          setSelected(newSelected);
        }
      }}
      className={`cursor-pointer px-3 py-1 rounded-full mb-1 relative
        ${isSelected ? "border-2 border-red-500" : ""}
      `}
    >
      {opt}

      {isWrong && (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow border-2 border-white">
          ✕
        </div>
      )}
    </div>
  );
})}
              </div>
            </div>
          ))}
        </div>

        {/* buttons */}
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

export default Review8_Page1_Q3;

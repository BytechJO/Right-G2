import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/test6.png";
import img2 from "../../../assets/imgs/test6.png";
import img3 from "../../../assets/imgs/test6.png";
import img4 from "../../../assets/imgs/test6.png";
import img5 from "../../../assets/imgs/test6.png";
import img6 from "../../../assets/imgs/test6.png";

const Review8_Page1_Q3 = () => {
  const items = [
    { img: img1, text: "I have three dresses.", correct: "yes" },
    { img: img2, text: "She has two pairs of shoes.", correct: "yes" },
    { img: img3, text: "She has two skirts.", correct: "no" },
    { img: img4, text: "She has six skirts.", correct: "no" },
    { img: img5, text: "I have two caps.", correct: "yes" },
    { img: img6, text: "He has five pairs of pants.", correct: "no" },
  ];

  const [selected, setSelected] = useState(Array(items.length).fill(""));
  const [locked, setLocked] = useState(false);

  const choose = (i, value) => {
    if (locked) return;

    const updated = [...selected];
    updated[i] = value;
    setSelected(updated);
  };

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

    setLocked(true);
  };

  const showAnswers = () => {
    setSelected(items.map((i) => i.correct));
    setLocked(true);
  };

  const reset = () => {
    setSelected(Array(items.length).fill(""));
    setLocked(false);
  };

  return (
    <div className="flex justify-center p-8">
      <div className="w-[80%]">
        <h5 className="header-title-page8">
          <span  style={{ marginRight: "20px" }}>
            C
          </span>
          Look, read, and write<span style={{ color: "#2e3192" }}> ✓ </span>or
          <span style={{ color: "#2e3192" }}> ✗</span>
        </h5>

        {/* GRID */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              {/* number */}
              <span className="font-bold text-sm w-4">{i + 1}</span>

              {/* image */}
              <img
                src={item.img}
                style={{
                  width: "120px",
                  height: "120px",
                  border: "2px solid red",
                }}
                className=" border-2 border-red-400 rounded-lg"
              />

              {/* sentence */}
              <span className="text-[20px]">{item.text}</span>
              {/* answer box */}
              <div className="flex flex-col gap-2 justify-center h-[150px]">
                <button
                  onClick={() => choose(i, "yes")}
                  className={`w-10 h-10 border rounded text-lg ${
                    selected[i] === "yes" ? "bg-green-500 text-white" : ""
                  }`}
                >
                  ✓
                </button>

                <button
                  onClick={() => choose(i, "no")}
                  className={`w-10 h-10 border rounded text-lg ${
                    selected[i] === "no" ? "bg-red-500 text-white" : ""
                  }`}
                >
                  ✗
                </button>
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

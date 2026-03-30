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
    <div className="main-container-component">
      <div className="div-forall">
        <h5 className="header-title-page8">
          <span style={{ marginRight: "20px" }}>C</span>
          Look, read, and write<span style={{ color: "#2e3192" }}> ✓ </span>or
          <span style={{ color: "#2e3192" }}> ✗</span>
        </h5>

        {/* GRID */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 w-full">
          {items.map((item, i) => {
            const isWrongYes =
              locked && selected[i] === "yes" && item.correct !== "yes";

            const isWrongNo =
              locked && selected[i] === "no" && item.correct !== "no";
            return (
              <div
                key={i}
                className="flex items-center gap-2 w-full"
                style={{ justifyContent: "space-between" }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    {/* number */}
                    <span className="font-bold text-xl w-4">{i + 1}</span>

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
                  </div>
                  {/* sentence */}
                  <span className="text-[20px]">{item.text}</span>
                </div>
                {/* answer box */}
                <div className="flex flex-col gap-2 justify-center h-[150px]">
                  {/* YES */}
                  <div className="relative">
                    <button
                      onClick={() => choose(i, "yes")}
                      className={`w-10 h-10 border rounded text-lg ${
                        selected[i] === "yes" ? "bg-blue-600 text-white" : ""
                      }`}
                    >
                      ✓
                    </button>

                    {/* ❌ فوق زر yes إذا غلط */}
                    {isWrongYes && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow border-2 border-white">
                        ✕
                      </div>
                    )}
                  </div>

                  {/* NO */}
                  <div className="relative">
                    <button
                      onClick={() => choose(i, "no")}
                      className={`w-10 h-10 border rounded text-lg ${
                        selected[i] === "no" ? "bg-blue-600 text-white" : ""
                      }`}
                    >
                      ✗
                    </button>

                    {/* ❌ فوق زر no إذا غلط */}
                    {isWrongNo && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow border-2 border-white">
                        ✕
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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

import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/test6.png";
import img2 from "../../../assets/imgs/test6.png";
import img3 from "../../../assets/imgs/test6.png";
import img4 from "../../../assets/imgs/test6.png";
import img5 from "../../../assets/imgs/test6.png";
import img6 from "../../../assets/imgs/test6.png";

const Review5_Page2_Q3 = () => {
  const items = [
    { img: img1, options: ["ee", "ea"], correct: "ee", start: "b", end: "" },
    { img: img2, options: ["ee", "ea"], correct: "ea", start: "t", end: "" },
    { img: img3, options: ["ee", "ea"], correct: "ee", start: "f", end: "t" },
    { img: img4, options: ["ee", "ea"], correct: "ea", start: "m", end: "t" },
    { img: img5, options: ["ee", "ea"], correct: "ea", start: "r", end: "d" },
    { img: img6, options: ["ee", "ea"], correct: "ee", start: "sl", end: "p" },
  ];

  const [selected, setSelected] = useState(Array(items.length).fill(""));
  const [answers, setAnswers] = useState(Array(items.length).fill(""));
  const [locked, setLocked] = useState(false);

  const chooseOption = (i, value) => {
    if (locked) return;

    const newSelected = [...selected];
    newSelected[i] = value;
    setSelected(newSelected);

    const newAnswers = [...answers];
    newAnswers[i] = items[i].start + value + items[i].end;
    setAnswers(newAnswers);
  };

  const resetAll = () => {
    setSelected(Array(items.length).fill(""));
    setAnswers(Array(items.length).fill(""));
    setLocked(false);
  };

  const showAnswers = () => {
    setSelected(items.map((i) => i.correct));
    setAnswers(items.map((i) => i.start + i.correct + i.end));
    setLocked(true);
  };

  const checkAnswers = () => {
    if (locked) return;
    if (selected.includes("")) {
      ValidationAlert.info("Please complete all answers.");
      return;
    }

    let score = 0;

    items.forEach((item, i) => {
      if (selected[i] === item.correct) {
        score++;
      }
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

  return (
    <div className="flex justify-center p-8">
      <div className="w-[80%]">
        <h5 className="header-title-page8">
          <span className=" mr-4">F</span>
          Look, circle, and write.
        </h5>
        <div className="flex justify-center">
          <div className="grid grid-cols-3 gap-y-10 gap-x-[60px] mt-10 justify-center">
            {items.map((item, i) => (
              <div
                key={i}
                className="flex flex-col scale-[1.2] origin-top-left"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[20px] font-bold text-[#2a4e7c]">
                    {i + 1}
                  </span>

                  <img
                    src={item.img}
                    alt=""
                    style={{
                      width: "100px",
                      height: "auto",
                    }}
                  />

                  <div className="flex flex-col gap-1.5 text-[18px]">
                    <span
                      onClick={() => chooseOption(i, item.options[0])}
                      className={`cursor-pointer px-2 py-0.5 ${
                        selected[i] === item.options[0]
                          ? "border-2 border-red-500 rounded-full"
                          : "hover:bg-gray-100 rounded-full"
                      }`}
                    >
                      {item.options[0]}
                    </span>

                    <span
                      onClick={() => chooseOption(i, item.options[1])}
                      className={`cursor-pointer px-2 py-0.5 ${
                        selected[i] === item.options[1]
                          ? "border-2 border-red-500 rounded-full"
                          : "hover:bg-gray-100 rounded-full"
                      }`}
                    >
                      {item.options[1]}
                    </span>
                  </div>
                </div>

                <div className="border-b-2 border-[#444] w-40 mt-2 text-[18px]">
                  {answers[i]}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* ⭐ الأزرار (كما هي) */}
        <div className="action-buttons-container">
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
    </div>
  );
};

export default Review5_Page2_Q3;

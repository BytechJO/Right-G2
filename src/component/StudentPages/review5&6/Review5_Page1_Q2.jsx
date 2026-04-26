import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review5_Page1_Q2.css";

import img1 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 52/Ex B 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 52/Ex B 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 52/Ex B 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 52/Ex B 4.svg";
const Review5_Page1_Q2 = () => {
  const items = [
    {
      img: img4,
      start: "He likes",
      options: ["fruit", "burgers"],
      correct: "fruit",
      sentence: "He likes fruit.",
    },
    {
      img: img3,
      start: "She likes",
      options: ["burgers", "rice"],
      correct: "burgers",
      sentence: "She likes burgers.",
    },
    {
      img: img2,
      start: "She likes",
      options: ["fish", "cheese"],
      correct: "cheese",
      sentence: "She likes cheese.",
    },
    {
      img: img1,
      start: "He likes",
      options: ["rice", "chicken"],
      correct: "chicken",
      sentence: "He likes chicken.",
    },
  ];

  const [selected, setSelected] = useState(["", "", "", ""]);
  const [sentences, setSentences] = useState(["", "", "", ""]);
  const [locked, setLocked] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const chooseOption = (i, value) => {
    if (locked) return;

    const updated = [...selected];
    updated[i] = value;
    setSelected(updated);

    const text = [...sentences];
    text[i] = `${items[i].start} ${value}.`;
    setSentences(text);
  };

  const resetAll = () => {
    setSelected(["", "", "", ""]);
    setSentences(["", "", "", ""]);
    setLocked(false);
    setShowResult(false);
  };

  const showAnswers = () => {
    const correct = items.map((i) => i.correct);
    const text = items.map((i) => i.sentence);

    setSelected(correct);
    setSentences(text);
    setLocked(true);
  };

  const checkAnswers = () => {
    if (locked) return;

    if (selected.some((s) => s === "")) {
      ValidationAlert.info("Please choose an answer.");
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

    const message = `
<div style="font-size:20px;text-align:center;">
<span style="color:${color};font-weight:bold;">
Score: ${score} / ${total}
</span>
</div>
`;

    if (score === total) ValidationAlert.success(message);
    else if (score === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);

    setLocked(true);
    setShowResult(true);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall">
        <h5 className="header-title-page8">
          <span style={{ marginRight: "20px" }}>B</span>
          Look, circle, and write.
        </h5>

        <div className="grid grid-cols-2 gap-y-[60px] gap-x-30 mt-5">
          {items.map((item, i) => {
            const isWrong =
              showResult && selected[i] && selected[i] !== item.correct;

            const isCorrect = showResult && selected[i] === item.correct;
            return (
              <div key={i} className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2 text-[18px]">
                  <span className="font-bold text-[#1d4f7b]">{i + 1}</span>

                  <img
                    src={item.img}
                    alt=""
                    style={{
                      width: "auto",
                      height: "90px",
                      objectFit: "contain",
                      marginRight: "6px",
                    }}
                  />

                  <span style={{textWrap:"nowrap"}}>{item.start}</span>

                  <span
                    onClick={() => chooseOption(i, item.options[0])}
                    className={`cursor-pointer px-2 py-[3px] rounded-full ${
                      selected[i] === item.options[0]
                        ? "border-2 border-blue-500"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {item.options[0]}
                  </span>

                  <span> / </span>

                  <span
                    onClick={() => chooseOption(i, item.options[1])}
                    className={`cursor-pointer px-2 py-[3px] rounded-full ${
                      selected[i] === item.options[1]
                        ? "border-2 border-blue-500"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {item.options[1]}
                  </span>
                </div>

                <div className="relative">
                  <div
                    className={`border-b-2 w-[350px] min-h-6 text-[18px]
    ${
      showResult
        ? isCorrect
          ? "border-[#444]"
          : isWrong
            ? "border-red-500"
            : "border-[#444]"
        : "border-[#444]"
    }`}
                  >
                    {sentences[i]}
                  </div>

                  {/* ❌ X */}
                  {isWrong && (
                    <div className="absolute -top-2 right-35 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md border-2 border-white">
                      ✕
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
  );
};

export default Review5_Page1_Q2;

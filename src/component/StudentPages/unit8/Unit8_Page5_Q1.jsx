import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import trueIcon from "../../../assets/imgs/true.svg";
import falseIcon from "../../../assets/imgs/false.svg";
import img1 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 68/Ex A 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 68/Ex A 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 68/Ex A 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 68/Ex A 4.svg";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import sound1 from "../../../assets/audio/ClassBook/U 8/cd48pg68-instruction1-adult-lady_IL6QUJR1.mp3";
const Unit8_Page5_Q1 = () => {
  const items = [
    { img: img1, correct: "yes" },
    { img: img2, correct: "no" },
    { img: img3, correct: "yes" },
    { img: img4, correct: "no" },
  ];

  const [selected, setSelected] = useState(Array(items.length).fill(""));
  const [locked, setLocked] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const captions = [
    {
      start: 0.539,
      end: 10.739,
      text: "Page 68, Right Activities. Exercise A, number 1. Does it have a long U? Listen and write ✓ or X.",
    },
    { start: 11.88, end: 15.739, text: "1, mule. 2, sun." },
    { start: 16.819, end: 20.979, text: "3, blue. 4, ice" },
  ];

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
    setShowResult(true);
  };

  const showAnswers = () => {
    setSelected(items.map((i) => i.correct));
    setLocked(true);
  };
  const reset = () => {
    setSelected(Array(items.length).fill(""));
    setLocked(false);
    setShowResult(false);
  };
  const isWrong = (i) => {
    if (!showResult) return false;
    return selected[i] !== items[i].correct;
  };
  return (
    <div className="main-container-component">
      <div className="div-forall">
        <h5 className="header-title-page8">
          <span className="ex-A" style={{ marginRight: "20px" }}>
            A
          </span>
          <span style={{ color: "#2e3192" }}>1</span>
          Does it have a <span style={{ color: "#2e3192" }}>long u</span>?
          Listen and write<span style={{ color: "#2e3192" }}> ✓ </span>or
          <span style={{ color: "#2e3192" }}> ✗</span>
        </h5>
        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={10.73}
        />
        {/* GRID */}
        <div className="grid grid-cols-4 gap-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center gap-3 relative mt-4"
            >
              {/* number in corner */}
              <span className="absolute -top-1 -left-1 text-lg font-bold">
                {i + 1}
              </span>

              {/* image + audio */}
              <div className="flex flex-col items-center">
                <img
                  src={item.img}
                  className="w-[150px]! h-[150px]! object-contain"
                />
              </div>

              {/* answers on right */}
              <div className="flex gap-2 justify-center h-[150px] relative">
                <button
                  onClick={() => choose(i, "yes")}
                  className={`w-10 h-10 border flex items-center justify-center rounded text-lg ${
                    selected[i] === "yes"
                      ? "border-2 border-blue-800 text-white"
                      : ""
                  }`}
                >
                  <img src={trueIcon} style={{ height: "25px" }} />

                  {isWrong(i) && selected[i] === "yes" && item.correct !== "yes" && (
                    <span className="absolute -top-2 right-10 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-md">
                      ✕
                    </span>
                  )}
                </button>

                <button
                  onClick={() => choose(i, "no")}
                  className={`w-10 h-10 flex items-center justify-center border rounded text-lg ${
                    selected[i] === "no"
                      ? "border-2 border-blue-800 text-white"
                      : ""
                  }`}
                >
                  <img src={falseIcon} style={{ height: "25px" }} />

                  {isWrong(i) && selected[i] === "no" && item.correct !== "no" && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-md">
                      ✕
                    </span>
                  )}
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

export default Unit8_Page5_Q1;

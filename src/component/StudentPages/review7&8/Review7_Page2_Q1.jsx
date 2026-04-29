import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 71/Ex C 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 71/Ex C 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 71/Ex C 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 71/Ex C 4.svg";
import img5 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 71/Ex C 5.svg";
import trueIcon from "../../../assets/imgs/true.svg";
import falseIcon from "../../../assets/imgs/false.svg";
import audio5 from "../../../assets/audio/ClassBook/U 8/cd49pg71-instruction1-adult-lady_ejSLDj8H.mp3";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
const Review7_Page2_Q1 = () => {
  const items = [
    { img: img1, correct: "yes" },
    { img: img2, correct: "no" },
    { img: img3, correct: "no" },
    { img: img4, correct: "yes" },
    { img: img5, correct: "yes" },
  ];
  const captions = [
    {
      start: 0.539,
      end: 9.939,
      text: "Page 71. Review 7. Exercise C. Does it have a long O? Listen and write ✓ or X.",
    },
    { start: 11.179, end: 15.319, text: "1: bone. 2: key." },
    { start: 16.34, end: 23.199, text: "3: bike. 4: snow. 5: soap" },
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
    <div className="main-container-component mb-20">
      <div className="div-forall">
        <h5 className="header-title-page8">
          <span style={{ marginRight: "20px" }}>C</span>
          Does it have a <span style={{ color: "#2e3192" }}>long o</span>?
          Listen and write<span style={{ color: "#2e3192" }}> ✓ </span>or
          <span style={{ color: "#2e3192" }}> ✗</span>
        </h5>
        <QuestionAudioPlayer
          src={audio5}
          captions={captions}
          stopAtSecond={9.93}
        />
        {/* GRID */}
        <div className="flex flex-wrap gap-3 w-full justify-between">
          {items.map((item, i) => {
            const isWrong = locked && selected[i] !== item.correct;
            return (
              <div
                key={i}
                className="flex flex-col items-center justify-center mt-4"
              >
                {" "}
                <div className="relative">
                  <div className="flex">
                    {/* number in corner */}
                    <span className="text-lg font-bold">{i + 1}</span>

                    {/* image + audio */}
                    <img
                      src={item.img}
                      className="object-contain"style={{height:"100px",width:"auto"}}
                    />

                    {/* Wrong Icon */}
                    {isWrong && (
                      <div className="absolute top-0 -right-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                        <span className="text-white font-bold">✕</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => choose(i, "yes")}
                    className={`w-10 h-10 border flex items-center justify-center rounded text-lg ${
                      selected[i] === "yes" ? "border-2 border-blue-800 text-white" : "border-red-700 "
                    }`}
                  >
                    <img
                      src={trueIcon}
                      style={{ height: "25px", width: "auto" }}
                    />
                  </button>

                  <button
                    onClick={() => choose(i, "no")}
                    className={`w-10 h-10 border flex items-center justify-center rounded text-lg ${
                      selected[i] === "no" ? "border-2 border-blue-800 text-white" : "border-red-700 "
                    }`}
                  >
                    <img
                      src={falseIcon}
                      style={{ height: "25px", width: "auto" }}
                    />
                  </button>
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

export default Review7_Page2_Q1;

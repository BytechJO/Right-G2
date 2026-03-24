import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/test6.png";
import img2 from "../../../assets/imgs/test6.png";
import img3 from "../../../assets/imgs/test6.png";
import img4 from "../../../assets/imgs/test6.png";

import blue from "../../../assets/audio/ClassBook/U 8/Pg64_1.2_Adult Lady.mp3";
import home from "../../../assets/audio/ClassBook/U 7/Pg58_1.4_Adult Lady.mp3";
import caot from "../../../assets/audio/ClassBook/U 7/Pg59_1.3_Adult Lady.mp3";
import boat from "../../../assets/audio/ClassBook/U 7/Pg58_1.2_Adult Lady.mp3";

const Unit8_Page5_Q1 = () => {
  const items = [
    { img: img1, audio: caot, correct: "no" },
    { img: img2, audio: boat, correct: "no" },
    { img: img3, audio: blue, correct: "yes" },
    { img: img4, audio: home, correct: "yes" },
  ];

  const [selected, setSelected] = useState(Array(items.length).fill(""));
  const [locked, setLocked] = useState(false);

  const playAudio = (src) => {
    const audio = new Audio(src);
    audio.play();
  };

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
          <span className="ex-A" style={{ marginRight: "20px" }}>
            A
          </span>
          <span style={{ marginRight: "20px", color: "#2e3192" }}>1</span>
          Does it have a <span style={{ color: "#2e3192" }}>long u</span>?
          Listen and write<span style={{ color: "#2e3192" }}> ✓ </span>or
          <span style={{ color: "#2e3192" }}> ✗</span>
        </h5>

        {/* GRID */}
        <div className="grid grid-cols-4 gap-3 mt-10">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-center gap-3 relative mt-4"
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

                <button
                  onClick={() => playAudio(item.audio)}
                  className="text-2xl mt-1"
                >
                  🔊
                </button>
              </div>

              {/* answers on right */}
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

export default Unit8_Page5_Q1;

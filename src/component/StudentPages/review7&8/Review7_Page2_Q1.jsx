import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/test6.png";
import img2 from "../../../assets/imgs/test6.png";
import img3 from "../../../assets/imgs/test6.png";
import img4 from "../../../assets/imgs/test6.png";
import img5 from "../../../assets/imgs/test6.png";

import blue from "../../../assets/audio/ClassBook/U 8/Pg64_1.2_Adult Lady.mp3";
import home from "../../../assets/audio/ClassBook/U 7/Pg58_1.4_Adult Lady.mp3";
import caot from "../../../assets/audio/ClassBook/U 7/Pg59_1.3_Adult Lady.mp3";
import boat from "../../../assets/audio/ClassBook/U 7/Pg58_1.2_Adult Lady.mp3";
import audio5 from "../../../assets/audio/ClassBook/U 7/Pg58_1.2_Adult Lady.mp3";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
const Review7_Page2_Q1 = () => {
  const items = [
    { img: img1, audio: caot, correct: "yes" },
    { img: img2, audio: boat, correct: "no" },
    { img: img3, audio: blue, correct: "no" },
    { img: img4, audio: home, correct: "yes" },
    { img: img5, audio: audio5, correct: "yes" },
  ];
  const captions = [
    {
      start: 0,
      end: 4.23,
      text: "Page 8. Right Activities. Exercise A, number 1.",
    },
    { start: 4.25, end: 8.28, text: "Listen and write the missing letters." },
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
    <div className="main-container-component">
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
          stopAtSecond={4}
        />
        {/* GRID */}
        <div className="grid grid-cols-3 gap-3">
          {items.map((item, i) => {
            const isWrong = locked && selected[i] !== item.correct;
            return (
              <div
                key={i}
                className="flex flex-col items-center justify-center mt-4"
              >
                {" "}
                <div className="relative">
                  <div className="flex gap-2 justify-center">
                    {/* number in corner */}
                    <span className="text-lg font-bold">{i + 1}</span>

                    {/* image + audio */}
                    <img
                      src={item.img}
                      className="w-[150px]! h-[150px]! object-contain"
                    />

                    {/* Wrong Icon */}
                    {isWrong && (
                      <div className="absolute top-6 -right-3 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                        <span className="text-white font-bold">✕</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
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

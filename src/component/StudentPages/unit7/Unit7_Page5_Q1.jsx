import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit7_Page5_Q1.css";

import img1 from "../../../assets/imgs/test6.png";
import img2 from "../../../assets/imgs/test6.png";
import img3 from "../../../assets/imgs/test6.png";
import img4 from "../../../assets/imgs/test6.png";
import img5 from "../../../assets/imgs/test6.png";
import img6 from "../../../assets/imgs/test6.png";
import sound1 from "../../../assets/audio/ClassBook/U 7/Pg58_1.3_Adult Lady.mp3";
import snow from "../../../assets/audio/ClassBook/U 7/Pg58_1.3_Adult Lady.mp3";
import home from "../../../assets/audio/ClassBook/U 7/Pg58_1.4_Adult Lady.mp3";
import caot from "../../../assets/audio/ClassBook/U 7/Pg59_1.3_Adult Lady.mp3";
import boat from "../../../assets/audio/ClassBook/U 7/Pg58_1.2_Adult Lady.mp3";
// import window from "../../../assets/audio/ClassBook/U 7/Pg59_1.4_Adult Lady.mp3";
import note from "../../../assets/audio/ClassBook/U 7/Pg59_1.5_Adult Lady.mp3";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";


const Unit7_Page5_Q1 = () => {
  const items = [
    {
      img: img1,
      audio: caot,
      options: ["o_e", "ow", "oa"],
      correct: "ow",
      start: "wind",
      end: "",
    },
    {
      img: img2,
      audio: caot,
      options: ["o_e", "ow", "oa"],
      correct: "oa",
      start: "c",
      end: "t",
    },
    {
      img: img3,
      audio: note,
      options: ["o_e", "ow", "oa"],
      correct: "o_e",
      start: "n",
      end: "te",
    },
    {
      img: img4,
      audio: snow,
      options: ["o_e", "ow", "oa"],
      correct: "ow",
      start: "sn",
      end: "",
    },
    {
      img: img5,
      audio: boat,
      options: ["o_e", "ow", "oa"],
      correct: "oa",
      start: "b",
      end: "t",
    },
    {
      img: img6,
      audio: home,
      options: ["o_e", "ow", "oa"],
      correct: "o_e",
      start: "h",
      end: "me",
    },
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
  const [answers, setAnswers] = useState(Array(items.length).fill(""));
  const [locked, setLocked] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const chooseOption = (i, value) => {
    if (locked) return;

    const newSelected = [...selected];
    newSelected[i] = value;
    setSelected(newSelected);

    const newAnswers = [...answers];

    let middle = value === "o_e" ? "o" : value;

    newAnswers[i] = items[i].start + middle + items[i].end;

    setAnswers(newAnswers);
  };

  const resetAll = () => {
    setSelected(Array(items.length).fill(""));
    setAnswers(Array(items.length).fill(""));
    setLocked(false);
    setShowResult(false);
  };

  const showAnswers = () => {
    setSelected(items.map((i) => i.correct));

    const newAnswers = items.map((i) => {
      const middle = i.correct === "o_e" ? "o" : i.correct;
      return i.start + middle + i.end;
    });

    setAnswers(newAnswers);
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
    setShowResult(true);
  };
  const isWrong = (index) => {
    return showResult && selected[index] !== items[index].correct;
  };
  return (
    <div className="main-container-component">
      <div className="div-forall">
        <h5 className="header-title-page8 mb-5">
          <span className="ex-A mr-4">A</span>
          <span style={{ color: "#2e3192" }}>1</span>
          Listen, circle, and write.
        </h5>
        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={4}
        />
        <div className="flex w-full">
          <div className="grid grid-cols-3 gap-y-10 w-full gap-x-[60px] mt-10 justify-center">
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
                      width: "80px",
                      height: "auto",
                    }}
                  />

                  {/* OPTIONS */}
                  <div className="flex flex-col gap-1.5 text-[18px]">
                    {item.options.map((opt, idx) => (
                      <span
                        key={idx}
                        onClick={() => chooseOption(i, opt)}
                        className={`cursor-pointer px-2 py-0.5 ${
                          selected[i] === opt
                            ? "border-2 border-red-500 rounded-full"
                            : "hover:bg-gray-100 rounded-full"
                        }`}
                      >
                        {opt}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative w-40 mt-2">
                  {/* ❌ */}
                  {isWrong(i) && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-md">
                      ✕
                    </span>
                  )}

                  <div
                    className={`border-b-2 text-[18px] h-10 ${
                      isWrong(i) ? "border-red-500" : "border-[#444]"
                    }`}
                  >
                    {answers[i]}
                  </div>
                </div>
              </div>
            ))}
          </div>
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

export default Unit7_Page5_Q1;

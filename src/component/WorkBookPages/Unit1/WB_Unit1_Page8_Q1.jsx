import React, { useState } from "react";
import "./WB_Unit1_Page8_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex A 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex A 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex A 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex A 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex A 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex A 6.svg";

const data = [
  { img: img1, answer: "l", pattern: "emon" },
  { img: img2, answer: "r", pattern: "at" },
  { img: img3, answer: "r", pattern: "abbit" },
  { img: img4, answer: "r", pattern: "obot" },
  { img: img5, answer: "l", pattern: "amp" },
  { img: img6, answer: "r", pattern: "uler" },
];

const options = ["r", "l"];

const WB_Unit1_Page8_Q1 = () => {
  const [inputs, setInputs] = useState(Array(data.length).fill(""));
  const [wrongInputs, setWrongInputs] = useState(
    Array(data.length).fill(false)
  );
  const [showAnswer, setShowAnswer] = useState(false);

  const handleChange = (value, index) => {
    if (showAnswer) return;

    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);

    setWrongInputs(Array(data.length).fill(false));
  };

  const checkAnswers = () => {
    if (showAnswer) return;

    if (inputs.some((val) => val === "")) {
      ValidationAlert.info(
        "Oops!",
        "Please fill in all the answers before checking."
      );
      return;
    }

    let correctCount = 0;
    const wrongFlags = [];

    data.forEach((item, index) => {
      if (inputs[index] === item.answer) {
        correctCount++;
        wrongFlags[index] = false;
      } else {
        wrongFlags[index] = true;
      }
    });

    setWrongInputs(wrongFlags);
    setShowAnswer(true);

    const total = data.length;
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size: 20px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  const handleShowAnswer = () => {
    const correct = data.map((item) => item.answer);
    setInputs(correct);
    setWrongInputs(Array(data.length).fill(false));
    setShowAnswer(true);
  };

  const reset = () => {
    setInputs(Array(data.length).fill(""));
    setWrongInputs(Array(data.length).fill(false));
    setShowAnswer(false);
  };

  return (
       <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
        }}
      >
        <div
          className="div-forall"
           style={{gap:"80px"}}
        >
      <h3 className="WB-header-title-page8">
        <span className="WB-ex-A">A</span> Look and write the missing letters.
      </h3>

      <div className="unscramble-row-wb-unit1-p8-q1">
       {data.map((item, index) => (
  <div className="unscramble-box" key={index}>
    <div className="WB-unit1-p8-q1-middle-section"> 
    {/* الصف العلوي */}
    <div className="input-row-wb-unit1-p8-q1">
      <span className="num">{index + 1}</span>

      {/* ⭐ input */}
      <div className="input-wrapper-wb-unit1-page8-q1">
        <div className="WB-unit1-p8-q1-input">
          {inputs[index]}
        </div>

        {wrongInputs[index] && (
          <div className="error-icon-wb-unit1-p8-q1">✕</div>
        )}
      </div>
        <span className="WB-unit1-p8-q1-pattern">{item.pattern}</span>
    </div>

    {/* الكلمة + الصورة */}
   
    

      <div className="img-box-wb-unit1-p8-q1">
        <img src={item.img} alt="" />
      </div>
    </div>

    {/* ⭐ الخيارات تحت */}
    <div className="WB-unit1-p8-q1-choices">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => handleChange(opt, index)}
          disabled={showAnswer}
          className={`WB-unit1-p8-q1-choice-btn ${
            inputs[index] === opt ? "selected" : ""
          }`}
        >
          {opt}
        </button>
      ))}
    </div>

  </div>
))}
      </div>

      <div className="action-buttons-container">
        <button onClick={reset} className="try-again-button">
          Start Again ↻
        </button>

        <button onClick={handleShowAnswer} className="show-answer-btn">
          Show Answer
        </button>

        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div></div>
  );
};

export default WB_Unit1_Page8_Q1;
import React, { useState } from "react";
import "./Review6_Page1_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/test6.png";
import img2 from "../../../assets/imgs/test6.png";
import img3 from "../../../assets/imgs/test6.png";
import img4 from "../../../assets/imgs/test6.png";

export default function Review6_Page1_Q1() {
  const questions = [
    { text: "I eat breakfast every morning.", answer: 4 },
    { text: "I brush my teeth every morning.", answer: 3 },
    { text: "I get dressed every morning.", answer: 2 },
    { text: "I get out of bed every morning.", answer: 1 },
  ];

  const images = [
    { id: 1, src: img1 },
    { id: 2, src: img2 },
    { id: 3, src: img3 },
    { id: 4, src: img4 },
  ];

  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [locked, setLocked] = useState(false);

  const handleChange = (index, value) => {
    if (locked) return;

    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const reset = () => {
    setAnswers(["", "", "", ""]);
    setLocked(false);
  };

  const handleShowAnswers = () => {
    setAnswers(questions.map((q) => q.answer));
    setLocked(true);
  };

  const checkAnswers = () => {
    if (locked) return;

    if (answers.some((a) => a === "")) {
      ValidationAlert.info("Please complete all answers");
      return;
    }

    let score = 0;

    answers.forEach((a, i) => {
      if (Number(a) === questions[i].answer) score++;
    });

    const total = questions.length;

    const message = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:#2e7d32;font-weight:bold;">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) ValidationAlert.success(message);
    else if (score === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);

    setLocked(true);
  };

  return (
    <div className="flex justify-center p-8">
      <div className="w-[60%]">
        <h5 className="header-title-page8 mb-5">
          <span className=" mr-4">A</span>
          Look, read, and number.
        </h5>

        <div className="grid grid-cols-2 gap-y-5 gap-x-[60px]">
          {images.map((img) => (
            <div className="relative border-2 border-[#e53935] rounded-[14px] p-2.5 w-[85%] ">
              <span className="absolute -left-5 -top-2.5 font-bold text-[18px]">
                {img.id}
              </span>

              <img
                src={img.src}
                alt=""
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-y-5 gap-x-[60px] mt-5">
          {questions.map((q, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <input
                type="number"
                min="1"
                max="4"
                value={answers[i]}
                disabled={locked}
                onChange={(e) => handleChange(i, e.target.value)}
                className="w-[35px] h-[35px] text-center text-[18px] rounded-lg border-2 border-[#555] outline-none"
              />

              <span>{q.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="action-buttons-container">
        <button className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>

        <button
          className="show-answer-btn swal-continue"
          onClick={handleShowAnswers}
        >
          Show Answer
        </button>

        <button className="check-button2" onClick={checkAnswers}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
}

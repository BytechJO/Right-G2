import React, { useState } from "react";
import "./Review6_Page1_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 54/Ex A 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 54/Ex A 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 54/Ex A 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 54/Ex A 4.svg";

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
  const [showResult, setShowResult] = useState(false);
  const handleChange = (index, value) => {
    if (locked) return;

    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const reset = () => {
    setAnswers(["", "", "", ""]);
    setLocked(false);
    setShowResult(false); // 🔥 هذا الناقص
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
    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const message = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
        Score: ${score} / ${total}
        </span>
      </div>
    `;
    if (score === total) ValidationAlert.success(message);
    else if (score === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);

    setLocked(true);
    setShowResult(true); // 🔥 هذا المهم
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{gap:"25px"}}>
        <h5 className="header-title-page8 mb-5">
          <span className=" mr-4">A</span>
          Look, read, and number.
        </h5>
     
     <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-y-5 gap-x-[60px]">
          {images.map((img) => (
            <div className="relative rounded-[14px] p-2.5 w-[85%] ">
              <span className="absolute -left-5 font-bold text-[18px]">
                {img.id}
              </span>

              <img
                src={img.src}
                alt=""
                style={{
                  width: "80%",
                  height: "auto",
                }}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-y-5 gap-x-[60px] mt-5">
          {questions.map((q, i) => {
            const isWrong =
              showResult &&
              answers[i] !== "" &&
              Number(answers[i]) !== q.answer;

            const isCorrect = showResult && Number(answers[i]) === q.answer;
            return (
              <div key={i} className="flex items-center gap-2.5">
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="4"
                    value={answers[i]}
                    disabled={locked}
                    onChange={(e) => handleChange(i, e.target.value)}
                    className={`w-[40px] h-[40px] text-center mr-2 text-[20px] rounded-lg border-2 outline-none
        ${
          showResult
            ? isCorrect
              ? "border-[#555]"
              : isWrong
                ? "border-red-500"
                : "border-[#555]"
            : "border-[#555]"
        }`}
                  />

                  {/* ❌ X */}
                  {isWrong && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md border-2 border-white">
                      ✕
                    </div>
                  )}
                  <span className="text-lg">{q.text}</span>
                </div>
              </div>
            );
          })}
        </div>
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

import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import img from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 51/Ex D 1.svg";

/* =========================
   Main Component
========================= */

const Unit6_Page6_Q1 = () => {
  const questions = [
    "I brush my teeth at six thirty.",
    "I wash my face at seven o’clock.",
    "I comb my hair at seven thirty.",
    "I eat my breakfast at eight o’clock.",
    "I go to school at eight thirty.",
  ];

  const correct = [
    { h: 6, m: 30, p: "am" },
    { h: 7, m: 0o0, p: "am" },
    { h: 7, m: 30, p: "am" },
    { h: 8, m: 0o0, p: "am" },
    { h: 8, m: 30, p: "am" },
  ];

  const [answers, setAnswers] = useState(
    questions.map(() => ({ h: 0, m: "00", p: "am" })),
  );

  const [locked, setLocked] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleChange = (i, field, value) => {
    if (locked || showResult) return;

    const updated = [...answers];
    updated[i][field] = value;
    setAnswers(updated);
  };

  const checkAnswers = () => {
    if (locked || showResult) return;

    if (answers.some((a) => !a.h)) {
      ValidationAlert.info("Please complete all answers.");
      return;
    }

    let correctCount = 0;

    answers.forEach((a, i) => {
      if (
        Number(a.h) === correct[i].h &&
        Number(a.m) === correct[i].m &&
        a.p === correct[i].p
      ) {
        correctCount++;
      }
    });

    const total = correct.length;

    let color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const message = `
    <div style="font-size:20px;text-align:center;">
      <span style="color:${color};font-weight:bold;">
        Score: ${correctCount} / ${total}
      </span>
    </div>
  `;

    if (correctCount === total) {
      ValidationAlert.success(message);
    } else if (correctCount === 0) {
      ValidationAlert.error(message);
    } else {
      ValidationAlert.warning(message);
    }

    setLocked(true);
    setShowResult(true);
  };

  const showAnswers = () => {
    setAnswers(correct);
    setLocked(true);
    setShowResult(true);
  };

  const reset = () => {
    setAnswers(questions.map(() => ({ h: 0, m: "00", p: "am" })));
    setLocked(false);
    setShowResult(false);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall">
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">F</span> Read and draw.
        </h1>

        <div
          className="flex w-full"
          style={{ justifyContent: "space-between" }}
        >
          <img src={img} style={{ height: "400px", width: "auto" }} />
          <div className="grid grid-cols-2 gap-y-5">
            {questions.map((q, i) => {
              const isWrong =
                showResult &&
                (Number(answers[i].h) !== correct[i].h ||
                  Number(answers[i].m) !== correct[i].m ||
                  answers[i].p !== correct[i].p);

              const isCorrect =
                showResult &&
                Number(answers[i].h) === correct[i].h &&
                Number(answers[i].m) === correct[i].m &&
                answers[i].p === correct[i].p;
              return (
                <div key={i} className="flex flex-col gap-2.5">
                  <div className="text-[18px]">
                    <span className=" font-bold mr-1.5">{i + 1}</span>
                    {q}
                  </div>

                  <div className="flex items-center gap-5">
                    {/* Time Box */}
                    <div className="relative">
                      <div
                        className={`flex items-center justify-center gap-2.5 border-2 rounded-[14px] w-[200px] h-20 bg-[#f4f4f4]
    ${
      showResult
        ? isCorrect
          ? "border-[#e7a98e]"
          : isWrong
            ? "border-red-500"
            : "border-gray-300"
        : "border-[#e7a98e]"
    }`}
                      >
                        <input
                          type="number"
                          value={answers[i].h}
                          min="1"
                          max="12"
                          step="1"
                          onChange={(e) =>
                            handleChange(i, "h", Number(e.target.value))
                          }
                          className="w-[45px] border-none bg-transparent text-[26px] text-center outline-none"
                        />
                        {isWrong && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md border-2 border-white">
                            ✕
                          </div>
                        )}
                        <span className="text-[26px] text-[#c33]">:</span>

                        <input
                          type="number"
                          value={answers[i].m}
                          min="0"
                          max="59"
                          step="1"
                          onChange={(e) =>
                            handleChange(i, "m", Number(e.target.value))
                          }
                          className="w-[45px] border-none bg-transparent text-[26px] text-center outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="action-buttons-container">
          <button className="try-again-button" onClick={reset}>
            Start Again ↻
          </button>

          <button onClick={showAnswers} className="show-answer-btn">
            Show Answer
          </button>

          <button className="check-button2" onClick={checkAnswers}>
            Check Answer ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unit6_Page6_Q1;

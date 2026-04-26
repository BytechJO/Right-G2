
import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit7_Page6_Q2.css";

const Unit7_Page6_Q2 = () => {
  const questions = [
    "It’s a quarter to eight in the morning.",
    "It’s half past two in the afternoon.",
    "It’s half past five in the afternoon.",
    "It’s a quarter past seven at night.",
    "It’s a quarter past three in the morning.",
    "It’s a quarter to eleven at night.",
  ];

  const correct = [
    { h: "7", m: "45", p: "am" },
    { h: "2", m: "30", p: "pm" },
    { h: "5", m: "30", p: "pm" },
    { h: "7", m: "15", p: "pm" },
    { h: "3", m: "15", p: "am" },
    { h: "10", m: "45", p: "pm" },
  ];

  const [answers, setAnswers] = useState(
    questions.map(() => ({ h: 0, m: "00", p: "" }))
  );

  const [locked, setLocked] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleChange = (i, field, value) => {
    if (locked) return;

    const updated = [...answers];
    updated[i][field] = value;
    setAnswers(updated);
  };

  const checkAnswers = () => {
    if (locked || showResult) return;

    if (answers.some((a) => !a.h || !a.m || !a.p)) {
      ValidationAlert.info("Please complete all answers.");
      return;
    }

    let correctCount = 0;

    answers.forEach((a, i) => {
      if (
        a.h === correct[i].h &&
        a.m === correct[i].m &&
        a.p === correct[i].p
      ) {
        correctCount++;
      }
    });

    const total = correct.length;

    let color =
      correctCount === total
        ? "green"
        : correctCount === 0
        ? "red"
        : "orange";

    const message = `
      <div style="font-size:20px;text-align:center;">
        <b style="color:${color};">Score: ${correctCount} / ${total}</b>
      </div>
    `;

    if (correctCount === total) ValidationAlert.success(message);
    else if (correctCount === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);

    setLocked(true);
    setShowResult(true);
  };

  const showAnswers = () => {
    setAnswers(correct);
    setLocked(true);
    setShowResult(true);
  };

  const reset = () => {
    setAnswers(questions.map(() => ({ h: 0, m: "00", p: "" })));
    setLocked(false);
    setShowResult(false);
  };

  // ✅ check wrong
  const isWrong = (i) => {
    if (!showResult) return false;

    return (
      answers[i].h !== correct[i].h ||
      answers[i].m !== correct[i].m ||
      answers[i].p !== correct[i].p
    );
  };

  return (
    <div className="main-container-component">
      <div className="div-forall">
        <h5 className="header-title-page8">
          <span className="ex-A">E</span> Read, write, and check <span className="text-blue-900">✓</span>.
        </h5>

        <div className="grid grid-cols-2 gap-y-10 gap-x-[60px] mt-5">
          {questions.map((q, i) => (
            <div key={i} className="flex flex-col gap-2.5">
              <div className="text-[18px]">
                <span className="font-bold mr-1.5">{i + 1}</span>
                {q}
              </div>

              <div className="flex items-center gap-5">
                {/* TIME BOX */}
                <div className="relative">
                  {/* ❌ */}
                  {isWrong(i) && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-md">
                      ✕
                    </span>
                  )}

                  <div
                    className={`flex items-center justify-center gap-2.5 border-4 rounded-[14px] w-[200px] h-20 bg-[#f4f4f4]
                      ${
                        isWrong(i)
                          ? "border-red-500"
                          : "border-[#e7a98e]"
                      }
                    `}
                  >
                    <input
                      type="number"
                      value={answers[i].h}
                      min="1"
                      max="12"
                      step="1"
                      onChange={(e) =>
                        handleChange(i, "h", e.target.value)
                      }
                      className="w-[45px] border-none bg-transparent text-[26px] text-center outline-none"
                    />

                    <span className="text-[26px] text-[#c33]">:</span>

                    <input
                      type="number"
                      value={answers[i].m}
                      min="0"
                      max="59"
                      step="1"
                      onChange={(e) =>
                        handleChange(i, "m", e.target.value)
                      }
                      className="w-[45px] border-none bg-transparent text-[26px] text-center outline-none"
                    />
                  </div>
                </div>

                {/* AM / PM */}
                <div className="bg-[#d82525] rounded-[22px] p-2 w-[120px] h-20 flex flex-col justify-between">
                  <div
                    onClick={() => handleChange(i, "p", "am")}
                    className={`flex justify-between items-center h-7 px-2.5 py-1 rounded-lg text-white text-[18px] cursor-pointer transition-all
                      ${
                        answers[i].p === "am"
                          ? "text-[#d82525] font-bold bg-white/40"
                          : "bg-white/20 hover:bg-white/40"
                      }
                    `}
                  >
                    a.m.
                    <span
                      className={`text-green-700 ${
                        answers[i].p === "am"
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    >
                      ✓
                    </span>
                  </div>

                  <div
                    onClick={() => handleChange(i, "p", "pm")}
                    className={`flex justify-between items-center h-7 px-2.5 py-1 rounded-lg text-white text-[18px] cursor-pointer transition-all
                      ${
                        answers[i].p === "pm"
                          ? "text-[#d82525] font-bold bg-white/40"
                          : "bg-white/20 hover:bg-white/40"
                      }
                    `}
                  >
                    p.m.
                    <span
                      className={`text-green-700 ${
                        answers[i].p === "pm"
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    >
                      ✓
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BUTTONS */}
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

export default Unit7_Page6_Q2;


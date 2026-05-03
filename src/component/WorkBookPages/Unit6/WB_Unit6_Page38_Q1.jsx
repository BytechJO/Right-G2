import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 38/Ex A 1.svg";

const WB_Unit6_Page38_Q1 = () => {
  const [answers, setAnswers] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
  });

  const [showValidation, setShowValidation] = useState(false);

  const correctAnswers = {
    1: "kite",
    2: "night",
    3: "bike",
    4: "five",
    5: "tight",
    6: "light",
  };

  const wordBank = [
    { id: 1, word: "bike" },
    { id: 2, word: "five" },
    { id: 3, word: "kite" },
    { id: 4, word: "light" },
    { id: 5, word: "night" },
    { id: 6, word: "tight" },
  ];

  const handleDragStart = (e, word) => {
    e.dataTransfer.setData("text/plain", word);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, questionNumber) => {
    e.preventDefault();
    const droppedWord = e.dataTransfer.getData("text/plain");

    // 🔒 منع استخدام نفس الكلمة أكثر من مرة
    if (Object.values(answers).includes(droppedWord)) return;

    setAnswers({
      ...answers,
      [questionNumber]: droppedWord,
    });
  };

  const checkAnswers = () => {
    if (showValidation) return;
    const allFilled = Object.values(answers).every((ans) => ans !== "");
    if (!allFilled) {
      ValidationAlert.info("Please complete all answers before checking.");
      return;
    }

    let correctCount = 0;

    for (let i = 1; i <= 6; i++) {
      if (answers[i] === correctAnswers[i]) {
        correctCount++;
      }
    }

    setShowValidation(true);

    if (correctCount === 6) {
      ValidationAlert.success(`Score: ${correctCount}/6`);
    } else if (correctCount === 0) {
      ValidationAlert.error(`Score: ${correctCount}/6`);
    } else {
      ValidationAlert.warning(`Score: ${correctCount}/6`);
    }
  };

  const handleShowAnswer = () => {
    setAnswers(correctAnswers);
    setShowValidation(true);
  };

  const handleStartAgain = () => {
    setAnswers({
      1: "",
      2: "",
      3: "",
      4: "",
      5: "",
      6: "",
    });
    setShowValidation(false);
  };

  const isWrongAnswer = (num) => {
    if (!showValidation) return false;
    if (!answers[num]) return false;
    return answers[num] !== correctAnswers[num];
  };

  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"25px"}}>
        {" "}
        <h1 className="WB-header-title-page8">
          {" "}
          <span className="WB-ex-A">A</span>Look, read, and write. Use the words
          from the box.{" "}
        </h1>

        <div>
        {/* WORD BANK */}
        <div className="mb-6 flex items-center justify-center">
          <div className="flex flex-wrap gap-10 p-3 rounded-lg">
            {wordBank.map((item) => {
              const isUsed = Object.values(answers).includes(item.word);

              return (
                <div
                  key={item.id}
                  draggable={!isUsed}
                  onDragStart={(e) => {
                    if (!isUsed) handleDragStart(e, item.word);
                  }}
                  className={`WB-word-bank 
                ${
                  isUsed
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                    : "border-2 border-blue-900 cursor-move hover:bg-blue-100"
                }`}
                  style={{padding:"9px 22px"}}
                >
                  {item.word}
                </div>
              );
            })}
          </div>
        </div>
        {/* QUESTIONS */}
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <img
              src={img}
              alt="Exercise"
              className="object-contain"
              style={{ height: "300px", width: "auto" }}
            />
          </div>

          <div className="md:w-1/2">
            <div className="space-y-2">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div
                  key={num}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, num)}
                  className={`relative flex items-center gap-3 p-1 border-b-2 transition-colors active:bg-blue-50 ${
                    answers[num]
                      ? "border-blue-300"
                      : "border-dashed border-gray-300 bg-white"
                  }  ${isWrongAnswer(num) && "border-red-500"}`}
                >
                  <span className="text-xl text-blue-900 font-semibold w-8">{num}.</span>

                  <div className="flex-1 min-h-[45px] flex items-center">
                    {answers[num] ? (
                      <span className="text-lg font-medium text-blue-700">
                        {answers[num]}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Drop word here
                      </span>
                    )}
                  </div>

                  {isWrongAnswer(num) && (
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shadow-md z-10 border-2 border-white">
                      <span className="text-white text-sm font-bold leading-none">
                        ✕
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div></div>
        <Button
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={handleStartAgain}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
};

export default WB_Unit6_Page38_Q1;

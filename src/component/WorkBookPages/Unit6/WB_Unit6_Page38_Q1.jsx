import React, { useState } from "react";
import img from "../../../assets/imgs/test6.png";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../button";

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
  const [score, setScore] = useState({ correct: 0, total: 6 });
  const [draggedWord, setDraggedWord] = useState(null);

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

  const [wordBankState, setWordBankState] = useState(wordBank);

  const handleDragStart = (e, word) => {
    setDraggedWord(word);
    e.dataTransfer.setData("text/plain", word);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, questionNumber) => {
    e.preventDefault();
    const droppedWord = e.dataTransfer.getData("text/plain");

    setAnswers({
      ...answers,
      [questionNumber]: droppedWord,
    });

    setWordBankState((prev) =>
      prev.filter((item) => item.word !== droppedWord),
    );
  };

  const checkAnswers = () => {
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

    setScore({ correct: correctCount, total: 6 });
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
    setWordBankState([]);
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
    setWordBankState(wordBank);
    setShowValidation(false);
  };

  const isWrongAnswer = (num) => {
    if (!showValidation) return false;
    if (!answers[num]) return false;
    return answers[num] !== correctAnswers[num];
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "20px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">A</span>Look, read, and write. Use the words
          from the box.
        </h1>

        <div className="mb-6 border-2 border-dashed flex items-center justify-center border-blue-400">
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
            {wordBankState.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.word)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-move hover:bg-blue-600 transition-colors shadow-sm"
              >
                {item.word}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <img
              src={img}
              alt="Exercise"
              className="w-full rounded-lg shadow-md max-w-95 max-h-85"
            />
          </div>

          <div className="md:w-1/2">
            <div className="space-y-2">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div
                  key={num}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, num)}
                  className={`relative flex items-center gap-3 p-1 border-2 rounded-lg transition-colors ${
                    answers[num]
                      ? "border-blue-300 bg-blue-50"
                      : "border-dashed border-gray-300 bg-white"
                  }`}
                >
                  <span className="text-lg font-semibold w-8">{num}.</span>

                  <div className="flex-1 min-h-[50px] flex items-center">
                    {answers[num] ? (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-lg font-medium text-blue-700">
                          {answers[num]}
                        </span>
                      </div>
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
        </div>

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
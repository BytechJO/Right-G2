import React, { useState } from "react";
import img from "../../../assets/imgs/test6.png";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 39/Ex A 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 39/Ex A 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 39/Ex A 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 39/Ex A 4.svg";

const exerciseDataK = {
  questions: [
    { id: "k1", text: "It's a quarter to nine.", correctNumber: 2 },
    {
      id: "k2",
      text: "It's a quarter past two in the afternoon.",
      correctNumber: 3,
    },
    { id: "k3", text: "It's six o'clock in the morning.", correctNumber: 1 },
    { id: "k4", text: "It's half past ten in the morning.", correctNumber: 4 },
  ],
};
const images = [img1, img2, img3, img4];
export default function WB_Unit7_Page39_Q1() {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleSelectNumber = (questionId, number) => {
    if (showResults) return;
    setAnswers((prev) => ({ ...prev, [questionId]: number }));
  };

  const checkAnswers = () => {
    if (showResults) return;
    const unanswered = exerciseDataK.questions.filter((q) => !answers[q.id]);

    if (unanswered.length > 0) {
      ValidationAlert.info();
      return;
    }

    setShowResults(true);
    let score = 0;
    let total = exerciseDataK.questions.length;

    exerciseDataK.questions.forEach((question) => {
      if (answers[question.id] === question.correctNumber) {
        score++;
      }
    });

    if (score === total) {
      ValidationAlert.success(`Score: ${score} / ${total}`);
    } else if (score > 0) {
      ValidationAlert.warning(`Score: ${score} / ${total}`);
    } else {
      ValidationAlert.error(`Score: ${score} / ${total}`);
    }
  };

  const handleStartAgain = () => {
    setAnswers({});
    setShowResults(false);
  };

  const getSelectClass = (questionId) => {
    if (!showResults) {
      return "cursor-pointer border-b-1 border-black px-3 py-2 font-semibold";
    }

    const question = exerciseDataK.questions.find((q) => q.id === questionId);
    const isCorrect =
      answers[questionId] === (question && question.correctNumber);

    if (!isCorrect) {
      return "border-2 border-red-500 bg-white px-3 py-2 rounded-lg font-semibold";
    }
    return "border-2 border-gray-500 bg-white px-3 py-2 rounded-lg font-semibold";
  };

  const handleShowAnswer = () => {
    const correctAnswers = {};

    exerciseDataK.questions.forEach((question) => {
      correctAnswers[question.id] = question.correctNumber;
    });

    setAnswers(correctAnswers);
    setShowResults(true);
  };

  const isWrongAnswer = (questionId) => {
    if (!showResults) return false;
    if (!answers[questionId]) return false;

    const question = exerciseDataK.questions.find((q) => q.id === questionId);

    return answers[questionId] !== question.correctNumber;
  };
  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"35px"}}>
        <h1 className="WB-header-title-page8">
          {" "}
          <span className="WB-ex-A">A</span>Look and read. Write the number.
        </h1>
    <div className="flex flex-col">
        {/* Images */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex flex-col items-center">
              <div className="w-40 h-40 flex items-center justify-center mb-2">
                <img
                  src={images[num - 1]}
                  alt={`Clock ${num}`}
                  className="max-w-45 max-h-45 object-contain"
                />
              </div>
              <span className="font-bold text-lg text-gray-700">{num}</span>
            </div>
          ))}
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {exerciseDataK.questions.map((question, idx) => (
            <div key={question.id} className="flex items-center gap-4">
              <span className="font-bold text-xl text-black">
                {String.fromCharCode(97 + idx)}.
              </span>
              <div className="relative">
                <select
                  value={answers[question.id] || ""}
                  onChange={(e) =>
                    handleSelectNumber(question.id, parseInt(e.target.value))
                  }
                  disabled={showResults}
                  className={getSelectClass(question.id)}
                >
                  <option value="">Select a number</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>

                {isWrongAnswer(question.id) && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-md z-10 border-2 border-white">
                    <span className="text-white text-xs font-bold leading-none">
                      ✕
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xl text-gray-900 flex-1">{question.text}</p>
            </div>
          ))}
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
}

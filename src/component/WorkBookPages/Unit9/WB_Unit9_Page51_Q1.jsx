import React, { useState } from "react";
import img from "../../../assets/imgs/test6.png";
import Button from "../button";
import ValidationAlert from "../../Popup/ValidationAlert";

const exerciseQuestions = [
  { id: "q1", text: "Mom is cooking.", img: img, correctAnswer: false }, 
  { id: "q2", text: "Grandpa is listening to the radio.", img: img, correctAnswer: false },
  { id: "q3", text: "They are watching TV.", img: img, correctAnswer: true },
  { id: "q4", text: "She is eating an apple.", img: img, correctAnswer: true },
  { id: "q5", text: "They aren’t studying.", img: img, correctAnswer: true },
  { id: "q6", text: "Helen is working on the computer.", img: img, correctAnswer: true },
  { id: "q7", text: "They aren’t eating corn.", img: img, correctAnswer: false },
];

const WB_Unit9_Page51_Q1 = () => {
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(null);

  const handleSelectAnswer = (questionId, answer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
    if (showResults) {
      setShowResults(false);
      setScore(null);
    }
  };

  const handleShowAnswer = () => {
    const correct = {};
    exerciseQuestions.forEach((q) => {
      correct[q.id] = q.correctAnswer;
    });
    setUserAnswers(correct);
  };

  const handleStartAgain = () => {
    setUserAnswers({});
    setShowResults(false);
    setScore(null);
  };

  const checkAnswers = () => {
    if (Object.keys(userAnswers).length < exerciseQuestions.length) {
      ValidationAlert.warning("Please answer all questions before checking.");
      return;
    }

    setShowResults(true);

    let correctCount = 0;
    exerciseQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    setScore({ correct: correctCount, total: exerciseQuestions.length });

    if (correctCount === exerciseQuestions.length) {
      ValidationAlert.success(
        `Score: ${correctCount}/${exerciseQuestions.length}`,
      );
    } else {
      ValidationAlert.error(
        `Score: ${correctCount}/${exerciseQuestions.length}`,
      );
    }
  };

  const getCheckboxClass = (questionId, option) => {
    const isSelected = userAnswers[questionId] === option;

    if (showResults) {
      const isCorrect =
        exerciseQuestions.find((q) => q.id === questionId).correctAnswer ===
        option;
      if (isCorrect) {
        return "border-green-500 bg-green-100";
      }
      if (isSelected && !isCorrect) {
        return "border-red-500 bg-red-100";
      }
    }

    return isSelected
      ? "border-blue-500 bg-blue-100"
      : "border-gray-300 bg-white";
  };

  return (
    <div className="main-container-component">
      <div className="div-forall">
      

        <div className="flex items-center gap-3 mb-6">
                    <div className="ex-A">A</div>
                    <h1 className="header-title-page8">Look, read, and write ✓ or ✕</h1>
                </div>

        <div className="space-y-4">
          {exerciseQuestions.map((question, index) => (
            <div
              key={question.id}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-x-6 p-3 rounded-lg hover:bg-gray-50"
            >
                
              <img
                src={question.img}
                alt={`Question ${index + 1}`}
                className="max-w-24 max-h-16 object-contain"
              />

              <div className="flex items-center gap-3">
                <span className="font-bold text-blue-600 text-lg">
                  {index + 1}
                </span>
                <p className="text-lg text-gray-800">{question.text}</p>
              </div>

              <div className="flex items-center gap-x-4">
                <div className="flex flex-col items-center">
                  {index === 0 && (
                    <span className="font-semibold text-gray-600 mb-1">
                      ✔
                    </span>
                  )}
                  <div
                    onClick={() => handleSelectAnswer(question.id, true)}
                    className={`w-8 h-8 border-2 rounded-md cursor-pointer flex items-center justify-center transition-all ${getCheckboxClass(question.id, true)}`}
                  >
                    {userAnswers[question.id] === true && (
                      <span className="text-2xl text-blue-600">✔</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  {index === 0 && (
                    <span className="font-semibold text-gray-600 mb-1">
                      ✕
                    </span>
                  )}
                  <div
                    onClick={() => handleSelectAnswer(question.id, false)}
                    className={`w-8 h-8 border-2 rounded-md cursor-pointer flex items-center justify-center transition-all ${getCheckboxClass(question.id, false)}`}
                  >
                    {userAnswers[question.id] === false && (
                      <span className="text-2xl text-blue-600">✕</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleStartAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};

export default WB_Unit9_Page51_Q1;

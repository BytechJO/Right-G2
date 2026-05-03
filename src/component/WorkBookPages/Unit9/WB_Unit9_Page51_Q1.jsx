import React, { useState } from "react";
import img from "../../../assets/imgs/test6.png";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 51/Ex A 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 51/Ex A 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 51/Ex A 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 51/Ex A 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 51/Ex A 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 51/Ex A 6.svg";
import img7 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 51/Ex A 7.svg";
import trueIcon from "../../../assets/imgs/true.svg";
import falseIcon from "../../../assets/imgs/false.svg";
const exerciseQuestions = [
  { id: "q1", text: "Mom is cooking.", img: img1, correctAnswer: false },
  {
    id: "q2",
    text: "Grandpa is listening to the radio.",
    img: img2,
    correctAnswer: false,
  },
  { id: "q3", text: "They are watching TV.", img: img3, correctAnswer: true },
  { id: "q4", text: "She is eating an apple.", img: img4, correctAnswer: true },
  { id: "q5", text: "They aren’t studying.", img: img5, correctAnswer: true },
  {
    id: "q6",
    text: "Helen is working on the computer.",
    img: img6,
    correctAnswer: true,
  },
  {
    id: "q7",
    text: "They aren’t eating corn.",
    img: img7,
    correctAnswer: false,
  },
];

const WB_Unit9_Page51_Q1 = () => {
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(null);

  const handleSelectAnswer = (questionId, answer) => {
    if (showResults) return;
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
    setShowResults(true);
  };

  const handleStartAgain = () => {
    setUserAnswers({});
    setShowResults(false);
    setScore(null);
  };

  const checkAnswers = () => {
    if (showResults) return;
    if (Object.keys(userAnswers).length < exerciseQuestions.length) {
      ValidationAlert.info("Please answer all questions before checking.");
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
    } else if (correctCount === 0) {
      ValidationAlert.error(
        `Score: ${correctCount}/${exerciseQuestions.length}`,
      );
    } else {
      ValidationAlert.warning(
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
      if (isSelected && isCorrect) {
        return "border-blue-900";
      }
      if (isSelected && !isCorrect) {
        return "border-red-500";
      }
    }

    return isSelected
      ? "border-blue-900"
      : "border-gray-300 bg-white hover:border-blue-900";
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{marginBottom: "10px" ,gap:"20px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">A</span>
          Look, read, and write <span className="text-blue-900">✓</span> or{" "}
          <span className="text-blue-900">✕</span>
        </h1>

        <div>
          {exerciseQuestions.map((question, index) => (
            <div
              key={question.id}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-x-6 p-3 rounded-lg hover:bg-gray-50"
            >
              <img
                src={question.img}
                alt={`Question ${index + 1}`}
                className="object-contain"
                style={{ height: "100px", width: "auto" }}
              />

              <div className="flex items-center gap-3">
                <span className="font-bold text-blue-900 text-[22px]">
                  {index + 1}
                </span>
                <p className="text-[20px] text-gray-800">{question.text}</p>
              </div>

              <div className="flex items-center gap-x-4">
                <div className="flex flex-col items-center">
                  {index === 0 && (
                    <span className="font-semibold text-blue-800 mb-1 text-2xl">
                      <img src={trueIcon} style={{ height: "25px" }} />
                    </span>
                  )}

                  <div className="relative">
                    <div
                      onClick={() => handleSelectAnswer(question.id, true)}
                      className={`w-[45px] h-[45px] border-2 rounded-md cursor-pointer flex items-center justify-center transition-all ${getCheckboxClass(
                        question.id,
                        true,
                      )}`}
                    >
                      {userAnswers[question.id] === true && (
                        <span className="text-2xl text-blue-600">
                          {" "}
                          <img src={trueIcon} style={{ height: "25px" }} />
                        </span>
                      )}
                    </div>

                    {/* ❌ */}
                    {showResults &&
                      userAnswers[question.id] === true &&
                      exerciseQuestions.find((q) => q.id === question.id)
                        .correctAnswer !== true && (
                        <span className="absolute -top-2 -right-2 text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold border-2 border-white shadow">
                          ✕
                        </span>
                      )}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  {index === 0 && (
                    <span className="font-semibold text-blue-800 mb-1 text-2xl">
                      <img src={falseIcon} style={{ height: "25px" }} />
                    </span>
                  )}

                  <div className="relative">
                    <div
                      onClick={() => handleSelectAnswer(question.id, false)}
                      className={`w-[45px] h-[45px] border-2 rounded-md cursor-pointer flex items-center justify-center transition-all ${getCheckboxClass(
                        question.id,
                        false,
                      )}`}
                    >
                      {userAnswers[question.id] === false && (
                        <span className="text-2xl text-blue-600">
                          {" "}
                          <img src={falseIcon} style={{ height: "25px" }} />
                        </span>
                      )}
                    </div>

                    {/* ❌ */}
                    {showResults &&
                      userAnswers[question.id] === false &&
                      exerciseQuestions.find((q) => q.id === question.id)
                        .correctAnswer !== false && (
                        <span className="absolute -top-2 -right-2 text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold border-2 border-white shadow">
                          ✕
                        </span>
                      )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
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

import React, { useState } from "react";
import img from "../../../assets/imgs/test6.png";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import trueIcon from "../../../assets/imgs/true.svg";
const exerciseQuestions = [
  {
    id: "q1",
    text: "Dad is listening to the radio.",
    img: img,
    correctAnswer: false,
  },
  {
    id: "q2",
    text: "My brother is playing chess.",
    img: img,
    correctAnswer: false,
  },
  { id: "q3", text: "Mom is cooking dinner.", img: img, correctAnswer: false },
  {
    id: "q4",
    text: "My little sister is looking for her doll.",
    img: img,
    correctAnswer: true,
  },
  { id: "q5", text: "I’m ironing clothes.", img: img, correctAnswer: true },
];

const WB_Unit9_Page52_Q1 = () => {
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
    setShowResults(true);
    setUserAnswers(correct);
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
        return "border-blue-900 ";
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
      <div className="div-forall"  style={{gap:"5px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">C</span>Read and write{" "}
          <span className="text-blue-900">✓</span> for{" "}
          <span className="text-blue-900">true</span> or{" "}
          <span className="text-blue-900">false</span>
        </h1>

        <div className="space-y-0">
          <p class="text-[17px] leading-7 text-gray-800 mt-6 ml-10">
            My mom is listening to the radio in her bedroom. Dad is on the
            computer sending an e-mail. My brother is playing football with his
            friends. My little sister is looking for her doll. I’m ironing
            clothes for my mom.
          </p>

          {exerciseQuestions.map((question, index) => (
            <div
              key={question.id}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-x-6 p-3 rounded-lg hover:bg-gray-50"
            >
              <div></div>

              <div className="flex items-center gap-3">
                <span className="font-bold text-blue-900 text-[20px]">
                  {index + 1}
                </span>
                <p className="text-[20px] text-gray-800">{question.text}</p>
              </div>

              <div className="flex items-center gap-x-4">
                <div className="flex flex-col items-center">
                  {index === 0 && (
                    <span className="font-semibold text-blue-800 mb-1">
                      True
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
                        <span className="absolute -top-2 -right-3 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-white shadow">
                          ✕
                        </span>
                      )}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  {index === 0 && (
                    <span className="font-semibold text-blue-800 mb-1">
                      False
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
                          <img src={trueIcon} style={{ height: "25px" }} />
                        </span>
                      )}
                    </div>

                    {/* ❌ */}
                    {showResults &&
                      userAnswers[question.id] === false &&
                      exerciseQuestions.find((q) => q.id === question.id)
                        .correctAnswer !== false && (
                        <span className="absolute -top-2 -right-3 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-white shadow">
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

export default WB_Unit9_Page52_Q1;

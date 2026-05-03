import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";

import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 41/Ex E 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 41/Ex E 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 41/Ex E 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 41/Ex E 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 41/Asset 49.svg"
const exerciseDataM = {
  questions: [
    { id: "m1", number: 2, correctMonth: "February", image: img1 },
    { id: "m2", number: 7, correctMonth: "July", image: img2 },
    { id: "m3", number: 11, correctMonth: "November", image: img3 },
    { id: "m4", number: 5, correctMonth: "May", image: img4 },
  ],
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};

const WB_Unit7_Page41_Q1 = () => {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleSelectMonth = (questionId, month) => {
    if (showResults) return;
    setAnswers((prev) => ({ ...prev, [questionId]: month }));
  };

  const checkAnswers = () => {
    if (showResults) return;
    const unanswered = exerciseDataM.questions.filter((q) => !answers[q.id]);

    if (unanswered.length > 0) {
      ValidationAlert.info("Please answer all questions.");
      return;
    }

    setShowResults(true);

    let score = 0;
    let total = exerciseDataM.questions.length;

    exerciseDataM.questions.forEach((question) => {
      if (answers[question.id] === question.correctMonth) {
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

  const handleShowAnswer = () => {
    const correctAnswers = {};
    exerciseDataM.questions.forEach((question) => {
      correctAnswers[question.id] = question.correctMonth;
    });
    setAnswers(correctAnswers);
    setShowResults(true);
  };

  const handleStartAgain = () => {
    setAnswers({});
    setShowResults(false);
  };

  const getSelectClass = (questionId) => {
    if (!showResults) {
      return "border-b-2 border-gray-300 px-3 py-2 font-semibold";
    }

    const question = exerciseDataM.questions.find((q) => q.id === questionId);
    const isCorrect = answers[questionId] === question?.correctMonth;

    return isCorrect
      ? "border-b-2 border-gray-500 bg-gray-50 px-3 py-2 font-semibold text-black-800"
      : "border-b-2 border-red-500 bg-gray-50 px-3 py-2 font-semibold text-black-800";
  };

  return (
    <div className="main-container-component mb-10">
      <div className="div-forall"  style={{gap:"35px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">E</span>Look, read, and write.
        </h1>

        <div className="grid grid-cols-2 gap-8 mb-8" style={{justifyItems:"end"}}>
          {/* Questions */}
          <div className="grid grid-cols-2 gap-x-32 gap-y-10" style={{justifyItems:"center"}}>
            {exerciseDataM.questions.map((question, idx) => {
              const isWrong =
                showResults &&
                answers[question.id] &&
                answers[question.id] !== question.correctMonth;

              return (
                <div key={question.id} className="space-y-2">
                  <p className="font-bold text-lg text-gray-700">
                    {idx + 1}. What month is it?
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="w-45 h-45 rounded-lg flex items-center justify-center">
                      <img
                        src={question.image}
                        className="max-w-40 max-h-40 object-cover"
                      />
                    </div>
                  </div>

                  {/* select + ❌ */}
                  <div className="relative flex gap-2">
                    <span className="text-lg font-bold">It's</span>
                    <select
                      value={answers[question.id] || ""}
                      onChange={(e) =>
                        handleSelectMonth(question.id, e.target.value)
                      }
                      disabled={showResults}
                      className={`w-full ${getSelectClass(question.id)}`}
                    >
                      <option value="">Select a month</option>
                      {exerciseDataM.months.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>

                    {isWrong && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-md border-2 border-white">
                        <span className="text-white text-xs font-bold">✕</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

      
            <img src={img5} className="object-contain" style={{height:"550px",width:"auto"}} />
      
        </div>

        <Button
          handleStartAgain={handleStartAgain}
          handleShowAnswer={handleShowAnswer}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
};

export default WB_Unit7_Page41_Q1;

import React, { useState } from "react";

// استيراد الصور ومكونات الأزرار والتنبيهات
import sandwichImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 16/Asset 27.svg";
import drumImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 16/Asset 28.svg";
import swimImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 16/Asset 29.svg";
import chopsticksImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 16/Asset 30.svg";

import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import trueIcon from "../../../assets/imgs/true.svg";
// بيانات التمرين
const questions = [
  {
    id: "q1",
    text: "Can she make sandwiches?",
    img: sandwichImg,
    correctAnswer: true,
  },
  {
    id: "q2",
    text: "Can he play the drum?",
    img: drumImg,
    correctAnswer: false,
  },
  { id: "q3", text: "Can it swim?", img: swimImg, correctAnswer: false },
  {
    id: "q4",
    text: "Can he use chopsticks?",
    img: chopsticksImg,
    correctAnswer: false,
  },
];

const WB_Unit3_Page16_Q2 = () => {
  const [selections, setSelections] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (questionId, choice) => {
    if (showResults) return;

    setSelections((prev) => ({ ...prev, [questionId]: choice }));
    // setShowResults(false);
  };

  const getCheckboxClass = (qId, choice) => {
    const isSelected = selections[qId] === choice;
    if (showResults) {
      const isCorrectAnswer =
        questions.find((q) => q.id === qId).correctAnswer === choice;
    }
    return isSelected
      ? "border-blue-500 bg-blue-100"
      : "border-gray-300 bg-white";
  };

  const handleShowAnswer = () => {
    const correctSels = {};
    questions.forEach((q) => {
      correctSels[q.id] = q.correctAnswer;
    });
    setSelections(correctSels);
    setShowResults(true);
  };

  const handleStartAgain = () => {
    setSelections({});
    setShowResults(false);
  };

  const checkAnswers = () => {
    if (showResults) return;
    const hasEmptyAnswers = questions.some(
      (q) => selections[q.id] === undefined,
    );

    if (hasEmptyAnswers) {
      ValidationAlert.info("Please answer all questions first.");
      return;
    }

    setShowResults(true);

    let score = 0;
    questions.forEach((q) => {
      if (selections[q.id] === q.correctAnswer) {
        score++;
      }
    });

    if (score === questions.length) {
      ValidationAlert.success(`Score: ${score} / ${questions.length}`);
    } else if (score > 0) {
      ValidationAlert.warning(`Score: ${score} / ${questions.length}`);
    } else {
      ValidationAlert.error(`Score: ${score} / ${questions.length}`);
    }
  };

  return (
    <div className="main-container-component">
      <div className="div-forall">
        {" "}
        <h1 className="WB-header-title-page8">
          {" "}
          <span className="WB-ex-A">D</span>Read, look, and write{" "}
          <span style={{ color: "navy" }}>✓</span>.
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
          {questions.map((q, index) => (
            <div key={q.id} className="flex items-start gap-4">
              <span className="font-bold text-blue-800 text-xl">
                {index + 1}
              </span>

              <div className="flex-1">
                <p className="mb-4 text-gray-800 text-[20px]">{q.text}</p>

                {/* image + options */}
                <div className="flex items-start gap-6">
                  <img
                    src={q.img}
                    alt={`Question ${index + 1}`}
                    className="object-contain rounded-lg shadow-sm"
                    style={{ height: "120px", width: "auto" }}
                  />

                  <div className="space-y-4 lg:mt-5">
                    {/* Yes option */}
                    <div
                      onClick={() => handleSelect(q.id, true)}
                      className={`relative flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-all ${getCheckboxClass(q.id, true)}`}
                    >
                      <div className="w-6 h-6 border-2 border-gray-400 rounded flex items-center justify-center">
                        {selections[q.id] === true && (
                          <img src={trueIcon} style={{ height: "25px" }} />
                        )}
                      </div>

                      <span>
                        Yes,{" "}
                        {q.id === "q1" ? "she" : q.id === "q3" ? "it" : "he"}{" "}
                        can.
                        {showResults &&
                          selections[q.id] === true &&
                          selections[q.id] !== q.correctAnswer && (
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold shadow-lg border-2 border-white">
                              ✕
                            </div>
                          )}
                      </span>
                    </div>

                    {/* No option */}
                    <div
                      onClick={() => handleSelect(q.id, false)}
                      className={`relative flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-all ${getCheckboxClass(q.id, false)}`}
                    >
                      <div className="w-6 h-6 border-2 border-gray-400 rounded flex items-center justify-center">
                        {selections[q.id] === false && (
                          <img src={trueIcon} style={{ height: "25px" }} />
                        )}
                      </div>

                      <span>
                        No,{" "}
                        {q.id === "q1" ? "she" : q.id === "q3" ? "it" : "he"}{" "}
                        can't.
                        {showResults &&
                          selections[q.id] === false &&
                          selections[q.id] !== q.correctAnswer && (
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold shadow-lg border-2 border-white">
                              ✕
                            </div>
                          )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center">
        <Button
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={handleStartAgain}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
};

export default WB_Unit3_Page16_Q2;

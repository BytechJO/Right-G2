import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../button";

import boatImg from "../../../assets/imgs/test6.png";
import snowImg from "../../../assets/imgs/test6.png";
import examImg from "../../../assets/imgs/test6.png";
import bowImg from "../../../assets/imgs/test6.png";

const exerciseAData = [
  { id: 1, image: boatImg, options: ["o-e", "oa", "ow"], correct: "oa" },
  { id: 2, image: snowImg, options: ["o-e", "oa", "ow"], correct: "ow" },
  { id: 3, image: examImg, options: ["ow", "oa", "o-e"], correct: "o-e" },
  { id: 4, image: bowImg, options: ["ow", "oa", "o-e"], correct: "ow" },
];

const WB_Unit7_Page44_Q1 = () => {
  const [answersA, setAnswersA] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });
  const [checked, setChecked] = useState(false);
  const [locked, setLocked] = useState(false);

  const handleSelectA = (id, option) => {
    if (locked) return;
    setAnswersA((prev) => ({ ...prev, [id]: option }));
  };

  const checkAnswers = () => {
    let correctA = 0;
    exerciseAData.forEach((item) => {
      if (answersA[item.id] === item.correct) correctA++;
    });

    setChecked(true);
    setLocked(true);

    if (correctA === exerciseAData.length) {
      ValidationAlert.success(
        `Excellent! Score: ${correctA}/${exerciseAData.length}`,
      );
    } else {
      ValidationAlert.error(
        `Keep trying! Score: ${correctA}/${exerciseAData.length}`,
      );
    }
  };

  const handleShowAnswer = () => {
    const correctA = {};
    exerciseAData.forEach((item) => (correctA[item.id] = item.correct));
    setAnswersA(correctA);
    setChecked(true);
    setLocked(true);
  };

  const handleTryAgain = () => {
    setAnswersA({ 1: null, 2: null, 3: null, 4: null });
    setChecked(false);
    setLocked(false);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall">
        <h2 className="WB-header-title-page8">
          <span className="WB-ex-A">A</span>
          Listen and write <span className="text-blue-900">✓</span>.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {exerciseAData.map((item) => (
            <div key={item.id} className="flex items-center gap-10 p-6">
              <img
                src={item.image}
                alt=""
                className="max-w-50 max-h-32 object-contain"
              />

              <div className="flex flex-col gap-3">
                {item.options.map((opt) => {
                  const isSelected = answersA[item.id] === opt;
                  const isWrong =
                    checked &&
                    isSelected &&
                    opt !== item.correct;

                  return (
                    <div key={opt} className="flex items-center gap-4">
                      <span className="w-10 text-right font-bold text-lg text-gray-700">
                        {opt}
                      </span>

                      <div className="relative">
                        <div
                          onClick={() => handleSelectA(item.id, opt)}
                          className={`w-10 h-10 border-2 border-gray-400 rounded-lg flex items-center justify-center cursor-pointer transition-all
                            ${
                              isSelected
                                ? "bg-blue-50 border-blue-500"
                                : "hover:bg-gray-50"
                            }
                          `}
                        >
                          {isSelected && (
                            <span className="text-2xl font-bold text-blue-600">
                              ✓
                            </span>
                          )}

                          
                        </div>

                        {/* ❌ Wrong Icon */}
                        {isWrong && (
                          <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow border-2 border-white">
                            ✕
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleTryAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};

export default WB_Unit7_Page44_Q1;
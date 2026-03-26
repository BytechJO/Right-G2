import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../button";

import img1 from "../../../assets/imgs/test6.png";
import img2 from "../../../assets/imgs/test6.png";
import img3 from "../../../assets/imgs/test6.png";
import img4 from "../../../assets/imgs/test6.png";

const exerciseJData = [
  { id: 1, image: img1, before: "He's", after: "TV.", correct: "watching" },
  { id: 2, image: img2, before: "He's", after: "a book.", correct: "reading" },
  {
    id: 3,
    image: img3,
    before: "She's",
    after: "her bike.",
    correct: "riding",
  },
  {
    id: 4,
    image: img4,
    before: "He's",
    after: "basketball.",
    correct: "playing",
  },
];

const wordBank = ["reading", "watching", "playing", "riding"];

const WB_Unit9_Page55_Q2 = () => {
  const [userAnswers, setUserAnswers] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
  });
  const [draggedWord, setDraggedWord] = useState(null);
  const [checked, setChecked] = useState(false);
  const [locked, setLocked] = useState(false);

  const onDragStart = (word) => {
    if (locked) return;
    setDraggedWord(word);
  };

  const onDrop = (id) => {
    if (locked || !draggedWord) return;
    setUserAnswers((prev) => ({ ...prev, [id]: draggedWord }));
    setDraggedWord(null);
  };

  const checkAnswers = () => {
    let correctCount = 0;
    exerciseJData.forEach((item) => {
      if (userAnswers[item.id] === item.correct) correctCount++;
    });

    setChecked(true);
    setLocked(true);

    if (correctCount === exerciseJData.length) {
      return ValidationAlert.success(
        `Score: ${correctCount}/${exerciseJData.length}`,
      );
    } else if (correctCount > 0) {
      return ValidationAlert.warning(
        `Score: ${correctCount}/${exerciseJData.length}`,
      );
    } else {
      return ValidationAlert.error(
        `Score: ${correctCount}/${exerciseJData.length}`,
      );
    }
  };

  const handleShowAnswer = () => {
    const correctAnswers = {};
    exerciseJData.forEach((item) => (correctAnswers[item.id] = item.correct));
    setUserAnswers(correctAnswers);
    setChecked(true);
    setLocked(true);
  };

  const handleTryAgain = () => {
    setUserAnswers({ 1: "", 2: "", 3: "", 4: "" });
    setChecked(false);
    setLocked(false);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "15px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">J</span>Look and write. Read.
        </h1>

        <div className="mb-12 border-2 border-blue-700 border-dashed rounded-2xl p-4 flex justify-center gap-8 bg-gray-50 shadow-sm">
          {wordBank.map((word) => {
            const isUsed = Object.values(userAnswers).includes(word);

            return (
              <div
                key={word}
                draggable={!locked && !isUsed} // ❌ يمنع السحب إذا مستخدمة
                onDragStart={() => onDragStart(word)}
                className={`px-6 py-2 border border-blue-500 rounded-xl shadow-sm transition-all font-bold text-gray-700 text-sm
        ${isUsed ? "bg-gray-200 opacity-40 cursor-not-allowed" : "bg-white cursor-grab hover:bg-blue-50"}
      `}
              >
                {word}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {exerciseJData.map((item) => (
            <div key={item.id} className="flex flex-col items-center gap-6">
              <div className="flex items-start gap-4 w-full">
                <span className="text-2xl font-bold text-blue-800 w-6">
                  {item.id}
                </span>

                <div className="w-48 h-40 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-lg font-medium text-gray-800 w-full pl-10">
                <span>{item.before}</span>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDrop(item.id)}
                  className={`min-w-[120px] h-10 border-b-2 flex items-center justify-center transition-all px-2
                                    ${!userAnswers[item.id] ? "border-gray-300 border-dashed" : ""}
                                    ${checked && userAnswers[item.id] === item.correct ? "border-blue-500" : ""}
                                    ${checked && userAnswers[item.id] !== item.correct && userAnswers[item.id] !== "" ? "border-red-500" : ""} 
                                `}
                >
                  <span className="font-serif italic font-bold">
                    {userAnswers[item.id]}
                  </span>
                  {checked &&
                    userAnswers[item.id] !== "" &&
                    userAnswers[item.id] !== item.correct && (
                      <span className="text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-s, font-bold border-2 border-white shadow">
                        ✕
                      </span>
                    )}
                </div>
                <span>{item.after}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
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

export default WB_Unit9_Page55_Q2;

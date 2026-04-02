import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 43/Asset 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 43/Asset 1.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 43/Asset 1.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 43/Asset 1.svg";
const exerciseData = [
  {
    id: 1,
    correctAnswer: "February",
    img: img1,
  },
  {
    id: 2,
    correctAnswer: "Tuesday",
    img: img2,
  },
  {
    id: 3,
    correctAnswer: "November",
    img: img3,
  },
  {
    id: 4,
    correctAnswer: "Saturday",
    img: img4,
  },
];

const wordsToDrag = ["February", "Tuesday", "November", "Saturday"];

const WB_Unit7_Page43_Q1 = () => {
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

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (id) => {
    if (locked || !draggedWord) return;
    setUserAnswers((prev) => ({
      ...prev,
      [id]: draggedWord,
    }));
    setDraggedWord(null);
  };

  const checkAnswers = () => {
    const values = Object.values(userAnswers);

    const hasEmpty = values.some((val) => !val || val.trim() === "");
    if (hasEmpty) {
      ValidationAlert.info();
      return;
    }

    let correctCount = 0;

    exerciseData.forEach((item) => {
      if (userAnswers[item.id] === item.correctAnswer) {
        correctCount++;
      }
    });

    setChecked(true);
    setLocked(true);

    const total = exerciseData.length;
    if (correctCount === total) {
      ValidationAlert.success(`Score: ${correctCount} / ${total}`);
    } else if (correctCount === 0) {
      ValidationAlert.error(`Score: ${correctCount} / ${total}`);
    } else {
      ValidationAlert.warning(`Score: ${correctCount} / ${total}`);
    }
  };

  const handleShowAnswer = () => {
    const answers = {};
    exerciseData.forEach((item) => {
      answers[item.id] = item.correctAnswer;
    });
    setUserAnswers(answers);
    setChecked(true);
    setLocked(true);
  };

  const handleTryAgain = () => {
    setUserAnswers({ 1: "", 2: "", 3: "", 4: "" });
    setChecked(false);
    setLocked(false);
    setDraggedWord(null);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall">
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">I</span>Look, read the clue, and write.
        </h1>

        {/* الكلمات */}
        <div className="flex flex-wrap justify-center gap-6 max-w-155 mb-10 p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          {wordsToDrag
            .filter((word) => !Object.values(userAnswers).includes(word))
            .map((word) => (
              <div
                key={word}
                draggable={!locked}
                onDragStart={() => onDragStart(word)}
                className={`px-4 py-2 bg-white border-2 border-blue-400 text-blue-700 font-bold rounded-full cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-all text-xl
                  ${locked ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-50"}
                `}
              >
                {word}
              </div>
            ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-7">
          {exerciseData.map((item) => (
            <div key={item.id} className="flex items-start gap-6 relative">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <img
                    src={item.img}
                    alt="squirrel"
                    className="max-w-50 max-h-50 object-contain mx-auto"
                  />
                </div>

                {/* Drop Area */}
                <div className="relative w-full min-w-[180px]">
                  <div
                    onDragOver={onDragOver}
                    onDrop={() => onDrop(item.id)}
                    className={`h-12 border-b-2 flex items-center justify-center transition-all
                      ${
                        !userAnswers[item.id]
                          ? "border-gray-400 border-dashed"
                          : "border-gray-500"
                      }
                      
                      ${!locked && "hover:bg-blue-50"}
                    `}
                  >
                    <span className="text-2xl font-bold font-serif italic">
                      {userAnswers[item.id]}
                    </span>
                  </div>

                  {/* ❌ Wrong Icon */}
                  {checked &&
                    userAnswers[item.id] &&
                    userAnswers[item.id] !== item.correctAnswer && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow border-2 border-white">
                        ✕
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 flex justify-center">
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

export default WB_Unit7_Page43_Q1;

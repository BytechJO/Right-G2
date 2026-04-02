import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../button";


import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 55/Ex I 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 55/Ex I 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 55/Ex I 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 55/Ex I 4.svg";

const exerciseIData = [
  { id: 1, image: img1, correct: "drawing" },
  { id: 2, image: img2, correct: "reading" },
  { id: 3, image: img3, correct: "writing" },
  { id: 4, image: img4, correct: "painting" },
];

const wordBank = ["reading", "writing", "drawing", "painting"];

const WB_Unit9_Page55_Q1 = () => {
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

    setUserAnswers((prev) => {
      // إذا الكلمة نفسها موجودة بمكان ثاني، نشيلها من هناك
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        if (updated[key] === draggedWord) {
          updated[key] = "";
        }
      });

      // نحط الكلمة بالمكان الجديد
      updated[id] = draggedWord;

      return updated;
    });

    setDraggedWord(null);
  };
  const checkAnswers = () => {
    let correctCount = 0;
    exerciseIData.forEach((item) => {
      if (userAnswers[item.id] === item.correct) correctCount++;
    });

    setChecked(true);
    setLocked(true);

    if (correctCount === exerciseIData.length) {
      ValidationAlert.success(`Score: ${correctCount}/${exerciseIData.length}`);
    } else if (correctCount > 0) {
      ValidationAlert.warning(`Score: ${correctCount}/${exerciseIData.length}`);
    } else {
      ValidationAlert.error(`Score: ${correctCount}/${exerciseIData.length}`);
    }
  };

  const handleShowAnswer = () => {
    const correctAnswers = {};
    exerciseIData.forEach((item) => (correctAnswers[item.id] = item.correct));
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
          <span className="WB-ex-A">I</span>Look and write.
        </h1>

        {/* Word Bank */}
        <div className="mb-12 border-2 border-dashed border-blue-700 rounded-2xl p-4 flex justify-center gap-8 bg-gray-50 shadow-sm">
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

        {/* Grid of Speech Bubbles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {exerciseIData.map((item) => (
            <div key={item.id} className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-4 w-full">
                <span className="text-2xl font-bold text-blue-800 w-6">
                  {item.id}
                </span>

                {/* Speech Bubble */}
                <div className="relative flex-1">
                  <div className="border-2 border-gray-800 rounded-3xl p-4 min-h-[40px] flex items-center gap-2 bg-white shadow-sm">
                    <span className="text-lg font-bold">I'm</span>
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => onDrop(item.id)}
                      className={`flex-1 h-10 border-b-2 flex items-center justify-center font-serif text-lg transition-all
                                            ${!userAnswers[item.id] ? "border-gray-300 border-dashed" : ""}
                                            ${checked && userAnswers[item.id] === item.correct ? "border-blue-500" : ""}
                                            ${checked && userAnswers[item.id] !== item.correct && userAnswers[item.id] !== "" ? "border-red-500" : ""} z-20 `}
                    >
                      {userAnswers[item.id]}
                      {checked &&
                        userAnswers[item.id] !== "" &&
                        userAnswers[item.id] !== item.correct && (
                          <span className="text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-s, font-bold border-2 border-white shadow">
                            ✕
                          </span>
                        )}
                    </div>
                  </div>
                  {/* Bubble Tail */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 border-r-2 border-b-2 border-gray-800 bg-white rotate-45"></div>
                </div>
              </div>

              {/* Image */}
              <div className="w-42 h-40 rounded-2xl overflow-hidden border border-gray-200 shadow-sm mt-4">
                <img
                  src={item.image}
                  alt=""
                  className="max-h-40 max-w-60 object-contain"
                />
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

export default WB_Unit9_Page55_Q1;

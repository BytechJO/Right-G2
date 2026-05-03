import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 43/Asset 55.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 43/Asset 56.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 43/Asset 58.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 43/Asset 57.svg";

const exerciseData = [
  { id: 1, correctAnswer: "February", img: img1 },
  { id: 2, correctAnswer: "Tuesday", img: img2 },
  { id: 3, correctAnswer: "November", img: img3 },
  { id: 4, correctAnswer: "Saturday", img: img4 },
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

    // 🔒 منع التكرار
    if (Object.values(userAnswers).includes(draggedWord)) return;

    setUserAnswers((prev) => ({
      ...prev,
      [id]: draggedWord,
    }));

    setDraggedWord(null);
  };

  const checkAnswers = () => {
    if (checked || locked) return;
    const values = Object.values(userAnswers);

    if (values.some((val) => !val)) {
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
      {" "}
      <div className="div-forall"  style={{gap:"25px"}}>
        {" "}
        <h1 className="WB-header-title-page8">
          {" "}
          <span className="WB-ex-A">I</span>Look, read the clue, and write.{" "}
        </h1>
        <div className="flex flex-col gap-2">
        {/* WORD BANK */}
        <div className="flex flex-wrap justify-center gap-6 w-full mb-2 p-4 rounded-xl">
          {wordsToDrag.map((word) => {
            const isUsed = Object.values(userAnswers).includes(word);

            return (
              <div
                key={word}
                draggable={!isUsed && !locked}
                onDragStart={() => {
                  if (!isUsed) onDragStart(word);
                }}
                className={`WB-word-bank 
              ${
                isUsed
                  ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed opacity-60"
                  : "bg-white border-blue-400 cursor-grab hover:bg-blue-50"
              }
            `}
              style={{padding:"9px 22px"}}
              >
                {word}
              </div>
            );
          })}
        </div>
        {/* QUESTIONS */}
        <div
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-7"
          style={{ gridTemplateColumns: "1fr 1fr" }}
        >
          {exerciseData.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-center gap-6 relative"
            >
              <span className="text-xl font-bold text-blue-800">{item.id}</span>
              <div className="flex items-end">
                <img
                  src={item.img}
                  className="max-w-50 max-h-50 object-contain mb-4"
                  style={{ height: "175px", width: "auto" }}
                />

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
                  ${checked &&
                    userAnswers[item.id] &&
                    userAnswers[item.id] !== item.correctAnswer &&"border-red-500"}
                `}
                  >
                    <span className="text-2xl font-bold italic">
                      {userAnswers[item.id]}
                    </span>
                  </div>

                  {checked &&
                    userAnswers[item.id] &&
                    userAnswers[item.id] !== item.correctAnswer && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow border-2 border-white">
                        ✕
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div></div>
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

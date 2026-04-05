import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";

import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 52/Ex D 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 52/Ex D 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 52/Ex D 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 52/Ex D 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 52/Ex D 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 52/Ex D 6.svg";

const exerciseData = [
  {
    id: 1,
    name: "Tom",
    before: "",
    after: "home.",
    correct: "is walking",
    image: img1,
  },
  {
    id: 2,
    name: "Stella",
    before: "",
    after: ".",
    correct: "is sleeping",
    image: img2,
  },
  {
    id: 3,
    name: "The cat",
    before: "",
    after: ".",
    correct: "is climbing",
    image: img3,
  },
  {
    id: 4,
    name: "Mom",
    before: "",
    after: "TV.",
    correct: "is watching",
    image: img4,
  },
  {
    id: 5,
    name: "John",
    before: "",
    after: ".",
    correct: "is running",
    image: img5,
  },
  {
    id: 6,
    name: "Dad",
    before: "",
    after: "with my uncle.",
    correct: "is playing",
    image: img6,
  },
];

const wordBank = [
  "is watching",
  "is climbing",
  "is walking",
  "is playing",
  "is running",
  "is sleeping",
];

const WB_Unit9_Page52_Q2 = () => {
  const [userAnswers, setUserAnswers] = useState({
    1: "is walking", // مثال محلول كما في الصورة
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
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

  const handleWordClick = (word) => {
    if (locked) return;
    // البحث عن أول فراغ متاح
    const firstEmptyId = Object.keys(userAnswers).find(
      (id) => userAnswers[id] === "" && id !== "1",
    );
    if (firstEmptyId) {
      setUserAnswers((prev) => ({ ...prev, [firstEmptyId]: word }));
    }
  };

  const checkAnswers = () => {
    let correctCount = 0;
    exerciseData.forEach((item) => {
      if (userAnswers[item.id] === item.correct) {
        correctCount++;
      }
    });

    setChecked(true);
    setLocked(true);

    if (correctCount === exerciseData.length) {
      ValidationAlert.success(
        `Excellent! Score: ${correctCount} / ${exerciseData.length}`,
      );
    } else {
      ValidationAlert.error(
        `Keep trying! Score: ${correctCount} / ${exerciseData.length}`,
      );
    }
  };

  const handleShowAnswer = () => {
    const answers = {};
    exerciseData.forEach((item) => {
      answers[item.id] = item.correct;
    });
    setUserAnswers(answers);
    setChecked(true);
    setLocked(true);
  };

  const handleTryAgain = () => {
    setUserAnswers({ 1: "is walking", 2: "", 3: "", 4: "", 5: "", 6: "" });
    setChecked(false);
    setLocked(false);
    setDraggedWord(null);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "20px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">D</span>Look and write.
        </h1>

        <div className="mb-12 border-2 border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-3 divide-x-2 divide-gray-800">
            <div className="p-4 flex flex-col gap-2">
              <div className="flex justify-between text-xl font-medium">
                <span>watch</span> <span>-</span>{" "}
                <span className="text-blue-700">watching</span>
              </div>
              <div className="flex justify-between text-xl font-medium">
                <span>play</span> <span>-</span>{" "}
                <span className="text-blue-700">playing</span>
              </div>
            </div>
            <div className="p-4 flex flex-col gap-2">
              <div className="flex justify-between text-xl font-medium">
                <span>climb</span> <span>-</span>{" "}
                <span className="text-blue-700">climbing</span>
              </div>
              <div className="flex justify-between text-xl font-medium">
                <span>run</span> <span>-</span>{" "}
                <span className="text-blue-700">running</span>
              </div>
            </div>
            <div className="p-4 flex flex-col gap-2">
              <div className="flex justify-between text-xl font-medium">
                <span>walk</span> <span>-</span>{" "}
                <span className="text-blue-700">walking</span>
              </div>
              <div className="flex justify-between text-xl font-medium">
                <span>sleep</span> <span>-</span>{" "}
                <span className="text-blue-700">sleeping</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Word Bank (Draggable) */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          {wordBank.map((word) => {
            const isUsed = Object.values(userAnswers).includes(word);

            return (
              <div
                key={word}
                draggable={!locked && !isUsed}
                onDragStart={() => onDragStart(word)}
                onClick={() => !isUsed && handleWordClick(word)}
                className={`px-6 py-2 bg-white border-2 rounded-lg font-bold text-lg transition-all
        ${
          isUsed
            ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed opacity-60"
            : "border-blue-400 text-blue-700 cursor-grab hover:bg-blue-50"
        }
        ${locked && "opacity-50 cursor-not-allowed"}
      `}
              >
                {word}
              </div>
            );
          })}
        </div>

        {/* Sentences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
          {exerciseData.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <span className="text-2xl font-bold text-blue-800 w-6">
                {item.id}
              </span>

              <div className="flex items-center gap-4 w-full">
                <div className="overflow-hidden shrink-0">
                  <img
                    src={item.image}
                    alt=""
                    className="max-w-[100px] max-h-[100px] object-contain"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xl font-medium text-gray-800 w-full">
                  <span>{item.name}</span>
                  <div
                    onDragOver={onDragOver}
                    onDrop={() => onDrop(item.id)}
                    className={`min-w-[140px] h-10 border-b-2 flex items-center justify-center transition-all px-2
                                        ${!userAnswers[item.id] ? "border-gray-300 border-dashed" : "border-gray-500"}
                                        ${checked && userAnswers[item.id] !== item.correct && userAnswers[item.id] !== "" ? "border-red-500 border-dashed" : ""}
                                        ${!locked && "hover:bg-blue-50"}
                                    `}
                  >
                    <span className="font-bold">{userAnswers[item.id]}</span>
                    {checked &&
                      userAnswers[item.id] !== "" &&
                      userAnswers[item.id] !== item.correct && (
                        <span className="ml-2 text-sm text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-white shadow">
                          ✕
                        </span>
                      )}
                  </div>
                  <span>{item.after}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
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

export default WB_Unit9_Page52_Q2;

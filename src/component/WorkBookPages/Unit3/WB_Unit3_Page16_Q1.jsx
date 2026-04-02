import React, { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  closestCenter,
} from "@dnd-kit/core";

import Button from "../button";
import ValidationAlert from "../../Popup/ValidationAlert";

// بيانات التمرين
const wordBankWords = [
  "drum",
  "kite",
  "sandwich",
  "bench",
  "pond",
  "bike",
  "paint",
];
const correctAnswers = {
  1: "bench",
  2: "sandwich",
  3: "pond",
  4: "drum",
  5: "paint",
  6: "kite",
  7: "bike",
};
const questionNumbers = [1, 2, 3, 4, 5, 6, 7];

const DraggableWord = ({ word, isUsed }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: word,
    data: { word },
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 100,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`px-3 py-1 rounded-md shadow-sm cursor-grab active:cursor-grabbing touch-none transition-opacity ${isUsed ? "opacity-30" : "bg-white"}`}
    >
      {word}
    </div>
  );
};

const DropZone = ({ id, children, isOver }) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`w-full border-b-2 pb-1 transition-colors ${isOver ? "border-blue-400 bg-blue-50" : "border-gray-300"}`}
    >
      {children}
    </div>
  );
};

const WB_Unit3_Page16_Q1 = () => {
  const [placedWords, setPlacedWords] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleDragEnd = (event) => {
    const { over, active } = event;
    if (!over) return;

    const word = active.data.current.word;
    const targetId = over.id;

    // إزالة الكلمة من أي مكان كانت فيه سابقاً
    const newPlaced = { ...placedWords };
    Object.keys(newPlaced).forEach((key) => {
      if (newPlaced[key] === word) delete newPlaced[key];
    });

    // وضع الكلمة في المكان الجديد
    newPlaced[targetId] = word;
    setPlacedWords(newPlaced);
    setShowResults(false);
  };

  const getBorderColor = (qId) => {
    if (!showResults) return "border-gray-300";
    return placedWords[qId] === correctAnswers[qId]
      ? "border-green-500"
      : "border-red-500";
  };

  const handleShowAnswer = () => {
    setPlacedWords(correctAnswers);
    setShowResults(true);
  };

  const handleStartAgain = () => {
    setPlacedWords({});
    setShowResults(false);
  };

  const checkAnswers = () => {
    const hasEmptyInputs = questionNumbers.some((qId) => !placedWords[qId]);

    if (hasEmptyInputs) {
      ValidationAlert.info("Please fill in all answers first.");
      return;
    }

    setShowResults(true);

    let score = 0;
    questionNumbers.forEach((qId) => {
      if (placedWords[qId] === correctAnswers[qId]) {
        score++;
      }
    });

    if (score === questionNumbers.length) {
      ValidationAlert.success(`Score: ${score} / ${questionNumbers.length}`);
    } else if (score > 0) {
      ValidationAlert.warning(`Score: ${score} / ${questionNumbers.length}`);
    } else {
      ValidationAlert.error(`Score: ${score} / ${questionNumbers.length}`);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      <div className="main-container-component">
        <div className="div-forall" style={{ gap: "20px" }}>
          <h1 className="WB-header-title-page8">
            {" "}
            <span className="WB-ex-A">C</span>Look, read, and label the
            pictures. Use the words from the box.
          </h1>

          <div className="flex flex-wrap justify-center gap-3 p-3 mb-6 border border-gray-300 rounded-lg">
            {wordBankWords.map((word) => (
              <DraggableWord
                key={word}
                word={word}
                isUsed={Object.values(placedWords).includes(word)}
              />
            ))}
          </div>

          <img
            src={mainPic}
            alt="Park scene"
            className="max-w-full max-h-100 rounded-lg  mb-6 lg:ml-20"
          />

          <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-lg">
            {questionNumbers.map((qId) => (
              <div key={qId} className="flex items-center gap-3 relative">
                <span className="font-bold text-blue-600">{qId}</span>
                <DropZone id={qId}>
                  <div
                    className={`w-full text-center text-xl font-semibold pb-1 transition-colors ${getBorderColor(qId)}`}
                  >
                    {placedWords[qId] || (
                      <span className="text-transparent">.</span>
                    )}
                  </div>
                </DropZone>
                {showResults &&
                  placedWords[qId] &&
                  placedWords[qId] !== correctAnswers[qId] && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold shadow-lg border-2 border-white">
                      ✕
                    </div>
                  )}
              </div>
            ))}
          </div>

          <div className="mt-20 flex justify-center">
            <Button
              handleShowAnswer={handleShowAnswer}
              handleStartAgain={handleStartAgain}
              checkAnswers={checkAnswers}
            />
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default WB_Unit3_Page16_Q1;

import React, { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  closestCenter,
} from "@dnd-kit/core";

import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import mainPic from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 16/Asset 62.svg";
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

const DraggableWord = ({ word, isUsed, showResults }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: word,
    data: { word },
    disabled: showResults || isUsed, // ✅ هون الحل
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 100,
      }
    : undefined;
  // if (showResults) return;
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`WB-word-bank
  ${
    showResults || isUsed
      ? "opacity-40 cursor-not-allowed"
      : "cursor-grab active:cursor-grabbing bg-white"
  }
`}
    >
      {word}
    </div>
  );
};

const DropZone = ({ id, children, borderColor }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

 
 return (
  <div
    ref={setNodeRef}
    className={`w-full border-b-2 pb-1 transition-all duration-200
      ${borderColor}
      ${isOver ? "bg-blue-100 scale-105 border-blue-500 border-dashed shadow-md" : ""}
    `}
  >
    {children}
  </div>
);

};

const WB_Unit3_Page16_Q1 = () => {
  const [placedWords, setPlacedWords] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleDragEnd = (event) => {
    if (showResults) return;
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
      ? "border-gray-300"
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
    if (showResults) return;
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
        <div className="div-forall"  style={{gap:"25px"}}>
          <h1 className="WB-header-title-page8">
            {" "}
            <span className="WB-ex-A">C</span>Look, read, and label the
            pictures. Use the words from the box.
          </h1>
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap justify-center gap-5 p-3 mb-6 rounded-lg">
            {wordBankWords.map((word) => (
              <DraggableWord
                key={word}
                word={word}
                isUsed={Object.values(placedWords).includes(word)}
                showResults={showResults}
              />
            ))}
          </div>

          <img
            src={mainPic}
            alt="Park scene"
            style={{ height: "250px", width: "auto" }}
          />

          <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-lg">
            {questionNumbers.map((qId) => (
              <div key={qId} className="flex justify-center items-end gap-3 relative">
                <span className="font-bold text-blue-600">{qId}</span>
                <DropZone id={qId} borderColor={getBorderColor(qId)}>
                  <div className="w-full text-center text-xl font-semibold pb-1">
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

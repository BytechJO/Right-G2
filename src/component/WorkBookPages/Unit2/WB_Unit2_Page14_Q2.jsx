import React, { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  closestCenter,
} from "@dnd-kit/core";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import queenImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex B 1.svg";
import foxImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex B 2.svg";
import oxImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex B 3.svg";
import capImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex B 4.svg";
import sockImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex B 5.svg";
import boxImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex B 6.svg";


// بيانات التمرين
const initialWordBank = ["cap", "queen", "ox", "box", "sock", "fox"];
const writeQuestions = [
  { id: "w1", img: queenImg, correctAnswer: "queen" },
  { id: "w2", img: foxImg, correctAnswer: "fox" },
  { id: "w3", img: oxImg, correctAnswer: "ox" },
  { id: "w4", img: capImg, correctAnswer: "cap" },
  { id: "w5", img: sockImg, correctAnswer: "sock" },
  { id: "w6", img: boxImg, correctAnswer: "box" },
];

function DraggableWord({ word }) {
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
      className="text-lg font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded-lg shadow-sm cursor-grab active:cursor-grabbing touch-none"
    >
      {word}
    </div>
  );
}

function DropZone({ id, children, onDrop, className }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });
  const style = {
    backgroundColor: isOver ? "#e0f2fe" : undefined, // تغيير اللون عند التحويم فوق المنطقة
  };

  return (
    <div ref={setNodeRef} style={style} className={className}>
      {children}
    </div>
  );
}

const DragAndDropWrite = () => {
  const [wordBank, setWordBank] = useState(initialWordBank);
  const [placedWords, setPlacedWords] = useState({});
  const [showResults, setShowResults] = useState(false);
  const handleDragEnd = (event) => {
    const { over, active } = event;
    const word = active.data.current.word;

    if (over) {
      const dropZoneId = over.id;
      setWordBank((prev) => prev.filter((w) => w !== word));
      setPlacedWords((prev) => {
        const newPlaced = { ...prev };
        Object.keys(newPlaced).forEach((key) => {
          if (newPlaced[key] === word) {
            delete newPlaced[key];
          }
        });
        return newPlaced;
      });
      if (dropZoneId === "word-bank") {
        setWordBank((prev) => [...prev, word].sort());
      } else {
        const existingWord = placedWords[dropZoneId];
        if (existingWord) {
          setWordBank((prev) => [...prev, existingWord].sort());
        }
        setPlacedWords((prev) => ({ ...prev, [dropZoneId]: word }));
      }
      setShowResults(false);
    }
  };

  const getDropZoneClass = (questionId) => {
    if (!showResults) {
      return "border-gray-400";
    }
    const isCorrect =
      placedWords[questionId] ===
      writeQuestions.find((q) => q.id === questionId).correctAnswer;
    return isCorrect
      ? "border-green-500 bg-green-50"
      : "border-red-500 bg-red-50";
  };

  const handleShowAnswer = () => {
    const correctAnswers = {};
    writeQuestions.forEach((q) => {
      correctAnswers[q.id] = q.correctAnswer;
    });
    setPlacedWords(correctAnswers);
    setWordBank([]);
    setShowResults(true);
  };

  const handleStartAgain = () => {
    setWordBank(initialWordBank);
    setPlacedWords({});
    setShowResults(false);
  };

  const checkAnswers = () => {
    let allAnswered = true; // هل جميع الخانات مملوءة؟
    let correctCount = 0; // عدد الإجابات الصحيحة

    writeQuestions.forEach((q) => {
      const answer = placedWords[q.id];
      if (!answer) {
        allAnswered = false;
      } else if (answer === q.correctAnswer) {
        correctCount += 1;
      }
    });

    if (!allAnswered) {
      ValidationAlert.warning("Please answer all questions before checking.");
      return;
    }

    if (correctCount === writeQuestions.length) {
      ValidationAlert.success(
        `Score: ${correctCount} / ${writeQuestions.length}`,
      );
    } else if (correctCount === 0) {
      ValidationAlert.error(
        `Score: ${correctCount} / ${writeQuestions.length}`,
      );
    } else {
      ValidationAlert.error(
        `Score: ${correctCount} / ${writeQuestions.length}`,
      );
    }

    setShowResults(true);
  };

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      <div className="main-container-component">
        <div className="div-forall">
          <h1 className="WB-header-title-page8">
            <span className="WB-ex-A">B</span>Look, read, and write.
          </h1>

          <DropZone
            id="word-bank"
            className="flex flex-wrap justify-center gap-4 p-4 mb-10 border-2 border-dashed border-gray-300 rounded-lg min-h-[80px] items-center"
          >
            {wordBank.map((word) => (
              <DraggableWord key={word} word={word} />
            ))}
          </DropZone>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-10">
            {writeQuestions.map((question, index) => (
              <div
                key={question.id}
                className="flex flex-col items-center text-center"
              >
                <span className="font-bold text-blue-600 text-lg self-start mb-2">
                  {index + 1}
                </span>
                <img
                  src={question.img}
                  alt={question.correctAnswer}
                  className="max-w-24 max-h-24 object-contain mb-4"
                />
                <DropZone
                  id={question.id}
                  className={`w-full h-7 flex items-center justify-center border-b-2 transition-colors ${getDropZoneClass(question.id)}`}
                >
                 {placedWords[question.id] && (
  <span className="text-lg font-semibold text-gray-800">
    {placedWords[question.id]}
  </span>
)}
                </DropZone>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
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

export default DragAndDropWrite;

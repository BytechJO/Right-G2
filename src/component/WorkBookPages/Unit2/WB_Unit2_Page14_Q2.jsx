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

// 👇 مهم
const initialWordBank = [
  { text: "cap", used: false },
  { text: "queen", used: false },
  { text: "ox", used: false },
  { text: "box", used: false },
  { text: "sock", used: false },
  { text: "fox", used: false },
];

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
    id: word.text,
    data: { word },
    disabled: word.used, // 🔥 تعطيل السحب
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
      className={`WB-word-bank
        ${
          word.used
            ? "text-gray-400 cursor-not-allowed opacity-50"
            : "text-gray-700 cursor-grab active:cursor-grabbing"
        }
      `}
    >
      {word.text}
    </div>
  );
}

function DropZone({ id, children, className }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={className}
      style={{
        backgroundColor: isOver ? "white" : undefined,
        fontSize: "22px",
        fontWeight: "600",
      }}
    >
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
    if (!over) return;

    const draggedWord = active.data.current.word;
    const dropZoneId = over.id;

    setPlacedWords((prev) => {
      const newPlaced = { ...prev };

      // 🔥 إذا الكلمة موجودة بمكان ثاني → احذفها من هناك
      Object.keys(newPlaced).forEach((key) => {
        if (newPlaced[key] === draggedWord.text) {
          delete newPlaced[key];
        }
      });

      // 🔥 إذا في كلمة قديمة بالمكان → رجعها usable
      const replacedWord = newPlaced[dropZoneId];

      if (replacedWord) {
        setWordBank((prev) =>
          prev.map((w) =>
            w.text === replacedWord ? { ...w, used: false } : w,
          ),
        );
      }

      // حط الجديدة
      newPlaced[dropZoneId] = draggedWord.text;

      return newPlaced;
    });

    // 🔥 خلي الكلمة used
    setWordBank((prev) =>
      prev.map((w) => (w.text === draggedWord.text ? { ...w, used: true } : w)),
    );

    setShowResults(false);
  };

  const getDropZoneClass = (id) => {
    if (!showResults) return "border-gray-400";

    const correct =
      placedWords[id] === writeQuestions.find((q) => q.id === id).correctAnswer;

    return correct ? "border-gray-400" : "border-red-500";
  };

  const handleStartAgain = () => {
    setWordBank(initialWordBank);
    setPlacedWords({});
    setShowResults(false);
  };

  const checkAnswers = () => {
    if (showResults) return;
    let correctCount = 0;
    let allAnswered = true;

    writeQuestions.forEach((q) => {
      const ans = placedWords[q.id];
      if (!ans) allAnswered = false;
      else if (ans === q.correctAnswer) correctCount++;
    });

    if (!allAnswered) {
      ValidationAlert.info("Please answer all questions first!");
      return;
    }

    if (correctCount === writeQuestions.length) {
      ValidationAlert.success(
        `Score: ${correctCount}/${writeQuestions.length}`,
      );
    } else if (correctCount > 0) {
      ValidationAlert.warning(
        `Score: ${correctCount}/${writeQuestions.length}`,
      );
    } else {
      ValidationAlert.error(`Score: ${correctCount}/${writeQuestions.length}`);
    }
    setShowResults(true);
  };

  const handleShowAnswer = () => {
    // حط كل الإجابات الصح
    const answers = {};
    writeQuestions.forEach((q) => {
      answers[q.id] = q.correctAnswer;
    });

    setPlacedWords(answers);

    // عطّل كل الكلمات
    setWordBank((prev) => prev.map((w) => ({ ...w, used: true })));

    setShowResults(true);
  };
  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      <div className="main-container-component">
        <div className="div-forall" style={{ gap: "25px" }}>
          <h1 className="WB-header-title-page8">
            <span className="WB-ex-A">B</span> Look, read, and write.
          </h1>

          <div className="flex flex-col gap-5">
            {/* WORD BANK */}
            <DropZone
              id="word-bank"
              className="flex flex-wrap justify-center items-center gap-4 p-4 rounded-lg"
            >
              {wordBank.map((word) => (
                <DraggableWord key={word.text} word={word} />
              ))}
            </DropZone>

            {/* QUESTIONS */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {writeQuestions.map((q, index) => {
                const isWrong =
                  showResults &&
                  placedWords[q.id] &&
                  placedWords[q.id] !== q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className="text-center flex flex-col items-center relative"
                  >
                    <div className="flex gap-5">
                      <span className="text-blue-900 text-xl font-bold">
                        {index + 1}
                      </span>

                      <img
                        src={q.img}
                        className="my-2"
                        style={{ height: "100px" }}
                      />
                    </div>
                    <DropZone
                      id={q.id}
                      className={`h-8 w-full border-b-2 ${getDropZoneClass(q.id)}`}
                    >
                      {placedWords[q.id]}
                    </DropZone>

                    {/* ❌ ICON */}
                    {isWrong && (
                      <div className="absolute top-36 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                        <span className="text-white text-base font-bold">
                          ✕
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-10 flex justify-center">
            <Button
              handleStartAgain={handleStartAgain}
              checkAnswers={checkAnswers}
              handleShowAnswer={handleShowAnswer}
            />
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default DragAndDropWrite;

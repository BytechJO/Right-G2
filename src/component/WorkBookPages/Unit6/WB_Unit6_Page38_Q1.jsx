import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 38/Ex A 1.svg";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";

const DraggableWord = ({ word, used }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `bank-${word}`,
    data: {
      word,
      source: "bank",
    },
    disabled: used,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px,0)`
      : undefined,
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`WB-word-bank
      ${
        used
          ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
          : "border-2 border-blue-900 cursor-grab hover:bg-blue-100"
      }`}
    >
      {word}
    </div>
  );
};


const DropZone = ({ id, children, isWrong }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`relative flex items-center gap-3 p-1 border-b-2
      ${
        isWrong
          ? "border-red-500"
          : children
          ? "border-blue-300"
          : "border-dashed border-gray-300"
      }
      ${isOver ? "bg-blue-50" : ""}
    `}
    >
      {children}
    </div>
  );
};

const WB_Unit6_Page38_Q1 = () => {
  const [answers, setAnswers] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
  });

  const [showValidation, setShowValidation] = useState(false);
const [activeItem, setActiveItem] = useState(null);
  const correctAnswers = {
    1: "kite",
    2: "night",
    3: "bike",
    4: "five",
    5: "tight",
    6: "light",
  };

  const wordBank = [
    { id: 1, word: "bike" },
    { id: 2, word: "five" },
    { id: 3, word: "kite" },
    { id: 4, word: "light" },
    { id: 5, word: "night" },
    { id: 6, word: "tight" },
  ];

const handleDragStart = (event) => {
  setActiveItem(event.active.data.current);
};

const handleDragEnd = (event) => {
  const { active, over } = event;

  setActiveItem(null);

  if (!over || showValidation) return;

  const word = active.data.current.word;
  const questionNumber = Number(over.id);

  if (Object.values(answers).includes(word)) return;

  setAnswers((prev) => ({
    ...prev,
    [questionNumber]: word,
  }));
};
  const checkAnswers = () => {
    if (showValidation) return;
    const allFilled = Object.values(answers).every((ans) => ans !== "");
    if (!allFilled) {
      ValidationAlert.info("Please complete all answers before checking.");
      return;
    }

    let correctCount = 0;

    for (let i = 1; i <= 6; i++) {
      if (answers[i] === correctAnswers[i]) {
        correctCount++;
      }
    }

    setShowValidation(true);

    if (correctCount === 6) {
      ValidationAlert.success(`Score: ${correctCount}/6`);
    } else if (correctCount === 0) {
      ValidationAlert.error(`Score: ${correctCount}/6`);
    } else {
      ValidationAlert.warning(`Score: ${correctCount}/6`);
    }
  };

  const handleShowAnswer = () => {
    setAnswers(correctAnswers);
    setShowValidation(true);
  };

  const handleStartAgain = () => {
    setAnswers({
      1: "",
      2: "",
      3: "",
      4: "",
      5: "",
      6: "",
    });
    setShowValidation(false);
  };

  const isWrongAnswer = (num) => {
    if (!showValidation) return false;
    if (!answers[num]) return false;
    return answers[num] !== correctAnswers[num];
  };

 return (
  <DndContext
    onDragStart={handleDragStart}
    onDragEnd={handleDragEnd}
  >
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"25px"}}>
        {" "}
        <h1 className="WB-header-title-page8">
          {" "}
          <span className="WB-ex-A">A</span>Look, read, and write. Use the words
          from the box.{" "}
        </h1>

        <div>
        {/* WORD BANK */}
        <div className="mb-6 flex items-center justify-center">
          <div className="flex flex-wrap gap-10 p-3 rounded-lg">
            {wordBank.map((item) => {
              const isUsed = Object.values(answers).includes(item.word);

              return (
              <DraggableWord
  key={item.id}
  word={item.word}
  used={isUsed}
/>
              );
            })}
          </div>
        </div>
        {/* QUESTIONS */}
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <img
              src={img}
              alt="Exercise"
              className="object-contain"
              style={{ height: "300px", width: "auto" }}
            />
          </div>

          <div className="md:w-1/2">
            <div className="space-y-2">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <DropZone
  key={num}
  id={`${num}`}
  isWrong={isWrongAnswer(num)}
>
                  <span className="text-xl text-blue-900 font-semibold w-8">{num}.</span>

                  <div className="flex-1 min-h-[45px] flex items-center">
                    {answers[num] ? (
                      <span className="text-lg font-medium text-blue-700">
                        {answers[num]}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Drop word here
                      </span>
                    )}
                  </div>

                  {isWrongAnswer(num) && (
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shadow-md z-10 border-2 border-white">
                      <span className="text-white text-sm font-bold leading-none">
                        ✕
                      </span>
                    </div>
                  )}
                </DropZone>
              ))}
            </div>
          </div>
        </div></div>
        <Button
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={handleStartAgain}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
    <DragOverlay>
  {activeItem ? (
    <div className="WB-word-bank px-4 py-2 shadow-lg bg-white">
      {activeItem.word}
    </div>
  ) : null}
</DragOverlay>

    </DndContext>
  );
};

export default WB_Unit6_Page38_Q1;

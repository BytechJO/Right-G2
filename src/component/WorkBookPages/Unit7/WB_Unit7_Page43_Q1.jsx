import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 43/Asset 55.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 43/Asset 56.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 43/Asset 58.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 43/Asset 57.svg";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
const exerciseData = [
  { id: 1, correctAnswer: "February", img: img1 },
  { id: 2, correctAnswer: "Tuesday", img: img2 },
  { id: 3, correctAnswer: "November", img: img3 },
  { id: 4, correctAnswer: "Saturday", img: img4 },
];

const wordsToDrag = ["February", "Tuesday", "November", "Saturday"];
const DraggableWord = ({ word, disabled }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: word,
    disabled,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        ...style,
        padding: "9px 22px",
        touchAction:"none"
      }}
      className={`WB-word-bank ${
        disabled
          ? "bg-gray-200 text-gray-400 border-gray-300 opacity-60"
          : "bg-white border-blue-400 cursor-grab"
      }`}
    >
      {word}
    </div>
  );
};

const DropZone = ({ id, value, checked, correctAnswer }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `drop-${id}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`h-12 border-b-2 flex items-center justify-center transition-all
      ${isOver ? "bg-blue-100" : ""}
      ${!value ? "border-gray-400 border-dashed" : "border-gray-500"}
      ${checked && value && value !== correctAnswer ? "border-red-500" : ""}
    `}
    >
      <span className="text-2xl font-bold italic">{value}</span>
    </div>
  );
};
const WB_Unit7_Page43_Q1 = () => {
  const [userAnswers, setUserAnswers] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
  });

  const [draggedWord, setDraggedWord] = useState(null);
  const [activeWord, setActiveWord] = useState(null);
  const [checked, setChecked] = useState(false);
  const [locked, setLocked] = useState(false);

  const handleDragStart = (event) => {
    setActiveWord(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setActiveWord(null);

    if (!over || locked) return;

    const word = active.id;

    if (Object.values(userAnswers).includes(word)) return;

    const questionId = Number(over.id.replace("drop-", ""));

    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: word,
    }));
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
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="main-container-component">
        {" "}
        <div className="div-forall" style={{ gap: "25px" }}>
          {" "}
          <h1 className="WB-header-title-page8">
            {" "}
            <span className="WB-ex-A">I</span>Look, read the clue, and
            write.{" "}
          </h1>
          <div className="flex flex-col gap-2">
            {/* WORD BANK */}
            <div className="flex flex-wrap justify-center gap-6 w-full mb-2 p-4 rounded-xl">
              {wordsToDrag.map((word) => {
                const isUsed = Object.values(userAnswers).includes(word);

                return (
                  <DraggableWord
                    key={word}
                    word={word}
                    disabled={
                      Object.values(userAnswers).includes(word) || locked
                    }
                  />
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
                  <span className="text-xl font-bold text-blue-800">
                    {item.id}
                  </span>
                  <div className="flex items-end">
                    <img
                      src={item.img}
                      className="max-w-50 max-h-50 object-contain mb-4"
                      style={{ height: "175px", width: "auto" }}
                    />

                    <div className="relative w-full min-w-[180px]">
                      <DropZone
                        id={item.id}
                        value={userAnswers[item.id]}
                        checked={checked}
                        correctAnswer={item.correctAnswer}
                      />

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
            </div>
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
      <DragOverlay>
        {activeWord ? (
          <div className="WB-word-bank bg-white border-blue-400 px-6 py-2 shadow-xl">
            {activeWord}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit7_Page43_Q1;

import React, { useState } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
} from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 33/Ex A 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 33/Ex A 2.svg";


import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";

const WORDS = [
  { id: "wash", text: "wash" },
  { id: "go", text: "go" },
  { id: "say", text: "say" },
  { id: "brush", text: "brush" },
  { id: "getup", text: "get up" },
  { id: "eat", text: "eat" },
];

const CORRECT_ANSWERS = {
  drop1: "getup",
  drop2: "brush",
  drop3: "wash",
  drop4: "eat",
  drop5: "say",
  drop6: "go",
};

function DraggableWord({ word, isUsed }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: word.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isUsed ? 0.5 : 1,
      padding: "5px 23px"
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`WB-word-bank  ${
        isUsed ? "pointer-events-none bg-gray-100" : "hover:border-blue-400"
      }`}
      
    >
      {word.text}
    </div>
  );
}

function DropSlot({ id, content, isCorrect, isSubmitted }) {
  const { setNodeRef } = useSortable({ id });

  const isWrong = isSubmitted && content && !isCorrect;

  return (
    <div className="relative inline-block align-bottom mx-1">
      <div
        ref={setNodeRef}
        className={`inline-block min-w-[80px] h-8 border-b-2 px-2 text-center transition-colors ${isWrong && "border-red-500"}`}
      >
        {content ? (
          <span className="text-blue-700">
            {WORDS.find((w) => w.id === content).text}
          </span>
        ) : (
          <span className="text-transparent">____</span>
        )}
      </div>

      {isWrong && (
        <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-md border-2 border-white">
          <span className="text-white text-sm font-bold leading-none">✕</span>
        </div>
      )}
    </div>
  );
}

const WB_Unit6_Page33_Q1 = () => {
  const [placedWords, setPlacedWords] = useState({
    drop1: null,
    drop2: null,
    drop3: null,
    drop4: null,
    drop5: null,
    drop6: null,
  });
  const [activeId, setActiveId] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && over.id.startsWith("drop")) {
      setPlacedWords((prev) => ({ ...prev, [over.id]: active.id }));
    }
    setActiveId(null);
  };

  const checkAnswers = () => {
    if (isSubmitted) return;
    const hasEmpty = Object.values(placedWords).some((value) => value === null);
    if (hasEmpty) {
      ValidationAlert.info("Please complete all answers before checking.");
      return;
    }

    setIsSubmitted(true);

    let currentScore = 0;

    Object.keys(CORRECT_ANSWERS).forEach((key) => {
      if (placedWords[key] === CORRECT_ANSWERS[key]) {
        currentScore++;
      }
    });

    const total = Object.keys(CORRECT_ANSWERS).length;
    const scoreMessage = `Score: ${currentScore} / ${total}`;

    if (currentScore === total) {
      ValidationAlert.success(scoreMessage);
    } else if (currentScore === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  const handleReset = () => {
    setPlacedWords({
      drop1: null,
      drop2: null,
      drop3: null,
      drop4: null,
      drop5: null,
      drop6: null,
    });
    setIsSubmitted(false);
  };

  const handleShowAnswer = () => {
    setPlacedWords(CORRECT_ANSWERS);
    setIsSubmitted(true);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(e) => setActiveId(e.active.id)}
      onDragEnd={handleDragEnd}
    >
      <div className="main-container-component">
        <div className="div-forall"  style={{gap:"15px"}}>
          <h1 className="WB-header-title-page8">
            <div className="WB-ex-A">A</div>
            Describe Stella's day. Read and write.
          </h1>

          <div className="p-6 max-w-4xl mx-auto font-sans">
            <div className="flex flex-wrap justify-center gap-3 mb-6 w-full">
              <SortableContext items={WORDS.map((w) => w.id)}>
                {WORDS.map((word) => (
                  <DraggableWord
                    key={word.id}
                    word={word}
                    isUsed={Object.values(placedWords).includes(word.id)}
                  />
                ))}
              </SortableContext>
            </div>

            <div className="space-y-8">
              <div className="w-full gap-4">
                <img
                  src={img1}
                  alt="get up"
                  className="max-h-28 object-contain"
                />
            
              </div>

              <p className="text-xl leading-relaxed">
                I{" "}
                <DropSlot
                  id="drop1"
                  content={placedWords.drop1}
                  isCorrect={placedWords.drop1 === CORRECT_ANSWERS.drop1}
                  isSubmitted={isSubmitted}
                />{" "}
                at six o'clock. I{" "}
                <DropSlot
                  id="drop2"
                  content={placedWords.drop2}
                  isCorrect={placedWords.drop2 === CORRECT_ANSWERS.drop2}
                  isSubmitted={isSubmitted}
                />{" "}
                my teeth and{" "}
                <DropSlot
                  id="drop3"
                  content={placedWords.drop3}
                  isCorrect={placedWords.drop3 === CORRECT_ANSWERS.drop3}
                  isSubmitted={isSubmitted}
                />{" "}
                my face.
              </p>

              <div className="w-full  gap-4">
                <img
                  src={img2}
                  alt="eat"
                  className="max-h-28 object-contain"
                />
              
              </div>

              <p className="text-xl leading-relaxed">
                I{" "}
                <DropSlot
                  id="drop4"
                  content={placedWords.drop4}
                  isCorrect={placedWords.drop4 === CORRECT_ANSWERS.drop4}
                  isSubmitted={isSubmitted}
                />{" "}
                breakfast. I{" "}
                <DropSlot
                  id="drop5"
                  content={placedWords.drop5}
                  isCorrect={placedWords.drop5 === CORRECT_ANSWERS.drop5}
                  isSubmitted={isSubmitted}
                />{" "}
                goodbye to Mom and Dad and{" "}
                <DropSlot
                  id="drop6"
                  content={placedWords.drop6}
                  isCorrect={placedWords.drop6 === CORRECT_ANSWERS.drop6}
                  isSubmitted={isSubmitted}
                />{" "}
                to school.
              </p>
            </div>
          </div>

          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleReset}
            checkAnswers={checkAnswers}
          />

          <DragOverlay>
            {activeId ? (
              <div className="px-4 py-1 bg-white border-2 border-blue-500 rounded-full shadow-lg text-blue-600 font-bold">
                {WORDS.find((w) => w.id === activeId).text}
              </div>
            ) : null}
          </DragOverlay>
        </div>
      </div>
    </DndContext>
  );
};

export default WB_Unit6_Page33_Q1;

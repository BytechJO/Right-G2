import React, { useState, useRef } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
} from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import ValidationAlert from "../../Popup/ValidationAlert";
import { FaDownload } from "react-icons/fa6";

const PHRASES = [
  { id: "p1", text: "brush teeth" },
  { id: "p2", text: "do homework" },
  { id: "p3", text: "get up" },
  { id: "p4", text: "have lunch" },
  { id: "p5", text: "go home" },
  { id: "p6", text: "eat breakfast" },
  { id: "p7", text: "class" },
];

const CORRECT_ANSWERS = {
  h2: "p6", // What time does she eat breakfast? (مثال)
  h3: "p3", // What time do they get up?
  h4: "p5", // What time does he go home?
  h5: "p4", // What time does she have lunch?
  h6: "p2", // What time do they do homework?
};

function DraggablePhrase({ phrase, isUsed }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: phrase.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isUsed ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`WB-word-bank ${isUsed ? "bg-gray-100 text-gray-400 pointer-events-none" : "hover:border-blue-400"}`}
    >
      {phrase.text}
    </div>
  );
}

function QuestionSlot({ id, prefix, suffix, content, isCorrect, isSubmitted }) {
  const { setNodeRef, isOver } = useSortable({ id });
  const borderColor = isSubmitted
    ? isCorrect
      ? "border-blue-600 bg-green-50"
      : "border-blue-600 bg-blue-50"
    : isOver
      ? "border-blue-400 bg-blue-50"
      : "border-gray-300";

  return (
    <div className="flex items-center flex-wrap gap-2 text-lg py-2 border-b border-gray-100">
      <span className="font-bold text-blue-600">{id.replace("h", "")}</span>
      <span className="text-gray-700">{prefix}</span>
      <div
        ref={setNodeRef}
        className={`min-w-[120px] h-9 border-b-2 px-2 flex items-center justify-center transition-all ${borderColor}`}
      >
        {content ? (
          <span className="text-blue-800 font-bold">
            {PHRASES.find((p) => p.id === content).text}
          </span>
        ) : (
          <span className="text-gray-200 italic text-sm">drop activity...</span>
        )}
      </div>
      <span className="text-gray-700">{suffix}</span>
    </div>
  );
}

const WB_Unit6_Page36_Q2 = () => {
  const [placed, setPlaced] = useState({
    h2: null,
    h3: null,
    h4: null,
    h5: null,
    h6: null,
  });
  const [activeId, setActiveId] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const captureRef = useRef(null);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && over.id.startsWith("h")) {
      setPlaced((prev) => ({ ...prev, [over.id]: active.id }));
    }
    setActiveId(null);
  };

  const checkAnswers = () => {
      const hasEmpty = Object.values(placed).some((v) => v === null);

  if (hasEmpty) {
    ValidationAlert.info("Please complete all answers first.");
    return;
  }
    ValidationAlert.success("Good Job!!");
  };

  const handleStartAgain = () => {
    setPlaced({ h2: null, h3: null, h4: null, h5: null, h6: null });
    setIsSubmitted(false);
  };

  const handledownload = async () => {
    const element = captureRef.current;

    const dataUrl = await toPng(element);

    const link = document.createElement("a");
    link.download = "activity.png";
    link.href = dataUrl;
    link.click();
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(e) => setActiveId(e.active.id)}
      onDragEnd={handleDragEnd}
    >
      <div className="main-container-component" ref={captureRef}>
        <div className="div-forall mb-10"  style={{gap:"15px"}}>
          <h1 className="WB-header-title-page8">
            <span className="WB-ex-A">H</span> Write questions. Use the phrases
            in the boxes.
          </h1>

<div className="flex flex-col gap-5">
          <div className="flex flex-wrap justify-center gap-3 mb-4 p-5">
            <SortableContext items={PHRASES.map((p) => p.id)}>
              {PHRASES.map((phrase) => (
                <DraggablePhrase
                  key={phrase.id}
                  phrase={phrase}
                  isUsed={Object.values(placed).includes(phrase.id)}
                />
              ))}
            </SortableContext>
          </div>

          {/* قائمة الأسئلة */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg py-2 border-b border-gray-100 opacity-60">
              <span className="font-bold text-blue-600">1</span>
              <span>What time does he</span>
              <span className="px-2 border-b-2 border-gray-300 font-bold text-blue-800">
                brush his teeth
              </span>
              <span>?</span>
            </div>

            <QuestionSlot
              id="h2"
              prefix="What time does she"
              suffix="?"
              content={placed.h2}
              isCorrect={placed.h2 === CORRECT_ANSWERS.h2}
              isSubmitted={isSubmitted}
            />
            <QuestionSlot
              id="h3"
              prefix="What time do they"
              suffix="?"
              content={placed.h3}
              isCorrect={placed.h3 === CORRECT_ANSWERS.h3}
              isSubmitted={isSubmitted}
            />
            <QuestionSlot
              id="h4"
              prefix="What time does he"
              suffix="?"
              content={placed.h4}
              isCorrect={placed.h4 === CORRECT_ANSWERS.h4}
              isSubmitted={isSubmitted}
            />
            <QuestionSlot
              id="h5"
              prefix="What time does she"
              suffix="?"
              content={placed.h5}
              isCorrect={placed.h5 === CORRECT_ANSWERS.h5}
              isSubmitted={isSubmitted}
            />
            <QuestionSlot
              id="h6"
              prefix="What time do they"
              suffix="?"
              content={placed.h6}
              isCorrect={placed.h6 === CORRECT_ANSWERS.h6}
              isSubmitted={isSubmitted}
            />
          </div>

       </div>   <div className="action-buttons-container">
            <button onClick={handleStartAgain} className="try-again-button">
              Start Again ↻
            </button>
            <button
              onClick={handledownload}
              className="flex items-center justify-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 shadow-md px-10"
            >
              <FaDownload />
            </button>
            <button onClick={checkAnswers} className="check-button2">
              Finish ✓
            </button>
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="px-4 py-1 bg-white border-2 border-blue-500 rounded-full shadow-xl text-blue-600 font-bold scale-105">
            {PHRASES.find((p) => p.id === activeId).text}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit6_Page36_Q2;

import React, { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
} from "@dnd-kit/core";

import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";

import imgBlueInk from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 50/Ex B 1.svg";
import imgTubeItem from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 50/Ex B 2.svg";

const WORDS = ["cute", "cube", "chute", "Sue", "glue", "true", "mute"];

// الكلمات الصحيحة لكل عمود
const BLUE_WORDS = ["glue", "true", "Sue"];
const TUBE_WORDS = ["mute", "cube", "cute", "chute"];

const INITIAL_ANSWERS = {
  b1: null,
  b2: null,
  b3: null,
  t1: null,
  t2: null,
  t3: null,
  t4: null,
};

function isWordCorrectInSlot(slotId, word) {
  if (!word) return false;

  if (slotId.startsWith("b")) {
    return BLUE_WORDS.includes(word);
  }

  if (slotId.startsWith("t")) {
    return TUBE_WORDS.includes(word);
  }

  return false;
}

function DraggableWord({ word, isUsed }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: word,
      disabled: isUsed,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(!isUsed ? listeners : {})}
      {...(!isUsed ? attributes : {})}
      className={`px-4 py-2 bg-white border rounded-lg shadow-sm text-blue-700 text-sm font-bold ${
        isUsed
          ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed opacity-60"
          : isDragging
          ? "cursor-grabbing shadow-lg"
          : "cursor-grab hover:border-blue-400"
      }`}
    >
      {word}
    </div>
  );
}

function DropSlot({ id, value, showResults, onClear }) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const isCorrect = isWordCorrectInSlot(id, value);

  let slotStyle = "border-gray-300 bg-white";
  if (showResults) {
    slotStyle = isCorrect ? "border-blue-400 bg-blue-50" : "border-red-300";
  } else if (isOver) {
    slotStyle = "border-blue-400 bg-blue-50";
  }

  return (
    <div
      ref={setNodeRef}
      className={`relative min-h-[54px] border-2 border-dashed rounded-xl flex items-center justify-center px-3 transition-all ${slotStyle}`}
    >
      {value ? (
        <div className="flex items-center gap-2">
          <span className="font-bold text-blue-900">{value}</span>

          {!showResults && (
            <button
              type="button"
              onClick={() => onClear(id)}
              className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-300"
            >
              ✕
            </button>
          )}
        </div>
      ) : (
        <span className="text-gray-400 text-sm italic">Drop here</span>
      )}

      {showResults && value && !isCorrect && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-white">
          ✕
        </span>
      )}
    </div>
  );
}

const WB_Unit8_Page50_Q2 = () => {
  const [answers, setAnswers] = useState(INITIAL_ANSWERS);
  const [showResults, setShowResults] = useState(false);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;
    if (showResults) return;

    const draggedWord = active.id;
    const dropSlotId = over.id;

    setAnswers((prev) => {
      const updated = { ...prev };

      Object.keys(updated).forEach((key) => {
        if (updated[key] === draggedWord) {
          updated[key] = null;
        }
      });

      updated[dropSlotId] = draggedWord;

      return updated;
    });
  };

  const handleClearSlot = (slotId) => {
    setAnswers((prev) => ({
      ...prev,
      [slotId]: null,
    }));
  };

  const checkAnswers = () => {
    const unanswered = Object.keys(INITIAL_ANSWERS).filter((id) => !answers[id]);

    if (unanswered.length > 0) {
      ValidationAlert.info();
      return;
    }

    setShowResults(true);

    let score = 0;
    Object.keys(answers).forEach((id) => {
      if (isWordCorrectInSlot(id, answers[id])) score++;
    });

    const total = Object.keys(answers).length;
    const msg = `Score: ${score} / ${total}`;

    if (score === total) ValidationAlert.success(msg);
    else if (score > 0) ValidationAlert.warning(msg);
    else ValidationAlert.error(msg);
  };

  const handleShowAnswer = () => {
    setAnswers({
      b1: "glue",
      b2: "true",
      b3: "Sue",
      t1: "mute",
      t2: "cube",
      t3: "cute",
      t4: "chute",
    });
    setShowResults(true);
  };

  const handleReset = () => {
    setAnswers(INITIAL_ANSWERS);
    setShowResults(false);
    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="main-container-component">
        <div
          className="div-forall"
          style={{ gap: "10px", marginBottom: "50px" }}
        >
          <h1 className="WB-header-title-page8">
            <span className="WB-ex-A">B</span> Read and write the words in the
            correct column.
          </h1>

          <div className="mb-10 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="flex flex-wrap justify-center gap-3">
              {WORDS.map((word) => (
                <DraggableWord
                  key={word}
                  word={word}
                  isUsed={Object.values(answers).includes(word)}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-4 mb-8">
                <img
                  src={imgBlueInk}
                  alt="blue"
                  className="max-w-45 max-h-24 object-contain"
                />
                <span className="text-2xl font-black text-blue-900">blue</span>
              </div>

              <div className="space-y-4 px-10">
                {["b1", "b2", "b3"].map((id) => (
                  <DropSlot
                    key={id}
                    id={id}
                    value={answers[id]}
                    showResults={showResults}
                    onClear={handleClearSlot}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col items-center gap-4 mb-8">
                <img
                  src={imgTubeItem}
                  alt="tube"
                  className="max-w-45 max-h-24 object-contain"
                />
                <span className="text-2xl font-black text-blue-900">tube</span>
              </div>

              <div className="space-y-4 px-10">
                {["t1", "t2", "t3", "t4"].map((id) => (
                  <DropSlot
                    key={id}
                    id={id}
                    value={answers[id]}
                    showResults={showResults}
                    onClear={handleClearSlot}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <Button
              handleShowAnswer={handleShowAnswer}
              handleStartAgain={handleReset}
              checkAnswers={checkAnswers}
            />
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="px-4 py-2 bg-white border-2 border-blue-500 rounded-lg shadow-xl text-blue-700 text-sm font-bold">
            {activeId}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit8_Page50_Q2;
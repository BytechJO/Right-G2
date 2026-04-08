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

import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";

const SENTENCES_C = [
  { id: "c1", prefix: "1. His favorite color is", suffix: "." },
  { id: "c2", prefix: "2. They swim in the month of", suffix: "." },
  {
    id: "c3",
    prefix: "3. She used",
    suffix: "to stick the picture on the paper.",
  },
];

const WORDS_C = [
  { id: "w1", text: "blue" },
  { id: "w2", text: "glue" },
  { id: "w3", text: "June" },
];

const CORRECT_C = { c1: "w1", c2: "w3", c3: "w2" };

function DraggableWord({ item, isUsed }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });
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
      className={`px-6 py-2 bg-white border-2 border-gray-300 rounded-xl shadow-sm cursor-grab text-blue-700 font-bold ${isUsed ? "bg-gray-100 text-gray-400 pointer-events-none" : "hover:border-blue-400 hover:shadow-md transition-all"}`}
    >
      {item.text}
    </div>
  );
}

function DropSlot({ id, content, isCorrect, isSubmitted }) {
  const { setNodeRef, isOver } = useSortable({ id });

  const borderColor = isSubmitted
    ? isCorrect
      ? "border-blue-400"
      : "border-red-500"
    : isOver
    ? "border-blue-400 bg-blue-50"
    : "border-gray-300";

  return (
    <div
      ref={setNodeRef}
      className={`relative inline-block min-w-[120px] h-9 border-b-2 mx-2 px-2 text-center align-bottom transition-all ${borderColor}`}
    >
      {/* النص */}
      {content ? (
        <span className="text-blue-900 font-bold">
          {WORDS_C.find((w) => w.id === content).text}
        </span>
      ) : (
        <span className="text-gray-200 italic text-sm"></span>
      )}

      {/* ❌ إذا الجواب غلط */}
      {isSubmitted && content && !isCorrect && (
        <span className="absolute -top-2 -right-2 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-white shadow">
          ✕
        </span>
      )}
    </div>
  );
}

const WB_Unit8_Page50_Q3 = () => {
  const [answers, setAnswers] = useState({ c1: null, c2: null, c3: null });
  const [activeId, setActiveId] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  const checkAnswers = () => {
    const unanswered = Object.keys(CORRECT_C).filter((id) => !answers[id]);
    if (unanswered.length > 0) {
      ValidationAlert.info();
      return;
    }
    setShowResults(true);
    let score = 0;
    Object.keys(CORRECT_C).forEach((id) => {
      if (answers[id] === CORRECT_C[id]) score++;
    });
    const total = Object.keys(CORRECT_C).length;
    const msg = `Score: ${score} / ${total}`;
    if (score === total) ValidationAlert.success(msg);
    else if (score > 0) ValidationAlert.warning(msg);
    else ValidationAlert.error(msg);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(e) => setActiveId(e.active.id)}
      onDragEnd={(e) => {
        if (e.over)
          setAnswers((prev) => ({ ...prev, [e.over.id]: e.active.id }));
        setActiveId(null);
      }}
    >
      <div className="main-container-component">
        <div
          className="div-forall"
          style={{ gap: "10px", marginBottom: "50px" }}
        >
          <h1 className="WB-header-title-page8">
            {" "}
            <span className="WB-ex-A">C</span>Read and complete the sentences.
            Use the words from the box.
          </h1>
     

        <div className="flex justify-center gap-4 mb-12 p-3 rounded-2xl border-2 border-dashed border-blue-600">
          <SortableContext items={WORDS_C.map((w) => w.id)}>
            {WORDS_C.map((w) => (
              <DraggableWord
                key={w.id}
                item={w}
                isUsed={Object.values(answers).includes(w.id)}
              />
            ))}
          </SortableContext>
        </div>

        <div className="space-y-10 text-xl text-gray-700 leading-relaxed">
          {SENTENCES_C.map((s) => (
            <p key={s.id}>
              {s.prefix}
              <DropSlot
                id={s.id}
                content={answers[s.id]}
                isCorrect={answers[s.id] === CORRECT_C[s.id]}
                isSubmitted={showResults}
              />
              {s.suffix}
            </p>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            handleShowAnswer={() => {
              setAnswers(CORRECT_C);
              setShowResults(true);
            }}
            handleStartAgain={() => {
              setAnswers({ c1: null, c2: null, c3: null });
              setShowResults(false);
            }}
            checkAnswers={checkAnswers}
          />
        </div>
           </div>
      </div>
      <DragOverlay>
        {activeId ? (
          <div className="px-6 py-2 bg-white border-2 border-blue-500 rounded-xl shadow-2xl text-blue-700 font-bold scale-105">
            {WORDS_C.find((w) => w.id === activeId).text}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit8_Page50_Q3;

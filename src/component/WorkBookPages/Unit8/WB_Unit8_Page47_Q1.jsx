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
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
// check 
// استيراد صورة الخزانة
import imgSueCloset from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 47/Ex F 1.svg";

const PHRASES_F = [
  { id: "f1", text: "She doesn't have any" },
  { id: "f2", text: "She has six" },
  { id: "f3", text: "She has three" },
  { id: "f4", text: "She doesn't have" },
  { id: "f5", text: "any" },
];

const CORRECT_F = { q1: "f5", q2: "f1", q3: "f2", q4: "f3", q5: "f4" };

function DraggablePhrase({ item, isUsed }) {
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
      className={`px-4 py-1 bg-white border-2 border-gray-300 rounded-full shadow-sm cursor-grab text-blue-600 font-medium text-sm ${
        isUsed
          ? "bg-gray-100 text-gray-400 pointer-events-none"
          : "hover:border-blue-400"
      }`}
    >
      {item.text}
    </div>
  );
}

function DropSlot({
  id,
  content,
  isCorrect,
  isSubmitted,
  placeholder = "____",
}) {
  const { setNodeRef, isOver } = useSortable({ id });

  const borderColor = isSubmitted
    ? isCorrect
      ? "border-blue-400 bg-blue-50"
      : "border-blue-400 bg-blue-50"
    : isOver
      ? "border-blue-400 bg-blue-50"
      : "border-gray-300";

  const isWrong = isSubmitted && content && !isCorrect;

  return (
    <div className="relative inline-block">
      <div
        ref={setNodeRef}
        className={`inline-block min-w-[100px] h-8 border-b-2 mx-1 px-2 text-center align-bottom transition-all ${borderColor}`}
      >
        {content ? (
          <span
            className={`font-bold text-sm 
             "text-blue-800"
            `}
          >
            {PHRASES_F.find((p) => p.id === content).text}
          </span>
        ) : (
          <span className="text-gray-200 italic text-xs">{placeholder}</span>
        )}
      </div>

      {isWrong && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow border-2 border-white">
          ✕
        </div>
      )}
    </div>
  );
}

const WB_Unit8_Page47_Q1 = () => {
  const [answers, setAnswers] = useState({
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null,
  });
  const [activeId, setActiveId] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  const checkAnswers = () => {
    const unanswered = Object.keys(CORRECT_F).filter((id) => !answers[id]);
    if (unanswered.length > 0) {
      ValidationAlert.info();
      return;
    }

    setShowResults(true);

    let score = 0;
    let total = Object.keys(CORRECT_F).length;

    Object.keys(CORRECT_F).forEach((id) => {
      if (answers[id] === CORRECT_F[id]) score++;
    });

    if (score === total) {
      ValidationAlert.success(`Score: ${score} / ${total}`);
    } else if (score > 0) {
      ValidationAlert.warning(`Score: ${score} / ${total}`);
    } else {
      ValidationAlert.error(`Score: ${score} / ${total}`);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(e) => setActiveId(e.active.id)}
      onDragEnd={(e) => {
        if (e.over) {
          setAnswers((prev) => ({ ...prev, [e.over.id]: e.active.id }));
        }
        setActiveId(null);
      }}
    >
      <div className="main-container-component">
        <div className="div-forall" style={{ gap: "10px" }}>
          <h1 className="WB-header-title-page8">
            <span className="WB-ex-A">F</span> Look into Sue's closet. Read and
            write.
          </h1>

          <div className="flex flex-col md:flex-row gap-10">
            <div className="w-full md:w-1/3 flex justify-center">
              <img
                src={imgSueCloset}
                alt="Sue's Closet"
                className="max-h-[400px] object-contain"
              />
            </div>

            <div className="flex-1 space-y-6 text-lg">
              <div className="flex flex-wrap justify-center gap-2 p-4 bg-blue-50 rounded-xl border-2 border-dashed border-blue-200 mb-4">
                <SortableContext items={PHRASES_F.map((p) => p.id)}>
                  {PHRASES_F.map((p) => (
                    <DraggablePhrase
                      key={p.id}
                      item={p}
                      isUsed={Object.values(answers).includes(p.id)}
                    />
                  ))}
                </SortableContext>
              </div>

              <p>
                1. She doesn't have{" "}
                <DropSlot
                  id="q1"
                  content={answers.q1}
                  isCorrect={answers.q1 === CORRECT_F.q1}
                  isSubmitted={showResults}
                />{" "}
                pairs of pants.
              </p>

              <p>
                2.{" "}
                <DropSlot
                  id="q2"
                  content={answers.q2}
                  isCorrect={answers.q2 === CORRECT_F.q2}
                  isSubmitted={showResults}
                />{" "}
                pairs of shorts.
              </p>

              <p>
                3.{" "}
                <DropSlot
                  id="q3"
                  content={answers.q3}
                  isCorrect={answers.q3 === CORRECT_F.q3}
                  isSubmitted={showResults}
                />{" "}
                pairs of shoes.
              </p>

              <p>
                4.{" "}
                <DropSlot
                  id="q4"
                  content={answers.q4}
                  isCorrect={answers.q4 === CORRECT_F.q4}
                  isSubmitted={showResults}
                />{" "}
                dresses.
              </p>

              <p>
                5.{" "}
                <DropSlot
                  id="q5"
                  content={answers.q5}
                  isCorrect={answers.q5 === CORRECT_F.q5}
                  isSubmitted={showResults}
                />{" "}
                a skirt.
              </p>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <Button
              handleShowAnswer={() => {
                setAnswers(CORRECT_F);
                setShowResults(true);
              }}
              handleStartAgain={() => {
                setAnswers({
                  q1: null,
                  q2: null,
                  q3: null,
                  q4: null,
                  q5: null,
                });
                setShowResults(false);
              }}
              checkAnswers={checkAnswers}
            />
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="px-4 py-1 bg-white border-2 border-blue-500 rounded-full shadow-xl text-blue-600 font-bold text-sm">
            {PHRASES_F.find((p) => p.id === activeId).text}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit8_Page47_Q1;

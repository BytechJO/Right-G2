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

import imgBedroom from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/page 49/Asset54.svg";

const SENTENCES_J = [
  { id: "j1", text: "She has four pairs of shoes." },
  { id: "j2", text: "She has four shirts." },
  { id: "j3", text: "She has five skirts." },
];

const CORRECT_J = { q1: "j1", q2: "j2", q3: "j3" };

function DraggableSentence({ item, isUsed }) {
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
      className={`p-3 bg-white border-2 border-gray-200 rounded-xl shadow-sm cursor-grab text-blue-700 font-medium text-sm ${
        isUsed
          ? "bg-gray-50 text-gray-300 pointer-events-none"
          : "hover:border-blue-400 hover:shadow-md transition-all"
      }`}
    >
      {item.text}
    </div>
  );
}

function DropSlot({ id, content, isCorrect, isSubmitted }) {
  const { setNodeRef, isOver } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`w-full min-h-[45px] border-b-2 flex items-center justify-between px-4 transition-all border-blue-400`}
    >
      {content ? (
        <>
          <span className="text-blue-900 font-bold text-sm">
            {SENTENCES_J.find((s) => s.id === content)?.text}
          </span>

          {isSubmitted && !isCorrect && (
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white text-lg font-bold shadow-sm border-2 border-white">
              ✕
            </div>
          )}
        </>
      ) : (
        <span className="text-gray-300 italic text-sm">
          Drop your answer here...
        </span>
      )}
    </div>
  );
}

const WB_Unit8_Page49_Q1 = () => {
  const [answers, setAnswers] = useState({ q1: null, q2: null, q3: null });
  const [activeId, setActiveId] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  const checkAnswers = () => {
    const unanswered = Object.keys(CORRECT_J).filter((id) => !answers[id]);

    if (unanswered.length > 0) {
      ValidationAlert.info();
      return;
    }

    setShowResults(true);

    let score = 0;
    const total = Object.keys(CORRECT_J).length;

    Object.keys(CORRECT_J).forEach((id) => {
      if (answers[id] === CORRECT_J[id]) score++;
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
          setAnswers((prev) => ({
            ...prev,
            [e.over.id]: e.active.id,
          }));
        }
        setActiveId(null);
      }}
    >
      <div className="main-container-component">
        <div
          className="div-forall"
          style={{ gap: "10px", marginBottom: "50px" }}
        >
          <h1 className="WB-header-title-page8">
            <span className="WB-ex-A">J</span> Read, look, and write the
            answers.
          </h1>

          <div className="flex flex-col gap-8">
            <div className="w-full flex justify-center">
              <img
                src={imgBedroom}
                alt="Bedroom Scene"
                className="max-h-[350px] w-full object-cover rounded-2xl border-gray-50"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-8">
                <div className="space-y-2">
                  <p className="text-gray-700 font-medium">
                    1. How many pairs of shoes does she have?
                  </p>
                  <DropSlot
                    id="q1"
                    content={answers.q1}
                    isCorrect={answers.q1 === CORRECT_J.q1}
                    isSubmitted={showResults}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-gray-700 font-medium">
                    2. How many shirts does she have?
                  </p>
                  <DropSlot
                    id="q2"
                    content={answers.q2}
                    isCorrect={answers.q2 === CORRECT_J.q2}
                    isSubmitted={showResults}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-gray-700 font-medium">
                    3. How many skirts does she have?
                  </p>
                  <DropSlot
                    id="q3"
                    content={answers.q3}
                    isCorrect={answers.q3 === CORRECT_J.q3}
                    isSubmitted={showResults}
                  />
                </div>
              </div>

              <div className="w-full md:w-72 bg-blue-50 p-5 rounded-2xl border-2 border-blue-100 h-fit">
                <h3 className="font-bold text-blue-800 mb-4 text-center">
                  Answers Bank
                </h3>

                <div className="flex flex-col gap-3">
                  <SortableContext items={SENTENCES_J.map((s) => s.id)}>
                    {SENTENCES_J.map((s) => (
                      <DraggableSentence
                        key={s.id}
                        item={s}
                        isUsed={Object.values(answers).includes(s.id)}
                      />
                    ))}
                  </SortableContext>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <Button
              handleShowAnswer={() => {
                setAnswers(CORRECT_J);
                setShowResults(true);
              }}
              handleStartAgain={() => {
                setAnswers({ q1: null, q2: null, q3: null });
                setShowResults(false);
              }}
              checkAnswers={checkAnswers}
            />
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="p-3 bg-white border-2 border-blue-500 rounded-xl shadow-2xl text-blue-700 font-bold text-sm scale-105">
            {SENTENCES_J.find((s) => s.id === activeId)?.text}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit8_Page49_Q1;
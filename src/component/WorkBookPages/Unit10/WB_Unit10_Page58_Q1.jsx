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
// check
import imgMath from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 58/SVG/Asset 6-1.svg";
import imgSoccer from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 58/SVG/Asset 9-1.svg";
import imgEnglish from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 58/SVG/Asset 7-1.svg";
import imgScience from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 58/SVG/Asset 8-1.svg";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 58/SVG/Asset 1.svg";
const ACTIVITIES_B = [
  { id: "b1", text: "math class", full: "They're having math class." },
  { id: "b2", text: "soccer", full: "They're playing soccer." },
  { id: "b3", text: "English class", full: "He is having English class." },
  { id: "b4", text: "science class", full: "They're having science class." },
];

const CORRECT_B = { q1: "b1", q2: "b2", q3: "b3", q4: "b4" };

function DraggableItem({ item, isUsed }) {
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
      className={`px-4 py-2 bg-white border-2 border-gray-300 rounded-lg shadow-sm cursor-grab touch-none text-blue-700 font-bold text-sm ${isUsed ? "bg-gray-100 text-gray-400 pointer-events-none" : "hover:border-blue-400"}`}
    >
      {item.text}
    </div>
  );
}

function DropSlot({ id, prefix, content, isCorrect, isSubmitted }) {
  const { setNodeRef, isOver } = useSortable({ id });
  const borderColor = isSubmitted
    ? isCorrect
      ? "border-blue-400"
      : "border-red-500"
    : isOver
      ? "border-blue-400 bg-blue-50"
      : "border-gray-300";
  return (
    <div className="space-y-2">
      <div
        ref={setNodeRef}
        className={`relative w-full min-h-[45px] border-b-2 flex items-center px-2 transition-all ${borderColor}`}
      >
        {/* ❌ Wrong Answer Icon */}
        {isSubmitted && content && !isCorrect && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow">
            ✕
          </div>
        )}
        <span className="text-gray-700 mr-2">{prefix}</span>
        {content ? (
          <span className="text-blue-900 font-semibold text-lg">
            {ACTIVITIES_B.find((a) => a.id === content).text}.
          </span>
        ) : (
          <span className="text-gray-200 italic text-sm">drop here...</span>
        )}
      </div>
    </div>
  );
}

const WB_Unit10_Page58_Q1 = () => {
  const [answers, setAnswers] = useState({
    q1: null,
    q2: null,
    q3: null,
    q4: null,
  });
  const [activeId, setActiveId] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };
  const [shuffledActivities, setShuffledActivities] = useState(() =>
    shuffleArray(ACTIVITIES_B),
  );
  // ✨ تعديل
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 👈 لازم يسحب 8px عالأقل عشان يعتبر drag
      },
    }),
  );
  const checkAnswers = () => {
    if (showResults) return;
    const unanswered = Object.keys(CORRECT_B).filter((id) => !answers[id]);
    if (unanswered.length > 0) {
      ValidationAlert.info();
      return;
    }
    setShowResults(true);
    let score = 0;
    let total = Object.keys(CORRECT_B).length;
    Object.keys(CORRECT_B).forEach((id) => {
      if (answers[id] === CORRECT_B[id]) score++;
    });
    if (score === total) ValidationAlert.success(`Score: ${score} / ${total}`);
    else if (score > 0) ValidationAlert.warning(`Score: ${score} / ${total}`);
    else ValidationAlert.error(`Score: ${score} / ${total}`);
  };

  const handleReset = () => {
    setAnswers({ q1: null, q2: null, q3: null, q4: null });
    setShowResults(false);
    setShuffledActivities(shuffleArray(ACTIVITIES_B));
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(e) => setActiveId(e.active.id)}
      // ✨ تعديل
      onDragEnd={(e) => {
        if (e.over && e.over.id in answers) {
          setAnswers((prev) => ({
            ...prev,
            [e.over.id]: e.active.id,
          }));
        }
        setActiveId(null);
      }}
    >
      <div className="main-container-component">
        <div className="div-forall"  style={{gap:"45px"}}>
          <h1 className="WB-header-title-page8">
            <span className="WB-ex-A">B</span> Look, ask, and answer. Then
            write.
          </h1>
          <img
            src={img1}
            alt="math"
            className="object-cover rounded-xl"
            style={{ height: "auto", width: "auto" }}
          />

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-[3] grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <img
                  src={imgMath}
                  alt="math"
                  className="max-w-full max-h-32 object-cover rounded-xl"
                />
                <DropSlot
                  id="q1"
                  prefix="They're having"
                  content={answers.q1}
                  isCorrect={answers.q1 === CORRECT_B.q1}
                  isSubmitted={showResults}
                />
              </div>
              <div className="space-y-4">
                <img
                  src={imgSoccer}
                  alt="soccer"
                  className="max-w-full max-h-32 object-cover rounded-xl"
                />
                <DropSlot
                  id="q2"
                  prefix="They're playing"
                  content={answers.q2}
                  isCorrect={answers.q2 === CORRECT_B.q2}
                  isSubmitted={showResults}
                />
              </div>
              <div className="space-y-4">
                <img
                  src={imgEnglish}
                  alt="english"
                  className="max-w-full max-h-32 object-cover rounded-xl"
                />
                <DropSlot
                  id="q3"
                  prefix="He is having"
                  content={answers.q3}
                  isCorrect={answers.q3 === CORRECT_B.q3}
                  isSubmitted={showResults}
                />
              </div>
              <div className="space-y-4">
                <img
                  src={imgScience}
                  alt="science"
                  className="max-w-full max-h-32 object-cover rounded-xl"
                />
                <DropSlot
                  id="q4"
                  prefix="They're having"
                  content={answers.q4}
                  isCorrect={answers.q4 === CORRECT_B.q4}
                  isSubmitted={showResults}
                />
              </div>
            </div>

            <div className="flex-1 bg-blue-50 p-5 rounded-2xl border-2 border-blue-100 h-fit">
              <h3 className="font-bold text-blue-800 mb-4 text-center">
                Activities Bank
              </h3>
              <div className="flex flex-col gap-3">
                <SortableContext items={shuffledActivities.map((a) => a.id)}>
                  {shuffledActivities.map((act) => (
                    <DraggableItem
                      key={act.id}
                      item={act}
                      // ✨ تعديل
                      isUsed={Object.values(answers)
                        .filter(Boolean)
                        .includes(act.id)}
                    />
                  ))}
                </SortableContext>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              handleShowAnswer={() => {
                setAnswers(CORRECT_B);
                setShowResults(true);
              }}
              handleStartAgain={handleReset}
              checkAnswers={checkAnswers}
            />
          </div>
        </div>
      </div>
      <DragOverlay>
        {activeId ? (
          <div className="px-4 py-2 bg-white border-2 border-blue-500 rounded-lg shadow-xl text-blue-700 font-bold scale-105">
            {ACTIVITIES_B.find((a) => a.id === activeId).text}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit10_Page58_Q1;

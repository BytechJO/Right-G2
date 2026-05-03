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

// استيراد الصور

import imgRoomA from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/page 49/Asset56.svg";
import imgRoomB from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/page 49/Asset55.svg";

const OPTIONS_K = [
  { id: "k1", text: "She has six crayons." },
  { id: "k2", text: "She has one bed." },
  { id: "k3", text: "She has five dolls." },
  { id: "k4", text: "She has three pictures." },
  { id: "k5", text: "He has one computer." },
  { id: "k6", text: "He has two pictures." },
  { id: "k7", text: "He has four robots." },
  { id: "k8", text: "He has one lamp." },
];

const CORRECT_K = {
  a1: "k1",
  a2: "k2",
  a3: "k3",
  a4: "k4",
  b1: "k5",
  b2: "k6",
  b3: "k7",
  b4: "k8",
};

function DraggableK({ item, isUsed }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging, // 👈 مهم
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
      // 👇✨ هذا أهم تعديل
      onClick={(e) => e.preventDefault()}
      // 👆 يمنع الكليك من أنه يتعامل كـ drag

      className={`p-2 bg-white border border-gray-200 rounded-lg shadow-sm cursor-grab text-blue-700 touch-none text-[15px] font-medium ${
        // 👇✨ تعديل الشرط
        isUsed && !isDragging
          ? "bg-gray-50 text-gray-300 pointer-events-none"
          : "hover:border-blue-400"
      }`}
    >
      {item.text}
    </div>
  );
}
function DropSlotK({ id, content, isCorrect, isSubmitted }) {
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
      className={`relative w-full min-h-[35px] border-b-2 flex items-center px-2 transition-all ${borderColor}`}
    >
      {/* المحتوى */}
      {content ? (
        <span className="text-blue-900 font-bold text-[18px]">
          {OPTIONS_K.find((o) => o.id === content).text}
        </span>
      ) : (
        <span className="text-gray-200 italic text-[10px]">Drop answer...</span>
      )}

      {/* X أبيض إذا الجواب غلط */}
      {isSubmitted && !isCorrect && content && (
        <span className="absolute right-2 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold border-2 border-white shadow-lg">
          ✕
        </span>
      )}
    </div>
  );
}

const WB_Unit8_Page49_Q2 = () => {
  const [answers, setAnswers] = useState({
    a1: null,
    a2: null,
    a3: null,
    a4: null,
    b1: null,
    b2: null,
    b3: null,
    b4: null,
  });
  const [activeId, setActiveId] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const [shuffledOptions, setShuffledOptions] = useState(() =>
    shuffleArray(OPTIONS_K),
  );
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 👈 لازم المستخدم يحرك 8px عشان يصير drag
      },
    }),
  );
  const checkAnswers = () => {
    if (showResults) return;
    const unanswered = Object.keys(CORRECT_K).filter((id) => !answers[id]);
    if (unanswered.length > 0) {
      ValidationAlert.info();
      return;
    }
    setShowResults(true);
    let score = 0;
    let total = Object.keys(CORRECT_K).length;
    Object.keys(CORRECT_K).forEach((id) => {
      if (answers[id] === CORRECT_K[id]) score++;
    });
    if (score === total) ValidationAlert.success(`Score: ${score} / ${total}`);
    else if (score > 0) ValidationAlert.warning(`Score: ${score} / ${total}`);
    else ValidationAlert.error(`Score: ${score} / ${total}`);
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
          style={{ marginBottom: "50px" ,gap:"25px"}}
        >
          <h1 className="WB-header-title-page8">
            <span className="WB-ex-A">K</span> Read, look, and answer.
          </h1>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Section A */}
            <div className="flex-1 space-y-4">
              <div className="relative">
                <img
                  src={imgRoomA}
                  alt="Room A"
                  className="max-w-full max-h-40 object-contain "
                />
                <span className="absolute top-2 left-2 bg-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md">
                  A
                </span>
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="space-y-1">
                    <p className="text-[15px] text-gray-600">
                      {n}. How many{" "}
                      {["crayons", "beds", "dolls", "pictures"][n - 1]} does she
                      have?
                    </p>
                    <DropSlotK
                      id={`a${n}`}
                      content={answers[`a${n}`]}
                      isCorrect={answers[`a${n}`] === CORRECT_K[`a${n}`]}
                      isSubmitted={showResults}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Section B */}
            <div className="flex-1 space-y-4">
              <div className="relative">
                <img
                  src={imgRoomB}
                  alt="Room B"
                  className="max-w-full max-h-40 object-contain"
                />
                <span className="absolute top-2 left-2 bg-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md">
                  B
                </span>
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="space-y-1">
                    <p className="text-[15px] text-gray-600">
                      {n}. How many{" "}
                      {["computers", "pictures", "robots", "lamps"][n - 1]} does
                      he have?
                    </p>
                    <DropSlotK
                      id={`b${n}`}
                      content={answers[`b${n}`]}
                      isCorrect={answers[`b${n}`] === CORRECT_K[`b${n}`]}
                      isSubmitted={showResults}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Answers Bank */}
            <div className="w-full lg:w-64 bg-blue-50 p-4 rounded-2xl border-2 border-blue-100 h-fit">
              <h3 className="font-bold text-blue-800 mb-4 text-center text-sm">
                Answers Bank
              </h3>
              <div className="grid grid-cols-1 gap-2">
                <SortableContext items={shuffledOptions.map((o) => o.id)}>
                  {shuffledOptions.map((o) => (
                    <DraggableK
                      key={o.id}
                      item={o}
                      isUsed={Object.values(answers).some(
                        (val) => val === o.id,
                      )}
                    />
                  ))}
                </SortableContext>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <Button
              handleShowAnswer={() => {
                setAnswers(CORRECT_K);
                setShowResults(true);
              }}
              handleStartAgain={() => {
                setAnswers({
                  a1: null,
                  a2: null,
                  a3: null,
                  a4: null,
                  b1: null,
                  b2: null,
                  b3: null,
                  b4: null,
                });
                setShowResults(false);
                setShuffledOptions(shuffleArray(OPTIONS_K));
              }}
              checkAnswers={checkAnswers}
            />
          </div>
        </div>
      </div>
      <DragOverlay>
        {activeId ? (
          <div className="p-2 bg-white border-2 border-blue-500 rounded-lg shadow-xl text-blue-700 font-bold text-[10px] scale-105">
            {OPTIONS_K.find((o) => o.id === activeId).text}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit8_Page49_Q2;

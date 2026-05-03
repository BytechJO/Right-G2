import React, { useState } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor, // 🔧
  MouseSensor, // 🔧
  DragOverlay,
  useDroppable, // 🔧
} from "@dnd-kit/core";

// ✅ بعد
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
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
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id,
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging || isUsed ? 0.5 : 1,
        padding: "5px 23px"
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      // ✅ FIX: منع الكليك
      onClick={(e) => e.preventDefault()}
      className={`WB-word-bank touch-none select-none ${
        isUsed
          ? "bg-gray-100 text-gray-400 pointer-events-none"
          : "hover:bg-gray-100"
      }`}
    >
      {item.text}
    </div>
  );
}
// 🔧 FIX: useDroppable بدل useSortable
function DropSlot({
  id,
  content,
  isCorrect,
  isSubmitted,
  placeholder = "____",
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const borderColor = isSubmitted
    ? isCorrect
      ? "border-blue-900 bg-blue-50"
      : "border-red-500"
    : isOver
      ? "border-blue-900 bg-blue-50"
      : "border-gray-300";

  const isWrong = isSubmitted && content && !isCorrect;

  return (
    <div className="relative inline-block">
      <div
        ref={setNodeRef}
        className={`inline-block w-[200px] h-8 border-b-2 mx-1 px-2 text-center align-bottom transition-all ${borderColor}`}
      >
        {content ? (
          <span className="font-bold text-lg text-blue-900">
            {PHRASES_F.find((p) => p.id === content).text}
          </span>
        ) : (
          <span className="text-gray-200 italic text-xs">{placeholder}</span>
        )}
      </div>

      {isWrong && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow border-2 border-white">
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

  // 🔧 Sensors محسّنة للتابلت
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8, // ✅ نفس الفكرة
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150, // ✅ يمنع التاب السريع
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor),
  );

  const checkAnswers = () => {
    if (showResults) return;
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
        const { active, over } = e;

        if (!over) {
          setActiveId(null);
          return;
        }

        setAnswers((prev) => {
          const next = { ...prev };

          // إزالة من مكانه القديم
          Object.keys(next).forEach((k) => {
            if (next[k] === active.id) next[k] = null;
          });

          // وضعه بالمكان الجديد
          next[over.id] = active.id;

          return next;
        });

        setActiveId(null);
      }}
    >
      <div className="main-container-component">
        <div className="div-forall"  style={{gap:"45px"}}>
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
              <div className="flex flex-wrap justify-center gap-2 p-4 rounded-xl mb-4">
                {PHRASES_F.map((p) => (
                  <DraggablePhrase
                    key={p.id}
                    item={p}
                    isUsed={Object.values(answers).includes(p.id)}
                  />
                ))}
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
          <div className="px-4 py-1 bg-white border-2 border-blue-500 rounded-full shadow-xl text-blue-600 font-bold text-sm scale-110">
            {PHRASES_F.find((p) => p.id === activeId).text}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit8_Page47_Q1;

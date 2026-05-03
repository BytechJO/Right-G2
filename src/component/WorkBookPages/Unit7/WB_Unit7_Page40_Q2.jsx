
import React, { useState } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor, // 🔧 إضافة
  MouseSensor, // 🔧 إضافة
  DragOverlay,
  useDroppable, // 🔧 إضافة
} from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 40/Ex D 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 40/Ex D 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 40/Ex D 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 40/Ex D 4.svg";

const images = [
  { id: "img1", src: img1 },
  { id: "img2", src: img2 },
  { id: "img3", src: img3 },
  { id: "img4", src: img4 },
];

const QUESTIONS = [
  { id: "q1", text: "1 What time is it?" },
  { id: "q2", text: "2 What time is it?" },
  { id: "q3", text: "3 What time is it?" },
  { id: "q4", text: "4 What time is it?" },
];

const ANSWERS_POOL = [
  { id: "a1", text: "It is four thirty in the afternoon" },
  { id: "a2", text: "It's eight o'clock" },
  { id: "a3", text: "It is one o'clock in the" },
  { id: "a4", text: "It is twelve o'clock" },
];

const CORRECT_MAP = { q1: "a1", q2: "a4", q3: "a2", q4: "a3" };

function DraggableSentence({ answer, isUsed }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: answer.id,
    disabled: isUsed,
  });

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
      {...(!isUsed ? listeners : {})}
      // 🔧 touch-none مهم للـ iPad
      className={`p-3 md:p-2 border rounded shadow-sm text-base md:text-sm transition touch-none
        ${
          isUsed
            ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
            : "bg-white text-blue-700 cursor-grab hover:border-blue-500"
        }`}
    >
      {answer.text}
    </div>
  );
}

// 🔧 استبدلنا useSortable بـ useDroppable
function AnswerDropZone({ id, content, isCorrect, isSubmitted }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const bg = isSubmitted
    ? isCorrect
      ? "bg-gray-50 border-gray-300"
      : "bg-gray-50 border-red-500"
    : isOver
    ? "bg-blue-50 border-blue-400"
    : "bg-gray-50 border-gray-300";

  const isWrong = isSubmitted && content && !isCorrect;

  return (
    <div className="relative">
      <div
        ref={setNodeRef}
        className={`mt-1 min-h-[40px] border-b-2 p-2 transition-all ${bg}`}
      >
        {content ? (
          <span className="text-blue-800 font-medium">
            {ANSWERS_POOL.find((a) => a.id === content).text}
          </span>
        ) : (
          <span className="text-gray-300 italic text-sm">
            Drag answer here...
          </span>
        )}
      </div>

      {isWrong && (
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-md z-10 border-2 border-white">
          <span className="text-white text-xs font-bold leading-none">✕</span>
        </div>
      )}
    </div>
  );
}

const WB_Unit7_Page40_Q2 = () => {
  const [placedAnswers, setPlacedAnswers] = useState({
    q1: null,
    q2: null,
    q3: null,
    q4: null,
  });

  const [activeId, setActiveId] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 🔧 Sensors محسّنة للابتوب + iPad
  const sensors = useSensors(
    useSensor(MouseSensor), // للابتوب
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 120, // مهم للـ iPad
        tolerance: 8,
      },
    }),
    useSensor(PointerSensor) // fallback
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && over.id.startsWith("q")) {
      setPlacedAnswers((prev) => ({
        ...prev,
        [over.id]: active.id,
      }));
    }

    setActiveId(null);
  };

  const checkAnswers = () => {
    if (isSubmitted) return;
    const hasEmpty = Object.values(placedAnswers).some((v) => v === null);
    if (hasEmpty) {
      ValidationAlert.info("Please complete all answers before checking.");
      return;
    }

    let score = 0;

    Object.keys(CORRECT_MAP).forEach((qId) => {
      if (placedAnswers[qId] === CORRECT_MAP[qId]) {
        score++;
      }
    });

    setIsSubmitted(true);

    const total = Object.keys(CORRECT_MAP).length;
    const msg = `Score: ${score} / ${total}`;

    if (score === total) {
      ValidationAlert.success(msg);
    } else if (score === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }
  };

  const handleShowAnswer = () => {
    setPlacedAnswers(CORRECT_MAP);
    setIsSubmitted(true);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"25px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">D</span>
          Look and complete the conversations.
        </h1>

        <DndContext
          sensors={sensors}
          onDragStart={(e) => setActiveId(e.active.id)}
          onDragEnd={handleDragEnd}
        >
          <div className="p-6 max-w-5xl flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-6">
              {QUESTIONS.map((q, index) => (
                <div key={q.id} className="flex items-center gap-4 pl-4">
                  <img
                    src={images[index].src}
                    className="max-w-45 max-h-24 object-contain"
                  />

                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{q.text}</p>

                    <AnswerDropZone
                      id={q.id}
                      content={placedAnswers[q.id]}
                      isCorrect={placedAnswers[q.id] === CORRECT_MAP[q.id]}
                      isSubmitted={isSubmitted}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full md:w-65 space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <h3 className="font-bold text-blue-800 mb-3 text-center">
                  Answers Bank
                </h3>

                <div className="space-y-2">
                  <SortableContext items={ANSWERS_POOL.map((a) => a.id)}>
                    {ANSWERS_POOL.map((ans) => (
                      <DraggableSentence
                        key={ans.id}
                        answer={ans}
                        isUsed={Object.values(placedAnswers).includes(ans.id)}
                      />
                    ))}
                  </SortableContext>
                </div>
              </div>
            </div>
          </div>

          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={() => {
              setPlacedAnswers({
                q1: null,
                q2: null,
                q3: null,
                q4: null,
              });
              setIsSubmitted(false);
            }}
            checkAnswers={checkAnswers}
          />

          {/* 🔧 تحسين overlay */}
          <DragOverlay>
            {activeId ? (
              <div className="p-3 bg-white border-2 border-blue-500 rounded shadow-xl text-blue-800 text-base font-bold">
                {ANSWERS_POOL.find((a) => a.id === activeId).text}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default WB_Unit7_Page40_Q2;


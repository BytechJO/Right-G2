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
import imgTie from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/Ex A 1.svg";
import imgSocks from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/Ex A 2.svg";
import imgCap from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/Ex A 3.svg";
import imgDress from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/Ex A 4.svg";
import imgCloset from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/Ex A 5.svg";
import imgJacket from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/Ex A 6.svg";
import { useDroppable } from "@dnd-kit/core"; // ✅
const CLOTHES = [
  { id: "c4", text: "dress" },
  { id: "c1", text: "tie" },
  { id: "c5", text: "closet" },
  { id: "c2", text: "socks" },
  { id: "c6", text: "jacket" },
  { id: "c3", text: "cap" },
];

const CORRECT_ANSWERS = {
  q1: "c1",
  q2: "c2",
  q3: "c3",
  q4: "c4",
  q5: "c5",
  q6: "c6",
};

function DraggableItem({ item, isUsed }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,

    // ✅ FIX 1: منع click يتحول drag
    activationConstraint: {
      distance: 8,
    },

    // ✅ FIX 2: تعطيل إذا مستخدم
    disabled: isUsed,
  });

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
      // ✅ FIX 3: منع click
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className={`WB-word-bank ${
        isUsed
          ? "bg-gray-100 text-gray-400 pointer-events-none"
          : "hover:border-blue-400"
      }`}
    >
      {item.text}
    </div>
  );
}

function DropSlot({ id, content, isCorrect, isSubmitted }) {
  // ❌ كان useSortable
  // ✅ FIX 4:
  const { setNodeRef, isOver } = useDroppable({ id });

  const isWrong = isSubmitted && content && !isCorrect;

  const borderColor = isWrong
    ? "border-red-500"
    : isSubmitted
      ? "border-blue-400 bg-blue-50"
      : isOver
        ? "border-blue-400 bg-blue-50"
        : "border-gray-300";

  return (
    <div className="relative inline-block">
      <div
        ref={setNodeRef}
        className={`w-32 h-10 border-b-2 flex items-center justify-center transition-all ${borderColor}`}
      >
        {content ? (
          <span className="font-bold text-xl">
            {CLOTHES.find((c) => c.id === content).text}
          </span>
        ) : (
          <span className="text-gray-200 italic text-sm">drop here</span>
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

const WB_Unit8_Page45_Q1 = () => {
  const [answers, setAnswers] = useState({
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null,
    q6: null,
  });
  const [activeId, setActiveId] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // ✅ يمنع الكليك
      },
    }),
  );
  const checkAnswers = () => {
    if (showResults) return;
    const unanswered = Object.keys(CORRECT_ANSWERS).filter(
      (id) => !answers[id],
    );

    if (unanswered.length > 0) {
      ValidationAlert.info();
      return;
    }

    setShowResults(true);

    let score = 0;
    let total = Object.keys(CORRECT_ANSWERS).length;

    Object.keys(CORRECT_ANSWERS).forEach((id) => {
      if (answers[id] === CORRECT_ANSWERS[id]) score++;
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

        // ✅ FIX 5: إذا ما في drop حقيقي → تجاهل
        if (!over || !over.id.startsWith("q")) {
          setActiveId(null);
          return;
        }

        setAnswers((prev) => {
          const next = { ...prev };

          // ✅ FIX 6: remove old position (move مش copy)
          Object.keys(next).forEach((k) => {
            if (next[k] === active.id) next[k] = null;
          });

          // ✅ FIX 7: set new
          next[over.id] = active.id;

          return next;
        });

        setActiveId(null);
      }}
    >
      <div className="main-container-component">
        <div className="div-forall" style={{ gap: "15px" }}>
          <h1 className="WB-header-title-page8">
            <span className="WB-ex-A">A</span>
            Look and write.
          </h1>
          <div className="flex flex-col">
            <div className="flex flex-wrap justify-center gap-3 p-4 rounded-xl">
              {CLOTHES.map((c) => (
                <DraggableItem
                  key={c.id}
                  item={c}
                  isUsed={Object.values(answers).includes(c.id)}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} className="flex items-center gap-4">
                  <span className="font-bold text-blue-900 text-xl">{num}</span>

                  <img
                    src={
                      [
                        imgTie,
                        imgSocks,
                        imgCap,
                        imgDress,
                        imgCloset,
                        imgJacket,
                      ][num - 1]
                    }
                    alt="cloth"
                    className="object-contain"
                    style={{ height: "120px", width: "120px" }}
                  />

                  <DropSlot
                    id={`q${num}`}
                    content={answers[`q${num}`]}
                    isCorrect={
                      answers[`q${num}`] === CORRECT_ANSWERS[`q${num}`]
                    }
                    isSubmitted={showResults}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              handleShowAnswer={() => {
                setAnswers(CORRECT_ANSWERS);
                setShowResults(true);
              }}
              handleStartAgain={() => {
                setAnswers({
                  q1: null,
                  q2: null,
                  q3: null,
                  q4: null,
                  q5: null,
                  q6: null,
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
          <div className="px-4 py-1 bg-white border-2 border-blue-500 rounded-full shadow-xl text-blue-600 font-bold">
            {CLOTHES.find((c) => c.id === activeId).text}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit8_Page45_Q1;

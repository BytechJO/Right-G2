import React, { useState } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
  closestCenter,
} from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import { useDroppable } from "@dnd-kit/core";
// check
// استيراد الصور
import imgSueClosetG from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 47/Ex G 1.svg";
import imgJohnClosetG from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 47/Ex G 2.svg";
import imgSue from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 47/Ex G 3.svg";

const WORDS_G = [
  { id: "g1", text: "two" },
  { id: "g2", text: "I don't have" },
  { id: "g3", text: "I have" },
  { id: "g4", text: "has" },
  { id: "g5", text: "doesn't have" },
  { id: "g6", text: "has" },
  { id: "g7", text: "has" },
];

const CORRECT_G = {
  g1: "g1",
  g2: "g2",
  g3: "g3",
  g4: "g4",
  g5: "g5",
  g6: "g6",
  g7: "g7",
};

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
      className={`px-3 py-1 bg-white border-2 border-gray-300 rounded-lg shadow-sm cursor-grab text-blue-600 font-medium text-lg ${
        isUsed
          ? "bg-gray-100 text-gray-400 pointer-events-none"
          : "hover:border-blue-400"
      }`}
    >
      {item.text}
    </div>
  );
}

function DropSlotG({ id, content, isCorrect, isSubmitted }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const isWrong = isSubmitted && content && !isCorrect;

  return (
    <div className="relative inline-block">
      <div
        ref={setNodeRef}
        className={`inline-block min-w-[80px] h-7 border-b-2 mx-1 px-1 text-center align-bottom transition-all border-blue-400`}
      >
        {content ? (
          <span
            className={`font-bold text-lg "text-blue-800"
            `}
          >
            {WORDS_G.find((w) => w.id === content).text}
          </span>
        ) : (
          <span className="text-gray-200 italic text-xs">____</span>
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

const WB_Unit8_Page47_Q2 = () => {
  const [answers, setAnswers] = useState({
    g1: null,
    g2: null,
    g3: null,
    g4: null,
    g5: null,
    g6: null,
    g7: null,
  });
  const [activeId, setActiveId] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  const checkAnswers = () => {
    const unanswered = Object.keys(CORRECT_G).filter((id) => !answers[id]);
    if (unanswered.length > 0) {
      ValidationAlert.info();
      return;
    }

    setShowResults(true);

    let score = 0;
    let total = Object.keys(CORRECT_G).length;

    Object.keys(CORRECT_G).forEach((id) => {
      if (answers[id] === CORRECT_G[id]) score++;
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

        if (!over.id.startsWith("g")) {
          setActiveId(null);
          return;
        }

        setAnswers((prev) => ({
          ...prev,
          [over.id]: active.id,
        }));

        setActiveId(null);
      }}
      collisionDetection={closestCenter}
    >
      <div className="main-container-component">
        <div className="div-forall" style={{ gap: "10px" }}>
          <h1 className="WB-header-title-page8">
            <span className="WB-ex-A">G</span>Read and write.
          </h1>

          <div className="flex flex-wrap justify-center gap-2 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 mb-8">
            <SortableContext items={WORDS_G.map((w) => w.id)}>
              {WORDS_G.map((w) => (
                <DraggableWord
                  key={w.id}
                  item={w}
                  isUsed={Object.values(answers).includes(w.id)}
                />
              ))}
            </SortableContext>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* فقرة سو */}
            <div className="flex-1 space-y-6">
              <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 relative shadow-sm">
                <p className="text-lg leading-relaxed">
                  Hello! This is my closet. I have{" "}
                  <DropSlotG
                    id="g1"
                    content={answers.g1}
                    isCorrect={answers.g1 === CORRECT_G.g1}
                    isSubmitted={showResults}
                  />{" "}
                  shirts, but{" "}
                  <DropSlotG
                    id="g2"
                    content={answers.g2}
                    isCorrect={answers.g2 === CORRECT_G.g2}
                    isSubmitted={showResults}
                  />{" "}
                  any skirts.
                  <DropSlotG
                    id="g3"
                    content={answers.g3}
                    isCorrect={answers.g3 === CORRECT_G.g3}
                    isSubmitted={showResults}
                  />{" "}
                  a big hat. It{" "}
                  <DropSlotG
                    id="g4"
                    content={answers.g4}
                    isCorrect={answers.g4 === CORRECT_G.g4}
                    isSubmitted={showResults}
                  />{" "}
                  a feather.
                </p>
                <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[15px] border-t-transparent border-l-[20px] border-l-gray-200 border-b-[15px] border-b-transparent"></div>
              </div>

              <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 relative shadow-sm">
                <p className="text-lg leading-relaxed">
                  This is John's closet. He
                  <DropSlotG
                    id="g5"
                    content={answers.g5}
                    isCorrect={answers.g5 === CORRECT_G.g5}
                    isSubmitted={showResults}
                  />{" "}
                  a tie. He{" "}
                  <DropSlotG
                    id="g6"
                    content={answers.g6}
                    isCorrect={answers.g6 === CORRECT_G.g6}
                    isSubmitted={showResults}
                  />{" "}
                  a cap. He{" "}
                  <DropSlotG
                    id="g7"
                    content={answers.g7}
                    isCorrect={answers.g7 === CORRECT_G.g7}
                    isSubmitted={showResults}
                  />{" "}
                  a pair of pants.
                </p>
                <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[15px] border-t-transparent border-l-[20px] border-l-gray-200 border-b-[15px] border-b-transparent"></div>
              </div>
            </div>

            {/* الشخصية والخزائن */}
            <div className="flex flex-col items-center gap-4">
              <img src={imgSue} alt="Sue" className="max-w-40 max-h-40" />
            </div>

            <div className="flex flex-col gap-4">
              <img
                src={imgSueClosetG}
                alt="Sue's Closet"
                className="max-w-48 max-h-48 rounded-xl border shadow-sm"
              />
              <img
                src={imgJohnClosetG}
                alt="John's Closet"
                className="max-w-48 max-h-48 rounded-xl border shadow-sm"
              />
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <Button
              handleShowAnswer={() => {
                setAnswers(CORRECT_G);
                setShowResults(true);
              }}
              handleStartAgain={() => {
                setAnswers({
                  g1: null,
                  g2: null,
                  g3: null,
                  g4: null,
                  g5: null,
                  g6: null,
                  g7: null,
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
          <div className="px-3 py-1 bg-white border-2 border-blue-500 rounded-lg shadow-xl text-blue-600 font-bold text-xs">
            {WORDS_G.find((w) => w.id === activeId).text}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit8_Page47_Q2;

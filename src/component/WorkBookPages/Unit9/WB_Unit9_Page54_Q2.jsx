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

import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 54/Ex H 1.svg";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 54/Ex H 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 54/Ex H 3.svg";

const exerciseHData = [
  {
    id: 1,
    image: img1,
    correctLetter: "C",
    correctSentence: "He isn't wearing boots.",
    options: ["A", "B", "C", "D"],
  },
  {
    id: 2,
    image: img2,
    correctLetter: "B",
    correctSentence: "He isn't wearing a purple shirt.",
    options: ["A", "B", "C", "D"],
  },
  {
    id: 3,
    image: img3,
    correctLetter: "D",
    correctSentence: "She isn't holding a doll.",
    options: ["A", "B", "C", "D"],
  },
];

const sentenceBank = [
  "He isn't wearing boots.",
  "He isn't wearing a purple shirt.",
  "She isn't holding a doll.",
];

const INITIAL = {
  1: { letter: "", sentence: "" },
  2: { letter: "", sentence: "" },
  3: { letter: "", sentence: "" },
};

/* 🔹 Draggable */
function DraggableItem({ type, value, parentId, children, disabled }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `${type}-${value}-${parentId}`, // 👈 مهم
      data: { type, value, parentId },
      disabled,
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
      {...(!disabled ? listeners : {})}
      {...(!disabled ? attributes : {})}
      className={`px-3 py-1 bg-white border-2 border-blue-400 rounded-lg shadow-sm
  ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-grab hover:bg-blue-50"}
  ${isDragging ? "opacity-0" : ""} // 👈 هذا هو الحل
`}
    >
      {children}
    </div>
  );
}
/* 🔹 Drop */
function DropZone({ id, type, children }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${type}-${id}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`transition-all ${isOver ? "bg-blue-50 border-blue-400" : ""}`}
    >
      {children}
    </div>
  );
}

const WB_Unit9_Page54_Q2 = () => {
  const [answers, setAnswers] = useState(INITIAL);
  const [activeItem, setActiveItem] = useState(null);
  const [checked, setChecked] = useState(false);
  const [locked, setLocked] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event) => {
    setActiveItem(event.active.data.current);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!over || locked) return;

    const dragged = active.data.current;

    const overId = over.id;
    const dropType = overId.split("-")[0];
    const dropId = Number(overId.split("-")[1]); // 👈 الحل هون

    if (dragged.type !== dropType) return;

    // ✅ منع نقل الحروف بين الصور
    if (dragged.type === "letter" && dragged.parentId !== dropId) return;

    setAnswers((prev) => ({
      ...prev,
      [dropId]: {
        ...prev[dropId],
        [dropType]: dragged.value,
      },
    }));
  };

  const checkAnswers = () => {
    const unanswered = Object.values(answers).filter(
      (a) => !a.letter || !a.sentence,
    );

    if (unanswered.length > 0) {
      ValidationAlert.info("Please complete all answers first!");
      return;
    }

    let correctCount = 0;

    exerciseHData.forEach((item) => {
      // ✅ letter لحاله
      if (answers[item.id].letter === item.correctLetter) {
        correctCount++;
      }

      // ✅ sentence لحالها
      if (answers[item.id].sentence === item.correctSentence) {
        correctCount++;
      }
    });

    setChecked(true);
    setLocked(true);

    ValidationAlert[
      correctCount === exerciseHData.length * 2
        ? "success"
        : correctCount > 0
          ? "warning"
          : "error"
    ](`Score: ${correctCount}/${exerciseHData.length * 2}`);
  };

  const handleShowAnswer = () => {
    const correctOnes = {};
    exerciseHData.forEach((item) => {
      correctOnes[item.id] = {
        letter: item.correctLetter,
        sentence: item.correctSentence,
      };
    });
    setAnswers(correctOnes);
    setChecked(true);
    setLocked(true);
  };

  const handleTryAgain = () => {
    setAnswers(INITIAL);
    setChecked(false);
    setLocked(false);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="main-container-component">
        <div className="div-forall" style={{ gap: "30px" }}>
          <h1 className="WB-header-title-page8">
            <span className="WB-ex-A">H</span> Which one is different?
          </h1>

          {/* Sentence Bank */}
          <div className="mb-10 p-4 bg-gray-50 rounded-xl border-2 border-blue-400 border-dashed flex flex-wrap gap-4 font-serif italic">
            {sentenceBank.map((s) => (
              <DraggableItem
                key={s}
                type="sentence"
                value={s}
                disabled={locked}
              >
                {s}
              </DraggableItem>
            ))}
          </div>

          {/* Rows */}
          <div className="flex flex-col gap-8">
            {exerciseHData.map((item) => (
              <div key={item.id} className="flex gap-6 items-center">
                {/* 🔹 الصورة + الحروف */}
                <div className="border-2 border-gray-800 rounded-2xl p-4 bg-white shadow-sm">
                  <img
                    src={item.image}
                    alt=""
                    className="max-h-40 max-w-60 object-contain"
                  />

                  <div className="flex justify-around mt-2 font-bold text-gray-600">
                    {item.options.map((opt) => (
                      <DraggableItem
                        key={opt}
                        type="letter"
                        value={opt}
                        parentId={item.id} // 👈 مهم
                        disabled={locked}
                      >
                        {opt}
                      </DraggableItem>
                    ))}
                  </div>
                </div>

                {/* 🔹 drop zones */}
                <div className="flex gap-4 flex-1">
                  {/* letter */}
                  <DropZone id={item.id} type="letter">
                    <div className="relative">
                      <div className="w-12 h-12 border-2 rounded-xl flex items-center justify-center font-bold text-xl">
                        {answers[item.id].letter}
                      </div>

                      {/* ❌ */}
                      {checked &&
                        answers[item.id].letter &&
                        answers[item.id].letter !== item.correctLetter && (
                          <span className="absolute -top-2 -right-2 text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold border-2 border-white shadow">
                            ✕
                          </span>
                        )}
                    </div>
                  </DropZone>

                  {/* sentence */}
                  <DropZone id={item.id} type="sentence">
                    <div className="relative">
                      <div className="min-w-[250px] border-b-2 px-2 py-2 font-serif italic">
                        {answers[item.id].sentence}
                      </div>

                      {/* ❌ */}
                      {checked &&
                        answers[item.id].sentence &&
                        answers[item.id].sentence !== item.correctSentence && (
                          <span className="absolute -top-2 -right-2 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-white shadow">
                            ✕
                          </span>
                        )}
                    </div>
                  </DropZone>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <Button
              handleShowAnswer={handleShowAnswer}
              handleStartAgain={handleTryAgain}
              checkAnswers={checkAnswers}
            />
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeItem && (
          <div className="px-4 py-2 bg-white border-2 border-blue-500 rounded-lg shadow-xl font-serif italic">
            {activeItem.value}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit9_Page54_Q2;

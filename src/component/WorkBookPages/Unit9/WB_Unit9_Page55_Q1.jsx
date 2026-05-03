import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";

import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 55/Ex I 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 55/Ex I 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 55/Ex I 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 55/Ex I 4.svg";

import {
  DndContext,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  DragOverlay,
} from "@dnd-kit/core";

const exerciseIData = [
  { id: 1, image: img1, correct: "drawing" },
  { id: 2, image: img2, correct: "reading" },
  { id: 3, image: img3, correct: "writing" },
  { id: 4, image: img4, correct: "painting" },
];

const wordBank = ["reading", "writing", "drawing", "painting"];

// ⭐ positions لكل صورة (عدليهم حسب مكان الفراغ بالصورة)
const positions = {
  1: { top: "11%", left: "50%" },
  2: { top: "11%", left: "55%" },
  3: { top: "11%", left: "55%" },
  4: { top: "25%", left: "50%" },
};

const DraggableWord = ({ word, disabled }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: word,
    data: { word },
    disabled,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,

  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{style,padding:"9px 22px"}}
      className={`WB-word-bank touch-none
        ${
          disabled
            ? "bg-gray-200 opacity-40 cursor-not-allowed"
            : "bg-white cursor-grab hover:bg-blue-50"
        }
      `}
    >
      {word}
    </div>
  );
};

const DropZone = ({ id, value, correct, checked }) => {
  const { setNodeRef } = useDroppable({ id: `${id}` });

  const isWrong = checked && value && value !== correct;

  return (
    <div
      ref={setNodeRef}
      className={`w-full h-7 border-b-2 flex items-center justify-center text-lg relative bg-white
        ${!value ? "border-gray-300 border-dashed" : ""}
        ${checked && value === correct ? "border-blue-500" : ""}
        ${isWrong ? "border-red-500" : ""}
      `}
    >
      {value}

      {isWrong && (
        <span className="absolute -top-2 -right-2 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg">
          ✕
        </span>
      )}
    </div>
  );
};

const WB_Unit9_Page55_Q1 = () => {
  const [userAnswers, setUserAnswers] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
  });
  const [checked, setChecked] = useState(false);
  const [locked, setLocked] = useState(false);
  const [activeWord, setActiveWord] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor)
  );

  const handleDragEnd = ({ active, over }) => {
    if (!over || locked) return;

    const word = active.data.current.word;
    const id = Number(over.id);

    setUserAnswers((prev) => {
      const updated = { ...prev };

      Object.keys(updated).forEach((key) => {
        if (updated[key] === word) {
          updated[key] = "";
        }
      });

      updated[id] = word;

      return updated;
    });
  };

  const checkAnswers = () => {
    if (checked || locked) return;

    const hasEmpty = Object.values(userAnswers).some((val) => !val);

    if (hasEmpty) {
      ValidationAlert.info("Please fill all answers!");
      return;
    }

    let correctCount = 0;

    exerciseIData.forEach((item) => {
      if (userAnswers[item.id] === item.correct) correctCount++;
    });

    setChecked(true);
    setLocked(true);

    if (correctCount === exerciseIData.length) {
      ValidationAlert.success(`Score: ${correctCount}/${exerciseIData.length}`);
    } else if (correctCount > 0) {
      ValidationAlert.warning(`Score: ${correctCount}/${exerciseIData.length}`);
    } else {
      ValidationAlert.error(`Score: ${correctCount}/${exerciseIData.length}`);
    }
  };

  const handleShowAnswer = () => {
    const correctAnswers = {};
    exerciseIData.forEach((item) => (correctAnswers[item.id] = item.correct));
    setUserAnswers(correctAnswers);
    setChecked(true);
    setLocked(true);
  };

  const handleTryAgain = () => {
    setUserAnswers({ 1: "", 2: "", 3: "", 4: "" });
    setChecked(false);
    setLocked(false);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => setActiveWord(active.data.current.word)}
      onDragEnd={(e) => {
        handleDragEnd(e);
        setActiveWord(null);
      }}
    >
      <div className="main-container-component">
        <div className="div-forall" style={{ gap: "25px" }}>
          <h1 className="WB-header-title-page8">
            <span className="WB-ex-A">I</span>Look and write.
          </h1>

          {/* Word Bank */}
          <div className="rounded-2xl p-4 flex justify-center gap-8 flex-wrap">
            {wordBank.map((word) => {
              const isUsed = Object.values(userAnswers).includes(word);

              return (
                <DraggableWord
                  key={word}
                  word={word}
                  disabled={locked || isUsed}
                />
              );
            })}
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {exerciseIData.map((item) => {
              const pos = positions[item.id];

              return (
                <div key={item.id} className="flex items-start gap-4">
                  <span className="text-2xl font-bold text-blue-800">
                    {item.id}
                  </span>

                  <div className="relative w-fit">
                    <img
                      src={item.image}
                      alt=""
                      className="object-contain"
                      style={{height:"170px" ,width:"auto"}}
                    />

                    {/* ⭐ DropZone فوق الصورة */}
                    <div
                      className="absolute"
                      style={{
                        top: pos.top,
                        left: pos.left,
                        transform: "translate(-50%, -50%)",
                        width: "60%",
                      }}
                    >
                      <DropZone
                        id={item.id}
                        value={userAnswers[item.id]}
                        correct={item.correct}
                        checked={checked}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <DragOverlay>
            {activeWord && (
              <div className="px-4 py-2 bg-white border-2 border-blue-500 rounded-lg shadow-xl font-bold">
                {activeWord}
              </div>
            )}
          </DragOverlay>

          <div className="flex justify-center">
            <Button
              handleShowAnswer={handleShowAnswer}
              handleStartAgain={handleTryAgain}
              checkAnswers={checkAnswers}
            />
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default WB_Unit9_Page55_Q1;
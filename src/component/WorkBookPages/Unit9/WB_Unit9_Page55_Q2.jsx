import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
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
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 55/Ex J 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 55/Ex J 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 55/Ex J 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 55/Ex J 4.svg";

const exerciseJData = [
  { id: 1, image: img1, before: "He's", after: "TV.", correct: "watching" },
  { id: 2, image: img2, before: "He's", after: "a book.", correct: "reading" },
  {
    id: 3,
    image: img3,
    before: "She's",
    after: "her bike.",
    correct: "riding",
  },
  {
    id: 4,
    image: img4,
    before: "He's",
    after: "basketball.",
    correct: "playing",
  },
];

const wordBank = ["reading", "watching", "playing", "riding"];

const DraggableWord = ({ word, disabled }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: word,
    data: { word },
    disabled,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{padding:"9px 22px"}}
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
      className={`min-w-[120px] h-10 border-b-2 flex items-center justify-center px-2 relative
        ${!value ? "border-gray-300" : ""}
        ${checked && value === correct ? "border-blue-500" : ""}
        ${isWrong ? "border-red-500" : ""}
      `}
    >
      <span className="font-bold">{value}</span>

      {isWrong && (
        <span className="absolute -top-2 -right-2 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-white shadow">
          ✕
        </span>
      )}
    </div>
  );
};

const WB_Unit9_Page55_Q2 = () => {
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
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 0,
        tolerance: 0,
      },
    }),
  );

  const handleDragEnd = ({ active, over }) => {
    if (!over || locked) return;

    const word = active.data.current.word;
    const id = Number(over.id);

    setUserAnswers((prev) => ({
      ...prev,
      [id]: word,
    }));
  };

 const checkAnswers = () => {
  if (locked || checked) return;

  // 🔴 تحقق إنو كل الانبوتات معبّية
  const hasEmpty = Object.values(userAnswers).some(
    (val) => val === "" || val === undefined
  );

  if (hasEmpty) {
    ValidationAlert.info("Please fill all answers!");
    return;
  }

  let correctCount = 0;

  exerciseJData.forEach((item) => {
    if (userAnswers[item.id] === item.correct) correctCount++;
  });

  setChecked(true);
  setLocked(true);

  if (correctCount === exerciseJData.length) {
    return ValidationAlert.success(
      `Score: ${correctCount}/${exerciseJData.length}`
    );
  } else if (correctCount > 0) {
    return ValidationAlert.warning(
      `Score: ${correctCount}/${exerciseJData.length}`
    );
  } else {
    return ValidationAlert.error(
      `Score: ${correctCount}/${exerciseJData.length}`
    );
  }
};

  const handleShowAnswer = () => {
    const correctAnswers = {};
    exerciseJData.forEach((item) => (correctAnswers[item.id] = item.correct));
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
        <div className="div-forall mb-10" style={{gap:"25px"}}>
          <h1 className="WB-header-title-page8">
            <span className="WB-ex-A">J</span>Look and write. Read.
          </h1>

          <div className="p-4 flex justify-center gap-8">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {exerciseJData.map((item) => (
              <div key={item.id} className="flex flex-col items-center gap-6">
                <div className="flex items-start gap-4 w-full">
                  <span className="text-2xl font-bold text-blue-900 w-6">
                    {item.id}
                  </span>

                  <div className="w-[200px] h-[100px] rounded-2xl overflow-hidden  flex items-center justify-center">
                    <img
                      src={item.image}
                      alt=""
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-lg font-medium text-gray-800 w-full pl-10">
                  <span>{item.before}</span>
                  <DropZone
                    id={item.id}
                    value={userAnswers[item.id]}
                    correct={item.correct}
                    checked={checked}
                  />
                  <span>{item.after}</span>
                </div>
              </div>
            ))}
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

export default WB_Unit9_Page55_Q2;

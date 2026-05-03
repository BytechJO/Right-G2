import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import {
  DndContext,
  useDraggable,
  useDroppable,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
 
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 53/Ex E 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 53/Ex E 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 53/Ex E 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 53/Ex E 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 53/Ex E 5.svg";
const exerciseData = [
  {
    id: 1,
    name: "",
    before: "",
    after: "a song.",
    correct: "She is singing",
    image: img1,
  },
  {
    id: 2,
    name: "",
    before: "",
    after: "dinner.",
    correct: "she is cooking",
    image: img2,
  },
  {
    id: 3,
    name: " ",
    before: "",
    after: "sunglasses.",
    correct: "They are wearing",
    image: img3,
  },
  {
    id: 4,
    name: "",
    before: "",
    after: "a horse.",
    correct: "They are riding",
    image: img4,
  },
  {
    id: 5,
    name: "",
    before: "",
    after: "sandwiches.",
    correct: "They are eating",
    image: img5,
  },
];

const wordBank = [
  "She is singing",
  "she is cooking",
  "They are wearing",
  "They are riding",
  "They are eating",
];
 
const DraggableWord = ({ word, disabled }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: word,
    data: { word },
    disabled,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x-10}px, ${transform.y-10}px)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      // style={style}
      className={`WB-word-bank touch-none
        ${
          disabled
            ? "bg-gray-100 text-gray-300 border-gray-200"
            : "bg-white border-blue-900 text-blue-900 cursor-grab"
        }
      `}
        style={{padding:"9px 15px"}}
    >
      {word}
    </div>
  );
};

const DropZone = ({ id, value, correct, checked, locked }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  const isWrong = checked && value && value !== correct;

  return (
    <div
      ref={setNodeRef}
      className={`w-full h-10 border-b-2 flex items-center justify-center px-2 relative transition-all duration-300
      
      ${!value ? "border-gray-400" : "border-gray-400 bg-blue-50"}
      
      // 🔥 تأثير أثناء السحب
      ${isOver ? "bg-blue-100 scale-105 border-blue-600 shadow-md" : ""}
      
      // ❌ خطأ بعد التصحيح
      ${isWrong ? "border-red-500 bg-white" : ""}
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
const WB_Unit9_Page53_Q1 = () => {
  const [userAnswers, setUserAnswers] = useState({
    1: "", // مثال محلول كما في الصورة
    2: "",
    3: "",
    4: "",
    5: "",
   
  });
  const [draggedWord, setDraggedWord] = useState(null);
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
    if (checked || locked) return;
    
    if (!over) return;

    const word = active.data.current.word;
    const id = over.id;

    if (locked) return;

    setUserAnswers((prev) => ({
      ...prev,
      [Number(id)]: word, // 🔥 رجّعها number
    }));
  };

  const checkAnswers = () => {
    if (checked || locked) return;
    const hasEmpty = Object.values(userAnswers).some(
  (val) => val === "" || val === undefined
);

if (hasEmpty) {
  ValidationAlert.info("Please fill all answers!");
  return;
}
    let correctCount = 0;
    exerciseData.forEach((item) => {
      if (userAnswers[item.id] === item.correct) {
        correctCount++;
      }
    });

    setChecked(true);
    setLocked(true);

    if (correctCount === exerciseData.length) {
      ValidationAlert.success(
        `Score: ${correctCount} / ${exerciseData.length}`,
      );
    }
    if (correctCount === 0) {
      ValidationAlert.error(`Score: ${correctCount} / ${exerciseData.length}`);
    } else {
      ValidationAlert.warning(
        `Score: ${correctCount} / ${exerciseData.length}`,
      );
    }
  };

  const handleShowAnswer = () => {
    const answers = {};
    exerciseData.forEach((item) => {
      answers[item.id] = item.correct;
    });
    setUserAnswers(answers);
    setChecked(true);
    setLocked(true);
  };

  const handleTryAgain = () => {
    setUserAnswers({ 1: "", 2: "", 3: "", 4: "", 5: ""});
    setChecked(false);
    setLocked(false);
    setDraggedWord(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => setActiveWord(active.data.current.word)}
      onDragEnd={(event) => {
        handleDragEnd(event);
        setActiveWord(null);
      }}
    >
      <div className="main-container-component">
        <div className="div-forall" style={{gap:"20px"}}>
          <h1 className="WB-header-title-page8">
            <span className="WB-ex-A">E</span>Look and write. Read.
          </h1>
      
      <div className="flex flex-col gap-3">
            <div className="border-2 border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-3 divide-x-2 divide-gray-800">
            <div className="p-4 flex flex-col gap-2">
              <div className="flex justify-between text-lg font-medium">
                <span>ride</span> <span>-</span>{" "}
                <span className="text-blue-700">riding</span>
              </div>
              <div className="flex justify-between text-lg font-medium">
                <span>wear</span> <span>-</span>{" "}
                <span className="text-blue-700">wearing</span>
              </div>
            </div>
            <div className="p-4 flex flex-col gap-2">
              <div className="flex justify-between text-lg font-medium">
                <span>eat</span> <span>-</span>{" "}
                <span className="text-blue-700">eating</span>
              </div>
              <div className="flex justify-between text-lg font-medium">
                <span>iron</span> <span>-</span>{" "}
                <span className="text-blue-700">ironing</span>
              </div>
            </div>
            <div className="p-4 flex flex-col gap-2">
              <div className="flex justify-between text-lg font-medium">
                <span>cook</span> <span>-</span>{" "}
                <span className="text-blue-700">cooking</span>
              </div>
              <div className="flex justify-between text-lg font-medium">
                <span>sing</span> <span>-</span>{" "}
                <span className="text-blue-700">singing</span>
              </div>
            </div>
          </div>
        </div>

          {/* Interactive Word Bank (Draggable) */}
          <div className="flex flex-wrap justify-center gap-4 mb-2 p-4">
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

          {/* Sentences Grid */}
          <div className="grid gap-x-16 gap-y-10">
            {exerciseData.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <span className="text-2xl font-bold text-blue-800 w-6">
                  {item.id}
                </span>

                <div className="flex items-center gap-4 w-full">
                  <div className="overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt=""
                      className="object-contain"
                      style={{ height: "100px", width: "auto" }}
                    />
                  </div>

                  <div className="flex items-center gap-2 text-lg font-medium text-gray-800 w-full">
                    <span>{item.name}</span>
                    <DropZone
                      id={`${item.id}`} // 🔥 حوله string
                      value={userAnswers[item.id]}
                      correct={item.correct}
                      checked={checked}
                      locked={locked}
                    />
                    <span className="w-[180px]">{item.after}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          </div>
          <DragOverlay>
            {activeWord ? (
              <div className="px-6 py-2 bg-white border-2 border-blue-400 rounded-lg shadow-xl text-blue-700">
                {activeWord}
              </div>
            ) : null}
          </DragOverlay>
          {/* Controls */}
          <div className="mt-16 flex justify-center">
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

export default WB_Unit9_Page53_Q1;

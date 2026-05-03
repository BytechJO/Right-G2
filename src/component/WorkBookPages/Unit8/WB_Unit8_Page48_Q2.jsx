import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
} from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Asset 50.svg";
import { DragOverlay } from "@dnd-kit/core";

const DraggableItem = ({ id, text, disabled }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { text },
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
      // style={style}
      className={`WB-word-bank touch-none
        ${
          disabled
            ? "bg-gray-200 text-gray-400 border-gray-300"
            : "bg-white border-blue-900 cursor-grab hover:bg-blue-100 text-blue-900"
        }`}
          style={{padding:"9px 15px"}}
    >
      {text}
    </div>
  );
};

function DropZone({ id, children, isCorrect, showResults }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`relative min-w-[180px] h-10 mx-2 px-4 flex items-center justify-center border-b-2 text-lg transition-all duration-200
     // 🔥 لما نسحب فوقه
      ${isOver ? "bg-blue-100 scale-105 border-blue-600 shadow-md" : ""}   
      ${children ? "border-blue-900" : "border-blue-900 bg-gray-50"}
      
    
      
      // ❌ غلط بعد التصحيح
      ${showResults && isCorrect === false ? "border-red-500 bg-white" : ""}
      `}
    >
      {children}

      {showResults && isCorrect === false && (
        <div className="absolute right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg">
          ✕
        </div>
      )}
    </div>
  );
}

const WB_Unit8_Page48_Q2 = () => {
  const initialData = [
    {
      id: 1,
      subject: "John",
      verb: "has a bike",
      correct: "has a bike",
    },
    {
      id: 2,
      subject: "Mom and my aunt",
      verb: "have dresses",
      correct: "have dresses",
    },
    {
      id: 3,
      subject: "Dad",
      verb: "has a tie",
      correct: "has a tie",
    },
    {
      id: 4,
      subject: "Grandpa",
      verb: "has glasses",
      correct: "has glasses",
    },
    {
      id: 5,
      subject: "Sarah and Jack",
      verb: "have toys",
      correct: "have toys",
    },
    {
      id: 6,
      subject: "Helen and Stella",
      verb: "have pink dresses",
      correct: "have pink dresses",
    },
  ];

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };
  const [options, setOptions] = useState(() =>
    shuffleArray(initialData.map((d) => d.correct)),
  );
  const [userAnswers, setUserAnswers] = useState(Array(6).fill(""));
  const [isCorrect, setIsCorrect] = useState(Array(6).fill(null));
  const [showResults, setShowResults] = useState(false);

  const [usedOptions, setUsedOptions] = useState([]);
  const [activeItem, setActiveItem] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
  );

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;
    const draggedText = active.data.current.text;
    const index = parseInt(over.id);
    const newAnswers = [...userAnswers];
    const oldValue = newAnswers[index];
    newAnswers[index] = draggedText;
    setUserAnswers(newAnswers);
    setUsedOptions((prev) => {
      let updated = [...prev];
      if (oldValue) updated = updated.filter((i) => i !== oldValue);
      if (!updated.includes(draggedText)) updated.push(draggedText);
      return updated;
    });
  };

  const checkAnswers = () => {
    if (showResults) return;
    if (userAnswers.some((a) => a === "")) {
      ValidationAlert.info("Please answer all questions!");
      return;
    }
    let score = 0;
    const results = userAnswers.map((ans, idx) => {
      const correct = ans === initialData[idx].correct;
      if (correct) score++;
      return correct;
    });
    setIsCorrect(results);
    setShowResults(true);
    const msg = `Score: ${score} / ${initialData.length}`;
    if (score === initialData.length) ValidationAlert.success(msg);
    else if (score > 0) ValidationAlert.warning(msg);
    else ValidationAlert.error(msg);
  };

  const showAnswer = () => {
    setUserAnswers(initialData.map((d) => d.correct));
    setIsCorrect(Array(initialData.length).fill(true));
    setShowResults(true);
  };

  const restart = () => {
    setUserAnswers(Array(6).fill(""));
    setIsCorrect(Array(6).fill(null));
    setUsedOptions([]);
    setShowResults(false);
    setOptions(shuffleArray(initialData.map((d) => d.correct)));
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => setActiveItem(active.data.current.text)}
      onDragEnd={(event) => {
        handleDragEnd(event);
        setActiveItem(null);
      }}
    >
      <div className="main-container-component">
        <div className="div-forall"  style={{gap:"25px"}}>
          <h1 className="WB-header-title-page8">
            <span className="WB-ex-A">I</span>Look and write.
          </h1>
          <div className="flex flex-col gap-5">
            <div className="px-6">
              <div className="flex flex-wrap gap-3 justify-center">
                {options.map((opt, i) => (
                  <DraggableItem
                    key={i}
                    id={`opt-${i}`}
                    text={opt}
                    disabled={usedOptions.includes(opt) || showResults}
                  />
                ))}
              </div>
            </div>

            <div className="relative flex gap-4 mb-3">
              <div className="flex flex-col md:flex-row justify-between w-full relative">
                <img src={img2} style={{ height: "550px", width: "auto" }} />
              </div>

              <div className="flex flex-col justify-center gap-6 mt-6 space-y-6 w-full">
                {initialData.map((item, idx) => (
                  <div key={idx} className="flex items-center">
                    <span className="font-bold text-blue-600 mr-4 w-6">
                      {item.id}
                    </span>
                    <span className="mr-2 font-medium w-[150px]">
                      {item.subject}
                    </span>
                    <DropZone
                      id={`${idx}`}
                      isCorrect={isCorrect[idx]}
                      showResults={showResults}
                    >
                      {userAnswers[idx]}
                    </DropZone>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DragOverlay>
            {activeItem ? (
              <div className="px-4 py-2 rounded-lg border-2 bg-white border-blue-400 shadow-xl text-blue-700">
                {activeItem}
              </div>
            ) : null}
          </DragOverlay>
          <div className="inline-flex z-20">
            <Button
              handleShowAnswer={showAnswer}
              handleStartAgain={restart}
              checkAnswers={checkAnswers}
            />
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default WB_Unit8_Page48_Q2;

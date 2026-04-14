import React, { useState, useRef, useEffect } from "react";
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
import imgJohn from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex I 1.svg";
import imgBike from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex I 2.svg";
import imgMomAunt from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex I 3.svg";
import imgDress from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex I 4.svg";
import imgDad from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex I 5.svg";
import imgTie from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex I 6.svg";
import imgGrandpa from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex I 7.svg";
import imgGlasses from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex I 8.svg";
import imgSarahJack from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex I 9.svg";
import imgDollRobot from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex I 10.svg";
import imgHelenStella from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex I 11.svg";
import imgDresses from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex I 12.svg";
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
      style={style}
      className={`px-4 py-2 rounded-lg border-2 font-medium touch-none
        ${
          disabled
            ? "bg-gray-200 text-gray-400 border-gray-300"
            : "bg-white border-blue-200 cursor-grab hover:border-blue-500 text-blue-700"
        }`}
    >
      {text}
    </div>
  );
};

const DropZone = ({ id, children, isCorrect, showResults }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`relative min-w-[180px] h-10 mx-2 px-4 flex items-center justify-center rounded-lg border-2 border-dashed transition-all
      ${children ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-50"}
      ${showResults && isCorrect === false ? "border-red-500 bg-white" : ""}
      `}
    >
      {children}

      {showResults && isCorrect === false && (
        <div className="absolute right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
          ✕
        </div>
      )}
    </div>
  );
};

const WB_Unit8_Page48_Q2 = () => {
  // Exercise Data based on the image
  const initialData = [
    {
      id: 1,
      subject: "John",
      verb: "has a bike",
      imageLeft: imgJohn,
      imageRight: imgBike,
      correct: "has a bike",
    },
    {
      id: 2,
      subject: "Mom and my aunt",
      verb: "have dresses",
      imageLeft: imgMomAunt,
      imageRight: imgDress,
      correct: "have dresses",
    },
    {
      id: 3,
      subject: "Dad",
      verb: "has a tie",
      imageLeft: imgDad,
      imageRight: imgTie,
      correct: "has a tie",
    },
    {
      id: 4,
      subject: "Grandpa has",
      verb: "glasses",
      imageLeft: imgGrandpa,
      imageRight: imgGlasses,
      correct: "glasses",
    },
    {
      id: 5,
      subject: "Sarah and Jack",
      verb: "have toys",
      imageLeft: imgSarahJack,
      imageRight: imgDollRobot,
      correct: "have toys",
    },
    {
      id: 6,
      subject: "Helen and Stella",
      verb: "have pink dresses",
      imageLeft: imgHelenStella,
      imageRight: imgDresses,
      correct: "have pink dresses",
    },
  ];

  // Mapping for the visual connections (as seen in the image)
  // Left index -> Right index (0-based)
  const connections = [
    [0, 4], // Family -> Toys
    [1, 3], // Grandpa -> Glasses
    [2, 0], // Boy -> Bike
    [3, 5], // Girls -> Pink Dresses
    [4, 2], // Dad -> Tie
    [5, 1], // Women -> Yellow Dress
  ];
  const options = initialData.map((d) => d.correct);

  const [userAnswers, setUserAnswers] = useState(Array(6).fill(""));
  const [isCorrect, setIsCorrect] = useState(Array(6).fill(null));
  const [showResults, setShowResults] = useState(false);
  const leftRefs = useRef([]);
  const rightRefs = useRef([]);
  const containerRef = useRef(null);
  const [lines, setLines] = useState([]);
  const [usedOptions, setUsedOptions] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100, // ⏱️ وقت خفيف قبل السحب
        tolerance: 5, // 👆 مسافة صغيرة
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

      if (oldValue) {
        updated = updated.filter((i) => i !== oldValue);
      }

      if (!updated.includes(draggedText)) {
        updated.push(draggedText);
      }

      return updated;
    });
  };

  // Calculate SVG lines for connections
  useEffect(() => {
    const updateLines = () => {
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const newLines = connections
          .map(([leftIdx, rightIdx]) => {
            const leftEl = leftRefs.current[leftIdx];
            const rightEl = rightRefs.current[rightIdx];
            if (leftEl && rightEl) {
              const leftRect = leftEl.getBoundingClientRect();
              const rightRect = rightEl.getBoundingClientRect();
              return {
                x1: leftRect.right - containerRect.left,
                y1: leftRect.top + leftRect.height / 2 - containerRect.top,
                x2: rightRect.left - containerRect.left,
                y2: rightRect.top + rightRect.height / 2 - containerRect.top,
              };
            }
            return null;
          })
          .filter((line) => line !== null);
        setLines(newLines);
      }
    };

    updateLines();
    // window.addEventListener("resize", updateLines);
    // return () => window.removeEventListener("resize", updateLines);
  }, []);

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
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        setActiveItem(active.data.current.text);
      }}
      onDragEnd={(event) => {
        handleDragEnd(event);
        setActiveItem(null);
      }}
    >
      <div className="main-container-component">
        <div className="div-forall" style={{ gap: "10px" }}>
          <h1 className="WB-header-title-page8">
            <span className="WB-ex-A">I</span>Look and write.
          </h1>
          {/* Draggable Options */}
          {/* Word Bank */}
          <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-300 border-dashed">
            <div className="flex flex-wrap gap-3">
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

          <div className="relative flex gap-4 mb-10 " ref={containerRef}>
            {/* SVG Layer for Connections */}
            <div className="flex flex-col md:flex-row justify-between w-full">
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ zIndex: 0 }}
              >
                {lines.map((line, i) => (
                  <path
                    key={i}
                    d={`M ${line.x1} ${line.y1} C ${line.x1 + 50} ${line.y1}, ${line.x2 - 50} ${line.y2}, ${line.x2} ${line.y2}`}
                    stroke="black"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    fill="none"
                    opacity="0.4"
                  />
                ))}
              </svg>

              {/* Left Images */}
              <div className="col-span-2 flex flex-col justify-between py-4 space-y-2">
                {initialData.map((item, idx) => (
                  <div
                    key={`left-${idx}`}
                    ref={(el) => (leftRefs.current[idx] = el)}
                    className="relative flex items-center justify-end"
                  >
                    <img
                      src={item.imageLeft}
                      alt="subject"
                      className="object-contain"
                      style={{ height: "90px", width: "90px" }}
                    />
                    <div className="w-3 h-3 bg-red-500 rounded-full ml-2"></div>
                  </div>
                ))}
              </div>

              {/* Right Images */}
              <div className="col-span-2 flex flex-col justify-between py-4 space-y-2">
                {initialData.map((item, idx) => (
                  <div
                    key={`right-${idx}`}
                    ref={(el) => (rightRefs.current[idx] = el)}
                    className="relative flex items-center"
                  >
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <img
                      src={item.imageRight}
                      alt="object"
                      className="object-contain"
                      style={{ height: "90px", width: "90px" }}
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* Sentences with Drop Zones */}
            <div className="flex flex-col justify-center gap-6 mt-6 space-y-8 w-full">
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
          <DragOverlay>
            {activeItem ? (
              <div className="px-4 py-2 rounded-lg border-2 bg-white border-blue-400 shadow-xl text-blue-700">
                {activeItem}
              </div>
            ) : null}
          </DragOverlay>
          {/* Buttons */}
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

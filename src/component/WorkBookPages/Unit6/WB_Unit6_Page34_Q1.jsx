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
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";

import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 34/Ex C 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 34/Ex C 4.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 34/Ex C 2.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 34/Ex C 5.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 34/Ex C 3.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 34/Ex C 6.svg";

const NUMBERS = [
  { id: "n1", val: "1" },
  { id: "n2", val: "2" },
  { id: "n3", val: "3" },
  { id: "n4", val: "4" },
  { id: "n5", val: "5" },
  { id: "n6", val: "6" },
];

const CORRECT_ANSWERS = {
  slot_getup: "n1",
  slot_brushteeth: "n2",
  slot_washface: "n3",
  slot_brushhair: "n4",
  slot_eatbreakfast: "n5",
  slot_goschool: "n6",
};

function DraggableNumber({ num, isUsed }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: num.id });

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
      className={`w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full font-bold text-xl cursor-grab shadow-md ${
        isUsed ? "opacity-30 pointer-events-none" : "hover:scale-110"
      }`}
    >
      {num.val}
    </div>
  );
}

function ImageSlot({ id, imgSrc, content, isCorrect, isSubmitted }) {
  const { setNodeRef, isOver } = useSortable({ id });
  const borderColor = isOver ? "border-blue-500" : "border-gray-200";
  const isWrong = isSubmitted && content && !isCorrect;

  return (
    <div ref={setNodeRef} className="relative group">
      <img
        src={imgSrc}
        alt="activity"
        className={`max-w-32 max-h-32 rounded-full border-4 object-cover transition-all ${borderColor}`}
      />

      <div
        className={`absolute bottom-0 right-0 w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-lg shadow-inner ${
          content
            ? "bg-blue-500 text-white border-blue-600"
            : "bg-white border-gray-300"
        }`}
      >
        {content ? NUMBERS.find((n) => n.id === content).val : ""}
      </div>

      {isWrong && (
        <div className="absolute top-1 right-1 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shadow border-2 border-white">
          <span className="text-white text-lg font-bold">✕</span>
        </div>
      )}
    </div>
  );
}

const WB_Unit6_Page34_Q1 = () => {
  const [placedNumbers, setPlacedNumbers] = useState({
    slot_getup: null,
    slot_brushteeth: null,
    slot_washface: null,
    slot_brushhair: null,
    slot_eatbreakfast: null,
    slot_goschool: null,
  });
  const [activeId, setActiveId] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && over.id.startsWith("slot")) {
      setPlacedNumbers((prev) => ({ ...prev, [over.id]: active.id }));
    }
    setActiveId(null);
  };

  const checkAnswers = () => {
    if (isSubmitted) return;
    const hasEmpty = Object.values(placedNumbers).some(
      (value) => value === null,
    );
    if (hasEmpty) {
      ValidationAlert.info("Please complete all answers before checking.");
      return;
    }

    let currentScore = 0;
    Object.keys(CORRECT_ANSWERS).forEach((key) => {
      if (placedNumbers[key] === CORRECT_ANSWERS[key]) currentScore++;
    });

    const total = Object.keys(CORRECT_ANSWERS).length;
    const scoreMessage = `Your score: ${currentScore} / ${total}`;

    if (currentScore === total) {
      ValidationAlert.success(scoreMessage);
    } else if (currentScore === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }

    setIsSubmitted(true);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"25px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">C</span>Read, look, and number.
        </h1>

        <DndContext
          sensors={sensors}
          onDragStart={(e) => setActiveId(e.active.id)}
          onDragEnd={handleDragEnd}
        >
          <div >
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-6 text-xl font-medium text-gray-600">
                <p className="flex gap-3">
                  <span className="text-blue-900 text-xl font-bold">1</span>
                  Helen gets up.
                </p>
                <p className="flex gap-3">
                  <span className="text-blue-900 text-xl font-bold">2</span>
                  She brushes her teeth.
                </p>
                <p className="flex gap-3">
                  <span className="text-blue-900 text-xl font-bold">3</span>
                  Helen washes her face.
                </p>
                <p className="flex gap-3">
                  <span className="text-blue-900 text-xl font-bold">4</span>
                  She brushes her hair.
                </p>
                <p className="flex gap-3">
                  <span className="text-blue-900 text-xl font-bold">5</span>
                  She eats breakfast.
                </p>
                <p className="flex gap-3">
                  <span className="text-blue-900 text-xl font-bold">6</span>
                  Helen goes to school.
                </p>

                <div className="mt-10 p-4 bg-blue-50 rounded-lg border-2 border-dashed border-blue-200">
                  <p className="text-sm text-blue-600 mb-3 text-center font-bold">
                    Drag numbers to the images:
                  </p>
                  <div className="flex justify-center gap-3">
                    <SortableContext items={NUMBERS.map((n) => n.id)}>
                      {NUMBERS.map((n) => (
                        <DraggableNumber
                          key={n.id}
                          num={n}
                          isUsed={Object.values(placedNumbers).includes(n.id)}
                        />
                      ))}
                    </SortableContext>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <ImageSlot
                  id="slot_brushteeth"
                  imgSrc={img1}
                  content={placedNumbers.slot_brushteeth}
                  isCorrect={
                    placedNumbers.slot_brushteeth ===
                    CORRECT_ANSWERS.slot_brushteeth
                  }
                  isSubmitted={isSubmitted}
                />
                <ImageSlot
                  id="slot_getup"
                  imgSrc={img2}
                  content={placedNumbers.slot_getup}
                  isCorrect={
                    placedNumbers.slot_getup === CORRECT_ANSWERS.slot_getup
                  }
                  isSubmitted={isSubmitted}
                />
                <ImageSlot
                  id="slot_brushhair"
                  imgSrc={img3}
                  content={placedNumbers.slot_brushhair}
                  isCorrect={
                    placedNumbers.slot_brushhair ===
                    CORRECT_ANSWERS.slot_brushhair
                  }
                  isSubmitted={isSubmitted}
                />
                <ImageSlot
                  id="slot_washface"
                  imgSrc={img4}
                  content={placedNumbers.slot_washface}
                  isCorrect={
                    placedNumbers.slot_washface ===
                    CORRECT_ANSWERS.slot_washface
                  }
                  isSubmitted={isSubmitted}
                />
                <ImageSlot
                  id="slot_goschool"
                  imgSrc={img5}
                  content={placedNumbers.slot_goschool}
                  isCorrect={
                    placedNumbers.slot_goschool ===
                    CORRECT_ANSWERS.slot_goschool
                  }
                  isSubmitted={isSubmitted}
                />
                <ImageSlot
                  id="slot_eatbreakfast"
                  imgSrc={img6}
                  content={placedNumbers.slot_eatbreakfast}
                  isCorrect={
                    placedNumbers.slot_eatbreakfast ===
                    CORRECT_ANSWERS.slot_eatbreakfast
                  }
                  isSubmitted={isSubmitted}
                />
              </div>
            </div>

            <Button
              handleShowAnswer={() => {
                setPlacedNumbers(CORRECT_ANSWERS);
                setIsSubmitted(true);
              }}
              handleStartAgain={() => {
                setPlacedNumbers({
                  slot_getup: null,
                  slot_brushteeth: null,
                  slot_washface: null,
                  slot_brushhair: null,
                  slot_eatbreakfast: null,
                  slot_goschool: null,
                });
                setIsSubmitted(false);
              }}
              checkAnswers={checkAnswers}
            />
          </div>

          <DragOverlay>
            {activeId ? (
              <div className="max-w-10 max-h-10 flex items-center justify-center bg-orange-600 text-white rounded-full font-bold text-xl shadow-2xl scale-110">
                {NUMBERS.find((n) => n.id === activeId).val}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default WB_Unit6_Page34_Q1;

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
// check
import imgShower from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 57/SVG/1.svg";
import imgBike from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 57/SVG/Asset 2.svg";
import imgSoccer from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 57/SVG/Asset 3.svg";

import imgFlowers from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 57/SVG/Asset 4.svg";
import imgNewspaper from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 57/SVG/Asset 5.svg";
import imgTV from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 57/SVG/Asset 6.svg";
import imgJacket from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 57/SVG/Asset 7.svg";
import imgCooking from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 57/SVG/Asset 8.svg";

const ACTIVITIES = [
  { id: "act1", text: "He's taking a shower." },
  { id: "act2", text: "She's riding her bike." },
  { id: "act3", text: "They're playing soccer." },
  { id: "act4", text: "She's watering the flowers." },
  { id: "act5", text: "He's reading the newspaper." },
  { id: "act6", text: "She's watching TV." },
  { id: "act7", text: "He's putting on his jacket." },
  { id: "act8", text: "She's cooking." },
];

const CORRECT_ANSWERS = {
  q1: "act1",
  q2: "act2",
  q3: "act3",
  q4: "act4",
  q5: "act5",
  q6: "act6",
  q7: "act7",
  q8: "act8",
};

function DraggableActivity({ item, isUsed }) {
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
      className={`p-2 bg-white border-2 border-gray-200 rounded-xl shadow-sm cursor-grab text-blue-700 font-medium text-base text-center touch-none ${isUsed ? "bg-gray-50 text-gray-300 pointer-events-none" : "hover:border-blue-400 hover:shadow-md transition-all"}`}
    >
      {item.text}
    </div>
  );
}
function DropSlot({ id, content, isCorrect, isSubmitted }) {
  const { setNodeRef, isOver } = useSortable({ id });

  const borderColor = isSubmitted
    ? isCorrect
      ? "border-blue-400"
      : "border-red-500"
    : isOver
      ? "border-blue-400 bg-blue-50"
      : "border-gray-300";

  return (
    <div
      ref={setNodeRef}
      className={`relative w-full min-h-[40px] border-b-2 flex items-center justify-center px-2 transition-all ${borderColor}`}
    >
      {/* ❌ Wrong Answer Icon */}
      {isSubmitted && content && !isCorrect && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow">
          ✕
        </div>
      )}

      {content ? (
        <span className="text-blue-900 text-[17px] text-center">
          {ACTIVITIES.find((a) => a.id === content).text}
        </span>
      ) : (
        <span className="text-gray-300 italic text-xs">
          Drop answer here...
        </span>
      )}
    </div>
  );
}

const WB_Unit10_Page57_Q1 = () => {
  const [answers, setAnswers] = useState({
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null,
    q6: null,
    q7: null,
    q8: null,
  });
  const [activeId, setActiveId] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };
  const [shuffledActivities, setShuffledActivities] = useState(() =>
    shuffleArray(ACTIVITIES),
  );
// ✨ تعديل: منع الكليك من إنه ينحسب drag
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8, // لازم يتحرك 8px عشان يبدأ drag
    },
  })
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
    if (score === total) ValidationAlert.success(`Score: ${score} / ${total}`);
    else if (score > 0) ValidationAlert.warning(`Score: ${score} / ${total}`);
    else ValidationAlert.error(`Score: ${score} / ${total}`);
  };

  const handleReset = () => {
    setAnswers({
      q1: null,
      q2: null,
      q3: null,
      q4: null,
      q5: null,
      q6: null,
      q7: null,
      q8: null,
    });
    setShowResults(false);
    setShuffledActivities(shuffleArray(ACTIVITIES));
  };

  const QUESTIONS = [
    { id: "q1", text: "1. What's he doing?", img: imgShower },
    { id: "q2", text: "2. What's she doing?", img: imgBike },
    { id: "q3", text: "3. What are they doing?", img: imgSoccer },
    { id: "q4", text: "4. What's she doing?", img: imgFlowers },
    { id: "q5", text: "5. What's he doing?", img: imgNewspaper },
    { id: "q6", text: "6. What's she doing?", img: imgTV },
    { id: "q7", text: "7. What's he doing?", img: imgJacket },
    { id: "q8", text: "8. What's she doing?", img: imgCooking },
  ];

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(e) => setActiveId(e.active.id)}
     // ✨ تعديل: تأكد إنه dropped داخل dropzone فعلي
onDragEnd={(e) => {
  if (e.over && e.over.id in answers) {
    setAnswers((prev) => ({
      ...prev,
      [e.over.id]: e.active.id,
    }));
  }
  setActiveId(null);
}}
    >
      <div className="main-container-component">
        <div className="div-forall"  style={{gap:"25px"}}>
          <h1 className="WB-header-title-page8">
            <span className="WB-ex-A">A</span>Look and write.
          </h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* شبكة الأسئلة */}
            <div className="flex-[2] grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {QUESTIONS.map((q) => (
                <div key={q.id} className="space-y-3">
                  <p className="text-gray-700 text-[16px]">{q.text}</p>
                  <div className="p-2 rounded-xl flex justify-center">
                    <img
                      src={q.img}
                      alt="activity"
                      className="object-contain rounded-lg"
                      style={{height:"85px"}}
                    />
                  </div>
                  <DropSlot
                    id={q.id}
                    content={answers[q.id]}
                    isCorrect={answers[q.id] === CORRECT_ANSWERS[q.id]}
                    isSubmitted={showResults}
                  />
                </div>
              ))}
            </div>

            {/* بنك الإجابات */}
            <div className="flex-1 bg-blue-50 p-5 rounded-2xl border-2 border-blue-100 h-fit sticky top-4">
              <h3 className="font-bold text-blue-800 mb-4 text-center">
                Activities Bank
              </h3>
              <div className="grid grid-cols-1 gap-2">
                <SortableContext items={shuffledActivities.map((a) => a.id)}>
                  {shuffledActivities.map((act) => (
                    <DraggableActivity
                      key={act.id}
                      item={act}
// ✨ تعديل: تجاهل القيم الفاضية
isUsed={Object.values(answers).filter(Boolean).includes(act.id)}                    />
                  ))}
                </SortableContext>
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <Button
              handleShowAnswer={() => {
                setAnswers(CORRECT_ANSWERS);
                setShowResults(true);
              }}
              handleStartAgain={handleReset}
              checkAnswers={checkAnswers}
            />
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="p-3 bg-white border-2 border-blue-500 rounded-xl shadow-2xl text-blue-700 font-bold text-xs scale-105">
            {ACTIVITIES.find((a) => a.id === activeId).text}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit10_Page57_Q1;

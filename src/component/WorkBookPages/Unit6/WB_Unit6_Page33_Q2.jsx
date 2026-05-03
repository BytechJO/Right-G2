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
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 33/Asset 19.svg"
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 33/Asset 20.svg"
const QUESTIONS = [
  { id: "q1", text: "1 What time does she have lunch?" },
  { id: "q2", text: "2 What time does she go to school?" },
  { id: "q3", text: "3 What time does she get up?" },
  { id: "q4", text: "4 What time do they do their homework?" },
  { id: "q5", text: "5 What time do they go home?" },
  { id: "q6", text: "6 What time do they have dinner?" },
];

const ANSWERS_POOL = [
  { id: "a1", text: "She has lunch at twelve o'clock." },
  { id: "a2", text: "She goes to school at 7:30." },
  { id: "a3", text: "She gets up at 6:00." },
  { id: "a4", text: "They do their homework at 4:00." },
  { id: "a5", text: "They go home at 2:00." },
  { id: "a6", text: "They have dinner at 8:30." },
];

const CORRECT_MAP = {
  q1: "a1",
  q2: "a2",
  q3: "a3",
  q4: "a4",
  q5: "a5",
  q6: "a6",
};

function DraggableSentence({ answer, isUsed }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: answer.id,
    disabled: isUsed, // 🔒
  });

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
      {...(!isUsed ? listeners : {})}
      className={`w-full p-2 border rounded shadow-sm text-sm transition
        ${
          isUsed
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-blue-700 cursor-grab hover:border-blue-500"
        }`}
    >
      {answer.text}
    </div>
  );
}
function AnswerDropZone({ id, content, isCorrect, isSubmitted }) {
  const { setNodeRef, isOver } = useSortable({ id });

  const bg = isOver
    ? "bg-blue-50 border-blue-400"
    : "bg-gray-50 border-gray-300";

  return (
    <div
      ref={setNodeRef}
      className={`relative mt-1 min-h-[40px] border-b-2 p-2 transition-all ${bg}`}
    >
      {content ? (
        <span className="text-blue-800 font-medium">
          {ANSWERS_POOL.find((a) => a.id === content).text}
        </span>
      ) : (
        <span className="text-gray-300 italic text-sm">
          Drag answer here...
        </span>
      )}

      {/* ✕ إذا الجواب غلط */}
      {isSubmitted && content && !isCorrect && (
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow border-2 border-white">
          <span className="text-white text-sm font-bold">✕</span>
        </div>
      )}
    </div>
  );
}

const WB_Unit6_Page33_Q2 = () => {
  const [placedAnswers, setPlacedAnswers] = useState({
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null,
    q6: null,
  });
  const [activeId, setActiveId] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && over.id.startsWith("q")) {
      setPlacedAnswers((prev) => ({ ...prev, [over.id]: active.id }));
    }
    setActiveId(null);
  };

  const checkAnswers = () => {
    if (isSubmitted) return;
    const hasEmpty = Object.values(placedAnswers).some((v) => v === null);
    if (hasEmpty) {
      ValidationAlert.info();
      return;
    }
    let currentScore = 0;
    Object.keys(CORRECT_MAP).forEach((qId) => {
      if (placedAnswers[qId] === CORRECT_MAP[qId]) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setIsSubmitted(true);
    const total = Object.keys(CORRECT_MAP).length;
    const scoreMessage = `Score: ${currentScore} / ${total}`;
    if (currentScore === total) {
      ValidationAlert.success(scoreMessage);
    } else if (currentScore === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  const handleShowAnswer = () => {
    setPlacedAnswers(CORRECT_MAP);

    const total = Object.keys(CORRECT_MAP).length;

    setScore(total);
    setIsSubmitted(true);

  };

  return (
    <div className="main-container-component">
      <div className="div-forall mb-10"  style={{gap:"25px"}}>
        <h1 className="WB-header-title-page8">
          <div className="WB-ex-A">B</div>Read and write.
        </h1>

        <DndContext
          sensors={sensors}
          onDragStart={(e) => setActiveId(e.active.id)}
          onDragEnd={handleDragEnd}
        >
          <div className="p-6 max-w-5xl flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-6">
              {QUESTIONS.map((q) => (
                <div key={q.id} className="border-l-4 border-blue-500 pl-4">
                  <p className="font-semibold text-gray-800">{q.text}</p>
                  <AnswerDropZone
                    id={q.id}
                    content={placedAnswers[q.id]}
                    isCorrect={placedAnswers[q.id] === CORRECT_MAP[q.id]}
                    isSubmitted={isSubmitted}
                  />
                </div>
              ))}
            </div>

            {/* القسم الأيمن: بنك الإجابات والجداول المساعدة */}
            <div className="flex flex-col items-center w-full md:w-90 space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <h3 className="font-bold text-blue-800 mb-3 text-center">
                  Answers Bank
                </h3>
                <div className="space-y-2">
                  <SortableContext items={ANSWERS_POOL.map((a) => a.id)}>
                    {ANSWERS_POOL.map((ans) => (
                      <DraggableSentence
                        key={ans.id}
                        answer={ans}
                        isUsed={Object.values(placedAnswers).includes(ans.id)}
                      />
                    ))}
                  </SortableContext>
                </div>
              </div>

       
                <img src={img1} style={{height:"200px",width:"70%"}}/>
           
            
                <img src={img2}  style={{height:"200px",width:"70%"}}/>
               
         
            </div>
          </div>

          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={() => {
              setPlacedAnswers({
                q1: null,
                q2: null,
                q3: null,
                q4: null,
                q5: null,
                q6: null,
              });
              setIsSubmitted(false);
            }}
            checkAnswers={checkAnswers}
          />

          <DragOverlay>
            {activeId ? (
              <div className="p-2 bg-white border-2 border-blue-500 rounded shadow-xl text-blue-800 text-sm font-bold">
                {ANSWERS_POOL.find((a) => a.id === activeId).text}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default WB_Unit6_Page33_Q2;

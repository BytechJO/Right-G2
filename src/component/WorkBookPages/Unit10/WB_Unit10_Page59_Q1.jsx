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

import imgEating from "../../../assets/imgs/test6.png";
import imgJacket from "../../../assets/imgs/test6.png";
import imgSoccer from "../../../assets/imgs/test6.png";
import imgClimbing from "../../../assets/imgs/test6.png";
import imgTV from "../../../assets/imgs/test6.png";
import imgReading from "../../../assets/imgs/test6.png";

const ANSWERS_D = [
  { id: "ans1", text: "She's eating." },
  { id: "ans2", text: "He's putting on a jacket." },
  { id: "ans3", text: "They're playing soccer." },
  { id: "ans4", text: "It's climbing." },
  { id: "ans5", text: "She's watching TV." },
  { id: "ans6", text: "He's reading a book." },
];

const CORRECT_D = {
  q1_sel: "she",
  q1_drop: "ans1",
  q2_sel: "he",
  q2_drop: "ans2",
  q3_sel: "are they",
  q3_drop: "ans3",
  q4_sel: "is it",
  q4_drop: "ans4",
  q5_sel: "is she",
  q5_drop: "ans5",
  q6_sel: "is he",
  q6_drop: "ans6",
};

function DraggableAnswer({ item, isUsed }) {
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
      className={`p-2 bg-white border-2 border-gray-200 rounded-lg shadow-sm cursor-grab text-blue-700 font-medium text-sm text-center ${isUsed ? "bg-gray-50 text-gray-300 pointer-events-none" : "hover:border-blue-400"}`}
    >
      {item.text}
    </div>
  );
}

const WB_Unit10_Page59_Q1 = () => {
  const [answers, setAnswers] = useState({
    q1_sel: "",
    q1_drop: null,
    q2_sel: "",
    q2_drop: null,
    q3_sel: "",
    q3_drop: null,
    q4_sel: "",
    q4_drop: null,
    q5_sel: "",
    q5_drop: null,
    q6_sel: "",
    q6_drop: null,
  });
  const [activeId, setActiveId] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  const checkAnswers = () => {
    const unanswered = Object.keys(CORRECT_D).filter((id) => !answers[id]);
    if (unanswered.length > 0) {
      ValidationAlert.info();
      return;
    }
    setShowResults(true);
    let score = 0;
    Object.keys(CORRECT_D).forEach((id) => {
      if (answers[id] === CORRECT_D[id]) score++;
    });
    const total = Object.keys(CORRECT_D).length;
    const msg = `Score: ${score} / ${total}`;
    if (score === total) ValidationAlert.success(msg);
    else if (score > 0) ValidationAlert.warning(msg);
    else ValidationAlert.error(msg);
  };

  const handleReset = () => {
    setAnswers({
      q1_sel: "",
      q1_drop: null,
      q2_sel: "",
      q2_drop: null,
      q3_sel: "",
      q3_drop: null,
      q4_sel: "",
      q4_drop: null,
      q5_sel: "",
      q5_drop: null,
      q6_sel: "",
      q6_drop: null,
    });
    setShowResults(false);
  };

  const QUESTIONS = [
    {
      id: "q1",
      img: imgEating,
      prefix: "What's ",
      suffix: " doing?",
      options: ["she", "he", "it"],
    },
    {
      id: "q2",
      img: imgJacket,
      prefix: "What's ",
      suffix: " doing?",
      options: ["she", "he", "it"],
    },
    {
      id: "q3",
      img: imgSoccer,
      prefix: "What ",
      suffix: " doing?",
      options: ["are they", "is he", "is she"],
    },
    {
      id: "q4",
      img: imgClimbing,
      prefix: "What ",
      suffix: " doing?",
      options: ["is it", "is he", "is she"],
    },
    {
      id: "q5",
      img: imgTV,
      prefix: "What ",
      suffix: " doing?",
      options: ["is she", "is he", "are they"],
    },
    {
      id: "q6",
      img: imgReading,
      prefix: "What ",
      suffix: " doing?",
      options: ["is he", "is she", "is it"],
    },
  ];

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(e) => setActiveId(e.active.id)}
      onDragEnd={(e) => {
        if (e.over)
          setAnswers((prev) => ({ ...prev, [e.over.id]: e.active.id }));
        setActiveId(null);
      }}
    >
      <div className="main-container-component">
        <div className="div-forall" style={{ gap: "15px" }}>
          <h1 className="WB-header-title-page8">
            <span className="WB-ex-A">D</span> Look. Write the questions and
            then the answers.
          </h1>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-[2] space-y-6">
              {QUESTIONS.map((q, idx) => (
                <div
                  key={q.id}
                  className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100"
                >
                  <span className="font-bold text-gray-400 w-4">{idx + 1}</span>
                  <img
                    src={q.img}
                    alt="activity"
                    className="max-w-16 max-h-16 object-cover rounded-lg border"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center text-lg">
                      <span className="text-gray-700">{q.prefix}</span>
                      <div className="relative inline-block mx-4">
                        {/* ❌ Wrong Answer */}
                        {showResults &&
                          answers[`${q.id}_sel`] &&
                          answers[`${q.id}_sel`] !==
                            CORRECT_D[`${q.id}_sel`] && (
                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow">
                              ✕
                            </div>
                          )}

                        <select
                          value={answers[`${q.id}_sel`]}
                          onChange={(e) =>
                            setAnswers({
                              ...answers,
                              [`${q.id}_sel`]: e.target.value,
                            })
                          }
                          disabled={showResults}
                          className="p-1 border-b-2 bg-transparent w-25 focus:outline-none font-bold"
                        >
                          <option value="">...</option>
                          {q.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                      <span className="text-gray-700">{q.suffix}</span>
                    </div>
                    <DropZone
                      id={`${q.id}_drop`}
                      content={answers[`${q.id}_drop`]}
                      isCorrect={
                        answers[`${q.id}_drop`] === CORRECT_D[`${q.id}_drop`]
                      }
                      isSubmitted={showResults}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex-1 bg-blue-50 p-5 rounded-2xl border-2 border-blue-100 h-fit sticky top-4">
              <h3 className="font-bold text-blue-800 mb-4 text-center">
                Answers Bank
              </h3>
              <div className="grid grid-cols-1 gap-2">
                <SortableContext items={ANSWERS_D.map((a) => a.id)}>
                  {ANSWERS_D.map((ans) => (
                    <DraggableAnswer
                      key={ans.id}
                      item={ans}
                      isUsed={Object.values(answers).includes(ans.id)}
                    />
                  ))}
                </SortableContext>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <Button
              handleShowAnswer={() => {
                setAnswers(CORRECT_D);
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
          <div className="p-2 border-2 border-blue-500 rounded-lg shadow-xl text-blue-700 font-bold text-xs">
            {ANSWERS_D.find((a) => a.id === activeId).text}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

function DropZone({ id, content, isCorrect, isSubmitted }) {
  const { setNodeRef } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      className="relative w-full min-h-[35px] border-b-2 flex items-center px-2"
    >
      {/* ❌ Wrong Answer */}
      {isSubmitted && content && !isCorrect && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow">
          ✕
        </div>
      )}

      {content ? (
        <span className="text-lg">
          {ANSWERS_D.find((a) => a.id === content).text}
        </span>
      ) : (
        <span className="text-gray-200 italic text-[10px]">
          drop answer here...
        </span>
      )}
    </div>
  );
}

export default WB_Unit10_Page59_Q1;

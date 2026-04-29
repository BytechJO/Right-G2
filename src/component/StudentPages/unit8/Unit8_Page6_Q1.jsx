import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";

import imgA from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 69/Ex D 1.svg";
import imgB from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 69/Ex D 2.svg";

const Unit8_Page6_Q1 = () => {
  const answersBank = [
    "He has two pairs of socks.",
    "He has two pairs of shoes.",
    "He has three caps.",
    "She has five shirts.",
    "She has two skirts.",
    "She has three dresses.",
  ];

  const questions = [
    {
      id: 1,
      text: "How many pairs of socks does he have?",
      answer: "He has two pairs of socks.",
    },
    {
      id: 2,
      text: "How many pairs of shoes does he have?",
      answer: "He has two pairs of shoes.",
    },
    {
      id: 3,
      text: "How many caps does he have?",
      answer: "He has three caps.",
    },
    {
      id: 4,
      text: "How many shirts does she have?",
      answer: "She has five shirts.",
    },
    {
      id: 5,
      text: "How many skirts does she have?",
      answer: "She has two skirts.",
    },
    {
      id: 6,
      text: "How many dresses does she have?",
      answer: "She has three dresses.",
    },
  ];

  const [answers, setAnswers] = useState({});
  const [locked, setLocked] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const onDragEnd = (result) => {
    if (!result.destination || locked) return;

    const sentence = result.draggableId;
    const id = result.destination.droppableId.split("-")[1];

    setAnswers((prev) => ({
      ...prev,
      [id]: sentence,
    }));
  };

  const reset = () => {
    setAnswers({});
    setLocked(false);
    setShowResult(false);
  };
  const showAnswers = () => {
    const filled = {};
    questions.forEach((q) => {
      filled[q.id] = q.answer;
    });
    setAnswers(filled);
    setLocked(true);
  };

  const checkAnswers = () => {
    if (locked) return;
    if (Object.keys(answers).length < questions.length) {
      ValidationAlert.info("Please complete all answers.");
      return;
    }

    let correct = 0;

    questions.forEach((q) => {
      if (answers[q.id] === q.answer) correct++;
    });

    const total = questions.length;

    const color =
      correct === total ? "green" : correct === 0 ? "red" : "orange";

    const message = `
<div style="font-size:20px;text-align:center;">
<b style="color:${color};">Score: ${correct} / ${total}</b>
</div>
`;

    if (correct === total) ValidationAlert.success(message);
    else if (correct === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);

    setLocked(true);
    setShowResult(true);
  };

  const isWordUsed = (word) => {
    return Object.values(answers).includes(word);
  };

  const isWrong = (id) => {
    if (!showResult) return false;

    const q = questions.find((q) => q.id === id);
    return answers[id] !== q.answer;
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="main-container-component">
        <div className="div-forall" style={{gap:"10px"}}>
          <h5 className="header-title-page8">
            <span className="ex-A mr-2.5">D</span> Look and write.
          </h5>

          {/* IMAGES */}
          <div className="w-[100%] flex flex-col gap-3">
            <div className="flex justify-center gap-10">
              <div className="relative">
                <img
                  src={imgA}
                  className="w-[380px]! h-[230px]! object-contain"
                />
              </div>

              <div className="relative">
                <img
                  src={imgB}
                  className="w-[380px]! h-[230px]! object-contain"
                />
              </div>
            </div>

            {/* ANSWERS BANK */}

            <Droppable droppableId="bank" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-wrap gap-4 justify-center mb-5 p-2 rounded-lg"
                >
                  {answersBank.map((a, index) => {
                    const used = isWordUsed(a);
                    return (
                      <Draggable
                        key={a}
                        draggableId={a}
                        index={index}
                        isDragDisabled={locked || used}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-yellow-200 px-4 py-2 rounded-lg cursor-grab  ${
                              used
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                                : "bg-white cursor-grab hover:bg-gray-100"
                            }`}
                          >
                            {a}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* QUESTIONS GRID */}

            <div className="grid grid-cols-2 gap-x-16 mb-20 ">
              {questions.map((q) => (
                <div key={q.id}>
                  <div className="flex gap-3 text-lg">
                    <span className="font-bold">{q.id}</span>
                    <p>{q.text}</p>
                  </div>

                 <Droppable droppableId={`answer-${q.id}`}>
  {(provided, snapshot) => (
                      <div className="relative h-10 mt-2">
                        {/* ❌ */}
                        {isWrong(q.id) && (
                          <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-md">
                            ✕
                          </span>
                        )}

                     <div
  ref={provided.innerRef}
  {...provided.droppableProps}
  className={`h-8 transition-all duration-200
    ${
      snapshot.isDraggingOver
        ? "bg-blue-100 border-2 border-dashed border-blue-500 rounded-md"
        : isWrong(q.id)
        ? "border-b-2 border-red-500"
        : "border-b-2 border-black"
    }
  `}
>
  <span className="text-red-600 font-semibold">
    {answers[q.id]}
  </span>

  {provided.placeholder}
</div>
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </div>
          {/* BUTTONS */}

          <div className="action-buttons-container mt-10">
            <button onClick={reset} className="try-again-button">
              Start Again ↻
            </button>

            <button
              onClick={showAnswers}
              className="show-answer-btn swal-continue"
            >
              Show Answer
            </button>

            <button onClick={checkAnswers} className="check-button2">
              Check Answer ✓
            </button>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Unit8_Page6_Q1;

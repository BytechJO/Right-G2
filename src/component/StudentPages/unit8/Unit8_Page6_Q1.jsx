import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";

import imgA from "../../../assets/imgs/test6.png";
import imgB from "../../../assets/imgs/test6.png";

const Unit8_Page6_Q1 = () => {
  const answersBank = [
    "He has two pairs of socks.",
    "He has two pairs of shoes.",
    "He has three caps.",
    "She has three shirts.",
    "She has three skirts.",
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
      answer: "She has three shirts.",
    },
    {
      id: 5,
      text: "How many skirts does she have?",
      answer: "She has three skirts.",
    },
    {
      id: 6,
      text: "How many dresses does she have?",
      answer: "She has three dresses.",
    },
  ];

  const [answers, setAnswers] = useState({});
  const [locked, setLocked] = useState(false);

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
    if (Object.keys(answers).length < questions.length) {
      ValidationAlert.info("Please complete all answers.");
      return;
    }

    let correct = 0;

    questions.forEach((q) => {
      if (answers[q.id] === q.answer) correct++;
    });

    const total = questions.length;

    const msg = `
<div style="font-size:20px;text-align:center;">
<b>Score: ${correct} / ${total}</b>
</div>
`;

    if (correct === total) ValidationAlert.success(msg);
    else if (correct === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);

    setLocked(true);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex justify-center p-8">
        <div className="w-[80%]">
          <h5 className="header-title-page8 ">
            <span className="ex-A mr-2.5">D</span> Look and write.
          </h5>

          {/* IMAGES */}
          <div className="w-[70%] mx-auto">
            <div className="flex justify-center gap-8 ">
              <div className="relative">
                <img
                  src={imgA}
                  className="w-[380px]! h-[230px]! object-contain"
                />
                <span className="absolute bottom-2 right-2 bg-yellow-300 rounded-full px-2 text-sm">
                  A
                </span>
              </div>

              <div className="relative">
                <img
                  src={imgB}
                  className="w-[380px]! h-[230px]! object-contain"
                />
                <span className="absolute bottom-2 right-2 bg-yellow-300 rounded-full px-2 text-sm">
                  B
                </span>
              </div>
            </div>

            {/* ANSWERS BANK */}

            <Droppable droppableId="bank" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-wrap gap-4 justify-center mb-5"
                >
                  {answersBank
                    .filter((a) => !Object.values(answers).includes(a))
                    .map((a, index) => (
                      <Draggable
                        key={a}
                        draggableId={a}
                        index={index}
                        isDragDisabled={locked}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-yellow-200 px-4 py-2 rounded-lg cursor-grab"
                          >
                            {a}
                          </div>
                        )}
                      </Draggable>
                    ))}

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
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="border-b-2 border-black min-h-10 mt-2"
                      >
                        <span className="text-red-600 font-semibold">
                          {answers[q.id]}
                        </span>

                        {provided.placeholder}
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

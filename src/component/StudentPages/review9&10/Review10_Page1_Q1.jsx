import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";

import imgA from "../../../assets/imgs/test6.png";
import imgB from "../../../assets/imgs/test6.png";
import imgC from "../../../assets/imgs/test6.png";
import imgD from "../../../assets/imgs/test6.png";

const Review10_Page1_Q1 = () => {
  const answersBank = [
    "He's taking a shower",
    "She’s setting the table.",
    "He's watching from the window.",
    "She's watering the flowers.",
  ];

  const questions = [
    {
      id: 1,
      img: imgA,
      answer: "She’s setting the table.",
    },
    {
      id: 2,
      img: imgB,
      answer: "He's taking a shower",
    },
    {
      id: 3,
      img: imgC,
      answer: "She's watering the flowers.",
    },
    {
      id: 4,
      img: imgD,
      answer: "He's watching from the window.",
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
    if (locked) return;

    const empty = questions.some((q) => !answers[q.id]);

    if (empty) {
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
        <div className="w-[90%]">
          <h5 className="header-title-page8 ">
            <span style={{ marginRight: "20px" }}>A</span> Look and write.
          </h5>

          {/* IMAGES */}
          <div className="w-[70%] mx-auto">
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

            <div className="flex flex-col gap-10 items-center mb-20">
              {[0, 2].map((startIndex) => (
                <div key={startIndex} className="w-full">
                  {/* صف الصور */}
                  <div className="flex justify-between px-10">
                    {questions.slice(startIndex, startIndex + 2).map((q) => (
                      <div key={q.id} className="flex flex-col items-start">
                        {/* الرقم + الصورة */}
                        <div className="flex gap-2 items-start">
                          <span className="font-bold text-lg">{q.id}</span>
                          <img
                            src={q.img}
                            style={{
                              height: "120px",
                              border: "2px solid red",
                              borderRadius: "10px",
                            }}
                          />
                        </div>

                        {/* خط */}
                        <Droppable droppableId={`answer-${q.id}`}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              style={{
                                width: "300px",
                                borderBottom: "2px solid black",
                                minHeight: "35px",
                                marginTop: "10px",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {answers[q.id] && (
                                <Draggable
                                  draggableId={answers[q.id]}
                                  index={0}
                                  isDragDisabled={locked}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={provided.draggableProps.style}
                                    >
                                      <span className="text-red-600 font-semibold">
                                        {answers[q.id]}
                                      </span>
                                    </div>
                                  )}
                                </Draggable>
                              )}

                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    ))}
                  </div>
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

export default Review10_Page1_Q1;

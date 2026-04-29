import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";

import imgA from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 90/Ex A 1.svg";
import imgB from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 90/Ex A 2.svg";
import imgC from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 90/Ex A 3.svg";
import imgD from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 90/Ex A 4.svg";

const Review10_Page1_Q1 = () => {
  const answersBank = [
    "setting the table",
    "He's taking a shower",
    "She's watering the flowers",
    "He's watching from the window",
  ];

  const questions = [
    {
      id: 1,
      img: imgA,
      answer: "setting the table",
    },
    {
      id: 2,
      img: imgB,
      answer: "He's taking a shower",
    },
    {
      id: 3,
      img: imgC,
      answer: "She's watering the flowers",
    },
    {
      id: 4,
      img: imgD,
      answer: "He's watching from the window",
    },
  ];

  const [answers, setAnswers] = useState({});
  const [locked, setLocked] = useState(false);
  const [resetKey, setResetKey] = useState(0);
const onDragEnd = (result) => {
  const { destination, draggableId } = result;
  if (!destination || locked) return;

  setAnswers((prev) => {
    const updated = { ...prev };

    // 🔥 احذف الكلمة من أي مكان
    Object.keys(updated).forEach((key) => {
      if (updated[key] === draggableId) {
        delete updated[key];
      }
    });

    // 🔥 إذا رجع للبنك
    if (destination.droppableId === "bank") {
      return updated;
    }

    // 🔥 إذا راح على slot
    const id = destination.droppableId.split("-")[1];
    updated[id] = draggableId;

    return updated;
  });
};
  const reset = () => {
    setAnswers({});
    setLocked(false);
    setResetKey((prev) => prev + 1); // 🔥 هذا المهم
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

    const color =
      correct === total ? "green" : correct === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${correct} / ${total}
        </span>
      </div>
    `;
    if (correct === total) ValidationAlert.success(msg);
    else if (correct === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);

    setLocked(true);
  };

  const isWrongAnswer = (qId) => {
    if (!locked) return false;

    const userAnswer = answers[qId];
    if (!userAnswer) return false;

    const correctAnswer = questions.find((q) => q.id === qId)?.answer;

    return userAnswer !== correctAnswer;
  };
  return (
    <DragDropContext key={resetKey} onDragEnd={onDragEnd}>
      <div className="main-container-component">
        <div className="div-forall" style={{gap:"20px"}}>
          <h5 className="header-title-page8 ">
            <span style={{ marginRight: "20px" }}>A</span> Look, read and write.
          </h5>

          {/* IMAGES */}
          <div className="flex flex-col gap-5">
            {/* ANSWERS BANK */}

            <Droppable droppableId="bank" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-wrap gap-4 justify-center mb-5 p-2 rounded-lg"
                >
                  {answersBank.map((a, index) => {
                    const isUsed = Object.values(answers).includes(a);
                    return (
                      <Draggable
                        key={a+isUsed}
                        draggableId={a}
                        index={index}
                        isDragDisabled={locked || isUsed}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...(!isUsed && provided.dragHandleProps)}
                            style={{
                              ...provided.draggableProps.style,

                              padding: "8px",
                              border: "2px solid #0013a5ff",
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: "bold",

                              background: isUsed ? "#e5e7eb" : "#fff",
                              color: isUsed ? "#9ca3af" : "#000",
                              cursor: isUsed ? "not-allowed" : "grab",
                            }}
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
                              // border: "2px solid red",
                              borderRadius: "10px",
                            }}
                          />
                        </div>

                        {/* خط */}
                      <Droppable droppableId={`answer-${q.id}`}>
  {(provided, snapshot) => (
    <div
      ref={provided.innerRef}
      {...provided.droppableProps}
      style={{
        width: "300px",
        minHeight: "35px",
        marginTop: "10px",
        display: "flex",
        alignItems: "center",
        position: "relative",
        transition: "all 0.2s ease",

        // 🔥 الإيفيكت
        borderBottom: snapshot.isDraggingOver
          ? "2px dashed #3b82f6"
          : isWrongAnswer(q.id)
          ? "2px solid #ef4444"
          : "1px solid black",

        backgroundColor: snapshot.isDraggingOver ? "#dbeafe" : "transparent",

        // ✨ optional
        transform: snapshot.isDraggingOver ? "scale(1.03)" : "scale(1)",
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
                                      <span className="text-blue-800 font-semibold">
                                        {answers[q.id]}
                                      </span>
                                    </div>
                                  )}
                                </Draggable>
                              )}
                              {isWrongAnswer(q.id) && (
                                <div
                                  className="
      absolute -top-2 -right-2
      w-6 h-6
      bg-red-500 text-white
      rounded-full
      flex items-center justify-center
      text-sm font-bold
      border-2 border-white
      z-10
    "
                                >
                                  ✕
                                </div>
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

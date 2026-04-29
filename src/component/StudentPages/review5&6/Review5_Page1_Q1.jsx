import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./Review5_Page1_Q1.css";
import img1 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 52/p52.svg";

const Review5_Page1_Q1 = () => {
  const questions = [
    { code: "A1", answer: "fish" },
    { code: "C2", answer: "apples" },
    { code: "B1", answer: "rice" },
    { code: "A2", answer: "meat" },
    { code: "C3", answer: "hamburger" },
    { code: "B3", answer: "chicken" },
  ];

  const options = questions.map((q) => q.answer);
  const [answers, setAnswers] = useState(["", "", "", "", "", ""]);
  const [locked, setLocked] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const onDragEnd = (result) => {
    const { destination, draggableId } = result;

    if (!destination || locked) return;

    const value = draggableId.replace("word-", "");
    const index = Number(destination.droppableId.split("-")[1]);

    const updated = [...answers];
    updated[index] = value;

    setAnswers(updated);
  };

  const resetAll = () => {
    setAnswers(["", "", "", "", "", ""]);
    setLocked(false);
  };

  const showAnswers = () => {
    setAnswers(questions.map((q) => q.answer));
    setLocked(true);
  };

  const checkAnswers = () => {
    if (locked) return;
    if (answers.some((a) => a === "")) {
      ValidationAlert.info("Please complete all answers");
      return;
    }

    let score = 0;

    answers.forEach((a, i) => {
      if (a === questions[i].answer) score++;
    });

    const total = questions.length;
    const color = score === total ? "green" : score === 0 ? "red" : "orange";
    setLocked(true);
    setShowResult(true);
    const message = `
  <div style="font-size:20px;text-align:center;">
    <span style="color:${color};font-weight:bold;">
      Score: ${score} / ${total}
    </span>
  </div>
  `;

    if (score === total) ValidationAlert.success(message);
    else if (score === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);

    setLocked(true);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="main-container-component">
        <div className="div-forall" style={{ marginBottom: "50px" ,gap:"2px"}}>
          <h5 className="header-title-page8">
            <span style={{ marginRight: "20px" }}>A</span>
            Find and write.
          </h5>

          {/* IMAGE */}
          <div className="flex justify-center my-5">
            <img
              src={img1}
              alt=""
              style={{
                width: "100%",

                height: "263px",
              }}
            />
          </div>
           <div className="flex flex-col">
          {/* OPTIONS */}
          <Droppable droppableId="bank" direction="horizontal" isDropDisabled>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex gap-2.5 justify-center mb-5"
              >
                {options.map((word, i) => {
                   const isUsed = answers.some((row) => row.includes(word));
                  return(
                  <Draggable
                    key={word}
                    draggableId={`word-${word}`}
                    index={i}
                    isDragDisabled={locked ||isUsed}
                  >
                    {(provided) => (
                      <span
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      className="CB-unit2-p6-q2-word"
                            style={{
                              background: isUsed ? "#ccc" : "white",
                              opacity: isUsed ? 0.6 : 1,
                              cursor: isUsed ? "not-allowed" : "grab",
                              ...provided.draggableProps.style,
                            }}>
                        {word}
                      </span>
                    )}
                  </Draggable>
                )})}

                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* QUESTIONS */}
          <div className="grid grid-cols-2 gap-y-5 gap-x-[60px] mt-5">
            {questions.map((q, i) => {
              const isWrong =
                showResult && answers[i] && answers[i] !== q.answer;

              const isCorrect = showResult && answers[i] === q.answer;
              return (
                <div key={i} className="flex items-center gap-2.5">
                  <span className="font-bold">{i + 1}</span>

                  <span className="bg-[#e6b29c] px-2 py-1 rounded-md">
                    {q.code}
                  </span>

                  <Droppable droppableId={`slot-${i}`}>
                    {(provided, snapshot) => (
                      <div className="relative w-full">
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`w-full h-[35px] border-b-[2px] flex items-center justify-center ${
                            snapshot.isDraggingOver ? "bg-blue-100" : ""
                          } ${
                            showResult
                              ? isCorrect
                                ? "border-[#444]"
                                : isWrong
                                  ? "border-red-500"
                                  : "border-[#444]"
                              : "border-[#444]"
                          }`}
                        >
                          {answers[i] && (
                            <span className="font-bold">{answers[i]}</span>
                          )}

                          {provided.placeholder}
                          {isWrong && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md border-2 border-white">
                              ✕
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
          </div>
        </div>

        <div className="action-buttons-container">
          <button onClick={resetAll} className="try-again-button">
            Start Again ↻
          </button>

          <button onClick={showAnswers} className="show-answer-btn">
            Show Answer
          </button>

          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Review5_Page1_Q1;

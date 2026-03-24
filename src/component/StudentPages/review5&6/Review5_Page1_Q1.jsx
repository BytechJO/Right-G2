import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./Review5_Page1_Q1.css";
import img1 from "../../../assets/imgs/test.png";

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

    const message = `
    <div style="font-size:20px;text-align:center;">
      <span style="color:#2e7d32;font-weight:bold;">
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
      <div className="exercise-container">
        <div className="div-forall">
          <h5 className="header-title-page8">
            <span style={{ marginRight: "20px" }}>A</span>
            Find and drag.
          </h5>

          {/* IMAGE */}
          <div className="flex justify-center my-5">
            <img
              src={img1}
              alt=""
              style={{
                width: "100%",
                maxWidth: "600px",
                height: "auto",
                border: "4px solid purple",
              }}
            />
          </div>

          {/* OPTIONS */}
          <Droppable droppableId="bank" direction="horizontal" isDropDisabled>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex gap-2.5 justify-center mb-5"
              >
                {options
                  .filter((word) => !answers.includes(word))
                  .map((word, i) => (
                    <Draggable
                      key={word}
                      draggableId={`word-${word}`}
                      index={i}
                      isDragDisabled={locked}
                    >
                      {(provided) => (
                        <span
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="px-3.5 py-[7px] border-2 border-[#2c5287] rounded-lg bg-white font-bold cursor-grab"
                        >
                          {word}
                        </span>
                      )}
                    </Draggable>
                  ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* QUESTIONS */}
          <div className="grid grid-cols-2 gap-y-5 gap-x-[60px] mt-5">
            {questions.map((q, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="font-bold">{i + 1}</span>

                <span className="bg-[#e6b29c] px-2 py-1 rounded-md">
                  {q.code}
                </span>

                <Droppable droppableId={`slot-${i}`}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`w-[140px] h-[35px] border-b-[3px] border-[#444] flex items-center justify-center ${
                        snapshot.isDraggingOver ? "bg-blue-100" : ""
                      }`}
                    >
                      {answers[i] && (
                        <span className="font-bold">{answers[i]}</span>
                      )}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
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

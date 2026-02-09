import React, { useState } from "react";
import "./Page8_Q4.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Page8_Q4 = () => {
  const gridLetters = [
    ..."dtheytadgbnmvglikexnsrolto",
    ..."hfeatbxazbkgrasshafghrtfbi",
    ..."pmolki",
  ];

  const correctAnswer = "they like to eat grass";

  const [answerLetters, setAnswerLetters] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || showAnswer || isChecked) return;

    if (destination.droppableId === "answer-input") {
      const letter = draggableId.split("-")[1];
      setAnswerLetters((prev) => [...prev, letter]);
    }
  };

  const handleShowAnswer = () => {
    setAnswerLetters(correctAnswer.split(""));
    setShowAnswer(true);
  };

  const handleCheckAnswers = () => {
    const formed = answerLetters.join("");
    if (!formed) {
      ValidationAlert.info("Oops!", "Drag letters into the box.");
      return;
    }

    if (formed === correctAnswer)
      ValidationAlert.success("Excellent! 🌟");
    else ValidationAlert.error("Try again!");
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      <div className="div-forall" style={{ width: "60%" }}>
        <div className="container8">
          <h5 className="header-title-page8">
            <span className="ex-A">C</span> What do lambs like to eat?
          </h5>

          <div className="alphabet-box">
            <DragDropContext onDragEnd={onDragEnd}>
              {/* 🔤 Letter Grid */}
              <Droppable droppableId="grid" isDropDisabled>
                {(provided) => (
                  <div className="row1" ref={provided.innerRef}>
                    {gridLetters.map((letter, index) => (
                      <Draggable
                        key={index}
                        draggableId={`letter-${letter}-${index}`}
                        index={index}
                        isDragDisabled={showAnswer || isChecked}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="cell1 drag-letter"
                          >
                            {letter}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              {/* ⬜ BIG INPUT DROP ZONE */}
              <Droppable droppableId="answer-input" direction="horizontal">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="sentence-box big-input"
                  >
                    {answerLetters.map((letter, index) => (
                      <span key={index} className="sentence-text">
                        {letter}
                      </span>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </div>

      {/* 🔘 Buttons */}
      <div className="action-buttons-container">
        <button
          onClick={() => {
            setAnswerLetters([]);
            setIsChecked(false);
            setShowAnswer(false);
          }}
          className="try-again-button"
        >
          Start Again ↻
        </button>

        <button onClick={handleShowAnswer} className="show-answer-btn">
          Show Answer
        </button>

        <button onClick={handleCheckAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Page8_Q4;

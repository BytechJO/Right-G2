import React, { useState } from "react";
import "./Page8_Q4.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import img1 from "../../../assets/imgs/test.png";
import img2 from "../../../assets/imgs/test.png";
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
const [isWrong, setIsWrong] = useState(false);

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || showAnswer || isChecked) return;

    if (destination.droppableId === "answer-input") {
      const letter = draggableId.split("-")[1];
      setAnswerLetters((prev) => [...prev, letter]);
    }
  };

  const handleShowAnswer = () => {
    if (showAnswer || isChecked) return;
    setAnswerLetters(correctAnswer.split(""));
    setShowAnswer(true);
  };

  const handleCheckAnswers = () => {
    if (showAnswer || isChecked) return;
    const formed = answerLetters.join("");

    // 1️⃣ input فاضي
    if (!formed || formed.trim().length === 0) {
      ValidationAlert.warning("Warning!", "Please drag letters first ✋");
      return;
    }

    // حساب السكور
    let score = 0;
    for (let i = 0; i < correctAnswer.length; i++) {
      if (formed[i] === correctAnswer[i]) {
        score++;
      }
    }
    const total = correctAnswer.length;

    let color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${score} / ${total}
        </span>
      </div>
    `;
    setIsChecked(true);
    // 2️⃣ الإجابة صحيحة
    if (formed === correctAnswer) {
      ValidationAlert.success(msg);
      setIsChecked(true);
      return;
    }

    // 3️⃣ الإجابة غلط
      setIsWrong(true);
    ValidationAlert.error(msg);
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

              <div className="img-input-container">
                <img src={img1} style={{ height: "90px", width: "90px" }} />
                {/* ⬜ BIG INPUT DROP ZONE */}
                <div className="input-wrapper">
  {isWrong && (
    <div className="wrong-icon">
      ✕
    </div>
  )}

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
</div>

                <img src={img1} style={{ height: "90px", width: "90px" }} />
              </div>
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
    setIsWrong(false); // 👈 مهم
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

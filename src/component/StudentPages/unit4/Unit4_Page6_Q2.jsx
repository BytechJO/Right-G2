import React, { useState } from "react";
import img1 from "../../../assets/imgs/test.png";
import img2 from "../../../assets/imgs/test.png";
import img3 from "../../../assets/imgs/test.png";
import img4 from "../../../assets/imgs/test.png";
import img5 from "../../../assets/imgs/test.png";
import img6 from "../../../assets/imgs/test.png";
import img7 from "../../../assets/imgs/test.png";
import img8 from "../../../assets/imgs/test.png";
import img9 from "../../../assets/imgs/test.png";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./Unit4_Page6_Q2.css";

const Unit4_Page6_Q2 = () => {
  const correctAnswers = [
    "mechanic",
    "photographer",
    "vet",
    "nurse",
    "police officer",
    "farmer",
    "pilot",
    "taxi driver",
    "clerk",
  ];
  const wordBank = [
    "pilot",
    "farmer",
    "vet",
    "nurse",
    "clerk",
    "photographer",
    "police officer",
    "mechanic",
    "taxi driver",
  ];
  const [answers, setAnswers] = useState(["", "", "", "", "", "", "", "", ""]);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false);

  /* ================= Drag Logic ================= */
  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || locked) return;

    if (destination.droppableId.startsWith("slot-")) {
      const index = Number(destination.droppableId.split("-")[1]);
      const word = draggableId.replace("word-", "");

      setAnswers((prev) => {
        const updated = [...prev];

        // 🔒 منع التكرار
        const oldIndex = updated.findIndex((a) => a === word);
        if (oldIndex !== -1) updated[oldIndex] = "";

        updated[index] = word;
        return updated;
      });

      setWrongInputs([]);
    }
  };

  /* ================= Check Answers (كما هو) ================= */
  const checkAnswers = () => {
    if (locked) return;

    if (answers.some((ans) => ans === "")) {
      ValidationAlert.info("Please fill in all the blanks before checking!");
      return;
    }

    let tempScore = 0;
    let wrong = [];

    answers.forEach((ans, i) => {
      if (ans === correctAnswers[i]) tempScore++;
      else wrong.push(i);
    });

    setWrongInputs(wrong);

    const total = correctAnswers.length;
    const color =
      tempScore === total ? "green" : tempScore === 0 ? "red" : "orange";

    ValidationAlert[
      tempScore === total ? "success" : tempScore === 0 ? "error" : "warning"
    ](`
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${tempScore} / ${total}
        </span>
      </div>
    `);

    setLocked(true);
  };

  const reset = () => {
    setAnswers(["", "", "", "", "", "", "", "", ""]);
    setWrongInputs([]);
    setLocked(false);
  };

  const showAnswer = () => {
    setAnswers([...correctAnswers]);
    setWrongInputs([]);
    setLocked(true);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className="question-wrapper-unit3-page6-q1"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
        }}
      >
        <div
          className="div-forall"
          style={{
            display: "flex",
            flexDirection: "column",
            // gap: "30px",
            width: "60%",
            marginBottom:"40px"
          }}
        >
          <h5 className="header-title-page8">
            {" "}
            <span className="ex-A">E</span>Label the pictures with the words
            from the box.
          </h5>

          {/* 🔤 Word Bank */}
          <Droppable droppableId="bank" direction="horizontal" isDropDisabled>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: "flex",
                  gap: "10px",
                  padding: "10px",
                  border: "2px dashed #ccc",
                  borderRadius: "10px",
                  // margin: "10px 0",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {wordBank.map((word, index) => (
                  <Draggable
                    key={word}
                    draggableId={`word-${word}`}
                    index={index}
                    isDragDisabled={locked}
                  >
                    {(provided) => (
                      <span
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          padding: "7px 14px",
                          border: "2px solid #2c5287",
                          borderRadius: "8px",
                          background: "white",
                          fontWeight: "bold",
                          cursor: "grab",
                          ...provided.draggableProps.style,
                        }}
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

          <div className="row-content10-CB-unit4-p6-q2">
            {[img1, img2, img3, img4, img5, img6, img7, img8, img9].map(
              (img, index) => (
                <div className="row2-CB-review2-p1-q2" key={index}>
                  <img src={img} className="q-img-CB-review2-p1-q2" />

                  <Droppable droppableId={`slot-${index}`}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`q-input-CB-review2-p1-q2 ${
                          snapshot.isDraggingOver ? "drag-over-cell" : ""
                        }`}
                      >
                        {answers[index] && (
                          <Draggable
                            draggableId={`slot-${index}-${answers[index]}`}
                            index={0}
                            isDragDisabled={true}
                          >
                            {(provided) => (
                              <span
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {answers[index]}
                              </span>
                            )}
                          </Draggable>
                        )}

                        {provided.placeholder}

                        {wrongInputs.includes(index) && (
                          <span className="error-mark-input-CB-review2-p1-q2">
                            ✕
                          </span>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>

          <button
            onClick={showAnswer}
            className="show-answer-btn swal-continue"
          >
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

export default Unit4_Page6_Q2;

import React, { useState, useEffect, useRef } from "react";
import img1 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 26/Ex A 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 26/Ex A 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 26/Ex A 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 26/Ex A 4.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./Unit3_Page5_Q1.css";
import sound1 from "../../../assets/audio/ClassBook/U 3/cd19pg26question.mp3";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
const Unit3_Page5_Q1 = () => {
  const correctAnswers = ["j", "j", "j", "y"];
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false);

  /* ================ audio logic =========================*/

  const stopAtSecond = 11.5;

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0.44,
      end: 11.5,
      text: "Page 26, Right Activities. Exercise A, number 1. Does it begin with J or Y? Listen and write.",
    },
    { start: 12.68, end: 14.04, text: "1, jump." },
    { start: 15.08, end: 21.92, text: "2, juice. 3, jeep. 4, yarn." },
  ];

  /* ================= Drag Logic ================= */
  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || locked) return;

    if (destination.droppableId.startsWith("slot-")) {
      const index = Number(destination.droppableId.split("-")[1]);
      const word = draggableId.replace("word-", "");

      setAnswers((prev) => {
        const updated = [...prev];

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
    setAnswers(["", "", "", ""]);
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
            gap: "20px",
            width: "60%",
          }}
        >
          <h5 className="header-title-page8">
            <span className="ex-A">A</span>{" "}
            <span style={{ color: "#2e3192" }}>1</span>Does it begin with{" "}
            <span style={{ color: "#2e3192" }}>j</span> or{" "}
            <span style={{ color: "#2e3192" }}>y</span>? Listen and write.
          </h5>
          <QuestionAudioPlayer
            src={sound1}
            captions={captions}
            stopAtSecond={stopAtSecond}
          />
       
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
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {["j", "y"].map((word, index) => (
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

          <div className="row-content10-CB-unit3-p5-q1">
            {[img1, img2, img3, img4].map((img, index) => (
              <div className="row2-CB-review2-p1-q2" key={index}>
                <img src={img} className="q-img-CB-review2-p1-q2" />

                <Droppable droppableId={`slot-${index}`}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`q-input-CB-review2-p2-q1 ${
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
            ))}
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

export default Unit3_Page5_Q1;

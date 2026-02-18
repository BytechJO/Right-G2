import React, { useState } from "react";
import farmImg from "../../../assets/imgs/test.png";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit4_Page6_Q1.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import img1 from "../../../assets/imgs/test.png";
import img2 from "../../../assets/imgs/test.png";
import img3 from "../../../assets/imgs/test.png";
import img4 from "../../../assets/imgs/test.png";

const Unit4_Page6_Q1 = () => {
  const items = [
    {
      image: img1,
      questionParts: ["Do you want a doll?"],
      blanksCount: 0,
      questionAnswers: [],
      answer: "Yes, I do.",
    },
    {
      image: img2,
      questionParts: ["Do you want a", ""],
      blanksCount: 1,
      questionAnswers: ["robot"],
      answer: "Yes, I do.",
    },
    {
      image: img3,
      questionParts: [""],
      blanksCount: 1,
      questionAnswers: ["Do you want a computer?"],
      answer: "Yes, I do.",
    },
    {
      image: img4,
      questionParts: ["Do you want a bike?"],
      blanksCount: 0,
      questionAnswers: [],
      answer: "No, I don't. I want a dress",
    },
  ];

  const wordBank = [
    "Yes, I do.",
    "robot",
    "Do you want a computer?",
    "No, I don't. I want a dress",
  ];

  const [questionInputs, setQuestionInputs] = useState(
    items.map((item) => Array(item.blanksCount).fill("")),
  );

  const [answers, setAnswers] = useState(items.map(() => ""));
  const [showCorrect, setShowCorrect] = useState(false);
  const [wrongMarks, setWrongMarks] = useState([]);

  // =========================
  // DRAG END (🔥 FIXED)
  // =========================
  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || showCorrect) return;

    const value = draggableId.replace("word-", "");
    const [type, i, j] = destination.droppableId.split("-");

    const qIndex = Number(i);
    const blankIndex = Number(j);

    if (type === "q") {
      const updated = [...questionInputs];
      updated[qIndex][blankIndex] = value;
      setQuestionInputs(updated);
    }

    if (type === "a") {
      const updated = [...answers];
      updated[qIndex] = value;
      setAnswers(updated);
    }
  };

  // =========================
  // SHOW ANSWERS (🔥 FIXED)
  // =========================
  const showAnswers = () => {
    setQuestionInputs(
      items.map((item) =>
        item.blanksCount > 0 ? [...item.questionAnswers] : [],
      ),
    );

    setAnswers(items.map((item) => item.answer));
    setShowCorrect(true);
    setWrongMarks([]);
  };

  // =========================
  // RESET
  // =========================
  const resetAll = () => {
    setQuestionInputs(items.map((item) => Array(item.blanksCount).fill("")));
    setAnswers(items.map(() => ""));
    setShowCorrect(false);
    setWrongMarks([]);
  };

  // =========================
  // CHECK ANSWERS (🔥 FIXED)
  // =========================
  const checkAnswers = () => {
    if (showCorrect) return;

    // 1️⃣ Check blanks
    for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < questionInputs[i].length; j++) {
        if (!questionInputs[i][j]?.trim()) {
          ValidationAlert.info(
            "Oops!",
            "Please complete all question blanks before checking.",
          );
          return;
        }
      }

      // 2️⃣ Check answers
      if (!answers[i]?.trim()) {
        ValidationAlert.info(
          "Oops!",
          "Please complete all answers before checking.",
        );
        return;
      }
    }

    let score = 0;
    let total = 0;
    let wrong = [];

    items.forEach((item, i) => {
      // blanks
      item.questionAnswers.forEach((correctWord, idx) => {
        total++;
        if (
          questionInputs[i][idx]?.trim().toLowerCase() ===
          correctWord.toLowerCase()
        ) {
          score++;
        } else {
          wrong.push({ type: "question", qIndex: i, idx });
        }
      });

      // answers
      total++;
      if (answers[i]?.trim().toLowerCase() === item.answer.toLowerCase()) {
        score++;
      } else {
        wrong.push({ type: "answer", qIndex: i });
      }
    });

    setWrongMarks(wrong);
    setShowCorrect(true);

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
        }}
      >
        <div className="div-forall" style={{ width: "60%" }}>
          <h5 className="header-title-page8">
            <span className="ex-A">D</span>Complete the conversations.
          </h5>

          {/* WORD BANK */}
          <Droppable droppableId="bank" isDropDisabled={showCorrect}>
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
                  justifyContent: "center",
                }}
              >
                {wordBank.map((word, index) => (
                  <Draggable
                    key={word}
                    draggableId={`word-${word}`}
                    index={index}
                    isDragDisabled={showCorrect}
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

          {/* CONTENT */}

          {items.map((item, i) => {
            return (
              <div className="content-CB-unit4-p6-q1">
                <div className="CB-unit4-p6-q1-img-container">
                   <span className="CB-unit4-p6-q1-index">{i + 1}</span>
                  <img
                    src={farmImg}
                    alt=""
                    style={{ height: "150px", width: "200px" }}
                  />
                </div>
                <div key={i} className="question-box-CB-unit4-p6-q1">
                  <div className="CB-unit4-p6-q1-title-container">
                    <span className="CB-unit4-p6-q1-index">{i + 1}</span>
                    <p style={{ width: "100%", display: "flex" }}>
                      {item.questionParts.map((part, idx) => {
                        if (part === "") {
                          const blankIndex =
                            item.questionParts
                              .slice(0, idx + 1)
                              .filter((p) => p === "").length - 1;

                          return (
                            <Droppable
                              key={idx}
                              droppableId={`q-${i}-${blankIndex}`}
                              isDropDisabled={showCorrect}
                            >
                              {(provided, snapshot) => (
                                <span
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                  className={`question-blank-CB-unit4-p6-q1 ${
                                    snapshot.isDraggingOver
                                      ? "drag-over-cell"
                                      : ""
                                  }`}
                                >
                                  {questionInputs[i][blankIndex]}
                                  {provided.placeholder}
                                </span>
                              )}
                            </Droppable>
                          );
                        }

                        return (
                          <span
                            key={idx}
                            style={{ width: "100%", fontSize: "18px" }}
                          >
                            {" "}
                            {part}{" "}
                          </span>
                        );
                      })}
                    </p>
                  </div>
                  <Droppable
                    droppableId={`a-${i}`}
                    isDropDisabled={showCorrect}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`answer-input-CB-unit4-p6-q1  ${
                          snapshot.isDraggingOver ? "drag-over-cell" : ""
                        }`}
                      >
                        {answers[i]}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            );
          })}
        </div>

        {/* BUTTONS */}
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

export default Unit4_Page6_Q1;

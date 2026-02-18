import React, { useState } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./Review3_Page2_Q2.css";

const Review3_Page2_Q2 = () => {
  const questions = [
    { before: "Her favorite color is", after: "." },
    { before: "She likes a lot of", after: "on her bread." },
    { before: "He puts on a", after: "because it is cold outside." },
    { before: "My dad is a pilot and flies in a", after: "." },
    { before: "He played with the", after: "." },
    { before: "We eat", after: "with our meat and rice." },
  ];
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));

  const [usedWords, setUsedWords] = useState([]);
  const [wrongInput, setWrongInputs] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);

  const correctAnswers = ["yellow", "jam", "jacket", "jet", "yo-yo", "yogurt"];

  // 🧲 Drag logic
  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || showAnswer) return;

    if (destination.droppableId.startsWith("slot-")) {
      const newIndex = Number(destination.droppableId.split("-")[1]);
      const word = draggableId.replace("word-", "");

      const updated = [...answers];

      // 🔍 نشوف إذا الكلمة موجودة بخانة ثانية
      const oldIndex = updated.findIndex((ans) => ans === word);

      // إذا كانت موجودة → نفرغ مكانها القديم
      if (oldIndex !== -1) {
        updated[oldIndex] = "";
      }

      // 🔁 نحطها بالمكان الجديد
      updated[newIndex] = word;

      setAnswers(updated);
      setWrongInputs([]);
    }
  };

  const checkAnswers = () => {
    if (showAnswer) return;

    if (answers.some((ans) => ans === "")) {
      ValidationAlert.info("Please fill in all the blanks before checking!");
      return;
    }

    let score = 0;
    let wrong = [];

    answers.forEach((ans, i) => {
      if (ans === correctAnswers[i]) score++;
      else wrong.push(ans);
    });

    setWrongInputs(wrong);
    setUsedWords(correctAnswers);

    const total = correctAnswers.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    ValidationAlert[
      score === total ? "success" : score === 0 ? "error" : "warning"
    ](`
  <div style="font-size:20px;text-align:center;">
    <span style="color:${color};font-weight:bold;">
      Score: ${score} / ${total}
    </span>
  </div>
`);
  };

  const reset = () => {
    setAnswers(["", "", "", "", "", ""]);
    setUsedWords([]);
    setWrongInputs([]);
    setShowAnswer(false);
  };

  const showAnswerFun = () => {
    setAnswers(correctAnswers);
    setUsedWords(correctAnswers);
    setWrongInputs([]);
    setShowAnswer(true);
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
        <div
          className="div-forall"
          style={{ width: "60%", display: "flex", flexDirection: "column" ,gap:"20px"}}
        >
          <h5 className="header-title-page8">
            <span style={{ marginRight: "20px" }}>F</span> Read and complete the
            sentences. Use the words from the box.
          </h5>

          {/* 🔤 الكلمات (فوق – نفس الكتاب) */}
          <Droppable droppableId="words" direction="horizontal" isDropDisabled>
            {(provided) => (
              <div
                // className="word-bank-unit2-p8-q2"
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: "flex",
                  gap: "10px",
                  padding: "10px",
                  border: "2px solid #b81212ff",
                  borderRadius: "30px",
                  // margin: "10px 0",
                  backgroundColor: "#f9e6dc",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {correctAnswers.map((word, index) => (
                  <Draggable
                    key={word}
                    draggableId={`word-${word}`}
                    index={index}
                    isDragDisabled={usedWords.includes(word)}
                  >
                    {(provided) => (
                      <span
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`word-item-unit2-p8-q2 ${
                          usedWords.includes(word) ? "used" : ""
                        }`}
                        style={{
                          padding: "7px 14px",
                          border: "2px solid #b81212ff",
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

          {/* 🧩 الجمل – Inline 100% */}
          <div className="CB-review3-p2-q2-row-content">
            {questions.map((q, index) => (
              <div className="CB-review3-p2-q2-row" key={index}>
                <span>
                  <span className="CB-review3-p2-q2-num" >{index + 1}</span>{" "}
                  {q.before}{" "}
                  <Droppable droppableId={`slot-${index}`}>
                    {(provided, snapshot) => (
                      <span className="CB-review3-p2-q2-drop-wrapper">
                        <span
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`CB-review3-p2-q2-drop-slot ${
                            wrongInput.includes(answers[index])
                              ? "CB-review3-p2-q2-wrong"
                              : ""
                          } ${snapshot.isDraggingOver ? "drag-over-cell" : ""}`}
                        >
                          {answers[index]}
                          {provided.placeholder}
                        </span>

                        {wrongInput.includes(answers[index]) && (
                          <span className="CB-review3-p2-q2-error-mark">✕</span>
                        )}
                      </span>
                    )}
                  </Droppable>{" "}
                  {q.after}
                </span>
              </div>
            ))}
          </div>

          {/* 🔘 الأزرار نفسها */}
          <div className="action-buttons-container">
            <button onClick={reset} className="try-again-button">
              Start Again ↻
            </button>
            <button
              onClick={showAnswerFun}
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

export default Review3_Page2_Q2;

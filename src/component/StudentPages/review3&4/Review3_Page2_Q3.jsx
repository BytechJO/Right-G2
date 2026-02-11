import React, { useState } from "react";
import img1 from "../../../assets/imgs/test.png";
import img2 from "../../../assets/imgs/test.png";
import img3 from "../../../assets/imgs/test.png";
import img4 from "../../../assets/imgs/test.png";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./Review1_Page2_Q3.css";

const Review1_Page2_Q3 = () => {
  const items = [
    {
      img: img1,
      correct: "r",
      correctInput: "red",
      option: ["r", "c", "l", "q"],
    },
    {
      img: img2,
      correct: "r",
      correctInput: "rabbit",
      option: ["l", "r", "c", "q"],
    },
    {
      img: img3,
      correct: "r",
      correctInput: "run",
      option: ["j", "l", "c", "r"],
    },
    {
      img: img4,
      correct: "l",
      correctInput: "lamb",
      option: ["r", "o", "l", "m"],
    },
  ];

  const wordBank = items.map((i) => i.correctInput);

  const [selected, setSelected] = useState(["", "", "", ""]);
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);
  const [checked, setChecked] = useState(false);

  /* ================= Drag Logic (منع التكرار) ================= */
  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || showCorrect || checked) return;

    if (destination.droppableId.startsWith("slot-")) {
      const index = Number(destination.droppableId.split("-")[1]);
      const word = draggableId.replace("bank-", "").replace(/^slot-.*?-/, "");

      const updated = [...answers];

      // 🔒 منع التكرار
      const oldIndex = updated.findIndex((a) => a === word);
      if (oldIndex !== -1) updated[oldIndex] = "";

      updated[index] = word;
      setAnswers(updated);
      setShowResult(false);
    }
  };

  /* ================= Circle Logic (كما هو) ================= */
  const handleSelect = (value, index) => {
    if (showCorrect) return;
    const newSel = [...selected];
    newSel[index] = value;
    setSelected(newSel);
    setShowResult(false);
  };

  /* ================= Check Answers ================= */
  const checkAnswers = () => {
    if (showCorrect) return;

    if (selected.some((s) => s === "")) {
      ValidationAlert.info("Please choose a circle (f or v) for all items!");
      return;
    }

    if (answers.some((a) => a === "")) {
      ValidationAlert.info("Please fill in all the writing boxes!");
      return;
    }

    let wrong = [];
    let score = 0;

    items.forEach((item, i) => {
      const circleCorrect = selected[i] === item.correct;
      const inputCorrect =
        answers[i].toLowerCase() === item.correctInput.toLowerCase();

      if (circleCorrect) score++;
      if (inputCorrect) score++;

      if (!circleCorrect || !inputCorrect) wrong.push(i);
    });

    setWrongInputs(wrong);
    setShowResult(true);
    setChecked(true);

    const total = items.length * 2;
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

  /* ================= Show Answers ================= */
  const showAnswers = () => {
    setSelected(items.map((i) => i.correct));
    setAnswers(items.map((i) => i.correctInput));
    setWrongInputs([]);
    setShowResult(true);
    setShowCorrect(true);
    setChecked(true); // 🔒
  };

  const resetAll = () => {
    setSelected(["", "", "", ""]);
    setAnswers(["", "", "", ""]);
    setWrongInputs([]);
    setShowResult(false);
    setShowCorrect(false);
    setChecked(false); // 🔓
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
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            width: "60%",
          }}
        >
          <h5 className="header-title-page8">
            <span style={{ marginRight: "20px" }}>F</span> Circle and
            write.{" "}
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
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {wordBank.map((word, index) => (
                  <Draggable
                    key={word}
                    draggableId={`bank-${word}`}
                    index={index}
                    isDragDisabled={showCorrect || checked}
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

          <div className="question-grid-CB-review1-p2-q3">
            {items.map((item, i) => (
              <div className="question-box-CB-review1-p2-q3" key={i}>
                <img src={item.img} className="q-img-CB-review1-p2-q3" />

                {/* f / v circles */}
                <div className="choices-CB-review1-p2-q3">
                  {item.option.map((letter) => (
                    <div className="circle-wrapper" key={letter}>
                      <div
                        className={`circle-choice-CB-review1-p2-q3 ${
                          selected[i] === letter ? "active" : ""
                        } ${showCorrect ? "correct-color" : ""}`}
                        onClick={() => handleSelect(letter, i)}
                      >
                        {letter}
                      </div>

                      {showResult &&
                        selected[i] === letter &&
                        selected[i] !== item.correct && (
                          <div className="wrong-mark-CB-review1-p2-q3 ">✕</div>
                        )}
                    </div>
                  ))}
                </div>

                {/* 🧩 Drag slot بدل input */}
                <div className="input-wrapper-CB-review1-p2-q3">
                  <Droppable droppableId={`slot-${i}`}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`write-input-CB-review1-p2-q3 ${
                          showCorrect ? "correct-color" : ""
                        } ${snapshot.isDraggingOver ? "drag-over-cell" : ""}`}
                      >
                        {answers[i] && (
                          <Draggable
                            draggableId={`slot-${i}-${answers[i]}`}
                            index={0}
                            isDragDisabled={true}
                          >
                            {(provided) => (
                              <span
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="word-item"
                              >
                                {answers[i]}
                              </span>
                            )}
                          </Draggable>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  {showResult &&
                    answers[i] !== "" &&
                    answers[i].toLowerCase() !==
                      item.correctInput.toLowerCase() &&
                    wrongInputs.includes(i) && (
                      <div className="wrong-mark-CB-review1-p2-q3">✕</div>
                    )}
                </div>
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

export default Review1_Page2_Q3;

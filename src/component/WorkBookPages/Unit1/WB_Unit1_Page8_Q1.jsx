import React, { useState } from "react";
import "./WB_Unit1_Page8_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex A 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex A 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex A 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex A 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex A 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex A 6.svg";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const data = [
  { img: img1, scrambled: "emon", answer: "l", pattern: "emon" },
  { img: img2, scrambled: "at", answer: "r", pattern: "at" },
  {
    img: img3,
    scrambled: "abbit",
    answer: "r",
    pattern: "abbit",
  },

  { img: img4, scrambled: "obot", answer: "r", pattern: "obot" },
  { img: img5, scrambled: "amp", answer: "l", pattern: "amp" },
  { img: img6, scrambled: "uler", answer: "r", pattern: "uler" },
];

const WB_Unit1_Page8_Q1 = () => {
  const [inputs, setInputs] = useState(Array(data.length).fill(""));
  const [wrongInputs, setWrongInputs] = useState(
    Array(data.length).fill(false),
  );
  const [showAnswer, setShowAnswer] = useState(false); // ⭐ NEW
  const lettersBank = [...new Set(data.map((item) => item.answer))].map(
    (letter, i) => ({
      id: `l-${i}`,
      value: letter,
    }),
  );

  const onDragEnd = (result) => {
    if (!result.destination || showAnswer) return;

    const letter = result.draggableId;
    const targetIndex = Number(result.destination.droppableId);

    setInputs((prev) => {
      const copy = [...prev];
      copy[targetIndex] = letter; // ✔ نفس الحرف مسموح يتكرر
      return copy;
    });

    setWrongInputs(Array(data.length).fill(false));
  };

  const checkAnswers = () => {
    if (showAnswer) return; // ❌ ممنوع التعديل بعد Show Answer

    if (inputs.some((val) => val.trim() === "")) {
      ValidationAlert.info(
        "Oops!",
        "Please fill in all the answers before checking.",
      );
      return;
    }

    let correctCount = 0;
    const wrongFlags = [];

    data.forEach((item, index) => {
      if (inputs[index].toLowerCase() === item.answer) {
        correctCount++;
        wrongFlags[index] = false;
      } else {
        wrongFlags[index] = true;
      }
    });

    setWrongInputs(wrongFlags);
    setShowAnswer(true);
    const total = data.length;
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size: 20px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  const handleShowAnswer = () => {
    const correct = data.map((item) => item.answer);
    setInputs(correct); // ⭐ تعبئة الإجابة الصحيحة
    setWrongInputs(Array(data.length).fill(false));
    setShowAnswer(true);
  };

  const reset = () => {
    setInputs(Array(data.length).fill(""));
    setWrongInputs(Array(data.length).fill(false));
    setShowAnswer(false);
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
            justifyContent: "flex-start",
          }}
        >
          <div className="unscramble-container">
            <h3 className="WB-header-title-page8">
              <span className="WB-ex-A">A</span> Look and write the missing
              letters. Read.
            </h3>

            <Droppable droppableId="letters" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    display: "flex",
                    gap: "12px",
                    padding: "10px",
                    border: "2px dashed #ccc",
                    borderRadius: "10px",
                    marginTop: "20px",
                    justifyContent: "center",
                    width: "100%",
                    // justifyContent: "center",
                  }}
                >
                  {lettersBank.map((l, i) => (
                    <Draggable
                      key={l.id}
                      draggableId={l.value}
                      index={i}
                      isDragDisabled={showAnswer}
                    >
                      {(provided) => (
                        <div
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
                            fontSize: "22px",
                            ...provided.draggableProps.style,
                          }}
                        >
                          {l.value}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <div className="unscramble-row-wb-unit1-p8-q1 ">
              {data.map((item, index) => (
                <div className="unscramble-box" key={index}>
                  
                  <div className="input-row-wb-unit1-p8-q1">
                    <span
                      className="num"
                      style={{ fontSize: "25px", fontWeight: "600" }}
                    >
                      {index + 1}
                    </span>

                    <div className="input-wrapper-wb-unit1-page8-q1">
                      <Droppable
                        droppableId={String(index)}
                        isDropDisabled={showAnswer}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`WB-unit1-p8-q1-input ${
                            snapshot.isDraggingOver ? "drag-over-cell" : ""
                          }`}
                            style={{
                              background: snapshot.isDraggingOver
                                ? "#e3f2fd"
                                : "white",
                              fontSize: "25px",
                              fontWeight: "600",
                            }}
                          >
                            {inputs[index]}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      {/* ❌ علامة الخطأ */}
                      {wrongInputs[index] && (
                        <div className="error-icon-wb-unit1-p8-q1">✕</div>
                      )}
                    </div>

                    <span className="pattern" style={{ fontSize: "22px" }}>
                      {item.pattern}
                    </span>
                    <div className="img-box-wb-unit1-p8-q1">
                    <img src={item.img} alt="" />
                  </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ⭐ BUTTONS */}
        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>

          <button
            onClick={handleShowAnswer}
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

export default WB_Unit1_Page8_Q1;

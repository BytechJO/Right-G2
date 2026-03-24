import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import imgA from "../../../assets/imgs/test6.png";
import imgB from "../../../assets/imgs/test6.png";
import imgC from "../../../assets/imgs/test6.png";
import imgD from "../../../assets/imgs/test6.png";
import imgE from "../../../assets/imgs/test6.png";
import imgF from "../../../assets/imgs/test6.png";

const Unit10_Page6_Q2 = () => {
  const questions = [
    "It’s drinking milk.",
    "She’s setting the table.",
    "He’s throwing a ball.",
    "She’s helping Mom.",
    "He’s getting dressed.",
    "He’s reading a newspaper.",
  ];

  const options = ["a", "b", "c", "d", "e", "f"];

  const correct = {
    "q-0": "c",
    "q-1": "a",
    "q-2": "d",
    "q-3": "e",
    "q-4": "b",
    "q-5": "f",
  };

  const [answers, setAnswers] = useState({});
  const [locked, setLocked] = useState(false);

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || locked) return;

    // إذا رجع للبنك
    if (destination.droppableId === "bank") return;

    setAnswers((prev) => {
      const updated = { ...prev };

      // حذف من أي مكان سابق
      Object.keys(updated).forEach((key) => {
        if (updated[key] === draggableId) delete updated[key];
      });

      updated[destination.droppableId] = draggableId;
      return updated;
    });
  };

  const reset = () => {
    setAnswers({});
    setLocked(false);
  };

  const showAnswers = () => {
    setAnswers(correct);
    setLocked(true);
  };

  const checkAnswers = () => {
    if (locked) return;
    let score = 0;

    Object.keys(correct).forEach((key) => {
      if (answers[key] === correct[key]) score++;
    });

    const empty = questions.some((_, i) => !answers[`q-${i}`]);

    if (empty) {
      ValidationAlert.info("Please complete all answers.");
      return;
    }
    const total = questions.length;

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <b>Score: ${score} / ${total}</b>
      </div>
    `;

    if (score === total) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);

    setLocked(true);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        style={{ display: "flex", justifyContent: "center", padding: "30px" }}
      >
        <div style={{ width: "70%" }}>
          {/* HEADER */}
          <h5 className="header-title-page8">
            <span className="ex-A mr-5">E</span>Read and label.
          </h5>

          {/* 🔥 BANK (نفس Q1 بالزبط) */}
          <Droppable droppableId="bank" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: "flex",
                  gap: "15px",
                  justifyContent: "center",
                  marginBottom: "30px",
                }}
              >
                {options
                  .filter((l) => !Object.values(answers).includes(l)) // 👈 نفس Q1
                  .map((l, index) => (
                    <Draggable
                      key={l}
                      draggableId={l}
                      index={index}
                      isDragDisabled={locked}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,

                            width: "40px",
                            height: "40px",
                            border: "2px solid #333",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            cursor: "grab",
                            background: "#fff",
                          }}
                        >
                          {l}
                        </div>
                      )}
                    </Draggable>
                  ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div style={{ display: "flex", gap: "40px" }}>
            {/* LEFT SIDE */}
            <div style={{ flex: 1 }}>
              {questions.map((q, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "25px",
                  }}
                >
                  <span style={{ width: "20px", fontWeight: "bold" }}>
                    {i + 1}
                  </span>

                  <span style={{ flex: 1, marginLeft: "10px" }}>{q}</span>

                  {/* DROP BOX */}
                  <Droppable droppableId={`q-${i}`}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{
                          width: "40px",
                          height: "40px",
                          border: "2px solid #e74c3c",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {answers[`q-${i}`] && (
                          <Draggable
                            draggableId={answers[`q-${i}`]}
                            index={0}
                            isDragDisabled={locked}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={provided.draggableProps.style}
                              >
                                <span
                                  style={{
                                    color: "#d32f2f",
                                    fontWeight: "500",
                                    fontSize: "16px",
                                    cursor: "grab",
                                  }}
                                >
                                  {answers[`q-${i}`]}
                                </span>
                              </div>
                            )}
                          </Draggable>
                        )}

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>

            {/* RIGHT SIDE (صور فقط) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              {[imgA, imgB, imgC, imgD, imgE, imgF].map((img, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>{options[i]}</span>

                  <img
                    src={img}
                    style={{
                      height: "120px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* BUTTONS */}
          <div className="action-buttons-container">
            <button onClick={reset} className="try-again-button">
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
      </div>
    </DragDropContext>
  );
};

export default Unit10_Page6_Q2;

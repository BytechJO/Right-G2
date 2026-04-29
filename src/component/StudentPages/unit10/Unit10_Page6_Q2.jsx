import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import imgA from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 87/Ex E 1.svg";
import imgB from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 87/Ex E 2.svg";
import imgC from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 87/Ex E 3.svg";
import imgD from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 87/Ex E 4.svg";
import imgE from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 87/Ex E 5.svg";
import imgF from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 87/Ex E 6.svg";
import Button from "../../WorkBookPages/Button";

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

  // =========================
  // DRAG END (🔥 FIXED)
  // =========================
  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || locked) return;

    // استخرج القيمة الحقيقية (a,b,c...)
    const value = draggableId.split("-").pop();

    setAnswers((prev) => {
      const updated = { ...prev };

      // 🧹 احذف من أي مكان سابق
      Object.keys(updated).forEach((key) => {
        if (updated[key] === value) delete updated[key];
      });

      // 🟡 إذا رجع للبنك → بس احذفه
      if (destination.droppableId === "bank") {
        return updated;
      }

      // 🟢 ضيفه للمكان الجديد
      updated[destination.droppableId] = value;

      return updated;
    });
  };

  // =========================
  // RESET
  // =========================
  const reset = () => {
    setAnswers({});
    setLocked(false);
  };

  // =========================
  // SHOW ANSWERS
  // =========================
  const showAnswers = () => {
    setAnswers(correct);
    setLocked(true);
  };

  // =========================
  // CHECK
  // =========================
  const checkAnswers = () => {
    if (locked) return;

    const empty = questions.some((_, i) => !answers[`q-${i}`]);

    if (empty) {
      ValidationAlert.info("Please complete all answers.");
      return;
    }

    let score = 0;

    Object.keys(correct).forEach((key) => {
      if (answers[key] === correct[key]) score++;
    });

    const total = questions.length;

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

    setLocked(true);
  };

  const isWrongAnswer = (qId) => {
    if (!locked) return false;
    return answers[qId] && answers[qId] !== correct[qId];
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="main-container-component">
        <div className="div-forall" style={{gap:"20px"}}>
          <h5 className="header-title-page8">
            <span className="ex-A mr-5">E</span>Read and label.
          </h5>
             <div>
          {/* ================= BANK ================= */}
          <Droppable droppableId="bank" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: "flex",
                  gap: "50px",
                  justifyContent: "center",
                  marginBottom: "30px",
                  // border: "2px dashed gray",
                  padding: "10px",
                  borderRadius: "10px",
                }}
              >
                {options.map((l, index) => {
                  const isUsed = Object.values(answers).includes(l);

                  return (
                    <Draggable
                      key={`bank-${l}`}
                      draggableId={`bank-${l}`} // 🔥 UNIQUE
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
                            border: "2px solid #0013a5",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            background: isUsed ? "#e5e7eb" : "#fff",
                            color: isUsed ? "#9ca3af" : "#000",
                          }}
                        >
                          {l}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* ================= QUESTIONS ================= */}
          <div style={{ display: "flex", gap: "40px" }}>
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

                  <span
                    style={{
                      flex: 1,
                      marginLeft: "10px",
                      fontSize: "18px",
                      fontWeight: "700",
                    }}
                  >
                    {q}
                  </span>

                  <Droppable droppableId={`q-${i}`}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{
                          width: "40px",
                          height: "40px",
                          border: "2px solid #0013a5",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          fontSize: "18px",
                          fontWeight: "700",
                        }}
                      >
                        {answers[`q-${i}`] && (
                          <Draggable
                            draggableId={`q-${i}-${answers[`q-${i}`]}`} // 🔥 UNIQUE
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
                                {answers[`q-${i}`]}
                              </div>
                            )}
                          </Draggable>
                        )}

                        {isWrongAnswer(`q-${i}`) && (
                          <div
                            style={{
                              position: "absolute",
                              top: "-6px",
                              right: "-6px",
                              width: "18px",
                              height: "18px",
                              background: "red",
                              color: "white",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
                              border: "2px solid white",
                            }}
                          >
                            ✕
                          </div>
                        )}

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>

            {/* الصور */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              {[imgA, imgB, imgC, imgD, imgE, imgF].map((img, i) => (
                <div key={i} style={{ display: "flex", gap: "10px" }}>
                  <span>{options[i]}</span>
                  <img src={img} style={{ height: "120px" }} />
                </div>
              ))}
            </div>
          </div>
</div>
          {/* ================= BUTTONS ================= */}

          <Button
            handleStartAgain={reset}
            handleShowAnswer={showAnswers}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </DragDropContext>
  );
};

export default Unit10_Page6_Q2;

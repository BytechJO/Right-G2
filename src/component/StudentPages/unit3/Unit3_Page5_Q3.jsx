import React, { useState } from "react";
import img1 from "../../../assets/imgs/test.png";
import img2 from "../../../assets/imgs/test.png";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import "./Unit3_Page5_Q3.css";

const Unit3_Page5_Q3 = () => {
  const questions = [
    {
      img: img1,
      parts: [
        { type: "text", value: "She can" },
        { type: "input", answer: "make a sandwich" },
        { type: "text", value: "." },
      ],
      data: ["make", "sandwich"],
    },
    {
      img: img2,
      parts: [
        { type: "text", value: "He" },
        { type: "input", answer: "can’t fly a kite." },
        { type: "text", value: "." },
      ],
      data: ["fly", "kite"],
    },
  ];

  const [answers, setAnswers] = useState(
    questions.map((q) => q.parts.map((p) => (p.type === "input" ? "" : null))),
  );
  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false);

  const wordBank = [
    { id: "w1", text: "make a sandwich" },
    { id: "w2", text: "can’t fly a kite" },
  ];

  const onDragEnd = (result) => {
    if (!result.destination || locked) return;

    const { draggableId, destination } = result;

    setAnswers((prev) => {
      const copy = prev.map((row) => [...row]);

      // remove word from previous place
      copy.forEach((row, qi) =>
        row.forEach((val, pi) => {
          if (val === draggableId) copy[qi][pi] = "";
        }),
      );

      if (destination.droppableId.startsWith("drop-")) {
        const [qIndex, pIndex] = destination.droppableId
          .replace("drop-", "")
          .split("-")
          .map(Number);
        copy[qIndex][pIndex] = draggableId;
      }

      return copy;
    });

    setWrongInputs([]);
  };

  const checkAnswers = () => {
    if (locked) return;

    // 🔴 1) فحص إذا في input فاضي
    for (let qIndex = 0; qIndex < questions.length; qIndex++) {
      for (let pIndex = 0; pIndex < questions[qIndex].parts.length; pIndex++) {
        const part = questions[qIndex].parts[pIndex];

        if (part.type === "input") {
          const value = answers[qIndex][pIndex];

          if (!value || value.trim() === "") {
            ValidationAlert.info(
              "Oops!",
              "Please complete all sentences before checking.",
            );
            return; // ⛔ وقف التشييك
          }
        }
      }
    }

    // 🟢 2) التشييك الطبيعي
    let wrong = [];
    let score = 0;
    let total = 0;

    questions.forEach((q, qIndex) => {
      q.parts.forEach((p, pIndex) => {
        if (p.type === "input") {
          total++;
          const word =
            wordBank.find((w) => w.id === answers[qIndex][pIndex])?.text || "";
          if (word === p.answer) score++;
          else wrong.push(`${qIndex}-${pIndex}`);
        }
      });
    });

    setWrongInputs(wrong);
    setLocked(true);

    const msg = `Score: ${score} / ${total}`;
    if (score === total) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  const showAnswers = () => {
    setAnswers(
      questions.map((q) =>
        q.parts.map((p) =>
          p.type === "input"
            ? wordBank.find((w) => w.text === p.answer)?.id || ""
            : null,
        ),
      ),
    );
    setWrongInputs([]);
    setLocked(true);
  };

  const reset = () => {
    setAnswers(
      questions.map((q) =>
        q.parts.map((p) => (p.type === "input" ? "" : null)),
      ),
    );
    setWrongInputs([]);
    setLocked(false);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        style={{ display: "flex", justifyContent: "center", padding: "30px" }}
      >
        <div className="div-forall" style={{ width: "60%" }}>
          {/* ❌ الهيدر كما هو */}
          <h5 className="header-title-page8">
            <span className="ex-A">B</span>Look and write.
          </h5>

          {/* WORD BANK */}
          <Droppable droppableId="word-bank" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="CB-unit2-p6-q2-word-bank"
              >
                {wordBank.map((w, i) => (
                  <Draggable
                    key={w.id}
                    draggableId={w.id}
                    index={i}
                    isDragDisabled={locked}
                  >
                    {(provided) => (
                      <span
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="CB-unit2-p6-q2-word"
                        style={provided.draggableProps.style}
                      >
                        {w.text}
                      </span>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* QUESTIONS */}
          <div className="CB-review1-p1-q2-content">
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="CB-unit2-p6-q2-row">
                <div className="CB-unit2-p6-q2-left-container">
                  <div className="CB-unit2-p6-q2-left">
                    <span className="CB-unit2-p6-q2-index">{qIndex + 1}</span>
                    <img src={q.img} alt="" className="CB-unit2-p6-q2-img" />
                  </div>

                  <span className="CB-unit2-p6-q2-textSide">
                    {`${q.data[0]} /  ${q.data[1]}`}
                  </span>
                </div>
                <div className="CB-unit2-p6-q2-sentence">
                  {q.parts.map((part, pIndex) =>
                    part.type === "text" ? (
                      <span key={pIndex} className="CB-unit2-p6-q2-text">
                        {part.value}
                      </span>
                    ) : (
                      <Droppable
                        key={pIndex}
                        droppableId={`drop-${qIndex}-${pIndex}`}
                        isDropDisabled={locked}
                      >
                        {(provided, snapshot) => (
                          <span
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`CB-unit2-p6-q2-input ${
                              snapshot.isDraggingOver ? "drag-over-cell" : ""
                            }`}
                          >
                            {wordBank.find(
                              (w) => w.id === answers[qIndex][pIndex],
                            )?.text || ""}
                            {provided.placeholder}
                            {wrongInputs.includes(`${qIndex}-${pIndex}`) && (
                              <span className="CB-unit2-p6-q2-input-error">
                                ✕
                              </span>
                            )}
                          </span>
                        )}
                      </Droppable>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ❌ الأزرار كما هي */}
        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>
          <button
            onClick={showAnswers}
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

export default Unit3_Page5_Q3;

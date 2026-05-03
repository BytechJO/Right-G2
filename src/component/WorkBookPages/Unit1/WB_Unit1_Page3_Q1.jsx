import React, { useState } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 3/Ex A 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 3/Ex A 2.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import "./WB_Unit1_Page3_Q1.css";

const WB_Unit1_Page3_Q1 = () => {
  const questions = [
    {
      img: img1,
      parts: [
        { type: "text", value: "Who's he?" },
        { type: "input", answer: "He's my father" },
      ],
    },
    {
      img: img2,
      parts: [
        { type: "input", answer: "Who are they?" },
        { type: "input", answer: "They're my father and mother" },
      ],
    },
  ];

  const [answers, setAnswers] = useState(
    questions.map((q) => q.parts.map((p) => (p.type === "input" ? "" : null))),
  );
  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false);

  const wordBank = [
    { id: "w1", text: "He's my father" },
   
    { id: "w3", text: "They're my father and mother" }, 
    { id: "w2", text: "Who are they?" },
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

  // ✅ تحقق إذا في مدخلات فاضية
  const hasEmpty = answers.some((row) =>
    row.some((val) => val === "")
  );

  if (hasEmpty) {
    ValidationAlert.info("Please fill all answers first!");
    return;
  }

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
        <div className="div-forall" style={{ gap: "20px" }}>
          {/* ❌ الهيدر كما هو */}
          <h5 className="WB-header-title-page8">
            <span className="WB-ex-A">A</span>Look and write.
          </h5>
           
           <div className="flex flex-col gap-5">
          {/* WORD BANK */}
          <Droppable droppableId="word-bank" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="CB-unit2-p6-q2-word-bank" style={{marginBottom:"0px"}}
              >
                {wordBank.map((w, i) => {
                  const isUsed = answers.some((row) => row.includes(w.id));
                  return (
                    <Draggable
                      key={w.id}
                      draggableId={w.id}
                      index={i}
                      isDragDisabled={locked || isUsed}
                    >
                      {(provided) => (
                        <span
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="WB-word-bank"
                          style={{
                            background: isUsed ? "#ccc" : "white",
                            opacity: isUsed ? 0.6 : 1,
                            cursor: isUsed ? "not-allowed" : "grab",
                            ...provided.draggableProps.style,
                          }}
                        >
                          {w.text}
                        </span>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* QUESTIONS */}
          <div className="CB-unit2-p6-q2-content" style={{gap:"45px"}}>
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="CB-unit2-p6-q2-row">
                <div className="CB-unit2-p6-q2-left" style={{alignItems:"flex-start"}}>
                  <span className="font-bold text-2xl">{qIndex + 1}</span>
                  <img src={q.img} alt="" className="WB-unit1-p3-q1-img" />
                </div>

                <div className="WB-unit1-p3-q1-sentence">
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
                            className={`WB-unit1-p3-q1-input ${
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
          </div></div>
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

export default WB_Unit1_Page3_Q1;

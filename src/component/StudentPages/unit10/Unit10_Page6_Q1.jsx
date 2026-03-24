import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import img1 from "../../../assets/imgs/test6.png";
import img2 from "../../../assets/imgs/test6.png";
import img3 from "../../../assets/imgs/test6.png";
import img4 from "../../../assets/imgs/test6.png";
import img5 from "../../../assets/imgs/test6.png";

const Unit10_Page6_Q1 = () => {
  const questions = [
    {
      id: 1,
      img: img1,
      correct: "They're swinging.",
    },
    {
      id: 2,
      img: img2,
      correct: "He's listening to the radio.",
    },
    {
      id: 3,
      img: img3,
      correct: "He's sleeping.",
    },
    {
      id: 4,
      img: img4,
      correct: "He's driving.",
    },
    {
      id: 5,
      img: img5,
      correct: "She's watching TV.",
    },
  ];

  const sentences = [
    "He's sleeping.",
    "They're swinging.",
    "She's watching TV.",
    "He's listening to the radio.",
    "He's driving.",
  ];

  const [answers, setAnswers] = useState({});
  const [locked, setLocked] = useState(false);

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || locked) return;

    // إذا رجع للبنك
    if (destination.droppableId === "bank") return;

    setAnswers((prev) => {
      const updated = { ...prev };

      // حذف الجملة من أي مكان سابق
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
    const correctAnswers = {};

    questions.forEach((q) => {
      correctAnswers[`slot-${q.id}`] = q.correct;
    });

    setAnswers(correctAnswers);
    setLocked(true);
  };

  const checkAnswers = () => {
    if (locked) return;

    const empty = questions.some((q) => !answers[`slot-${q.id}`]);

    if (empty) {
      ValidationAlert.info("Please complete all answers.");
      return;
    }

    let score = 0;

    questions.forEach((q) => {
      if (answers[`slot-${q.id}`] === q.correct) {
        score++;
      }
    });

    const msg = `
    <div style="font-size:20px;text-align:center;">
      <span style="color:#2e7d32;font-weight:bold;">
        Score: ${score} / ${questions.length}
      </span>
    </div>
  `;

    if (score === questions.length) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);

    setLocked(true);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        style={{ display: "flex", justifyContent: "center", padding: "30px" }}
      >
        <div className="div-forall" style={{ width: "60%" }}>
          {/* ❌ الهيدر كما هو */}
          <h5 className="header-title-page8">
            <span className="ex-A mr-5">D</span>Look and write .
          </h5>
          <Droppable droppableId="bank" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex gap-3 justify-center flex-wrap mb-5"
              >
                {sentences
                  .filter((s) => !Object.values(answers).includes(s))
                  .map((s, index) => (
                    <Draggable
                      key={s}
                      draggableId={s}
                      index={index}
                      isDragDisabled={locked}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-blue-200 px-4 py-2 rounded-full cursor-grab text-center"
                        >
                          {s}
                        </div>
                      )}
                    </Draggable>
                  ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {questions.map((q) => (
            <div
              key={q.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "18px",
              }}
            >
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  width: "25px",
                }}
              >
                {q.id}
              </span>

              <img
                src={q.img}
                style={{
                  height: "95px",
                  width: "180px",
                  objectFit: "cover",
                  border: "2px solid #e74c3c",
                  borderRadius: "12px",
                  marginRight: "20px",
                }}
              />

              <Droppable droppableId={`slot-${q.id}`}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      flex: 1,
                      borderBottom: "2px solid #333",
                      minHeight: "30px",
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: "10px",
                    }}
                  >
                    {answers[`slot-${q.id}`] && (
                      <Draggable
                        draggableId={answers[`slot-${q.id}`]}
                        index={0}
                        isDragDisabled={locked}
                      >
                        {(provided) => (
                          <div // ✅ بدل span
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <span
                              style={{
                                color: "#d32f2f",
                                fontWeight: "500",
                                fontSize: "16px",
                                cursor: "grab",
                              }}
                            >
                              {answers[`slot-${q.id}`]}
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

export default Unit10_Page6_Q1;

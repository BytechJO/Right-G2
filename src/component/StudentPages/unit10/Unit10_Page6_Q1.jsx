import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import img1 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 87/Ex D 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 87/Ex D 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 87/Ex D 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 87/Ex D 4.svg";
import img5 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 87/Ex D 5.svg";

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

    // 🧠 نجيب الجملة الأصلية
    const value = draggableId.includes("bank-")
      ? draggableId.replace("bank-", "")
      : draggableId.split("-").slice(2).join("-");

    setAnswers((prev) => {
      const updated = { ...prev };

      // حذف من أي مكان
      Object.keys(updated).forEach((key) => {
        if (updated[key] === value) delete updated[key];
      });

      if (destination.droppableId === "bank") {
        return updated;
      }

      updated[destination.droppableId] = value;

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

    const color =
      score === questions.length ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${score} / ${questions.length}
        </span>
      </div>
    `;
    if (score === questions.length) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);

    setLocked(true);
  };
  const isWrongAnswer = (qId) => {
    if (!locked) return false;

    const userAnswer = answers[`slot-${qId}`];
    if (!userAnswer) return false;

    const correctAnswer = questions.find((q) => q.id === qId)?.correct;

    return userAnswer !== correctAnswer;
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="main-container-component mb-10">
        <div className="div-forall" style={{ gap: "30px" }}>
          {/* ❌ الهيدر كما هو */}
          <h5 className="header-title-page8">
            <span className="ex-A mr-5">D</span>Look and write .
          </h5>
          <div className="flex flex-col gap-10">
            <Droppable droppableId="bank" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex gap-5 w-full justify-between flex-wrap rounded-lg"
                >
                  {sentences.map((s, index) => {
                    const isUsed = Object.values(answers).includes(s);
                    return (
                      <Draggable
                        key={`bank-${s}`}
                        draggableId={`bank-${s}`}
                        index={index}
                        isDragDisabled={locked || isUsed}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps} // 🔥 دايمًا موجودة
                            className={`px-4 py-2 rounded-full text-center
        ${isUsed ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-200 cursor-grab"}`}
                          >
                            {s}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <div>
            {questions.map((q) => (
              <div
                key={q.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
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
                <div className="flex justify-center w-full">
                <img
                  src={q.img}
                  style={{
                    height: "auto",
                    width: "35%",

                    borderRadius: "12px",
                    marginRight: "20px",
                  }}
                />

                <Droppable droppableId={`slot-${q.id}`}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="relative transition-all duration-200"
                      style={{
                        // flex: 1,
                        minHeight: "30px",
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: "10px",
                        width:"100%",

                        // 🔥 الإيفيكت
                        borderBottom: snapshot.isDraggingOver
                          ? "2px dashed #3b82f6"
                          : isWrongAnswer(q.id)
                            ? "2px solid #ef4444"
                            : "1px solid #333",

                        backgroundColor: snapshot.isDraggingOver
                          ? "#dbeafe"
                          : "transparent",
                      }}
                    >
                      {answers[`slot-${q.id}`] && (
                        <Draggable
                          draggableId={`slot-${q.id}-${answers[`slot-${q.id}`]}`}
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
                      {isWrongAnswer(q.id) && (
                        <div
                          className="
      absolute -top-2 -right-2
      w-7 h-7
      bg-red-500 text-white
      rounded-full
      flex items-center justify-center
      text-sm font-bold
      border-2 border-white
      z-10
    "
                        >
                          ✕
                        </div>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                </div>
              </div>
            ))}
          </div></div>
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

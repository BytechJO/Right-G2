import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import img1 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 81/Asset 43.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 81/Ex D 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 81/Ex D 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 81/Ex D 4.svg";

const Unit9_Page6_Q1 = () => {
  const questions = [
    {
      id: 1,
      img: img1,
      correct: "He's riding a bike.",
    },
    {
      id: 2,
      img: img2,
      correct: "She is eating an apple.",
    },
    {
      id: 3,
      img: img3,
      correct: "They're eating corn.",
    },
    {
      id: 4,
      img: img4,
      correct: "They're playing soccer.",
    },
  ];

  const sentences = [
    "He's riding a bike.",
    "They're playing soccer.",
    "They're eating corn.",
    "She is eating an apple.",
  ];

  const [answers, setAnswers] = useState({});
  const [locked, setLocked] = useState(false);

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || locked) return;

    // 🔥 استخراج النص الحقيقي
    const value = draggableId.startsWith("bank-")
      ? draggableId.replace("bank-", "")
      : draggableId.split("-").slice(2).join("-");

    setAnswers((prev) => {
      const updated = { ...prev };

      // 🧹 احذف من أي مكان
      Object.keys(updated).forEach((key) => {
        if (updated[key] === value) delete updated[key];
      });

      // 🟡 إذا رجع للبنك
      if (destination.droppableId === "bank") {
        return updated;
      }

      // 🟢 غير هيك
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
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
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

    const correctAnswer = questions.find((q) => q.id === qId).correct;

    return userAnswer !== correctAnswer;
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="main-container-component mb-10">
        <div className="div-forall" style={{gap:"10px"}}>
          {/* ❌ الهيدر كما هو */}
          <h5 className="header-title-page8">
            <span className="ex-A mr-4">D</span>Look and write .
          </h5>
          <div>
          <Droppable droppableId="bank" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex gap-4 justify-center flex-wrap mb-3 p-4 rounded-lg"
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
                          {...provided.dragHandleProps}
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
          <div className="flex flex-col gap-2">
            {questions.map((q) => (
              <div key={q.id} className="flex items-center">
                <div className="flex justify-start gap-5">
                <span className="font-bold text-[20px]">{q.id}</span>

                <img
                  src={q.img}
                  style={{ height: "auto", width: "70%" }}
                  className=" object-contain"
                />
</div>
               <Droppable droppableId={`slot-${q.id}`}>
  {(provided, snapshot) => (
    <div
      ref={provided.innerRef}
      {...provided.droppableProps}
      className={`
        relative flex-1 min-h-[35px] border-b-1 transition-all duration-200
        ${
          snapshot.isDraggingOver
            ? "bg-blue-100 border-blue-400 border-dashed"
            : isWrongAnswer(q.id)
            ? "border-red-500"
            : "border-black"
        }
      `}
    >
      {answers[`slot-${q.id}`] && (
        <Draggable
          draggableId={`slot-${q.id}-${answers[`slot-${q.id}`]}`}
          index={0}
          isDragDisabled={locked}
        >
          {(provided) => (
            <span
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="text-blue-800 cursor-pointer text-xl"
            >
              {answers[`slot-${q.id}`]}
            </span>
          )}
        </Draggable>
      )}

      {isWrongAnswer(q.id) && (
        <div className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white z-10 shadow-lg">
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
          </div>
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

export default Unit9_Page6_Q1;

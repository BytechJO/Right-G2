import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import "./Review5_Page2_Q3.css";

import bee from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 53/EX G 1.svg";
import tea from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 53/EX G 2.svg";
import sleep from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 53/EX G 3.svg";
import read from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 53/EX G 4.svg";

const Review5_Page2_Q4 = () => {
  const questions = [
    {
      id: 1,
      parts: [
        { type: "text", value: "The" },
        { type: "blank", answer: "bee" },
        { type: "img", src: bee },
        { type: "text", value: "lands in the" },
        { type: "blank", answer: "tea" },
        { type: "img", src: tea },
        { type: "text", value: "." },
      ],
    },
    {
      id: 2,
      parts: [
        { type: "text", value: "I" },
        { type: "blank", answer: "sleep" },
        { type: "img", src: sleep },
        { type: "text", value: "after I" },
        { type: "blank", answer: "read" },
        { type: "img", src: read },
        { type: "text", value: "a book." },
      ],
    },
  ];

  const options = ["bee", "tea", "sleep", "read"];

  const [answers, setAnswers] = useState({});
  const [locked, setLocked] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const onDragEnd = (result) => {
    const { destination, draggableId } = result;

    if (!destination || locked) return;

    const word = draggableId.replace("word-", "");

    const updated = { ...answers };

    // ❌ حذف الكلمة من أي slot سابق
    Object.keys(updated).forEach((key) => {
      if (updated[key] === word) {
        delete updated[key];
      }
    });

    updated[destination.droppableId] = word;

    setAnswers(updated);
  };

  const reset = () => {
    setAnswers({});
    setLocked(false);
    setShowResult(false); // 🔥 هذا الناقص
  };

  const show = () => {
    if (locked) return;

    const correct = {};

    questions.forEach((q, qIndex) => {
      q.parts.forEach((p, pIndex) => {
        if (p.type === "blank") {
          correct[`slot-${qIndex}-${pIndex}`] = p.answer;
        }
      });
    });

    setAnswers(correct);
    setLocked(true);
  };

  const checkAnswers = () => {
    if (locked) return;

    const blanks = [];

    questions.forEach((q, qIndex) => {
      q.parts.forEach((p, pIndex) => {
        if (p.type === "blank") {
          blanks.push({
            slot: `slot-${qIndex}-${pIndex}`,
            answer: p.answer,
          });
        }
      });
    });

    if (blanks.some((b) => !answers[b.slot])) {
      ValidationAlert.info("Please complete all answers");
      return;
    }

    let score = 0;

    blanks.forEach((b) => {
      if (answers[b.slot] === b.answer) {
        score++;
      }
    });

    const total = blanks.length;
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
    setShowResult(true); // 🔥 مهم
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="main-container-component">
        <div className="div-forall">
          <h5 className="header-title-page8">
            <span className="mr-4">G</span>
            Read, look, and complete the sentences.
          </h5>

          <div className="flex flex-col gap-5">

          {/* WORD BANK */}

          <Droppable droppableId="bank" direction="horizontal" isDropDisabled>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex gap-10 justify-center p-4 rounded-lg"
              >
                {options.map((word, i) => {
                  const isUsed = Object.values(answers).includes(word);

                  return (
                    <Draggable
                      key={word}
                      draggableId={`word-${word}`}
                      index={i}
                      isDragDisabled={locked || isUsed} // خليها draggable
                    >
                      {(provided) => (
                        <span
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`px-3.5 py-1.5 border-2 border-[#2c5287] rounded-lg font-bold bg-white
    ${isUsed ? "opacity-40" : ""}
    ${locked ? "cursor-not-allowed" : "cursor-grab"}
  `}
                        >
                          {word}
                        </span>
                      )}
                    </Draggable>
                  );
                })}

                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* SENTENCES */}

          <div className="flex flex-col">
            {questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="flex items-center gap-5 text-[20px] mb-[50px]"
              >
                <span className="font-bold">{q.id}</span>

                {q.parts.map((part, pIndex) => {
                  if (part.type === "text") {
                    return <span key={pIndex}>{part.value}</span>;
                  }

                  if (part.type === "img") {
                    return (
                      <img
                        key={pIndex}
                        src={part.src}
                        alt=""
                        style={{
                          maxWidth: "120px",
                          width: "100%",
                          height: "auto",
                          objectFit: "contain",
                        }}
                      />
                    );
                  }

                  if (part.type === "blank") {
                    const slotId = `slot-${qIndex}-${pIndex}`;

                    const isWrong =
                      showResult &&
                      answers[slotId] &&
                      answers[slotId] !== part.answer;

                    const isCorrect =
                      showResult && answers[slotId] === part.answer;
                    return (
                      <Droppable droppableId={slotId} key={pIndex}>
                        {(provided, snapshot) => (
                          <div className="relative">
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`min-w-[100px] h-10 border-b-2 text-center flex items-center justify-center ${snapshot.isDraggingOver ? "bg-blue-100" : ""} ${showResult ? (isCorrect ? "border-black" : isWrong ? "border-red-500" : "border-black") : "border-black"}`}
                            >
                              {answers[slotId] && (
                                <span className="font-bold">
                                  {answers[slotId]}
                                </span>
                              )}
                              {isWrong && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md border-2 border-white">
                                  ✕
                                </div>
                              )}
                              {provided.placeholder}
                            </div>
                          </div>
                        )}
                      </Droppable>
                    );
                  }
                })}
              </div>
            ))}
          </div>
          </div>
        </div>

        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>

          <button onClick={show} className="show-answer-btn">
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

export default Review5_Page2_Q4;

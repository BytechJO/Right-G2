import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import "./Review5_Page2_Q3.css";

import bee from "../../../assets/imgs/test6.png";
import tea from "../../../assets/imgs/test6.png";
import sleep from "../../../assets/imgs/test6.png";
import read from "../../../assets/imgs/test6.png";

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

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;

    if (!destination || locked) return;

    const word = draggableId.replace("word-", "");

    const updated = { ...answers };
    updated[destination.droppableId] = word;

    setAnswers(updated);
  };

  const reset = () => {
    setAnswers({});
    setLocked(false);
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

    const message = `
    <div style="font-size:20px;text-align:center;">
      <span style="color:#2e7d32;font-weight:bold;">
        Score: ${score} / ${total}
      </span>
    </div>
    `;

    if (score === total) ValidationAlert.success(message);
    else if (score === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);

    setLocked(true);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex justify-center p-8">
        <div className="w-[60%]">
          <h5 className="header-title-page8">
            <span className="mr-4">G</span>
            Read, look, and complete the sentences.
          </h5>

          {/* WORD BANK */}

          <Droppable droppableId="bank" direction="horizontal" isDropDisabled>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex gap-5 justify-center mb-[30px]"
              >
                {options
                  .filter((word) => !Object.values(answers).includes(word))
                  .map((word, i) => (
                    <Draggable
                      key={word}
                      draggableId={`word-${word}`}
                      index={i}
                      isDragDisabled={locked}
                    >
                      {(provided) => (
                        <span
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="px-3.5 py-1.5 border-2 border-[#2c5287] rounded-lg cursor-grab font-bold bg-white"
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

          {/* SENTENCES */}

          <div className="flex flex-col gap-[60px]">
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

                    return (
                      <Droppable droppableId={slotId} key={pIndex}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`min-w-[100px] border-b-2 border-black text-center flex items-center justify-center ${
                              snapshot.isDraggingOver ? "bg-blue-100" : ""
                            }`}
                          >
                            {answers[slotId] && (
                              <span className="font-bold">
                                {answers[slotId]}
                              </span>
                            )}
                            {provided.placeholder}
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

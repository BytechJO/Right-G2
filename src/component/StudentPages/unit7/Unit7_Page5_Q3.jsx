import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import img1 from "../../../assets/imgs/test6.png";
import img2 from "../../../assets/imgs/test6.png";
import img3 from "../../../assets/imgs/test6.png";

const Unit7_Page5_Q3 = () => {
  const questions = [
    {
      id: 1,
      type: "complete",
      img: img1,
      sentence: "It is a quarter past five.",
    },

    {
      id: 2,
      type: "twoWords",
      img: img2,
      words: ["thirty", "four"],
      answer: "four thirty",
    },

    {
      id: 3,
      type: "scramble",
      img: img3,
      words: ["to", "quarter", "ten", "a", "o'clock"],
      answer: "a quarter to ten o'clock",
    },
  ];

  const [answers, setAnswers] = useState({});
  const [locked, setLocked] = useState(false);

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || locked) return;

    const word = draggableId.replace("word-", "");

    setAnswers({
      ...answers,
      [destination.droppableId]: answers[destination.droppableId]
        ? answers[destination.droppableId] + " " + word
        : word,
    });
  };

  const reset = () => {
    setAnswers({});
    setLocked(false);
  };

  const showAnswers = () => {
    const correct = {};

    questions.forEach((q, i) => {
      if (q.answer) {
        correct[`slot-${i}`] = q.answer;
      }
    });

    setAnswers(correct);
    setLocked(true);
  };

  const checkAnswers = () => {
    if (locked) return;
    const empty = questions.some((q, i) => q.answer && !answers[`slot-${i}`]);

    if (empty) {
      ValidationAlert.info("Please complete all answers.");
      return;
    }
    let score = 0;
    let total = 0;

    questions.forEach((q, i) => {
      if (!q.answer) return;

      total++;

      if (answers[`slot-${i}`] === q.answer) {
        score++;
      }
    });

    const msg = `
<div style="font-size:20px;text-align:center;">
<span style="color:#2e7d32;font-weight:bold;">
Score: ${score} / ${total}
</span>
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
        <div className="div-forall" style={{ width: "60%" }}>
          {/* ❌ الهيدر كما هو */}
          <h5 className="header-title-page8">
            <span className="ex-A mr-2.5">B</span>Look and write.
          </h5>
          {questions.map((q, i) => {
            return (
              <div key={i} className="flex flex-col gap-4 w-full max-w-[800px]">
                {/* OPTIONS */}
                {q.words && (
                  <Droppable
                    droppableId={`bank-${i}`}
                    direction="horizontal"
                    isDropDisabled
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex gap-4 justify-center items-center w-full"
                      >
                        {q.words
                          .filter(
                            (w) =>
                              !(answers[`slot-${i}`] || "")
                                .split(" ")
                                .includes(w),
                          )
                          .map((w, index) => (
                            <Draggable
                              key={w}
                              draggableId={`word-${w}`}
                              index={index}
                              isDragDisabled={locked}
                            >
                              {(provided) => (
                                <span
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="bg-blue-200 px-4 py-2 rounded-lg cursor-grab"
                                >
                                  {w}
                                </span>
                              )}
                            </Draggable>
                          ))}

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                )}

                {/* ROW */}

                <div className="flex items-center gap-4">
                  <span className="font-bold w-5">{q.id}</span>

                  <img
                    src={q.img}
                    className="w-[110px]! h-[110px]! object-contain"
                  />

                  {q.type === "complete" && <span>{q.sentence}</span>}

                  {q.type !== "complete" && (
                    <>
                      <span>It is</span>

                      <Droppable droppableId={`slot-${i}`}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="border-b-2 flex-1 min-h-[35px]"
                          >
                            {answers[`slot-${i}`] && (
                              <span
                                className="text-red-600 cursor-pointer"
                                onClick={() => {
                                  const updated = { ...answers };
                                  delete updated[`slot-${i}`];
                                  setAnswers(updated);
                                }}
                              >
                                {answers[`slot-${i}`]}
                              </span>
                            )}

                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      <span>.</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
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

export default Unit7_Page5_Q3;

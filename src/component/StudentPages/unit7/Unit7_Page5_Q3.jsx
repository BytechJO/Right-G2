import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import img1 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 62/Ex B 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 62/Ex B 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 62/Ex B 3.svg";

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
  const [showResult, setShowResult] = useState(false); // ✅

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
    setShowResult(false); // ✅ مهم
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
    setShowResult(true);
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
    setShowResult(true); // ✅
  };

  // ✅ check wrong
  const isWrong = (i) => {
    if (!showResult) return false;

    const q = questions[i];
    if (!q.answer) return false;

    return answers[`slot-${i}`] !== q.answer;
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="main-container-component">
        <div className="div-forall" style={{gap:"20px"}}>
          <h5 className="header-title-page8">
            <span className="ex-A mr-2.5">B</span>Look and write.
          </h5>
          <div className="flex flex-col gap-3">
          {questions.map((q, i) => {
            return (
              <div key={i} className="flex flex-col gap-4 w-full max-w-[800px]">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-[22px] w-5">{q.id}</span>

                  {q.type === "complete" && (
                    <div className="flex items-center gap-4">
                      <img
                        src={q.img}
                        className="w-[110px]! h-[110px]! object-contain"
                      />

                      <span>{q.sentence}</span>
                    </div>
                  )}

                  {q.type !== "complete" && (
                    <div className="w-full flex flex-col gap-3">
                      {/* WORD BANK */}
                      <div className="flex items-center gap-4"> 
                        <img
                          src={q.img}
                          className="w-[110px]! h-[110px]! object-contain"
                        />
                        <div className="border-2 border-dashed border-gray-400 rounded-lg p-2 w-full">
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
                                  {q.words.map((w, index) => {
                                    const used = (answers[`slot-${i}`] || "")
                                      .split(" ")
                                      .includes(w);

                                    return (
                                      <Draggable
                                        key={w}
                                        draggableId={`word-${w}`}
                                        index={index}
                                        isDragDisabled={locked || used}
                                      >
                                        {(provided) => (
                                          <span
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`px-4 py-2 rounded-lg transition-all
                                            ${
                                              used
                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                                                : "bg-blue-200 cursor-grab hover:bg-blue-300"
                                            }
                                          `}
                                          >
                                            {w}
                                          </span>
                                        )}
                                      </Draggable>
                                    );
                                  })}

                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          )}
                        </div>
                      </div>
                      {/* ANSWER */}
                      <div className="flex w-full text-lg font-bold">
                        <span>It is</span>

                        <Droppable droppableId={`slot-${i}`}>
                          {(provided) => (
                            <div className="relative flex-1 h-[35px]">
                              {/* ❌ */}
                              {isWrong(i) && (
                                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-md">
                                  ✕
                                </span>
                              )}

                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`border-b-1 h-full ${
                                  isWrong(i) ? "border-red-500" : "border-black"
                                }`}
                              >
                                {answers[`slot-${i}`] && (
                                  <span
                                    className="text-blue-800 cursor-pointer mx-2"
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
                            </div>
                          )}
                        </Droppable>

                        <span>.</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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

export default Unit7_Page5_Q3;

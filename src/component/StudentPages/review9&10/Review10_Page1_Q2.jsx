import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";

const Review10_Page1_Q2 = () => {
  const answersBank = [
    { id: "a1", text: "What are they doing" },
    { id: "a2", text: "What's he doing" },
    { id: "a3", text: "What are they doing" },
    { id: "a4", text: "What are you doing" },
  ];

  const questions = [
    { id: "1", sentence: "He’s playing soccer.", answer_q: "What's he doing" },
    { id: "2", sentence: "I’m running.", answer_q: "What are you doing" },
    {
      id: "3",
      sentence: "They’re flying kites.",
      answer_q: "What are they doing",
    },
    {
      id: "4",
      sentence: "They’re eating apples.",
      answer_q: "What are they doing",
    },
  ];

  const [answers, setAnswers] = useState({});
  const [locked, setLocked] = useState(false);

  const onDragEnd = (result) => {
    if (!result.destination || locked) return;

    const draggedId = result.draggableId;
    const questionId = result.destination.droppableId.replace("answer-", "");

    setAnswers((prev) => {
      const newAnswers = { ...prev };

      // remove if already used
      Object.keys(newAnswers).forEach((key) => {
        if (newAnswers[key] === draggedId) {
          delete newAnswers[key];
        }
      });

      newAnswers[questionId] = draggedId;

      return newAnswers;
    });
  };

  const reset = () => {
    setAnswers({});
    setLocked(false);
  };

  const showAnswers = () => {
    const filled = {};
    const used = [];

    questions.forEach((q) => {
      const matches = answersBank.filter((a) => a.text === q.answer_q);

      const available = matches.find((m) => !used.includes(m.id));

      if (available) {
        filled[q.id] = available.id;
        used.push(available.id);
      }
    });

    setAnswers(filled);
    setLocked(true);
  };
  const checkAnswers = () => {
    if (locked) return;

    if (Object.keys(answers).length < questions.length) {
      ValidationAlert.info("Please complete all answers.");
      return;
    }

    let correct = 0;

    questions.forEach((q) => {
      const selected = answersBank.find((a) => a.id === answers[q.id])?.text;

      if (selected === q.answer_q) {
        correct++;
      }
    });

    const total = questions.length;

    const msg = `
  <div style="font-size:20px;text-align:center;">
  <b>Score: ${correct} / ${total}</b>
  </div>
  `;

    if (correct === total) ValidationAlert.success(msg);
    else if (correct === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);

    setLocked(true);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex justify-center p-8">
        <div className="w-[80%]">
          <h5 className="header-title-page8 mb-10">
            <span style={{ marginRight: "20px" }}>B</span>
            Read and write the question.{" "}
          </h5>

          <div className="w-[70%] mx-auto pt-5">
            {/* ANSWERS BANK */}

            <Droppable droppableId="bank" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-wrap gap-4 justify-center mb-5"
                >
                  {answersBank
                    .filter((a) => !Object.values(answers).includes(a.id))
                    .map((a, index) => (
                      <Draggable
                        key={a.id}
                        draggableId={a.id}
                        index={index}
                        isDragDisabled={locked}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-yellow-200 px-4 py-2 rounded-lg cursor-grab"
                          >
                            {a.text}
                          </div>
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* QUESTIONS GRID */}

            <div className="grid grid-cols-2 gap-x-16 mb-20">
              {questions.map((q) => (
                <div key={q.id} className="mb-6">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg">{q.id}</span>

                    <Droppable droppableId={`answer-${q.id}`}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="border-b-2 border-black min-h-10 flex-1"
                        >
                          <span className="text-red-600 font-semibold ">
                            {
                              answersBank.find((a) => a.id === answers[q.id])
                                ?.text
                            }
                          </span>

                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                    <span>?</span>
                  </div>

                  <div className="ml-8 mt-2 text-gray-800">{q.sentence}</div>
                </div>
              ))}
            </div>
          </div>
          {/* BUTTONS */}

          <div className="action-buttons-container mt-10">
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
      </div>
    </DragDropContext>
  );
};

export default Review10_Page1_Q2;

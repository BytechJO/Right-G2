import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";

const Unit7_Page6_Q1 = () => {
  const wordBank = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const questions = [
    { id: 1, number: 4, answer: "Wednesday" },
    { id: 2, number: 2, answer: "Monday" },
    { id: 3, number: 6, answer: "Friday" },
  ];

  const [answers, setAnswers] = useState({
    1: "",
    2: "",
    3: "",
  });

  const [locked, setLocked] = useState(false);

  const onDragEnd = (result) => {
    if (!result.destination || locked) return;

    const word = result.draggableId;
    const dest = result.destination.droppableId;

    if (dest.startsWith("answer-")) {
      const id = dest.split("-")[1];

      setAnswers((prev) => ({
        ...prev,
        [id]: word,
      }));
    }
  };

  const checkAnswers = () => {
    if (locked) return;

    // ✅ إذا لم يملأ كل الإجابات
    if (Object.values(answers).includes("")) {
      ValidationAlert.info("Please complete all answers.");
      return;
    }

    let correct = 0;

    questions.forEach((q) => {
      if (answers[q.id] === q.answer) correct++;
    });

    const total = questions.length;

    let color = correct === total ? "green" : correct === 0 ? "red" : "orange";

    const message = `
    <div style="font-size:20px;text-align:center;">
      <b style="color:${color};">Score: ${correct} / ${total}</b>
    </div>
  `;

    if (correct === total) ValidationAlert.success(message);
    else if (correct === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);

    setLocked(true);
  };
  const reset = () => {
    setAnswers({
      1: "",
      2: "",
      3: "",
    });
    setLocked(false);
  };

  const showAnswers = () => {
    const filled = {};
    questions.forEach((q) => {
      filled[q.id] = q.answer;
    });

    setAnswers(filled);
    setLocked(true);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col items-center p-8">
        <div className="w-[60%]">
          <h5 className="header-title-page8" style={{ marginBottom: "20px" }}>
            <span className="ex-A">D </span>Read and write.
          </h5>

          {/* WORD BANK */}
          <Droppable droppableId="bank" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-wrap gap-3 mb-10"
              >
                {wordBank.map((word, index) => (
                  <Draggable key={word} draggableId={word} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="px-4 py-2 border rounded-lg bg-white shadow cursor-grab hover:bg-gray-100"
                      >
                        {word}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* QUESTIONS */}
          {questions.map((q) => (
            <div key={q.id} className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 flex items-center justify-center text-4xl border-2 border-red-400 rounded-xl">
                {q.number}
              </div>

              <div className="text-lg">
                <p>What day is it today?</p>

                <Droppable droppableId={`answer-${q.id}`}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="border-b-2 border-black min-w-[250px] py-1"
                    >
                      It is
                      <span style={{ color: "red" }}>
                        {" "}
                        {answers[q.id]}
                        {provided.placeholder}
                      </span>
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}

          {/* BUTTONS */}
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
      </div>
    </DragDropContext>
  );
};

export default Unit7_Page6_Q1;

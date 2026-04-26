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
    { id: "1", sentence: "He’s playing soccer.", answer_q: "a2" },
    { id: "2", sentence: "I’m running.", answer_q: "a4" },
    { id: "3", sentence: "They’re flying kites.", answer_q: "a1" },
    { id: "4", sentence: "They’re eating apples.", answer_q: "a3" },
  ];

  const [answers, setAnswers] = useState({});
  const [locked, setLocked] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const getTextById = (id) =>
    answersBank.find((a) => a.id === id)?.text;

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || locked) return;

    setAnswers((prev) => {
      const updated = { ...prev };

      // حذف الكلمة من أي مكان
      Object.keys(updated).forEach((key) => {
        if (updated[key] === draggableId) {
          delete updated[key];
        }
      });

      // إذا رجعت للبنك
      if (destination.droppableId === "bank") {
        return updated;
      }

      // إذا انحطت بسؤال
      const id = destination.droppableId.split("-")[1];
      updated[id] = draggableId;

      return updated;
    });
  };

  const reset = () => {
    setAnswers({});
    setLocked(false);
    setResetKey((prev) => prev + 1);
  };

  const showAnswers = () => {
    const filled = {};
    questions.forEach((q) => {
      filled[q.id] = q.answer_q;
    });
    setAnswers(filled);
    setLocked(true);
  };

  const checkAnswers = () => {
    if (locked) return;

    const empty = questions.some((q) => !answers[q.id]);

    if (empty) {
      ValidationAlert.info("Please complete all answers.");
      return;
    }

    let correct = 0;

    questions.forEach((q) => {
      if (answers[q.id] === q.answer_q) correct++;
    });

    const total = questions.length;

    const color =
      correct === total ? "green" : correct === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${correct} / ${total}
        </span>
      </div>
    `;

    if (correct === total) ValidationAlert.success(msg);
    else if (correct === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);

    setLocked(true);
  };

  const isWrongAnswer = (qId) => {
    if (!locked) return false;

    const userAnswer = answers[qId];
    if (!userAnswer) return false;

    const correctAnswer = questions.find((q) => q.id === qId)?.answer_q;

    return userAnswer !== correctAnswer;
  };

  return (
    <DragDropContext key={resetKey} onDragEnd={onDragEnd}>
      <div className="main-container-component">
        <div className="div-forall">
          <h5 className="header-title-page8 ">
            <span style={{ marginRight: "20px" }}>B</span>Read and write the question.


          </h5>
          
          <div className="flex flex-col gap-5">
          {/* ANSWERS BANK */}
          <Droppable droppableId="bank" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-wrap gap-4 justify-center mb-5 p-2 rounded-lg"
              >
             {answersBank.map((a, index) => {
  const isUsed = Object.values(answers).includes(a.id);

  return (
    <Draggable
      key={a.id + (isUsed ? "-used" : "-free")}
      draggableId={a.id}
      index={index}
      isDragDisabled={locked}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            padding: "6px 10px",
            border: "2px solid #0013a5",
            borderRadius: "8px",
            fontWeight: "bold",
            background: isUsed ? "#e5e7eb" : "#fff",
            color: isUsed ? "#9ca3af" : "#000",
            cursor: locked ? "not-allowed" : "grab",
          }}
        >
          {a.text}
        </div>
      )}
    </Draggable>
  );
})}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* QUESTIONS */}
          <div className="flex flex-col gap-10 items-center mb-20">
            {[0, 2].map((startIndex) => (
              <div key={startIndex} className="w-full">
                <div className="flex justify-between px-10">
                  {questions.slice(startIndex, startIndex + 2).map((q) => (
                    <div key={q.id} className="flex flex-col items-start gap-5">
                      <div className="flex gap-5 items-center justify-center">
                      <span className="font-bold text-lg">{q.id}</span>

                      <Droppable droppableId={`answer-${q.id}`}>
  {(provided, snapshot) => (
    <div
      ref={provided.innerRef}
      {...provided.droppableProps}

      style={{
        width: "300px",
        minHeight: "35px",
        marginTop: "10px",
        display: "flex",
        alignItems: "center",
        position: "relative",

        // 🔥 الايفيكت
        borderBottom: `2px ${
          snapshot.isDraggingOver ? "dashed #2563eb" : "solid black"
        }`,
        backgroundColor: snapshot.isDraggingOver
          ? "#bfdbfe"
          : "",
        // borderRadius: "8px",
        transition: "all 0.2s ease",
        paddingLeft: "10px",

        // optional تكبير بسيط
        transform: snapshot.isDraggingOver ? "scale(1.02)" : "scale(1)",
      }}
            isDragDisabled={true}
    >
                            {answers[q.id] && (
                              <Draggable
                                draggableId={answers[q.id]}
                                index={0}
                                isDragDisabled={true}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={provided.draggableProps.style}
                                  >
                                    <span className="text-blue-800 font-semibold">
                                      {getTextById(answers[q.id])}
                                    </span>
                                  </div>
                                )}
                              </Draggable>
                            )}

                            {/* ❌ WRONG */}
                            {isWrongAnswer(q.id) && (
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white">
                                ✕
                              </div>
                            )}

                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                      </div>
                      <span className="text-gray-400 text-lg">
                        {q.sentence}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
</div>
          {/* BUTTONS */}
          <div className="action-buttons-container mt-10">
            <button onClick={reset} className="try-again-button">
              Start Again ↻
            </button>

            <button onClick={showAnswers} className="show-answer-btn">
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
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 63/Ex D 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 63/Ex D 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 63/Ex D 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 63/Asset 38.svg";
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
  const [showResult, setShowResult] = useState(false);
  const questions = [
    { id: 1, number: 4, answer: "Wednesday", img: img1 },
    { id: 2, number: 2, answer: "Monday", img: img2 },
    { id: 3, number: 6, answer: "Friday", img: img3 },
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
        [id]: word, // 👈 replace عادي
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
    setShowResult(true);
  };
  const reset = () => {
    setAnswers({
      1: "",
      2: "",
      3: "",
    });
    setLocked(false);
    setShowResult(false);
  };

  const showAnswers = () => {
    const filled = {};
    questions.forEach((q) => {
      filled[q.id] = q.answer;
    });

    setAnswers(filled);
    setLocked(true);
  };
  const isWordUsed = (word) => {
    return Object.values(answers).includes(word);
  };
  const isWrong = (id) => {
    if (!showResult) return false;

    const q = questions.find((q) => q.id === id);
    return answers[id] !== q.answer;
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="main-container-component">
        <div className="div-forall" style={{gap:"30px"}}>
          <h5 className="header-title-page8" style={{ marginBottom: "20px" }}>
            <span className="ex-A">D </span>Read and write.
          </h5>

          <div className="flex flex-col gap-8">

          {/* WORD BANK */}
          <Droppable droppableId="bank" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-wrap justify-center gap-3 p-2 rounded-lg"
              >
                {wordBank.map((word, index) => {
                  const used = isWordUsed(word);

                  return (
                    <Draggable
                      key={word}
                      draggableId={word}
                      index={index}
                      isDragDisabled={locked || used}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`px-4 py-2 border rounded-lg shadow transition-all
            ${
              used
                ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                : "bg-white cursor-grab hover:bg-gray-100"
            }
          `}
                        >
                          {word}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className="flex w-full" style={{justifyContent:"space-between"}} >
            {/* QUESTIONS */}
            <div className="flex flex-col">
            {questions.map((q) => (
              <div key={q.id} className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 flex items-center justify-center">
                  <img src={q.img} style={{ height: "120px", width: "auto" }} />
                </div>

                <div className="text-lg">
                  <p>What day is it today?</p>

                  <Droppable droppableId={`answer-${q.id}`}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="relative min-w-[250px] min-h-10"
                      >
                        {/* ❌ */}
                        {isWrong(q.id) && (
                          <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-md">
                            ✕
                          </span>
                        )}

                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`h-10 border-b-2 ${
                            isWrong(q.id) ? "border-red-500" : "border-black"
                          }`}
                        >
                          It is
                          <span style={{ color: "red" }}>
                            {" "}
                            {answers[q.id]}
                            {provided.placeholder}
                          </span>
                        </div>
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            ))}
</div>
            <img src={img4} style={{ height: "390px", width: "auto" }} />
          </div></div>
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

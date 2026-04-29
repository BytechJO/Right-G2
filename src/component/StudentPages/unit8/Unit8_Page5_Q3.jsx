import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";
import img from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 68/Ex B 1.svg";

const Unit8_Page5_Q3 = () => {
  const questions = [
    {
      id: 1,
      question: "How many books do you have?",
      answer: "nine",
      options: ["eight", "nine", "ten"],
      type: "books",
    },
    {
      id: 2,
      question: "How many crayons do you have?",
      answer: "ten",
      options: ["nine", "ten", "eleven"],
      type: "crayons",
    },
    {
      id: 3,
      question: "How many pens do you have?",
      answer: "three",
      options: ["two", "three", "four"],
      type: "pens",
    },
  ];

  const [answers, setAnswers] = useState({
    1: "",
    2: "",
    3: "",
  });
  const [showResult, setShowResult] = useState(false);
  const [locked, setLocked] = useState(false);

  const reset = () => {
    setAnswers({ 1: "", 2: "", 3: "" });
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

  const checkAnswers = () => {
    if (locked||showResult) return;
    if (Object.values(answers).includes("")) {
      ValidationAlert.info("Please complete all answers.");
      return;
    }

    let correct = 0;

    questions.forEach((q) => {
      if (answers[q.id] === q.answer) correct++;
    });

    const total = questions.length;

    const color =
      correct === total ? "green" : correct === 0 ? "red" : "orange";

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
  const isWrong = (id) => {
    if (!showResult) return false;

    const q = questions.find((q) => q.id === id);
    return answers[id] !== q.answer;
  };
  return (
    <div className="main-container-component">
      <div className="div-forall" style={{gap:"40px"}}>
        <h5 className="header-title-page8 mb-8">
          <span className="ex-A">B </span>
          Count and write.
        </h5>

        {/* WORD BANK */}

        <div className="flex gap-10 items-center">
          {/* QUESTIONS */}

          <div className="flex-1">
            {questions.map((q) => (
              <div key={q.id} className="mb-2">
                <div className="flex gap-3 text-lg items-center">
                  <span className="text-[#2e3192] font-bold">{q.id}</span>
                  <div className="flex w-full justify-between items-center">
                  <p>{q.question}</p>
                    {/* OPTIONS FOR THIS QUESTION */}

                <div className="flex gap-3 mt-3">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() =>{
                        if(locked||showResult)return;
                        setAnswers((prev) => ({
                          ...prev,
                          [q.id]: opt,
                        }))
                      }}
                      className={`px-3 py-1 rounded-lg border-2 ${answers[q.id] === opt ? "border-blue-900" : "border-gray-400"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                </div>
                </div>
                <div className="relative mt-2 h-10">
                  {/* ❌ */}
                  {isWrong(q.id) && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-md">
                      ✕
                    </span>
                  )}

                  <div
                    className={`border-b-2 py-1 text-lg h-10 ${isWrong(q.id) ? "border-red-500" : "border-black"}`}
                  >
                    <span className="text-blue-900 font-semibold">
                      {answers[q.id] && `I have ${answers[q.id]} ${q.type}.`}
                    </span>
                  </div>
                </div>

              
              </div>
            ))}
          </div>

          {/* IMAGE */}

          <img src={img} style={{height:"300px",width:"auto"}}/>
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
  );
};

export default Unit8_Page5_Q3;

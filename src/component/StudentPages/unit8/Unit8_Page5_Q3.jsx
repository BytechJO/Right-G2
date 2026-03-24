import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";
import img from "../../../assets/imgs/test6.png";

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

  const [locked, setLocked] = useState(false);

  const reset = () => {
    setAnswers({ 1: "", 2: "", 3: "" });
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

  const checkAnswers = () => {
    if (locked) return;
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
  };

  return (
    <div className="flex justify-center p-8">
      <div className="w-[70%]">
        <h5 className="header-title-page8 mb-8">
          <span className="ex-A">B </span>
          Count and write.
        </h5>

        {/* WORD BANK */}

        <div className="flex gap-10">
          {/* QUESTIONS */}

          <div className="flex-1">
            {questions.map((q) => (
              <div key={q.id} className="mb-10">
                <div className="flex gap-3 text-lg">
                  <span className="text-[#2e3192] font-bold">{q.id}</span>
                  <p>{q.question}</p>
                </div>

                <div className="border-b-2 border-black mt-2 py-1 text-lg min-h-10">
                  <span className="text-red-600 font-semibold">
                    {answers[q.id] && `I have ${answers[q.id]} ${q.type}.`}
                  </span>
                </div>

                {/* OPTIONS FOR THIS QUESTION */}

                <div className="flex gap-3 mt-3">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [q.id]: opt,
                        }))
                      }
                      className={`px-3 py-1 rounded border
${answers[q.id] === opt ? "bg-yellow-300" : "bg-white"}
`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* IMAGE */}

          <img src={img} className="w-[350px]! h-[400px]! " />
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

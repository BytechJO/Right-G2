import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";

import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 34/Ex D 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 34/Ex D 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 34/Ex D 3.svg";

const QUESTIONS = [
  {
    id: 1,
    image: img1,
    options: ["eats breakfast", "sleeps"],
    correct: "eats breakfast",
  },
  {
    id: 2,
    image: img2,
    options: ["does homework", "makes bed"],
    correct: "does homework",
  },
  {
    id: 3,
    image: img3,
    options: ["gets up", "goes to school"],
    correct: "gets up",
  },
];

const WB_Unit6_Page34_Q2 = () => {
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelect = (questionId, option) => {
    if (isSubmitted) return;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const checkAnswers = () => {
    if (Object.keys(answers).length !== QUESTIONS.length) {
      ValidationAlert.info("Please answer all questions before checking.");
      return;
    }

    let score = 0;

    QUESTIONS.forEach((q) => {
      if (answers[q.id] === q.correct) score++;
    });

    const message = `Your score: ${score} / ${QUESTIONS.length}`;

    if (score === QUESTIONS.length) {
      ValidationAlert.success(message);
    } else if (score === 0) {
      ValidationAlert.error(message);
    } else {
      ValidationAlert.warning(message);
    }

    setIsSubmitted(true);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "20px" }}>
        <h1 className="WB-header-title-page8">
          <div className="WB-ex-A">D</div>Look, read, and circle.
        </h1>

        <div className="p-6 max-w-4xl">
          <div className="space-y-6">
            {QUESTIONS.map((q) => (
              <div key={q.id} className="flex items-center gap-6 p-4">
                <img
                  src={q.image}
                  alt="question"
                  className="max-w-55 max-h-30 object-cover rounded-lg"
                />

                <div className="flex flex-col gap-3">
                  {q.options.map((opt) => {
                    const isSelected = answers[q.id] === opt;
                    const isCorrect = opt === q.correct;
                    const isWrongSelected =
                      isSubmitted && isSelected && !isCorrect;

                    return (
                      <button
                        key={opt}
                        onClick={() => handleSelect(q.id, opt)}
                        className={`relative px-4 py-2 rounded-lg border-2 transition
                          ${
                            isSelected
                              ? "border-blue-500 bg-blue-100"
                              : "border-blue-300"
                          }`}
                      >
                        {opt}

                        {isWrongSelected && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-md border-2 border-white">
                            <span className="text-white text-xs font-bold leading-none">
                              ✕
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Button
              checkAnswers={checkAnswers}
              handleStartAgain={() => {
                setAnswers({});
                setIsSubmitted(false);
              }}
              handleShowAnswer={() => {
                const correct = {};
                QUESTIONS.forEach((q) => {
                  correct[q.id] = q.correct;
                });
                setAnswers(correct);
                setIsSubmitted(true);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WB_Unit6_Page34_Q2;

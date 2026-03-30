import React, { useState, useRef, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import InteractiveClock from "./InteractiveClock";
import Button from "../button";
import ValidationAlert from "../../Popup/ValidationAlert";

/* =========================
   Questions
========================= */
const questions = [
  { id: 1, hour: 10, minute: 0, text: "It is ten o’clock." },
  { id: 2, hour: 3, minute: 30, text: "It is half past three." },
  { id: 3, hour: 5, minute: 0, text: "It is five o’clock." },
  { id: 4, hour: 9, minute: 30, text: "It is half past nine." },
  { id: 5, hour: 6, minute: 0, text: "It is six o’clock." },
  { id: 6, hour: 2, minute: 30, text: "It is half past two." },
];

/* =========================
   Main Component
========================= */
const ReadAndDrawClocks = () => {
  const [correctMap, setCorrectMap] = useState({});
  const [showAnswerTrigger, setShowAnswerTrigger] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [checked, setChecked] = useState(false);

  const handleClockCorrect = (id, value) => {
    setCorrectMap((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const totalCorrect = Object.values(correctMap).filter(Boolean).length;

  const checkAnswers = () => {
    let currentScore = 0;

    Object.values(correctMap).forEach((isCorrect) => {
      if (isCorrect) currentScore++;
    });

    const total = questions.length;
    const scoreMessage = `Your score: ${currentScore} / ${total}`;

    if (currentScore === total) {
      ValidationAlert.success(scoreMessage);
    } else if (currentScore === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }

    setChecked(true);
  };

  const handleShowAnswer = () => {
    setShowAnswerTrigger((prev) => prev + 1);
    setChecked(true);
  };

  const handleStartAgain = () => {
    setCorrectMap({});
    setChecked(false);
    setResetTrigger((prev) => prev + 1);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "20px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">F</span>
          Read and draw.
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {questions.map((q) => (
            <div key={q.id} className="flex flex-col items-center">
              <div className="text-lg font-bold text-indigo-700 mb-2 flex gap-2">
                <span className="text-lg text-blue-900">{q.id}</span> <h1 className="text-black">{q.text}</h1>
              </div>

              <InteractiveClock
                targetHour={q.hour}
                targetMinute={q.minute}
                // label={q.text}
                size={120}
                showDigitalTime={true}
                showFeedback={checked}
                initialHour={12}
                initialMinute={0}
                showAnswerTrigger={showAnswerTrigger}
                resetTrigger={resetTrigger}
                onCorrect={(value) => handleClockCorrect(q.id, value)}
              />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-lg font-semibold text-purple-700">
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleStartAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};

export default ReadAndDrawClocks;

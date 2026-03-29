import React, { useState, useRef } from "react";
import "./Unit6_Page6_Q1.css";
import Button from "../../WorkBookPages/button";
import img1 from "../../../assets/imgs/clock1.png";
import InteractiveClock from "../../WorkBookPages/Unit6/InteractiveClock";
import ValidationAlert from "../../Popup/ValidationAlert";
const Unit6_Page6_Q1 = () => {
  const [locked, setLocked] = useState(false);
  const questions = [
    { id: 1, text: "I brush my teeth at six thirty.", img: img1 },
    { id: 2, text: "I wash my face at seven o’clock.", img: img1 },
    { id: 3, text: "I comb my hair at seven thirty.", img: img1 },
    { id: 4, text: "I eat my breakfast at eight o’clock.", img: img1 },
    { id: 5, text: "I go to school at eight thirty.", img: img1 },
  ];
  const correctTimes = {
    1: { h: 6, m: 30 },
    2: { h: 7, m: 0 },
    3: { h: 7, m: 30 },
    4: { h: 8, m: 0 },
    5: { h: 8, m: 30 },
  };

  const [answers, setAnswers] = useState({});
  const [showAnswerTrigger, setShowAnswerTrigger] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const reset = () => {
    setAnswers({});
    setShowResult(false);
    setResetTrigger((prev) => prev + 1);
  };
  const checkAnswers = () => {
    const total = questions.length;
    const correctCount = Object.values(answers).filter(Boolean).length;

    let color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const message = `
    <div style="font-size:20px;text-align:center;">
      <span style="color:${color};font-weight:bold;">
        Score: ${correctCount} / ${total}
      </span>
    </div>
  `;

    if (correctCount === total) ValidationAlert.success(message);
    else if (correctCount === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);

    setShowResult(true);
  };

  const showAnswers = () => {
    setShowAnswerTrigger((prev) => prev + 1);
    setShowResult(true);
  };
  return (
     <div className="main-container-component">
      <div className="div-forall" style={{ gap: "20px" }}>
        <h5 className="header-title-page8">
          <span style={{ marginRight: "15px" }} className="ex-A">
            D
          </span>
          Read and then draw the time.{" "}
        </h5>

        {/* MAIN */}
        <div className="flex" style={{ justifyContent: "space-between" }}>
          <div className="w-100">
            <img src={img1} style={{ height: "90px", width: "90px" }} />
          </div>
          <div className="flex flex-col mt-6 w-full">
            {questions.map((q) => (
              <div key={q.id} className="flex items-center justify-between">
                {/* TEXT */}
                <div className="flex gap-3 text-[18px] w-[70%]">
                  <span className="font-bold">{q.id}</span>
                  <span>{q.text}</span>
                </div>

                {/* CLOCK */}
                <InteractiveClock
                  targetHour={correctTimes[q.id].h}
                  targetMinute={correctTimes[q.id].m}
                  size={90}
                  showFeedback={showResult}
                  showAnswerTrigger={showAnswerTrigger}
                  resetTrigger={resetTrigger}
                  onCorrect={(isCorrect) => {
                    setAnswers((prev) => ({
                      ...prev,
                      [q.id]: isCorrect,
                    }));
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <Button
          handleShowAnswer={showAnswers}
          handleStartAgain={reset}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
};

export default Unit6_Page6_Q1;

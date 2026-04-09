import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

import sound1 from "../../../assets/audio/ClassBook/U 10/cd63pg89-instruction2-adult-lady_Gemt2j2G.mp3";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";

const Review9_Page2_Q2 = () => {
  const stopAtSecond = 3.5;

  const captions = [
    {
      start: 0.519,
      end: 16.159,
      text: "Page 89, review 9, exercise F. Listen, read, and circle. 1, main. 2, mad. 3, cape. 4, mat.",
    },
  ];

  const questions = [
    { answer: "main" },
    { answer: "mad" },
    { answer: "cape" },
    { answer: "mat" },
  ];

  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [locked, setLocked] = useState(false);
  const [showWrongMarks, setShowWrongMarks] = useState(false);

  const choose = (index, value) => {
    if (locked) return;

    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const resetAll = () => {
    setAnswers(Array(questions.length).fill(""));
    setLocked(false);
    setShowWrongMarks(false);
  };

  const showAnswers = () => {
    setAnswers(questions.map((q) => q.answer));
    setLocked(true);
    setShowWrongMarks(false);
  };

  const checkAnswers = () => {
    if (locked) return;

    if (answers.includes("")) {
      ValidationAlert.info("Please complete all answers");
      return;
    }

    let score = 0;

    answers.forEach((a, i) => {
      if (a === questions[i].answer) score++;
    });

    const total = questions.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const message = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) ValidationAlert.success(message);
    else if (score === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);

    setShowWrongMarks(true);
    setLocked(true);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall gap-2">
        <h5 className="header-title-page8 mb-10">
          <span style={{ marginRight: "20px" }}>F</span>
          Listen, read, and circle
        </h5>

        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
        />

        <div
          style={{
            marginTop: "40px",
            textAlign: "center",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
          }}
        >
          {[
            { id: 0, w1: "man", w2: "main" },
            { id: 1, w1: "mad", w2: "made" },
            { id: 2, w1: "cap", w2: "cape" },
            { id: 3, w1: "mat", w2: "mate" },
          ].map((item, index) => {
            const isWrong =
              showWrongMarks &&
              answers[index] !== "" &&
              answers[index] !== questions[index].answer;

            return (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "20px",
                  marginBottom: "20px",
                  fontSize: "22px",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: "bold" }}>{index + 1}</span>

                {/* word 1 */}
                <span
                  onClick={() => choose(index, item.w1)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: "20px",
                    border:
                      answers[index] === item.w1
                        ? "2px solid red"
                        : "2px solid transparent",
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  {item.w1}

                  {answers[index] === item.w1 && isWrong && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        width: "22px",
                        height: "22px",
                        background: "red",
                        color: "white",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        fontWeight: "bold",
                        border: "2px solid white",
                      }}
                    >
                      ✕
                    </div>
                  )}
                </span>

                {/* word 2 */}
                <span
                  onClick={() => choose(index, item.w2)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: "20px",
                    border:
                      answers[index] === item.w2
                        ? "2px solid red"
                        : "2px solid transparent",
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  {item.w2}

                  {answers[index] === item.w2 && isWrong && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        width: "22px",
                        height: "22px",
                        background: "red",
                        color: "white",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        fontWeight: "bold",
                        border: "2px solid white",
                      }}
                    >
                      ✕
                    </div>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="action-buttons-container mt-10">
        <button onClick={resetAll} className="try-again-button">
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
  );
};

export default Review9_Page2_Q2;

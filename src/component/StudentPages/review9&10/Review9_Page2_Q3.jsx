import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

const Review9_Page2_Q3 = () => {
  const questions = [
    { id: 0, words: ["pan", "bat", "way"], correct: ["pan", "bat"] },
    { id: 1, words: ["back", "game", "sack"], correct: ["back", "sack"] },
    { id: 2, words: ["May", "Dan", "mad"], correct: ["Dan", "mad"] },
    { id: 3, words: ["fat", "lake", "fan"], correct: ["fat", "fan"] },
  ];

  const [answers, setAnswers] = useState({});
  const [locked, setLocked] = useState(false);

  const toggleWord = (qId, word) => {
    if (locked) return;

    setAnswers((prev) => {
      const current = prev[qId] || [];

      const exists = current.includes(word);

      return {
        ...prev,
        [qId]: exists ? current.filter((w) => w !== word) : [...current, word],
      };
    });
  };

  const reset = () => {
    setAnswers({});
    setLocked(false);
  };

  const showAnswers = () => {
    const correct = {};
    questions.forEach((q) => {
      correct[q.id] = q.correct;
    });
    setAnswers(correct);
    setLocked(true);
  };

  const checkAnswers = () => {
    if (locked) return;

    // تحقق الكل متجاوب
    const empty = questions.some((q) => !answers[q.id]);

    if (empty) {
      ValidationAlert.info("Please complete all answers.");
      return;
    }

    let score = 0;

    questions.forEach((q) => {
      const user = answers[q.id] || [];

      const isCorrect =
        user.length === q.correct.length &&
        q.correct.every((w) => user.includes(w));

      if (isCorrect) score++;
    });

    const total = questions.length;

    const msg = `
    <div style="font-size:20px;text-align:center;">
      <b>Score: ${score} / ${total}</b>
    </div>
  `;

    if (score === total) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);

    setLocked(true);
  };
  return (
    <div className="flex flex-col items-center p-8">
      <div className="w-[60%]">
        <h5 className="header-title-page8 mb-10">
          <span style={{ marginRight: "20px" }}>G</span>
          Read and circle the{" "}
          <span style={{ color: "#2e3192" }}> short a </span> words.
        </h5>
        <div className="grid grid-cols-4 gap-10 w-full">
          {questions.map((q, index) => (
            <div key={q.id} style={{ textAlign: "center" }}>
              <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
                {index + 1}
              </div>

              <div
                style={{
                  border: "2px solid #e53935",
                  borderRadius: "12px",
                  padding: "15px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {q.words.map((word) => {
                  const selected = answers[q.id]?.includes(word);

                  return (
                    <span
                      key={word}
                      onClick={() => toggleWord(q.id, word)}
                      style={{
                        cursor: "pointer",
                        padding: "2px 6px",
                        borderRadius: "10px",
                        border: selected
                          ? "2px solid red"
                          : "2px solid transparent",
                      }}
                    >
                      {word}
                    </span>
                  );
                })}
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
  );
};

export default Review9_Page2_Q3;

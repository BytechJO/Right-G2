import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

const Review9_Page2_Q4 = () => {
  const questions = [
    { id: 0, words: ["game", "sad", "paint"], correct: ["game", "paint"] },
    { id: 1, words: ["man", "same", "rain"], correct: ["same", "rain"] },
    { id: 2, words: ["take", "van", "pain"], correct: ["take", "pain"] },
    { id: 3, words: ["bake", "ran", "stain"], correct: ["bake", "stain"] },
  ];

  const [answers, setAnswers] = useState({});
  const [locked, setLocked] = useState(false);
  const [showWrongMarks, setShowWrongMarks] = useState(false);
  const toggleWord = (qId, word) => {
    if (locked) return;

    setAnswers((prev) => {
      const current = prev[qId] || [];

      const exists = current.includes(word);

      // إذا الكلمة موجودة → شيلها (toggle off)
      if (exists) {
        return {
          ...prev,
          [qId]: current.filter((w) => w !== word),
        };
      }

      // إذا وصل الحد (كلمتين) → لا تضيف
      if (current.length >= 2) {
        return prev;
      }

      // غير ذلك → أضف الكلمة
      return {
        ...prev,
        [qId]: [...current, word],
      };
    });
  };

  const reset = () => {
    setAnswers({});
    setLocked(false);
    setShowWrongMarks(false);
  };

  const showAnswers = () => {
    const correct = {};
    questions.forEach((q) => {
      correct[q.id] = q.correct;
    });
    setAnswers(correct);
    setLocked(true);
    setShowWrongMarks(false);
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

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);

    setShowWrongMarks(true);
    setLocked(true);
  };
  return (
    <div className="main-container-component">
      <div className="div-forall gap-2">
        <h5 className="header-title-page8 mb-10">
          <span style={{ marginRight: "20px" }}>G</span>
          Read and circle the{" "}
          <span style={{ color: "#2e3192" }}> long a </span> words.
        </h5>
        <div className="grid grid-cols-4 gap-10 w-full">
          {questions.map((q, index) => (
            <div key={q.id} style={{ textAlign: "center" }}>
              <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
                {index + 1}
              </div>

              <div
                style={{
                  border: "2px solid #1100d0ff",
                  borderRadius: "12px",
                  padding: "15px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {q.words.map((word) => {
                  const selected = answers[q.id]?.includes(word);

                  const isWrong =
                    showWrongMarks && selected && !q.correct.includes(word);

                  return (
                    <span
                      key={word}
                      onClick={() => toggleWord(q.id, word)}
                      style={{
                        cursor: "pointer",
                        padding: "2px 6px",
                        borderRadius: "10px",
                        border: selected
                          ? "2px solid #0a007dff"
                          : "2px solid transparent",
                        fontSize: "20px",
                        fontWeight: "700",
                        position: "relative", // مهم
                      }}
                    >
                      {word}

                      {isWrong && (
                        <div
                          style={{
                            position: "absolute",
                            top: "-8px",
                            right: "-8px",
                            width: "25px",
                            height: "25px",
                            background: "red",
                            color: "white",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "16px",
                            fontWeight: "bold",
                            border: "2px solid white",
                          }}
                        >
                          ✕
                        </div>
                      )}
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

export default Review9_Page2_Q4;

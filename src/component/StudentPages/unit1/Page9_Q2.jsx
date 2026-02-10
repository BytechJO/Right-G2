import React, { useState } from "react";
import img from "../../../assets/imgs/test.png";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./Page9_Q2.css";
const inputData = [
  { question: "", correct: "He's my father" },
  { question: "", correct: "She's my mother" },
  { question: "", correct: "He's my brother" },
  { question: "", correct: "She's my sister" },
  { question: "", correct: "She's my aunt" },
  { question: "", correct: "he's my uncle" },
];
const dragData = {
  data: ["sister", "mother", "uncle", "father", "brother", "aunt"],
  correct: "jack",
};
const Page9_Q2 = () => {
  const [answers, setAnswers] = useState(Array(inputData.length).fill(""));

  const [wrongInputs, setWrongInputs] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false); // ⭐ NEW
  const [missingAnswer, setMissingAnswer] = useState("");

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || showAnswer) return;

    const value = draggableId.replace("word-", "");
    const index = Number(destination.droppableId.split("-")[1]);

    setAnswers((prev) => {
      const updated = [...prev];

      // منع تكرار الكلمة
      const oldIndex = updated.findIndex((a) => a === value);
      if (oldIndex !== -1) updated[oldIndex] = null;

      updated[index] = value;
      return updated;
    });

    setWrongInputs([]);
  };
  const missingCorrect = "jack";

  const checkAnswers = () => {
    if (showAnswer) return; // ⭐ منع التعديل عند Show Answer
    let missingCorrectAnswer = missingAnswer.trim() === missingCorrect;

    if (answers.some((a) => a.trim() === "")) {
      ValidationAlert.info("Please fill in all blanks before checking!");
      return;
    }

    const totalQuestions = inputData.length + 1;
    let correctCount = missingCorrectAnswer ? 1 : 0;

    let wrong = [];

    answers.forEach((ans, i) => {
      if (ans.trim() === inputData[i].correct) {
        correctCount++;
      } else {
        wrong.push(i);
      }
    });

    setWrongInputs(wrong);
    setShowAnswer(true);
    let color =
      correctCount === totalQuestions
        ? "green"
        : correctCount === 0
          ? "red"
          : "orange";

    const scoreMessage = `
      <div style="font-size:20px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${correctCount} / ${totalQuestions}
        </span>
      </div>
    `;

    if (correctCount === totalQuestions) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  const reset = () => {
    setAnswers(Array(inputData.length).fill(""));
    setWrongInputs([]);
    setMissingAnswer(""); // الجواب الصحيح
    setShowAnswer(false); // ⭐ إعادة التفعيل الطبيعي
  };

  // ⭐⭐⭐ SHOW ANSWER FUNCTION
  const showCorrectAnswers = () => {
    setAnswers(inputData.map((item) => item.correct));
    setMissingAnswer("jack"); // الجواب الصحيح
    setWrongInputs([]);
    setShowAnswer(true);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
        }}
      >
        <div
          className="div-forall"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            width: "60%",
            justifyContent: "flex-start",
          }}
        >
          <div className="component-wrapper">
            <h3 className="header-title-page8">
              <span className="ex-A"> D</span> Look and write.
            </h3>
            <div className="CB-unit1-p9-q2-top-container">
              <div className="family-image-wrapper">
                <img
                  src={img}
                  className="CB-unit1-p9-q2-shape-img"
                  alt=""
                  style={{ height: "200px", width: "150px" }}
                />
              </div>
              <div className="CB-unit1-p9-q2-rightSide">
                <div className="word-list-box">
                  {dragData.data.map((word, index) => (
                    <div key={index} className="word-item">
                      {word}
                    </div>
                  ))}
                </div>

                {/* الفقاعة الزرقا تحت صندوق الكلمات */}
                <div className="missing-bubble">
                  <input
                    className="blank-space"
                    value={missingAnswer}
                    disabled={showAnswer}
                    onChange={(e) => setMissingAnswer(e.target.value)}
                  />
                  {missingAnswer !== "jack" ||missingAnswer !== ""||!showAnswer && (
                    <span className="CB-unit1-p9-q2-wrong-icon1">✕</span>
                  )}
                  <span> is missing from the picture.</span>
                </div>
              </div>
            </div>
            <div className="CB-unit1-p9-q2-content">
              <div className="CB-unit1-p9-q2-group-input">
                {inputData.map((item, index) => (
                  <div key={index} className="CB-unit1-p9-q2-question-row">
                    <span className="CB-unit1-p9-q2-q-number">
                      {index + 1}.
                    </span>

                    <div
                      className="CB-unit1-p9-q2-question-text"
                      style={{ position: "relative" }}
                    >
                      <input
                        type="text"
                        value={answers[index]}
                        disabled={showAnswer}
                        onChange={(e) => {
                          const value = e.target.value;
                          setAnswers((prev) => {
                            const updated = [...prev];
                            updated[index] = value;
                            return updated;
                          });
                        }}
                        className={`CB-unit1-p9-q2-input ${
                          wrongInputs.includes(index)
                            ? "CB-unit1-p9-q2-input-wrong"
                            : ""
                        }`}
                      />

                      {wrongInputs.includes(index) && (
                        <span className="CB-unit1-p9-q2-wrong-icon">✕</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="action-buttons-container">
          <button className="try-again-button" onClick={reset}>
            Start Again ↻
          </button>

          {/* ⭐ زر الشو أنسر */}
          <button
            className="show-answer-btn swal-continue"
            onClick={showCorrectAnswers}
          >
            Show Answer
          </button>

          <button className="check-button2" onClick={checkAnswers}>
            Check Answers ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Page9_Q2;

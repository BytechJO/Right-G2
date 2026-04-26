import React, { useState, useRef, useEffect } from "react";
import "./Review1_Page2_Q2.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 17/Ex D 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 17/Ex D 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 17/Ex D 3.svg";
import sound1 from "../../../assets/audio/ClassBook/U 2/cd11pg17-instruction1-adult-lady_0dI0ldka.mp3";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import trueIcon from "../../../assets/imgs/true.svg";
import falseIcon from "../../../assets/imgs/false.svg";
const Review1_Page2_Q2 = () => {
  const stopAtSecond = 13.74;
  const [locked, setLocked] = useState(false); // ⭐ NEW — قفل التعديل بعد Show Answer

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    { start: 0.62, end: 5.66, text: "Page 17, review 1, exercise D." },
    {
      start: 6.94,
      end: 13.74,
      text: "Do they both begin with the same sound? Listen and write, ✓ or X.",
    },
    { start: 14.9, end: 22.08, text: "1, lion, lamp. 2, radio, log." },
    { start: 23.1, end: 26.86, text: "3, robot,rainbow." },
  ];

  const questions = [
    {
      id: 1,
      image: img1,
      correct: "✓",
    },
    { id: 2, image: img2, correct: "✗" },
    {
      id: 3,
      image: img3,
      correct: "✓",
    },
  ];

  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState([]);

  const selectAnswer = (id, value) => {
    if (locked) return; // 🔒 ممنوع التعديل بعد Show Answer
    setAnswers({ ...answers, [id]: value });
    setShowResult(false);
  };
  const showAnswers = () => {
    const corrects = {};
    questions.forEach((q) => {
      corrects[q.id] = q.correct; // ✓ أو ✗
    });

    setAnswers(corrects);
    setShowResult([]); // إخفاء كل X
    setLocked(true); // 🔒 قفل التعديل
  };

  const checkAnswers = () => {
    if (locked) return;
    // 1) فحص الخانات الفارغة
    const isEmpty = questions.some((q) => !answers[q.id]);
    if (isEmpty) {
      ValidationAlert.info("Please choose ✓ or ✗ for all questions!");
      return;
    }

    // 2) مقارنة الإجابات
    const results = questions.map((q) =>
      answers[q.id] === q.correct ? "correct" : "wrong",
    );

    setShowResult(results);
    setLocked(true); // 🔒 قفل التعديل
    // 3) حساب السكور
    const correctCount = results.filter((r) => r === "correct").length;
    const total = questions.length;
    const scoreMsg = `${correctCount} / ${total}`;

    let color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const resultHTML = `
      <div style="font-size: 20px; text-align:center; margin-top: 8px;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${scoreMsg}
        </span>
      </div>
    `;

    if (correctCount === total) ValidationAlert.success(resultHTML);
    else if (correctCount === 0) ValidationAlert.error(resultHTML);
    else ValidationAlert.warning(resultHTML);
  };

  const resetAnswers = () => {
    setAnswers({});
    setShowResult([]);
    setLocked(false); // ← مهم جداً
  };

  return (
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
          // gap: "20px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <h5 className="header-title-page8">
          <span style={{ marginRight: "20px" }}>D</span> Do they both begin with
          the same sound? Listen and write
          <span style={{ color: "#2e3192" }}>✓</span> or
          <span style={{ color: "#2e3192" }}>✗</span>.
        </h5>
        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
        />

        <div className="CB-review1-p2-q1-container">
          {questions.map((q, index) => (
            <div key={q.id} className="CB-review1-p2-q1-question-box">
             

              <div className="CB-review1-p2-q1-flex">
                <div style={{ display: "flex" }}>
                   <p
                className="CB-review1-p2-q1-question-text"
                style={{ fontSize: "20px" }}
              >
                <span style={{ color: "darkblue", fontWeight: "700" }}>
                  {q.id}.
                </span>
              </p>
                  <img src={q.image} alt="" className="CB-review1-p2-q2-img" />
                </div>

                <div className="CB-review1-p2-q1-options-box">
                  {/* خيار الصح */}
                  <div className="CB-review1-p2-q1-option-wrapper">
                    <div
                      className={`CB-review1-p2-q1-option-btn ${
                        answers[q.id] === "✓" ? "is-selected" : ""
                      }`}
                      onClick={() => selectAnswer(q.id, "✓")}
                    >
                      <img
                        src={trueIcon}
                        alt="true"
                        className="CB-review1-p2-q1-true"
                      />
                    </div>

                    {showResult[index] === "wrong" && answers[q.id] === "✓" && (
                      <div className="CB-review1-p2-q1-wrong-icon">✕</div>
                    )}
                  </div>

                  {/* خيار الخطأ */}
                  <div className="CB-review1-p2-q1-option-wrapper">
                    <div
                      className={`CB-review1-p2-q1-option-btn ${
                        answers[q.id] === "✗" ? "is-selected" : ""
                      }`}
                      onClick={() => selectAnswer(q.id, "✗")}
                    >
                      <img
                        src={falseIcon}
                        alt="true"
                        className="CB-review1-p2-q1-true"
                      />
                    </div>

                    {showResult[index] === "wrong" && answers[q.id] === "✗" && (
                      <div className="CB-review1-p2-q1-wrong-icon">✕</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="action-buttons-container">
          <button onClick={resetAnswers} className="try-again-button">
            Start Again ↻
          </button>
          {/* ⭐⭐⭐ NEW — زر Show Answer */}
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

export default Review1_Page2_Q2;

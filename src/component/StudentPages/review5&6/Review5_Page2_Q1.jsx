/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import "./Review5_Page2_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 53/Asset 35.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 53/Asset 75.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 53/Asset 36.svg";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import sound1 from "../../../assets/audio/ClassBook/U 6/cd37pg53-instruction1-adult-lady_VEAoL9d5.mp3";
import trueIcon from "../../../assets/imgs/true.svg";
import falseIcon from "../../../assets/imgs/false.svg";
const Review1_Page2_Q2 = () => {
  const stopAtSecond = 10.399;
  const [locked, setLocked] = useState(false); // ⭐ NEW — قفل التعديل بعد Show Answer
  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    { start: 0.519, end: 4.059, text: "Page 53, review 5, exercise D." },
    {
      start: 5.299,
      end: 10.399,
      text: "Do they both have long E? Listen and write ✓ or X.",
    },
    { start: 11.439, end: 14.659, text: "1, knee, tea." },
    { start: 15.679, end: 19.02, text: "2, tape. Three." },
    { start: 20.1, end: 23.34, text: "3, bee, sleep" },
  ];
  const questions = [
    {
      id: 1,
      image: img1,
      correct: "✓",
    },
    { id: 2, image: img3, correct: "✗" },
    {
      id: 3,
      image: img2,
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
      <div className="div-forall">
        <h5 className="header-title-page8">
          <span style={{ marginRight: "15px" }}>D</span>Do they both have{" "}
          <span style={{ color: "#2e3192" }}>long e</span>? Listen and write
          <span style={{ color: "#2e3192" }}>✓</span> or
          <span style={{ color: "#2e3192" }}>✗</span>.
        </h5>
        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
        />
        <div className="CB-review5-p2-q1-container">
          {questions.map((q, index) => (
            <div key={q.id} className="CB-review1-p2-q1-question-box">
              <div className="CB-review1-p2-q1-flex">
                <div style={{ display: "flex gap-6" }}>
                  <span style={{ fontSize: "20px", fontWeight: "700" }}>
                    {q.id}
                  </span>
                  <img
                    src={q.image}
                    alt=""
                    className="CB-review1-p2-q1-img"
                    style={{ width: "auto", height: "140px" }}
                  />
                </div>

                <div className="CB-review5-p2-q1-options-box">
                  {/* خيار الصح */}
                  <div className="CB-review1-p2-q1-option-wrapper">
                    <div
                      className={`CB-review5-p2-q1-option-btn ${
                        answers[q.id] === "✓" ? "is-selected" : ""
                      }`}
                      onClick={() => selectAnswer(q.id, "✓")}
                    >
                      <img
                        src={trueIcon}
                        style={{ height: "25px", width: "auto" }}
                      />
                    </div>

                    {showResult[index] === "wrong" && answers[q.id] === "✓" && (
                      <div className="CB-review1-p2-q1-wrong-icon">✕</div>
                    )}
                  </div>

                  {/* خيار الخطأ */}
                  <div className="CB-review1-p2-q1-option-wrapper">
                    <div
                      className={`CB-review5-p2-q1-option-btn ${
                        answers[q.id] === "✗" ? "is-selected" : ""
                      }`}
                      onClick={() => selectAnswer(q.id, "✗")}
                    >
                      <img
                        src={falseIcon}
                        style={{ height: "25px", width: "auto" }}
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

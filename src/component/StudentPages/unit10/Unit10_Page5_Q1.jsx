/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import "./Unit10_Page5_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 86/Asset 47.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 86/Asset 46.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 86/Asset 52.svg";
import sound1 from "../../../assets/audio/ClassBook/U 10/cd61pg86-instruction1-adult-lady_cLv0ekXg.mp3";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import trueIcon from "../../../assets/imgs/true.svg";
import falseIcon from "../../../assets/imgs/false.svg";
const Unit10_Page5_Q1 = () => {
  const stopAtSecond = 11.019;
  const [locked, setLocked] = useState(false); // ⭐ NEW — قفل التعديل بعد Show Answer

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0.5,
      end: 11.019,
      text: "Page 86, Right Activities. Exercise A, number 1. Do they both have the same vowel sound? Listen and write ✓ or X.",
    },
    { start: 12.159, end: 13.619, text: "1, nest." },
    { start: 14.719, end: 20.739, text: "2, green desk. 3, seal, eat." },
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
    <div className="main-container-component">
      <div className="div-forall" style={{gap:"40px"}}>
        <h5 className="header-title-page8">
          <span style={{ marginRight: "15px" }} className="ex-A">
            A
          </span>
          <span style={{ color: "#2e3192" }}>1</span>
          Do they both have the same{" "}
          <span style={{ color: "#2e3192" }}>vowel sound</span>? Listen and
          write
          <span style={{ color: "#2e3192" }}>✓</span> or
          <span style={{ color: "#2e3192" }}>✗</span>.
        </h5>
        <div className="flex flex-col gap-5">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "30px",
            width: "100%",
          }}
        >
          <QuestionAudioPlayer
            src={sound1}
            captions={captions}
            stopAtSecond={stopAtSecond}
          />
        </div>
        <div className="CB-review1-p2-q1-container">
          {questions.map((q, index) => (
            <div key={q.id} className="CB-unit10-p5-q1-question-box">
             

              <div className="CB-review1-p2-q1-flex">
                <div className="flex gap-5">
                  <span style={{ fontSize:"20px",fontWeight: "700" }}>
                  {q.id}
                </span>
                  <img
                    src={q.image}
                    alt=""
                    style={{ height: "150px", width: "auto" }}
                  />
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
                      className={`CB-review1-p2-q1-option-btn ${
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

export default Unit10_Page5_Q1;

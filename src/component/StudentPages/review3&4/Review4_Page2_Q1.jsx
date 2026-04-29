import React, { useState, useRef, useEffect } from "react";
import "./Review4_Page2_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 38/Asset 30.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 38/Asset 31.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 38/Asset 32.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 38/Asset 33.svg";
import img5 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 38/Asset 34.svg";
import sound1 from "../../../assets/audio/ClassBook/U 4/cd26pg37-instruction1-adult-lady_NPuiMbFv.mp3";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import trueIcon from "../../../assets/imgs/true.svg";
import falseIcon from "../../../assets/imgs/false.svg";
const Review4_Page2_Q1 = () => {
  const stopAtSecond = 11.0;
  const [locked, setLocked] = useState(false); // ⭐ NEW — قفل التعديل بعد Show Answer

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    { start: 0.54, end: 4.48, text: "Page 37, review 4, exercise C." },
    {
      start: 5.64,
      end: 11.0,
      text: "Does it have long A? Listen and write ✓ or X.",
    },
    { start: 12.28, end: 14.2, text: "1, pie." },
    { start: 15.26, end: 20.08, text: "2, train. 3, grapes." },
    { start: 21.12, end: 25.34, text: "4, eight. 5, tree." },
  ];

  const questions = [
    {
      id: 1,
      image: img1,
      correct: "✗",
    },
    { id: 2, image: img2, correct: "✓" },
    {
      id: 3,
      image: img3,
      correct: "✓",
    },
    {
      id: 4,
      image: img4,
      correct: "✓",
    },
    {
      id: 5,
      image: img5,
      correct: "✗",
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
      <div className="div-forall" style={{ gap: "50px" }}>
        <h5 className="header-title-page8">
          <span style={{ marginRight: "20px" }}>C</span> Does it have{" "}
          <span style={{ color: "#2e3192" }}>long a</span>? Listen and write
          <span style={{ color: "#2e3192" }}>✓</span> or
          <span style={{ color: "#2e3192" }}>✗</span>.
        </h5>
        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
        />

        <div className="CB-review4-p2-q1-container">
          {questions.map((q, index) => (
            <div key={q.id} className="CB-review1-p2-q1-question-box"style={{ gap: "20px" }}>
              <div className="flex flex-col flex-wrap gap-5">
                <div style={{ display: "flex" }}>
                  <span style={{ fontWeight: "700", fontSize: "20px" }}>
                    {q.id}
                  </span>
                  <img src={q.image} alt="" style={{ height: "100px",width:"110px" }} />
                </div>

                <div className="CB-review1-p2-q1-options-box">
                  {/* خيار الصح */}
                  <div className="CB-review4-p2-q1-option-wrapper">
                    <div
                      className={`CB-review4-p2-q1-option-btn ${
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
                      className={`CB-review4-p2-q1-option-btn ${
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

export default Review4_Page2_Q1;

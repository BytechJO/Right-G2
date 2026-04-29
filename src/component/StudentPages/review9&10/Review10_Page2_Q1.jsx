/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 91/Asset 59.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 91/Asset 60.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 91/Asset 61.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 91/Asset 62.svg";
import sound1 from "../../../assets/audio/ClassBook/U 10/cd64pg91-instruction1-adult-lady_sUW7j1i5.mp3";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import trueIcon from "../../../assets/imgs/true.svg";
import falseIcon from "../../../assets/imgs/false.svg";
const Review10_Page2_Q1 = () => {
  const stopAtSecond = 9.479;
  const [locked, setLocked] = useState(false); // ⭐ NEW — قفل التعديل بعد Show Answer

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0.379,
      end: 9.479,
      text: "Page 91, review 10, exercise D. Do they both have the same vowel sound? Listen and write ✓ or X.",
    },
    { start: 10.599, end: 17.079, text: "1, leaf, ten. 2, jeep, bean." },
    { start: 18.139, end: 20.899, text: "3, tent, jet." },
    { start: 21.979, end: 24.92, text: "4, green, reed." },
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
      <div className="div-forall" >
        <h5 className="header-title-page8">
          <span style={{ marginRight: "15px" }}>D</span>
          Do they both have the same{" "}
          <span style={{ color: "#2e3192" }}>vowel sound</span>? Listen and
          write<span style={{ color: "#2e3192" }}> ✓ </span>or
          <span style={{ color: "#2e3192" }}> ✗</span>.
        </h5>

        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
        />
        <div className="flex justify-center gap-8 mt-4">
          {questions.map((q, index) => (
            <div
              key={q.id}
              style={{
                position: "relative", // ⭐ مهم
                width: "260px",
              }}
            >
              {/* 🔢 الرقم برا الصندوق */}
              <span
                style={{
                  position: "absolute",
                  top: "-10px",
                  left: "-18px",
                  background: "white",
                  padding: "2px 6px",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                {q.id}
              </span>

              {/* 📦 الكارد */}
              <div
                style={{
                  height: "220px",
                  // border: "2px solid #f87171",
                  borderRadius: "12px",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                {/* 🖼 الصورة */}
                <img
                  src={q.image}
                  alt=""
                  style={{
                    width: "auto",
                    height: "auto",
                    marginBottom: "10px",
                  }}
                />

                {/* الأزرار */}
                <div style={{ display: "flex", gap: "10px" }}>
                  {/* ✓ */}
                  <button
                    className="flex justify-center items-center"
                    onClick={() => selectAnswer(q.id, "✓")}
                    style={{
                      width: "40px",
                      height: "40px",
                      // border: "2px solid gray",
                      borderRadius: "8px",
                      fontSize: "18px",
                      fontWeight: "bold",
                      border:
                        answers[q.id] === "✓"
                          ? "2px solid #777cfd"
                          : "2px solid #f87171",
                      color: answers[q.id] === "✓" ? "white" : "black",
                      cursor: "pointer",
                      position: "relative", // ⭐ مهم
                    }}
                  >
                    <img
                      src={trueIcon}
                      style={{ height: "25px", width: "auto" }}
                    />
                    {showResult[index] === "wrong" && answers[q.id] === "✓" && (
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow border-2 border-white">
                        ✕
                      </span>
                    )}
                  </button>

                  {/* ✗ */}
                  <button
                    className="flex justify-center items-center"
                    onClick={() => selectAnswer(q.id, "✗")}
                    style={{
                      width: "40px",
                      height: "40px",
                      // border: "2px solid gray",
                      borderRadius: "8px",
                      fontSize: "18px",
                      fontWeight: "bold",
                      border:
                        answers[q.id] === "✗"
                          ? "2px solid #777cfd"
                          : "2px solid #f87171",
                      color: answers[q.id] === "✗" ? "white" : "black",
                      cursor: "pointer",
                      position: "relative", // ⭐ مهم
                    }}
                  >
                    <img
                      src={falseIcon}
                      style={{ height: "25px", width: "auto" }}
                    />
                    {showResult[index] === "wrong" && answers[q.id] === "✗" && (
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow border-2 border-white">
                        ✕
                      </span>
                    )}
                  </button>
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

export default Review10_Page2_Q1;

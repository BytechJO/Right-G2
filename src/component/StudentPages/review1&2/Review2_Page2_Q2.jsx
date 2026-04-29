import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review2_Page2_Q2.css";
import sound1 from "../../../assets/audio/ClassBook/U 2/cd13pg19-instruction2-adult-lady_wzkLPOcn.mp3";
import img1 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 19/Ex F 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 19/Ex F 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 19/Ex F 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 19/Ex F 4.svg";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
const Review2_Page2_Q2 = () => {
  const [answers, setAnswers] = useState([null, null, null, null]);

  const [showResult, setShowResult] = useState(false);
  const stopAtSecond = 11.30;

  const [locked, setLocked] = useState(false); // ⭐ 
  const items = [
    { img: img1, correct: "-x" },
    { img: img2, correct: "-ck" },
    { img: img3, correct: "-x" },
    { img: img4, correct: "-ck" },
  ];
  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0.52,
      end: 11.3,
      text: "Page 19, review 2, exercise F. Does it end with -ck or -x? Listen and circle.",
    },
    { start: 12.38, end: 14.04, text: "1, ox." },
    { start: 15.08, end: 19.3, text: "2, back. 3, fox." },
    { start: 20.36, end: 22.04, text: "4, truck." },
  ];


  const handleSelect = (index, value) => {
    if (locked) return; // ⭐ NEW — منع التعديل بعد Show Answer
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const checkAnswers = () => {
    if (locked) return; // ⭐ NEW — منع التعديل بعد Show Answer
    if (answers.includes(null)) {
      ValidationAlert.info("Oops!", "Please answer all items first.");
      return;
    }

    const correctCount = answers.filter(
      (a, i) => a?.toLowerCase() === items[i].correct?.toLowerCase(),
    ).length;

    const total = items.length;
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size: 20px; text-align:center; margin-top: 8px;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;
    setLocked(true); // ⭐ NEW — قفل التعديل بعد Check
    if (correctCount === total) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);

    setTimeout(() => setShowResult(true), 200);
  };

  const resetAnswers = () => {
    setAnswers(Array(items.length).fill(null));
    setShowResult(false);
    setLocked(false); // ⭐ NEW — إعادة فتح التعديل
  };
  // ⭐⭐⭐ NEW — Show Answer
  const showAnswer = () => {
    const correctFilled = items.map((item) => item.correct);

    setAnswers(correctFilled); // ضع الإجابات الصحيحة
    setShowResult(true); // إظهار النتيجة
    setLocked(true); // قفل الخيارات
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
        marginBottom:"50px"
      }}
    >
      <div
        className="div-forall"
        style={{gap:"50px"}}
        
      >
        <div>
          <h5 className="header-title-page8">
            <span style={{ marginRight: "20px" }}>F</span> Does it end with{" "}
            <span style={{ color: "#2e3192" }}>-ck</span> or{" "}
            <span style={{ color: "#2e3192" }}>-x</span>? Listen and circle.
          </h5>
        </div>
 
        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
        />
        <div
          className="imgFeild"
          style={{
            display: "flex",
            gap: "13px",
            flexDirection: "column",
          }}
        >
          <div className="wh-container-CB-review2-p2-q2">
            {items.map((item, index) => (
              <div className="ck-x-item-CB-review2-p2-q2" key={index}>
                <div style={{ display: "flex", gap: "10px" }}>
                  <span
                    className="q-number"
                    style={{
                      color: "#2c5287",
                      fontSize: "20px",
                      fontWeight: "700",
                    }}
                  >
                    {index + 1}
                  </span>
                  <img src={item.img} className="ck-x-image-CB-review2-p2-q2" />
                </div>

                <div className="ck-x-options-CB-review2-p2-q2">
                  {/* CK OPTION */}
                  <span
                    className={`ck-x-option-CB-review2-p2-q2 
              ${answers[index] === "-ck" ? "selected" : ""}
              ${
                showResult &&
                answers[index] === "-ck" &&
                answers[index] !== item.correct
                  ? "wrong-answer"
                  : ""
              }`}
                    onClick={() => handleSelect(index, "-ck")}
                  >
                    -ck
                    {showResult &&
                      answers[index] === "-ck" &&
                      answers[index] !== item.correct && (
                        <span className="wrong-x-CB-review2-p2-q2">✕</span>
                      )}
                  </span>

                  {/* X OPTION */}
                  <span
                    className={`ck-x-option-CB-review2-p2-q2 
              ${answers[index] === "-x" ? "selected" : ""}
              ${
                showResult &&
                answers[index] === "-x" &&
                answers[index] !== item.correct
                  ? "wrong-answer"
                  : ""
              }`}
                    onClick={() => handleSelect(index, "-x")}
                  >
                    -x
                    {showResult &&
                      answers[index] === "-x" &&
                      answers[index] !== item.correct && (
                        <span className="wrong-x-CB-review2-p2-q2">✕</span>
                      )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="action-buttons-container">
        <button onClick={resetAnswers} className="try-again-button">
          Start Again ↻
        </button>
        {/* ⭐⭐⭐ NEW — زر Show Answer */}
        <button onClick={showAnswer} className="show-answer-btn swal-continue">
          Show Answer
        </button>
        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Review2_Page2_Q2;

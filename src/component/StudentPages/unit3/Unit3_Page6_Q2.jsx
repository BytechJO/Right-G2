import React, { useState, useEffect, useRef } from "react";
import "./Unit3_Page6_Q2.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/test.png";
import img2 from "../../../assets/imgs/test.png";
import img3 from "../../../assets/imgs/test.png";
import img4 from "../../../assets/imgs/test.png";
import img5 from "../../../assets/imgs/test.png";
import img6 from "../../../assets/imgs/test.png";

const data = [
  {
    id: 1,
    src: img1,
    text: "They can paint.",
    options: [
      { label: "eat", answer: false },
      { label: "paint", answer: true },
    ],
  },
  {
    id: 2,
    src: img2,
    text: "She can fly a kite.",
    options: [
      { label: "kite", answer: true },
      { label: "ride", answer: false },
    ],
  },
  {
    id: 3,
    src: img3,
    text: "He can stand on the bench.",
    options: [
      { label: "drum", answer: false },
      { label: "bench", answer: true },
    ],
  },
  {
    id: 4,
    src: img4,
    text: "I can ride a bike.",
    options: [
      { label: "bike", answer: true },
      { label: "photo", answer: false },
    ],
  },
  {
    id: 5,
    src: img5,
    text: "We can make sandwiches.",
    options: [
      { label: "sandwiches", answer: true },
      { label: "swim", answer: false },
    ],
  },
  {
    id: 6,
    src: img6,
    text: "He can play the drum.",
    options: [
      { label: "paint", answer: false },
      { label: "drum", answer: true },
    ],
  },
];

const Unit3_Page6_Q2 = () => {
  const [selected, setSelected] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [locked, setLocked] = useState(false);

  const checkAnswers = () => {
    if (locked) return; // 🔒 منع التعديل بعد رؤية الحل

    const totalQuestions = data.length;
    let correct = 0;

    // تأكد إنو جاوب كل الأسئلة
    for (let q of data) {
      if (selected[q.id] === undefined) {
        ValidationAlert.info("");
        return;
      }
    }

    // حساب عدد الإجابات الصحيحة
    data.forEach((q) => {
      const chosenIndex = selected[q.id];
      if (q.options[chosenIndex].answer === true) {
        correct++;
      }
    });
    const color =
      correct === totalQuestions ? "green" : correct === 0 ? "red" : "orange";
    const scoreMessage = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
      Score: ${correct} / ${totalQuestions}
      </span>
    </div>
  `;

    // النتيجة
    if (correct === totalQuestions) {
      ValidationAlert.success(scoreMessage);
    } else if (correct === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
    setShowResult(true);
    setLocked(true);
  };
  const handleSelect = (qId, index) => {
    if (locked) return; // 🔒 منع التعديل بعد رؤية الحل
    setSelected((prev) => ({ ...prev, [qId]: index }));
    setShowResult(false);
  };
  const showAnswers = () => {
    const correctSelection = {};

    data.forEach((q) => {
      const correctIndex = q.options.findIndex((opt) => opt.answer === true);
      correctSelection[q.id] = correctIndex;
    });

    setSelected(correctSelection);
    setShowResult(false);
    setLocked(true);
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
          // gap: "30px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <h5 className="header-title-page8">
          <span className="ex-A">E</span>Read and write{" "}
          <span style={{ color: "#2e3192" }}>✓</span>.
        </h5>

       <div className="shorti-container-CB-unit3-p6-q2">
  {data.map((question) => (
    <div key={question.id} className="question-box-CB-unit3-p6-q2">
      <span
        style={{
          color: "darkblue",
          fontWeight: "700",
          fontSize: "20px",
        }}
      >
        {question.id}
      </span>

      <div className="question-box2-CB-unit3-p6-q2">
        {/* الصورة الواحدة */}
        <img
          src={question.src}
          className="main-img-CB-unit3-p6-q2"
          alt=""
        />
        <span>{question.text}</span>
        {/* الخيارات */}
        <div className="options-CB-unit3-p6-q2">
          {question.options.map((opt, index) => (
            <div
              key={index}
              className={`option-CB-unit3-p6-q2 ${
                selected[question.id] === index
                  ? "selected-CB-unit3-p6-q2"
                  : ""
              }`}
              onClick={() => handleSelect(question.id, index)}
            >
              {/* X عند الغلط */}
              {showResult &&
                selected[question.id] === index &&
                opt.answer === false && (
                  <span className="wrong-x-circle-CB-unit3-p6-q2">
                    ✕
                  </span>
                )}

              <span className="check-box-CB-unit3-p6-q2">
                {selected[question.id] === index ? "✓" : ""}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ))}
</div>

      </div>
      <div className="action-buttons-container">
        <button
          className="try-again-button"
          onClick={() => {
            setSelected({});
            setShowResult(false);
            setLocked(false);
          }}
        >
          Start Again ↻
        </button>
        <button onClick={showAnswers} className="show-answer-btn">
          Show Answer
        </button>
        <button className="check-button2" onClick={checkAnswers}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit3_Page6_Q2;

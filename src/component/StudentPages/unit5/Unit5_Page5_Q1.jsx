import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit5_Page5_Q1.css";
import sound1 from "../../../assets/audio/ClassBook/U 5/cd31pg44-instruction1-adult-lady_F1jeK53D.mp3";
import img1 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 44/Ex A1-1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 44/Ex A1-2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 44/Ex A1-3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 44/Ex A1-4.svg";
import img5 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 44/Ex A1-5.svg";
import img6 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 44/Ex A1-6.svg";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";

const Unit5_Page5_Q1 = () => {
  const [answers, setAnswers] = useState([null, null, null]);
  const audioRef = useRef(null);
  const [showResult, setShowResult] = useState(false);
  const [locked, setLocked] = useState(false); // ⭐ NEW — يمنع التعديل بعد Show Answer
  const stopAtSecond = 11.019;

  // ----------- الداتا الجديدة الخاصة بسؤال short a ---------------
  const items = [
    {
      id: 1,
      items: [
        { img: img1, word: "bee", isShortA: true },
        { img: img2, word: "pencel", isShortA: false },
      ],
    },
    {
      id: 2,
      items: [
        { img: img3, word: "bed", isShortA: false },
        { img: img4, word: "boy", isShortA: true },
      ],
    },
    {
      id: 3,
      items: [
        { img: img5, word: "tea", isShortA: true },
        { img: img6, word: "hen", isShortA: false },
      ],
    },
  ];
  // --------------------------------------------------------------

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0.539,
      end: 5.799,
      text: "Page 44. Right Activities. Exercise A, Number 1.",
    },
    {
      start: 6.839,
      end: 11.019,
      text: "Which picture has long E? Listen and circle.",
    },
    { start: 12.099, end: 16.5, text: "1, bee, pen." },
    { start: 17.879, end: 21.34, text: "2, bed, read." },
    { start: 22.42, end: 24.34, text: "3, tea, hen" },
  ];

  const handleSelect = (index, value) => {
    if (locked) return; // ⭐ NEW — لا يسمح بالتعديل بعد Show Answer
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setShowResult(false);
    setAnswers(newAnswers);
  };

  const checkAnswers = () => {
    if (locked) return; // ⭐ NEW — لا يسمح بالتعديل بعد Show Answer
    if (answers.includes(null)) {
      ValidationAlert.info("Oops!", "Please answer all items first.");
      return;
    }

    const correctCount = answers.filter(
      (selected, i) => items[i].items[selected]?.isShortA,
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

    if (correctCount === total) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);

    setLocked(true); // ⭐ NEW — إغلاق التعديل بعد check
  };

  const resetAnswers = () => {
    setAnswers(Array(items.length).fill(null));
    setShowResult(false);
    setLocked(false); // ⭐ NEW — فتح التعديل
  };

  // ⭐⭐⭐ NEW — Show Answer
  const showAnswer = () => {
    const correctSelections = items.map((item) =>
      item.items.findIndex((choice) => choice.isShortA),
    );

    setAnswers(correctSelections); // تحديد الإجابات الصحيحة
    setShowResult(true); // أظهر النتيجة
    setLocked(true); // اقفل التعديل
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
        marginBottom: "30px",
      }}
    >
      <div className="div-forall">
        <div>
          <h5 className="header-title-page8">
            <span className="ex-A">A</span>{" "}
            <span style={{ color: "#2e3192" }}>1</span> Which picture has{" "}
            <span style={{ color: "#2e3192" }}>long e</span>? Listen and circle.
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
          <div className="CB-unit5-p5-q1-container">
            {items.map((item, index) => (
              <div className="ds-group-box-CB-unit5-p5-2">
                <span
                  style={{
                    fontWeight: "700",
                    fontSize: "22px",
                    // color:"#1d4f7b"
                  }}
                >
                  {index + 1}
                </span>
                <div className="CB-unit5-p5-q1-options">
                  {item.items.map((choice, chIndex) => (
                    <div
                      key={chIndex}
                      className={`CB-unit5-p5-q1-word
              ${answers[index] === chIndex ? "selected" : ""}
              ${showResult && choice.isShortA ? "correct" : ""}
              ${showResult && answers[index] === chIndex && !choice.isShortA ? "wrong" : ""}`}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                      onClick={() => handleSelect(index, chIndex)}
                    >
                      <img
                        src={choice.img}
                        className={`CB-unit5-p5-q1-img  ${answers[index] === chIndex ? "selected" : ""}
              ${showResult && choice.isShortA ? "correct" : ""}
              ${showResult && answers[index] === chIndex && !choice.isShortA ? "wrong" : ""}`}
                      />
                      {locked &&
                      answers[index] === chIndex &&
                      !choice.isShortA ? (
                        <span className="CB-unit5-p5-q1-wrong-x">✕</span>
                      ) : null}
                    </div>
                  ))}
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
        {/* ⭐⭐⭐ NEW: زر Show Answer */}
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

export default Unit5_Page5_Q1;

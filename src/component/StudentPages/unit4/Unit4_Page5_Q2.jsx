import React, { useState, useEffect, useRef } from "react";
import "./Unit4_Page5_Q2.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 32/Ex A 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 32/Ex A 3.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 32/Asset 5 (1).svg";

import sound1 from "../../../assets/audio/ClassBook/U 4/cd24pg32-instruction1-adult-lady_rQFKnvRt.mp3";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
const Unit4_Page5_Q2 = () => {
  // ===============================
  // 🔵 1) الأسئلة (كلها داخل نفس الكومبونينت)
  // ===============================
  const questions = [
    {
      id: 1,
      parts: [
        { type: "text", value: "sn" },
        { type: "blank", options: ["aik", "ake"] },
        { type: "text", value: "." },
      ],
      correct: ["ake"],
      image: img1,
    },

    {
      id: 2,
      parts: [
        { type: "text", value: "tr" },
        { type: "blank", options: ["ain", "ayn"] },

        { type: "text", value: "." },
      ],
      correct: ["ain"],
      image: img2,
    },
    {
      id: 3,
      parts: [
        { type: "text", value: "d" },
        { type: "blank", options: ["ay", "ae"] },

        { type: "text", value: "." },
      ],
      correct: ["ay"],
      image: img3,
    },
  ];

  // ===============================
  // 🔵 2) حفظ اختيارات الطالب
  // ===============================
  const [answers, setAnswers] = useState(
    questions.map((q) =>
      q.parts.map((p) => (p.type === "blank" ? null : null)),
    ),
  );
  const [showResult, setShowResult] = useState(false);
  const [locked, setLocked] = useState(false);

  /* ================ audio logic =========================*/

  const stopAtSecond = 7.9;

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0.52,
      end: 7.9,
      text: "Page 32, write activities. Exercise A, number 2. Listen and circle.",
    },
    { start: 8.96, end: 10.36, text: "1, snake." },
    { start: 11.4, end: 15.94, text: "2, train. 3, day." },
  ];


  // ===============================
  // 🔵 3) الضغط على خيار
  // ===============================
  const handleSelect = (qIndex, blankIndex, option) => {
    if (locked || showResult) return; // ❌ لا يسمح بالتعديل بعد Show Answer
    const updated = [...answers];
    updated[qIndex][blankIndex] = option;
    setAnswers(updated);
    setShowResult(false);
  };

  // ===============================
  // 🔵 4) فحص الإجابات
  // ===============================
  const checkAnswers = () => {
    if (locked || showResult) return; // ❌ لا يسمح بالتعديل بعد Show Answer
    // تحقق إذا الطالب ما اختار ولا شيء
    const selectedCount = answers.flat().filter((a) => a !== null).length;
    if (selectedCount === 0) {
      ValidationAlert.info("");
      return;
    }

    let correct = 0;
    let total = 0;

    questions.forEach((q, qIndex) => {
      q.correct.forEach((correctAns, blankIndex) => {
        total++;
        if (answers[qIndex][blankIndex] === correctAns) {
          correct++;
        }
      });
    });

    const color =
      correct === total ? "green" : correct === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${correct} / ${total}
      </span>
    </div>
  `;

    if (correct === total) ValidationAlert.success(scoreMessage);
    else if (correct === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);

    setShowResult(true);
  };
  const showAnswers = () => {
    // اجابة كل سؤال = correct array
    const correctFilled = questions.map((q) => [...q.correct]);

    setAnswers(correctFilled);
    setShowResult(true);
    setLocked(true); // 🔒 قفل الإجابات
  };

  // ===============================
  // 🔵 JSX
  // ===============================
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
        style={{gap:"54px"}}
        
      >
        <h3 className="header-title-page8">
          <span style={{ color: "#2e3192" }}>2</span>Listen and circle.
        </h3>
        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
        />
       
        <div className="flex gap-18">
          {questions.map((q, qIndex) => (
            <div className="flex gap-5" key={q.id}>
              <div className="sentence-CB-unit4-p5-q2">
                <div
                  style={{
                    display: "flex",
                    // width: "100%",
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    className="header-title-page8"
                    style={{
                      color: "black",
                      fontWeight: "700",
                      fontSize: "20px",
                    }}
                  >
                    {q.id}
                  </span>

                  <img
                    src={q.image}
                    className="question-img-CB-unit3-p6-q1"
                    style={{ width: "150px", height: "150px" }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  {q.parts.map((part, pIndex) => {
                    if (part.type === "text") {
                      return (
                        <span
                          key={pIndex}
                          className="sentence-text-CB-unit3-p6-q1"
                        >
                          {part.value}
                        </span>
                      );
                    }

                    if (part.type === "blank") {
                      const actualBlankIndex = q.parts
                        .filter((p) => p.type === "blank")
                        .indexOf(part);

                      return (
                        <span
                          key={pIndex}
                          className="blank-options-CB-unit4-p5-q2"
                        >
                          {part.options.map((opt, optIndex) => {
                            const isSelected =
                              answers[qIndex][actualBlankIndex] === opt;

                            const isWrongSelected =
                              showResult &&
                              isSelected &&
                              opt !== q.correct[actualBlankIndex];

                            return (
                              <div
                                key={optIndex}
                                className="option-wrapper-CB-unit3-p6-q1"
                              >
                                <span
                                  className={`option-word-CB-unit3-p6-q1 ${
                                    isSelected ? "selected" : ""
                                  }`}
                                  onClick={() =>
                                    handleSelect(qIndex, actualBlankIndex, opt)
                                  }
                                >
                                  {opt}
                                </span>

                                {isWrongSelected && !locked && (
                                  <div className="wrong-mark-CB-unit4-p5-q2">
                                    ✕
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </span>
                      );
                    }
                  })}
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
            setAnswers(
              questions.map((q) =>
                q.parts.map((p) => (p.type === "blank" ? null : null)),
              ),
            );
            setShowResult(false);
            setLocked(false);
          }}
        >
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

export default Unit4_Page5_Q2;

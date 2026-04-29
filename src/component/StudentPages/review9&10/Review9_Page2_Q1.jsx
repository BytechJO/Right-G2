import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 89/Ex D 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 89/Ex D 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 89/Ex D 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 89/Ex D 4.svg";
import img5 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 89/Ex D 5.svg";
import sound1 from "../../../assets/audio/ClassBook/U 10/cd62pg89-instuction1-adult-lady_WFBZXKxh.mp3";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";

const Review9_Page2_Q1 = () => {
  const stopAtSecond = 9.10;

const captions = [
  { start: 0.500, end: 9.099, text: "Page eighty-nine, review 9, exercise D. Does it have a short or long A? Listen, read, and circle." },
  { start: 10.179, end: 11.619, text: "1, train." },
  { start: 12.719, end: 21.899, text: "2, ant. 3, cane. 4, cap. 5, hat." }
];
  const questions = [
    { img: img1, answer: "long" },
    { img: img2, answer: "short" },
    { img: img3, answer: "long" },
    { img: img4, answer: "short" },
    { img: img5, answer: "short" },
  ];

  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [locked, setLocked] = useState(false);
  const [showWrongMarks, setShowWrongMarks] = useState(false);

  const choose = (index, value) => {
    if (locked) return;

    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const resetAll = () => {
    setAnswers(Array(questions.length).fill(""));
    setLocked(false);
    setShowWrongMarks(false);
  };

  const showAnswers = () => {
    setAnswers(questions.map((q) => q.answer));
    setLocked(true);
    setShowWrongMarks(false);
  };

  const checkAnswers = () => {
    if (locked) return;

    if (answers.includes("")) {
      ValidationAlert.info("Please complete all answers");
      return;
    }

    let score = 0;

    answers.forEach((a, i) => {
      if (a === questions[i].answer) score++;
    });

    const total = questions.length;
    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const message = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) ValidationAlert.success(message);
    else if (score === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);

    setShowWrongMarks(true);
    setLocked(true);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"20px"}}>
        <h5 className="header-title-page8 mb-10">
          <span style={{ marginRight: "20px" }}>D</span>
          Does it have a<span style={{ color: "#2e3192" }}> short a </span>or
          <span style={{ color: "#2e3192" }}> long a</span>? Listen, read, and
          circle.
        </h5>
         <div className="flex flex-col gap-10">
        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
        />

        <div className="grid grid-cols-5 gap-6 text-center mt-5">
          {questions.map((q, index) => {
            const isWrong =
              showWrongMarks &&
              answers[index] !== "" &&
              answers[index] !== q.answer;

            return (
              <div key={index} className="flex flex-col items-center gap-3">
                <div className="relative">
                  <img
                    src={q.img}
                    style={{
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />

                  <div className="absolute -top-3 -left-3 font-bold text-lg">
                    {index + 1}
                  </div>
                </div>

                <div className="bg-[#ead6cc] rounded-xl px-4 py-2 flex flex-col gap-1">
                  {["short", "long"].map((type) => {
                    const selected = answers[index] === type;

                    return (
                      <div key={type} className="relative">
                        <div
                          onClick={() => choose(index, type)}
                          className={`cursor-pointer px-2 py-1 rounded-full relative
                            ${
                              selected
                                ? "border-2 border-red-500"
                                : "border-2 border-transparent"
                            }`}
                        >
                          {type} a
                        </div>

                        {selected && isWrong && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold shadow-md border-2 border-white">
                            ✕
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </div>

      <div className="action-buttons-container mt-10">
        <button onClick={resetAll} className="try-again-button">
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

export default Review9_Page2_Q1;

import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";

import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 11/Ex E 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 11/Ex E 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 11/Ex E 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 11/Ex E 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 11/Ex E 5.svg";

import "./WB_Unit2_Page11_Q1.css";

const exerciseData = [
  {
    id: 1,
    questionText: "Is that a duck?",
    correctQuestion: "yes, it is",
    src: img1,
  },
  {
    id: 2,
    questionText: "Is that a bird?",
    correctQuestion: "no, it isn't",
    src: img2,
  },
  {
    id: 3,
    questionText: "Is that a sun?",
    correctQuestion: "no, it isn't",
    src: img3,
  },
  {
    id: 4,
    questionText: "Is that a flower?",
    correctQuestion: "no, it isn't",
    src: img4,
  },
  {
    id: 5,
    questionText: "Is that a pond?",
    correctQuestion: "yes, it is",
    src: img5,
  },
];

const WB_Unit2_Page11_Q1 = () => {
  const [userAnswers, setUserAnswers] = useState(
    exerciseData.reduce((acc, item) => {
      acc[item.id] = "";
      return acc;
    }, {}),
  );

  const [checked, setChecked] = useState(false);
  const [locked, setLocked] = useState(false);

  // ⭐ اختيار الجواب
  const handleSelect = (id, value) => {
    if (locked) return;

    setUserAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const checkAnswers = () => {
    if (checked || locked) return;

    const unanswered = exerciseData.some((item) => !userAnswers[item.id]);

    if (unanswered) {
      ValidationAlert.info("Please answer all questions first!");
      return;
    }

    let correctCount = 0;
    const total = exerciseData.length;

    exerciseData.forEach((item) => {
      if (userAnswers[item.id] === item.correctQuestion) {
        correctCount++;
      }
    });

    setChecked(true);
    setLocked(true);

    if (correctCount === total) {
      ValidationAlert.success(`Score: ${correctCount}/${total}`);
    } else if (correctCount > 0) {
      ValidationAlert.warning(`Score: ${correctCount}/${total}`);
    } else {
      ValidationAlert.error(`Score: ${correctCount}/${total}`);
    }
  };

  const handleShowAnswer = () => {
    const answers = {};
    exerciseData.forEach((item) => {
      answers[item.id] = item.correctQuestion;
    });

    setUserAnswers(answers);
    setChecked(true);
    setLocked(true);
  };

  const handleTryAgain = () => {
    const reset = {};
    exerciseData.forEach((item) => {
      reset[item.id] = "";
    });

    setUserAnswers(reset);
    setChecked(false);
    setLocked(false);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"45px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">E</span> Look and answer the questions.
        </h1>
        <div className="grid grid-cols-2 gap-5 ">
          {exerciseData.map((item) => {
            const isWrong =
              checked &&
              userAnswers[item.id] &&
              userAnswers[item.id] !== item.correctQuestion;

            return (
              <div
                key={item.id}
                className="mb-6 flex items-center gap-4"
                style={{ justifyContent: "flex-start" }}
              >
                <div className="relative flex gap-5 items-center">
                  <div className="flex flex-col gap-5">
                    <label className="block text-xl font-medium">
                     <span className="text-2xl text-blue-900 font-semibold"> {item.id}.</span> {item.questionText}
                    </label>

                   
                 
                  {/* ⭐ Buttons بدل select */}
                  <div style={{ display: "flex", gap: "20px" }}>
                    {["yes, it is", "no, it isn't"].map((option) => (
                      <button
                        key={option}
                        onClick={() => handleSelect(item.id, option)}
                        disabled={locked}
                        className={`option-btn-wb-unit2-page11-q1 ${
                          userAnswers[item.id] === option ? "selected" : ""
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
 </div>
                  {/* ❌ Wrong icon */}
                  {isWrong && (
                    <div className="wrong-icon-unit2-page11-q1">✕</div>
                  )}
                   <img
                      src={item.src}
                      className="object-contain"
                      style={{height:"100px" ,width:"100px"}}
                      alt=""
                    />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center">
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleTryAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};

export default WB_Unit2_Page11_Q1;

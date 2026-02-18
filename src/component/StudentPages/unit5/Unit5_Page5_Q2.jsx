import React, { useState, useRef, useEffect } from "react";
import "./Unit5_Page5_Q2.css";

import ValidationAlert from "../../Popup/ValidationAlert";

// Example images imports. Replace with your actual paths.
import img1a from "../../../assets/imgs/test.png";
import img1b from "../../../assets/imgs/test.png";
import img1c from "../../../assets/imgs/test.png";
import img1d from "../../../assets/imgs/test.png";

import img2a from "../../../assets/imgs/test.png";
import img2b from "../../../assets/imgs/test.png";
import img2c from "../../../assets/imgs/test.png";
import img2d from "../../../assets/imgs/test.png";


const Unit5_Page5_Q2 = () => {
  const groups = [
    { images: [img1a, img1b, img1c,img1d], different: 2 },
    { images: [img2a, img2b, img2c,img2d], different: 0 },
   
  ];
  const [showResult2, setShowResult2] = useState(false);
  const [selected, setSelected] = useState(Array(groups.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [locked, setLocked] = useState(false);

  const handleSelect = (groupIndex, imageIndex) => {
    if (locked || showResult2) return; // 🔒 منع التعديل بعد Show Answer
    const updated = [...selected];
    updated[groupIndex] = imageIndex;
    setSelected(updated);
    setShowResult2(false);
  };
  const showAnswers = () => {
    const correctSelections = groups.map((g) => g.different);

    setSelected(correctSelections);
    setShowResult2(true);
    setLocked(true); // 🔒 قفل التعديل
  };

  const checkAnswers = () => {
    if (locked || showResult2) return; // 🔒 منع التعديل بعد Show Answer
    if (selected.some((val) => val === null)) {
      ValidationAlert.info("Please choose a circle (f or v) for all items!");
      return;
    }
    let correctCount = 0;
    let wrongCount = 0;
    groups.forEach((group, index) => {
      if (selected[index] === null)
        return ValidationAlert.info(
          "Please choose a circle (f or v) for all items!"
        );

      if (selected[index] === group.different) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const total = groups.length; // 8 نقاط
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${correctCount} / ${total}
      </span>
    </div>
  `;
    // تحديد الرسالة حسب نوع الإجابات
    if (correctCount === groups.length) {
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
    setShowResult2(true);
  };

  const reset = () => {
    setSelected(Array(groups.length).fill(null));
    setShowResult(false);
    setShowResult2(false);
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
          gap: "30px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <h3 className="header-title-page8">
          <span style={{ color: "#2e3192" ,marginRight:"20px"}}>2</span>  Which picture has a different   <span style={{ color: "#2e3192" }}>long vowel sound</span>? Write <span style={{ color: "#2e3192" }}>✗</span>.
        </h3>
      
        <div className="exercise-row-CB-unit5-p5-2">
  {groups.map((group, gIndex) => (
    <div className="ds-group-box-CB-unit5-p5-2" key={gIndex}>
      <span style={{ color: "darkblue", fontWeight: "700" }}>
        {gIndex + 1}
      </span>

      {group.images.map((img, iIndex) => {
        const isSelected = selected[gIndex] === iIndex;
        const isCorrect = group.different === iIndex;

        return (
          <div
            className="ds-image-wrapper-CB-unit5-p5-2"
            key={iIndex}
            onClick={() => !locked && handleSelect(gIndex, iIndex)}
          >
            <img src={img} className="ds-image-CB-unit5-p5-2" />

            {/* Display X only when selected */}
            {isSelected && <div className="ds-x-CB-unit5-p5-2">✕</div>}

            {/* ❌ دائرة حمراء فيها X بيضاء للخطأ فقط عند النتيجة */}
            {showResult2 && !locked && isSelected && !isCorrect && (
              <span className="wrong-x-circle-CB-unit5-p5-2">✕</span>
            )}
          </div>
        );
      })}
    </div>
  ))}
</div>

      </div>
      <div className="action-buttons-container">
        <button onClick={reset} className="try-again-button">
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

export default Unit5_Page5_Q2;

import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review3_Page1_Q4.css";
const Review3_Page1_Q4 = () => {
  const [answer, setAnswer] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const reset = () => {
    setAnswer("");
    setAnswer2("");
    setChecked(false);
    setIsCorrect(null);
    resetCanvas();
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
        <div>
          <h5 className="header-title-page8">
            <span style={{marginRight:"20px"}}>D</span>Write what you can do.
          </h5>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexDirection: "column",
          }}
        >
          <input
            type="text"
            value={answer}
            className="answer-input-CB-review3-p1-q4"
            onChange={(e) => setAnswer(e.target.value)}
            disabled={checked}
          />
          <input
            type="text"
            value={answer2}
            className="answer-input-CB-review3-p1-q4"
            onChange={(e) => setAnswer2(e.target.value)}
            disabled={checked}
          />
        </div>
      </div>

      <div className="action-buttons-container">
        <button className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>

        {/* <button className="check-button2" onClick={checkAnswer}>
          Check Answer ✓
        </button> */}
      </div>
    </div>
  );
};

export default Review3_Page1_Q4;

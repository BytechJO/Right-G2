import React, { useState, } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review3_Page1_Q4.css";
import ExerciseHeader from "../../ExerciseHeader";
const Review3_Page1_Q4 = () => {
  const [answer, setAnswer] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [answer3, setAnswer3] = useState("");
  const [answer4, setAnswer4] = useState("");
  const [answer5, setAnswer5] = useState("");
  const [answer6, setAnswer6] = useState("");
  const [checked, setChecked] = useState(false);
  // const [isCorrect, setIsCorrect] = useState(null);

  const reset = () => {
    setAnswer("");
    setAnswer2("");
    setAnswer3("");
    setAnswer4("");
    setAnswer5("");
    setAnswer6("");
    setChecked(false);
    // setIsCorrect(null);
    // resetCanvas();
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
      <div className="div-forall" style={{gap:"100px"}}>
        <div>
          <ExerciseHeader
            sectionLetter="D"
            title="Write what you can do."
            subTitle="Think of one action you can do, then write a short complete sentence about it."
            isReview="true"
          />

        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "25px",
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
          <input
            type="text"
            value={answer3}
            className="answer-input-CB-review3-p1-q4"
            onChange={(e) => setAnswer3(e.target.value)}
            disabled={checked}
          />{" "}
          <input
            type="text"
            value={answer4}
            className="answer-input-CB-review3-p1-q4"
            onChange={(e) => setAnswer4(e.target.value)}
            disabled={checked}
          />{" "}
          <input
            type="text"
            value={answer5}
            className="answer-input-CB-review3-p1-q4"
            onChange={(e) => setAnswer5(e.target.value)}
            disabled={checked}
          />
           <input
            type="text"
            value={answer6}
            className="answer-input-CB-review3-p1-q4"
            onChange={(e) => setAnswer6(e.target.value)}
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

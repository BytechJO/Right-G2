import React, { useState } from "react";
import img1 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 19/Ex E 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 19/Ex E 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 19/Ex E 3.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review2_Page2_Q1.css";
import sound1 from "../../../assets/audio/ClassBook/U 2/cd12pg19-instruction1-adult-lady_nabW4eTL.mp3";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";

const Review2_Page2_Q1 = () => {
  const correctAnswers = ["q", "c", "c"];
  const [answers, setAnswers] = useState(["", "", ""]);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false);

  /* ================ audio ================= */
  const stopAtSecond = 11.46;

  const captions = [
    { start: 0.6, end: 5.26, text: "Page 19, review 2. Exercise E." },
    {
      start: 6.52,
      end: 11.46,
      text: "Does it begin with C or Q? Listen and write.",
    },
    { start: 12.56, end: 14.62, text: "1, question mark." },
    { start: 15.72, end: 20.3, text: "2, cup. 3, candy." },
  ];

  /* ================= Check Answers ================= */
  const checkAnswers = () => {
    if (locked) return;

    if (answers.some((ans) => ans === "")) {
      ValidationAlert.info("Please fill in all the blanks before checking!");
      return;
    }

    let tempScore = 0;
    let wrong = [];

    answers.forEach((ans, i) => {
      if (ans === correctAnswers[i]) tempScore++;
      else wrong.push(i);
    });

    setWrongInputs(wrong);

    const total = correctAnswers.length;
    const color =
      tempScore === total ? "green" : tempScore === 0 ? "red" : "orange";

    ValidationAlert[
      tempScore === total ? "success" : tempScore === 0 ? "error" : "warning"
    ](`
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${tempScore} / ${total}
        </span>
      </div>
    `);

    setLocked(true);
  };

  const reset = () => {
    setAnswers(["", "", ""]);
    setWrongInputs([]);
    setLocked(false);
  };

  const showAnswer = () => {
    setAnswers([...correctAnswers]);
    setWrongInputs([]);
    setLocked(true);
  };

  return (
    <div
      className="question-wrapper-unit3-page6-q1"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <div className="div-forall">
        <h5 className="header-title-page8">
          <span style={{ marginRight: "20px" }}>E</span>
          Does it begin with <span style={{ color: "#2e3192" }}>c</span> or{" "}
          <span style={{ color: "#2e3192" }}>q</span>? Listen and write.
        </h5>

        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
        />

        <div className="row-content10-CB-review2-p2-q1">
          {[img1, img2, img3].map((img, index) => (
            <div className="row2-CB-review2-p2-q1" key={index}>
              <img src={img} className="q-img-CB-review2-p1-q2" style={{marginLeft:"20px"}} />

              <div
                className="q-input-CB-review2-p2-q1"
                style={{
                  display: "flex",
                  gap: "15px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {["c", "q"].map((letter) => {
                  const isSelected = answers[index] === letter;
                  const isWrong =
                    wrongInputs.includes(index) && isSelected;
                  const isCorrect =
                    locked && letter === correctAnswers[index];

                  return (
                    <label
                      key={letter}
                      style={{
                        border: "2px solid",
                        borderColor: isCorrect
                          ? ""
                          : isWrong
                          ? "red"
                          : "#2c5287",
                        padding: "7px 14px",
                        borderRadius: "8px",
                        cursor: locked ? "not-allowed" : "pointer",
                        background: isSelected ? "#bed7feff" : "white",
                        fontWeight: "bold",
                        position: "relative",
                        height:"50px",
                        width:"50px",
                        fontSize:"25px"
                      }}
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={letter}
                        checked={isSelected}
                        disabled={locked}
                        onChange={() => {
                          if (locked) return;

                          setAnswers((prev) => {
                            const updated = [...prev];
                            updated[index] = letter;
                            return updated;
                          });

                          setWrongInputs([]);
                        }}
                        style={{ display: "none" }}
                      />

                      {letter}

                      {/* ❌ غلط */}
                      {isWrong && (
                        <span className="wrong-icon-CB-unit3-p5-q1"
                          
                        >
                          ✕
                        </span>
                      )}

                      {/* ✔️ صح */}
                     
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="action-buttons-container">
        <button onClick={reset} className="try-again-button">
          Start Again ↻
        </button>

        <button
          onClick={showAnswer}
          className="show-answer-btn swal-continue"
        >
          Show Answer
        </button>

        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Review2_Page2_Q1;
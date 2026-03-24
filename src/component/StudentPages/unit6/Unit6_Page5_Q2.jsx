import "./Unit6_Page5_Q2.css";
import React, { useState } from "react";
import mapImg from "../../../assets/imgs/mapImg.png";
import ValidationAlert from "../../Popup/ValidationAlert";

const Unit6_Page5_Q2 = () => {
  const [circles, setCircles] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [locked, setLocked] = useState(false);
  const wordAreas = [
    { id: "kite", x: 28.4, y: 13, w: 6, h: 6, correct: true },
    { id: "it", x: 30, y: 27, w: 4, h: 6, correct: false },
    { id: "light", x: 25, y: 39, w: 6, h: 7, correct: true },
    { id: "rain", x: 19.5, y: 52, w: 6, h: 6, correct: false },
    { id: "sit", x: 20.5, y: 68, w: 4, h: 6, correct: false },
    { id: "five", x: 29.5, y: 62, w: 6, h: 7, correct: true },
    { id: "cake", x: 40.5, y: 48.5, w: 6, h: 7, correct: false },
    { id: "bike", x: 46.4, y: 60, w: 6, h: 7, correct: true },
    { id: "feet", x: 52.5, y: 70.5, w: 6, h: 7, correct: false },
    { id: "night", x: 60, y: 65, w: 7, h: 7, correct: true },
    { id: "time", x: 63, y: 53, w: 7, h: 7, correct: true },
    { id: "in", x: 64, y: 37.5, w: 5, h: 6, correct: false },
    { id: "tight", x: 72, y: 18.5, w: 7, h: 7, correct: true },
    { id: "tea", x: 79.5, y: 37.5, w: 6, h: 6, correct: false },
    { id: "like", x: 79, y: 53, w: 6, h: 7, correct: true },
    { id: "meat", x: 73.5, y: 65.5, w: 7, h: 7, correct: false },
    { id: "six", x: 69, y: 80, w: 5, h: 6, correct: false },
  ];
  const handleClick = (area) => {
    if (locked || showResult) return;

    if (circles.some((c) => c.id === area.id)) {
      setCircles((prev) => prev.filter((c) => c.id !== area.id));
      return;
    }

    setCircles((prev) => [
      ...prev,
      {
        id: area.id,
        x: area.x,
        y: area.y,
        w: area.w,
        h: area.h,
        correct: area.correct,
      },
    ]);
  };

  const checkAnswers = () => {
    if (locked || showResult) return;

    if (circles.length === 0) {
      ValidationAlert.info("");
      return;
    }

    const total = wordAreas.filter((w) => w.correct).length;

    const correctSelected = circles.filter((c) => c.correct).length;

    const score = correctSelected;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const message = `
  <div style="font-size:20px;text-align:center;">
    <span style="color:${color};font-weight:bold;">
      Score: ${score} / ${total}
    </span>
  </div>
  `;

    if (score === total) ValidationAlert.success(message);
    else if (score === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);

    setShowResult(true);
    setLocked(true);
  };

  const showAnswers = () => {
    const correctCircles = wordAreas
      .filter((w) => w.correct)
      .map((w) => ({
        id: w.id,
        x: w.x,
        y: w.y,
        w: w.w,
        h: w.h,
        correct: true,
      }));

    setCircles(correctCircles);
    setShowResult(true);
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
          position: "relative",
          width: "100%",
          maxWidth: "1000px",
          gap: "30px",
        }}
      >
        <div>
          <h5 className="header-title-page8">
            <span style={{ color: "#2e3192" }}> 2 </span> Read and circle the{" "}
            <span style={{ color: "#2e3192" }}>long i</span>words.
          </h5>
        </div>
        <div className="relative w-full max-w-[1000px]">
          <img
            src={mapImg}
            alt=""
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />

          {wordAreas.map((area) => (
            <div
              key={area.id}
              onClick={() => handleClick(area)}
              className="absolute cursor-pointer"
              style={{
                left: `${area.x}%`,
                top: `${area.y}%`,
                width: `${area.w}%`,
                height: `${area.h}%`,
              }}
            />
          ))}

          {circles.map((c, i) => (
            <div
              key={i}
              className="absolute border-4 border-purple-500 rounded-full pointer-events-none cursor-pointer"
              style={{
                left: `${c.x - 0.5}%`,
                top: `${c.y - 0.5}%`,
                width: `${c.w + 1}%`,
                height: `${c.h + 1}%`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="action-buttons-container">
        <button
          className="try-again-button"
          onClick={() => {
            setCircles([]);
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

export default Unit6_Page5_Q2;

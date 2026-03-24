import React, { useState, useRef } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review6_Page2_Q2.css";

import img1 from "../../../assets/imgs/test6.png";
import img2 from "../../../assets/imgs/test6.png";
import img3 from "../../../assets/imgs/test6.png";
import img4 from "../../../assets/imgs/test6.png";
import img5 from "../../../assets/imgs/test6.png";
import img6 from "../../../assets/imgs/test6.png";

const Review6_Page2_Q2 = () => {
  const [lines, setLines] = useState([]);
  const [startDot, setStartDot] = useState(null);

  const imageDotRefs = useRef([]);
  const textDotRefs = useRef([]);
  const containerRef = useRef(null);
  const [isChecked, setIsChecked] = useState(false);
  const [showedAnswer, setShowedAnswer] = useState(false);
  const images = [
    { image: img1 },
    { image: img2 },
    { image: img3 },
    { image: img4 },
    { image: img5 },
    { image: img6 },
  ];

  const words = ["light", "five", "kite", "tight", "night", "bike"];

  const correctMatches = {
    0: 2,
    1: 4,
    2: 3,
    3: 0,
    4: 5,
    5: 1,
  };

  const handleDotClick = (index, type) => {
    if (isChecked || showedAnswer) return;
    if (!startDot) {
      setStartDot({ index, type });
      return;
    }

    if (startDot.type === type) {
      setStartDot(null);
      return;
    }

    const imageIndex = startDot.type === "image" ? startDot.index : index;

    const textIndex = startDot.type === "text" ? startDot.index : index;

    setLines((prevLines) => {
      let updatedLines = [...prevLines];

      updatedLines = updatedLines.filter((line) => {
        const img =
          line.from.type === "image" ? line.from.index : line.to.index;

        return img !== imageIndex;
      });

      updatedLines = updatedLines.filter((line) => {
        const txt = line.from.type === "text" ? line.from.index : line.to.index;

        return txt !== textIndex;
      });

      updatedLines.push({
        from: { index: imageIndex, type: "image" },
        to: { index: textIndex, type: "text" },
      });

      return updatedLines;
    });

    setStartDot(null);
  };

  const showAnswers = () => {
    if (isChecked) return;

    const answerLines = Object.keys(correctMatches).map((imgIndex) => ({
      from: { index: parseInt(imgIndex), type: "image" },
      to: { index: correctMatches[imgIndex], type: "text" },
    }));

    setLines(answerLines);
    setShowedAnswer(true);
  };
  const resetAll = () => {
    setLines([]);
    setStartDot(null);
    setIsChecked(false);
    setShowedAnswer(false);
  };

  const checkAnswers = () => {
    if (showedAnswer) return;
    if (lines.length !== images.length) {
      ValidationAlert.info(
        "Oops!",
        "Please complete all matches before checking.",
      );
      return;
    }

    let score = 0;

    lines.forEach((line) => {
      const imageIndex =
        line.from.type === "image" ? line.from.index : line.to.index;

      const textIndex =
        line.from.type === "text" ? line.from.index : line.to.index;

      if (correctMatches[imageIndex] === textIndex) {
        score++;
      }
    });

    const total = images.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${score} / ${total}
        </span>
      </div>
    `;
    setIsChecked(true);
    if (score === total) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "30px",
        position: "relative",
      }}
    >
      <div className="div-forall" style={{ width: "60%" }}>
        <h5 className="header-title-page8">
          <span style={{ marginRight: "20px" }}>E</span>
          Read, look, and match.
        </h5>
        {images.map((item, i) => (
          <div key={i} className="flex justify-between items-center my-3">
            {/* WORD SIDE */}
            <div className="w-[45%] flex justify-start">
              <div className="relative inline-block">
                <p
                  onClick={() => handleDotClick(i, "text")}
                  className={`px-5 py-1.5 rounded-full font-semibold text-[18px] cursor-pointer min-w-20 ${
                    startDot?.index === i && startDot?.type === "text"
                      ? "border-2 border-[#e74c3c] bg-[#fdecea]"
                      : "bg-[#f6e6de]"
                  }`}
                >
                  {words[i]}
                </p>

                <div
                  ref={(el) => (textDotRefs.current[i] = el)}
                  onClick={() => handleDotClick(i, "text")}
                  className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#d82b2b] rounded-full cursor-pointer"
                />
              </div>
            </div>

            {/* IMAGE SIDE */}
            <div className="w-[35%] flex items-center justify-end gap-2">
              <div
                ref={(el) => (imageDotRefs.current[i] = el)}
                onClick={() => handleDotClick(i, "image")}
                className="w-3 h-3 bg-[#d82b2b] rounded-full cursor-pointer"
              />

              <img
                src={item.image}
                alt=""
                onClick={() => handleDotClick(i, "image")}
                style={{
                  height: "60px",
                  width: "auto",
                  objectFit: "contain",
                  cursor: "pointer",
                  border:
                    startDot?.index === i && startDot?.type === "image"
                      ? "3px solid #e74c3c"
                      : "none",
                  transform:
                    startDot?.index === i && startDot?.type === "image"
                      ? "scale(1.05)"
                      : "scale(1)",
                }}
              />
            </div>
          </div>
        ))}

        {/* SVG */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {lines.map((line, i) => {
            const imageIndex =
              line.from.type === "image" ? line.from.index : line.to.index;

            const textIndex =
              line.from.type === "text" ? line.from.index : line.to.index;

            const imgDot = imageDotRefs.current[imageIndex];
            const txtDot = textDotRefs.current[textIndex];

            if (!imgDot || !txtDot || !containerRef.current) return null;

            const imgRect = imgDot.getBoundingClientRect();
            const txtRect = txtDot.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();

            const x1 = imgRect.left + imgRect.width / 2 - containerRect.left;
            const y1 = imgRect.top + imgRect.height / 2 - containerRect.top;

            const x2 = txtRect.left + txtRect.width / 2 - containerRect.left;
            const y2 = txtRect.top + txtRect.height / 2 - containerRect.top;

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#e74c3c"
                strokeWidth="3"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        <div className="action-buttons-container">
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
    </div>
  );
};

export default Review6_Page2_Q2;

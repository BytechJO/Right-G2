import React, { useState, useRef } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit8_Page6_Q2.css";

import img1 from "../../../assets/imgs/test6.png";
import img2 from "../../../assets/imgs/test6.png";
import img3 from "../../../assets/imgs/test6.png";

const Unit8_Page6_Q2 = () => {
  const [lines, setLines] = useState([]);
  const [startDot, setStartDot] = useState(null);
  const [locked, setLocked] = useState(false);

  const imageDotRefs = useRef([]);
  const textDotRefs = useRef([]);
  const containerRef = useRef(null);

  const images = [{ image: img1 }, { image: img2 }, { image: img3 }];
  const texts = [
    "You have popsicles. You don’t have popcorn.",
    "It likes chicken. It doesn’t like salad.",
    "He likes fruit. He doesn’t like bread.",
  ];

  const correctMatches = {
    0: 2,
    1: 0,
    2: 1,
  };

  const handleDotClick = (index, type) => {
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
    const answerLines = Object.keys(correctMatches).map((imgIndex) => ({
      from: { index: parseInt(imgIndex), type: "image" },
      to: { index: correctMatches[imgIndex], type: "text" },
    }));

    setLines(answerLines);
    setLocked(true);
  };

  const resetAll = () => {
    setLines([]);
    setStartDot(null);
    setLocked(false);
  };

  const checkAnswers = () => {
    if (locked) return;
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

    if (score === total) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center p-[30px] relative"
    >
      <div className="relative w-[60%]">
        <h5 className="header-title-page8">
          <span className="ex-A">E</span>
          Look and match.
        </h5>

        {images.map((item, i) => (
          <div key={i} className="flex items-center justify-between my-8">
            {/* LEFT IMAGE */}
            <div className="flex items-center gap-6 w-[45%]">
              <div className="relative">
                <img
                  src={item.image}
                  className={`w-[200px]! h-[150px]! object-contain cursor-pointer rounded-lg
                 ${
                   startDot?.index === i && startDot?.type === "image"
                     ? "ring-4 ring-red-400"
                     : ""
                 }`}
                  onClick={() => handleDotClick(i, "image")}
                />
              </div>

              {/* MIDDLE DOT */}
              <div
                ref={(el) => (imageDotRefs.current[i] = el)}
                onClick={() => handleDotClick(i, "image")}
                className={`w-3 h-3 rounded-full cursor-pointer
               ${
                 startDot?.index === i && startDot?.type === "image"
                   ? "bg-red-700 scale-125"
                   : "bg-red-500"
               }`}
              />
            </div>

            {/* RIGHT TEXT */}
            <div className="flex items-center gap-4 w-[45%]">
              <div
                ref={(el) => (textDotRefs.current[i] = el)}
                onClick={() => handleDotClick(i, "text")}
                className="w-3 h-3 bg-red-500 rounded-full cursor-pointer"
              />

              <div
                onClick={() => handleDotClick(i, "text")}
                className={`px-5 py-3 rounded-xl text-[17px] leading-6 cursor-pointer
  ${
    startDot?.index === i && startDot?.type === "text"
      ? "bg-orange-200 ring-2 ring-red-400"
      : "bg-[#ead6cc]"
  }`}
              >
                {texts[i]}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LINES SVG */}
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
  );
};

export default Unit8_Page6_Q2;

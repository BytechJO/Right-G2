import React, { useState, useRef } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit8_Page6_Q2.css";

import img1 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 69/Asset 7.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 69/Asset 8.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 69/Asset 9.svg";

const Unit8_Page6_Q2 = () => {
  const [lines, setLines] = useState([]);
  const [startDot, setStartDot] = useState(null);
  const [locked, setLocked] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const imageDotRefs = useRef([]);
  const textDotRefs = useRef([]);
  const containerRef = useRef(null);

  const images = [{ image: img1 }, { image: img2 }, { image: img3 }];
  const texts = [
    "You have popsicles.\nYou don’t have popcorn.",
    "They have chips.\nThey don’t have candy.",
    "We have juice.\nWe don’t have burgers.",
  ];
  const correctMatches = {
    0: 1,
    1: 2,
    2: 0,
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
    setShowResult(false);
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
    setShowResult(true);
    setLocked(true);
  };
  const isImageWrong = (imgIndex) => {
    if (!showResult) return false;

    const line = lines.find((l) => {
      const img = l.from.type === "image" ? l.from.index : l.to.index;
      return img === imgIndex;
    });

    if (!line) return true;

    const textIndex =
      line.from.type === "text" ? line.from.index : line.to.index;

    return correctMatches[imgIndex] !== textIndex;
  };
  return (
    <div className="main-container-component relative" ref={containerRef}>
      <div className="div-forall" style={{gap:"20px"}}>
        <h5 className="header-title-page8">
          <span className="ex-A">E</span>
          Look and match.
        </h5>


<div className="flex flex-col gap-2">
        {images.map((item, i) => (
          <div key={i} className="flex items-center justify-between my-4">
            {/* LEFT IMAGE */}
            <div className="flex items-center gap-6 w-[45%]">
              <div className="relative">
                {/* ❌ */}
                {isImageWrong(i) && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-md">
                    ✕
                  </span>
                )}

                <img
                  src={item.image}
                  style={{height:"120px" ,width:"auto"}}
                  className={`object-contain cursor-pointer rounded-lg
      ${isImageWrong(i) ? "border-2 border-red-500" : ""}
      ${
        startDot?.index === i && startDot?.type === "image"
          ? "ring-4 ring-red-600"
          : ""
      }
    `}
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
                   ? "bg-red-600 scale-125"
                   : "bg-red-500"
               }`}
              />
            </div>

            {/* RIGHT TEXT */}
            <div className="flex items-center gap-4">
              <div
                ref={(el) => (textDotRefs.current[i] = el)}
                onClick={() => handleDotClick(i, "text")}
                className="w-3 h-3 bg-red-500 rounded-full cursor-pointer"
              />

              <div
                onClick={() => handleDotClick(i, "text")}
                style={{ whiteSpace: "pre-line" }}
                className={`px-5 py-3 rounded-xl text-[17px] leading-6 cursor-pointer
  ${
    startDot?.index === i && startDot?.type === "text"
      ? "bg-[#f9e5dd] ring-2 ring-red-600"
      : "bg-[#f9e5dd]"
  }`}
              >
                {texts[i]}
              </div>
            </div>
          </div>
        ))}
        </div>
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
              stroke="red"
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

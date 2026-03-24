import React, { useState, useRef } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review5_Page1_Q3.css";

import img1 from "../../../assets/imgs/test6.png";
import img2 from "../../../assets/imgs/test6.png";
import img3 from "../../../assets/imgs/test6.png";

const Review5_Page1_Q3 = () => {
  const [lines, setLines] = useState([]);
  const [startDot, setStartDot] = useState(null);

  // ✅ FIXED
  const [selected, setSelected] = useState({
    image: null,
    text: null,
  });

  const imageDotRefs = useRef([]);
  const textDotRefs = useRef([]);
  const containerRef = useRef(null);

  const images = [{ image: img1 }, { image: img2 }, { image: img3 }];

  const texts = [
    "She likes cheese. She doesn’t like rice.",
    "It likes chicken. It doesn’t like salad.",
    "He likes fruit. He doesn’t like bread.",
  ];

  const correctMatches = {
    0: 2,
    1: 0,
    2: 1,
  };

  const handleDotClick = (index, type) => {
    // ✅ يخزن الاثنين مش واحد
    if (type === "image") {
      setSelected((prev) => ({ ...prev, image: index }));
    } else {
      setSelected((prev) => ({ ...prev, text: index }));
    }

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

      // حذف أي خط سابق للصورة
      updatedLines = updatedLines.filter((line) => {
        const img =
          line.from.type === "image" ? line.from.index : line.to.index;
        return img !== imageIndex;
      });

      // حذف أي خط سابق للنص
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
    setSelected({ image: null, text: null });
  };

  const showAnswers = () => {
    const answerLines = Object.keys(correctMatches).map((imgIndex) => ({
      from: { index: parseInt(imgIndex), type: "image" },
      to: { index: correctMatches[imgIndex], type: "text" },
    }));

    setLines(answerLines);
    setSelected({ image: null, text: null });
  };

  const resetAll = () => {
    setLines([]);
    setStartDot(null);
    setSelected({ image: null, text: null });
  };

  const checkAnswers = () => {
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
          <span style={{ marginRight: "20px" }}>C</span>
          Look, read, and match.
        </h5>

        {images.map((item, i) => (
          <div key={i} className="flex items-center justify-between my-[35px]">
            {/* IMAGE */}
            <div className="flex items-center gap-2.5 w-[45%]">
              <span className="text-[22px] font-bold">{i + 1}</span>

              <div
                className="relative cursor-pointer"
                onClick={() => handleDotClick(i, "image")}
              >
                <img
                  src={item.image}
                  alt=""
                  style={{
                    width: "200px",
                    height: "150px",
                    borderRadius: "12px",
                    border:
                      selected.image === i
                        ? "4px solid #7e1d12"
                        : "3px solid #e74c3c",
                    display: "block",
                  }}
                />

                <div
                  ref={(el) => (imageDotRefs.current[i] = el)}
                  className={`absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${
                    selected.image === i
                      ? "bg-[#7e1d12] scale-110"
                      : "bg-[#e74c3c]"
                  }`}
                />
              </div>
            </div>

            {/* TEXT */}
            <div
              className="flex items-center gap-[15px] w-[45%] cursor-pointer"
              onClick={() => handleDotClick(i, "text")}
            >
              <div
                ref={(el) => (textDotRefs.current[i] = el)}
                className={`w-4 h-4 rounded-full ${
                  selected.text === i
                    ? "bg-[#7e1d12] scale-110"
                    : "bg-[#e74c3c]"
                }`}
              />

              <p
                className={`text-[18px] font-medium ${
                  selected.text === i ? "text--[#7e1d12] font-bold" : ""
                }`}
              >
                {texts[i]}
              </p>
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

export default Review5_Page1_Q3;

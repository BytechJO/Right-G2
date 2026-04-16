import React, { useState, useRef } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review9_Page1.css";

import img1 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 88/Asset 54.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 88/Asset 56.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 88/Asset 57.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 88/Asset 58.svg";

const Review9_Page1 = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [matches, setMatches] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [locked, setLocked] = useState(false);
  const [selectedSentence, setSelectedSentence] = useState(null);

  const imageRefs = useRef([]);
  const sentenceRefs = useRef([]);
  const containerRef = useRef(null);

  const images = [
    { id: 0, img: img1 },
    { id: 1, img: img2 },
    { id: 2, img: img3 },
    { id: 3, img: img4 },
  ];

  const sentences = [
    { id: 0, text: "Sending an email." },
    { id: 1, text: "listening to the radio." },
    { id: 2, text: "ironing the clothes." },
    { id: 3, text: "playing chess." },
  ];

  const correct = {
    0: 1,
    1: 0,
    2: 3,
    3: 2,
  };

  const selectImage = (id) => {
    if (locked || showResult) return;

    // إذا اختار جملة → اربط
    if (selectedSentence !== null) {
      setMatches((prev) => {
        const updated = { ...prev };

        Object.keys(updated).forEach((imgKey) => {
          if (updated[imgKey] === selectedSentence) {
            delete updated[imgKey];
          }
        });

        updated[id] = selectedSentence;
        return updated;
      });

      setSelectedSentence(null);
      return;
    }

    setSelectedImg(id);
  };

  const selectSentence = (id) => {
    if (locked || showResult) return;

    if (selectedImg !== null) {
      setMatches((prev) => {
        const updated = { ...prev };

        Object.keys(updated).forEach((imgKey) => {
          if (updated[imgKey] === id) {
            delete updated[imgKey];
          }
        });

        updated[selectedImg] = id;
        return updated;
      });

      setSelectedImg(null);
      return;
    }

    setSelectedSentence(id);
  };
  const checkAnswers = () => {
    if (locked || showResult) return;

    if (Object.keys(matches).length !== images.length) {
      ValidationAlert.info("Please match all.");
      return;
    }

    let correctCount = 0;

    Object.entries(matches).forEach(([imgId, sentId]) => {
      if (correct[imgId] === sentId) correctCount++;
    });

    const total = images.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const message = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) {
      ValidationAlert.success(message);
    } else if (correctCount === 0) {
      ValidationAlert.error(message);
    } else {
      ValidationAlert.warning(message);
    }

    setShowResult(true);
    setLocked(true);
  };

  const showAnswers = () => {
    setMatches(correct);
    setLocked(true);
    setShowResult(true);
  };

  const reset = () => {
    setSelectedSentence(null);
    setSelectedImg(null);
    setMatches({});
    setShowResult(false);
    setLocked(false);
  };

  const isWrongMatch = (sentId) => {
    if (!showResult) return false;

    // نلاقي الصورة المرتبطة بهالجملة
    const entry = Object.entries(matches).find(
      ([imgId, sId]) => sId === sentId,
    );

    if (!entry) return false;

    const [imgId] = entry;

    return correct[imgId] !== sentId;
  };

  return (
    <div ref={containerRef} className="main-container-component relative">
      <div className="div-forall gap-2">
        <h5 className="header-title-page8 mb-10">
          <span style={{ marginRight: "20px" }}>B</span> Read and match.
        </h5>
        {/* SENTENCES (TOP) */}
        <div className="relative w-full h-[150px]">
          {sentences.map((sent, index) => {
            let style = {};

            if (index === 0) style = { left: "0%", top: "0%" }; // 1
            if (index === 1) style = { left: "25%", top: "60px" }; // 2 (نازل)
            if (index === 2) style = { right: "25%", top: "0%" }; // 3
            if (index === 3) style = { right: "0%", top: "60px" }; // 4

            return (
              <div
                key={sent.id}
                ref={(el) => (sentenceRefs.current[index] = el)}
                onClick={() => selectSentence(sent.id)}
                style={{
                  position: "absolute",
                  ...style,
                }}
                className={`relative
          bg-[#f4e9e2] px-6 py-3 rounded-full cursor-pointer font-medium text-center whitespace-nowrap transition-all duration-200
          ${selectedSentence === sent.id ? "bg-red-100 text-red-600 underline scale-110" : ""}
        `}
              >
                <span>{sent.id + 1}. </span>
                {sent.text}
                {isWrongMatch(sent.id) && (
                  <div
                    className="
      absolute -top-2 -right-2
      w-5 h-5
      bg-red-500 text-white
      rounded-full
      flex items-center justify-center
      text-xs font-bold
      border-2 border-white
      z-10
    "
                  >
                    ✕
                  </div>
                )}
                <div
                  className={`transition-all duration-200
          ${selectedSentence === sent.id ? "bg-red-600 scale-150" : ""}`}
                  style={{
                    height: "10px",
                    width: "10px",
                    backgroundColor: "red",
                    borderRadius: "50%",
                    position: "absolute",
                    top: "45px",
                    left: "47%",
                  }}
                />
              </div>
            );
          })}
        </div>
        {/* IMAGES (BOTTOM) */}
        <div className="grid grid-cols-4 gap-6 w-full justify-items-center mt-16">
          {images.map((img, index) => (
            <div
              key={img.id}
              ref={(el) => (imageRefs.current[index] = el)}
              className={`flex flex-col items-center rounded-lg cursor-pointer transition
         `}
              onClick={() => selectImage(img.id)}
            >
              <div
                className={` ${
                  selectedImg === img.id ? "bg-red-600 scale-150" : ""
                }
    transition-all duration-200`}
                style={{
                  height: "10px",
                  width: "10px",
                  backgroundColor: "red",
                  borderRadius: "50%",
                }}
              />
              <img
                src={img.img}
                alt=""
                className={`${
          selectedImg === img.id
            ? "scale-105 rounded-lg"
            : ""
        }
    transition-all duration-200`}
                style={{
                  height: "150px",
                  width: "auto",
                  // objectFit: "cover",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <svg className="lines-layer">
        {Object.entries(matches).map(([imgId, sentId], i) => {
          const imgEl = imageRefs.current[imgId];
          const sentEl = sentenceRefs.current[sentId];

          if (!imgEl || !sentEl || !containerRef.current) return null;

          const imgRect = imgEl.getBoundingClientRect();
          const sentRect = sentEl.getBoundingClientRect();
          const containerRect = containerRef.current.getBoundingClientRect();

          const x1 = sentRect.left + sentRect.width / 2 - containerRect.left;
          const y1 = sentRect.bottom - containerRect.top;

          const x2 = imgRect.left + imgRect.width / 2 - containerRect.left;
          const y2 = imgRect.top - containerRect.top;

          const curveOffset = 60;

          const pathData = `
  M ${x1} ${y1}
  C ${x1} ${y1 + curveOffset},
    ${x2} ${y2 - curveOffset},
    ${x2} ${y2}
`;
          return (
            <g key={i}>
              <path
                d={pathData}
                stroke="#e53935"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx={x2} cy={y2} r="4" fill="#9e9e9e" />
            </g>
          );
        })}
      </svg>

      <div className="action-buttons-container">
        <button className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>

        <button onClick={showAnswers} className="show-answer-btn">
          Show Answer
        </button>

        <button className="check-button2" onClick={checkAnswers}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Review9_Page1;

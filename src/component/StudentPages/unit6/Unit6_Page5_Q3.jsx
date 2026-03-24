import React, { useState, useRef } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit6_Page5_Q3.css";

import img1 from "../../../assets/imgs/test.png";
import img2 from "../../../assets/imgs/test.png";
import img3 from "../../../assets/imgs/test.png";
import img4 from "../../../assets/imgs/test.png";
import img5 from "../../../assets/imgs/test.png";

const Unit6_Page5_Q3 = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [matches, setMatches] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [locked, setLocked] = useState(false);

  const imageRefs = useRef([]);
  const sentenceRefs = useRef([]);
  const containerRef = useRef(null);

  const images = [
    { id: 0, img: img1 },
    { id: 1, img: img2 },
    { id: 2, img: img3 },
    { id: 3, img: img4 },
    { id: 4, img: img5 },
  ];

  const sentences = [
    { id: 0, text: "I wash my face." },
    { id: 1, text: "I eat my breakfast." },
    { id: 2, text: "I go to school." },
    { id: 3, text: "I comb my hair." },
    { id: 4, text: "I brush my teeth." },
  ];

  const correct = {
    0: 3,
    1: 4,
    2: 0,
    3: 1,
    4: 2,
  };

  const selectImage = (id) => {
    if (locked || showResult) return;
    setSelectedImg(id);
  };

  const selectSentence = (id) => {
    if (locked || showResult) return;
    if (selectedImg === null) return;

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

    const message = `
    <div style="font-size:20px;text-align:center;">
      <span style="color:#2e7d32;font-weight:bold;">
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
    setSelectedImg(null);
    setMatches({});
    setShowResult(false);
    setLocked(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center p-[30px]"
    >
      <div className="w-full max-w-[900px] flex flex-col gap-[30px]">
        <h5 className="header-title-page8">
          <span className="ex-A">B</span> Look, read, and match.
        </h5>

        {/* Images */}
        <div className="flex justify-between gap-5">
          {images.map((img) => (
            <div
              key={img.id}
              ref={(el) => (imageRefs.current[img.id] = el)}
              onClick={() => selectImage(img.id)}
              className={`border-2 border-red-500 rounded-[10px] p-[5px] cursor-pointer transition-all duration-200 ${
                selectedImg === img.id ? "bg-red-100" : ""
              }`}
            >
              <img src={img.img} alt="" style={{ height: "90px" }} />
            </div>
          ))}
        </div>

        {/* Sentences */}
        <div className="grid grid-cols-5 gap-5 mt-5 w-full justify-center">
          {sentences.map((sent, index) => {
            const colMap = [1, 3, 5, 2, 4];

            return (
              <div
                key={sent.id}
                ref={(el) => (sentenceRefs.current[sent.id] = el)}
                onClick={() => selectSentence(sent.id)}
                className="bg-[#f4e9e2] py-3 px-7 rounded-[20px] cursor-pointer font-medium text-center whitespace-nowrap w-fit"
                style={{ gridColumn: colMap[index] }}
              >
                {sent.text}
              </div>
            );
          })}
        </div>
      </div>

      {/* SVG LINES (برا div-forall) */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible">
        {Object.entries(matches).map(([imgId, sentId], i) => {
          const imgEl = imageRefs.current[imgId];
          const sentEl = sentenceRefs.current[sentId];

          if (!imgEl || !sentEl || !containerRef.current) return null;

          const imgRect = imgEl.getBoundingClientRect();
          const sentRect = sentEl.getBoundingClientRect();
          const containerRect = containerRef.current.getBoundingClientRect();

          const x1 = imgRect.left + imgRect.width / 2 - containerRect.left;
          const y1 = imgRect.bottom - containerRect.top;

          const x2 = sentRect.left + sentRect.width / 2 - containerRect.left;
          const y2 = sentRect.top - containerRect.top;

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

      {/* Buttons */}
      <div className="action-buttons-container mt-5">
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

export default Unit6_Page5_Q3;

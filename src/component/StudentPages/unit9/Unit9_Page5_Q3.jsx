import React, { useState, useRef } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit9_Page5_Q3.css";

import img1 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 80/Ex B 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 80/Ex B 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 80/Ex B 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 80/Ex B 4.svg";

const Unit9_Page5_Q3 = () => {
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
    { id: 0, text: "sending e-mail." },
    { id: 1, text: "looking for glasses." },
    { id: 2, text: "cooking." },
    { id: 3, text: "ironing clothes." },
  ];

  const correct = {
    0: 0,
    1: 2,
    2: 3,
    3: 1,
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

    // السلوك القديم (اختيار صورة)
    setSelectedImg(id);
  };

  const selectSentence = (id) => {
    if (locked || showResult) return;

    // إذا في صورة مختارة → اربط
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

    // غير هيك → بس ظلل الجملة
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
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
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
  const isWrongMatch = (imgId) => {
    if (!showResult) return false;

    const selectedSentence = matches[imgId];
    if (selectedSentence === undefined) return false;

    return correct[imgId] !== selectedSentence;
  };
  return (
    <div ref={containerRef} className="main-container-component relative">
      <div className="div-forall gap-10">
        <h5 className="header-title-page8">
          <span className="ex-A mr-5">B</span> Look, read, and match.
        </h5>
        {/* SENTENCES (TOP) */}
        <div className="grid grid-cols-4 gap-6 w-full justify-items-center">
          {sentences.map((sent, index) => (
            <div
              key={sent.id}
              ref={(el) => (sentenceRefs.current[index] = el)}
              className={`flex flex-col relative bg-[#f4e9e2] px-6 py-3 rounded-full cursor-pointer font-medium text-center whitespace-nowrap
  ${selectedSentence === sent.id ? "text-red-600 underline scale-110" : ""}
    transition-all duration-200`}
              onClick={() => selectSentence(sent.id)}
            >
              {sent.text}
              <div className={`${selectedSentence === sent.id ?  "bg-red-600 scale-150" : ""}
    transition-all duration-200`}
                style={{
                  height: "10px",
                  width: "10px",
                  position: "absolute",
                  top: "40px",
                  left: "47%",
                  backgroundColor: "red",
                  borderRadius: "50%",
                }}
              />
            </div>
          ))}
        </div>

        {/* IMAGES (BOTTOM) */}
        <div className="grid grid-cols-4 gap-6 w-full justify-items-center mt-16">
          {images.map((img, index) => (
            <div
              key={img.id}
              ref={(el) => (imageRefs.current[index] = el)}
              className={`rounded-lg cursor-pointer transition
    ${selectedImg === img.id ? "scale-110 " : ""}`}
              onClick={() => selectImage(img.id)}
              style={{ position: "relative" }} // 👈 مهم
            >
              <img
                src={img.img}
                alt=""
                style={{
                  height: "130px",
                }}
              />

              {isWrongMatch(img.id) && (
                <div
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    width: "22px",
                    height: "22px",
                    background: "red",
                    color: "white",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    fontWeight: "bold",
                    border: "2px solid white",
                    zIndex: 10,
                    lineHeight: 1,
                  }}
                >
                  ✕
                </div>
              )}
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

export default Unit9_Page5_Q3;

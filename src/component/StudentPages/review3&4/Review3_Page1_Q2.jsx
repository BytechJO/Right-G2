import React, { useState, useRef } from "react";
import img1 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 34/Asset 23.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 34/Asset 25.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 34/Asset 26.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 34/Asset 24.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review3_Page1_Q2.css";

const Review3_Page1_Q2 = () => {
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);
  const [wrongImages, setWrongImages] = useState([]);
  const [locked, setLocked] = useState(false);
  const [firstDot, setFirstDot] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const correctMatches = [
    { word: "Can she drive a car? \n No, she can’t.", image: "img3" },
    { word: "Can it climb? \n No, it can’t.", image: "img4" },
    { word: "Can she take a photo? \n Yes, she can.", image: "img2" },
    { word: "Can she swim? \n Yes, she can.", image: "img1" },
  ];

  const words = correctMatches.map((item, index) => ({
    id: `word-${index}`,
    text: item.word,
  }));

  const images = [
    { id: "img1", src: img1 },
    { id: "img2", src: img2 },
    { id: "img3", src: img3 },
    { id: "img4", src: img4 },
  ];

  // ============================
  // 1️⃣ الضغط على النقطة الأولى (start-dot)
  // ============================
  const handleStartDotClick = (e) => {
    if (showAnswer || locked) return;

    const rect = containerRef.current.getBoundingClientRect();
    const wordId = e.target.dataset.wordId;

    // تم إزالة التحقق الذي يمنع اختيار الجملة إذا كانت موصولة مسبقاً
    // للسماح بإعادة توصيلها بصورة أخرى
    setFirstDot({
      wordId,
      x: e.target.getBoundingClientRect().left - rect.left + 8,
      y: e.target.getBoundingClientRect().top - rect.top + 8,
    });
  };

  // ============================
  // 2️⃣ الضغط على النقطة الثانية (end-dot)
  // ============================
  const handleEndDotClick = (e) => {
    if (showAnswer || locked) return;
    if (!firstDot) return;

    const rect = containerRef.current.getBoundingClientRect();
    const endImage = e.target.dataset.image || null;

    const newLine = {
      x1: firstDot.x,
      y1: firstDot.y,
      x2: e.target.getBoundingClientRect().left - rect.left + 8,
      y2: e.target.getBoundingClientRect().top - rect.top + 8,
      wordId: firstDot.wordId,
      image: endImage,
    };

    setLines((prev) => {
      // 1. إزالة أي توصيل قديم لنفس الجملة (الجملة لا تتوصل إلا بصورة واحدة)
      // 2. إزالة أي توصيل قديم لنفس الصورة (الصورة لا تتوصل إلا بجملة واحدة)
      const filteredLines = prev.filter(
        (line) => line.wordId !== firstDot.wordId && line.image !== endImage,
      );
      return [...filteredLines, newLine];
    });

    setFirstDot(null);
  };

  // ============================
  // 3️⃣ Check Answers
  // ============================
  const checkAnswers2 = () => {
    if (showAnswer || locked) return;
    if (lines.length < correctMatches.length) {
      ValidationAlert.info(
        "Oops!",
        "Please connect all the pairs before checking.",
      );
      return;
    }

    let correctCount = 0;
    let wrong = [];

    lines.forEach((line) => {
      const isCorrect = correctMatches.some(
        (pair, index) =>
          `word-${index}` === line.wordId && pair.image === line.image,
      );

      if (isCorrect) {
        correctCount++;
      } else {
        wrong.push(line.wordId);
      }
    });

    setWrongImages(wrong);

    const total = correctMatches.length;
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";
    const scoreMessage = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
      Score: ${correctCount} / ${total}
      </span>
    </div>
  `;

    if (correctCount === total) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
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
       style={{gap:"45px"}}
      >
      
          <h5 className="header-title-page8">
            {" "}
            <span style={{ marginRight: "20px" }}> B </span>Read and match.
          </h5>

          <div className="CB-review3-p1-q2-wrapper" ref={containerRef}>
            {/* الجمل */}
            <div className="CB-review3-p1-q2-words-row">
              {words.map((wordObj, index) => (
                <div
                  key={wordObj.id}
                  className="CB-review3-p1-q2-word-box"
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexDirection: "row",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div style={{ position: "relative" }}>
                      <h5
                        className={`
    CB-review3-p1-q2-word
    ${locked || showAnswer ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    ${firstDot?.wordId === wordObj.id ? "text-red-600 underline scale-105" : ""}
    transition-all duration-200 gap-5
  `}   style={{width:"100%"}}
                        onClick={() =>
                          document.getElementById(`${wordObj.id}-dot`).click()
                        }
                      >
                        <span style={{ color: "darkblue", fontWeight: "700",marginRight:"5px"}}>
                          {index + 1}
                        </span>
                       <span>{wordObj.text}</span> 
                      </h5>

                      {wrongImages.includes(wordObj.id) && (
                        <span className="CB-review3-p1-q2-error-mark">✕</span>
                      )}
                    </div>

                    <div
                      className={`
    CB-review3-p1-q2-dot CB-review3-p1-q2-start-dot
    ${firstDot?.wordId === wordObj.id ? "bg-red-600 scale-150" : ""}
    transition-all duration-200
  `}
                      data-word-id={wordObj.id}
                      id={`${wordObj.id}-dot`}
                      onClick={handleStartDotClick}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* الصور */}
            <div className="CB-review3-p1-q2-images-row">
              {images.map((img) => (
                <div key={img.id} className="CB-review3-p1-q2-img-box">
                  <img
                    src={img.src}
                    alt=""
                    className={`
    CB-review3-p1-q2-image
    ${locked || showAnswer ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    ${firstDot ? "hover:border-2 hover:border-red-400 hover:scale-105" : ""}
    ${
      lines.some((l) => l.image === img.id)
        ? "active:border-4 active:border-red-600 active:scale-105 rounded-lg"
        : ""
    }
    transition-all duration-200
  `}
                    onClick={() =>
                      document.getElementById(`${img.id}-dot`).click()
                    }
                  />
                  <div
                    className={`
    CB-review3-p1-q2-dot CB-review3-p1-q2-end-dot
    ${firstDot ? "hover:bg-red-600 hover:scale-125" : ""}
    transition-all duration-200
  `}
                    data-image={img.id}
                    id={`${img.id}-dot`}
                    onClick={handleEndDotClick}
                  />
                </div>
              ))}
            </div>

            {/* الخطوط */}
            <svg className="lines-layer">
              {lines.map((l, i) => (
                <line
                  key={`${l.wordId}-${l.image}`}
                  x1={l.x1}
                  y1={l.y1}
                  x2={l.x2}
                  y2={l.y2}
                  stroke="red"
                  strokeWidth="3"
                />
              ))}
            </svg>
          </div>
        </div>
      <div className="action-buttons-container">
        <button
          onClick={() => {
            setLines([]);
            setWrongImages([]);
            setFirstDot(null);
            setShowAnswer(false);
            setLocked(false);
          }}
          className="try-again-button"
        >
          Start Again ↻
        </button>
        <button
          onClick={() => {
            const rect = containerRef.current.getBoundingClientRect();

            const getDotPosition = (selector) => {
              const el = document.querySelector(selector);
              if (!el) return { x: 0, y: 0 };
              const r = el.getBoundingClientRect();
              return {
                x: r.left - rect.left + 8,
                y: r.top - rect.top + 8,
              };
            };

            const finalLines = correctMatches.map((line, index) => ({
              x1: getDotPosition(`[data-word-id="word-${index}"]`).x,
              y1: getDotPosition(`[data-word-id="word-${index}"]`).y,
              x2: getDotPosition(`[data-image="${line.image}"]`).x,
              y2: getDotPosition(`[data-image="${line.image}"]`).y,
              wordId: `word-${index}`,
              image: line.image,
            }));

            setLines(finalLines);
            setWrongImages([]);
            setShowAnswer(true);
            setLocked(true);
          }}
          className="show-answer-btn swal-continue"
        >
          Show Answer
        </button>
        <button onClick={checkAnswers2} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Review3_Page1_Q2;

import React, { useState, useRef } from "react";
import img1 from "../../../assets/imgs/test.png";
import img2 from "../../../assets/imgs/test.png";
import img3 from "../../../assets/imgs/test.png";
import img4 from "../../../assets/imgs/test.png";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review3_Page1_Q2.css";

const Review3_Page1_Q2 = () => {
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);
  let startPoint = null;
  const [wrongImages, setWrongImages] = useState([]);
  // ⭐⭐ NEW: قفل الرسم بعد Check Answer
  const [locked, setLocked] = useState(false); //  ← إضافة جديدة
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
  text: item.word
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
    if (showAnswer || locked) return; // ⭐⭐ NEW: منع التوصيل إذا مغلق

    const rect = containerRef.current.getBoundingClientRect();

const wordId = e.target.dataset.wordId
    const image = e.target.dataset.image || null;

    // ⭐⭐ NEW: منع رسم أكثر من خط من نفس الصورة (image)
  const alreadyUsed = lines.some((line) => line.wordId === wordId);

    if (alreadyUsed) return; // ← إضافة جديدة

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
    if (showAnswer || locked) return; // ⭐⭐ NEW: منع التوصيل إذا مغلق
    if (!firstDot) return;

    const rect = containerRef.current.getBoundingClientRect();

    const endWord = e.target.dataset.word || null;
    const endImage = e.target.dataset.image || null;

    const newLine = {
      x1: firstDot.x,
      y1: firstDot.y,
      x2: e.target.getBoundingClientRect().left - rect.left + 8,
      y2: e.target.getBoundingClientRect().top - rect.top + 8,

   wordId: firstDot.wordId,
      image: endImage,
    };

    setLines((prev) => [...prev, newLine]);
    setFirstDot(null);
  };
  // ============================
  // 3️⃣ Check Answers
  // ============================
  const checkAnswers2 = () => {
    if (showAnswer || locked) return; // ⭐⭐ NEW: منع التوصيل بعد القفل
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
    `word-${index}` === line.wordId &&
    pair.image === line.image
);


      if (isCorrect) {
        correctCount++;
      } else {
        wrong.push(line.wordId); // ✅ خزّني اسم صورة الخطأ فقط
      }
    });

    setWrongImages(wrong); // ✅ حفظ الصور الغلط

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
    setLocked(true); // ⭐⭐ NEW: إغلاق الرسم بعد Check Answer
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
          gap: "30px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <div className="page7-q2-container2">
          <h5 className="header-title-page8">
            {" "}
            <span style={{ marginRight:"20px"}}> B </span>Read and match.
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
                  <span style={{ color: "darkblue", fontWeight: "700" }}>
                    {index + 1}
                  </span>

                  <div>
                    <div style={{ position: "relative" }}>
                      <h5
                        className={`CB-review3-p1-q2-word ${
                          locked || showAnswer
                            ? "CB-review3-p1-q2-disabled-hover"
                            : ""
                        }`}
                        onClick={() =>
                          document.getElementById(`${wordObj.id}-dot`).click()
                        }
                      >
                        {wordObj.text}
                      </h5>

                      {wrongImages.includes(wordObj.id) && (
                        <span className="CB-review3-p1-q2-error-mark">✕</span>
                      )}
                    </div>

                    <div
                      className="CB-review3-p1-q2-dot CB-review3-p1-q2-start-dot"
                      data-word-id={wordObj.id}
                      id={`${wordObj.id}-dot`}
                      onClick={handleStartDotClick}
                    ></div>
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
                    className={`CB-review3-p1-q2-image ${
                      locked || showAnswer
                        ? "CB-review3-p1-q2-disabled-hover"
                        : ""
                    }`}
                    onClick={() =>
                      document.getElementById(`${img.id}-dot`).click()
                    }
                  />

                  <div
                    className="CB-review3-p1-q2-dot CB-review3-p1-q2-end-dot"
                    data-image={img.id}
                    id={`${img.id}-dot`}
                    onClick={handleEndDotClick}
                  ></div>
                </div>
              ))}
            </div>

            {/* الخطوط */}
            <svg className="lines-layer">
              {lines.map((l, i) => (
                <line
                  key={i}
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
      </div>
      <div className="action-buttons-container">
        <button
          onClick={() => {
            setLines([]);
            setWrongImages([]);
            setFirstDot(null);
            setShowAnswer(false);
            setLocked(false); // ⭐⭐ NEW: السماح بالرسم مجدداً
          }}
          className="try-again-button"
        >
          Start Again ↻
        </button>
        {/* Show Answer */}
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
  image: line.image
}));


            setLines(finalLines);
            setWrongImages([]);
            setShowAnswer(true);
            setLocked(true); // ⭐⭐ NEW: منع الرسم أثناء Show Answer
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

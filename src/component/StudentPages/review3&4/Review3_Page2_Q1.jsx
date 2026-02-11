import React, { useState, useRef } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/test.png";
import img2 from "../../../assets/imgs/test.png";
import img3 from "../../../assets/imgs/test.png";
import img4 from "../../../assets/imgs/test.png";

import "./Review1_Page2_Q1.css";

const IMAGES = [
  { id: "img1", src: img1 },
  { id: "img2", src: img2 },
  { id: "img3", src: img3 },
  { id: "img4", src: img4 },
];

const WORDS = [
  { char: "l", color: "l" },
  { char: "r", color: "r" },
];

const ANSWERS = [
  { word: "l", images: ["img3", "img4"] },
  { word: "r", images: ["img1", "img2"] },
];

const Review1_Page2_Q1 = () => {
  const ref = useRef(null);
  const [lines, setLines] = useState([]);
  const [start, setStart] = useState(null);
  const [wrong, setWrong] = useState([]);
  const [locked, setLocked] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const getCenterPos = (el) => {
    if (!el || !ref.current) return { x: 0, y: 0 };

    const r = el.getBoundingClientRect();
    const c = ref.current.getBoundingClientRect();

    // مركز العنصر (بدون +8 ثابت)
    return {
      x: r.left - c.left + r.width / 2,
      y: r.top - c.top + r.height / 2,
    };
  };

  const startLine = (e) => {
    if (locked || showAnswer) return;

    const dot = e.currentTarget; // ✅ الدوت نفسه
    const image = dot.dataset.image;

    if (lines.some((l) => l.image === image)) return;

    setStart({ image, ...getCenterPos(dot) });
  };

  const endLine = (e) => {
    if (!start || locked || showAnswer) return;

    const dot = e.currentTarget; // ✅ الدوت نفسه
    const word = dot.dataset.word;
    const pos = getCenterPos(dot);

    setLines((prev) => [
      ...prev,
      {
        x1: start.x,
        y1: start.y,
        x2: pos.x,
        y2: pos.y,
        image: start.image,
        word,
      },
    ]);

    setStart(null);
  };

  const checkAnswers = () => {
    if (locked || showAnswer) return;
    const total = ANSWERS.reduce((a, b) => a + b.images.length, 0);
    if (lines.length < total)
      return ValidationAlert.info("Oops!", "Please connect all the pairs.");

    let correct = 0;
    let wrongImgs = [];

    lines.forEach((l) => {
      const ok = ANSWERS.some(
        (a) => a.word === l.word && a.images.includes(l.image),
      );
      ok ? correct++ : wrongImgs.push(l.image);
    });

    setWrong(wrongImgs);
    setLocked(true);

    const color =
      correct === total ? "green" : correct === 0 ? "red" : "orange";

    ValidationAlert[
      correct === total ? "success" : correct === 0 ? "error" : "warning"
    ](`<b style="color:${color}">Score: ${correct} / ${total}</b>`);
  };

 const show = () => {
  setLocked(true);
  setShowAnswer(true);
  setWrong([]);
  setLines([]); // ⬅️ امسح أي خطوط قديمة

  const answerLines = [];

  ANSWERS.forEach((a) => {
    a.images.forEach((imgId) => {
      const startDot = document.querySelector(
        `.CB-review1-p2-q1-dot-start[data-image="${imgId}"]`
      );
      const endDot = document.querySelector(
        `.CB-review1-p2-q1-dot-end[data-word="${a.word}"]`
      );

      if (startDot && endDot) {
        const s = getCenterPos(startDot);
        const e = getCenterPos(endDot);

        answerLines.push({
          x1: s.x,
          y1: s.y,
          x2: e.x,
          y2: e.y,
          image: imgId,
          word: a.word,
        });
      }
    });
  });

  setLines(answerLines);
};


  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      <div className="div-forall" style={{ width: "60%" }}>
        {/* ❌ لا تعديل */}
        <h5 className="header-title-page8">
        <span style={{ marginRight: "20px" }}>C</span> Look and match.
        </h5>

        {/* ❌ لا تعديل */}
        <div ref={ref} className="match-wrapper2-CB-review1-p2-q1">
          {/* IMAGES */}
          <div className="CB-review1-p2-q1-images">
            {IMAGES.map((img) => (
              <div key={img.id} className="CB-review1-p2-q1-img-box">
                <img
                  src={img.src}
                  alt=""
                  className={`CB-review1-p2-q1-img ${locked ? "disabled-hover" : ""}`}
                  onClick={() =>
                    document.querySelector(`[data-image="${img.id}"]`)?.click()
                  }
                />
                {wrong.includes(img.id) && (
                  <span className="CB-review1-p2-q1-error">✕</span>
                )}

                <div
                  className="CB-review1-p2-q1-dot CB-review1-p2-q1-dot-start"
                  data-image={img.id}
                  onClick={startLine}
                />
              </div>
            ))}
          </div>

          {/* WORDS */}
          <div className="CB-review1-p2-q1-words">
            {WORDS.map((w) => (
              <div key={w.char} className="CB-review1-p2-q1-word-box">
                <h5
                  className={`CB-review1-p2-q1-word ${w.color}`}
                  onClick={() =>
                    document.querySelector(`[data-word="${w.char}"]`)?.click()
                  }
                >
                  {w.char}
                </h5>

                <div
                  className="CB-review1-p2-q1-dot CB-review1-p2-q1-dot-end"
                  data-word={w.char}
                  onClick={endLine}
                />
              </div>
            ))}
          </div>

          {/* LINES */}
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
      {/* ❌ الأزرار كما هي */}
      <div className="action-buttons-container">
        <button
          onClick={() => {
            setLines([]);
            setWrong([]);
            setShowAnswer(false); // ← رجع التعديل
            setLocked(false); // ⭐⭐⭐ NEW: إعادة فتح الرسم
          }}
          className="try-again-button"
        >
          Start Again ↻
        </button>
        <button onClick={show} className="show-answer-btn">
          Show Answer
        </button>
        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Review1_Page2_Q1;

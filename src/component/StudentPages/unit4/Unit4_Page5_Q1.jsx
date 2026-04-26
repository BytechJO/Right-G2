import React, { useState, useRef } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

import "./Unit4_Page5_Q1.css";

const ITEMS = [
  { id: "p_ _ nt" },
  { id: "c_ k _" },
  { id: "pl _ _" },
  { id: "l _ k _" },
  { id: "M _ _" },
  { id: "r _ _ n" },
];

const WORDS = [
  { char: "a_e", color: "l" },
  { char: "ai", color: "r" },
  { char: "ay", color: "r" },
];

const ANSWERS = [
  { word: "a_e", images: ["c_ k _", "l _ k _"] },
  { word: "ai", images: ["p_ _ nt", "r _ _ n"] },
  { word: "ay", images: ["pl _ _", "M _ _"] },
];

const Unit4_Page5_Q1 = () => {
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

    return {
      x: r.left - c.left + r.width / 2,
      y: r.top - c.top + r.height / 2,
    };
  };

  const startLine = (e) => {
    if (locked || showAnswer) return;

    const dot = e.currentTarget;
    const image = dot.dataset.image;

    // تم إزالة التحقق الذي يمنع اختيار العنصر إذا كان موصولاً مسبقاً
    // للسماح بإعادة توصيله بحرف آخر
    setStart({ image, ...getCenterPos(dot) });
  };

  const endLine = (e) => {
    if (!start || locked || showAnswer) return;

    const dot = e.currentTarget;
    const word = dot.dataset.word;
    const pos = getCenterPos(dot);

    setLines((prev) => {
      // إزالة أي توصيل قديم لنفس العنصر (العنصر لا يتوصل إلا بحرف واحد)
      const filteredLines = prev.filter((l) => l.image !== start.image);

      return [
        ...filteredLines,
        {
          x1: start.x,
          y1: start.y,
          x2: pos.x,
          y2: pos.y,
          image: start.image,
          word,
        },
      ];
    });

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
    setLines([]);

    const answerLines = [];

    ANSWERS.forEach((a) => {
      a.images.forEach((imgId) => {
        const startDot = document.querySelector(
          `.CB-review1-p2-q1-dot-start[data-image="${imgId}"]`,
        );
        const endDot = document.querySelector(
          `.CB-review1-p2-q1-dot-end[data-word="${a.word}"]`,
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
        <h5 className="header-title-page8">
          <span className="ex-A">A</span>{" "}
          <span style={{ color: "#2e3192" }}>1</span>Match and write.{" "}
        </h5>

        <div ref={ref} className="match-wrapper2-CB-review1-p2-q1">
          {/* IMAGES (TEXT ITEMS) */}
          <div className="CB-unit4-p5-q1-images">
            {ITEMS.map((item, index) => (
              <div key={item.id} className="CB-review1-p2-q1-img-box">
                <span className="CB-unit4-p5-q1-index">{index + 1}</span>
                <div
                  className={`
    CB-review1-p2-q1-text-item
    ${locked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    ${start?.image === item.id ? "text-red-600 underline scale-110" : ""}
    transition-all duration-200
  `}
                  onClick={() =>
                    document.querySelector(`[data-image="${item.id}"]`)?.click()
                  }
                >
                  {item.id}
                </div>
                {wrong.includes(item.id) && (
                  <span className="CB-review1-p2-q1-error">✕</span>
                )}

                <div
                  className={`
    CB-review1-p2-q1-dot CB-review1-p2-q1-dot-start
    ${start?.image === item.id ? "bg-red-600 scale-150" : ""}
    transition-all duration-200
  `}
                  data-image={item.id}
                  onClick={startLine}
                />
              </div>
            ))}
          </div>

          {/* WORDS (CHARS) */}
          <div className="CB-review1-p2-q1-words">
            {WORDS.map((w) => (
              <div key={w.char} className="CB-review1-p2-q1-word-box">
                <h5
                  className={`
    CB-unit4-p5-q1-word ${w.color}
    ${locked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    ${start ? "hover:text-red-600 hover:underline hover:scale-110" : ""}
    transition-all duration-200
  `}
                  onClick={() =>
                    document.querySelector(`[data-word="${w.char}"]`)?.click()
                  }
                >
                  {w.char}
                </h5>
                <div
                  className={`
    CB-review1-p2-q1-dot CB-review1-p2-q1-dot-end
    ${start ? "hover:bg-red-600 hover:scale-125" : ""}
    transition-all duration-200
  `}
                  data-word={w.char}
                  onClick={endLine}
                />
              </div>
            ))}
          </div>

          {/* LINES */}
          <svg className="lines-layer">
            {lines.map((l, i) => (
              <path
                key={`${l.word}-${l.image}`}
                d={`
    M ${l.x1} ${l.y1}
    C ${(l.x1 + l.x2) / 2} ${l.y1},
      ${(l.x1 + l.x2) / 2} ${l.y2},
      ${l.x2} ${l.y2}
  `}
                stroke="red"
                strokeWidth="3"
                fill="none"
                  strokeDasharray="6,6"   // 🔥 هذا المهم
              />
            ))}
          </svg>
        </div>
      </div>
      {/* ACTION BUTTONS */}
      <div className="action-buttons-container">
        <button
          onClick={() => {
            setLines([]);
            setWrong([]);
            setShowAnswer(false);
            setLocked(false);
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

export default Unit4_Page5_Q1;

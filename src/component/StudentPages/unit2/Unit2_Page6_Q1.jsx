import React, { useState, useRef } from "react";
import img1 from "../../../assets/imgs/test.png";
import img2 from "../../../assets/imgs/test.png";
import img3 from "../../../assets/imgs/test.png";
import img4 from "../../../assets/imgs/test.png";
import img5 from "../../../assets/imgs/test.png";
import img6 from "../../../assets/imgs/test.png";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit2_Page6_Q1.css";

/* ================= DATA ================= */

const MATCHES = [
  { word: "yellow", image: "img4", src: img4 },
  { word: "red", image: "img3", src: img3 },
  { word: "green", image: "img1", src: img1 },
  { word: "brown", image: "img6", src: img6 },
  { word: "blue", image: "img2", src: img2 },
  { word: "pink", image: "img5", src: img5 },
];
const images = [
  { image: "img1", src: img1 },
  { image: "img2", src: img2 },
  { image: "img3", src: img3 },
  { image: "img4", src: img4 },
  { image: "img5", src: img5 },
  { image: "img6", src: img6 },
];
const Unit2_Page6_Q1 = () => {
  const containerRef = useRef(null);

  const [lines, setLines] = useState([]);
  const [start, setStart] = useState(null);
  const [wrong, setWrong] = useState([]);
  const [locked, setLocked] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const disabled = locked || showAnswer;

  /* ================= HELPERS ================= */

  const getPos = (el) => {
    if (!el || !containerRef.current) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    const c = containerRef.current.getBoundingClientRect();
    return { x: r.left - c.left + 8, y: r.top - c.top + 8 };
  };

  /* ================= HANDLERS ================= */

  const startLine = (e) => {
    if (disabled) return;

    const container = e.currentTarget.closest(".CB-unit2-p6-q1-dot-container");
    const dot = container?.querySelector(".dot-start1");
    if (!dot) return;

    const word = dot.dataset.word;
    if (lines.some((l) => l.word === word)) return;

    setStart({ word, ...getPos(dot) });
  };

  const endLine = (e) => {
    if (disabled || !start) return;

    const wrapper = e.currentTarget.closest(".u2-image-wrapper");
    const dot = wrapper?.querySelector(".dot-end1");
    if (!dot) return;

    const image = dot.dataset.image;
    const pos = getPos(dot);

    setLines((l) => [
      ...l,
      {
        word: start.word,
        image,
        x1: start.x,
        y1: start.y,
        x2: pos.x,
        y2: pos.y,
      },
    ]);

    setStart(null);
  };

  const checkAnswers = () => {
    if (lines.length < MATCHES.length)
      return ValidationAlert.info("Oops!", "Please connect all the pairs.");

    let correct = 0;
    const wrongWords = [];

    lines.forEach((l) =>
      MATCHES.some((m) => m.word === l.word && m.image === l.image)
        ? correct++
        : wrongWords.push(l.word),
    );

    setWrong(wrongWords);
    setLocked(true);

    const color =
      correct === MATCHES.length ? "green" : correct === 0 ? "red" : "orange";

    ValidationAlert[
      correct === MATCHES.length
        ? "success"
        : correct === 0
          ? "error"
          : "warning"
    ](
      `<div style="font-size:20px;text-align:center">
        <b style="color:${color}">Score: ${correct} / ${MATCHES.length}</b>
      </div>`,
    );
  };

  const show = () => {
    setLines(
      MATCHES.map((m) => {
        const w = document.querySelector(`[data-word="${m.word}"]`);
        const i = document.querySelector(`[data-image="${m.image}"]`);
        const s = getPos(w);
        const e = getPos(i);
        return { ...m, x1: s.x, y1: s.y, x2: e.x, y2: e.y };
      }),
    );
    setWrong([]);
    setShowAnswer(true);
    setLocked(true);
  };

  const reset = () => {
    setLines([]);
    setWrong([]);
    setStart(null);
    setLocked(false);
    setShowAnswer(false);
  };

  /* ================= RENDER ================= */

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      <div className="div-forall" style={{ width: "60%" }}>
        <div className="CB-unit2-p6-q1-container2">
          <h5 className="header-title-page8">
            <span className="ex-A">D</span> Read and match.
          </h5>

          <div className="CB-unit2-p6-q1-match-wrapper2" ref={containerRef}>
            {/* WORDS */}
            <div className="u2-match-words">
              {MATCHES.map((m, i) => (
                <div key={m.word} className="u2-word-item">
                  <span className="u2-word-index">{i + 1}</span>
                  <div
                    className="CB-unit2-p6-q1-dot-container"
                    onClick={startLine}
                  >
                    <h5 className={`u2-word ${disabled ? "is-disabled" : ""}`}>
                      {m.word}
                    </h5>

                    {wrong.includes(m.word) && (
                      <span className="CB-unit2-p6-q1-error-mark-img">✕</span>
                    )}

                    <div className="dot1 dot-start1" data-word={m.word} />
                  </div>
                </div>
              ))}
            </div>

            {/* IMAGES */}
            <div className="u2-match-images">
              {images.map((m) => (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div className="u2-image-wrapper" onClick={endLine}>
                    <div className="dot1 dot-end1" data-image={m.image} />
                    <div className="u2-image-item">
                      <img
                        src={m.src}
                        alt=""
                        className={`u2-image ${disabled ? "is-disabled" : ""}`}
                      />
                    </div>
                  </div>
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
      </div>
      {/* ACTION BUTTONS (كما هي) */}
      <div className="action-buttons-container">
        <button onClick={reset} className="try-again-button">
          Start Again ↻
        </button>
        <button onClick={show} className="show-answer-btn swal-continue">
          Show Answer
        </button>
        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit2_Page6_Q1;

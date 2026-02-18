import React, { useState } from "react";
import "./Unit5_Page5_Q3.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/test.png";
import img2 from "../../../assets/imgs/test.png";
import img3 from "../../../assets/imgs/test.png";
import img4 from "../../../assets/imgs/test.png";
import img5 from "../../../assets/imgs/test.png";
import img6 from "../../../assets/imgs/test.png";
import img7 from "../../../assets/imgs/test.png";
import img8 from "../../../assets/imgs/test.png";
const grid = [
  ["k", "m", "e", "a", "t", "o", "e", "c", "s"],
  ["r", "e", "r", "c", "i", "u", "k", "r", "t"],
  ["c", "h", "i", "c", "k", "e", "n", "i", "e"],
  ["i", "s", "e", "r", "r", "i", "c", "e", "w"],
  ["s", "c", "f", "i", "s", "h", "u", "t", "c"],
  ["f", "w", "c", "r", "o", "a", "m", "a", "i"],
  ["h", "a", "m", "b", "u", "r", "g", "e", "r"],
  ["e", "t", "k", "r", "p", "i", "c", "s", "c"],
  ["r", "s", "f", "r", "u", "i", "t", "s", "s"],
];

const words = [
  {
    text: "soup",
    src: img1,
    coords: [
      [4, 4],
      [5, 4],
      [6, 4],
      [7, 4],
    ],
  },
  {
    text: "chicken",
    src: img2,
    coords: [
      [2, 0],
      [2, 1],
      [2, 2],
      [2, 3],
      [2, 4],
      [2, 5],
      [2, 6],
    ],
  },
  {
    text: "fruit",
    src: img3,
    coords: [
      [8, 2],
      [8, 3],
      [8, 4],
      [8, 5],
      [8, 6],
    ], // لو بدك بحطلك الإحداثيات لاحقاً
  },
  {
    text: "hamburger",
    src: img4,
    coords: [
      [6, 0],
      [6, 1],
      [6, 2],
      [6, 3],   
      [6, 4],
      [6, 5],
      [6, 6],
      [6, 7],
      [6, 8],
    ], // لو بدك بحطلك الإحداثيات لاحقاً
  },
  {
    text: "stew",
    src: img5,
    coords: [
      [0, 8],
      [1, 8],
      [2, 8],
      [3, 8],
   
   
    ], // لو بدك بحطلك الإحداثيات لاحقاً
  },
  {
    text: "rice",
    src: img6,
    coords: [
      [3, 4],
      [3, 5],
      [3, 6],
      [3, 7],
    ], // لو بدك بحطلك الإحداثيات لاحقاً
  },
  {
    text: "fish",
    src: img7,
    coords: [
      [4, 2],
      [4, 3],
      [4, 4],
      [4, 5],
    ], // لو بدك بحطلك الإحداثيات لاحقاً
  },
    {
    text: "meat",
    src: img8,
    coords: [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
    ], // لو بدك بحطلك الإحداثيات لاحقاً
  },
];

export default function Unit5_Page5_Q3() {
  const [selected, setSelected] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [wrongTry, setWrongTry] = useState(false);
  const [allSelections, setAllSelections] = useState([]);
  const [wrongWords, setWrongWords] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [locked, setLocked] = useState(false);

 const handleCellClick = (r, c) => {
  // ⛔ منع التفاعل بعد التشيك أو الشو
  if (showAnswer) return;
  if (locked) return;

  // ⛔ منع الكبس على خلايا كلمات صحيحة
  if (isFoundCell(r, c)) return;

  setSelected((prev) => {
    const exists = prev.some(
      (coord) => coord[0] === r && coord[1] === c
    );

    // 🔁 toggle
    if (exists) {
      return prev.filter(
        (coord) => !(coord[0] === r && coord[1] === c)
      );
    }

    return [...prev, [r, c]];
  });
};


  const isHighlighted = (r, c) => {
    return (
      selected.some((coord) => coord[0] === r && coord[1] === c) ||
      allSelections.some((sel) =>
        sel.some((coord) => coord[0] === r && coord[1] === c)
      )
    );
  };

  const isFoundCell = (r, c) => {
    return words.some(
      (w) =>
        foundWords.includes(w.text) &&
        w.coords.some((coord) => coord[0] === r && coord[1] === c)
    );
  };

  const checkAnswers = () => {
    if (showAnswer ||locked) return;
    let foundList = [];
    if (selected.length === 0) {
      return ValidationAlert.info("");
    }
    words.forEach((word) => {
      const isCorrect =
        word.coords.length > 0 &&
        word.coords.every(([r, c]) =>
          selected.some((sel) => sel[0] === r && sel[1] === c)
        );

      if (isCorrect) foundList.push(word.text);
    });

    setFoundWords(foundList);
setLocked(true);

    // الكلمات الخاطئة = التي لم يجدها الطالب
    const wrong = words
      .map((w) => w.text)
      .filter((txt) => !foundList.includes(txt));

    setWrongWords(wrong);
    let total = words.length;
    let color =
      foundList.length === total
        ? "green"
        : foundList.length === 0
        ? "red"
        : "orange";

    const msg = `
      <div style="font-size:20px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${foundList.length} / ${total}
        </span>
      </div>
    `;
    // النتيجة
    if (foundList.length === total) {
      ValidationAlert.success(msg);
    } else if (foundList.length === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }
  };

  const showAnswers = () => {
    setShowAnswer(true);
    // 1) جميع الكلمات تعتبر صحيحة
    setFoundWords(words.map((w) => w.text));
  setLocked(true); // 🔒
    // 2) ضع كل الإحداثيات داخل allSelections لتسليط الضوء عليها
    const allCoords = words.map((w) => w.coords);
    setAllSelections(allCoords);

    // 3) إزالة أي اختيار يدوي
    setSelected([]);

    // 4) إزالة الأخطاء
    setWrongWords([]);
  };

  const reset = () => {
    setSelected([]);
    setFoundWords([]);
    setWrongTry(false);
    setWrongWords([]);
    setShowAnswer(false);
    setLocked(false)
    setAllSelections([]); // ⭐️ هذه كانت ناقصة
  };

  return (
    <div className="wordsearch-wrapper">
      <div className="page8-wrapper">
        <div className="div-forall" style={{ width: "60%" }}>
          <h3 className="header-title-page8">
            <span className="ex-A">B</span>Find and circle.
          </h3>
         <div className="container-CB-unit5-p5-q3">
  <div className={`grid-CB-unit5-p5-q3 ${wrongTry ? "shake" : ""}`}>
    {grid.map((row, rIdx) => (
      <div key={rIdx} className="row-CB-unit5-p5-q3">
        {row.map((cell, cIdx) => (
          <div
            key={cIdx}
            className={`cell-CB-unit5-p5-q3
              ${isHighlighted(rIdx, cIdx) ? "highlight" : ""} 
              ${isFoundCell(rIdx, cIdx) ? "found" : ""}
            `}
            onClick={() => handleCellClick(rIdx, cIdx)}
          >
            {cell}
          </div>
        ))}
      </div>
    ))}
  </div>

  <div className="word-btn-CB-unit5-p5-q3">
    {words.map((w, i) => (
      <div key={w.text} className="word-label-wrapper-CB-unit5-p5-q3">
        <div
          className={`word-label-CB-unit5-p5-q3 ${
            foundWords.includes(w.text) ? "done" : ""
          }`}
        >
          <p>
            <span
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "rgb(44, 82, 135)",
              }}
            >
              {i + 1}
            </span>{" "}
            {w.text}
          </p>

          <img
            src={w.src}
            style={{ height: "120px", width: "auto" }}
          />
        </div>

        {/* ✖ إكس داخل دائرة للكلمات الخاطئة */}
        {wrongWords.includes(w.text) && (
          <span className="wrong-x-circle-CB-unit5-p5-q3">✕</span>
        )}
      </div>
    ))}
  </div>
</div>

        </div>
      </div>
      <div className="action-buttons-container">
        <button className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>

        <button className="show-answer-btn swal-continue" onClick={showAnswers}>
          Show Answer
        </button>

        <button className="check-button2" onClick={checkAnswers}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
}

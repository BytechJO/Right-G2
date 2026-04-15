import React, { useState, useEffect } from "react";
import "./WB_Unit1_Page7_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";

const grid = [
  ["c", "u", "a", "i", "e", "b", "m"],
  ["o", "n", "u", "t", "n", "r", "o"],
  ["u", "c", "n", "a", "l", "o", "t"],
  ["s", "l", "t", "c", "u", "t", "h"],
  ["i", "e", "a", "o", "l", "h", "e"],
  ["n", "f", "a", "t", "h", "e", "r"],
  ["s", "i", "s", "t", "e", "r", "t"],
];

const words = [
  {
    text: "father",
    coords: [
      [5, 1],
      [5, 2],
      [5, 3],
      [5, 4],
      [5, 5],
      [5, 6],
    ],
  },
  {
    text: "mother",
    coords: [
      [0, 6],
      [1, 6],
      [2, 6],
      [3, 6],
      [4, 6],
      [5, 6],
    ],
  },
  {
    text: "brother",
    coords: [
      [0, 5],
      [1, 5],
      [2, 5],
      [3, 5],
      [4, 5],
      [5, 5],
      [6, 5],
    ],
  },
  {
    text: "sister",
    coords: [
      [6, 0],
      [6, 1],
      [6, 2],
      [6, 3],
      [6, 4],
      [6, 5],
    ],
  },
  {
    text: "aunt",
    coords: [
      [0, 2],
      [1, 2],
      [2, 2],
      [3, 2],
    ],
  },
  {
    text: "uncle",
    coords: [
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
      [4, 1],
    ],
  },
  {
    text: "cousin",
    coords: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
    
    ],
  },
];

export default function WB_Unit1_Page7_Q1() {
  const [selected, setSelected] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [wrongTry, setWrongTry] = useState(false);
  const [allSelections, setAllSelections] = useState([]);
  const [wrongWords, setWrongWords] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [locked, setLocked] = useState(false);

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);

  const isFoundCell = (r, c) => {
    return words.some(
      (w) =>
        foundWords.includes(w.text) &&
        w.coords.some((coord) => coord[0] === r && coord[1] === c),
    );
  };

  const handleMouseDown = (r, c) => {
    if (locked || isFoundCell(r, c)) return;
    setIsDragging(true);
    setDragStart({ r, c });
    setSelected([[r, c]]);
  };

  const handleMouseEnter = (r, c) => {
    if (!isDragging || locked || !dragStart) return;

    const startR = dragStart.r;
    const startC = dragStart.c;

    // Determine direction: horizontal, vertical, or diagonal
    const dr = r - startR;
    const dc = c - startC;

    let newSelected = [];

    if (dr === 0) {
      // Horizontal
      const step = dc > 0 ? 1 : -1;
      for (let i = 0; i <= Math.abs(dc); i++) {
        newSelected.push([startR, startC + i * step]);
      }
    } else if (dc === 0) {
      // Vertical
      const step = dr > 0 ? 1 : -1;
      for (let i = 0; i <= Math.abs(dr); i++) {
        newSelected.push([startR + i * step, startC]);
      }
    } else if (Math.abs(dr) === Math.abs(dc)) {
      // Diagonal
      const stepR = dr > 0 ? 1 : -1;
      const stepC = dc > 0 ? 1 : -1;
      for (let i = 0; i <= Math.abs(dr); i++) {
        newSelected.push([startR + i * stepR, startC + i * stepC]);
      }
    } else {
      // Not a straight line, just keep the start and current for now or ignore
      return;
    }

    setSelected(newSelected);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Check if the current selection matches any word
    const matchedWord = words.find((word) => {
      // Check forward
      const forwardMatch =
        word.coords.length === selected.length &&
        word.coords.every(
          (coord, idx) =>
            coord[0] === selected[idx][0] && coord[1] === selected[idx][1],
        );

      // Check backward
      const backwardMatch =
        word.coords.length === selected.length &&
        word.coords.every(
          (coord, idx) =>
            coord[0] === selected[selected.length - 1 - idx][0] &&
            coord[1] === selected[selected.length - 1 - idx][1],
        );

      return forwardMatch || backwardMatch;
    });

    if (matchedWord && !foundWords.includes(matchedWord.text)) {
      setFoundWords((prev) => [...prev, matchedWord.text]);
      setAllSelections((prev) => [...prev, matchedWord.coords]);
      setSelected([]);
    } else {
      // If no match, clear selection
      setSelected([]);
    }
    setDragStart(null);
  };

  // Global mouse up to handle release outside the grid
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [isDragging]);

  const isHighlighted = (r, c) => {
    return (
      selected.some((coord) => coord[0] === r && coord[1] === c) ||
      allSelections.some((sel) =>
        sel.some((coord) => coord[0] === r && coord[1] === c),
      )
    );
  };

  const checkAnswers = () => {
    if (showAnswer ||locked) return;
    
    // In this drag mode, words are added to foundWords as they are found.
    // We just need to check if all words are found.
    const total = words.length;
    const foundCount = foundWords.length;
    
    const wrong = words
      .map((w) => w.text)
      .filter((txt) => !foundWords.includes(txt));

    setWrongWords(wrong);
    setLocked(true);

    let color =
      foundCount === total
        ? "green"
        : foundCount === 0
          ? "red"
          : "orange";

    const msg = `
      <div style="font-size:20px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${foundCount} / ${total}
        </span>
      </div>
    `;

    if (foundCount === total) {
      ValidationAlert.success(msg);
    } else if (foundCount === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }
  };

  const showAnswers = () => {
    setShowAnswer(true);
    setFoundWords(words.map((w) => w.text));
    const allCoords = words.map((w) => w.coords);
    setAllSelections(allCoords);
    setSelected([]);
    setWrongWords([]);
    setLocked(true);
  };

  const reset = () => {
    setSelected([]);
    setFoundWords([]);
    setWrongTry(false);
    setWrongWords([]);
    setLocked(false);
    setShowAnswer(false);
    setAllSelections([]);
    setIsDragging(false);
    setDragStart(null);
  };

  return (
    <div className="wordsearch-wrapper">
      <div className="page8-wrapper">
        <div className="div-forall" style={{ width: "60%" }}>
          <h3 className="WB-header-title-page8">
            <span className="WB-ex-A">H</span>Find the words.
          </h3>
          <div className="container-word-grid-wb-u1-p7-q2">
            <div 
              className={`grid-wb-u1-p7-q2 ${wrongTry ? "shake" : ""}`}
              onMouseLeave={() => { /* Handled by global mouseup */ }}
            >
              {grid.map((row, rIdx) => (
                <div key={rIdx} className="row-wb-u1-p7-q2">
                  {row.map((cell, cIdx) => (
                    <div
                      key={cIdx}
                      className={`cell-wb-u1-p7-q2 
                        ${isHighlighted(rIdx, cIdx) ? "highlight" : ""} 
                        ${isFoundCell(rIdx, cIdx) ? "found" : ""}
                      `}
                      onMouseDown={() => handleMouseDown(rIdx, cIdx)}
                      onMouseEnter={() => handleMouseEnter(rIdx, cIdx)}
                      onMouseUp={handleMouseUp}
                      style={{ userSelect: 'none', cursor: 'pointer' }}
                    >
                      {cell}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="word-btn-wb-u1-p7-q2">
              {words.map((w) => (
                <div key={w.text} className="word-label-wrapper-wb-u1-p7-q2">
                  <div
                    className={`word-label-wb-u1-p7-q2 ${
                      foundWords.includes(w.text) ? "done" : ""
                    }`}
                  >
                    {w.text}
                  </div>
                  {wrongWords.includes(w.text) && (
                    <span className="wrong-x-circle-wb-u1-p7-q2">✕</span>
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
import React, { useState, useRef } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review6_Page2_Q3.css";

const Review6_Page2_Q3 = () => {
  const words = ["bike", "light", "five", "tight", "kite", "night"];

  const grid = [
    ["i", "t", "i", "b", "e", "t"],
    ["l", "f", "n", "k", "k", "i"],
    ["i", "i", "i", "k", "i", "g"],
    ["g", "b", "g", "v", "t", "h"],
    ["h", "t", "h", "h", "e", "t"],
    ["t", "e", "t", "t", "t", "h"],
  ];

  const gridRef = useRef(null);
  const [isChecked, setIsChecked] = useState(false);
  const [showedAnswer, setShowedAnswer] = useState(false);
  const [selectedCells, setSelectedCells] = useState([]);
  const [startCell, setStartCell] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const [foundWords, setFoundWords] = useState([]);
  const [foundSelections, setFoundSelections] = useState([]);
  const [locked, setLocked] = useState(false);

  const startSelection = (row, col) => {
    if (locked || isChecked || showedAnswer) return;

    setStartCell({ row, col });
    setSelectedCells([{ row, col }]);
    setIsSelecting(true);
  };

  const addCell = (row, col) => {
    if (!isSelecting || !startCell) return;

    const dr = row - startCell.row;
    const dc = col - startCell.col;

    const stepRow = Math.sign(dr);
    const stepCol = Math.sign(dc);

    if (!(dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc))) return;

    const length = Math.max(Math.abs(dr), Math.abs(dc));
    const cells = [];

    for (let i = 0; i <= length; i++) {
      cells.push({
        row: startCell.row + i * stepRow,
        col: startCell.col + i * stepCol,
      });
    }

    setSelectedCells(cells);
  };

  const getWordFromCells = (cells) => {
    let word = "";
    cells.forEach((cell) => {
      word += grid[cell.row][cell.col];
    });
    return word.toLowerCase();
  };

  const endSelection = () => {
    setIsSelecting(false);

    if (selectedCells.length === 0) return;

    const word = getWordFromCells(selectedCells);
    const reversed = word.split("").reverse().join("");

    if (words.includes(word) || words.includes(reversed)) {
      const correctWord = words.includes(word) ? word : reversed;
      const cellsToSave = words.includes(word)
        ? [...selectedCells]
        : [...selectedCells].reverse();

      if (!foundWords.includes(correctWord)) {
        setFoundWords((prev) => [...prev, correctWord]);
        setFoundSelections((prev) => [
          ...prev,
          {
            word: correctWord,
            cells: cellsToSave,
          },
        ]);
      }
    }

    setSelectedCells([]);
    setStartCell(null);
  };

  const resetAll = () => {
    setFoundWords([]);
    setFoundSelections([]);
    setSelectedCells([]);
    setStartCell(null);
    setIsSelecting(false);
    setLocked(false);
    setIsChecked(false);
    setShowedAnswer(false);
  };
  const showAnswers = () => {
    if (isChecked) return;

    const answers = [
      {
        word: "bike",
        cells: [
          { row: 3, col: 1 },
          { row: 2, col: 2 },
          { row: 1, col: 3 },
          { row: 0, col: 4 },
        ],
      },
      {
        word: "light",
        cells: [
          { row: 1, col: 0 },
          { row: 2, col: 0 },
          { row: 3, col: 0 },
          { row: 4, col: 0 },
          { row: 5, col: 0 },
        ],
      },
      {
        word: "five",
        cells: [
          { row: 1, col: 1 },
          { row: 2, col: 2 },
          { row: 3, col: 3 },
          { row: 4, col: 4 },
        ],
      },
      {
        word: "tight",
        cells: [
          { row: 0, col: 5 },
          { row: 1, col: 5 },
          { row: 2, col: 5 },
          { row: 3, col: 5 },
          { row: 4, col: 5 },
        ],
      },
      {
        word: "kite",
        cells: [
          { row: 1, col: 4 },
          { row: 2, col: 4 },
          { row: 3, col: 4 },
          { row: 4, col: 4 },
        ],
      },
      {
        word: "night",
        cells: [
          { row: 1, col: 2 },
          { row: 2, col: 2 },
          { row: 3, col: 2 },
          { row: 4, col: 2 },
          { row: 5, col: 2 },
        ],
      },
    ];

    setFoundWords(words);
    setFoundSelections(answers);
    setLocked(true);
    setShowedAnswer(true);
  };

  const checkAnswers = () => {
    if (showedAnswer) return;

    const score = foundWords.length;
    const total = words.length;

    const msg = `
    <div style="font-size:20px;text-align:center;">
      <span style="font-weight:bold">
        Score: ${score} / ${total}
      </span>
    </div>
  `;

    setIsChecked(true);
    setLocked(true);

    if (score === total) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };
  const renderLine = (cells, key, opacity = 0.6) => {
    if (!cells || cells.length < 2) return null;

    const start = cells[0];
    const end = cells[cells.length - 1];
    const cellSize = 60;

    const x1 = start.col * cellSize + cellSize / 2 + 20;
    const y1 = start.row * cellSize + cellSize / 2 + 20;

    const x2 = end.col * cellSize + cellSize / 2 + 20;
    const y2 = end.row * cellSize + cellSize / 2 + 20;

    return (
      <line
        key={key}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#c0392b"
        strokeWidth="30"
        strokeLinecap="round"
        opacity={opacity}
      />
    );
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
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <h5 className="header-title-page8">
          <span style={{ marginRight: "20px" }}>F</span> Find the words.
        </h5>

        <div className="flex items-start gap-16 mt-6">
          {/* GRID */}
          <div
            ref={gridRef}
            className="bg-[#d8c2b3] border-2 border-red-500 rounded-xl p-5 select-none relative"
            onMouseLeave={endSelection}
          >
            {grid.map((row, rowIndex) => (
              <div key={rowIndex} className="flex">
                {row.map((letter, colIndex) => (
                  <span
                    key={colIndex}
                    className="w-[60px] h-[60px] flex items-center justify-center text-[20px] font-semibold select-none cursor-pointer relative z-10"
                    onMouseDown={() => startSelection(rowIndex, colIndex)}
                    onMouseEnter={() => addCell(rowIndex, colIndex)}
                    onMouseUp={endSelection}
                  >
                    {letter}
                  </span>
                ))}
              </div>
            ))}

            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {foundSelections.map((item, index) =>
                renderLine(item.cells, `found-${index}`, 0.6),
              )}
              {renderLine(selectedCells, "current", 0.45)}
            </svg>
          </div>

          {/* WORD LIST */}
          <div
            className="grid grid-cols-2 gap-y-5 gap-x-[60px] p-10 px-[60px] border-[3px] border-[#e74c3c] bg-white text-[20px] font-medium mt-5"
            style={{
              borderRadius: "60% 40% 60% 40% / 50% 60% 40% 50%",
            }}
          >
            {words.map((word, index) => (
              <div
                key={index}
                className={`text-center ${
                  foundWords.includes(word)
                    ? "text-green-600 line-through font-bold"
                    : ""
                }`}
              >
                {word}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="action-buttons-container">
        <button onClick={resetAll} className="try-again-button">
          Start Again ↻
        </button>

        <button onClick={showAnswers} className="show-answer-btn">
          Show Answer
        </button>

        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Review6_Page2_Q3;

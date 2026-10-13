/* eslint-disable react-refresh/only-export-components */
import React, { useState, useRef, useEffect } from "react";
import { FaVolumeUp } from "react-icons/fa";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review6_Page2_Q3.css";

import wordAudio1 from "../../../assets/audio/ClassBook/U 6/Page 55 - F/Item_001_bike.mp3";
import wordAudio2 from "../../../assets/audio/ClassBook/U 6/Page 55 - F/Item_002_light.mp3";
import wordAudio3 from "../../../assets/audio/ClassBook/U 6/Page 55 - F/Item_003_five.mp3";
import wordAudio4 from "../../../assets/audio/ClassBook/U 6/Page 55 - F/Item_004_tight.mp3";
import wordAudio5 from "../../../assets/audio/ClassBook/U 6/Page 55 - F/Item_005_kite.mp3";
import wordAudio6 from "../../../assets/audio/ClassBook/U 6/Page 55 - F/Item_006_night.mp3";
import ExerciseHeader from "../../ExerciseHeader";

const words = ["bike", "light", "five", "tight", "kite", "night"];
const wordAudios = [
  wordAudio1,
  wordAudio2,
  wordAudio3,
  wordAudio4,
  wordAudio5,
  wordAudio6,
];

const grid = [
  ["i", "t", "i", "b", "e", "t"],
  ["l", "f", "n", "k", "k", "i"],
  ["i", "i", "i", "k", "i", "g"],
  ["g", "b", "g", "v", "t", "h"],
  ["h", "t", "h", "h", "e", "t"],
  ["t", "e", "t", "t", "t", "h"],
];

const ROWS = grid.length;
const COLS = grid[0].length;

const ARROWS = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
};

const isActivateKey = (e) => e.key === "Enter" || e.key === " ";

// خط مستقيم (أفقي/عمودي/قطري) بين خليتين، أو null إذا مش مستقيم
const getLine = (start, end) => {
  const dr = end.row - start.row;
  const dc = end.col - start.col;

  if (!(dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc))) return null;

  const stepRow = Math.sign(dr);
  const stepCol = Math.sign(dc);
  const length = Math.max(Math.abs(dr), Math.abs(dc));
  const cells = [];

  for (let i = 0; i <= length; i++) {
    cells.push({
      row: start.row + i * stepRow,
      col: start.col + i * stepCol,
    });
  }

  return cells;
};

const SpeakerBadge = () => (
  <span
    aria-hidden="true"
    style={{
      position: "absolute",
      top: -10,
      right: -10,
      width: 22,
      height: 22,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
      zIndex: 3,
      lineHeight: 1,
      background: "#fff",
      color: "#000",
      boxShadow: "0 1px 3px rgba(0,0,0,.25)",
    }}
  >
    <FaVolumeUp size={12} />
  </span>
);

const Review6_Page2_Q3 = () => {
  const gridRef = useRef(null);
  const cellRefs = useRef({});
  const audioRef = useRef(null);
  const pointerDownRef = useRef(false);

  const [isChecked, setIsChecked] = useState(false);
  const [showedAnswer, setShowedAnswer] = useState(false);
  const [selectedCells, setSelectedCells] = useState([]);
  const [startCell, setStartCell] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);

  // أول حرف تم اختياره (بالكليك/الكيبورد) وبينتظر الحرف الأخير
  const [anchor, setAnchor] = useState(null);
  // آخر خلية عليها المؤشر/الفوكس (لمعاينة المسار)
  const [activeCell, setActiveCell] = useState(null);
  // الخلية اللي فيها نقطة التاب
  const [focusedCell, setFocusedCell] = useState({ row: 0, col: 0 });

  const [foundWords, setFoundWords] = useState([]);
  const [foundSelections, setFoundSelections] = useState([]);
  const [locked, setLocked] = useState(false);

  const [playingId, setPlayingId] = useState(null);
  const [announcement, setAnnouncement] = useState("");

  /* ---------------- audio ---------------- */
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setPlayingId(null);
  };

  const playWord = (i) => {
    stopAudio();
    const audio = new Audio(wordAudios[i]);
    audioRef.current = audio;
    setPlayingId(i);
    audio.onended = () => setPlayingId(null);
    audio.play().catch(() => setPlayingId(null));
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  /* ---------------- selection logic ---------------- */
  const getWordFromCells = (cells) => {
    let word = "";
    cells.forEach((cell) => {
      word += grid[cell.row][cell.col];
    });
    return word.toLowerCase();
  };

  // بيقيّم المسار (للأمام أو للخلف) وبيعلن النتيجة
  const evaluateSelection = (cells) => {
    if (!cells || cells.length < 2) return;

    const word = getWordFromCells(cells);
    const reversed = word.split("").reverse().join("");

    if (words.includes(word) || words.includes(reversed)) {
      const correctWord = words.includes(word) ? word : reversed;
      const cellsToSave = words.includes(word) ? [...cells] : [...cells].reverse();

      if (foundWords.includes(correctWord)) {
        setAnnouncement(`${correctWord} was already found.`);
        return;
      }

      setFoundWords((prev) => [...prev, correctWord]);
      setFoundSelections((prev) => [
        ...prev,
        { word: correctWord, cells: cellsToSave },
      ]);

      setAnnouncement(
        `Found ${correctWord}. ${foundWords.length + 1} of ${words.length} words found.`,
      );
    } else {
      setAnnouncement(`${word} is not in the word list.`);
    }
  };

  const clearSelectionState = () => {
    setSelectedCells([]);
    setStartCell(null);
    setIsSelecting(false);
  };

  // اختيار أول وآخر حرف (كليك/تاتش/كيبورد)
  const activateCell = (row, col) => {
    if (locked || isChecked || showedAnswer) return;

    if (!anchor) {
      setAnchor({ row, col });
      setAnnouncement(
        `First letter ${grid[row][col]} chosen at row ${row + 1}, column ${col + 1}. Move to the last letter and press Enter or Space.`,
      );
      return;
    }

    if (anchor.row === row && anchor.col === col) {
      setAnchor(null);
      setAnnouncement("Choice cancelled.");
      return;
    }

    const line = getLine(anchor, { row, col });

    if (!line) {
      setAnnouncement(
        "The letters must be in a straight line: across, down, or diagonal.",
      );
      return;
    }

    evaluateSelection(line);
    setAnchor(null);
  };

  /* ---------------- dragging (pointer: mouse + touch) ---------------- */
  const startSelection = (row, col) => {
    if (locked || isChecked || showedAnswer) return;

    setStartCell({ row, col });
    setSelectedCells([{ row, col }]);
    setIsSelecting(true);
  };

  const addCell = (row, col) => {
    if (!isSelecting || !startCell) return;

    const cells = getLine(startCell, { row, col });

    if (!cells) return;

    setSelectedCells(cells);
  };

  const endSelection = (fromLeave = false) => {
    if (!isSelecting) return;

    // سحب (أكثر من خلية): بيتقيّم مباشرة
    if (selectedCells.length > 1) {
      evaluateSelection(selectedCells);
      setAnchor(null);
      clearSelectionState();
      return;
    }

    // خلية وحدة = كليك/تاتش: اختيار أول أو آخر حرف
    const cell = selectedCells[0];
    clearSelectionState();

    if (!fromLeave && cell) activateCell(cell.row, cell.col);
  };

  /* ---------------- keyboard ---------------- */
  const onCellKeyDown = (e, row, col) => {
    if (e.key === "Tab") return;

    if (isActivateKey(e)) {
      e.preventDefault();
      e.stopPropagation();
      if (!e.repeat) activateCell(row, col);
      return;
    }

    if (ARROWS[e.key]) {
      e.preventDefault();
      e.stopPropagation();

      const [dr, dc] = ARROWS[e.key];
      const nr = Math.min(ROWS - 1, Math.max(0, row + dr));
      const nc = Math.min(COLS - 1, Math.max(0, col + dc));

      cellRefs.current[`${nr}-${nc}`]?.focus();
      return;
    }

    if (e.key === "Escape" && anchor) {
      e.preventDefault();
      e.stopPropagation();
      setAnchor(null);
      setAnnouncement("Choice cancelled.");
    }
  };

  /* ---------------- show / reset / check ---------------- */
  const resetAll = () => {
    stopAudio();
    setFoundWords([]);
    setFoundSelections([]);
    setSelectedCells([]);
    setStartCell(null);
    setIsSelecting(false);
    setAnchor(null);
    setActiveCell(null);
    setLocked(false);
    setIsChecked(false);
    setShowedAnswer(false);
    setAnnouncement("Activity reset. All paths and found words are cleared.");
  };

  const showAnswers = () => {
    if (isChecked) return;

    stopAudio();
    clearSelectionState();
    setAnchor(null);

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
    setAnnouncement("All words shown.");
  };

  const checkAnswers = () => {
    if (showedAnswer) return;

    // ⭐ تحقق إذا ما لقى كل الكلمات
    if (foundWords.length !== words.length) {
      ValidationAlert.info("Oops!", "Please find all words first.");
      setAnnouncement("Please find all words first.");
      return;
    }

    const score = foundWords.length;
    const total = words.length;
    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
    <div style="font-size:20px;text-align:center;">
      <span style="color:${color};font-weight:bold">
        Score: ${score} / ${total}
      </span>
    </div>
  `;

    setIsChecked(true);
    setLocked(true);
    setAnchor(null);
    setAnnouncement(`Score ${score} out of ${total}.`);

    if (score === total) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  /* ---------------- rendering ---------------- */
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

  // المسار الحالي: السحب، أو المعاينة بين أول حرف والخلية الحالية
  const previewCells = isSelecting
    ? selectedCells
    : anchor && activeCell
      ? getLine(anchor, activeCell) || [anchor]
      : anchor
        ? [anchor]
        : [];

  const inPreview = (r, c) =>
    previewCells.some((cell) => cell.row === r && cell.col === c);

  return (
    <div className="main-container-component">
      {/* Screen Reader */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>

      <div className="div-forall">
       <ExerciseHeader
          sectionLetter="F"
          title="Find the words."
          subTitle="Scan one row at a time, then select each target word from its first letter to its last."
          isReview={true}
        />

        <p id="r6p2q3-help" className="sr-only">
          Use the arrow keys to move between the letters. Press Enter or Space
          on the first letter of a word, move to its last letter, then press
          Enter or Space again. Words can go across, down, or diagonally, forward
          or backward. You can also drag over the letters. Press Escape to
          cancel.
        </p>

        <div className="flex items-start gap-16 mt-6">
          {/* GRID */}
          <div
            ref={gridRef}
            role="grid"
            aria-label="Word search grid"
            aria-describedby="r6p2q3-help"
            className="bg-[#f9e5dd] border-2 border-red-500 rounded-xl p-5 select-none relative"
            style={{ touchAction: "none" }}
            onPointerLeave={() => endSelection(true)}
          >
            {grid.map((row, rowIndex) => (
              <div key={rowIndex} role="row" className="flex">
                {row.map((letter, colIndex) => {
                  const isAnchor =
                    anchor?.row === rowIndex && anchor?.col === colIndex;
                  const highlighted = inPreview(rowIndex, colIndex);

                  return (
                    <span
                      key={colIndex}
                      ref={(el) => {
                        cellRefs.current[`${rowIndex}-${colIndex}`] = el;
                      }}
                      role="gridcell"
                      tabIndex={
                        focusedCell.row === rowIndex &&
                        focusedCell.col === colIndex
                          ? 0
                          : -1
                      }
                      aria-selected={highlighted}
                      aria-label={`Letter ${letter}, row ${rowIndex + 1}, column ${colIndex + 1}${
                        isAnchor ? ", first letter chosen" : ""
                      }`}
                      data-row={rowIndex}
                      data-col={colIndex}
                      className={`w-[60px] h-[60px] flex items-center justify-center text-[24px] font-semibold select-none cursor-pointer relative z-10 rounded-lg outline-none focus-visible:ring-4 focus-visible:ring-blue-400 ${
                        isAnchor
                          ? "bg-blue-200 ring-2 ring-blue-500"
                          : highlighted
                            ? "bg-blue-100"
                            : ""
                      }`}
                      onPointerDown={(e) => {
                        // عشان التاتش يكمّل لباقي الخلايا أثناء السحب
                        try {
                          e.currentTarget.releasePointerCapture(e.pointerId);
                        } catch {
                          /* ignore */
                        }
                        startSelection(rowIndex, colIndex);
                      }}
                      onPointerEnter={() => {
                        setActiveCell({ row: rowIndex, col: colIndex });
                        addCell(rowIndex, colIndex);
                      }}
                      onPointerUp={() => endSelection(false)}
                      onFocus={() => {
                        setFocusedCell({ row: rowIndex, col: colIndex });
                        setActiveCell({ row: rowIndex, col: colIndex });
                      }}
                      onKeyDown={(e) => onCellKeyDown(e, rowIndex, colIndex)}
                      onKeyUp={(e) => {
                        if (isActivateKey(e)) {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                    >
                      {letter}
                    </span>
                  );
                })}
              </div>
            ))}

            <svg
              aria-hidden="true"
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
            >
              {foundSelections.map((item, index) =>
                renderLine(item.cells, `found-${index}`, 0.6),
              )}
              {renderLine(previewCells, "current", 0.45)}
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
                className={`flex justify-center ${
                  foundWords.includes(word)
                    ? "text-green-600 line-through font-bold"
                    : ""
                }`}
              >
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`${word}.${
                    foundWords.includes(word) ? " Found." : ""
                  } Press Enter to hear the word.`}
                  onPointerDown={() => {
                    pointerDownRef.current = true;
                  }}
                  onClick={() => {
                    pointerDownRef.current = false;
                    playWord(index);
                  }}
                  onFocus={() => {
                    if (!pointerDownRef.current) playWord(index);
                  }}
                  onBlur={() => {
                    pointerDownRef.current = false;
                  }}
                  onKeyDown={(e) => {
                    if (isActivateKey(e)) {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!e.repeat) playWord(index);
                    }
                  }}
                  onKeyUp={(e) => {
                    if (isActivateKey(e)) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                  className="relative cursor-pointer px-2 rounded outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
                >
                  {word}
                  {playingId === index && <SpeakerBadge />}
                </span>
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
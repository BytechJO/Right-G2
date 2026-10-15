import React, { useState, useEffect, useRef } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit9_Page5_Q4.css";
import img1 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 80/Ex C 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 80/Ex C 2.svg";
import Button from "../../WorkBookPages/Button";
import ExerciseHeader from "../../ExerciseHeader";

const grid = [
  [
    "i",
    "t",
    "c",
    "e",
    "d",
    "r",
    "m",
    "d",
    "v",
    "e",
    "w",
    "e",
    "k",
    "i",
    "l",
    "x",
    "s",
    "z",
    "e",
    "z",
    "s",
    "e",
    "n",
    "d",
    "z",
  ],

  [
    "q",
    "t",
    "b",
    "n",
    "r",
    "r",
    "t",
    "h",
    "e",
    "t",
    "j",
    "l",
    "e",
    "m",
    "a",
    "i",
    "l",
    "s",
    "e",
    "o",
    "d",
    "h",
    "y",
    "d",
    "e",
  ],
  [
    "u",
    "s",
    "i",
    "n",
    "g",
    "n",
    "a",
    "p",
    "l",
    "t",
    "c",
    "o",
    "m",
    "p",
    "u",
    "t",
    "e",
    "r",
    "t",
    "x",
  ],
];
const words = [
  {
    id: "we",
    text: "we",
    coords: [
      [0, 10],
      [0, 11],
    ],
  },
  {
    id: "send",
    text: "send",
    coords: [
      [0, 20],
      [0, 21],
      [0, 22],
      [0, 23],
    ],
  },
  {
    id: "emails",
    text: "emails",
    coords: [
      [1, 12],
      [1, 13],
      [1, 14],
      [1, 15],
      [1, 16],
      [1, 17],
    ],
  },
  {
    id: "using",
    text: "using",
    coords: [
      [2, 0],
      [2, 1],
      [2, 2],
      [2, 3],
      [2, 4],
    ],
  },
  { id: "a", text: "a", coords: [[2, 6]] },
  {
    id: "computer",
    text: "computer",
    coords: [
      [2, 10],
      [2, 11],
      [2, 12],
      [2, 13],
      [2, 14],
      [2, 15],
      [2, 16],
      [2, 17],
    ],
  },
];
const sentence = { text: words.map((word) => word.text).join(" ") };
const SLOT_LENGTH = 8;
const sameCoord = (a, b) => a[0] === b[0] && a[1] === b[1];

const sameCoords = (a, b) =>
  a.length === b.length && a.every((coord, i) => sameCoord(coord, b[i]));

const reverseCoords = (coords) => [...coords].reverse();

const getPath = (start, end) => {
  const [r1, c1] = start;
  const [r2, c2] = end;

  const rowDiff = r2 - r1;
  const colDiff = c2 - c1;

  const isStraight =
    rowDiff === 0 || colDiff === 0 || Math.abs(rowDiff) === Math.abs(colDiff);

  if (!isStraight) return [];

  const rowStep = Math.sign(rowDiff);
  const colStep = Math.sign(colDiff);
  const length = Math.max(Math.abs(rowDiff), Math.abs(colDiff)) + 1;

  const path = Array.from({ length }, (_, i) => [
    r1 + rowStep * i,
    c1 + colStep * i,
  ]);
  return path.every(([r, c]) => grid[r] && grid[r][c] !== undefined)
    ? path
    : [];
};

const lettersOf = (cells) => cells.map(([r, c]) => grid[r][c]);
const getCellFromPoint = (clientX, clientY) => {
  const element = document.elementFromPoint(clientX, clientY);

  const cell = element?.closest?.("[data-wordsearch-cell='true']");

  if (!cell || !cell.closest("[data-wordsearch-grid='u9p5q4']")) return null;

  const r = Number(cell.dataset.row);
  const c = Number(cell.dataset.col);

  return Number.isNaN(r) || Number.isNaN(c) ? null : [r, c];
};
const Unit9_Page5_Q4 = () => {
  const completedCheckRef = useRef(null);
  const completeCheck = (event) => {
    const button = event?.currentTarget;
    if (!completedCheckRef.current || (button?.style && completedCheckRef.current.button !== button)) {
      completedCheckRef.current = { button, cursor: button?.style?.cursor, aria: button?.getAttribute?.("aria-disabled") };
    }
    if (button?.style) {
      button.style.cursor = "not-allowed";
      button.setAttribute("aria-disabled", "true");
    }
  };
  const resetCompletedCheck = () => {
    const previous = completedCheckRef.current;
    if (previous?.button?.style) {
      previous.button.style.cursor = previous.cursor || "";
      if (previous.aria == null) previous.button.removeAttribute("aria-disabled");
      else previous.button.setAttribute("aria-disabled", previous.aria);
    }
    completedCheckRef.current = null;
  };

  const [startCell, setStartCell] = useState(null);
  const [previewCells, setPreviewCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]); // ids
  const [showAnswer, setShowAnswer] = useState(false);
  const [checkCompleted, setCheckCompleted] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [activeCell, setActiveCell] = useState([0, 0]);
  const focusFrame = useRef(null);
  const pointerRef = useRef({
    active: false,
    start: null,
    current: null,
    pointerId: null,
  });
  const cellRefs = useRef({});

  const locked = showAnswer || checkCompleted;
  useEffect(
    () => () => {
      if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
    },
    [],
  );
  const isFoundCell = (r, c) =>
    words.some(
      (word) =>
        foundWords.includes(word.id) &&
        word.coords.some(([wr, wc]) => wr === r && wc === c),
    );

  const isPreviewCell = (r, c) =>
    previewCells.some(([pr, pc]) => pr === r && pc === c);

  const clearSelection = () => {
    setStartCell(null);
    setPreviewCells([]);
  };

  const resetPointer = () => {
    pointerRef.current = { active: false, start: null, current: null };
  };
  const updatePreview = (path, fallback) => {
    const next = path.length > 0 ? path : [fallback];

    setPreviewCells((prev) => (sameCoords(prev, next) ? prev : next));
  };
  const startSelection = (r, c) => {
    if (locked || isFoundCell(r, c)) return;

    setStartCell([r, c]);
    setPreviewCells([[r, c]]);

    setAnnouncement(
      `Selection started at letter ${grid[r][c]}. Use the arrow keys to move to the last letter, then press Enter.`,
    );
  };
  const completeSelection = (
    endR,
    endC,
    start = startCell,
    viaKeyboard = false,
  ) => {
    if (locked) return;

    if (!start) {
      startSelection(endR, endC);
      return;
    }

    if (
      sameCoord(start, [endR, endC]) &&
      !words.some(
        (word) =>
          word.coords.length === 1 &&
          sameCoord(word.coords[0], start) &&
          !foundWords.includes(word.id),
      )
    ) {
      clearSelection();
      setAnnouncement("Selection cancelled.");
      return;
    }

    const path = getPath(start, [endR, endC]);

    if (path.length === 0) {
      setAnnouncement("That is not a straight line. Move to another letter.");

      if (!viaKeyboard) clearSelection();
      return;
    }

    const matchedWord = words.find(
      (word) =>
        !foundWords.includes(word.id) &&
        (sameCoords(path, word.coords) ||
          sameCoords(path, reverseCoords(word.coords))),
    );

    if (matchedWord) {
      setFoundWords((prev) => [...prev, matchedWord.id]);

      const sentenceCompleted = foundWords.length + 1 === words.length;

      setAnnouncement(
        sentenceCompleted
          ? `${matchedWord.text} found. The sentence is complete: ${sentence.text}.`
          : `${matchedWord.text} found.`,
      );
    } else {
      setAnnouncement(
        `${lettersOf(path).join(" ")} is not one of the target words.`,
      );
    }

    clearSelection();
  };
  const handleCellClick = (r, c, viaKeyboard = false) => {
    if (locked) return;

    if (!startCell) {
      startSelection(r, c);
    } else {
      completeSelection(r, c, startCell, viaKeyboard);
    }
  };
  const canUndo = !locked && (Boolean(startCell) || foundWords.length > 0);

  const handleUndo = () => {
    if (!canUndo) return;

    if (startCell) {
      resetPointer();
      clearSelection();
      setAnnouncement("Selection cancelled.");
      return;
    }

    const lastId = foundWords[foundWords.length - 1];
    const lastWord = words.find((w) => w.id === lastId)?.text;
    setFoundWords((prev) => prev.slice(0, -1));

    setAnnouncement(`${lastWord} removed.`);
  };
  const handleCellKeyDown = (e, r, c) => {
    if (locked) {
      if (
        [
          "ArrowRight",
          "ArrowLeft",
          "ArrowDown",
          "ArrowUp",
          "Enter",
          " ",
          "Backspace",
          "Escape",
        ].includes(e.key)
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
      return;
    }
    if (
      [
        "ArrowRight",
        "ArrowLeft",
        "ArrowDown",
        "ArrowUp",
        "Enter",
        " ",
        "Backspace",
        "Escape",
      ].includes(e.key)
    )
      e.stopPropagation();
    if (e.repeat && ["Enter", " ", "Backspace"].includes(e.key)) {
      e.preventDefault();
      return;
    }

    let nextR = r;
    let nextC = c;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      nextC = c === grid[r].length - 1 ? 0 : c + 1;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      nextC = c === 0 ? grid[r].length - 1 : c - 1;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      nextR = r === grid.length - 1 ? 0 : r + 1;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      nextR = r === 0 ? grid.length - 1 : r - 1;
    }

    nextC = Math.min(nextC, grid[nextR].length - 1);

    if (nextR !== r || nextC !== c) {
      setActiveCell([nextR, nextC]);

      if (startCell) {
        const path = getPath(startCell, [nextR, nextC]);

        setPreviewCells(path.length > 0 ? path : [startCell]);

        setAnnouncement(
          path.length > 0
            ? `${lettersOf(path).join(" ")}. Press Enter to finish the word.`
            : `Letter ${grid[nextR][nextC]}. Not in a straight line from the first letter.`,
        );
      } else {
        setAnnouncement(`Letter ${grid[nextR][nextC]}.`);
      }

      cancelAnimationFrame(focusFrame.current);
      focusFrame.current = requestAnimationFrame(() => {
        cellRefs.current[`${nextR}-${nextC}`]?.focus();
      });

      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      handleCellClick(r, c, true);
      return;
    }

    if (e.key === "Backspace") {
      e.preventDefault();
      handleUndo();
      return;
    }

    if (e.key === "Escape" && startCell) {
      e.preventDefault();
      clearSelection();
      setAnnouncement("Selection cancelled.");
    }
  };
  const handleGridPointerDown = (e) => {
    if (locked) return;

    if (e.pointerType === "mouse" && e.button !== 0) return;

    if (pointerRef.current.active) return;

    const cell = getCellFromPoint(e.clientX, e.clientY);

    if (!cell) return;

    if (isFoundCell(cell[0], cell[1])) return;

    e.preventDefault();

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Pointer capture may be unavailable; endpoint selection still works.
    }

    pointerRef.current = {
      active: true,
      start: cell,
      current: cell,
      pointerId: e.pointerId,
    };

    setActiveCell(cell);

    if (!startCell) {
      setPreviewCells([cell]);
    }
  };

  const handleGridPointerMove = (e) => {
    if (locked) return;

    const pointer = pointerRef.current;
    if (pointer.active && pointer.pointerId !== e.pointerId) return;
    const cell = getCellFromPoint(e.clientX, e.clientY);
    if (!cell) return;

    if (pointer.active) {
      pointer.current = cell;

      updatePreview(getPath(pointer.start, cell), pointer.start);

      return;
    }

    if (startCell && e.pointerType === "mouse") {
      updatePreview(getPath(startCell, cell), startCell);
    }
  };

  const handleGridPointerUp = (e) => {
    const pointer = pointerRef.current;

    if (!pointer.active || pointer.pointerId !== e.pointerId) return;

    e.preventDefault();

    const start = pointer.start;

    const end =
      getCellFromPoint(e.clientX, e.clientY) || pointer.current || start;

    resetPointer();

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Pointer capture may be unavailable; endpoint selection still works.
    }

    if (!sameCoord(start, end)) {
      completeSelection(end[0], end[1], start);

      return;
    }

    if (startCell) {
      completeSelection(start[0], start[1], startCell);

      return;
    }

    startSelection(start[0], start[1]);
  };

  const handleGridPointerCancel = () => {
    resetPointer();
    clearSelection();
  };
  const checkAnswers = (checkEvent) => {
    if (completedCheckRef.current) { completeCheck(checkEvent); return; }

    if (locked) return;

    cancelAnimationFrame(focusFrame.current);
    if (foundWords.length === 0) {
      ValidationAlert.info(
        "Oops!",
        "Please find at least one word before checking.",
      );
      setAnnouncement("Please find at least one word before checking.");
      return;
    }

    clearSelection();
    resetPointer();

    const total = words.length;
    const correct = foundWords.length;

    const color =
      correct === total ? "green" : correct === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correct} / ${total}
        </span>
      </div>
    `;

    if (correct === total) {
      setCheckCompleted(true);
      setAnnouncement(
        `Score ${correct} out of ${total}. All words are correct.`,
      );
      (completeCheck(checkEvent), ValidationAlert.success(msg));
      return;
    }

    setAnnouncement(
      `Score ${correct} out of ${total}. Continue finding the missing words.`,
    );
    ValidationAlert.warning(msg);
  };
  const showAnswers = () => {
    setFoundWords(words.map((word) => word.id));
    clearSelection();
    resetPointer();
    cancelAnimationFrame(focusFrame.current);
    setShowAnswer(true);
    setCheckCompleted(true);
    setAnnouncement("All answers shown.");
  };
  const reset = () => {
    setFoundWords([]);
    clearSelection();
    resetPointer();
    setShowAnswer(false);
    setCheckCompleted(false);
    setActiveCell([0, 0]);
    setAnnouncement("Activity reset. All answers are cleared.");

    cancelAnimationFrame(focusFrame.current);
    focusFrame.current = requestAnimationFrame(() => {
      cellRefs.current["0-0"]?.focus();
    });
  };

  const isSentenceComplete = foundWords.length === words.length;
  const displayedSentence = words.map((word) =>
    foundWords.includes(word.id)
      ? word.text.padEnd(SLOT_LENGTH, " ")
      : "_".repeat(SLOT_LENGTH),
  );
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "30px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>
      <p id="u9p5q4-help" className="sr-only">
        Select the first and last letter of each hidden word by dragging or two
        taps. For the single-letter word, activate its cell twice. Tab enters or
        leaves the grid; arrows move between letters. Enter or Space starts and
        completes selection, Escape cancels it, and Backspace undoes the most
        recently found word. You can find words in either direction and any
        order.
      </p>
      <div className="div-forall">
        <ExerciseHeader
          sectionLetter="C"
          title="What electronic item do we use to send e-mails?"
          subTitle={
            "Find the hidden words in order, then read the completed answer to “What electronic item do we use to send emails?”"
          }
        />
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <div
            className="px-4 pt-4 pb-5"
            style={{ width: "fit-content", margin: "0 auto" }}
          >
            <div
              className="bg-[#daf5ff] rounded-[15px] mb-10 p-2 sm:p-[15px]"
              role="grid"
              data-wordsearch-grid="u9p5q4"
              aria-label="Word search grid"
              aria-describedby="u9p5q4-help"
              style={{
                userSelect: "none",
                width: "max-content",
                touchAction: "none",
                WebkitOverflowScrolling: "touch",
              }}
              onPointerDown={handleGridPointerDown}
              onPointerMove={handleGridPointerMove}
              onPointerUp={handleGridPointerUp}
              onPointerCancel={(e) => {
                if (pointerRef.current.pointerId === e.pointerId)
                  handleGridPointerCancel();
              }}
              onLostPointerCapture={(e) => {
                if (
                  pointerRef.current.active &&
                  pointerRef.current.pointerId === e.pointerId
                )
                  handleGridPointerCancel();
              }}
              onDragStart={(e) => e.preventDefault()}
            >
              {grid.map((row, r) => (
                <div
                  key={r}
                  role="row"
                  style={{
                    display: "flex",
                    gap: "clamp(1px, 0.3vw, 4px)",
                    width: "fit-content",
                  }}
                >
                  {row.map((letter, c) => {
                    const preview = isPreviewCell(r, c),
                      found = isFoundCell(r, c),
                      isStart = startCell && sameCoord(startCell, [r, c]);
                    return (
                      <span
                        key={c}
                        ref={(el) => {
                          cellRefs.current[`${r}-${c}`] = el;
                        }}
                        role="gridcell"
                        data-wordsearch-cell="true"
                        data-row={r}
                        data-col={c}
                        data-index={r * 100 + c}
                        tabIndex={
                          locked ? -1 : sameCoord(activeCell, [r, c]) ? 0 : -1
                        }
                        aria-label={`Row ${r + 1}, column ${c + 1}, letter ${letter}${found ? ", found word" : isStart ? ", first letter selected" : preview ? ", selected" : ""}`}
                        aria-selected={preview || found}
                        onFocus={() => setActiveCell([r, c])}
                        className={`relative flex items-center justify-center mb-2 cursor-pointer transition rounded-sm focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-2! focus-visible:z-10 ${found ? "bg-[#4caf50] text-white" : preview ? "bg-[#ffd54f]" : ""}`}
                        style={{
                          width: "clamp(16px, 2.5vw, 25px)",
                          height: "clamp(22px, 3.5vw, 35px)",
                          fontSize: "clamp(12px, 1.8vw, 18px)",
                          outline: isStart ? "3px solid #2c5287" : undefined,
                        }}
                        onClick={(e) => {
                          if (e.detail === 0) handleCellClick(r, c, true);
                        }}
                        onKeyDown={(e) => handleCellKeyDown(e, r, c)}
                        onKeyUp={(e) => {
                          if (["Enter", " ", "Backspace"].includes(e.key)) {
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
            </div>
            <div className="flex justify-center items-center">
              <img
                src={img1}
                alt="A desktop computer with a monitor, keyboard, and mouse."
                style={{ width: "clamp(40px, 10vw, 100px)", height: "auto" }}
              />
              <input
                className="answer-input-CB-unit3-p5-q4"
                value={displayedSentence.join(" ")}
                readOnly
                tabIndex={-1}
                aria-label={
                  isSentenceComplete
                    ? `Answer: ${sentence.text}.`
                    : `Answer. ${foundWords.length} of ${words.length} words found.`
                }
                style={{
                  fontFamily: "monospace",
                  ...(isSentenceComplete
                    ? {
                        border: "2px solid green",
                        backgroundColor: "#e6f4ea",
                        borderRadius: "5px",
                      }
                    : {}),
                }}
              />
              <img
                src={img2}
                alt="An at sign (@)."
                style={{ width: "clamp(40px, 10vw, 100px)", height: "auto" }}
              />
            </div>
          </div>
        </div>
        <Button
          handleShowAnswer={showAnswers}
          handleStartAgain={(checkEvent) => { resetCompletedCheck(); (reset)(checkEvent); }}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
};
export default Unit9_Page5_Q4;

import ExerciseHeader from "../../ExerciseHeader";
import React, { useState, useRef, useEffect } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 20/Ex A 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 20/Ex A 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 20/Ex A 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 20/Ex A 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 20/Ex A 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 20/Ex A 6.svg";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";

// Keep the score dialog's return focus on an enabled action in this exercise.
function showCheckFeedback(root, kind, ...messages) {
  if (kind === "success") {
    const returnTarget =
      root?.querySelector(".try-again-button:not(:disabled)") ||
      root?.querySelector(".show-answer-btn:not(:disabled)");
    returnTarget?.focus({ preventScroll: true });
  }
  ValidationAlert[kind](...messages);
}


const grid = [
  ["j", "e", "a", "n", "s"],
  ["u", "r", "j", "a", "m"],
  ["i", "y", "o", "y", "o"],
  ["c", "y", "j", "e", "t"],
  ["e", "y", "a", "r", "n"],
];
const targetWords = {
  jeans: {
    id: "w1",
    coords: [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
    ],
  },
  yoyo: {
    id: "w2",
    coords: [
      [2, 1],
      [2, 2],
      [2, 3],
      [2, 4],
    ],
  },
  juice: {
    id: "w3",
    coords: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
    ],
  },
  // مثال لكلمة عمودية
  jet: {
    id: "w4",
    coords: [
      [3, 2],
      [3, 3],
      [3, 4],
    ],
  },
  yarn: {
    id: "w5",
    coords: [
      [4, 1],
      [4, 2],
      [4, 3],
      [4, 4],
    ],
  },
  jam: {
    id: "w6",
    coords: [
      [1, 2],
      [1, 3],
      [1, 4],
    ],
  },
};
const writeList = [
  {
    id: "w1",
    word: "jeans",
    img: img1,
  },
  {
    id: "w2",
    word: "yoyo",
    img: img2,
  },
  {
    id: "w3",
    word: "juice",
    img: img3,
  },
  {
    id: "w4",
    word: "jet",
    img: img4,
  },
  {
    id: "w5",
    word: "yarn",
    img: img5,
  },
  {
    id: "w6",
    word: "jam",
    img: img6,
  },
];
const words = Object.entries(targetWords).map(([text, word]) => ({
  ...word,
  text,
}));
const focusClass =
  "focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-2!";
const IMAGE_DESCRIPTIONS = {
  [img1]: "Blue jeans.",
  [img2]: "A yellow yo-yo.",
  [img3]: "A juice carton with a straw.",
  [img4]: "An airplane.",
  [img5]: "A pink ball of yarn.",
  [img6]: "A jar of jam.",
};
const sameCell = (a, b) => a[0] === b[0] && a[1] === b[1];
const samePath = (a, b) =>
  a.length === b.length && a.every((cell, i) => sameCell(cell, b[i]));
const getPath = (start, end) => {
  const dr = end[0] - start[0],
    dc = end[1] - start[1];
  if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return [];
  const path = Array.from(
    {
      length: Math.max(Math.abs(dr), Math.abs(dc)) + 1,
    },
    (_, i) => [start[0] + Math.sign(dr) * i, start[1] + Math.sign(dc) * i],
  );
  return path.every(([r, c]) => grid[r]?.[c] !== undefined) ? path : [];
};
function useCheckButton(rootRef, checkDisabled) {
  useEffect(() => {
    const button = rootRef.current?.querySelector(".check-button2");
    if (!button) return;
    button.disabled = checkDisabled;
    button.style.cursor = checkDisabled ? "not-allowed" : "";
    button.setAttribute("aria-disabled", String(checkDisabled));
  }, [rootRef, checkDisabled]);
}
const WB_Unit3_Page20_Q1 = () => {
  const [startCell, setStartCell] = useState(null);
  const [selected, setSelected] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [showMarks, setShowMarks] = useState(false);
  const [locked, setLocked] = useState(false);
  const [activeCell, setActiveCell] = useState([0, 0]);
  const [announcement, setAnnouncement] = useState("");
  const gridRef = useRef(null),
    cellRefs = useRef({}),
    pointerRef = useRef(null),
    focusFrame = useRef(null),
    rootRef = useRef(null);
  const cancelFocus = () => {
    if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
    focusFrame.current = null;
  };
  const focusCell = (cell) => {
    cancelFocus();
    focusFrame.current = requestAnimationFrame(() => {
      focusFrame.current = null;
      cellRefs.current[cell.join("-")]?.focus();
    });
  };
  const resetPointer = () => {
    const pointer = pointerRef.current;
    pointerRef.current = null;
    if (pointer) {
      try {
        pointer.element.releasePointerCapture(pointer.id);
      } catch {
        /* Capture may already have ended. */
      }
    }
  };
  const clearSelection = () => {
    setStartCell(null);
    setSelected([]);
  };
  useEffect(() => {
    const pointerState = pointerRef,
      frameState = focusFrame;
    return () => {
      if (frameState.current !== null) cancelAnimationFrame(frameState.current);
      const pointer = pointerState.current;
      pointerState.current = null;
      if (pointer) {
        try {
          pointer.element.releasePointerCapture(pointer.id);
        } catch {
          /* Already released. */
        }
      }
    };
  }, []);
  const isFoundCell = (r, c) =>
    words.some(
      (word) =>
        foundWords.includes(word.text) &&
        word.coords.some((cell) => sameCell(cell, [r, c])),
    );
  const isHighlighted = (r, c) =>
    isFoundCell(r, c) || selected.some((cell) => sameCell(cell, [r, c]));
  const startSelection = (cell) => {
    if (locked) return;
    setStartCell(cell);
    setSelected([cell]);
    setAnnouncement(
      `Selection started at row ${cell[0] + 1}, column ${cell[1] + 1}. Choose the last letter.`,
    );
  };
  const completeSelection = (end, start = startCell) => {
    if (locked) return;
    if (!start) {
      startSelection(end);
      return;
    }
    if (sameCell(start, end)) {
      clearSelection();
      setAnnouncement("Selection cancelled.");
      return;
    }
    const path = getPath(start, end);
    const word = words.find(
      (w) =>
        samePath(path, w.coords) || samePath(path, [...w.coords].reverse()),
    );
    if (!path.length)
      setAnnouncement(
        "Select a straight horizontal, vertical, or diagonal path.",
      );
    else if (!word) setAnnouncement("That is not one of the target words.");
    else if (foundWords.includes(word.text))
      setAnnouncement(word.text + " was already found.");
    else {
      setFoundWords((previous) =>
        previous.includes(word.text) ? previous : [...previous, word.text],
      );
      setAnnouncement(
        `${word.text} found. ${foundWords.length + 1} of ${words.length} words found.`,
      );
    }
    clearSelection();
  };
  const activateCell = (cell) => {
    if (!locked) {
      if (startCell) completeSelection(cell);
      else startSelection(cell);
    }
  };
  const undo = () => {
    if (locked) return;
    if (startCell || pointerRef.current) {
      resetPointer();
      clearSelection();
      setAnnouncement("Selection cancelled.");
      return;
    }
    if (foundWords.length) {
      const removed = foundWords.at(-1);
      setFoundWords((previous) => previous.slice(0, -1));
      setAnnouncement(removed + " removed.");
    }
  };
  const handleCellKeyDown = (e, r, c) => {
    const arrows = {
      ArrowRight: [0, 1],
      ArrowLeft: [0, -1],
      ArrowDown: [1, 0],
      ArrowUp: [-1, 0],
    };
    if (
      !arrows[e.key] &&
      !["Enter", " ", "Escape", "Backspace"].includes(e.key)
    )
      return;
    e.preventDefault();
    e.stopPropagation();
    if (locked) return;
    if (arrows[e.key]) {
      const [dr, dc] = arrows[e.key],
        nr = (r + dr + grid.length) % grid.length,
        nc = Math.min(
          (c + dc + grid[r].length) % grid[r].length,
          grid[nr].length - 1,
        ),
        next = [nr, nc];
      setActiveCell(next);
      if (startCell) {
        const path = getPath(startCell, next);
        setSelected(path.length ? path : [startCell]);
      }
      focusCell(next);
      return;
    }
    if (e.repeat) return;
    if (e.key === "Enter" || e.key === " ") activateCell([r, c]);
    else if (e.key === "Backspace") undo();
    else if (e.key === "Escape") {
      resetPointer();
      clearSelection();
      setAnnouncement("Selection cancelled.");
    }
  };
  const onActivationKeyUp = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  const cellFromPoint = (x, y) => {
    const cell = document
      .elementFromPoint(x, y)
      ?.closest?.("[data-wb-u3-wordsearch-cell]");
    if (!cell || !gridRef.current?.contains(cell)) return null;
    const r = Number(cell.dataset.row),
      c = Number(cell.dataset.col);
    return grid[r]?.[c] !== undefined ? [r, c] : null;
  };
  const onPointerDown = (e) => {
    if (
      locked ||
      pointerRef.current ||
      e.isPrimary === false ||
      (e.pointerType === "mouse" && e.button !== 0)
    )
      return;
    const cell = cellFromPoint(e.clientX, e.clientY);
    if (!cell) return;
    e.preventDefault();
    e.stopPropagation();
    cancelFocus();
    pointerRef.current = {
      id: e.pointerId,
      start: cell,
      current: cell,
      element: e.currentTarget,
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* Capture unsupported. */
    }
    setActiveCell(cell);
    if (!startCell) setSelected([cell]);
  };
  const onPointerMove = (e) => {
    if (locked) return;
    const pointer = pointerRef.current;
    if (pointer && pointer.id !== e.pointerId) return;
    const cell = cellFromPoint(e.clientX, e.clientY);
    if (!cell) return;
    if (pointer) {
      pointer.current = cell;
      const path = getPath(pointer.start, cell);
      setSelected(path.length ? path : [pointer.start]);
    } else if (startCell && e.pointerType === "mouse") {
      const path = getPath(startCell, cell);
      setSelected(path.length ? path : [startCell]);
    }
  };
  const onPointerUp = (e) => {
    const pointer = pointerRef.current;
    if (!pointer || pointer.id !== e.pointerId) return;
    e.preventDefault();
    e.stopPropagation();
    const end = cellFromPoint(e.clientX, e.clientY) || pointer.current;
    resetPointer();
    if (!sameCell(pointer.start, end)) completeSelection(end, pointer.start);
    else activateCell(end);
  };
  const onPointerCancel = (e) => {
    if (pointerRef.current?.id !== e.pointerId) return;
    resetPointer();
    clearSelection();
    setAnnouncement("Selection cancelled.");
  };
  const checkAnswers = () => {
    if (locked) return;
    cancelFocus();
    resetPointer();
    clearSelection();
    if (!foundWords.length) {
      const message = "Please find at least one word before checking.";
      ValidationAlert.info("Oops!", message);
      setAnnouncement(message);
      return;
    }
    const score = foundWords.length,
      total = words.length;
    setShowMarks(true);
    setLocked(score === total);
    const color = score === total ? "green" : "orange";
    const message = `<div style="font-size:20px; text-align:center;"><span style="color:${color}; font-weight:bold;">Score: ${score} / ${total}</span></div>`;
    if (score === total) showCheckFeedback(rootRef.current, "success", message);
    else ValidationAlert.warning(message);
    setAnnouncement(
      `Score ${score} out of ${total}. ${score === total ? "All words are found." : "Continue finding the missing words, or press Backspace to undo."}`,
    );
  };
  const showAnswers = () => {
    cancelFocus();
    resetPointer();
    clearSelection();
    setFoundWords(words.map((word) => word.text));
    setShowMarks(false);
    setLocked(true);
    setAnnouncement(
      "All word paths are shown and locked. Press Start Again to try again.",
    );
  };
  const reset = () => {
    cancelFocus();
    resetPointer();
    clearSelection();
    setFoundWords([]);
    setShowMarks(false);
    setLocked(false);
    setActiveCell([0, 0]);
    setAnnouncement("Exercise reset. All paths and results cleared.");
    focusCell([0, 0]);
  };
  const writtenAnswers = Object.fromEntries(
    words.filter((w) => foundWords.includes(w.text)).map((w) => [w.id, w.text]),
  );
  const message = announcement;
  const isCellFound = isFoundCell,
    isCellSelected = (r, c) => selected.some((cell) => sameCell(cell, [r, c]));
  const handleShowAnswer = showAnswers,
    handleStartAgain = reset;
  useCheckButton(rootRef, locked);
  return (
    <div className="main-container-component" ref={rootRef}>
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {message}
      </div>
      <p className="sr-only" id="wb-u3-p20-q1-help">
        Use arrows to move. Press Enter or Space on the first and last letters,
        or drag or tap the endpoints in either direction. Escape cancels.
        Backspace undoes the last word. Tab leaves the grid.
      </p>
      <div
        className="div-forall"
        style={{
          gap: "35px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="A"
          title={<>Look, read, and write. Circle the words.</>}
          subTitle={"Say each picture word, find the j or y sound, then write the word carefully."}
        />

        <div className="grid grid-cols-[1fr_1fr] gap-6">
          {/* شبكة الحروف */}
          <div
            className="grid grid-cols-5 gap-1 p-2 bg-gray-200 rounded-lg max-w-100 max-h-120"
            ref={gridRef}
            role="group"
            aria-label="Word search grid"
            aria-describedby="wb-u3-p20-q1-help"
            style={{
              userSelect: "none",
              touchAction: "none",
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            onLostPointerCapture={onPointerCancel}
            onDragStart={(e) => e.preventDefault()}
          >
            {grid.map((row, rowIndex) =>
              row.map((letter, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  ref={(el) => {
                    cellRefs.current[rowIndex + "-" + colIndex] = el;
                  }}
                  role="button"
                  data-wb-u3-wordsearch-cell="true"
                  data-row={rowIndex}
                  data-col={colIndex}
                  tabIndex={
                    !locked && sameCell(activeCell, [rowIndex, colIndex])
                      ? 0
                      : -1
                  }
                  aria-label={`Row ${rowIndex + 1}, column ${colIndex + 1}, letter ${letter}${isCellFound(rowIndex, colIndex) ? ", found word" : ""}`}
                  aria-pressed={isHighlighted(rowIndex, colIndex)}
                  aria-disabled={locked}
                  onFocus={() => setActiveCell([rowIndex, colIndex])}
                  onClick={(e) => {
                    if (e.detail === 0) activateCell([rowIndex, colIndex]);
                  }}
                  onKeyDown={(e) => handleCellKeyDown(e, rowIndex, colIndex)}
                  onKeyUp={onActivationKeyUp}
                  className={`${focusClass} max-w-12 max-h-12 flex items-center justify-center text-2xl font-bold uppercase rounded-md cursor-pointer transition-all
                                ${isCellFound(rowIndex, colIndex) ? "bg-yellow-300 text-yellow-800" : isCellSelected(rowIndex, colIndex) ? "bg-blue-300" : "bg-white hover:bg-gray-100"}`}
                >
                  {letter}
                </div>
              )),
            )}
          </div>

          <div className="space-y-2">
            {writeList.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-3"
                style={{
                  justifyContent: "space-between",
                }}
              >
                <div className="flex gap-5">
                  <span className="font-bold text-blue-600">{index + 1}</span>
                  <input
                    type="text"
                    value={writtenAnswers[item.id] || ""}
                    aria-label={`Word ${index + 1}${foundWords.includes(item.word) ? ", found" : ""}`}
                    style={{
                      borderRadius: 0,
                      ...((showMarks || locked) &&
                      foundWords.includes(item.word)
                        ? {
                            borderColor: "#16a34a",
                          }
                        : {}),
                    }}
                    readOnly
                    className="max-w-full bg-transparent border-b-2 border-gray-300 focus:outline-none"
                  />
                </div>
                <img
                  src={item.img}
                  alt={IMAGE_DESCRIPTIONS[item.img]}
                  // className="max-w-10 max-h-10 object-contain"
                  style={{
                    height: "75px",
                    width: "100px",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleStartAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};
export default WB_Unit3_Page20_Q1;

import React, { useState, useRef, useEffect } from "react";
import "./WB_Unit1_Page7_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import wordSound0 from "../../../assets/audio/WorkBook/Unit 1/Page 7 - K/Item_001_father.mp3";
import wordSound1 from "../../../assets/audio/WorkBook/Unit 1/Page 7 - K/Item_002_mother.mp3";
import wordSound2 from "../../../assets/audio/WorkBook/Unit 1/Page 7 - K/Item_003_brother.mp3";
import wordSound3 from "../../../assets/audio/WorkBook/Unit 1/Page 7 - K/Item_004_sister.mp3";
import wordSound4 from "../../../assets/audio/WorkBook/Unit 1/Page 7 - K/Item_005_aunt.mp3";
import wordSound5 from "../../../assets/audio/WorkBook/Unit 1/Page 7 - K/Item_006_uncle.mp3";
import wordSound6 from "../../../assets/audio/WorkBook/Unit 1/Page 7 - K/Item_007_cousin.mp3";

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

const WORD_SOUNDS = {
  father: wordSound0,
  mother: wordSound1,
  brother: wordSound2,
  sister: wordSound3,
  aunt: wordSound4,
  uncle: wordSound5,
  cousin: wordSound6,
};
const focusClass =
  "focus-visible:rounded-sm focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-2!";
const sameCell = (a, b) => a[0] === b[0] && a[1] === b[1];
const samePath = (a, b) =>
  a.length === b.length && a.every((cell, i) => sameCell(cell, b[i]));
const getPath = (start, end) => {
  const dr = end[0] - start[0],
    dc = end[1] - start[1];
  if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return [];
  const path = Array.from(
    { length: Math.max(Math.abs(dr), Math.abs(dc)) + 1 },
    (_, i) => [start[0] + Math.sign(dr) * i, start[1] + Math.sign(dc) * i],
  );
  return path.every(([r, c]) => grid[r]?.[c] !== undefined) ? path : [];
};

export default function WB_Unit1_Page7_Q1() {
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
  const [selected, setSelected] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [showMarks, setShowMarks] = useState(false);
  const [locked, setLocked] = useState(false);
  const [activeCell, setActiveCell] = useState([0, 0]);
  const [announcement, setAnnouncement] = useState("");
  const [playingWord, setPlayingWord] = useState(null);
  const gridRef = useRef(null),
    cellRefs = useRef({}),
    pointerRef = useRef(null),
    focusFrame = useRef(null),
    audioToken = useRef(0);
  const audioOwner = useRef(Symbol("wb_unit1_page7_q1")).current;

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
  const stopSound = () => {
    audioToken.current++;
    stopGlobalAudio(audioOwner);
    setPlayingWord(null);
  };
  const playWord = (word) => {
    stopSound();
    const token = audioToken.current;
    setPlayingWord(word.text);
    try {
      playGlobalAudio(WORD_SOUNDS[word.text], {
        owner: audioOwner,
        onFinish: () => {
          if (audioToken.current === token) setPlayingWord(null);
        },
      });
    } catch {
      stopSound();
      setAnnouncement("Audio could not be played. Please try again.");
    }
  };
  useEffect(() => {
    const tokenState = audioToken,
      pointerState = pointerRef,
      frameState = focusFrame;
    const onOtherAudio = () => {
      tokenState.current++;
      stopGlobalAudio(audioOwner);
      setPlayingWord(null);
    };
    document.addEventListener("play", onOtherAudio, true);
    return () => {
      document.removeEventListener("play", onOtherAudio, true);
      tokenState.current++;
      stopGlobalAudio(audioOwner);
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
  }, [audioOwner]);

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
      ?.closest?.("[data-wb-u1-wordsearch-cell]");
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

  const checkAnswers = (checkEvent) => {
    if (completedCheckRef.current) { completeCheck(checkEvent); return; }

    if (locked) return;
    cancelFocus();
    stopSound();
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
    if (score === total) (completeCheck(checkEvent), showCheckFeedback(gridRef.current?.closest(".wordsearch-wrapper"), "success", message));
    else ValidationAlert.warning(message);
    setAnnouncement(
      `Score ${score} out of ${total}. ${score === total ? "All words are found." : "Continue finding the missing words, or press Backspace to undo."}`,
    );
  };
  const showAnswers = () => {
    cancelFocus();
    stopSound();
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
    stopSound();
    resetPointer();
    clearSelection();
    setFoundWords([]);
    setShowMarks(false);
    setLocked(false);
    setActiveCell([0, 0]);
    setAnnouncement("Exercise reset. All paths and results cleared.");
    focusCell([0, 0]);
  };
  return (
    <div className="wordsearch-wrapper">
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>
      <p id="wb-u1-p7-q1-help" className="sr-only">
        Use arrows to move through the grid. Press Enter or Space on the first
        and last letters. You may drag or tap the endpoints in either direction.
        Escape cancels a selection; Backspace cancels it or undoes the last
        found word. Tab leaves the grid. Choose a word in the list to hear it.
      </p>
      <div className="page8-wrapper">
        <div className="div-forall" style={{}}>
          <ExerciseHeader
            isWorkbook
            sectionLetter="H"
            title="Find the words."
            subTitle={"Scan one row at a time and highlight each family word from its first letter to its last."}
          />
          <div className="container-word-grid-wb-u1-p7-q2">
            <div
              className="grid-wb-u1-p7-q2"
              ref={gridRef}
              role="grid"
              aria-label="Word search"
              aria-describedby="wb-u1-p7-q1-help"
              style={{ userSelect: "none", touchAction: "none" }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerCancel}
              onLostPointerCapture={onPointerCancel}
              onDragStart={(e) => e.preventDefault()}
            >
              {grid.map((row, rIdx) => (
                <div key={rIdx} role="row" className="row-wb-u1-p7-q2">
                  {row.map((cell, cIdx) => (
                    <div
                      key={cIdx}
                      className={`cell-wb-u1-p7-q2 ${focusClass} 
                        ${isHighlighted(rIdx, cIdx) ? "highlight" : ""} 
                        ${isFoundCell(rIdx, cIdx) ? "found" : ""}
                      `}
                      ref={(node) => {
                        cellRefs.current[`${rIdx}-${cIdx}`] = node;
                      }}
                      role="gridcell"
                      data-wb-u1-wordsearch-cell="true"
                      data-row={rIdx}
                      data-col={cIdx}
                      tabIndex={
                        !locked && sameCell(activeCell, [rIdx, cIdx]) ? 0 : -1
                      }
                      aria-label={`Row ${rIdx + 1}, column ${cIdx + 1}, letter ${cell}${isFoundCell(rIdx, cIdx) ? ", found word" : ""}`}
                      aria-selected={isHighlighted(rIdx, cIdx)}
                      aria-disabled={locked}
                      onFocus={() => setActiveCell([rIdx, cIdx])}
                      onClick={(e) => {
                        if (e.detail === 0) activateCell([rIdx, cIdx]);
                      }}
                      onKeyDown={(e) => handleCellKeyDown(e, rIdx, cIdx)}
                      onKeyUp={onActivationKeyUp}
                      style={{ userSelect: "none", cursor: "pointer" }}
                    >
                      {cell}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="word-btn-wb-u1-p7-q2">
              {words.map((w) => (
                <div
                  key={w.text}
                  role="button"
                  tabIndex={0}
                  className={`word-label-wrapper-wb-u1-p7-q2 ${focusClass}`}
                  aria-label={`${w.text}. ${foundWords.includes(w.text) ? "Found in the grid." : "Not found yet."} Press to hear it.`}
                  onClick={() => playWord(w)}
                  onFocus={(e) => {
                    if (e.currentTarget.matches(":focus-visible")) playWord(w);
                  }}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter" && e.key !== " ") return;
                    e.preventDefault();
                    e.stopPropagation();
                    if (!e.repeat) playWord(w);
                  }}
                  onKeyUp={onActivationKeyUp}
                  style={
                    playingWord === w.text
                      ? {
                          boxShadow: "0 0 0 3px #2563eb",
                          backgroundColor: "#dbeafe",
                        }
                      : undefined
                  }
                >
                  <div
                    className={`word-label-wb-u1-p7-q2 ${
                      foundWords.includes(w.text) ? "done" : ""
                    }`}
                  >
                    {w.text}
                  </div>
                  {playingWord === w.text && (
                    <span
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        top: -10,
                        right: -10,
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: "white",
                        color: "black",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        pointerEvents: "none",
                        zIndex: 3,
                        boxShadow: "0 1px 3px rgba(0,0,0,.25)",
                      }}
                    >
                      <FaVolumeUp size={12} />
                    </span>
                  )}
                  {showMarks && !foundWords.includes(w.text) && (
                    <span
                      className="wrong-x-circle-wb-u1-p7-q2"
                      aria-hidden="true"
                    >
                      ✕
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="action-buttons-container">
        <button className="try-again-button" onClick={(checkEvent) => { resetCompletedCheck(); (reset)(checkEvent); }}>
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

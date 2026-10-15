import React, { useEffect, useRef, useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit8_Page5_Q4.css";
import Button from "../../WorkBookPages/Button";
import ExerciseHeader from "../../ExerciseHeader";
import img1 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 68/Ex C 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 68/Ex C 2.svg";
import { FaVolumeUp } from "react-icons/fa";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager"; // No verified audio asset for this complete sentence is available.
const sentenceAudio = null;
const grid = [
  [
    "e",
    "d",
    "t",
    "h",
    "e",
    "f",
    "g",
    "f",
    "t",
    "e",
    "i",
    "m",
    "t",
    "s",
    "u",
    "m",
    "m",
    "e",
    "r",
    "s",
    "u",
    "e",
    "e",
    "i",
    "x",
    "n",
  ],

  [
    "b",
    "n",
    "s",
    "s",
    "e",
    "e",
    "v",
    "a",
    "c",
    "a",
    "t",
    "i",
    "o",
    "n",
    "x",
    "e",
    "r",
    "s",
    "t",
    "a",
    "r",
    "t",
    "s",
    "v",
    "f",
    "i",
    "n",
  ],
  ["s", "k", "j", "u", "n", "e", "n", "b", "g", "f", "s", "k", "r"],
];
const rowCoords = (r, from, to) =>
  Array.from({ length: to - from + 1 }, (_, i) => [r, from + i]);

const words = [
  { id: "the", text: "the", coords: rowCoords(0, 2, 4) },
  { id: "summer", text: "summer", coords: rowCoords(0, 13, 18) },
  { id: "vacation", text: "vacation", coords: rowCoords(1, 6, 13) },
  { id: "starts", text: "starts", coords: rowCoords(1, 17, 22) },
  { id: "in", text: "in", coords: rowCoords(1, 25, 26) },
  { id: "june", text: "june", coords: rowCoords(2, 2, 5) },
];

const SLOT_LENGTH = 8;
const sentence = {
  text: words.map((w) => w.text).join(" "),
  audio: sentenceAudio,
};
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

  if (!cell || !cell.closest("[data-wordsearch-grid='u8p5q4']")) return null;

  const r = Number(cell.dataset.row);
  const c = Number(cell.dataset.col);

  return Number.isNaN(r) || Number.isNaN(c) ? null : [r, c];
};
const Unit8_Page5_Q4 = () => {
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
  const [playingSentence, setPlayingSentence] = useState(false);
  const audioOwner = useRef({}).current;
  const stopAudio = () => {
    stopGlobalAudio(audioOwner);
    setPlayingSentence(false);
  };

  const playSentenceAudio = () => {
    if (!sentence.audio) return;

    playGlobalAudio(sentence.audio, {
      owner: audioOwner,
      onFinish: () => setPlayingSentence(false),
    });

    setPlayingSentence(true);
  };
  useEffect(
    () => () => {
      stopGlobalAudio(audioOwner);
      cancelAnimationFrame(focusFrame.current);
    },
    [audioOwner],
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

    if (sameCoord(start, [endR, endC])) {
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

      if (sentenceCompleted) playSentenceAudio();
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
    stopAudio();
    setFoundWords((prev) => prev.slice(0, -1));

    setAnnouncement(`${lastWord} removed.`);
  };
  const handleCellKeyDown = (e, r, c) => {
    if (locked) return;
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

    stopAudio();
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
    stopAudio();
    setFoundWords(words.map((word) => word.id));
    clearSelection();
    resetPointer();
    cancelAnimationFrame(focusFrame.current);
    setShowAnswer(true);
    setCheckCompleted(true);
    setAnnouncement("All answers shown.");
  };
  const reset = () => {
    stopAudio();
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
  const canReplay = isSentenceComplete && Boolean(sentence.audio);

  const handleSentenceClick = () => {
    if (canReplay) playSentenceAudio();
  };

  const handleSentenceKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      if (!e.repeat) handleSentenceClick();
    }
  };

  const displayedSentence = words.map((word) =>
    foundWords.includes(word.id)
      ? word.text.padEnd(SLOT_LENGTH, " ")
      : "_".repeat(SLOT_LENGTH),
  );
  return (
    <div
      className="[&_button:focus-visible]:outline-4! [&_button:focus-visible]:outline-[#2563eb]! [&_button:focus-visible]:outline-offset-4!"
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

      <div className="div-forall">
        <ExerciseHeader
          sectionLetter="C"
          title="When does summer vacation start?"
          subTitle={
            "Find the hidden words in order, then read the completed answer to “When does summer vacation start?”"
          }
        />

        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <div
            className="px-4 pt-4 pb-5"
            style={{ width: "fit-content", margin: "0 auto" }}
          >
            <div style={{ overflowX: "auto", maxWidth: "100%" }}>
              <div
                className="bg-[#daf5ff] rounded-[15px] p-2 sm:p-[15px] mb-10"
                role="grid"
                data-wordsearch-grid="u8p5q4"
                aria-label="Word search grid. Press Enter or Space on the first letter, use the arrow keys to move to the last letter, then press Enter again."
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
                onLostPointerCapture={() => {
                  if (pointerRef.current.active) handleGridPointerCancel();
                }}
                onDragStart={(e) => e.preventDefault()}
              >
                {grid.map((row, rIdx) => (
                  <div
                    key={rIdx}
                    role="row"
                    style={{
                      display: "flex",
                      gap: "clamp(1px, 0.3vw, 4px)",
                      width: "fit-content",
                    }}
                  >
                    {row.map((cell, cIdx) => {
                      const preview = isPreviewCell(rIdx, cIdx);
                      const found = isFoundCell(rIdx, cIdx);
                      const isStart =
                        startCell &&
                        startCell[0] === rIdx &&
                        startCell[1] === cIdx;
                      const isActiveCell =
                        activeCell[0] === rIdx && activeCell[1] === cIdx;

                      return (
                        <div
                          key={cIdx}
                          ref={(node) => {
                            cellRefs.current[`${rIdx}-${cIdx}`] = node;
                          }}
                          role="gridcell"
                          data-wordsearch-cell="true"
                          data-row={rIdx}
                          data-col={cIdx}
                          tabIndex={locked ? -1 : isActiveCell ? 0 : -1}
                          aria-label={`Row ${rIdx + 1}, column ${cIdx + 1}, letter ${cell}${
                            found
                              ? ", found word"
                              : isStart
                                ? ", first letter selected"
                                : preview
                                  ? ", selected"
                                  : ""
                          }`}
                          aria-selected={preview || found}
                          onFocus={() => setActiveCell([rIdx, cIdx])}
                          className={`
                            relative
                            flex items-center justify-center mb-2
                            cursor-pointer
                            transition
                            focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-2! focus-visible:z-10
                            ${
                              found
                                ? "bg-[#4caf50] text-white rounded-sm"
                                : preview
                                  ? "bg-[#ffd54f] rounded-md font-bold"
                                  : "hover:bg-white/60 rounded-md"
                            }
                          `}
                          style={{
                            width: "clamp(16px, 2.5vw, 25px)",
                            height: "clamp(22px, 3.5vw, 35px)",
                            fontSize: "clamp(12px, 1.8vw, 18px)",
                            outline: isStart ? "3px solid #2c5287" : undefined,
                          }}
                          onClick={(e) => {
                            if (e.detail === 0)
                              handleCellClick(rIdx, cIdx, true);
                          }}
                          onKeyDown={(e) => handleCellKeyDown(e, rIdx, cIdx)}
                          onKeyUp={(e) => {
                            if (["Enter", " ", "Backspace"].includes(e.key)) {
                              e.preventDefault();
                              e.stopPropagation();
                            }
                          }}
                        >
                          {cell}

                          <span
                            aria-hidden="true"
                            style={{
                              position: "absolute",
                              inset: "-4px -1px",
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center items-center">
              <img
                src={img1}
                alt="A child with a football on a sandy beach."
                style={{ width: "clamp(40px, 10vw, 100px)", height: "auto" }}
              />

              <input
                className="answer-input-CB-unit3-p5-q4 focus-visible:outline-4 focus-visible:outline-blue-600 focus-visible:outline-offset-2"
                value={displayedSentence.join(" ")}
                readOnly
                tabIndex={canReplay ? 0 : -1}
                aria-label={
                  isSentenceComplete
                    ? `Answer: ${sentence.text}.${canReplay ? " Press to listen again." : ""}`
                    : `Answer. ${foundWords.length} of ${words.length} words found.`
                }
                onClick={handleSentenceClick}
                onKeyDown={handleSentenceKeyDown}
                style={{
                  fontFamily: "monospace",
                  border:
                    playingSentence || isSentenceComplete
                      ? "2px solid green"
                      : "",
                  backgroundColor:
                    playingSentence || isSentenceComplete ? "#e6f4ea" : "",
                  borderRadius:
                    playingSentence || isSentenceComplete ? "5px" : "",
                  cursor: canReplay ? "pointer" : undefined,
                }}
              />

              {playingSentence && (
                <span aria-hidden="true" style={{ marginLeft: "8px" }}>
                  <FaVolumeUp />
                </span>
              )}

              <img
                src={img2}
                alt="A sandy beach with waves, a palm tree, and a beach umbrella."
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

export default Unit8_Page5_Q4;

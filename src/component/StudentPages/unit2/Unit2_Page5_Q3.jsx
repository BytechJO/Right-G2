import React, { useEffect, useRef, useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 14/Ex C 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 14/Ex C 2.svg";
import Button from "../../WorkBookPages/Button";
import ExerciseHeader from "../../ExerciseHeader";
// ========================================
// AUDIO
// ========================================

import { FaVolumeUp } from "react-icons/fa";
// ⚠️ عدّلي المسار واسم الملف حسب ملفك الفعلي
import sentenceAudio from "../../../assets/audio/ClassBook/U 2/Page 14 - C/the birds fly in the sky.mp3";
// 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";

// ========================================
// GRID
// ========================================

const grid = [
  "xthexysbirdsxerflyqnmizop".split(""),
  "inmkilopxeftheickmkmkloab".split(""),
  "fndssbvrwskycsj".split(""),
];

// ========================================
// WORDS (بالترتيب نفسه تبع الجملة)
// كل كلمة إلها id لأنو "the" مكررة
// coords = [صف، عمود]
// ========================================

const words = [
  {
    id: "the1",
    text: "the",
    coords: [
      [0, 1],
      [0, 2],
      [0, 3],
    ],
  },
  {
    id: "birds",
    text: "birds",
    coords: [
      [0, 7],
      [0, 8],
      [0, 9],
      [0, 10],
      [0, 11],
    ],
  },
  {
    id: "fly",
    text: "fly",
    coords: [
      [0, 15],
      [0, 16],
      [0, 17],
    ],
  },
  {
    id: "in",
    text: "in",
    coords: [
      [1, 0],
      [1, 1],
    ],
  },
  {
    id: "the2",
    text: "the",
    coords: [
      [1, 11],
      [1, 12],
      [1, 13],
    ],
  },
  {
    id: "sky",
    text: "sky",
    coords: [
      [2, 9],
      [2, 10],
      [2, 11],
    ],
  },
];

const SLOT_LENGTH = 8;
const sentence = {
  text: words.map((w) => w.text).join(" "),
  audio: sentenceAudio,
};

// ========================================
// HELPERS
// ========================================

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

  // الصف الثالث أقصر: نتأكد إن كل خلية بالمسار موجودة
  return path.every(([r, c]) => grid[r] && grid[r][c] !== undefined)
    ? path
    : [];
};

const lettersOf = (cells) => cells.map(([r, c]) => grid[r][c]);

// ========================================
// MAIN
// ========================================

const Unit2_Page5_Q3 = () => {
  const [startCell, setStartCell] = useState(null);
  const [previewCells, setPreviewCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]); // ids
  const [showAnswer, setShowAnswer] = useState(false);
  const [checkCompleted, setCheckCompleted] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [ setFeedback] = useState("");
  const [activeCell, setActiveCell] = useState([0, 0]);

  const pointerStartRef = useRef(null);
  const pointerCurrentRef = useRef(null);
  const pointerDraggingRef = useRef(false);
  const pointerResumedRef = useRef(false);
  const cellRefs = useRef({});

  const locked = showAnswer || checkCompleted;
  const [playingSentence, setPlayingSentence] = useState(false);
  const audioOwner = useRef({}).current;

  // ========================================
  // AUDIO
  // ========================================

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

  // وقف الصوت إذا سكرت الصفحة
  useEffect(() => () => stopGlobalAudio(audioOwner), [audioOwner]);
  // ========================================
  // CELL STATE
  // ========================================

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
    pointerDraggingRef.current = false;
    pointerStartRef.current = null;
    pointerCurrentRef.current = null;
    pointerResumedRef.current = false;
  };

  // ========================================
  // START
  // ========================================

  const startSelection = (r, c) => {
    if (locked || isFoundCell(r, c)) return;

    setStartCell([r, c]);
    setPreviewCells([[r, c]]);
    setFeedback("");

    setAnnouncement(
      `Selection started at letter ${grid[r][c]}. Use the arrow keys to move to the last letter, then press Enter.`,
    );
  };

  // ========================================
  // COMPLETE
  // ========================================

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

    // نفس الحرف مرتين = إلغاء الاختيار
    if (sameCoord(start, [endR, endC])) {
      clearSelection();
      setAnnouncement("Selection cancelled.");
      return;
    }

    const path = getPath(start, [endR, endC]);

    if (path.length === 0) {
      setAnnouncement("That is not a straight line. Move to another letter.");
      setFeedback("Not a straight line. Try another letter.");

      // بالكيبورد: الاختيار بيضل شغّال والطالب بيعدّل
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

      setFeedback(`Great! You found "${matchedWord.text}".`);

      if (sentenceCompleted) playSentenceAudio();
    } else {
      setAnnouncement(
        `${lettersOf(path).join(" ")} is not one of the target words.`,
      );
      setFeedback("Not quite. Try again!");
    }

    clearSelection();
  };

  // ========================================
  // CLICK / ENTER / SPACE
  // ========================================

  const handleCellClick = (r, c, viaKeyboard = false) => {
    if (locked) return;

    if (!startCell) {
      startSelection(r, c);
    } else {
      completeSelection(r, c, startCell, viaKeyboard);
    }
  };

  // ========================================
  // UNDO
  // ========================================

  const canUndo = !locked && (Boolean(startCell) || foundWords.length > 0);

  const handleUndo = () => {
    if (!canUndo) return;

    // إذا في اختيار شغّال: نلغيه
    if (startCell) {
      resetPointer();
      clearSelection();
      setAnnouncement("Selection cancelled.");
      return;
    }

    // وإلا: نشيل آخر كلمة انلقت
    const lastId = foundWords[foundWords.length - 1];
    const lastWord = words.find((w) => w.id === lastId)?.text;
    stopAudio();
    setFoundWords((prev) => prev.slice(0, -1));

    setFeedback(`Removed "${lastWord}".`);
    setAnnouncement(`${lastWord} removed.`);
  };

  // ========================================
  // KEYBOARD
  // ========================================

  const handleCellKeyDown = (e, r, c) => {
    if (locked) return;

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

    // الصفوف مختلفة الطول
    nextC = Math.min(nextC, grid[nextR].length - 1);

    // التنقل بالأسهم: الاختيار بيضل شغّال والحروف بتضل ملوّنة لحد Enter ثاني
    if (nextR !== r || nextC !== c) {
      setActiveCell([nextR, nextC]);

      if (startCell) {
        const path = getPath(startCell, [nextR, nextC]);

        // مسار مستقيم: بنلوّن من البداية للخلية الحالية
        // مش مستقيم: بنضل على حرف البداية بس
        setPreviewCells(path.length > 0 ? path : [startCell]);

        setAnnouncement(
          path.length > 0
            ? `${lettersOf(path).join(" ")}. Press Enter to finish the word.`
            : `Letter ${grid[nextR][nextC]}. Not in a straight line from the first letter.`,
        );
      } else {
        setAnnouncement(`Letter ${grid[nextR][nextC]}.`);
      }

      requestAnimationFrame(() => {
        cellRefs.current[`${nextR}-${nextC}`]?.focus();
      });

      return;
    }

    // ENTER / SPACE
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      handleCellClick(r, c, true);
      return;
    }

    // BACKSPACE = UNDO
    if (e.key === "Backspace") {
      e.preventDefault();
      handleUndo();
      return;
    }

    // ESC
    if (e.key === "Escape" && startCell) {
      e.preventDefault();
      clearSelection();
      setAnnouncement("Selection cancelled.");
    }
  };

  // ========================================
  // POINTER DRAG (Mouse + Touch + Pen)
  // ========================================

  const getCellFromPoint = (clientX, clientY) => {
    const element = document.elementFromPoint(clientX, clientY);
    if (!element) return null;

    const cell = element.closest?.("[data-wordsearch-cell='true']");
    if (!cell) return null;

    const r = Number(cell.dataset.row);
    const c = Number(cell.dataset.col);

    return Number.isNaN(r) || Number.isNaN(c) ? null : [r, c];
  };

  const handlePointerDown = (e, r, c) => {
    if (locked) return;

    // إذا في اختيار شغّال (ضغطة أولى بدون سحب) نكمل منه
    const resumed = Boolean(startCell);

    if (!resumed && isFoundCell(r, c)) return;

    e.preventDefault();

    const start = resumed ? startCell : [r, c];

    pointerDraggingRef.current = true;
    pointerResumedRef.current = resumed;
    pointerStartRef.current = start;
    pointerCurrentRef.current = [r, c];

    setStartCell(start);
    setActiveCell([r, c]);

    if (!resumed) setFeedback("");

    const path = getPath(start, [r, c]);
    setPreviewCells(path.length > 0 ? path : [start]);
  };

  const handlePointerMove = (e) => {
    if (!pointerDraggingRef.current) return;

    const start = pointerStartRef.current;
    if (!start) return;

    const target = getCellFromPoint(e.clientX, e.clientY);
    if (!target) return;

    pointerCurrentRef.current = target;

    const path = getPath(start, target);
    if (path.length > 0) setPreviewCells(path);
  };

  const handlePointerEnter = (r, c) => {
    if (!pointerDraggingRef.current) return;

    const start = pointerStartRef.current;
    if (!start) return;

    pointerCurrentRef.current = [r, c];

    const path = getPath(start, [r, c]);
    if (path.length > 0) setPreviewCells(path);
  };

  const handlePointerUp = (e) => {
    if (!pointerDraggingRef.current) return;

    e.preventDefault();

    const start = pointerStartRef.current;
    if (!start) return;

    const end =
      getCellFromPoint(e.clientX, e.clientY) ||
      pointerCurrentRef.current ||
      start;

    const resumed = pointerResumedRef.current;

    resetPointer();

    // ضغطة وحدة على نفس الحرف: أول مرة بداية، ثاني مرة إلغاء
    if (sameCoord(start, end)) {
      if (resumed) {
        clearSelection();
        setAnnouncement("Selection cancelled.");
      } else {
        setStartCell(start);
        setPreviewCells([start]);
        setAnnouncement(
          `Selection started at letter ${grid[start[0]][start[1]]}. Select the last letter.`,
        );
      }
      return;
    }

    completeSelection(end[0], end[1], start);
  };

  const cancelDrag = () => {
    resetPointer();
    clearSelection();
  };

  // رفع الماوس/الإصبع خارج الشبكة
  const latestPointerUp = useRef(handlePointerUp);
  latestPointerUp.current = handlePointerUp;

  useEffect(() => {
    const onWindowPointerUp = (e) => latestPointerUp.current(e);
    window.addEventListener("pointerup", onWindowPointerUp);
    return () => window.removeEventListener("pointerup", onWindowPointerUp);
  }, []);

  // ========================================
  // CHECK
  // ========================================

  const checkAnswers = () => {
    // بعد Show Answer أو بعد ما كل شي صح: ما في شي نعمله
    if (locked) return;

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
      setFeedback(`Score ${correct} / ${total}. Well done!`);
      setAnnouncement(
        `Score ${correct} out of ${total}. All words are correct.`,
      );
      ValidationAlert.success(msg);
      return;
    }

    // ما بنقفل الشبكة: الطالب بيكمل الكلمات الناقصة أو بيعمل Undo
    setFeedback(`Score ${correct} / ${total}. Keep looking!`);
    setAnnouncement(
      `Score ${correct} out of ${total}. Continue finding the missing words.`,
    );
    ValidationAlert.warning(msg);
  };

  // ========================================
  // SHOW ANSWER
  // ========================================

  const showAnswers = () => {
    stopAudio();
    setFoundWords(words.map((word) => word.id));
    clearSelection();
    resetPointer();
    setFeedback("");
    setShowAnswer(true);
    setCheckCompleted(true);
    setAnnouncement("All answers shown.");
  };

  // ========================================
  // RESET: بيمسح الشبكة، سطر الجواب، الفيدباك، والسكور
  // ========================================

  const reset = () => {
    stopAudio();
    setFoundWords([]);
    clearSelection();
    resetPointer();
    setFeedback("");
    setShowAnswer(false);
    setCheckCompleted(false);
    setActiveCell([0, 0]);
    setAnnouncement("Activity reset. All answers are cleared.");

    requestAnimationFrame(() => {
      cellRefs.current["0-0"]?.focus();
    });
  };

  // ========================================
  // ANSWER LINE
  // ========================================

  const isSentenceComplete = foundWords.length === words.length;
  const handleSentenceClick = () => {
    if (isSentenceComplete) playSentenceAudio();
  };

  const handleSentenceKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSentenceClick();
    }
  };
  const displayedSentence = words.map((word) =>
    foundWords.includes(word.id)
      ? word.text.padEnd(SLOT_LENGTH, "")
      : "_".repeat(SLOT_LENGTH),
  );

  // ========================================
  // RENDER
  // ========================================

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
          sectionLetter="C"
          // questionNumber="1"
          title="Where do birds fly?"
          subTitle="Find the hidden words in order, then read the completed answer to “Where do birds fly?”"
        />

        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <div
            className="px-4 pt-4 pb-5"
            style={{ width: "fit-content", margin: "0 auto" }}
          >
            {/* ==============================
                GRID
            ============================== */}
            <div style={{ overflowX: "auto", maxWidth: "100%" }}>
              <div
                className="bg-[#daf5ff] rounded-[15px] p-2 sm:p-[15px] mb-4"
                role="grid"
                aria-label="Word search grid. Press Enter or Space on the first letter, use the arrow keys to move to the last letter, then press Enter again."
                style={{
                  userSelect: "none",
                  // width: "max-content",
                  touchAction: "none",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {grid.map((row, rIdx) => (
                  <div
                    key={rIdx}
                    role="row"
                    style={{
                      display: "flex",
                      gap: "clamp(0px, 0.2vw, 2px)",
                      // width: "fit-content",
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
                            focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb] focus-visible:z-10
                            ${
                              found
                                ? "bg-[#4caf50] text-white rounded-md"
                                : preview
                                  ? "bg-[#ffd54f] rounded-md font-bold"
                                  : "hover:bg-white/60 rounded-md"
                            }
                          `}
                          style={{
                            // أهداف كبيرة: أقل شي 28×40
                            width: "clamp(16px, 2.5vw, 25px)",
                            height: "clamp(22px, 3.5vw, 35px)",
                            fontSize: "clamp(12px, 1.8vw, 18px)",
                            outline: isStart ? "3px solid #2c5287" : undefined,
                          }}
                          onClick={(e) => {
                            // detail === 0 يعني click جاي من keyboard / screen reader
                            if (e.detail === 0)
                              handleCellClick(rIdx, cIdx, true);
                          }}
                          onKeyDown={(e) => handleCellKeyDown(e, rIdx, cIdx)}
                          onPointerDown={(e) =>
                            handlePointerDown(e, rIdx, cIdx)
                          }
                          onPointerMove={handlePointerMove}
                          onPointerEnter={() => handlePointerEnter(rIdx, cIdx)}
                          onPointerUp={handlePointerUp}
                          onPointerCancel={cancelDrag}
                          onDragStart={(e) => e.preventDefault()}
                        >
                          {cell}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* ==============================
                الترتيب الحالي للحروف المختارة / الفيدباك
            ============================== */}
            {/* <div
              aria-hidden="true"
              className="text-center mb-2 font-semibold text-[#2c5287]"
              style={{ minHeight: "32px", fontSize: "20px" }}
            >
              {previewCells.length > 0
                ? lettersOf(previewCells).join(" → ")
                : feedback}
            </div> */}

            {/* ==============================
                ANSWER LINE
            ============================== */}
            <div className="flex justify-center items-center">
              <img
                src={img1}
                 alt="A blue bird flying"
                // aria-hidden="true"
                style={{ width: "clamp(40px, 10vw, 100px)", height: "auto" }}
              />

              <input
                className="answer-input-CB-unit3-p5-q4 focus-visible:outline-4 focus-visible:outline-blue-600 focus-visible:outline-offset-2"
                value={displayedSentence.join(" ")}
                readOnly
                tabIndex={isSentenceComplete ? 0 : -1}
                aria-label={
                  isSentenceComplete
                    ? `Answer: ${sentence.text}. Press to listen again.`
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
                  cursor: isSentenceComplete ? "pointer" : undefined,
                }}
              />

              {playingSentence && (
                <span aria-hidden="true" style={{ marginLeft: "8px" }}>
                  <FaVolumeUp />
                </span>
              )}

              <img
                src={img2}
                 alt="A cloud and the sun in the sky"
                // aria-hidden="true"
                style={{ width: "clamp(40px, 10vw, 100px)", height: "auto" }}
              />
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <Button
          handleShowAnswer={showAnswers}
          handleStartAgain={reset}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
};

export default Unit2_Page5_Q3;

import React, { useEffect, useRef, useState } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex C 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex C 2.svg";
import Button from "../../WorkBookPages/Button";
import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";
// ========================================
// AUDIO
// ========================================

// ⚠️ عدّل المسار حسب مكان ملف الصوت عندك
import sentenceAudio from "../../../assets/audio/ClassBook/U 1/Page 8 - C/they like to eat grass.mp3";

// ========================================
// GRID
// ========================================

const grid = [
  [
    "d",
    "t",
    "h",
    "e",
    "y",
    "t",
    "a",
    "d",
    "g",
    "b",
    "n",
    "m",
    "v",
    "g",
    "l",
    "i",
    "k",
    "e",
    "x",
    "n",
    "s",
    "r",
    "o",
    "l",
    "t",
    "o",
  ],
  [
    "h",
    "f",
    "e",
    "a",
    "t",
    "b",
    "x",
    "a",
    "z",
    "b",
    "k",
    "g",
    "r",
    "a",
    "s",
    "s",
    "h",
    "a",
    "f",
    "g",
    "h",
    "r",
    "t",
    "f",
    "b",
    "i",
  ],
  ["p", "m", "o", "l", "k", "i"],
];

// ========================================
// WORDS
// (بالترتيب نفسه تبع الجملة)
// ========================================

const words = [
  {
    text: "they",
    coords: [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
    ],
  },

  {
    text: "like",
    coords: [
      [0, 14],
      [0, 15],
      [0, 16],
      [0, 17],
    ],
  },

  {
    text: "to",
    coords: [
      [0, 24],
      [0, 25],
    ],
  },

  {
    text: "eat",
    coords: [
      [1, 2],
      [1, 3],
      [1, 4],
    ],
  },

  {
    text: "grass",
    coords: [
      [1, 11],
      [1, 12],
      [1, 13],
      [1, 14],
      [1, 15],
    ],
  },
];

const SLOT_LENGTH = 8;

/*
  الصوت للجملة كاملة فقط
  بعد ما تتلاقى كل الكلمات.
*/
const sentence = {
  text: "they like to eat grass",
  audio: sentenceAudio,
};

// ========================================
// HELPERS
// ========================================

const sameCoord = (a, b) => a[0] === b[0] && a[1] === b[1];

const sameCoords = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((coord, index) => sameCoord(coord, b[index]));
};

const reverseCoords = (coords) => [...coords].reverse();

const getPath = (start, end) => {
  const [r1, c1] = start;
  const [r2, c2] = end;

  const rowDiff = r2 - r1;
  const colDiff = c2 - c1;

  const isStraight =
    rowDiff === 0 || colDiff === 0 || Math.abs(rowDiff) === Math.abs(colDiff);

  if (!isStraight) {
    return [];
  }

  const rowStep = rowDiff === 0 ? 0 : rowDiff > 0 ? 1 : -1;

  const colStep = colDiff === 0 ? 0 : colDiff > 0 ? 1 : -1;

  const length = Math.max(Math.abs(rowDiff), Math.abs(colDiff)) + 1;

  const path = Array.from({ length }, (_, index) => [
    r1 + rowStep * index,
    c1 + colStep * index,
  ]);

  /*
    الصفوف مش كلها بنفس الطول (الصف الثالث أقصر)،
    فنتأكد إن كل خلية بالمسار موجودة فعلاً.
  */
  const allExist = path.every(([r, c]) => grid[r] && grid[r][c] !== undefined);

  return allExist ? path : [];
};

// ========================================
// MAIN
// ========================================

export default function Unit1_Page5_Q4() {
  const [startCell, setStartCell] = useState(null);

  const [previewCells, setPreviewCells] = useState([]);

  const [foundWords, setFoundWords] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  /*
    true فقط:
    - لما يلاقي كل الكلمات
    - أو يعمل Show Answer
  */
  const [checkCompleted, setCheckCompleted] = useState(false);

  const [announcement, setAnnouncement] = useState("");

  /*
    رسالة ظاهرة للمستخدم تحت الشبكة
    (Great! / Try again / Removed)
  */
  const [feedback, setFeedback] = useState("");

  const [activeCell, setActiveCell] = useState([0, 0]);

  const pointerStartRef = useRef(null);
  const pointerCurrentRef = useRef(null);
  const pointerDraggingRef = useRef(false);
  const pointerResumedRef = useRef(false);
  const audioRef = useRef(null);

  const [playingSentence, setPlayingSentence] = useState(false);

  const cellRefs = useRef({});

  // ========================================
  // AUDIO
  // ========================================

  const stopAudio = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();

    audioRef.current.currentTime = 0;

    audioRef.current = null;

    setPlayingSentence(false);
  };

  const playSentenceAudio = () => {
    if (!sentence.audio) return;

    stopAudio();

    const audio = new Audio(sentence.audio);

    audioRef.current = audio;

    setPlayingSentence(true);

    audio.play().catch(() => {
      setPlayingSentence(false);
    });

    audio.onended = () => {
      setPlayingSentence(false);

      audioRef.current = null;
    };
  };

  // ========================================
  // CELL STATE
  // ========================================

  const isFoundCell = (r, c) => {
    return words.some(
      (word) =>
        foundWords.includes(word.text) &&
        word.coords.some(([wr, wc]) => wr === r && wc === c),
    );
  };

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
    /*
      الكلمات اللي انوجدت صح
      تبقى محمية لوحدها عن طريق isFoundCell.
    */

    if (checkCompleted || showAnswer || isFoundCell(r, c)) {
      return;
    }

    setStartCell([r, c]);

    setPreviewCells([[r, c]]);

    setFeedback("");

    setAnnouncement(
      `Selection started at letter ${grid[r][c]}. Move to the last letter and press Enter.`,
    );
  };

  // ========================================
  // COMPLETE
  // ========================================

  const completeSelection = (endR, endC, start = startCell) => {
    if (checkCompleted || showAnswer) {
      return;
    }

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
      setAnnouncement("That selection is not in a straight line.");

      setFeedback("Not quite. Try again!");

      clearSelection();

      return;
    }

    const matchedWord = words.find((word) => {
      /*
        الكلمة الموجودة صح
        ما بنضيفها مرة ثانية.
      */

      if (foundWords.includes(word.text)) {
        return false;
      }

      return (
        sameCoords(path, word.coords) ||
        sameCoords(path, reverseCoords(word.coords))
      );
    });

    if (matchedWord) {
      setFoundWords((prev) => [...prev, matchedWord.text]);

      /*
        آخر كلمة؟ يعني الجملة اكتملت.
      */

      const sentenceCompleted = foundWords.length + 1 === words.length;

      setAnnouncement(
        sentenceCompleted
          ? `${matchedWord.text} found. The sentence is complete: ${sentence.text}.`
          : `${matchedWord.text} found.`,
      );

      setFeedback(`Great! You found "${matchedWord.text}".`);

      if (sentenceCompleted) {
        playSentenceAudio();
      }
    } else {
      setAnnouncement("That is not one of the target words.");

      setFeedback("Not quite. Try again!");
    }

    clearSelection();
  };

  // ========================================
  // CLICK
  // (للـ keyboard و screen readers)
  // ========================================

  const handleCellClick = (r, c) => {
    if (checkCompleted || showAnswer) {
      return;
    }

    if (!startCell) {
      startSelection(r, c);
    } else {
      completeSelection(r, c);
    }
  };

  // ========================================
  // UNDO
  // ========================================

  const canUndo =
    !checkCompleted && !showAnswer && (startCell || foundWords.length > 0);

  const handleUndo = () => {
    if (!canUndo) {
      return;
    }

    // إذا في اختيار شغّال: نلغيه

    if (startCell) {
      resetPointer();

      clearSelection();

      setAnnouncement("Selection cancelled.");

      return;
    }

    // وإلا: نشيل آخر كلمة انلقت

    const lastWord = foundWords[foundWords.length - 1];

    stopAudio();

    setFoundWords((prev) => prev.slice(0, -1));

    setFeedback(`Removed "${lastWord}".`);

    setAnnouncement(`${lastWord} removed.`);
  };

  // ========================================
  // KEYBOARD
  // ========================================

  const handleCellKeyDown = (e, r, c) => {
    if (checkCompleted || showAnswer) {
      return;
    }

    let nextR = r;
    let nextC = c;

    // ==================================
    // ARROWS
    // ==================================

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

    // الصفوف مختلفة الطول: لا نطلع برا الصف الجديد

    nextC = Math.min(nextC, grid[nextR].length - 1);

    // إذا تحركنا

    if (nextR !== r || nextC !== c) {
      setActiveCell([nextR, nextC]);

      /*
        إذا في selection شغال
        حدث preview.
      */

      if (startCell) {
        const path = getPath(startCell, [nextR, nextC]);

        if (path.length > 0) {
          setPreviewCells(path);
        }
      }

      requestAnimationFrame(() => {
        cellRefs.current[`${nextR}-${nextC}`]?.focus();
      });

      return;
    }

    // ==================================
    // ENTER / SPACE
    // ==================================

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      e.stopPropagation();

      handleCellClick(r, c);

      return;
    }

    // ==================================
    // BACKSPACE = UNDO
    // ==================================

    if (e.key === "Backspace") {
      e.preventDefault();

      handleUndo();

      return;
    }

    // ==================================
    // ESC
    // ==================================

    if (e.key === "Escape" && startCell) {
      e.preventDefault();

      clearSelection();

      setAnnouncement("Selection cancelled.");
    }
  };

  // ========================================
  // POINTER DRAG
  // Mouse + iPad + Apple Pencil
  // ========================================

  const getCellFromPoint = (clientX, clientY) => {
    const element = document.elementFromPoint(clientX, clientY);

    if (!element) return null;

    const cell = element.closest?.("[data-wordsearch-cell='true']");

    if (!cell) return null;

    const r = Number(cell.dataset.row);
    const c = Number(cell.dataset.col);

    if (Number.isNaN(r) || Number.isNaN(c)) {
      return null;
    }

    return [r, c];
  };

  const handlePointerDown = (e, r, c) => {
    if (checkCompleted || showAnswer) {
      return;
    }

    /*
      إذا في اختيار شغّال (ضغطة أولى بدون سحب)
      نكمل منه لهاي الخلية.
    */

    const resumed = Boolean(startCell);

    if (!resumed && isFoundCell(r, c)) {
      return;
    }

    e.preventDefault();

    const start = resumed ? startCell : [r, c];

    pointerDraggingRef.current = true;

    pointerResumedRef.current = resumed;

    pointerStartRef.current = start;

    pointerCurrentRef.current = [r, c];

    setStartCell(start);

    if (!resumed) {
      setFeedback("");
    }

    const path = getPath(start, [r, c]);

    setPreviewCells(path.length > 0 ? path : [start]);
  };

  const handlePointerMove = (e) => {
    if (!pointerDraggingRef.current) return;

    const start = pointerStartRef.current;

    if (!start) return;

    const target = getCellFromPoint(e.clientX, e.clientY);

    if (!target) return;

    const [r, c] = target;

    pointerCurrentRef.current = [r, c];

    const path = getPath(start, [r, c]);

    if (path.length > 0) {
      setPreviewCells(path);
    }
  };

  const handlePointerEnter = (r, c) => {
    if (!pointerDraggingRef.current) return;

    const start = pointerStartRef.current;

    if (!start) return;

    pointerCurrentRef.current = [r, c];

    const path = getPath(start, [r, c]);

    if (path.length > 0) {
      setPreviewCells(path);
    }
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

    /*
      ضغطة وحدة على نفس الحرف:
      - أول مرة: نبدأ الاختيار وننتظر آخر حرف
      - ثاني مرة: إلغاء
    */

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

  /*
    إذا المستخدم رفع الماوس/الإصبع خارج الشبكة،
    نكمل السحب من آخر خلية وصلها.
  */

  const latestPointerUp = useRef(handlePointerUp);

  latestPointerUp.current = handlePointerUp;

  useEffect(() => {
    const onWindowPointerUp = (e) => latestPointerUp.current(e);

    window.addEventListener("pointerup", onWindowPointerUp);

    return () => {
      window.removeEventListener("pointerup", onWindowPointerUp);
    };
  }, []);

  // ========================================
  // CLEANUP
  // ========================================

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();

        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  // ========================================
  // CHECK
  // ========================================

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (foundWords.length === 0) {
      ValidationAlert.info(
        "Oops!",
        "Please find at least one word before checking.",
      );

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

    // ========================================
    // ALL CORRECT
    // ========================================

    if (correct === total) {
      setCheckCompleted(true);

      setAnnouncement("All words are correct.");

      ValidationAlert.success(msg);

      return;
    }

    /*
      ما بنقفل الشبكة هون.
      المستخدم يقدر يكمل الكلمات الناقصة.
    */

    ValidationAlert.warning(msg);

    setAnnouncement(
      `Score ${correct} out of ${total}. Continue finding the missing words.`,
    );
  };

  // ========================================
  // SHOW ANSWER
  // ========================================

  const showAnswers = () => {
    stopAudio();

    setFoundWords(words.map((word) => word.text));

    clearSelection();

    resetPointer();

    setFeedback("");

    setShowAnswer(true);

    setCheckCompleted(true);

    setAnnouncement("All answers shown.");
  };

  // ========================================
  // RESET
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

    setAnnouncement("Activity reset.");

    requestAnimationFrame(() => {
      cellRefs.current["0-0"]?.focus();
    });
  };

  // ========================================
  // ANSWER LINE
  // ========================================

  /*
    الجملة تعتبر كاملة لما تتلاقى كل الكلمات
    (أو بعد Show Answer).
  */

  const isSentenceComplete = foundWords.length === words.length;

  const handleSentenceClick = () => {
    if (!isSentenceComplete) {
      return;
    }

    playSentenceAudio();
  };

  const handleSentenceKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      handleSentenceClick();
    }
  };

  const displayedSentence = words.map((word) =>
    foundWords.includes(word.text)
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
          title="What do lambs like to eat?"
          subTitle="Find the hidden words in order, then read the completed answer to “What do lambs like to eat?"
        />

        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          {/* Grid Wrapper */}
          <div
            className="px-4 pt-4 pb-5"
            style={{ width: "fit-content", margin: "0 auto" }}
          >
            {/* ==============================
                GRID
            ============================== */}

            <div
              className="bg-[#daf5ff] rounded-[15px] p-2 sm:p-[15px] mb-10"
              role="grid"
              aria-label="Word search grid. Use arrow keys to move. Press Enter or Space on the first and last letter."
              style={{
                userSelect: "none",
                width: "max-content",
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
                    gap: "clamp(1px, 0.3vw, 4px)",
                    width: "fit-content",
                  }}
                >
                  {row.map((cell, cIdx) => {
                    const preview = isPreviewCell(rIdx, cIdx);

                    const found = isFoundCell(rIdx, cIdx);

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
                        tabIndex={
                          showAnswer || checkCompleted
                            ? -1
                            : isActiveCell
                              ? 0
                              : -1
                        }
                        aria-label={`Row ${rIdx + 1}, column ${
                          cIdx + 1
                        }, letter ${cell}${
                          found ? ", found word" : preview ? ", selected" : ""
                        }`}
                        aria-selected={preview || found}
                        onFocus={() => {
                          setActiveCell([rIdx, cIdx]);
                        }}
                        className={`
                          relative
                          flex items-center justify-center mb-2
                          cursor-pointer
                          transition
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c5287]
                          ${
                            found
                              ? "bg-[#4caf50] text-white rounded-sm"
                              : preview
                                ? "bg-[#ffd54f] rounded-sm"
                                : ""
                          }
                        `}
                        style={{
                          width: "clamp(16px, 2.5vw, 25px)",
                          height: "clamp(22px, 3.5vw, 35px)",
                          fontSize: "clamp(12px, 1.8vw, 18px)",
                        }}
                        onClick={(e) => {
                          // detail === 0 يعني click جاي من keyboard / screen reader
                          if (e.detail === 0) {
                            handleCellClick(rIdx, cIdx);
                          }
                        }}
                        onKeyDown={(e) => handleCellKeyDown(e, rIdx, cIdx)}
                        onPointerDown={(e) => handlePointerDown(e, rIdx, cIdx)}
                        onPointerMove={handlePointerMove}
                        onPointerEnter={() => handlePointerEnter(rIdx, cIdx)}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={cancelDrag}
                        onDragStart={(e) => e.preventDefault()}
                      >
                        {cell}

                        {/* منطقة لمس أكبر بدون ما تتغير الأبعاد المرئية */}
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

            {/* الترتيب الحالي للحروف المختارة / الفيدباك */}
            {/* <div
              aria-hidden="true"
              className="text-center mb-2 font-semibold text-[#2c5287]"
              style={{ minHeight: "24px" }}
            >
              {previewCells.length > 0
                ? previewCells.map(([r, c]) => grid[r][c]).join(" → ")
                : feedback}

              {playingSentence && (
                <span aria-hidden="true" style={{ marginLeft: "8px" }}>
                  <FaVolumeUp />
                </span>
              )}
            </div> */}

            {/* ==============================
                ANSWER LINE
            ============================== */}

            <div className="flex justify-center items-center">
              <img
                src={img1}
                alt="start"
                style={{
                  width: "clamp(40px, 10vw, 100px)",
                  height: "auto",
                }}
              />

              <input
                className="answer-input-CB-unit3-p5-q4"
                value={displayedSentence.join(" ")}
                readOnly
                aria-label={
                  isSentenceComplete
                    ? `Answer: ${sentence.text}. Press to listen again.`
                    : "Answer"
                }
                onClick={handleSentenceClick}
                onKeyDown={handleSentenceKeyDown}
                style={{
                  fontFamily: "monospace",
                  border: playingSentence ||isSentenceComplete ? "2px solid green" : "",
                  backgroundColor: playingSentence ||isSentenceComplete ? "#e6f4ea" : "",
                  borderRadius: playingSentence ||isSentenceComplete ? "5px" : "",
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
                alt="end"
                style={{
                  width: "clamp(40px, 10vw, 100px)",
                  height: "auto",
                }}
              />
            </div>
          </div>
        </div>


        {/* ==============================
            BUTTONS
        ============================== */}

        <Button
          handleShowAnswer={showAnswers}
          handleStartAgain={reset}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
}

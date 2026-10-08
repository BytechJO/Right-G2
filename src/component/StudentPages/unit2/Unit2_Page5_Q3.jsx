import React, { useEffect, useRef, useState } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 14/Ex C 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 14/Ex C 2.svg";
import Button from "../../WorkBookPages/Button";
import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";

// ========================================
// AUDIO
// ========================================

// ⚠️ عدّل المسار حسب مكان ملف الصوت عندك
import sentenceAudio from "../../../assets/audio/ClassBook/U 2/Page 14 - C/the birds fly in the sky.mp3";

// ========================================
// GRID
// ========================================
const grid = [
  [
    "x",
    "t",
    "h",
    "e",
    "x",
    "y",
    "s",
    "b",
    "i",
    "r",
    "d",
    "s",
    "x",
    "e",
    "r",
    "f",
    "l",
    "y",
    "q",
    "n",
    "m",
    "i",
    "z",
    "o",
    "p",
  ],
  [
    "i",
    "n",
    "m",
    "k",
    "i",
    "l",
    "o",
    "p",
    "x",
    "e",
    "f",
    "t",
    "h",
    "e",
    "i",
    "c",
    "k",
    "m",
    "k",
    "m",
    "k",
    "l",
    "o",
    "a",
    "b",
  ],
  ["f", "n", "d", "s", "s", "b", "v", "r", "w", "s", "k", "y", "c", "s", "j"],
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
// HELPERS (خارج الكومبوننت)
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

// الخلية اللي تحت نقطة معينة بالشاشة (ماوس / لمس / قلم)
const getCellFromPoint = (clientX, clientY) => {
  const element = document.elementFromPoint(clientX, clientY);

  const cell = element?.closest?.("[data-wordsearch-cell='true']");

  if (!cell) return null;

  const r = Number(cell.dataset.row);
  const c = Number(cell.dataset.col);

  return Number.isNaN(r) || Number.isNaN(c) ? null : [r, c];
};

// ========================================
// MAIN
// ========================================

export default function Unit2_Page5_Q3() {
  // أول حرف مختار (بانتظار الحرف الأخير)
  const [startCell, setStartCell] = useState(null);

  const [previewCells, setPreviewCells] = useState([]);

  // 🔁 بنخزّن id الكلمة (مش النص) عشان الكلمتين المكررتين (the) ما يختلطوا
  const [foundWords, setFoundWords] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  /*
    true فقط:
    - لما يلاقي كل الكلمات
    - أو يعمل Show Answer
  */
  const [checkCompleted, setCheckCompleted] = useState(false);

  const [announcement, setAnnouncement] = useState("");

  const [activeCell, setActiveCell] = useState([0, 0]);

  // حالة الضغطة الحالية بالماوس / اللمس: { active, start, current }
  const pointerRef = useRef({ active: false, start: null, current: null });

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

  // وقف الصوت إذا سكرت الصفحة
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();

        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  // ========================================
  // CELL STATE
  // ========================================

  // 🔁 بالـ id: كل the بتتلوّن لحالها
  const isFoundCell = (r, c) => {
    return words.some(
      (word) =>
        foundWords.includes(word.id) &&
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
    pointerRef.current = { active: false, start: null, current: null };
  };

  // نحدّث المعاينة بدون re-render إذا ما تغيّرت
  const updatePreview = (path, fallback) => {
    const next = path.length > 0 ? path : [fallback];

    setPreviewCells((prev) => (sameCoords(prev, next) ? prev : next));
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

      clearSelection();

      return;
    }

    const matchedWord = words.find((word) => {
      /*
        🔁 بالـ id: الكلمة الموجودة صح ما بنضيفها مرة ثانية،
        بس the التانية لساتها متاحة.
      */

      if (foundWords.includes(word.id)) {
        return false;
      }

      return (
        sameCoords(path, word.coords) ||
        sameCoords(path, reverseCoords(word.coords))
      );
    });

    if (matchedWord) {
      // 🔁 بنخزّن الـ id
      setFoundWords((prev) => [...prev, matchedWord.id]);

      /*
        آخر كلمة؟ يعني الجملة اكتملت.
      */

      const sentenceCompleted = foundWords.length + 1 === words.length;

      setAnnouncement(
        sentenceCompleted
          ? `${matchedWord.text} found. The sentence is complete: ${sentence.text}.`
          : `${matchedWord.text} found.`,
      );

      if (sentenceCompleted) {
        playSentenceAudio();
      }
    } else {
      setAnnouncement("That is not one of the target words.");
    }

    // ✅ دايماً بنفضّي الاختيار بعد كل محاولة
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

    // 🔁 وإلا: نشيل آخر كلمة انلقت (بالـ id) ونعلن نصها
    const lastId = foundWords[foundWords.length - 1];

    const lastText = words.find((word) => word.id === lastId)?.text ?? "";

    stopAudio();

    setFoundWords((prev) => prev.slice(0, -1));

    setAnnouncement(`${lastText} removed.`);
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
  // POINTER: Mouse + Touch + Pen
  //
  // - سحب من حرف لحرف مختلف: بيكمل الكلمة مباشرة عند الإفلات
  // - ضغطة وحدة: أول حرف، أو آخر حرف إذا في أول حرف مختار
  // - القرار بيصير عند الإفلات، فأي حرف معلّق ما بيخطف السحب الجديد
  // ========================================

  const handleGridPointerDown = (e) => {
    if (checkCompleted || showAnswer) return;

    // الزر الأيسر بس بالماوس
    if (e.pointerType === "mouse" && e.button !== 0) return;

    // إصبع تاني أثناء سحب شغّال: نتجاهله
    if (pointerRef.current.active) return;

    const cell = getCellFromPoint(e.clientX, e.clientY);

    if (!cell) return;

    // كلمة لاقيناها: ما بنبدأ منها اختيار جديد
    if (isFoundCell(cell[0], cell[1])) return;

    e.preventDefault();

    // الشبكة بتمسك المؤشر: الإفلات برا الشبكة بيوصل لنفس الـ handler
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ما في مشكلة إذا المتصفح ما دعمها */
    }

    pointerRef.current = { active: true, start: cell, current: cell };

    setActiveCell(cell);

    // إذا في أول حرف معلّق منخلّي معاينته لحد ما يتحرك المؤشر
    if (!startCell) {
      setPreviewCells([cell]);
    }
  };

  const handleGridPointerMove = (e) => {
    if (checkCompleted || showAnswer) return;

    const cell = getCellFromPoint(e.clientX, e.clientY);

    if (!cell) return;

    const pointer = pointerRef.current;

    // أثناء السحب: معاينة المسار من نقطة الضغط
    if (pointer.active) {
      pointer.current = cell;

      updatePreview(getPath(pointer.start, cell), pointer.start);

      return;
    }

    // ماوس بدون ضغط وفي أول حرف مختار: معاينة المسار لحد الحرف تحت المؤشر
    if (startCell && e.pointerType === "mouse") {
      updatePreview(getPath(startCell, cell), startCell);
    }
  };

  const handleGridPointerUp = (e) => {
    const pointer = pointerRef.current;

    if (!pointer.active) return;

    e.preventDefault();

    const start = pointer.start;

    const end =
      getCellFromPoint(e.clientX, e.clientY) || pointer.current || start;

    resetPointer();

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ما في مشكلة */
    }

    // ===== سحب لحرف مختلف: بيكمل الكلمة مباشرة =====
    if (!sameCoord(start, end)) {
      completeSelection(end[0], end[1], start);

      return;
    }

    // ===== ضغطة وحدة =====

    // في أول حرف مختار من قبل: هاي آخر حرف (أو إلغاء إذا نفس الحرف)
    if (startCell) {
      completeSelection(start[0], start[1], startCell);

      return;
    }

    // أول ضغطة: نبدأ الاختيار وننتظر آخر حرف
    startSelection(start[0], start[1]);
  };

  const handleGridPointerCancel = () => {
    resetPointer();

    clearSelection();
  };

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

    // 🔁 كل الـ ids (بما فيهم the1 و the2)
    setFoundWords(words.map((word) => word.id));

    clearSelection();

    resetPointer();

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

  // 🔁 كل خانة بتتعبّى بالـ id تبع كلمتها: the الأولى بخانتها والتانية بخانتها
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
          title="Where do birds fly?"
          subTitle="Find the hidden words in order, then read the completed answer to “Where do birds fly?”"
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
              onPointerDown={handleGridPointerDown}
              onPointerMove={handleGridPointerMove}
              onPointerUp={handleGridPointerUp}
              onPointerCancel={handleGridPointerCancel}
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
                          // (الماوس واللمس بيتعاملوا معهم الـ pointer handlers فوق)
                          if (e.detail === 0) {
                            handleCellClick(rIdx, cIdx);
                          }
                        }}
                        onKeyDown={(e) => handleCellKeyDown(e, rIdx, cIdx)}
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

            {/* ==============================
                ANSWER LINE
            ============================== */}

            <div className="flex justify-center items-center">
              <img
                src={img1}
                alt="A cartoon lamb"
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
                alt="A patch of green grass"
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

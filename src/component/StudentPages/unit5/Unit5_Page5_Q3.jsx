import React, { useEffect, useRef, useState } from "react";
import "./Unit5_Page5_Q3.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";

import img1 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 44/Ex B 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 44/Ex B 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 44/Ex B 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 44/Ex B 4.svg";
import img5 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 44/Asset 5.svg";
import img6 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 44/Ex B 6.svg";
import img7 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 44/Ex B 7.svg";
import img8 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 44/Ex B 8.svg";

import soupAudio from "../../../assets/audio/ClassBook/U 5/Page 44 - B/Item_001_soup.mp3";
import chickenAudio from "../../../assets/audio/ClassBook/U 5/Page 44 - B/Item_002_chicken.mp3";
import fruitAudio from "../../../assets/audio/ClassBook/U 5/Page 44 - B/Item_003_fruit.mp3";
import hamburgerAudio from "../../../assets/audio/ClassBook/U 5/Page 44 - B/Item_004_hamburger.mp3";
import stewAudio from "../../../assets/audio/ClassBook/U 5/Page 44 - B/Item_005_stew.mp3";
import riceAudio from "../../../assets/audio/ClassBook/U 5/Page 44 - B/Item_006_rice.mp3";
import fishAudio from "../../../assets/audio/ClassBook/U 5/Page 44 - B/Item_007_fish.mp3";
import meatAudio from "../../../assets/audio/ClassBook/U 5/Page 44 - B/Item_008_meat.mp3";

// 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
// ⚠️ عدّل المسار حسب مكان الملف عندك
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";

// ========================================
// GRID
// ========================================

const grid = [
  ["k", "m", "e", "a", "t", "o", "e", "c", "s"],
  ["r", "e", "r", "c", "i", "u", "k", "r", "t"],
  ["c", "h", "i", "c", "k", "e", "n", "i", "e"],
  ["i", "s", "e", "r", "r", "i", "c", "e", "w"],
  ["s", "c", "f", "i", "s", "h", "u", "t", "c"],
  ["f", "w", "c", "r", "o", "a", "m", "a", "i"],
  ["h", "a", "m", "b", "u", "r", "g", "e", "r"],
  ["e", "t", "k", "r", "p", "i", "c", "s", "c"],
  ["r", "s", "f", "r", "u", "i", "t", "s", "s"],
];

// ========================================
// WORDS
// ⚠️ الـ alt مكتوب من أسماء الكلمات وأنا ما شفت الصور، فتأكدي إنو كل وصف بيطابق صورته
// (الاسم ظاهر جنب الصورة، فذكره بالوصف ما بيكشف شي)
// ========================================

const words = [
  {
    id: "soup",
    text: "soup",
    src: img1,
    alt: "A bowl of hot soup.",
    audio: soupAudio,
    coords: [
      [4, 4],
      [5, 4],
      [6, 4],
      [7, 4],
    ],
  },
  {
    id: "chicken",
    text: "chicken",
    src: img2,
    alt: "A piece of cooked chicken.",
    audio: chickenAudio,
    coords: [
      [2, 0],
      [2, 1],
      [2, 2],
      [2, 3],
      [2, 4],
      [2, 5],
      [2, 6],
    ],
  },
  {
    id: "fruit",
    text: "fruit",
    src: img3,
    alt: "A plate of colorful fruit.",
    audio: fruitAudio,
    coords: [
      [8, 2],
      [8, 3],
      [8, 4],
      [8, 5],
      [8, 6],
    ],
  },
  {
    id: "hamburger",
    text: "hamburger",
    src: img4,
    alt: "A hamburger in a bun.",
    audio: hamburgerAudio,
    coords: [
      [6, 0],
      [6, 1],
      [6, 2],
      [6, 3],
      [6, 4],
      [6, 5],
      [6, 6],
      [6, 7],
      [6, 8],
    ],
  },
  {
    id: "stew",
    text: "stew",
    src: img5,
    alt: "A pot of stew.",
    audio: stewAudio,
    coords: [
      [0, 8],
      [1, 8],
      [2, 8],
      [3, 8],
    ],
  },
  {
    id: "rice",
    text: "rice",
    src: img6,
    alt: "A bowl of rice.",
    audio: riceAudio,
    coords: [
      [3, 4],
      [3, 5],
      [3, 6],
      [3, 7],
    ],
  },
  {
    id: "fish",
    text: "fish",
    src: img7,
    alt: "A fish on a plate.",
    audio: fishAudio,
    coords: [
      [4, 2],
      [4, 3],
      [4, 4],
      [4, 5],
    ],
  },
  {
    id: "meat",
    text: "meat",
    src: img8,
    alt: "A piece of meat.",
    audio: meatAudio,
    coords: [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
    ],
  },
];

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

// المسار المستقيم بين خليتين (أفقي / عمودي / قطري)، أو [] إذا مش مستقيم
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

export default function Unit5_Page5_Q3() {
  // أول حرف مختار (بانتظار الحرف الأخير)
  const [startCell, setStartCell] = useState(null);

  const [previewCells, setPreviewCells] = useState([]);

  // ids الكلمات اللي انلقت (بالترتيب اللي انلقت فيه)
  const [foundWords, setFoundWords] = useState([]);

  // بعد Check: بيظهر ✕ على الصور اللي كلماتها لسا ما انلقت
  const [showMarks, setShowMarks] = useState(false);

  const [showAnswer, setShowAnswer] = useState(false);

  // true لما كل الكلمات تنلقى بعد Check، أو بعد Show Answer
  const [checkCompleted, setCheckCompleted] = useState(false);

  const [announcement, setAnnouncement] = useState("");

  const [activeCell, setActiveCell] = useState([0, 0]);

  // أي صورة صوتها شغّال
  const [playingId, setPlayingId] = useState(null);

  // حالة الضغطة الحالية بالماوس / اللمس: { active, start, current }
  const pointerRef = useRef({ active: false, start: null, current: null });

  const cellRefs = useRef({});

  // مالك الصوت: بيعرّف الـ audioManager إنو هاد الصوت تابع للكومبوننت
  const audioOwner = useRef({}).current;

  // ========================================
  // AUDIO
  // ========================================

  const stopSound = () => {
    stopGlobalAudio(audioOwner);
    setPlayingId(null);
  };

  // playGlobalAudio بيوقف أي صوت ثاني شغّال قبل ما يشغّل هاد
  const playWord = (word) => {
    console.log("playWord", word.id, word.audio);
    if (!word.audio) return;

    playGlobalAudio(word.audio, {
      owner: audioOwner,
      onFinish: () => setPlayingId((prev) => (prev === word.id ? null : prev)),
    });

    setPlayingId(word.id);
  };

  // وقف الصوت إذا سكرت الصفحة
  useEffect(() => () => stopGlobalAudio(audioOwner), [audioOwner]);

  // فوكس بالتاب على الصورة = شغّل صوتها (الماوس/اللمس بيروحوا على onClick)
  const onCardFocus = (e, word) => {
    if (e.currentTarget.matches(":focus-visible")) playWord(word);
  };

  // ========================================
  // CELL STATE
  // ========================================

  // الكلمات بتتقاطع (مثلاً soup مع fish ومع hamburger)،
  // فالخلية المشتركة بتضل خضرا وبنسمح بالاختيار عبر الكلمات اللي انلقت
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

  // نحدّث المعاينة بدون re-render إذا ما تغيّرت
  const updatePreview = (path, fallback) => {
    const next = path.length > 0 ? path : [fallback];

    setPreviewCells((prev) => (sameCoords(prev, next) ? prev : next));
  };

  const matchWord = (path, list) =>
    list.find(
      (word) =>
        sameCoords(path, word.coords) ||
        sameCoords(path, reverseCoords(word.coords)),
    );

  // ========================================
  // START
  // ========================================

  const startSelection = (r, c) => {
    if (checkCompleted || showAnswer) {
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

    // الاتجاهين مقبولين (من الأول للآخر أو بالعكس)
    const matchedWord = matchWord(
      path,
      words.filter((word) => !foundWords.includes(word.id)),
    );

    if (matchedWord) {
      const count = foundWords.length + 1;

      setFoundWords((prev) =>
        prev.includes(matchedWord.id) ? prev : [...prev, matchedWord.id],
      );

      setAnnouncement(
        count === words.length
          ? `${matchedWord.text} found. ${count} of ${words.length} words found. All words are found. Press Check Answer.`
          : `${matchedWord.text} found. ${count} of ${words.length} words found.`,
      );
    } else {
      const already = matchWord(
        path,
        words.filter((word) => foundWords.includes(word.id)),
      );

      setAnnouncement(
        already
          ? `${already.text} was already found.`
          : "That is not one of the target words.",
      );
    }

    // دايماً بنفضّي الاختيار بعد كل محاولة
    clearSelection();
  };

  // ========================================
  // CLICK (للـ keyboard و screen readers)
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
    const lastId = foundWords[foundWords.length - 1];

    const lastText = words.find((word) => word.id === lastId)?.text ?? "";

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

    nextC = Math.min(nextC, grid[nextR].length - 1);

    // إذا تحركنا
    if (nextR !== r || nextC !== c) {
      setActiveCell([nextR, nextC]);

      // إذا في اختيار شغّال: حدّث معاينة المسار
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

    stopSound();

    if (foundWords.length === 0) {
      const msg = "Please find at least one word before checking.";

      ValidationAlert.info("Oops!", msg);

      setAnnouncement(msg);

      return;
    }

    clearSelection();

    resetPointer();

    const total = words.length;

    const correct = foundWords.length;

    const missing = words
      .filter((word) => !foundWords.includes(word.id))
      .map((word) => word.text);

    // ✕ على الصور اللي كلماتها لسا ما انلقت
    setShowMarks(true);

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

      setAnnouncement(`Score ${correct} out of ${total}. All words are found.`);

      ValidationAlert.success(msg);

      return;
    }

    /*
      ما بنقفل الشبكة هون.
      المستخدم يقدر يكمل الكلمات الناقصة.
    */

    ValidationAlert.warning(msg);

    setAnnouncement(
      `Score ${correct} out of ${total}. Not found yet: ${missing.join(
        ", ",
      )}. Continue finding the missing words.`,
    );
  };

  // ========================================
  // SHOW ANSWER
  // ========================================

  const showAnswers = () => {
    stopSound();

    setFoundWords(words.map((word) => word.id));

    clearSelection();

    resetPointer();

    setShowMarks(false);

    setShowAnswer(true);

    setCheckCompleted(true);

    setAnnouncement(
      "All answers shown. The path of every word is highlighted in the grid.",
    );
  };

  // ========================================
  // RESET
  // ========================================

  const reset = () => {
    stopSound();

    setFoundWords([]);

    clearSelection();

    resetPointer();

    setShowMarks(false);

    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveCell([0, 0]);

    setAnnouncement("Exercise reset. All paths and found words are cleared.");

    requestAnimationFrame(() => {
      cellRefs.current["0-0"]?.focus();
    });
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="wordsearch-wrapper">
      {/* Screen Reader */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>

      <div className="page8-wrapper">
        <div className="div-forall" style={{ marginBottom: "30px" }}>
          <ExerciseHeader
            sectionLetter="B"
            title="Find and circle."
            subTitle="Scan one row at a time, then select each target word from its first letter to its last."
          />

          <p id="u5p5q3-help" className="sr-only">
            Use the arrow keys to move between the letters in the grid. Press
            Enter or Space on the first letter and again on the last letter of a
            word. Words can be read forward or backward. Press Escape to cancel
            a selection. Then press Tab to reach the pictures. Each picture
            plays its word when it is focused, and Enter or Space plays it
            again. A picture turns green when its word is found.
          </p>

          <div className="container-CB-unit5-p5-q3">
            {/* ==============================
                GRID
            ============================== */}

            <div
              className="grid-CB-unit5-p5-q3"
              role="grid"
              aria-label="Word search grid. Use arrow keys to move. Press Enter or Space on the first and last letter."
              aria-describedby="u5p5q3-help"
              style={{ userSelect: "none", touchAction: "none" }}
              onPointerDown={handleGridPointerDown}
              onPointerMove={handleGridPointerMove}
              onPointerUp={handleGridPointerUp}
              onPointerCancel={handleGridPointerCancel}
              onDragStart={(e) => e.preventDefault()}
            >
              {grid.map((row, rIdx) => (
                <div key={rIdx} role="row" className="row-CB-unit5-p5-q3">
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
                        onFocus={() => setActiveCell([rIdx, cIdx])}
                        className={`cell-CB-unit5-p5-q3 CB-u5p5q3-cell ${
                          preview ? "highlight" : ""
                        } ${found ? "found" : ""}`}
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
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* ==============================
                PICTURES (كل صورة زر: صوت + إيفيكت لما تنلقى)
            ============================== */}

            <div
              className="word-btn-CB-unit5-p5-q3"
              role="group"
              aria-label="Words to find"
            >
              {words.map((w, i) => {
                const found = foundWords.includes(w.id);
                const isPlaying = playingId === w.id;

                return (
                  <div
                    key={w.id}
                    className="word-label-wrapper-CB-unit5-p5-q3"
                    onClick={() => playWord(w)}
                  >
                    <button
                      type="button"
                      className={`word-label-CB-unit5-p5-q3 CB-u5p5q3-card ${
                        found ? "done is-found" : ""
                      } ${isPlaying ? "is-playing" : ""}`}
                      aria-label={`Word ${i + 1}: ${w.text}. ${w.alt} ${
                        found ? "Found in the grid." : "Not found yet."
                      } Press to listen.`}
                      onFocus={(e) => onCardFocus(e, w)}
                    >
                      <p aria-hidden="true">
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "700",
                            color: "rgb(44, 82, 135)",
                          }}
                        >
                          {i + 1}
                        </span>{" "}
                        {w.text}
                      </p>

                      <img
                        src={w.src}
                        alt=""
                        aria-hidden="true"
                        draggable="false"
                        style={{ height: "100px", width: "auto" }}
                      />

                      {/* 🔊 أيقونة السبيكر */}
                      <span
                        className={`CB-u5p5q3-speaker ${
                          isPlaying ? "playing" : ""
                        }`}
                        aria-hidden="true"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          fill="currentColor"
                        >
                          <path d="M3 9v6h4l5 5V4L7 9H3z" />
                          <path
                            d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>

                      {/* ✅ علامة: الكلمة انلقت */}
                      {/* {found && (
                        <span className="CB-u5p5q3-badge" aria-hidden="true">
                          ✓
                        </span>
                      )} */}
                    </button>

                    {/* ✖ إكس داخل دائرة للكلمات اللي لسا ما انلقت (بعد Check) */}
                    {showMarks && !found && (
                      <span
                        className="wrong-x-circle-CB-unit5-p5-q3"
                        aria-hidden="true"
                      >
                        ✕
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="action-buttons-container">
        <button type="button" className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>

        <button
          type="button"
          className="show-answer-btn swal-continue"
          onClick={showAnswers}
        >
          Show Answer
        </button>

        <button
          type="button"
          className="check-button2"
          style={
            showAnswer && checkCompleted ? { cursor: "not-allowed" } : undefined
          }
          onClick={checkAnswers}
        >
          Check Answer ✓
        </button>
      </div>
    </div>
  );
}

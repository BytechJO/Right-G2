/* eslint-disable react-refresh/only-export-components */
import React, { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";

import imgDown1 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 36/Ex A 1.svg";
import imgAcross1 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 36/Ex A 2.svg";
import imgDown2 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 36/Ex A 3.svg";
import imgAcross2 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 36/Ex A 4.svg";
import imgDown3 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 36/Ex A 5.svg";
import imgAcross3 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 36/Ex A 6.svg";
import imgDown4 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 36/Ex A 7.svg";
import imgAcross4 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 36/Ex A 8.svg";

// 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";

import downSound from "../../../assets/audio/ClassBook/U 4/Page 36 - A/Item_001_Down.mp3";
import acrossSound from "../../../assets/audio/ClassBook/U 4/Page 36 - A/Item_002_Across.mp3";
import "./Review4_Page1_Q1.css";
import ExerciseHeader from "../../ExerciseHeader";
// 🔊 true = الصوت يشتغل لما الطالب يوقف على العنوان بالتاب
const PLAY_ON_FOCUS = false;
/* ================= DATA ================= */

const STRUCTURE = [
  ["1", "W", "W", "W", "W", "W", "W", "W", "2", "W", "W", "W", "B", "B", "B"],
  ["W", "B", "B", "B", "B", "B", "B", "B", "W", "B", "B", "B", "B", "B", "B"],
  ["W", "B", "B", "B", "B", "B", "B", "B", "W", "B", "B", "B", "B", "B", "B"],
  ["W", "B", "B", "B", "B", "B", "B", "B", "W", "B", "3", "B", "B", "B", "B"],
  ["W", "B", "B", "B", "B", "B", "4", "W", "W", "W", "W", "W", "W", "5", "B"],
  ["B", "B", "B", "B", "B", "B", "B", "B", "W", "B", "W", "B", "B", "W", "B"],
  ["B", "B", "B", "B", "B", "B", "B", "B", "W", "B", "W", "B", "6", "W", "W"],
  ["B", "B", "B", "B", "B", "B", "B", "B", "W", "B", "W", "B", "B", "W", "B"],
  ["B", "B", "B", "B", "B", "B", "B", "B", "W", "B", "W", "B", "B", "W", "B"],
  ["B", "B", "B", "B", "B", "B", "B", "B", "W", "B", "B", "B", "B", "B", "B"],
  ["B", "B", "B", "B", "B", "B", "B", "B", "W", "B", "B", "B", "B", "B", "B"],
  ["B", "B", "B", "B", "7", "W", "W", "W", "W", "B", "B", "B", "B", "B", "B"],
  ["B", "B", "B", "B", "B", "B", "B", "B", "W", "B", "B", "B", "B", "B", "B"],
];

const ROWS = STRUCTURE.length;
const COLS = STRUCTURE[0].length;

// ⚠️ الـ alt أوصاف عامة بدون اسم المهنة (لأنو اسمها هو الجواب).
// الأوصاف تخمين، راجعها مع الصور الفعلية وعدّلها.
const SOLUTION = [
  {
    num: 1,
    direction: "Down",
    answer: "pilot",
    img: imgDown1,
    alt: "a person in a uniform and cap flying an aeroplane",
  },
  {
    num: 2,
    direction: "Down",
    answer: "policeofficer",
    img: imgDown2,
    alt: "a person in a uniform and hat keeping people safe in the street",
  },
  {
    num: 3,
    direction: "Down",
    answer: "farmer",
    img: imgDown3,
    alt: "a person working outside on a farm",
  },
  {
    num: 5,
    direction: "Down",
    answer: "clerk",
    img: imgDown4,
    alt: "a person behind a counter in a shop, helping customers pay",
  },
  {
    num: 1,
    direction: "Across",
    answer: "photographer",
    img: imgAcross1,
    alt: "a person holding a camera and taking a picture",
  },
  {
    num: 4,
    direction: "Across",
    answer: "mechanic",
    img: imgAcross2,
    alt: "a person in work clothes fixing the engine of a car",
  },
  {
    num: 6,
    direction: "Across",
    answer: "vet",
    img: imgAcross3,
    alt: "a person in a white coat looking after a sick animal",
  },
  {
    num: 7,
    direction: "Across",
    answer: "nurse",
    img: imgAcross4,
    alt: "a person in a uniform caring for a sick person in a hospital",
  },
];

const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");

/* ================= DERIVED DATA (مرة وحدة، خارج الكومبوننت) ================= */

const findStart = (num) => {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (STRUCTURE[r][c] === String(num)) return { r, c };
    }
  }
  return null;
};

// كل كلمة + مفاتيح خاناتها ("صف-عمود")
const WORDS = SOLUTION.map((s) => {
  const start = findStart(s.num);
  const down = s.direction === "Down";

  const cells = Array.from(
    { length: s.answer.length },
    (_, i) => `${start.r + (down ? i : 0)}-${start.c + (down ? 0 : i)}`,
  );

  return {
    ...s,
    id: `${s.num}-${s.direction}`,
    label: `${s.num} ${s.direction}`,
    cells,
  };
});

// الحرف الصح لكل خانة
const EXPECTED = {};
WORDS.forEach((w) =>
  w.cells.forEach((k, i) => {
    EXPECTED[k] = w.answer[i];
  }),
);

// كل خانة بأي كلمات بتشارك: { Across, Down }
const WORDS_AT = {};
WORDS.forEach((w) =>
  w.cells.forEach((k) => {
    WORDS_AT[k] = { ...WORDS_AT[k], [w.direction]: w };
  }),
);

// كل الخانات الي بتنحط فيها حروف
const KEYS = STRUCTURE.flatMap((row, r) =>
  row.map((cell, c) => (cell === "B" ? null : `${r}-${c}`)),
).filter(Boolean);

const TOTAL = KEYS.length;

const DOWN_WORDS = WORDS.filter((w) => w.direction === "Down");
const ACROSS_WORDS = WORDS.filter((w) => w.direction === "Across");

const emptyGrid = () => Object.fromEntries(KEYS.map((k) => [k, ""]));
const noLocks = () => Object.fromEntries(KEYS.map((k) => [k, false]));

const otherDir = (d) => (d === "Across" ? "Down" : "Across");

// الكلمة الي بتنطبق على الخانة حسب الاتجاه الحالي (وإلا الاتجاه الثاني)
const wordFor = (key, dir) =>
  WORDS_AT[key]?.[dir] || WORDS_AT[key]?.[otherDir(dir)] || null;

const cellName = (key) => {
  const [r, c] = key.split("-").map(Number);
  return `row ${r + 1}, column ${c + 1}`;
};

/* ================= STYLES ================= */

// ستايل الحرف المختار / الي بينسحب
const highlightStyle = {
  outline: "2px solid #2c5287",
  outlineOffset: "2px",
  borderRadius: "10px",
};

// ستايل الخانات المسموح الإسقاط عليها
const validTargetStyle = {
  outline: "2px dashed #2c5287",
  outlineOffset: "-2px",
};

// ستايل الـ clue المرتبط بالخانة الحالية
const activeClueStyle = {
  outline: "3px solid #2c5287",
  outlineOffset: "3px",
  borderRadius: "10px",
  background: "#e3f2fd",
};

// زر شفاف يغطي العنصر (للكيبورد وقارئ الشاشة فقط)
const overlayButtonStyle = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  background: "transparent",
  border: 0,
  padding: 0,
  margin: 0,
  borderRadius: "inherit",
  pointerEvents: "none", // الماوس واللمس بيروحوا للعنصر الأب (سحب + كليك)
};

const SpeakerIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    aria-hidden="true"
    style={{
      position: "absolute",
      top: "-6px",
      right: "-6px",
      background: "white",
      borderRadius: "50%",
    }}
  >
    <path
      fill="currentColor"
      d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"
    />
  </svg>
);

const focusRingClass =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c5287] focus-visible:ring-offset-2";

export default function Review4_Page1_Q1() {
  const [grid, setGrid] = useState(emptyGrid);

  // 🔒 الخانات الصح بعد Check بتنقفل
  const [lockedCells, setLockedCells] = useState(noLocks);

  // ✕ الخانات الغلط (الحرف بيضل بمكانه والطالب بيعدّله)
  const [wrongCells, setWrongCells] = useState([]);

  // 🔒 بعد Show Answer كل شي مقفول
  const [showAnswered, setShowAnswered] = useState(false);

  // الحرف المختار (اختار الحرف ثم اختار الخانة)
  const [selectedLetter, setSelectedLetter] = useState(null);

  // الحرف الي عم ينسحب
  const [draggingLetter, setDraggingLetter] = useState(null);

  // الخانة الحالية (المؤشر) + اتجاه الكلمة
  const [activeKey, setActiveKey] = useState(null);
  const [direction, setDirection] = useState("Across");

  // 📢 رسالة لقارئ الشاشة
  const [message, setMessage] = useState("");

  const cellRefs = useRef({});
  const letterRefs = useRef({});
  const wasFocusedRef = useRef(false); // هل الخانة كانت مفعّلة قبل الكليك (لتبديل الاتجاه)

  const isComplete = KEYS.every((k) => lockedCells[k]);
  const allLocked = showAnswered || isComplete;
  const activeLetter = selectedLetter || draggingLetter;

  // Tab بيدخل للشبكة مرة وحدة (roving tabindex)، والأسهم بتتنقل جواتها
  const tabStop = activeKey || KEYS[0];
  const activeWord = activeKey ? wordFor(activeKey, direction) : null;

  /* =====================================================
   AUDIO
===================================================== */

  const audioOwner = useRef({}).current;
  const [activeId, setActiveId] = useState(null);

  const stopAudio = () => stopGlobalAudio(audioOwner);

  const playAudio = (src, id) => {
    if (!src) {
      stopGlobalAudio();
      setActiveId(null);
      return;
    }

    playGlobalAudio(src, {
      owner: audioOwner,
      onFinish: () => setActiveId((prev) => (prev === id ? null : prev)),
    });

    setActiveId(id);
  };

  useEffect(() => () => stopGlobalAudio(audioOwner), [audioOwner]);

  const handleHeadingKeyDown = (e, src, id) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      playAudio(src, id);
    }
  };

  const handleHeadingFocus = (e, src, id) => {
    if (!PLAY_ON_FOCUS) return;
    if (!e.currentTarget.matches(":focus-visible")) return;
    playAudio(src, id);
  };

  /* =====================================================
     FOCUS HELPERS
  ===================================================== */

  const focusCell = (key) => {
    requestAnimationFrame(() => cellRefs.current[key]?.focus());
  };

  const focusLetter = (l) => {
    requestAnimationFrame(() => letterRefs.current[l]?.focus());
  };

  // أول خانة مسموح الوضع فيها (الحالية، وإلا أول فاضية)
  const firstTargetCell = () =>
    (activeKey && !lockedCells[activeKey] ? activeKey : null) ||
    KEYS.find((k) => !grid[k] && !lockedCells[k]) ||
    KEYS.find((k) => !lockedCells[k]);

  // الخانة الجاية بنفس الكلمة (بنتخطى الصح المقفول)، بس بنحرّك المؤشر بدون فوكس
  const advance = (key) => {
    const w = wordFor(key, direction);
    if (!w) return null;

    const i = w.cells.indexOf(key);
    const next = w.cells.slice(i + 1).find((k) => !lockedCells[k]);

    if (next) {
      setActiveKey(next);
      return next;
    }

    return null;
  };

  /* =====================================================
     LETTER BANK (كليك / لمس / Enter / Space)
  ===================================================== */

  const activateLetter = (l, viaKeyboard = false) => {
    if (allLocked) return;

    // نفس الحرف مرة ثانية = إلغاء الاختيار
    if (selectedLetter === l) {
      setSelectedLetter(null);
      setMessage(`Letter ${l} deselected.`);
      return;
    }

    setSelectedLetter(l);
    setMessage(
      `Letter ${l} selected. Choose a cell to place it. Press Escape to cancel.`,
    );

    if (viaKeyboard) {
      const target = firstTargetCell();
      if (target) focusCell(target);
    }
  };

  const cancelSelection = () => {
    if (!selectedLetter) return;
    const l = selectedLetter;
    setMessage(`Letter ${l} deselected.`);
    setSelectedLetter(null);
    focusLetter(l);
  };

  // الأسهم: تنقل بين الحروف
  const handleLetterKeyDown = (e, l) => {
    const i = LETTERS.indexOf(l);
    let next = null;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      next = LETTERS[(i + 1) % LETTERS.length];
    }

    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      next = LETTERS[(i - 1 + LETTERS.length) % LETTERS.length];
    }

    if (next) {
      e.preventDefault();
      focusLetter(next);
    }
  };

  /* =====================================================
     CELLS
  ===================================================== */

  const setLetter = (key, letter) => {
    setGrid((prev) => ({ ...prev, [key]: letter }));
    // نشيل ✕ بس عن الخانة الي تغيّرت
    setWrongCells((prev) => prev.filter((k) => k !== key));
  };

  const clearCell = (key) => {
    setLetter(key, "");
    setMessage(`${cellName(key)} cleared.`);
  };

  // وضع حرف بخانة: المؤشر للخانة الجاية والفوكس يرجع للبنك
  const placeLetter = (letter, key) => {
    if (allLocked || lockedCells[key]) return;

    setLetter(key, letter);
    setSelectedLetter(null);

    const next = advance(key);
    if (!next) setActiveKey(key);

    setMessage(
      `Letter ${letter} placed in ${cellName(key)}.${
        next ? ` Next: ${cellName(next)}.` : ""
      } Back in the letter bank.`,
    );

    // 🔙 الفوكس يرجع للبنك على نفس الحرف
    focusLetter(letter);
  };

  const handleFocus = (e, key) => {
    setActiveKey(key);
    // لو الخانة ما فيها كلمة بالاتجاه الحالي منحوّل للاتجاه الثاني
    const w = wordFor(key, direction);
    if (w && w.direction !== direction) setDirection(w.direction);
  };

  const moveByArrow = (key, dr, dc, dir) => {
    const [r, c] = key.split("-").map(Number);
    let nr = r + dr;
    let nc = c + dc;

    // بنتخطى المربعات السودا لأقرب خانة بيضا بنفس الخط
    while (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
      if (STRUCTURE[nr][nc] !== "B") {
        const target = `${nr}-${nc}`;
        if (WORDS_AT[target]?.[dir]) setDirection(dir);
        focusCell(target);
        return;
      }
      nr += dr;
      nc += dc;
    }
  };

  // الخانات للقراءة فقط: ممنوع الكتابة، بس تنقل وإدخال من البنك
  const handleKeyDown = (e, key) => {
    const locked = lockedCells[key];

    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        moveByArrow(key, 0, 1, "Across");
        break;
      case "ArrowLeft":
        e.preventDefault();
        moveByArrow(key, 0, -1, "Across");
        break;
      case "ArrowDown":
        e.preventDefault();
        moveByArrow(key, 1, 0, "Down");
        break;
      case "ArrowUp":
        e.preventDefault();
        moveByArrow(key, -1, 0, "Down");
        break;

      case "Enter":
      case " ":
        e.preventDefault();
        if (selectedLetter) placeLetter(selectedLetter, key);
        else if (!allLocked && !locked && grid[key]) clearCell(key);
        else setMessage("Select a letter from the letter bank first.");
        break;

      case "Backspace":
      case "Delete":
        e.preventDefault();
        if (allLocked || locked) {
          setMessage(`${cellName(key)} is correct and locked.`);
          return;
        }
        if (grid[key]) clearCell(key);
        break;

      case "Tab":
      case "Escape":
        break;

      default:
        // أي حرف ثاني: ممنوع الكتابة
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          setMessage(
            "Typing is not allowed. Choose a letter from the letter bank.",
          );
        }
        break;
    }
  };

  const renderHeading = (text, src, id) => {
    const playing = activeId === id;

    return (
      <h4
        className={`CB-review4-p1-q1-label ${focusRingClass}`}
        role="button"
        tabIndex={0}
        aria-label={`${text} clues. Press to listen.`}
        style={{
          position: "relative",
          cursor: "pointer",
          ...(playing ? highlightStyle : {}),
        }}
        onClick={() => playAudio(src, id)}
        onKeyDown={(e) => handleHeadingKeyDown(e, src, id)}
        onFocus={(e) => handleHeadingFocus(e, src, id)}
      >
        <span aria-hidden="true">{text}</span>
        {playing && <SpeakerIcon />}
      </h4>
    );
  };

  // كليك على الخانة:
  // - في حرف مختار → نحطه
  // - الخانة كانت مفعّلة وفيها كلمتين → نبدّل الاتجاه
  const handleCellClick = (key) => {
    if (!selectedLetter && grid[key] && !allLocked && !lockedCells[key]) {
      clearCell(key);
      return;
    }
    if (selectedLetter && !allLocked && !lockedCells[key]) {
      placeLetter(selectedLetter, key);
      return;
    }

    const ws = WORDS_AT[key];

    if (wasFocusedRef.current && ws?.Across && ws?.Down) {
      const w = wordFor(key, direction);
      const nextDir = otherDir(w.direction);
      setDirection(nextDir);
      setMessage(`${ws[nextDir].label}, ${ws[nextDir].cells.length} letters.`);
    }
  };

  /* =====================================================
     DRAG & DROP (ماوس / لمس)
  ===================================================== */

  const onDragStart = (start) => {
    setDraggingLetter(start.draggableId.replace("letter-", ""));
    setSelectedLetter(null);
  };

  const onDragEnd = (result) => {
    setDraggingLetter(null);

    const { destination, draggableId } = result;

    if (!destination || allLocked) return;
    if (!destination.droppableId.startsWith("cell-")) return;

    const key = destination.droppableId.replace("cell-", "");
    const letter = draggableId.replace("letter-", "");

    placeLetter(letter, key);
  };

  /* =====================================================
     CHECK
     - الصح بينقفل
     - الغلط بيضل بمكانه مع ✕ والطالب بيعدّله
     - السكور بينحسب من كل الخانات
  ===================================================== */

  const checkAnswers = () => {
    if (allLocked) return;

    const hasEmpty = KEYS.some((k) => !lockedCells[k] && !grid[k]);

    if (hasEmpty) {
      ValidationAlert.info("Oops!", "Please fill all cells before checking.");
      setMessage("Please fill all cells before checking.");
      return;
    }

    const newLocked = { ...lockedCells };
    const wrong = [];
    let score = 0;

    KEYS.forEach((k) => {
      if (lockedCells[k] || grid[k].toLowerCase() === EXPECTED[k]) {
        newLocked[k] = true;
        score++;
      } else {
        wrong.push(k);
      }
    });

    setLockedCells(newLocked);
    setWrongCells(wrong);
    setSelectedLetter(null);
    stopAudio();
    setActiveId(null);
    // 🔊 فيدباك مسموع لكل كلمة + السكور
    const details = WORDS.map(
      (w) =>
        `${w.label}: ${
          w.cells.every((k) => !wrong.includes(k)) ? "correct" : "incorrect"
        }`,
    ).join(". ");

    setMessage(
      score === TOTAL
        ? `Score ${score} out of ${TOTAL}. ${details}. All answers are correct.`
        : `Score ${score} out of ${TOTAL}. ${details}. Correct cells are locked. Change the cells marked with a cross, then press Check Answer again.`,
    );

    const color = score === TOTAL ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">Score: ${score} / ${TOTAL}</span>
      </div>
    `;

    if (score === TOTAL) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showAnswers = () => {
    setGrid(Object.fromEntries(KEYS.map((k) => [k, EXPECTED[k]])));
    setLockedCells(Object.fromEntries(KEYS.map((k) => [k, true])));
    setWrongCells([]);
    setSelectedLetter(null);
    setDraggingLetter(null);
    setShowAnswered(true);
    stopAudio();
    setActiveId(null);
    setMessage("Correct answers are shown. The whole grid is filled.");
  };

  /* =====================================================
     START AGAIN
  ===================================================== */

  const reset = () => {
    setGrid(emptyGrid());
    setLockedCells(noLocks());
    setWrongCells([]);
    setSelectedLetter(null);
    setDraggingLetter(null);
    setActiveKey(null);
    setDirection("Across");
    setShowAnswered(false);
    stopAudio();
    setActiveId(null);
    setMessage("Exercise reset. All cells, feedback and score are cleared.");
  };

  /* =====================================================
     RENDER HELPERS
  ===================================================== */

  const cellAriaLabel = (key, locked, isWrong) => {
    const ws = WORDS_AT[key];
    const main = wordFor(key, direction);
    const other =
      ws.Across && ws.Down ? (main === ws.Across ? ws.Down : ws.Across) : null;

    return `${cellName(key)}. ${main.label}, ${main.cells.length} letters, letter ${
      main.cells.indexOf(key) + 1
    }${other ? `. Also ${other.label}` : ""}. ${
      grid[key] ? `Contains letter ${grid[key]}` : "Empty"
    }${
      showAnswered
        ? ", answer shown"
        : locked
          ? ", correct and locked"
          : isWrong
            ? ", incorrect, you can change it"
            : ""
    }${
      selectedLetter && !allLocked && !locked
        ? `. Press Enter to place letter ${selectedLetter}`
        : ""
    }`;
  };

  const renderClue = (w) => {
    const isActive = activeWord?.id === w.id;

    return (
      <div
        key={w.id}
        className="CB-review4-p1-q1-img-item"
        aria-current={isActive ? "true" : undefined}
        style={isActive ? activeClueStyle : undefined}
      >
        <span className="CB-review4-p1-q1-num" aria-hidden="true">
          {w.num}
        </span>
        <img
          src={w.img}
          alt={`Clue ${w.label}, ${w.answer.length} letters: ${w.alt}`}
          draggable="false"
        />
      </div>
    );
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
          marginBottom: "20px",
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") cancelSelection();
        }}
      >
        {/* 📢 رسائل لقارئ الشاشة */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {message}
        </div>

        <p id="r4p1q1-help" className="sr-only">
          Typing in the squares is not allowed. Select a letter from the letter
          bank with Enter or Space, then choose a square and press Enter to
          place it. After placing, focus returns to the letter bank and the
          cursor moves to the next square of the word. Use the arrow keys to
          move around the grid and Backspace to clear a square. You can also
          drag a letter into a square with a mouse or by touch.
        </p>

        <div className="div-forall" style={{ gap: "20px" }}>
          <ExerciseHeader
            sectionLetter="A"
            title="Look and complete the crossword puzzle."
            subTitle="Use each picture clue, then fill the crossword one letter at a time."
            isReview="true"
          />

          <div className="crossword-container">
            {/* 🔤 LETTER BANK */}
            <Droppable
              droppableId="letters-bank"
              direction="horizontal"
              isDropDisabled
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  role="group"
                  aria-label="Letter bank. Press Enter or Space to select a letter, then choose a square."
                  style={{
                    display: "flex",
                    gap: "10px",
                    padding: "10px",
                    borderRadius: "10px",
                    alignItems: "center",
                    flexWrap: "wrap",
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  {LETTERS.map((l, index) => {
                    const isSelected = selectedLetter === l;

                    return (
                      <Draggable
                        key={l}
                        draggableId={`letter-${l}`}
                        index={index}
                        isDragDisabled={allLocked}
                      >
                        {(provided) => (
                          <span
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            /*
                              الفوكس بالكيبورد على الزر الداخلي،
                              مش على الـ drag handle نفسو.
                            */
                            tabIndex={-1}
                            role="presentation"
                            aria-describedby={undefined}
                            onClick={(e) => activateLetter(l, e.detail === 0)}
                            style={{
                              position: "relative",
                              padding: "7px 14px",
                              border: "2px solid #d2232a",
                              borderRadius: "8px",
                              background: "white",
                              fontWeight: "bold",
                              fontSize: "18px",
                              touchAction: "none",
                              opacity: allLocked ? 0.6 : 1,
                              cursor: allLocked ? "not-allowed" : "grab",
                              ...(isSelected ? highlightStyle : {}),
                              ...provided.draggableProps.style,
                            }}
                          >
                            <span aria-hidden="true">{l}</span>

                            {/* زر شفاف للكيبورد وقارئ الشاشة */}
                            <button
                              type="button"
                              ref={(node) => {
                                letterRefs.current[l] = node;
                              }}
                              aria-label={`Letter ${l}${
                                isSelected ? ", selected" : ""
                              }`}
                              aria-pressed={isSelected}
                              aria-disabled={allLocked}
                              className={focusRingClass}
                              style={overlayButtonStyle}
                              onKeyDown={(e) => handleLetterKeyDown(e, l)}
                            />
                          </span>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <div className="CB-review4-p1-q1-grid-container">
              {/* ===================== الصور (Clues) ===================== */}
              <div className="CB-review4-p1-q1-puzzle-images-box">
                <div
                  className="CB-review4-p1-q1-column-box"
                  role="group"
                  aria-label="Down clues"
                >
                  <h4 className="CB-review4-p1-q1-label" aria-hidden="true">
                    {renderHeading("Down", downSound, "heading-down")}
                  </h4>
                  {DOWN_WORDS.map(renderClue)}
                </div>

                <div
                  className="CB-review4-p1-q1-column-box"
                  role="group"
                  aria-label="Across clues"
                >
                  <h4 className="CB-review4-p1-q1-label" aria-hidden="true">
                    {renderHeading("Across", acrossSound, "heading-across")}
                  </h4>
                  {ACROSS_WORDS.map(renderClue)}
                </div>
              </div>

              {/* ===================== الشبكة ===================== */}
              <div
                className="CB-review4-p1-q1-crossword-grid"
                role="group"
                aria-label="Crossword grid"
                aria-describedby="r4p1q1-help"
              >
                {STRUCTURE.map((row, r) => (
                  <div key={r} className="CB-review4-p1-q1-row">
                    {row.map((cell, c) => {
                      if (cell === "B") {
                        return (
                          <div
                            key={`${r}-${c}`}
                            className="CB-review4-p1-q1-cell CB-review4-p1-q1-block"
                            aria-hidden="true"
                          />
                        );
                      }

                      const key = `${r}-${c}`;
                      const number = /[1-9]/.test(cell) ? cell : null;
                      const locked = lockedCells[key];
                      const isWrong = wrongCells.includes(key);
                      const isValidTarget =
                        Boolean(activeLetter) && !allLocked && !locked;
                      const inActiveWord = Boolean(
                        activeWord?.cells.includes(key),
                      );
                      const isActiveCell = activeKey === key;
                      const showMark = !showAnswered && isWrong;

                      return (
                        <div
                          key={key}
                          className="CB-review4-p1-q1-cell CB-review4-p1-q1-white"
                          style={
                            isActiveCell
                              ? { background: "#bbdefb" }
                              : inActiveWord
                                ? { background: "#e3f2fd" }
                                : undefined
                          }
                        >
                          {number && (
                            <span
                              className="CB-review4-p1-q1-number"
                              aria-hidden="true"
                            >
                              {number}
                            </span>
                          )}

                          <Droppable
                            droppableId={`cell-${key}`}
                            isDropDisabled={allLocked || locked}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`CB-review4-p1-q1-letter ${
                                  snapshot.isDraggingOver
                                    ? "CB-review4-p1-q1-drag-over"
                                    : ""
                                }`}
                                onPointerDown={() => {
                                  wasFocusedRef.current =
                                    document.activeElement ===
                                    cellRefs.current[key];
                                }}
                                onClick={() => handleCellClick(key)}
                                style={
                                  isValidTarget ? validTargetStyle : undefined
                                }
                              >
                                <input
                                  type="text"
                                  ref={(node) => {
                                    cellRefs.current[key] = node;
                                  }}
                                  className={`CB-r4p1q1-input ${
                                    locked && !showAnswered
                                      ? "is-correct"
                                      : showMark
                                        ? "is-wrong"
                                        : ""
                                  }`}
                                  value={grid[key]}
                                  readOnly
                                  aria-readonly="true"
                                  aria-label={cellAriaLabel(
                                    key,
                                    locked,
                                    isWrong,
                                  )}
                                  aria-invalid={showMark}
                                  tabIndex={key === tabStop ? 0 : -1}
                                  inputMode="none"
                                  autoComplete="off"
                                  autoCorrect="off"
                                  autoCapitalize="off"
                                  spellCheck={false}
                                  onFocus={(e) => handleFocus(e, key)}
                                  onKeyDown={(e) => handleKeyDown(e, key)}
                                />

                                {/* الـ placeholder مخفي عشان ما يكبّر الخانة وقت السحب */}
                                <div
                                  aria-hidden="true"
                                  style={{
                                    position: "absolute",
                                    visibility: "hidden",
                                    pointerEvents: "none",
                                  }}
                                >
                                  {provided.placeholder}
                                </div>
                              </div>
                            )}
                          </Droppable>

                          {/* ❌ دائرة الخطأ */}
                          {showMark && (
                            <span
                              className="CB-review4-p1-q1-error-badge"
                              aria-hidden="true"
                            >
                              ✕
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* الأزرار */}
        <div className="action-buttons-container">
          <button type="button" onClick={reset} className="try-again-button">
            Start Again ↻
          </button>
          <button
            type="button"
            onClick={showAnswers}
            className="show-answer-btn swal-continue"
          >
            Show Answer
          </button>
          <button
            type="button"
            onClick={checkAnswers}
            className="check-button2"
            aria-disabled={allLocked}
            style={allLocked ? { cursor: "not-allowed" } : undefined}
          >
            Check Answer ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
}

import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit2_Page5_Q1.css";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import sound from "../../../assets/audio/ClassBook/U 2/cd10pg14-instruction-adult-lady_11ICxSy7.mp3";
// 🔹 الصور
import img1 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 14/Asset 10.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 14/Asset 11.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 14/Asset 12.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 14/Asset 13.svg";
import img5 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 14/Asset 14.svg";
import img6 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 14/Asset 15.svg";

/* ================= DATA ================= */

const leftParts = [
  { id: 1, text: "-x" },
  { id: 2, text: "-ck" },
  { id: 3, text: "q" },
  { id: 4, text: "-ck" },
  { id: 5, text: "-x" },
  { id: 6, text: "c" },
];

const images = [
  { id: "img1", src: img1 },
  { id: "img2", src: img2 },
  { id: "img3", src: img3 },
  { id: "img4", src: img4 },
  { id: "img5", src: img5 },
  { id: "img6", src: img6 },
];

const rightParts = [
  { id: "r1", text: "fo_" },
  { id: "r2", text: "so_ _" },
  { id: "r3", text: "bo_" },
  { id: "r4", text: "_ueen" },
  { id: "r5", text: "_ow" },
  { id: "r6", text: "lo_ _" },
];

// 🔥 استبدل correctMatches بهذا:
const correctGroups = [
  {
    image: "img4",
    right: "bo_",
    leftIds: [1, 5],
  },
  {
    image: "img6",
    right: "fo_",
    leftIds: [5, 1],
  },
  {
    image: "img1",
    right: "lo_ _",
    leftIds: [2, 4],
  },
  {
    image: "img3",
    right: "so_ _",
    leftIds: [4, 2],
  },
  {
    image: "img5",
    right: "_ueen",
    leftIds: [3],
  },
  {
    image: "img2",
    right: "_ow",
    leftIds: [6],
  },
];
/* ================= COMPONENT ================= */


const Unit2_Page5_Q1 = () => {
  const containerRef = useRef(null);
  const [lines, setLines] = useState([]);
  const [firstPoint, setFirstPoint] = useState(null);
  const [wrongLeft, setWrongLeft] = useState([]);
  const [written, setWritten] = useState({});
  const [locked, setLocked] = useState(false);
  const [checked, setChecked] = useState(false);

const [activeItem, setActiveItem] = useState(null);
  /* ================= HELPERS ================= */

  const getCenter = (el) => {
    const rect = containerRef.current.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return {
      x: r.left - rect.left + r.width / 2,
      y: r.top - rect.top + r.height / 2,
    };
  };
  const getDotCenterFromParent = (parent, dotSelector) => {
    const dot = parent.querySelector(dotSelector);
    if (!dot) return null;
    return getCenter(dot);
  };

  /* ================= CLICK HANDLERS ================= */
const handleStart = (e) => {
  if (locked) return;

  const data = e.currentTarget.dataset;

  let type = null;
  if (data.leftId) type = "left";
  else if (data.image) type = "image";

  let pos = null;

  if (type === "left") {
    pos = getDotCenterFromParent(e.currentTarget, ".start-dot");
    setActiveItem({ type: "left", id: Number(data.leftId) });
  } 
  else if (type === "image") {
    pos = getDotCenterFromParent(e.currentTarget, ".start-dot");
    setActiveItem({ type: "image", id: data.image });
  } 
  else {
    return;
  }

  if (!pos) return;

  setFirstPoint({
    type,
    leftId: data.leftId ? Number(data.leftId) : null,
    image: data.image || null,
    x: pos.x,
    y: pos.y,
  });
};
const handleEnd = (e) => {
  if (!firstPoint || locked) return;

  const data = e.currentTarget.dataset;

  let endType = null;
  if (data.leftId) endType = "left";
  else if (data.image) endType = "image";
  else if (data.right) endType = "right";

  // 🔴 السماح بالمسارات: left -> image, left -> right, image -> right
  const isValidPath = 
    (firstPoint.type === "left" && (endType === "image" || endType === "right")) ||
    (firstPoint.type === "image" && endType === "right");

  if (!isValidPath) {
    setFirstPoint(null);
    return;
  }

  let pos = null;
  if (endType === "image" || endType === "right") {
    pos = getDotCenterFromParent(e.currentTarget, ".end-dot");
  }

  if (!pos) return;

  // =========================
  // 🔴 منطق الاستبدال المرن مع القيود الجديدة
  // =========================
  setLines((prev) => {
    let filtered = [...prev];

    // 1. إذا كانت البداية كلمة علوية، نحذف أي توصيل قديم لها
    if (firstPoint.leftId) {
      filtered = filtered.filter((l) => l.leftId !== firstPoint.leftId);
    }

    // 2. إذا كانت النهاية كلمة سفلية، نحذف أي توصيل قديم لها
    if (data.right) {
      filtered = filtered.filter((l) => l.right !== data.right);
    }

    // 3. إذا كانت النهاية صورة (توصيل من فوق)، نحذف أي توصيل قديم داخل لهالصورة من فوق
    if (endType === "image") {
      filtered = filtered.filter((l) => !(l.image === data.image && l.leftId !== null));
    }

    // 4. إذا كانت البداية صورة (توصيل لتحت)، نحذف أي توصيل قديم طالع من هالصورة لتحت
    if (firstPoint.image && endType === "right") {
      filtered = filtered.filter((l) => !(l.image === firstPoint.image && l.right !== null));
    }

    const newLine = {
      x1: firstPoint.x,
      y1: firstPoint.y,
      x2: pos.x,
      y2: pos.y,
      leftId: firstPoint.leftId,
      image: firstPoint.image || (endType === "image" ? data.image : null),
      right: data.right || null,
    };
setActiveItem(null);
    return [...filtered, newLine];
  });

  // 🔁 استمرار الرسم من الصورة إذا كان التوصيل لـ image
  if (firstPoint.type === "left" && endType === "image") {
    const startFromImagePos = getDotCenterFromParent(
      e.currentTarget,
      ".start-dot"
    );

    setFirstPoint({
      type: "image",
      image: data.image,
      x: startFromImagePos?.x ?? pos.x,
      y: startFromImagePos?.y ?? pos.y,
    });
  } else {
    setFirstPoint(null);
  }
};

  /* ================= CHECK ================= */
  const checkAnswers = () => {
    if (checked || locked) return;

    if (lines.length === 0) {
      ValidationAlert.info(
        "Pay attention!",
        "Please connect all the pairs before checking.",
      );
      return;
    }
let score = 0;
let wrong = [];

correctGroups.forEach((group) => {
  // 🔍 نجيب كل التوصيلات اللي راحت لهالصورة
  const usedLeftConnections = lines.filter(
    (l) => l.image === group.image && l.leftId !== null
  );

  const imgToRight = lines.find(
    (l) => l.image === group.image && l.right === group.right
  );

  // 🔍 نجيب التوصيلات المباشرة من left لـ right
  const directConnections = lines.filter(
    (l) => l.leftId !== null && l.right === group.right && group.leftIds.includes(l.leftId)
  );

  let isCorrect = false;

  // حالة التوصيل عبر الصورة
  usedLeftConnections.forEach((conn) => {
    if (group.leftIds.includes(conn.leftId) && imgToRight) {
      isCorrect = true;
    } else {
      wrong.push(conn.leftId);
    }
  });

  // حالة التوصيل المباشر
  if (directConnections.length > 0) {
    isCorrect = true;
  }

  if (isCorrect) {
    score++;
  }
}); setWrongLeft(wrong);
    setChecked(true);
    setLocked(true);

    const total = correctGroups.length;
    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    ValidationAlert[
      score === total ? "success" : score === 0 ? "error" : "warning"
    ](
      `<div style="font-size:20px;text-align:center;color:${color}">
      <b>Score: ${score} / ${total}</b>
    </div>`,
    );
  };

  /* ================= SHOW ANSWER ================= */

  const showAnswer = () => {
    requestAnimationFrame(() => {
      const finalLines = [];

      correctGroups.forEach((group) => {
        // 🔥 ناخذ أول خيار فقط
        const leftId = group.leftIds[0];

        const leftEl = document.querySelector(`[data-left-id="${leftId}"]`);
        const imgEl = document.querySelector(`[data-image="${group.image}"]`);
        const rightEl = document.querySelector(`[data-right="${group.right}"]`);

        if (!leftEl || !imgEl || !rightEl) return;

        const leftDot = leftEl.querySelector(".start-dot");
        const imgEndDot = imgEl.querySelector(".end-dot");
        const imgStartDot = imgEl.querySelector(".start-dot");
        const rightDot = rightEl.querySelector(".end-dot");

        // left → image
        if (leftDot && imgEndDot) {
          const p1 = getCenter(leftDot);
          const p2 = getCenter(imgEndDot);
          finalLines.push({
            x1: p1.x,
            y1: p1.y,
            x2: p2.x,
            y2: p2.y,
            leftId: leftId,
            image: group.image,
            right: null
          });
        }

        // image → right
        if (imgStartDot && rightDot) {
          const p1 = getCenter(imgStartDot);
          const p2 = getCenter(rightDot);
          finalLines.push({
            x1: p1.x,
            y1: p1.y,
            x2: p2.x,
            y2: p2.y,
            leftId: null,
            image: group.image,
            right: group.right
          });
        }
      });

      setLines(finalLines);
      setLocked(true);
      setChecked(true);
    });
  };

  /* ================= RESET ================= */

  const reset = () => {
    setLines([]);
    setWritten({});
    setWrongLeft([]);
    setLocked(false);
    setChecked(false);
    setFirstPoint(null);
  };

  /* ================= RENDER ================= */

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    { start: 1.1, end: 4.12, text: "Page 14, Right Activities." },
    { start: 5.2, end: 10.24, text: "Exercise A, listen, write, and match." },
    { start: 11.44, end: 13.1, text: "1, box." },
    { start: 14.16, end: 18.96, text: "2, lock. 3, queen." },
    { start: 20.08, end: 24.62, text: "4, sock. 5, fox." },
    { start: 25.74, end: 27.46, text: "6, cow." },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <div
        className="div-forall"
        style={{
          width: "60%",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div className="flex flex-col">
        <h4 className="header-title-page8 mb-2">
          <span className="ex-A">A</span> Listen, write, and match.
        </h4>
          <span className="text-gray-400 text-xs">Double-tap the image to start matching the image with the words below.</span>
          </div>
        <QuestionAudioPlayer
          src={sound}
          captions={captions}
          stopAtSecond={10.24}
        />

        <div className="matching-area" ref={containerRef}>
          {/* LEFT */}
          <div className="left-col-wb-unit6-p2-q2">
            {leftParts.map((l, i) => (
              <div
                key={i}
                className="item-wb-unit6-p2-q2 clickable"
                data-left-id={l.id}
                onClick={handleStart}
              >
                <span className="num-wb-unit6-p2-q2">{i + 1}</span>
               <span
  className={`word-text-wb-unit6-p2-q2 ${
    activeItem?.type === "left" && activeItem?.id === l.id
      ? "active-left"
      : ""
  }`}
>
  {l.text}
</span>
               <div
  className={`dot-wb-unit6-p2-q2 start-dot ${
    activeItem?.type === "left" && activeItem?.id === l.id
      ? "active-dot"
      : ""
  }`}
/>
                {wrongLeft.includes(l.id) && checked && (
                  <span className="wrong-mark-sb-unit2-p5-q1">✕</span>
                )}
              </div>
            ))}
          </div>

          {/* IMAGES */}
          <div className="mid-col-wb-unit6-p2-q2">
            {images.map((img) => (
              <div
                key={img.id}
                className="item-wb-unit6-p2-q2 clickable"
                data-image={img.id}
                onClick={(e) => (firstPoint ? handleEnd(e) : handleStart(e))}
              >
                <div className="dot-wb-unit6-p2-q2 end-dot" />
                <img
                  src={img.src}
                  alt=""
                  className={`matched-img2 ${
                    locked || checked ? "disabled-hover" : ""
                  }${
    activeItem?.type === "image" && activeItem?.id === img.id
      ? "active-image"
      : ""
  }`}
                />

                <div className="dot-wb-unit6-p2-q2 start-dot" />
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div className="right-col-wb-unit6-p2-q2">
            {rightParts.map((r) => (
              <div
                key={r.id}
                className="item-wb-unit6-p2-q2 clickable"
                data-right={r.text}
                onClick={handleEnd}
              >
                <div className="dot-wb-unit6-p2-q2 end-dot" />
                <span
                  className={`word-text-wb-unit6-p2-q2 ${
                    locked || checked ? "disabled-word" : ""
                  }`}
                >
                  {" "}
                  {r.text}
                </span>
              </div>
            ))}
          </div>

          {/* LINES */}
          <svg className="lines-layer">
            {lines.map((l, i) => (
              <line key={i} {...l} stroke="red" strokeWidth="3" />
            ))}
          </svg>
        </div>

        {/* WRITE SECTION */}
      </div>
      {/* BUTTONS */}
      <div className="action-buttons-container">
        <button onClick={reset} className="try-again-button">
          Start Again ↻
        </button>
        <button onClick={showAnswer} className="show-answer-btn">
          Show Answer
        </button>
        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit2_Page5_Q1;

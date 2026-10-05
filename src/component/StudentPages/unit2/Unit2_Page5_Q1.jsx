import React, { useState, useRef, useEffect } from "react";
import { FaVolumeUp } from "react-icons/fa";
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
import ExerciseHeader from "../../ExerciseHeader";

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
  { id: "img1", src: img1, alt: "A lock" },
  { id: "img2", src: img2, alt: "A cow" },
  { id: "img3", src: img3, alt: "A sock" },
  { id: "img4", src: img4, alt: "A box" },
  { id: "img5", src: img5, alt: "A queen" },
  { id: "img6", src: img6, alt: "A fox" },
];

// answer = الحروف الناقصة بحقل الكتابة
// audio (اختياري) = إذا حطيتي ملف صوت لكلمة، بيظهر زر Listen جنب الحقل
const rightParts = [
  { id: "r1", text: "fo_" },
  { id: "r2", text: "so_ _" },
  { id: "r3", text: "bo_" },
  { id: "r4", text: "_ueen" },
  { id: "r5", text: "_ow" },
  { id: "r6", text: "lo_ _" },
];

// right صار بالـ id (r1..r6) بدل النص
const correctGroups = [
  { image: "img4", right: "r3", leftIds: [1, 5] }, // box
  { image: "img6", right: "r1", leftIds: [5, 1] }, // fox
  { image: "img1", right: "r6", leftIds: [2, 4] }, // lock
  { image: "img3", right: "r2", leftIds: [4, 2] }, // sock
  { image: "img5", right: "r4", leftIds: [3] }, // queen
  { image: "img2", right: "r5", leftIds: [6] }, // cow
];

const captions = [
  { start: 1.1, end: 4.12, text: "Page 14, Right Activities." },
  { start: 5.2, end: 10.24, text: "Exercise A, listen, write, and match." },
  { start: 11.44, end: 13.1, text: "1, box." },
  { start: 14.16, end: 18.96, text: "2, lock. 3, queen." },
  { start: 20.08, end: 24.62, text: "4, sock. 5, fox." },
  { start: 25.74, end: 27.46, text: "6, cow." },
];

/* ================= HELPERS (خارج الكومبوننت) ================= */

const ORDER = { left: 0, image: 1, right: 2 };
const nodeKey = (n) => `${n.type}-${n.id}`;
const sameNode = (a, b) => !!a && !!b && a.type === b.type && a.id === b.id;


const letterName = (t) => t.replace(/^-/, "");
const wordLabel = (t) =>
  t
    .replace(/(_ ?)+/g, " blank ")
    .trim()
    .replace(/\s+/g, " ");

const groupByImage = Object.fromEntries(correctGroups.map((g) => [g.image, g]));
const groupByRight = Object.fromEntries(correctGroups.map((g) => [g.right, g]));

// نوع الخط: left-image | image-right | left-right
const makeLine = (a, b) => ({
  id: `${nodeKey(a)}>${nodeKey(b)}`,
  kind:
    a.type === "left"
      ? b.type === "image"
        ? "left-image"
        : "left-right"
      : "image-right",
  leftId: a.type === "left" ? a.id : null,
  image: a.type === "image" ? a.id : b.type === "image" ? b.id : null,
  right: b.type === "right" ? b.id : null,
  status: null, // null | "correct" | "wrong"
});

// الخط الجديد بيستبدل الخطوط المتعارضة (One-to-One)
const conflicts = (l, n) =>
  (n.leftId !== null && l.leftId === n.leftId) ||
  (n.right !== null && l.right === n.right) ||
  (n.kind === "left-image" && l.kind === "left-image" && l.image === n.image) ||
  (n.kind === "image-right" && l.kind === "image-right" && l.image === n.image);

const isLineCorrect = (l) => {
  if (l.kind === "left-image")
    return groupByImage[l.image].leftIds.includes(l.leftId);
  if (l.kind === "image-right") return groupByImage[l.image].right === l.right;
  return groupByRight[l.right].leftIds.includes(l.leftId);
};

const startsAt = (l, node) => {
  if (node.type === "left") return l.leftId === node.id;
  if (node.type === "image")
    return l.kind === "image-right" && l.image === node.id;
  return l.right === node.id;
};

const groupDone = (ls, g) => {
  const ok = (fn) => ls.some((l) => l.status === "correct" && fn(l));
  return (
    ok((l) => l.kind === "left-right" && l.right === g.right) ||
    (ok((l) => l.kind === "left-image" && l.image === g.image) &&
      ok(
        (l) =>
          l.kind === "image-right" &&
          l.image === g.image &&
          l.right === g.right,
      ))
  );
};

// الحرف الغير موصول أولاً، وإذا خلصوا بنروح لأول صورة بدون كلمة
const nextSource = (ls) =>
  leftParts
    .map((l) => ({ type: "left", id: l.id }))
    .find(
      (n) => !ls.some((x) => x.kind === "left-image" && x.leftId === n.id),
    ) ||
  images
    .map((i) => ({ type: "image", id: i.id }))
    .find((n) => !ls.some((x) => x.kind === "image-right" && x.image === n.id));

/* ================= COMPONENT ================= */

const Unit2_Page5_Q1 = () => {
  const containerRef = useRef(null);
  const nodeRefs = useRef({});
 

  const [lines, setLines] = useState([]);
  const [selection, setSelection] = useState(null); // المصدر المختار
  const [previewTarget, setPreviewTarget] = useState(null); // الهدف الحالي بالكيبورد

  const [finished, setFinished] = useState(false); // كل شي صح بعد Check
  const [answerShown, setAnswerShown] = useState(false);
  const [message, setMessage] = useState("");
 
  const [, setTick] = useState(0);

  const locked = finished || answerShown;

  // إعادة حساب مواقع الخطوط لما يتغير حجم الشاشة
  useEffect(() => {
    const onResize = () => setTick((n) => n + 1);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // useEffect(() => () => stopGlobalAudio(audioOwner), [audioOwner]);

  /* ================= GEOMETRY ================= */

  const getDot = (node, selector) => {
    const dot = nodeRefs.current[nodeKey(node)]?.querySelector(selector);
    const box = containerRef.current;
    if (!dot || !box) return null;
    const c = box.getBoundingClientRect();
    const r = dot.getBoundingClientRect();
    return {
      x: r.left - c.left + r.width / 2,
      y: r.top - c.top + r.height / 2,
    };
  };

  // دايماً من النقطة الأولى (start-dot) للمصدر إلى النقطة الثانية (end-dot) للهدف
  const segment = (a, b) => {
    const p1 = getDot(a, ".start-dot");
    const p2 = getDot(b, ".end-dot");
    return p1 && p2 ? { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y } : null;
  };

  const lineEnds = (l) => ({
    a:
      l.kind === "image-right"
        ? { type: "image", id: l.image }
        : { type: "left", id: l.leftId },
    b:
      l.kind === "left-image"
        ? { type: "image", id: l.image }
        : { type: "right", id: l.right },
  });

  /* ================= LOCKS / TARGETS ================= */

  // role: "out" = العنصر كمصدر، "in" = العنصر كهدف
  const isNodeLocked = (node, role) =>
    lines.some((l) => {
      if (l.status !== "correct") return false;
      if (node.type === "left") return l.leftId === node.id;
      if (node.type === "right") return l.right === node.id;
      return role === "in"
        ? l.kind === "left-image" && l.image === node.id
        : l.kind === "image-right" && l.image === node.id;
    });

  // المرحلة 1 خلصت إذا كل حرف موصول بصورة
  const topDone = leftParts.every((l) =>
    lines.some((x) => x.kind === "left-image" && x.leftId === l.id),
  );

  const hasWrongLine = (node) =>
    lines.some((l) => l.status === "wrong" && startsAt(l, node));

  const availableTargets = (source) => {
    const imgs = images
      .map((i) => ({ type: "image", id: i.id }))
      .filter((n) => !isNodeLocked(n, "in"));
    const rights = rightParts
      .map((r) => ({ type: "right", id: r.id }))
      .filter((n) => !isNodeLocked(n, "in"));

    if (source.type === "left") return imgs;
    if (source.type === "image") return rights;
    return [];
  };

  const nodeLabel = (n) =>
    n.type === "left"
      ? `Letter ${letterName(leftParts.find((l) => l.id === n.id).text)}`
      : n.type === "image"
        ? images.find((i) => i.id === n.id).alt
        : `Word ${wordLabel(rightParts.find((r) => r.id === n.id).text)}`;

  const focusNode = (n) => {
    requestAnimationFrame(() => nodeRefs.current[nodeKey(n)]?.focus());
  };

  /* ================= SELECTION / CONNECT ================= */

  const clearSelection = (focusBack = false) => {
    if (focusBack && selection) focusNode(selection);
    setSelection(null);
    setPreviewTarget(null);
  };

  const beginFrom = (node, viaKeyboard) => {
    const role = node.type === "right" ? "in" : "out";

    if (isNodeLocked(node, role)) {
      setMessage("This one is correct and locked.");
      return;
    }

    // التوصيل الغلط القديم لهاد المصدر بينشال (ومعه الـ✕ تبعه فقط)
    setLines((prev) =>
      prev.filter((l) => !(l.status === "wrong" && startsAt(l, node))),
    );

    setSelection(node);
    setPreviewTarget(null);

    if (viaKeyboard) {
      const first = availableTargets(node)[0];

      if (first) {
        setPreviewTarget(first);
        focusNode(first);
      }

      setMessage(
        `${nodeLabel(node)} selected. Press Tab to choose where to connect it, Enter to connect, Escape to cancel.`,
      );
    } else {
      setMessage(`${nodeLabel(node)} selected. Choose where to connect it.`);
    }
  };

  const connect = (from, to, viaKeyboard) => {
    // نفس النوع: نفس العنصر = إلغاء، غيره = نبدّل المصدر
    if (from.type === to.type) {
      if (sameNode(from, to)) {
        clearSelection(viaKeyboard);
        setMessage("Selection cancelled.");
      } else {
        beginFrom(to, viaKeyboard);
      }
      return;
    }

    // مسموح بس: حرف ← صورة، أو صورة ← كلمة
    if (ORDER[to.type] !== ORDER[from.type] + 1) {
      setMessage("Connect a letter to a picture, or a picture to a word.");
      return;
    }

    if (isNodeLocked(from, "out") || isNodeLocked(to, "in")) {
      setMessage("That one is already correct and locked.");
      return;
    }

    const newLine = makeLine(from, to);

    // الخط الجديد بيستبدل القديم (خط واحد لكل صورة من كل جهة)
    const nextLines = [
      ...lines.filter((l) => l.status === "correct" || !conflicts(l, newLine)),
      newLine,
    ];

    setLines(nextLines);
    setSelection(null);
    setPreviewTarget(null);

    // الاختيار بيرجع للصف المصدر: الحرف أو الصورة التالية
    const next = nextSource(nextLines);

    if (viaKeyboard) focusNode(next || from);

    const movedToImages = from.type === "left" && next && next.type === "image";

    setMessage(
      `${nodeLabel(from)} connected to ${nodeLabel(to)}.` +
        (movedToImages
          ? " All letters are connected. Now connect each picture to a word."
          : ""),
    );
  };
  const activate = (node, viaKeyboard) => {
    if (locked) return;

    if (!selection) {
      if (node.type === "right") {
        setMessage("Start from a letter or a picture, then choose a word.");
        return;
      }

      if (node.type === "image" && !topDone && !hasWrongLine(node)) {
        setMessage("First connect all the letters to the pictures.");
        return;
      }

      if (node.type === "left" && topDone && !hasWrongLine(node)) {
        setMessage("The letters are done. Now connect each picture to a word.");
        return;
      }

      beginFrom(node, viaKeyboard);
      return;
    }

    connect(selection, node, viaKeyboard);
  };

  // Enter / Space على أي عنصر (الماوس واللمس بيروحوا على onClick)
  const onNodeKeyDown = (e, node) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activate(node, true);
    }
  };

  // Escape + لف Tab بين الأهداف المتاحة فقط
  const onAreaKeyDown = (e) => {
    if (!selection) return;

    if (e.key === "Escape") {
      e.preventDefault();
      clearSelection(true);
      setMessage("Connection cancelled.");
      return;
    }

    if (e.key !== "Tab") return;

    const targets = availableTargets(selection);
    if (targets.length === 0) return;

    e.preventDefault();

    const idx = targets.findIndex(
      (t) => nodeRefs.current[nodeKey(t)] === document.activeElement,
    );

    const next = e.shiftKey
      ? targets[(idx <= 0 ? targets.length : idx) - 1]
      : targets[(idx + 1) % targets.length];

    setPreviewTarget(next);
    focusNode(next);
  };

  /* ================= WRITE FIELDS ================= */

  // const handleWrite = (id, value) => {
  //   setWritten((prev) => ({ ...prev, [id]: value }));

  //   // ينشال الـ✕ عن هاد الحقل فقط
  //   setFieldStatus((prev) =>
  //     prev[id] === "wrong" ? { ...prev, [id]: null } : prev,
  //   );
  // };

  // const playWordAudio = (r) => {
  //   if (!r.audio) return;

  //   playGlobalAudio(r.audio, {
  //     owner: audioOwner,
  //     onFinish: () => setActiveAudio((p) => (p === r.id ? null : p)),
  //   });

  //   setActiveAudio(r.id);
  // };

  /* ================= CHECK ================= */

 const checkAnswers = () => {
  if (locked) return;

  const connectionsDone =
    leftParts.every((l) =>
      lines.some((x) => x.kind === "left-image" && x.leftId === l.id),
    ) &&
    images.every((i) =>
      lines.some((x) => x.kind === "image-right" && x.image === i.id),
    );

  if (!connectionsDone) {
    const msg = "Please connect all the pairs before checking.";
    ValidationAlert.info("Pay attention!", msg);
    setMessage(msg);
    return;
  }

  // الصح القديم بيضل مقفول، والباقي بينقيّم
  const checkedLines = lines.map((l) =>
    l.status === "correct"
      ? l
      : { ...l, status: isLineCorrect(l) ? "correct" : "wrong" },
  );

  const score = correctGroups.filter((g) => groupDone(checkedLines, g)).length;
  const total = correctGroups.length;

  setLines(checkedLines);
  clearSelection();

  if (score === total) setFinished(true);

  const color = score === total ? "green" : score === 0 ? "red" : "orange";

  setMessage(
    score === total
      ? `Score ${score} out of ${total}. All answers are correct.`
      : `Score ${score} out of ${total}. Correct answers are locked. Fix the ones marked with a cross.`,
  );

  ValidationAlert[
    score === total ? "success" : score === 0 ? "error" : "warning"
  ](
    `<div style="font-size:20px;text-align:center;color:${color}">
      <b>Score: ${score} / ${total}</b>
    </div>`,
  );
};

const showAnswer = () => {
  const shown = [];

  correctGroups.forEach((g) => {
    const left = { type: "left", id: g.leftIds[0] };
    const img = { type: "image", id: g.image };
    const right = { type: "right", id: g.right };

    shown.push(
      { ...makeLine(left, img), status: "correct" },
      { ...makeLine(img, right), status: "correct" },
    );
  });

  setLines(shown);
  clearSelection();
  setFinished(false);
  setAnswerShown(true);
  setMessage("Correct answers are shown.");
};

const reset = () => {
  setLines([]);
  clearSelection();
  setFinished(false);
  setAnswerShown(false);
  setMessage("Exercise reset.");
};


  /* ================= RENDER ================= */

  const previewSegment =
    selection && previewTarget ? segment(selection, previewTarget) : null;

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
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {message}
      </div>

      <div className="div-forall mb-10" style={{ gap: "20px" }}>
        <div className="flex flex-col">
          <ExerciseHeader
            sectionLetter="A"
            // questionNumber="1"
            title="Listen, write, and match."
            subTitle="Start with one picture or phrase, then match it to the partner that means the same thing."
          />
        </div>

        <QuestionAudioPlayer
          src={sound}
          captions={captions}
          pageId="unit2-page5-q1"
          stopAtSecond={10.24}
        />

        <p id="u2p5q1-help" className="sr-only">
          To connect with the keyboard, press Enter or Space on a letter or a
          picture, press Tab to choose where to connect it, then press Enter.
          Press Escape to cancel.
        </p>

        <div
          className="matching-area"
          ref={containerRef}
          role="group"
          aria-label="Matching area"
          aria-describedby="u2p5q1-help"
          onKeyDown={onAreaKeyDown}
        >
          {/* LEFT */}
          <div className="left-col-wb-unit6-p2-q2">
            {leftParts.map((l, i) => {
              const node = { type: "left", id: l.id };
              const isLocked = locked || isNodeLocked(node, "out");
              const canStart = !isLocked && (!topDone || hasWrongLine(node));
              const isActive = sameNode(selection, node);
              const hasWrong = lines.some(
                (x) => x.leftId === l.id && x.status === "wrong",
              );
              const connected = lines.some((x) => x.leftId === l.id);

              return (
                <div
                  key={l.id}
                  ref={(el) => {
                    nodeRefs.current[nodeKey(node)] = el;
                  }}
                  className="item-wb-unit6-p2-q2 clickable"
                  role="button"
                  tabIndex={canStart ? 0 : -1}
                  aria-disabled={isLocked}
                  aria-pressed={isActive}
                  aria-label={`${i + 1}. Letter ${letterName(l.text)}${
                    isLocked
                      ? ", correct and locked"
                      : hasWrong
                        ? ", incorrect"
                        : connected
                          ? ", connected"
                          : ""
                  }`}
                  onClick={() => activate(node, false)}
                  onKeyDown={(e) => onNodeKeyDown(e, node)}
                >
                  <span className="num-wb-unit6-p2-q2">{i + 1}</span>

                  <span
                    className={`word-text-wb-unit6-p2-q2 ${
                      isActive ? "active-left" : ""
                    }`}
                  >
                    {l.text}
                  </span>

                  <div
                    className={`dot-wb-unit6-p2-q2 start-dot ${
                      isActive ? "active-dot" : ""
                    }`}
                    tabIndex={-1}
                    aria-hidden="true"
                  />

                  {hasWrong && (
                    <span
                      className="wrong-mark-sb-unit2-p5-q1"
                      aria-hidden="true"
                    >
                      ✕
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* IMAGES */}
          <div className="mid-col-wb-unit6-p2-q2">
            {images.map((img, i) => {
              const node = { type: "image", id: img.id };
              const inLocked = isNodeLocked(node, "in");
              const outLocked = isNodeLocked(node, "out");
              const canStart =
                !locked && !outLocked && (topDone || hasWrongLine(node));
              const isActive = sameNode(selection, node);
              const hasWrong = lines.some(
                (x) =>
                  x.kind === "image-right" &&
                  x.image === img.id &&
                  x.status === "wrong",
              );

              return (
                <div
                  key={img.id}
                  ref={(el) => {
                    nodeRefs.current[nodeKey(node)] = el;
                  }}
                  className="item-wb-unit6-p2-q2 clickable"
                  role="button"
                  tabIndex={canStart ? 0 : -1}
                  aria-disabled={locked || (inLocked && outLocked)}
                  aria-pressed={isActive}
                  aria-label={`Picture ${i + 1}: ${img.alt}${
                    inLocked && outLocked
                      ? ", correct and locked"
                      : hasWrong
                        ? ", incorrect"
                        : ""
                  }`}
                  onClick={() => activate(node, false)}
                  onKeyDown={(e) => onNodeKeyDown(e, node)}
                >
                  <div
                    className="dot-wb-unit6-p2-q2 end-dot"
                    tabIndex={-1}
                    aria-hidden="true"
                  />

                  <img
                    src={img.src}
                    alt={img.alt}
                    className={`matched-img2 ${locked ? "disabled-hover" : ""} ${
                      isActive ? "active-image" : ""
                    }`}
                  />

                  <div
                    className="dot-wb-unit6-p2-q2 start-dot"
                    tabIndex={-1}
                    aria-hidden="true"
                  />

                  {hasWrong && (
                    <span
                      className="wrong-mark-sb-unit2-p5-q1"
                      aria-hidden="true"
                    >
                      ✕
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* RIGHT (أهداف بالكيبورد: بتنفتح بالـ Tab لما يكون في مصدر مختار) */}
          <div className="right-col-wb-unit6-p2-q2">
            {rightParts.map((r, i) => {
              const node = { type: "right", id: r.id };
              const rLocked = locked || isNodeLocked(node, "in");

              return (
                <div
                  key={r.id}
                  ref={(el) => {
                    nodeRefs.current[nodeKey(node)] = el;
                  }}
                  className="item-wb-unit6-p2-q2 clickable"
                  role="button"
                  tabIndex={!rLocked && selection ? 0 : -1}
                  aria-disabled={rLocked}
                  aria-label={`Word ${i + 1}: ${wordLabel(r.text)}${
                    rLocked ? ", correct and locked" : ""
                  }`}
                  onClick={() => activate(node, false)}
                  onKeyDown={(e) => onNodeKeyDown(e, node)}
                >
                  <div
                    className="dot-wb-unit6-p2-q2 end-dot"
                    tabIndex={-1}
                    aria-hidden="true"
                  />
                  <span
                    className={`word-text-wb-unit6-p2-q2 ${
                      locked ? "disabled-word" : ""
                    }`}
                  >
                    {" "}
                    {r.text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* LINES: نهائي = solid ، Preview = dashed */}
          <svg className="lines-layer" aria-hidden="true">
            {lines.map((l) => {
              const { a, b } = lineEnds(l);
              const seg = segment(a, b);
              return (
                seg && <line key={l.id} {...seg} stroke="red" strokeWidth="3" />
              );
            })}

            {previewSegment && (
              <line
                {...previewSegment}
                stroke="red"
                strokeWidth="3"
                strokeDasharray="6 4"
              />
            )}
          </svg>
        </div>

        
      </div>

      {/* BUTTONS */}
      <div className="action-buttons-container">
        <button type="button" onClick={reset} className="try-again-button">
          Start Again ↻
        </button>
        <button type="button" onClick={showAnswer} className="show-answer-btn">
          Show Answer
        </button>
        <button type="button" onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit2_Page5_Q1;

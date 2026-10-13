import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";

import "./Unit4_Page5_Q1.css";

/* ================= DATA ================= */

// text = اللي بيبين بالشاشة
// spoken = اللي بيسمعه قارئ الشاشة (الشرطة السفلية "_" بتنقرأ blank)
const ITEMS = [
  { id: "i1", text: "p_ _ nt", spoken: "p, blank, blank, n, t" },
  { id: "i2", text: "c_ k _", spoken: "c, blank, k, blank" },
  { id: "i3", text: "pl _ _", spoken: "p, l, blank, blank" },
  { id: "i4", text: "l _ k _", spoken: "l, blank, k, blank" },
  { id: "i5", text: "M _ _", spoken: "M, blank, blank" },
  { id: "i6", text: "r _ _ n", spoken: "r, blank, blank, n" },
];

const WORDS = [
  { char: "a_e", color: "l", spoken: "a, e split pattern" },
  { char: "ai", color: "r", spoken: "a, i" },
  { char: "ay", color: "r", spoken: "a, y" },
];

const ANSWERS = [
  { word: "a_e", images: ["i2", "i4"] },
  { word: "ai", images: ["i1", "i6"] },
  { word: "ay", images: ["i3", "i5"] },
];

const TOTAL = ANSWERS.reduce((sum, a) => sum + a.images.length, 0);

/* ================= HELPERS (خارج الكومبوننت) ================= */

const nodeKey = (n) => `${n.type}-${n.id}`;
const sameNode = (a, b) => !!a && !!b && a.type === b.type && a.id === b.id;

const isLineCorrect = (l) =>
  ANSWERS.some((a) => a.word === l.word && a.images.includes(l.image));

const wordSpoken = (char) =>
  WORDS.find((w) => w.char === char)?.spoken ?? char;

const itemName = (id) => {
  const i = ITEMS.findIndex((item) => item.id === id);
  return `Word ${i + 1}: ${ITEMS[i]?.spoken ?? ""}`;
};

const nodeLabel = (n) =>
  n.type === "word" ? `Pattern ${wordSpoken(n.id)}` : itemName(n.id);

// ستايل الأهداف المسموح الربط معها
const validTargetStyle = {
  outline: "3px dashed #2c5287",
  outlineOffset: "4px",
};

const focusRingClass =
  "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2";

const Unit4_Page5_Q1 = () => {
  const ref = useRef(null);
  const nodeRefs = useRef({});
  const dotRefs = useRef({});

  // { image, word, status: null | "correct" | "wrong" }
  const [lines, setLines] = useState([]);
  const [selection, setSelection] = useState(null); // المصدر المختار
  const [previewTarget, setPreviewTarget] = useState(null); // الهدف الحالي بالكيبورد
  const [finished, setFinished] = useState(false); // كل شي صح بعد Check
  const [answerShown, setAnswerShown] = useState(false);
  const [message, setMessage] = useState("");
  const [, setTick] = useState(0);

  const disabled = finished || answerShown;

  const lineOfImage = (id) => lines.find((l) => l.image === id);
  const imageLocked = (id) => lineOfImage(id)?.status === "correct";
  const imageWrong = (id) => lineOfImage(id)?.status === "wrong";
  const wordCount = (char) => lines.filter((l) => l.word === char).length;

  // إعادة حساب مواقع الخطوط لما يتغير حجم الشاشة
  useEffect(() => {
    const onResize = () => setTick((n) => n + 1);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ================= GEOMETRY ================= */

  const dotCenter = (node) => {
    const el = dotRefs.current[nodeKey(node)];
    if (!el || !ref.current) return null;

    const r = el.getBoundingClientRect();
    const c = ref.current.getBoundingClientRect();

    return {
      x: r.left - c.left + r.width / 2,
      y: r.top - c.top + r.height / 2,
    };
  };

  const segment = (a, b) => {
    const p1 = dotCenter(a);
    const p2 = dotCenter(b);
    if (!p1 || !p2) return null;
    return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
  };

  const curve = ({ x1, y1, x2, y2 }) =>
    `M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`;

  /* ================= TARGETS ================= */

  // الكلمات هي المصدر: بتتوصل بنمط واحد. النمط بيقدر ياخد أكثر من كلمة.
  const availableTargets = (source) =>
    source.type === "image"
      ? WORDS.map((w) => ({ type: "word", id: w.char }))
      : ITEMS.map((i) => ({ type: "image", id: i.id })).filter(
          (n) => !imageLocked(n.id),
        );

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
    if (node.type === "image" && imageLocked(node.id)) {
      setMessage(`${itemName(node.id)} is correct and locked.`);
      return;
    }

    // التوصيل الغلط القديم للكلمة بينشال (ومعه الـ✕ تبعه فقط)
    if (node.type === "image") {
      setLines((prev) =>
        prev.filter((l) => !(l.status === "wrong" && l.image === node.id)),
      );
    }

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

    // الماوس بيسمح بالاتجاهين: نرتّب image / word
    const image = from.type === "image" ? from.id : to.id;
    const word = from.type === "word" ? from.id : to.id;

    if (imageLocked(image)) {
      setMessage(`${itemName(image)} is already correct and locked.`);
      return;
    }

    // الكلمة بتتوصل بنمط واحد: الخط الجديد بيستبدل القديم (الصح المقفول ما بينلمس)
    setLines((prev) => [
      ...prev.filter((l) => l.status === "correct" || l.image !== image),
      { image, word, status: null },
    ]);

    setSelection(null);
    setPreviewTarget(null);

    if (viaKeyboard) focusNode(from);

    setMessage(`${itemName(image)} connected to pattern ${wordSpoken(word)}.`);
  };

  const activate = (node, viaKeyboard) => {
    if (disabled) return;

    if (!selection) {
      // الكيبورد بيبدأ من المصدر (الكلمة) فقط
      if (viaKeyboard && node.type === "word") {
        setMessage("Start from a word, then choose a pattern.");
        return;
      }
      beginFrom(node, viaKeyboard);
      return;
    }

    connect(selection, node, viaKeyboard);
  };

  // Enter / Space (الماوس واللمس بيروحوا على onClick)
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

  /* ================= CHECK ================= */

  const checkAnswers = () => {
    // بعد Show Answer أو بعد ما كل شي صح: ما في شي نعمله
    if (disabled) return;

    if (lines.length < TOTAL) {
      const msg = "Please connect all the pairs.";
      ValidationAlert.info("Oops!", msg);
      setMessage(msg);
      return;
    }

    // الصح القديم بيضل مقفول، والباقي بينقيّم
    const checked = lines.map((l) =>
      l.status === "correct"
        ? l
        : { ...l, status: isLineCorrect(l) ? "correct" : "wrong" },
    );

    const correct = checked.filter((l) => l.status === "correct").length;

    setLines(checked);
    clearSelection();

    if (correct === TOTAL) setFinished(true);

    // فيدباك لكل كلمة
    const details = ITEMS.map((item, i) => {
      const l = checked.find((x) => x.image === item.id);
      return `Word ${i + 1} to pattern ${wordSpoken(l.word)}: ${
        l.status === "correct" ? "correct" : "incorrect"
      }`;
    }).join(". ");

    setMessage(
      `Score ${correct} out of ${TOTAL}. ${details}.${
        correct < TOTAL
          ? " Correct pairs are locked. Fix the words marked with a cross."
          : ""
      }`,
    );

    const color = correct === TOTAL ? "green" : correct === 0 ? "red" : "orange";

    ValidationAlert[
      correct === TOTAL ? "success" : correct === 0 ? "error" : "warning"
    ](
      `<div style="font-size:20px;text-align:center">
        <b style="color:${color}">Score: ${correct} / ${TOTAL}</b>
      </div>`,
    );
  };

  /* ================= SHOW ANSWER ================= */

  const show = () => {
    setLines(
      ANSWERS.flatMap((a) =>
        a.images.map((image) => ({ image, word: a.word, status: "correct" })),
      ),
    );
    clearSelection();
    setFinished(false);
    setAnswerShown(true);
    setMessage("Correct answers are shown.");
  };

  /* ================= START AGAIN ================= */

  const reset = () => {
    setLines([]);
    clearSelection();
    setFinished(false);
    setAnswerShown(false);
    setMessage("Exercise reset. All connections are cleared.");
  };

  /* ================= RENDER ================= */

  const previewSegment =
    selection && previewTarget ? segment(selection, previewTarget) : null;

  const keyboardTargetsOpen = Boolean(selection) && !disabled;

  const lineColor = (status) => (status === "correct" ? "#16a34a" : "red");

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      {/* 📢 رسائل لقارئ الشاشة */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {message}
      </div>

      <div className="div-forall">
        <ExerciseHeader
          sectionLetter="A"
          questionNumber="1"
          title="Match and write."
          subTitle="Start from one dot or word, then connect it to the matching pattern."
        />

        <p id="u4p5q1-help" className="sr-only">
          To connect with the keyboard, press Enter or Space on a word, press
          Tab to choose a pattern, then press Enter. A pattern can have more
          than one word. To replace a connection, select the word again and
          choose another pattern. Press Escape to cancel.
        </p>

        <div
          ref={ref}
          className="match-wrapper2-CB-review1-p2-q1"
          role="group"
          aria-label="Matching area"
          aria-describedby="u4p5q1-help"
          onKeyDown={onAreaKeyDown}
        >
          {/* ITEMS (TEXT) */}
          <div className="CB-unit4-p5-q1-images">
            {ITEMS.map((item, index) => {
              const node = { type: "image", id: item.id };
              const line = lineOfImage(item.id);
              const locked = imageLocked(item.id);
              const wrongMark = imageWrong(item.id);
              const isActive = sameNode(selection, node);
              const isValidTarget =
                keyboardTargetsOpen && selection.type === "word" && !locked;

              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    nodeRefs.current[nodeKey(node)] = el;
                  }}
                  className={`CB-review1-p2-q1-img-box ${focusRingClass}`}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isActive}
                  aria-disabled={disabled || locked}
                  aria-label={`${itemName(item.id)}${
                    line
                      ? `, connected to pattern ${wordSpoken(line.word)}`
                      : ", not connected"
                  }${
                    locked
                      ? ", correct and locked"
                      : wrongMark
                        ? ", incorrect, you can change it"
                        : ""
                  }${
                    isValidTarget
                      ? `. Press Enter to connect pattern ${wordSpoken(selection.id)}`
                      : ""
                  }`}
                  onClick={() => activate(node, false)}
                  onKeyDown={(e) => onNodeKeyDown(e, node)}
                  style={{
                    cursor: disabled || locked ? "default" : "pointer",
                    ...(isValidTarget ? validTargetStyle : {}),
                  }}
                >
                  <span className="CB-unit4-p5-q1-index" aria-hidden="true">
                    {index + 1}
                  </span>

                  <div
                    aria-hidden="true"
                    className={`
                      CB-review1-p2-q1-text-item
                      ${isActive ? "text-red-600 underline scale-110" : ""}
                      ${locked ? "ring-4 ring-green-600 rounded-lg" : ""}
                      ${wrongMark ? "ring-4 ring-red-500 rounded-lg" : ""}
                      transition-all duration-200
                    `}
                  >
                    {item.text}
                  </div>

                  {wrongMark && (
                    <span className="CB-review1-p2-q1-error" aria-hidden="true">
                      ✕
                    </span>
                  )}

                  <div
                    ref={(el) => {
                      dotRefs.current[nodeKey(node)] = el;
                    }}
                    aria-hidden="true"
                    className={`
                      CB-review1-p2-q1-dot CB-review1-p2-q1-dot-start
                      ${isActive ? "bg-red-600 scale-150" : ""}
                      transition-all duration-200
                    `}
                  />
                </div>
              );
            })}
          </div>

          {/* WORDS (PATTERNS): أهداف بالكيبورد، بتنفتح بالـ Tab لما يكون في مصدر مختار */}
          <div className="CB-review1-p2-q1-words">
            {WORDS.map((w) => {
              const node = { type: "word", id: w.char };
              const count = wordCount(w.char);
              const isActive = sameNode(selection, node);
              const isValidTarget =
                keyboardTargetsOpen && selection.type === "image";

              return (
                <div
                  key={w.char}
                  ref={(el) => {
                    nodeRefs.current[nodeKey(node)] = el;
                  }}
                  className={`CB-review1-p2-q1-word-box ${focusRingClass}`}
                  role="button"
                  tabIndex={keyboardTargetsOpen ? 0 : -1}
                  aria-pressed={isActive}
                  aria-disabled={disabled}
                  aria-label={`Pattern ${w.spoken}${
                    count > 0
                      ? `, connected to ${count} word${count > 1 ? "s" : ""}`
                      : ""
                  }${
                    isValidTarget
                      ? `. Press Enter to connect ${itemName(selection.id)}`
                      : ""
                  }`}
                  onClick={() => activate(node, false)}
                  onKeyDown={(e) => onNodeKeyDown(e, node)}
                  style={{
                    cursor: disabled ? "default" : "pointer",
                    ...(isValidTarget ? validTargetStyle : {}),
                  }}
                >
                  <h5
                    aria-hidden="true"
                    className={`
                      CB-unit4-p5-q1-word ${w.color}
                      ${isActive ? "text-red-600 underline scale-110" : ""}
                      ${
                        isValidTarget
                          ? "hover:text-red-600 hover:underline hover:scale-110"
                          : ""
                      }
                      transition-all duration-200
                    `}
                  >
                    {w.char}
                  </h5>

                  <div
                    ref={(el) => {
                      dotRefs.current[nodeKey(node)] = el;
                    }}
                    aria-hidden="true"
                    className={`
                      CB-review1-p2-q1-dot CB-review1-p2-q1-dot-end
                      ${isActive ? "bg-red-600 scale-150" : ""}
                      ${isValidTarget ? "hover:bg-red-600 hover:scale-125" : ""}
                      transition-all duration-200
                    `}
                  />
                </div>
              );
            })}
          </div>

          {/* LINES: نهائي = solid ، Preview / غلط = dashed */}
          <svg className="lines-layer" aria-hidden="true">
            {lines.map((l) => {
              const seg = segment(
                { type: "image", id: l.image },
                { type: "word", id: l.word },
              );

              return (
                seg && (
                  <path
                    key={`${l.image}-${l.word}`}
                    d={curve(seg)}
                    stroke={lineColor(l.status)}
                    strokeWidth="3"
                    strokeDasharray={l.status === "wrong" ? "6 4" : undefined}
                    fill="none"
                  />
                )
              );
            })}

            {previewSegment && (
              <path
                d={curve(previewSegment)}
                stroke="red"
                strokeWidth="3"
                strokeDasharray="6 4"
                fill="none"
              />
            )}
          </svg>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="action-buttons-container">
        <button type="button" onClick={reset} className="try-again-button">
          Start Again ↻
        </button>
        <button type="button" onClick={show} className="show-answer-btn">
          Show Answer
        </button>
        <button type="button" onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit4_Page5_Q1;
import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";

import img1 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 35/Ex G 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 35/Ex G 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 35/Ex G 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 35/Ex G 4.svg";

import "./Review3_Page2_Q3.css";

/* ================= DATA ================= */

// ⚠️ الـ alt تخمين حسب الأجوبة (j / y)، راجعه مع الصور الفعلية وعدّله.
// هون الجواب هو الحرف مش اسم الشي، فوصف الصورة لازم يذكر اسمها عشان الطالب يقدر يحلّ.
const IMAGES = [
  { id: "img1", src: img1, alt: "A jar of jam" },
  { id: "img2", src: img2, alt: "A jet flying in the sky" },
  { id: "img3", src: img3, alt: "A yo-yo toy" },
  { id: "img4", src: img4, alt: "A cup of yogurt" },
];

const WORDS = [
  { id: "j", char: "j", color: "l" },
  { id: "y", char: "y", color: "r" },
];

const ANSWERS = [
  { word: "j", images: ["img1", "img2"] },
  { word: "y", images: ["img3", "img4"] },
];

// الحرف الصح لكل صورة
const wordOfImage = Object.fromEntries(
  ANSWERS.flatMap((a) => a.images.map((img) => [img, a.word])),
);

const TOTAL = IMAGES.length;

/* ================= HELPERS (خارج الكومبوننت) ================= */

const nodeKey = (n) => `${n.type}-${n.id}`;
const sameNode = (a, b) => !!a && !!b && a.type === b.type && a.id === b.id;

const isLineCorrect = (l) => wordOfImage[l.image] === l.word;

const imageNumber = (id) => IMAGES.findIndex((i) => i.id === id) + 1;

const imageName = (id) => {
  const i = IMAGES.findIndex((img) => img.id === id);
  const alt = IMAGES[i]?.alt;
  return alt ? `Picture ${i + 1}: ${alt}` : `Picture ${i + 1}`;
};

const wordName = (id) => `Letter ${id}`;

const nodeLabel = (n) => (n.type === "image" ? imageName(n.id) : wordName(n.id));

// ستايل الأهداف المسموح الربط معها
const validTargetStyle = {
  outline: "3px dashed #2c5287",
  outlineOffset: "4px",
};

const focusRingClass =
  "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2";

const DRAG_THRESHOLD = 8; // px: أقل من هيك = كليك عادي

const Review3_Page2_Q3 = () => {
  const ref = useRef(null);
  const nodeRefs = useRef({});
  const dotRefs = useRef({});
  const justDraggedRef = useRef(0); // لتجاهل الكليك اللي بييجي بعد السحب

  // { image, word, status: null | "correct" | "wrong" }
  const [lines, setLines] = useState([]);
  const [selection, setSelection] = useState(null); // المصدر المختار
  const [previewTarget, setPreviewTarget] = useState(null); // الهدف الحالي بالكيبورد
  const [drag, setDrag] = useState(null); // { node, startX, startY, x, y, moved }
  const [finished, setFinished] = useState(false);
  const [answerShown, setAnswerShown] = useState(false);
  const [message, setMessage] = useState("");
  const [, setTick] = useState(0);

  const disabled = finished || answerShown;

  // الصورة إلها خط واحد، والحرف ممكن يكون إله أكتر من خط
  const lineOfImage = (id) => lines.find((l) => l.image === id);
  const linesOfWord = (id) => lines.filter((l) => l.word === id);

  // الصور بس هي الي بتنقفل (الحرف بيقبل أكتر من صورة)
  const isLocked = (node) =>
    node.type === "image" && lineOfImage(node.id)?.status === "correct";
  const isWrong = (node) =>
    node.type === "image" && lineOfImage(node.id)?.status === "wrong";

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

  // الصور فوق والحروف تحت: المنحنى عمودي
  const curve = ({ x1, y1, x2, y2 }) => {
    const my = (y1 + y2) / 2;
    return `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`;
  };

  const pointInContainer = (e) => {
    const c = ref.current.getBoundingClientRect();
    return { x: e.clientX - c.left, y: e.clientY - c.top };
  };

  /* ================= TARGETS ================= */

  // الأهداف = النوع المعاكس (الصور المقفولة ما بتنحسب)
  const availableTargets = (source) =>
    (source.type === "image"
      ? WORDS.map((w) => ({ type: "word", id: w.id }))
      : IMAGES.map((i) => ({ type: "image", id: i.id }))
    ).filter((n) => !isLocked(n));

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
    if (isLocked(node)) {
      setMessage(`${nodeLabel(node)} is correct and locked.`);
      return;
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

    if (isLocked(to)) {
      setMessage(`${nodeLabel(to)} is already correct and locked.`);
      return;
    }

    // الماوس بيسمح بالاتجاهين: نرتّب image / word
    const image = from.type === "image" ? from.id : to.id;
    const word = from.type === "word" ? from.id : to.id;

    // الخط الجديد بيستبدل أي خط قديم لنفس الصورة (الصح المقفول ما بينلمس)
    setLines((prev) => [
      ...prev.filter((l) => l.status === "correct" || l.image !== image),
      { image, word, status: null },
    ]);

    setSelection(null);
    setPreviewTarget(null);

    if (viaKeyboard) focusNode(from);

    setMessage(`Picture ${imageNumber(image)} connected to letter ${word}.`);
  };

  const activate = (node, viaKeyboard) => {
    // الكليك اللي بييجي بعد سحب ما منحسبه
    if (!viaKeyboard && Date.now() - justDraggedRef.current < 300) return;

    if (disabled) return;

    if (!selection) {
      beginFrom(node, viaKeyboard);
      return;
    }

    connect(selection, node, viaKeyboard);
  };

  /* ================= KEYBOARD ================= */

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

  /* ================= DRAG (ماوس / لمس) ================= */

  const onNodePointerDown = (e, node) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (disabled || isLocked(node)) return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* مش مشكلة */
    }

    const p = pointInContainer(e);
    setDrag({
      node,
      startX: e.clientX,
      startY: e.clientY,
      x: p.x,
      y: p.y,
      moved: false,
    });
  };

  const onAreaPointerMove = (e) => {
    if (!drag) return;

    // الماوس انرفع برا الصفحة
    if (e.pointerType === "mouse" && e.buttons === 0) {
      setDrag(null);
      if (drag.moved) clearSelection();
      return;
    }

    const farEnough =
      Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) >
      DRAG_THRESHOLD;

    if (!drag.moved && !farEnough) return;

    // أول حركة فعلية: اعتبرها بداية توصيل
    if (!drag.moved) beginFrom(drag.node, false);

    const p = pointInContainer(e);
    setDrag({ ...drag, moved: true, x: p.x, y: p.y });
  };

  const onAreaPointerUp = (e) => {
    if (!drag) return;

    const d = drag;
    setDrag(null);

    if (!d.moved) return; // كليك عادي: بيمشي على onClick

    justDraggedRef.current = Date.now();

    const el = document
      .elementFromPoint(e.clientX, e.clientY)
      ?.closest("[data-node]");

    if (!el) {
      clearSelection();
      setMessage("Connection cancelled.");
      return;
    }

    const target = { type: el.dataset.type, id: el.dataset.id };

    if (target.type === d.node.type) {
      clearSelection();
      setMessage("Connection cancelled.");
      return;
    }

    if (isLocked(target)) {
      clearSelection();
      setMessage(`${nodeLabel(target)} is already correct and locked.`);
      return;
    }

    connect(d.node, target, false);
  };

  const onAreaPointerCancel = () => {
    if (!drag) return;
    if (drag.moved) {
      clearSelection();
      setMessage("Connection cancelled.");
    }
    setDrag(null);
  };

  /* ================= CHECK ================= */

  const checkAnswers = () => {
    if (disabled) return;

    if (lines.length < TOTAL) {
      const msg = "Please connect all the pairs before checking.";
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
    setDrag(null);

    if (correct === TOTAL) setFinished(true);

    // فيدباك لكل صورة
    const details = IMAGES.map((img, i) => {
      const l = checked.find((x) => x.image === img.id);
      if (!l) return `Picture ${i + 1}: not connected`;
      return `Picture ${i + 1} to letter ${l.word}: ${
        l.status === "correct" ? "correct" : "incorrect"
      }`;
    }).join(". ");

    setMessage(
      `Score ${correct} out of ${TOTAL}. ${details}.${
        correct < TOTAL
          ? " Correct pairs are locked. Fix the pairs marked with a cross."
          : ""
      }`,
    );

    const color =
      correct === TOTAL ? "green" : correct === 0 ? "red" : "orange";

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
      IMAGES.map((img) => ({
        image: img.id,
        word: wordOfImage[img.id],
        status: "correct",
      })),
    );
    clearSelection();
    setDrag(null);
    setFinished(false);
    setAnswerShown(true);
    setMessage("Correct answers are shown.");
  };

  /* ================= START AGAIN ================= */

  const reset = () => {
    setLines([]);
    clearSelection();
    setDrag(null);
    setFinished(false);
    setAnswerShown(false);
    setMessage("Exercise reset. All connections are cleared.");
  };

  /* ================= RENDER ================= */

  const dragActive = Boolean(drag?.moved);

  const previewSegment = (() => {
    if (dragActive) {
      const p = dotCenter(drag.node);
      return p ? { x1: p.x, y1: p.y, x2: drag.x, y2: drag.y } : null;
    }
    return selection && previewTarget
      ? segment(selection, previewTarget)
      : null;
  })();

  const keyboardTargetsOpen = Boolean(selection) && !disabled;

  const lineColor = (status) => (status === "correct" ? "#16a34a" : "red");

  // كل الخصائص المشتركة بين الصورة والحرف (كيبورد + ماوس + لمس + ARIA)
  const nodeProps = (node) => {
    const locked = isLocked(node);
    const wrong = isWrong(node);
    const isActive = sameNode(selection, node);
    const isValidTarget =
      keyboardTargetsOpen && selection.type !== node.type && !locked;

    let partner = null;

    if (node.type === "image") {
      const l = lineOfImage(node.id);
      if (l) partner = `letter ${l.word}`;
    } else {
      const nums = linesOfWord(node.id).map((l) => imageNumber(l.image));
      if (nums.length) {
        partner = `${nums.length === 1 ? "picture" : "pictures"} ${nums.join(" and ")}`;
      }
    }

    const label = `${nodeLabel(node)}${
      partner ? `, connected to ${partner}` : ", not connected"
    }${
      locked
        ? ", correct and locked"
        : wrong
          ? ", incorrect, you can change it"
          : ""
    }${
      isValidTarget ? `. Press Enter to connect ${nodeLabel(selection)}` : ""
    }`;

    return {
      locked,
      wrong,
      isActive,
      isValidTarget,
      props: {
        ref: (el) => {
          nodeRefs.current[nodeKey(node)] = el;
        },
        role: "button",
        tabIndex: 0,
        "aria-pressed": isActive,
        "aria-disabled": disabled || locked,
        "aria-label": label,
        "data-node": "",
        "data-type": node.type,
        "data-id": node.id,
        onClick: () => activate(node, false),
        onKeyDown: (e) => onNodeKeyDown(e, node),
        onPointerDown: (e) => onNodePointerDown(e, node),
      },
      style: {
        cursor: disabled || locked ? "default" : "pointer",
        ...(isValidTarget ? validTargetStyle : {}),
      },
    };
  };

  const resultRing = (locked, wrong) =>
    locked
      ? "ring-4 ring-green-600 rounded-lg"
      : wrong
        ? "ring-4 ring-red-500 rounded-lg"
        : "";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
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

      <p id="r3p2q3-help" className="sr-only">
        Match each picture to the letter its word starts with. Press Tab to
        move between items and Enter or Space to select one. Then press Tab to
        choose its match and Enter to connect. Press Escape to cancel. You can
        also drag from one item to its match with a mouse or by touch.
      </p>

      <div className="div-forall" style={{ gap: "20px" }}>
        <ExerciseHeader
          sectionLetter="G"
          title="Look and match."
          subTitle="Start with one picture or phrase, then match it to the partner that means the same thing."
          isReview="true"
        />

        <div
          ref={ref}
          className="match-wrapper2-CB-review1-p2-q1"
          role="group"
          aria-label="Matching area"
          aria-describedby="r3p2q3-help"
          onKeyDown={onAreaKeyDown}
          onPointerMove={onAreaPointerMove}
          onPointerUp={onAreaPointerUp}
          onPointerCancel={onAreaPointerCancel}
        >
          {/* IMAGES */}
          <div className="CB-review1-p2-q1-images">
            {IMAGES.map((img, index) => {
              const node = { type: "image", id: img.id };
              const n = nodeProps(node);

              return (
                <div
                  key={img.id}
                  {...n.props}
                  className={`CB-review1-p2-q1-img-box CB-r3p2q3-node ${focusRingClass}`}
                  style={n.style}
                >
                  <img
                    src={img.src}
                    alt={`Picture ${index + 1}: ${img.alt}`}
                    draggable="false"
                    style={{ height: "120px", width: "120px" }}
                    className={`
                      CB-review1-p2-q1-img
                      ${disabled ? "disabled-hover" : ""}
                      ${n.isActive ? "scale-110 border-2 border-red-600 rounded-lg" : ""}
                      ${resultRing(n.locked, n.wrong)}
                      transition-all duration-200
                    `}
                  />

                  {n.wrong && (
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
                      ${n.isActive ? "scale-150 bg-red-600" : ""}
                      ${n.isValidTarget ? "hover:bg-red-600 hover:scale-125" : ""}
                      transition-all duration-200
                    `}
                  />
                </div>
              );
            })}
          </div>

          {/* WORDS */}
          <div className="CB-review1-p2-q1-words">
            {WORDS.map((w) => {
              const node = { type: "word", id: w.id };
              const n = nodeProps(node);

              return (
                <div
                  key={w.id}
                  {...n.props}
                  className={`CB-review1-p2-q1-word-box CB-r3p2q3-node ${focusRingClass}`}
                  style={n.style}
                >
                  <h5
                    aria-hidden="true"
                    className={`
                      CB-review1-p2-q1-word
                      ${w.color}
                      ${n.isActive ? "text-red-600 scale-125 underline" : ""}
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
                      ${n.isActive ? "scale-150 bg-red-600" : ""}
                      ${n.isValidTarget ? "hover:bg-red-600 hover:scale-125" : ""}
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
        <button
          type="button"
          onClick={show}
          className="show-answer-btn swal-continue"
        >
          Show Answer
        </button>
        <button type="button" onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Review3_Page2_Q3;
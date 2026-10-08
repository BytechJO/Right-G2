import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";

import img1 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 34/Asset 23.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 34/Asset 25.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 34/Asset 26.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 34/Asset 24.svg";

// ⚠️ تأكد من أسماء الملفات الكاملة (001 و 005 كانت مقصوصة بالسكرين شوت)
import driveAudio from "../../../assets/audio/ClassBook/U 4/Page 34 - B/Item_001_Can_she_drive_a_car.mp3";
import noSheCantAudio from "../../../assets/audio/ClassBook/U 4/Page 34 - B/Item_002_No,_she_can't.mp3";
import climbAudio from "../../../assets/audio/ClassBook/U 4/Page 34 - B/Item_003_Can_it_climb.mp3";
import noItCantAudio from "../../../assets/audio/ClassBook/U 4/Page 34 - B/Item_004_No,_it_can't.mp3";
import photoAudio from "../../../assets/audio/ClassBook/U 4/Page 34 - B/Item_005_Can_she_take_a_photo.mp3";
import yesSheCanAudio from "../../../assets/audio/ClassBook/U 4/Page 34 - B/Item_006_Yes,_she_can.mp3";
import swimAudio from "../../../assets/audio/ClassBook/U 4/Page 34 - B/Item_007_Can_she_swim.mp3";

import "./Review3_Page1_Q2.css";

/* ================= DATA ================= */

// ⚠️ عدّل الـ alt حسب اللي فعلاً موجود بكل صورة
const IMAGES = [
  { id: "img1", src: img1, alt: "A girl swimming in the water" },
  { id: "img2", src: img2, alt: "A girl taking a photo with a camera" },
  { id: "img3", src: img3, alt: "A girl standing next to a car" },
  { id: "img4", src: img4, alt: "An animal next to a tree" },
];

// كل جملة = سؤال + جواب، وصوتها بيشتغل بالترتيب (سؤال ثم جواب)
const SENTENCES = [
  {
    id: "s1",
    question: "Can she drive a car?",
    answer: "No, she can’t.",
    audio: [driveAudio, noSheCantAudio],
    image: "img3",
  },
  {
    id: "s2",
    question: "Can it climb?",
    answer: "No, it can’t.",
    audio: [climbAudio, noItCantAudio],
    image: "img4",
  },
  {
    id: "s3",
    question: "Can she take a photo?",
    answer: "Yes, she can.",
    audio: [photoAudio, yesSheCanAudio],
    image: "img2",
  },
  {
    id: "s4",
    question: "Can she swim?",
    answer: "Yes, she can.",
    audio: [swimAudio, yesSheCanAudio],
    image: "img1",
  },
];

const TOTAL = SENTENCES.length;

/* ================= HELPERS (خارج الكومبوننت) ================= */

const nodeKey = (n) => `${n.type}-${n.id}`;
const sameNode = (a, b) => !!a && !!b && a.type === b.type && a.id === b.id;

const isLineCorrect = (l) =>
  SENTENCES.some((s) => s.id === l.sentence && s.image === l.image);

const sentenceNumber = (id) => SENTENCES.findIndex((s) => s.id === id) + 1;
const imageNumber = (id) => IMAGES.findIndex((i) => i.id === id) + 1;

const imageName = (id) => {
  const i = IMAGES.findIndex((img) => img.id === id);
  const alt = IMAGES[i]?.alt;
  return alt ? `Picture ${i + 1}: ${alt}` : `Picture ${i + 1}`;
};

const sentenceName = (id) => {
  const i = SENTENCES.findIndex((s) => s.id === id);
  const s = SENTENCES[i];
  return `Sentence ${i + 1}: ${s.question} ${s.answer}`;
};

const nodeLabel = (n) =>
  n.type === "sentence" ? sentenceName(n.id) : imageName(n.id);

// ستايل الأهداف المسموح الربط معها
const validTargetStyle = {
  outline: "3px dashed #2c5287",
  outlineOffset: "4px",
};

const focusRingClass =
  "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2";

const DRAG_THRESHOLD = 8; // px: أقل من هيك = كليك عادي

const Review3_Page1_Q2 = () => {
  const ref = useRef(null);
  const nodeRefs = useRef({});
  const dotRefs = useRef({});
  const audioRef = useRef(null); // 🔊 مشغّل واحد بس
  const playTokenRef = useRef(0); // لإلغاء تسلسل الصوت القديم
  const skipSoundRef = useRef(false); // 🔇 لما نرجّع الفوكس برمجياً ما نشغّل الصوت
  const justDraggedRef = useRef(0); // لتجاهل الكليك اللي بييجي بعد السحب

  // { sentence, image, status: null | "correct" | "wrong" }
  const [lines, setLines] = useState([]);
  const [selection, setSelection] = useState(null); // المصدر المختار
  const [previewTarget, setPreviewTarget] = useState(null); // الهدف الحالي بالكيبورد
  const [drag, setDrag] = useState(null); // { node, startX, startY, x, y, moved }
  const [finished, setFinished] = useState(false);
  const [answerShown, setAnswerShown] = useState(false);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [, setTick] = useState(0);

  const disabled = finished || answerShown;

  const lineOf = (node) =>
    lines.find((l) =>
      node.type === "image" ? l.image === node.id : l.sentence === node.id,
    );
  const isLocked = (node) => lineOf(node)?.status === "correct";
  const isWrong = (node) => lineOf(node)?.status === "wrong";

  // إعادة حساب مواقع الخطوط لما يتغير حجم الشاشة
  useEffect(() => {
    const onResize = () => setTick((n) => n + 1);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // وقف الصوت لما يطلع الطالب من الصفحة
  useEffect(() => {
    return () => {
      playTokenRef.current += 1;
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  /* ================= AUDIO ================= */

  const stopSound = () => {
    playTokenRef.current += 1;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setPlayingId(null);
  };

  // بيشغّل صوت الجملة: السؤال وبعدين الجواب
  const playSound = (id) => {
    const s = SENTENCES.find((x) => x.id === id);
    if (!s?.audio?.length) return;

    stopSound();
    const token = playTokenRef.current;
    setPlayingId(id);

    const playAt = (i) => {
      if (token !== playTokenRef.current) return;
      if (i >= s.audio.length) {
        setPlayingId(null);
        return;
      }

      const audio = new Audio(s.audio[i]);
      audioRef.current = audio;

      audio.onended = () => playAt(i + 1);
      audio.onerror = () => {
        if (token === playTokenRef.current) setPlayingId(null);
      };
      audio.play().catch(() => {
        if (token === playTokenRef.current) setPlayingId(null);
      });
    };

    playAt(0);
  };

  // فوكس بالتاب (كيبورد) على جملة = شغّل الصوت
  const onSentenceFocus = (e, id) => {
    if (skipSoundRef.current) return;
    if (!e.currentTarget.matches(":focus-visible")) return; // الماوس بيروح على onClick
    playSound(id);
  };

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

  // الجمل فوق والصور تحت: المنحنى عمودي
  const curve = ({ x1, y1, x2, y2 }) => {
    const my = (y1 + y2) / 2;
    return `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`;
  };

  const pointInContainer = (e) => {
    const c = ref.current.getBoundingClientRect();
    return { x: e.clientX - c.left, y: e.clientY - c.top };
  };

  /* ================= TARGETS ================= */

  // الجملة بتتوصل بصورة وحدة والعكس. الأهداف = النوع المعاكس غير المقفول
  const availableTargets = (source) =>
    (source.type === "image"
      ? SENTENCES.map((s) => ({ type: "sentence", id: s.id }))
      : IMAGES.map((i) => ({ type: "image", id: i.id }))
    ).filter((n) => !isLocked(n));

  const focusNode = (n, silent = false) => {
    requestAnimationFrame(() => {
      const el = nodeRefs.current[nodeKey(n)];
      if (!el) return;
      // رجوع الفوكس برمجياً: بدون صوت
      skipSoundRef.current = silent;
      el.focus();
      skipSoundRef.current = false;
    });
  };

  /* ================= SELECTION / CONNECT ================= */

  const clearSelection = (focusBack = false) => {
    if (focusBack && selection) focusNode(selection, true);
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

    // الماوس بيسمح بالاتجاهين: نرتّب sentence / image
    const sentence = from.type === "sentence" ? from.id : to.id;
    const image = from.type === "image" ? from.id : to.id;

    // الخط الجديد بيستبدل أي خط قديم لنفس الجملة أو نفس الصورة (الصح المقفول ما بينلمس)
    setLines((prev) => [
      ...prev.filter(
        (l) =>
          l.status === "correct" ||
          (l.sentence !== sentence && l.image !== image),
      ),
      { sentence, image, status: null },
    ]);

    setSelection(null);
    setPreviewTarget(null);

    if (viaKeyboard) focusNode(from, true);

    setMessage(
      `Sentence ${sentenceNumber(sentence)} connected to Picture ${imageNumber(image)}.`,
    );
  };

  const activate = (node, viaKeyboard) => {
    // الكليك اللي بييجي بعد سحب ما منحسبه
    if (!viaKeyboard && Date.now() - justDraggedRef.current < 300) return;

    // 🔊 كليك/لمس على جملة = شغّل صوتها (حتى لو التمرين مقفول)
    if (!viaKeyboard && node.type === "sentence") playSound(node.id);

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
    setScore(correct);

    if (correct === TOTAL) setFinished(true);

    // فيدباك لكل زوج
    const details = SENTENCES.map((s, i) => {
      const l = checked.find((x) => x.sentence === s.id);
      if (!l) return `Sentence ${i + 1}: not connected`;
      return `Sentence ${i + 1} to Picture ${imageNumber(l.image)}: ${
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
    stopSound();
    setLines(
      SENTENCES.map((s) => ({
        sentence: s.id,
        image: s.image,
        status: "correct",
      })),
    );
    clearSelection();
    setDrag(null);
    setFinished(false);
    setAnswerShown(true);
    setScore(null);
    setMessage("Correct answers are shown.");
  };

  /* ================= START AGAIN ================= */

  const reset = () => {
    stopSound();
    setLines([]);
    clearSelection();
    setDrag(null);
    setFinished(false);
    setAnswerShown(false);
    setScore(null);
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

  // كل الخصائص المشتركة بين الجملة والصورة (كيبورد + ماوس + لمس + ARIA)
  const nodeProps = (node) => {
    const line = lineOf(node);
    const locked = isLocked(node);
    const wrong = isWrong(node);
    const isActive = sameNode(selection, node);
    const isValidTarget =
      keyboardTargetsOpen && selection.type !== node.type && !locked;

    const partner = line
      ? node.type === "image"
        ? `sentence ${sentenceNumber(line.sentence)}`
        : `picture ${imageNumber(line.image)}`
      : null;

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
        onFocus:
          node.type === "sentence"
            ? (e) => onSentenceFocus(e, node.id)
            : undefined,
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

      <p id="r3p1q2-help" className="sr-only">
        Match each sentence to one picture. Press Tab to move between items and
        Enter or Space to select one. Then press Tab to choose its match and
        Enter to connect. Press Escape to cancel. You can also drag from one
        item to its match with a mouse or by touch.
      </p>

      <div className="div-forall" style={{ gap: "45px" }}>
        <ExerciseHeader
          sectionLetter="B"
          title="Read and match."
          subTitle="Start with one picture or phrase, then match it to the partner that means the same thing."
          isReview="true"
        />

        <div
          ref={ref}
          className="CB-review3-p1-q2-wrapper"
          role="group"
          aria-label="Matching area"
          aria-describedby="r3p1q2-help"
          onKeyDown={onAreaKeyDown}
          onPointerMove={onAreaPointerMove}
          onPointerUp={onAreaPointerUp}
          onPointerCancel={onAreaPointerCancel}
        >
          {/* SENTENCES */}
          <div className="CB-review3-p1-q2-words-row">
            {SENTENCES.map((s, index) => {
              const node = { type: "sentence", id: s.id };
              const n = nodeProps(node);
              const isPlaying = playingId === s.id;

              return (
                <div
                  key={s.id}
                  {...n.props}
                  className={`CB-review3-p1-q2-word-box ${focusRingClass}`}
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    ...n.style,
                  }}
                >
                  <div>
                    <div style={{ position: "relative", display: "flex" }}>
                      <span
                        style={{
                          color: "darkblue",
                          fontWeight: "700",
                          marginRight: "5px",
                        }}
                      >
                        {index + 1}
                      </span>
                      <h5
                        aria-hidden="true"
                        className={`
                          CB-review3-p1-q2-word
                          ${resultRing(n.locked, n.wrong)}
                          ${n.isActive ? "text-red-600 underline scale-105" : ""}
                          transition-all duration-200 gap-5
                        `}
                        style={{ width: "100%" }}
                      >
                        <span>
                          <span style={{ display: "block" }}>{s.question}</span>
                          <span style={{ display: "block" }}>{s.answer}</span>
                        </span>
                      </h5>

                      {/* 🔊 بتظهر مع الفوكس بالتاب أو لما الصوت يشتغل */}
                      <span
                        className={`CB-review3-p1-q2-speaker ${
                          isPlaying ? "playing" : ""
                        }`}
                        aria-hidden="true"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="22"
                          height="22"
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

                      {n.wrong && (
                        <span
                          className="CB-review3-p1-q2-error-mark"
                          aria-hidden="true"
                        >
                          ✕
                        </span>
                      )}
                    </div>

                    <div
                      ref={(el) => {
                        dotRefs.current[nodeKey(node)] = el;
                      }}
                      aria-hidden="true"
                      className={`
                        CB-review3-p1-q2-dot CB-review3-p1-q2-start-dot
                        ${n.isActive ? "bg-red-600 scale-150" : ""}
                        ${n.isValidTarget ? "hover:bg-red-600 hover:scale-125" : ""}
                        transition-all duration-200
                      `}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* IMAGES */}
          <div className="CB-review3-p1-q2-images-row">
            {IMAGES.map((img) => {
              const node = { type: "image", id: img.id };
              const n = nodeProps(node);

              return (
                <div
                  key={img.id}
                  {...n.props}
                  className={`CB-review3-p1-q2-img-box ${focusRingClass}`}
                  style={n.style}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    draggable="false"
                    className={`
                      CB-review3-p1-q2-image
                      ${n.isActive ? "border-4 border-red-600 scale-105 rounded-lg" : ""}
                      ${resultRing(n.locked, n.wrong)}
                      transition-all duration-200
                    `}
                  />

                  {n.wrong && (
                    <span
                      className="CB-review3-p1-q2-error-mark"
                      aria-hidden="true"
                    >
                      ✕
                    </span>
                  )}

                  <div
                    ref={(el) => {
                      dotRefs.current[nodeKey(node)] = el;
                    }}
                    aria-hidden="true"
                    className={`
                      CB-review3-p1-q2-dot CB-review3-p1-q2-end-dot
                      ${n.isActive ? "bg-red-600 scale-150" : ""}
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
                { type: "sentence", id: l.sentence },
                { type: "image", id: l.image },
              );

              return (
                seg && (
                  <path
                    key={`${l.sentence}-${l.image}`}
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

export default Review3_Page1_Q2;

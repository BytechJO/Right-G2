import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 17/Ex C 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 17/Ex C 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 17/Ex C 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 17/Ex C 4.svg";

import rabbitAudio from "../../../assets/audio/ClassBook/U 2/Page 17 - C/Rabbit.mp3";
import ringAudio from "../../../assets/audio/ClassBook/U 2/Page 17 - C/Ring.mp3";
import logAudio from "../../../assets/audio/ClassBook/U 2/Page 17 - C/Log.mp3";
import lemonAudio from "../../../assets/audio/ClassBook/U 2/Page 17 - C/Lemon.mp3";

import "./Review1_Page2_Q1.css";
import ExerciseHeader from "../../ExerciseHeader";

/* ================= DATA ================= */

const IMAGES = [
  { id: "img1", src: img1, audio: rabbitAudio, alt: "a small brown animal with long ears" },
  { id: "img2", src: img2, audio: ringAudio, alt: "a shiny yellow circle with a blue jewel" },
  { id: "img3", src: img3, audio: logAudio, alt: "a piece of a tree trunk" },
  { id: "img4", src: img4, audio: lemonAudio, alt: "a yellow fruit cut in half" },
];

const WORDS = [
  { char: "l", color: "l" },
  { char: "r", color: "r" },
];

const ANSWERS = [
  { word: "l", images: ["img3", "img4"] },
  { word: "r", images: ["img1", "img2"] },
];

const TOTAL = ANSWERS.reduce((sum, a) => sum + a.images.length, 0);

/* ================= HELPERS (خارج الكومبوننت) ================= */

const nodeKey = (n) => `${n.type}-${n.id}`;
const sameNode = (a, b) => !!a && !!b && a.type === b.type && a.id === b.id;

const isLineCorrect = (l) =>
  ANSWERS.some((a) => a.word === l.word && a.images.includes(l.image));

const imageName = (id) => {
  const i = IMAGES.findIndex((img) => img.id === id);
  const alt = IMAGES[i]?.alt;
  return alt ? `Picture ${i + 1}: ${alt}` : `Picture ${i + 1}`;
};

const nodeLabel = (n) =>
  n.type === "word" ? `Letter ${n.id}` : imageName(n.id);

// ستايل الأهداف المسموح الربط معها
const validTargetStyle = {
  outline: "3px dashed #2c5287",
  outlineOffset: "4px",
};

const focusRingClass =
  "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2";

const Review1_Page2_Q1 = () => {
  const ref = useRef(null);
  const nodeRefs = useRef({});
  const dotRefs = useRef({});
  const audioRef = useRef(null); // 🔊 مشغّل واحد بس
  const skipSoundRef = useRef(false); // 🔇 لما نرجّع الفوكس برمجياً ما نشغّل الصوت

  // { image, word, status: null | "correct" | "wrong" }
  const [lines, setLines] = useState([]);
  const [selection, setSelection] = useState(null); // المصدر المختار
  const [previewTarget, setPreviewTarget] = useState(null); // الهدف الحالي بالكيبورد
  const [finished, setFinished] = useState(false); // كل شي صح بعد Check
  const [answerShown, setAnswerShown] = useState(false);
  const [message, setMessage] = useState("");
  const [playingId, setPlayingId] = useState(null); // 🔊 أي صورة صوتها شغّال
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

  // وقف الصوت لما يطلع الطالب من الصفحة
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  /* ================= AUDIO ================= */

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlayingId(null);
  };

  const playSound = (id) => {
    const img = IMAGES.find((i) => i.id === id);
    if (!img?.audio) return;

    // وقف أي صوت قديم وشغّل الجديد من الأول
    audioRef.current?.pause();

    const audio = new Audio(img.audio);
    audioRef.current = audio;
    setPlayingId(id);

    audio.onended = () => setPlayingId(null);
    audio.onerror = () => setPlayingId(null);
    audio.play().catch(() => setPlayingId(null));
  };

  // فوكس بالتاب (كيبورد) على صورة = شغّل الصوت
  const onImageFocus = (e, id) => {
    if (skipSoundRef.current) {
      skipSoundRef.current = false;
      return;
    }
    if (!e.target.matches(":focus-visible")) return; // الماوس بيروح على onClick
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

  const curve = ({ x1, y1, x2, y2 }) =>
    `M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`;

  /* ================= TARGETS ================= */

  // الصور هي المصدر: بتتوصل بحرف واحد. الحرف بيقدر ياخد أكثر من صورة.
  const availableTargets = (source) =>
    source.type === "image"
      ? WORDS.map((w) => ({ type: "word", id: w.char }))
      : IMAGES.map((i) => ({ type: "image", id: i.id })).filter(
          (n) => !imageLocked(n.id),
        );

  const focusNode = (n) => {
    requestAnimationFrame(() => {
      // رجوع الفوكس برمجياً لصورة: بدون صوت
      if (n.type === "image") skipSoundRef.current = true;
      nodeRefs.current[nodeKey(n)]?.focus();
    });
  };

  /* ================= SELECTION / CONNECT ================= */

  const clearSelection = (focusBack = false) => {
    if (focusBack && selection) focusNode(selection);
    setSelection(null);
    setPreviewTarget(null);
  };

  const beginFrom = (node, viaKeyboard) => {
    if (node.type === "image" && imageLocked(node.id)) {
      setMessage(`${imageName(node.id)} is correct and locked.`);
      return;
    }

    // التوصيل الغلط القديم للصورة بينشال (ومعه الـ✕ تبعه فقط)
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
      setMessage(`${imageName(image)} is already correct and locked.`);
      return;
    }

    // الصورة بتتوصل بحرف واحد: الخط الجديد بيستبدل القديم (الصح المقفول ما بينلمس)
    setLines((prev) => [
      ...prev.filter((l) => l.status === "correct" || l.image !== image),
      { image, word, status: null },
    ]);

    setSelection(null);
    setPreviewTarget(null);

    if (viaKeyboard) focusNode(from);

    setMessage(`${imageName(image)} connected to letter ${word}.`);
  };

  const activate = (node, viaKeyboard) => {
    // 🔊 كليك/لمس على صورة = شغّل صوتها (حتى لو التمرين مقفول)
    if (!viaKeyboard && node.type === "image") playSound(node.id);

    if (disabled) return;

    if (!selection) {
      // الكيبورد بيبدأ من المصدر (الصورة) فقط
      if (viaKeyboard && node.type === "word") {
        setMessage("Start from a picture, then choose a letter.");
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

    // فيدباك لكل زوج
    const details = IMAGES.map((img, i) => {
      const l = checked.find((x) => x.image === img.id);
      return `Picture ${i + 1} to letter ${l.word}: ${
        l.status === "correct" ? "correct" : "incorrect"
      }`;
    }).join(". ");

    setMessage(
      `Score ${correct} out of ${TOTAL}. ${details}.${
        correct < TOTAL
          ? " Correct pairs are locked. Fix the pictures marked with a cross."
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
    stopSound();
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

      <div className="div-forall" style={{}}>
        <ExerciseHeader
          sectionLetter="C"
          // questionNumber="1"
          title="Look and match."
          subTitle="Start from one dot or picture, then connect it to the matching partner."
          isReview="true"
        />{" "}
        <div
          ref={ref}
          className="match-wrapper2-CB-review1-p2-q1"
          role="group"
          aria-label="Matching area"
          aria-describedby="r1p2q1-help"
          onKeyDown={onAreaKeyDown}
        >
          {/* IMAGES */}
          <div className="CB-review1-p2-q1-images">
            {IMAGES.map((img) => {
              const node = { type: "image", id: img.id };
              const line = lineOfImage(img.id);
              const locked = imageLocked(img.id);
              const wrongMark = imageWrong(img.id);
              const isActive = sameNode(selection, node);
              const isPlaying = playingId === img.id;
              const isValidTarget =
                keyboardTargetsOpen && selection.type === "word" && !locked;

              return (
                <div
                  key={img.id}
                  ref={(el) => {
                    nodeRefs.current[nodeKey(node)] = el;
                  }}
                  className={`CB-review1-p2-q1-img-box ${focusRingClass}`}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isActive}
                  aria-disabled={disabled || locked}
                  aria-label={`${imageName(img.id)}${
                    line
                      ? `, connected to letter ${line.word}`
                      : ", not connected"
                  }${
                    locked
                      ? ", correct and locked"
                      : wrongMark
                        ? ", incorrect, you can change it"
                        : ""
                  }${
                    isValidTarget
                      ? `. Press Enter to connect letter ${selection.id}`
                      : ""
                  }`}
                  onClick={() => activate(node, false)}
                  onFocus={(e) => onImageFocus(e, img.id)}
                  onKeyDown={(e) => onNodeKeyDown(e, node)}
                  style={{
                    cursor: disabled || locked ? "default" : "pointer",
                    ...(isValidTarget ? validTargetStyle : {}),
                  }}
                >
                  <img
                    src={img.src}
                    alt=""
                    aria-hidden="true"
                    draggable="false"
                    className={`
                      CB-review1-p2-q1-img
                      ${
                        isActive
                          ? "border-4 border-red-600 scale-105 rounded-lg"
                          : ""
                      }
                      ${locked ? "ring-4 ring-green-600 rounded-lg" : ""}
                      ${wrongMark ? "ring-4 ring-red-500 rounded-lg" : ""}
                      transition-all duration-200
                    `}
                  />

                  {/* 🔊 أيقونة السبيكر: بتظهر مع الفوكس بالتاب أو لما الصوت يشتغل */}
                  <span
                    className={`CB-review1-p2-q1-speaker ${
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

          {/* WORDS (أهداف بالكيبورد: بتنفتح بالـ Tab لما يكون في مصدر مختار) */}
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
                  aria-label={`Letter ${w.char}${
                    count > 0
                      ? `, connected to ${count} picture${count > 1 ? "s" : ""}`
                      : ""
                  }${
                    isValidTarget
                      ? `. Press Enter to connect ${imageName(selection.id)}`
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
                      CB-review1-p2-q1-word ${w.color}
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

export default Review1_Page2_Q1;
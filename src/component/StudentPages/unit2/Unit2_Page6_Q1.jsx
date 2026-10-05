import React, { useState, useRef, useEffect } from "react";
import img1 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 15/Ex D 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 15/Ex D 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 15/Ex D 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 15/Ex D 4.svg";
import img5 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 15/Ex D 5.svg";
import img6 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 15/Ex D 6.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit2_Page6_Q1.css";
import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

// 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";

import blueSound from "../../../assets/audio/ClassBook/U 2/Page 15 - D/blue.mp3";
import brownSound from "../../../assets/audio/ClassBook/U 2/Page 15 - D/brown.mp3";
import greenSound from "../../../assets/audio/ClassBook/U 2/Page 15 - D/green.mp3";
import pinkSound from "../../../assets/audio/ClassBook/U 2/Page 15 - D/pink.mp3";
import redSound from "../../../assets/audio/ClassBook/U 2/Page 15 - D/red.mp3";
import yellowSound from "../../../assets/audio/ClassBook/U 2/Page 15 - D/yellow.mp3";

// 🔊 true = الصوت يشتغل تلقائياً لما الطالب يوقف على الكلمة بالتاب
const PLAY_ON_FOCUS = true;
/* ================= DATA ================= */

const MATCHES = [
  { word: "yellow", image: "img4", src: img4, audio: yellowSound },
  { word: "red", image: "img3", src: img3, audio: redSound },
  { word: "green", image: "img1", src: img1, audio: greenSound },
  { word: "brown", image: "img6", src: img6, audio: brownSound },
  { word: "blue", image: "img2", src: img2, audio: blueSound },
  { word: "pink", image: "img5", src: img5, audio: pinkSound },
];

// الكلمة → ملف الصوت
const soundByWord = Object.fromEntries(MATCHES.map((m) => [m.word, m.audio]));

// ⚠️ الـ alt مؤقت: وصفي الغرض اللي بالصورة بدون ذكر اللون (لأنو اللون هو الجواب)
const images = [
  { image: "img1", src: img1, alt: "Picture 1" },
  { image: "img2", src: img2, alt: "Picture 2" },
  { image: "img3", src: img3, alt: "Picture 3" },
  { image: "img4", src: img4, alt: "Picture 4" },
  { image: "img5", src: img5, alt: "Picture 5" },
  { image: "img6", src: img6, alt: "Picture 6" },
];

/* ================= HELPERS (خارج الكومبوننت) ================= */

const nodeKey = (n) => `${n.type}-${n.id}`;
const sameNode = (a, b) => !!a && !!b && a.type === b.type && a.id === b.id;

const isLineCorrect = (l) =>
  MATCHES.some((m) => m.word === l.word && m.image === l.image);

const imageAlt = (id) => images.find((i) => i.image === id)?.alt;

const nodeLabel = (n) => (n.type === "word" ? `Word ${n.id}` : imageAlt(n.id));

const Unit2_Page6_Q1 = () => {
  const containerRef = useRef(null);
  const nodeRefs = useRef({});

  const [lines, setLines] = useState([]); // { word, image, status: null|"correct"|"wrong" }
  const [selection, setSelection] = useState(null); // المصدر المختار
  const [previewTarget, setPreviewTarget] = useState(null); // الهدف الحالي بالكيبورد
  const [finished, setFinished] = useState(false); // كل شي صح بعد Check
  const [answerShown, setAnswerShown] = useState(false);
  const [message, setMessage] = useState("");
  const [, setTick] = useState(0);
  const audioOwner = useRef({}).current;
  const [activeAudio, setActiveAudio] = useState(null); // الكلمة الي صوتها شغّال
  const locked = finished || answerShown;
  const disabled = locked;

  /* ================= AUDIO ================= */

  const stopAudio = () => {
    stopGlobalAudio(audioOwner);
    setActiveAudio(null);
  };

  const playWordAudio = (word) => {
    const src = soundByWord[word];
    if (!src) return;

    playGlobalAudio(src, {
      owner: audioOwner,
      onFinish: () => setActiveAudio((prev) => (prev === word ? null : prev)),
    });

    setActiveAudio(word);
  };

  // وقف الصوت إذا سكرت الصفحة
  useEffect(() => () => stopGlobalAudio(audioOwner), [audioOwner]);

  // 🔊 الصوت لما الطالب يوقف على الكلمة بالتاب (مش بالماوس)
  const handleWordFocus = (e, word) => {
    if (!PLAY_ON_FOCUS) return;
    if (!e.currentTarget.matches(":focus-visible")) return; // تجاهل تركيز الماوس
    playWordAudio(word);
  };
  // إعادة حساب مواقع الخطوط لما يتغير حجم الشاشة
  useEffect(() => {
    const onResize = () => setTick((n) => n + 1);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ================= GEOMETRY ================= */

  const getPos = (el) => {
    if (!el || !containerRef.current) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    const c = containerRef.current.getBoundingClientRect();
    return { x: r.left - c.left + 8, y: r.top - c.top + 8 };
  };

  const dotOf = (node) =>
    containerRef.current?.querySelector(
      node.type === "word"
        ? `[data-word="${node.id}"]`
        : `[data-image="${node.id}"]`,
    );

  const segment = (a, b) => {
    const d1 = dotOf(a);
    const d2 = dotOf(b);
    if (!d1 || !d2) return null;
    const p1 = getPos(d1);
    const p2 = getPos(d2);
    return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
  };

  const curve = ({ x1, y1, x2, y2 }) =>
    `M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`;

  /* ================= LOCKS / TARGETS ================= */

  const isNodeLocked = (node) =>
    lines.some(
      (l) =>
        l.status === "correct" &&
        (node.type === "word" ? l.word === node.id : l.image === node.id),
    );

  const hasWrong = (node) =>
    lines.some(
      (l) =>
        l.status === "wrong" &&
        (node.type === "word" ? l.word === node.id : l.image === node.id),
    );

  const availableTargets = (source) =>
    (source.type === "word"
      ? images.map((i) => ({ type: "image", id: i.image }))
      : MATCHES.map((m) => ({ type: "word", id: m.word }))
    ).filter((n) => !isNodeLocked(n));

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
    if (isNodeLocked(node)) {
      setMessage("This one is correct and locked.");
      return;
    }

    // التوصيل الغلط القديم لهاد العنصر بينشال (ومعه الـ✕ تبعه فقط)
    setLines((prev) =>
      prev.filter(
        (l) =>
          !(
            l.status === "wrong" &&
            (node.type === "word" ? l.word === node.id : l.image === node.id)
          ),
      ),
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

    if (isNodeLocked(from) || isNodeLocked(to)) {
      setMessage("That one is already correct and locked.");
      return;
    }

    // الماوس بيسمح بالاتجاهين: نرتّب word / image
    const word = from.type === "word" ? from.id : to.id;
    const image = from.type === "image" ? from.id : to.id;

    // One-to-One: الخط الجديد بيستبدل أي خط غلط متعارض (الصح المقفول ما بينلمس)
    setLines((prev) => [
      ...prev.filter(
        (l) => l.status === "correct" || (l.word !== word && l.image !== image),
      ),
      { word, image, status: null },
    ]);

    setSelection(null);
    setPreviewTarget(null);

    if (viaKeyboard) focusNode(from);

    setMessage(`${nodeLabel(from)} connected to ${nodeLabel(to)}.`);
  };

  const activate = (node, viaKeyboard) => {
    // 🔊 الصوت بس للكلمات، وبيشتغل حتى لو النشاط مقفول
    if (node.type === "word") playWordAudio(node.id);

    if (disabled) return;

    if (!selection) {
      // الكيبورد بيبدأ من المصدر (الكلمة) فقط
      if (viaKeyboard && node.type === "image") {
        setMessage("Start from a word, then choose a picture.");
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
    if (locked) return;

    if (lines.length < MATCHES.length) {
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
    const total = MATCHES.length;

    setLines(checked);
    clearSelection();

    if (correct === total) setFinished(true);

    setMessage(
      correct === total
        ? `Score ${correct} out of ${total}. All answers are correct.`
        : `Score ${correct} out of ${total}. Correct answers are locked. Fix the words marked with a cross.`,
    );

    const color =
      correct === total ? "green" : correct === 0 ? "red" : "orange";

    ValidationAlert[
      correct === total ? "success" : correct === 0 ? "error" : "warning"
    ](
      `<div style="font-size:20px;text-align:center">
        <b style="color:${color}">Score: ${correct} / ${total}</b>
      </div>`,
    );
  };

  /* ================= SHOW ANSWER ================= */

  const show = () => {
    stopAudio();
    setLines(
      MATCHES.map((m) => ({ word: m.word, image: m.image, status: "correct" })),
    );
    clearSelection();
    setFinished(false);
    setAnswerShown(true);
    setMessage("Correct answers are shown.");
  };

  /* ================= RESET ================= */

  const reset = () => {
    stopAudio();
    setLines([]);
    clearSelection();
    setFinished(false);
    setAnswerShown(false);
    setMessage("Exercise reset. All connections are cleared.");
  };

  /* ================= RENDER ================= */

  const previewSegment =
    selection && previewTarget ? segment(selection, previewTarget) : null;

  const keyboardTargetsOpen = selection && !disabled;

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {message}
      </div>

      <div className="div-forall" style={{}}>
        <div className="CB-unit2-p6-q1-container2">
          <ExerciseHeader
            sectionLetter="D"
            // questionNumber="1"
            title="Read and match."
            subTitle="Start from one dot or picture, then connect it to the matching partner."
          />
          <p id="u2p6q1-help" className="sr-only">
            To connect with the keyboard, press Enter or Space on a word, press
            Tab to choose a picture, then press Enter. Press Escape to cancel.
          </p>

          <div
            className="CB-unit2-p6-q1-match-wrapper2"
            ref={containerRef}
            role="group"
            aria-label="Matching area"
            aria-describedby="u2p6q1-help"
            onKeyDown={onAreaKeyDown}
          >
            {/* WORDS */}
            <div className="u2-match-words">
              {MATCHES.map((m, i) => {
                const node = { type: "word", id: m.word };
                const wLocked = disabled || isNodeLocked(node);
                const isActive = sameNode(selection, node);
                const wrongMark = hasWrong(node);
                const connected = lines.some((l) => l.word === m.word);

                return (
                  <div key={m.word} className="u2-word-item">
                    <span className="u2-word-index">{i + 1}</span>

                    <div
                      ref={(el) => {
                        nodeRefs.current[nodeKey(node)] = el;
                      }}
                      className={`CB-unit2-p6-q1-dot-container interactive ${
                        isNodeLocked(node) ? "is-correct" : ""
                      } ${disabled ? "is-disabled" : ""}`}
                      role="button"
                      tabIndex={0}
                      aria-disabled={wLocked}
                      onFocus={(e) => handleWordFocus(e, m.word)}
                      // aria-disabled={wLocked}
                      aria-pressed={isActive}
                      aria-label={`${i + 1}. ${m.word}${
                        wLocked
                          ? ", correct and locked"
                          : wrongMark
                            ? ", incorrect"
                            : connected
                              ? ", connected"
                              : ""
                      }`}
                      onClick={() => activate(node, false)}
                      onKeyDown={(e) => onNodeKeyDown(e, node)}
                    >
                      <h5
                        aria-hidden="true"
                        className={`u2-word ${
                          isActive ? "text-red-600 underline scale-110" : ""
                        } transition-all duration-200`}
                      >
                        {m.word}
                      </h5>
                      {activeAudio === m.word && (
                        <span className="u2-speaker" aria-hidden="true">
                          <FaVolumeUp />
                        </span>
                      )}
                      {wrongMark && (
                        <span
                          className="CB-unit2-p6-q1-error-mark-img"
                          aria-hidden="true"
                        >
                          ✕
                        </span>
                      )}

                      <div
                        className={`
                          dot1 dot-start1
                          ${isActive ? "bg-red-600 scale-150" : ""}
                          transition-all duration-200
                        `}
                        data-word={m.word}
                        tabIndex={-1}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* IMAGES (أهداف بالكيبورد: بتنفتح بالـ Tab لما يكون في مصدر مختار) */}
            <div className="u2-match-images">
              {images.map((m) => {
                const node = { type: "image", id: m.image };
                const iLocked = disabled || isNodeLocked(node);
                const isActive = sameNode(selection, node);
                // const isPreview = sameNode(previewTarget, node);
                const wrongMark = hasWrong(node);

                return (
                  <div
                    key={m.image}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      ref={(el) => {
                        nodeRefs.current[nodeKey(node)] = el;
                      }}
                      className={`u2-image-wrapper interactive ${
                        isNodeLocked(node) ? "is-correct" : ""
                      } ${disabled ? "is-disabled" : ""}`}
                      role="button"
                      tabIndex={keyboardTargetsOpen && !iLocked ? 0 : -1}
                      aria-disabled={iLocked}
                      aria-pressed={isActive}
                      aria-label={`${m.alt}${
                        iLocked
                          ? ", correct and locked"
                          : wrongMark
                            ? ", incorrect"
                            : ""
                      }${
                        keyboardTargetsOpen &&
                        !iLocked &&
                        selection.type === "word"
                          ? `. Press Enter to connect ${selection.id}`
                          : ""
                      }`}
                      onClick={() => activate(node, false)}
                      onKeyDown={(e) => onNodeKeyDown(e, node)}
                    >
                      <div
                        className="dot1 dot-end1"
                        data-image={m.image}
                        tabIndex={-1}
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          bottom: "119px",
                          zIndex: "9",
                        }}
                      />

                      <img
                        src={m.src}
                        alt={m.alt}
                        className={`u2-image transition-all duration-200`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* LINES: نهائي = solid ، Preview = dashed */}
            <svg className="lines-layer" aria-hidden="true">
              {lines.map((l) => {
                const seg = segment(
                  { type: "word", id: l.word },
                  { type: "image", id: l.image },
                );

                return (
                  seg && (
                    <path
                      key={`${l.word}-${l.image}`}
                      d={curve(seg)}
                      stroke="red"
                      strokeWidth="3"
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

export default Unit2_Page6_Q1;

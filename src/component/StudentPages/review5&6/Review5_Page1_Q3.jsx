/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../../WorkBookPages/Button";
// 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import "./Review5_Page1_Q3.css";

import img3 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 52/P52-1.svg";
import img1 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 52/P52-2.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 52/P52-3.svg";

// ========================================
// AUDIO (Page 52 - C)
// ========================================

import audioCheese from "../../../assets/audio/ClassBook/U 6/Page 52 - C/Item_001_She_likes_cheese._She_doesn't_like_rice.mp3";
import audioChicken from "../../../assets/audio/ClassBook/U 6/Page 52 - C/Item_002_It_likes_chicken._It_doesn't_like_salad.mp3";
import audioFruit from "../../../assets/audio/ClassBook/U 6/Page 52 - C/Item_003_He_likes_fruit._He_doesn't_like_bread.mp3";
import ExerciseHeader from "../../ExerciseHeader";

// ========================================
// DATA
// ⚠️ الـ alt مكتوب بالتخمين وأنا ما شفت الصور: عدّليهم حسب اللي بالصورة
// ========================================

const images = [
  { id: 0, img: img3, alt: "A boy with fruit and bread." },
  { id: 1, img: img1, alt: "A girl with cheese and rice." },
  { id: 2, img: img2, alt: "A pet with chicken and salad." },
];

const sentences = [
  {
    id: 0,
    text: "She likes cheese. She doesn’t like rice.",
    audio: audioCheese,
  },
  {
    id: 1,
    text: "It likes chicken. It doesn’t like salad.",
    audio: audioChicken,
  },
  {
    id: 2,
    text: "He likes fruit. He doesn’t like bread.",
    audio: audioFruit,
  },
];

// { رقم الصورة: رقم الجملة الصحيحة }
const correct = {
  0: 2,
  1: 0,
  2: 1,
};

const TOTAL = images.length;

// ========================================
// HELPERS (خارج الكومبوننت)
// ========================================

const round1 = (n) => Math.round(n * 10) / 10;

const sameLines = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// Enter و Space بنعالجهم بإيدينا ونوقّف انتشار الحدث،
// لأن الكتاب غالباً عنده مستمع كيبورد عام بياخد هالمفتاحين
const isActivateKey = (e) => e.key === "Enter" || e.key === " ";

const stopActivateKeyUp = (e) => {
  if (!isActivateKey(e)) return;

  e.preventDefault();
  e.stopPropagation();
};

// بيرجّع { side, id } للعنصر اللي تحت نقطة بالشاشة (للسحب)
const endpointFromPoint = (x, y) => {
  const el = document.elementFromPoint(x, y);
  const node = el?.closest?.("[data-endpoint-side]");

  if (!node) return null;

  const id = Number(node.dataset.endpointId);

  return Number.isNaN(id) ? null : { side: node.dataset.endpointSide, id };
};

// بيضيف توصيلة ويشيل أي توصيلة قديمة لنفس الصورة أو نفس الجملة
const buildMatches = (prev, imgId, sentId) => {
  const next = {};

  Object.entries(prev).forEach(([key, value]) => {
    if (Number(key) !== imgId && value !== sentId) next[key] = value;
  });

  next[imgId] = sentId;

  return next;
};

// ========================================
// BADGES
// ========================================

// سبيكر أسود داخل دائرة بيضا: بيظهر بس وقت ما صوت الجملة شغّال
const SpeakerBadge = () => (
  <span
    aria-hidden="true"
    style={{
      position: "absolute",
      top: -10,
      right: -10,
      width: 22,
      height: 22,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
      zIndex: 2,
      lineHeight: 1,
      background: "#fff",
      color: "#000",
      boxShadow: "0 1px 3px rgba(0,0,0,.25)",
    }}
  >
    <FaVolumeUp size={12} />
  </span>
);

// ✓ / ✕ فوق يمين الصورة بعد Check (الشكل مختلف مش بس اللون)
const PairMark = ({ ok }) => (
  <div
    aria-hidden="true"
    className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold z-10  ${
      ok ? "" : "shadow-md border-2 border-white bg-red-500"
    }`}
  >
    {ok ? "" : "✕"}
  </div>
);

// ========================================
// MAIN
// ========================================

const Review5_Page1_Q3 = () => {
  // التوصيلات: { رقم الصورة: رقم الجملة }
  const [matches, setMatches] = useState({});

  // الصور اللي توصيلها صح بعد Check (بتنقفل) أو كلها بعد Show Answer
  const [lockedImgs, setLockedImgs] = useState(() => new Set());

  // الصور اللي توصيلها غلط بعد آخر Check (بتضل قابلة للتعديل)
  const [wrongImgs, setWrongImgs] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  // التوصيل: أول عنصر مختار { side: "image" | "sentence", id }
  const [pending, setPending] = useState(null);

  // العنصر اللي عليه الفوكس / الماوس (للخط المتقطع): { side, id }
  const [candidate, setCandidate] = useState(null);

  // السحب: { side, id, x, y, target } (x,y إحداثيات الشاشة)
  const [dragLine, setDragLine] = useState(null);

  const [playingKey, setPlayingKey] = useState(null);
  const [announcement, setAnnouncement] = useState("");
  const [linePaths, setLinePaths] = useState([]);
  const [, setTick] = useState(0);

  const containerRef = useRef(null);
  const imgItemRefs = useRef({});
  const sentItemRefs = useRef({});
  const imgDotRefs = useRef({});
  const sentDotRefs = useRef({});
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);
  const audioOwner = useRef({}).current;

  // الجمل المقفلة = جمل التوصيلات الصحيحة المقفلة
  const lockedSents = new Set(
    [...lockedImgs]
      .map((imgId) => matches[imgId])
      .filter((s) => s !== undefined),
  );

  const allDone = lockedImgs.size === TOTAL;

  const ownerOfSentence = (sentId) => {
    const key = Object.keys(matches).find((k) => matches[k] === sentId);
    return key === undefined ? undefined : Number(key);
  };

  const sentenceText = (id) => sentences.find((s) => s.id === id)?.text ?? "";

  // ========================================
  // AUDIO
  // ========================================

  const stopAudio = () => {
    stopGlobalAudio(audioOwner);
    setPlayingKey(null);
  };

  // playGlobalAudio بيوقف أي صوت ثاني شغّال قبل ما يشغّل هاد
  const playSentenceAudio = (sent) => {
    if (!sent.audio) return;

    const key = `s:${sent.id}`;

    playGlobalAudio(sent.audio, {
      owner: audioOwner,
      onFinish: () => setPlayingKey((prev) => (prev === key ? null : prev)),
    });

    setPlayingKey(key);
  };

  // وقف الصوت إذا سكرت الصفحة
  useEffect(() => () => stopGlobalAudio(audioOwner), [audioOwner]);

  // ========================================
  // LINES (الخطوط بتنحسب من مكان النقاط الفعلي)
  // x1,y1 = نقطة الصورة / x2,y2 = نقطة الجملة
  // ========================================

  const measureLines = () => {
    const container = containerRef.current;

    if (!container) return [];

    const rect = container.getBoundingClientRect();

    const center = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: round1(r.left - rect.left + r.width / 2),
        y: round1(r.top - rect.top + r.height / 2),
      };
    };

    const lines = Object.entries(matches)
      .map(([imgId, sentId]) => {
        const a = center(imgDotRefs.current[imgId]);
        const b = center(sentDotRefs.current[sentId]);

        if (!a || !b) return null;

        return {
          key: `${imgId}-${sentId}`,
          imgId: Number(imgId),
          x1: a.x,
          y1: a.y,
          x2: b.x,
          y2: b.y,
        };
      })
      .filter(Boolean);

    // خط متقطع أثناء السحب: من العنصر الأصلي للمؤشر (أو للهدف لو فوقه)
    if (dragLine) {
      const pointer = {
        x: round1(dragLine.x - rect.left),
        y: round1(dragLine.y - rect.top),
      };

      let a;
      let b;

      if (dragLine.side === "image") {
        a = center(imgDotRefs.current[dragLine.id]);
        b = dragLine.target
          ? center(sentDotRefs.current[dragLine.target.id])
          : pointer;
      } else {
        a = dragLine.target
          ? center(imgDotRefs.current[dragLine.target.id])
          : pointer;
        b = center(sentDotRefs.current[dragLine.id]);
      }

      if (a && b) {
        lines.push({
          key: "drag-preview",
          preview: true,
          x1: a.x,
          y1: a.y,
          x2: b.x,
          y2: b.y,
        });
      }

      return lines;
    }

    // خط متقطع: بيبيّن مع مين رح يتوصل العنصر المختار (حسب الفوكس أو الماوس)
    if (pending && candidate && pending.side !== candidate.side) {
      const imgId = pending.side === "image" ? pending.id : candidate.id;
      const sentId = pending.side === "image" ? candidate.id : pending.id;

      if (
        !lockedImgs.has(imgId) &&
        !lockedSents.has(sentId) &&
        matches[imgId] !== sentId
      ) {
        const a = center(imgDotRefs.current[imgId]);
        const b = center(sentDotRefs.current[sentId]);

        if (a && b) {
          lines.push({
            key: `preview-${imgId}-${sentId}`,
            preview: true,
            x1: a.x,
            y1: a.y,
            x2: b.x,
            y2: b.y,
          });
        }
      }
    }

    return lines;
  };

  // بعد كل render: إذا تغيّر مكان أي نقطة بنحدّث الخطوط
  useLayoutEffect(() => {
    const next = measureLines();
    setLinePaths((prev) => (sameLines(prev, next) ? prev : next));
  });

  // تغيّر حجم الشاشة / الحاوية
  useEffect(() => {
    const onResize = () => setTick((t) => t + 1);

    window.addEventListener("resize", onResize);

    let observer;

    if (typeof ResizeObserver !== "undefined" && containerRef.current) {
      observer = new ResizeObserver(onResize);
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      observer?.disconnect();
    };
  }, []);

  // ========================================
  // FOCUS HELPERS
  // ========================================

  const focusSoon = (el) => {
    requestAnimationFrame(() => el?.focus());
  };

  // بينقل الفوكس مباشرة لأول عنصر مفتوح بالجهة التانية (غير الموصول أولاً)
  const focusFirstOnSide = (side) => {
    const ids =
      side === "sentence"
        ? sentences.map((s) => s.id).filter((id) => !lockedSents.has(id))
        : images.map((img) => img.id).filter((id) => !lockedImgs.has(id));

    if (ids.length === 0) return;

    const used =
      side === "sentence"
        ? new Set(Object.values(matches))
        : new Set(Object.keys(matches).map(Number));

    const target = ids.find((id) => !used.has(id)) ?? ids[0];

    focusSoon(
      (side === "sentence" ? sentItemRefs : imgItemRefs).current[target],
    );
  };

  // بعد التوصيل: الفوكس بيرجع للجهة الأولى على العنصر اللي بعده (غير الموصول أولاً)
  const focusAfterConnect = (side, doneId, nextMatches) => {
    const count = side === "image" ? images.length : sentences.length;

    const used =
      side === "image"
        ? new Set(Object.keys(nextMatches).map(Number))
        : new Set(Object.values(nextMatches));

    const isOpen = (id) =>
      side === "image" ? !lockedImgs.has(id) : !lockedSents.has(id);

    let target = doneId;

    for (let k = 1; k <= count; k += 1) {
      const id = (doneId + k) % count;

      if (isOpen(id) && !used.has(id)) {
        target = id;
        break;
      }
    }

    focusSoon((side === "image" ? imgItemRefs : sentItemRefs).current[target]);
  };

  // ========================================
  // CONNECT (الصورة ← الجملة، بأي ترتيب)
  // ========================================

  const connect = (imgId, sentId, viaKeyboard = false) => {
    if (lockedImgs.has(imgId) || lockedSents.has(sentId)) return;

    // الصورة اللي كانت متوصلة بنفس الجملة: بينشال توصيلها
    const victim = ownerOfSentence(sentId);
    const startedFrom = pending?.side;
    const nextMatches = buildMatches(matches, imgId, sentId);

    setMatches(nextMatches);
    setWrongImgs((prev) => prev.filter((id) => id !== imgId && id !== victim));
    setPending(null);

    setAnnouncement(
      `Picture ${imgId + 1} is connected to "${sentenceText(sentId)}"`,
    );

    // الفوكس بيرجع للجهة الأولى (اللي بلشنا منها)
    if (viaKeyboard) {
      if (startedFrom === "sentence") {
        focusAfterConnect("sentence", sentId, nextMatches);
      } else {
        focusAfterConnect("image", imgId, nextMatches);
      }
    }
  };

  const disconnect = (imgId) => {
    if (lockedImgs.has(imgId) || matches[imgId] === undefined) return;

    setMatches((prev) => {
      const next = { ...prev };
      delete next[imgId];
      return next;
    });
    setWrongImgs((prev) => prev.filter((id) => id !== imgId));
    setAnnouncement(`Connection for picture ${imgId + 1} removed.`);
  };

  // Backspace / Delete على عنصر: بيشيل توصيله
  const disconnectKey = (e, getImgId) => {
    if (e.key !== "Backspace" && e.key !== "Delete") return false;

    e.preventDefault();
    e.stopPropagation();

    const imgId = getImgId();

    if (imgId !== undefined) disconnect(imgId);

    return true;
  };

  // ========================================
  // SELECT (ضغطة على نقطة: اختيار، وضغطة على نقطة من الجهة التانية: توصيل)
  // viaKeyboard: Enter / Space (أو قارئ الشاشة): الفوكس بينتقل للجهة التانية مباشرة
  // ========================================

  const selectImage = (id, viaKeyboard) => {
    if (lockedImgs.has(id)) return;

    if (pending?.side === "sentence") {
      connect(id, pending.id, viaKeyboard);
      return;
    }

    if (pending?.side === "image" && pending.id === id) {
      setPending(null);
      setAnnouncement("Selection cancelled.");
      return;
    }

    setPending({ side: "image", id });
    setAnnouncement(
      `Picture ${id + 1} selected. Press Tab to move between the sentences, Enter to connect, or Escape to cancel.`,
    );

    if (viaKeyboard) focusFirstOnSide("sentence");
  };

  const selectSentence = (id, viaKeyboard) => {
    if (lockedSents.has(id)) return;

    if (pending?.side === "image") {
      connect(pending.id, id, viaKeyboard);
      return;
    }

    if (pending?.side === "sentence" && pending.id === id) {
      setPending(null);
      setAnnouncement("Selection cancelled.");
      return;
    }

    setPending({ side: "sentence", id });
    setAnnouncement(
      `Sentence "${sentenceText(id)}" selected. Press Tab to move between the pictures, Enter to connect, or Escape to cancel.`,
    );

    if (viaKeyboard) focusFirstOnSide("image");
  };

  const onImagePress = (id, viaKeyboard) => {
    // الكليك اللي بييجي بعد سحب: نتجاهله
    if (!viaKeyboard && suppressClickRef.current) return;

    selectImage(id, viaKeyboard);
  };

  // الجملة: بيشتغل صوتها وبتتحدد للتوصيل بنفس اللحظة
  const onSentencePress = (sent, viaKeyboard) => {
    if (!viaKeyboard && suppressClickRef.current) return;

    playSentenceAudio(sent);

    selectSentence(sent.id, viaKeyboard);
  };

  // فوكس بالتاب على جملة = شغّل صوتها (الماوس/اللمس بيروحوا على onClick)
  const onSentenceFocus = (e, sent) => {
    setCandidate({ side: "sentence", id: sent.id });

    if (e.currentTarget.matches(":focus-visible")) playSentenceAudio(sent);
  };

  // مفاتيح العنصر: Enter / Space = ضغطة (من الكيبورد)، Backspace / Delete = شيل التوصيلة
  const endpointKeys = (action, getImgId) => ({
    // click من الماوس / اللمس (detail 0 = قارئ الشاشة)
    onClick: (e) => action(e.detail === 0),
    onKeyDown: (e) => {
      if (disconnectKey(e, getImgId)) return;

      if (!isActivateKey(e)) return;

      e.preventDefault();
      e.stopPropagation();

      if (!e.repeat) action(true);
    },
    onKeyUp: stopActivateKeyUp,
  });

  // ========================================
  // DRAG (Mouse + Touch + Pen)
  // سحب من صورة لجملة (أو من جملة لصورة). إذا ما تحركت: بتنعامل ككليك (اختيار)
  // ========================================

  const isEndpointLocked = (side, id) =>
    side === "image" ? lockedImgs.has(id) : lockedSents.has(id);

  const validTarget = (fromSide, point) => {
    const t = endpointFromPoint(point.x, point.y);

    if (!t || t.side === fromSide || isEndpointLocked(t.side, t.id)) {
      return null;
    }

    return t;
  };

  const onItemPointerDown = (e, side, id) => {
    if (showAnswer || isEndpointLocked(side, id)) return;

    if (e.pointerType === "mouse" && e.button !== 0) return;

    dragRef.current = {
      side,
      id,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      started: false,
    };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ما في مشكلة إذا المتصفح ما دعمها */
    }
  };

  const onItemPointerMove = (e) => {
    const d = dragRef.current;

    if (!d || d.pointerId !== e.pointerId) return;

    if (!d.started) {
      if (Math.hypot(e.clientX - d.startX, e.clientY - d.startY) < 6) return;

      d.started = true;
      setPending(null);
    }

    setDragLine({
      side: d.side,
      id: d.id,
      x: e.clientX,
      y: e.clientY,
      target: validTarget(d.side, { x: e.clientX, y: e.clientY }),
    });
  };

  const finishDrag = (e, cancelled) => {
    const d = dragRef.current;

    if (!d || d.pointerId !== e.pointerId) return;

    dragRef.current = null;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ما في مشكلة */
    }

    if (!d.started) return;

    suppressClickRef.current = true;
    setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);

    setDragLine(null);

    if (cancelled) return;

    const target = validTarget(d.side, { x: e.clientX, y: e.clientY });

    if (!target) {
      setAnnouncement(
        d.side === "image"
          ? "The picture was not dropped on a sentence."
          : "The sentence was not dropped on a picture.",
      );
      return;
    }

    if (d.side === "image") connect(d.id, target.id);
    else connect(target.id, d.id);
  };

  // ========================================
  // ESC + TAB: إلغاء الاختيار / التنقل بين العناصر اللي بتتوصل
  // ========================================

  const handleWrapperKeyDown = (e) => {
    // أثناء اختيار صورة أو جملة: التاب بيتنقل بس بين العناصر اللي بتتوصل معها
    if (e.key === "Tab" && pending) {
      const targets =
        pending.side === "image"
          ? sentences
              .filter((s) => !lockedSents.has(s.id))
              .map((s) => sentItemRefs.current[s.id])
              .filter(Boolean)
          : images
              .filter((img) => !lockedImgs.has(img.id))
              .map((img) => imgItemRefs.current[img.id])
              .filter(Boolean);

      if (targets.length > 0) {
        e.preventDefault();

        const idx = targets.indexOf(document.activeElement);

        const next =
          idx === -1
            ? e.shiftKey
              ? targets.length - 1
              : 0
            : (idx + (e.shiftKey ? -1 : 1) + targets.length) % targets.length;

        targets[next].focus();

        return;
      }
    }

    // Escape: بيلغي الاختيار وبيرجّع الفوكس للعنصر اللي بلشنا منه
    if (e.key === "Escape" && pending) {
      const origin = pending;

      setPending(null);
      setAnnouncement("Selection cancelled.");

      focusSoon(
        (origin.side === "image" ? imgItemRefs : sentItemRefs).current[
          origin.id
        ],
      );
    }
  };

  // ========================================
  // CHECK
  // الصح بينقفل (أخضر ✓)، الغلط بيضل ✕ وبيقدر الطالب يعدّله
  // ========================================

  const checkAnswers = () => {
    if (showAnswer || allDone) return;

    stopAudio();
    setPending(null);

    if (Object.keys(matches).length !== TOTAL) {
      const msg = "Please complete all matches before checking.";

      ValidationAlert.info("Oops!", msg);
      setAnnouncement(msg);
      return;
    }

    const nextLocked = new Set(lockedImgs);
    const wrongIds = [];

    images.forEach((img) => {
      if (nextLocked.has(img.id)) return;

      if (matches[img.id] === correct[img.id]) nextLocked.add(img.id);
      else wrongIds.push(img.id);
    });

    const score = nextLocked.size;

    setLockedImgs(nextLocked);
    setWrongImgs(wrongIds);

    setAnnouncement(
      [
        `Score ${score} out of ${TOTAL}.`,
        wrongIds.length
          ? `The match for picture ${wrongIds
              .map((id) => id + 1)
              .join(", ")} is not correct. You can change ${
              wrongIds.length > 1 ? "them" : "it"
            } and check again.`
          : "All answers are correct.",
      ].join(" "),
    );

    const color = score === TOTAL ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${score} / ${TOTAL}
        </span>
      </div>
    `;

    if (score === TOTAL) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  // ========================================
  // SHOW ANSWER / START AGAIN
  // ========================================

  const showAnswers = () => {
    stopAudio();
    dragRef.current = null;
    setDragLine(null);
    setPending(null);

    setMatches({ ...correct });
    setLockedImgs(new Set(images.map((img) => img.id)));
    setWrongImgs([]);
    setShowAnswer(true);

    setAnnouncement(
      "All answers shown. Every picture is matched to its sentence.",
    );
  };

  // بيشيل كل الخطوط، علامات ✓ / ✕، القفل، النتيجة، والصوت
  const resetAll = () => {
    stopAudio();
    dragRef.current = null;
    setDragLine(null);
    setPending(null);
    setCandidate(null);

    setMatches({});
    setLockedImgs(new Set());
    setWrongImgs([]);
    setShowAnswer(false);

    setAnnouncement("Activity reset. All lines and results are cleared.");
  };

  // ========================================
  // RENDER
  // ========================================

  const dotTargetShadow = { boxShadow: "0 0 0 4px rgba(37,99,235,.45)" };

  return (
    <div
      className="main-container-component relative"
      ref={containerRef}
      onKeyDown={handleWrapperKeyDown}
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
          title="Look, read, and match."
          subTitle="Start with one picture or phrase, then match it to the partner that means the same thing."
          isReview={true}
        />

        <p id="r5p1q3-help" className="sr-only">
          To match, press Tab to reach a picture, press Enter or Space to select
          it, and focus moves to the sentences. Tab between the sentences, a
          dashed line shows the connection, then press Enter or Space on a
          sentence to connect it. Focus then returns to the pictures. You can
          also start from a sentence, or drag from a picture to a sentence.
          Pressing a sentence plays its audio. Press Backspace on a picture or a
          sentence to remove its connection. Press Escape to cancel a selection.
          After checking, correct matches are locked and wrong matches can be
          changed.
        </p>

        <div aria-describedby="r5p1q3-help">
          {images.map((item) => {
            const i = item.id;
            const sent = sentences[i];

            const matchedSent = matches[i];
            const imgLocked = lockedImgs.has(i);
            const isWrong = wrongImgs.includes(i);
            const isCorrect = imgLocked && !showAnswer;

            const pendingImg = pending?.side === "image" && pending.id === i;
            const imgIsTarget = pending?.side === "sentence" && !imgLocked;
            const isImgDropTarget =
              dragLine?.target?.side === "image" && dragLine.target.id === i;

            // نفس ترتيب الجمل بالصفوف: الجملة اللي بنفس الصف
            const owner = ownerOfSentence(sent.id);
            const sentLocked = lockedSents.has(sent.id);
            const pendingSent =
              pending?.side === "sentence" && pending.id === sent.id;
            const sentIsTarget = pending?.side === "image" && !sentLocked;
            const isPlaying = playingKey === `s:${sent.id}`;
            const isSentDropTarget =
              dragLine?.target?.side === "sentence" &&
              dragLine.target.id === sent.id;

            const imgLabel = `Picture ${i + 1}: ${item.alt} ${
              showAnswer
                ? `Matched to "${sentenceText(matchedSent)}".`
                : isCorrect
                  ? `Correct. Matched to "${sentenceText(matchedSent)}".`
                  : imgIsTarget
                    ? `Press Enter to connect it to "${sentenceText(pending.id)}".`
                    : isWrong
                      ? `Not correct. Connected to "${sentenceText(matchedSent)}". Press to change it.`
                      : matchedSent !== undefined
                        ? `Connected to "${sentenceText(matchedSent)}". Press to change it.`
                        : pendingImg
                          ? "Selected. Now choose a sentence."
                          : "Not connected. Press to select, then choose a sentence."
            }`;

            const sentLabel = `Sentence: ${sent.text} ${
              sentLocked
                ? `Correct. Matched to picture ${owner + 1}. Press to hear it.`
                : sentIsTarget
                  ? `Press Enter to connect it to picture ${pending.id + 1}.`
                  : owner !== undefined
                    ? `Connected to picture ${owner + 1}. Press to change it.`
                    : pendingSent
                      ? "Selected. Now choose a picture."
                      : "Not connected. Press to hear it and select it, then choose a picture."
            }`;

            return (
              <div
                key={i}
                className="flex items-center justify-between my-[15px]"
              >
                {/* ===== الصورة ===== */}
                <div className="flex items-center gap-2.5 w-[45%]">
                  <div
                    role="button"
                    ref={(el) => {
                      imgItemRefs.current[i] = el;
                    }}
                    data-endpoint-side="image"
                    data-endpoint-id={i}
                    tabIndex={imgLocked ? -1 : 0}
                    aria-pressed={pendingImg}
                    aria-disabled={imgLocked}
                    aria-label={imgLabel}
                    onFocus={() => setCandidate({ side: "image", id: i })}
                    onBlur={() => setCandidate(null)}
                    onMouseEnter={() => setCandidate({ side: "image", id: i })}
                    onMouseLeave={() => setCandidate(null)}
                    {...(imgLocked
                      ? {}
                      : endpointKeys(
                          (viaKeyboard) => onImagePress(i, viaKeyboard),
                          () => i,
                        ))}
                    onPointerDown={(e) => onItemPointerDown(e, "image", i)}
                    onPointerMove={onItemPointerMove}
                    onPointerUp={(e) => finishDrag(e, false)}
                    onPointerCancel={(e) => finishDrag(e, true)}
                    className={`relative flex items-start rounded-[12px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] ${
                      imgLocked ? "cursor-default" : "cursor-pointer"
                    }`}
                    style={{
                      touchAction: "none",
                      userSelect: "none",
                      WebkitTouchCallout: "none",
                      ...(isImgDropTarget ? dotTargetShadow : {}),
                    }}
                  >
                    <span className="text-[22px] font-bold">{i + 1}</span>

                    <img
                      src={item.img}
                      alt={item.alt}
                      draggable="false"
                      onDragStart={(e) => e.preventDefault()}
                      className={`transition-all duration-200 ${
                        isWrong
                          ? "border-3 border-red-500"
                          : imgLocked
                            ? "border-2 border-[#4caf50]"
                            : pendingImg
                              ? "scale-110"
                              : ""
                      }`}
                      style={{
                        width: "200px",
                        height: "120px",
                        borderRadius: "12px",

                        display: "block",
                      }}
                    />

                    {/* ✓ / ✕ نتيجة هالتوصيلة */}
                    {isCorrect && <PairMark ok />}
                    {isWrong && <PairMark ok={false} />}

                    {/* نقطة بداية الخط */}
                    <div
                      ref={(el) => {
                        imgDotRefs.current[i] = el;
                      }}
                      aria-hidden="true"
                      className={`absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full pointer-events-none ${
                        imgLocked
                          ? "bg-[#4caf50]"
                          : pendingImg
                            ? "bg-red-600 scale-110"
                            : "bg-red-500"
                      }`}
                      style={imgIsTarget ? dotTargetShadow : undefined}
                    />
                  </div>
                </div>

                {/* ===== الجملة ===== */}
                <div
                  role="button"
                  ref={(el) => {
                    sentItemRefs.current[sent.id] = el;
                  }}
                  data-endpoint-side="sentence"
                  data-endpoint-id={sent.id}
                  tabIndex={0}
                  aria-pressed={pendingSent}
                  aria-label={sentLabel}
                  onFocus={(e) => onSentenceFocus(e, sent)}
                  onBlur={() => setCandidate(null)}
                  onMouseEnter={() =>
                    setCandidate({ side: "sentence", id: sent.id })
                  }
                  onMouseLeave={() => setCandidate(null)}
                  {...(sentLocked
                    ? {
                        onClick: () => {
                          if (!suppressClickRef.current) {
                            playSentenceAudio(sent);
                          }
                        },
                        onKeyDown: (e) => {
                          if (!isActivateKey(e)) return;

                          e.preventDefault();
                          e.stopPropagation();

                          if (!e.repeat) playSentenceAudio(sent);
                        },
                        onKeyUp: stopActivateKeyUp,
                      }
                    : endpointKeys(
                        (viaKeyboard) => onSentencePress(sent, viaKeyboard),
                        () => ownerOfSentence(sent.id),
                      ))}
                  onPointerDown={(e) => onItemPointerDown(e, "sentence", sent.id)}
                  onPointerMove={onItemPointerMove}
                  onPointerUp={(e) => finishDrag(e, false)}
                  onPointerCancel={(e) => finishDrag(e, true)}
                  className="flex items-center gap-[15px] w-[45%] cursor-pointer rounded-[12px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
                  style={{
                    touchAction: "none",
                    userSelect: "none",
                    WebkitTouchCallout: "none",
                    border:isPlaying ? "2px solid #2563eb":"",
                    ...(isSentDropTarget ? dotTargetShadow : {}),
                  }}
                >
                  {/* نقطة نهاية الخط */}
                  <div
                    ref={(el) => {
                      sentDotRefs.current[sent.id] = el;
                    }}
                    aria-hidden="true"
                    className={`w-4 h-4 rounded-full shrink-0 pointer-events-none ${
                      sentLocked
                        ? "bg-[#4caf50]"
                        : pendingSent
                          ? "bg-red-600 scale-110"
                          : "bg-red-500"
                    }`}
                    style={sentIsTarget ? dotTargetShadow : undefined}
                  />

                  <p
                    className={`relative text-[18px] font-medium ${
                      pendingSent ? "text-red-600 underline scale-110" : ""
                    }`}
                  >
                    {sent.text}

                    {/* 🔊 السبيكر بيظهر بس وقت ما صوت الجملة شغّال */}
                    {isPlaying && <SpeakerBadge />}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* SVG LINES */}
        <svg
          aria-hidden="true"
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        >
          {linePaths.map((l) => (
            <line
              key={l.key}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke={
                l.preview
                  ? "red"
                  : lockedImgs.has(l.imgId)
                    ? "#4caf50"
                    : "red"
              }
              strokeDasharray={l.preview ? "8 6" : undefined}
              strokeWidth="3"
              strokeLinecap="round"
            />
          ))}
        </svg>

        {/* BUTTONS */}
        <Button
          handleShowAnswer={showAnswers}
          handleStartAgain={resetAll}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
};

export default Review5_Page1_Q3;
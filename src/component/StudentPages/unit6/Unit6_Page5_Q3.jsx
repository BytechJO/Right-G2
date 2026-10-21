/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import "./Unit6_Page5_Q3.css";
// 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";

import img1 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page50/Ex B 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page50/Ex B 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page50/Ex B 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page50/Ex B 4.svg";
import img5 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page50/Ex B 5.svg";

// ========================================
// AUDIO (Page 50 - B)
// ========================================

import sentenceWashFace from "../../../assets/audio/ClassBook/U 6/Page 50 - B/Item_001_I_wash_my_face.mp3";
import sentenceEatBreakfast from "../../../assets/audio/ClassBook/U 6/Page 50 - B/Item_002_I_eat_my_breakfast.mp3";
import sentenceGoToSchool from "../../../assets/audio/ClassBook/U 6/Page 50 - B/Item_003_I_go_to_school.mp3";
import sentenceCombHair from "../../../assets/audio/ClassBook/U 6/Page 50 - B/Item_004_I_comb_my_hair.mp3";
import sentenceBrushTeeth from "../../../assets/audio/ClassBook/U 6/Page 50 - B/Item_005_I_brush_my_teeth.mp3";

// ========================================
// DATA
// ⚠️ الـ alt مكتوب بالتخمين من الجواب الصحيح وأنا ما شفت الصور: عدّليهم حسب اللي بالصورة
// ========================================

const images = [
  { id: 0, img: img1, alt: "A child brushing their teeth." },
  { id: 1, img: img2, alt: "A child combing their hair." },
  { id: 2, img: img3, alt: "A child washing their face." },
  { id: 3, img: img4, alt: "A child going to school." },
  { id: 4, img: img5, alt: "A child eating breakfast." },
];

const sentences = [
  { id: 0, text: "I wash my face.", audio: sentenceWashFace },
  { id: 1, text: "I eat my breakfast.", audio: sentenceEatBreakfast },
  { id: 2, text: "I go to school.", audio: sentenceGoToSchool },
  { id: 3, text: "I comb my hair.", audio: sentenceCombHair },
  { id: 4, text: "I brush my teeth.", audio: sentenceBrushTeeth },
];

// ترتيب الجمل بالـ DOM = ترتيب القراءة (الصف الأول يسار ليمين، بعدين الصف التاني)
const sentenceOrder = [0, 1, 2, 3, 4];

// رقم العمود لكل جملة: 3 فوق (1,3,5) و2 تحت (2,4)
const colMap = { 0: 1, 1: 3, 2: 5, 3: 2, 4: 4 };

// { رقم الصورة: رقم الجملة الصحيحة }
const correct = {
  0: 4,
  1: 3,
  2: 0,
  3: 2,
  4: 1,
};

const TOTAL = images.length;

// ========================================
// HELPERS (خارج الكومبوننت)
// ========================================

const round1 = (n) => Math.round(n * 10) / 10;

const sameLines = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// بيرجّع { side, id } للعنصر اللي تحت نقطة بالشاشة (للسحب)
const endpointFromPoint = (x, y) => {
  const el = document.elementFromPoint(x, y);
  const node = el?.closest?.("[data-endpoint-side]");

  if (!node) return null;

  const id = Number(node.dataset.endpointId);

  return Number.isNaN(id) ? null : { side: node.dataset.endpointSide, id };
};

const curvePath = (x1, y1, x2, y2) => {
  const off = Math.min(60, Math.abs(y2 - y1) / 2);

  return `M ${x1} ${y1} C ${x1} ${y1 + off}, ${x2} ${y2 - off}, ${x2} ${y2}`;
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
  <span
    aria-hidden="true"
    style={{
      position: "absolute",
      top: -10,
      right: -10,
      width: 24,
      height: 24,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
      zIndex: 2,
      background: ok ? "" : "#e53935",
      color: "#fff",
      fontSize: 14,
      fontWeight: 700,
      lineHeight: 1,
      border: ok ? "" :"2px solid #fff",
    }}
  >
    {ok ? "" : "✕"}
  </span>
);

// ========================================
// MAIN
// ========================================

const Unit6_Page5_Q3 = () => {
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
  // KEYBOARD ACTIVATION (Enter / Space)
  //
  // بنعالج Enter و Space بإيدينا ونوقّف انتشار الحدث (stopPropagation)،
  // لأن الكتاب غالباً عنده مستمع كيبورد عام بياخد هالمفتاحين ويمنع الكليك الطبيعي.
  // keyedRef بيمنع التنفيذ مرتين (keydown + click اللي بييجي بعد Space)
  // ========================================

  const keyedRef = useRef(false);

  const markKeyed = (ms) => {
    keyedRef.current = true;

    setTimeout(() => {
      keyedRef.current = false;
    }, ms);
  };

  // onOtherKey: مفاتيح إضافية (مثلاً Backspace)، بترجّع true إذا عالجتها
  const press = (action, onOtherKey) => ({
    onClick: (e) => {
      // detail === 0 يعني click جاي من الكيبورد وإحنا عالجناه بالـ keydown
      if (e.detail === 0 && keyedRef.current) return;
      action(e);
    },
    onKeyDown: (e) => {
      if (onOtherKey?.(e)) return;

      if (e.key !== "Enter" && e.key !== " ") return;

      e.preventDefault();
      e.stopPropagation();

      if (e.repeat) return;

      markKeyed(700);
      action(e);
    },
    onKeyUp: (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;

      e.stopPropagation();
      markKeyed(60);
    },
  });

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

  // وقف الصوت إذا سكرت الصفحة (Previous / Next / Close)
  useEffect(() => () => stopGlobalAudio(audioOwner), [audioOwner]);

  // ========================================
  // LINES (الخطوط بتنحسب من مكان النقاط الفعلي)
  // x1,y1 = الطرف العلوي (الصورة) / x2,y2 = الطرف السفلي (الجملة)
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
  // CONNECT (الصورة ← الجملة، بأي ترتيب)
  // ========================================

  const connect = (imgId, sentId) => {
    if (lockedImgs.has(imgId) || lockedSents.has(sentId)) return;

    // الصورة اللي كانت متوصلة بنفس الجملة: بينشال توصيلها
    const victim = ownerOfSentence(sentId);

    setMatches((prev) => {
      const next = {};

      Object.entries(prev).forEach(([key, value]) => {
        if (Number(key) !== imgId && value !== sentId) next[key] = value;
      });

      next[imgId] = sentId;

      return next;
    });

    setWrongImgs((prev) => prev.filter((id) => id !== imgId && id !== victim));
    setPending(null);
    setAnnouncement(
      `Picture ${imgId + 1} is connected to "${sentenceText(sentId)}"`,
    );
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
  const disconnectKey = (getImgId) => (e) => {
    if (e.key !== "Backspace" && e.key !== "Delete") return false;

    e.preventDefault();
    e.stopPropagation();

    const imgId = getImgId();

    if (imgId !== undefined) disconnect(imgId);

    return true;
  };

  const selectImage = (id) => {
    if (lockedImgs.has(id)) return;

    if (pending?.side === "sentence") {
      connect(id, pending.id);
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
  };

  const selectSentence = (id) => {
    if (lockedSents.has(id)) return;

    if (pending?.side === "image") {
      connect(pending.id, id);
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
  };

  const onImagePress = (id) => {
    // الكليك اللي بييجي بعد سحب: نتجاهله
    if (suppressClickRef.current) return;

    selectImage(id);
  };

  // الجملة: بيشتغل صوتها وبتتحدد للتوصيل بنفس اللحظة
  const onSentencePress = (sent) => {
    if (suppressClickRef.current) return;

    playSentenceAudio(sent);

    selectSentence(sent.id);
  };

  // فوكس بالتاب على جملة = شغّل صوتها (الماوس/اللمس بيروحوا على onClick)
  const onSentenceFocus = (e, sent) => {
    setCandidate({ side: "sentence", id: sent.id });

    if (e.currentTarget.matches(":focus-visible")) playSentenceAudio(sent);
  };

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
          ? sentenceOrder
              .filter((id) => !lockedSents.has(id))
              .map((id) => sentItemRefs.current[id])
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

    if (e.key === "Escape" && pending) {
      setPending(null);
      setAnnouncement("Selection cancelled.");
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
      const msg = "Please match all.";

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

    const message = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${score} / ${TOTAL}
        </span>
      </div>
    `;

    if (score === TOTAL) ValidationAlert.success(message);
    else if (score === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);
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

  const reset = () => {
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

  const dotBase = {
    position: "absolute",
    left: "calc(50% - 5px)",
    height: "10px",
    width: "10px",
    borderRadius: "50%",
    pointerEvents: "none",
    transition: "all 0.2s",
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleWrapperKeyDown}
      className="main-container-component relative flex flex-col items-center p-[30px]"
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

      <div
        className="div-forall w-full max-w-[900px] flex flex-col"
        style={{ gap: "100px" }}
      >
        <ExerciseHeader
          sectionLetter="B"
          title="Look, read, and match."
          subTitle="Start with one picture or phrase, then match it to the partner that means the same thing."
        />

        <p id="u6p5q3-help" className="sr-only">
          To match, press Tab to reach a picture, press Enter or Space to select
          it, then Tab to a sentence and press Enter or Space. You can also
          start from a sentence. Pressing a sentence plays its audio. While an
          item is selected, Tab moves only between the items it can be connected
          to. Press Backspace on a picture or a sentence to remove its
          connection. Press Escape to cancel a selection. After checking,
          correct matches are locked and wrong matches can be changed.
        </p>

        {/* Images */}
        <div
          className="flex justify-between gap-5"
          aria-describedby="u6p5q3-help"
        >
          {images.map((img) => {
            const matchedSent = matches[img.id];
            const imgLocked = lockedImgs.has(img.id);
            const isWrong = wrongImgs.includes(img.id);
            const pendingImg =
              pending?.side === "image" && pending.id === img.id;
            const imgIsTarget = pending?.side === "sentence" && !imgLocked;
            const isDropTarget =
              dragLine?.target?.side === "image" &&
              dragLine.target.id === img.id;

            const label = `Picture ${img.id + 1}: ${img.alt} ${
              imgLocked
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

            return (
              <div
                key={img.id}
                role="button"
                ref={(el) => {
                  imgItemRefs.current[img.id] = el;
                }}
                data-endpoint-side="image"
                data-endpoint-id={img.id}
                tabIndex={imgLocked ? -1 : 0}
                aria-pressed={pendingImg}
                aria-disabled={imgLocked}
                aria-label={label}
                onFocus={() => setCandidate({ side: "image", id: img.id })}
                onBlur={() => setCandidate(null)}
                onMouseEnter={() => setCandidate({ side: "image", id: img.id })}
                onMouseLeave={() => setCandidate(null)}
                {...(imgLocked
                  ? {}
                  : press(
                      () => onImagePress(img.id),
                      disconnectKey(() => img.id),
                    ))}
                onPointerDown={(e) => onItemPointerDown(e, "image", img.id)}
                onPointerMove={onItemPointerMove}
                onPointerUp={(e) => finishDrag(e, false)}
                onPointerCancel={(e) => finishDrag(e, true)}
                className="relative rounded-[10px] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb]"
                style={{
                  touchAction: "none",
                  userSelect: "none",
                  WebkitTouchCallout: "none",
                  cursor: imgLocked ? "default" : "pointer",
                  ...(isDropTarget
                    ? { boxShadow: "0 0 0 4px rgba(37,99,235,.45)" }
                    : {}),
                }}
              >
                <img
                  src={img.img}
                  alt={img.alt}
                  draggable="false"
                  onDragStart={(e) => e.preventDefault()}
                  style={{ height: "110px" }}
                  className={`relative rounded-[10px] transition-all duration-200 ${
                    pendingImg
                      ? "border-2 bg-red-100 border-red-500 scale-110"
                      : ""
                  } ${imgLocked ? "border-2 border-green-500" : ""} ${
                    isWrong ? "border-2 border-red-500" : ""
                  }`}
                />

                {/* ✓ / ✕ نتيجة هالتوصيلة */}
                {imgLocked && <PairMark ok />}
                {isWrong && <PairMark ok={false} />}

                {/* نقطة بداية الخط (تحت الصورة) */}
                <div
                  ref={(el) => {
                    imgDotRefs.current[img.id] = el;
                  }}
                  aria-hidden="true"
                  style={{
                    ...dotBase,
                    bottom: "5px",
                    backgroundColor: imgLocked ? "#4caf50" : "red",
                    transform: pendingImg ? "scale(1.5)" : undefined,
                    ...(imgIsTarget
                      ? { boxShadow: "0 0 0 4px rgba(37,99,235,.45)" }
                      : {}),
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Sentences */}
        {/* Sentences */}
        <div className="grid grid-cols-5 gap-5 mt-5 w-full justify-center">
          {sentenceOrder.map((sentId) => {
            const sent = sentences.find((s) => s.id === sentId);
            const owner = ownerOfSentence(sent.id);
            const sentLocked = lockedSents.has(sent.id);
            const pendingSent =
              pending?.side === "sentence" && pending.id === sent.id;
            const sentIsTarget = pending?.side === "image" && !sentLocked;
            const isPlaying = playingKey === `s:${sent.id}`;
            const isDropTarget =
              dragLine?.target?.side === "sentence" &&
              dragLine.target.id === sent.id;

            const label = `Sentence: ${sent.text} ${
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
                key={sent.id}
                role="button"
                tabIndex={0}
                ref={(el) => {
                  sentItemRefs.current[sent.id] = el;
                }}
                data-endpoint-side="sentence"
                data-endpoint-id={sent.id}
                aria-pressed={pendingSent}
                aria-label={label}
                onFocus={(e) => onSentenceFocus(e, sent)}
                onBlur={() => setCandidate(null)}
                onMouseEnter={() =>
                  setCandidate({ side: "sentence", id: sent.id })
                }
                onMouseLeave={() => setCandidate(null)}
                {...(sentLocked
                  ? press(() => {
                      if (!suppressClickRef.current) playSentenceAudio(sent);
                    })
                  : press(
                      () => onSentencePress(sent),
                      disconnectKey(() => ownerOfSentence(sent.id)),
                    ))}
                onPointerDown={(e) => onItemPointerDown(e, "sentence", sent.id)}
                onPointerMove={onItemPointerMove}
                onPointerUp={(e) => finishDrag(e, false)}
                onPointerCancel={(e) => finishDrag(e, true)}
                /* نفس الكلاسات القديمة بالضبط + حلقة الفوكس للكيبورد بس (ما بتبين مع الماوس) */
                className="flex flex-col relative bg-[#f4e9e2] py-3 px-7 rounded-[20px] cursor-pointer font-medium text-center whitespace-nowrap w-fit focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb]"
                style={{
                  gridColumn: colMap[sent.id], // بدل pos + 1
                  touchAction: "none",
                  userSelect: "none",
                  WebkitTouchCallout: "none",
                  ...(isDropTarget
                    ? { boxShadow: "0 0 0 4px rgba(37,99,235,.45)" }
                    : {}),
                }}
              >
                {/* النقطة الحمرا: نفس مكانها وشكلها القديم */}
                <div
                  ref={(el) => {
                    sentDotRefs.current[sent.id] = el;
                  }}
                  aria-hidden="true"
                  style={{
                    height: "10px",
                    width: "10px",
                    backgroundColor: "red",
                    borderRadius: "50%",
                    position: "absolute",
                    top: "-5px",
                    left: "47%",
                    pointerEvents: "none",
                    ...(sentIsTarget
                      ? { boxShadow: "0 0 0 4px rgba(37,99,235,.45)" }
                      : {}),
                  }}
                />

                {sent.text}

                {/* السبيكر بيظهر فوق الجملة بس وقت ما الصوت شغّال، وما بيأثر على الشكل */}
                {isPlaying && <SpeakerBadge />}
              </div>
            );
          })}
        </div>
      </div>

      {/* SVG LINES (برا div-forall) */}
      <svg
        aria-hidden="true"
        className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible"
      >
        {linePaths.map((l) => (
          <path
            key={l.key}
            d={curvePath(l.x1, l.y1, l.x2, l.y2)}
            stroke={
              l.preview
                ? "#e53935"
                : lockedImgs.has(l.imgId)
                  ? "#4caf50"
                  : "#e53935"
            }
            strokeDasharray={l.preview ? "8 6" : undefined}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        ))}
      </svg>

      {/* Buttons */}
      <div className="action-buttons-container mt-5">
        <button type="button" className="try-again-button" onClick={reset}>
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
          className="check-button2"
          onClick={checkAnswers}
          style={showAnswer || allDone ? { cursor: "not-allowed" } : undefined}
        >
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit6_Page5_Q3;

/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./Unit5_Page6_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";
// 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";

import img1 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 45/Ex D 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 45/Ex D 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 45/Ex D 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 45/Ex D 4.svg";
import img5 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 45/Ex D 5.svg";

// ========================================
// AUDIO
// ⚠️ 3 أسماء ملفات ظاهرة مقطوعة بالسكرين شوت (001، 005، 010)
// وأنا كملتها بالتخمين: تأكدي منها
// ========================================

import sentenceLikesSheFruit from "../../../assets/audio/ClassBook/U 5/Page 45 - D/Item_001_likes_she_fruit.mp3";
import wordLikes from "../../../assets/audio/ClassBook/U 5/Page 45 - D/Item_002_likes.mp3";
import wordShe from "../../../assets/audio/ClassBook/U 5/Page 45 - D/Item_003_she.mp3";
import wordFruit from "../../../assets/audio/ClassBook/U 5/Page 45 - D/Item_004_fruit.mp3";
import sentenceDontLikeIMeat from "../../../assets/audio/ClassBook/U 5/Page 45 - D/Item_005_don't_like_I_meat.mp3";
import wordDont from "../../../assets/audio/ClassBook/U 5/Page 45 - D/Item_006_don't.mp3";
import wordLike from "../../../assets/audio/ClassBook/U 5/Page 45 - D/Item_007_like.mp3";
import wordI from "../../../assets/audio/ClassBook/U 5/Page 45 - D/Item_008_I.mp3";
import wordMeat from "../../../assets/audio/ClassBook/U 5/Page 45 - D/Item_009_meat.mp3";
import sentenceDoesntLikeSheStew from "../../../assets/audio/ClassBook/U 5/Page 45 - D/Item_010_doesn't_like_she_stew.mp3";
import wordDoesnt from "../../../assets/audio/ClassBook/U 5/Page 45 - D/Item_011_doesn't.mp3";
import wordStew from "../../../assets/audio/ClassBook/U 5/Page 45 - D/Item_012_stew.mp3";
import sentenceLikeYouFish from "../../../assets/audio/ClassBook/U 5/Page 45 - D/Item_013_like_you_fish.mp3";
import wordYou from "../../../assets/audio/ClassBook/U 5/Page 45 - D/Item_014_you.mp3";
import wordFish from "../../../assets/audio/ClassBook/U 5/Page 45 - D/Item_015_fish.mp3";

// صوت كل كلمة (المفتاح = الكلمة بحروف صغيرة)
// ⚠️ "he" و "chicken" ما لقيت لهم ملفات بالفولدر، فما رح يشتغل لهم صوت لحد ما تنضاف
const wordAudio = {
  likes: wordLikes,
  she: wordShe,
  fruit: wordFruit,
  "don't": wordDont,
  like: wordLike,
  i: wordI,
  meat: wordMeat,
  "doesn't": wordDoesnt,
  stew: wordStew,
  you: wordYou,
  fish: wordFish,
};

// ========================================
// DATA
// answerPic = رقم الصورة الصحيحة (0-4) حسب ترتيبها بالعمود اليمين
// ========================================

// ⚠️ الـ alt مكتوب من الجواب الصحيح وأنا ما شفت الصور: عدّليهم حسب اللي بالصورة
const pictures = [
  { src: img1, alt: "A bowl of stew." },
  { src: img2, alt: "A fish on a plate." },
  { src: img3, alt: "A piece of chicken." },
  { src: img4, alt: "A plate of fruit." },
  { src: img5, alt: "A piece of meat." },
];

// ⚠️ ما لقيت ملف صوت لجملة 5 (he doesn't like chicken)
const questions = [
  {
    id: 1,
    matchWord: "likes / she / fruit",
    correctSentence: "she likes fruit",
    scrambled: ["likes", "she", "fruit"],
    answerPic: 3,
    audio: sentenceLikesSheFruit,
  },
  {
    id: 2,
    matchWord: "don't like / I / meat",
    correctSentence: "I don't like meat",
    scrambled: ["don't", "like", "I", "meat"],
    answerPic: 4,
    audio: sentenceDontLikeIMeat,
  },
  {
    id: 3,
    matchWord: "doesn't like / she / stew",
    correctSentence: "she doesn't like stew",
    scrambled: ["doesn't", "like", "she", "stew"],
    answerPic: 0,
    audio: sentenceDoesntLikeSheStew,
  },
  {
    id: 4,
    matchWord: "like / you / fish",
    correctSentence: "you like fish",
    scrambled: ["like", "you", "fish"],
    answerPic: 1,
    audio: sentenceLikeYouFish,
  },
  {
    id: 5,
    matchWord: "doesn't like / he / chicken",
    correctSentence: "he doesn't like chicken",
    scrambled: ["doesn't", "like", "he", "chicken"],
    answerPic: 2,
    audio: null,
  },
];

const TOTAL = questions.length * 2; // 5 جمل + 5 توصيلات

// ========================================
// HELPERS (خارج الكومبوننت)
// ========================================

const makeEmptyInputs = () =>
  Object.fromEntries(questions.map((q) => [q.id, []]));

const round1 = (n) => Math.round(n * 10) / 10;

const sameLines = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// رقم الجملة اللي تحت نقطة معينة بالشاشة (للسحب)
const zoneFromPoint = (x, y) => {
  const el = document.elementFromPoint(x, y);
  const zone = el?.closest?.("[data-sentence-zone]");
  if (!zone) return null;
  const id = Number(zone.dataset.sentenceZone);
  return Number.isNaN(id) ? null : id;
};

// ========================================
// BADGES (دوائر صغيرة فوق يمين العنصر)
// العنصر الأب لازم يكون position: relative
// ========================================

const badgeBase = {
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
};

// ✕ أبيض داخل دائرة حمرا: للتوصيل الغلط وللجملة الغلط
const WrongBadge = () => (
  <span
    aria-hidden="true"
    style={{
      ...badgeBase,
      background: "#e53935",
      color: "#fff",
      fontSize: 13,
      fontWeight: 700,
    }}
  >
    ✕
  </span>
);

// سبيكر أسود داخل دائرة بيضا: بيظهر بس وقت ما الصوت شغّال (كلمة أو جملة)
const SpeakerBadge = () => (
  <span
    aria-hidden="true"
    style={{
      ...badgeBase,
      background: "#fff",
      color: "#000",
      border: "1px solid #cfcfcf",
      boxShadow: "0 1px 3px rgba(0,0,0,.25)",
    }}
  >
    <FaVolumeUp size={12} />
  </span>
);

// ========================================
// MAIN
// ========================================

const Unit5_Page6_Q1 = () => {
  // الكلمات المرتبة بكل جملة
  const [userInputs, setUserInputs] = useState(makeEmptyInputs);

  // التوصيلات: { رقم الجملة: رقم الصورة }
  const [matches, setMatches] = useState({});

  // الجمل والتوصيلات الصحيحة (مقفلة)
  const [lockedSentences, setLockedSentences] = useState(() => new Set());
  const [lockedLines, setLockedLines] = useState(() => new Set());

  // الغلط بعد Check (علامة ✕)
  const [wrongSentences, setWrongSentences] = useState([]);
  const [wrongLines, setWrongLines] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  // التوصيل: أول عنصر مختار { side: "left" | "right", id }
  const [pending, setPending] = useState(null);

  // الكلمة المختارة (للكيبورد / الكليك): { qId, word }
  const [selectedWord, setSelectedWord] = useState(null);

  // العنصر اللي عليه الفوكس / الماوس (للخط المتقطع): { side, id }
  const [candidate, setCandidate] = useState(null);

  // السحب بالماوس / اللمس
  const [dragGhost, setDragGhost] = useState(null); // { qId, word, x, y }
  const [hoverZone, setHoverZone] = useState(null);

  const [playingKey, setPlayingKey] = useState(null);
  const [announcement, setAnnouncement] = useState("");
  const [linePaths, setLinePaths] = useState([]);
  const [, setTick] = useState(0);

  const containerRef = useRef(null);
  const leftDotRefs = useRef({});
  const rightDotRefs = useRef({});
  const leftItemRefs = useRef({});
  const rightItemRefs = useRef({});
  const chipRefs = useRef({});
  const slotRefs = useRef({});
  const zoneRefs = useRef({});
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);
  const audioOwner = useRef({}).current;

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

  // بيرجّع onClick + onKeyDown + onKeyUp جاهزين للعنصر
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

  const lockedPics = new Set(
    questions.filter((q) => lockedLines.has(q.id)).map((q) => q.answerPic),
  );

  const allDone =
    lockedSentences.size === questions.length &&
    lockedLines.size === questions.length;

  // ========================================
  // AUDIO
  // ========================================

  const stopAudio = () => {
    stopGlobalAudio(audioOwner);
    setPlayingKey(null);
  };

  // playGlobalAudio بيوقف أي صوت ثاني شغّال قبل ما يشغّل هاد
  const playAudio = (key, src) => {
    if (!src) return;

    playGlobalAudio(src, {
      owner: audioOwner,
      onFinish: () => setPlayingKey((prev) => (prev === key ? null : prev)),
    });

    setPlayingKey(key);
  };

  const playWordAudio = (qId, word) =>
    playAudio(`w:${qId}:${word}`, wordAudio[word.toLowerCase()]);

  // صوت الجملة (بدون announcement عشان ما نكشف الجواب للـ screen reader)
  const playSentenceAudio = (q) => {
    if (!q.audio) return;
    playAudio(`s:${q.id}`, q.audio);
  };

  // وقف الصوت إذا سكرت الصفحة
  useEffect(() => () => stopGlobalAudio(audioOwner), [audioOwner]);

  // ========================================
  // LINES (الخطوط بتنحسب من مكان النقاط الفعلي)
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
      .map(([qId, pic]) => {
        const a = center(leftDotRefs.current[qId]);
        const b = center(rightDotRefs.current[pic]);

        if (!a || !b) return null;

        return {
          key: `${qId}-${pic}`,
          qId: Number(qId),
          x1: a.x,
          y1: a.y,
          x2: b.x,
          y2: b.y,
        };
      })
      .filter(Boolean);

    // خط متقطع: بيبيّن مع مين رح يتوصل العنصر المختار (حسب الفوكس أو الماوس)
    if (pending && candidate && pending.side !== candidate.side) {
      const qId = pending.side === "left" ? pending.id : candidate.id;
      const pic = pending.side === "left" ? candidate.id : pending.id;

      if (
        !lockedLines.has(qId) &&
        !lockedPics.has(pic) &&
        matches[qId] !== pic
      ) {
        const a = center(leftDotRefs.current[qId]);
        const b = center(rightDotRefs.current[pic]);

        if (a && b) {
          lines.push({
            key: `preview-${qId}-${pic}`,
            qId,
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

  // بعد كل render: إذا تغيّر مكان أي نقطة (مثلاً الجملة صارت سطرين) بنحدّث الخطوط
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
  // WORDS: PLACE / REMOVE
  // ========================================

  const canMoveWord = (qId, word) =>
    !showAnswer && !lockedSentences.has(qId) && !userInputs[qId].includes(word);

  const placeWord = (q, word, viaKeyboard = false) => {
    if (lockedSentences.has(q.id) || showAnswer) return;

    const current = userInputs[q.id];

    if (current.includes(word)) return;

    const count = current.length + 1;

    setUserInputs((prev) => ({ ...prev, [q.id]: [...prev[q.id], word] }));
    setWrongSentences((prev) => prev.filter((id) => id !== q.id));
    setSelectedWord(null);

    setAnnouncement(
      count === q.scrambled.length
        ? `${word} placed. Sentence ${q.id} is complete: ${[...current, word].join(" ")}. Press Check Answer when you are ready.`
        : `${word} placed. ${count} of ${q.scrambled.length} words.`,
    );

    // بالكيبورد: الفوكس بيروح للكلمة الجاية (أو لصندوق الجملة إذا خلصت)
    if (viaKeyboard) {
      const next = q.scrambled.find((w) => w !== word && !current.includes(w));

      requestAnimationFrame(() => {
        (next
          ? chipRefs.current[`${q.id}-${next}`]
          : zoneRefs.current[q.id]
        )?.focus?.();
      });
    }
  };

  const placeSelected = (q, viaKeyboard) => {
    if (!selectedWord) {
      setAnnouncement("First select a word, then select the sentence box.");
      return;
    }

    if (selectedWord.qId !== q.id) {
      setAnnouncement(`That word belongs to sentence ${selectedWord.qId}.`);
      return;
    }

    placeWord(q, selectedWord.word, viaKeyboard);
  };

  const removeWord = (q, index, viaKeyboard = false) => {
    if (lockedSentences.has(q.id) || showAnswer) return;

    const word = userInputs[q.id][index];

    setUserInputs((prev) => ({
      ...prev,
      [q.id]: prev[q.id].filter((_, i) => i !== index),
    }));
    setWrongSentences((prev) => prev.filter((id) => id !== q.id));
    setAnnouncement(`${word} returned to the word list.`);

    if (viaKeyboard) {
      requestAnimationFrame(() => {
        (
          chipRefs.current[`${q.id}-${word}`] || slotRefs.current[q.id]
        )?.focus?.();
      });
    }
  };

  const onChipClick = (e, q, word) => {
    // الكليك اللي بييجي بعد سحب: نتجاهله
    if (suppressClickRef.current) return;

    playWordAudio(q.id, word);

    if (!canMoveWord(q.id, word)) return;

    if (selectedWord?.qId === q.id && selectedWord.word === word) {
      setSelectedWord(null);
      setAnnouncement(`${word} deselected.`);
      return;
    }

    setSelectedWord({ qId: q.id, word });
    setPending(null);
    setAnnouncement(
      `${word} selected. Now select the sentence box ${q.id}, or drag the word into it.`,
    );

    // بالكيبورد: الفوكس بيروح مباشرة لصندوق الجملة
    if (e.detail === 0) {
      requestAnimationFrame(() => slotRefs.current[q.id]?.focus?.());
    }
  };

  // فوكس بالتاب على كلمة = شغّل صوتها (الماوس/اللمس بيروحوا على onClick)
  const onWordFocus = (e, qId, word) => {
    if (e.currentTarget.matches(":focus-visible")) playWordAudio(qId, word);
  };

  const onZoneClick = (e, q) => {
    if (e.detail === 0 && keyedRef.current) return;
    if (lockedSentences.has(q.id)) return;
    placeSelected(q, e.detail === 0);
  };

  // ========================================
  // DRAG (Mouse + Touch + Pen)
  // سحب الكلمة لصندوق جملتها. إذا ما تحركت: بتنعامل ككليك (اختيار)
  // ========================================

  const onChipPointerDown = (e, q, word) => {
    if (!canMoveWord(q.id, word)) return;

    if (e.pointerType === "mouse" && e.button !== 0) return;

    dragRef.current = {
      qId: q.id,
      word,
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

  const onChipPointerMove = (e) => {
    const d = dragRef.current;

    if (!d || d.pointerId !== e.pointerId) return;

    if (!d.started) {
      if (Math.hypot(e.clientX - d.startX, e.clientY - d.startY) < 6) return;

      d.started = true;
      setPending(null);
      setSelectedWord(null);
    }

    setDragGhost({ qId: d.qId, word: d.word, x: e.clientX, y: e.clientY });

    setHoverZone(zoneFromPoint(e.clientX, e.clientY) === d.qId ? d.qId : null);
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

    setDragGhost(null);
    setHoverZone(null);

    if (cancelled) return;

    const q = questions.find((item) => item.id === d.qId);

    if (zoneFromPoint(e.clientX, e.clientY) === d.qId) {
      placeWord(q, d.word, false);
    } else {
      setAnnouncement(`${d.word} was not dropped in sentence box ${d.qId}.`);
    }
  };

  // ========================================
  // MATCHING (الجملة ← الصورة، بأي ترتيب)
  // ========================================

  const connect = (qId, picIdx) => {
    setMatches((prev) => {
      const next = {};

      Object.entries(prev).forEach(([key, value]) => {
        if (Number(key) !== qId && value !== picIdx) next[key] = value;
      });

      next[qId] = picIdx;

      return next;
    });

    setWrongLines((prev) => prev.filter((id) => id !== qId));
    setPending(null);
    setAnnouncement(`Sentence ${qId} is connected to picture ${picIdx + 1}.`);
  };

  const selectLeft = (qId) => {
    if (lockedLines.has(qId)) return;

    if (pending?.side === "right") {
      connect(qId, pending.id);
      return;
    }

    if (pending?.side === "left" && pending.id === qId) {
      setPending(null);
      setAnnouncement("Selection cancelled.");
      return;
    }

    setSelectedWord(null);
    setPending({ side: "left", id: qId });
    setAnnouncement(
      `Sentence ${qId} selected. Press Tab to move between the pictures, Enter to connect, or Escape to cancel.`,
    );
  };

  const selectRight = (picIdx) => {
    if (lockedPics.has(picIdx)) return;

    if (pending?.side === "left") {
      connect(pending.id, picIdx);
      return;
    }

    if (pending?.side === "right" && pending.id === picIdx) {
      setPending(null);
      setAnnouncement("Selection cancelled.");
      return;
    }

    setSelectedWord(null);
    setPending({ side: "right", id: picIdx });
    setAnnouncement(
      `Picture ${picIdx + 1} selected. Press Tab to move between the sentences, Enter to connect, or Escape to cancel.`,
    );
  };

  const disconnect = (qId) => {
    if (lockedLines.has(qId) || matches[qId] === undefined) return;

    setMatches((prev) => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });

    setAnnouncement(`Connection for sentence ${qId} removed.`);
  };

  // Backspace / Delete على عنصر: بيشيل توصيله
  const disconnectKey = (getQId) => (e) => {
    if (e.key !== "Backspace" && e.key !== "Delete") return false;

    e.preventDefault();
    e.stopPropagation();

    const qId = getQId();

    if (qId !== undefined) disconnect(qId);

    return true;
  };

  // ========================================
  // ESC: إلغاء أي اختيار
  // ========================================

  const handleWrapperKeyDown = (e) => {
    // أثناء اختيار جملة أو صورة: التاب بيتنقل بس بين العناصر اللي بتتوصل معها
    // (ما بنقدر ننزل للكلمات أو للصندوق إلا بعد التوصيل أو Escape)
    if (e.key === "Tab" && pending) {
      const targets =
        pending.side === "left"
          ? pictures
              .map((_, i) =>
                lockedPics.has(i) ? null : rightItemRefs.current[i],
              )
              .filter(Boolean)
          : questions
              .filter((q) => !lockedLines.has(q.id))
              .map((q) => leftItemRefs.current[q.id])
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

    if (e.key === "Escape" && (pending || selectedWord)) {
      setPending(null);
      setSelectedWord(null);
      setAnnouncement("Selection cancelled.");
    }
  };

  // ========================================
  // CHECK
  // الصح بينقفل، الغلط بيرجع (الكلمات للبنك، والخط بينشال)
  // الشي الناقص (جملة مش كاملة / جملة بدون توصيل) ما بينحسب
  // ========================================

  const checkAnswers = () => {
    if (showAnswer || allDone) return;

    stopAudio();
    setPending(null);
    setSelectedWord(null);

    const nextLockedS = new Set(lockedSentences);
    const nextLockedL = new Set(lockedLines);
    const nextInputs = { ...userInputs };
    const nextMatches = { ...matches };
    const wrongS = [];
    const wrongL = [];
    let evaluated = 0;

    questions.forEach((q) => {
      if (!lockedSentences.has(q.id)) {
        const placed = userInputs[q.id];

        if (placed.length === q.scrambled.length) {
          evaluated++;

          if (
            placed.join(" ").toLowerCase() === q.correctSentence.toLowerCase()
          ) {
            nextLockedS.add(q.id);
          } else {
            nextInputs[q.id] = [];
            wrongS.push(q.id);
          }
        }
      }

      if (!lockedLines.has(q.id) && matches[q.id] !== undefined) {
        evaluated++;

        if (matches[q.id] === q.answerPic) {
          nextLockedL.add(q.id);
        } else {
          delete nextMatches[q.id];
          wrongL.push(q.id);
        }
      }
    });

    if (evaluated === 0) {
      const msg =
        "Please complete at least one sentence or one match before checking.";

      ValidationAlert.info("Oops!", msg);
      setAnnouncement(msg);
      return;
    }

    setUserInputs(nextInputs);
    setMatches(nextMatches);
    setLockedSentences(nextLockedS);
    setLockedLines(nextLockedL);
    setWrongSentences(wrongS);
    setWrongLines(wrongL);

    const score = nextLockedS.size + nextLockedL.size;

    const parts = [`Score ${score} out of ${TOTAL}.`];

    if (wrongS.length) {
      parts.push(
        `Sentence ${wrongS.join(", ")} was not correct. The words were returned.`,
      );
    }

    if (wrongL.length) {
      parts.push(
        `The match for sentence ${wrongL.join(", ")} was not correct and was removed.`,
      );
    }

    parts.push(
      score === TOTAL
        ? "All answers are correct."
        : "Correct items are locked. Try the rest again.",
    );

    setAnnouncement(parts.join(" "));

    const color = score === TOTAL ? "green" : score === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${score} / ${TOTAL}
        </span>
      </div>
    `;

    if (score === TOTAL) ValidationAlert.success(scoreMessage);
    else if (score === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  // ========================================
  // SHOW ANSWER
  // ========================================

  const showAnswers = () => {
    stopAudio();
    dragRef.current = null;
    setDragGhost(null);
    setHoverZone(null);
    setPending(null);
    setSelectedWord(null);

    setUserInputs(
      Object.fromEntries(
        questions.map((q) => [q.id, q.correctSentence.split(" ")]),
      ),
    );

    setMatches(Object.fromEntries(questions.map((q) => [q.id, q.answerPic])));

    setLockedSentences(new Set(questions.map((q) => q.id)));
    setLockedLines(new Set(questions.map((q) => q.id)));
    setWrongSentences([]);
    setWrongLines([]);
    setShowAnswer(true);

    setAnnouncement(
      "All answers shown. Every sentence is complete and every picture is matched. Press a sentence to hear it.",
    );
  };

  // ========================================
  // RESET: بيرجع كل شي (كلمات، توصيلات، علامات، صوت)
  // ========================================

  const reset = () => {
    stopAudio();
    dragRef.current = null;
    setDragGhost(null);
    setHoverZone(null);
    setPending(null);
    setSelectedWord(null);
    setUserInputs(makeEmptyInputs());
    setMatches({});
    setLockedSentences(new Set());
    setLockedLines(new Set());
    setWrongSentences([]);
    setWrongLines([]);
    setShowAnswer(false);
    setAnnouncement("Activity reset. All answers are cleared.");
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <div
      onKeyDown={handleWrapperKeyDown}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
        marginBottom: "30px",
      }}
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

      <div className="div-forall" style={{ gap: "30px" }}>
        <ExerciseHeader
          sectionLetter="D"
          title="Unscramble and write. Then, match."
          subTitle="Say the answer first, then rearrange the letters or words into the correct order."
        />

        <p id="u5p6q1-help" className="sr-only">
          For each sentence, press Tab to reach a word. Press Enter or Space to
          select it and hear it, then press Enter or Space on the sentence box
          to place it. Words in the box can be pressed to return them to the
          list. To match, press Tab to reach a sentence, press Enter or Space
          to select it and hear it, then Tab to a picture and press Enter or
          Space. While a sentence or a picture is selected, Tab moves only
          between the items it can be connected to. Press Backspace on a
          sentence or a picture to remove its connection. Press Escape to
          cancel a selection.
        </p>

        <div className="page8-q1-container">
          <div
            className="container12"
            ref={containerRef}
            aria-describedby="u5p6q1-help"
          >
            {questions.map((q, i) => {
              const placed = userInputs[q.id];
              const sentenceLocked = lockedSentences.has(q.id);
              const lineLocked = lockedLines.has(q.id);
              const matchedPic = matches[q.id];
              const hasSentenceAudio = Boolean(q.audio);
              const sentenceComplete = placed.length === q.scrambled.length;
              const isSentencePlaying = playingKey === `s:${q.id}`;
              const zoneIsTarget =
                !sentenceLocked &&
                (selectedWord?.qId === q.id || dragGhost?.qId === q.id);

              const pendingLeft =
                pending?.side === "left" && pending.id === q.id;
              const leftIsTarget = pending?.side === "right" && !lineLocked;

              const pendingRight =
                pending?.side === "right" && pending.id === i;
              const picLocked = lockedPics.has(i);
              const rightIsTarget = pending?.side === "left" && !picLocked;
              const owner = questions.find((item) => matches[item.id] === i);

              const leftLabel = `Sentence ${q.id}: ${q.matchWord}. ${
                lineLocked
                  ? `Correct. Matched to picture ${matchedPic + 1}.`
                  : leftIsTarget
                    ? `Press Enter to connect it to picture ${pending.id + 1}.`
                    : matchedPic !== undefined
                      ? `Connected to picture ${matchedPic + 1}. Press to change it.`
                      : pendingLeft
                        ? "Selected. Now choose a picture."
                        : "Not connected. Press to select, then choose a picture."
              }${hasSentenceAudio ? " Press to hear the sentence." : ""}`;

              const rightLabel = `Picture ${i + 1}: ${pictures[i].alt} ${
                picLocked
                  ? `Correct. Matched to sentence ${owner?.id}.`
                  : rightIsTarget
                    ? `Press Enter to connect it to sentence ${pending.id}.`
                    : owner
                      ? `Connected to sentence ${owner.id}. Press to change it.`
                      : pendingRight
                        ? "Selected. Now choose a sentence."
                        : "Not connected. Press to select, then choose a sentence."
              }`;

              // الجملة دايماً تفاعلية إذا إلها صوت، أو إذا التوصيل لسا مش مقفل
              const labelInteractive = !lineLocked || hasSentenceAudio;

              const labelAction = () => {
                if (hasSentenceAudio) playSentenceAudio(q); // الصوت دايماً
                if (!lineLocked) selectLeft(q.id); // وبنفس الوقت اختيار للتوصيل
              };

              return (
                <div className="CB-unit5-p6-q1-row" key={q.id}>
                  <div className="flex flex-col gap-2" style={{ width: "50%" }}>
                    {/* ==============================
                        SENTENCE LABEL (بيتحرك بالتاب) + START DOT (للماوس)
                    ============================== */}
                    <div className="CB-unit5-p6-q1-word-with-dot">
                      <span
                        role="button"
                        ref={(node) => {
                          leftItemRefs.current[q.id] = node;
                        }}
                        onFocus={(e) => {
                          setCandidate({ side: "left", id: q.id });
                          // تاب على الجملة = شغّل صوتها
                          if (
                            hasSentenceAudio &&
                            e.currentTarget.matches(":focus-visible")
                          ) {
                            playSentenceAudio(q);
                          }
                        }}
                        onBlur={() => setCandidate(null)}
                        onMouseEnter={() =>
                          setCandidate({ side: "left", id: q.id })
                        }
                        onMouseLeave={() => setCandidate(null)}
                        tabIndex={labelInteractive ? 0 : -1}
                        aria-pressed={pendingLeft}
                        aria-disabled={!labelInteractive}
                        aria-label={leftLabel}
                        className="focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb]"
                        style={{
                          position: "relative",
                          display: "inline-flex",
                          alignItems: "center",
                          borderRadius: 6,
                        }}
                        {...(labelInteractive
                          ? press(
                              labelAction,
                              lineLocked
                                ? undefined
                                : disconnectKey(() => q.id),
                            )
                          : {})}
                      >
                        <span className="CB-unit5-p6-q1-number mr-5">
                          {q.id}
                        </span>

                        <span
                          className={`
                            CB-unit5-p6-q1-word-text
                            ${lineLocked ? "CB-unit5-p6-q1-disabled-word" : ""}
                            transition-all duration-200
                            ${pendingLeft ? "text-red-600 scale-110 underline" : ""}
                          `}
                          style={{
                            cursor: labelInteractive ? "pointer" : "default",
                            fontWeight: lineLocked ? 700 : undefined,
                            ...(isSentencePlaying
                              ? { border: "1px solid #2563eb" }
                              : {}),
                          }}
                        >
                          {q.matchWord}
                        </span>

                        {/* ✕ التوصيل غلط */}
                        {wrongLines.includes(q.id) && <WrongBadge />}

                        {/* 🔊 السبيكر بيظهر بس وقت ما صوت الجملة شغّال */}
                        {isSentencePlaying && <SpeakerBadge/>}
                      </span>

                      <div className="CB-unit5-p6-q1-dot-wrapper">
                        <div
                          ref={(node) => {
                            leftDotRefs.current[q.id] = node;
                          }}
                          aria-hidden="true"
                          className={`
                            CB-unit5-p6-q1-dot CB-unit5-p6-q1-dot-start
                            transition-all duration-200
                            ${pendingLeft ? "scale-150 bg-red-600" : ""}
                          `}
                          style={{
                            cursor: labelInteractive ? "pointer" : "default",
                            ...(lineLocked
                              ? { backgroundColor: "#4caf50" }
                              : {}),
                            ...(leftIsTarget
                              ? { boxShadow: "0 0 0 4px rgba(37,99,235,.45)" }
                              : {}),
                          }}
                          onMouseEnter={() =>
                            setCandidate({ side: "left", id: q.id })
                          }
                          onMouseLeave={() => setCandidate(null)}
                          onClick={labelAction}
                        />
                      </div>
                    </div>

                    {/* ==============================
                        WORD BANK
                    ============================== */}
                    <div
                      className="CB-unit5-p6-q1-word-bank"
                      role="group"
                      aria-label={`Words for sentence ${q.id}`}
                    >
                      {q.scrambled.map((word) => {
                        const isUsed = placed.includes(word);
                        const isSelected =
                          selectedWord?.qId === q.id &&
                          selectedWord.word === word;
                        const isDragged =
                          dragGhost?.qId === q.id && dragGhost.word === word;
                        const isPlaying = playingKey === `w:${q.id}:${word}`;
                        const hasWordAudio = Boolean(
                          wordAudio[word.toLowerCase()],
                        );

                        return (
                          <button
                            key={word}
                            type="button"
                            ref={(node) => {
                              chipRefs.current[`${q.id}-${word}`] = node;
                            }}
                            className="CB-unit5-p6-q1-word-box focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb]"
                            disabled={isUsed || sentenceLocked}
                            aria-pressed={isSelected}
                            aria-label={`${word}. ${
                              isUsed
                                ? "Already placed."
                                : isSelected
                                  ? "Selected. Now select the sentence box."
                                  : "Press to hear it and select it."
                            }`}
                            {...press((e) => onChipClick(e, q, word))}
                            onFocus={(e) => onWordFocus(e, q.id, word)}
                            onPointerDown={(e) => onChipPointerDown(e, q, word)}
                            onPointerMove={onChipPointerMove}
                            onPointerUp={(e) => finishDrag(e, false)}
                            onPointerCancel={(e) => finishDrag(e, true)}
                            onDragStart={(e) => e.preventDefault()}
                            style={{
                              position: "relative",
                              background: isUsed
                                ? "#ccc"
                                : isSelected
                                  ? "#e8f0fe"
                                  : "white",
                              opacity: isUsed ? 0.6 : isDragged ? 0.4 : 1,
                              cursor: isUsed ? "not-allowed" : "grab",
                              outline: isSelected
                                ? "3px solid #2563eb"
                                : isPlaying
                                  ? "1px solid #2563eb"
                                  : undefined,
                              touchAction: "none",
                              userSelect: "none",
                              WebkitTouchCallout: "none",
                            }}
                          >
                            {word}

                            {/* 🔊 السبيكر بيظهر بس وقت ما صوت الكلمة شغّال (كليك أو تاب) */}
                            {hasWordAudio && isPlaying && (
                              <SpeakerBadge />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* ==============================
                        SENTENCE BOX (drop target)
                    ============================== */}
                    <div style={{ position: "relative" }}>
                      <div
                        ref={(node) => {
                          zoneRefs.current[q.id] = node;
                        }}
                        data-sentence-zone={q.id}
                        role="group"
                        tabIndex={-1}
                        aria-label={
                          sentenceLocked
                            ? `Sentence ${q.id}: ${q.correctSentence}.`
                            : `Sentence ${q.id} box. ${placed.length} of ${q.scrambled.length} words placed${
                                placed.length ? `: ${placed.join(" ")}` : ""
                              }.`
                        }
                        className={`CB-unit5-p6-q1-unscramble-input focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb] ${
                          hoverZone === q.id ? "CB-unit5-p6-q1-active-drop" : ""
                        }`}
                        onClick={(e) => onZoneClick(e, q)}
                        style={{
                          ...(zoneIsTarget
                            ? {
                                outline: "3px dashed #2563eb",
                                outlineOffset: 2,
                              }
                            : {}),
                          ...(sentenceLocked
                            ? {
                                borderBottom: "3px solid #4caf50",
                                fontWeight: 700,
                                cursor: "default",
                              }
                            : {}),
                        }}
                      >
                        {placed.map((word, index) =>
                          sentenceLocked ? (
                            <span
                              key={`${q.id}-${index}`}
                              style={{ marginRight: "6px" }}
                            >
                              {word}
                            </span>
                          ) : (
                            <button
                              key={`${q.id}-${index}`}
                              type="button"
                              className="hover:text-red-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb]"
                              aria-label={`${word}. Word ${index + 1} of ${placed.length}. Press to return it to the word list.`}
                              onFocus={(e) => onWordFocus(e, q.id, word)}
                              {...press((e) => {
                                e.stopPropagation();
                                playWordAudio(q.id, word);
                                removeWord(q, index, e.detail === 0);
                              })}
                              style={{
                                marginRight: "6px",
                                cursor: "pointer",
                                borderRadius: "6px",
                                transition: "0.2s",
                              }}
                            >
                              {word}
                            </button>
                          ),
                        )}

                        {/* الهدف للكيبورد: Enter / Space لوضع الكلمة المختارة */}
                        {!sentenceLocked && !sentenceComplete && (
                          <button
                            type="button"
                            ref={(node) => {
                              slotRefs.current[q.id] = node;
                            }}
                            aria-label={`Place the selected word in sentence ${q.id}`}
                            className="focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb]"
                            {...press((e) => {
                              e.stopPropagation();
                              placeSelected(q, e.detail === 0);
                            })}
                            style={{
                              minWidth: 28,
                              height: 28,
                              borderRadius: 6,
                              // border: "2px dashed #2c5287",
                              // background: zoneIsTarget ? "#e8f0fe" : "transparent",
                              // color: "#2c5287",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          ></button>
                        )}
                      </div>

                      {/* ✕ أبيض بدائرة حمرا: ترتيب الجملة غلط */}
                      {wrongSentences.includes(q.id) && <WrongBadge />}
                    </div>
                  </div>

                  {/* ==============================
                      PICTURE (بيتحرك بالتاب) + END DOT (للماوس)
                  ============================== */}
                  <div className="CB-unit5-p6-q1-match-section">
                    <div className="CB-unit5-p6-q1-dot-wrapper">
                      <div
                        ref={(node) => {
                          rightDotRefs.current[i] = node;
                        }}
                        aria-hidden="true"
                        className={`
                          CB-unit5-p6-q1-dot CB-unit5-p6-q1-dot-end
                          transition-all duration-200
                          ${pendingRight ? "scale-110 bg-red-600" : ""}
                        `}
                        style={{
                          cursor: picLocked ? "default" : "pointer",
                          ...(picLocked ? { backgroundColor: "#4caf50" } : {}),
                          ...(rightIsTarget
                            ? { boxShadow: "0 0 0 4px rgba(37,99,235,.45)" }
                            : {}),
                        }}
                        onMouseEnter={() =>
                          setCandidate({ side: "right", id: i })
                        }
                        onMouseLeave={() => setCandidate(null)}
                        onClick={() => selectRight(i)}
                      />
                    </div>

                    <img
                      src={pictures[i].src}
                      alt={pictures[i].alt}
                      draggable="false"
                      role="button"
                      ref={(node) => {
                        rightItemRefs.current[i] = node;
                      }}
                      onFocus={() => setCandidate({ side: "right", id: i })}
                      onBlur={() => setCandidate(null)}
                      onMouseEnter={() =>
                        setCandidate({ side: "right", id: i })
                      }
                      onMouseLeave={() => setCandidate(null)}
                      tabIndex={picLocked ? -1 : 0}
                      aria-pressed={pendingRight}
                      aria-disabled={picLocked}
                      aria-label={rightLabel}
                      className={`
                        CB-unit5-p6-q1-matched-img
                        ${picLocked ? "CB-unit5-p6-q1-disabled-word" : ""}
                        transition-all duration-200
                        focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb]
                        ${
                          pendingRight
                            ? "scale-110 border-2 border-red-600 rounded-lg"
                            : ""
                        }
                      `}
                      style={{
                        cursor: picLocked ? "default" : "pointer",
                        ...(picLocked
                          ? { outline: "3px solid #4caf50", borderRadius: 8 }
                          : {}),
                      }}
                      {...(picLocked
                        ? {}
                        : press(
                            () => selectRight(i),
                            disconnectKey(() => owner?.id),
                          ))}
                    />
                  </div>
                </div>
              );
            })}

            <svg
              className="lines-layer"
              aria-hidden="true"
              style={{ pointerEvents: "none" }}
            >
              {linePaths.map((l) => (
                <path
                  key={l.key}
                  d={`
                    M ${l.x1} ${l.y1}
                    C ${(l.x1 + l.x2) / 2} ${l.y1},
                      ${(l.x1 + l.x2) / 2} ${l.y2},
                      ${l.x2} ${l.y2}
                  `}
                  stroke={
                    l.preview
                      ? "red"
                      : lockedLines.has(l.qId)
                        ? "#4caf50"
                        : "red"
                  }
                  strokeDasharray={l.preview ? "8 6" : undefined}
                  strokeLinecap="round"
                  strokeWidth="3"
                  fill="none"
                />
              ))}
            </svg>
          </div>
        </div>

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
            style={
              showAnswer || allDone ? { cursor: "not-allowed" } : undefined
            }
          >
            Check Answer ✓
          </button>
        </div>
      </div>

      {/* الكلمة اللي بتنسحب (تابعة للمؤشر) */}
      {dragGhost && (
        <div
          aria-hidden="true"
          className="CB-unit5-p6-q1-word-box"
          style={{
            position: "fixed",
            left: dragGhost.x,
            top: dragGhost.y,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 9999,
            background: "white",
            boxShadow: "0 4px 12px rgba(0,0,0,.25)",
          }}
        >
          {dragGhost.word}
        </div>
      )}
    </div>
  );
};

export default Unit5_Page6_Q1;
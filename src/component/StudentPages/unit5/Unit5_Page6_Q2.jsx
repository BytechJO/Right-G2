/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useRef, useState } from "react";
import "./Unit5_Page6_Q2.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";
// 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";

import img1 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 45/Ex E 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 45/Ex E 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 45/Ex E 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 45/Ex E 4.svg";

// ========================================
// AUDIO (Page 45 - E)
// ========================================

import wordHe from "../../../assets/audio/ClassBook/U 5/Page 45 - E/Item_001_he.mp3";
import wordDoesnt from "../../../assets/audio/ClassBook/U 5/Page 45 - E/Item_002_doesn't.mp3";
import wordLike from "../../../assets/audio/ClassBook/U 5/Page 45 - E/Item_003_like.mp3";
import wordCheese from "../../../assets/audio/ClassBook/U 5/Page 45 - E/Item_004_cheese.mp3";
import wordShe from "../../../assets/audio/ClassBook/U 5/Page 45 - E/Item_005_she.mp3";
import wordSpaghetti from "../../../assets/audio/ClassBook/U 5/Page 45 - E/Item_006_spaghetti.mp3";
import wordMeat from "../../../assets/audio/ClassBook/U 5/Page 45 - E/Item_007_meat.mp3";
import wordLikes from "../../../assets/audio/ClassBook/U 5/Page 45 - E/Item_008_likes.mp3";
import wordIt from "../../../assets/audio/ClassBook/U 5/Page 45 - E/Item_009_it.mp3";
import wordMilk from "../../../assets/audio/ClassBook/U 5/Page 45 - E/Item_010_milk.mp3";

// صوت كل كلمة (المفتاح = الكلمة بحروف صغيرة)
const wordAudio = {
  he: wordHe,
  "doesn't": wordDoesnt,
  like: wordLike,
  cheese: wordCheese,
  she: wordShe,
  spaghetti: wordSpaghetti,
  meat: wordMeat,
  likes: wordLikes,
  it: wordIt,
  milk: wordMilk,
};

// ========================================
// DATA
// ⚠️ الـ alt مكتوب بالتخمين وأنا ما شفت الصور: عدّليهم حسب اللي بالصورة
// (وصف الصورة بس، بدون ما تكتبي الجملة الصحيحة)
// ⚠️ ما لقيت ملفات صوت للجمل الكاملة بالفولدر. إذا أضفتيها حطيها بـ audio
// وبيظهر زر إعادة الصوت تلقائياً بعد ما تصير الإجابة صح
// ========================================

const questions = [
  {
    id: 1,
    image: img1,
    alt: "A boy and a piece of cheese.",
    scrambled: ["he", "doesn't", "like", "cheese"],
    correct: "he doesn't like cheese",
    audio: null,
  },
  {
    id: 2,
    image: img2,
    alt: "A girl and a plate of spaghetti.",
    scrambled: ["she", "like", "spaghetti", "doesn't"],
    correct: "she doesn't like spaghetti",
    audio: null,
  },
  {
    id: 3,
    image: img3,
    alt: "A boy and a piece of meat.",
    scrambled: ["he", "meat", "likes"],
    correct: "he likes meat",
    audio: null,
  },
  {
    id: 4,
    image: img4,
    alt: "An animal and a glass of milk.",
    scrambled: ["likes", "it", "milk"],
    correct: "it likes milk",
    audio: null,
  },
];

const TOTAL = questions.length;

// ========================================
// HELPERS (خارج الكومبوننت)
// ========================================

const makeEmptyPlaced = () =>
  Object.fromEntries(questions.map((q) => [q.id, []]));

// بيتجاهل الحروف الكبيرة/الصغيرة والمسافات الزايدة وشكل الـ apostrophe
const normalize = (text) =>
  text
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/\s+/g, " ")
    .trim();

// رقم الجملة اللي تحت نقطة معينة بالشاشة (للسحب)
const zoneFromPoint = (x, y) => {
  const el = document.elementFromPoint(x, y);
  const zone = el?.closest?.("[data-sentence-zone]");
  if (!zone) return null;
  const id = Number(zone.dataset.sentenceZone);
  return Number.isNaN(id) ? null : id;
};

// ========================================
// BADGES
// ========================================

// سبيكر أسود داخل دائرة بيضا: بيظهر بس على الكلمة وقت ما صوتها شغّال
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
      border: "2px solid #4caf50",
      boxShadow: "0 1px 3px rgba(0,0,0,.25)",
    }}
  >
    <FaVolumeUp size={12} />
  </span>
);

// ✓ / ✕ جنب كل جملة بعد Check (الشكل مختلف مش بس اللون)
const FeedbackMark = ({ ok }) => (
  <span
    aria-hidden="true"
    style={{
      width: 26,
      height: 26,
      borderRadius: "50%",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      background: ok ? "" : "#e53935",
      color: "#fff",
      fontSize: 15,
      fontWeight: 700,
      lineHeight: 1,
    }}
  >
    {ok ? "" : "✕"}
  </span>
);

// ========================================
// MAIN
// ========================================

const Unit5_Page6_Q2 = () => {
  // الكلمات المرتبة بكل جملة (بتضل لحد Check أو Start Again)
  const [placed, setPlaced] = useState(makeEmptyPlaced);

  // نتيجة آخر Check: { رقم الجملة: "correct" | "wrong" }
  const [results, setResults] = useState({});
  const [score, setScore] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  // السحب بالماوس / اللمس
  const [dragGhost, setDragGhost] = useState(null); // { qId, word, x, y }
  const [hoverZone, setHoverZone] = useState(null);

  const [playingKey, setPlayingKey] = useState(null);
  const [announcement, setAnnouncement] = useState("");

  const chipRefs = useRef({});
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

  const press = (action) => ({
    onClick: (e) => {
      // detail === 0 يعني click جاي من الكيبورد وإحنا عالجناه بالـ keydown
      if (e.detail === 0 && keyedRef.current) return;
      action(e);
    },
    onKeyDown: (e) => {
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

  const playSentenceAudio = (q) => playAudio(`s:${q.id}`, q.audio);

  // وقف الصوت إذا سكرت الصفحة
  useEffect(() => () => stopGlobalAudio(audioOwner), [audioOwner]);

  // ========================================
  // STATE HELPERS
  // ========================================

  const isLocked = (qId) => showAnswer || results[qId] === "correct";

  const allCorrect = questions.every((q) => results[q.id] === "correct");

  const canMoveWord = (qId, word) =>
    !isLocked(qId) && !placed[qId].includes(word);

  // أي تعديل على جملة بيشيل علامة ✓/✕ تبعتها
  const clearResult = (qId) =>
    setResults((prev) => {
      if (!prev[qId]) return prev;
      const next = { ...prev };
      delete next[qId];
      return next;
    });

  // ========================================
  // WORDS: PLACE / REMOVE
  // ========================================

  const placeWord = (q, word) => {
    if (isLocked(q.id) || placed[q.id].includes(word)) return;

    const count = placed[q.id].length + 1;

    setPlaced((prev) => ({ ...prev, [q.id]: [...prev[q.id], word] }));
    clearResult(q.id);

    setAnnouncement(
      count === q.scrambled.length
        ? `${word} added. Sentence ${q.id} is complete: ${[...placed[q.id], word].join(" ")}. Press Check Answer when you are ready.`
        : `${word} added. ${count} of ${q.scrambled.length} words.`,
    );
  };

  // الكلمة اللي بالصندوق: بترجع للورد بانك
  const removeWord = (q, index, viaKeyboard = false) => {
    if (isLocked(q.id)) return;

    const word = placed[q.id][index];

    setPlaced((prev) => ({
      ...prev,
      [q.id]: prev[q.id].filter((_, i) => i !== index),
    }));
    clearResult(q.id);
    setAnnouncement(`${word} returned to the word list.`);

    // بالكيبورد: الفوكس بيرجع للكلمة بالورد بانك
    if (viaKeyboard) {
      requestAnimationFrame(() => {
        chipRefs.current[`${q.id}-${word}`]?.focus?.();
      });
    }
  };

  // الضغط على كلمة بالورد بانك: بيشغّل صوتها وبيحطها بالصندوق
  const onChipPress = (q, word) => {
    // الكليك اللي بييجي بعد سحب: نتجاهله
    if (suppressClickRef.current) return;

    playWordAudio(q.id, word);

    if (isLocked(q.id)) return;

    if (placed[q.id].includes(word)) {
      setAnnouncement(`${word} is already in sentence ${q.id}.`);
      return;
    }

    placeWord(q, word);
  };

  // فوكس بالتاب على كلمة = شغّل صوتها (الماوس/اللمس بيروحوا على onClick)
  const onWordFocus = (e, qId, word) => {
    if (e.currentTarget.matches(":focus-visible")) playWordAudio(qId, word);
  };

  // ========================================
  // DRAG (Mouse + Touch + Pen)
  // سحب الكلمة لصندوق جملتها. إذا ما تحركت: بتنعامل ككليك
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
      placeWord(q, d.word);
    } else {
      setAnnouncement(`${d.word} was not dropped in sentence box ${d.qId}.`);
    }
  };

  // ========================================
  // CHECK
  // الصح بينقفل (✓)، الغلط بيضل قابل للتعديل (✕)
  // ========================================

  const checkAnswers = () => {
    if (showAnswer || allCorrect) return;

    stopAudio();

    const firstEmpty = questions.find((q) => placed[q.id].length === 0);

    if (firstEmpty) {
      const msg = "Please complete all sentences.";

      ValidationAlert.info("Oops!", msg);
      setAnnouncement(`${msg} Sentence ${firstEmpty.id} is empty.`);
      chipRefs.current[
        `${firstEmpty.id}-${firstEmpty.scrambled[0]}`
      ]?.focus?.();
      return;
    }

    const next = {};
    const wrongIds = [];

    questions.forEach((q) => {
      const ok =
        results[q.id] === "correct" ||
        normalize(placed[q.id].join(" ")) === normalize(q.correct);

      next[q.id] = ok ? "correct" : "wrong";

      if (!ok) wrongIds.push(q.id);
    });

    const nextScore = TOTAL - wrongIds.length;

    setResults(next);
    setScore(nextScore);

    setAnnouncement(
      [
        `Score ${nextScore} out of ${TOTAL}.`,
        wrongIds.length
          ? `Sentence ${wrongIds.join(", ")} is not correct. Try again.`
          : "All answers are correct.",
      ].join(" "),
    );

    const color =
      nextScore === TOTAL ? "green" : nextScore === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${nextScore} / ${TOTAL}
        </span>
      </div>
    `;

    if (nextScore === TOTAL) ValidationAlert.success(scoreMessage);
    else if (nextScore === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  // ========================================
  // SHOW ANSWER / RESET
  // ========================================

  const showAnswers = () => {
    stopAudio();
    dragRef.current = null;
    setDragGhost(null);
    setHoverZone(null);

    setPlaced(
      Object.fromEntries(questions.map((q) => [q.id, q.correct.split(" ")])),
    );
    setResults({});
    setScore(null);
    setShowAnswer(true);

    setAnnouncement("All answers shown. Every sentence is complete.");
  };

  const reset = () => {
    stopAudio();
    dragRef.current = null;
    setDragGhost(null);
    setHoverZone(null);

    setPlaced(makeEmptyPlaced());
    setResults({});
    setScore(null);
    setShowAnswer(false);

    setAnnouncement(
      "Activity reset. All answers, feedback and score are cleared.",
    );
  };

  // ========================================
  // RENDER
  // ========================================

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
          sectionLetter="E"
          title="Look and write."
          subTitle="Use the picture and word clues, then type the missing word or sentence carefully."
        />

        <p id="u5p6q2-help" className="sr-only">
          For each picture, press Tab to reach the words. Press Enter or Space
          on a word to hear it and add it to the sentence box. Words in the box
          can be pressed to return them to the word list. Then press Check
          Answer.
        </p>

        <div
          className="CB-unit5-p6-q2-container"
          aria-describedby="u5p6q2-help"
        >
          {questions.map((q) => {
            const words = placed[q.id];
            const result = results[q.id];
            const locked = isLocked(q.id);
            const feedbackId = `u5p6q2-feedback-${q.id}`;
            const isSentencePlaying = playingKey === `s:${q.id}`;
            const canReplay =
              Boolean(q.audio) && (result === "correct" || showAnswer);

            const borderColor =
              result === "correct" || showAnswer
                ? "#4caf50"
                : result === "wrong"
                  ? "#e53935"
                  : undefined;
            return (
              <div className="CB-unit5-p6-q2-row mb-10" key={q.id}>
                <div
                  className="CB-unit5-p6-q2-row-inner"
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                    gap: "60px",
                    alignItems: "center",
                  }}
                >
                  {/* Image */}
                  <div
                    className="CB-unit5-p6-q2-image-section"
                    style={{ display: "flex" }}
                  >
                    <span
                      className="font-bold text-2xl text-blue-800"
                      aria-hidden="true"
                    >
                      {q.id}
                    </span>
                    <img
                      src={q.image}
                      alt={`Picture ${q.id}: ${q.alt}`}
                      draggable="false"
                      className="CB-unit5-p6-q2-image"
                      style={{ height: "auto", width: "250px" }}
                    />
                  </div>

                  {/* Word bank + Sentence box */}
                  <div className="CB-unit5-p6-q2-word-section">
                    {/* Word bank */}
                    <div
                      role="group"
                      aria-label={`Words for sentence ${q.id}`}
                      style={{
                        display: "flex",
                        gap: "30px",
                        padding: "10px",
                        borderRadius: "10px",
                        alignItems: "center",
                        width: "90%",
                        justifyContent: "flex-start",
                      }}
                    >
                      {q.scrambled.map((word) => {
                        const isUsed = words.includes(word);
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
                            className="CB-unit5-p6-q2-word-box focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb]"
                            aria-label={`${word}. ${
                              isUsed
                                ? "Already in the sentence. Press to hear it."
                                : "Press to hear it and add it to the sentence."
                            }`}
                            {...press(() => onChipPress(q, word))}
                            onFocus={(e) => onWordFocus(e, q.id, word)}
                            onPointerDown={(e) => onChipPointerDown(e, q, word)}
                            onPointerMove={onChipPointerMove}
                            onPointerUp={(e) => finishDrag(e, false)}
                            onPointerCancel={(e) => finishDrag(e, true)}
                            onDragStart={(e) => e.preventDefault()}
                            style={{
                              position: "relative",
                              padding: "5px",
                              border: "2px solid #2c5287",
                              borderRadius: "8px",
                              fontWeight: "bold",
                              background: isUsed ? "#ccc" : "white",
                              opacity: isUsed ? 0.6 : isDragged ? 0.4 : 1,
                              cursor: isUsed ? "default" : "grab",
                              width: "90px",
                              display: "flex",
                              justifyContent: "center",
                              fontSize: "18px",
                              outline: isPlaying
                                ? "3px solid #4caf50"
                                : undefined,
                              touchAction: "none",
                              userSelect: "none",
                              WebkitTouchCallout: "none",
                            }}
                          >
                            {word}

                            {/* 🔊 السبيكر بيظهر بس وقت ما صوت الكلمة شغّال */}
                            {hasWordAudio && isPlaying && <SpeakerBadge />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Sentence box (شكل بس: ما بنكتب فيه) + feedback beside it */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        width: "100%",
                      }}
                    >
                      <div
                        data-sentence-zone={q.id}
                        role="group"
                        aria-label={`Sentence ${q.id} box. ${words.length} of ${q.scrambled.length} words${
                          words.length ? `: ${words.join(" ")}` : ""
                        }.${locked ? "" : " Press a word to return it to the list."}`}
                        aria-describedby={feedbackId}
                        className={`CB-unit5-p6-q2-input ${
                          hoverZone === q.id ? "CB-unit5-p6-q2-drag-over" : ""
                        }`}
                        style={{
                          flex: 1,
                          minWidth: 0,
                          minHeight: "40px",
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                          padding: "5px",
                          ...(borderColor
                            ? { borderBottom: `3px solid ${borderColor}` }
                            : {}),
                          ...(locked ? { fontWeight: 700 } : {}),
                          ...(isSentencePlaying
                            ? { backgroundColor: "#e6f4ea" }
                            : {}),
                        }}
                      >
                        {words.map((word, index) =>
                          locked ? (
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
                              aria-label={`${word}. Word ${index + 1} of ${words.length}. Press to return it to the word list.`}
                              onFocus={(e) => onWordFocus(e, q.id, word)}
                              {...press((e) => {
                                playWordAudio(q.id, word);
                                removeWord(q, index, e.detail === 0);
                              })}
                              style={{
                                marginRight: "6px",
                                padding: "2px 6px",
                                cursor: "pointer",
                                borderRadius: "6px",
                                transition: "0.2s",
                              }}
                            >
                              {word}
                            </button>
                          ),
                        )}
                      </div>

                      {/* ✓ / ✕ جنب الصندوق */}
                      {result && <FeedbackMark ok={result === "correct"} />}

                      {/* 🔊 إعادة صوت الجملة (بس إذا في ملف صوت والجملة صح) */}
                      {canReplay && (
                        <button
                          type="button"
                          aria-label={`Play sentence ${q.id}`}
                          className="focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb]"
                          {...press(() => playSentenceAudio(q))}
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            background: "#fff",
                            color: "#000",
                            border: isSentencePlaying
                              ? "2px solid #4caf50"
                              : "1px solid #cfcfcf",
                            cursor: "pointer",
                          }}
                        >
                          <FaVolumeUp size={14} aria-hidden="true" />
                        </button>
                      )}

                      <span id={feedbackId} className="sr-only">
                        {result === "correct"
                          ? "Correct."
                          : result === "wrong"
                            ? "Not correct. Try again."
                            : showAnswer
                              ? "Answer shown."
                              : "Not checked yet."}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
            showAnswer || allCorrect ? { cursor: "not-allowed" } : undefined
          }
        >
          Check Answer ✓
        </button>
      </div>

      {/* الكلمة اللي بتنسحب (تابعة للمؤشر) */}
      {dragGhost && (
        <div
          aria-hidden="true"
          className="CB-unit5-p6-q2-word-box"
          style={{
            position: "fixed",
            left: dragGhost.x,
            top: dragGhost.y,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 9999,
            padding: "5px",
            border: "2px solid #2c5287",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "18px",
            width: "90px",
            display: "flex",
            justifyContent: "center",
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

export default Unit5_Page6_Q2;

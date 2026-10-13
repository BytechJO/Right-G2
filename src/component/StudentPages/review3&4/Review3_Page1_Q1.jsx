/* eslint-disable react-refresh/only-export-components */
import React, { useState, useRef, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";

import img1 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 34/Ex A 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 34/Asset 22.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 34/Ex A 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 34/Ex A 4.svg";

// ⚠️ أسماء ملفات الصوت 1 و 3 كانت مقطوعة بالسكرين شوت، تأكد منها
import sentence1Audio from "../../../assets/audio/ClassBook/U 4/Page 34 - A/Item_001_He_can_ride_a_bike.mp3";
import sentence2Audio from "../../../assets/audio/ClassBook/U 4/Page 34 - A/Item_002_It_can't_swim.mp3";
import sentence3Audio from "../../../assets/audio/ClassBook/U 4/Page 34 - A/Item_003_He_can_play_the_drum.mp3";
import sentence4Audio from "../../../assets/audio/ClassBook/U 4/Page 34 - A/Item_004_He_can_paint.mp3";
import canAudio from "../../../assets/audio/ClassBook/U 4/Page 34 - A/Item_005_can.mp3";
import cantAudio from "../../../assets/audio/ClassBook/U 4/Page 34 - A/Item_006_can't.mp3";

import "./Review3_Page1_Q1.css";

/* ================= DATA ================= */

// ⚠️ الـ alt وصف عام بدون الجواب (الجملة والدايرة هم الجواب).
// الأوصاف تخمين، راجعها مع الصور الفعلية (خاصة الصورة 2).
const ITEMS = [
  {
    id: 1,
    img: img1,
    alt: "a boy outdoors next to a bicycle",
    correct: "can",
    sentence: "He can ride a bike.",
  },
  {
    id: 2,
    img: img2,
    alt: "an animal standing next to some water",
    correct: "can't",
    sentence: "It can't swim.",
  },
  {
    id: 3,
    img: img3,
    alt: "a boy with a musical instrument in front of him",
    correct: "can",
    sentence: "He can play the drum.",
  },
  {
    id: 4,
    img: img4,
    alt: "a boy holding a paintbrush next to a canvas",
    correct: "can",
    sentence: "He can paint.",
  },
];

const CHOICES = ["can", "can't"];

// ترتيب البنك مختلف عن ترتيب الأسئلة
const WORD_BANK = [
  ITEMS[2].sentence,
  ITEMS[0].sentence,
  ITEMS[3].sentence,
  ITEMS[1].sentence,
];

const AUDIO = {
  [ITEMS[0].sentence]: sentence1Audio,
  [ITEMS[1].sentence]: sentence2Audio,
  [ITEMS[2].sentence]: sentence3Audio,
  [ITEMS[3].sentence]: sentence4Audio,
  can: canAudio,
  "can't": cantAudio,
};

const COUNT = ITEMS.length;
const TOTAL = COUNT * 2; // نقطة للدايرة + نقطة للجملة

const emptyArr = () => Array(COUNT).fill("");
const nullArr = () => Array(COUNT).fill(null);

/* ================= HELPERS / SUB-COMPONENTS (خارج الكومبوننت) ================= */

const pauseOtherAudio = () => {
  document.querySelectorAll("audio").forEach((el) => el.pause());
};

const chipEl = (word) => document.querySelector(`[data-r3p1q1-chip="${word}"]`);
const slotEl = (i) => document.querySelector(`[data-r3p1q1-slot="${i}"]`);

const SpeakerIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M3 9v6h4l5 5V4L7 9H3z" />
    <path
      d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// 🔤 جملة بالبنك: زر + قابل للسحب
const WordChip = ({
  word,
  used,
  selected,
  playing,
  dragDisabled,
  onActivate,
  onFocusWord,
}) => {
  const { setNodeRef, listeners, isDragging } = useDraggable({
    id: `bank-${word}`,
    data: { word },
    disabled: dragDisabled,
  });

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      data-r3p1q1-chip={word}
      type="button"
      className={`CB-r3p1q1-chip ${used ? "is-used" : ""} ${
        selected ? "is-selected" : ""
      } ${playing ? "is-playing" : ""} ${isDragging ? "is-dragging" : ""}`}
      aria-pressed={selected}
      aria-disabled={used}
      aria-label={
        used
          ? `${word} already used`
          : selected
            ? `${word} selected. Press Enter on a box to place it`
            : `${word} Press Enter to select, then choose a box`
      }
      // e.detail === 0 يعني الضغط جاي من الكيبورد (Enter / Space)
      onClick={(e) => onActivate(word, e.detail === 0)}
      onFocus={(e) => onFocusWord(e, word)}
    >
      <span aria-hidden="true">{word}</span>
      <span
        className={`CB-r3p1q1-speaker ${playing ? "playing" : ""}`}
        aria-hidden="true"
      >
        <SpeakerIcon />
      </span>
    </button>
  );
};

// 🧩 خانة الجملة: زر + هدف إفلات
const Slot = ({
  index,
  word,
  state,
  locked,
  isTarget,
  ariaLabel,
  onActivate,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${index}`,
    disabled: locked,
  });

  return (
    <button
      ref={setNodeRef}
      data-r3p1q1-slot={index}
      type="button"
      className={`write-input-CB-review2-p2-q3 CB-r3p1q1-slot ${
        word ? "has-word" : ""
      } ${
        state === "correct" ? "is-correct" : state === "wrong" ? "is-wrong" : ""
      } ${isTarget ? "is-target" : ""} ${isOver ? "drag-over-cell" : ""}`}
      aria-disabled={locked}
      aria-label={ariaLabel}
      onClick={(e) => onActivate(index, e.detail === 0)}
    >
      <span aria-hidden="true">{word}</span>
    </button>
  );
};

// ⭕ دايرة can / can't: زر (Tab + Enter + Space + ماوس + لمس)
const CircleChoice = ({
  op,
  selected,
  state,
  locked,
  playing,
  ariaLabel,
  onActivate,
  onFocusChoice,
  dataKey,
}) => (
  <button
    type="button"
    data-r3p1q1-circle={dataKey}
    className={`circle-choice-CB-review3-p1-q1 CB-r3p1q1-circle ${
      selected ? "active" : ""
    } ${state === "correct" ? "is-correct" : state === "wrong" ? "is-wrong" : ""} ${
      playing ? "is-playing" : ""
    }`}
    aria-pressed={selected}
    aria-disabled={locked}
    aria-label={ariaLabel}
    onClick={onActivate}
    onFocus={onFocusChoice}
  >
    <span aria-hidden="true">{op}</span>
  </button>
);

const Review3_Page1_Q1 = () => {
  const [selected, setSelected] = useState(emptyArr()); // can / can't لكل صورة
  const [answers, setAnswers] = useState(emptyArr()); // الجملة بكل خانة
  const [circleResults, setCircleResults] = useState(nullArr()); // null | "correct" | "wrong"
  const [slotResults, setSlotResults] = useState(nullArr()); // null | "correct" | "wrong"
  const [selectedWord, setSelectedWord] = useState(null); // جملة مختارة من البنك
  const [dragWord, setDragWord] = useState(null);
  const [finished, setFinished] = useState(false); // كل شي صح بعد Check
  const [answerShown, setAnswerShown] = useState(false);
  const [message, setMessage] = useState("");
  const [playingWord, setPlayingWord] = useState(null);

  const audioRef = useRef(null);
  const tokenRef = useRef(0); // بيلغي أي تشغيل معلّق
  const skipSoundRef = useRef(false); // 🔇 لما نرجّع الفوكس برمجياً ما نشغّل الصوت

  const disabled = finished || answerShown;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const lockedMessage = () =>
    answerShown
      ? "Correct answers are shown. Press Start Again to try again."
      : "All answers are correct and locked.";

  /* ================= FOCUS ================= */

  // رجوع الفوكس لجملة بالبنك بدون صوت
  const focusChip = (word) => {
    requestAnimationFrame(() => {
      const el = chipEl(word);
      if (!el) return;
      if (document.activeElement !== el) skipSoundRef.current = true;
      el.focus();
    });
  };

  const focusSlot = (i) => {
    requestAnimationFrame(() => slotEl(i)?.focus());
  };

  // أول فراغ متاح: الفاضي أولاً، وإلا أول واحد مش مقفول
  const firstOpenSlot = () => {
    const open = ITEMS.map((_, i) => i).filter(
      (i) => slotResults[i] !== "correct",
    );
    return open.find((i) => !answers[i]) ?? open[0] ?? null;
  };

  /* ================= AUDIO ================= */

  const stopSound = () => {
    tokenRef.current += 1;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingWord(null);
  };

  // تشغيل (أو إعادة تشغيل من الأول) بدون تداخل مع أي صوت ثاني
  // key = مين اللي عم يشتغل صوته بالواجهة (للدواير: رقم السؤال + الكلمة، عشان can بكل الأسئلة ما تضوي كلها)
  const playWord = (word, key = word) => {
    const src = AUDIO[word];
    if (!src) return;

    stopSound();
    pauseOtherAudio();

    const token = tokenRef.current;
    const audio = new Audio(src);
    audioRef.current = audio;
    setPlayingWord(key);

    audio.onended = () => {
      if (token === tokenRef.current) setPlayingWord(null);
    };
    audio.onerror = () => {
      if (token === tokenRef.current) setPlayingWord(null);
    };
    audio.play().catch(() => {
      if (token === tokenRef.current) setPlayingWord(null);
    });
  };

  // لو اشتغل أي صوت ثاني بالصفحة نوقف صوتنا، وعند الخروج من الصفحة نوقف كل شي
  useEffect(() => {
    const onOtherPlay = (e) => {
      if (e.target !== audioRef.current) {
        tokenRef.current += 1;
        audioRef.current?.pause();
        setPlayingWord(null);
      }
    };

    document.addEventListener("play", onOtherPlay, true);

    return () => {
      document.removeEventListener("play", onOtherPlay, true);
      tokenRef.current += 1;
      audioRef.current?.pause();
    };
  }, []);

  // فوكس بالتاب = شغّل الصوت (الماوس/اللمس بيروحوا على onClick)
  const onWordFocus = (e, word) => {
    if (skipSoundRef.current) {
      skipSoundRef.current = false;
      return;
    }
    if (e.currentTarget.matches(":focus-visible")) playWord(word);
  };

  /* ================= CIRCLES (can / can't) ================= */

  // كليك / Enter / Space: صوت + اختيار، ونفس الدايرة مرة ثانية = إلغاء الاختيار
  const activateCircle = (i, op) => {
    playWord(op, `${i}-${op}`);

    if (disabled) {
      setMessage(lockedMessage());
      return;
    }

    if (circleResults[i] === "correct") {
      setMessage(`Picture ${i + 1}: ${selected[i]} is correct and locked.`);
      return;
    }

    const unselect = selected[i] === op;

    setSelected((prev) => prev.map((s, k) => (k === i ? (unselect ? "" : op) : s)));
    setCircleResults((prev) => prev.map((r, k) => (k === i ? null : r)));
    setMessage(
      unselect
        ? `Picture ${i + 1}: ${op} unselected.`
        : `Picture ${i + 1}: ${op} selected.`,
    );
  };

  /* ================= WORD BANK ================= */

  // كليك / Enter / Space على جملة: صوت + اختيار
  const activateWord = (word, viaKeyboard) => {
    playWord(word);

    if (disabled) return;

    if (answers.includes(word)) {
      setMessage(`${word} is already in a box. Press that box to take it back.`);
      return;
    }

    if (selectedWord === word) {
      setSelectedWord(null);
      setMessage(`${word} unselected.`);
      return;
    }

    setSelectedWord(word);

    if (viaKeyboard) {
      // ⬇️ المؤشر بينزل مباشرة على أول فراغ متاح
      const target = firstOpenSlot();
      if (target !== null) focusSlot(target);

      setMessage(
        `${word} selected. Press Tab to move between the boxes, Enter or Space to place it, Escape to cancel.`,
      );
    } else {
      setMessage(`${word} selected. Choose a box to place it.`);
    }
  };

  /* ================= SLOTS ================= */

  const placeWord = (slot, word, viaKeyboard) => {
    if (disabled) return;

    if (slotResults[slot] === "correct") {
      setMessage(`Box ${slot + 1} is correct and locked.`);
      return;
    }

    const old = answers.indexOf(word);

    const newAnswers = answers.map((a, i) =>
      i === slot ? word : i === old ? "" : a,
    );

    setAnswers(newAnswers);
    setSlotResults((prev) =>
      prev.map((r, i) => (i === slot || i === old ? null : r)),
    );
    setSelectedWord(null);

    if (viaKeyboard) {
      // ⬆️ المؤشر بيرجع على الجملة الجاية المتاحة بالبنك
      const nextWord = WORD_BANK.find((w) => !newAnswers.includes(w));

      if (nextWord) {
        focusChip(nextWord);
        setMessage(
          `${word} placed in box ${slot + 1}. Back in the word bank, on ${nextWord}`,
        );
      } else {
        focusSlot(slot);
        setMessage(`${word} placed in box ${slot + 1}. All sentences are placed.`);
      }
    } else {
      setMessage(`${word} placed in box ${slot + 1}.`);
    }
  };

  const returnWord = (slot, viaKeyboard) => {
    const word = answers[slot];

    setAnswers((prev) => prev.map((a, i) => (i === slot ? "" : a)));
    setSlotResults((prev) => prev.map((r, i) => (i === slot ? null : r)));
    setMessage(`${word} returned to the word bank.`);

    if (viaKeyboard) focusChip(word);
  };

  const activateSlot = (slot, viaKeyboard) => {
    if (disabled) {
      setMessage(lockedMessage());
      return;
    }

    if (slotResults[slot] === "correct") {
      setMessage(`Box ${slot + 1} is correct and locked.`);
      return;
    }

    if (selectedWord) {
      placeWord(slot, selectedWord, viaKeyboard);
      return;
    }

    if (answers[slot]) {
      returnWord(slot, viaKeyboard);
      return;
    }

    setMessage("Select a sentence first, then choose a box.");
  };

  /* ================= KEYBOARD: Tab بين الفراغات + Escape ================= */

  const onAreaKeyDown = (e) => {
    if (!selectedWord || disabled) return;

    if (e.key === "Escape") {
      e.preventDefault();
      const word = selectedWord;
      setSelectedWord(null);
      setMessage(`${word} unselected.`);
      focusChip(word);
      return;
    }

    if (e.key !== "Tab") return;

    // طول ما في جملة مختارة: Tab بيلف بين الفراغات المتاحة بس
    const targets = ITEMS.map((_, i) => i).filter(
      (i) => slotResults[i] !== "correct",
    );
    if (targets.length === 0) return;

    e.preventDefault();

    const idx = targets.findIndex((i) => slotEl(i) === document.activeElement);

    const next = e.shiftKey
      ? targets[(idx <= 0 ? targets.length : idx) - 1]
      : targets[(idx + 1) % targets.length];

    focusSlot(next);
  };

  /* ================= DRAG & DROP (ماوس / لمس) ================= */

  const onDragStart = (e) => {
    const word = e.active.data.current?.word ?? null;
    setDragWord(word);
    setSelectedWord(null);
    if (word) playWord(word);
  };

  const onDragEnd = ({ active, over }) => {
    setDragWord(null);
    if (!over || disabled) return;

    const word = active.data.current?.word;
    const match = String(over.id).match(/^slot-(\d+)$/);
    if (word && match) placeWord(Number(match[1]), word, false);
  };

  /* ================= CHECK ================= */

  const checkAnswers = () => {
    // بعد Show Answer أو بعد ما كل شي صح: ما في شي نعمله
    if (disabled) return;

    if (selected.some((s) => s === "")) {
      const msg = "Please choose can or can't for all the pictures before checking!";
      ValidationAlert.info("Oops!", msg);
      setMessage(msg);
      return;
    }

    if (answers.some((a) => a === "")) {
      const msg = "Please fill in all the boxes before checking!";
      ValidationAlert.info("Oops!", msg);
      setMessage(msg);
      return;
    }

    stopSound();

    // الصح القديم بيضل مقفول، والباقي بينقيّم
    const newCircle = ITEMS.map((item, i) =>
      circleResults[i] === "correct" || selected[i] === item.correct
        ? "correct"
        : "wrong",
    );
    const newSlots = ITEMS.map((item, i) =>
      slotResults[i] === "correct" || answers[i] === item.sentence
        ? "correct"
        : "wrong",
    );

    const score =
      newCircle.filter((r) => r === "correct").length +
      newSlots.filter((r) => r === "correct").length;

    setCircleResults(newCircle);
    setSlotResults(newSlots);
    setSelectedWord(null);

    if (score === TOTAL) setFinished(true);

    // فيدباك لكل صورة
    const details = ITEMS.map(
      (_, i) =>
        `Picture ${i + 1}: circle ${selected[i]} ${
          newCircle[i] === "correct" ? "correct" : "incorrect"
        }, sentence ${newSlots[i] === "correct" ? "correct" : "incorrect"}`,
    ).join(". ");

    setMessage(
      `Score ${score} out of ${TOTAL}. ${details}.${
        score < TOTAL
          ? " Correct answers are locked. Fix the ones marked with a cross."
          : ""
      }`,
    );

    const color = score === TOTAL ? "green" : score === 0 ? "red" : "orange";

    ValidationAlert[
      score === TOTAL ? "success" : score === 0 ? "error" : "warning"
    ](
      `<div style="font-size:20px;text-align:center">
        <b style="color:${color}">Score: ${score} / ${TOTAL}</b>
      </div>`,
    );
  };

  /* ================= SHOW ANSWER ================= */

  const showAnswers = () => {
    stopSound();
    setSelected(ITEMS.map((i) => i.correct));
    setAnswers(ITEMS.map((i) => i.sentence));
    setCircleResults(ITEMS.map(() => "correct"));
    setSlotResults(ITEMS.map(() => "correct"));
    setSelectedWord(null);
    setFinished(false);
    setAnswerShown(true);
    setMessage("Correct answers are shown.");
  };

  /* ================= START AGAIN ================= */

  const resetAll = () => {
    stopSound();
    pauseOtherAudio();
    setSelected(emptyArr());
    setAnswers(emptyArr());
    setCircleResults(nullArr());
    setSlotResults(nullArr());
    setSelectedWord(null);
    setDragWord(null);
    setFinished(false);
    setAnswerShown(false);
    setMessage("Exercise reset. All answers are cleared.");
  };

  /* ================= RENDER ================= */

  const showBadges = !answerShown;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={() => setDragWord(null)}
      accessibility={{
        // الكيبورد عندنا بالإنتر/السبيس، فنسكّت إعلانات الـ dnd-kit
        announcements: {
          onDragStart() {},
          onDragOver() {},
          onDragEnd() {},
          onDragCancel() {},
        },
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
          marginBottom: "50px",
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

        <div
          className="div-forall"
          style={{ gap: "25px" }}
          onKeyDown={onAreaKeyDown}
        >
          <ExerciseHeader
            sectionLetter="A"
            title="Look, read, and circle. Then, write."
            subTitle="Read or listen carefully, then tap the option you would circle on the printed page."
            isReview="true"
          />

          <div className="flex flex-col gap-6">
            {/* 🔤 Word Bank */}
            <div className="CB-r3p1q1-bank" role="group" aria-label="Sentence bank">
              {WORD_BANK.map((word) => (
                <WordChip
                  key={word}
                  word={word}
                  used={answers.includes(word)}
                  selected={selectedWord === word}
                  playing={playingWord === word}
                  dragDisabled={disabled || answers.includes(word)}
                  onActivate={activateWord}
                  onFocusWord={onWordFocus}
                />
              ))}
            </div>

            {/* 🖼️ الصور + الدواير + الخانات */}
            <div
              className="question-grid-CB-review3-p1-q1"
              role="group"
              aria-label="Questions"
            >
              {ITEMS.map((item, i) => {
                const cRes = circleResults[i];
                const sRes = slotResults[i];
                const circleLocked = disabled || cRes === "correct";
                const slotLocked = disabled || sRes === "correct";

                return (
                  <div
                    key={item.id}
                    role="group"
                    aria-label={`Question ${item.id}`}
                    className="question-box-CB-review2-p2-q3"
                  >
                    <div className="img-option-CB-review2-p2-q3">
                      <div className="flex gap-5">
                        <span
                          aria-hidden="true"
                          style={{
                            fontSize: "22px",
                            fontWeight: "600",
                            color: "#1d4f7b",
                          }}
                        >
                          {item.id}
                        </span>
                        <img
                          src={item.img}
                          alt={item.alt}
                          className="q-img-CB-review2-p2-q3"
                          style={{ height: "auto", width: "160px" }}
                          draggable="false"
                        />
                      </div>

                      {/* ⭕ choices */}
                      <div
                        className="choices-CB-review2-p2-q3"
                        role="group"
                        aria-label={`Picture ${item.id}: choose can or can't`}
                      >
                        {CHOICES.map((op) => {
                          const isSel = selected[i] === op;
                          return (
                            <div className="circle-wrapper" key={op}>
                              <CircleChoice
                                op={op}
                                dataKey={`${i}-${op}`}
                                selected={isSel}
                                state={isSel ? cRes : null}
                                locked={circleLocked}
                                playing={playingWord === `${i}-${op}`}
                                ariaLabel={`${op}${isSel ? ", selected" : ""}${
                                  isSel && cRes === "correct"
                                    ? ", correct and locked"
                                    : isSel && cRes === "wrong"
                                      ? ", incorrect, you can change it"
                                      : ""
                                }`}
                                onActivate={() => activateCircle(i, op)}
                                onFocusChoice={(e) => {
                                  if (e.currentTarget.matches(":focus-visible"))
                                    playWord(op, `${i}-${op}`);
                                }}
                              />

                              {showBadges && isSel && cRes === "wrong" && (
                                <div
                                  className="wrong-mark-CB-review3-p1-q1"
                                  aria-hidden="true"
                                >
                                  ✕
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* ✍️ writing slot */}
                    <div className="input-wrapper-CB-review2-p2-q3">
                      <Slot
                        index={i}
                        word={answers[i]}
                        state={sRes}
                        locked={slotLocked}
                        isTarget={Boolean(selectedWord) && !slotLocked}
                        ariaLabel={`Box for picture ${item.id}, ${
                          answers[i] ? `contains ${answers[i]}` : "empty"
                        }${
                          sRes === "correct"
                            ? ", correct and locked"
                            : sRes === "wrong"
                              ? ", incorrect, you can change it"
                              : ""
                        }${
                          selectedWord && !slotLocked
                            ? `. Press Enter to place ${selectedWord}`
                            : answers[i] && !slotLocked
                              ? ". Press Enter to take the sentence back"
                              : ""
                        }`}
                        onActivate={activateSlot}
                      />

                      {showBadges && Boolean(answers[i]) && sRes === "wrong" && (
                        <div
                          className="wrong-mark-CB-review3-p1-q1-2"
                          aria-hidden="true"
                        >
                          ✕
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="action-buttons-container">
          <button type="button" onClick={resetAll} className="try-again-button">
            Start Again ↻
          </button>

          <button
            type="button"
            onClick={showAnswers}
            className="show-answer-btn swal-continue"
          >
            Show Answer
          </button>

          <button type="button" onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>

      <DragOverlay>
        {dragWord ? (
          <span className="CB-r3p1q1-chip CB-r3p1q1-chip-overlay">
            {dragWord}
          </span>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Review3_Page1_Q1;
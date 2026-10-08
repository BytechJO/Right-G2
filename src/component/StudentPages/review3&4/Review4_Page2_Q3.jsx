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

import img1 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 38/Ex F 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 38/Ex F 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 38/Ex F 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 38/Ex F 4.svg";

import lakeAudio from "../../../assets/audio/ClassBook/U 4/Page 37 - F/Item_001_lake.mp3";
import rainAudio from "../../../assets/audio/ClassBook/U 4/Page 37 - F/Item_002_rain.mp3";
import playAudio from "../../../assets/audio/ClassBook/U 4/Page 37 - F/Item_003_play.mp3";
import cakeAudio from "../../../assets/audio/ClassBook/U 4/Page 37 - F/Item_004_cake.mp3";
import ayAudio from "../../../assets/audio/ClassBook/U 4/Page 37 - F/Item_005_ay.mp3";
import aeAudio from "../../../assets/audio/ClassBook/U 4/Page 37 - F/Item_006_a_e.mp3";
import aiAudio from "../../../assets/audio/ClassBook/U 4/Page 37 - F/Item_007_ai.mp3";

import "./Review4_Page2_Q3.css";

/* ================= DATA ================= */

// ⚠️ الـ alt وصف عام بدون الجواب (الكلمة والدايرة هم الجواب).
// الأوصاف تخمين، راجعها مع الصور الفعلية.
const ITEMS = [
  {
    id: 1,
    img: img1,
    alt: "an outdoor scene with water and trees",
    correct: "a_e",
    word: "lake",
    options: ["ay", "a_e"],
  },
  {
    id: 2,
    img: img2,
    alt: "an outdoor scene with a cloudy sky",
    correct: "ai",
    word: "rain",
    options: ["ai", "a_e"],
  },
  {
    id: 3,
    img: img3,
    alt: "a child outdoors doing a fun activity",
    correct: "ay",
    word: "play",
    options: ["ay", "a_e"],
  },
  {
    id: 4,
    img: img4,
    alt: "a sweet food item on a table",
    correct: "a_e",
    word: "cake",
    options: ["a_e", "ai"],
  },
];

// ترتيب البنك مختلف عن ترتيب الأسئلة
const WORD_BANK = [ITEMS[2].word, ITEMS[3].word, ITEMS[0].word, ITEMS[1].word];

const AUDIO = {
  lake: lakeAudio,
  rain: rainAudio,
  play: playAudio,
  cake: cakeAudio,
  ay: ayAudio,
  a_e: aeAudio,
  ai: aiAudio,
};

// قارئ الشاشة ما بيقرأ الـ underscore منيح
const spoken = (op) => (op === "a_e" ? "a e" : op);

const COUNT = ITEMS.length;
const TOTAL = COUNT * 2; // نقطة للدايرة + نقطة للكلمة

const emptyArr = () => Array(COUNT).fill("");
const nullArr = () => Array(COUNT).fill(null);

/* ================= HELPERS / SUB-COMPONENTS (خارج الكومبوننت) ================= */

const pauseOtherAudio = () => {
  document.querySelectorAll("audio").forEach((el) => el.pause());
};

const chipEl = (word) => document.querySelector(`[data-r4p2q3-chip="${word}"]`);
const slotEl = (i) => document.querySelector(`[data-r4p2q3-slot="${i}"]`);

// eslint-disable-next-line react-refresh/only-export-components
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

// 🔤 كلمة بالبنك: زر + قابل للسحب
// eslint-disable-next-line react-refresh/only-export-components
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
      data-r4p2q3-chip={word}
      type="button"
      className={`CB-r4p2q3-chip ${used ? "is-used" : ""} ${
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
        className={`CB-r4p2q3-speaker ${playing ? "playing" : ""}`}
        aria-hidden="true"
      >
        <SpeakerIcon />
      </span>
    </button>
  );
};

// 🧩 خانة الكتابة: زر + هدف إفلات
// eslint-disable-next-line react-refresh/only-export-components
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
      data-r4p2q3-slot={index}
      type="button"
      className={`CB-r4p2q3-slot ${word ? "has-word" : ""} ${
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

// ⭕ دايرة ay / ai / a_e: زر (Tab + Enter + Space + ماوس + لمس)
// eslint-disable-next-line react-refresh/only-export-components
const CircleChoice = ({
  op,
  selected,
  state,
  locked,
  playing,
  ariaLabel,
  onActivate,
  onFocusChoice,
}) => (
  <button
    type="button"
    className={`CB-r4p2q3-circle ${selected ? "active" : ""} ${
      state === "correct" ? "is-correct" : state === "wrong" ? "is-wrong" : ""
    } ${playing ? "is-playing" : ""}`}
    aria-pressed={selected}
    aria-disabled={locked}
    aria-label={ariaLabel}
    onClick={onActivate}
    onFocus={onFocusChoice}
  >
    <span aria-hidden="true">{op}</span>
  </button>
);

const Review4_Page2_Q3 = () => {
  const [selected, setSelected] = useState(emptyArr()); // ay / ai / a_e لكل صورة
  const [answers, setAnswers] = useState(emptyArr()); // الكلمة بكل خانة
  const [circleResults, setCircleResults] = useState(nullArr()); // null | "correct" | "wrong"
  const [slotResults, setSlotResults] = useState(nullArr()); // null | "correct" | "wrong"
  const [selectedWord, setSelectedWord] = useState(null); // كلمة مختارة من البنك
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

  // key = مين اللي عم يشتغل صوته بالواجهة (للدواير: رقم السؤال + الخيار)
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

  /* ================= CIRCLES ================= */

  // كليك / Enter / Space: صوت + اختيار، ونفس الدايرة مرة ثانية = إلغاء الاختيار
  const activateCircle = (i, op) => {
    playWord(op, `${i}-${op}`);

    if (disabled) {
      setMessage(lockedMessage());
      return;
    }

    if (circleResults[i] === "correct") {
      setMessage(`Picture ${i + 1}: ${spoken(selected[i])} is correct and locked.`);
      return;
    }

    const unselect = selected[i] === op;

    setSelected((prev) => prev.map((s, k) => (k === i ? (unselect ? "" : op) : s)));
    setCircleResults((prev) => prev.map((r, k) => (k === i ? null : r)));
    setMessage(
      unselect
        ? `Picture ${i + 1}: ${spoken(op)} unselected.`
        : `Picture ${i + 1}: ${spoken(op)} selected.`,
    );
  };

  /* ================= WORD BANK ================= */

  const activateWord = (word, viaKeyboard) => {
    playWord(word);

    if (disabled) {
      setMessage(lockedMessage());
      return;
    }

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
      // ⬆️ المؤشر بيرجع على الكلمة الجاية المتاحة بالبنك
      const nextWord = WORD_BANK.find((w) => !newAnswers.includes(w));

      if (nextWord) {
        focusChip(nextWord);
        setMessage(
          `${word} placed in box ${slot + 1}. Back in the word bank, on ${nextWord}`,
        );
      } else {
        focusSlot(slot);
        setMessage(`${word} placed in box ${slot + 1}. All words are placed.`);
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

    setMessage("Select a word first, then choose a box.");
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

    // طول ما في كلمة مختارة: Tab بيلف بين الفراغات المتاحة بس
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
      const msg = "Please choose a spelling for all the pictures before checking!";
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
      slotResults[i] === "correct" || answers[i] === item.word
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
        `Picture ${i + 1}: circle ${spoken(selected[i])} ${
          newCircle[i] === "correct" ? "correct" : "incorrect"
        }, word ${newSlots[i] === "correct" ? "correct" : "incorrect"}`,
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
    setAnswers(ITEMS.map((i) => i.word));
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
            sectionLetter="F"
            title="Circle and write."
            subTitle="Read or listen carefully, then tap the option you would circle on the printed page."
            isReview="true"
          />

          <div className="flex flex-col gap-6">
            {/* 🔤 Word Bank */}
            <div className="CB-r4p2q3-bank" role="group" aria-label="Word bank">
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
              className="CB-r4p2q3-grid"
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
                    className="CB-r4p2q3-question"
                  >
                    <div className="CB-r4p2q3-row">
                      <div className="CB-r4p2q3-pic">
                        <span className="CB-r4p2q3-num" aria-hidden="true">
                          {item.id}
                        </span>
                        <img
                          src={item.img}
                          alt={item.alt}
                          className="CB-r4p2q3-img"
                          draggable="false"
                        />
                      </div>

                      {/* ⭕ choices */}
                      <div
                        className="CB-r4p2q3-choices"
                        role="group"
                        aria-label={`Picture ${item.id}: choose the spelling`}
                      >
                        {item.options.map((op) => {
                          const isSel = selected[i] === op;
                          return (
                            <div className="CB-r4p2q3-circle-wrap" key={op}>
                              <CircleChoice
                                op={op}
                                selected={isSel}
                                state={isSel ? cRes : null}
                                locked={circleLocked}
                                playing={playingWord === `${i}-${op}`}
                                ariaLabel={`${spoken(op)}${isSel ? ", selected" : ""}${
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
                                  className="CB-r4p2q3-wrong CB-r4p2q3-wrong-circle"
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
                    <div className="CB-r4p2q3-slot-wrap">
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
                              ? ". Press Enter to take the word back"
                              : ""
                        }`}
                        onActivate={activateSlot}
                      />

                      {showBadges && Boolean(answers[i]) && sRes === "wrong" && (
                        <div
                          className="CB-r4p2q3-wrong CB-r4p2q3-wrong-slot"
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
          <span className="CB-r4p2q3-chip CB-r4p2q3-chip-overlay">
            {dragWord}
          </span>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Review4_Page2_Q3;
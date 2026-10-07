/* eslint-disable react-refresh/only-export-components */
import React, { useState, useRef, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  pointerWithin,
  rectIntersection,
} from "@dnd-kit/core";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import img1 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 19/Ex G 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 19/Ex G 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 19/Ex G 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 19/Ex G 4.svg";
import sound1 from "../../../assets/audio/ClassBook/U 2/cd14pg19-instruction3-adult-lady_dY76oeaM.mp3";

import catAudio from "../../../assets/audio/ClassBook/U 2/Page 19 - G/cat.mp3";
import boxAudio from "../../../assets/audio/ClassBook/U 2/Page 19 - G/box.mp3";
import clockAudio from "../../../assets/audio/ClassBook/U 2/Page 19 - G/clock.mp3";
import queenAudio from "../../../assets/audio/ClassBook/U 2/Page 19 - G/queen.mp3";

import "./Review2_Page2_Q3.css";

/* ================= DATA ================= */

const stopAtSecond = 3.5;

const captions = [
  { start: 0.52, end: 5.0, text: "Page 19, review 2. Exercise G." },
  { start: 6.06, end: 8.38, text: "Listen, circle, and write." },
  { start: 9.54, end: 10.94, text: "1, cat." },
  { start: 11.98, end: 13.66, text: "2, box." },
  { start: 14.84, end: 16.48, text: "3, clock." },
  { start: 17.5, end: 19.04, text: "4, queen." },
];

// ⚠️ alt وصف عام بدون اسم الشي (لأنو اسمه بيكشف الجواب) وأنا ما شفت الصور، فتأكدي منه
const ITEMS = [
  {
    id: 1,
    img: img1,
    alt: "a small furry pet with whiskers and a tail",
    correct: "c",
    options: ["c", "q"],
    word: "cat",
    audio: catAudio,
  },
  {
    id: 2,
    img: img2,
    alt: "a square container with a lid",
    correct: "-x",
    options: ["-ck", "-x"],
    word: "box",
    audio: boxAudio,
  },
  {
    id: 3,
    img: img3,
    alt: "a round object with two hands that shows the time",
    correct: "-ck",
    options: ["-ck", "-x"],
    word: "clock",
    audio: clockAudio,
  },
  {
    id: 4,
    img: img4,
    alt: "a woman wearing a crown and a long dress",
    correct: "q",
    options: ["c", "q"],
    word: "queen",
    audio: queenAudio,
  },
];

// ترتيب البنك مختلف عن ترتيب الأسئلة (عشان الترتيب ما يكشف الجواب)
const WORD_BANK = [3, 0, 2, 1].map((i) => ({
  id: ITEMS[i].id,
  text: ITEMS[i].word,
  audio: ITEMS[i].audio,
}));

const COUNT = ITEMS.length;
const TOTAL = COUNT * 2; // خيار + كلمة لكل صورة

const emptyArr = () => Array(COUNT).fill("");
const nullArr = () => Array(COUNT).fill(null);

/* ================= HELPERS / SUB-COMPONENTS (خارج الكومبوننت) ================= */

const pauseOtherAudio = () => {
  document.querySelectorAll("audio").forEach((el) => el.pause());
};

const chipEl = (id) => document.querySelector(`[data-r2q3chip="${id}"]`);
const slotEl = (i) => document.querySelector(`[data-r2q3slot="${i}"]`);

// المؤشر فوق الفراغ أولاً، وإلا تقاطع المستطيلات
const collision = (args) => {
  const hits = pointerWithin(args);
  return hits.length ? hits : rectIntersection(args);
};

// "-ck" بيتقرأ "ending dash c k" و"c" بيتقرأ "letter c"
const say = (o) =>
  o.startsWith("-")
    ? `ending dash ${o.slice(1).split("").join(" ")}`
    : `letter ${o}`;

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
    id: `bank-${word.id}`,
    data: { word },
    disabled: dragDisabled,
  });

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      data-r2q3chip={word.id}
      type="button"
      className={`CB-r2p2q3-chip ${used ? "is-used" : ""} ${
        selected ? "is-selected" : ""
      } ${playing ? "is-playing" : ""} ${isDragging ? "is-dragging" : ""}`}
      aria-pressed={selected}
      aria-disabled={used}
      aria-label={
        used
          ? `${word.text}, already used`
          : selected
            ? `${word.text}, selected. Press Enter on a box to place it`
            : `${word.text}. Press Enter to select, then choose a box`
      }
      onClick={() => onActivate(word)}
      onFocus={(e) => onFocusWord(e, word)}
    >
      <span aria-hidden="true">{word.text}</span>
      <span
        className={`CB-r2p2q3-speaker ${playing ? "playing" : ""}`}
        aria-hidden="true"
      >
        <SpeakerIcon />
      </span>
    </button>
  );
};

// 🧩 فراغ الكلمة: زر + هدف إفلات
const Slot = ({
  index,
  text,
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
      data-r2q3slot={index}
      type="button"
      className={`CB-r2p2q3-slot ${text ? "has-word" : ""} ${
        state === "correct" ? "is-correct" : state === "wrong" ? "is-wrong" : ""
      } ${isTarget ? "is-target" : ""} ${isOver ? "is-over" : ""}`}
      aria-disabled={locked}
      aria-label={ariaLabel}
      onClick={() => onActivate(index)}
    >
      <span aria-hidden="true">{text}</span>
    </button>
  );
};

const Review2_Page2_Q3 = () => {
  const [selected, setSelected] = useState(emptyArr()); // الخيار المختار لكل صورة
  const [answers, setAnswers] = useState(emptyArr()); // الكلمة بكل فراغ
  const [optionRes, setOptionRes] = useState(nullArr()); // null | "correct" | "wrong"
  const [wordRes, setWordRes] = useState(nullArr());
  const [selectedWord, setSelectedWord] = useState(null); // كلمة مختارة من البنك
  const [dragWord, setDragWord] = useState(null);
  const [finished, setFinished] = useState(false); // كل شي صح بعد Check
  const [answerShown, setAnswerShown] = useState(false);
  const [message, setMessage] = useState("");
  const [playingId, setPlayingId] = useState(null);

  const audioRef = useRef(null);
  const tokenRef = useRef(0); // بيلغي أي تشغيل معلّق
  const skipSoundRef = useRef(false); // 🔇 لما نرجّع الفوكس برمجياً ما نشغّل الصوت

  const disabled = finished || answerShown;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 5 },
    }),
  );

  const lockedMessage = () =>
    answerShown
      ? "Correct answers are shown. Press Start Again to try again."
      : "All answers are correct and locked.";

  /* ================= FOCUS ================= */

  // رجوع الفوكس لكلمة بالبنك بدون صوت
  const focusChip = (id) => {
    requestAnimationFrame(() => {
      const el = chipEl(id);
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
    const open = ITEMS.map((_, i) => i).filter((i) => wordRes[i] !== "correct");
    return open.find((i) => !answers[i]) ?? open[0] ?? null;
  };

  /* ================= AUDIO ================= */

  const stopSound = () => {
    tokenRef.current += 1;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingId(null);
  };

  // تشغيل (أو إعادة تشغيل من الأول) بدون تداخل مع أي صوت ثاني
  const playWord = (word) => {
    if (!word?.audio) return;

    stopSound();
    pauseOtherAudio();

    const token = tokenRef.current;
    const audio = new Audio(word.audio);
    audioRef.current = audio;
    setPlayingId(word.id);

    audio.onended = () => {
      if (token === tokenRef.current) setPlayingId(null);
    };
    audio.onerror = () => {
      if (token === tokenRef.current) setPlayingId(null);
    };
    audio.play().catch(() => {
      if (token === tokenRef.current) setPlayingId(null);
    });
  };

  // لو اشتغل أي صوت ثاني بالصفحة (مشغّل التعليمات) نوقف صوتنا، وعند الخروج من الصفحة نوقف كل شي
  useEffect(() => {
    const onOtherPlay = (e) => {
      if (e.target !== audioRef.current) {
        tokenRef.current += 1;
        audioRef.current?.pause();
        setPlayingId(null);
      }
    };

    document.addEventListener("play", onOtherPlay, true);

    return () => {
      document.removeEventListener("play", onOtherPlay, true);
      tokenRef.current += 1;
      audioRef.current?.pause();
    };
  }, []);

  /* ================= OPTIONS (c / q / -ck / -x) ================= */

  // اختيار وإلغاء اختيار: كبسة على نفس الخيار بتلغيه
  const selectOption = (i, option) => {
    if (disabled) {
      setMessage(lockedMessage());
      return;
    }

    if (optionRes[i] === "correct") {
      setMessage(`Picture ${i + 1} choice is correct and locked.`);
      return;
    }

    const same = selected[i] === option;

    setSelected((prev) =>
      prev.map((v, idx) => (idx === i ? (same ? "" : option) : v)),
    );
    // تعديل إجابة غلط: بيشيل علامة الغلط
    setOptionRes((prev) => prev.map((r, idx) => (idx === i ? null : r)));

    setMessage(
      same
        ? `Picture ${i + 1}: ${say(option)} deselected.`
        : `Picture ${i + 1}: ${say(option)} selected.`,
    );
  };

  /* ================= WORD BANK ================= */

  // فوكس بالتاب = شغّل الصوت (الماوس/اللمس بيروحوا على onClick)
  const onWordFocus = (e, word) => {
    if (skipSoundRef.current) {
      skipSoundRef.current = false;
      return;
    }
    if (e.currentTarget.matches(":focus-visible")) playWord(word);
  };

  // كليك / Enter / Space على كلمة: صوت + اختيار + المؤشر بينزل على الفراغات
  const activateWord = (word) => {
    playWord(word);

    if (disabled) return;

    if (answers.includes(word.text)) {
      setMessage(
        `${word.text} is already in a box. Press that box to take it back.`,
      );
      return;
    }

    if (selectedWord?.id === word.id) {
      setSelectedWord(null);
      setMessage(`${word.text} unselected.`);
      return;
    }

    setSelectedWord(word);

    const target = firstOpenSlot();
    if (target !== null) focusSlot(target);

    setMessage(
      `${word.text} selected. Press Tab to move between the boxes, Enter to place it, Escape to cancel.`,
    );
  };

  /* ================= SLOTS ================= */

  const placeWord = (slot, word, moveFocus = true) => {
    if (disabled) return;

    if (wordRes[slot] === "correct") {
      setMessage(`Box ${slot + 1} is correct and locked.`);
      return;
    }

    const old = answers.indexOf(word.text);

    const newAnswers = answers.map((a, i) =>
      i === slot ? word.text : i === old ? "" : a,
    );

    setAnswers(newAnswers);
    setWordRes((prev) =>
      prev.map((r, i) => (i === slot || i === old ? null : r)),
    );
    setSelectedWord(null);

    if (!moveFocus) {
      setMessage(`${word.text} placed in box ${slot + 1}.`);
      return;
    }

    // ⬆️ المؤشر بيرجع على الكلمة الجاية المتاحة بالبنك
    const next = WORD_BANK.find((w) => !newAnswers.includes(w.text));

    if (next) {
      focusChip(next.id);
      setMessage(
        `${word.text} placed in box ${slot + 1}. Back in the word bank, on ${next.text}.`,
      );
    } else {
      focusSlot(slot);
      setMessage(`${word.text} placed in box ${slot + 1}. All words are placed.`);
    }
  };

  const returnWord = (slot) => {
    const text = answers[slot];
    const word = WORD_BANK.find((w) => w.text === text);

    setAnswers((prev) => prev.map((a, i) => (i === slot ? "" : a)));
    setWordRes((prev) => prev.map((r, i) => (i === slot ? null : r)));
    setMessage(`${text} returned to the word bank.`);

    if (word) focusChip(word.id);
  };

  const activateSlot = (slot) => {
    if (disabled) {
      setMessage(lockedMessage());
      return;
    }

    if (wordRes[slot] === "correct") {
      setMessage(`Box ${slot + 1} is correct and locked.`);
      return;
    }

    if (selectedWord) {
      placeWord(slot, selectedWord);
      return;
    }

    if (answers[slot]) {
      returnWord(slot);
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
      setMessage(`${word.text} unselected.`);
      focusChip(word.id);
      return;
    }

    if (e.key !== "Tab") return;

    // طول ما في كلمة مختارة: Tab بيلف بين الفراغات المتاحة بس
    const targets = ITEMS.map((_, i) => i).filter(
      (i) => wordRes[i] !== "correct",
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
      const msg = "Please choose a circle for all pictures!";
      ValidationAlert.info("Oops!", msg);
      setMessage(msg);
      return;
    }

    if (answers.some((a) => a === "")) {
      const msg = "Please fill in all the writing boxes!";
      ValidationAlert.info("Oops!", msg);
      setMessage(msg);
      return;
    }

    stopSound();

    // الصح القديم بيضل مقفول، والباقي بينقيّم
    const newOption = ITEMS.map((item, i) =>
      optionRes[i] === "correct" || selected[i] === item.correct
        ? "correct"
        : "wrong",
    );

    const newWord = ITEMS.map((item, i) =>
      wordRes[i] === "correct" || answers[i] === item.word
        ? "correct"
        : "wrong",
    );

    const score =
      newOption.filter((r) => r === "correct").length +
      newWord.filter((r) => r === "correct").length;

    setOptionRes(newOption);
    setWordRes(newWord);
    setSelectedWord(null);

    if (score === TOTAL) setFinished(true);

    // 🔊 فيدباك مسموع لكل صورة: الخيار + الكلمة
    const details = ITEMS.map(
      (item, i) =>
        `Picture ${item.id}: ${say(selected[i])} ${
          newOption[i] === "correct" ? "correct" : "incorrect"
        }, word ${answers[i]} ${
          newWord[i] === "correct" ? "correct" : "incorrect"
        }`,
    ).join(". ");

    setMessage(
      `Score ${score} out of ${TOTAL}. ${details}.${
        score < TOTAL
          ? " Correct answers are locked. Fix the ones marked with a cross, then press Check Answer again."
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
    setOptionRes(nullArr());
    setWordRes(nullArr());
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
    setOptionRes(nullArr());
    setWordRes(nullArr());
    setSelectedWord(null);
    setDragWord(null);
    setFinished(false);
    setAnswerShown(false);
    setMessage("Exercise reset. All circles, answers, results and score are cleared.");
  };

  /* ================= RENDER ================= */

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collision}
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
          style={{ marginBottom: "35px" }}
          onKeyDown={onAreaKeyDown}
        >
          <ExerciseHeader
            sectionLetter="G"
            title="Listen, circle, and write."
            subTitle="Read or listen carefully, then tap the option you would circle on the printed page."
            isReview="true"
          />
        <QuestionAudioPlayer
            src={sound1}
            captions={captions}
            stopAtSecond={stopAtSecond}
            pageId={"sb-review2-page2-q3"}
          />

          {/* 🔤 Word Bank */}
          <div
            className="CB-r2p2q3-bank"
            role="group"
            aria-label="Word bank"
            aria-describedby="r2p2q3-help"
          >
            {WORD_BANK.map((word) => (
              <WordChip
                key={word.id}
                word={word}
                used={answers.includes(word.text)}
                selected={selectedWord?.id === word.id}
                playing={playingId === word.id}
                dragDisabled={disabled || answers.includes(word.text)}
                onActivate={activateWord}
                onFocusWord={onWordFocus}
              />
            ))}
          </div>

          {/* 🖼️ الأسئلة */}
          <div className="CB-r2p2q3-grid" role="group" aria-label="Questions">
            {ITEMS.map((item, i) => {
              const oRes = optionRes[i];
              const wRes = wordRes[i];
              const slotLocked = disabled || wRes === "correct";
              const showBadges = !answerShown;

              return (
                <div
                  key={item.id}
                  role="group"
                  aria-label={`Question ${item.id}`}
                  className="CB-r2p2q3-card"
                >
                  <div className="CB-r2p2q3-top">
                    <span className="CB-r2p2q3-num" aria-hidden="true">
                      {item.id}
                    </span>
                    <img
                      src={item.img}
                      alt={item.alt}
                      className="CB-r2p2q3-img"
                      draggable="false"
                    />
                  </div>

                  {/* الخيارات */}
                  <div
                    className="CB-r2p2q3-options"
                    role="group"
                    aria-label={`Picture ${item.id}: choose the correct answer`}
                  >
                    {item.options.map((option) => {
                      const isSel = selected[i] === option;
                      const state = isSel && oRes ? oRes : "";

                      return (
                        <div key={option} className="CB-r2p2q3-option-wrap">
                          <button
                            type="button"
                            className={`CB-r2p2q3-option ${
                              isSel ? "is-selected" : ""
                            } ${
                              state === "correct"
                                ? "is-correct"
                                : state === "wrong"
                                  ? "is-wrong"
                                  : ""
                            }`}
                            aria-pressed={isSel}
                            aria-disabled={disabled || oRes === "correct"}
                            aria-label={`${say(option)}${
                              isSel && oRes === "correct"
                                ? ", correct and locked"
                                : isSel && oRes === "wrong"
                                  ? ", incorrect, you can change it"
                                  : isSel
                                    ? ", selected. Press again to deselect"
                                    : ""
                            }`}
                            onClick={() => selectOption(i, option)}
                          >
                            <span aria-hidden="true">{option}</span>
                          </button>

                          {showBadges && isSel && oRes && (
                            <span
                              className={`CB-r2p2q3-badge ${oRes}`}
                              aria-hidden="true"
                            >
                              {oRes === "correct" ? "" : "✕"}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* فراغ الكلمة */}
                  <div className="CB-r2p2q3-slot-wrap">
                    <Slot
                      index={i}
                      text={answers[i]}
                      state={wRes}
                      locked={slotLocked}
                      isTarget={Boolean(selectedWord) && !slotLocked}
                      ariaLabel={`Box for picture ${item.id}, ${
                        answers[i] ? `contains ${answers[i]}` : "empty"
                      }${
                        wRes === "correct"
                          ? ", correct and locked"
                          : wRes === "wrong"
                            ? ", incorrect, you can change it"
                            : ""
                      }${
                        selectedWord && !slotLocked
                          ? `. Press Enter to place ${selectedWord.text}`
                          : answers[i] && !slotLocked
                            ? ". Press Enter to take the word back"
                            : ""
                      }`}
                      onActivate={activateSlot}
                    />

                    {showBadges && answers[i] && wRes && (
                      <span
                        className={`CB-r2p2q3-badge ${wRes}`}
                        aria-hidden="true"
                      >
                        {wRes === "correct" ? "" : "✕"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="action-buttons-container">
            <button
              type="button"
              onClick={resetAll}
              className="try-again-button"
            >
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
              aria-disabled={disabled}
              style={
                disabled ? {cursor: "defualt" } : undefined
              }
            >
              Check Answer ✓
            </button>
          </div>
        </div>
      </div>

      <DragOverlay>
        {dragWord ? (
          <span className="CB-r2p2q3-chip CB-r2p2q3-chip-overlay">
            {dragWord.text}
          </span>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Review2_Page2_Q3;
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
} from "@dnd-kit/core";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import img1 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 17/Ex F 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 17/Ex F 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 17/Ex F 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 17/Ex F 4.svg";

import lambAudio from "../../../assets/audio/ClassBook/U 2/Page 17 - F/lamb.mp3";
import rabbitAudio from "../../../assets/audio/ClassBook/U 2/Page 17 - F/rabbit.mp3";
import redAudio from "../../../assets/audio/ClassBook/U 2/Page 17 - F/red.mp3";
import runAudio from "../../../assets/audio/ClassBook/U 2/Page 17 - F/run.mp3";

import "./Review1_Page2_Q4.css";

/* ================= DATA ================= */

// الـ alt وصف عام بدون اسم الشي (لأنو اسمه بيكشف الحرف الأول)
const ITEMS = [
  {
    id: 1,
    img: img1,
    alt: "a tube of paint squeezed out onto the ground",
    correct: "r",
    correctInput: "red",
    option: ["r", "c", "l", "q"],
  },
  {
    id: 2,
    img: img2,
    alt: "a small brown animal with long ears, hopping",
    correct: "r",
    correctInput: "rabbit",
    option: ["l", "r", "c", "q"],
  },
  {
    id: 3,
    img: img3,
    alt: "a girl in a green shirt moving fast on her feet",
    correct: "r",
    correctInput: "run",
    option: ["j", "l", "c", "r"],
  },
  {
    id: 4,
    img: img4,
    alt: "a baby farm animal with fluffy white wool",
    correct: "l",
    correctInput: "lamb",
    option: ["r", "o", "l", "m"],
  },
];

const WORD_BANK = ["rabbit", "lamb", "red", "run"];

const WORD_AUDIO = {
  red: redAudio,
  rabbit: rabbitAudio,
  run: runAudio,
  lamb: lambAudio,
};

const COUNT = ITEMS.length;
const TOTAL = COUNT * 2; // حرف + كلمة لكل صورة

const emptyArr = () => Array(COUNT).fill("");
const nullArr = () => Array(COUNT).fill(null);

/* ================= HELPERS / SUB-COMPONENTS (خارج الكومبوننت) ================= */

const pauseOtherAudio = () => {
  document.querySelectorAll("audio").forEach((el) => el.pause());
};

const chipEl = (word) => document.querySelector(`[data-chip="${word}"]`);
const slotEl = (i) => document.querySelector(`[data-slot="${i}"]`);

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
    id: `bank-${word}`,
    data: { word },
    disabled: dragDisabled,
  });

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      data-chip={word}
      type="button"
      className={`CB-r1p2q4-chip ${used ? "is-used" : ""} ${
        selected ? "is-selected" : ""
      } ${playing ? "is-playing" : ""} ${isDragging ? "is-dragging" : ""}`}
      aria-pressed={selected}
      aria-disabled={used}
      aria-label={
        used
          ? `${word}, already used`
          : selected
            ? `${word}, selected. Press Enter on a box to place it`
            : `${word}. Press Enter to select, then choose a box`
      }
      // e.detail === 0 يعني الضغط جاي من الكيبورد (Enter / Space)
      onClick={(e) => onActivate(word, e.detail === 0)}
      onFocus={(e) => onFocusWord(e, word)}
    >
      <span aria-hidden="true">{word}</span>
      <span
        className={`CB-r1p2q4-speaker ${playing ? "playing" : ""}`}
        aria-hidden="true"
      >
        <SpeakerIcon />
      </span>
    </button>
  );
};

// 🧩 خانة الكلمة: زر + هدف إفلات
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
      data-slot={index}
      type="button"
      className={`CB-r1p2q4-slot ${word ? "has-word" : ""} ${
        state === "correct" ? "is-correct" : state === "wrong" ? "is-wrong" : ""
      } ${isTarget ? "is-target" : ""} ${isOver ? "is-over" : ""}`}
      aria-disabled={locked}
      aria-label={ariaLabel}
      onClick={(e) => onActivate(index, e.detail === 0)}
    >
      <span aria-hidden="true">{word}</span>
    </button>
  );
};

const Review1_Page2_Q4 = () => {
  const [selected, setSelected] = useState(emptyArr()); // الحرف المختار لكل صورة
  const [answers, setAnswers] = useState(emptyArr()); // الكلمة بكل خانة
  const [circleRes, setCircleRes] = useState(nullArr()); // null | "correct" | "wrong"
  const [wordRes, setWordRes] = useState(nullArr());
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
    setPlayingWord(null);
  };

  // تشغيل (أو إعادة تشغيل من الأول) بدون تداخل مع أي صوت ثاني
  const playWord = (word) => {
    const src = WORD_AUDIO[word];
    if (!src) return;

    stopSound();
    pauseOtherAudio();

    const token = tokenRef.current;
    const audio = new Audio(src);
    audioRef.current = audio;
    setPlayingWord(word);

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

  /* ================= WORD BANK ================= */

  // فوكس بالتاب = شغّل الصوت (الماوس/اللمس بيروحوا على onClick)
  const onWordFocus = (e, word) => {
    if (skipSoundRef.current) {
      skipSoundRef.current = false;
      return;
    }
    if (e.currentTarget.matches(":focus-visible")) playWord(word);
  };

  // كليك / Enter / Space على كلمة: صوت + اختيار
  const activateWord = (word, viaKeyboard) => {
    playWord(word);

    if (disabled) return;

    if (answers.includes(word)) {
      setMessage(
        `${word} is already in a box. Press that box to take it back.`,
      );
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
        `${word} selected. Press Tab to move between the boxes, Enter to place it, Escape to cancel.`,
      );
    } else {
      setMessage(`${word} selected. Choose a box to place it.`);
    }
  };

  /* ================= SLOTS ================= */

  const placeWord = (slot, word, viaKeyboard) => {
    if (disabled) return;

    if (wordRes[slot] === "correct") {
      setMessage(`Box ${slot + 1} is correct and locked.`);
      return;
    }

    const old = answers.indexOf(word);

    const newAnswers = answers.map((a, i) =>
      i === slot ? word : i === old ? "" : a,
    );

    setAnswers(newAnswers);
    setWordRes((prev) =>
      prev.map((r, i) => (i === slot || i === old ? null : r)),
    );
    setSelectedWord(null);

    if (viaKeyboard) {
      // ⬆️ المؤشر بيرجع على الكلمة الجاية المتاحة بالبنك
      const nextWord = WORD_BANK.find((w) => !newAnswers.includes(w));

      if (nextWord) {
        focusChip(nextWord);
        setMessage(
          `${word} placed in box ${slot + 1}. Back in the word bank, on ${nextWord}.`,
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
    setWordRes((prev) => prev.map((r, i) => (i === slot ? null : r)));
    setMessage(`${word} returned to the word bank.`);

    if (viaKeyboard) focusChip(word);
  };

  const activateSlot = (slot, viaKeyboard) => {
    if (disabled) {
      setMessage(lockedMessage());
      return;
    }

    if (wordRes[slot] === "correct") {
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

  /* ================= LETTER CHOICES ================= */

  const selectLetter = (i, letter) => {
    if (disabled) {
      setMessage(lockedMessage());
      return;
    }

    if (circleRes[i] === "correct") {
      setMessage(`Picture ${i + 1} letter is correct and locked.`);
      return;
    }

    setSelected((prev) => prev.map((v, idx) => (idx === i ? letter : v)));
    setCircleRes((prev) => prev.map((r, idx) => (idx === i ? null : r)));
    setMessage(`Picture ${i + 1}: letter ${letter} selected.`);
  };

  /* ================= CHECK ================= */

  const checkAnswers = () => {
    // بعد Show Answer أو بعد ما كل شي صح: ما في شي نعمله
    if (disabled) return;

    if (selected.some((s) => s === "")) {
      const msg = "Please choose a letter for all pictures!";
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
    const newCircle = ITEMS.map((item, i) =>
      circleRes[i] === "correct" || selected[i] === item.correct
        ? "correct"
        : "wrong",
    );

    const newWord = ITEMS.map((item, i) =>
      wordRes[i] === "correct" || answers[i] === item.correctInput
        ? "correct"
        : "wrong",
    );

    const score =
      newCircle.filter((r) => r === "correct").length +
      newWord.filter((r) => r === "correct").length;

    setCircleRes(newCircle);
    setWordRes(newWord);
    setSelectedWord(null);

    if (score === TOTAL) setFinished(true);

    // فيدباك لكل صورة
    const details = ITEMS.map(
      (item, i) =>
        `Picture ${i + 1}: letter ${selected[i]} ${
          newCircle[i] === "correct" ? "correct" : "incorrect"
        }, word ${answers[i]} ${
          newWord[i] === "correct" ? "correct" : "incorrect"
        }`,
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
    setAnswers(ITEMS.map((i) => i.correctInput));
    setCircleRes(ITEMS.map(() => "correct"));
    setWordRes(ITEMS.map(() => "correct"));
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
    setCircleRes(nullArr());
    setWordRes(nullArr());
    setSelectedWord(null);
    setDragWord(null);
    setFinished(false);
    setAnswerShown(false);
    setMessage("Exercise reset. All answers are cleared.");
  };

  /* ================= RENDER ================= */

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
            sectionLetter="F"
            title="Tap or click the letters, drag and drop to make the word."
            subTitle="Tap a word to listen, then drag it or press Enter on a box to place it."
            isReview="true"
          />

          <p id="r1p2q4-help" className="sr-only">
            For each picture, choose the first letter. Then press Tab to move
            through the word bank. When a word is focused, its sound plays.
            Press Enter or Space to select a word, and the focus moves to the
            boxes. Press Tab to move between the boxes and Enter to place the
            word, then the focus returns to the word bank. Press Escape to
            cancel. Press a box that has a word to take the word back. After
            checking, correct answers are locked and wrong answers can be
            changed.
          </p>

          {/* 🔤 Word Bank */}
          <div
            className="CB-r1p2q4-bank"
            role="group"
            aria-label="Word bank"
            aria-describedby="r1p2q4-help"
          >
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

          {/* 🖼️ الأسئلة */}
          <div className="CB-r1p2q4-grid" role="group" aria-label="Questions">
            {ITEMS.map((item, i) => {
              const cRes = circleRes[i];
              const wRes = wordRes[i];
              const slotLocked = disabled || wRes === "correct";
              const showBadges = !answerShown;

              return (
                <div
                  key={item.id}
                  role="group"
                  aria-label={`Question ${item.id}`}
                  className="CB-r1p2q4-card"
                >
                  <span className="CB-r1p2q4-num" aria-hidden="true">
                    {item.id}
                  </span>

                  <img
                    src={item.img}
                    alt={item.alt}
                    className="CB-r1p2q4-img"
                    draggable="false"
                  />

                  {/* حروف */}
                  <div
                    className="CB-r1p2q4-letters"
                    role="group"
                    aria-label={`Picture ${item.id}: choose the first letter`}
                  >
                    {item.option.map((letter) => {
                      const isSel = selected[i] === letter;
                      const state = isSel && cRes ? cRes : "";

                      return (
                        <div key={letter} className="CB-r1p2q4-letter-wrap">
                          <button
                            type="button"
                            className={`CB-r1p2q4-letter ${
                              isSel ? "is-selected" : ""
                            } ${
                              state === "correct"
                                ? "is-correct"
                                : state === "wrong"
                                  ? "is-wrong"
                                  : ""
                            }`}
                            aria-pressed={isSel}
                            aria-disabled={disabled || cRes === "correct"}
                            aria-label={`Letter ${letter}${
                              isSel && cRes === "correct"
                                ? ", correct and locked"
                                : isSel && cRes === "wrong"
                                  ? ", incorrect, you can change it"
                                  : ""
                            }`}
                            onClick={() => selectLetter(i, letter)}
                          >
                            <span aria-hidden="true">{letter}</span>
                          </button>

                          {showBadges && isSel && cRes && (
                            <span
                              className={`CB-r1p2q4-badge ${cRes}`}
                              aria-hidden="true"
                            >
                              {cRes === "correct" ? "" : "✕"}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* خانة الكلمة */}
                  <div className="CB-r1p2q4-slot-wrap">
                    <Slot
                      index={i}
                      word={answers[i]}
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
                          ? `. Press Enter to place ${selectedWord}`
                          : answers[i] && !slotLocked
                            ? ". Press Enter to take the word back"
                            : ""
                      }`}
                      onActivate={activateSlot}
                    />

                    {showBadges && answers[i] && wRes && (
                      <span
                        className={`CB-r1p2q4-badge ${wRes}`}
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
              className="show-answer-btn"
            >
              Show Answer
            </button>
            <button
              type="button"
              onClick={checkAnswers}
              className="check-button2"
            >
              Check Answer ✓
            </button>
          </div>
        </div>
      </div>

      <DragOverlay>
        {dragWord ? (
          <span className="CB-r1p2q4-chip CB-r1p2q4-chip-overlay">
            {dragWord}
          </span>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Review1_Page2_Q4;

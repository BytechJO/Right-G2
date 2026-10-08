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

import img1 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 33/Ex E 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 33/Ex E 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 33/Ex E 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 33/Ex E 4.svg";
import img5 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 33/Ex E 5.svg";
import img6 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 33/Ex E 6.svg";
import img7 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 33/Ex E 7.svg";
import img8 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 33/Ex E 8.svg";
import img9 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 33/Ex E 9.svg";

import clerkAudio from "../../../assets/audio/ClassBook/U 4/Page 33 - E/clerk.mp3";
import farmerAudio from "../../../assets/audio/ClassBook/U 4/Page 33 - E/farmer.mp3";
import mechanicAudio from "../../../assets/audio/ClassBook/U 4/Page 33 - E/mechanic.mp3";
import nurseAudio from "../../../assets/audio/ClassBook/U 4/Page 33 - E/nurse.mp3";
import photographerAudio from "../../../assets/audio/ClassBook/U 4/Page 33 - E/photographer.mp3";
import pilotAudio from "../../../assets/audio/ClassBook/U 4/Page 33 - E/pilot.mp3";
import policeOfficerAudio from "../../../assets/audio/ClassBook/U 4/Page 33 - E/police officer.mp3";
import taxiDriverAudio from "../../../assets/audio/ClassBook/U 4/Page 33 - E/taxi driver.mp3";
import vetAudio from "../../../assets/audio/ClassBook/U 4/Page 33 - E/vet.mp3";

import "./Unit4_Page6_Q2.css";

/* ================= DATA ================= */

// ⚠️ الـ alt وصف عام بدون اسم المهنة (لأنو اسمها هو الجواب).
// الأوصاف تخمين من الجواب، راجعها مع الصور الفعلية وعدّلها.
const ITEMS = [
  {
    id: 1,
    img: img1,
    alt: "a person in work clothes fixing the engine of a car",
    correct: "mechanic",
  },
  {
    id: 2,
    img: img2,
    alt: "a person holding a camera and taking a picture",
    correct: "photographer",
  },
  {
    id: 3,
    img: img3,
    alt: "a person in a white coat looking after a dog or a cat",
    correct: "vet",
  },
  {
    id: 4,
    img: img4,
    alt: "a person in a uniform caring for a sick person in a hospital",
    correct: "nurse",
  },
  {
    id: 5,
    img: img5,
    alt: "a person in a uniform and hat standing in the street, helping keep people safe",
    correct: "police officer",
  },
  {
    id: 6,
    img: img6,
    alt: "a person working outside on a farm with crops or animals",
    correct: "farmer",
  },
  {
    id: 7,
    img: img7,
    alt: "a person in a uniform and hat sitting at the controls of an aeroplane",
    correct: "pilot",
  },
  {
    id: 8,
    img: img8,
    alt: "a person driving a yellow car and taking passengers to places",
    correct: "taxi driver",
  },
  {
    id: 9,
    img: img9,
    alt: "a person behind a counter in a shop, helping customers pay",
    correct: "clerk",
  },
];

// ترتيب البنك مختلف عن ترتيب الأجوبة
const WORD_BANK = [
  "pilot",
  "farmer",
  "vet",
  "nurse",
  "clerk",
  "photographer",
  "police officer",
  "mechanic",
  "taxi driver",
];

const WORD_AUDIO = {
  clerk: clerkAudio,
  farmer: farmerAudio,
  mechanic: mechanicAudio,
  nurse: nurseAudio,
  photographer: photographerAudio,
  pilot: pilotAudio,
  "police officer": policeOfficerAudio,
  "taxi driver": taxiDriverAudio,
  vet: vetAudio,
};

const COUNT = ITEMS.length;

const emptyArr = () => Array(COUNT).fill("");
const nullArr = () => Array(COUNT).fill(null);

/* ================= HELPERS / SUB-COMPONENTS (خارج الكومبوننت) ================= */

const pauseOtherAudio = () => {
  document.querySelectorAll("audio").forEach((el) => el.pause());
};

const chipEl = (word) => document.querySelector(`[data-u4p6q2-chip="${word}"]`);
const slotEl = (i) => document.querySelector(`[data-u4p6q2-slot="${i}"]`);

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
      data-u4p6q2-chip={word}
      type="button"
      className={`CB-u4p6q2-chip ${used ? "is-used" : ""} ${
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
        className={`CB-u4p6q2-speaker ${playing ? "playing" : ""}`}
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
  showMark,
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
      data-u4p6q2-slot={index}
      type="button"
      className={`q-input-CB-review2-p1-q2 CB-u4p6q2-slot ${
        word ? "has-word" : ""
      } ${
        state === "correct" ? "is-correct" : state === "wrong" ? "is-wrong" : ""
      } ${isTarget ? "is-target" : ""} ${isOver ? "drag-over-cell" : ""}`}
      aria-disabled={locked}
      aria-label={ariaLabel}
      onClick={(e) => onActivate(index, e.detail === 0)}
    >
      <span aria-hidden="true">{word}</span>

      {showMark && (
        <span className="error-mark-input-CB-review2-p1-q2" aria-hidden="true">
          ✕
        </span>
      )}
    </button>
  );
};

const Unit4_Page6_Q2 = () => {
  const [answers, setAnswers] = useState(emptyArr()); // الكلمة بكل خانة
  const [results, setResults] = useState(nullArr()); // null | "correct" | "wrong"
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
    const open = ITEMS.map((_, i) => i).filter((i) => results[i] !== "correct");
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
        `${word} selected. Press Tab to move between the boxes, Enter or Space to place it, Escape to cancel.`,
      );
    } else {
      setMessage(`${word} selected. Choose a box to place it.`);
    }
  };

  /* ================= SLOTS ================= */

  const placeWord = (slot, word, viaKeyboard) => {
    if (disabled) return;

    if (results[slot] === "correct") {
      setMessage(`Box ${slot + 1} is correct and locked.`);
      return;
    }

    const old = answers.indexOf(word);

    const newAnswers = answers.map((a, i) =>
      i === slot ? word : i === old ? "" : a,
    );

    setAnswers(newAnswers);
    setResults((prev) =>
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
    setResults((prev) => prev.map((r, i) => (i === slot ? null : r)));
    setMessage(`${word} returned to the word bank.`);

    if (viaKeyboard) focusChip(word);
  };

  const activateSlot = (slot, viaKeyboard) => {
    if (disabled) {
      setMessage(lockedMessage());
      return;
    }

    if (results[slot] === "correct") {
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
      (i) => results[i] !== "correct",
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

    if (answers.some((a) => a === "")) {
      const msg = "Please fill in all the boxes before checking!";
      ValidationAlert.info("Oops!", msg);
      setMessage(msg);
      return;
    }

    stopSound();

    // الصح القديم بيضل مقفول، والباقي بينقيّم
    const newResults = ITEMS.map((item, i) =>
      results[i] === "correct" || answers[i] === item.correct
        ? "correct"
        : "wrong",
    );

    const score = newResults.filter((r) => r === "correct").length;

    setResults(newResults);
    setSelectedWord(null);

    if (score === COUNT) setFinished(true);

    // فيدباك لكل صورة
    const details = ITEMS.map(
      (_, i) =>
        `Picture ${i + 1}: ${answers[i]} ${
          newResults[i] === "correct" ? "correct" : "incorrect"
        }`,
    ).join(". ");

    setMessage(
      `Score ${score} out of ${COUNT}. ${details}.${
        score < COUNT
          ? " Correct answers are locked. Fix the ones marked with a cross."
          : ""
      }`,
    );

    const color = score === COUNT ? "green" : score === 0 ? "red" : "orange";

    ValidationAlert[
      score === COUNT ? "success" : score === 0 ? "error" : "warning"
    ](
      `<div style="font-size:20px;text-align:center">
        <b style="color:${color}">Score: ${score} / ${COUNT}</b>
      </div>`,
    );
  };

  /* ================= SHOW ANSWER ================= */

  const showAnswers = () => {
    stopSound();
    setAnswers(ITEMS.map((i) => i.correct));
    setResults(ITEMS.map(() => "correct"));
    setSelectedWord(null);
    setFinished(false);
    setAnswerShown(true);
    setMessage("Correct answers are shown.");
  };

  /* ================= START AGAIN ================= */

  const resetAll = () => {
    stopSound();
    pauseOtherAudio();
    setAnswers(emptyArr());
    setResults(nullArr());
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
        className="question-wrapper-unit3-page6-q1"
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
          style={{ gap: "20px", marginBottom: "40px" }}
          onKeyDown={onAreaKeyDown}
        >
          <ExerciseHeader
            sectionLetter="E"
            title="Label the pictures with the words from the box."
            subTitle="Match each clue first, then drag the item to its correct target and check the snap position."
          />

          {/* 🔤 Word Bank */}
          <div
            className="CB-u4p6q2-bank"
            role="group"
            aria-label="Word bank"
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

          {/* 🖼️ الصور + الخانات */}
          <div
            className="row-content10-CB-unit4-p6-q2"
            role="group"
            aria-label="Questions"
          >
            {ITEMS.map((item, i) => {
              const res = results[i];
              const slotLocked = disabled || res === "correct";

              return (
                <div
                  key={item.id}
                  role="group"
                  aria-label={`Question ${item.id}`}
                  className="row2-CB-review2-p1-q2"
                >
                  <img
                    src={item.img}
                    alt={item.alt}
                    style={{ height: "130px", width: "130px" }}
                    draggable="false"
                  />

                  <Slot
                    index={i}
                    word={answers[i]}
                    state={res}
                    locked={slotLocked}
                    isTarget={Boolean(selectedWord) && !slotLocked}
                    showMark={showBadges && Boolean(answers[i]) && res === "wrong"}
                    ariaLabel={`Box for picture ${item.id}, ${
                      answers[i] ? `contains ${answers[i]}` : "empty"
                    }${
                      res === "correct"
                        ? ", correct and locked"
                        : res === "wrong"
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
                </div>
              );
            })}
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
          <span className="CB-u4p6q2-chip CB-u4p6q2-chip-overlay">
            {dragWord}
          </span>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Unit4_Page6_Q2;
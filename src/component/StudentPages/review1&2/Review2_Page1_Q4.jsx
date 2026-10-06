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

import img from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page18/Ex D 1.svg";

import treeAudio from "../../../assets/audio/ClassBook/U 2/Page 18 - D/ElevenLabs_2026-08-13T09_07_39_Tala - Warm, Polished, and Scratchy_pvc_sp88_s75_sb100_se73_b_m2.mp3";
import flowersAudio from "../../../assets/audio/ClassBook/U 2/Page 18 - D/Those are flowers..mp3";
import duckAudio from "../../../assets/audio/ClassBook/U 2/Page 18 - D/That is a duck..mp3";
import birdAudio from "../../../assets/audio/ClassBook/U 2/Page 18 - D/This is a bird..mp3";

import "./Review2_Page1_Q4.css";

/* ================= DATA ================= */

// ⚠️ ترتيب الصوت: سميت الملفات حسب أسمائها (duck = "That is a duck..mp3")
// وملف ElevenLabs افترضت إنو "That is a tree". اسمعيهم وتأكدي.
const ITEMS = [
  { id: 1, correct: "That is a duck.", audio: duckAudio },
  { id: 2, correct: "Those are flowers.", audio: flowersAudio },
  { id: 3, correct: "That is a tree.", audio: treeAudio },
  { id: 4, correct: "This is a bird.", audio: birdAudio },
];

// ترتيب البنك مختلف عن ترتيب الإجابات (عشان الترتيب ما يكشف الجواب)
const WORD_BANK = [2, 3, 1, 0].map((i) => ({
  id: i,
  text: ITEMS[i].correct,
  audio: ITEMS[i].audio,
}));

const COUNT = ITEMS.length;

const emptyArr = () => Array(COUNT).fill("");
const nullArr = () => Array(COUNT).fill(null);

/* ================= HELPERS / SUB-COMPONENTS (خارج الكومبوننت) ================= */

const pauseOtherAudio = () => {
  document.querySelectorAll("audio").forEach((el) => el.pause());
};

const chipEl = (id) => document.querySelector(`[data-r2chip="${id}"]`);
const slotEl = (i) => document.querySelector(`[data-r2slot="${i}"]`);

// المؤشر فوق الفراغ أولاً، وإلا تقاطع المستطيلات
const collision = (args) => {
  const hits = pointerWithin(args);
  return hits.length ? hits : rectIntersection(args);
};

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
    id: `bank-${word.id}`,
    data: { word },
    disabled: dragDisabled,
  });

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      data-r2chip={word.id}
      type="button"
      className={`CB-r2p1q4-chip ${used ? "is-used" : ""} ${
        selected ? "is-selected" : ""
      } ${playing ? "is-playing" : ""} ${isDragging ? "is-dragging" : ""}`}
      aria-pressed={selected}
      aria-disabled={used}
      aria-label={
        used
          ? `${word.text} Already used`
          : selected
            ? `${word.text} Selected. Press Enter on a box to place it`
            : `${word.text} Press Enter to select, then choose a box`
      }
      onClick={() => onActivate(word)}
      onFocus={(e) => onFocusWord(e, word)}
    >
      <span aria-hidden="true">{word.text}</span>
      <span
        className={`CB-r2p1q4-speaker ${playing ? "playing" : ""}`}
        aria-hidden="true"
      >
        <SpeakerIcon />
      </span>
    </button>
  );
};

// 🧩 فراغ: زر + هدف إفلات
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
      data-r2slot={index}
      type="button"
      className={`CB-r2p1q4-slot ${text ? "has-word" : ""} ${
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

const Review2_Page1_Q4 = () => {
  const [answers, setAnswers] = useState(emptyArr()); // الجملة بكل فراغ
  const [results, setResults] = useState(nullArr()); // null | "correct" | "wrong"
  const [selectedWord, setSelectedWord] = useState(null); // جملة مختارة من البنك
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

  // رجوع الفوكس لجملة بالبنك بدون صوت
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

  // لو اشتغل أي صوت ثاني بالصفحة نوقف صوتنا، وعند الخروج من الصفحة نوقف كل شي
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

  /* ================= WORD BANK ================= */

  // فوكس بالتاب = شغّل الصوت (الماوس/اللمس بيروحوا على onClick)
  const onWordFocus = (e, word) => {
    if (skipSoundRef.current) {
      skipSoundRef.current = false;
      return;
    }
    if (e.currentTarget.matches(":focus-visible")) playWord(word);
  };

  // كليك / Enter / Space على جملة: صوت + اختيار + المؤشر بينزل على الفراغات
  const activateWord = (word) => {
    playWord(word);

    if (disabled) return;

    if (answers.includes(word.text)) {
      setMessage("That sentence is already in a box. Press the box to take it back.");
      return;
    }

    if (selectedWord?.id === word.id) {
      setSelectedWord(null);
      setMessage("Sentence unselected.");
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

    if (results[slot] === "correct") {
      setMessage(`Box ${slot + 1} is correct and locked.`);
      return;
    }

    const old = answers.indexOf(word.text);

    const newAnswers = answers.map((a, i) =>
      i === slot ? word.text : i === old ? "" : a,
    );

    setAnswers(newAnswers);
    setResults((prev) =>
      prev.map((r, i) => (i === slot || i === old ? null : r)),
    );
    setSelectedWord(null);

    if (!moveFocus) {
      setMessage(`${word.text} placed in box ${slot + 1}.`);
      return;
    }

    // ⬆️ المؤشر بيرجع على الجملة الجاية المتاحة بالبنك
    const next = WORD_BANK.find((w) => !newAnswers.includes(w.text));

    if (next) {
      focusChip(next.id);
      setMessage(
        `${word.text} placed in box ${slot + 1}. Back in the word bank.`,
      );
    } else {
      focusSlot(slot);
      setMessage(`${word.text} placed in box ${slot + 1}. All sentences are placed.`);
    }
  };

  const returnWord = (slot) => {
    const text = answers[slot];
    const word = WORD_BANK.find((w) => w.text === text);

    setAnswers((prev) => prev.map((a, i) => (i === slot ? "" : a)));
    setResults((prev) => prev.map((r, i) => (i === slot ? null : r)));
    setMessage(`${text} returned to the word bank.`);

    if (word) focusChip(word.id);
  };

  const activateSlot = (slot) => {
    if (disabled) {
      setMessage(lockedMessage());
      return;
    }

    if (results[slot] === "correct") {
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

    setMessage("Select a sentence first, then choose a box.");
  };

  /* ================= KEYBOARD: Tab بين الفراغات + Escape ================= */

  const onAreaKeyDown = (e) => {
    if (!selectedWord || disabled) return;

    if (e.key === "Escape") {
      e.preventDefault();
      const word = selectedWord;
      setSelectedWord(null);
      setMessage("Selection cancelled.");
      focusChip(word.id);
      return;
    }

    if (e.key !== "Tab") return;

    // طول ما في جملة مختارة: Tab بيلف بين الفراغات المتاحة بس
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
      const msg = "Please fill in all the boxes!";
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

    const correct = newResults.filter((r) => r === "correct").length;

    setResults(newResults);
    setSelectedWord(null);

    if (correct === COUNT) setFinished(true);

    // فيدباك لكل سؤال
    const details = ITEMS.map(
      (item, i) =>
        `Box ${i + 1}: ${newResults[i] === "correct" ? "correct" : "incorrect"}`,
    ).join(". ");

    setMessage(
      `Score ${correct} out of ${COUNT}. ${details}.${
        correct < COUNT
          ? " Correct answers are locked. Fix the boxes marked with a cross."
          : ""
      }`,
    );

    const color = correct === COUNT ? "green" : correct === 0 ? "red" : "orange";

    ValidationAlert[
      correct === COUNT ? "success" : correct === 0 ? "error" : "warning"
    ](
      `<div style="font-size:20px;text-align:center">
        <b style="color:${color}">Score: ${correct} / ${COUNT}</b>
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
            sectionLetter="D"
            title="Look, drag, and drop the words."
            subTitle="Tap a sentence to listen, then drag it or press Enter on a box to place it."
            isReview="true"
          />

          <p id="r2p1q4-help" className="sr-only">
            Look at the picture. Press Tab to move through the sentences in the
            word bank. When a sentence is focused, its sound plays. Press Enter
            or Space to select a sentence, and the focus moves to the boxes.
            Press Tab to move between the boxes and Enter to place the sentence,
            then the focus returns to the word bank. Press Escape to cancel.
            Press a box that has a sentence to take it back. After checking,
            correct answers are locked and wrong answers can be changed.
          </p>

          {/* 🔤 Word Bank */}
          <div
            className="CB-r2p1q4-bank"
            role="group"
            aria-label="Word bank"
            aria-describedby="r2p1q4-help"
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

          {/* 🖼️ الفراغات + الصورة */}
          <div className="CB-r2p1q4-body">
            {/* ⚠️ عدّلي الوصف ليطابق الصورة (قريب/بعيد مهم لـ this/that/these/those) */}
            <img
              src={img}
              className="CB-r2p1q4-img"
              alt="A park scene with a bird, a duck, a tree and some flowers"
              draggable="false"
            />
            <div className="CB-r2p1q4-rows" role="group" aria-label="Answer boxes">
              {ITEMS.map((item, i) => {
                const res = results[i];
                const slotLocked = disabled || res === "correct";

                return (
                  <div key={item.id} className="CB-r2p1q4-row">
                    <span className="CB-r2p1q4-num" aria-hidden="true">
                      {item.id}.
                    </span>

                    <div className="CB-r2p1q4-slot-wrap">
                      <Slot
                        index={i}
                        text={answers[i]}
                        state={res}
                        locked={slotLocked}
                        isTarget={Boolean(selectedWord) && !slotLocked}
                        ariaLabel={`Box ${item.id}, ${
                          answers[i] ? `contains ${answers[i]}` : "empty"
                        }${
                          res === "correct"
                            ? ", correct and locked"
                            : res === "wrong"
                              ? ", incorrect, you can change it"
                              : ""
                        }${
                          selectedWord && !slotLocked
                            ? `. Press Enter to place ${selectedWord.text}`
                            : answers[i] && !slotLocked
                              ? ". Press Enter to take it back"
                              : ""
                        }`}
                        onActivate={activateSlot}
                      />

                      {!answerShown && answers[i] && res === "wrong" && (
                        <span className="CB-r2p1q4-badge" aria-hidden="true">
                          ✕
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            
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
                disabled ? { opacity: 0.5, cursor: "not-allowed" } : undefined
              }
            >
              Check Answer ✓
            </button>
          </div>
        </div>
      </div>

      <DragOverlay>
        {dragWord ? (
          <span className="CB-r2p1q4-chip CB-r2p1q4-chip-overlay">
            {dragWord.text}
          </span>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Review2_Page1_Q4;
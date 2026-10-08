import React, { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";

// 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";

// ⚠️ أسماء الملفات من 007 لـ 015 كانت مقطوعة بالسكرين شوت، تأكد منها
import yellowSound from "../../../assets/audio/ClassBook/U 4/Page 35 - F/Item_001_yellow.mp3";
import jamSound from "../../../assets/audio/ClassBook/U 4/Page 35 - F/Item_002_jam.mp3";
import jacketSound from "../../../assets/audio/ClassBook/U 4/Page 35 - F/Item_003_jacket.mp3";
import jetSound from "../../../assets/audio/ClassBook/U 4/Page 35 - F/Item_004_jet.mp3";
import yoyoSound from "../../../assets/audio/ClassBook/U 4/Page 35 - F/Item_005_yo-yo.mp3";
import yogurtSound from "../../../assets/audio/ClassBook/U 4/Page 35 - F/Item_006_yogurt.mp3";

import s7 from "../../../assets/audio/ClassBook/U 4/Page 35 - F/Item_007_Her_favorite_color_is.mp3";
import s8 from "../../../assets/audio/ClassBook/U 4/Page 35 - F/Item_008_She_likes_a_lot_of.mp3";
import s9 from "../../../assets/audio/ClassBook/U 4/Page 35 - F/Item_009_on_her_bread.mp3";
import s10 from "../../../assets/audio/ClassBook/U 4/Page 35 - F/Item_010_He_puts_on_a.mp3";
import s11 from "../../../assets/audio/ClassBook/U 4/Page 35 - F/Item_011_because_it_is_cold_outside.mp3";
import s12 from "../../../assets/audio/ClassBook/U 4/Page 35 - F/Item_012_My_dad_is_a_pilot_and_flies_in_a.mp3";
import s13 from "../../../assets/audio/ClassBook/U 4/Page 35 - F/Item_013_He_played_with_the.mp3";
import s14 from "../../../assets/audio/ClassBook/U 4/Page 35 - F/Item_014_We_eat.mp3";
import s15 from "../../../assets/audio/ClassBook/U 4/Page 35 - F/Item_015_with_our_meat_and_rice.mp3";

import "./Review3_Page2_Q2.css";
import ExerciseHeader from "../../ExerciseHeader";

// 🔊 false = الصوت ما يشتغل لما الطالب يوقف على الكلمة بالتاب، بس بالكليك / Enter / Space
const PLAY_ON_FOCUS = false;

/* ================= DATA ================= */

// الكلمات (بترتيب الأجوبة)
const WORDS = [
  { id: "w1", text: "yellow", audio: yellowSound },
  { id: "w2", text: "jam", audio: jamSound },
  { id: "w3", text: "jacket", audio: jacketSound },
  { id: "w4", text: "jet", audio: jetSound },
  { id: "w5", text: "yo-yo", audio: yoyoSound },
  { id: "w6", text: "yogurt", audio: yogurtSound },
];

const questions = [
  {
    before: "Her favorite color is",
    beforeAudio: s7,
    after: ".",
    wordId: "w1",
  },
  {
    before: "She likes a lot of",
    beforeAudio: s8,
    after: "on her bread.",
    afterAudio: s9,
    wordId: "w2",
  },
  {
    before: "He puts on a",
    beforeAudio: s10,
    after: "because it is cold outside.",
    afterAudio: s11,
    wordId: "w3",
  },
  {
    before: "My dad is a pilot and flies in a",
    beforeAudio: s12,
    after: ".",
    wordId: "w4",
  },
  {
    before: "He played with the",
    beforeAudio: s13,
    after: ".",
    wordId: "w5",
  },
  {
    before: "We eat",
    beforeAudio: s14,
    after: "with our meat and rice.",
    afterAudio: s15,
    wordId: "w6",
  },
];

// ترتيب البنك مختلف عن ترتيب الأسئلة
const wordBank = ["w3", "w5", "w1", "w6", "w2", "w4"].map((id) =>
  WORDS.find((w) => w.id === id),
);

const wordById = Object.fromEntries(WORDS.map((w) => [w.id, w]));

// مفاتيح الخانات: رقم الجملة ("0".."5")
const blankKeys = questions.map((_, i) => String(i));

const answerOf = Object.fromEntries(
  questions.map((q, i) => [String(i), q.wordId]),
);

const emptyAnswers = () => Object.fromEntries(blankKeys.map((k) => [k, ""]));
const noLocks = () => Object.fromEntries(blankKeys.map((k) => [k, false]));

const total = blankKeys.length;

// وصف الجملة لقارئ الشاشة (الفراغ = blank)
const sentenceLabel = (q) =>
  `${q.before} blank ${q.after}`.replace(/\s+\./g, ".");

const feedbackText = (result) =>
  result === "correct" ? "Correct!" : "Not quite. Try again.";

// ستايل الكلمة المختارة / الي صوتها شغّال
const highlightStyle = {
  outline: "2px solid #2c5287",
  outlineOffset: "2px",
  borderRadius: "10px",
};

// ستايل الخانات المسموح الإسقاط عليها
const validTargetStyle = {
  outline: "2px dashed #2c5287",
  outlineOffset: "2px",
  borderRadius: "8px",
};

// زر شفاف يغطي العنصر (للكيبورد وقارئ الشاشة فقط)
const overlayButtonStyle = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  background: "transparent",
  border: 0,
  padding: 0,
  margin: 0,
  borderRadius: "inherit",
  pointerEvents: "none", // الماوس واللمس بيروحوا للعنصر الأب (سحب + كليك)
};

const focusRingClass =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c5287] focus-visible:ring-offset-2";

// eslint-disable-next-line react-refresh/only-export-components
const SpeakerIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    aria-hidden="true"
    style={{
      position: "absolute",
      top: "-6px",
      right: "-6px",
      background: "white",
      borderRadius: "50%",
    }}
  >
    <path
      fill="currentColor"
      d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"
    />
  </svg>
);

const Review3_Page2_Q2 = () => {
  const [answers, setAnswers] = useState(emptyAnswers);

  // 🔒 الخانات الصح بعد Check بتنقفل
  const [lockedBlanks, setLockedBlanks] = useState(noLocks);

  // ✕ الخانات الغلط (الكلمة بتضل بمكانها والطالب بيقدر يعدّلها)
  const [wrongInputs, setWrongInputs] = useState([]);

  // 🔒 بعد Show Answer كل شي مقفول
  const [showAnswered, setShowAnswered] = useState(false);

  // الكلمة المختارة (اختار الكلمة ثم اختار الخانة)
  const [selectedWord, setSelectedWord] = useState(null);

  // الكلمة الي عم تنسحب
  const [draggingWord, setDraggingWord] = useState(null);

  // 📢 رسالة لقارئ الشاشة
  const [message, setMessage] = useState("");

  const wordRefs = useRef({});
  const blankRefs = useRef({});

  const isComplete = blankKeys.every((k) => lockedBlanks[k]);
  const allLocked = showAnswered || isComplete;
  const activeWord = selectedWord || draggingWord;
  const usedIds = Object.values(answers);

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioOwner = useRef({}).current;
  const [activeId, setActiveId] = useState(null);

  const stopAudio = () => stopGlobalAudio(audioOwner);

  const playAudio = (src, id) => {
    if (!src) {
      stopGlobalAudio();
      setActiveId(null);
      return;
    }

    playGlobalAudio(src, {
      owner: audioOwner,
      onFinish: () => setActiveId((prev) => (prev === id ? null : prev)),
    });

    setActiveId(id);
  };

  const playWordAudio = (id) => playAudio(wordById[id]?.audio, `word-${id}`);

  useEffect(() => () => stopGlobalAudio(audioOwner), [audioOwner]);

  /* =====================================================
     FOCUS HELPERS
  ===================================================== */

  const focusWord = (id) => {
    requestAnimationFrame(() => wordRefs.current[id]?.focus());
  };

  const focusBlank = (key) => {
    requestAnimationFrame(() => blankRefs.current[key]?.focus());
  };

  // أول خانة مسموح الإسقاط عليها (فاضية أولاً)
  const firstTargetBlank = () =>
    blankKeys.find((k) => answers[k] === "" && !lockedBlanks[k]) ||
    blankKeys.find((k) => !lockedBlanks[k]);

  /* =====================================================
     SELECT WORD (كليك / لمس / Enter / Space)
  ===================================================== */

  const activateWord = (id, viaKeyboard = false) => {
    playWordAudio(id); // الصوت دايماً بالكليك

    if (allLocked || usedIds.includes(id)) return;

    // نفس الكلمة مرة ثانية = إلغاء الاختيار
    if (selectedWord === id) {
      setSelectedWord(null);
      setMessage(`${wordById[id].text} deselected.`);
      return;
    }

    setSelectedWord(id);

    setMessage(
      `${wordById[id].text} selected. Choose a blank to place it. Press Escape to cancel.`,
    );

    if (viaKeyboard) {
      const target = firstTargetBlank();
      if (target) focusBlank(target);
    }
  };

  const cancelSelection = () => {
    if (!selectedWord) return;
    setMessage(`${wordById[selectedWord].text} deselected.`);
    setSelectedWord(null);
  };

  // 🔊 الصوت لما الطالب يوقف على الكلمة بالتاب (مطفي حالياً)
  const handleWordFocus = (e, id) => {
    if (!PLAY_ON_FOCUS) return;
    if (!e.currentTarget.matches(":focus-visible")) return;
    playWordAudio(id);
  };

  // الأسهم: تنقل بين الكلمات
  const handleWordKeyDown = (e, id) => {
    const i = wordBank.findIndex((w) => w.id === id);
    let next = null;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      next = wordBank[(i + 1) % wordBank.length].id;
    }

    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      next = wordBank[(i - 1 + wordBank.length) % wordBank.length].id;
    }

    if (next) {
      e.preventDefault();
      wordRefs.current[next]?.focus();
    }
  };

  /* =====================================================
     PLACE / RETURN
  ===================================================== */

  const placeWord = (id, key, viaKeyboard = false) => {
    if (allLocked || lockedBlanks[key]) return;

    const updated = { ...answers };

    // إذا الكلمة بخانة ثانية (غير مقفولة) نشيلها منها
    const oldKey = Object.keys(updated).find(
      (k) => updated[k] === id && !lockedBlanks[k],
    );

    if (oldKey) updated[oldKey] = "";

    // إذا الخانة فيها كلمة تانية، بترجع للبنك تلقائياً
    updated[key] = id;

    setAnswers(updated);

    // نشيل ✕ بس عن الخانات الي تغيّرت
    setWrongInputs((prev) => prev.filter((k) => k !== key && k !== oldKey));

    setSelectedWord(null);

    setMessage(
      `${wordById[id].text} placed in sentence ${blankKeys.indexOf(key) + 1}.`,
    );

    // بالكيبورد: نروح للكلمة الجاية الغير مستخدمة
    if (viaKeyboard) {
      const next = wordBank.find((w) => !Object.values(updated).includes(w.id));
      if (next) focusWord(next.id);
    }
  };

  const returnWord = (key) => {
    const id = answers[key];
    if (!id) return;

    setAnswers((prev) => ({ ...prev, [key]: "" }));
    setWrongInputs((prev) => prev.filter((k) => k !== key));
    setMessage(`${wordById[id].text} returned to the word bank.`);
  };

  /*
    كليك على الخانة:
    - الخانة صح ومقفولة → صوت الكلمة
    - في كلمة مختارة → نحطها
    - ما في كلمة مختارة والخانة فيها كلمة → نرجعها للبنك
  */
  const handleBlankClick = (key, e) => {
    const n = blankKeys.indexOf(key) + 1;

    // 🔊 الجواب الصح (بعد Check أو Show Answer): كليك = صوته
    if (lockedBlanks[key]) {
      const id = answers[key];
      if (id) playAudio(wordById[id]?.audio, `blank-${key}`);
      setMessage(
        showAnswered
          ? `Sentence ${n}: ${wordById[id]?.text}.`
          : `Sentence ${n} is correct and locked. ${wordById[id]?.text}.`,
      );
      return;
    }

    if (allLocked) return;

    if (selectedWord) {
      placeWord(selectedWord, key, e.detail === 0);
      return;
    }

    if (answers[key]) {
      returnWord(key);
    } else {
      setMessage(`Sentence ${n} is empty. Select a word first.`);
    }
  };

  // الأسهم: تنقل بين الخانات
  const handleBlankKeyDown = (e, key) => {
    const i = blankKeys.indexOf(key);
    let next = null;

    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      next = blankKeys[(i + 1) % blankKeys.length];
    }

    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      next = blankKeys[(i - 1 + blankKeys.length) % blankKeys.length];
    }

    if (next) {
      e.preventDefault();
      blankRefs.current[next]?.focus();
    }
  };

  /* =====================================================
     نص عليه صوت (أجزاء الجملة)
  ===================================================== */

  const handleTextKeyDown = (e, src, id) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      playAudio(src, id);
    }
  };

  const handleTextFocus = (e, src, id) => {
    if (!PLAY_ON_FOCUS) return;
    if (!e.currentTarget.matches(":focus-visible")) return;
    playAudio(src, id);
  };

  const renderText = (text, src, id) => {
    if (!src) return <span className="CB-review3-p2-q2-text">{text}</span>;

    const playing = activeId === id;

    return (
      <span
        className={focusRingClass}
        role="button"
        tabIndex={0}
        aria-label={`${text}. Press to listen.`}
        style={{
          position: "relative",
          cursor: "pointer",
          ...(playing ? highlightStyle : {}),
        }}
        onClick={() => playAudio(src, id)}
        onKeyDown={(e) => handleTextKeyDown(e, src, id)}
        onFocus={(e) => handleTextFocus(e, src, id)}
      >
        <span aria-hidden="true">{text}</span>
        {playing && <SpeakerIcon />}
      </span>
    );
  };

  /* =====================================================
     DRAG & DROP (ماوس / لمس)
  ===================================================== */

  const onDragStart = (start) => {
    setDraggingWord(start.draggableId);
    setSelectedWord(null);
    // ما في صوت بالسحب، بس بالكليك
  };

  const onDragEnd = (result) => {
    setDraggingWord(null);

    const { destination, draggableId } = result;

    if (!destination || allLocked) return;
    if (!destination.droppableId.startsWith("slot-")) return;

    // "slot-0" → "0"
    const key = destination.droppableId.replace("slot-", "");

    placeWord(draggableId, key);
  };

  /* =====================================================
     CHECK
     - الصح بينقفل (وبيصير الكليك عليه بيشغّل صوته)
     - الغلط بيضل بمكانه مع ✕ والطالب بيعدّله
  ===================================================== */

  const checkAnswers = () => {
    if (allLocked) return;

    const hasEmpty = blankKeys.some(
      (k) => !lockedBlanks[k] && answers[k] === "",
    );

    if (hasEmpty) {
      ValidationAlert.info(
        "Oops!",
        "Please fill in all the blanks before checking!",
      );
      setMessage("Please fill in all the blanks before checking!");
      return;
    }

    stopAudio();
    setActiveId(null);

    const newLocked = { ...lockedBlanks };
    const wrong = [];
    let score = 0;

    blankKeys.forEach((k) => {
      if (lockedBlanks[k] || answers[k] === answerOf[k]) {
        newLocked[k] = true;
        score++;
      } else {
        wrong.push(k);
      }
    });

    setLockedBlanks(newLocked);
    setWrongInputs(wrong);
    setSelectedWord(null);

    // 🔊 فيدباك مسموع لقارئ الشاشة (لكل جملة + السكور)
    const details = blankKeys
      .map(
        (k, i) =>
          `Sentence ${i + 1}: ${feedbackText(wrong.includes(k) ? "wrong" : "correct")}`,
      )
      .join(" ");

    setMessage(
      score === total
        ? `Score ${score} out of ${total}. ${details} All answers are correct. Press a correct answer to hear it.`
        : `Score ${score} out of ${total}. ${details} Correct answers are locked, press one to hear it. Change the answers marked with a cross, then press Check Answer again.`,
    );

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">Score: ${score} / ${total}</span>
      </div>
    `;

    if (score === total) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showAnswers = () => {
    stopAudio();
    setActiveId(null);

    setAnswers(Object.fromEntries(blankKeys.map((k) => [k, answerOf[k]])));
    setLockedBlanks(Object.fromEntries(blankKeys.map((k) => [k, true])));
    setWrongInputs([]);
    setSelectedWord(null);
    setDraggingWord(null);
    setShowAnswered(true);
    setMessage("Correct answers are shown. Press an answer to hear it.");
  };

  /* =====================================================
     START AGAIN
  ===================================================== */

  const reset = () => {
    stopAudio();
    setActiveId(null);

    setAnswers(emptyAnswers());
    setLockedBlanks(noLocks());
    setWrongInputs([]);
    setSelectedWord(null);
    setDraggingWord(null);
    setShowAnswered(false);
    setMessage("Exercise reset. All answers, feedback and score are cleared.");
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") cancelSelection();
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

        <div className="div-forall" style={{ gap: "20px" }}>
          <ExerciseHeader
            sectionLetter="F"
            title="Read and complete the sentences. Use the words from the box."
            subTitle="Use the picture and word clues, then type the missing word or sentence carefully."
            isReview="true"
          />

          {/* 🔤 WORD BANK */}
          <Droppable
            droppableId="word-bank"
            direction="horizontal"
            isDropDisabled
          >
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                role="group"
                aria-label="Word bank. Press Enter or Space to select a word, then choose a blank."
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  padding: "5px",
                  border: "2px solid #b81212ff",
                  borderRadius: "30px",
                  backgroundColor: "#f9e6dc",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {wordBank.map((w, i) => {
                  const isUsed = usedIds.includes(w.id);
                  const isSelected = selectedWord === w.id;
                  const isPlaying = activeId === `word-${w.id}`;

                  return (
                    <Draggable
                      key={w.id}
                      draggableId={w.id}
                      index={i}
                      isDragDisabled={allLocked || isUsed}
                    >
                      {(provided) => (
                        <span
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="word-item-unit2-p8-q2"
                          /*
                            الفوكس بالكيبورد على الزر الداخلي،
                            مش على الـ drag handle نفسو.
                          */
                          tabIndex={-1}
                          role="presentation"
                          aria-describedby={undefined}
                          onClick={(e) => activateWord(w.id, e.detail === 0)}
                          style={{
                            position: "relative",
                            padding: "7px 14px",
                            borderRadius: "8px",
                            fontWeight: "500",
                            fontSize: "20px",
                            textDecoration: isUsed ? "line-through" : "",
                            opacity: isUsed ? 0.6 : 1,
                            touchAction: "none",
                            cursor:
                              isUsed || allLocked ? "not-allowed" : "grab",
                            ...(isSelected || isPlaying ? highlightStyle : {}),
                            ...provided.draggableProps.style,
                          }}
                        >
                          <span aria-hidden="true">{w.text}</span>

                          {/* زر شفاف للكيبورد وقارئ الشاشة */}
                          <button
                            type="button"
                            ref={(node) => {
                              wordRefs.current[w.id] = node;
                            }}
                            aria-label={`${w.text}${
                              isUsed ? ", already placed" : ""
                            }${isSelected ? ", selected" : ""}`}
                            aria-pressed={isSelected}
                            aria-disabled={isUsed || allLocked}
                            className={focusRingClass}
                            style={overlayButtonStyle}
                            onFocus={(e) => handleWordFocus(e, w.id)}
                            onKeyDown={(e) => handleWordKeyDown(e, w.id)}
                          />

                          {/* 🔊 السبيكر فوق يمين الكلمة */}
                          {isPlaying && <SpeakerIcon />}
                        </span>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* 🧩 SENTENCES */}
          <div className="CB-review3-p2-q2-row-content">
            {questions.map((q, index) => {
              const key = String(index);
              const n = index + 1;
              const locked = lockedBlanks[key];
              const isWrong = wrongInputs.includes(key);
              const isValidTarget =
                Boolean(activeWord) && !allLocked && !locked;
              const word = wordById[answers[key]];
              const slotPlaying = activeId === `blank-${key}`;

              return (
                <div className="CB-review3-p2-q2-row" key={index}>
                  <span>
                    <span className="CB-review3-p2-q2-num" aria-hidden="true">
                      {n}
                    </span>{" "}
                    {renderText(q.before, q.beforeAudio, `before-${index}`)}{" "}
                    <Droppable
                      droppableId={`slot-${key}`}
                      isDropDisabled={allLocked || locked}
                    >
                      {(provided, snapshot) => (
                        <span className="CB-review3-p2-q2-drop-wrapper">
                          <span
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`CB-review3-p2-q2-drop-slot ${
                              isWrong && !showAnswered
                                ? "CB-review3-p2-q2-wrong"
                                : ""
                            } ${
                              locked && word ? "CB-review3-p2-q2-correct" : ""
                            } ${snapshot.isDraggingOver ? "drag-over-cell" : ""}`}
                            onClick={(e) => handleBlankClick(key, e)}
                            style={{
                              position: "relative",
                              cursor: locked
                                ? word
                                  ? "pointer" // 🔊 كليك = صوت
                                  : "default"
                                : allLocked
                                  ? "default"
                                  : "pointer",
                              ...(slotPlaying ? highlightStyle : {}),
                              ...(isValidTarget ? validTargetStyle : {}),
                            }}
                          >
                            <span aria-hidden="true">{word?.text || ""}</span>

                            {provided.placeholder}

                            {/* 🔊 السبيكر لما يشتغل صوت الجواب */}
                            {slotPlaying && <SpeakerIcon />}

                            {/* زر شفاف للكيبورد وقارئ الشاشة */}
                            <button
                              type="button"
                              ref={(node) => {
                                blankRefs.current[key] = node;
                              }}
                              aria-label={`Sentence ${n}: ${sentenceLabel(q)}${
                                word ? `, ${word.text}` : ", empty"
                              }${
                                locked && !showAnswered
                                  ? ", correct and locked. Press to listen"
                                  : locked && showAnswered
                                    ? ". Press to listen"
                                    : isWrong
                                      ? ", incorrect, you can change it"
                                      : ""
                              }${
                                isValidTarget && selectedWord
                                  ? `. Press Enter to place ${wordById[selectedWord].text}`
                                  : ""
                              }`}
                              aria-disabled={(allLocked || locked) && !word}
                              className={focusRingClass}
                              style={overlayButtonStyle}
                              onKeyDown={(e) => handleBlankKeyDown(e, key)}
                            />
                          </span>

                          {/* ✕ جنب الفراغ */}
                          {isWrong && !showAnswered && (
                            <span
                              className="CB-review3-p2-q2-error-mark"
                              aria-hidden="true"
                            >
                              ✕
                            </span>
                          )}
                        </span>
                      )}
                    </Droppable>{" "}
                    {renderText(q.after, q.afterAudio, `after-${index}`)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* الأزرار */}
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
              aria-disabled={allLocked}
              style={allLocked ? { cursor: "not-allowed" } : undefined}
            >
              Check Answer ✓
            </button>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Review3_Page2_Q2;

import React, { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";

// 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";

import img1 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 35/Ex E 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 35/Ex E 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 35/Ex E 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 35/Ex E 4.svg";
import img5 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 35/Ex E 5.svg";
import img6 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 35/Ex E 6.svg";

import sound1 from "../../../assets/audio/ClassBook/U 4/cd25pg35-instruction1-adult-lady_QT1XZDkM.mp3";

import yoyoSound from "../../../assets/audio/ClassBook/U 4/Page 35 - E/Item_001_yo-yo.mp3";
import jamSound from "../../../assets/audio/ClassBook/U 4/Page 35 - E/Item_002_jam.mp3";
import yogurtSound from "../../../assets/audio/ClassBook/U 4/Page 35 - E/Item_003_yogurt.mp3";
import jetSound from "../../../assets/audio/ClassBook/U 4/Page 35 - E/Item_004_jet.mp3";
import jacketSound from "../../../assets/audio/ClassBook/U 4/Page 35 - E/Item_005_jacket.mp3";
import yellowSound from "../../../assets/audio/ClassBook/U 4/Page 35 - E/Item_006_yellow.mp3";

import "./Review3_Page2_Q1.css";
import ExerciseHeader from "../../ExerciseHeader";

// 🔊 true = الصوت يشتغل تلقائياً لما الطالب يوقف على الكلمة بالتاب
const PLAY_ON_FOCUS = false;

/* ================= DATA ================= */

// ⚠️ الـ alt أوصاف عامة بدون اسم الكلمة (لأنو الكلمة هي الجواب).
// الأوصاف تخمين، راجعها مع الصور الفعلية وعدّلها.
const ITEMS = [
  {
    id: 1,
    img: img1,
    alt: "A round toy on a string that goes up and down",
    word: "yo-yo",
    audio: yoyoSound,
  },
  {
    id: 2,
    img: img2,
    alt: "A jar of sweet, sticky fruit spread",
    word: "jam",
    audio: jamSound,
  },
  {
    id: 3,
    img: img3,
    alt: "A small cup of creamy white food with a spoon",
    word: "yogurt",
    audio: yogurtSound,
  },
  {
    id: 4,
    img: img4,
    alt: "A fast aeroplane flying in the sky",
    word: "jet",
    audio: jetSound,
  },
  {
    id: 5,
    img: img5,
    alt: "A warm piece of clothing with sleeves and a zip",
    word: "jacket",
    audio: jacketSound,
  },
  {
    id: 6,
    img: img6,
    alt: "Something bright and sunny in colour",
    word: "yellow",
    audio: yellowSound,
  },
];

// ترتيب البنك مختلف عن ترتيب الصور
const wordBank = [
  ITEMS[4],
  ITEMS[0],
  ITEMS[5],
  ITEMS[1],
  ITEMS[3],
  ITEMS[2],
].map((item) => ({
  id: `w${item.id}`,
  text: item.word,
  audio: item.audio,
}));

const wordById = Object.fromEntries(wordBank.map((w) => [w.id, w]));

// مفاتيح الخانات: رقم الصورة ("0".."5")
const blankKeys = ITEMS.map((_, i) => String(i));

// الجواب الصح لكل خانة (id الكلمة)
const answerOf = Object.fromEntries(
  ITEMS.map((item, i) => [String(i), `w${item.id}`]),
);

const emptyAnswers = () => Object.fromEntries(blankKeys.map((k) => [k, ""]));
const noLocks = () => Object.fromEntries(blankKeys.map((k) => [k, false]));

const total = blankKeys.length;

// 🔊 كلام الكابشنز تبع مشغّل الأسئلة
const stopAtSecond = 8.0;

const captions = [
  {
    start: 0.52,
    end: 8.0,
    text: "Page 35, review 3, exercise E. Look, listen, and write.",
  },
  { start: 8.2, end: 18.08, text: " 1, yo-yo. 2, jam. 3, yogurt. 4, jet." },
  { start: 19.12, end: 20.78, text: "5, jacket." },
  { start: 21.82, end: 23.3, text: "6, yellow." },
];

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

const Review3_Page2_Q1 = () => {
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
    playWordAudio(id); // الصوت دايماً

    if (allLocked || usedIds.includes(id)) return;

    // نفس الكلمة مرة ثانية = إلغاء الاختيار
    if (selectedWord === id) {
      setSelectedWord(null);
      setMessage(`${wordById[id].text} deselected.`);
      return;
    }

    setSelectedWord(id);

    setMessage(
      `${wordById[id].text} selected. Choose a box to place it. Press Escape to cancel.`,
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

  // 🔊 الصوت لما الطالب يوقف على الكلمة بالتاب (مش بالماوس)
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
      `${wordById[id].text} placed in box ${blankKeys.indexOf(key) + 1}.`,
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
    - في كلمة مختارة → نحطها
    - ما في كلمة مختارة والخانة فيها كلمة → نرجعها للبنك
  */
  const handleBlankClick = (key, e) => {
    if (allLocked) return;

    const n = blankKeys.indexOf(key) + 1;

    if (lockedBlanks[key]) {
      setMessage(`Box ${n} is correct and locked.`);
      return;
    }

    if (selectedWord) {
      placeWord(selectedWord, key, e.detail === 0);
      return;
    }

    if (answers[key]) {
      returnWord(key);
    } else {
      setMessage(`Box ${n} is empty. Select a word first.`);
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
     DRAG & DROP (ماوس / لمس)
  ===================================================== */

  const onDragStart = (start) => {
    setDraggingWord(start.draggableId);
    setSelectedWord(null);
    playWordAudio(start.draggableId);
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
     - الصح بينقفل
     - الغلط بيضل بمكانه مع ✕ والطالب بيعدّله
     - السكور بينحسب من كل الخانات
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

    // 🔊 فيدباك مسموع لقارئ الشاشة (لكل صورة + السكور)
    const details = blankKeys
      .map(
        (k, i) =>
          `Picture ${i + 1}: ${feedbackText(wrong.includes(k) ? "wrong" : "correct")}`,
      )
      .join(" ");

    setMessage(
      score === total
        ? `Score ${score} out of ${total}. ${details} All answers are correct.`
        : `Score ${score} out of ${total}. ${details} Correct answers are locked. Change the answers marked with a cross, then press Check Answer again.`,
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
    setMessage("Correct answers are shown.");
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
        className="question-wrapper-unit3-page6-q1"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
          marginBottom: "50px",
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

        <div className="div-forall" style={{ gap: "25px" }}>
         <ExerciseHeader
            sectionLetter="E"
            title="Look, listen, and write."
            subTitle="Use the picture and word clues, then type the missing word or sentence carefully."
            isReview="true"
          />

          <QuestionAudioPlayer
            src={sound1}
            captions={captions}
            stopAtSecond={stopAtSecond}
            pageId={"sb-review3-page2-q1"}
          />

          <div className="flex flex-col gap-10">
            {/* WORD BANK */}
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
                  aria-label="Word bank. Press Enter or Space to select a word, then choose a box."
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "30px",
                    padding: "10px",
                    borderRadius: "10px",
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
                            className="CB-unit2-p6-q2-word"
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
                              background: isUsed ? "#ccc" : "white",
                              opacity: isUsed ? 0.6 : 1,
                              touchAction: "none",
                              cursor:
                                isUsed || allLocked ? "not-allowed" : "grab",
                              ...(isSelected || isPlaying
                                ? highlightStyle
                                : {}),
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

            {/* PICTURES + SLOTS */}
            <div className="row-content10-CB-review3-p2-q1">
              {ITEMS.map((item, index) => {
                const key = String(index);
                const n = index + 1;
                const locked = lockedBlanks[key];
                const isWrong = wrongInputs.includes(key);
                const isValidTarget =
                  Boolean(activeWord) && !allLocked && !locked;
                const word = wordById[answers[key]];

                const aId = `a-${index}`;
                const aPlaying = activeId === aId;

                // ✕ بعد Check بس
                const showMark = !showAnswered && isWrong && Boolean(word);

                // 🔁 زر إعادة صوت الجواب الصح بعد Check / Show Answer
                const showReplay = showAnswered || locked || isWrong;

                return (
                  <div className="row2-CB-review2-p1-q2" key={item.id}>
                    <div className="flex">
                      <span
                        className="text-xl font-bold text-blue-800"
                        aria-hidden="true"
                      >
                        {n}
                      </span>
                      <img
                        src={item.img}
                        alt={`Picture ${n}: ${item.alt}`}
                        style={{ height: "80px", width: "auto" }}
                        draggable="false"
                      />
                    </div>

                    <span className="CB-r3p2q1-field-wrap">
                      <Droppable
                        droppableId={`slot-${key}`}
                        isDropDisabled={allLocked || locked}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`q-input-CB-review3-p2-q1 ${
  locked && word ? "q-input-CB-review3-p2-q1-correct" : ""
} ${snapshot.isDraggingOver ? "drag-over-cell" : ""}`}
                            onClick={(e) => handleBlankClick(key, e)}
                            style={{
                              position: "relative",
                              cursor:
                                allLocked || locked ? "default" : "pointer",
                              ...(isValidTarget ? validTargetStyle : {}),
                            }}
                          >
                            <span aria-hidden="true">{word?.text || ""}</span>

                            {provided.placeholder}

                            {showMark && (
                              <span
                                className="error-mark-input-CB-review2-p1-q2"
                                aria-hidden="true"
                              >
                                ✕
                              </span>
                            )}

                            {/* زر شفاف للكيبورد وقارئ الشاشة */}
                            <button
                              type="button"
                              ref={(node) => {
                                blankRefs.current[key] = node;
                              }}
                              aria-label={`Box for picture ${n}: ${item.alt}${
                                word ? `, contains ${word.text}` : ", empty"
                              }${
                                locked && !showAnswered
                                  ? ", correct and locked"
                                  : isWrong
                                    ? ", incorrect, you can change it"
                                    : ""
                              }${
                                isValidTarget && selectedWord
                                  ? `. Press Enter to place ${wordById[selectedWord].text}`
                                  : ""
                              }`}
                              aria-disabled={allLocked || locked}
                              className={focusRingClass}
                              style={overlayButtonStyle}
                              onKeyDown={(e) => handleBlankKeyDown(e, key)}
                            />
                          </div>
                        )}
                      </Droppable>

                      {/* 🔁 صوت الجواب الصح بعد Check / Show Answer */}
                      {/* {showReplay && (
                        <button
                          type="button"
                          className={`CB-r3p2q1-play ${
                            aPlaying ? "is-playing" : ""
                          } ${focusRingClass}`}
                          aria-label={`Play the correct answer for picture ${n}`}
                          onClick={() => playAudio(item.audio, aId)}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            width="18"
                            height="18"
                            aria-hidden="true"
                          >
                            <path
                              fill="currentColor"
                              d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"
                            />
                          </svg>
                        </button>
                      )} */}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
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
    </DragDropContext>
  );
};

export default Review3_Page2_Q1;
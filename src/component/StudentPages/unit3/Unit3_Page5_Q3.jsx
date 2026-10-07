import React, { useState, useRef, useEffect } from "react";
import img1 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 26/Ex B 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 26/Ex B 2.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";

import sheCanSound from "../../../assets/audio/ClassBook/U 3/Page 26 - B/She can.mp3";
import makeASandwichSound from "../../../assets/audio/ClassBook/U 3/Page 26 - B/make a sandwich.mp3";
import makeSandwichSound from "../../../assets/audio/ClassBook/U 3/Page 26 - B/make - sandwich.mp3";
import heSound from "../../../assets/audio/ClassBook/U 3/Page 26 - B/He.mp3";
import cantFlyAKiteSound from "../../../assets/audio/ClassBook/U 3/Page 26 - B/can't fly a kite.mp3";
import flyKiteSound from "../../../assets/audio/ClassBook/U 3/Page 26 - B/fly - kite.mp3";

import "./Unit3_Page5_Q3.css";
import ExerciseHeader from "../../ExerciseHeader";

// 🔊 true = الصوت يشتغل تلقائياً لما الطالب يوقف على الكلمة/الجملة بالتاب
const PLAY_ON_FOCUS = true;

/* ================= DATA ================= */

// ⚠️ الـ alt مؤقت: عدّليه حسب الصور (بدون ما تكتبي الجواب)
// hintAudio = صوت كلمتين التلميح (make / sandwich)
const questions = [
  {
    img: img1,
    alt: "A girl in a kitchen with bread and food on the table",
    parts: [
      { type: "text", value: "She can", audio: sheCanSound },
      { type: "input", answer: "make a sandwich" },
      { type: "text", value: "." },
    ],
    data: ["make", "sandwich"],
    hintAudio: makeSandwichSound,
  },
  {
    img: img2,
    alt: "A boy standing outside holding a kite",
    parts: [
      { type: "text", value: "He", audio: heSound },
      { type: "input", answer: "can’t fly a kite" },
      { type: "text", value: "." },
    ],
    data: ["fly", "kite"],
    hintAudio: flyKiteSound,
  },
];

const wordBank = [
  { id: "w2", text: "can’t fly a kite", audio: cantFlyAKiteSound },
  { id: "w1", text: "make a sandwich", audio: makeASandwichSound },
];

const wordById = Object.fromEntries(wordBank.map((w) => [w.id, w]));

// مفاتيح الخانات: "صف-جزء" (مثال "0-1")
const blankKeys = questions.flatMap((q, qi) =>
  q.parts
    .map((p, pi) => (p.type === "input" ? `${qi}-${pi}` : null))
    .filter(Boolean),
);

const answerOf = Object.fromEntries(
  questions.flatMap((q, qi) =>
    q.parts
      .map((p, pi) => (p.type === "input" ? [`${qi}-${pi}`, p.answer] : null))
      .filter(Boolean),
  ),
);

const emptyAnswers = () => Object.fromEntries(blankKeys.map((k) => [k, ""]));
const noLocks = () => Object.fromEntries(blankKeys.map((k) => [k, false]));

const total = blankKeys.length;

// وصف الجملة لقارئ الشاشة (الفراغ = blank)
const sentenceLabel = (q) =>
  q.parts.map((p) => (p.type === "text" ? p.value : "blank")).join(" ");

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

const Unit3_Page5_Q3 = () => {
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
      `${wordById[id].text} placed in question ${blankKeys.indexOf(key) + 1}.`,
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
      setMessage(`Question ${n} is correct and locked.`);
      return;
    }

    if (selectedWord) {
      placeWord(selectedWord, key, e.detail === 0);
      return;
    }

    if (answers[key]) {
      returnWord(key);
    } else {
      setMessage(`Question ${n} is empty. Select a phrase first.`);
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
     نص عليه صوت ("She can" / "He" / كلمتين التلميح)
  ===================================================== */

  const playTextAudio = (part, id) => playAudio(part.audio, id);

  const handleTextKeyDown = (e, part, id) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      playTextAudio(part, id);
    }
  };

  const handleTextFocus = (e, part, id) => {
    if (!PLAY_ON_FOCUS) return;
    if (!e.currentTarget.matches(":focus-visible")) return;
    playTextAudio(part, id);
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
    if (!destination.droppableId.startsWith("drop-")) return;

    // "drop-0-1" → "0-1"
    const key = destination.droppableId.replace("drop-", "");

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
        "Please complete all sentences before checking.",
      );
      setMessage("Please complete all sentences before checking.");
      return;
    }

    stopAudio();
    setActiveId(null);

    const newLocked = { ...lockedBlanks };
    const wrong = [];
    let score = 0;

    blankKeys.forEach((k) => {
      if (lockedBlanks[k] || wordById[answers[k]]?.text === answerOf[k]) {
        newLocked[k] = true;
        score++;
      } else {
        wrong.push(k);
      }
    });

    setLockedBlanks(newLocked);
    setWrongInputs(wrong);
    setSelectedWord(null);

    // 🔊 فيدباك مسموع لقارئ الشاشة (لكل سؤال + السكور)
    const details = blankKeys
      .map(
        (k, i) =>
          `Question ${i + 1}: ${feedbackText(wrong.includes(k) ? "wrong" : "correct")}`,
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

    setAnswers(
      Object.fromEntries(
        blankKeys.map((k) => [
          k,
          wordBank.find((w) => w.text === answerOf[k])?.id || "",
        ]),
      ),
    );
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
        style={{ display: "flex", justifyContent: "center", padding: "30px" }}
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

        <div className="div-forall" style={{ gap: "30px" }}>
          <ExerciseHeader
            sectionLetter="B"
            // questionNumber="1"
            title="Look and write."
            subTitle="Start with one picture or phrase, then match it to the partner that means the same thing."
          />

          <div className="flex flex-col gap-5">
            {/* WORD BANK */}
            <Droppable droppableId="word-bank" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="CB-unit2-p6-q2-word-bank mb-0"
                  role="group"
                  aria-label="Word bank. Press Enter or Space to select a phrase, then choose a blank."
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

            {/* QUESTIONS */}
            <div className="CB-review1-p1-q2-content" style={{ gap: "16px" }}>
              {questions.map((q, qIndex) => {
                const hintId = `hint-${qIndex}`;
                const hintPlaying = activeId === hintId;
                const hintPart = { audio: q.hintAudio };

                return (
                  <div key={qIndex} className="CB-unit2-p6-q2-row">
                    <div className="CB-unit2-p6-q2-left-container">
                      <div className="CB-unit2-p6-q2-left">
                        <span
                          className="CB-unit2-p6-q2-index"
                          aria-hidden="true"
                        >
                          {qIndex + 1}
                        </span>
                        <img
                          src={q.img}
                          alt={`Picture ${qIndex + 1}: ${q.alt}`}
                          className="CB-unit3-p5-q3-img"
                        />
                      </div>

                      {/* 🔊 كلمتين التلميح: كليك / Enter / Space بيشغّلوا صوتهم */}
                      <span
                        className={`CB-unit2-p6-q2-textSide ${focusRingClass}`}
                        role="button"
                        tabIndex={0}
                        aria-label={`Question ${qIndex + 1}: ${q.data[0]} and ${q.data[1]}. Press to listen.`}
                        style={{
                          position: "relative",
                          cursor: "pointer",
                          ...(hintPlaying ? highlightStyle : {}),
                        }}
                        onClick={() => playTextAudio(hintPart, hintId)}
                        onKeyDown={(e) =>
                          handleTextKeyDown(e, hintPart, hintId)
                        }
                        onFocus={(e) => handleTextFocus(e, hintPart, hintId)}
                      >
                        <span aria-hidden="true">
                          {`${q.data[0]} /  ${q.data[1]}`}
                        </span>
                        {hintPlaying && <SpeakerIcon />}
                      </span>
                    </div>

                    <div className="CB-unit2-p6-q2-sentence">
                      {q.parts.map((part, pIndex) => {
                        // ========== نص ==========
                        if (part.type === "text") {
                          // نص عليه صوت ("She can" / "He")
                          if (part.audio) {
                            const tid = `text-${qIndex}-${pIndex}`;
                            const playing = activeId === tid;

                            return (
                              <span
                                key={pIndex}
                                className={`CB-unit2-p6-q2-text ${focusRingClass}`}
                                role="button"
                                tabIndex={0}
                                aria-label={`${part.value}. Press to listen.`}
                                style={{
                                  position: "relative",
                                  cursor: "pointer",
                                  ...(playing ? highlightStyle : {}),
                                }}
                                onClick={() => playTextAudio(part, tid)}
                                onKeyDown={(e) =>
                                  handleTextKeyDown(e, part, tid)
                                }
                                onFocus={(e) => handleTextFocus(e, part, tid)}
                              >
                                <span aria-hidden="true">{part.value}</span>
                                {playing && <SpeakerIcon />}
                              </span>
                            );
                          }

                          return (
                            <span key={pIndex} className="CB-unit2-p6-q2-text">
                              {part.value}
                            </span>
                          );
                        }

                        // ========== خانة ==========
                        const key = `${qIndex}-${pIndex}`;
                        const n = blankKeys.indexOf(key) + 1;
                        const locked = lockedBlanks[key];
                        const isWrong = wrongInputs.includes(key);
                        const isValidTarget =
                          Boolean(activeWord) && !allLocked && !locked;
                        const word = wordById[answers[key]];

                        // ✅❌ نتيجة الخانة (بعد Check بس)
                        const result = showAnswered
                          ? null
                          : locked
                            ? "correct"
                            : isWrong
                              ? "wrong"
                              : null;

                        return (
                          <span
                            key={pIndex}
                            className="CB-unit3-p5-q3-field-wrap"
                          >
                            <Droppable
                              droppableId={`drop-${key}`}
                              isDropDisabled={allLocked || locked}
                            >
                              {(provided, snapshot) => (
                                <span
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                  className={`CB-unit2-p6-q2-input ${
                                    snapshot.isDraggingOver
                                      ? "drag-over-cell"
                                      : ""
                                  }`}
                                  onClick={(e) => handleBlankClick(key, e)}
                                  style={{
                                    position: "relative",
                                    width: "300px",
                                    cursor:
                                      allLocked || locked
                                        ? "default"
                                        : "pointer",
                                    ...(isValidTarget ? validTargetStyle : {}),
                                  }}
                                >
                                  <span aria-hidden="true">
                                    {word?.text || ""}
                                  </span>

                                  {provided.placeholder}

                                  {/* زر شفاف للكيبورد وقارئ الشاشة */}
                                  <button
                                    type="button"
                                    ref={(node) => {
                                      blankRefs.current[key] = node;
                                    }}
                                    aria-label={`Question ${n}: ${sentenceLabel(q)}${
                                      word ? `, ${word.text}` : ", empty"
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
                                    onKeyDown={(e) =>
                                      handleBlankKeyDown(e, key)
                                    }
                                  />
                                </span>
                              )}
                            </Droppable>

                            {/* ✅❌ أيقونة + نص الفيدباك جنب الفراغ */}
                            {result && (
                              <span
                                className={`CB-unit3-p5-q3-feedback ${result}`}
                                aria-hidden="true"
                              >
                                {result === "correct" ? "" : "✕ "}
                                {/* {feedbackText(result)} */}
                              </span>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
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
      </div>
    </DragDropContext>
  );
};

export default Unit3_Page5_Q3;

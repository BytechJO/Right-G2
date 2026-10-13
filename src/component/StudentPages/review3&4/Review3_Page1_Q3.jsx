import React, { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";

// 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";

import img1 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 34/Ex C 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 34/Ex C 2.svg";

// ⚠️ أسماء ملفات الصوت 3 و 4 كانت مقطوعة بالسكرين شوت، تأكد منها
import yesSheCanAudio from "../../../assets/audio/ClassBook/U 4/Page 34 - C/Item_001_Yes,_she_can.mp3";
import noHeCantAudio from "../../../assets/audio/ClassBook/U 4/Page 34 - C/Item_002_No,_he_can't.mp3";
import canHeFlyAudio from "../../../assets/audio/ClassBook/U 4/Page 34 - C/Item_003_Can_he_fly_a_kite.mp3";
import canSheMakeAudio from "../../../assets/audio/ClassBook/U 4/Page 34 - C/Item_004_Can_she_make_a_sandwich.mp3";

import "./Review3_Page1_Q3.css";

// 🔊 true = الصوت يشتغل تلقائياً لما الطالب يوقف على الكلمة/الجملة بالتاب
const PLAY_ON_FOCUS = true;

/* ================= DATA ================= */

// ⚠️ الـ alt وصف عام بدون الجواب (الجواب هو yes/no).
// الأوصاف تخمين، راجعها مع الصور الفعلية.
const ITEMS = [
  {
    id: 1,
    img: img1,
    alt: "A boy standing outdoors next to a kite",
    question: "Can he fly a kite?",
    questionAudio: canHeFlyAudio,
    answer: "No, he can’t.",
    answerAudio: noHeCantAudio,
    wordId: "w1",
  },
  {
    id: 2,
    img: img2,
    alt: "A girl in a kitchen next to bread and food",
    question: "Can she make a sandwich?",
    questionAudio: canSheMakeAudio,
    answer: "Yes, she can.",
    answerAudio: yesSheCanAudio,
    wordId: "w2",
  },
];

// ترتيب البنك مختلف عن ترتيب الأسئلة
const wordBank = [
  { id: "w2", text: ITEMS[1].answer, audio: ITEMS[1].answerAudio },
  { id: "w1", text: ITEMS[0].answer, audio: ITEMS[0].answerAudio },
];

const wordById = Object.fromEntries(wordBank.map((w) => [w.id, w]));

// مفاتيح الخانات: رقم السؤال ("0", "1")
const blankKeys = ITEMS.map((_, i) => String(i));

const answerOf = Object.fromEntries(
  ITEMS.map((item, i) => [String(i), item.wordId]),
);

const emptyAnswers = () => Object.fromEntries(blankKeys.map((k) => [k, ""]));
const noLocks = () => Object.fromEntries(blankKeys.map((k) => [k, false]));

const total = blankKeys.length;

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

const Review3_Page1_Q3 = () => {
  const [answers, setAnswers] = useState(emptyAnswers);

  // 🔒 الخانات الصح بعد Check بتنقفل
  const [lockedBlanks, setLockedBlanks] = useState(noLocks);

  // ✕ الخانات الغلط (الكلمة بتضل بمكانها والطالب بيقدر يعدّلها)
  const [wrongInputs, setWrongInputs] = useState([]);

  // 🔒 بعد Show Answer كل شي مقفول
  const [showAnswered, setShowAnswered] = useState(false);

  // الكلمة المختارة (اختار الجملة ثم اختار الخانة)
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

    // نفس الجملة مرة ثانية = إلغاء الاختيار
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

  // 🔊 الصوت لما الطالب يوقف على الجملة بالتاب (مش بالماوس)
  const handleWordFocus = (e, id) => {
    if (!PLAY_ON_FOCUS) return;
    if (!e.currentTarget.matches(":focus-visible")) return;
    playWordAudio(id);
  };

  // الأسهم: تنقل بين الجمل
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

    // إذا الجملة بخانة ثانية (غير مقفولة) نشيلها منها
    const oldKey = Object.keys(updated).find(
      (k) => updated[k] === id && !lockedBlanks[k],
    );

    if (oldKey) updated[oldKey] = "";

    // إذا الخانة فيها جملة تانية، بترجع للبنك تلقائياً
    updated[key] = id;

    setAnswers(updated);

    // نشيل ✕ بس عن الخانات الي تغيّرت
    setWrongInputs((prev) => prev.filter((k) => k !== key && k !== oldKey));

    setSelectedWord(null);

    setMessage(
      `${wordById[id].text} placed in question ${blankKeys.indexOf(key) + 1}.`,
    );

    // بالكيبورد: نروح للجملة الجاية الغير مستخدمة
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
    - في جملة مختارة → نحطها
    - ما في جملة مختارة والخانة فيها جملة → نرجعها للبنك
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
      setMessage(`Question ${n} is empty. Select a sentence first.`);
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
     نص عليه صوت (السؤال)
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

    // "drop-0" → "0"
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
        "Please complete all answers before checking.",
      );
      setMessage("Please complete all answers before checking.");
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
            sectionLetter="C"
            title="Look and answer the questions."
            subTitle="Look at the picture or clue first, then write a short answer for each question."
            isReview="true"
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
                  aria-label="Word bank. Press Enter or Space to select a sentence, then choose a box."
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

                            {/* 🔊 السبيكر فوق يمين الجملة */}
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
              {ITEMS.map((item, qIndex) => {
                const key = String(qIndex);
                const n = qIndex + 1;
                const locked = lockedBlanks[key];
                const isWrong = wrongInputs.includes(key);
                const isValidTarget =
                  Boolean(activeWord) && !allLocked && !locked;
                const word = wordById[answers[key]];

                const qId = `q-${qIndex}`;
                const qPlaying = activeId === qId;

                const aId = `a-${qIndex}`;
                const aPlaying = activeId === aId;

                // ✅❌ نتيجة الخانة (بعد Check بس)
                const result = showAnswered
                  ? null
                  : locked
                    ? "correct"
                    : isWrong
                      ? "wrong"
                      : null;

                // 🔁 زر إعادة صوت الجواب الصح بعد Check / Show Answer
                const showReplay = showAnswered || locked || isWrong;

                return (
                  <div key={item.id} className="CB-unit2-p6-q2-row">
                    <div className="CB-unit2-p6-q2-left-container">
                      <div className="CB-unit2-p6-q2-left">
                        <span
                          className="CB-unit2-p6-q2-index"
                          aria-hidden="true"
                        >
                          {n}
                        </span>
                        <img
                          src={item.img}
                          alt={`Picture ${n}: ${item.alt}`}
                          className="CB-r3p1q3-img"
                          draggable="false"
                        />
                      </div>
                    </div>

                    <div className="CB-unit2-p6-q2-sentence">
                      {/* 🔊 السؤال: كليك / Enter / Space بيشغّلوا صوته */}
                      <span
                        className={`CB-unit2-p6-q2-text ${focusRingClass}`}
                        role="button"
                        tabIndex={0}
                        aria-label={`Question ${n}: ${item.question}. Press to listen.`}
                        style={{
                          position: "relative",
                          cursor: "pointer",
                          ...(qPlaying ? highlightStyle : {}),
                        }}
                        onClick={() => playAudio(item.questionAudio, qId)}
                        onKeyDown={(e) =>
                          handleTextKeyDown(e, item.questionAudio, qId)
                        }
                        onFocus={(e) =>
                          handleTextFocus(e, item.questionAudio, qId)
                        }
                      >
                        <span aria-hidden="true">{item.question}</span>
                        {qPlaying && <SpeakerIcon />}
                      </span>

                      <span
                        className="CB-r3p1q3-field-wrap"
                        style={{ position: "relative" }}
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
                                locked && word
                                  ? "CB-unit2-p6-q2-input-correct"
                                  : ""
                              } ${snapshot.isDraggingOver ? "drag-over-cell" : ""}`}
                              onClick={(e) => handleBlankClick(key, e)}
                              style={{
                                position: "relative",
                                width: "300px",
                                maxWidth: "100%",
                                cursor:
                                  allLocked || locked ? "default" : "pointer",
                                ...(isValidTarget ? validTargetStyle : {}),
                              }}
                            >
                              <span aria-hidden="true">{word?.text || ""}</span>

                              {provided.placeholder}

                              {/* زر شفاف للكيبورد وقارئ الشاشة */}
                              <button
                                type="button"
                                ref={(node) => {
                                  blankRefs.current[key] = node;
                                }}
                                aria-label={`Answer for question ${n}: ${item.question}${
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
                                onKeyDown={(e) => handleBlankKeyDown(e, key)}
                              />
                            </span>
                          )}
                        </Droppable>
                        {/* ✕ جنب الفراغ */}
                        {result && (
                          <span
                            className={`CB-r3p1q3-feedback ${result}`}
                            aria-hidden="true"
                          >
                            {result === "correct" ? "" : "✕ "}
                          </span>
                        )}

                        {/* 🔁 صوت الجواب الصح بعد Check / Show Answer */}
                        {/* {showReplay && (
                          <button
                            type="button"
                            className={`CB-r3p1q3-play ${
                              aPlaying ? "is-playing" : ""
                            } ${focusRingClass}`}
                            aria-label={`Play the correct answer for question ${n}`}
                            onClick={() => playAudio(item.answerAudio, aId)}
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

export default Review3_Page1_Q3;

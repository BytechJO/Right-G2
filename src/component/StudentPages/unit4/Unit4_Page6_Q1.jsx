import React, { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit4_Page6_Q1.css";
import img1 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 33/Ex D 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 33/Ex D 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 33/Ex D 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 33/Ex D 4.svg";
import ExerciseHeader from "../../ExerciseHeader";

// 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";

// ⚠️ أسماء الملفات متل ما هي بالفولدر (Yes, I do..mp3 فيها نقطتين)
import doYouWantComputerSound from "../../../assets/audio/ClassBook/U 4/Page 33 - D/Do you want a computer.mp3";
import doYouWantDollSound from "../../../assets/audio/ClassBook/U 4/Page 33 - D/Do you want a doll.mp3";
import doYouWantASound from "../../../assets/audio/ClassBook/U 4/Page 33 - D/Do you want a.mp3";
import noIDontSound from "../../../assets/audio/ClassBook/U 4/Page 33 - D/No, I don't. I want a dress.mp3";
import robotSound from "../../../assets/audio/ClassBook/U 4/Page 33 - D/robot.mp3";
import yesIDoSound from "../../../assets/audio/ClassBook/U 4/Page 33 - D/Yes, I do..mp3";

// 🔊 true = الصوت يشتغل تلقائياً لما الطالب يوقف على الكلمة/الجملة بالتاب
const PLAY_ON_FOCUS = true;

/* ================= DATA ================= */

// ⚠️ الـ alt مؤقت ومحايد عن قصد (بدون ما نكشف الجواب): عدّليه حسب الصور
const items = [
  {
    img: img1,
    alt: "Picture for conversation 1",
    question: [
      { type: "text", value: "Do you want a doll?", audio: doYouWantDollSound },
    ],
    answer: "Yes, I do.",
  },
  {
    img: img2,
    alt: "Picture for conversation 2",
    question: [
      { type: "text", value: "Do you want a", audio: doYouWantASound },
      { type: "input", answer: "robot" },
    ],
    answer: "Yes, I do.",
  },
  {
    img: img3,
    alt: "Picture for conversation 3",
    question: [{ type: "input", answer: "Do you want a computer?" }],
    answer: "Yes, I do.",
  },
  {
    img: img4,
    alt: "Picture for conversation 4",
    // ما في ملف صوت لهالسؤال
    question: [{ type: "text", value: "Do you want a bike?" }],
    answer: "No, I don't. I want a dress",
  },
];

// limit = كم مرة بتنحط الكلمة (Yes, I do. جواب 3 أسئلة)
const wordBank = [
  {
    id: "w1",
    text: "Do you want a computer?",
    audio: doYouWantComputerSound,
    limit: 1,
  },
  { id: "w2", text: "Yes, I do.", audio: yesIDoSound, limit: 3 },
  { id: "w3", text: "robot", audio: robotSound, limit: 1 },
  {
    id: "w4",
    text: "No, I don't. I want a dress",
    audio: noIDontSound,
    limit: 1,
  },
];

const wordById = Object.fromEntries(wordBank.map((w) => [w.id, w]));

// كل الخانات بالترتيب الطبيعي = ترتيب الـ Tab
// مفاتيح الخانات: "q-سؤال-جزء" لفراغ السؤال، و "a-سؤال" للجواب
const blanks = items.flatMap((item, i) => [
  ...item.question
    .map((p, pi) =>
      p.type === "input"
        ? {
            key: `q-${i}-${pi}`,
            answer: p.answer,
            label: `Conversation ${i + 1} question blank`,
          }
        : null,
    )
    .filter(Boolean),
  {
    key: `a-${i}`,
    answer: item.answer,
    label: `Conversation ${i + 1} answer`,
  },
]);

const blankKeys = blanks.map((b) => b.key);
const answerOf = Object.fromEntries(blanks.map((b) => [b.key, b.answer]));
const labelOf = Object.fromEntries(blanks.map((b) => [b.key, b.label]));

const emptyAnswers = () => Object.fromEntries(blankKeys.map((k) => [k, ""]));
const noLocks = () => Object.fromEntries(blankKeys.map((k) => [k, false]));

const total = blankKeys.length;

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

const Unit4_Page6_Q1 = () => {
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

  // كم مرة انحطت الكلمة، وهل خلصت مرّاتها
  const usedCount = (id) =>
    Object.values(answers).filter((v) => v === id).length;
  const isUsedWord = (id) => usedCount(id) >= wordById[id].limit;

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

    if (allLocked || isUsedWord(id)) return;

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

    // نفس الكلمة بنفس الخانة: ما في شي نعمله
    if (answers[key] === id) {
      setSelectedWord(null);
      return;
    }

    // الكلمة خلصت مرّاتها
    if (isUsedWord(id)) return;

    // إذا الخانة فيها كلمة تانية، بترجع للبنك تلقائياً
    const updated = { ...answers, [key]: id };

    setAnswers(updated);

    // نشيل ✕ بس عن الخانة الي تغيّرت
    setWrongInputs((prev) => prev.filter((k) => k !== key));

    setSelectedWord(null);

    setMessage(`${wordById[id].text} placed in ${labelOf[key].toLowerCase()}.`);

    // بالكيبورد: نروح للكلمة الجاية الي لسا إلها مرّات
    if (viaKeyboard) {
      const next = wordBank.find(
        (w) =>
          Object.values(updated).filter((v) => v === w.id).length < w.limit,
      );
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

    const label = labelOf[key];

    if (lockedBlanks[key]) {
      setMessage(`${label} is correct and locked.`);
      return;
    }

    if (selectedWord) {
      placeWord(selectedWord, key, e.detail === 0);
      return;
    }

    if (answers[key]) {
      returnWord(key);
    } else {
      setMessage(`${label} is empty. Select a word first.`);
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
     نص عليه صوت ("Do you want a doll?" / "Do you want a")
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

    // "drop-a-1" → "a-1"
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
      ValidationAlert.info("Oops!", "Please complete all answers first.");
      setMessage("Please complete all answers first.");
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

    setMessage(
      score === total
        ? `Score ${score} out of ${total}. All answers are correct.`
        : `Score ${score} out of ${total}. Correct answers are locked. Incorrect: ${wrong
            .map((k) => labelOf[k])
            .join(", ")}. You can change them.`,
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
    setMessage("Exercise reset. All words are back in the word bank.");
  };

  /* =====================================================
     BLANK (خانة): Droppable + زر شفاف للكيبورد
     دالة مش كومبوننت عشان الفوكس ما يضيع
  ===================================================== */

  const renderBlank = (key, kind) => {
    const locked = lockedBlanks[key];
    const isWrong = wrongInputs.includes(key);
    const isValidTarget = Boolean(activeWord) && !allLocked && !locked;
    const word = wordById[answers[key]];
    const label = labelOf[key];

    const Tag = kind === "q" ? "span" : "div";
    const Wrapper = kind === "q" ? "span" : "div";

    return (
      <Droppable
        droppableId={`drop-${key}`}
        isDropDisabled={allLocked || locked}
      >
        {(provided, snapshot) => (
          <Wrapper
            className={kind === "q" ? "w-full" : undefined}
            style={kind === "q" ? { whiteSpace: "nowrap" } : undefined}
          >
            <Tag
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`${
                kind === "q"
                  ? "question-blank-CB-unit4-p6-q1"
                  : "answer-input-CB-unit4-p6-q1"
              } ${isWrong && !locked ? "input-error" : ""} ${
                locked && word ? "CB-unit4-p6-q1-correct" : ""
              } ${snapshot.isDraggingOver ? "drag-over" : ""}`}
              onClick={(e) => handleBlankClick(key, e)}
              style={{
                position: "relative",
                cursor: allLocked || locked ? "default" : "pointer",
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
                aria-label={`${label}${word ? `, ${word.text}` : ", empty"}${
                  locked
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
            </Tag>

            {isWrong && !locked && <span className="error-icon">✕</span>}
          </Wrapper>
        )}
      </Droppable>
    );
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
            sectionLetter="D"
            title="Complete the conversations."
            subTitle="Read both speakers first, then choose the words that make each conversation sound natural."
          />

          <div className="flex flex-col gap-10">
            {/* WORD BANK */}
            <Droppable droppableId="word-bank" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  role="group"
                  aria-label="Word bank. Press Enter or Space to select a word, then choose a blank."
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "30px",
                    padding: "10px",
                    borderRadius: "10px",
                    justifyContent: "center",
                  }}
                >
                  {wordBank.map((w, i) => {
                    const isUsed = isUsedWord(w.id);
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

            {/* CONTENT */}
            {items.map((item, i) => (
              <div key={i} className="content-CB-unit4-p6-q1">
                <div className="CB-unit4-p6-q1-img-container">
                  <span className="CB-unit4-p6-q1-index">{i + 1}</span>
                  <img
                    src={item.img}
                    alt={item.alt}
                    style={{ height: "150px", width: "200px" }}
                  />
                </div>

                <div className="question-box-CB-unit4-p6-q1">
                  <div className="CB-unit4-p6-q1-title-container">
                    <span className="CB-unit4-p6-q1-index">{i + 1}</span>

                    <p style={{ width: "90%", display: "flex" }}>
                      {item.question.map((part, pIndex) => {
                        // ========== فراغ بالسؤال ==========
                        if (part.type === "input") {
                          return (
                            <React.Fragment key={pIndex}>
                              {renderBlank(`q-${i}-${pIndex}`, "q")}
                            </React.Fragment>
                          );
                        }

                        // ========== نص عليه صوت ==========
                        if (part.audio) {
                          const tid = `text-${i}-${pIndex}`;
                          const playing = activeId === tid;

                          return (
                            <span
                              key={pIndex}
                              className={focusRingClass}
                              role="button"
                              tabIndex={0}
                              aria-label={`${part.value}. Press to listen.`}
                              style={{
                                position: "relative",
                                cursor: "pointer",
                                fontSize: "18px",
                                whiteSpace: "nowrap",
                                ...(playing ? highlightStyle : {}),
                              }}
                              onClick={() => playTextAudio(part, tid)}
                              onKeyDown={(e) => handleTextKeyDown(e, part, tid)}
                              onFocus={(e) => handleTextFocus(e, part, tid)}
                            >
                              <span aria-hidden="true"> {part.value} </span>
                              {playing && <SpeakerIcon />}
                            </span>
                          );
                        }

                        // ========== نص عادي ==========
                        return (
                          <span
                            key={pIndex}
                            style={{ width: "100%", fontSize: "18px" }}
                          >
                            {" "}
                            {part.value}{" "}
                          </span>
                        );
                      })}
                    </p>
                  </div>

                  {renderBlank(`a-${i}`, "a")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="action-buttons-container">
          <button type="button" onClick={reset} className="try-again-button">
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
    </DragDropContext>
  );
};

export default Unit4_Page6_Q1;

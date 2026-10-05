import React, { useState, useRef, useEffect } from "react";
import img from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 9/Page9-Ex E 1.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./Page9_Q2.css";
import Button from "../../WorkBookPages/Button";

// ========================================
// AUDIO
// ⚠️ عدّل المسارات/الامتداد حسب ملفاتك
// (ملف "is missing from the ..." اسمو مقطوع بالصورة، تأكدي من الاسم الكامل)
// ========================================

import auntSound from "../../../assets/audio/ClassBook/U 1/Page 9 - E/aunt.mp3";
import brotherSound from "../../../assets/audio/ClassBook/U 1/Page 9 - E/brother.mp3";
import fatherSound from "../../../assets/audio/ClassBook/U 1/Page 9 - E/father.mp3";
import motherSound from "../../../assets/audio/ClassBook/U 1/Page 9 - E/mother.mp3";
import sisterSound from "../../../assets/audio/ClassBook/U 1/Page 9 - E/sister.mp3";
import uncleSound from "../../../assets/audio/ClassBook/U 1/Page 9 - E/uncle.mp3";
import missingSound from "../../../assets/audio/ClassBook/U 1/Page 9 - E/is missing from the picture..mp3";

// 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
// ⚠️ عدّل المسار حسب مكان الملف عندك
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import ExerciseHeader from "../../ExerciseHeader";

// 🔊 true = الصوت يشتغل تلقائياً لما الطالب يوقف على الكلمة بالتاب
// (غيّرها لـ false إذا بدك الصوت بس عند Enter / Space / كليك)
const PLAY_ON_FOCUS = true;

const inputData = [
  { question: "", correct: "He's my father" },
  { question: "", correct: "She's my mother" },
  { question: "", correct: "He's my brother" },
  { question: "", correct: "She's my sister" },
  { question: "", correct: "She's my aunt" },
  { question: "", correct: "he's my uncle" },
];

const dragData = {
  data: ["sister", "mother", "uncle", "father", "brother", "aunt"],
  correct: "jack",
};

// الكلمة → ملف الصوت
const soundByWord = {
  sister: sisterSound,
  mother: motherSound,
  uncle: uncleSound,
  father: fatherSound,
  brother: brotherSound,
  aunt: auntSound,
};

// الجواب الصح لكل خانة (آخر كلمة بالجملة)
const correctWords = inputData.map((item) =>
  item.correct.split(" ").pop().toLowerCase(),
);

const missingCorrect = "jack";

const MISSING_AUDIO_ID = "missing-sentence";

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

// زر شفاف يغطي العنصر كامل (للكيبورد وقارئ الشاشة فقط)
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

const Page9_Q2 = () => {
  const total = inputData.length + 1; // 6 خانات + اسم الشخص الناقص

  const [answers, setAnswers] = useState(Array(inputData.length).fill(""));

  // 🔒 الخانات الصح بعد Check بتنقفل
  const [lockedBlanks, setLockedBlanks] = useState(
    Array(inputData.length).fill(false),
  );

  // ✕ الخانات الغلط (الكلمة رجعت للبنك)
  const [wrongInputs, setWrongInputs] = useState([]);

  const [missingAnswer, setMissingAnswer] = useState("");
  const [missingLocked, setMissingLocked] = useState(false);
  const [missingWrong, setMissingWrong] = useState(false);

  // 🔒 بعد Show Answer كل شي مقفول
  const [showAnswer, setShowAnswer] = useState(false);

  // الكلمة المختارة (طريقة اختار الكلمة ثم اختار الخانة)
  const [selectedWord, setSelectedWord] = useState(null);

  // الكلمة الي عم تنسحب
  const [draggingWord, setDraggingWord] = useState(null);

  // 📢 رسالة لقارئ الشاشة
  const [message, setMessage] = useState("");

  const wordRefs = useRef({});
  const blankRefs = useRef({});

  const isComplete = lockedBlanks.every(Boolean) && missingLocked;
  const allLocked = showAnswer || isComplete;

  // الكلمة الي الخانات المسموحة إلها (مختارة أو منسحبة)
  const activeWord = selectedWord || draggingWord;

  /* =====================================================
     AUDIO
     - أي صوت جديد بيوقف الصوت القديم (حتى من كومبونينت ثانية)
     - الأيقونة بتختفي لما الصوت ينتهي أو ينوقف
  ===================================================== */

  // هوية هاي الكومبونينت عند مدير الصوت (للـ cleanup)
  const audioOwner = useRef({}).current;

  // العنصر الي اشتغل صوته → بيظهر عليه البوردر + أيقونة السبيكر
  const [activeId, setActiveId] = useState(null);

  const stopAudio = () => stopGlobalAudio(audioOwner);

  const playAudio = (src, id) => {
    if (!src) {
      stopGlobalAudio();
      setActiveId(null);
      return;
    }

    /*
      أول: بنشغّل الجديد (بيوقف القديم وبينظف أيقونته)،
      بعدين بنفعّل أيقونة الجديد.
    */
    playGlobalAudio(src, {
      owner: audioOwner,
      onFinish: () => setActiveId((prev) => (prev === id ? null : prev)),
    });

    setActiveId(id);
  };

  const playWordAudio = (word) => playAudio(soundByWord[word], `word-${word}`);

  // وقف صوت هاي الكومبونينت إذا سكرت الصفحة
  useEffect(() => () => stopGlobalAudio(audioOwner), [audioOwner]);

  const SpeakerIcon = () => (
    <svg
      className="CB-unit1-p9-q2-speaker"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      style={{
        position: "absolute",
        top: "-6px",
        right: "-6px",
        background:"white",
        borderRadius:"50%",
        // color: "#2c5287",
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

  const focusWord = (word) => {
    requestAnimationFrame(() => wordRefs.current[word]?.focus());
  };

  const focusBlank = (index) => {
    requestAnimationFrame(() => blankRefs.current[index]?.focus());
  };

  // أول خانة مسموح الإسقاط عليها (فاضية أولاً)
  const firstTargetBlank = () => {
    const empty = answers.findIndex((a, i) => a === "" && !lockedBlanks[i]);

    if (empty !== -1) return empty;

    return lockedBlanks.findIndex((locked) => !locked);
  };

  /* =====================================================
     SELECT WORD (كليك / لمس / Enter / Space)
     يشغّل الصوت دايماً، ويختار الكلمة إذا مسموح
  ===================================================== */

  const activateWord = (word, viaKeyboard = false) => {
    playWordAudio(word);

    if (allLocked || answers.includes(word)) return;

    // نفس الكلمة مرة ثانية = إلغاء الاختيار
    if (selectedWord === word) {
      setSelectedWord(null);
      setMessage(`${word} deselected.`);
      return;
    }

    setSelectedWord(word);

    setMessage(
      `${word} selected. Choose a blank to place it. Press Escape to cancel.`,
    );

    // بالكيبورد: ننقل التركيز لأول خانة مسموحة
    if (viaKeyboard) {
      const target = firstTargetBlank();

      if (target !== -1) focusBlank(target);
    }
  };

  const cancelSelection = () => {
    if (!selectedWord) return;

    setMessage(`${selectedWord} deselected.`);

    setSelectedWord(null);
  };

  // 🔊 الصوت لما الطالب يوقف على الكلمة بالتاب (مش بالماوس)
  const handleWordFocus = (e, word) => {
    if (!PLAY_ON_FOCUS) return;

    if (!e.currentTarget.matches(":focus-visible")) return; // تجاهل تركيز الماوس

    playWordAudio(word);
  };

  // الأسهم: تنقل بين الكلمات
  const handleWordKeyDown = (e, word) => {
    const list = dragData.data;
    const i = list.indexOf(word);

    let next = null;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      next = list[(i + 1) % list.length];
    }

    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      next = list[(i - 1 + list.length) % list.length];
    }

    if (next) {
      e.preventDefault();

      wordRefs.current[next]?.focus();
    }
  };

  /* =====================================================
     PLACE / RETURN
  ===================================================== */

  const placeWord = (word, index, viaKeyboard = false) => {
    if (allLocked || lockedBlanks[index]) return;

    const updated = [...answers];

    // إذا الكلمة بخانة ثانية (غير مقفولة) نشيلها منها
    const oldIndex = updated.findIndex((a, i) => a === word && !lockedBlanks[i]);

    if (oldIndex !== -1) updated[oldIndex] = "";

    // إذا الخانة فيها كلمة تانية، بترجع للبنك تلقائياً
    updated[index] = word;

    setAnswers(updated);

    // نشيل ✕ بس عن الخانة الي انحط فيها كلمة جديدة
    setWrongInputs((prev) => prev.filter((i) => i !== index));

    setSelectedWord(null);

    setMessage(`${word} placed in blank ${index + 1}.`);

    // بالكيبورد: نروح للكلمة الجاية الغير مستخدمة
    if (viaKeyboard) {
      const next = dragData.data.find((w) => !updated.includes(w));

      if (next) focusWord(next);
    }
  };

  const returnWord = (index) => {
    const word = answers[index];

    if (!word) return;

    const updated = [...answers];

    updated[index] = "";

    setAnswers(updated);

    setMessage(`${word} returned to the word bank.`);
  };

  /*
    كليك على الخانة:
    - في كلمة مختارة → نحطها
    - ما في كلمة مختارة والخانة فيها كلمة → نرجعها للبنك
  */
  const handleBlankClick = (index, e) => {
    if (allLocked) return;

    if (lockedBlanks[index]) {
      setMessage(`Blank ${index + 1} is correct and locked.`);
      return;
    }

    if (selectedWord) {
      placeWord(selectedWord, index, e.detail === 0);
      return;
    }

    if (answers[index]) {
      returnWord(index);
    } else {
      setMessage(`Blank ${index + 1} is empty. Select a word first.`);
    }
  };

  // الأسهم: تنقل بين الخانات
  const handleBlankKeyDown = (e, index) => {
    let next = null;

    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      next = (index + 1) % inputData.length;
    }

    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      next = (index - 1 + inputData.length) % inputData.length;
    }

    if (next !== null) {
      e.preventDefault();

      blankRefs.current[next]?.focus();
    }
  };

  /* =====================================================
     DRAG & DROP (ماوس / لمس)
  ===================================================== */

  const onDragStart = (start) => {
    const word = start.draggableId.replace("word-", "");

    setDraggingWord(word);

    setSelectedWord(null);

    playWordAudio(word);
  };

  const onDragEnd = (result) => {
    setDraggingWord(null);

    const { destination, draggableId } = result;

    if (!destination || allLocked) return;

    if (!destination.droppableId.startsWith("drop-")) return;

    const value = draggableId.replace("word-", "");
    const index = Number(destination.droppableId.split("-")[1]);

    placeWord(value, index);
  };

  /* =====================================================
     MISSING NAME
  ===================================================== */

  const handleMissingChange = (e) => {
    setMissingAnswer(e.target.value);

    setMissingWrong(false);
  };

  const playMissingSentence = () => playAudio(missingSound, MISSING_AUDIO_ID);

  const handleMissingSentenceFocus = (e) => {
    if (!PLAY_ON_FOCUS) return;

    if (!e.currentTarget.matches(":focus-visible")) return;

    playMissingSentence();
  };

  const handleMissingSentenceKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      playMissingSentence();
    }
  };

  /* =====================================================
     CHECK
     - الصح بينقفل
     - الغلط بيرجع للبنك + ✕ على الخانة
     - السكور بينحسب من كل العناصر (المقفولة + الجديدة)
  ===================================================== */

  const checkAnswers = () => {
    if (allLocked) return;

    const hasEmpty = answers.some(
      (a, i) => !lockedBlanks[i] && a.trim() === "",
    );

    if (hasEmpty) {
      ValidationAlert.info("Please fill in all blanks before checking!");

      setMessage("Please fill in all blanks before checking.");

      return;
    }

    const newLocked = [...lockedBlanks];
    const updated = [...answers];
    const wrong = [];
    const returned = [];

    let correctCount = 0;

    answers.forEach((ans, i) => {
      if (lockedBlanks[i] || ans.toLowerCase() === correctWords[i]) {
        newLocked[i] = true;

        correctCount++;
      } else {
        wrong.push(i);

        returned.push(ans);

        updated[i] = ""; // الكلمة الغلط ترجع للبنك
      }
    });

    const missingOk =
      missingLocked || missingAnswer.trim().toLowerCase() === missingCorrect;

    if (missingOk) correctCount++;

    setLockedBlanks(newLocked);
    setAnswers(updated);
    setWrongInputs(wrong);
    setMissingLocked(missingOk);
    setMissingWrong(!missingOk);
    setSelectedWord(null);

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size:20px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${correctCount} / ${total}
      </span>
    </div>
  `;

    let text = `Score ${correctCount} out of ${total}.`;

    if (correctCount === total) {
      text += " All answers are correct.";
    } else {
      if (returned.length > 0) {
        text += ` Correct answers are locked. Returned to the word bank: ${returned.join(", ")}.`;
      }

      if (!missingOk) {
        text += " The missing name is incorrect.";
      }
    }

    setMessage(text);

    if (correctCount === total) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  /* =====================================================
     START AGAIN
     بيرجّع الكلمات، الخانات، العلامات، الفيدباك، والصوت
  ===================================================== */

  const reset = () => {
    stopAudio();

    setActiveId(null);

    setAnswers(Array(inputData.length).fill(""));
    setLockedBlanks(Array(inputData.length).fill(false));
    setWrongInputs([]);
    setMissingAnswer("");
    setMissingLocked(false);
    setMissingWrong(false);
    setShowAnswer(false);
    setSelectedWord(null);
    setDraggingWord(null);
    setMessage("Exercise reset. All words are back in the word bank.");
  };

  /* =====================================================
     SHOW ANSWER
     بيعبي كل العناصر بالجواب الصح وبيقفلهم
     (بدون ما يحسب سكور للطالب)
  ===================================================== */

  const showCorrectAnswers = () => {
    stopAudio();

    setActiveId(null);

    setAnswers(correctWords);
    setLockedBlanks(Array(inputData.length).fill(true));
    setWrongInputs([]);
    setMissingAnswer(missingCorrect);
    setMissingLocked(true);
    setMissingWrong(false);
    setSelectedWord(null);
    setDraggingWord(null);
    setShowAnswer(true);
    setMessage("Correct answers are shown.");
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

        <div className="div-forall mb-10" style={{}}>
          <div className="component-wrapper">
             <ExerciseHeader
          sectionLetter="E"
          // questionNumber="1"
          title="Write and guess. Who is missing from the picture?"
          subTitle="Match each clue first, then drag the item to its correct target and check the snap position."
        />


            <div className="CB-unit1-p9-q2-top-container">
              <div className="family-image-wrapper">
                <img src={img} className="CB-unit1-p9-q2-shape-img" alt="" />
              </div>

              <div className="CB-unit1-p9-q2-rightSide">
                {/* ✅ الكلمات */}
                <Droppable droppableId="words" direction="horizontal">
                  {(provided) => (
                    <div
                      className="word-list-box"
                      ref={provided.innerRef}
                      role="group"
                      aria-label="Word bank. Press Enter or Space to select a word, then choose a blank."
                      {...provided.droppableProps}
                    >
                      {dragData.data.map((word, index) => {
                        const isUsed = answers.includes(word);
                        const isSelected = selectedWord === word;
                        const isPlaying = activeId === `word-${word}`;

                        return (
                          <Draggable
                            key={word}
                            draggableId={`word-${word}`}
                            index={index}
                            isDragDisabled={allLocked || isUsed}
                          >
                            {(provided) => (
                              <div
                                className="word-item"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                /*
                                  الفوكس بالكيبورد على الزر الداخلي،
                                  مش على الـ drag handle نفسو.
                                */
                                tabIndex={-1}
                                role="presentation"
                                aria-describedby={undefined}
                                onClick={(e) =>
                                  activateWord(word, e.detail === 0)
                                }
                                style={{
                                  position: "relative",
                                  textDecoration: isUsed ? "line-through" : "",
                                  opacity: isUsed ? 0.6 : 1,
                                  cursor:
                                    isUsed || allLocked
                                      ? "not-allowed"
                                      : "grab",
                                  ...(isSelected || isPlaying
                                    ? highlightStyle
                                    : {}),
                                  ...provided.draggableProps.style,
                                }}
                              >
                                <span aria-hidden="true">{word}</span>

                                {/*
                                  زر شفاف للكيبورد وقارئ الشاشة.
                                  Enter / Space عليه بيعملوا click → بيوصل للأب.
                                  وجود button جوا الـ draggable بيمنع
                                  مكتبة السحب من رفع العنصر بـ Space.
                                */}
                                <button
                                  type="button"
                                  ref={(node) => {
                                    wordRefs.current[word] = node;
                                  }}
                                  aria-label={`${word}${
                                    isUsed ? ", already placed" : ""
                                  }${isSelected ? ", selected" : ""}`}
                                  aria-pressed={isSelected}
                                  aria-disabled={isUsed || allLocked}
                                  className={focusRingClass}
                                  style={overlayButtonStyle}
                                  onFocus={(e) => handleWordFocus(e, word)}
                                  onKeyDown={(e) => handleWordKeyDown(e, word)}
                                />

                                {/* 🔊 السبيكر فوق يمين الكلمة */}
                                {isPlaying && <SpeakerIcon />}
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                {/* الفقاعة */}
                <div className="missing-bubble">
                  <input
                    className="blank-space"
                    value={missingAnswer}
                    disabled={showAnswer || missingLocked}
                    aria-label="Name of the missing person"
                    onChange={handleMissingChange}
                  />

                  {missingWrong && !missingLocked && (
                    <span
                      className="CB-unit1-p9-q2-wrong-icon1"
                      aria-hidden="true"
                    >
                      ✕
                    </span>
                  )}

                  {/* {missingLocked && (
                    <span
                      className="CB-unit1-p9-q2-wrong-icon1"
                      style={{ color: "#2e7d32" }}
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  )} */}

                  {/* 🔊 الجملة كاملة عليها صوت */}
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label="is missing from the picture. Press to listen."
                    className={focusRingClass}
                    style={{
                      position: "relative",
                      cursor: "pointer",
                      ...(activeId === MISSING_AUDIO_ID ? highlightStyle : {}),
                    }}
                    onClick={playMissingSentence}
                    onKeyDown={handleMissingSentenceKeyDown}
                    onFocus={handleMissingSentenceFocus}
                  >
                    <span aria-hidden="true"> is missing from the picture.</span>

                    {activeId === MISSING_AUDIO_ID && <SpeakerIcon />}
                  </span>
                </div>
              </div>
            </div>

            {/* ✅ الأسئلة */}
            <div className="CB-unit1-p9-q2-content">
              <div className="CB-unit1-p9-q2-group-input">
                {inputData.map((item, index) => {
                  const locked = lockedBlanks[index];
                  const isWrong = wrongInputs.includes(index);
                  const isValidTarget = Boolean(activeWord) && !allLocked && !locked;

                  return (
                    <div key={index} className="CB-unit1-p9-q2-question-row">
                      <span className="CB-unit1-p9-q2-q-number">
                        {index + 1}.
                      </span>

                      <Droppable
                        droppableId={`drop-${index}`}
                        isDropDisabled={allLocked || locked}
                      >
                        {(provided, snapshot) => (
                          <div
                            className="CB-unit1-p9-q2-question-text relative"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            onClick={(e) => handleBlankClick(index, e)}
                            style={{
                              cursor:
                                allLocked || locked ? "default" : "pointer",
                              ...(isValidTarget ? validTargetStyle : {}),
                              ...(snapshot.isDraggingOver
                                ? { backgroundColor: "rgba(44,82,135,0.12)" }
                                : {}),
                            }}
                          >
                            <input
                              type="text"
                              value={answers[index]}
                              readOnly
                              tabIndex={-1}
                              aria-hidden="true"
                              className="CB-unit1-p9-q2-input"
                              style={{ pointerEvents: "none" }}
                            />

                            {isWrong && !locked && (
                              <span
                                className="CB-unit1-p9-q2-wrong-icon"
                                aria-hidden="true"
                              >
                                ✕
                              </span>
                            )}
{/* 
                            {locked && (
                              <span
                                className="CB-unit1-p9-q2-wrong-icon"
                                style={{ color: "#2e7d32" }}
                                aria-hidden="true"
                              >
                                ✓
                              </span>
                            )} */}

                            {provided.placeholder}

                            {/* زر شفاف للكيبورد وقارئ الشاشة */}
                            <button
                              type="button"
                              ref={(node) => {
                                blankRefs.current[index] = node;
                              }}
                              aria-label={`Blank ${index + 1}${
                                answers[index]
                                  ? `, ${answers[index]}`
                                  : ", empty"
                              }${
                                locked
                                  ? ", correct and locked"
                                  : isWrong
                                    ? ", incorrect, word returned"
                                    : ""
                              }${
                                isValidTarget && selectedWord
                                  ? `. Press Enter to place ${selectedWord}`
                                  : ""
                              }`}
                              aria-disabled={allLocked || locked}
                              className={focusRingClass}
                              style={overlayButtonStyle}
                              onKeyDown={(e) => handleBlankKeyDown(e, index)}
                            />
                          </div>
                        )}
                      </Droppable>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <Button
            handleStartAgain={reset}
            handleShowAnswer={showCorrectAnswers}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </DragDropContext>
  );
};

export default Page9_Q2;
import React, { useState, useRef, useEffect } from "react";
import img1 from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex A 1-1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex A 1-2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex A 1-3.svg";
// ✏️ عدّل المسارات حسب أماكن ملفات الصوت عندك

import lambSound from "../../../assets/audio/ClassBook/U 1/Page 8 - A 1/lamb.mp3";
import rabbitSound from "../../../assets/audio/ClassBook/U 1/Page 8 - A 1/rabbit.mp3";
import runSound from "../../../assets/audio/ClassBook/U 1/Page 8 - A 1/run.mp3";

import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ExerciseHeader from "../../ExerciseHeader";
import "./Page8_Q1.css";

const bankWords = ["lamb", "run", "rabbit"];

const Page8_Q1 = () => {
  const items = [
    {
      img: img1,
      alt: "Picture of someone running", // ✏️ عدّل الوصف حسب الصورة الفعلية
      correct: "r",
      correctInput: "run",
      sound: runSound,
    },
    {
      img: img2,
      alt: "Picture of a lamb",
      correct: "l",
      correctInput: "lamb",
      sound: lambSound,
    },
    {
      img: img3,
      alt: "Picture of a rabbit",
      correct: "r",
      correctInput: "rabbit",
      sound: rabbitSound,
    },
  ];

  const n = items.length;
  const blanks = () => Array(n).fill("");
  const falses = () => Array(n).fill(false);

  /* =====================================================
     REFS
  ===================================================== */

  const bankRefs = useRef([]);
  const dropRefs = useRef([]);
  const lastPickedBankIndexRef = useRef(0);

  /* =====================================================
     AUDIO — صوت كل كلمة (بالبنك وجوا الخانة)
  ===================================================== */

  // الكلمة → ملف الصوت الخاص فيها
  const soundByWord = Object.fromEntries(
    items.map((it) => [it.correctInput, it.sound]),
  );

  const audioRef = useRef(null);
  // العنصر الي اشتغل صوته (كلمة بالبنك أو خانة) → بيظهر عليه البوردر + أيقونة الصوت
  const [activeId, setActiveId] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  const playAudio = (src, id) => {
    stopAudio();
    setActiveId(id);
    if (!src) return;

    const audio = new Audio(src);
    audioRef.current = audio;
    // لما يخلص الصوت بتختفي أيقونة الصوت
    audio.onended = () => setActiveId((prev) => (prev === id ? null : prev));
    audio.play().catch(() => setActiveId(null));
  };

  // وقف الصوت إذا انفتح/سكر الكومبونينت
  useEffect(() => stopAudio, []);

  const SpeakerIcon = () => (
    <svg
      className="CB-unit1-p8-q1-speaker"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"
      />
    </svg>
  );

  /* =====================================================
     STATES
  ===================================================== */

  const [selected, setSelected] = useState(blanks()); // الدايرة (l / r)
  const [answers, setAnswers] = useState(blanks()); // الكلمة داخل الخانة

  // 🔒 الصح بعد Check بينقفل
  const [lockedCircle, setLockedCircle] = useState(falses());
  const [lockedWord, setLockedWord] = useState(falses());

  // ✕ علامات الخطأ
  const [wrongCircle, setWrongCircle] = useState(falses());
  const [wrongWord, setWrongWord] = useState(falses());

  const [showCorrect, setShowCorrect] = useState(false);
  const [dragging, setDragging] = useState(false);

  /* =====================================================
     ACCESSIBILITY
  ===================================================== */

  const [keyboardPickedWord, setKeyboardPickedWord] = useState(null);
  const [keyboardMessage, setKeyboardMessage] = useState("");

  /* =====================================================
     PLACE WORD (مشترك بين السحب والكيبورد)
  ===================================================== */

  const placeWord = (slotIndex, word, fromKeyboard = false) => {
    if (showCorrect || lockedWord[slotIndex]) return;

    const updated = [...answers];

    // 🔒 منع التكرار: الكلمة بتنتقل من خانتها القديمة (إلا إذا كانت مقفولة)
    const oldIndex = updated.findIndex((a) => a === word);
    if (oldIndex !== -1) {
      if (lockedWord[oldIndex]) return;
      updated[oldIndex] = "";
    }

    updated[slotIndex] = word;

    setAnswers(updated);

    // نشيل X فقط عن الخانة التي تغيرت
    setWrongWord((prev) => prev.map((w, i) => (i === slotIndex ? false : w)));

    setKeyboardPickedWord(null);

    // 🔊 صوت الكلمة بعد ما تنحط بالخانة (سحب أو كيبورد)
    playAudio(soundByWord[word], `slot-${slotIndex}`);

    const remaining = bankWords.filter((w) => !updated.includes(w));

    setKeyboardMessage(
      remaining.length > 0
        ? `${word} placed in box ${slotIndex + 1}. Choose another word.`
        : `${word} placed in box ${slotIndex + 1}. All boxes are filled. You can check your answers.`,
    );

    // بعد الوضع بالكيبورد: ارجع للكلمة الجاية المتاحة بالبنك
    if (fromKeyboard) {
      setTimeout(() => {
        const nextIndex = bankWords.findIndex((w) => !updated.includes(w));
        if (nextIndex !== -1) {
          bankRefs.current[nextIndex]?.focus();
        }
      }, 0);
    }
  };

  /* =====================================================
     DRAG
  ===================================================== */

  const onDragStart = () => setDragging(true);

  const onDragEnd = (result) => {
    setDragging(false);

    if (!result.destination || showCorrect) return;

    const { draggableId, destination } = result;

    if (
      draggableId.startsWith("bank-") &&
      destination.droppableId.startsWith("slot-")
    ) {
      const index = Number(destination.droppableId.replace("slot-", ""));
      const word = draggableId.replace("bank-", "");

      placeWord(index, word, false);
    }
  };

  /* =====================================================
     PICK WORD (كليك / Enter)
  ===================================================== */

  const pickWord = (word, bankIndex, fromKeyboard) => {
    if (showCorrect || answers.includes(word)) return;

    // نفس الكلمة مرة تانية = إلغاء الاختيار
    if (keyboardPickedWord === word) {
      setKeyboardPickedWord(null);
      setKeyboardMessage(`${word} selection cancelled.`);
      return;
    }

    lastPickedBankIndexRef.current = bankIndex;
    setKeyboardPickedWord(word);

    // 🔊 صوت الكلمة لما تنختار من البنك
    playAudio(soundByWord[word], `bank-${word}`);
    setKeyboardMessage(
      `${word} selected. Use Tab to choose a box, then press Enter.`,
    );

    // بالكيبورد: روح على أول خانة غير مقفلة
    if (fromKeyboard) {
      setTimeout(() => {
        const firstUnlocked = items.findIndex((_, i) => !lockedWord[i]);
        if (firstUnlocked !== -1) {
          dropRefs.current[firstUnlocked]?.focus();
        }
      }, 0);
    }
  };

  const cancelPick = () => {
    if (!keyboardPickedWord) return;
    setKeyboardMessage(`${keyboardPickedWord} selection cancelled.`);
    setKeyboardPickedWord(null);
    bankRefs.current[lastPickedBankIndexRef.current]?.focus();
  };

  const handleChipKeyDown = (e, word, bankIndex) => {
    // Enter = اختيار الكلمة. (Space بيضل لسحب الكيبورد الخاص بمكتبة dnd)
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      pickWord(word, bankIndex, true);
    } else if (e.key === "Escape") {
      setKeyboardPickedWord(null);
    }
  };

  /* =====================================================
     SLOT (كليك / Enter / Space / Tab / Escape)
  ===================================================== */

  const activateSlot = (i, fromKeyboard) => {
    const locked = showCorrect || lockedWord[i];

    // في كلمة مختارة → حطها بالخانة (وبيشتغل صوتها)
    if (!locked && keyboardPickedWord) {
      placeWord(i, keyboardPickedWord, fromKeyboard);
      return;
    }

    // الخانة فيها كلمة (مقفولة أو لا) → شغّل صوتها
    if (answers[i]) {
      playAudio(soundByWord[answers[i]], `slot-${i}`);
      return;
    }

    if (!locked) {
      setKeyboardMessage(
        "Select a word first, then use Tab to choose a box and press Enter.",
      );
    }
  };

  // رجّع الكلمة للبنك (Delete / Backspace)
  const returnWord = (i) => {
    if (showCorrect || lockedWord[i] || !answers[i]) return;

    const word = answers[i];
    const updated = [...answers];
    updated[i] = "";
    setAnswers(updated);
    stopAudio();
    setActiveId(null);
    setKeyboardMessage(`${word} returned to the word bank.`);
  };

  const handleSlotKeyDown = (e, i) => {
    const locked = showCorrect || lockedWord[i];

    /* Tab بين الخانات غير المقفلة فقط (لما في كلمة مختارة) */
    if (!locked && keyboardPickedWord && e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = items
        .map((_, idx) => idx)
        .filter((idx) => !lockedWord[idx]);

      if (available.length === 0) return;

      const currentPosition = available.indexOf(i);
      let nextPosition;

      if (e.shiftKey) {
        nextPosition =
          currentPosition <= 0 ? available.length - 1 : currentPosition - 1;
      } else {
        nextPosition =
          currentPosition === -1 || currentPosition === available.length - 1
            ? 0
            : currentPosition + 1;
      }

      dropRefs.current[available[nextPosition]]?.focus();
      return;
    }

    /* Escape = إلغاء الاختيار والرجوع للكلمة */
    if (e.key === "Escape") {
      e.preventDefault();
      cancelPick();
      return;
    }

    /* Delete / Backspace = رجّع الكلمة للبنك */
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      returnWord(i);
      return;
    }

    /* Enter / Space = حط الكلمة المختارة، أو شغّل صوت الكلمة الموجودة */
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      activateSlot(i, true);
    }
  };

  /* =====================================================
     CIRCLES (l / r) — السيليكت
  ===================================================== */

  const handleSelect = (value, index) => {
    if (showCorrect || lockedCircle[index]) return;

    const newSel = [...selected];
    newSel[index] = value;
    setSelected(newSel);

    // نشيل X فقط عن العنصر الي تغيّر
    setWrongCircle((prev) => prev.map((w, i) => (i === index ? false : w)));

    setKeyboardMessage(`Item ${index + 1}: letter ${value} selected.`);
  };

  const handleCircleKeyDown = (e, letter, index) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(letter, index);
    }
  };

  /* =====================================================
     CHECK
  ===================================================== */

  const checkAnswers = () => {
    if (showCorrect) return;

    if (selected.some((s) => s === "")) {
      ValidationAlert.info("Please choose a circle (l or r) for all items!");
      return;
    }

    if (answers.some((a) => a === "")) {
      ValidationAlert.info("Please fill in all the writing boxes!");
      return;
    }

    let score = 0;
    const newAnswers = [...answers];
    const newLockedCircle = [...lockedCircle];
    const newLockedWord = [...lockedWord];
    const newWrongCircle = falses();
    const newWrongWord = falses();
    const wrongItems = [];

    items.forEach((item, i) => {
      const circleOk = selected[i] === item.correct;
      const wordOk =
        answers[i].toLowerCase() === item.correctInput.toLowerCase();

      if (circleOk) {
        score++;
        newLockedCircle[i] = true; // 🔒 الصح بينقفل
      } else {
        newWrongCircle[i] = true; // ✕ وبيضل قابل للتعديل
      }

      if (wordOk) {
        score++;
        newLockedWord[i] = true; // 🔒
      } else {
        newAnswers[i] = ""; // ↩ الكلمة الغلط بترجع للبنك
        newWrongWord[i] = true;
      }

      if (!circleOk || !wordOk) wrongItems.push(i + 1);
    });

    setAnswers(newAnswers);
    setLockedCircle(newLockedCircle);
    setLockedWord(newLockedWord);
    setWrongCircle(newWrongCircle);
    setWrongWord(newWrongWord);
    setKeyboardPickedWord(null);

    const total = items.length * 2;
    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    setKeyboardMessage(
      score === total
        ? `Score ${score} out of ${total}. All answers are correct.`
        : `Score ${score} out of ${total}. Correct answers are locked. Items to fix: ${wrongItems.join(", ")}.`,
    );

    ValidationAlert[
      score === total ? "success" : score === 0 ? "error" : "warning"
    ](`
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${score} / ${total}
        </span>
      </div>
    `);
  };

  /* =====================================================
     SHOW ANSWERS
  ===================================================== */

  const showAnswers = () => {
    setSelected(items.map((i) => i.correct));
    setAnswers(items.map((i) => i.correctInput));
    setLockedCircle(Array(n).fill(true));
    setLockedWord(Array(n).fill(true));
    setWrongCircle(falses());
    setWrongWord(falses());
    setKeyboardPickedWord(null);
    stopAudio();
    setActiveId(null);
    setShowCorrect(true);
    setKeyboardMessage("Correct answers are shown.");
  };

  /* =====================================================
     RESET
  ===================================================== */

  const resetAll = () => {
    setSelected(blanks());
    setAnswers(blanks());
    setLockedCircle(falses());
    setLockedWord(falses());
    setWrongCircle(falses());
    setWrongWord(falses());
    setKeyboardPickedWord(null);
    setDragging(false);
    setShowCorrect(false);
    stopAudio();
    setActiveId(null);
    setKeyboardMessage("Exercise reset. All items are cleared.");
    // 🔊 هاد الكومبونينت ما فيه صوت. إذا ExerciseHeader فيه صوت لازم يوقفه هناك.
  };

  const slotLabel = (i) => {
    const locked = showCorrect || lockedWord[i];

    if (locked) {
      return `Box ${i + 1}. Correct word ${answers[i]}. Locked. Press Enter to hear it.`;
    }

    if (keyboardPickedWord) {
      return answers[i]
        ? `Box ${i + 1}. Current word ${answers[i]}. Press Enter to replace it with ${keyboardPickedWord}.`
        : `Box ${i + 1}. Press Enter to place ${keyboardPickedWord}.`;
    }

    return answers[i]
      ? `Box ${i + 1}. Current word ${answers[i]}. Press Enter to hear it, or Delete to return it to the word bank.`
      : `Box ${i + 1} is empty. Select a word first.`;
  };

  /* =====================================================
     JSX
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
      >
        {/* 📢 رسائل لقارئ الشاشة */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {keyboardMessage}
        </div>

        <div className="div-forall">
          <ExerciseHeader
            sectionLetter="A"
            questionNumber="1"
            title="Does it begin with an l or r? Circle and write."
            subTitle="Replay the audio, say the word quietly, then tap the sound or letter that matches."
          />

          {/* 🔤 Word Bank */}
          <Droppable droppableId="bank" direction="horizontal" isDropDisabled>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                role="group"
                aria-label="Word bank"
                style={{
                  display: "flex",
                  gap: "70px",
                  padding: "10px",
                  borderRadius: "10px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {bankWords.map((word, index) => {
                  const isUsed = answers.includes(word);
                  const disabled = showCorrect || isUsed;
                  const isPicked = keyboardPickedWord === word;

                  return (
                    <Draggable
                      key={word}
                      draggableId={`bank-${word}`}
                      index={index}
                      isDragDisabled={disabled}
                    >
                      {(provided) => (
                        <span
                          ref={(el) => {
                            provided.innerRef(el);
                            bankRefs.current[index] = el;
                          }}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          tabIndex={disabled ? -1 : 0}
                          aria-disabled={disabled}
                          aria-pressed={isPicked}
                          aria-label={
                            isUsed
                              ? `${word}. Already placed.`
                              : isPicked
                                ? `${word} selected. Use Tab to move to a box and press Enter to place it.`
                                : `${word}. Press Enter to hear it and pick it up.`
                          }
                          className={`CB-unit1-p8-q1-chip ${
                            isPicked ? "picked" : ""
                          } ${activeId === `bank-${word}` ? "sound-active" : ""}`}
                          onClick={() => pickWord(word, index, false)}
                          onKeyDown={(e) => handleChipKeyDown(e, word, index)}
                          style={{
                            padding: "7px 14px",
                            border: "2px solid #2c5287",
                            borderRadius: "8px",
                            background: isUsed ? "#ccc" : "white",
                            fontWeight: "bold",
                            cursor: isUsed ? "not-allowed" : "grab",
                            opacity: isUsed ? 0.6 : 1,
                            ...provided.draggableProps.style,
                          }}
                        >
                          {word}
                          {activeId === `bank-${word}` && (
                           
                              <SpeakerIcon />
                           
                          )}
                        </span>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className="CB-unit1-p8-q1-grid">
            {items.map((item, i) => {
              const slotLocked = showCorrect || lockedWord[i];
              const circleLocked = showCorrect || lockedCircle[i];
              const validTarget =
                (keyboardPickedWord || dragging) && !slotLocked;

              return (
                <div
                  className="CB-unit1-p8-q1-box"
                  key={i}
                  role="group"
                  aria-label={`Item ${i + 1}`}
                >
                  <div style={{ height: "150px" }}>
                    <img
                      src={item.img}
                      alt={item.alt}
                      className="CB-unit1-p8-q1-image"
                    />
                  </div>

                  {/* l / r circles */}
                  <div className="CB-unit1-p8-q1-choices">
                    {["l", "r"].map((letter) => {
                      const isActive = selected[i] === letter;
                      return (
                        <div
                          className="CB-unit1-p8-q1-circle-wrapper"
                          key={letter}
                        >
                          <div
                            role="button"
                            tabIndex={circleLocked ? -1 : 0}
                            aria-pressed={isActive}
                            aria-disabled={circleLocked}
                            aria-label={`Item ${i + 1}, letter ${letter}${
                              isActive && circleLocked
                                ? ", correct and locked"
                                : ""
                            }`}
                            className={`CB-unit1-p8-q1-circle ${
                              isActive ? "active" : ""
                            } ${circleLocked ? "correct-color locked" : ""}`}
                            onClick={() => handleSelect(letter, i)}
                            onKeyDown={(e) => handleCircleKeyDown(e, letter, i)}
                          >
                            {letter}
                          </div>

                          {wrongCircle[i] && isActive && (
                            <div
                              className="CB-unit1-p8-q1-wrong"
                              aria-hidden="true"
                            >
                              ✕
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* 🧩 خانة الكلمة */}
                  <div className="CB-unit1-p8-q1-input-wrapper">
                    <Droppable
                      droppableId={`slot-${i}`}
                      isDropDisabled={slotLocked}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={(el) => {
                            provided.innerRef(el);
                            dropRefs.current[i] = el;
                          }}
                          {...provided.droppableProps}
                          role="button"
                          tabIndex={0}
                          aria-label={slotLabel(i)}
                          onClick={() => activateSlot(i, false)}
                          onKeyDown={(e) => handleSlotKeyDown(e, i)}
                          className={`CB-unit1-p8-q1-input ${
                            slotLocked ? "correct-color locked" : ""
                          } ${answers[i] ? "has-word" : ""} ${
                            activeId === `slot-${i}` ? "sound-active" : ""
                          } ${validTarget ? "valid-target" : ""} ${
                            snapshot.isDraggingOver && !slotLocked
                              ? "drop-box"
                              : ""
                          }`}
                        >
                          {answers[i] && (
                            <span className="CB-unit1-p8-q1-word">
                              {answers[i]}
                            </span>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                    {activeId === `slot-${i}` && <SpeakerIcon />}

                    {wrongWord[i] && answers[i] === "" && (
                      <div className="CB-unit1-p8-q1-wrong" aria-hidden="true">
                        ✕
                      </div>
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
            aria-label="Start again"
            title="Start again"
          >
            Start Again ↻
          </button>
          <button
            type="button"
            onClick={showAnswers}
            className="show-answer-btn"
            aria-label="Show answer"
            title="Show answer"
          >
            Show Answer
          </button>
          <button
            type="button"
            onClick={checkAnswers}
            className="check-button2"
            aria-label="Check answer"
            title="Check answer"
          >
            Check Answer ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Page8_Q1;

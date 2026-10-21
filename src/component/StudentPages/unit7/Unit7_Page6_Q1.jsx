/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaVolumeUp } from "react-icons/fa";
import ValidationAlert from "../../Popup/ValidationAlert";
// 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import img1 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 63/Ex D 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 63/Ex D 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 63/Ex D 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 63/Asset 38.svg";

// ========================================
// AUDIO
// ========================================
import sundayAudio from "../../../assets/audio/ClassBook/U 7/Page 63 - D/Item_001_Sunday.mp3";
import mondayAudio from "../../../assets/audio/ClassBook/U 7/Page 63 - D/Item_002_Monday.mp3";
import tuesdayAudio from "../../../assets/audio/ClassBook/U 7/Page 63 - D/Item_003_Tuesday.mp3";
import wednesdayAudio from "../../../assets/audio/ClassBook/U 7/Page 63 - D/Item_004_Wednesday.mp3";
import thursdayAudio from "../../../assets/audio/ClassBook/U 7/Page 63 - D/Item_005_Thursday.mp3";
import fridayAudio from "../../../assets/audio/ClassBook/U 7/Page 63 - D/Item_006_Friday.mp3";
import saturdayAudio from "../../../assets/audio/ClassBook/U 7/Page 63 - D/Item_007_Saturday.mp3";
import promptAudio from "../../../assets/audio/ClassBook/U 7/Page 63 - D/Item_008_What_day_is_it_today.mp3";
import itIsAudio from "../../../assets/audio/ClassBook/U 7/Page 63 - D/Item_009_It_is.mp3";
import ExerciseHeader from "../../ExerciseHeader";

const wordAudio = {
  Sunday: sundayAudio,
  Monday: mondayAudio,
  Tuesday: tuesdayAudio,
  Wednesday: wednesdayAudio,
  Thursday: thursdayAudio,
  Friday: fridayAudio,
  Saturday: saturdayAudio,
};

// ========================================
// HELPERS
// ========================================

// يتجاهل الحروف الكبيرة/الصغيرة والمسافات وعلامات الترقيم
const normalize = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const wordBank = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const questions = [
  { id: 1, number: 4, answer: "Wednesday", img: img1 },
  { id: 2, number: 2, answer: "Monday", img: img2 },
  { id: 3, number: 6, answer: "Friday", img: img3 },
];

const emptyAnswers = { 1: "", 2: "", 3: "" };
// 🔊 أيقونة الصوت (بتظهر بس وقت الحاجة)
const SpeakerBadge = () => (
  <span
    aria-hidden="true"
    style={{
      position: "absolute",
      top: -10,
      right: -10,
      width: 22,
      height: 22,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
      zIndex: 2,
      lineHeight: 1,
      background: "#fff",
      color: "#000",
      boxShadow: "0 1px 3px rgba(0,0,0,.25)",
    }}
  >
    <FaVolumeUp size={12} />
  </span>
);
// ========================================
// MAIN
// ========================================

const Unit7_Page6_Q1 = () => {
  const [answers, setAnswers] = useState(emptyAnswers);
  // نتيجة كل سؤال بعد التشيك: { [id]: "correct" | "wrong" }
  const [results, setResults] = useState({});
  const [locked, setLocked] = useState(false);
  // الكلمة المختارة بالكيبورد (بانتظار اختيار الانبوت)
  const [selectedWord, setSelectedWord] = useState(null);
  const [playingKey, setPlayingKey] = useState(null);
  const [announcement, setAnnouncement] = useState("");

  const wordRefs = useRef({});
  const inputRefs = useRef({});
  const checkBtnRef = useRef(null);
  const audioOwner = useRef({}).current;

  // ========================================
  // AUDIO
  // ========================================

  const play = (key, src) => {
    if (!src) return;

    playGlobalAudio(src, {
      owner: audioOwner,
      onFinish: () => setPlayingKey(null),
    });

    setPlayingKey(key);
  };

  const stopAudio = () => {
    stopGlobalAudio(audioOwner);
    setPlayingKey(null);
  };

  // وقف الصوت إذا سكرت الصفحة
  useEffect(() => () => stopGlobalAudio(audioOwner), [audioOwner]);

  // ========================================
  // STATE HELPERS
  // ========================================

  const isWordUsed = (word) => Object.values(answers).includes(word);

  // الإجابة الصحيحة بعد التشيك بتتثبت، والغلط بيضل قابل للتعديل
  const isFixed = (id) => locked || results[id] === "correct";

  const isWrong = (id) => results[id] === "wrong";

  const clearResult = (id) =>
    setResults((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });

  const focusLater = (fn) => setTimeout(fn, 60);

  const focusWord = (word) => {
    focusLater(() => wordRefs.current[word]?.focus());
  };

  // بعد وضع كلمة: المؤشر يرجع لأول كلمة لسا متاحة، وإذا خلصت بيروح لزر Check
  const focusFirstAvailable = (nextAnswers) => {
    const nextWord = wordBank.find(
      (w) => !Object.values(nextAnswers).includes(w),
    );

    focusLater(() => {
      if (nextWord) wordRefs.current[nextWord]?.focus();
      else checkBtnRef.current?.focus();
    });
  };

  // ========================================
  // PLACE / REMOVE
  // ========================================

  const placeWord = (id, word, viaKeyboard = false) => {
    if (isFixed(id)) return;

    const next = { ...answers, [id]: word };

    setAnswers(next);
    clearResult(id);
    setSelectedWord(null);
    play(word, wordAudio[word]);
    setAnnouncement(`${word} placed in answer ${id}.`);

    if (viaKeyboard) focusFirstAvailable(next);
  };

  const removeWord = (id) => {
    if (isFixed(id)) return;

    const word = answers[id];

    if (!word) return;

    setAnswers((prev) => ({ ...prev, [id]: "" }));
    clearResult(id);
    setSelectedWord(null);
    setAnnouncement(`${word} returned to the word bank.`);
    focusWord(word);
  };

  // ========================================
  // DRAG & DROP (بدون تغيير على المنطق)
  // ========================================

  const onDragEnd = (result) => {
    if (!result.destination || locked) return;

    const word = result.draggableId;
    const dest = result.destination.droppableId;

    if (dest.startsWith("answer-")) {
      const id = dest.split("-")[1];

      // الإجابة الصحيحة المثبتة ما بتتغير
      if (results[id] === "correct") return;

      setAnswers((prev) => ({
        ...prev,
        [id]: word, // 👈 replace عادي
      }));
      clearResult(id);
      play(word, wordAudio[word]);
    }
  };

  // ========================================
  // KEYBOARD: WORDS
  // Enter / Space على الكلمة: بيختارها وبينقل المؤشر للانبوتات
  // ========================================

  const selectWord = (word) => {
    if (locked || isWordUsed(word)) return;

    play(word, wordAudio[word]);
    setSelectedWord(word);

    const target =
      questions.find((q) => !isFixed(q.id) && !answers[q.id]) ||
      questions.find((q) => !isFixed(q.id));

    if (!target) return;

    setAnnouncement(
      `${word} selected. Move to an answer field and press Enter to place it.`,
    );

    inputRefs.current[target.id]?.focus();
  };

  const handleWordKeyDown = (e, word) => {
    if (e.key === "Enter" || e.key === " ") {
      // preventDefault بيمنع الـ keyboard sensor تبع الـ dnd من خطف المسافة
      e.preventDefault();
      selectWord(word);
      return;
    }

    if (e.key === "Escape" && selectedWord) {
      e.preventDefault();
      setSelectedWord(null);
      setAnnouncement("Selection cancelled.");
    }
  };

  // ========================================
  // KEYBOARD / CLICK: INPUTS
  // - في كلمة مختارة: بتنحط بالانبوت
  // - ما في كلمة مختارة والانبوت فيه كلمة: بترجع للورد بانك
  // ========================================

  const activateInput = (q, viaKeyboard) => {
    if (isFixed(q.id)) return;

    if (selectedWord) {
      placeWord(q.id, selectedWord, viaKeyboard);
      return;
    }

    if (answers[q.id]) {
      removeWord(q.id);
      return;
    }

    setAnnouncement("Select a word from the word bank first.");
  };

  const handleInputKeyDown = (e, q) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activateInput(q, true);
      return;
    }

    if (e.key === "Escape" && selectedWord) {
      e.preventDefault();
      setSelectedWord(null);
      setAnnouncement("Selection cancelled.");
    }
  };

  // ========================================
  // CHECK
  // ========================================

  const checkAnswers = () => {
    if (locked) return;

    // ✅ إذا لم يملأ كل الإجابات
    if (Object.values(answers).includes("")) {
      ValidationAlert.info("Please complete all answers.");
      return;
    }

    let correct = 0;
    const nextResults = {};

    questions.forEach((q) => {
      const ok = normalize(answers[q.id]) === normalize(q.answer);

      nextResults[q.id] = ok ? "correct" : "wrong";

      if (ok) correct++;
    });

    const total = questions.length;

    let color = correct === total ? "green" : correct === 0 ? "red" : "orange";

    const message = `
    <div style="font-size:20px;text-align:center;">
      <b style="color:${color};">Score: ${correct} / ${total}</b>
    </div>
  `;

    setResults(nextResults);
    setSelectedWord(null);

    if (correct === total) {
      // كلهم صح: بنقفل كل شي
      setLocked(true);
      setAnnouncement(
        `Score ${correct} out of ${total}. All answers are correct.`,
      );
      ValidationAlert.success(message);
      return;
    }

    // في أخطاء: الصح بيتثبت والغلط بيضل قابل للتعديل
    setAnnouncement(
      `Score ${correct} out of ${total}. Fix the incorrect answers and check again.`,
    );

    if (correct === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);
  };

  // ========================================
  // RESET
  // ========================================

  const reset = () => {
    stopAudio();
    setAnswers(emptyAnswers);
    setResults({});
    setLocked(false);
    setSelectedWord(null);
    setAnnouncement("Activity reset. All answers are cleared.");
    focusWord(wordBank[0]);
  };

  // ========================================
  // SHOW ANSWER
  // ========================================

  const showAnswers = () => {
    stopAudio();

    const filled = {};
    questions.forEach((q) => {
      filled[q.id] = q.answer;
    });

    setAnswers(filled);
    setResults({});
    setSelectedWord(null);
    setLocked(true);
    setAnnouncement("All answers shown.");
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="main-container-component">
        {/* Screen Reader */}
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {announcement}
        </div>

        <div className="div-forall" style={{ gap: "30px" }}>
        <ExerciseHeader
          sectionLetter="D"
          title="Read and write."
          subTitle="Use the picture and word clues, then type the missing word or sentence carefully."
        />

          <div className="flex flex-col gap-8">
            {/* WORD BANK */}
            <Droppable droppableId="bank" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-wrap justify-center gap-4 p-2 rounded-lg"
                >
                  {wordBank.map((word, index) => {
                    const used = isWordUsed(word);
                    const isSelected = selectedWord === word;
                    const isPlaying = playingKey === word;

                    return (
                      <Draggable
                        key={word}
                        draggableId={word}
                        index={index}
                        isDragDisabled={locked || used}
                      >
                        {(provided) => (
                          <div
                            ref={(node) => {
                              provided.innerRef(node);
                              wordRefs.current[word] = node;
                            }}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            tabIndex={locked || used ? -1 : 0}
                            aria-describedby={undefined}
                            aria-label={
                              used
                                ? `${word}, already used`
                                : `${word}. Press Enter or Space to select it, then choose an answer field.`
                            }
                            aria-pressed={isSelected}
                            aria-disabled={locked || used}
                            onClick={() => {
                              if (!used) play(word, wordAudio[word]);
                            }}
                            onKeyDown={(e) => handleWordKeyDown(e, word)}
                            className={`relative px-4 py-2 border rounded-lg shadow transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb]
            ${isSelected ? "ring-4 ring-[#ffd54f]" : ""}
            ${
              used
                ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                : "bg-white cursor-grab hover:bg-gray-100"
            }
          `}
                          >
                            {/* 🔊 تظهر فقط إذا الكلمة مختارة أو صوتها شغّال */}
                            {word}

                            {(isSelected || isPlaying) && (
                              <SpeakerBadge active={isPlaying} />
                            )}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <div
              className="flex w-full"
              style={{ justifyContent: "space-between" }}
            >
              {/* QUESTIONS */}
              <div className="flex flex-col">
                {questions.map((q) => {
                  const fixed = isFixed(q.id);
                  const result = results[q.id];

                  return (
                    <div key={q.id} className="flex items-center gap-6 mb-8">
                      <div className="w-20 h-20 flex items-center justify-center">
                        {/* ⚠️ alt مؤقت: عدّليه حسب محتوى الصورة */}
                        <img
                          src={q.img}
                          alt={`Picture clue ${q.id}: day number ${q.number} of the week, counting from Sunday as day 1.`}
                          style={{ height: "120px", width: "auto" }}
                        />
                      </div>

                      <div className="text-lg">
                        <button
                          type="button"
                          onClick={() => play(`prompt-${q.id}`, promptAudio)}
                          aria-label="What day is it today? Press to listen."
                          className="relative text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb] rounded"
                          style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            font: "inherit",
                            cursor: "pointer",
                          }}
                        >
                          What day is it today?
                          {playingKey === `prompt-${q.id}` && (
                            <SpeakerBadge  />
                          )}
                        </button>

                        <div className="relative min-w-[250px] min-h-10">
                          {/* ✕ / ✓ */}
                          {result && (
                            <span
                              aria-hidden="true"
                              className={`absolute -top-2 -right-2 w-5 h-5 text-white rounded-full flex items-center justify-center text-xs font-bold ${
                                result === "wrong"
                                  ? "border-2 border-white shadow-md  bg-red-500"
                                  : ""
                              }`}
                            >
                              {result === "wrong" ? "✕" : ""}
                            </span>
                          )}

                          <Droppable
                            droppableId={`answer-${q.id}`}
                            isDropDisabled={fixed}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`h-10 border-b-2 flex items-center ${
                                  isWrong(q.id)
                                    ? "border-red-500"
                                    : result === "correct"
                                      ? "border-green-600"
                                      : "border-black"
                                }`}
                              >
                                <span
                                  className="relative"
                                  onClick={() =>
                                    play(`itis-${q.id}`, itIsAudio)
                                  }
                                  style={{ cursor: "pointer" }}
                                >
                                  It is
                                  {playingKey === `itis-${q.id}` && (
                                    <SpeakerBadge />
                                  )}
                                </span>

                                <input
                                  ref={(node) => {
                                    inputRefs.current[q.id] = node;
                                  }}
                                  readOnly
                                  value={answers[q.id]}
                                  tabIndex={fixed ? -1 : 0}
                                  aria-readonly="true"
                                  aria-label={`Answer ${q.id}. ${
                                    answers[q.id]
                                      ? `Contains ${answers[q.id]}.${
                                          fixed
                                            ? ""
                                            : " Press Enter to return it to the word bank."
                                        }`
                                      : "Empty. Select a word first, then press Enter here."
                                  }${
                                    result === "correct"
                                      ? " Correct."
                                      : result === "wrong"
                                        ? " Incorrect."
                                        : ""
                                  }`}
                                  onClick={() => activateInput(q, false)}
                                  onKeyDown={(e) => handleInputKeyDown(e, q)}
                                  className="flex-1 min-w-0 bg-transparent focus-visible:outline-4 focus-visible:outline-blue-600 focus-visible:outline-offset-2 rounded"
                                  style={{
                                    color: "red",
                                    border: "none",
                                    marginLeft: 6,
                                    font: "inherit",
                                    cursor: fixed
                                      ? "default"
                                      : answers[q.id]
                                        ? "pointer"
                                        : "text",
                                  }}
                                />

                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ⚠️ alt مؤقت: عدّليه حسب محتوى الصورة */}
              <img
                src={img4}
                alt="Weekly calendar showing the days of the week from Sunday to Saturday."
                style={{ height: "390px", width: "auto" }}
              />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="action-buttons-container">
            <button onClick={reset} className="try-again-button">
              Start Again ↻
            </button>
            <button
              onClick={showAnswers}
              className="show-answer-btn swal-continue"
            >
              Show Answer
            </button>
            <button
              ref={checkBtnRef}
              onClick={checkAnswers}
              className="check-button2"
            >
              Check Answer ✓
            </button>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Unit7_Page6_Q1;

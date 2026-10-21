/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useRef, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../../WorkBookPages/Button";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";

import img1 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 62/Ex B 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 62/Ex B 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 62/Ex B 3.svg";

// ========================================
// AUDIO (Page 62 - B)
// ========================================

import audioSentence from "../../../assets/audio/ClassBook/U 7/Page 62 - B/Item_001_It_is_a_quarter_past_five.mp3";
import audioThirty from "../../../assets/audio/ClassBook/U 7/Page 62 - B/Item_002_thirty.mp3";
import audioFour from "../../../assets/audio/ClassBook/U 7/Page 62 - B/Item_003_four.mp3";
import audioItIs from "../../../assets/audio/ClassBook/U 7/Page 62 - B/Item_004_It_is.mp3";
import audioTo from "../../../assets/audio/ClassBook/U 7/Page 62 - B/Item_005_to.mp3";
import audioQuarter from "../../../assets/audio/ClassBook/U 7/Page 62 - B/Item_006_quarter.mp3";
import audioTen from "../../../assets/audio/ClassBook/U 7/Page 62 - B/Item_007_ten.mp3";
import audioA from "../../../assets/audio/ClassBook/U 7/Page 62 - B/Item_008_a.mp3";
import audioOclock from "../../../assets/audio/ClassBook/U 7/Page 62 - B/Item_009_o'clock.mp3";
import ExerciseHeader from "../../ExerciseHeader";

// صوت كل كلمة بالـ word bank
const wordAudio = {
  thirty: audioThirty,
  four: audioFour,
  to: audioTo,
  quarter: audioQuarter,
  ten: audioTen,
  a: audioA,
  "o'clock": audioOclock,
};

// ========================================
// DATA
// ⚠️ الـ alt مكتوب بالتخمين من الجواب وأنا ما شفت الصور: عدّليهم حسب اللي بالصورة
// ========================================

const questions = [
  {
    id: 1,
    type: "complete",
    img: img1,
    alt: "A clock showing a quarter past five.",
    sentence: "It is a quarter past five.",
  },
  {
    id: 2,
    type: "twoWords",
    img: img2,
    alt: "A clock showing four thirty.",
    words: ["thirty", "four"],
    answer: "four thirty",
  },
  {
    id: 3,
    type: "scramble",
    img: img3,
    alt: "A clock showing a quarter to ten.",
    words: ["to", "quarter", "ten", "a", "o'clock"],
    answer: "a quarter to ten o'clock",
  },
];

// عدد الأسئلة اللي إلها جواب
const TOTAL = questions.filter((q) => q.answer).length;

// ========================================
// HELPERS (خارج الكومبوننت)
// ========================================

// Enter و Space بنعالجهم بإيدينا ونوقّف انتشار الحدث،
// لأن الكتاب غالباً عنده مستمع كيبورد عام بياخد هالمفتاحين
const isActivateKey = (e) => e.key === "Enter" || e.key === " ";

const stopActivateKeyUp = (e) => {
  if (!isActivateKey(e)) return;

  e.preventDefault();
  e.stopPropagation();
};

const activate = (action) => ({
  onClick: () => action(),
  onKeyDown: (e) => {
    if (!isActivateKey(e)) return;

    e.preventDefault();
    e.stopPropagation();

    if (!e.repeat) action();
  },
  onKeyUp: stopActivateKeyUp,
});

// سبيكر أسود داخل دائرة بيضا: بيظهر بس وقت ما الصوت شغّال
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

const Unit7_Page5_Q3 = () => {
  // { "slot-1": "four thirty", ... }
  const [answers, setAnswers] = useState({});

  // الأسئلة (index) اللي جوابها صح بعد Check (بتنقفل)
  const [lockedSet, setLockedSet] = useState(() => new Set());

  // الأسئلة (index) اللي جوابها غلط بعد آخر Check (بتضل قابلة للتعديل)
  const [wrongIds, setWrongIds] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  // الكلمة المختارة بالكيبورد: { qIndex, word } (بانتظار الانبوت)
  const [selected, setSelected] = useState(null);

  const [playingKey, setPlayingKey] = useState(null);
  const [announcement, setAnnouncement] = useState("");

  const wordRefs = useRef({});
  const slotRefs = useRef({});
  const audioOwner = useRef({}).current;

  const allDone = lockedSet.size === TOTAL;

  const isSlotLocked = (i) => showAnswer || lockedSet.has(i);

  const slotKey = (i) => `slot-${i}`;

  const usedWords = (i) => (answers[slotKey(i)] || "").split(" ");

  // ========================================
  // AUDIO
  // ========================================

  const stopAudio = () => {
    stopGlobalAudio(audioOwner);
    setPlayingKey(null);
  };

  // playGlobalAudio بيوقف أي صوت ثاني شغّال قبل ما يشغّل هاد
  const playAudio = (key, src) => {
    if (!src) return;

    playGlobalAudio(src, {
      owner: audioOwner,
      onFinish: () => setPlayingKey((prev) => (prev === key ? null : prev)),
    });

    setPlayingKey(key);
  };

  // وقف الصوت إذا سكرت الصفحة
  useEffect(() => () => stopGlobalAudio(audioOwner), [audioOwner]);

  // فوكس بالتاب = شغّل الصوت (الماوس/اللمس بيروحوا على onClick)
  const onFocusPlay = (e, play) => {
    if (e.currentTarget.matches(":focus-visible")) play();
  };

  const focusSoon = (el) => {
    requestAnimationFrame(() => el?.focus());
  };

  // ========================================
  // DRAG & DROP (متل ما كان)
  // ========================================

  const onDragStart = () => {
    setSelected(null);
  };

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;

    if (!destination || showAnswer) return;

    const word = draggableId.replace("word-", "");
    const key = destination.droppableId;

    if (!key.startsWith("slot-")) return;

    const i = Number(key.split("-")[1]);

    // الانبوت المقفول، أو كلمة مش من كلمات هالسؤال: بنتجاهلها
    if (Number.isNaN(i) || isSlotLocked(i)) return;
    if (!questions[i].words?.includes(word)) return;

    setAnswers((prev) => ({
      ...prev,
      [key]: prev[key] ? prev[key] + " " + word : word,
    }));

    setWrongIds((prev) => prev.filter((id) => id !== i));

    setAnnouncement(`${word} placed in the answer for question ${i + 1}.`);
  };

  // ========================================
  // KEYBOARD / CLICK: كلمة من البنك
  // Enter / Space: بيختار الكلمة وبينقل الفوكس مباشرة للانبوت
  // ========================================

  const onWordActivate = (i, word) => {
    if (showAnswer) return;

    playAudio(`w:${word}`, wordAudio[word]);

    if (isSlotLocked(i)) return;

    if (usedWords(i).includes(word)) {
      setAnnouncement(
        `${word} is already in the answer. Press the answer to clear it.`,
      );
      return;
    }

    setSelected({ qIndex: i, word });

    setAnnouncement(
      `${word} selected. Press Enter on the answer line to put it there, or press Escape to cancel.`,
    );

    focusSoon(slotRefs.current[i]);
  };

  const onWordKeyDown = (e, i, word) => {
    if (!isActivateKey(e)) return;

    e.preventDefault();
    e.stopPropagation();

    if (!e.repeat) onWordActivate(i, word);
  };

  // الماوس: بس بيشغّل الصوت (السحب شغال متل ما كان). click من قارئ الشاشة (detail 0) = اختيار
  const onWordClick = (e, i, word) => {
    if (e.defaultPrevented) return;

    if (e.detail === 0) onWordActivate(i, word);
    else playAudio(`w:${word}`, wordAudio[word]);
  };

  // ========================================
  // KEYBOARD / CLICK: الانبوت
  // - في كلمة مختارة: بتنحط بالانبوت والفوكس بيرجع للبنك
  // - ما في كلمة مختارة: Enter / Space بيمسح الجواب (متل الكليك)، Backspace بيشيل آخر كلمة
  // ========================================

  const clearSlot = (i) => {
    if (isSlotLocked(i) || !answers[slotKey(i)]) return;

    setAnswers((prev) => {
      const updated = { ...prev };
      delete updated[slotKey(i)];
      return updated;
    });

    setWrongIds((prev) => prev.filter((id) => id !== i));
    setAnnouncement(
      `The answer for question ${i + 1} is cleared. The words are back in the word bank.`,
    );
  };

  const removeLastWord = (i) => {
    const current = answers[slotKey(i)];

    if (isSlotLocked(i) || !current) return;

    const parts = current.split(" ");
    const last = parts.pop();

    setAnswers((prev) => {
      const updated = { ...prev };

      if (parts.length) updated[slotKey(i)] = parts.join(" ");
      else delete updated[slotKey(i)];

      return updated;
    });

    setWrongIds((prev) => prev.filter((id) => id !== i));
    setAnnouncement(`${last} returned to the word bank.`);
  };

  const placeSelected = (i) => {
    const { word } = selected;
    const key = slotKey(i);
    const nextText = answers[key] ? `${answers[key]} ${word}` : word;

    setAnswers((prev) => ({ ...prev, [key]: nextText }));
    setWrongIds((prev) => prev.filter((id) => id !== i));
    setSelected(null);

    // الفوكس بيرجع للبنك على الكلمة اللي بعدها (اللي لسا ما انحطت)
    const q = questions[i];
    const used = new Set(nextText.split(" "));
    const start = q.words.indexOf(word);
    let next = null;

    for (let k = 1; k <= q.words.length; k += 1) {
      const candidate = q.words[(start + k) % q.words.length];

      if (!used.has(candidate)) {
        next = candidate;
        break;
      }
    }

    setAnnouncement(
      `${word} placed. The answer is: ${nextText}.${
        next ? "" : " All words are placed. Press Check Answer."
      }`,
    );

    if (next) focusSoon(wordRefs.current[`${i}-${next}`]);
  };

  const onSlotKeyDown = (e, i) => {
    if (isSlotLocked(i)) return;

    if (isActivateKey(e)) {
      e.preventDefault();
      e.stopPropagation();

      if (e.repeat) return;

      if (selected) {
        if (selected.qIndex === i) {
          placeSelected(i);
        } else {
          setAnnouncement(
            `${selected.word} belongs to question ${selected.qIndex + 1}. Press Escape to cancel the selection.`,
          );
        }
      } else if (answers[slotKey(i)]) {
        clearSlot(i);
      } else {
        setAnnouncement(
          "This answer is empty. Select a word from the word bank first.",
        );
      }

      return;
    }

    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      e.stopPropagation();
      removeLastWord(i);
    }
  };

  // Escape: بيلغي الاختيار وبيرجّع الفوكس للكلمة
  const handleWrapperKeyDown = (e) => {
    if (e.key !== "Escape" || !selected) return;

    const { qIndex, word } = selected;

    setSelected(null);
    setAnnouncement("Selection cancelled.");
    focusSoon(wordRefs.current[`${qIndex}-${word}`]);
  };

  // ========================================
  // CHECK
  // الصح بينقفل (أخضر)، الغلط بيضل ✕ وبيقدر الطالب يعدّله
  // ========================================

  const checkAnswers = () => {
    if (showAnswer || allDone) return;

    stopAudio();
    setSelected(null);

    const targets = questions
      .map((q, i) => ({ q, i }))
      .filter(({ q }) => q.answer);

    if (targets.some(({ i }) => !answers[slotKey(i)])) {
      const msg = "Please complete all answers.";

      ValidationAlert.info("Oops!", msg);
      setAnnouncement(msg);
      return;
    }

    const nextLocked = new Set(lockedSet);
    const nextWrong = [];

    targets.forEach(({ q, i }) => {
      if (nextLocked.has(i)) return;

      if (answers[slotKey(i)] === q.answer) nextLocked.add(i);
      else nextWrong.push(i);
    });

    const score = nextLocked.size;

    setLockedSet(nextLocked);
    setWrongIds(nextWrong);

    setAnnouncement(
      [
        `Score ${score} out of ${TOTAL}.`,
        nextWrong.length
          ? `Question ${nextWrong.map((i) => i + 1).join(", ")} ${
              nextWrong.length > 1 ? "are" : "is"
            } not correct. You can change ${
              nextWrong.length > 1 ? "them" : "it"
            } and check again.`
          : "All answers are correct.",
      ].join(" "),
    );

    const color = score === TOTAL ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
        Score: ${score} / ${TOTAL}
        </span>
      </div>
    `;

    if (score === TOTAL) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  // ========================================
  // SHOW ANSWER / START AGAIN
  // ========================================

  const showAnswers = () => {
    stopAudio();
    setSelected(null);

    const correct = {};

    questions.forEach((q, i) => {
      if (q.answer) {
        correct[slotKey(i)] = q.answer;
      }
    });

    setAnswers(correct);
    setLockedSet(new Set());
    setWrongIds([]);
    setShowAnswer(true);

    setAnnouncement("All answers shown. Every answer line has the correct words.");
  };

  // بيمسح كل الأجوبة، علامات ✕، القفل، النتيجة، والصوت
  const reset = () => {
    stopAudio();
    setSelected(null);

    setAnswers({});
    setLockedSet(new Set());
    setWrongIds([]);
    setShowAnswer(false);

    setAnnouncement("Activity reset. All answers and results are cleared.");
  };

  // ✅ check wrong
  const isWrong = (i) => wrongIds.includes(i);

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="main-container-component" onKeyDown={handleWrapperKeyDown}>
        {/* Screen Reader */}
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {announcement}
        </div>

        <div className="div-forall" style={{ gap: "20px" }}>
        <ExerciseHeader
          sectionLetter="B"
          // questionNumber={1}
          title="Look and write."
          subTitle="Read the time clue, set the numbers carefully, then choose the matching time box."
        /> 

          <p id="u7p5q3-help" className="sr-only">
            Look at each picture and write the time. Press a sentence or a word
            to hear it. To use the keyboard, press Tab to reach a word in the
            word bank, then press Enter or Space. The word is selected and focus
            moves to the answer line. Press Enter or Space on the answer line to
            put the word there, and focus goes back to the word bank. Press
            Backspace on the answer line to remove the last word, or Enter to
            clear it. Press Escape to cancel a selection. You can also drag the
            words with the mouse or your finger. After Check Answer, correct
            answers are locked and wrong answers can be changed.
          </p>

          <div className="flex flex-col gap-3">
            {questions.map((q, i) => {
              const slotLocked = isSlotLocked(i);
              const isCorrect = lockedSet.has(i) || showAnswer;
              const isTarget = selected?.qIndex === i && !slotLocked;
              const content = answers[slotKey(i)];

              const slotLabel = `Answer for question ${q.id}. ${
                showAnswer
                  ? `Answer shown: ${content}.`
                  : lockedSet.has(i)
                    ? `Correct. ${content}. Locked.`
                    : isTarget
                      ? `${
                          content ? `Contains ${content}. ` : "Empty. "
                        }Press Enter to put ${selected.word} here.`
                      : content
                        ? `${isWrong(i) ? "Not correct. " : ""}Contains ${content}. Press Enter to clear it, or Backspace to remove the last word.`
                        : "Empty."
              }`;

              return (
                <div
                  key={i}
                  className="flex flex-col gap-4 w-full max-w-[800px]"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-[22px] w-5">{q.id}</span>

                    {q.type === "complete" && (
                      <div className="flex items-center gap-4">
                        <img
                          src={q.img}
                          alt={q.alt}
                          className="w-[110px]! h-[110px]! object-contain"
                        />

                        {/* الجملة: بتشغّل صوتها */}
                        <span
                          role="button"
                          tabIndex={0}
                          aria-label={`Sentence: ${q.sentence} Press to hear it.`}
                          onFocus={(e) =>
                            onFocusPlay(e, () =>
                              playAudio(`s:${q.id}`, audioSentence),
                            )
                          }
                          className="relative cursor-pointer rounded-md focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb]"
                          {...activate(() =>
                            playAudio(`s:${q.id}`, audioSentence),
                          )}
                        >
                          {q.sentence}

                          {/* 🔊 السبيكر بيظهر بس وقت ما الصوت شغّال */}
                          {playingKey === `s:${q.id}` && <SpeakerBadge />}
                        </span>
                      </div>
                    )}

                    {q.type !== "complete" && (
                      <div className="w-full flex flex-col gap-3">
                        {/* WORD BANK */}
                        <div className="flex items-center gap-4">
                          <img
                            src={q.img}
                            alt={q.alt}
                            className="w-[110px]! h-[110px]! object-contain"
                          />
                          <div
                            className="border-2 border-dashed border-gray-400 rounded-lg p-2 w-full"
                            aria-describedby="u7p5q3-help"
                          >
                            {q.words && (
                              <Droppable
                                droppableId={`bank-${i}`}
                                direction="horizontal"
                                isDropDisabled
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="flex gap-4 justify-center items-center w-full"
                                  >
                                    {q.words.map((w, index) => {
                                      const used = usedWords(i).includes(w);
                                      const isSelected =
                                        selected?.qIndex === i &&
                                        selected.word === w;

                                      return (
                                        <Draggable
                                          key={w}
                                          draggableId={`word-${w}`}
                                          index={index}
                                          isDragDisabled={slotLocked || used}
                                        >
                                          {(provided) => (
                                            // العنصر الخارجي هو اللي بياخد الفوكس والكيبورد،
                                            // وطبقة السحب (dragHandle) جواته: هيك Space ما بيشغّل
                                            // سحب الكيبورد الافتراضي تبع المكتبة
                                            <span
                                              ref={(el) => {
                                                provided.innerRef(el);
                                                wordRefs.current[`${i}-${w}`] =
                                                  el;
                                              }}
                                              {...provided.draggableProps}
                                              role="button"
                                              tabIndex={
                                                used || slotLocked ? -1 : 0
                                              }
                                              aria-disabled={used}
                                              aria-pressed={isSelected}
                                              aria-label={
                                                used
                                                  ? `Word: ${w}. Already in the answer.`
                                                  : `Word: ${w}. Press Enter to select it and put it in the answer.`
                                              }
                                              onFocus={(e) =>
                                                onFocusPlay(e, () =>
                                                  playAudio(
                                                    `w:${w}`,
                                                    wordAudio[w],
                                                  ),
                                                )
                                              }
                                              onClick={(e) =>
                                                onWordClick(e, i, w)
                                              }
                                              onKeyDown={(e) =>
                                                onWordKeyDown(e, i, w)
                                              }
                                              onKeyUp={stopActivateKeyUp}
                                              style={{
                                                position: "relative",
                                                ...provided.draggableProps
                                                  .style,
                                              }}
                                              className={`px-4 py-2 rounded-lg transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb]
                                            ${
                                              used
                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                                                : isSelected
                                                  ? "bg-blue-300 ring-2 ring-red-500 cursor-grab"
                                                  : "bg-blue-200 cursor-grab hover:bg-blue-300"
                                            }
                                          `}
                                            >
                                              {w}

                                              {/* طبقة السحب بالماوس / اللمس */}
                                              <span
                                                {...provided.dragHandleProps}
                                                tabIndex={undefined}
                                                role={undefined}
                                                aria-describedby={undefined}
                                                style={{
                                                  position: "absolute",
                                                  inset: 0,
                                                  cursor: "inherit",
                                                }}
                                              />

                                              {/* 🔊 السبيكر بيظهر بس وقت ما الصوت شغّال */}
                                              {playingKey === `w:${w}` && (
                                                <SpeakerBadge />
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
                            )}
                          </div>
                        </div>

                        {/* ANSWER */}
                        <div className="flex w-full text-lg font-bold">
                          {/* "It is": بتشغّل صوتها */}
                          <span
                            role="button"
                            tabIndex={0}
                            aria-label="It is. Press to hear it."
                            onFocus={(e) =>
                              onFocusPlay(e, () =>
                                playAudio(`i:${q.id}`, audioItIs),
                              )
                            }
                            className="relative cursor-pointer rounded-md focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb]"
                            {...activate(() =>
                              playAudio(`i:${q.id}`, audioItIs),
                            )}
                          >
                            It is
                            {playingKey === `i:${q.id}` && <SpeakerBadge />}
                          </span>

                          <Droppable
                            droppableId={`slot-${i}`}
                            isDropDisabled={slotLocked}
                          >
                            {(provided) => (
                              <div className="relative flex-1 h-[35px]">
                                {/* ❌ */}
                                {isWrong(i) && (
                                  <span
                                    aria-hidden="true"
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-md"
                                  >
                                    ✕
                                  </span>
                                )}

                                <div
                                  ref={(el) => {
                                    provided.innerRef(el);
                                    slotRefs.current[i] = el;
                                  }}
                                  {...provided.droppableProps}
                                  role="button"
                                  tabIndex={slotLocked ? -1 : 0}
                                  aria-label={slotLabel}
                                  aria-disabled={slotLocked}
                                  aria-describedby="u7p5q3-help"
                                  onKeyDown={(e) => onSlotKeyDown(e, i)}
                                  onKeyUp={stopActivateKeyUp}
                                  className={`border-b-1 h-full focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb] ${
                                    isCorrect
                                      ? "border-[#4caf50]"
                                      : isWrong(i)
                                        ? "border-red-500"
                                        : "border-black"
                                  }`}
                                  style={
                                    isTarget
                                      ? {
                                          boxShadow:
                                            "0 0 0 4px rgba(37,99,235,.45)",
                                        }
                                      : undefined
                                  }
                                >
                                  {content && (
                                    <span
                                      className="text-blue-800 cursor-pointer mx-2"
                                      onClick={() => clearSlot(i)}
                                    >
                                      {content}
                                    </span>
                                  )}

                                  {provided.placeholder}
                                </div>
                              </div>
                            )}
                          </Droppable>

                          <span>.</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BUTTONS */}
        <Button
          handleShowAnswer={showAnswers}
          handleStartAgain={reset}
          checkAnswers={checkAnswers}
        />
      </div>
    </DragDropContext>
  );
};

export default Unit7_Page5_Q3;
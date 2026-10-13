/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useRef, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import "./Review5_Page2_Q3.css";

import bee from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 53/EX G 1.svg";
import tea from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 53/EX G 2.svg";
import sleep from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 53/EX G 3.svg";
import read from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 53/EX G 4.svg";

import sBee from "../../../assets/audio/ClassBook/U 6/Page 53 - G/Item_001_bee.mp3";
import sTea from "../../../assets/audio/ClassBook/U 6/Page 53 - G/Item_002_tea.mp3";
import sSleep from "../../../assets/audio/ClassBook/U 6/Page 53 - G/Item_003_sleep.mp3";
import sRead from "../../../assets/audio/ClassBook/U 6/Page 53 - G/Item_004_read.mp3";
import sThe from "../../../assets/audio/ClassBook/U 6/Page 53 - G/Item_005_The.mp3";
import sLandsInThe from "../../../assets/audio/ClassBook/U 6/Page 53 - G/Item_006_lands_in_the.mp3";
import sI from "../../../assets/audio/ClassBook/U 6/Page 53 - G/Item_007_I.mp3";
import sAfterI from "../../../assets/audio/ClassBook/U 6/Page 53 - G/Item_008_after_I.mp3";
import sABook from "../../../assets/audio/ClassBook/U 6/Page 53 - G/Item_009_a_book.mp3";
import ExerciseHeader from "../../ExerciseHeader";

// ================================
// DATA
// ⚠️ الـ alt مكتوب بالتخمين من الكلمات وأنا ما شفت الصور: عدّليهم حسب اللي بالصورة
// ================================
const questions = [
  {
    id: 1,
    parts: [
      { type: "text", value: "The", sound: sThe },
      { type: "blank", answer: "bee", sound: sBee },
      { type: "img", src: bee, alt: "A bee." },
      { type: "text", value: "lands in the", sound: sLandsInThe },
      { type: "blank", answer: "tea", sound: sTea },
      { type: "img", src: tea, alt: "A cup of tea." },
      { type: "text", value: "." },
    ],
  },
  {
    id: 2,
    parts: [
      { type: "text", value: "I", sound: sI },
      { type: "blank", answer: "sleep", sound: sSleep },
      { type: "img", src: sleep, alt: "A child sleeping." },
      { type: "text", value: "after I", sound: sAfterI },
      { type: "blank", answer: "read", sound: sRead },
      { type: "img", src: read, alt: "A child reading a book." },
      { type: "text", value: "a book.", sound: sABook },
    ],
  },
];

const options = ["read","bee","sleep", "tea"  ];

// صوت كل كلمة بالـ Word Bank
const WORD_SOUNDS = { bee: sBee, tea: sTea, sleep: sSleep, read: sRead };

// كل الـ blanks مع جوابها (نفس الترتيب اللي بالجمل)
const BLANKS = [];

questions.forEach((q, qIndex) => {
  q.parts.forEach((p, pIndex) => {
    if (p.type === "blank") {
      BLANKS.push({ slot: `slot-${qIndex}-${pIndex}`, answer: p.answer });
    }
  });
});

// ================================
// HELPERS (خارج الكومبوننت)
// ================================

// Enter و Space بنعالجهم بإيدينا ونوقّف انتشار الحدث،
// لأن الكتاب غالباً عنده مستمع كيبورد عام بياخد هالمفتاحين
const isActivateKey = (e) => e.key === "Enter" || e.key === " ";

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
      zIndex: 3,
      lineHeight: 1,
      background: "#fff",
      color: "#000",
      boxShadow: "0 1px 3px rgba(0,0,0,.25)",
    }}
  >
    <FaVolumeUp size={12} />
  </span>
);

const Review5_Page2_Q4 = () => {
  // { slotId: "الكلمة" }
  const [answers, setAnswers] = useState({});

  // الـ blanks اللي جوابها صح بعد Check (بتنقفل)
  const [lockedSet, setLockedSet] = useState(() => new Set());

  // الـ blanks اللي جوابها غلط بعد آخر Check (بتضل قابلة للتعديل)
  const [wrongSlots, setWrongSlots] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  // الكلمة اللي الطالب اختارها بالكيبورد (Enter) وبتستنى تنحط بخانة
  const [pickedWord, setPickedWord] = useState(null);

  // مفتاح العنصر اللي صوته شغّال هلأ (عشان السبيكر)
  const [playingKey, setPlayingKey] = useState(null);

  const [announcement, setAnnouncement] = useState("");

  const audioRef = useRef(null);
  const chipRefs = useRef({});
  const blankRefs = useRef({});
  const skipFocusSound = useRef(false);

  const allDone = lockedSet.size === BLANKS.length;
  const allLocked = showAnswer || allDone;

  const isLocked = (slot) => showAnswer || lockedSet.has(slot);

  // الكلمة بتعتبر "مستخدمة" إذا كانت بخانة مش غلط (الكلمة اللي بخانة غلط بتصير متاحة من جديد)
  const isWordUsed = (word, currentAnswers = answers, wrong = wrongSlots) =>
    Object.entries(currentAnswers).some(
      ([slot, w]) => w === word && !wrong.includes(slot),
    );

  // ================================
  // AUDIO (صوت واحد بس بنفس الوقت)
  // ================================

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.pause();

      try {
        audioRef.current.currentTime = 0;
      } catch {
        /* ما في مشكلة */
      }

      audioRef.current = null;
    }

    setPlayingKey(null);
  };

  // بيوقف أي مشغّل صوت ثاني بالصفحة
  const pauseOtherAudio = () => {
    document.querySelectorAll("audio").forEach((el) => el.pause());
  };

  const playSound = (key, src) => {
    if (!src) return;

    stopAudio();
    pauseOtherAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    audio.onended = () => {
      audioRef.current = null;
      setPlayingKey(null);
    };

    setPlayingKey(key);

    audio.play().catch(() => {
      audioRef.current = null;
      setPlayingKey(null);
    });
  };

  // لما تسكر الصفحة: وقّف الصوت
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.onended = null;
        audioRef.current.pause();
      }
    };
  }, []);

  // فوكس بالتاب = شغّل الصوت (الماوس/اللمس بيروحوا على onClick)
  const onTabFocus = (e, key, src) => {
    // لما نرجّع الفوكس للكلمات برمجياً بعد الوضع، ما بنشغّل صوت
    if (skipFocusSound.current) {
      skipFocusSound.current = false;
      return;
    }

    if (e.currentTarget.matches(":focus-visible")) playSound(key, src);
  };

  // ================================
  // PLACE WORD (مشترك بين الدراق والكيبورد)
  // ================================

  const placeWord = (slot, word) => {
    const updated = { ...answers };
    const cleared = [];

    // ❌ حذف الكلمة من أي slot سابق (ما عدا الخانات المقفولة)
    Object.keys(updated).forEach((key) => {
      if (updated[key] === word && !isLocked(key)) {
        delete updated[key];
        cleared.push(key);
      }
    });

    updated[slot] = word;

    setAnswers(updated);

    // الخانة اللي انعدّلت: بتنشال علامة ✕
    setWrongSlots((prev) =>
      prev.filter((s) => s !== slot && !cleared.includes(s)),
    );

    return updated;
  };

  // ================================
  // DRAG & DROP (متل ما هو)
  // ================================

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;

    if (!destination || destination.droppableId === "bank") return;

    if (isLocked(destination.droppableId)) return;

    const word = draggableId.replace("word-", "");

    placeWord(destination.droppableId, word);

    setPickedWord(null);
    setAnnouncement(`${word} placed in the blank.`);
  };

  // ================================
  // KEYBOARD: Enter على الكلمة -> الفوكس بينتقل للخانات
  //           Enter/Space على الخانة -> بتنحط الكلمة والفوكس بيرجع للكلمات
  // ================================

  const getTargetBlank = () =>
    BLANKS.find((b) => !isLocked(b.slot) && !answers[b.slot]) ||
    BLANKS.find((b) => !isLocked(b.slot));

  const pickWord = (word) => {
    playSound(`word-${word}`, WORD_SOUNDS[word]);

    if (allLocked) {
      setAnnouncement("The answers are locked. Press Start Again to try again.");
      return;
    }

    if (isWordUsed(word)) {
      setAnnouncement(`${word} is already used.`);
      return;
    }

    const target = getTargetBlank();

    if (!target) return;

    setPickedWord(word);
    setAnnouncement(
      `${word} chosen. Press Enter or Space on a blank to place it.`,
    );

    blankRefs.current[target.slot]?.focus();
  };

  const focusWordBank = (word, updated, slot) => {
    const wrong = wrongSlots.filter((s) => s !== slot);

    const next =
      options.find((w) => !isWordUsed(w, updated, wrong)) || word;

    // بنرجّع الفوكس بعد ما ينعمل الرندر
    setTimeout(() => {
      skipFocusSound.current = true;
      chipRefs.current[next]?.focus();
      skipFocusSound.current = false;
    }, 0);
  };

  const onBlankKeyDown = (e, slot, q, blankNo) => {
    // Tab و Shift+Tab بيشتغلوا عادي
    if (e.key === "Tab") return;

    if (isActivateKey(e)) {
      e.preventDefault();
      e.stopPropagation();

      if (e.repeat) return;

      if (isLocked(slot)) {
        setAnnouncement(
          lockedSet.has(slot)
            ? `Question ${q.id}, blank ${blankNo} is correct and locked.`
            : "The answers are locked. Press Start Again to try again.",
        );
        return;
      }

      if (!pickedWord) {
        setAnnouncement(
          "Choose a word first. Go to a word and press Enter.",
        );
        return;
      }

      const word = pickedWord;
      const updated = placeWord(slot, word);

      setPickedWord(null);
      setAnnouncement(
        `${word} placed in question ${q.id}, blank ${blankNo}.`,
      );

      focusWordBank(word, updated, slot);
      return;
    }

    // Delete / Backspace: بيمسح الكلمة من الخانة (قبل ما تنقفل)
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      e.stopPropagation();

      if (isLocked(slot) || !answers[slot]) return;

      const removed = answers[slot];

      setAnswers((prev) => {
        const next = { ...prev };
        delete next[slot];
        return next;
      });
      setWrongSlots((prev) => prev.filter((s) => s !== slot));

      setAnnouncement(`${removed} removed from question ${q.id}, blank ${blankNo}.`);
      return;
    }

    // Escape: بيلغي اختيار الكلمة
    if (e.key === "Escape" && pickedWord) {
      e.preventDefault();
      e.stopPropagation();

      setPickedWord(null);
      setAnnouncement("Choice cancelled.");
    }
  };

  // ================================
  // CHECK
  // الصح بينقفل (أخضر ✓)، الغلط بيضل ✕ وبيقدر الطالب يعدّله
  // ================================

  const checkAnswers = () => {
    if (showAnswer || allDone) return;

    stopAudio();
    pauseOtherAudio();

    // 1) فحص الخانات الفارغة
    if (BLANKS.some((b) => !lockedSet.has(b.slot) && !answers[b.slot])) {
      const msg = "Please complete all answers";

      ValidationAlert.info(msg);
      setAnnouncement(msg);
      return;
    }

    // 2) مقارنة الإجابات
    const nextLocked = new Set(lockedSet);
    const nextWrong = [];

    BLANKS.forEach((b) => {
      if (nextLocked.has(b.slot)) return;

      if (answers[b.slot] === b.answer) nextLocked.add(b.slot);
      else nextWrong.push(b.slot);
    });

    setLockedSet(nextLocked);
    setWrongSlots(nextWrong);
    setPickedWord(null);

    // 3) حساب السكور
    const score = nextLocked.size;
    const total = BLANKS.length;

    // الفيدباك المحكي: كل خانة صح أو غلط
    setAnnouncement(
      [
        `Score ${score} out of ${total}.`,
        ...BLANKS.map(
          (b, i) =>
            `Blank ${i + 1} is ${
              nextLocked.has(b.slot) ? "correct" : "not correct"
            }.`,
        ),
        nextWrong.length
          ? "You can change the wrong answers and check again."
          : "",
      ]
        .filter(Boolean)
        .join(" "),
    );

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
        Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  // ================================
  // SHOW ANSWER / START AGAIN
  // ================================

  const show = () => {
    if (showAnswer) return;

    stopAudio();
    pauseOtherAudio();

    const correct = {};

    BLANKS.forEach((b) => {
      correct[b.slot] = b.answer;
    });

    setAnswers(correct);
    setLockedSet(new Set());
    setWrongSlots([]);
    setPickedWord(null);
    setShowAnswer(true);

    setAnnouncement("All answers shown. Every blank is filled in.");
  };

  // بيمسح كل الخانات، الفيدباك، القفل، والسكور، وبيوقف الصوت
  const reset = () => {
    stopAudio();
    pauseOtherAudio();

    setAnswers({});
    setLockedSet(new Set());
    setWrongSlots([]);
    setPickedWord(null);
    setShowAnswer(false);

    setAnnouncement("Activity reset. All answers and results are cleared.");
  };

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

        <div className="div-forall">
         <ExerciseHeader
          sectionLetter="G"
          title="Read, look, and complete the sentences."
          subTitle="Use the picture and word clues, then type the missing word or sentence carefully."
          isReview={true}
        />

          <p id="r5p2q4-help" className="sr-only">
            Read the sentences and complete them. Press Tab to move through the
            words, the sentences, and the blanks. Press Enter on a word to
            choose it. The focus moves to the blanks. Press Enter or Space on a
            blank to place the word. The focus goes back to the words. Press
            Delete on a blank to remove its word. You can also drag a word into
            a blank. Press Check Answer to check. Correct answers are locked
            and wrong answers can be changed.
          </p>

          <div className="flex flex-col gap-5">
            {/* WORD BANK */}

            <Droppable droppableId="bank" direction="horizontal" isDropDisabled>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex gap-10 justify-center p-4 rounded-lg"
                >
                  {options.map((word, i) => {
                    const isUsed = isWordUsed(word);

                    return (
                      <Draggable
                        key={word}
                        draggableId={`word-${word}`}
                        index={i}
                        isDragDisabled={allLocked || isUsed}
                      >
                        {(provided) => (
                          <span
                            ref={(el) => {
                              provided.innerRef(el);
                              chipRefs.current[word] = el;
                            }}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            aria-pressed={pickedWord === word}
                            aria-label={`${word}. Press Enter to choose it, then press Enter on a blank to place it.`}
                            onClick={() =>
                              playSound(`word-${word}`, WORD_SOUNDS[word])
                            }
                            onFocus={(e) =>
                              onTabFocus(e, `word-${word}`, WORD_SOUNDS[word])
                            }
                            onKeyDown={(e) => {
                              if (e.key !== "Enter") return;

                              e.preventDefault();
                              e.stopPropagation();

                              if (!e.repeat) pickWord(word);
                            }}
                            className={`relative px-3.5 py-1.5 border-2 border-[#2c5287] rounded-lg font-bold bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb]
    ${isUsed ? "opacity-40" : ""}
    ${pickedWord === word ? "ring-4 ring-[#2563eb]" : ""}
    ${allLocked ? "cursor-not-allowed" : "cursor-grab"}
  `}
                          >
                            {word}

                            {playingKey === `word-${word}` && <SpeakerBadge />}
                          </span>
                        )}
                      </Draggable>
                    );
                  })}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* SENTENCES */}

            <div className="flex flex-col">
              {questions.map((q, qIndex) => (
                <div
                  key={qIndex}
                  className="flex items-center gap-5 text-[20px] mb-[50px]"
                >
                  <span className="font-bold">{q.id}</span>

                  {q.parts.map((part, pIndex) => {
                    // الجزء الثابت: لو إله صوت بيشتغل بالكليك/التاب/Enter/Space
                    if (part.type === "text") {
                      if (!part.sound) {
                        return <span key={pIndex}>{part.value}</span>;
                      }

                      const key = `text-${qIndex}-${pIndex}`;

                      return (
                        <span
                          key={pIndex}
                          role="button"
                          tabIndex={0}
                          aria-label={`${part.value} Press to hear it.`}
                          className="relative inline-block cursor-pointer rounded px-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb]"
                          onClick={() => playSound(key, part.sound)}
                          onFocus={(e) => onTabFocus(e, key, part.sound)}
                          onKeyDown={(e) => {
                            if (!isActivateKey(e)) return;

                            e.preventDefault();
                            e.stopPropagation();

                            if (!e.repeat) playSound(key, part.sound);
                          }}
                          onKeyUp={(e) => {
                            if (!isActivateKey(e)) return;

                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          {part.value}

                          {playingKey === key && <SpeakerBadge />}
                        </span>
                      );
                    }

                    if (part.type === "img") {
                      return (
                        <img
                          key={pIndex}
                          src={part.src}
                          alt={part.alt}
                          style={{
                            maxWidth: "120px",
                            width: "100%",
                            height: "auto",
                            objectFit: "contain",
                          }}
                        />
                      );
                    }

                    if (part.type === "blank") {
                      const slotId = `slot-${qIndex}-${pIndex}`;

                      const blankNo =
                        q.parts
                          .slice(0, pIndex)
                          .filter((p) => p.type === "blank").length + 1;

                      const status = showAnswer
                        ? "shown"
                        : lockedSet.has(slotId)
                          ? "correct"
                          : wrongSlots.includes(slotId)
                            ? "wrong"
                            : null;

                      const replayKey = `blank-${slotId}`;

                      const result =
                        status === "correct"
                          ? " Correct."
                          : status === "shown"
                            ? " Correct answer."
                            : status === "wrong"
                              ? " Not correct. Choose another word to change it."
                              : "";

                      return (
                        <Droppable
                          droppableId={slotId}
                          key={pIndex}
                          isDropDisabled={isLocked(slotId)}
                        >
                          {(provided, snapshot) => (
                            <div className="relative flex items-center gap-2">
                              <div
                                ref={(el) => {
                                  provided.innerRef(el);
                                  blankRefs.current[slotId] = el;
                                }}
                                {...provided.droppableProps}
                                role="button"
                                tabIndex={0}
                                aria-disabled={isLocked(slotId)}
                                aria-describedby="r5p2q4-help"
                                aria-label={`Question ${q.id}, blank ${blankNo}. ${
                                  answers[slotId]
                                    ? `Contains ${answers[slotId]}.`
                                    : "Empty."
                                }${result}`}
                                onKeyDown={(e) =>
                                  onBlankKeyDown(e, slotId, q, blankNo)
                                }
                                onKeyUp={(e) => {
                                  if (isActivateKey(e)) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }
                                }}
                                className={`relative min-w-[100px] h-10 border-b-2 text-center flex items-center justify-center focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb] ${snapshot.isDraggingOver ? "bg-blue-100" : ""} ${
                                  status === "wrong"
                                    ? "border-red-500"
                                    : status === "correct" ||
                                        status === "shown"
                                      ? "border-green-600"
                                      : "border-black"
                                }`}
                              >
                                {answers[slotId] && (
                                  <span
                                    className={`font-bold ${
                                      status === "correct" ||
                                      status === "shown"
                                        ? "text-green-700"
                                        : ""
                                    }`}
                                  >
                                    {answers[slotId]}
                                  </span>
                                )}

                                {status === "wrong" && (
                                  <div
                                    aria-hidden="true"
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md border-2 border-white"
                                  >
                                    ✕
                                  </div>
                                )}
{/* 
                                {status === "correct" && (
                                  <div
                                    aria-hidden="true"
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md border-2 border-white"
                                  >
                                    ✓
                                  </div>
                                )} */}

                                {provided.placeholder}
                              </div>

                              {/* 🔊 إعادة تشغيل الصوت الصحيح بعد Check / Show Answer */}
                              {(status === "correct" || status === "shown") && (
                                <button
                                  type="button"
                                  aria-label={`Hear the answer for question ${q.id}, blank ${blankNo}.`}
                                  className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white border-2 border-[#2c5287] text-black focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb]"
                                  onClick={() => playSound(replayKey, part.sound)}
                                  onKeyDown={(e) => {
                                    if (!isActivateKey(e)) return;

                                    e.preventDefault();
                                    e.stopPropagation();

                                    if (!e.repeat)
                                      playSound(replayKey, part.sound);
                                  }}
                                  onKeyUp={(e) => {
                                    if (!isActivateKey(e)) return;

                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                >
                                  <FaVolumeUp size={14} />

                                  {/* {playingKey === replayKey && <SpeakerBadge />} */}
                                </button>
                              )}
                            </div>
                          )}
                        </Droppable>
                      );
                    }

                    return null;
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>

          <button onClick={show} className="show-answer-btn">
            Show Answer
          </button>

          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Review5_Page2_Q4;
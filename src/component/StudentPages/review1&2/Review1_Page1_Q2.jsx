import React, { useState, useRef, useEffect } from "react";
import img1 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 16/Ex B 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 16/Ex B 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 16/Ex B 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 16/Ex B 4.svg";
import img5 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 16/Ex B 5.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";

// ⚠️ أسماء الملفات فيها apostrophe منحني (’) مثل ما بتظهر عندك بالمجلد
import heSound from "../../../assets/audio/ClassBook/U 2/Page 16 - B/He’s Stella’s.mp3";
import imSound from "../../../assets/audio/ClassBook/U 2/Page 16 - B/I’m Stella’s.mp3";
import sheSound from "../../../assets/audio/ClassBook/U 2/Page 16 - B/She’s Stella’s.mp3";

import "./Review1_Page1_Q2.css";
import ExerciseHeader from "../../ExerciseHeader";

// 🔊 true = الصوت يشتغل تلقائياً لما الطالب يوقف على الجملة بالتاب
const PLAY_ON_FOCUS = true;

// ── بيانات الأسئلة ──────────────────────────────────────────────
// scrambled = نفس حروف correctWord بس مبعثرة (anagram)
// ⚠️ الـ alt مؤقت: وصف الشخص بدون ذكر الجواب (راجعيه مع الصور الفعلية)
const questions = [
  {
    img: img1,
    alt: "A man",
    prefix: "I’m Stella’s",
    audio: imSound,
    suffix: ".",
    correctWord: "uncle",
    scrambled: "lecun",
  },
  {
    img: img2,
    alt: "A girl",
    prefix: "She’s Stella’s",
    audio: sheSound,
    suffix: ".",
    correctWord: "sister",
    scrambled: "restis",
  },
  {
    img: img3,
    alt: "A man",
    prefix: "He’s Stella’s",
    audio: heSound,
    suffix: ".",
    correctWord: "father",
    scrambled: "hatref",
  },
  {
    img: img4,
    alt: "A child",
    prefix: "I’m Stella’s",
    audio: imSound,
    suffix: ".",
    correctWord: "cousin",
    scrambled: "sinuoc",
  },
  {
    img: img5,
    alt: "A woman",
    prefix: "She’s Stella’s",
    audio: sheSound,
    suffix: ".",
    correctWord: "aunt",
    scrambled: "taun",
  },
];

// ── هوية كل حرف بالليتر بانك: ثابتة وما بتتغير ──────────────────
const lettersByQuestion = questions.map((q, qi) =>
  q.scrambled.split("").map((_, li) => `q${qi}-l${li}`),
);

// ── helpers لتحويل id الحرف لـ qi/li والرجوع للحرف نفسه ──────────
const parseLetterId = (id) => {
  const m = id.match(/^q(\d+)-l(\d+)$/);
  return { qi: Number(m[1]), li: Number(m[2]) };
};

const getChar = (id) => {
  if (!id) return "";
  const { qi, li } = parseLetterId(id);
  return questions[qi].scrambled[li];
};

const initialSlots = () =>
  questions.map((q) => Array(q.correctWord.length).fill(null));

// مفاتيح كل الخانات: "سؤال-خانة" (مثال "0-3")
const allSlotKeys = questions.flatMap((q, qi) =>
  Array.from({ length: q.correctWord.length }, (_, li) => `${qi}-${li}`),
);

const totalSlots = allSlotKeys.length;
const totalWords = questions.length;

// ── ترتيب الحروف الصحيحة بترتيب الكلمة الهدف (لزر Show Answer) ──
const buildCorrectSlots = (qi) => {
  const q = questions[qi];
  const remaining = q.scrambled
    .split("")
    .map((ch, li) => ({ id: `q${qi}-l${li}`, ch }));

  return q.correctWord.split("").map((targetChar) => {
    const idx = remaining.findIndex(
      (r) => r.ch.toLowerCase() === targetChar.toLowerCase(),
    );
    if (idx === -1) return null;
    const found = remaining[idx];
    remaining.splice(idx, 1);
    return found.id;
  });
};

// ── ستايلات مساعدة ──────────────────────────────────────────────

// ستايل الحرف المختار / الجملة الي صوتها شغّال
const highlightStyle = {
  outline: "2px solid #2c5287",
  outlineOffset: "2px",
  borderRadius: "8px",
};

// ستايل الخانات المسموح الإسقاط عليها
const validTargetStyle = {
  outline: "2px dashed #2c5287",
  outlineOffset: "2px",
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

const Review1_Page1_Q2 = () => {
  const [slots, setSlots] = useState(initialSlots);

  // 🔒 الخانات الصح بعد Check بتنقفل
  const [lockedSlots, setLockedSlots] = useState([]);

  // ✕ الخانات الغلط (الحرف رجع للبنك والخانة بتضل معلّمة لحد ما الطالب يعدّلها)
  const [wrongSlots, setWrongSlots] = useState([]);

  // 🔒 بعد Show Answer كل شي مقفول
  const [showAnswered, setShowAnswered] = useState(false);

  // الحرف المختار (اختار الحرف ثم اختار الخانة)
  const [selectedLetter, setSelectedLetter] = useState(null);

  // الحرف الي عم ينسحب
  const [draggingLetter, setDraggingLetter] = useState(null);

  // 📢 رسالة لقارئ الشاشة
  const [message, setMessage] = useState("");

  // تنقل بالتاب: خانة واحدة وحرف واحد لكل سؤال (roving tabindex)
  const [navSlot, setNavSlot] = useState(() => questions.map(() => 0));
  const [navLetter, setNavLetter] = useState(() => questions.map(() => 0));

  const letterRefs = useRef({});
  const slotRefs = useRef({});

  const isLocked = (key) => lockedSlots.includes(key);

  const isComplete = lockedSlots.length === totalSlots;
  const allLocked = showAnswered || isComplete;
  const activeLetter = selectedLetter || draggingLetter;
  const activeQi = activeLetter ? parseLetterId(activeLetter).qi : null;

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioOwner = useRef({}).current;
  const [activeId, setActiveId] = useState(null);

  const stopAudio = () => {
    stopGlobalAudio(audioOwner);
    setActiveId(null);
  };

  const playAudio = (src, id) => {
    if (!src) {
      stopAudio();
      return;
    }

    playGlobalAudio(src, {
      owner: audioOwner,
      onFinish: () => setActiveId((prev) => (prev === id ? null : prev)),
    });

    setActiveId(id);
  };

  // وقف الصوت إذا سكرت الصفحة
  useEffect(() => () => stopGlobalAudio(audioOwner), [audioOwner]);

  // الجملة (I’m Stella’s...): كليك / Enter / Space / تركيز بالتاب
  const playSentence = (qi) => playAudio(questions[qi].audio, `text-${qi}`);

  const handleSentenceKeyDown = (e, qi) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      playSentence(qi);
    }
  };

  const handleSentenceFocus = (e, qi) => {
    if (!PLAY_ON_FOCUS) return;
    if (!e.currentTarget.matches(":focus-visible")) return; // تجاهل تركيز الماوس
    playSentence(qi);
  };

  /* =====================================================
     FOCUS HELPERS
  ===================================================== */

  const focusLetter = (id) => {
    requestAnimationFrame(() => letterRefs.current[id]?.focus());
  };

  const focusSlot = (key) => {
    requestAnimationFrame(() => slotRefs.current[key]?.focus());
  };

  // أول خانة مسموح الإسقاط عليها بهاد السؤال (فاضية أولاً)
  const firstTargetSlot = (qi, current = slots) => {
    const row = current[qi];
    let li = row.findIndex((v, i) => v === null && !isLocked(`${qi}-${i}`));
    if (li === -1) li = row.findIndex((_, i) => !isLocked(`${qi}-${i}`));
    return li === -1 ? null : `${qi}-${li}`;
  };

  /* =====================================================
     SELECT LETTER (كليك / لمس / Enter / Space)
  ===================================================== */

  const activateLetter = (id, viaKeyboard = false) => {
    if (allLocked) return;

    const { qi } = parseLetterId(id);

    // الحرف المستخدم ما بينختار
    if (slots[qi].includes(id)) return;

    // نفس الحرف مرة ثانية = إلغاء الاختيار
    if (selectedLetter === id) {
      setSelectedLetter(null);
      setMessage(`${getChar(id)} deselected.`);
      return;
    }

    setSelectedLetter(id);

    setMessage(
      `${getChar(id)} selected. Choose a position in word ${qi + 1}. Press Escape to cancel.`,
    );

    if (viaKeyboard) {
      const target = firstTargetSlot(qi);
      if (target) focusSlot(target);
    }
  };

  const cancelSelection = () => {
    if (!selectedLetter) return;
    setMessage(`${getChar(selectedLetter)} deselected.`);
    setSelectedLetter(null);
  };

  /* =====================================================
     PLACE / RETURN
  ===================================================== */

  const placeLetter = (id, qi, li, viaKeyboard = false) => {
    const key = `${qi}-${li}`;

    if (allLocked || isLocked(key)) return;
    if (parseLetterId(id).qi !== qi) return;

    const updated = slots.map((row) => [...row]);

    // إذا الحرف بخانة ثانية (غير مقفولة) نشيله منها
    const oldLi = updated[qi].indexOf(id);
    if (oldLi !== -1 && !isLocked(`${qi}-${oldLi}`)) updated[qi][oldLi] = null;

    // إذا الخانة فيها حرف تاني، بيرجع للبنك تلقائياً
    updated[qi][li] = id;

    setSlots(updated);

    // نشيل ✕ بس عن الخانات الي تغيّرت
    setWrongSlots((prev) =>
      prev.filter((k) => k !== key && k !== `${qi}-${oldLi}`),
    );

    setSelectedLetter(null);

    setMessage(
      `${getChar(id)} placed in position ${li + 1} of word ${qi + 1}.`,
    );

    // بالكيبورد: نروح للحرف الجاي الغير مستخدم، وإذا خلصوا نضل على الخانة
    if (viaKeyboard) {
      const next = lettersByQuestion[qi].find((l) => !updated[qi].includes(l));
      if (next) focusLetter(next);
      else focusSlot(key);
    }
  };

  const returnLetter = (qi, li) => {
    const id = slots[qi][li];
    if (!id) return;

    setSlots((prev) => {
      const copy = prev.map((row) => [...row]);
      copy[qi][li] = null;
      return copy;
    });

    setWrongSlots((prev) => prev.filter((k) => k !== `${qi}-${li}`));
    setMessage(`${getChar(id)} returned to the letters.`);
  };

  /*
    كليك على الخانة:
    - في حرف مختار → نحطه
    - ما في حرف مختار والخانة فيها حرف → نرجعه للبنك
  */
  const handleSlotClick = (qi, li, e) => {
    if (allLocked) return;

    const key = `${qi}-${li}`;

    if (isLocked(key)) {
      setMessage(`Position ${li + 1} of word ${qi + 1} is correct and locked.`);
      return;
    }

    if (selectedLetter) {
      if (parseLetterId(selectedLetter).qi !== qi) {
        setMessage(
          `${getChar(selectedLetter)} belongs to word ${parseLetterId(selectedLetter).qi + 1}. Choose a position in that word.`,
        );
        return;
      }

      placeLetter(selectedLetter, qi, li, e.detail === 0);
      return;
    }

    if (slots[qi][li]) {
      returnLetter(qi, li);
    } else {
      setMessage(
        `Position ${li + 1} of word ${qi + 1} is empty. Select a letter first.`,
      );
    }
  };

  /* =====================================================
     KEYBOARD NAVIGATION (الأسهم)
  ===================================================== */

  const nextPosition = (e, qi, idx) => {
    const lenOf = (q) => questions[q].correctWord.length;
    let nq = qi;
    let ni = idx;

    if (e.key === "ArrowRight") ni = (idx + 1) % lenOf(qi);
    else if (e.key === "ArrowLeft") ni = (idx - 1 + lenOf(qi)) % lenOf(qi);
    else if (e.key === "ArrowDown") {
      nq = (qi + 1) % questions.length;
      ni = Math.min(idx, lenOf(nq) - 1);
    } else if (e.key === "ArrowUp") {
      nq = (qi - 1 + questions.length) % questions.length;
      ni = Math.min(idx, lenOf(nq) - 1);
    } else return null;

    return { nq, ni };
  };

  const handleLetterKeyDown = (e, qi, li) => {
    const next = nextPosition(e, qi, li);
    if (!next) return;
    e.preventDefault();
    letterRefs.current[`q${next.nq}-l${next.ni}`]?.focus();
  };

  const handleSlotKeyDown = (e, qi, li) => {
    const next = nextPosition(e, qi, li);
    if (!next) return;
    e.preventDefault();
    slotRefs.current[`${next.nq}-${next.ni}`]?.focus();
  };

  /* =====================================================
     DRAG & DROP (ماوس / لمس)
  ===================================================== */

  const onDragStart = (start) => {
    setDraggingLetter(start.draggableId);
    setSelectedLetter(null);
  };

  const onDragEnd = (result) => {
    setDraggingLetter(null);

    const { draggableId, destination } = result;

    if (!destination || allLocked) return;

    // الإفلات برجوع للبانك مش مسموح بالسحب — الرجوع بيكون بالكبس على الخانة
    if (!destination.droppableId.startsWith("slot-")) return;

    const [, qi, li] = destination.droppableId.split("-").map(Number);

    placeLetter(draggableId, qi, li);
  };

  /* =====================================================
     CHECK
     - الحرف الصح بينقفل
     - الحرف الغلط بيرجع للبنك والخانة بتتعلّم ✕
     - السكور = عدد الكلمات الصحيحة كاملة
  ===================================================== */

  const checkAnswers = () => {
    if (allLocked) return;

    const hasEmpty = slots.some((row, qi) =>
      row.some((v, li) => v === null && !isLocked(`${qi}-${li}`)),
    );

    if (hasEmpty) {
      ValidationAlert.info(
        "Oops!",
        "Please complete all the words before checking.",
      );
      setMessage("Please complete all the words before checking.");
      return;
    }

    stopAudio();

    const newSlots = slots.map((row) => [...row]);
    const newLocked = [...lockedSlots];
    const wrong = [];
    let score = 0;

    questions.forEach((q, qi) => {
      let wordOk = true;

      q.correctWord.split("").forEach((ch, li) => {
        const key = `${qi}-${li}`;
        const ok =
          isLocked(key) ||
          getChar(newSlots[qi][li]).toLowerCase() === ch.toLowerCase();

        if (ok) {
          if (!newLocked.includes(key)) newLocked.push(key);
        } else {
          wordOk = false;
          newSlots[qi][li] = null; // الحرف الغلط بيرجع للبنك
          wrong.push(key);
        }
      });

      if (wordOk) score++;
    });

    setSlots(newSlots);
    setLockedSlots(newLocked);
    setWrongSlots(wrong);
    setSelectedLetter(null);

    const wrongWords = [
      ...new Set(wrong.map((k) => Number(k.split("-")[0]) + 1)),
    ];

    setMessage(
      score === totalWords
        ? `Score ${score} out of ${totalWords}. All answers are correct.`
        : `Score ${score} out of ${totalWords}. Correct letters are locked. Incorrect letters were returned. Fix word ${wrongWords.join(", ")}.`,
    );

    const color =
      score === totalWords ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">Score: ${score} / ${totalWords}</span>
      </div>
    `;

    if (score === totalWords) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showAnswers = () => {
    stopAudio();
    setSlots(questions.map((_, qi) => buildCorrectSlots(qi)));
    setLockedSlots([...allSlotKeys]);
    setWrongSlots([]);
    setSelectedLetter(null);
    setDraggingLetter(null);
    setShowAnswered(true);
    setMessage("Correct answers are shown.");
  };

  /* =====================================================
     START AGAIN: بيرجّع كل شي (حروف، خانات، فيدباك، صوت)
  ===================================================== */

  const reset = () => {
    stopAudio();
    setSlots(initialSlots());
    setLockedSlots([]);
    setWrongSlots([]);
    setSelectedLetter(null);
    setDraggingLetter(null);
    setShowAnswered(false);
    setNavSlot(questions.map(() => 0));
    setNavLetter(questions.map(() => 0));
    setMessage("Exercise reset. All letters are back in the letter banks.");
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

        <div className="div-forall" style={{ gap: "20px" }}>
          <ExerciseHeader
            sectionLetter="B"
            // questionNumber="1"
            title="Look, read, and unscramble the word. Then, rewrite the sentence."
            subTitle="Say the answer first, then rearrange the letters or words into the correct order."
            isReview="true"
          />

          <div
            className="CB-review1-p1-q2-content"
            style={{ gap: "26px" }}
            aria-describedby="r1p1q2-help"
          >
            {questions.map((q, qi) => {
              const usedIds = slots[qi];
              const sentenceId = `text-${qi}`;
              const sentencePlaying = activeId === sentenceId;

              return (
                <div
                  key={qi}
                  className="CB-unit2-p6-q2-row"
                  style={{ alignItems: "flex-start", gap: "16px" }}
                >
                  <div className="CB-unit2-p6-q2-left">
                    <span className="CB-unit2-p6-q2-index">{qi + 1}</span>
                    <img
                      src={q.img}
                      alt={`Picture ${qi + 1}: ${q.alt}`}
                      className="CB-unit2-p6-q2-img"
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      minWidth: 0,
                    }}
                  >
                    {/* الجملة مع الخانات الفاضية */}
                    <div
                      className="CB-unit2-p6-q2-sentence"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "6px",
                      }}
                    >
                      {/* 🔊 الجملة: بتشتغل بالكليك / Enter / Space / التاب */}
                      <span
                        className={`CB-unit2-p6-q2-text ${focusRingClass}`}
                        role="button"
                        tabIndex={0}
                        aria-label={`Sentence ${qi + 1}: ${q.prefix}. Press to listen.`}
                        style={{
                          position: "relative",
                          cursor: "pointer",
                          ...(sentencePlaying ? highlightStyle : {}),
                        }}
                        onClick={() => playSentence(qi)}
                        onKeyDown={(e) => handleSentenceKeyDown(e, qi)}
                        onFocus={(e) => handleSentenceFocus(e, qi)}
                      >
                        <span aria-hidden="true">{q.prefix}</span>
                        {sentencePlaying && <SpeakerIcon />}
                      </span>

                      <div
                        role="group"
                        aria-label={`Word ${qi + 1}, ${q.correctWord.length} letters`}
                        style={{ display: "flex", gap: "4px" }}
                      >
                        {Array.from({ length: q.correctWord.length }).map(
                          (_, li) => {
                            const key = `${qi}-${li}`;
                            const letterId = usedIds[li];
                            const char = getChar(letterId);
                            const locked = isLocked(key);
                            const isWrong = wrongSlots.includes(key);
                            const isValidTarget =
                              activeQi === qi && !allLocked && !locked;

                            return (
                              <Droppable
                                key={li}
                                droppableId={`slot-${qi}-${li}`}
                                type={`q${qi}`}
                                isDropDisabled={allLocked || locked}
                              >
                                {(provided, snapshot) => (
                                  <span
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    onClick={(e) => handleSlotClick(qi, li, e)}
                                    style={{
                                      position: "relative",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: "34px",
                                      height: "38px",
                                      borderBottom: locked
                                        ? "2px solid #16a34a"
                                        : isWrong
                                          ? "2px solid #ef4444"
                                          : snapshot.isDraggingOver
                                            ? "2px dashed #f39b42"
                                            : "2px solid #888",
                                      background: locked
                                        ? "#e6f4ea"
                                        : isWrong
                                          ? "#fee2e2"
                                          : "#fafafa",
                                      fontSize: "18px",
                                      fontWeight: 600,
                                      textTransform: "lowercase",
                                      cursor:
                                        allLocked || locked
                                          ? "default"
                                          : "pointer",
                                      userSelect: "none",
                                      ...(isValidTarget
                                        ? validTargetStyle
                                        : {}),
                                    }}
                                  >
                                    <span aria-hidden="true">{char}</span>

                                    {provided.placeholder}

                                    {isWrong && !locked && (
                                      <span
                                        aria-hidden="true"
                                        style={{
                                          position: "absolute",
                                          top: -8,
                                          right: -8,
                                          width: "16px",
                                          height: "16px",
                                          borderRadius: "50%",
                                          background: "#ef4444",
                                          color: "#fff",
                                          fontSize: "10px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          border: "1px solid white",
                                        }}
                                      >
                                        ✕
                                      </span>
                                    )}

                                    {/* زر شفاف للكيبورد وقارئ الشاشة */}
                                    <button
                                      type="button"
                                      ref={(node) => {
                                        slotRefs.current[key] = node;
                                      }}
                                      tabIndex={navSlot[qi] === li ? 0 : -1}
                                      aria-label={`Word ${qi + 1}, position ${li + 1} of ${
                                        q.correctWord.length
                                      }${char ? `, ${char}` : ", empty"}${
                                        locked
                                          ? ", correct and locked"
                                          : isWrong
                                            ? ", incorrect, you can place a new letter"
                                            : ""
                                      }${
                                        isValidTarget && selectedLetter
                                          ? `. Press Enter to place ${getChar(selectedLetter)}`
                                          : ""
                                      }`}
                                      aria-disabled={allLocked || locked}
                                      className={focusRingClass}
                                      style={overlayButtonStyle}
                                      onFocus={() =>
                                        setNavSlot((prev) => {
                                          const copy = [...prev];
                                          copy[qi] = li;
                                          return copy;
                                        })
                                      }
                                      onKeyDown={(e) =>
                                        handleSlotKeyDown(e, qi, li)
                                      }
                                    />
                                  </span>
                                )}
                              </Droppable>
                            );
                          },
                        )}
                      </div>

                      <span className="CB-unit2-p6-q2-text">{q.suffix}</span>
                    </div>

                    {/* بنك الحروف الخاص بهاد السؤال — ثابت دايمًا، بس بيصير الحرف Disabled لما يُستخدم */}
                    <Droppable
                      droppableId={`bank-${qi}`}
                      type={`q${qi}`}
                      direction="horizontal"
                      isDropDisabled={true}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          role="group"
                          aria-label={`Letters for word ${qi + 1}. Press Enter or Space to select a letter, then choose a position.`}
                          style={{
                            display: "flex",
                            gap: "6px",
                            flexWrap: "wrap",
                            minHeight: "38px",
                          }}
                        >
                          {lettersByQuestion[qi].map((id, idx) => {
                            const used = usedIds.includes(id);
                            const isSelected = selectedLetter === id;

                            return (
                              <Draggable
                                key={id}
                                draggableId={id}
                                index={idx}
                                isDragDisabled={allLocked || used}
                              >
                                {(dragProvided, dragSnapshot) => (
                                  <span
                                    ref={dragProvided.innerRef}
                                    {...dragProvided.draggableProps}
                                    {...dragProvided.dragHandleProps}
                                    /*
                                      الفوكس بالكيبورد على الزر الداخلي،
                                      مش على الـ drag handle نفسو.
                                    */
                                    tabIndex={-1}
                                    role="presentation"
                                    aria-describedby={undefined}
                                    onClick={(e) =>
                                      activateLetter(id, e.detail === 0)
                                    }
                                    style={{
                                      position: "relative",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: "34px",
                                      height: "38px",
                                      border: used
                                        ? "1.5px dashed #ccc"
                                        : "1.5px solid #ccc",
                                      borderRadius: "6px",
                                      background: used ? "#ececec" : "white",
                                      opacity:
                                        used && !dragSnapshot.isDragging
                                          ? 0.4
                                          : 1,
                                      fontSize: "18px",
                                      fontWeight: 600,
                                      textTransform: "lowercase",
                                      touchAction: "none",
                                      cursor: used
                                        ? "not-allowed"
                                        : allLocked
                                          ? "default"
                                          : "grab",
                                      userSelect: "none",
                                      ...(isSelected ? highlightStyle : {}),
                                      ...dragProvided.draggableProps.style,
                                    }}
                                  >
                                    <span aria-hidden="true">
                                      {getChar(id)}
                                    </span>

                                    {/* زر شفاف للكيبورد وقارئ الشاشة */}
                                    <button
                                      type="button"
                                      ref={(node) => {
                                        letterRefs.current[id] = node;
                                      }}
                                      tabIndex={navLetter[qi] === idx ? 0 : -1}
                                      aria-label={`${getChar(id)}${
                                        used ? ", already placed" : ""
                                      }${isSelected ? ", selected" : ""}`}
                                      aria-pressed={isSelected}
                                      aria-disabled={used || allLocked}
                                      className={focusRingClass}
                                      style={overlayButtonStyle}
                                      onFocus={() =>
                                        setNavLetter((prev) => {
                                          const copy = [...prev];
                                          copy[qi] = idx;
                                          return copy;
                                        })
                                      }
                                      onKeyDown={(e) =>
                                        handleLetterKeyDown(e, qi, idx)
                                      }
                                    />
                                  </span>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

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
          >
            Check Answer ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Review1_Page1_Q2;

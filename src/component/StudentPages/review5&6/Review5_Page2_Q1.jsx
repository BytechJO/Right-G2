/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";
import "./Review5_Page2_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../../WorkBookPages/Button";
import img1 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 53/Asset 35.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 53/Asset 75.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 53/Asset 36.svg";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import sound1 from "../../../assets/audio/ClassBook/U 6/cd37pg53-instruction1-adult-lady_VEAoL9d5.mp3";
import trueIcon from "../../../assets/imgs/true.svg";
import falseIcon from "../../../assets/imgs/false.svg";
import ExerciseHeader from "../../ExerciseHeader";

// ================================
// ✔ Captions Array
// ================================
const stopAtSecond = 10.399;

const captions = [
  { start: 0.519, end: 4.059, text: "Page 53, review 5, exercise D." },
  {
    start: 5.299,
    end: 10.399,
    text: "Do they both have long E? Listen and write ✓ or X.",
  },
  { start: 11.439, end: 14.659, text: "1, knee, tea." },
  { start: 15.679, end: 19.02, text: "2, tape. Three." },
  { start: 20.1, end: 23.34, text: "3, bee, sleep" },
];

// ================================
// DATA
// segment = مقطع الصوت الخاص بكل صورة (من نفس ملف الصوت، حسب الـ captions)
// ⚠️ الـ alt مكتوب بالتخمين من كلمات الصوت وأنا ما شفت الصور: عدّليهم حسب اللي بالصورة
// ================================
const questions = [
  {
    id: 1,
    image: img1,
    alt: "A knee and a cup of tea.",
    correct: "✓",
    segment: captions[2],
  },
  {
    id: 2,
    image: img3,
    alt: "A roll of tape and the number three.",
    correct: "✗",
    segment: captions[3],
  },
  {
    id: 3,
    image: img2,
    alt: "A bee and a child sleeping.",
    correct: "✓",
    segment: captions[4],
  },
];

const OPTIONS = [
  {
    value: "✓",
    icon: trueIcon,
    name: "Tick",
    meaning: "both words have the long e sound",
  },
  {
    value: "✗",
    icon: falseIcon,
    name: "Cross",
    meaning: "the words do not both have the long e sound",
  },
];

const TOTAL = questions.length;

// ================================
// HELPERS (خارج الكومبوننت)
// ================================

// Enter و Space بنعالجهم بإيدينا ونوقّف انتشار الحدث،
// لأن الكتاب غالباً عنده مستمع كيبورد عام بياخد هالمفتاحين
const isActivateKey = (e) => e.key === "Enter" || e.key === " ";

const activate = (action) => ({
  onClick: () => action(),
  onKeyDown: (e) => {
    if (!isActivateKey(e)) return;

    e.preventDefault();
    e.stopPropagation();

    if (!e.repeat) action();
  },
  onKeyUp: (e) => {
    if (!isActivateKey(e)) return;

    e.preventDefault();
    e.stopPropagation();
  },
});

// سبيكر أسود داخل دائرة بيضا: بيظهر بس وقت ما صوت الصورة شغّال
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

// ✕ أحمر بالزاوية العلوية اليمنى للخيار الغلط (بعد Check)
// الـ wrapper لازم يكون position: relative عشان يتثبّت عليه
const WrongBadge = () => (
  <span
    aria-hidden="true"
    className="CB-review5-p2-q1-wrong-icon"
    style={{
      position: "absolute",
      top: -10,
      right: -10,
      left: "auto",
      bottom: "auto",
      width: 22,
      height: 22,
      margin: 0,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
      zIndex: 2,
      lineHeight: 1,
      fontSize: 13,
      fontWeight: 700,
      background: "#ff2723",
      color: "#fff",
      boxShadow: "0 1px 3px rgba(0,0,0,.25)",
    }}
  >
    ✕
  </span>
);

const Review5_Page2_Q1 = () => {
  // { رقم السؤال: "✓" | "✗" }
  const [answers, setAnswers] = useState({});

  // الأسئلة اللي جوابها صح بعد Check (بتنقفل)
  const [lockedSet, setLockedSet] = useState(() => new Set());

  // الأسئلة اللي جوابها غلط بعد آخر Check (بتضل قابلة للتعديل)
  const [wrongIds, setWrongIds] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const [announcement, setAnnouncement] = useState("");

  // بنغيّر الـ key عشان نوقّف مشغّل الصوت الرئيسي ونرجّعه للبداية عند Start Again
  const [playerKey, setPlayerKey] = useState(0);

  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const optionRefs = useRef({});

  const allDone = lockedSet.size === TOTAL;

  const isLocked = (id) => showAnswer || lockedSet.has(id);

  // ================================
  // AUDIO
  // صوت كل صورة = مقطع من نفس ملف الصوت (بيشتغل صوت واحد بس بنفس الوقت)
  // ================================

  const stopItemAudio = () => {
    clearInterval(timerRef.current);

    audioRef.current?.pause();

    setPlayingId(null);
  };

  // بيوقف أي مشغّل صوت ثاني بالصفحة (متل المشغّل الرئيسي)
  const pauseOtherAudio = (rewind = false) => {
    document.querySelectorAll("audio").forEach((el) => {
      if (el === audioRef.current) return;

      el.pause();

      if (rewind) {
        try {
          el.currentTime = 0;
        } catch {
          /* ما في مشكلة */
        }
      }
    });
  };

  const playItemAudio = (q) => {
    const audio = audioRef.current;

    if (!audio) return;

    pauseOtherAudio();
    clearInterval(timerRef.current);

    const { start, end } = q.segment;

    const begin = () => {
      audio.currentTime = start;

      const played = audio.play();

      if (played?.catch) played.catch(() => setPlayingId(null));

      // بنوقّف عند نهاية مقطع هالصورة
      timerRef.current = setInterval(() => {
        if (audio.currentTime >= end || audio.ended) stopItemAudio();
      }, 40);
    };

    setPlayingId(q.id);

    if (audio.readyState >= 1) {
      begin();
    } else {
      audio.addEventListener("loadedmetadata", begin, { once: true });
      audio.load();
    }
  };

  // إذا أي مشغّل ثاني بدأ: بنوقّف صوت الصورة (ما بيتداخلوا)
  // وإذا سكرت الصفحة: بنوقّف الصوت
  useEffect(() => {
    const onOtherPlay = (e) => {
      if (e.target !== audioRef.current) stopItemAudio();
    };

    document.addEventListener("play", onOtherPlay, true);

    return () => {
      document.removeEventListener("play", onOtherPlay, true);
      clearInterval(timerRef.current);
      audioRef.current?.pause();
    };
  }, []);

  // فوكس بالتاب على الصورة = شغّل صوتها (الماوس/اللمس بيروحوا على onClick)
  const onPictureFocus = (e, q) => {
    if (e.currentTarget.matches(":focus-visible")) playItemAudio(q);
  };

  // ================================
  // SELECT
  // ================================

  const selectAnswer = (id, value) => {
    if (isLocked(id)) {
      if (lockedSet.has(id)) {
        setAnnouncement(`Question ${id} is correct and locked.`);
      }
      return;
    }

    setAnswers((prev) => ({ ...prev, [id]: value }));

    // السؤال اللي كان غلط وانعدّل: بتنشال علامة ✕
    setWrongIds((prev) => prev.filter((x) => x !== id));

    const option = OPTIONS.find((o) => o.value === value);

    setAnnouncement(`Question ${id}: ${option.name} selected.`);
  };

  // Enter / Space: اختيار. الأسهم: بتنقل الاختيار والفوكس بين ✓ و ✗
  const onOptionKeyDown = (e, id, value) => {
    if (isLocked(id)) return;

    if (isActivateKey(e)) {
      e.preventDefault();
      e.stopPropagation();

      if (!e.repeat) selectAnswer(id, value);

      return;
    }

    const target =
      e.key === "ArrowUp" || e.key === "ArrowLeft"
        ? "✓"
        : e.key === "ArrowDown" || e.key === "ArrowRight"
          ? "✗"
          : null;

    if (!target) return;

    e.preventDefault();
    e.stopPropagation();

    selectAnswer(id, target);
    optionRefs.current[`${id}-${target}`]?.focus();
  };

  // ================================
  // CHECK
  // الصح بينقفل (أخضر ✓)، الغلط بيضل ✕ وبيقدر الطالب يعدّله
  // ================================

  const checkAnswers = () => {
    if (showAnswer || allDone) return;

    stopItemAudio();
    pauseOtherAudio();

    // 1) فحص الخانات الفارغة
    if (questions.some((q) => !answers[q.id])) {
      const msg = "Please choose ✓ or ✗ for all questions!";

      ValidationAlert.info("Oops!", msg);
      setAnnouncement(msg);
      return;
    }

    // 2) مقارنة الإجابات
    const nextLocked = new Set(lockedSet);
    const nextWrong = [];

    questions.forEach((q) => {
      if (nextLocked.has(q.id)) return;

      if (answers[q.id] === q.correct) nextLocked.add(q.id);
      else nextWrong.push(q.id);
    });

    setLockedSet(nextLocked);
    setWrongIds(nextWrong);

    // 3) حساب السكور
    const correctCount = nextLocked.size;

    // الفيدباك المحكي: كل سؤال صح أو غلط
    setAnnouncement(
      [
        `Score ${correctCount} out of ${TOTAL}.`,
        ...questions.map(
          (q) =>
            `Question ${q.id} is ${
              nextLocked.has(q.id) ? "correct" : "not correct"
            }.`,
        ),
        nextWrong.length
          ? "You can change the wrong answers and check again."
          : "",
      ]
        .filter(Boolean)
        .join(" "),
    );

    const color =
      correctCount === TOTAL ? "green" : correctCount === 0 ? "red" : "orange";

    const resultHTML = `
      <div style="font-size: 20px; text-align:center; margin-top: 8px;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${correctCount} / ${TOTAL}
        </span>
      </div>
    `;

    if (correctCount === TOTAL) ValidationAlert.success(resultHTML);
    else if (correctCount === 0) ValidationAlert.error(resultHTML);
    else ValidationAlert.warning(resultHTML);
  };

  // ================================
  // SHOW ANSWER / START AGAIN
  // ================================

  const showAnswers = () => {
    stopItemAudio();
    pauseOtherAudio();

    const corrects = {};

    questions.forEach((q) => {
      corrects[q.id] = q.correct; // ✓ أو ✗
    });

    setAnswers(corrects);
    setLockedSet(new Set());
    setWrongIds([]);
    setShowAnswer(true);

    setAnnouncement(
      "All answers shown. Every question shows the correct choice.",
    );
  };

  // بيوقف كل الصوت، وبيمسح الاختيارات، الفيدباك، القفل، والنتيجة
  const resetAnswers = () => {
    stopItemAudio();
    pauseOtherAudio(true);
    setPlayerKey((k) => k + 1);

    setAnswers({});
    setLockedSet(new Set());
    setWrongIds([]);
    setShowAnswer(false);

    setAnnouncement("Activity reset. All choices and results are cleared.");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      {/* Screen Reader */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>

      {/* صوت الصور (مقاطع من نفس ملف الصوت) */}
      <audio
        ref={audioRef}
        src={sound1}
        preload="auto"
        onEnded={stopItemAudio}
      />

      <div className="div-forall">
        <ExerciseHeader
          sectionLetter="D"
          title="Do they both have long e? Listen and write ✓ or ✗."
          subTitle="Listen to both sounds carefully, then choose Yes/No only after comparing them."
          isReview={true}
        />

        <p id="r5p2q1-help" className="sr-only">
          Listen to the audio. Press a picture to hear its two words again. For
          each picture, choose the tick if both words have the long e sound, or
          the cross if they do not. Press Tab to move between the picture, the
          tick, and the cross. Press Enter or Space to choose. Press Check
          Answer to check. Correct answers are locked and wrong answers can be
          changed.
        </p>

        <QuestionAudioPlayer
          key={playerKey}
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
          pageId={"sb-review5-page2-q1"}
        />

        <div className="CB-review5-p2-q1-container">
          {questions.map((q) => {
            const status = showAnswer
              ? "shown"
              : lockedSet.has(q.id)
                ? "correct"
                : wrongIds.includes(q.id)
                  ? "wrong"
                  : null;

            return (
              <div key={q.id} className="CB-review1-p2-q1-question-box">
                <div className="CB-review5-p2-q1-flex">
                  {/* الصورة: بتشغّل صوتها */}
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={`Picture ${q.id}: ${q.alt} Press to hear the words.`}
                    aria-describedby="r5p2q1-help"
                    onFocus={(e) => onPictureFocus(e, q)}
                    className="rounded-md focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb]"
                    style={{
                      display: "flex",
                      gap: "5px",
                      position: "relative",
                      cursor: "pointer",
                    }}
                    {...activate(() => playItemAudio(q))}
                  >
                    <span style={{ fontSize: "20px", fontWeight: "700" }}>
                      {q.id}
                    </span>
                    <img
                      src={q.image}
                      alt={q.alt}
                      className="CB-review1-p2-q1-img"
                      style={{ width: "auto", height: "140px" }}
                    />

                    {/* 🔊 السبيكر بيظهر بس وقت ما صوت الصورة شغّال */}
                    {playingId === q.id && <SpeakerBadge />}
                  </div>

                  <div
                    role="radiogroup"
                    aria-label={`Question ${q.id}: do both words have the long e sound?`}
                    className="CB-review5-p2-q1-options-box"
                  >
                    {OPTIONS.map((option) => {
                      const isSel = answers[q.id] === option.value;

                      const result = !isSel
                        ? ""
                        : status === "correct"
                          ? " Correct."
                          : status === "shown"
                            ? " Correct answer."
                            : status === "wrong"
                              ? " Not correct. Press to change it."
                              : "";

                      return (
                        <div
                          key={option.value}
                          className="CB-review1-p2-q1-option-wrapper"
                          style={{ position: "relative" }}
                        >
                          <div
                            role="radio"
                            aria-checked={isSel}
                            aria-disabled={isLocked(q.id)}
                            tabIndex={isLocked(q.id) ? -1 : 0}
                            aria-label={`Question ${q.id}: ${option.name}, ${option.meaning}. ${
                              isSel ? "Selected." : "Not selected."
                            }${result}`}
                            ref={(el) => {
                              optionRefs.current[`${q.id}-${option.value}`] =
                                el;
                            }}
                            className={`CB-review5-p2-q1-option-btn focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb] ${
                              isSel ? "is-selected" : ""
                            } `}
                            style={{
                              border:
                                isSel && (status === "correct" || status === "shown")
                                  ? "2px solid green"
                                  : "",
                            }}
                            onClick={() => selectAnswer(q.id, option.value)}
                            onKeyDown={(e) =>
                              onOptionKeyDown(e, q.id, option.value)
                            }
                            onKeyUp={(e) => {
                              if (isActivateKey(e)) {
                                e.preventDefault();
                                e.stopPropagation();
                              }
                            }}
                          >
                            <img
                              src={option.icon}
                              alt=""
                              style={{ height: "25px", width: "auto" }}
                            />
                          </div>

                          {/* ✕ فوق يمين الخيار الغلط بعد Check */}
                          {isSel && status === "wrong" && <WrongBadge />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* BUTTONS */}
        <Button
          handleShowAnswer={showAnswers}
          handleStartAgain={resetAnswers}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
};

export default Review5_Page2_Q1;

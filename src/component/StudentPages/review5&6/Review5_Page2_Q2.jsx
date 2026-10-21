/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useRef, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 53/Ex E 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 53/Ex E 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 53/Ex E 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 53/Ex E 4.svg";
import img5 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 53/Ex E 5.svg";
import img6 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 53/Ex E 6.svg";

import soundEE from "../../../assets/audio/ClassBook/U 6/Page 53 - E/Item_001_ee.mp3";
import soundEA from "../../../assets/audio/ClassBook/U 6/Page 53 - E/Item_002_ea.mp3";
import ExerciseHeader from "../../ExerciseHeader";

// ================================
// DATA
// ⚠️ الـ alt مكتوب بالتخمين من الكلمات (bee, tea, feet, meat, read, sleep)
// وأنا ما شفت الصور: عدّليهم حسب اللي بالصورة
// ================================
const items = [
  {
    img: img1,
    alt: "A bee.",
    options: ["ee", "ea"],
    correct: "ee",
    start: "b",
    end: "",
  },
  {
    img: img2,
    alt: "A cup of tea.",
    options: ["ee", "ea"],
    correct: "ea",
    start: "t",
    end: "",
  },
  {
    img: img3,
    alt: "A pair of feet.",
    options: ["ee", "ea"],
    correct: "ee",
    start: "f",
    end: "t",
  },
  {
    img: img4,
    alt: "A piece of meat.",
    options: ["ee", "ea"],
    correct: "ea",
    start: "m",
    end: "t",
  },
  {
    img: img5,
    alt: "A child reading a book.",
    options: ["ee", "ea"],
    correct: "ea",
    start: "r",
    end: "d",
  },
  {
    img: img6,
    alt: "A child sleeping.",
    options: ["ee", "ea"],
    correct: "ee",
    start: "sl",
    end: "p",
  },
];

// صوت كل خيار
const SOUNDS = { ee: soundEE, ea: soundEA };

const TOTAL = items.length;

// ================================
// HELPERS (خارج الكومبوننت)
// ================================

// Enter و Space بنعالجهم بإيدينا ونوقّف انتشار الحدث،
// لأن الكتاب غالباً عنده مستمع كيبورد عام بياخد هالمفتاحين
const isActivateKey = (e) => e.key === "Enter" || e.key === " ";

// سبيكر أسود داخل دائرة بيضا: بيظهر بس وقت ما صوت الخيار شغّال
const SpeakerBadge = () => (
  <span
    aria-hidden="true"
    style={{
      position: "absolute",
      top: -10,
      right: -10,
      width: 20,
      height: 20,
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
    <FaVolumeUp size={10} />
  </span>
);

// ✕ أحمر فوق يمين الخيار الغلط بعد Check
const WrongBadge = () => (
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
      fontSize: 13,
      fontWeight: 700,
      color: "#fff",
      background: "#e53935",
      boxShadow: "0 1px 3px rgba(0,0,0,.25)",
    }}
  >
    ✕
  </span>
);

const Review5_Page2_Q3 = () => {
  // ما في خيار مختار = ""
  const [selected, setSelected] = useState(Array(TOTAL).fill(""));

  // الأسئلة اللي جوابها صح بعد Check (بتنقفل)
  const [lockedSet, setLockedSet] = useState(() => new Set());

  // الأسئلة اللي جوابها غلط بعد آخر Check (بتضل قابلة للتعديل)
  const [wrongIds, setWrongIds] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  // الخيار اللي صوته شغّال هلأ: { i, option } أو null
  const [playing, setPlaying] = useState(null);

  const [announcement, setAnnouncement] = useState("");

  const audioRef = useRef(null); // الصوت الشغّال حالياً

  const allDone = lockedSet.size === TOTAL;

  const isLocked = (i) => showAnswer || lockedSet.has(i);

  // ================================
  // AUDIO
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

    setPlaying(null);
  };

  // بيوقف أي مشغّل صوت ثاني بالصفحة (متل المشغّل الرئيسي)
  const pauseOtherAudio = () => {
    document.querySelectorAll("audio").forEach((el) => el.pause());
  };

  const playOptionSound = (i, option) => {
    const src = SOUNDS[option];

    if (!src) return;

    stopAudio();
    pauseOtherAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    // السبيكر بيختفي لما الصوت يخلص
    audio.onended = () => {
      audioRef.current = null;
      setPlaying(null);
    };

    setPlaying({ i, option });

    audio.play().catch(() => {
      audioRef.current = null;
      setPlaying(null);
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

  // ================================
  // SELECT / DESELECT
  // ================================

  const chooseOption = (i, value) => {
    if (isLocked(i)) {
      if (lockedSet.has(i)) {
        setAnnouncement(`Question ${i + 1} is correct and locked.`);
      }
      return;
    }

    // نفس الخيار مرتين = إلغاء الاختيار
    if (selected[i] === value) {
      setSelected((prev) => {
        const next = [...prev];
        next[i] = "";
        return next;
      });

      // السؤال اللي كان غلط وانعدّل: بتنشال علامة ✕
      setWrongIds((prev) => prev.filter((x) => x !== i));

      stopAudio();
      setAnnouncement(`Question ${i + 1}: ${value} deselected.`);
      return;
    }

    setSelected((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });

    // السؤال اللي كان غلط وانعدّل: بتنشال علامة ✕
    setWrongIds((prev) => prev.filter((x) => x !== i));

    playOptionSound(i, value);
    setAnnouncement(`Question ${i + 1}: ${value} selected.`);
  };

  // ================================
  // CHECK
  // الصح بينقفل (أخضر)، الغلط بيضل ✕ وبيقدر الطالب يعدّله
  // ================================

  const checkAnswers = () => {
    if (showAnswer || allDone) return;

    stopAudio();
    pauseOtherAudio();

    // 1) فحص الخانات الفارغة
    if (items.some((_, i) => !selected[i])) {
      const msg = "Please complete all answers.";

      ValidationAlert.info(msg);
      setAnnouncement(msg);
      return;
    }

    // 2) مقارنة الإجابات
    const nextLocked = new Set(lockedSet);
    const nextWrong = [];

    items.forEach((item, i) => {
      if (nextLocked.has(i)) return;

      if (selected[i] === item.correct) nextLocked.add(i);
      else nextWrong.push(i);
    });

    setLockedSet(nextLocked);
    setWrongIds(nextWrong);

    // 3) حساب السكور
    const score = nextLocked.size;

    // الفيدباك المحكي: كل سؤال صح أو غلط
    setAnnouncement(
      [
        `Score ${score} out of ${TOTAL}.`,
        ...items.map(
          (_, i) =>
            `Question ${i + 1} is ${
              nextLocked.has(i) ? "correct" : "not correct"
            }.`,
        ),
        nextWrong.length
          ? "You can change the wrong answers and check again."
          : "",
      ]
        .filter(Boolean)
        .join(" "),
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

  // ================================
  // SHOW ANSWER / START AGAIN
  // ================================

  const showAnswers = () => {
    stopAudio();
    pauseOtherAudio();

    setSelected(items.map((item) => item.correct));
    setLockedSet(new Set());
    setWrongIds([]);
    setShowAnswer(true);

    setAnnouncement(
      "All answers shown. Every question shows the correct choice.",
    );
  };

  // بيمسح كل الدواير، النتيجة، السكور، القفل، وبيوقف الصوت
  const resetAll = () => {
    stopAudio();
    pauseOtherAudio();

    setSelected(Array(TOTAL).fill(""));
    setLockedSet(new Set());
    setWrongIds([]);
    setShowAnswer(false);

    setAnnouncement("Activity reset. All choices and results are cleared.");
  };

  return (
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
          sectionLetter="F"
          title="Look, circle, and write."
          subTitle="Read or listen carefully, then tap the option you would circle on the printed page."
          isReview={true}
        />

        <p id="r5p2q3-help" className="sr-only">
          For each picture, choose ee or ea to finish the word. You hear the
          sound when you choose. Press Tab to move between the choices. Press
          Enter or Space to choose. Press the same choice again to remove it.
          Press Check Answer to check. Correct answers are locked and wrong
          answers can be changed.
        </p>

        <div className="flex w-full">
          <div className="grid grid-cols-3 gap-y-20 gap-x-[60px] mt-5 justify-center w-full">
            {items.map((item, i) => {
              const status = showAnswer
                ? "shown"
                : lockedSet.has(i)
                  ? "correct"
                  : wrongIds.includes(i)
                    ? "wrong"
                    : null;

              const answerWord = selected[i]
                ? item.start + selected[i] + item.end
                : "";

              return (
                <div
                  key={i}
                  className="flex flex-col scale-[1.2] origin-top-left"
                >
                  <div className="flex gap-2.5 items-center">
                    <span className="text-[20px] font-bold text-[#2a4e7c]">
                      {i + 1}
                    </span>

                    <img
                      src={item.img}
                      alt={`Picture ${i + 1}: ${item.alt}`}
                      style={{
                        width: "100px",
                        height: "100px",
                      }}
                    />

                    <div
                      role="group"
                      aria-label={`Question ${i + 1}: choose ee or ea`}
                      className="flex flex-col gap-3 text-[18px]"
                    >
                      {item.options.map((option) => {
                        const isSel = selected[i] === option;

                        const isPlaying =
                          playing?.i === i && playing?.option === option;

                        const borderColor = !isSel
                          ? "#cbd5e1"
                          : status === "correct" || status === "shown"
                            ? "#16a34a"
                            : status === "wrong"
                              ? "#ef4444"
                              : "#3b82f6";

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
                          <div key={option} style={{ position: "relative" }}>
                            <button
                              type="button"
                              aria-pressed={isSel}
                              aria-disabled={isLocked(i)}
                              aria-describedby="r5p2q3-help"
                              aria-label={`Question ${i + 1}: ${option}. ${
                                isSel ? "Selected." : "Not selected."
                              }${result}`}
                              className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
                              style={{
                                width: 48,
                                height: 48,
                                minWidth: 45,
                                minHeight: 45,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 20,
                                fontWeight: 700,
                                lineHeight: 1,
                                background: isSel ? "#eff6ff" : "#fff",
                                border: `3px solid ${borderColor}`,
                                touchAction: "manipulation",
                                cursor: isLocked(i) ? "default" : "pointer",
                              }}
                              onClick={() => chooseOption(i, option)}
                              onKeyDown={(e) => {
                                if (!isActivateKey(e)) return;

                                e.preventDefault();
                                e.stopPropagation();

                                if (!e.repeat) chooseOption(i, option);
                              }}
                              onKeyUp={(e) => {
                                if (!isActivateKey(e)) return;

                                e.preventDefault();
                                e.stopPropagation();
                              }}
                            >
                              {option}
                            </button>

                            {/* 🔊 السبيكر بيظهر بس وقت ما صوت الخيار شغّال */}
                            {isPlaying && <SpeakerBadge />}

                            {/* ✕ فوق يمين الخيار الغلط بعد Check */}
                            {isSel && status === "wrong" && <WrongBadge />}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="relative">
                    <div
                      role="img"
                      aria-label={
                        answerWord
                          ? `Question ${i + 1} answer: ${answerWord}`
                          : `Question ${i + 1} answer: empty`
                      }
                      className={`h-8 border-b-2 w-40 text-[18px] ${
                        status === "wrong"
                          ? "border-red-500"
                          : "border-[#444]"
                      }`}
                    >
                      {answerWord}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ⭐ الأزرار (كما هي) */}
        <div className="action-buttons-container">
          <button onClick={resetAll} className="try-again-button">
            Start Again ↻
          </button>

          <button onClick={showAnswers} className="show-answer-btn">
            Show Answer
          </button>

          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review5_Page2_Q3;
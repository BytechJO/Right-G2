/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useRef, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";
import "./Review6_Page1_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 54/Ex A 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 54/Ex A 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 54/Ex A 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 54/Ex A 4.svg";

import sound1 from "../../../assets/audio/ClassBook/U 6/Page 54 - A/Item_001_I_eat_breakfast_every_morning.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 6/Page 54 - A/Item_002_I_brush_my_teeth_every_morning.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 6/Page 54 - A/Item_003_I_get_dressed_every_morning.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 6/Page 54 - A/Item_004_I_get_out_of_bed_every_morning.mp3";
import ExerciseHeader from "../../ExerciseHeader";

// ================================
// DATA
// ⚠️ الـ alt مكتوب بالتخمين من الجمل وأنا ما شفت الصور: عدّليهم حسب اللي بالصورة
// ================================
const questions = [
  {
    text: "I eat breakfast every morning.",
    answer: 4,
    sound: sound1,
  },
  {
    text: "I brush my teeth every morning.",
    answer: 3,
    sound: sound2,
  },
  {
    text: "I get dressed every morning.",
    answer: 2,
    sound: sound3,
  },
  {
    text: "I get out of bed every morning.",
    answer: 1,
    sound: sound4,
  },
];

const images = [
  { id: 1, src: img1, alt: "A child getting out of bed." },
  { id: 2, src: img2, alt: "A child getting dressed." },
  { id: 3, src: img3, alt: "A child brushing their teeth." },
  { id: 4, src: img4, alt: "A child eating breakfast." },
];

const TOTAL = questions.length;

// الأرقام المتاحة بالـ selector (كل رقم بينستخدم مرة وحدة بس)
const NUMBERS = images.map((img) => String(img.id));

// ================================
// HELPERS (خارج الكومبوننت)
// ================================

// Enter و Space بنعالجهم بإيدينا ونوقّف انتشار الحدث،
// لأن الكتاب غالباً عنده مستمع كيبورد عام بياخد هالمفتاحين
const isActivateKey = (e) => e.key === "Enter" || e.key === " ";

// سبيكر أسود داخل دائرة بيضا: بيظهر بس وقت ما صوت الجملة شغّال
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

export default function Review6_Page1_Q1() {
  // "" = ما في رقم مختار
  const [answers, setAnswers] = useState(Array(TOTAL).fill(""));

  // الأسئلة اللي جوابها صح بعد Check (بتنقفل)
  const [lockedSet, setLockedSet] = useState(() => new Set());

  // الأسئلة اللي جوابها غلط بعد آخر Check (بتضل قابلة للتعديل)
  const [wrongIds, setWrongIds] = useState([]);

  // صار في Check؟ بعده الأرقام اللي عند الأسئلة الغلط بتصير متاحة
  const [checked, setChecked] = useState(false);

  const [showAnswer, setShowAnswer] = useState(false);

  // رقم الجملة اللي صوتها شغّال هلأ (عشان السبيكر)
  const [playingIndex, setPlayingIndex] = useState(null);

  const [announcement, setAnnouncement] = useState("");

  const audioRef = useRef(null);

  const allDone = lockedSet.size === TOTAL;

  const isLocked = (i) => showAnswer || lockedSet.has(i);

  // الرقم مش متاح للسؤال i؟
  // قبل Check: أي رقم مستخدم عند سؤال ثاني ممنوع (منع التكرار).
  // بعد Check: بس الأرقام اللي عند الأسئلة المقفولة (الصح) ممنوعة،
  // أما الأرقام اللي عند الأسئلة الغلط فبتصير متاحة.
  const isUnavailable = (i, n) =>
    answers.some((a, j) => j !== i && a === n && (!checked || isLocked(j)));

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

    setPlayingIndex(null);
  };

  // بيوقف أي مشغّل صوت ثاني بالصفحة
  const pauseOtherAudio = () => {
    document.querySelectorAll("audio").forEach((el) => el.pause());
  };

  const playSentence = (i) => {
    stopAudio();
    pauseOtherAudio();

    const audio = new Audio(questions[i].sound);

    audioRef.current = audio;

    audio.onended = () => {
      audioRef.current = null;
      setPlayingIndex(null);
    };

    setPlayingIndex(i);

    audio.play().catch(() => {
      audioRef.current = null;
      setPlayingIndex(null);
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

  // فوكس بالتاب على الجملة = شغّل صوتها (الماوس/اللمس بيروحوا على onClick)
  const onSentenceFocus = (e, i) => {
    if (e.currentTarget.matches(":focus-visible")) playSentence(i);
  };

  // ================================
  // SELECT NUMBER
  // ================================

  const handleChange = (i, value) => {
    if (isLocked(i)) return;

    if (value) {
      // مين ماسك هالرقم هلأ؟
      const holder = answers.findIndex((a, k) => k !== i && a === value);

      if (holder !== -1) {
        // قبل Check، أو الرقم عند سؤال مقفول: ما بينقبل
        if (!checked || isLocked(holder)) {
          setAnnouncement(
            `Number ${value} is already used. Choose another number.`,
          );
          return;
        }

        // بعد Check: الرقم عند سؤال غلط ← بنبدّل بين السؤالين
        // (السؤال الثاني بياخد الرقم القديم تبع هالسؤال) فما بيصير تكرار
        const previous = answers[i];

        setAnswers((prev) => {
          const next = [...prev];
          next[holder] = previous;
          next[i] = value;
          return next;
        });

        // السؤالين اللي انعدّلوا: بتنشال علامة ✕
        setWrongIds((prev) => prev.filter((x) => x !== i && x !== holder));

        setAnnouncement(
          `Sentence ${i + 1}: number ${value} selected. Sentence ${holder + 1} ${
            previous ? `now has number ${previous}` : "is now empty"
          }.`,
        );
        return;
      }
    }

    setAnswers((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });

    // السؤال اللي كان غلط وانعدّل: بتنشال علامة ✕
    setWrongIds((prev) => prev.filter((x) => x !== i));

    setAnnouncement(
      value
        ? `Sentence ${i + 1}: number ${value} selected.`
        : `Sentence ${i + 1}: number cleared.`,
    );
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
    if (questions.some((_, i) => !lockedSet.has(i) && !answers[i])) {
      const msg = "Please complete all answers";

      ValidationAlert.info(msg);
      setAnnouncement(msg);
      return;
    }

    // 2) مقارنة الإجابات
    const nextLocked = new Set(lockedSet);
    const nextWrong = [];

    questions.forEach((q, i) => {
      if (nextLocked.has(i)) return;

      if (answers[i] === String(q.answer)) nextLocked.add(i);
      else nextWrong.push(i);
    });

    setLockedSet(nextLocked);
    setWrongIds(nextWrong);
    setChecked(true);

    // 3) حساب السكور
    const score = nextLocked.size;

    // الفيدباك المحكي: كل سؤال صح أو غلط
    setAnnouncement(
      [
        `Score ${score} out of ${TOTAL}.`,
        ...questions.map(
          (_, i) =>
            `Sentence ${i + 1} is ${
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

    const message = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
        Score: ${score} / ${TOTAL}
        </span>
      </div>
    `;

    if (score === TOTAL) ValidationAlert.success(message);
    else if (score === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);
  };

  // ================================
  // SHOW ANSWER / START AGAIN
  // ================================

  const handleShowAnswers = () => {
    if (showAnswer) return;

    stopAudio();
    pauseOtherAudio();

    setAnswers(questions.map((q) => String(q.answer)));
    setLockedSet(new Set());
    setWrongIds([]);
    setShowAnswer(true);

    setAnnouncement("All answers shown. Every sentence has its number.");
  };

  // بيمسح كل الأرقام، الفيدباك، القفل، والسكور، وبيوقف الصوت
  const reset = () => {
    stopAudio();
    pauseOtherAudio();

    setAnswers(Array(TOTAL).fill(""));
    setLockedSet(new Set());
    setWrongIds([]);
    setChecked(false);
    setShowAnswer(false);

    setAnnouncement("Activity reset. All numbers and results are cleared.");
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

      <div className="div-forall" style={{ gap: "25px" }}>
        <ExerciseHeader
          sectionLetter="A"
          title="Read, look, and complete the sentences."
          subTitle="Use the picture and word clues, then type the missing word or sentence carefully."
          isReview={true}
        />

        <p id="r6p1q1-help" className="sr-only">
          Look at the four pictures. Read each sentence and choose the number of
          the picture it matches. Each number can be used only once. Press Tab
          to move between the sentences and the number selectors. Press Enter or
          Space on a sentence to hear it. Use the arrow keys or type a number to
          choose it. Choose the dash to clear a number. Press Check Answer to
          check. Correct answers are locked and wrong answers can be changed.
          After checking, choosing a number used by a wrong answer swaps the two
          numbers.
        </p>

        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-y-5 gap-x-[60px]">
            {images.map((img) => (
              <div
                key={img.id}
                className="relative rounded-[14px] p-2.5 w-[85%] "
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-5 font-bold text-[18px]"
                >
                  {img.id}
                </span>

                <img
                  src={img.src}
                  alt={`Picture ${img.id}: ${img.alt}`}
                  style={{
                    width: "80%",
                    height: "auto",
                  }}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-y-5 gap-x-[60px] mt-5">
            {questions.map((q, i) => {
              const status = showAnswer
                ? "shown"
                : lockedSet.has(i)
                  ? "correct"
                  : wrongIds.includes(i)
                    ? "wrong"
                    : null;

              const selectId = `r6p1q1-select-${i}`;

              return (
                <div key={i} className="flex items-center gap-2.5">
                  {/* selector واضح لكل جملة */}
                  <div className="relative mr-2">
                    <label htmlFor={selectId} className="sr-only">
                      {`Number for sentence ${i + 1}: ${q.text}`}
                    </label>

                    <select
                      id={selectId}
                      value={answers[i]}
                      disabled={isLocked(i)}
                      aria-describedby="r6p1q1-help"
                      aria-invalid={status === "wrong"}
                      onChange={(e) => handleChange(i, e.target.value)}
                      // بنوقّف انتشار الكيبورد عشان المستمع العام ما ياخد الأسهم/Enter/Space
                      onKeyDown={(e) => e.stopPropagation()}
                      onKeyUp={(e) => e.stopPropagation()}
                      style={{ textAlignLast: "center" }}
                      className={`w-[64px] h-[40px] text-center text-[20px] rounded-lg border-2 bg-white outline-none cursor-pointer focus-visible:ring-4 focus-visible:ring-[#2563eb] disabled:cursor-default disabled:opacity-100 ${
                        status === "wrong"
                          ? "border-red-500"
                          : status === "correct" || status === "shown"
                            ? "border-3 border-green-600"
                            : "border-[#555]"
                      }`}
                    >
                      <option value="">–</option>

                      {NUMBERS.map((n) => (
                        <option
                          key={n}
                          value={n}
                          disabled={isUnavailable(i, n)}
                        >
                          {n}
                        </option>
                      ))}
                    </select>

                    {/* ❌ فوق يمين الخانة الغلط بعد Check */}
                    {status === "wrong" && (
                      <div
                        aria-hidden="true"
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md border-2 border-white pointer-events-none"
                      >
                        ✕
                      </div>
                    )}
                  </div>

                  {/* الجملة: بتشغّل صوتها بالكليك/التاب/Enter/Space */}
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={`${q.text} Press to hear it.`}
                    className="relative inline-block cursor-pointer rounded px-1 text-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb]"
                    style={{
                      border: playingIndex === i ? "2px solid #2563eb" : "",
                    }}
                    onClick={() => playSentence(i)}
                    onFocus={(e) => onSentenceFocus(e, i)}
                    onKeyDown={(e) => {
                      if (!isActivateKey(e)) return;

                      e.preventDefault();
                      e.stopPropagation();

                      if (!e.repeat) playSentence(i);
                    }}
                    onKeyUp={(e) => {
                      if (!isActivateKey(e)) return;

                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    {q.text}

                    {/* 🔊 السبيكر بيظهر بس وقت ما صوت الجملة شغّال */}
                    {playingIndex === i && <SpeakerBadge />}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="action-buttons-container">
        <button className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>

        <button
          className="show-answer-btn swal-continue"
          onClick={handleShowAnswers}
        >
          Show Answer
        </button>

        <button className="check-button2" onClick={checkAnswers}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
}
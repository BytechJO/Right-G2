/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useRef, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import Button from "../../WorkBookPages/Button";
// 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";

import img from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 51/Ex D 1.svg";

// ========================================
// AUDIO (Page 51 - D)
// ========================================

import sentenceBrushTeeth from "../../../assets/audio/ClassBook/U 6/Page 51 - D/Item_001_I_brush_my_teeth_at_six_thirty.mp3";
import sentenceWashFace from "../../../assets/audio/ClassBook/U 6/Page 51 - D/Item_002_I_wash_my_face_at_seven_o'clock.mp3";
import sentenceCombHair from "../../../assets/audio/ClassBook/U 6/Page 51 - D/Item_003_I_comb_my_hair_at_seven_thirty.mp3";
import sentenceEatBreakfast from "../../../assets/audio/ClassBook/U 6/Page 51 - D/Item_004_I_eat_my_breakfast_at_eight_o'clock.mp3";
import sentenceGoToSchool from "../../../assets/audio/ClassBook/U 6/Page 51 - D/Item_005_I_go_to_school_at_eight_thirty.mp3";

// ========================================
// DATA
// ========================================

const items = [
  {
    id: 0,
    text: "I brush my teeth at six thirty.",
    audio: sentenceBrushTeeth,
    correct: { h: 6, m: 30 },
  },
  {
    id: 1,
    text: "I wash my face at seven o’clock.",
    audio: sentenceWashFace,
    correct: { h: 7, m: 0 },
  },
  {
    id: 2,
    text: "I comb my hair at seven thirty.",
    audio: sentenceCombHair,
    correct: { h: 7, m: 30 },
  },
  {
    id: 3,
    text: "I eat my breakfast at eight o’clock.",
    audio: sentenceEatBreakfast,
    correct: { h: 8, m: 0 },
  },
  {
    id: 4,
    text: "I go to school at eight thirty.",
    audio: sentenceGoToSchool,
    correct: { h: 8, m: 30 },
  },
];

const TOTAL = items.length;

// خطوة العقرب الطويل بالدقائق: النشاط كله على الساعة (:00) والنص (:30)
// إذا بدك الطالب يقدر يحط العقرب على كل رقم بالساعة، غيّريها لـ 5
const MINUTE_STEP = 30;

// الساعة المبدئية (12:00) ما هي جواب لأي سؤال، فما بتكشف شي
const initialTimes = () => items.map(() => ({ h: 12, m: 0, touched: false }));

// ========================================
// CLOCK GEOMETRY (viewBox 200 × 200)
// ========================================

const CENTER = 100;

const HANDS = {
  hour: { len: 50, width: 7, knob: 9, color: "#2c5287", hit: 28 },
  minute: { len: 80, width: 4, knob: 8, color: "#e53935", hit: 30 },
};

const polar = (r, deg) => {
  const rad = (deg * Math.PI) / 180;

  return {
    x: +(CENTER + r * Math.sin(rad)).toFixed(2),
    y: +(CENTER - r * Math.cos(rad)).toFixed(2),
  };
};

const TICKS = Array.from({ length: 60 }, (_, i) => {
  const major = i % 5 === 0;
  const a = polar(major ? 82 : 87, i * 6);
  const b = polar(92, i * 6);

  return { i, major, x1: a.x, y1: a.y, x2: b.x, y2: b.y };
});

const NUMERALS = Array.from({ length: 12 }, (_, i) => ({
  n: i + 1,
  ...polar(64, (i + 1) * 30),
}));

// ========================================
// HELPERS (خارج الكومبوننت)
// ========================================

const pad2 = (n) => String(n).padStart(2, "0");

const digitalTime = ({ h, m }) => `${h}:${pad2(m)}`;

const spokenTime = ({ h, m }) =>
  m === 0 ? `${h} o'clock` : m === 30 ? `${h} thirty` : `${h}:${pad2(m)}`;

// ========================================
// BADGES
// ========================================

// سبيكر أسود داخل دائرة بيضا: بيظهر بس وقت ما صوت الجملة شغّال
// eslint-disable-next-line react-refresh/only-export-components
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

// ✓ / ✕ فوق يمين الساعة بعد Check (الشكل مختلف مش بس اللون)
const ResultMark = ({ ok }) => (
  <span
    aria-hidden="true"
    style={{
      position: "absolute",
      top: -6,
      right: -6,
      width: 24,
      height: 24,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
      zIndex: 2,
      background: ok ? "#4caf50" : "#e53935",
      color: "#fff",
      fontSize: 14,
      fontWeight: 700,
      lineHeight: 1,
      border: "2px solid #fff",
    }}
  >
    {ok ? "✓" : "✕"}
  </span>
);

// ========================================
// CLOCK
// ========================================

const Clock = ({
  index,
  time,
  interactive,
  status,
  svgRef,
  focusedHand,
  onHandKeyDown,
  onHandKeyUp,
  onHandPointerDown,
  onHandPointerMove,
  onHandPointerEnd,
  onHandFocus,
  onHandBlur,
}) => {
  // العقرب القصير بيتحرك شوي مع الدقائق (متل الساعة الحقيقية)
  const hourAngle = (time.h % 12) * 30 + time.m / 2;
  const minuteAngle = time.m * 6;

  // إذا العقربين قريبين من بعض: العقرب القصير هو اللي بيتمسك من جسمه،
  // والطويل بيتمسك من الطرف (بهالطريقة ما في عقرب بيغطي التاني)
  const gap = Math.abs(((hourAngle - minuteAngle + 540) % 360) - 180);

  const hands = [
    { name: "hour", angle: hourAngle, hitFrom: 0 },
    {
      name: "minute",
      angle: minuteAngle,
      hitFrom: gap < 25 ? HANDS.hour.len + 10 : 0,
    },
  ];

  const ring =
    status === "correct" || status === "shown"
      ? "#4caf50"
      : status === "wrong"
        ? "#e53935"
        : "#e7a98e";

  return (
    <div
      className="relative"
      style={{ width: "clamp(130px, 17vw, 170px)", aspectRatio: "1 / 1" }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 200 200"
        width="100%"
        height="100%"
        style={{
          display: "block",
          overflow: "visible",
          touchAction: "none",
          userSelect: "none",
          WebkitTouchCallout: "none",
        }}
      >
        <circle
          cx={CENTER}
          cy={CENTER}
          r="95"
          fill="#f4f4f4"
          stroke={ring}
          strokeWidth="4"
        />

        <g aria-hidden="true" style={{ pointerEvents: "none" }}>
          {TICKS.map((t) => (
            <line
              key={t.i}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={t.major ? "#555" : "#aaa"}
              strokeWidth={t.major ? 2.5 : 1}
              strokeLinecap="round"
            />
          ))}

          {NUMERALS.map((num) => (
            <text
              key={num.n}
              x={num.x}
              y={num.y}
              dy=".35em"
              textAnchor="middle"
              fontSize="18"
              fontWeight="600"
              fill="#333"
            >
              {num.n}
            </text>
          ))}
        </g>

        {hands.map(({ name, angle, hitFrom }) => {
          const spec = HANDS[name];
          const focused = interactive && focusedHand === name;
          const tipY = CENTER - spec.len;

          return (
            <g
              key={name}
              role="slider"
              tabIndex={interactive ? 0 : -1}
              aria-label={`Clock ${index + 1}, ${name} hand`}
              aria-valuemin={name === "hour" ? 1 : 0}
              aria-valuemax={name === "hour" ? 12 : 59}
              aria-valuenow={name === "hour" ? time.h : time.m}
              aria-valuetext={
                name === "hour" ? `Hour ${time.h}` : `${time.m} minutes`
              }
              aria-disabled={!interactive}
              aria-describedby="u6p6q1-help"
              transform={`rotate(${angle} ${CENTER} ${CENTER})`}
              onFocus={() => onHandFocus(index, name)}
              onBlur={() => onHandBlur(index, name)}
              onKeyDown={(e) => onHandKeyDown(e, index, name)}
              onKeyUp={onHandKeyUp}
              onPointerDown={(e) => onHandPointerDown(e, index, name)}
              onPointerMove={(e) => onHandPointerMove(e, index, name)}
              onPointerUp={(e) => onHandPointerEnd(e, index, name, false)}
              onPointerCancel={(e) => onHandPointerEnd(e, index, name, true)}
              style={{
                outline: "none",
                cursor: interactive ? "grab" : "default",
              }}
            >
              {/* حلقة الفوكس */}
              {focused && (
                <>
                  <line
                    x1={CENTER}
                    y1={CENTER}
                    x2={CENTER}
                    y2={tipY}
                    stroke="#2563eb"
                    strokeOpacity=".45"
                    strokeWidth={spec.width + 10}
                    strokeLinecap="round"
                  />
                  <circle
                    cx={CENTER}
                    cy={tipY}
                    r={spec.knob + 5}
                    fill="#2563eb"
                    fillOpacity=".45"
                  />
                </>
              )}

              {/* العقرب (مع ذيل صغير ورا المركز) */}
              <line
                x1={CENTER}
                y1={CENTER + 12}
                x2={CENTER}
                y2={tipY}
                stroke={spec.color}
                strokeWidth={spec.width}
                strokeLinecap="round"
              />

              {/* مقبض بالطرف: أسهل شي للمسك */}
              <circle
                cx={CENTER}
                cy={tipY}
                r={spec.knob}
                fill={spec.color}
                stroke="#fff"
                strokeWidth="2"
              />

              {/* منطقة مسك عريضة وشفافة */}
              <line
                x1={CENTER}
                y1={CENTER - hitFrom}
                x2={CENTER}
                y2={tipY}
                stroke="rgba(0,0,0,0)"
                strokeWidth={spec.hit}
                strokeLinecap="round"
                style={{ pointerEvents: "stroke" }}
              />
            </g>
          );
        })}

        {/* مركز الساعة */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r="5"
          fill="#333"
          stroke="#fff"
          strokeWidth="1.5"
          style={{ pointerEvents: "none" }}
        />
      </svg>

      {status === "correct" && <ResultMark ok />}
      {status === "wrong" && <ResultMark ok={false} />}
    </div>
  );
};

// ========================================
// MAIN
// ========================================

const Unit6_Page6_Q1 = () => {
  // كل ساعة: { h: 1..12, m: 0..59, touched }
  const [times, setTimes] = useState(initialTimes);

  // الساعات اللي جوابها صح بعد Check (بتنقفل)
  const [lockedSet, setLockedSet] = useState(() => new Set());

  // الساعات اللي جوابها غلط بعد آخر Check (بتضل قابلة للتعديل)
  const [wrongIds, setWrongIds] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  // العقرب اللي عليه الفوكس / السحب: { i, hand }
  const [focusKey, setFocusKey] = useState(null);

  const [playingIndex, setPlayingIndex] = useState(null);

  const timesRef = useRef(times);
  timesRef.current = times;

  const svgRefs = useRef({});
  const dragRef = useRef(null);
  const audioOwner = useRef({}).current;

  const allDone = lockedSet.size === TOTAL;

  const isLocked = (i) => showAnswer || lockedSet.has(i);

  // ========================================
  // AUDIO
  // ========================================

  const stopAudio = () => {
    stopGlobalAudio(audioOwner);
    setPlayingIndex(null);
  };

  // playGlobalAudio بيوقف أي صوت ثاني شغّال قبل ما يشغّل هاد
  const playSentenceAudio = (i) => {
    const audio = items[i].audio;

    if (!audio) return;

    playGlobalAudio(audio, {
      owner: audioOwner,
      onFinish: () => setPlayingIndex((prev) => (prev === i ? null : prev)),
    });

    setPlayingIndex(i);
  };

  // وقف الصوت إذا سكرت الصفحة
  useEffect(() => () => stopGlobalAudio(audioOwner), [audioOwner]);

  // ========================================
  // CLOCK STATE
  // ========================================

  // بيغيّر ساعة وحدة وبيرجّع قيمتها الجديدة
  // (بنحدّث الـ ref فوراً عشان الضغط السريع بالأسهم ما يقرأ قيمة قديمة)
  const commit = (i, patch) => {
    const next = timesRef.current.map((t, idx) =>
      idx === i ? { ...t, ...patch, touched: true } : t,
    );

    timesRef.current = next;
    setTimes(next);

    // الساعة اللي كانت غلط وانعدّلت: بتشيل علامة ✕
    setWrongIds((prev) => prev.filter((id) => id !== i));

    return next[i];
  };

  const announceTime = (i, hand) => {
    const t = timesRef.current[i];

    setAnnouncement(
      `Clock ${i + 1}, ${hand} hand. The time is ${spokenTime(t)}.`,
    );
  };

  // خطوة وحدة للعقرب: dir = +1 أو -1
  const stepHand = (i, hand, dir) => {
    const cur = timesRef.current[i];

    const next = commit(
      i,
      hand === "hour"
        ? { h: ((cur.h - 1 + dir + 12) % 12) + 1 }
        : { m: (cur.m + dir * MINUTE_STEP + 60) % 60 },
    );

    setAnnouncement(
      `Clock ${i + 1}, ${hand} hand. The time is ${spokenTime(next)}.`,
    );
  };

  const resetClock = (i) => {
    const next = timesRef.current.map((t, idx) =>
      idx === i ? { h: 12, m: 0, touched: false } : t,
    );

    timesRef.current = next;
    setTimes(next);
    setWrongIds((prev) => prev.filter((id) => id !== i));
    setAnnouncement(`Clock ${i + 1} reset.`);
  };

  // ========================================
  // KEYBOARD
  // الأسهم: خطوة بالاتجاه / Enter أو Space: خطوة للأمام / Backspace: تصفير الساعة
  // بنوقّف انتشار الحدث لأن الكتاب غالباً عنده مستمع كيبورد عام على Enter و Space
  // ========================================

  const onHandKeyDown = (e, i, hand) => {
    if (isLocked(i)) return;

    let dir = 0;

    if (e.key === "ArrowUp" || e.key === "ArrowRight") dir = 1;
    else if (e.key === "ArrowDown" || e.key === "ArrowLeft") dir = -1;
    else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      if (!e.repeat) stepHand(i, hand, 1);

      return;
    } else if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      e.stopPropagation();
      resetClock(i);
      return;
    } else return;

    e.preventDefault();
    e.stopPropagation();
    stepHand(i, hand, dir);
  };

  const onHandKeyUp = (e) => {
    if (e.key === "Enter" || e.key === " ") e.stopPropagation();
  };

  // الجملة: Enter / Space بيشغّلوا صوتها
  const onSentenceKeyDown = (e, i) => {
    if (e.key !== "Enter" && e.key !== " ") return;

    e.preventDefault();
    e.stopPropagation();

    if (!e.repeat) playSentenceAudio(i);
  };

  // فوكس بالتاب على جملة = شغّل صوتها (الماوس/اللمس بيروحوا على onClick)
  const onSentenceFocus = (e, i) => {
    if (e.currentTarget.matches(":focus-visible")) playSentenceAudio(i);
  };

  // ========================================
  // DRAG (Mouse + Touch + Pen)
  // العقرب بيلحق المؤشر وبيثبت (snap) على أقرب خطوة
  // ========================================

  const pointerAngle = (i, e) => {
    const svg = svgRefs.current[i];

    if (!svg) return null;

    const rect = svg.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);

    // قريب كثير من المركز: الزاوية مش مستقرة
    if (Math.hypot(dx, dy) < 6) return null;

    return ((Math.atan2(dx, -dy) * 180) / Math.PI + 360) % 360;
  };

  const moveHand = (i, hand, angle) => {
    const cur = timesRef.current[i];

    if (hand === "hour") {
      // بنطرح ميلان العقرب القصير مع الدقائق قبل ما نحسب الساعة
      const h = Math.round(((angle - cur.m / 2 + 360) % 360) / 30) % 12 || 12;

      if (h === cur.h && cur.touched) return;

      commit(i, { h });
      return;
    }

    const m = (Math.round(angle / 6 / MINUTE_STEP) * MINUTE_STEP) % 60;

    if (m === cur.m && cur.touched) return;

    commit(i, { m });
  };

  const onHandPointerDown = (e, i, hand) => {
    if (isLocked(i)) return;

    if (e.pointerType === "mouse" && e.button !== 0) return;

    dragRef.current = { i, hand, pointerId: e.pointerId };

    setFocusKey({ i, hand });

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ما في مشكلة إذا المتصفح ما دعمها */
    }
  };

  const onHandPointerMove = (e, i, hand) => {
    const d = dragRef.current;

    if (!d || d.pointerId !== e.pointerId || d.i !== i || d.hand !== hand) {
      return;
    }

    const angle = pointerAngle(i, e);

    if (angle !== null) moveHand(i, hand, angle);
  };

  const onHandPointerEnd = (e, i, hand, cancelled) => {
    const d = dragRef.current;

    if (!d || d.pointerId !== e.pointerId) return;

    dragRef.current = null;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ما في مشكلة */
    }

    if (!cancelled && timesRef.current[i].touched) announceTime(i, hand);
  };

  // ========================================
  // CHECK
  // الصح بينقفل (أخضر ✓)، الغلط بيضل ✕ وبيقدر الطالب يعدّله
  // ========================================

  const checkAnswers = () => {
    if (showAnswer || allDone) return;

    stopAudio();

    if (times.some((t) => !t.touched)) {
      const msg = "Please set the time on every clock.";

      ValidationAlert.info("Oops!", msg);
      setAnnouncement(msg);
      return;
    }

    const nextLocked = new Set(lockedSet);
    const nextWrong = [];

    times.forEach((t, i) => {
      if (nextLocked.has(i)) return;

      if (t.h === items[i].correct.h && t.m === items[i].correct.m) {
        nextLocked.add(i);
      } else {
        nextWrong.push(i);
      }
    });

    const score = nextLocked.size;

    setLockedSet(nextLocked);
    setWrongIds(nextWrong);

    setAnnouncement(
      [
        `Score ${score} out of ${TOTAL}.`,
        nextWrong.length
          ? `Clock ${nextWrong.map((i) => i + 1).join(", ")} ${
              nextWrong.length > 1 ? "are" : "is"
            } not correct. You can change ${
              nextWrong.length > 1 ? "them" : "it"
            } and check again.`
          : "All answers are correct.",
      ].join(" "),
    );

    const color = score === TOTAL ? "green" : score === 0 ? "red" : "orange";

    const message = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${score} / ${TOTAL}
        </span>
      </div>
    `;

    if (score === TOTAL) ValidationAlert.success(message);
    else if (score === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);
  };

  // ========================================
  // SHOW ANSWER / START AGAIN
  // ========================================

  const showAnswers = () => {
    stopAudio();
    dragRef.current = null;
    setFocusKey(null);

    const next = items.map((item) => ({ ...item.correct, touched: true }));

    timesRef.current = next;
    setTimes(next);
    setLockedSet(new Set());
    setWrongIds([]);
    setShowAnswer(true);

    setAnnouncement("All answers shown. Every clock shows the correct time.");
  };

  // بيرجّع الساعات، علامات ✓ / ✕، النتيجة، والصوت للوضع الأول
  const reset = () => {
    stopAudio();
    dragRef.current = null;
    setFocusKey(null);

    const next = initialTimes();

    timesRef.current = next;
    setTimes(next);
    setLockedSet(new Set());
    setWrongIds([]);
    setShowAnswer(false);

    setAnnouncement("Activity reset. All clocks and results are cleared.");
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "30px",
        width: "100%",
        boxSizing: "border-box",
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

      <div className="div-forall">
        <ExerciseHeader
          sectionLetter="D"
          title="Read and then draw the time."
          subTitle="Read the time sentence first, then move the clock hands to match it exactly"
        />

        <p id="u6p6q1-help" className="sr-only">
          Each sentence has a clock. Press a sentence to hear it. Press Tab to
          reach the hour hand and then the minute hand of the clock. Use the
          arrow keys, or press Enter or Space, to move the focused hand to the
          next position. The hour hand moves one hour at a time and the minute
          hand moves in steps of {MINUTE_STEP} minutes. Press Backspace to reset
          the clock. You can also drag the hands with a mouse or your finger.
          Press Check Answer to check all the clocks. Correct clocks are locked
          and wrong clocks can be changed.
        </p>

        <div
          className="flex w-full"
          style={{ justifyContent: "space-between" }}
        >
          {/* ⚠️ alt مؤقت: عدّليه حسب الصورة. إذا الصورة فيها ساعات جاهزة فاحذفيها أو عدّلي */}
          <img
            src={img}
            alt="Illustration of Helen's morning routine."
            draggable="false"
            style={{ height: "400px", width: "auto" }}
          />

          <div
            className="grid grid-cols-2 gap-y-5 gap-x-6"
            style={{ marginBottom: "50px" }}
          >
            {items.map((item, i) => {
              const t = times[i];
              const locked = isLocked(i);
              const isWrong = wrongIds.includes(i);
              const isPlaying = playingIndex === i;

              const status = showAnswer
                ? "shown"
                : lockedSet.has(i)
                  ? "correct"
                  : isWrong
                    ? "wrong"
                    : null;

              const statusText = showAnswer
                ? `Answer shown: ${spokenTime(t)}.`
                : lockedSet.has(i)
                  ? `Correct. ${spokenTime(t)}.`
                  : isWrong
                    ? `Not correct. Set to ${spokenTime(t)}. Change it and check again.`
                    : t.touched
                      ? `Set to ${spokenTime(t)}.`
                      : "Not set yet.";

              const ring =
                status === "correct" || status === "shown"
                  ? "#4caf50"
                  : status === "wrong"
                    ? "#e53935"
                    : "#e7a98e";

              return (
                <div key={item.id} className="flex flex-col gap-2.5">
                  {/* الجملة: بتشغّل صوتها */}
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={`Sentence ${i + 1}: ${item.text} Press to hear it.`}
                    onClick={() => playSentenceAudio(i)}
                    onKeyDown={(e) => onSentenceKeyDown(e, i)}
                    onKeyUp={onHandKeyUp}
                    onFocus={(e) => onSentenceFocus(e, i)}
                    className="relative w-fit text-[18px] cursor-pointer rounded-md focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb]"
                    style={{height:"50px"}}
                  >
                    <span className="font-bold mr-1.5">{i + 1}</span>
                    {item.text}

                    {/* 🔊 السبيكر بيظهر بس وقت ما صوت الجملة شغّال */}
                    {isPlaying && <SpeakerBadge />}
                  </div>

                  <div
                    role="group"
                    aria-label={`Clock ${i + 1} for sentence ${i + 1}. ${statusText}`}
                    className="flex items-center gap-4"
                  >
                    <Clock
                      index={i}
                      time={t}
                      interactive={!locked}
                      status={status}
                      svgRef={(el) => {
                        svgRefs.current[i] = el;
                      }}
                      focusedHand={focusKey?.i === i ? focusKey.hand : null}
                      onHandKeyDown={onHandKeyDown}
                      onHandKeyUp={onHandKeyUp}
                      onHandPointerDown={onHandPointerDown}
                      onHandPointerMove={onHandPointerMove}
                      onHandPointerEnd={onHandPointerEnd}
                      onHandFocus={(idx, hand) => setFocusKey({ i: idx, hand })}
                      onHandBlur={(idx, hand) =>
                        setFocusKey((prev) =>
                          prev && prev.i === idx && prev.hand === hand
                            ? null
                            : prev,
                        )
                      }
                    />

                    {/* الوقت الرقمي (للقراءة بس) */}
                    <div
                      aria-hidden="true"
                      className="flex items-center justify-center border-2 rounded-[14px] bg-[#f4f4f4] w-[90px] h-14 text-[26px] font-semibold"
                      style={{ borderColor: ring }}
                    >
                      {t.touched ? digitalTime(t) : "--:--"}
                    </div>
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
    </div>
  );
};

export default Unit6_Page6_Q1;






// import React, { useEffect, useRef, useState } from "react";
// import { FaVolumeUp } from "react-icons/fa";
// import ValidationAlert from "../../Popup/ValidationAlert";
// import ExerciseHeader from "../../ExerciseHeader";
// import Button from "../../WorkBookPages/Button";
// // 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
// import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";

// import img from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 51/Ex D 1.svg";

// // ========================================
// // AUDIO (Page 51 - D)
// // ========================================

// import sentenceBrushTeeth from "../../../assets/audio/ClassBook/U 6/Page 51 - D/Item_001_I_brush_my_teeth_at_six_thirty.mp3";
// import sentenceWashFace from "../../../assets/audio/ClassBook/U 6/Page 51 - D/Item_002_I_wash_my_face_at_seven_o'clock.mp3";
// import sentenceCombHair from "../../../assets/audio/ClassBook/U 6/Page 51 - D/Item_003_I_comb_my_hair_at_seven_thirty.mp3";
// import sentenceEatBreakfast from "../../../assets/audio/ClassBook/U 6/Page 51 - D/Item_004_I_eat_my_breakfast_at_eight_o'clock.mp3";
// import sentenceGoToSchool from "../../../assets/audio/ClassBook/U 6/Page 51 - D/Item_005_I_go_to_school_at_eight_thirty.mp3";

// // ========================================
// // DATA
// // ========================================

// const items = [
//   {
//     id: 0,
//     text: "I brush my teeth at six thirty.",
//     audio: sentenceBrushTeeth,
//     correct: { h: 6, m: 30 },
//   },
//   {
//     id: 1,
//     text: "I wash my face at seven o’clock.",
//     audio: sentenceWashFace,
//     correct: { h: 7, m: 0 },
//   },
//   {
//     id: 2,
//     text: "I comb my hair at seven thirty.",
//     audio: sentenceCombHair,
//     correct: { h: 7, m: 30 },
//   },
//   {
//     id: 3,
//     text: "I eat my breakfast at eight o’clock.",
//     audio: sentenceEatBreakfast,
//     correct: { h: 8, m: 0 },
//   },
//   {
//     id: 4,
//     text: "I go to school at eight thirty.",
//     audio: sentenceGoToSchool,
//     correct: { h: 8, m: 30 },
//   },
// ];

// const TOTAL = items.length;

// // خطوة العقرب الطويل بالدقائق: النشاط كله على الساعة (:00) والنص (:30)
// // إذا بدك الطالب يقدر يحط العقرب على كل رقم بالساعة، غيّريها لـ 5
// const MINUTE_STEP = 30;

// // الساعة المبدئية (12:00) ما هي جواب لأي سؤال، فما بتكشف شي
// const initialTimes = () =>
//   items.map(() => ({ h: 12, m: 0, touched: false }));

// // ========================================
// // CLOCK GEOMETRY (viewBox 200 × 200)
// // ========================================

// const CENTER = 100;

// const HANDS = {
//   hour: { len: 50, width: 7, knob: 9, color: "#2c5287", hit: 28 },
//   minute: { len: 80, width: 4, knob: 8, color: "#e53935", hit: 30 },
// };

// const polar = (r, deg) => {
//   const rad = (deg * Math.PI) / 180;

//   return {
//     x: +(CENTER + r * Math.sin(rad)).toFixed(2),
//     y: +(CENTER - r * Math.cos(rad)).toFixed(2),
//   };
// };

// const TICKS = Array.from({ length: 60 }, (_, i) => {
//   const major = i % 5 === 0;
//   const a = polar(major ? 82 : 87, i * 6);
//   const b = polar(92, i * 6);

//   return { i, major, x1: a.x, y1: a.y, x2: b.x, y2: b.y };
// });

// const NUMERALS = Array.from({ length: 12 }, (_, i) => ({
//   n: i + 1,
//   ...polar(64, (i + 1) * 30),
// }));

// // ========================================
// // HELPERS (خارج الكومبوننت)
// // ========================================

// const pad2 = (n) => String(n).padStart(2, "0");

// const digitalTime = ({ h, m }) => `${h}:${pad2(m)}`;

// const spokenTime = ({ h, m }) =>
//   m === 0 ? `${h} o'clock` : m === 30 ? `${h} thirty` : `${h}:${pad2(m)}`;

// // ========================================
// // BADGES
// // ========================================

// // سبيكر أسود داخل دائرة بيضا: بيظهر بس وقت ما صوت الجملة شغّال
// const SpeakerBadge = () => (
//   <span
//     aria-hidden="true"
//     style={{
//       position: "absolute",
//       top: -10,
//       right: -10,
//       width: 22,
//       height: 22,
//       borderRadius: "50%",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       pointerEvents: "none",
//       zIndex: 2,
//       lineHeight: 1,
//       background: "#fff",
//       color: "#000",
//       boxShadow: "0 1px 3px rgba(0,0,0,.25)",
//     }}
//   >
//     <FaVolumeUp size={12} />
//   </span>
// );

// // ✓ / ✕ فوق يمين الساعة بعد Check (الشكل مختلف مش بس اللون)
// const ResultMark = ({ ok }) => (
//   <span
//     aria-hidden="true"
//     style={{
//       position: "absolute",
//       top: -6,
//       right: -6,
//       width: 24,
//       height: 24,
//       borderRadius: "50%",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       pointerEvents: "none",
//       zIndex: 2,
//       background: ok ? "#4caf50" : "#e53935",
//       color: "#fff",
//       fontSize: 14,
//       fontWeight: 700,
//       lineHeight: 1,
//       border: "2px solid #fff",
//     }}
//   >
//     {ok ? "✓" : "✕"}
//   </span>
// );

// // ========================================
// // CLOCK
// // ========================================

// const Clock = ({
//   index,
//   time,
//   interactive,
//   status,
//   svgRef,
//   focusedHand,
//   onHandKeyDown,
//   onHandKeyUp,
//   onHandPointerDown,
//   onHandPointerMove,
//   onHandPointerEnd,
//   onHandFocus,
//   onHandBlur,
// }) => {
//   // العقرب القصير بيتحرك شوي مع الدقائق (متل الساعة الحقيقية)
//   const hourAngle = (time.h % 12) * 30 + time.m / 2;
//   const minuteAngle = time.m * 6;

//   // إذا العقربين قريبين من بعض: العقرب القصير هو اللي بيتمسك من جسمه،
//   // والطويل بيتمسك من الطرف (بهالطريقة ما في عقرب بيغطي التاني)
//   const gap = Math.abs(((hourAngle - minuteAngle + 540) % 360) - 180);

//   const hands = [
//     { name: "hour", angle: hourAngle, hitFrom: 0 },
//     {
//       name: "minute",
//       angle: minuteAngle,
//       hitFrom: gap < 25 ? HANDS.hour.len + 10 : 0,
//     },
//   ];

//   const ring =
//     status === "correct" || status === "shown"
//       ? "#4caf50"
//       : status === "wrong"
//         ? "#e53935"
//         : "#e7a98e";

//   return (
//     <div
//       className="relative"
//       style={{ width: "clamp(130px, 17vw, 170px)", aspectRatio: "1 / 1" }}
//     >
//       <svg
//         ref={svgRef}
//         viewBox="0 0 200 200"
//         width="100%"
//         height="100%"
//         style={{
//           display: "block",
//           overflow: "visible",
//           touchAction: "none",
//           userSelect: "none",
//           WebkitTouchCallout: "none",
//         }}
//       >
//         <circle
//           cx={CENTER}
//           cy={CENTER}
//           r="95"
//           fill="#f4f4f4"
//           stroke={ring}
//           strokeWidth="4"
//         />

//         <g aria-hidden="true" style={{ pointerEvents: "none" }}>
//           {TICKS.map((t) => (
//             <line
//               key={t.i}
//               x1={t.x1}
//               y1={t.y1}
//               x2={t.x2}
//               y2={t.y2}
//               stroke={t.major ? "#555" : "#aaa"}
//               strokeWidth={t.major ? 2.5 : 1}
//               strokeLinecap="round"
//             />
//           ))}

//           {NUMERALS.map((num) => (
//             <text
//               key={num.n}
//               x={num.x}
//               y={num.y}
//               dy=".35em"
//               textAnchor="middle"
//               fontSize="18"
//               fontWeight="600"
//               fill="#333"
//             >
//               {num.n}
//             </text>
//           ))}
//         </g>

//         {hands.map(({ name, angle, hitFrom }) => {
//           const spec = HANDS[name];
//           const focused = interactive && focusedHand === name;
//           const tipY = CENTER - spec.len;

//           return (
//             <g
//               key={name}
//               role="slider"
//               tabIndex={interactive ? 0 : -1}
//               aria-label={`Clock ${index + 1}, ${name} hand`}
//               aria-valuemin={name === "hour" ? 1 : 0}
//               aria-valuemax={name === "hour" ? 12 : 59}
//               aria-valuenow={name === "hour" ? time.h : time.m}
//               aria-valuetext={
//                 name === "hour" ? `Hour ${time.h}` : `${time.m} minutes`
//               }
//               aria-disabled={!interactive}
//               aria-describedby="u6p6q1-help"
//               transform={`rotate(${angle} ${CENTER} ${CENTER})`}
//               onFocus={() => onHandFocus(index, name)}
//               onBlur={() => onHandBlur(index, name)}
//               onKeyDown={(e) => onHandKeyDown(e, index, name)}
//               onKeyUp={onHandKeyUp}
//               onPointerDown={(e) => onHandPointerDown(e, index, name)}
//               onPointerMove={(e) => onHandPointerMove(e, index, name)}
//               onPointerUp={(e) => onHandPointerEnd(e, index, name, false)}
//               onPointerCancel={(e) => onHandPointerEnd(e, index, name, true)}
//               style={{
//                 outline: "none",
//                 cursor: interactive ? "grab" : "default",
//               }}
//             >
//               {/* حلقة الفوكس */}
//               {focused && (
//                 <>
//                   <line
//                     x1={CENTER}
//                     y1={CENTER}
//                     x2={CENTER}
//                     y2={tipY}
//                     stroke="#2563eb"
//                     strokeOpacity=".45"
//                     strokeWidth={spec.width + 10}
//                     strokeLinecap="round"
//                   />
//                   <circle
//                     cx={CENTER}
//                     cy={tipY}
//                     r={spec.knob + 5}
//                     fill="#2563eb"
//                     fillOpacity=".45"
//                   />
//                 </>
//               )}

//               {/* العقرب (مع ذيل صغير ورا المركز) */}
//               <line
//                 x1={CENTER}
//                 y1={CENTER + 12}
//                 x2={CENTER}
//                 y2={tipY}
//                 stroke={spec.color}
//                 strokeWidth={spec.width}
//                 strokeLinecap="round"
//               />

//               {/* مقبض بالطرف: أسهل شي للمسك */}
//               <circle
//                 cx={CENTER}
//                 cy={tipY}
//                 r={spec.knob}
//                 fill={spec.color}
//                 stroke="#fff"
//                 strokeWidth="2"
//               />

//               {/* منطقة مسك عريضة وشفافة */}
//               <line
//                 x1={CENTER}
//                 y1={CENTER - hitFrom}
//                 x2={CENTER}
//                 y2={tipY}
//                 stroke="rgba(0,0,0,0)"
//                 strokeWidth={spec.hit}
//                 strokeLinecap="round"
//                 style={{ pointerEvents: "stroke" }}
//               />
//             </g>
//           );
//         })}

//         {/* مركز الساعة */}
//         <circle
//           cx={CENTER}
//           cy={CENTER}
//           r="5"
//           fill="#333"
//           stroke="#fff"
//           strokeWidth="1.5"
//           style={{ pointerEvents: "none" }}
//         />
//       </svg>

//       {status === "correct" && <ResultMark ok />}
//       {status === "wrong" && <ResultMark ok={false} />}
//     </div>
//   );
// };

// // ========================================
// // MAIN
// // ========================================

// const Unit6_Page6_Q1 = () => {
//   // كل ساعة: { h: 1..12, m: 0..59, touched }
//   const [times, setTimes] = useState(initialTimes);

//   // الساعات اللي جوابها صح بعد Check (بتنقفل)
//   const [lockedSet, setLockedSet] = useState(() => new Set());

//   // الساعات اللي جوابها غلط بعد آخر Check (بتضل قابلة للتعديل)
//   const [wrongIds, setWrongIds] = useState([]);

//   const [showAnswer, setShowAnswer] = useState(false);
//   const [announcement, setAnnouncement] = useState("");

//   // العقرب اللي عليه الفوكس / السحب: { i, hand }
//   const [focusKey, setFocusKey] = useState(null);

//   const [playingIndex, setPlayingIndex] = useState(null);

//   const timesRef = useRef(times);
//   timesRef.current = times;

//   const svgRefs = useRef({});
//   const dragRef = useRef(null);
//   const audioOwner = useRef({}).current;

//   const allDone = lockedSet.size === TOTAL;

//   const isLocked = (i) => showAnswer || lockedSet.has(i);

//   // ========================================
//   // AUDIO
//   // ========================================

//   const stopAudio = () => {
//     stopGlobalAudio(audioOwner);
//     setPlayingIndex(null);
//   };

//   // playGlobalAudio بيوقف أي صوت ثاني شغّال قبل ما يشغّل هاد
//   const playSentenceAudio = (i) => {
//     const audio = items[i].audio;

//     if (!audio) return;

//     playGlobalAudio(audio, {
//       owner: audioOwner,
//       onFinish: () => setPlayingIndex((prev) => (prev === i ? null : prev)),
//     });

//     setPlayingIndex(i);
//   };

//   // وقف الصوت إذا سكرت الصفحة
//   useEffect(() => () => stopGlobalAudio(audioOwner), [audioOwner]);

//   // ========================================
//   // CLOCK STATE
//   // ========================================

//   // بيغيّر ساعة وحدة وبيرجّع قيمتها الجديدة
//   // (بنحدّث الـ ref فوراً عشان الضغط السريع بالأسهم ما يقرأ قيمة قديمة)
//   const commit = (i, patch) => {
//     const next = timesRef.current.map((t, idx) =>
//       idx === i ? { ...t, ...patch, touched: true } : t,
//     );

//     timesRef.current = next;
//     setTimes(next);

//     // الساعة اللي كانت غلط وانعدّلت: بتشيل علامة ✕
//     setWrongIds((prev) => prev.filter((id) => id !== i));

//     return next[i];
//   };

//   const announceTime = (i, hand) => {
//     const t = timesRef.current[i];

//     setAnnouncement(
//       `Clock ${i + 1}, ${hand} hand. The time is ${spokenTime(t)}.`,
//     );
//   };

//   // خطوة وحدة للعقرب: dir = +1 أو -1
//   const stepHand = (i, hand, dir) => {
//     const cur = timesRef.current[i];

//     const next = commit(
//       i,
//       hand === "hour"
//         ? { h: ((cur.h - 1 + dir + 12) % 12) + 1 }
//         : { m: (cur.m + dir * MINUTE_STEP + 60) % 60 },
//     );

//     setAnnouncement(
//       `Clock ${i + 1}, ${hand} hand. The time is ${spokenTime(next)}.`,
//     );
//   };

//   const resetClock = (i) => {
//     const next = timesRef.current.map((t, idx) =>
//       idx === i ? { h: 12, m: 0, touched: false } : t,
//     );

//     timesRef.current = next;
//     setTimes(next);
//     setWrongIds((prev) => prev.filter((id) => id !== i));
//     setAnnouncement(`Clock ${i + 1} reset.`);
//   };

//   // ========================================
//   // KEYBOARD
//   // الأسهم: خطوة بالاتجاه / Enter أو Space: خطوة للأمام / Backspace: تصفير الساعة
//   // بنوقّف انتشار الحدث لأن الكتاب غالباً عنده مستمع كيبورد عام على Enter و Space
//   // ========================================

//   const onHandKeyDown = (e, i, hand) => {
//     if (isLocked(i)) return;

//     let dir = 0;

//     if (e.key === "ArrowUp" || e.key === "ArrowRight") dir = 1;
//     else if (e.key === "ArrowDown" || e.key === "ArrowLeft") dir = -1;
//     else if (e.key === "Enter" || e.key === " ") {
//       e.preventDefault();
//       e.stopPropagation();

//       if (!e.repeat) stepHand(i, hand, 1);

//       return;
//     } else if (e.key === "Backspace" || e.key === "Delete") {
//       e.preventDefault();
//       e.stopPropagation();
//       resetClock(i);
//       return;
//     } else return;

//     e.preventDefault();
//     e.stopPropagation();
//     stepHand(i, hand, dir);
//   };

//   const onHandKeyUp = (e) => {
//     if (e.key === "Enter" || e.key === " ") e.stopPropagation();
//   };

//   // الجملة: Enter / Space بيشغّلوا صوتها
//   const onSentenceKeyDown = (e, i) => {
//     if (e.key !== "Enter" && e.key !== " ") return;

//     e.preventDefault();
//     e.stopPropagation();

//     if (!e.repeat) playSentenceAudio(i);
//   };

//   // فوكس بالتاب على جملة = شغّل صوتها (الماوس/اللمس بيروحوا على onClick)
//   const onSentenceFocus = (e, i) => {
//     if (e.currentTarget.matches(":focus-visible")) playSentenceAudio(i);
//   };

//   // ========================================
//   // DRAG (Mouse + Touch + Pen)
//   // العقرب بيلحق المؤشر وبيثبت (snap) على أقرب خطوة
//   // ========================================

//   const pointerAngle = (i, e) => {
//     const svg = svgRefs.current[i];

//     if (!svg) return null;

//     const rect = svg.getBoundingClientRect();
//     const dx = e.clientX - (rect.left + rect.width / 2);
//     const dy = e.clientY - (rect.top + rect.height / 2);

//     // قريب كثير من المركز: الزاوية مش مستقرة
//     if (Math.hypot(dx, dy) < 6) return null;

//     return ((Math.atan2(dx, -dy) * 180) / Math.PI + 360) % 360;
//   };

//   const moveHand = (i, hand, angle) => {
//     const cur = timesRef.current[i];

//     if (hand === "hour") {
//       // بنطرح ميلان العقرب القصير مع الدقائق قبل ما نحسب الساعة
//       const h = Math.round(((angle - cur.m / 2 + 360) % 360) / 30) % 12 || 12;

//       if (h === cur.h && cur.touched) return;

//       commit(i, { h });
//       return;
//     }

//     const m = (Math.round(angle / 6 / MINUTE_STEP) * MINUTE_STEP) % 60;

//     if (m === cur.m && cur.touched) return;

//     commit(i, { m });
//   };

//   const onHandPointerDown = (e, i, hand) => {
//     if (isLocked(i)) return;

//     if (e.pointerType === "mouse" && e.button !== 0) return;

//     dragRef.current = { i, hand, pointerId: e.pointerId };

//     setFocusKey({ i, hand });

//     try {
//       e.currentTarget.setPointerCapture(e.pointerId);
//     } catch {
//       /* ما في مشكلة إذا المتصفح ما دعمها */
//     }
//   };

//   const onHandPointerMove = (e, i, hand) => {
//     const d = dragRef.current;

//     if (!d || d.pointerId !== e.pointerId || d.i !== i || d.hand !== hand) {
//       return;
//     }

//     const angle = pointerAngle(i, e);

//     if (angle !== null) moveHand(i, hand, angle);
//   };

//   const onHandPointerEnd = (e, i, hand, cancelled) => {
//     const d = dragRef.current;

//     if (!d || d.pointerId !== e.pointerId) return;

//     dragRef.current = null;

//     try {
//       e.currentTarget.releasePointerCapture(e.pointerId);
//     } catch {
//       /* ما في مشكلة */
//     }

//     if (!cancelled && timesRef.current[i].touched) announceTime(i, hand);
//   };

//   // ========================================
//   // CHECK
//   // الصح بينقفل (أخضر ✓)، الغلط بيضل ✕ وبيقدر الطالب يعدّله
//   // ========================================

//   const checkAnswers = () => {
//     if (showAnswer || allDone) return;

//     stopAudio();

//     if (times.some((t) => !t.touched)) {
//       const msg = "Please set the time on every clock.";

//       ValidationAlert.info("Oops!", msg);
//       setAnnouncement(msg);
//       return;
//     }

//     const nextLocked = new Set(lockedSet);
//     const nextWrong = [];

//     times.forEach((t, i) => {
//       if (nextLocked.has(i)) return;

//       if (t.h === items[i].correct.h && t.m === items[i].correct.m) {
//         nextLocked.add(i);
//       } else {
//         nextWrong.push(i);
//       }
//     });

//     const score = nextLocked.size;

//     setLockedSet(nextLocked);
//     setWrongIds(nextWrong);

//     setAnnouncement(
//       [
//         `Score ${score} out of ${TOTAL}.`,
//         nextWrong.length
//           ? `Clock ${nextWrong.map((i) => i + 1).join(", ")} ${
//               nextWrong.length > 1 ? "are" : "is"
//             } not correct. You can change ${
//               nextWrong.length > 1 ? "them" : "it"
//             } and check again.`
//           : "All answers are correct.",
//       ].join(" "),
//     );

//     const color = score === TOTAL ? "green" : score === 0 ? "red" : "orange";

//     const message = `
//       <div style="font-size:20px;text-align:center;">
//         <span style="color:${color};font-weight:bold;">
//           Score: ${score} / ${TOTAL}
//         </span>
//       </div>
//     `;

//     if (score === TOTAL) ValidationAlert.success(message);
//     else if (score === 0) ValidationAlert.error(message);
//     else ValidationAlert.warning(message);
//   };

//   // ========================================
//   // SHOW ANSWER / START AGAIN
//   // ========================================

//   const showAnswers = () => {
//     stopAudio();
//     dragRef.current = null;
//     setFocusKey(null);

//     const next = items.map((item) => ({ ...item.correct, touched: true }));

//     timesRef.current = next;
//     setTimes(next);
//     setLockedSet(new Set());
//     setWrongIds([]);
//     setShowAnswer(true);

//     setAnnouncement("All answers shown. Every clock shows the correct time.");
//   };

//   // بيرجّع الساعات، علامات ✓ / ✕، النتيجة، والصوت للوضع الأول
//   const reset = () => {
//     stopAudio();
//     dragRef.current = null;
//     setFocusKey(null);

//     const next = initialTimes();

//     timesRef.current = next;
//     setTimes(next);
//     setLockedSet(new Set());
//     setWrongIds([]);
//     setShowAnswer(false);

//     setAnnouncement("Activity reset. All clocks and results are cleared.");
//   };

//   // ========================================
//   // RENDER
//   // ========================================

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         padding: "30px",
//         width: "100%",
//         boxSizing: "border-box",
//       }}
//     >
//       {/* Screen Reader */}
//       <div
//         className="sr-only"
//         role="status"
//         aria-live="polite"
//         aria-atomic="true"
//       >
//         {announcement}
//       </div>

//       <div className="div-forall">
//         <ExerciseHeader
//           sectionLetter="D"
//           title="Read and then draw the time."
//           subTitle="Press a sentence to hear it. Drag the short hand to the hour and the long hand to the minutes, or focus a hand and use the arrow keys."
//         />

//         <p id="u6p6q1-help" className="sr-only">
//           Each sentence has a clock. Press a sentence to hear it. Press Tab to
//           reach the hour hand and then the minute hand of the clock. Use the
//           arrow keys, or press Enter or Space, to move the focused hand to the
//           next position. The hour hand moves one hour at a time and the minute
//           hand moves in steps of {MINUTE_STEP} minutes. Press Backspace to reset
//           the clock. You can also drag the hands with a mouse or your finger.
//           Press Check Answer to check all the clocks. Correct clocks are locked
//           and wrong clocks can be changed.
//         </p>

//         <div
//           className="flex w-full"
//           style={{ justifyContent: "space-between" }}
//         >
//           {/* ⚠️ alt مؤقت: عدّليه حسب الصورة. إذا الصورة فيها ساعات جاهزة فاحذفيها أو عدّلي */}
//           <img
//             src={img}
//             alt="Illustration of Helen's morning routine."
//             draggable="false"
//             style={{ height: "400px", width: "auto" }}
//           />

//           <div className="grid grid-cols-2 gap-y-5 gap-x-6">
//             {items.map((item, i) => {
//               const t = times[i];
//               const locked = isLocked(i);
//               const isWrong = wrongIds.includes(i);
//               const isPlaying = playingIndex === i;

//               const status = showAnswer
//                 ? "shown"
//                 : lockedSet.has(i)
//                   ? "correct"
//                   : isWrong
//                     ? "wrong"
//                     : null;

//               const statusText = showAnswer
//                 ? `Answer shown: ${spokenTime(t)}.`
//                 : lockedSet.has(i)
//                   ? `Correct. ${spokenTime(t)}.`
//                   : isWrong
//                     ? `Not correct. Set to ${spokenTime(t)}. Change it and check again.`
//                     : t.touched
//                       ? `Set to ${spokenTime(t)}.`
//                       : "Not set yet.";

//               const ring =
//                 status === "correct" || status === "shown"
//                   ? "#4caf50"
//                   : status === "wrong"
//                     ? "#e53935"
//                     : "#e7a98e";

//               return (
//                 <div key={item.id} className="flex flex-col gap-2.5">
//                   {/* الجملة: بتشغّل صوتها */}
//                   <div
//                     role="button"
//                     tabIndex={0}
//                     aria-label={`Sentence ${i + 1}: ${item.text} Press to hear it.`}
//                     onClick={() => playSentenceAudio(i)}
//                     onKeyDown={(e) => onSentenceKeyDown(e, i)}
//                     onKeyUp={onHandKeyUp}
//                     onFocus={(e) => onSentenceFocus(e, i)}
//                     className="relative w-fit text-[18px] cursor-pointer rounded-md focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb]"
//                   >
//                     <span className="font-bold mr-1.5">{i + 1}</span>
//                     {item.text}

//                     {/* 🔊 السبيكر بيظهر بس وقت ما صوت الجملة شغّال */}
//                     {isPlaying && <SpeakerBadge />}
//                   </div>

//                   <div
//                     role="group"
//                     aria-label={`Clock ${i + 1} for sentence ${i + 1}. ${statusText}`}
//                     className="flex items-center gap-4"
//                   >
//                     <Clock
//                       index={i}
//                       time={t}
//                       interactive={!locked}
//                       status={status}
//                       svgRef={(el) => {
//                         svgRefs.current[i] = el;
//                       }}
//                       focusedHand={focusKey?.i === i ? focusKey.hand : null}
//                       onHandKeyDown={onHandKeyDown}
//                       onHandKeyUp={onHandKeyUp}
//                       onHandPointerDown={onHandPointerDown}
//                       onHandPointerMove={onHandPointerMove}
//                       onHandPointerEnd={onHandPointerEnd}
//                       onHandFocus={(idx, hand) =>
//                         setFocusKey({ i: idx, hand })
//                       }
//                       onHandBlur={(idx, hand) =>
//                         setFocusKey((prev) =>
//                           prev && prev.i === idx && prev.hand === hand
//                             ? null
//                             : prev,
//                         )
//                       }
//                     />

//                     {/* الوقت الرقمي (للقراءة بس) */}
//                     <div
//                       aria-hidden="true"
//                       className="flex items-center justify-center border-2 rounded-[14px] bg-[#f4f4f4] w-[90px] h-14 text-[26px] font-semibold"
//                       style={{ borderColor: ring }}
//                     >
//                       {t.touched ? digitalTime(t) : "--:--"}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* BUTTONS */}
//         <Button
//           handleShowAnswer={showAnswers}
//           handleStartAgain={reset}
//           checkAnswers={checkAnswers}
//         />
//       </div>
//     </div>
//   );
// };

// export default Unit6_Page6_Q1;
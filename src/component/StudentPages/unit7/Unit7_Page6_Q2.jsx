/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useRef, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../../WorkBookPages/Button";
// 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import "./Unit7_Page6_Q2.css";

// ========================================
// AUDIO (Page 63 - E)
// ========================================

import sentenceQuarterToEight from "../../../assets/audio/ClassBook/U 7/Page 63 - E/Item_001_It's_a_quarter_to_eight_in_the_morning.mp3";
import sentenceHalfPastTwo from "../../../assets/audio/ClassBook/U 7/Page 63 - E/Item_002_It's_half_past_two_in_the_afternoon.mp3";
import sentenceHalfPastFive from "../../../assets/audio/ClassBook/U 7/Page 63 - E/Item_003_It's_half_past_five_in_the_afternoon.mp3";
import sentenceQuarterPastSeven from "../../../assets/audio/ClassBook/U 7/Page 63 - E/Item_004_It's_a_quarter_past_seven_at_night.mp3";
import sentenceQuarterPastThree from "../../../assets/audio/ClassBook/U 7/Page 63 - E/Item_005_It's_a_quarter_past_three_in_the_morning.mp3";
import sentenceQuarterToEleven from "../../../assets/audio/ClassBook/U 7/Page 63 - E/Item_006_It's_a_quarter_to_eleven_at_night.mp3";
import ExerciseHeader from "../../ExerciseHeader";
import audioAm from "../../../assets/audio/ClassBook/U 6/Page 51 - E/Item_007_a.m.mp3";
import audioPm from "../../../assets/audio/ClassBook/U 6/Page 51 - E/Item_008_p.m.mp3";
// ========================================
// DATA
// ========================================

const items = [
  {
    id: 0,
    text: "It’s a quarter to eight in the morning.",
    audio: sentenceQuarterToEight,
    correct: { h: 7, m: 45, p: "am" },
  },
  {
    id: 1,
    text: "It’s half past two in the afternoon.",
    audio: sentenceHalfPastTwo,
    correct: { h: 2, m: 30, p: "pm" },
  },
  {
    id: 2,
    text: "It’s half past five in the afternoon.",
    audio: sentenceHalfPastFive,
    correct: { h: 5, m: 30, p: "pm" },
  },
  {
    id: 3,
    text: "It’s a quarter past seven at night.",
    audio: sentenceQuarterPastSeven,
    correct: { h: 7, m: 15, p: "pm" },
  },
  {
    id: 4,
    text: "It’s a quarter past three in the morning.",
    audio: sentenceQuarterPastThree,
    correct: { h: 3, m: 15, p: "am" },
  },
  {
    id: 5,
    text: "It’s a quarter to eleven at night.",
    audio: sentenceQuarterToEleven,
    correct: { h: 10, m: 45, p: "pm" },
  },
];

const TOTAL = items.length;

const PERIODS = [
  { value: "am", label: "a.m.", audio: audioAm },
  { value: "pm", label: "p.m.", audio: audioPm },
];

// خطوة الدقائق بالأسهم وبأزرار ▲ ▼: النشاط كله على الساعة (:00) والنص (:30)
// إذا بدك الطالب يتحرك بخطوات أصغر، غيّريها (مثلاً 5)
const MINUTE_STEP = 15;

const emptyAnswers = () => items.map(() => ({ h: "", m: "", p: "" }));

// ========================================
// HELPERS (خارج الكومبوننت)
// ========================================

const pad2 = (n) => String(n).padStart(2, "0");

const periodLabel = (p) => (p === "am" ? "a.m." : p === "pm" ? "p.m." : "");

// وصف الجواب الحالي لقارئ الشاشة
const answerText = (a) => {
  if (a.h === "" && a.m === "" && !a.p) return "Not answered yet.";

  const hour = a.h === "" ? "--" : a.h;
  const minute = a.m === "" ? "--" : pad2(a.m);

  return `${hour}:${minute}${a.p ? ` ${periodLabel(a.p)}` : ""}`;
};

const isRight = (a, c) =>
  Number(a.h) === c.h && Number(a.m) === c.m && a.p === c.p;

// Enter و Space بنعالجهم بإيدينا ونوقّف انتشار الحدث،
// لأن الكتاب غالباً عنده مستمع كيبورد عام بياخد هالمفتاحين.
// preventDefault على keydown و keyup بيمنع الكليك الطبيعي، فالأكشن بينفذ مرة وحدة
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

// ========================================
// BADGES
// ========================================

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

// ========================================
// MAIN
// ========================================

const Unit7_Page6_Q2 = () => {
  // كل سؤال: { h: "", m: "", p: "" } (h و m نص أرقام، p = "am" | "pm")
  const [answers, setAnswers] = useState(emptyAnswers);

  // الأسئلة اللي جوابها صح بعد Check (بتنقفل)
  const [lockedSet, setLockedSet] = useState(() => new Set());

  // الأسئلة اللي جوابها غلط بعد آخر Check (بتضل قابلة للتعديل)
  const [wrongIds, setWrongIds] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);
  const [playingKey, setPlayingKey] = useState(null);
  const [announcement, setAnnouncement] = useState("");

  const answersRef = useRef(answers);
  answersRef.current = answers;

  const periodRefs = useRef({});
  const audioOwner = useRef({}).current;

  const allDone = lockedSet.size === TOTAL;

  const isLocked = (i) => showAnswer || lockedSet.has(i);

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

  const playSentenceAudio = (i) => playAudio(`s:${i}`, items[i].audio);

  const playPeriodAudio = (i, value) =>
    playAudio(
      `p:${i}:${value}`,
      PERIODS.find((p) => p.value === value)?.audio,
    );

  // وقف الصوت إذا سكرت الصفحة
  useEffect(() => () => stopGlobalAudio(audioOwner), [audioOwner]);

  // فوكس بالتاب = شغّل الصوت (الماوس/اللمس بيروحوا على onClick)
  const onFocusPlay = (e, play) => {
    if (e.currentTarget.matches(":focus-visible")) play();
  };

  // ========================================
  // ANSWER STATE
  // (بنحدّث الـ ref فوراً عشان الضغط السريع بالأسهم ما يقرأ قيمة قديمة)
  // ========================================

  const commit = (i, patch) => {
    const next = answersRef.current.map((a, idx) =>
      idx === i ? { ...a, ...patch } : a,
    );

    answersRef.current = next;
    setAnswers(next);

    // السؤال اللي كان غلط وانعدّل: بتنشال علامة ✕
    setWrongIds((prev) => prev.filter((id) => id !== i));

    return next[i];
  };

  const onType = (i, field, value) => {
    if (isLocked(i)) return;

    commit(i, { [field]: value });
  };

  // أول ضغطة على فاضي: الساعة 1 (▲) أو 12 (▼)، والدقائق 00
  const stepField = (i, field, dir) => {
    if (isLocked(i)) return;

    const cur = answersRef.current[i][field];
    let next;

    if (field === "h") {
      if (cur === "") {
        next = dir > 0 ? 1 : 12;
      } else {
        const n = Math.min(12, Math.max(1, Number(cur)));
        next = ((n - 1 + dir + 12) % 12) + 1;
      }

      next = String(next);
    } else {
      if (cur === "") {
        next = 0;
      } else {
        const n = Math.min(59, Number(cur));
        next = (n + dir * MINUTE_STEP + 60) % 60;
      }

      next = pad2(next);
    }

    commit(i, { [field]: next });

    setAnnouncement(
      field === "h"
        ? `Question ${i + 1}, hour ${next}.`
        : `Question ${i + 1}, minutes ${next}.`,
    );
  };

  // لما الطالب يطلع من الخانة: نرتّب القيمة (الساعة 1–12، الدقائق 00–59)
  const normalizeField = (i, field) => {
    const raw = answersRef.current[i][field];

    if (raw === "" || isLocked(i)) return;

    const n =
      field === "h"
        ? Math.min(12, Math.max(1, Number(raw)))
        : Math.min(59, Number(raw));

    const text = field === "h" ? String(n) : pad2(n);

    if (text === raw) return;

    commit(i, { [field]: text });

    setAnnouncement(
      field === "h"
        ? `Question ${i + 1}, hour set to ${text}. The hour is between 1 and 12.`
        : `Question ${i + 1}, minutes set to ${text}. The minutes are between 00 and 59.`,
    );
  };

  // ========================================
  // A.M. / P.M.
  // ========================================

  const selectPeriod = (i, value) => {
    if (isLocked(i)) return;

    commit(i, { p: value });
    playPeriodAudio(i, value);

    setAnnouncement(`Question ${i + 1}, ${periodLabel(value)} selected.`);
  };

  // Enter / Space: اختيار. الأسهم: بتنقل الاختيار والفوكس بين a.m. و p.m.
  const onPeriodKeyDown = (e, i, value) => {
    if (isLocked(i)) return;

    if (isActivateKey(e)) {
      e.preventDefault();
      e.stopPropagation();

      if (!e.repeat) selectPeriod(i, value);

      return;
    }

    const target =
      e.key === "ArrowUp" || e.key === "ArrowLeft"
        ? "am"
        : e.key === "ArrowDown" || e.key === "ArrowRight"
          ? "pm"
          : null;

    if (!target) return;

    e.preventDefault();
    e.stopPropagation();

    // الصوت بيشتغل من الفوكس (onFocus) بدل ما يتكرر
    commit(i, { p: target });
    setAnnouncement(`Question ${i + 1}, ${periodLabel(target)} selected.`);

    periodRefs.current[`${i}-${target}`]?.focus();
  };

  // ========================================
  // CHECK
  // بينفحص الوقت كامل (ساعة + دقائق + a.m./p.m.) بس لما الطالب يضغط Check
  // الصح بينقفل (أخضر ✓)، الغلط بيضل ✕ وبيقدر الطالب يعدّله
  // ========================================

  const checkAnswers = () => {
    if (showAnswer || allDone) return;

    stopAudio();

    if (answers.some((a) => a.h === "" || a.m === "" || !a.p)) {
      const msg = "Please complete all answers.";

      ValidationAlert.info("Oops!", msg);
      setAnnouncement(msg);
      return;
    }

    const nextLocked = new Set(lockedSet);
    const nextWrong = [];

    answers.forEach((a, i) => {
      if (nextLocked.has(i)) return;

      if (isRight(a, items[i].correct)) nextLocked.add(i);
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

    const next = items.map(({ correct }) => ({
      h: String(correct.h),
      m: pad2(correct.m),
      p: correct.p,
    }));

    answersRef.current = next;
    setAnswers(next);
    setLockedSet(new Set());
    setWrongIds([]);
    setShowAnswer(true);

    setAnnouncement("All answers shown. Every question shows the correct time.");
  };

  // بيرجّع كل الخانات، a.m./p.m.، علامات ✓ / ✕، النتيجة، والصوت للوضع الأول
  const reset = () => {
    stopAudio();

    const next = emptyAnswers();

    answersRef.current = next;
    setAnswers(next);
    setLockedSet(new Set());
    setWrongIds([]);
    setShowAnswer(false);

    setAnnouncement("Activity reset. All times and results are cleared.");
  };

  // الأسهم ▲ ▼ بتغيّر القيمة داخل الخانة
  const onInputKeyDown = (e, i, field) => {
    // Tab و Escape بيضلوا للمتصفح / الكتاب، الباقي بيضل جوا الخانة
    if (e.key === "Tab" || e.key === "Escape") return;

    e.stopPropagation();

    if (e.key === "ArrowUp") {
      e.preventDefault();
      stepField(i, field, 1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      stepField(i, field, -1);
    }
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
          sectionLetter="E"
          title="Read, write, and check ✓."
          subTitle="Read the time clue, set the numbers carefully, then choose the matching time box."
        />

        <p id="u6p6q2-help" className="sr-only">
          Press a sentence to hear it. For each sentence, press Tab to reach the
          hour box, type the hour or use the up and down arrow keys, then Tab to
          the minutes box and do the same. The minutes move in steps of{" "}
          {MINUTE_STEP}. Then Tab to a.m. or p.m. and press Enter or Space to
          choose it, or use the arrow keys. Nothing is checked until you press
          Check Answer. Correct answers are locked and wrong answers can be
          changed.
        </p>

        <div className="grid grid-cols-2 gap-y-5 gap-x-[60px]">
          {items.map((item, i) => {
            const a = answers[i];
            const locked = isLocked(i);
            const isWrong = wrongIds.includes(i);

            // نتيجة كل جزء لحاله: الوقت (ساعة + دقائق) و a.m./p.m.
            const c = item.correct;
            const checked = showAnswer || lockedSet.has(i) || isWrong;
            const timeOk = Number(a.h) === c.h && Number(a.m) === c.m;
            const periodOk = a.p === c.p;

            const timeState = !checked
              ? null
              : showAnswer || lockedSet.has(i) || timeOk
                ? "correct"
                : "wrong";

            const periodState = !checked
              ? null
              : showAnswer || lockedSet.has(i) || periodOk
                ? "correct"
                : "wrong";

            const statusText = showAnswer
              ? `Answer shown: ${answerText(a)}`
              : lockedSet.has(i)
                ? `Correct. ${answerText(a)}`
                : isWrong
                  ? `Not correct. ${answerText(a)} The time is ${
                      timeOk ? "correct" : "not correct"
                    }. The a.m. or p.m. choice is ${
                      periodOk ? "correct" : "not correct"
                    }. Change it and check again.`
                  : answerText(a);

            // نفس ستايل الخانة القديم + حلقة فوكس بتبين بس وقت الفوكس
            const inputClass =
              "w-[45px] border-none bg-transparent text-[26px] text-center outline-none rounded focus:ring-4 focus:ring-[#2563eb]";

            return (
              <div key={item.id} className="flex flex-col gap-2.5">
                {/* الجملة: بتشغّل صوتها */}
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`Sentence ${i + 1}: ${item.text} Press to hear it.`}
                  onFocus={(e) => onFocusPlay(e, () => playSentenceAudio(i))}
                  className="relative w-fit text-[18px] cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb] rounded-md"
                  style={{border:playingKey === `s:${i}` ? "2px solid blue":"" ,padding:"5px"}}
                  {...activate(() => playSentenceAudio(i))}
                >
                  <span className=" font-bold mr-1.5">{i + 1}</span>
                  {item.text}

                  {/* 🔊 السبيكر بيظهر بس وقت ما صوت الجملة شغّال */}
                  {playingKey === `s:${i}` && <SpeakerBadge />}
                </div>

                <div
                
                  role="group"
                  aria-label={`Question ${i + 1} time. ${statusText}`}
                  className="flex items-center gap-5"
                >
                  {/* Time Box */}
                  <div className="relative">
                    <div
                      className={`flex items-center justify-center gap-2.5 border-2 rounded-[14px] w-[200px] h-20 bg-[#f4f4f4] ${
                        timeState === "correct"
                          ? "border-[#4caf50]"
                          : timeState === "wrong"
                            ? "border-red-500"
                            : "border-[#e7a98e]"
                      }`}
                    >
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        maxLength={2}
                        role="spinbutton"
                        aria-label={`Question ${i + 1}, hour`}
                        aria-valuemin={1}
                        aria-valuemax={12}
                        aria-valuenow={a.h === "" ? undefined : Number(a.h)}
                        aria-describedby="u6p6q2-help"
                        readOnly={locked}
                        tabIndex={locked ? -1 : 0}
                        placeholder="0"
                        value={a.h}
                        onChange={(e) =>
                          onType(
                            i,
                            "h",
                            e.target.value.replace(/\D/g, "").slice(0, 2),
                          )
                        }
                        onFocus={(e) => e.target.select()}
                        onBlur={() => normalizeField(i, "h")}
                        onKeyDown={(e) => onInputKeyDown(e, i, "h")}
                        className={inputClass}
                      />
                      {timeState === "wrong" && (
                        <div
                          aria-hidden="true"
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md border-2 border-white"
                        >
                          ✕
                        </div>
                      )}
                      <span className="text-[26px] text-[#c33]">:</span>

                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        maxLength={2}
                        role="spinbutton"
                        aria-label={`Question ${i + 1}, minutes`}
                        aria-valuemin={0}
                        aria-valuemax={59}
                        aria-valuenow={a.m === "" ? undefined : Number(a.m)}
                        aria-describedby="u6p6q2-help"
                        readOnly={locked}
                        tabIndex={locked ? -1 : 0}
                        placeholder="00"
                        value={a.m}
                        onChange={(e) =>
                          onType(
                            i,
                            "m",
                            e.target.value.replace(/\D/g, "").slice(0, 2),
                          )
                        }
                        onFocus={(e) => e.target.select()}
                        onBlur={() => normalizeField(i, "m")}
                        onKeyDown={(e) => onInputKeyDown(e, i, "m")}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* AM PM */}
                  <div className="relative">
                  <div
                    role="radiogroup"
                    aria-label={`Question ${i + 1}, a.m. or p.m.`}
                    aria-describedby="u6p6q2-help"
                    className={`bg-[#d82525] rounded-[22px] p-2 w-[120px] h-20 flex flex-col justify-between ${
                      periodState === "correct"
                        ? "ring-4 ring-[#4caf50] ring-offset-2"
                        : periodState === "wrong"
                          ? "ring-4 ring-red-500 ring-offset-2"
                          : ""
                    }`}
                  >
                    {PERIODS.map(({ value, label }) => {
                      const selected = a.p === value;

                      return (
                        <div
                          key={value}
                          role="radio"
                          aria-checked={selected}
                          aria-disabled={locked}
                          tabIndex={locked ? -1 : 0}
                          ref={(el) => {
                            periodRefs.current[`${i}-${value}`] = el;
                          }}
                          onClick={() => selectPeriod(i, value)}
                          onKeyDown={(e) => onPeriodKeyDown(e, i, value)}
                          onKeyUp={(e) => {
                            if (isActivateKey(e)) {
                              e.preventDefault();
                              e.stopPropagation();
                            }
                          }}
                          onFocus={(e) =>
                            onFocusPlay(e, () => playPeriodAudio(i, value))
                          }
                          className={`relative flex justify-between items-center h-7 px-2.5 py-1 rounded-lg text-white text-[18px] cursor-pointer box-border transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 ${
                            selected
                              ? "text-[#d82525] font-bold bg-white/40"
                              : "bg-white/20 hover:bg-white/40"
                          }`}
                        >
                          {label}
                          <span
                            aria-hidden="true"
                            className={`text-white ${selected ? "opacity-100" : "opacity-0"}`}
                          >
                            ✓
                          </span>

                          {/* 🔊 بيظهر بس وقت ما صوتها شغّال */}
                          {playingKey === `p:${i}:${value}` && <SpeakerBadge />}
                        </div>
                      );
                    })}
                  </div>

                  {/* ✓ / ✕ بعد Check (بتبين على a.m./p.m. كمان) */}
                  {(lockedSet.has(i) || isWrong) && (
                    <div
                      aria-hidden="true"
                      className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md  ${
                        periodState === "correct"
                          ? ""
                          : "border-2 border-white bg-red-500"
                      }`}
                    >
                      {periodState === "correct" ? "" : "✕"}
                    </div>
                  )}
                  </div>
                </div>
              </div>
            );
          })}
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

export default Unit7_Page6_Q2;
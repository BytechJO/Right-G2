import "./Unit6_Page5_Q2.css";
import React, { useEffect, useRef, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";
import mapImg from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page50/Ex A 1-2.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
// 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";

// ========================================
// AUDIO (Page 50 - A2)
// ========================================

import wordKite from "../../../assets/audio/ClassBook/U 6/Page 50 - A2/Item_001_kite.mp3";
import wordIt from "../../../assets/audio/ClassBook/U 6/Page 50 - A2/Item_002_it.mp3";
import wordLight from "../../../assets/audio/ClassBook/U 6/Page 50 - A2/Item_003_light.mp3";
import wordRain from "../../../assets/audio/ClassBook/U 6/Page 50 - A2/Item_004_rain.mp3";
import wordSit from "../../../assets/audio/ClassBook/U 6/Page 50 - A2/Item_005_sit.mp3";
import wordCake from "../../../assets/audio/ClassBook/U 6/Page 50 - A2/Item_006_cake.mp3";
import wordFive from "../../../assets/audio/ClassBook/U 6/Page 50 - A2/Item_007_five.mp3";
import wordBike from "../../../assets/audio/ClassBook/U 6/Page 50 - A2/Item_008_bike.mp3";
import wordFeet from "../../../assets/audio/ClassBook/U 6/Page 50 - A2/Item_009_feet.mp3";
import wordNight from "../../../assets/audio/ClassBook/U 6/Page 50 - A2/Item_010_night.mp3";
import wordIn from "../../../assets/audio/ClassBook/U 6/Page 50 - A2/Item_011_in.mp3";
import wordTime from "../../../assets/audio/ClassBook/U 6/Page 50 - A2/Item_012_time.mp3";
import wordTight from "../../../assets/audio/ClassBook/U 6/Page 50 - A2/Item_013_tight.mp3";
import wordTea from "../../../assets/audio/ClassBook/U 6/Page 50 - A2/Item_014_tea.mp3";
import wordLike from "../../../assets/audio/ClassBook/U 6/Page 50 - A2/Item_015_like.mp3";
import wordMeat from "../../../assets/audio/ClassBook/U 6/Page 50 - A2/Item_016_meat.mp3";
import wordSix from "../../../assets/audio/ClassBook/U 6/Page 50 - A2/Item_017_six.mp3";

// صوت كل كلمة (المفتاح = id الكلمة)
const wordAudio = {
  kite: wordKite,
  it: wordIt,
  light: wordLight,
  rain: wordRain,
  sit: wordSit,
  cake: wordCake,
  five: wordFive,
  bike: wordBike,
  feet: wordFeet,
  night: wordNight,
  in: wordIn,
  time: wordTime,
  tight: wordTight,
  tea: wordTea,
  like: wordLike,
  meat: wordMeat,
  six: wordSix,
};

// ========================================
// DATA
// ========================================

const wordAreas = [
  { id: "kite", x: 23.4, y: 13, w: 8, h: 6, correct: true },
  { id: "it", x: 25, y: 27, w: 6, h: 6, correct: false },
  { id: "light", x: 20, y: 39, w: 8, h: 7, correct: true },
  { id: "rain", x: 14.5, y: 52, w: 8, h: 6, correct: false },
  { id: "sit", x: 15.5, y: 68, w: 6, h: 6, correct: false },
  { id: "five", x: 24.5, y: 62, w: 8, h: 7, correct: true },
  { id: "cake", x: 37.5, y: 48.5, w: 8, h: 7, correct: false },
  { id: "bike", x: 45.4, y: 60, w: 8, h: 7, correct: true },
  { id: "feet", x: 50.5, y: 70.5, w: 8, h: 7, correct: false },
  { id: "night", x: 60, y: 65, w: 9, h: 7, correct: true },
  { id: "time", x: 63, y: 53, w: 9, h: 7, correct: true },
  { id: "in", x: 64, y: 37.5, w: 7, h: 6, correct: false },
  { id: "tight", x: 73, y: 18.5, w: 9, h: 7, correct: true },
  { id: "tea", x: 81.5, y: 37.5, w: 8, h: 6, correct: false },
  { id: "like", x: 81, y: 53, w: 8, h: 7, correct: true },
  { id: "meat", x: 73.5, y: 65.5, w: 9, h: 7, correct: false },
  { id: "six", x: 69, y: 80, w: 7, h: 6, correct: false },
];

const MAX_SELECTED = wordAreas.filter((w) => w.correct).length;

const areaById = Object.fromEntries(wordAreas.map((a) => [a.id, a]));

// ========================================
// BADGES
// ========================================

// سبيكر أسود داخل دائرة بيضا: بيظهر بس وقت ما صوت الكلمة شغّال
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

const Unit6_Page5_Q2 = () => {
  // الكلمات المختارة (بالترتيب)
  const [selected, setSelected] = useState([]);

  // الكلمات الصحيحة بعد Check (بتنقفل ببوردر أخضر) أو كلها بعد Show Answer
  const [lockedIds, setLockedIds] = useState(() => new Set());

  // الكلمات الغلط بعد آخر Check (بتضل قابلة للتعديل)
  const [wrongIds, setWrongIds] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [playingKey, setPlayingKey] = useState(null);
  const [announcement, setAnnouncement] = useState("");

  const audioOwner = useRef({}).current;

  const allCorrect = lockedIds.size === MAX_SELECTED;

  // ========================================
  // KEYBOARD ACTIVATION (Enter / Space)
  //
  // بنعالج Enter و Space بإيدينا ونوقّف انتشار الحدث (stopPropagation)،
  // لأن الكتاب غالباً عنده مستمع كيبورد عام بياخد هالمفتاحين ويمنع الكليك الطبيعي.
  // keyedRef بيمنع التنفيذ مرتين (keydown + click اللي بييجي بعد Space)
  // ========================================

  const keyedRef = useRef(false);

  const markKeyed = (ms) => {
    keyedRef.current = true;

    setTimeout(() => {
      keyedRef.current = false;
    }, ms);
  };

  const press = (action) => ({
    onClick: (e) => {
      // detail === 0 يعني click جاي من الكيبورد وإحنا عالجناه بالـ keydown
      if (e.detail === 0 && keyedRef.current) return;
      action(e);
    },
    onKeyDown: (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;

      e.preventDefault();
      e.stopPropagation();

      if (e.repeat) return;

      markKeyed(700);
      action(e);
    },
    onKeyUp: (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;

      e.stopPropagation();
      markKeyed(60);
    },
  });

  // ========================================
  // AUDIO
  // ========================================

  const stopAudio = () => {
    stopGlobalAudio(audioOwner);
    setPlayingKey(null);
  };

  // playGlobalAudio بيوقف أي صوت ثاني شغّال قبل ما يشغّل هاد
  const playWordAudio = (id) => {
    const src = wordAudio[id];

    if (!src) return;

    playGlobalAudio(src, {
      owner: audioOwner,
      onFinish: () => setPlayingKey((prev) => (prev === id ? null : prev)),
    });

    setPlayingKey(id);
  };

  // وقف الصوت إذا سكرت الصفحة (Previous / Next / Close)
  useEffect(() => () => stopGlobalAudio(audioOwner), [audioOwner]);

  // فوكس بالتاب على كلمة = شغّل صوتها (الماوس/اللمس بيروحوا على onClick)
  const onWordFocus = (e, id) => {
    if (e.currentTarget.matches(":focus-visible")) playWordAudio(id);
  };

  // ========================================
  // SELECT / DESELECT
  // ========================================

  const handleToggle = (area) => {
    playWordAudio(area.id);

    // الكلمة الصح مقفلة بعد Check / Show Answer
    if (showAnswer || lockedIds.has(area.id)) return;

    // ضغطة ثانية على كلمة مختارة: بتشيلها (وبتشيل ✕ تبعتها)
    if (selected.includes(area.id)) {
      setSelected((prev) => prev.filter((id) => id !== area.id));
      setWrongIds((prev) => prev.filter((id) => id !== area.id));
      setAnnouncement(`${area.id} removed. ${selected.length - 1} selected.`);
      return;
    }

    // وصلنا للحد الأعلى
    if (selected.length >= MAX_SELECTED) {
      setAnnouncement(
        `You can select up to ${MAX_SELECTED} words. Press a selected word to remove it first.`,
      );
      return;
    }

    setSelected((prev) => [...prev, area.id]);
    setAnnouncement(
      `${area.id} selected. ${selected.length + 1} of ${MAX_SELECTED} words.`,
    );
  };

  // ========================================
  // CHECK
  // الصح بينقفل (بوردر أخضر)، الغلط بيضل ✕ وبيقدر الطالب يعدّله
  // ========================================

  const checkAnswers = () => {
    if (showAnswer || allCorrect) return;

    stopAudio();

    if (selected.length === 0) {
      const msg = "Please select at least one word first.";

      ValidationAlert.info("Oops!", msg);
      setAnnouncement(msg);
      return;
    }

    const nextLocked = new Set(lockedIds);
    const nextWrong = [];

    selected.forEach((id) => {
      if (nextLocked.has(id)) return;

      if (areaById[id].correct) nextLocked.add(id);
      else nextWrong.push(id);
    });

    const score = nextLocked.size;

    setLockedIds(nextLocked);
    setWrongIds(nextWrong);

    setAnnouncement(
      [
        `Score ${score} out of ${MAX_SELECTED}.`,
        nextWrong.length
          ? `${nextWrong.join(", ")} ${
              nextWrong.length > 1 ? "do" : "does"
            } not have the long i sound. You can remove ${
              nextWrong.length > 1 ? "them" : "it"
            } or change your choices and check again.`
          : score === MAX_SELECTED
            ? "All answers are correct."
            : "The words you selected are correct, but some words are still missing.",
      ].join(" "),
    );

    const color =
      score === MAX_SELECTED ? "green" : score === 0 ? "red" : "orange";

    const message = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${score} / ${MAX_SELECTED}
        </span>
      </div>
    `;

    if (score === MAX_SELECTED) ValidationAlert.success(message);
    else if (score === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);
  };

  // ========================================
  // SHOW ANSWER / START AGAIN
  // ========================================

  const showAnswers = () => {
    stopAudio();

    const correctIds = wordAreas.filter((w) => w.correct).map((w) => w.id);

    setSelected(correctIds);
    setLockedIds(new Set(correctIds));
    setWrongIds([]);
    setShowAnswer(true);

    setAnnouncement(
      `All answers shown. The ${MAX_SELECTED} words with the long i sound are selected.`,
    );
  };

  const startAgain = () => {
    stopAudio();

    setSelected([]);
    setLockedIds(new Set());
    setWrongIds([]);
    setShowAnswer(false);

    setAnnouncement("Activity reset. All choices and results are cleared.");
  };

  // ========================================
  // RENDER
  // ========================================

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

      <div className="div-forall">
        <div>
          <ExerciseHeader
            questionNumber="2"
            title="Read and circle the long i words."
            subTitle="Read the clue completely, then tap the option that best matches it."
          />
        </div>

        <p id="u6p5q2-help" className="sr-only">
          Press Tab to move between the words in the picture. Press Enter or
          Space to hear a word and select it. Press a selected word again to
          remove it. After checking, correct words are locked and wrong words
          can be changed.
        </p>

        <div
          className="relative w-full max-w-[1000px]"
          role="group"
          aria-label="Words in the picture. Select the words with the long i sound."
          aria-describedby="u6p5q2-help"
        >
          {/* ⚠️ الـ alt مكتوب بالتخمين: عدّليه حسب الصورة (بدون ما تحددي الكلمات الصحيحة) */}
          <img
            src={mapImg}
            alt="A picture with seventeen words to read."
            draggable="false"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />

          {/* كل كلمة: زر كامل (مش بس مربع صغير) */}
          {wordAreas.map((area) => {
            const isSelected = selected.includes(area.id);
            const isLocked = lockedIds.has(area.id);
            const isWrong = wrongIds.includes(area.id);
            const isPlaying = playingKey === area.id;

            const state = isLocked
              ? "Selected. Correct."
              : isWrong
                ? "Selected. Not correct. Press to remove it."
                : isSelected
                  ? "Selected. Press to remove it."
                  : showAnswer
                    ? "Not selected. Press to hear it."
                    : "Not selected. Press to hear it and select it.";

            return (
              <button
                key={area.id}
                type="button"
                aria-pressed={isSelected}
                aria-label={`${area.id}. ${state}`}
                className="absolute focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb] hover:bg-[rgba(37,99,235,0.12)]"
                {...press(() => handleToggle(area))}
                onFocus={(e) => onWordFocus(e, area.id)}
                style={{
                  left: `${area.x}%`,
                  top: `${area.y}%`,
                  width: `${area.w}%`,
                  height: `${area.h}%`,
                  padding: 0,
                  background: "transparent",
                  border: "none",
                  borderRadius: 12,
                  cursor: isLocked || showAnswer ? "default" : "pointer",
                }}
              >
                {/* 🔊 السبيكر بيظهر بس وقت ما صوت الكلمة شغّال */}
                {isPlaying && <SpeakerBadge />}
              </button>
            );
          })}

          {/* الدوائر (بدون ما تاخد كليك) */}
          {selected.map((id) => {
            const c = areaById[id];
            const isLocked = lockedIds.has(id);
            const isWrong = wrongIds.includes(id);

            return (
              <div
                key={id}
                className="absolute pointer-events-none"
                style={{
                  left: `${c.x - 0.5}%`,
                  top: `${c.y - 0.5}%`,
                  width: `${c.w + 1}%`,
                  height: `${c.h + 1}%`,
                }}
              >
                {/* الدائرة: أخضر = صح ومقفل، أحمر = غلط، أزرق = مختارة */}
                <div
                  className={`w-full h-full rounded-full border-2 ${
                    isWrong ? "border-red-500" : "border-blue-500"
                  }`}
                  style={
                    isLocked
                      ? { borderColor: "#4caf50", borderWidth: 3 }
                      : undefined
                  }
                />

                {/* ✕ إذا الجواب غلط */}
                {isWrong && (
                  <div
                    aria-hidden="true"
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-white"
                  >
                    ✕
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="action-buttons-container">
        <button type="button" className="try-again-button" onClick={startAgain}>
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
          style={
            showAnswer || allCorrect ? { cursor: "not-allowed" } : undefined
          }
        >
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit6_Page5_Q2;

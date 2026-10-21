/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useRef, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../../WorkBookPages/Button";
// 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import "./Review5_Page1_Q2.css";

import img1 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 52/Ex B 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 52/Ex B 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 52/Ex B 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 52/Ex B 4.svg";

// ========================================
// AUDIO (Page 52 - B)
// كل ملف بيقرأ الجملة مع الخيارين: "He likes fruit / burgers"
// ========================================

import audioFruitBurgers from "../../../assets/audio/ClassBook/U 6/Page 52 - B/Item_001_He_likes_fruit_burgers.mp3";
import audioBurgersRice from "../../../assets/audio/ClassBook/U 6/Page 52 - B/Item_002_She_likes_burgers_rice.mp3";
import audioFishCheese from "../../../assets/audio/ClassBook/U 6/Page 52 - B/Item_003_She_likes_fish_cheese.mp3";
import audioRiceChicken from "../../../assets/audio/ClassBook/U 6/Page 52 - B/Item_004_He_likes_rice_chicken.mp3";
import ExerciseHeader from "../../ExerciseHeader";

// ========================================
// DATA
// ⚠️ الـ alt مكتوب بالتخمين من الجواب الصحيح وأنا ما شفت الصور: عدّليهم حسب اللي بالصورة
// ========================================

const items = [
  {
    img: img4,
    alt: "A boy eating fruit.",
    start: "He likes",
    options: ["fruit", "burgers"],
    correct: "fruit",
    sentence: "He likes fruit.",
    audio: audioFruitBurgers,
  },
  {
    img: img3,
    alt: "A girl eating a burger.",
    start: "She likes",
    options: ["burgers", "rice"],
    correct: "burgers",
    sentence: "She likes burgers.",
    audio: audioBurgersRice,
  },
  {
    img: img2,
    alt: "A girl eating cheese.",
    start: "She likes",
    options: ["fish", "cheese"],
    correct: "cheese",
    sentence: "She likes cheese.",
    audio: audioFishCheese,
  },
  {
    img: img1,
    alt: "A boy eating chicken.",
    start: "He likes",
    options: ["rice", "chicken"],
    correct: "chicken",
    sentence: "He likes chicken.",
    audio: audioRiceChicken,
  },
];

const TOTAL = items.length;

const emptySelected = () => items.map(() => "");

// ========================================
// HELPERS (خارج الكومبوننت)
// ========================================

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

// ========================================
// BADGES
// ========================================

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

const Review5_Page1_Q2 = () => {
  // الخيار المختار لكل سؤال ("" = ولا خيار)
  const [selected, setSelected] = useState(emptySelected);

  // الأسئلة اللي جوابها صح بعد Check (بتنقفل)
  const [lockedSet, setLockedSet] = useState(() => new Set());

  // الأسئلة اللي جوابها غلط بعد آخر Check (بتضل قابلة للتعديل)
  const [wrongIds, setWrongIds] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [announcement, setAnnouncement] = useState("");

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

  // فوكس بالتاب على الجملة = شغّل صوتها (الماوس/اللمس بيروحوا على onClick)
  const onSentenceFocus = (e, i) => {
    if (e.currentTarget.matches(":focus-visible")) playSentenceAudio(i);
  };

  // ========================================
  // SELECT / DESELECT
  // ضغطة على خيار = اختياره (دايرة)، وضغطة تانية على نفس الخيار = إلغاء الاختيار
  // ========================================

  const toggleOption = (i, value) => {
    if (isLocked(i)) {
      if (lockedSet.has(i)) {
        setAnnouncement(`Question ${i + 1} is correct and locked.`);
      }
      return;
    }

    const deselect = selected[i] === value;

    setSelected((prev) =>
      prev.map((s, idx) => (idx === i ? (deselect ? "" : value) : s)),
    );

    // السؤال اللي كان غلط وانعدّل: بتنشال علامة ✕
    setWrongIds((prev) => prev.filter((id) => id !== i));

    setAnnouncement(
      deselect
        ? `Question ${i + 1}: ${value} deselected. No answer is chosen.`
        : `Question ${i + 1}: ${value} selected. The sentence is: ${items[i].start} ${value}.`,
    );
  };

  // ========================================
  // CHECK
  // الصح بينقفل (أخضر ✓)، الغلط بيضل ✕ وبيقدر الطالب يعدّله
  // ========================================

  const checkAnswers = () => {
    if (showAnswer || allDone) return;

    stopAudio();

    if (selected.some((s) => s === "")) {
      const msg = "Please choose an answer.";

      ValidationAlert.info("Oops!", msg);
      setAnnouncement(msg);
      return;
    }

    const nextLocked = new Set(lockedSet);
    const nextWrong = [];

    items.forEach((item, i) => {
      if (nextLocked.has(i)) return;

      if (selected[i] === item.correct) nextLocked.add(i);
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

    setSelected(items.map((item) => item.correct));
    setLockedSet(new Set());
    setWrongIds([]);
    setShowAnswer(true);

    setAnnouncement("All answers shown. Every question shows the correct choice.");
  };

  // بيشيل كل الدواير، علامات ✓ / ✕، القفل، النتيجة، والصوت
  const resetAll = () => {
    stopAudio();

    setSelected(emptySelected());
    setLockedSet(new Set());
    setWrongIds([]);
    setShowAnswer(false);

    setAnnouncement("Activity reset. All circles and results are cleared.");
  };

  // ========================================
  // RENDER
  // ========================================

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
          sectionLetter="B"
          title="Look, circle, and write."
          subTitle="Read or listen carefully, then tap the option you would circle on the printed page."
          isReview={true}
        />

        <p id="r5p1q2-help" className="sr-only">
          Look at each picture and choose the word that matches it. Press Tab to
          move between the sentence and its two words. Press the sentence to
          hear it. Press Enter or Space on a word to circle it, and press it
          again to remove the circle. The sentence is written under the
          picture. Press Check Answer to check. Correct answers are locked and
          wrong answers can be changed.
        </p>

        <div className="grid grid-cols-2 gap-y-[60px] gap-x-30 mt-5">
          {items.map((item, i) => {
            const isWrong = wrongIds.includes(i);
            const isCorrect = lockedSet.has(i) || showAnswer;
            const chosen = selected[i];

            return (
              <div
                key={i}
                role="group"
                aria-label={`Question ${i + 1}`}
                aria-describedby="r5p1q2-help"
                className="flex flex-col gap-2.5"
              >
                <div className="flex items-center gap-2 text-[18px]">
                  <span className="font-bold text-[#1d4f7b]">{i + 1}</span>

                  <img
                    src={item.img}
                    alt={item.alt}
                    style={{
                      width: "auto",
                      height: "90px",
                      objectFit: "contain",
                      marginRight: "6px",
                    }}
                  />

                  {/* الجملة: بتشغّل صوتها (الجملة مع الخيارين) */}
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={`Sentence ${i + 1}: ${item.start} ${item.options[0]} or ${item.options[1]}. Press to hear it.`}
                    onFocus={(e) => onSentenceFocus(e, i)}
                    className="relative cursor-pointer rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
                    style={{ textWrap: "nowrap",border:playingIndex === i ? "2px solid #2563eb":"",padding: playingIndex === i ? "5px":""}}
                    {...activate(() => playSentenceAudio(i))}
                  >
                    {item.start}

                    {/* 🔊 السبيكر بيظهر بس وقت ما صوت الجملة شغّال */}
                    {playingIndex === i && <SpeakerBadge />}
                  </span>

                  {item.options.map((option, optIndex) => {
                    const isSelected = chosen === option;

                    const circleColor = !isSelected
                      ? "border-transparent hover:bg-gray-100"
                      : isCorrect
                        ? "border-[#4caf50]"
                        : isWrong
                          ? "border-red-500"
                          : "border-blue-500";

                    const result = !isSelected
                      ? ""
                      : showAnswer
                        ? " Correct answer."
                        : lockedSet.has(i)
                          ? " Correct. Locked."
                          : isWrong
                            ? " Not correct. Press to change it."
                            : "";

                    return (
                      <React.Fragment key={option}>
                        {optIndex === 1 && <span aria-hidden="true"> / </span>}

                        {/* دايرة كبيرة: اختيار / إلغاء اختيار */}
                        <span
                          role="button"
                          tabIndex={isLocked(i) ? -1 : 0}
                          aria-pressed={isSelected}
                          aria-disabled={isLocked(i)}
                          aria-label={`${option}. ${
                            isSelected ? "Circled." : "Not circled."
                          }${result}`}
                          className={`inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-3 py-[3px] rounded-full border-2 select-none transition focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb] ${
                            isLocked(i) ? "cursor-default" : "cursor-pointer"
                          } ${circleColor}`}
                          {...activate(() => toggleOption(i, option))}
                        >
                          {option}
                        </span>
                      </React.Fragment>
                    );
                  })}
                </div>

                <div className="relative">
                  <div
                    className={`border-b-2 w-[350px] min-h-6 text-[18px] ${
                      isCorrect
                        ? "border-[#4caf50]"
                        : isWrong
                          ? "border-red-500"
                          : "border-[#444]"
                    }`}
                  >
                    {chosen ? `${item.start} ${chosen}.` : ""}
                  </div>

                  {/* ✕ / ✓ بعد Check */}
                  {isWrong && (
                    <div
                      aria-hidden="true"
                      className="absolute -top-2 right-35 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md border-2 border-white"
                    >
                      ✕
                    </div>
                  )}

                  {/* {lockedSet.has(i) && (
                    <div
                      aria-hidden="true"
                      className="absolute -top-2 right-35 w-6 h-6 bg-[#4caf50] rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md border-2 border-white"
                    >
                      ✓
                    </div>
                  )} */}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BUTTONS */}
      <Button
        handleShowAnswer={showAnswers}
        handleStartAgain={resetAll}
        checkAnswers={checkAnswers}
      />
    </div>
  );
};

export default Review5_Page1_Q2;
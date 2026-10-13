import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

// 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";

import img1 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 34/Asset 29.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 36/Ex B 3.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 34/Asset 28.svg";

// ⚠️ اسم ملف police officer كان مقطوع بالسكرين شوت، تأكد من الامتداد
import nurseSound from "../../../assets/audio/ClassBook/U 4/Page 36 - B/Item_001_nurse.mp3";
import mechanicSound from "../../../assets/audio/ClassBook/U 4/Page 36 - B/Item_002_mechanic.mp3";
import teacherSound from "../../../assets/audio/ClassBook/U 4/Page 36 - B/Item_003_teacher.mp3";
import fishermanSound from "../../../assets/audio/ClassBook/U 4/Page 36 - B/Item_004_fisherman.mp3";
import clerkSound from "../../../assets/audio/ClassBook/U 4/Page 36 - B/Item_005_clerk.mp3";
import policeOfficerSound from "../../../assets/audio/ClassBook/U 4/Page 36 - B/Item_006_police_officer.mp3";
import heIsSound from "../../../assets/audio/ClassBook/U 4/Page 36 - B/Item_007_He_is.mp3";

import "./Review4_Page1_Q2.css";
import ExerciseHeader from "../../ExerciseHeader";

// 🔊 false = الصوت بالكليك / Enter / Space بس، true = كمان لما الطالب يوقف بالتاب
const PLAY_ON_FOCUS = false;

/* ================= DATA ================= */

// صوت كل كلمة
const WORD_AUDIO = {
  nurse: nurseSound,
  mechanic: mechanicSound,
  teacher: teacherSound,
  fisherman: fishermanSound,
  clerk: clerkSound,
  "police officer": policeOfficerSound,
};

// ⚠️ الـ alt أوصاف عامة بدون اسم المهنة (لأنو اسمها هو الجواب).
// الأوصاف تخمين، راجعها مع الصور الفعلية وعدّلها.
// ⚠️ "She is" ما إلها ملف صوت. إذا عندك ملف استورده وحطه بـ firstAudio للسؤال 3.
const ITEMS = [
  {
    img: img3,
    alt: "A man in work clothes standing next to a car",
    options: ["nurse", "mechanic"],
    correct: "mechanic",
    first: "He is",
    firstAudio: heIsSound,
  },
  {
    img: img1,
    alt: "A man holding a fishing rod by the water",
    options: ["teacher", "fisherman"],
    correct: "fisherman",
    first: "He is",
    firstAudio: heIsSound,
  },
  {
    img: img2,
    alt: "A woman standing behind a counter in a shop",
    options: ["clerk", "police officer"],
    correct: "clerk",
    first: "She is",
    firstAudio: null,
  },
];

const total = ITEMS.length;

const emptySelected = () => ITEMS.map(() => "");
const noLocks = () => ITEMS.map(() => false);

// ستايل الكلمة الي صوتها شغّال
const highlightStyle = {
  outline: "2px solid #2c5287",
  outlineOffset: "2px",
  borderRadius: "10px",
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

const Review4_Page1_Q2 = () => {
  // ⭕ الدايرة المختارة لكل سؤال ("" = ما في اختيار). الكلمة بتنكتب بالجملة منها مباشرة
  const [selected, setSelected] = useState(emptySelected);

  // 🔒 الصح بعد Check بينقفل
  const [locked, setLocked] = useState(noLocks);

  // ✕ الغلط (بيضل بمكانه والطالب بيعدّله)
  const [wrong, setWrong] = useState([]);

  // 🔒 بعد Show Answer كل شي مقفول
  const [showAnswered, setShowAnswered] = useState(false);

  // 📢 رسالة لقارئ الشاشة
  const [message, setMessage] = useState("");

  const allLocked = showAnswered || locked.every(Boolean);

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioOwner = useRef({}).current;
  const [activeId, setActiveId] = useState(null);

  const stopAudio = () => stopGlobalAudio(audioOwner);

  const playAudio = (src, id) => {
    if (!src) {
      stopGlobalAudio();
      setActiveId(null);
      return;
    }

    playGlobalAudio(src, {
      owner: audioOwner,
      onFinish: () => setActiveId((prev) => (prev === id ? null : prev)),
    });

    setActiveId(id);
  };

  useEffect(() => () => stopGlobalAudio(audioOwner), [audioOwner]);

  /* =====================================================
     ⭕ CIRCLES (اختيار وإلغاء: كليك / لمس / Enter / Space)
     الكلمة المختارة بتنكتب مباشرة بالجملة
  ===================================================== */

  const toggleCircle = (i, op) => {
    // 🔊 صوت الكلمة دايماً بالكليك
    playAudio(WORD_AUDIO[op], `circle-${i}-${op}`);

    if (allLocked || locked[i]) {
      if (locked[i]) {
        setMessage(
          `Picture ${i + 1}: ${ITEMS[i].correct} is correct and locked.`,
        );
      }
      return;
    }

    const isSame = selected[i] === op;

    setSelected((prev) =>
      prev.map((s, k) => (k === i ? (isSame ? "" : op) : s)),
    );

    // نشيل ✕ عن هاد السؤال (الطالب عدّله)
    setWrong((prev) => prev.filter((k) => k !== i));

    setMessage(
      isSame
        ? `Picture ${i + 1}: ${op} deselected. The sentence is empty.`
        : `Picture ${i + 1}: ${op} selected. The sentence is: ${ITEMS[i].first} ${op}.`,
    );
  };

  /* =====================================================
     نص عليه صوت ("He is")
  ===================================================== */

  const handleTextKeyDown = (e, src, id) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      playAudio(src, id);
    }
  };

  const handleTextFocus = (e, src, id) => {
    if (!PLAY_ON_FOCUS) return;
    if (!e.currentTarget.matches(":focus-visible")) return;
    playAudio(src, id);
  };

  /* =====================================================
     CHECK
     - الصح بينقفل
     - الغلط بيضل بمكانه مع ✕ والطالب بيعدّله
  ===================================================== */

  const checkAnswers = () => {
    if (allLocked) return;

    if (selected.some((s, i) => !locked[i] && s === "")) {
      const msg =
        "Please choose a circle for all the pictures before checking.";
      ValidationAlert.info("Oops!", msg);
      setMessage(msg);
      return;
    }

    stopAudio();
    setActiveId(null);

    const newLocked = [...locked];
    const newWrong = [];
    let score = 0;

    ITEMS.forEach((item, i) => {
      if (locked[i] || selected[i] === item.correct) {
        newLocked[i] = true;
        score++;
      } else {
        newWrong.push(i);
      }
    });

    setLocked(newLocked);
    setWrong(newWrong);

    // 🔊 فيدباك مسموع لقارئ الشاشة (لكل سؤال + السكور)
    const details = ITEMS.map(
      (item, i) =>
        `Picture ${i + 1}: ${item.first} ${selected[i]}, ${
          newWrong.includes(i) ? "incorrect" : "correct"
        }.`,
    ).join(" ");

    setMessage(
      score === total
        ? `Score ${score} out of ${total}. ${details} All answers are correct.`
        : `Score ${score} out of ${total}. ${details} Correct answers are locked. Change the answers marked with a cross, then press Check Answer again.`,
    );

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">Score: ${score} / ${total}</span>
      </div>
    `;

    if (score === total) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showAnswers = () => {
    stopAudio();
    setActiveId(null);

    setSelected(ITEMS.map((item) => item.correct));
    setLocked(ITEMS.map(() => true));
    setWrong([]);
    setShowAnswered(true);
    setMessage("Correct answers are shown.");
  };

  /* =====================================================
     START AGAIN (بيمسح كل الدوائر والنتايج والسكور)
  ===================================================== */

  const reset = () => {
    stopAudio();
    setActiveId(null);

    setSelected(emptySelected());
    setLocked(noLocks());
    setWrong([]);
    setShowAnswered(false);
    setMessage(
      "Exercise reset. All circles, answers, results and score are cleared.",
    );
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
        marginBottom: "50px",
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
          title="Look, read, circle, and complete."
          subTitle="Read or listen carefully, then tap the option you would circle on the printed page."
          isReview="true"
        />

        <div className="flex flex-col gap-10">
          {/* QUESTIONS */}
          <div className="question-grid-CB-review4-p1-q2">
            {ITEMS.map((item, i) => {
              const n = i + 1;

              const isLocked = locked[i];
              const isWrong = wrong.includes(i);

              const firstId = `first-${i}`;
              const firstPlaying = activeId === firstId;

              return (
                <div className="question-box-CB-review4-p1-q2" key={i}>
                  <span
                    aria-hidden="true"
                    style={{
                      fontSize: "22px",
                      fontWeight: "600",
                      color: "#1d4f7b",
                    }}
                  >
                    {n}
                  </span>

                  <div className="img-option-CB-review2-p2-q3">
                    <img
                      src={item.img}
                      alt={`Picture ${n}: ${item.alt}`}
                      className="q-img-CB-review2-p2-q3"
                      style={{ height: "auto", width: "200px" }}
                      draggable="false"
                    />

                    {/* ⭕ CHOICES */}
                    <div
                      className="choices-CB-review2-p2-q3"
                      role="group"
                      aria-label={`Picture ${n}: choose the correct word`}
                    >
                      {item.options.map((op) => {
                        const isOn = selected[i] === op;
                        const circleWrong = isWrong && isOn && !showAnswered;
                        const circleCorrect = isLocked && isOn && !showAnswered;
                        const opPlaying = activeId === `circle-${i}-${op}`;

                        return (
                          <div className="circle-wrapper" key={op}>
                            <button
                              type="button"
                              className={`circle-choice-CB-review4-p1-q2 CB-r4p1q2-circle ${
                                isOn ? "active" : ""
                              } ${circleCorrect ? "is-correct" : ""} ${
                                circleWrong ? "is-wrong" : ""
                              } ${focusRingClass}`}
                              aria-pressed={isOn}
                              aria-disabled={allLocked || isLocked}
                              aria-label={`Picture ${n}: ${op}${
                                isOn ? ", selected" : ", not selected"
                              }${
                                circleCorrect
                                  ? ", correct and locked"
                                  : circleWrong
                                    ? ", incorrect, you can change it"
                                    : showAnswered && isOn
                                      ? ", correct answer"
                                      : ""
                              }`}
                              style={{
                                position: "relative",
                                cursor:
                                  allLocked || isLocked ? "default" : "pointer",
                                touchAction: "manipulation",
                                ...(opPlaying ? highlightStyle : {}),
                              }}
                              onClick={() => toggleCircle(i, op)}
                              onFocus={(e) => {
                                if (!PLAY_ON_FOCUS) return;
                                if (!e.currentTarget.matches(":focus-visible"))
                                  return;
                                playAudio(WORD_AUDIO[op], `circle-${i}-${op}`);
                              }}
                            >
                              <span aria-hidden="true">{op}</span>
                              {opPlaying && <SpeakerIcon />}
                            </button>

                            {circleWrong && (
                              <div
                                className="CB-review4-p1-q2-error-badge"
                                aria-hidden="true"
                              >
                                ✕
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ✍️ SENTENCE (للعرض فقط: الكلمة بتنكتب من الدايرة، والطالب ما بيكتب) */}
                  <div className="input-wrapper-CB-review4-p1-q2">
                    <div
                      className="write-input-CB-review2-p2-q3"
                      style={{ justifyContent: "flex-start" }}
                    >
                      {/* 🔊 "He is": كليك / Enter / Space بيشغّلوا صوته */}
                      {item.firstAudio ? (
                        <span
                          className={focusRingClass}
                          role="button"
                          tabIndex={0}
                          aria-label={`${item.first}. Press to listen.`}
                          style={{
                            position: "relative",
                            marginRight: "10px",
                            cursor: "pointer",
                            ...(firstPlaying ? highlightStyle : {}),
                          }}
                          onClick={() => playAudio(item.firstAudio, firstId)}
                          onKeyDown={(e) =>
                            handleTextKeyDown(e, item.firstAudio, firstId)
                          }
                          onFocus={(e) =>
                            handleTextFocus(e, item.firstAudio, firstId)
                          }
                        >
                          <span aria-hidden="true">{item.first}</span>
                          {firstPlaying && <SpeakerIcon />}
                        </span>
                      ) : (
                        <span style={{ marginRight: "10px" }}>
                          {item.first}
                        </span>
                      )}

                      <span>{selected[i]}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* الأزرار */}
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
          aria-disabled={allLocked}
          style={allLocked ? { cursor: "not-allowed" } : undefined}
        >
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Review4_Page1_Q2;

import React, { useState, useRef, useEffect } from "react";
import { FaVolumeUp } from "react-icons/fa";
import ValidationAlert from "../../Popup/ValidationAlert";
import find_img from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 38/Ex E 1.svg";

import cakeAudio from "../../../assets/audio/ClassBook/U 4/Page 36 - E/Item_001_cake.mp3";
import rainAudio from "../../../assets/audio/ClassBook/U 4/Page 36 - E/Item_002_rain.mp3";
import paintAudio from "../../../assets/audio/ClassBook/U 4/Page 36 - E/Item_003_paint.mp3";

// 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
// ⚠️ عدّل المسار حسب مكان الملف عندك
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import ExerciseHeader from "../../ExerciseHeader";

/* ================= DATA ================= */

// spot = اسم المكان لقارئ الشاشة (مستخدمين الكيبورد بيتنقلوا بين الأماكن بالتاب)
const items = [
  {
    key: "cake",
    label: "cake",
    spot: "the cake",
    audio: cakeAudio,
    area: { x1: 19.63, y1: 41.15, x2: 29.63, y2: 56.5385 },
  },
  {
    key: "rain",
    label: "rain",
    spot: "the rain",
    audio: rainAudio,
    area: { x1: 31.44, y1: 50.73, x2: 45.88, y2: 57.46 },
  },
  {
    key: "paint",
    label: "paint",
    spot: "the paint",
    audio: paintAudio,
    area: {
      x1: 61.793,
      y1: 9.04,
      x2: 91.48,
      y2: 85.19,
    },
  },
];

/* ================= HELPERS (خارج الكومبوننت) ================= */

const areaCenter = (area) => ({
  x: (area.x1 + area.x2) / 2,
  y: (area.y1 + area.y2) / 2,
});

const focusClass =
  "focus-visible:outline-4 focus-visible:outline-blue-600 focus-visible:outline-offset-4";

/* ================= COMPONENT ================= */

const Review4_Page2_Q2 = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [circles, setCircles] = useState({});
  const [checked, setChecked] = useState(false);
  const [wrongItems, setWrongItems] = useState([]);
  const [message, setMessage] = useState("");
  const [playingKey, setPlayingKey] = useState(null);

  // مالك الصوت: بيعرّف الـ audioManager إنو هاد الصوت تابع للكومبوننت
  const audioOwner = useRef({}).current;
  const skipSoundRef = useRef(false); // 🔇 لما نرجّع الفوكس برمجياً ما نشغّل الصوت
  const wordRefs = useRef({});
  const areaRefs = useRef({});

  const selectedObj = items.find((i) => i.key === selectedItem);

  /* ================= AUDIO ================= */

  const stopSound = () => {
    stopGlobalAudio(audioOwner);
    setPlayingKey(null);
  };

  const playWord = (item) => {
    if (!item.audio) return;

    // playGlobalAudio بيوقف أي صوت ثاني شغّال قبل ما يشغّل هاد
    playGlobalAudio(item.audio, {
      owner: audioOwner,
      onFinish: () =>
        setPlayingKey((prev) => (prev === item.key ? null : prev)),
    });

    setPlayingKey(item.key);
  };

  // وقف الصوت إذا سكرت الصفحة
  useEffect(() => () => stopGlobalAudio(audioOwner), [audioOwner]);

  /* ================= FOCUS ================= */

  // رجوع الفوكس لكلمة بدون صوت
  const focusWord = (key) => {
    requestAnimationFrame(() => {
      const el = wordRefs.current[key];
      if (!el) return;
      if (document.activeElement !== el) skipSoundRef.current = true;
      el.focus();
    });
  };

  const focusArea = (key) => {
    requestAnimationFrame(() => areaRefs.current[key]?.focus());
  };

  /* ================= WORDS ================= */

  // فوكس بالتاب = شغّل الصوت (الماوس/اللمس بيروحوا على onClick)
  const onWordFocus = (e, item) => {
    if (skipSoundRef.current) {
      skipSoundRef.current = false;
      return;
    }
    if (e.currentTarget.matches(":focus-visible")) playWord(item);
  };

  // كليك / Enter / Space على كلمة: صوت + اختيار + المؤشر بينزل على الأماكن
  const activateWord = (item) => {
    playWord(item);

    if (checked) {
      setMessage("Answers are locked. Press Start Again to try again.");
      return;
    }

    setSelectedItem(item.key);

    // ⬇️ المؤشر بينزل مباشرة على أول مكان بالصورة
    focusArea(items[0].key);

    setMessage(
      `${item.label} selected. Press Tab to move between the spots in the picture, Enter to circle, Escape to cancel. You can also click the picture.`,
    );
  };

  /* ================= KEYBOARD: الأماكن بالصورة ================= */

  const activateArea = (areaItem) => {
    if (checked) {
      setMessage("Answers are locked. Press Start Again to try again.");
      return;
    }

    if (!selectedObj) {
      setMessage("Select a word first, then choose a spot in the picture.");
      return;
    }

    const newCircles = {
      ...circles,
      [selectedObj.key]: areaCenter(areaItem.area),
    };

    setCircles(newCircles);
    setSelectedItem(null);

    // ⬆️ المؤشر بيرجع على الكلمة الجاية اللي ما انحطلها دائرة
    const next = items.find((i) => !newCircles[i.key]);

    if (next) {
      focusWord(next.key);
      setMessage(
        `${selectedObj.label} circled. Back to the words, on ${next.label}.`,
      );
    } else {
      focusWord(selectedObj.key);
      setMessage(
        `${selectedObj.label} circled. All words are circled. Press Check Answer.`,
      );
    }
  };

  const onAreaKeyDown = (e) => {
    if (e.key === "Escape" && selectedItem) {
      e.preventDefault();

      const key = selectedItem;

      setSelectedItem(null);
      setMessage("Selection cancelled.");
      focusWord(key);
    }
  };

  /* ================= IMAGE CLICK (ماوس / لمس) ================= */

  const handleImageClick = (e) => {
    if (checked) return;

    if (!selectedObj) {
      setMessage("Select a word first, then click the picture.");
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // للمعايرة: بيطبع مكان الكبسة بالنسبة المئوية
    console.log(`x: ${x.toFixed(4)}, y: ${y.toFixed(4)}`);

    setCircles((prev) => ({
      ...prev,
      [selectedObj.key]: { x, y },
    }));

    setMessage(`${selectedObj.label} circled. Use Check Answer to check.`);
  };

  /* ================= CHECK ANSWER ================= */

  const handleCheck = () => {
    if (checked) return;

    stopSound();

    if (Object.keys(circles).length < items.length) {
      const msg = "Please circle all the words.";

      ValidationAlert.info("Pay attention!", msg);
      setMessage(msg);

      return;
    }

    let score = 0;
    let wrong = [];

    items.forEach((item) => {
      const p = circles[item.key];

      if (!p) {
        wrong.push(item.key);
        return;
      }

      if (
        p.x >= item.area.x1 &&
        p.x <= item.area.x2 &&
        p.y >= item.area.y1 &&
        p.y <= item.area.y2
      ) {
        score++;
      } else {
        wrong.push(item.key);
      }
    });

    setWrongItems(wrong);
    setChecked(true);
    setSelectedItem(null);

    // 🔊 فيدباك مسموع لكل كلمة + السكور
    const details = items
      .map(
        (item) =>
          `${item.label}: ${wrong.includes(item.key) ? "incorrect" : "correct"}`,
      )
      .join(". ");

    setMessage(`Score ${score} out of ${items.length}. ${details}.`);

    const color =
      score === items.length ? "green" : score === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
      Score: ${score} / ${items.length}
      </span>
    </div>
  `;

    if (score === items.length) ValidationAlert.success(scoreMessage);
    else if (score === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  /* ================= SHOW ANSWER ================= */

  const handleShowAnswer = () => {
    stopSound();

    const correct = {};

    items.forEach((item) => {
      correct[item.key] = areaCenter(item.area);
    });

    setCircles(correct);
    setWrongItems([]);
    setSelectedItem(null);
    setChecked(true);
    setMessage("Correct answers are shown.");
  };

  /* ================= RESET ================= */

  const handleStartAgain = () => {
    stopSound();

    setSelectedItem(null);
    setCircles({});
    setWrongItems([]);
    setChecked(false);
    setMessage("Exercise reset. All circles are cleared.");
  };

  /* ================= LABELS لقارئ الشاشة ================= */

  const wordLabel = (item) => {
    const circled = circles[item.key] ? "circled" : "not circled";

    const state = !checked
      ? ""
      : wrongItems.includes(item.key)
        ? ", incorrect"
        : ", correct";

    const hint = checked
      ? ""
      : selectedItem === item.key
        ? ". Selected. Choose a spot in the picture"
        : ". Press Enter to select it, then choose a spot in the picture";

    return `${item.label}, ${circled}${state}${hint}`;
  };

  const areaLabel = (item) =>
    `Spot in the picture: ${item.spot}${
      selectedObj
        ? `. Press Enter to circle ${selectedObj.label} here`
        : ". Select a word first"
    }`;

  /* ================= RENDER ================= */

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "30px",
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

      <div
        className="div-forall"
        style={{
          gap: "20px",
        }}
      >
         <ExerciseHeader
          sectionLetter="E"
          title="Does it have long a? Look and circle."
          subTitle="Start with one picture or phrase, then match it to the partner that means the same thing."
          isReview="true"
        />

        <p id="r4p2q2-help" className="sr-only">
          Press Tab to move between the words. When a word is focused, its sound
          plays. Press Enter or Space to select a word, and the focus moves to
          the spots in the picture. Press Tab to move between the spots and
          Enter to circle the word there, then the focus returns to the words.
          Press Escape to cancel. You can also select a word and click the
          picture. Then press Check Answer.
        </p>

        {/* WORD BUTTONS */}
        <div
          role="group"
          aria-label="Words to circle"
          aria-describedby="r4p2q2-help"
          style={{ display: "flex", gap: "10px", justifyContent: "center" }}
        >
          {items.map((item) => (
            <div key={item.key} style={{ position: "relative" }}>
              {/* ❌ علامة X */}
              {checked && wrongItems.includes(item.key) && (
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-6px",
                    background: "red",
                    color: "white",
                    borderRadius: "50%",
                    width: "18px",
                    height: "18px",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    border: "1px solid white",
                    zIndex: 2,
                  }}
                >
                  ✕
                </span>
              )}

              {/* 🔊 السبيكر فوق يسار الكلمة أثناء تشغيل الصوت */}
              {playingKey === item.key && (
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: "-10px",
                    right: "-10px",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#fff",
                    borderRadius: "50%",
                    fontSize: "13px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
                    zIndex: 2,
                  }}
                >
                  <FaVolumeUp />
                </span>
              )}

              <button
                type="button"
                ref={(el) => {
                  wordRefs.current[item.key] = el;
                }}
                className={focusClass}
                aria-pressed={selectedItem === item.key}
                aria-disabled={checked}
                aria-label={wordLabel(item)}
                onClick={() => activateWord(item)}
                onFocus={(e) => onWordFocus(e, item)}
                style={{
                  minWidth: "64px",
                  minHeight: "44px",
                  padding: "6px 16px",
                  borderRadius: "12px",
                  background: "white",
                  border:
                    selectedItem === item.key
                      ? "2px solid #007bff"
                      : "1px solid #999",
                  cursor: checked ? "default" : "pointer",
                  touchAction: "manipulation",
                }}
              >
                {item.label}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* IMAGE */}
      <div style={{ position: "relative", marginTop: "20px" }}>
        <img
          src={find_img}
          // ⚠️ عدّليه ليطابق المشهد الفعلي
          alt="A busy scene with many objects, including a cake, rain and some paint."
          draggable="false"
          style={{
            height: "50vh",
            width: "auto",
            cursor: selectedItem && !checked ? "crosshair" : "default",
            display: "block",
          }}
          onClick={handleImageClick}
        />

        {/* 🎯 أماكن الكيبورد: شفافة، والماوس بيمرّ من خلالها للصورة */}
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            ref={(el) => {
              areaRefs.current[item.key] = el;
            }}
            className={focusClass}
            tabIndex={checked ? -1 : 0}
            aria-disabled={checked}
            aria-label={areaLabel(item)}
            onClick={() => activateArea(item)}
            onKeyDown={onAreaKeyDown}
            style={{
              position: "absolute",
              left: `${item.area.x1}%`,
              top: `${item.area.y1}%`,
              width: `${item.area.x2 - item.area.x1}%`,
              height: `${item.area.y2 - item.area.y1}%`,
              minWidth: "48px",
              minHeight: "48px",
              zIndex: 2,
              padding: 0,
              background: "transparent",
              border: "4px dashed transparent",
              borderRadius: "12px",
              pointerEvents: "none",
            }}
          />
        ))}

        {/* DRAW CIRCLES */}
        {Object.entries(circles).map(([key, point]) => (
          <div
            key={key}
            aria-hidden="true"
            style={{
              position: "absolute",
              top: `${point.y}%`,
              left: `${point.x}%`,
              width: "9%",
              height: "10%",
              border: "3px solid red",
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          />
        ))}
      </div>

      {/* ACTION BUTTONS */}
      <div className="action-buttons-container">
        <button
          type="button"
          className="try-again-button"
          onClick={handleStartAgain}
        >
          Start Again ↻
        </button>

        <button
          type="button"
          className="show-answer-btn"
          onClick={handleShowAnswer}
        >
          Show Answer
        </button>

        <button type="button" className="check-button2" onClick={handleCheck}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Review4_Page2_Q2;
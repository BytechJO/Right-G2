/* eslint-disable react-refresh/only-export-components */
import React, { useState, useRef, useEffect } from "react";
import { FaVolumeUp } from "react-icons/fa";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review6_Page2_Q2.css";

import img1 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 55/EX E 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 55/EX E 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 55/EX E 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 55/EX E 4.svg";
import img5 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 55/EX E 5.svg";
import img6 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 55/EX E 6.svg";

import wordAudio1 from "../../../assets/audio/ClassBook/U 6/Page 55 - E/Item_001_light.mp3";
import wordAudio2 from "../../../assets/audio/ClassBook/U 6/Page 55 - E/Item_002_five.mp3";
import wordAudio3 from "../../../assets/audio/ClassBook/U 6/Page 55 - E/Item_003_kite.mp3";
import wordAudio4 from "../../../assets/audio/ClassBook/U 6/Page 55 - E/Item_004_tight.mp3";
import wordAudio5 from "../../../assets/audio/ClassBook/U 6/Page 55 - E/Item_005_night.mp3";
import wordAudio6 from "../../../assets/audio/ClassBook/U 6/Page 55 - E/Item_006_bike.mp3";
import ExerciseHeader from "../../ExerciseHeader";

const images = [
  { image: img1, alt: "A tight knot" },
  { image: img2, alt: "A bike" },
  { image: img3, alt: "A light bulb" },
  { image: img4, alt: "A kite flying in the sky" },
  { image: img5, alt: "The number five" },
  { image: img6, alt: "A night sky with the moon and stars" },
];

const words = ["light", "five", "kite", "tight", "night", "bike"];
const wordAudios = [
  wordAudio1,
  wordAudio2,
  wordAudio3,
  wordAudio4,
  wordAudio5,
  wordAudio6,
];

// image index -> word index
const correctMatches = {
  0: 3,
  1: 5,
  2: 0,
  3: 2,
  4: 1,
  5: 4,
};

const imgIdxOf = (line) =>
  line.from.type === "image" ? line.from.index : line.to.index;
const txtIdxOf = (line) =>
  line.from.type === "text" ? line.from.index : line.to.index;

const isActivateKey = (e) => e.key === "Enter" || e.key === " ";

const ARROWS = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
};

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

const Review6_Page2_Q2 = () => {
  const [lines, setLines] = useState([]);
  const [startDot, setStartDot] = useState(null);
  // results[imageIndex]: true = صح (مقفل)، false = غلط (قابل للتعديل)
  const [results, setResults] = useState({});
  const [showedAnswer, setShowedAnswer] = useState(false);
  const [hover, setHover] = useState(null); // الهدف اللي المؤشر/الماوس عليه (للخط المقطّع)
  const [playingId, setPlayingId] = useState(null);
  const [announcement, setAnnouncement] = useState("");

  const imageDotRefs = useRef([]);
  const textDotRefs = useRef([]);
  const imageRefs = useRef([]);
  const textRefs = useRef([]);
  const containerRef = useRef(null);

  const audioRef = useRef(null);
  const pointerDownRef = useRef(false);
  const suppressFocusAudioRef = useRef(false);

  /* ---------------- audio ---------------- */
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setPlayingId(null);
  };

  const playWord = (i) => {
    stopAudio();
    const audio = new Audio(wordAudios[i]);
    audioRef.current = audio;
    setPlayingId(i);
    audio.onended = () => setPlayingId(null);
    audio.play().catch(() => setPlayingId(null));
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  /* ---------------- helpers ---------------- */
  const lineForText = (t) => lines.find((l) => txtIdxOf(l) === t);
  const lineForImage = (m) => lines.find((l) => imgIdxOf(l) === m);

  const isTextLocked = (t) => {
    if (showedAnswer) return true;
    const l = lineForText(t);
    return !!l && results[imgIdxOf(l)] === true;
  };

  const isImageLocked = (m) => {
    if (showedAnswer) return true;
    const l = lineForImage(m);
    return !!l && results[m] === true;
  };

  const allLocked = images.every((_, m) => results[m] === true);

  const focusEl = (type, k) => {
    suppressFocusAudioRef.current = true;
    (type === "text" ? textRefs : imageRefs).current[k]?.focus();
    suppressFocusAudioRef.current = false;
  };

  // يحرّك المؤشر لأول عنصر متاح من النوع المطلوب (الأفضل اللي بدون خط)
  const focusCandidate = (type) => {
    const count = type === "text" ? words.length : images.length;
    const locked = type === "text" ? isTextLocked : isImageLocked;
    const hasLine = (k) =>
      type === "text" ? !!lineForText(k) : !!lineForImage(k);

    let target = -1;

    for (let k = 0; k < count; k++) {
      if (!locked(k) && !hasLine(k)) {
        target = k;
        break;
      }
    }

    if (target === -1) {
      for (let k = 0; k < count; k++) {
        if (!locked(k)) {
          target = k;
          break;
        }
      }
    }

    if (target !== -1) focusEl(type, target);
  };

  const moveFocus = (type, from, dir) => {
    const count = type === "text" ? words.length : images.length;
    const locked = type === "text" ? () => false : isImageLocked;

    let k = from;

    for (let n = 0; n < count; n++) {
      k = (k + dir + count) % count;

      if (!locked(k)) {
        focusEl(type, k);
        return;
      }
    }
  };

  /* ---------------- select / connect ---------------- */
  const handleDotClick = (index, type, viaKeyboard = false) => {
    if (showedAnswer) return;

    const locked =
      type === "text" ? isTextLocked(index) : isImageLocked(index);

    if (locked) {
      setAnnouncement("This match is correct and locked.");
      return;
    }

    const other = type === "text" ? "image" : "text";

    // أول اختيار
    if (!startDot) {
      setStartDot({ index, type });
      setAnnouncement(
        type === "text"
          ? `${words[index]} chosen. Choose a picture.`
          : `${images[index].alt} chosen. Choose a word.`,
      );

      if (viaKeyboard) focusCandidate(other);
      return;
    }

    // نفس النوع
    if (startDot.type === type) {
      if (startDot.index === index) {
        setStartDot(null);
        setAnnouncement("Choice cancelled.");
      } else {
        setStartDot({ index, type });
        if (viaKeyboard) focusCandidate(other);
      }
      return;
    }

    const imageIndex = startDot.type === "image" ? startDot.index : index;
    const textIndex = startDot.type === "text" ? startDot.index : index;

    if (isImageLocked(imageIndex) || isTextLocked(textIndex)) {
      setAnnouncement("This match is correct and locked.");
      setStartDot(null);
      return;
    }

    const oldTextLine = lineForText(textIndex);

    const updated = lines.filter(
      (l) => imgIdxOf(l) !== imageIndex && txtIdxOf(l) !== textIndex,
    );

    updated.push({
      from: { index: imageIndex, type: "image" },
      to: { index: textIndex, type: "text" },
    });

    setLines(updated);

    // الخط اللي انعدّل بيفقد نتيجته (✕) لحد ما يعمل Check من جديد
    setResults((prev) => {
      const next = { ...prev };
      delete next[imageIndex];
      if (oldTextLine) delete next[imgIdxOf(oldTextLine)];
      return next;
    });

    setStartDot(null);
    setHover(null);
    setAnnouncement(`${words[textIndex]} connected to ${images[imageIndex].alt}.`);

    // بعد التوصيل: المؤشر بيرجع للكلمات (للكلمة التالية اللي لسا ما انوصلت)
    if (viaKeyboard) {
      let next = textIndex;

      for (let n = 1; n <= words.length; n++) {
        const k = (textIndex + n) % words.length;
        if (!updated.some((l) => txtIdxOf(l) === k)) {
          next = k;
          break;
        }
      }

      setTimeout(() => focusEl("text", next), 0);
    }
  };

  const onEndpointKeyDown = (e, index, type) => {
    if (e.key === "Tab") return;

    if (isActivateKey(e)) {
      e.preventDefault();
      e.stopPropagation();
      if (!e.repeat) handleDotClick(index, type, true);
      return;
    }

    if (ARROWS[e.key]) {
      e.preventDefault();
      e.stopPropagation();
      moveFocus(type, index, ARROWS[e.key]);
      return;
    }

    if (e.key === "Escape" && startDot) {
      e.preventDefault();
      e.stopPropagation();
      setStartDot(null);
      setAnnouncement("Choice cancelled.");
    }
  };

  const onEndpointKeyUp = (e) => {
    if (isActivateKey(e)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const setHoverTarget = (index, type) => setHover({ index, type });
  const clearHoverTarget = (index, type) =>
    setHover((prev) =>
      prev && prev.index === index && prev.type === type ? null : prev,
    );

  /* ---------------- show / reset / check ---------------- */
  const showAnswers = () => {
    stopAudio();

    const answerLines = Object.keys(correctMatches).map((imgIndex) => ({
      from: { index: parseInt(imgIndex), type: "image" },
      to: { index: correctMatches[imgIndex], type: "text" },
    }));

    const allCorrect = {};
    images.forEach((_, m) => {
      allCorrect[m] = true;
    });

    setLines(answerLines);
    setResults(allCorrect);
    setStartDot(null);
    setHover(null);
    setShowedAnswer(true);
    setAnnouncement("All answers shown.");
  };

  const resetAll = () => {
    stopAudio();
    setLines([]);
    setStartDot(null);
    setResults({});
    setHover(null);
    setShowedAnswer(false);
    setAnnouncement("Activity reset. All lines and results are cleared.");
  };

  const checkAnswers = () => {
    if (showedAnswer || allLocked) return;

    if (lines.length !== images.length) {
      ValidationAlert.info(
        "Oops!",
        "Please complete all matches before checking.",
      );
      return;
    }

    let score = 0;
    const newResults = {};

    lines.forEach((line) => {
      const imageIndex = imgIdxOf(line);
      const textIndex = txtIdxOf(line);
      const ok = correctMatches[imageIndex] === textIndex;

      newResults[imageIndex] = ok;
      if (ok) score++;
    });

    const total = images.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    setResults(newResults);
    setStartDot(null);
    setHover(null);

    setAnnouncement(
      [
        `Score ${score} out of ${total}.`,
        ...words.map((w, t) => {
          const l = lines.find((x) => txtIdxOf(x) === t);
          return `${w} is ${l && newResults[imgIdxOf(l)] ? "correct" : "not correct"}.`;
        }),
        score < total ? "You can change the wrong matches and check again." : "",
      ]
        .filter(Boolean)
        .join(" "),
    );

    if (score === total) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  const isWrong = (textIndex) => {
    const line = lineForText(textIndex);
    return !!line && results[imgIdxOf(line)] === false;
  };

  /* ---------------- svg geometry ---------------- */
  const dotCenter = (type, index) => {
    const el = (type === "image" ? imageDotRefs : textDotRefs).current[index];

    if (!el || !containerRef.current) return null;

    const rect = el.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    return {
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top + rect.height / 2 - containerRect.top,
    };
  };

  const previewLine = (() => {
    if (!startDot || !hover || hover.type === startDot.type) return null;

    const targetLocked =
      hover.type === "text"
        ? isTextLocked(hover.index)
        : isImageLocked(hover.index);

    if (targetLocked) return null;

    const a = dotCenter(startDot.type, startDot.index);
    const b = dotCenter(hover.type, hover.index);

    if (!a || !b) return null;

    return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
  })();

  return (
    <div className="main-container-component relative mb-5" ref={containerRef}>
      {/* Screen Reader */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>

      <div className="div-forall" style={{ gap: "20px" }}>
        {" "}
         <ExerciseHeader
          sectionLetter="E"
          title="Read, look, and match."
          subTitle="Start with one picture or phrase, then match it to the partner that means the same thing."
          isReview={true}
        />

        <div>
          {images.map((item, i) => {
            const textSelected =
              startDot?.index === i && startDot?.type === "text";
            const imageSelected =
              startDot?.index === i && startDot?.type === "image";
            const textLocked = isTextLocked(i);
            const imageLocked = isImageLocked(i);

            return (
              <div key={i} className="flex justify-between items-center my-1">
                {/* WORD SIDE */}
                <div className="w-[45%] flex justify-start">
                  <div className="relative inline-block">
                    <p
                      ref={(el) => (textRefs.current[i] = el)}
                      role="button"
                      tabIndex={0}
                      aria-pressed={textSelected}
                      aria-disabled={textLocked}
                      aria-label={`${words[i]}.${
                        textLocked
                          ? " Correct and locked."
                          : " Press Enter or Space to choose it, then choose a picture."
                      }`}
                      onPointerDown={() => {
                        pointerDownRef.current = true;
                      }}
                      onClick={() => {
                        pointerDownRef.current = false;
                        playWord(i);
                        handleDotClick(i, "text");
                      }}
                      onFocus={() => {
                        setHoverTarget(i, "text");
                        if (suppressFocusAudioRef.current) return;
                        if (!pointerDownRef.current) playWord(i);
                      }}
                      onBlur={() => {
                        pointerDownRef.current = false;
                        clearHoverTarget(i, "text");
                      }}
                      onMouseEnter={() => setHoverTarget(i, "text")}
                      onMouseLeave={() => clearHoverTarget(i, "text")}
                      onKeyDown={(e) => {
                        if (isActivateKey(e) && textLocked) {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!e.repeat) playWord(i);
                          return;
                        }
                        onEndpointKeyDown(e, i, "text");
                      }}
                      onKeyUp={onEndpointKeyUp}
                      className={`px-5 py-1.5 rounded-full font-semibold text-[18px] min-w-20 outline-none focus-visible:ring-4 focus-visible:ring-blue-300 ${
                        textLocked ? "cursor-default" : "cursor-pointer"
                      } ${
                        textSelected
                          ? "text-red-600 underline scale-110 bg-[#fdecea]"
                          : "bg-[#f6e6de]"
                      }`}
                    >
                      {words[i]}
                    </p>
                    {playingId === i && <SpeakerBadge />}
                    {isWrong(i) && (
                      <span
                        aria-hidden="true"
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-md"
                      >
                        ✕
                      </span>
                    )}
                    <div
                      ref={(el) => (textDotRefs.current[i] = el)}
                      aria-hidden="true"
                      onClick={() => {
                        playWord(i);
                        handleDotClick(i, "text");
                      }}
                      className={`absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#d82b2b] rounded-full cursor-pointer ${
                        textSelected
                          ? "text-red-600 underline scale-125 bg-red-600"
                          : "bg-red-500"
                      }`}
                    />
                  </div>
                </div>

                {/* IMAGE SIDE */}
                <div className="w-[35%] flex items-center justify-end gap-2">
                  <div
                    ref={(el) => (imageDotRefs.current[i] = el)}
                    aria-hidden="true"
                    onClick={() => handleDotClick(i, "image")}
                    className="w-3 h-3 bg-[#d82b2b] rounded-full cursor-pointer"
                  />

                  <div
                    ref={(el) => (imageRefs.current[i] = el)}
                    role="button"
                    tabIndex={imageLocked ? -1 : 0}
                    aria-pressed={imageSelected}
                    aria-disabled={imageLocked}
                    aria-label={`${item.alt}.${
                      imageLocked
                        ? " Correct and locked."
                        : " Press Enter or Space to connect it with the chosen word."
                    }`}
                    onClick={() => handleDotClick(i, "image")}
                    onFocus={() => setHoverTarget(i, "image")}
                    onBlur={() => clearHoverTarget(i, "image")}
                    onMouseEnter={() => setHoverTarget(i, "image")}
                    onMouseLeave={() => clearHoverTarget(i, "image")}
                    onKeyDown={(e) => onEndpointKeyDown(e, i, "image")}
                    onKeyUp={onEndpointKeyUp}
                    className="rounded outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
                  >
                    <img
                      src={item.image}
                      alt={item.alt}
                      style={{
                        height: "90px",
                        width: "auto",
                        objectFit: "contain",
                        cursor: imageLocked ? "default" : "pointer",
                        border: imageSelected ? "3px solid #e74c3c" : "none",
                        transform: imageSelected ? "scale(1.05)" : "scale(1)",
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          {/* SVG */}
          <svg
            aria-hidden="true"
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          >
            {lines.map((line, i) => {
              const imageIndex = imgIdxOf(line);
              const textIndex = txtIdxOf(line);

              const a = dotCenter("image", imageIndex);
              const b = dotCenter("text", textIndex);

              if (!a || !b) return null;

              return (
                <line
                  key={i}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={results[imageIndex] === true ? "#16a34a" : "#e74c3c"}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              );
            })}

            {/* الخط المقطّع قبل التوصيل */}
            {previewLine && (
              <line
                x1={previewLine.x1}
                y1={previewLine.y1}
                x2={previewLine.x2}
                y2={previewLine.y2}
                stroke="#e74c3c"
                strokeWidth="3"
                strokeDasharray="8 6"
                strokeLinecap="round"
              />
            )}
          </svg>
        </div>
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

export default Review6_Page2_Q2;
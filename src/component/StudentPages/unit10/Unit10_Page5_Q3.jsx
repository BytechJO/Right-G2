import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 86/Asset 48.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 86/Asset 49.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 86/Asset 50.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 86/Asset 51.svg";

import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";
import sound1 from "../../../assets/audio/ClassBook/U 10/Page 86 - B/Item_001_What_is_it_drinking.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 10/Page 86 - B/Item_002_It's_drinking_milk.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 10/Page 86 - B/Item_003_What_is_he_doing.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 10/Page 86 - B/Item_004_He's_putting_on_a_jacket.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 10/Page 86 - B/Item_005_What_is_she_reading.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 10/Page 86 - B/Item_006_She's_reading_a_magazine.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 10/Page 86 - B/Item_007_What_is_she_doing.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 10/Page 86 - B/Item_008_She's_watering_the_flowers.mp3";
const imgIdxOf = (line) =>
  line.from.type === "image" ? line.from.index : line.to.index;
const txtIdxOf = (line) =>
  line.from.type === "text" ? line.from.index : line.to.index;
const isActivateKey = (e) => e.key === "Enter" || e.key === " ";
const ARROWS = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

const Unit10_Page5_Q3 = () => {
  const images = [
    { image: img1, alt: "A girl reading a magazine in an armchair." },
    { image: img2, alt: "A white cat drinking from a bowl." },
    { image: img3, alt: "A boy putting on a jacket in a bedroom." },
    { image: img4, alt: "A girl using a watering can in a flower garden." },
  ];

  const texts = [
    `What is it drinking?
It’s drinking milk.`,
    `What is he doing?
He’s putting on a jacket.`,
    `What is she reading?
She’s reading a magazine.`,
    `What is she doing?
She’s watering the flowers.`,
  ];
  const correctMatches = {
    0: 2, // reading ← girl reading
    1: 0, // drinking ← dog
    2: 1, // jacket ← boy
    3: 3, // watering ← flowers
  };

  const [lines, setLines] = useState([]);
  const [startDot, setStartDot] = useState(null);
  const [results, setResults] = useState({});
  const [showedAnswer, setShowedAnswer] = useState(false);
  const [hover, setHover] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [announcement, setAnnouncement] = useState("");
  const [, setGeometryVersion] = useState(0);
  const imageDotRefs = useRef([]);
  const textDotRefs = useRef([]);
  const imageRefs = useRef([]);
  const textRefs = useRef([]);
  const containerRef = useRef(null);
  const audioRef = useRef(null);
  const tokenRef = useRef(0);
  const suppressFocusAudioRef = useRef(false);
  const focusFrame = useRef(null);
  const textAudios = [
    [sound1, sound2],
    [sound3, sound4],
    [sound5, sound6],
    [sound7, sound8],
  ];
  const stopAudio = () => {
    tokenRef.current += 1;
    const audio = audioRef.current;
    audioRef.current = null;
    setPlayingId(null);
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
    }
  };
  const playText = (index) => {
    stopAudio();

    const token = tokenRef.current;
    setPlayingId(index);
    const playPart = (part) => {
      if (token !== tokenRef.current) return;
      if (part === textAudios[index].length) {
        audioRef.current = null;
        setPlayingId(null);
        return;
      }
      const audio = new Audio(textAudios[index][part]);
      audioRef.current = audio;
      const fail = () => {
        if (token !== tokenRef.current || audioRef.current !== audio) return;
        stopAudio();
        setAnnouncement("Audio could not be played. Please try again.");
      };
      audio.onended = () => {
        if (token !== tokenRef.current || audioRef.current !== audio) return;
        audio.onended = null;
        audio.onerror = null;
        playPart(part + 1);
      };
      audio.onerror = fail;
      try {
        audio.play().catch(fail);
      } catch {
        fail();
      }
    };
    try {
      playPart(0);
    } catch {
      stopAudio();
      setAnnouncement("Audio could not be played. Please try again.");
    }
  };
  useEffect(() => {
    const onOtherPlay = (event) => {
      if (event.target === audioRef.current) return;
      tokenRef.current += 1;
      const audio = audioRef.current;
      audioRef.current = null;
      if (audio) {
        audio.onended = null;
        audio.onerror = null;
        audio.pause();
      }
      setPlayingId(null);
    };
    document.addEventListener("play", onOtherPlay, true);
    return () => {
      document.removeEventListener("play", onOtherPlay, true);
      tokenRef.current += 1;
      cancelAnimationFrame(focusFrame.current);
      const audio = audioRef.current;
      audioRef.current = null;
      if (audio) {
        audio.onended = null;
        audio.onerror = null;
        audio.pause();
      }
    };
  }, []);
  useEffect(() => {
    const update = () => setGeometryVersion((value) => value + 1);
    window.addEventListener("resize", update);
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    if (containerRef.current) observer?.observe(containerRef.current);
    return () => {
      window.removeEventListener("resize", update);
      observer?.disconnect();
    };
  }, []);
  useEffect(() => {
    setGeometryVersion((v) => v + 1);
  }, [lines, startDot]);
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
  const focusCandidate = (type) => {
    const count = type === "text" ? texts.length : images.length;
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
    const count = type === "text" ? texts.length : images.length;
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
    cancelAnimationFrame(focusFrame.current);
    if (showedAnswer) return;

    const locked = type === "text" ? isTextLocked(index) : isImageLocked(index);

    if (locked) {
      setAnnouncement("This match is correct and locked.");
      return;
    }

    const other = type === "text" ? "image" : "text";
    if (!startDot) {
      setStartDot({ index, type });
      setAnnouncement(
        type === "text"
          ? `${texts[index]} chosen. Choose a picture.`
          : `${images[index].alt} chosen. Choose a word.`,
      );

      if (viaKeyboard) focusCandidate(other);
      return;
    }
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
    setResults((prev) => {
      const next = { ...prev };
      delete next[imageIndex];
      if (oldTextLine) delete next[imgIdxOf(oldTextLine)];
      return next;
    });

    setStartDot(null);
    setHover(null);
    setAnnouncement(
      `${texts[textIndex]} connected to ${images[imageIndex].alt}.`,
    );
    if (viaKeyboard) {
      let next = textIndex;

      for (let n = 1; n <= texts.length; n++) {
        const k = (textIndex + n) % texts.length;
        if (!updated.some((l) => txtIdxOf(l) === k)) {
          next = k;
          break;
        }
      }

      cancelAnimationFrame(focusFrame.current);
      focusFrame.current = requestAnimationFrame(() => focusEl("text", next));
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
    cancelAnimationFrame(focusFrame.current);

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
    cancelAnimationFrame(focusFrame.current);
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
    stopAudio();
    cancelAnimationFrame(focusFrame.current);

    if (lines.length !== images.length) {
      ValidationAlert.info(
        "Oops!",
        "Please complete all matches before checking.",
      );
      setAnnouncement("Please complete all matches before checking.");
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
        ...texts.map((w, t) => {
          const l = lines.find((x) => txtIdxOf(x) === t);
          return `${w} is ${l && newResults[imgIdxOf(l)] ? "correct" : "not correct"}.`;
        }),
        score < total
          ? "You can change the wrong matches and check again."
          : "",
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
//....
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

  const speakerBadge = (index) =>
    playingId === index && (
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
  return (
    <div
      ref={containerRef}
      className="main-container-component relative mb-10"
      onTransitionEnd={() => setGeometryVersion((v) => v + 1)}
    >
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>
      <div className="div-forall gap-2">
        {" "}
        <ExerciseHeader
          sectionLetter="B"
          title="Look, read, and match."
          subTitle={
            "Start with one picture or phrase, then match it to the partner that means the same thing."
          }
        />
        <div className="flex flex-col">
          {images.map((item, i) => (
            <div key={i} className="flex justify-between items-center my-3">
              {/* WORD SIDE */}
              <div className="w-[45%] flex justify-start">
                <div className="relative inline-block">
                  <p
                    className={`relative focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4! px-5 py-1.5 rounded-[20px] font-semibold text-[20px] w-[290px] cursor-pointer min-w-20 whitespace-pre-line
                    bg-red-100
          ${startDot?.index === i && startDot?.type === "text" ? "" : ""}
    transition-all duration-200
          `}
                    ref={(el) => {
                      textRefs.current[i] = el;
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${texts[i]}${isTextLocked(i) ? ". Match locked." : ""}`}
                    aria-pressed={
                      startDot?.type === "text" && startDot.index === i
                    }
                    aria-disabled={isTextLocked(i)}
                    onKeyDown={(e) => {
                      if (isActivateKey(e) && !e.repeat) playText(i);
                      onEndpointKeyDown(e, i, "text");
                    }}
                    onKeyUp={onEndpointKeyUp}
                    onFocus={(e) => {
                      setHoverTarget(i, "text");
                      if (
                        !suppressFocusAudioRef.current &&
                        e.currentTarget.matches(":focus-visible")
                      )
                        playText(i);
                    }}
                    onBlur={() => clearHoverTarget(i, "text")}
                    onMouseEnter={() => setHoverTarget(i, "text")}
                    onMouseLeave={() => clearHoverTarget(i, "text")}
                    style={{
                      position: "relative",
                      boxShadow: isTextLocked(i)
                        ? "0 0 0 2px #16a34a"
                        : undefined,
                      ...(playingId === i ||
                      (startDot?.type === "text" && startDot.index === i)
                        ? {
                            outline: "4px solid #2563eb",
                            outlineOffset: 2,
                            backgroundColor: "#dbeafe",
                          }
                        : {}),
                    }}
                    onClick={() => {
                      playText(i);
                      handleDotClick(i, "text");
                    }}
                  >
                    {texts[i]}
                    {speakerBadge(i)}
                  </p>
                  {isWrong(i) && (
                    <div
                      className="
      absolute -top-2 -right-2
      w-7 h-7
      bg-red-500 text-white
      rounded-full
      flex items-center justify-center
      text-lg font-bold
      border-2 border-white
      z-10
    "
                    >
                      ✕
                    </div>
                  )}
                  <div
                    ref={(el) => (textDotRefs.current[i] = el)}
                    onClick={() => handleDotClick(i, "text")}
                    className={`absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#d82b2b] rounded-full cursor-pointer  ${
                      startDot?.index === i && startDot?.type === "text"
                        ? "bg-red-600 scale-150"
                        : ""
                    }
    transition-all duration-200`}
                  />
                </div>
              </div>

              {/* IMAGE SIDE */}
              <div className="w-[35%] flex items-center justify-end gap-2">
                <div
                  ref={(el) => (imageDotRefs.current[i] = el)}
                  onClick={() => handleDotClick(i, "image")}
                  className={`w-3 h-3 bg-[#d82b2b] rounded-full cursor-pointer ${
                    startDot?.index === i && startDot?.type === "image"
                      ? "bg-red-600 scale-150"
                      : ""
                  }
    transition-all duration-200 `}
                />

                <img
                  src={item.image}
                  alt={item.alt}
                  ref={(el) => {
                    imageRefs.current[i] = el;
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${item.alt}${isImageLocked(i) ? ". Match locked." : ""}`}
                  aria-pressed={
                    startDot?.type === "image" && startDot.index === i
                  }
                  aria-disabled={isImageLocked(i)}
                  onKeyDown={(e) => onEndpointKeyDown(e, i, "image")}
                  onKeyUp={onEndpointKeyUp}
                  onFocus={() => setHoverTarget(i, "image")}
                  onBlur={() => clearHoverTarget(i, "image")}
                  onMouseEnter={() => setHoverTarget(i, "image")}
                  onMouseLeave={() => clearHoverTarget(i, "image")}
                  onLoad={() => setGeometryVersion((v) => v + 1)}
                  onClick={() => handleDotClick(i, "image")}
                  className={` focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4! ${
                    startDot?.index === i && startDot?.type === "image"
                      ? ""
                      : ""
                  }
    transition-all duration-200`}
                  style={{
                    height: "120px",
                    outline:
                      startDot?.type === "image" && startDot.index === i
                        ? "4px solid #2563eb"
                        : undefined,
                    backgroundColor:
                      startDot?.type === "image" && startDot.index === i
                        ? "#dbeafe"
                        : undefined,
                    width: "auto",
                    // objectFit: "cover",
                    cursor: "pointer",
                    borderRadius: "16px",
                    // border: "2px solid #e74c3c",
                    transition: "all 0.3s ease",
                    transform:
                      startDot?.index === i && startDot?.type === "image"
                        ? "scale(1.05)"
                        : "scale(1)",
                    boxShadow: isImageLocked(i)
                      ? "0 0 0 2px #16a34a"
                      : startDot?.index === i && startDot?.type === "image"
                        ? "0 4px 10px rgba(0,0,0,0.2)"
                        : "none",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <svg
        aria-hidden="true"
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      >
        {previewLine && (
          <line
            {...previewLine}
            stroke="#2563eb"
            strokeWidth="3"
            strokeDasharray="7 5"
          />
        )}
        {lines.map((line, i) => {
          const imageIndex =
            line.from.type === "image" ? line.from.index : line.to.index;

          const textIndex =
            line.from.type === "text" ? line.from.index : line.to.index;

          const imgDot = imageDotRefs.current[imageIndex];
          const txtDot = textDotRefs.current[textIndex];

          if (!imgDot || !txtDot || !containerRef.current) return null;

          const imgRect = imgDot.getBoundingClientRect();
          const txtRect = txtDot.getBoundingClientRect();
          const containerRect = containerRef.current.getBoundingClientRect();

          const x1 = imgRect.left + imgRect.width / 2 - containerRect.left;
          const y1 = imgRect.top + imgRect.height / 2 - containerRect.top;

          const x2 = txtRect.left + txtRect.width / 2 - containerRect.left;
          const y2 = txtRect.top + txtRect.height / 2 - containerRect.top;

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={
                results[imageIndex] === true || showedAnswer
                  ? "#16a34a"
                  : "#e74c3c"
              }
              strokeWidth="3"
              strokeLinecap="round"
            />
          );
        })}
      </svg>

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
  );
};

export default Unit10_Page5_Q3;

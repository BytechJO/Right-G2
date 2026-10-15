import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";
import "./Unit8_Page6_Q2.css";

import img1 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 69/Asset 7.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 69/Asset 8.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 69/Asset 9.svg";

import sound1 from "../../../assets/audio/ClassBook/U 8/Page 69 - E/Item_001_You_have_popsicles.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 8/Page 69 - E/Item_002_You_don't_have_popcorn.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 8/Page 69 - E/Item_003_They_have_chips.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 8/Page 69 - E/Item_004_They_don't_have_candy.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 8/Page 69 - E/Item_005_We_have_juice.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 8/Page 69 - E/Item_006_We_don't_have_burgers.mp3";

const keyboardFocusClass =
  " focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!";
const imgIdxOf = (line) =>
  line.from.type === "image" ? line.from.index : line.to.index;
const txtIdxOf = (line) =>
  line.from.type === "text" ? line.from.index : line.to.index;
const isActivateKey = (e) => e.key === "Enter" || e.key === " ";
const ARROWS = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

const Unit8_Page6_Q2 = () => {
  const completedCheckRef = useRef(null);
  const completeCheck = (event) => {
    const button = event?.currentTarget;
    if (!completedCheckRef.current || (button?.style && completedCheckRef.current.button !== button)) {
      completedCheckRef.current = { button, cursor: button?.style?.cursor, aria: button?.getAttribute?.("aria-disabled") };
    }
    if (button?.style) {
      button.style.cursor = "not-allowed";
      button.setAttribute("aria-disabled", "true");
    }
  };
  const resetCompletedCheck = () => {
    const previous = completedCheckRef.current;
    if (previous?.button?.style) {
      previous.button.style.cursor = previous.cursor || "";
      if (previous.aria == null) previous.button.removeAttribute("aria-disabled");
      else previous.button.setAttribute("aria-disabled", previous.aria);
    }
    completedCheckRef.current = null;
  };

  const images = [
    {
      image: img1,
      alt: "A boy pointing to two children eating chips from bags.",
    },
    { image: img2, alt: "A boy and a girl holding cups with drinking straws." },
    { image: img3, alt: "A girl pointing to two children holding popsicles." },
  ];
  const texts = [
    "You have popsicles.\nYou don’t have popcorn.",
    "They have chips.\nThey don’t have candy.",
    "We have juice.\nWe don’t have burgers.",
  ];
  const correctMatches = {
    0: 1,
    1: 2,
    2: 0,
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
    document.querySelectorAll("audio").forEach((audio) => audio.pause());
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
      audio.play().catch(fail);
    };
    playPart(0);
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
    stopAudio();
    setLines([]);
    setStartDot(null);
    setResults({});
    setHover(null);
    setShowedAnswer(false);
    setAnnouncement("Activity reset. All lines and results are cleared.");
  };

  const checkAnswers = (checkEvent) => {
    if (completedCheckRef.current) { completeCheck(checkEvent); return; }

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

    if (score === total) (completeCheck(checkEvent), ValidationAlert.success(msg));
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

  const isImageWrong = (index) => results[index] === false;
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
      className="main-container-component relative"
      ref={containerRef}
      onKeyDown={(e) => {
        if (isActivateKey(e)) e.stopPropagation();
      }}
      onKeyUp={(e) => {
        if (isActivateKey(e)) e.stopPropagation();
      }}
    >
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>
      <p id="u8p6q2-help" className="sr-only">
        Tab and Shift+Tab move between pictures and text. Enter or Space chooses
        one endpoint and connects it to the other. Arrow keys move between
        endpoints on the same side. Escape cancels a pending match. Correct
        matches are locked after checking; incorrect matches can be changed.
      </p>
      <div className="div-forall" style={{ gap: "20px" }}>
        <ExerciseHeader
          sectionLetter="E"
          title="Look and match."
          subTitle={
            "Start with one picture or phrase, then match it to the partner that means the same thing."
          }
        />

        <div className="flex flex-col gap-2">
          {images.map((item, i) => (
            <div key={i} className="flex items-center justify-between my-4">
              <div className="flex items-center gap-6 w-[45%]">
                <div className="relative">
                  {isImageWrong(i) && (
                    <span
                      aria-hidden="true"
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-md"
                    >
                      ✕
                    </span>
                  )}

                  <img
                    src={item.image}
                    ref={(node) => {
                      imageRefs.current[i] = node;
                    }}
                    alt={item.alt}
                    role="button"
                    tabIndex={0}
                    aria-pressed={
                      startDot?.type === "image" && startDot.index === i
                    }
                    aria-disabled={isImageLocked(i)}
                    aria-label={`Picture ${i + 1}: ${item.alt}${isImageLocked(i) ? " Correct and locked." : " Press Enter or Space to choose."}`}
                    aria-describedby="u8p6q2-help"
                    onFocus={() => setHoverTarget(i, "image")}
                    onBlur={() => clearHoverTarget(i, "image")}
                    onMouseEnter={() => setHoverTarget(i, "image")}
                    onMouseLeave={() => clearHoverTarget(i, "image")}
                    onKeyDown={(e) => onEndpointKeyDown(e, i, "image")}
                    onKeyUp={onEndpointKeyUp}
                    onLoad={() => setGeometryVersion((value) => value + 1)}
                    style={{
                      height: "120px",
                      width: "auto",
                      boxShadow:
                        results[i] === true ? "0 0 0 2px #16a34a" : undefined,
                    }}
                    className={`object-contain cursor-pointer rounded-lg ${keyboardFocusClass}
      ${isImageWrong(i) ? "border-2 border-red-500" : ""}
      ${
        startDot?.index === i && startDot?.type === "image"
          ? "ring-4 ring-red-600"
          : ""
      }
    `}
                    onClick={() => handleDotClick(i, "image")}
                  />
                </div>

                <div
                  ref={(el) => (imageDotRefs.current[i] = el)}
                  aria-hidden="true"
                  onClick={() => handleDotClick(i, "image")}
                  className={`w-3 h-3 rounded-full cursor-pointer
               ${
                 startDot?.index === i && startDot?.type === "image"
                   ? "bg-red-600 scale-125"
                   : "bg-red-500"
               }`}
                />
              </div>

              <div className="flex items-center gap-4">
                <div
                  ref={(el) => (textDotRefs.current[i] = el)}
                  aria-hidden="true"
                  onClick={() => {
                    playText(i);
                    handleDotClick(i, "text");
                  }}
                  className="w-3 h-3 bg-red-500 rounded-full cursor-pointer"
                />

                <div
                  onClick={() => {
                    playText(i);
                    handleDotClick(i, "text");
                  }}
                  ref={(node) => {
                    textRefs.current[i] = node;
                  }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={
                    startDot?.type === "text" && startDot.index === i
                  }
                  aria-disabled={isTextLocked(i)}
                  aria-label={`Text ${i + 1}: ${texts[i]}${isTextLocked(i) ? " Correct and locked." : " Press Enter or Space to choose."}`}
                  aria-describedby="u8p6q2-help"
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
                  onKeyDown={(e) => {
                    if (isActivateKey(e) && !e.repeat) playText(i);
                    onEndpointKeyDown(e, i, "text");
                  }}
                  onKeyUp={onEndpointKeyUp}
                  style={{
                    whiteSpace: "pre-line",
                    boxShadow:
                      playingId === i
                        ? "0 0 0 3px #2563eb"
                        : isTextLocked(i)
                          ? "0 0 0 2px #16a34a"
                          : isWrong(i)
                            ? "0 0 0 2px #ef4444"
                            : undefined,
                    backgroundColor: playingId === i ? "#dbeafe" : undefined,
                  }}
                  className={`relative px-5 py-3 ${keyboardFocusClass} rounded-xl text-[17px] leading-6 cursor-pointer
  ${
    startDot?.index === i && startDot?.type === "text"
      ? "bg-[#f9e5dd] ring-2 ring-red-600"
      : "bg-[#f9e5dd]"
  }`}
                >
                  {texts[i]}
                  {speakerBadge(i)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <svg
        aria-hidden="true"
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      >
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
              stroke={results[imageIndex] === true ? "#16a34a" : "red"}
              strokeWidth="3"
              strokeLinecap="round"
            />
          );
        })}
        {previewLine && (
          <line
            {...previewLine}
            stroke="red"
            strokeWidth="3"
            strokeDasharray="8 6"
            strokeLinecap="round"
          />
        )}
      </svg>

      <div className="action-buttons-container">
        <button
          type="button"
          onClick={(checkEvent) => { resetCompletedCheck(); (resetAll)(checkEvent); }}
          className={`try-again-button`}
        >
          Start Again ↻
        </button>

        <button
          type="button"
          onClick={showAnswers}
          className={`show-answer-btn`}
        >
          Show Answer
        </button>

        <button
          type="button"
          onClick={checkAnswers}
          aria-disabled={showedAnswer || allLocked}
          className={`check-button2`}
        >
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit8_Page6_Q2;

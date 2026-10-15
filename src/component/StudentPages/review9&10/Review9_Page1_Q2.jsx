import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review9_Page1.css";

import img1 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 88/Asset 54.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 88/Asset 56.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 88/Asset 57.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 88/Asset 58.svg";

import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/ClassBook/U 10/Page 88 - B/Item_001_Sending_an_email.mp3";
import clip1 from "../../../assets/audio/ClassBook/U 10/Page 88 - B/Item_002_listening_to_the_radio.mp3";
import clip2 from "../../../assets/audio/ClassBook/U 10/Page 88 - B/Item_003_ironing_the_clothes.mp3";
import clip3 from "../../../assets/audio/ClassBook/U 10/Page 88 - B/Item_004_playing_chess.mp3";
const clips = {
  "Sending an email": clip0,
  "listening to the radio": clip1,
  "ironing the clothes": clip2,
  "playing chess": clip3,
};
const activeStyle = {
  outline: "4px solid #2563eb",
  outlineOffset: 2,
  backgroundColor: "#dbeafe",
};
const activateKey = (e) => e.key === "Enter" || e.key === " ";
const arrows = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

const Review9_Page1_Q2 = () => {
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
    { id: 0, img: img1, alt: "A man sitting beside a radio." },
    { id: 1, img: img2, alt: "A girl using a laptop." },
    { id: 2, img: img3, alt: "Two men playing chess." },
    { id: 3, img: img4, alt: "A woman using an iron on a garment." },
  ];

  const sentences = [
    { id: 0, text: "Sending an email.", audio: clips["Sending an email"] },
    {
      id: 1,
      text: "listening to the radio.",
      audio: clips["listening to the radio"],
    },
    {
      id: 2,
      text: "ironing the clothes.",
      audio: clips["ironing the clothes"],
    },
    { id: 3, text: "playing chess.", audio: clips["playing chess"] },
  ];

  const correct = {
    0: 1,
    1: 0,
    2: 3,
    3: 2,
  };

  const [matches, setMatches] = useState({});
  const [results, setResults] = useState({});
  const [revealed, setRevealed] = useState(false);
  const [source, setSource] = useState(null);
  const [hover, setHover] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [announcement, setAnnouncement] = useState("");
  const [, setGeometryVersion] = useState(0);
  const imageRefs = useRef([]),
    sentenceRefs = useRef([]),
    containerRef = useRef(null);
  const audioRef = useRef(null),
    focusFrame = useRef(null),
    suppressFocusSound = useRef(false);
  const imageLocked = (id) => revealed || results[id] === "correct";
  const sentenceLocked = (id) =>
    revealed ||
    Object.entries(matches).some(
      ([image, sentence]) => sentence === id && results[image] === "correct",
    );
  const endpointLocked = (type, id) =>
    type === "image" ? imageLocked(id) : sentenceLocked(id);
  const allDone = images.every((img) => results[img.id] === "correct");
  const cancelFocus = () => {
    if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
    focusFrame.current = null;
  };
  const focusSafely = (type, id) => {
    cancelFocus();
    focusFrame.current = requestAnimationFrame(() => {
      focusFrame.current = null;
      suppressFocusSound.current = true;
      try {
        (type === "image" ? imageRefs : sentenceRefs).current[id]?.focus();
      } finally {
        suppressFocusSound.current = false;
      }
    });
  };
  const clearSelection = () => {
    cancelFocus();
    setSource(null);
    setHover(null);
  };
  const stopAudio = () => {
    const audio = audioRef.current;
    audioRef.current = null;
    setPlayingId(null);
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
    }
  };
  const playSentence = (id) => {
    stopAudio();
    const audio = new Audio(sentences[id].audio);
    audioRef.current = audio;
    setPlayingId(id);
    const finish = () => {
      if (audioRef.current !== audio) return;
      audioRef.current = null;
      audio.onended = null;
      audio.onerror = null;
      setPlayingId(null);
    };
    const fail = () => {
      if (audioRef.current !== audio) return;
      audio.pause();
      finish();
      setAnnouncement("Audio could not be played. Please try again.");
    };
    audio.onended = finish;
    audio.onerror = fail;
    try {
      audio.play().catch(fail);
    } catch {
      fail();
    }
  };
  useEffect(() => {
    const otherPlay = (event) => {
      const audio = audioRef.current;
      if (!audio || event.target === audio) return;
      audioRef.current = null;
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      setPlayingId(null);
    };
    document.addEventListener("play", otherPlay, true);
    return () => {
      document.removeEventListener("play", otherPlay, true);
      if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
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
    setGeometryVersion((value) => value + 1);
  }, [matches, source]);

  const selectEndpoint = (type, id, keyboard = false) => {
    if (type === "sentence") playSentence(id);
    if (endpointLocked(type, id)) {
      setAnnouncement("This match is correct and locked.");
      return;
    }
    cancelFocus();
    if (!source || source.type === type) {
      const cancelled = source?.type === type && source.id === id;
      setSource(cancelled ? null : { type, id });
      setHover(null);
      setAnnouncement(
        cancelled
          ? "Selection cancelled."
          : `${type === "image" ? `Picture ${id + 1}` : sentences[id].text} selected. Choose the other endpoint.`,
      );
      if (keyboard && !cancelled) {
        const other = type === "image" ? "sentence" : "image";
        const candidate =
          images.find(
            (item) =>
              !endpointLocked(other, item.id) &&
              (other === "image"
                ? matches[item.id] === undefined
                : !Object.values(matches).includes(item.id)),
          ) || images.find((item) => !endpointLocked(other, item.id));
        if (candidate) focusSafely(other, candidate.id);
      }
      return;
    }
    if (endpointLocked(source.type, source.id)) return;
    const image = type === "image" ? id : source.id,
      sentence = type === "sentence" ? id : source.id;
    const next = { ...matches },
      affected = [image];
    for (const [key, value] of Object.entries(next)) {
      if (value === sentence && Number(key) !== image) {
        if (imageLocked(Number(key))) return;
        delete next[key];
        affected.push(Number(key));
      }
    }
    next[image] = sentence;
    setMatches(next);
    setResults((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(([key]) => !affected.includes(Number(key))),
      ),
    );
    clearSelection();
    setAnnouncement(
      `Picture ${image + 1} connected to ${sentences[sentence].text}`,
    );
    if (keyboard) {
      const editable = (s) =>
        !Object.entries(next).some(
          ([key, value]) => value === s.id && results[key] === "correct",
        );
      const candidate =
        sentences.find(
          (s) => editable(s) && !Object.values(next).includes(s.id),
        ) || sentences.find(editable);
      if (candidate) focusSafely("sentence", candidate.id);
    }
  };
  const endpointProps = (type, id) => ({
    role: "button",
    tabIndex: 0,
    "aria-pressed": source?.type === type && source.id === id,
    "aria-disabled": endpointLocked(type, id),
    "data-endpoint": `${type}-${id}`,
    "aria-label": `${type === "image" ? `Picture ${id + 1}: ${images[id].alt}` : sentences[id].text}${endpointLocked(type, id) ? " Correct match locked." : " Choose to connect."}`,
    onClick: () => selectEndpoint(type, id),
    onFocus: (e) => {
      if (!endpointLocked(type, id)) setHover({ type, id });
      if (
        type === "sentence" &&
        !suppressFocusSound.current &&
        e.currentTarget.matches(":focus-visible")
      )
        playSentence(id);
    },
    onBlur: () => setHover(null),
    onMouseEnter: () => {
      if (!endpointLocked(type, id)) setHover({ type, id });
    },
    onMouseLeave: () => setHover(null),
    onTransitionEnd: () => setGeometryVersion((value) => value + 1),
    onKeyDown: (e) => {
      if (activateKey(e)) {
        e.preventDefault();
        e.stopPropagation();
        if (!e.repeat) selectEndpoint(type, id, true);
      } else if (arrows[e.key]) {
        e.preventDefault();
        e.stopPropagation();
        focusSafely(type, (id + arrows[e.key] + images.length) % images.length);
      } else if (e.key === "Escape" && source) {
        e.preventDefault();
        e.stopPropagation();
        const selected = source;
        clearSelection();
        setAnnouncement("Selection cancelled.");
        focusSafely(selected.type, selected.id);
      }
    },
    onKeyUp: (e) => {
      if (activateKey(e)) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
  });
  const checkAnswers = (checkEvent) => {
    if (completedCheckRef.current) { completeCheck(checkEvent); return; }

    if (revealed || allDone) return;
    clearSelection();
    stopAudio();
    if (Object.keys(matches).length !== images.length) {
      ValidationAlert.info("Please match all.");
      setAnnouncement("Please match all.");
      return;
    }
    const next = Object.fromEntries(
      images.map((img) => [
        img.id,
        results[img.id] === "correct" || correct[img.id] === matches[img.id]
          ? "correct"
          : "wrong",
      ]),
    );
    setResults(next);
    const score = Object.values(next).filter(
        (result) => result === "correct",
      ).length,
      total = images.length;
    const color = score === total ? "green" : score === 0 ? "red" : "orange";
    const msg = `<div style="font-size:20px;margin-top:10px;text-align:center;"><span style="color:${color};font-weight:bold;">Score: ${score} / ${total}</span></div>`;
    if (score === total) (completeCheck(checkEvent), ValidationAlert.success(msg));
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
    setAnnouncement(
      [
        `Score ${score} out of ${total}.`,
        ...images.map(
          (img) =>
            `Picture ${img.id + 1}: ${next[img.id] === "correct" ? "correct and locked" : "incorrect"}.`,
        ),
        score < total
          ? "You can change incorrect matches and check again."
          : "",
      ]
        .filter(Boolean)
        .join(" "),
    );
  };
  const showAnswers = () => {
    clearSelection();
    stopAudio();
    setMatches({ ...correct });
    setResults(Object.fromEntries(images.map((img) => [img.id, "correct"])));
    setRevealed(true);
    setAnnouncement("All correct matches shown and locked.");
  };
  const reset = () => {
    clearSelection();
    stopAudio();
    setMatches({});
    setResults({});
    setRevealed(false);
    setAnnouncement("Activity reset. All matches and results cleared.");
  };
  const pathFor = (image, sentence) => {
    const imgEl = imageRefs.current[image],
      sentEl = sentenceRefs.current[sentence];
    if (!imgEl || !sentEl || !containerRef.current) return null;
    const img = imgEl.getBoundingClientRect(),
      sent = sentEl.getBoundingClientRect(),
      root = containerRef.current.getBoundingClientRect();
    const x1 = sent.left + sent.width / 2 - root.left,
      y1 = sent.bottom - root.top;
    const x2 = img.left + img.width / 2 - root.left,
      y2 = img.top - root.top;
    return {
      d: `M ${x1} ${y1} C ${x1} ${y1 + 60}, ${x2} ${y2 - 60}, ${x2} ${y2}`,
      x2,
      y2,
    };
  };
  const preview =
    source &&
    hover &&
    source.type !== hover.type &&
    !endpointLocked(source.type, source.id) &&
    !endpointLocked(hover.type, hover.id)
      ? {
          image: source.type === "image" ? source.id : hover.id,
          sentence: source.type === "sentence" ? source.id : hover.id,
        }
      : null;
  const previewPath = preview ? pathFor(preview.image, preview.sentence) : null;

  const selectedImg = source?.type === "image" ? source.id : null;
  const selectedSentence = source?.type === "sentence" ? source.id : null;
  const isWrongMatch = (id) =>
    Object.entries(matches).some(
      ([img, sent]) => sent === id && results[img] === "wrong",
    );
  return (
    <div
      ref={containerRef}
      className="main-container-component relative"
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
        <div className="header-title-page8 mb-10">
          <ExerciseHeader
            isReview={true}
            sectionLetter="B"
            title="Read and match."
            subTitle={"Start with one picture or phrase, then match it to the partner that means the same thing."}
          />
        </div>
        {/* SENTENCES (TOP) */}
        <div className="relative w-full h-[150px]">
          {sentences.map((sent, index) => {
            let style = {};

            if (index === 0) style = { left: "0%", top: "0%" }; // 1
            if (index === 1) style = { left: "25%", top: "60px" }; // 2 (نازل)
            if (index === 2) style = { right: "25%", top: "0%" }; // 3
            if (index === 3) style = { right: "0%", top: "60px" }; // 4

            return (
              <div
                key={sent.id}
                ref={(el) => (sentenceRefs.current[index] = el)}
                {...endpointProps("sentence", sent.id)}
                style={{
                  position: "absolute",
                  ...style,
                  ...(playingId === sent.id || selectedSentence === sent.id
                    ? activeStyle
                    : sentenceLocked(sent.id)
                      ? { boxShadow: "0 0 0 2px #16a34a" }
                      : {}),
                }}
                className={`relative focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!
          bg-[#f4e9e2] px-6 py-3 rounded-full cursor-pointer font-medium text-center whitespace-nowrap transition-all duration-200
          ${selectedSentence === sent.id ? "bg-red-100 text-red-600 underline scale-110" : ""}
        `}
              >
                <span>{sent.id + 1}. </span>
                {sent.text}
                {playingId === sent.id && (
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: -10,
                      right: -10,
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: "white",
                      color: "black",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      pointerEvents: "none",
                    }}
                  >
                    <FaVolumeUp size={12} />
                  </span>
                )}
                {isWrongMatch(sent.id) && (
                  <div
                    className="
      absolute -top-2 -right-2
      w-5 h-5
      bg-red-500 text-white
      rounded-full
      flex items-center justify-center
      text-xs font-bold
      border-2 border-white
      z-10
    "
                  >
                    ✕
                  </div>
                )}
                <div
                  className={`transition-all duration-200
          ${selectedSentence === sent.id ? "bg-red-600 scale-150" : ""}`}
                  style={{
                    height: "10px",
                    width: "10px",
                    backgroundColor: "red",
                    borderRadius: "50%",
                    position: "absolute",
                    top: "45px",
                    left: "47%",
                  }}
                />
              </div>
            );
          })}
        </div>
        {/* IMAGES (BOTTOM) */}
        <div className="grid grid-cols-4 gap-6 w-full justify-items-center mt-16">
          {images.map((img, index) => (
            <div
              key={img.id}
              ref={(el) => (imageRefs.current[index] = el)}
              className={`flex flex-col items-center rounded-lg cursor-pointer transition focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!
         `}
              {...endpointProps("image", img.id)}
              style={
                selectedImg === img.id
                  ? activeStyle
                  : imageLocked(img.id)
                    ? { boxShadow: "0 0 0 2px #16a34a" }
                    : undefined
              }
            >
              <div
                className={` ${
                  selectedImg === img.id ? "bg-red-600 scale-150" : ""
                }
    transition-all duration-200`}
                style={{
                  height: "10px",
                  width: "10px",
                  backgroundColor: "red",
                  borderRadius: "50%",
                }}
              />
              <img
                src={img.img}
                alt={img.alt}
                onLoad={() => setGeometryVersion((v) => v + 1)}
                className={`${
                  selectedImg === img.id ? "scale-105 rounded-lg" : ""
                }
    transition-all duration-200`}
                style={{
                  height: "150px",
                  width: "auto",
                  // objectFit: "cover",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <svg
        className="lines-layer"
        aria-hidden="true"
        style={{ pointerEvents: "none" }}
      >
        {previewPath && (
          <path
            d={previewPath.d}
            stroke="#2563eb"
            strokeWidth="2.5"
            strokeDasharray="6 4"
            fill="none"
          />
        )}
        {Object.entries(matches).map(([imgId, sentId], i) => {
          const imgEl = imageRefs.current[imgId];
          const sentEl = sentenceRefs.current[sentId];

          if (!imgEl || !sentEl || !containerRef.current) return null;

          const imgRect = imgEl.getBoundingClientRect();
          const sentRect = sentEl.getBoundingClientRect();
          const containerRect = containerRef.current.getBoundingClientRect();

          const x1 = sentRect.left + sentRect.width / 2 - containerRect.left;
          const y1 = sentRect.bottom - containerRect.top;

          const x2 = imgRect.left + imgRect.width / 2 - containerRect.left;
          const y2 = imgRect.top - containerRect.top;

          const curveOffset = 60;

          const pathData = `
  M ${x1} ${y1}
  C ${x1} ${y1 + curveOffset},
    ${x2} ${y2 - curveOffset},
    ${x2} ${y2}
`;
          return (
            <g key={i}>
              <path
                d={pathData}
                stroke={imageLocked(Number(imgId)) ? "#16a34a" : "#e53935"}
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              <circle
                cx={x2}
                cy={y2}
                r="4"
                fill={imageLocked(Number(imgId)) ? "#16a34a" : "#9e9e9e"}
              />
            </g>
          );
        })}
      </svg>

      <div className="action-buttons-container">
        <button className="try-again-button" onClick={(checkEvent) => { resetCompletedCheck(); (reset)(checkEvent); }}>
          Start Again ↻
        </button>

        <button onClick={showAnswers} className="show-answer-btn">
          Show Answer
        </button>

        <button className="check-button2" onClick={checkAnswers}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Review9_Page1_Q2;

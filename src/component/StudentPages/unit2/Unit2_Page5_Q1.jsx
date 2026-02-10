import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit2_Page5_Q1.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { TbMessageCircle } from "react-icons/tb";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import sound from "../../../assets/audio/ClassBook/U 2/CD10.Pg14_Instruction_Adult Lady.mp3";
// 🔹 الصور
import img1 from "../../../assets/imgs/test.png";
import img2 from "../../../assets/imgs/test.png";
import img3 from "../../../assets/imgs/test.png";
import img4 from "../../../assets/imgs/test.png";
import img5 from "../../../assets/imgs/test.png";
import img6 from "../../../assets/imgs/test.png";

/* ================= DATA ================= */

const leftParts = [
  { id: 1, text: "-x" },
  { id: 2, text: "-ch" },
  { id: 3, text: "q" },
  { id: 4, text: "-ck" },
  { id: 5, text: "-x" },
  { id: 6, text: "c" },
];

const images = [
  { id: "img1", src: img1 },
  { id: "img2", src: img2 },
  { id: "img3", src: img3 },
  { id: "img4", src: img4 },
  { id: "img5", src: img5 },
  { id: "img6", src: img6 },
];

const rightParts = [
  { id: "r1", text: "fo-" },
  { id: "r2", text: "so_ _" },
  { id: "r3", text: "bo_" },
  { id: "r4", text: "_ueen" },
  { id: "r5", text: "_ow" },
  { id: "r6", text: "lo_ _" },
];

const correctMatches = [
  { leftId: 1, right: "bo_", image: "img4" },
  { leftId: 2, right: "lo_ _", image: "img1" },
  { leftId: 3, right: "_ueen", image: "img5" },
  { leftId: 4, right: "so_ _", image: "img3" },
  { leftId: 5, right: "fo_", image: "img6" },
  { leftId: 6, right: "_ow", image: "img2" },
];
/* ================= COMPONENT ================= */

const Unit2_Page5_Q1 = () => {
  const containerRef = useRef(null);
    const clickAudioRef = useRef(null);
 const audioRef = useRef(null);
  const [lines, setLines] = useState([]);
  const [firstPoint, setFirstPoint] = useState(null);
  const [wrongLeft, setWrongLeft] = useState([]);
  const [written, setWritten] = useState({});
  const [locked, setLocked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [wrongInputs, setWrongInputs] = useState([]);

    const stopAtSecond = 9;
  const [paused, setPaused] = useState(false);
  // إعدادات الصوت
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1);
  const settingsRef = useRef(null);
  const [forceRender, setForceRender] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showCaption, setShowCaption] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  /* ================= HELPERS ================= */

  const getCenter = (el) => {
    const rect = containerRef.current.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return {
      x: r.left - rect.left + r.width / 2,
      y: r.top - rect.top + r.height / 2,
    };
  };
  const getDotCenterFromParent = (parent, dotSelector) => {
    const dot = parent.querySelector(dotSelector);
    if (!dot) return null;
    return getCenter(dot);
  };

  /* ================= CLICK HANDLERS ================= */
  const handleStart = (e) => {
    if (locked) return;

    const data = e.currentTarget.dataset;

    let type = null;
    if (data.leftId) type = "left";
    else if (data.image) type = "image";
    else if (data.right) type = "right";

    let pos = null;

    if (type === "left") {
      pos = getDotCenterFromParent(e.currentTarget, ".start-dot");
    } else if (type === "image") {
      pos = getDotCenterFromParent(e.currentTarget, ".start-dot");
    } else {
      return;
    }

    if (!pos) return;

    setFirstPoint({
      type,
      leftId: data.leftId ? Number(data.leftId) : null,
      image: data.image || null,
      x: pos.x,
      y: pos.y,
    });
  };

  const handleEnd = (e) => {
    if (!firstPoint || locked) return;

    const data = e.currentTarget.dataset;

    let endType = null;
    if (data.leftId) endType = "left";
    else if (data.image) endType = "image";
    else if (data.right) endType = "right";

    if (firstPoint.type === "left" && endType !== "image") {
      setFirstPoint(null);
      return;
    }

    if (firstPoint.type === "image" && endType !== "right") {
      setFirstPoint(null);
      return;
    }

    let pos = null;
    if (endType === "image" || endType === "right") {
      pos = getDotCenterFromParent(e.currentTarget, ".end-dot");
    }

    if (!pos) return;

    const newLine = {
      x1: firstPoint.x,
      y1: firstPoint.y,
      x2: pos.x,
      y2: pos.y,
      leftId: firstPoint.leftId,
      image: firstPoint.image || data.image,
      right: data.right || null,
    };

    setLines((prev) => [...prev, newLine]);

    if (firstPoint.type === "left" && endType === "image") {
      const startFromImagePos = getDotCenterFromParent(
        e.currentTarget,
        ".start-dot",
      );

      setFirstPoint({
        type: "image",
        image: data.image,
        x: startFromImagePos?.x ?? pos.x,
        y: startFromImagePos?.y ?? pos.y,
      });
    } else {
      setFirstPoint(null);
    }
  };

  /* ================= CHECK ================= */

  const checkAnswers = () => {
    if (checked || locked) return;

    if (lines.length < correctMatches.length * 2) {
      ValidationAlert.info(
        "Pay attention!",
        "Please connect all the pairs before checking.",
      );
      return;
    }

    let score = 0;
    let wrong = [];
    let wrongInputsArr = [];

    setWrongInputs(wrongInputsArr);

    correctMatches.forEach((c) => {
      const leftToImg = lines.some(
        (l) => l.leftId === c.leftId && l.image === c.image,
      );

      const imgToRight = lines.some(
        (l) => l.image === c.image && l.right === c.right,
      );

      if (leftToImg && imgToRight) {
        score++;
      } else {
        wrong.push(c.leftId);
      }
    });

    setWrongLeft(wrong);
    setChecked(true);
    setLocked(true);

    const total = correctMatches.length;
    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    ValidationAlert[
      score === total ? "success" : score === 0 ? "error" : "warning"
    ](
      `<div style="font-size:20px;text-align:center;color:${color}">
        <b>Score: ${score} / ${total}</b>
      </div>`,
    );
  };

  /* ================= SHOW ANSWER ================= */

  const showAnswer = () => {
    requestAnimationFrame(() => {
      const finalLines = [];

      correctMatches.forEach((c) => {
        const leftEl = document.querySelector(`[data-left-id="${c.leftId}"]`);
        const imgEl = document.querySelector(`[data-image="${c.image}"]`);
        const rightEl = document.querySelector(`[data-right="${c.right}"]`);

        if (!leftEl || !imgEl || !rightEl) return;

        const leftDot = leftEl.querySelector(".start-dot");
        const imgEndDot = imgEl.querySelector(".end-dot");
        const imgStartDot = imgEl.querySelector(".start-dot");
        const rightDot = rightEl.querySelector(".end-dot");

        if (leftDot && imgEndDot) {
          const p1 = getCenter(leftDot);
          const p2 = getCenter(imgEndDot);
          finalLines.push({
            x1: p1.x,
            y1: p1.y,
            x2: p2.x,
            y2: p2.y,
          });
        }

        if (imgStartDot && rightDot) {
          const p1 = getCenter(imgStartDot);
          const p2 = getCenter(rightDot);
          finalLines.push({
            x1: p1.x,
            y1: p1.y,
            x2: p2.x,
            y2: p2.y,
          });
        }
      });

      setLines(finalLines);
      setLocked(true);
      setChecked(true);
    });
  };

  /* ================= RESET ================= */

  const reset = () => {
    setLines([]);
    setWritten({});
    setWrongLeft([]);
    setLocked(false);
    setChecked(false);
    setFirstPoint(null);
  };

  /* ================= RENDER ================= */

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0,
      end: 4.23,
      text: "Page 8. Right Activities. Exercise A, number 1. ",
    },
    {
      start: 4.25,
      end: 8.28,
      text: "Listen and write the missing letters. Number the pictures.  ",
    },
    { start: 8.3, end: 11.05, text: "1-tiger." },
    { start: 11.07, end: 13.12, text: "2-taxi." },
    { start: 13.14, end: 15.14, text: "3-duck." },
    { start: 15.16, end: 17.13, text: "4-deer." },
  ];

  // ================================
  // ✔ Update caption highlight
  // ================================
  const updateCaption = (time) => {
    const index = captions.findIndex(
      (cap) => time >= cap.start && time <= cap.end,
    );
    setActiveIndex(index);
  };
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    audio.play();

    const interval = setInterval(() => {
      if (audio.currentTime >= stopAtSecond) {
        audio.pause();
        setPaused(true);
        setIsPlaying(false);
        setShowContinue(true);
        clearInterval(interval);
      }
    }, 100);

    // عند انتهاء الأوديو يرجع يبطل أنيميشن + يظهر Continue
    const handleEnded = () => {
      const audio = audioRef.current;
      audio.currentTime = 0; // ← يرجع للبداية
      setIsPlaying(false);
      setPaused(false);
      setActiveIndex(null);
      setShowContinue(true);
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      clearInterval(interval);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      setForceRender((prev) => prev + 1);
    }, 1000); // كل ثانية
    if (activeIndex === -1 || activeIndex === null) return;

    const el = document.getElementById(`caption-${activeIndex}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return () => clearInterval(timer);
  }, [activeIndex]);

  const playSound = (src) => {
    if (!clickAudioRef.current) return;
    clickAudioRef.current.src = src;
    clickAudioRef.current.currentTime = 0;
    clickAudioRef.current.play();
  };

  const togglePlay = () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      audio.play();
      setPaused(false);
      setIsPlaying(true);
    } else {
      audio.pause();
      setPaused(true);
      setIsPlaying(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <div
        className="div-forall"
        style={{
          width: "60%",
          display: "flex",
          flexDirection: "column",
          // gap: "20px",
        }}
      >
        <h4 className="header-title-page8">
          <span className="ex-A">A</span> Listen, write, and match.
        </h4>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "30px 0px",
            width: "100%",
          }}
        >
          <div
            className="audio-popup-read"
            style={{
              width: "50%",
            }}
          >
            <div className="audio-inner player-ui">
              <audio
                ref={audioRef}
                src={sound}
                onTimeUpdate={(e) => {
                  const time = e.target.currentTime;
                  setCurrent(time);
                  updateCaption(time);
                }}
                onLoadedMetadata={(e) => setDuration(e.target.duration)}
              ></audio>
              {/* Play / Pause */}
              {/* الوقت - السلايدر - الوقت */}
              <div className="top-row">
                <span className="audio-time">
                  {new Date(current * 1000).toISOString().substring(14, 19)}
                </span>

                <input
                  type="range"
                  className="audio-slider"
                  min="0"
                  max={duration}
                  value={current}
                  onChange={(e) => {
                    audioRef.current.currentTime = e.target.value;
                    updateCaption(Number(e.target.value));
                  }}
                  style={{
                    background: `linear-gradient(to right, #430f68 ${
                      (current / duration) * 100
                    }%, #d9d9d9ff ${(current / duration) * 100}%)`,
                  }}
                />

                <span className="audio-time">
                  {new Date(duration * 1000).toISOString().substring(14, 19)}
                </span>
              </div>
              {/* الأزرار 3 أزرار بنفس السطر */}
              <div className="bottom-row">
                {/* فقاعة */}
                <div
                  className={`round-btn ${showCaption ? "active" : ""}`}
                  style={{ position: "relative" }}
                  onClick={() => setShowCaption(!showCaption)}
                >
                  <TbMessageCircle size={36} />
                  <div
                    className={`caption-inPopup ${showCaption ? "show" : ""}`}
                    style={{ top: "100%", left: "10%" }}
                  >
                    {captions.map((cap, i) => (
                      <p
                        key={i}
                        id={`caption-${i}`}
                        className={`caption-inPopup-line2 ${
                          activeIndex === i ? "active" : ""
                        }`}
                      >
                        {cap.text}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Play */}
                <button className="play-btn2" onClick={togglePlay}>
                  {isPlaying ? <FaPause size={26} /> : <FaPlay size={26} />}
                </button>

                {/* Settings */}
                <div className="settings-wrapper" ref={settingsRef}>
                  <button
                    className={`round-btn ${showSettings ? "active" : ""}`}
                    onClick={() => setShowSettings(!showSettings)}
                  >
                    <IoMdSettings size={36} />
                  </button>

                  {showSettings && (
                    <div className="settings-popup">
                      <label>Volume</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={(e) => {
                          setVolume(e.target.value);
                          audioRef.current.volume = e.target.value;
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>{" "}
            </div>
          </div>
        </div>
        <audio ref={clickAudioRef} style={{ display: "none" }} />

        <div className="matching-area" ref={containerRef}>
          {/* LEFT */}
          <div className="left-col-wb-unit6-p2-q2">
            {leftParts.map((l, i) => (
              <div
                key={i}
                className="item-wb-unit6-p2-q2 clickable"
                data-left-id={l.id}
                onClick={handleStart}
              >
                <span className="num-wb-unit6-p2-q2">{i + 1}</span>
                <span
                  className={`word-text-wb-unit6-p2-q2 ${
                    locked || checked ? "disabled-word" : ""
                  }`}
                >
                  {l.text}
                </span>
                <div className="dot-wb-unit6-p2-q2 start-dot" />
                {wrongLeft.includes(l.id) && checked && (
                  <span className="wrong-mark-wb-unit6-p2-q2">✕</span>
                )}
              </div>
            ))}
          </div>

          {/* IMAGES */}
          <div className="mid-col-wb-unit6-p2-q2">
            {images.map((img) => (
              <div
                key={img.id}
                className="item-wb-unit6-p2-q2 clickable"
                data-image={img.id}
                onClick={(e) => (firstPoint ? handleEnd(e) : handleStart(e))}
              >
                <div className="dot-wb-unit6-p2-q2 end-dot" />
                <img
                  src={img.src}
                  alt=""
                  className={`matched-img2 ${
                    locked || checked ? "disabled-hover" : ""
                  }`}
                />

                <div className="dot-wb-unit6-p2-q2 start-dot" />
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div className="right-col-wb-unit6-p2-q2">
            {rightParts.map((r) => (
              <div
                key={r.id}
                className="item-wb-unit6-p2-q2 clickable"
                data-right={r.text}
                onClick={handleEnd}
              >
                <div className="dot-wb-unit6-p2-q2 end-dot" />
                <span
                  className={`word-text-wb-unit6-p2-q2 ${
                    locked || checked ? "disabled-word" : ""
                  }`}
                >
                  {" "}
                  {r.text}
                </span>
              </div>
            ))}
          </div>

          {/* LINES */}
          <svg className="lines-layer">
            {lines.map((l, i) => (
              <line key={i} {...l} stroke="red" strokeWidth="3" />
            ))}
          </svg>
        </div>

        {/* WRITE SECTION */}
      </div>
      {/* BUTTONS */}
      <div className="action-buttons-container">
        <button onClick={reset} className="try-again-button">
          Start Again ↻
        </button>
        <button onClick={showAnswer} className="show-answer-btn">
          Show Answer
        </button>
        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit2_Page5_Q1;

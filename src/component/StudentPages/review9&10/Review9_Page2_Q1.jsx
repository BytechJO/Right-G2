import React, { useEffect, useRef, useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/test6.png";
import img2 from "../../../assets/imgs/test6.png";
import img3 from "../../../assets/imgs/test6.png";
import img4 from "../../../assets/imgs/test6.png";
import img5 from "../../../assets/imgs/test6.png";
import sound1 from "../../../assets/audio/ClassBook/U 6/Pg53_1.1_Adult Lady.mp3";
import { FaPause, FaPlay } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { TbMessageCircle } from "react-icons/tb";

const Review9_Page2_Q1 = () => {
  const audioRef = useRef(null);
  const [showContinue, setShowContinue] = useState(false);
  const [paused, setPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const stopAtSecond = 3.5;

  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1);
  const settingsRef = useRef(null);
  const [forceRender, setForceRender] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showCaption, setShowCaption] = useState(false);
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
  const questions = [
    { img: img1, answer: "long" },
    { img: img2, answer: "short" },
    { img: img3, answer: "long" },
    { img: img4, answer: "short" },
    { img: img5, answer: "short" },
  ];

  const [answers, setAnswers] = useState(Array(6).fill(""));
  const [locked, setLocked] = useState(false);

  const choose = (index, value) => {
    if (locked) return;

    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const resetAll = () => {
    setAnswers(Array(6).fill(""));
    setLocked(false);
  };

  const showAnswers = () => {
    setAnswers(questions.map((q) => q.answer));
    setLocked(true);
  };

  const checkAnswers = () => {
    if (locked) return;

    if (answers.includes("")) {
      ValidationAlert.info("Please complete all answers");
      return;
    }

    let score = 0;

    answers.forEach((a, i) => {
      if (a === questions[i].answer) score++;
    });

    const total = questions.length;

    const message = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:#2e7d32;font-weight:bold;">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) ValidationAlert.success(message);
    else if (score === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);

    setLocked(true);
  };

  return (
    <div className="flex flex-col items-center p-8">
      <div className="w-[90%]">
        <h5 className="header-title-page8 mb-10">
          <span style={{ marginRight: "20px" }}>D</span>
          Does it have a<span style={{ color: "#2e3192" }}> short a </span>or
          <span style={{ color: "#2e3192" }}> long a</span>? Listen, read, and
          circle.
        </h5>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "30px",
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
                src={sound1}
                onTimeUpdate={(e) => {
                  const time = e.target.currentTime;
                  setCurrent(time);
                  updateCaption(time);
                }}
                onLoadedMetadata={(e) => setDuration(e.target.duration)}
              ></audio>
              {/* Play / Pause */}
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
        {/* 🔥 GRID */}
        <div className="grid grid-cols-5 gap-6 text-center mt-5">
          {questions.map((q, index) => (
            <div key={index} className="flex flex-col items-center gap-3">
              {/* IMAGE + NUMBER */}
              <div className="relative">
                <img
                  src={q.img}
                  style={{
                    height: "100px",
                    objectFit: "cover",
                  }}
                />

                {/* رقم فوق */}
                <div className="absolute -top-3 -left-3 font-bold text-lg">
                  {index + 1}
                </div>
              </div>

              {/* OPTIONS */}
              <div className="bg-[#ead6cc] rounded-xl px-4 py-2 flex flex-col gap-1">
                {["short", "long"].map((type) => {
                  const selected = answers[index] === type;

                  return (
                    <div
                      key={type}
                      onClick={() => choose(index, type)}
                      className={`cursor-pointer px-2 py-1 rounded-full
                        ${
                          selected
                            ? "border-2 border-red-500"
                            : "border-2 border-transparent"
                        }`}
                    >
                      {type} a
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BUTTONS */}
      <div className="action-buttons-container mt-10">
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

export default Review9_Page2_Q1;

import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit5_Page5_Q1.css";
import sound1 from "../../../assets/audio/ClassBook/U 5/CD31.Pg44_Instruction1_Adult Lady.mp3";
import img1 from "../../../assets/imgs/test.png";
import img2 from "../../../assets/imgs/test.png";
import img3 from "../../../assets/imgs/test.png";
import img4 from "../../../assets/imgs/test.png";
import img5 from "../../../assets/imgs/test.png";
import img6 from "../../../assets/imgs/test.png";
import { TbMessageCircle } from "react-icons/tb";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
const Unit5_Page5_Q1 = () => {
  const [answers, setAnswers] = useState([null, null, null]);
  const audioRef = useRef(null);
  const [showResult, setShowResult] = useState(false);
  const [locked, setLocked] = useState(false); // ⭐ NEW — يمنع التعديل بعد Show Answer
  const stopAtSecond = 6.26;
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
  // ----------- الداتا الجديدة الخاصة بسؤال short a ---------------
  const items = [
    {
      id: 1,
      items: [
        { img: img1, word: "bee", isShortA: true },
        { img: img2, word: "pencel", isShortA: false },
      ],
    },
    {
      id: 2,
      items: [
        { img: img3, word: "bed", isShortA: false },
        { img: img4, word: "boy", isShortA: true },
      ],
    },
    {
      id: 3,
      items: [
        { img: img5, word: "tea", isShortA: true },
        { img: img6, word: "hen", isShortA: false },
      ],
    },
   
  ];
  // --------------------------------------------------------------

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0,
      end: 6.26,
      text: "Page 35, Exercise F. Which word has a short A? Listen and circle.",
    },
    {
      start: 6.28,
      end: 10.03,
      text: "1. Dates. Bag. ",
    },
    { start: 10.05, end: 12.19, text: "2. Lake. Hat." },
    { start: 12.21, end: 15.24, text: "3. Flag. Shape." },
    { start: 15.26, end: 19.09, text: "4. Cape. Fan." },
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

  const handleSelect = (index, value) => {
    if (locked) return; // ⭐ NEW — لا يسمح بالتعديل بعد Show Answer
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setShowResult(false);
    setAnswers(newAnswers);
  };

  const checkAnswers = () => {
    if (locked) return; // ⭐ NEW — لا يسمح بالتعديل بعد Show Answer
    if (answers.includes(null)) {
      ValidationAlert.info("Oops!", "Please answer all items first.");
      return;
    }

    const correctCount = answers.filter(
      (selected, i) => items[i].items[selected]?.isShortA,
    ).length;
    const total = items.length;
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size: 20px; text-align:center; margin-top: 8px;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);

    setLocked(true); // ⭐ NEW — إغلاق التعديل بعد check
  };

  const resetAnswers = () => {
    setAnswers(Array(items.length).fill(null));
    setShowResult(false);
    setLocked(false); // ⭐ NEW — فتح التعديل
  };

  // ⭐⭐⭐ NEW — Show Answer
  const showAnswer = () => {
    const correctSelections = items.map((item) =>
      item.items.findIndex((choice) => choice.isShortA),
    );

    setAnswers(correctSelections); // تحديد الإجابات الصحيحة
    setShowResult(true); // أظهر النتيجة
    setLocked(true); // اقفل التعديل
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
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <div
        className="div-forall"
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          width: "60%",
        }}
      >
        <div>
          <h5 className="header-title-page8">
          <span className="ex-A">A</span>{" "}
          <span style={{ color: "#2e3192" }}>1</span>  Which picture has   <span style={{ color: "#2e3192" }}>long e</span>? Listen and circle.
          </h5>
        </div>
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
        <div
          className="imgFeild"
          style={{
            display: "flex",
            gap: "13px",
            flexDirection: "column",
          }}
        >
          <div className="CB-unit5-p5-q1-container">
  {items.map((item, index) => (
    <div className="CB-unit5-p5-q1-options">
      <span  style={{
            fontWeight:"700"
          }}>{index +1 }</span>
      {item.items.map((choice, chIndex) => (
        <div
          key={chIndex}
            className={`CB-unit5-p5-q1-word
              ${answers[index] === chIndex ? "selected" : ""}
              ${showResult && choice.isShortA ? "correct" : ""}
              ${showResult && answers[index] === chIndex && !choice.isShortA ? "wrong" : ""}`}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          onClick={() => handleSelect(index, chIndex)}
        > 
          <img src={choice.img} className={`CB-unit5-p5-q1-img`}
           />{locked &&
            answers[index] === chIndex &&
            !choice.isShortA ? (
              <span className="CB-unit5-p5-q1-wrong-x">✕</span>
            ) : null}
          {/* <p
            className={`CB-unit5-p5-q1-word
              ${answers[index] === chIndex ? "selected" : ""}
              ${showResult && choice.isShortA ? "correct" : ""}
              ${showResult && answers[index] === chIndex && !choice.isShortA ? "wrong" : ""}`}
            onClick={() => handleSelect(index, chIndex)}
          >
            {choice.word}{" "}
            {locked &&
            answers[index] === chIndex &&
            !choice.isShortA ? (
              <span className="CB-unit5-p5-q1-wrong-x">✕</span>
            ) : null}
          </p> */}
        </div>
      ))}
    </div>
  ))}
</div>

        </div>
      </div>
      <div className="action-buttons-container">
        <button onClick={resetAnswers} className="try-again-button">
          Start Again ↻
        </button>
        {/* ⭐⭐⭐ NEW: زر Show Answer */}
        <button onClick={showAnswer} className="show-answer-btn swal-continue">
          Show Answer
        </button>

        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit5_Page5_Q1;

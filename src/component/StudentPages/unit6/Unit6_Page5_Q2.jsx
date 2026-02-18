import React, { useState, useEffect, useRef } from "react";
import "./Unit4_Page5_Q2.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/test.png";
import img2 from "../../../assets/imgs/test.png";
import img3 from "../../../assets/imgs/test.png";
import img4 from "../../../assets/imgs/test.png";
import img5 from "../../../assets/imgs/test.png";
import sound1 from "../../../assets/audio/ClassBook/U 4/CD24.Pg32_Instruction1_Adult Lady.mp3";
import { TbMessageCircle } from "react-icons/tb";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
const Unit4_Page5_Q2 = () => {
  // ===============================
  // 🔵 1) الأسئلة (كلها داخل نفس الكومبونينت)
  // ===============================
  const questions = [
    {
      id: 1,
      parts: [
        { type: "text", value: "sn" },
        { type: "blank", options: ["aik", "ake"] },
        { type: "text", value: "." },
      ],
      correct: ["ake"],
      image: img1,
    },

    {
      id: 2,
      parts: [
        { type: "text", value: "tr" },
        { type: "blank", options: ["ain", "ayn"] },

        { type: "text", value: "." },
      ],
      correct: ["ain"],
      image: img2,
    },
    {
      id: 3,
      parts: [
        { type: "text", value: "d" },
        { type: "blank", options: ["ay", "ae"] },

        { type: "text", value: "." },
      ],
      correct: ["ay"],
      image: img3,
    },
  ];

  // ===============================
  // 🔵 2) حفظ اختيارات الطالب
  // ===============================
  const [answers, setAnswers] = useState(
    questions.map((q) =>
      q.parts.map((p) => (p.type === "blank" ? null : null)),
    ),
  );
  const [showResult, setShowResult] = useState(false);
  const [locked, setLocked] = useState(false);

  /* ================ audio logic =========================*/

  const audioRef = useRef(null);
  const [showContinue, setShowContinue] = useState(false);
  const [paused, setPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const stopAtSecond = 3.5;
  // إعدادات الصوت
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

  // ===============================
  // 🔵 3) الضغط على خيار
  // ===============================
  const handleSelect = (qIndex, blankIndex, option) => {
    if (locked || showResult) return; // ❌ لا يسمح بالتعديل بعد Show Answer
    const updated = [...answers];
    updated[qIndex][blankIndex] = option;
    setAnswers(updated);
    setShowResult(false);
  };

  // ===============================
  // 🔵 4) فحص الإجابات
  // ===============================
  const checkAnswers = () => {
    if (locked || showResult) return; // ❌ لا يسمح بالتعديل بعد Show Answer
    // تحقق إذا الطالب ما اختار ولا شيء
    const selectedCount = answers.flat().filter((a) => a !== null).length;
    if (selectedCount === 0) {
      ValidationAlert.info("");
      return;
    }

    let correct = 0;
    let total = 0;

    questions.forEach((q, qIndex) => {
      q.correct.forEach((correctAns, blankIndex) => {
        total++;
        if (answers[qIndex][blankIndex] === correctAns) {
          correct++;
        }
      });
    });

    const color =
      correct === total ? "green" : correct === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${correct} / ${total}
      </span>
    </div>
  `;

    if (correct === total) ValidationAlert.success(scoreMessage);
    else if (correct === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);

    setShowResult(true);
  };
  const showAnswers = () => {
    // اجابة كل سؤال = correct array
    const correctFilled = questions.map((q) => [...q.correct]);

    setAnswers(correctFilled);
    setShowResult(true);
    setLocked(true); // 🔒 قفل الإجابات
  };

  // ===============================
  // 🔵 JSX
  // ===============================
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
          gap: "30px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <h3 className="header-title-page8">
          <span style={{ color: "#2e3192" }}>2</span>Listen and circle.
        </h3>

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
        <div className="content-container-CB-unit3-p6-q1">
          {questions.map((q, qIndex) => (
            <div className="question-row-CB-unit3-p6-q1" key={q.id}>
              <div className="sentence-CB-unit4-p5-q2">
                <div
                  style={{
                    display: "flex",
                    // width: "100%",
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    className="header-title-page8"
                    style={{
                      color: "#2c5287",
                      fontWeight: "700",
                      fontSize: "20px",
                    }}
                  >
                    {q.id}
                  </span>

                  <img
                    src={q.image}
                    className="question-img-CB-unit3-p6-q1"
                    style={{ width: "150px", height: "150px" }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                     alignItems: "center",
                    gap: "50px",
                  }}
                >
                  {q.parts.map((part, pIndex) => {
                    if (part.type === "text") {
                      return (
                        <span
                          key={pIndex}
                          className="sentence-text-CB-unit3-p6-q1"
                        >
                          {part.value}
                        </span>
                      );
                    }

                    if (part.type === "blank") {
                      const actualBlankIndex = q.parts
                        .filter((p) => p.type === "blank")
                        .indexOf(part);

                      return (
                        <span
                          key={pIndex}
                          className="blank-options-CB-unit4-p5-q2"
                        >
                          {part.options.map((opt, optIndex) => {
                            const isSelected =
                              answers[qIndex][actualBlankIndex] === opt;

                            const isWrongSelected =
                              showResult &&
                              isSelected &&
                              opt !== q.correct[actualBlankIndex];

                            return (
                              <div
                                key={optIndex}
                                className="option-wrapper-CB-unit3-p6-q1"
                              >
                                <span
                                  className={`option-word-CB-unit3-p6-q1 ${
                                    isSelected ? "selected" : ""
                                  }`}
                                  onClick={() =>
                                    handleSelect(qIndex, actualBlankIndex, opt)
                                  }
                                >
                                  {opt}
                                </span>

                                {isWrongSelected && !locked && (
                                  <div className="wrong-mark-CB-unit4-p5-q2">✕</div>
                                )}
                              </div>
                            );
                          })}
                        </span>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="action-buttons-container">
        <button
          className="try-again-button"
          onClick={() => {
            setAnswers(
              questions.map((q) =>
                q.parts.map((p) => (p.type === "blank" ? null : null)),
              ),
            );
            setShowResult(false);
            setLocked(false);
          }}
        >
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

export default Unit4_Page5_Q2;

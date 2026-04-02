import React, { useState, useEffect, useRef } from "react";

// استيراد الصور ومكونات الأزرار والتنبيهات
import placeholderImg from "../../../assets/imgs/test6.png";
import Button from "../button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img from "../../../assets/imgs/test6.png";
import { TbMessageCircle } from "react-icons/tb";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import sound from "../../../assets/audio/WorkBook/p38q3.mp3";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 38/Ex B 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 38/Ex B 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 38/Ex B 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 38/Ex B 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 38/Ex B 5.svg";

const exerciseData = [
  { id: "b1", src: img1, correctAnswer: "✘" },
  { id: "b2", src: img2, correctAnswer: "✘" },
  { id: "b3", src: img3, correctAnswer: "✓" },
  { id: "b4", src: img4, correctAnswer: "✓" },
  { id: "b5", src: img5, correctAnswer: "✘" },
];

const WB_Unit6_Page38_Q2 = () => {
  const [selections, setSelections] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleBoxClick = (qId) => {
    if (showResults) return;

    setSelections((prev) => {
      const current = prev[qId];

      if (current === "✓") return { ...prev, [qId]: "✘" };
      if (current === "✘") return { ...prev, [qId]: undefined };
      return { ...prev, [qId]: "✓" };
    });
  };

  const getBoxClass = (qId) => {
    const isSelected = !!selections[qId];

    if (showResults) {
      const isCorrect =
        selections[qId] ===
        exerciseData.find((q) => q.id === qId).correctAnswer;

      return isCorrect
        ? "border-green-500 bg-green-50"
        : "border-red-500 bg-red-50";
    }

    if (isSelected) return "border-blue-500";
    return "border-gray-400";
  };

  const isWrongAnswer = (qId) => {
    if (!showResults) return false;
    if (!selections[qId]) return false;

    const question = exerciseData.find((q) => q.id === qId);
    return selections[qId] !== question.correctAnswer;
  };

  const handleShowAnswer = () => {
    const correctSels = {};
    exerciseData.forEach((q) => {
      correctSels[q.id] = q.correctAnswer;
    });
    setSelections(correctSels);
    setShowResults(true);
  };

  const handleStartAgain = () => {
    setSelections({});
    setShowResults(false);
  };

  const checkAnswers = () => {
    const unanswered = exerciseData.filter((q) => !selections[q.id]);

    if (unanswered.length > 0) {
      ValidationAlert.warning("Please answer all items before checking.");
      return;
    }

    setShowResults(true);

    let score = 0;
    exerciseData.forEach((q) => {
      if (selections[q.id] === q.correctAnswer) score++;
    });

    if (score === exerciseData.length) {
      ValidationAlert.success(`Score: ${score} / ${exerciseData.length}`);
    } else if (score === 0) {
      ValidationAlert.error(`Score: ${score} / ${exerciseData.length}`);
    } else {
      ValidationAlert.warning(`Score: ${score} / ${exerciseData.length}`);
    }
  };

  const clickAudioRef = useRef(null);
  const audioRef = useRef(null);
  const stopAtSecond = 10;
  const [paused, setPaused] = useState(false);

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

  const captions = [
    { start: 0.52, end: 3.24, text: "Page 38, phonics exercise C." },

    {
      start: 4.54,
      end: 9.32,
      text: "Does it have a long I? Listen and write check or X.",
    },

    { start: 10.46, end: 12.06, text: "1.bike." },

    { start: 13.22, end: 14.98, text: "2.write." },

    { start: 16.06, end: 18.12, text: "3.nine." },

    { start: 19.14, end: 21.1, text: "4.neat." },
    { start: 21.15, end: 23.46, text: "5.pipe." },
  ];

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

    const handleEnded = () => {
      const audio = audioRef.current;
      audio.currentTime = 0;
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
    }, 1000);

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

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "20px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">C</span>Does it have long i? Listen and
          write <span className="text-blue-900">✓</span> or{" "}
          <span className="text-blue-900">✕</span>.
        </h1>
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
                      duration ? (current / duration) * 100 : 0
                    }%, #d9d9d9ff ${
                      duration ? (current / duration) * 100 : 0
                    }%)`,
                  }}
                />

                <span className="audio-time">
                  {new Date(duration * 1000).toISOString().substring(14, 19)}
                </span>
              </div>

              <div className="bottom-row">
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

                <button className="play-btn2" onClick={togglePlay}>
                  {isPlaying ? <FaPause size={26} /> : <FaPlay size={26} />}
                </button>

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
                          const newVolume = Number(e.target.value);
                          setVolume(newVolume);
                          if (audioRef.current) {
                            audioRef.current.volume = newVolume;
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <audio ref={clickAudioRef} style={{ display: "none" }} />

        <div className="flex flex-wrap gap-6 items-center ml-10">
          {exerciseData.map((item, index) => (
            <div key={item.id} className="flex flex-col items-center gap-2">
              <span className="font-bold text-blue-600">{index + 1}</span>
              <img src={item.src} className="max-w-45 max-h-45" />

              <div className="relative">
                <div
                  onClick={() => handleBoxClick(item.id)}
                  className={`w-8 h-8 border-2 rounded-md flex items-center justify-center cursor-pointer transition-all`}
                >
                  <span
                    className={`text-2xl font-bold ${
                      selections[item.id] === "✓"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selections[item.id]}
                  </span>
                </div>

                {isWrongAnswer(item.id) && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-md z-10 border-2 border-white">
                    <span className="text-white text-xs font-bold leading-none">
                      ✕
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleStartAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};

export default WB_Unit6_Page38_Q2;

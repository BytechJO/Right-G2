import React, { useState, useEffect, useRef } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import { TbMessageCircle } from "react-icons/tb";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import sound from "../../../assets/audio/WorkBook/p44q1.mp3";
import boatImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 44/Ex A 1.svg";
import snowImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 44/Ex A 2.svg";
import examImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 44/Ex A 3.svg";
import bowImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 44/Ex A 4.svg";

const exerciseAData = [
  { id: 1, image: boatImg, options: ["o-e", "oa", "ow"], correct: "oa" },
  { id: 2, image: snowImg, options: ["o-e", "oa", "ow"], correct: "ow" },
  { id: 3, image: examImg, options: ["ow", "oa", "o-e"], correct: "o-e" },
  { id: 4, image: bowImg, options: ["ow", "oa", "o-e"], correct: "ow" },
];

const WB_Unit7_Page44_Q1 = () => {
  const [answersA, setAnswersA] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });
  const [checked, setChecked] = useState(false);
  const [locked, setLocked] = useState(false);

  const handleSelectA = (id, option) => {
    if (locked) return;
    setAnswersA((prev) => ({ ...prev, [id]: option }));
  };

  const checkAnswers = () => {
    let correctA = 0;
    exerciseAData.forEach((item) => {
      if (answersA[item.id] === item.correct) correctA++;
    });

    setChecked(true);
    setLocked(true);

    if (correctA === exerciseAData.length) {
      ValidationAlert.success(
        `Excellent! Score: ${correctA}/${exerciseAData.length}`,
      );
    } else {
      ValidationAlert.error(
        `Keep trying! Score: ${correctA}/${exerciseAData.length}`,
      );
    }
  };

  const handleShowAnswer = () => {
    const correctA = {};
    exerciseAData.forEach((item) => (correctA[item.id] = item.correct));
    setAnswersA(correctA);
    setChecked(true);
    setLocked(true);
  };

  const handleTryAgain = () => {
    setAnswersA({ 1: null, 2: null, 3: null, 4: null });
    setChecked(false);
    setLocked(false);
  };

  const clickAudioRef = useRef(null);
  const audioRef = useRef(null);
  const stopAtSecond = 6.15;
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
    {
      start: 0,
      end: 3.48,
      text: "Page 44, phonics exercise A.",
    },
    {
      start: 3.5,
      end: 6.14,
      text: "Listen and write check.",
    },
    { start: 6.3, end: 7.12, text: "Boat." },
    { start: 7.5, end: 8.89, text: "snow." },
    { start: 10.16, end: 10.56, text: "note." },
    { start: 11.76, end: 12.24, text: "bow." },
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
      <div className="div-forall">
        <h2 className="WB-header-title-page8">
          <span className="WB-ex-A">A</span>
          Listen and write <span className="text-blue-900">✓</span>.
        </h2>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {exerciseAData.map((item) => (
            <div key={item.id} className="flex items-center gap-10 p-6">
              <div className="w-[120px] h-[100px] flex items-center justify-center">
                <img
                  src={item.image}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="flex flex-col gap-3">
                {item.options.map((opt) => {
                  const isSelected = answersA[item.id] === opt;
                  const isWrong = checked && isSelected && opt !== item.correct;

                  return (
                    <div key={opt} className="flex items-center gap-4">
                      <span className="w-10 text-right font-bold text-lg text-gray-700">
                        {opt}
                      </span>

                      <div className="relative">
                        <div
                          onClick={() => handleSelectA(item.id, opt)}
                          className={`w-10 h-10 border-2 border-gray-400 rounded-lg flex items-center justify-center cursor-pointer transition-all
                            ${
                              isSelected
                                ? "bg-blue-50 border-blue-500"
                                : "hover:bg-gray-50"
                            }
                          `}
                        >
                          {isSelected && (
                            <span className="text-2xl font-bold text-blue-600">
                              ✓
                            </span>
                          )}
                        </div>

                        {/* ❌ Wrong Icon */}
                        {isWrong && (
                          <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow border-2 border-white">
                            ✕
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleTryAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};

export default WB_Unit7_Page44_Q1;

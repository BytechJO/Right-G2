import React, { useState, useRef, useEffect } from "react";
import { Volume2 } from "lucide-react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../button";
import { TbMessageCircle } from "react-icons/tb";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import sound from "../../../assets/audio/WorkBook/titel G2/Unit 2.mp3";
import clockImg from "../../../assets/imgs/test6.png";
import brickImg from "../../../assets/imgs/test6.png";
import candyImg from "../../../assets/imgs/test6.png";
import sockImg from "../../../assets/imgs/test6.png";
import lockImg from "../../../assets/imgs/test6.png";
import foxImg from "../../../assets/imgs/test6.png";
import mugImg from "../../../assets/imgs/test6.png";
import featherImg from "../../../assets/imgs/test6.png";
import queenImg from "../../../assets/imgs/test6.png";

const listenQuestions = [
  {
    id: "q1",
    audioSrc: "/audio/clock.mp3",
    options: [
      { id: "opt1_1", img: clockImg, isCorrect: true },
      { id: "opt1_2", img: brickImg, isCorrect: false },
      { id: "opt1_3", img: candyImg, isCorrect: false },
    ],
  },
  {
    id: "q2",
    audioSrc: "/audio/fox.mp3",
    options: [
      { id: "opt2_1", img: sockImg, isCorrect: false },
      { id: "opt2_2", img: lockImg, isCorrect: false },
      { id: "opt2_3", img: foxImg, isCorrect: true },
    ],
  },
  {
    id: "q3",
    audioSrc: "/audio/queen.mp3",
    options: [
      { id: "opt3_1", img: mugImg, isCorrect: false },
      { id: "opt3_2", img: featherImg, isCorrect: false },
      { id: "opt3_3", img: queenImg, isCorrect: true },
    ],
  },
  {
    id: "q4",
    audioSrc: "/audio/queen.mp3",
    options: [
      { id: "opt4_1", img: mugImg, isCorrect: false },
      { id: "opt4_2", img: featherImg, isCorrect: false },
      { id: "opt4_3", img: queenImg, isCorrect: true },
    ],
  },
];

const WB_Unit2_Page14_Q1 = () => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showResults, setShowResults] = useState(false);
  const clickAudioRef = useRef(null);
  const audioRef = useRef(null);
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

  const handleSelectOption = (questionId, optionId) => {
    setSelectedOptions((prev) => ({ ...prev, [questionId]: optionId }));
    setShowResults(false);
  };

  const getCircleClass = (questionId, option) => {
    const isSelected = selectedOptions[questionId] === option.id;
    if (!isSelected) return "border-transparent";

    if (showResults) {
      return option.isCorrect ? "border-gray-500" : "border-gray-500";
    }

    return "border-blue-500";
  };

  const handleShowAnswer = () => {
    const correctAnswers = {};
    listenQuestions.forEach((q) => {
      const correctOption = q.options.find((opt) => opt.isCorrect);
      if (correctOption) correctAnswers[q.id] = correctOption.id;
    });
    setSelectedOptions(correctAnswers);
    setShowResults(true);
  };

  const handleStartAgain = () => {
    setSelectedOptions({});
    setShowResults(false);
  };

  const checkAnswers = () => {
    if (Object.keys(selectedOptions).length < listenQuestions.length) {
      ValidationAlert.info("Please answer all questions before checking.");
      return;
    }
    setShowResults(true);
    let correctCount = 0;
    listenQuestions.forEach((q) => {
      const selectedId = selectedOptions[q.id];
      const selectedOption = q.options.find((opt) => opt.id === selectedId);
      if (selectedOption?.isCorrect) correctCount++;
    });
    if (correctCount === listenQuestions.length) {
      ValidationAlert.success(
        `Score: ${correctCount}/${listenQuestions.length}`,
      );
    } else if (correctCount > 0) {
      ValidationAlert.warning(
        `Score: ${correctCount}/${listenQuestions.length}`,
      );
    } else {
      ValidationAlert.error(`Score: ${correctCount}/${listenQuestions.length}`);
    }
  };

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
    <div className="main-container-component">
      <div className="div-forall">
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">A</span>Listen, look, and circle.
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

        <div className="">
          {listenQuestions.map((question, index) => (
            <div key={question.id} className="flex items-center gap-4">
              <span className="font-bold text-blue-600 text-xl">
                {index + 1}
              </span>
              <div className="flex-1 grid grid-cols-3 gap-4">
                {question.options.map((option) => (
                    <div className="relative w-24">
                  <div
                    key={option.id}
                    onClick={() => handleSelectOption(question.id, option.id)}
                    className={`w-24 h-24 rounded-full border-4 cursor-pointer overflow-hidden transition-colors ${getCircleClass(question.id, option)}`}
                  >
                    <img
                      src={option.img}
                      alt="option"
                      className="w-full h-full object-cover"
                    />
                   
                  </div> {showResults &&
                      selectedOptions[question.id] === option.id &&
                      !option.isCorrect && (
                        <div className="absolute -top-2 right-2 bg-red-500 text-white w-7 h-7 flex items-center justify-center rounded-full text-base font-bold shadow-lg border-2 border-white">
                          ✕
                        </div>
                      )}
                  </div>
                ))}
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

export default WB_Unit2_Page14_Q1;

import React, { useState,useEffect,useRef } from "react";
import { Volume2 } from "lucide-react";
import { TbMessageCircle } from "react-icons/tb";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import sound from "../../../assets/audio/WorkBook/p26q1.mp3";
import Button from "../button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page26/Ex A 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page26/Ex A 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page26/Ex A 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page26/Ex A 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page26/Ex A 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page26/Ex A 6.svg";

const exerciseData = [
  {
    id: "a1",
    img: img1,
    word: "rain",
    options: ["ay", "ai"],
    correctAnswer: "ai",
    audioSrc: "/audio/rain.mp3",
  },
  {
    id: "a2",
    img: img2,
    word: "play",
    options: ["a-e", "ay"],
    correctAnswer: "ay",
    audioSrc: "/audio/play.mp3",
  },
  {
    id: "a3",
    img: img3,
    word: "cake",
    options: ["ay", "a-e"],
    correctAnswer: "a-e",
    audioSrc: "/audio/cake.mp3",
  },
  {
    id: "a4",
    img: img4,
    word: "paint",
    options: ["ai", "ay"],
    correctAnswer: "ai",
    audioSrc: "/audio/paint.mp3",
  },
  {
    id: "a5",
    img: img5,
    word: "May",
    options: ["ay", "a-e"],
    correctAnswer: "ay",
    audioSrc: "/audio/may.mp3",
  },
  {
    id: "a6",
    img: img6,
    word: "lake",
    options: ["a-e", "ai"],
    correctAnswer: "a-e",
    audioSrc: "/audio/lake.mp3",
  },
];

const WB_Unit4_Page26_Q1 = () => {
  const [selections, setSelections] = useState({});
  const [showResults, setShowResults] = useState(false);
  const clickAudioRef = useRef(null);
  const audioRef = useRef(null);
  const stopAtSecond = 8;
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

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0,
      end: 3.7,
      text: "Page 26, phonics, exercise A.  ",
    },
    {
      start: 4.28,
      end: 7.92,
      text: "Listen and circle the correct long A sound.  ",
    },
    { start: 9.06, end: 10.721, text: "1-rain." },
    { start: 10.72, end: 12.08, text: "2-play." },
    { start: 14.38, end: 15.68, text: "3-cake." },
    { start: 16.5, end: 18.49, text: "4-paint." },
    { start: 19.5, end: 21.8, text: "5-may." },
    { start: 22.5, end: 24.92, text: "6-lake." },
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
  const handleSelect = (qId, option) => {
    if (showResults) return;
    setSelections((prev) => ({ ...prev, [qId]: option }));
  };

  const getButtonClass = (qId, option) => {
    const isSelected = selections[qId] === option;

    if (isSelected) return "border-blue-500 bg-blue-100 text-blue-800";
    return "border-gray-300 bg-white hover:bg-gray-50";
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
  // ✅ تحقق أن كل الأسئلة فيها اختيار
  const hasEmpty = exerciseData.some(
    (q) => !selections[q.id]
  );

  if (hasEmpty) {
    ValidationAlert.info("Please choose an answer for all questions first.");
    return; // ⛔ وقف
  }

  // ✅ إذا كله مختار → كمل
  setShowResults(true);

  let score = 0;
  exerciseData.forEach((q) => {
    if (selections[q.id] === q.correctAnswer) score++;
  });

  if (score === exerciseData.length)
    ValidationAlert.success(`Score: ${score} / ${exerciseData.length}`);
  else if (score === 0)
    ValidationAlert.error(`Score: ${score} / ${exerciseData.length}`);
  else
    ValidationAlert.warning(`Score: ${score} / ${exerciseData.length}`);
};

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "20px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">A</span>Listen and circle the correct long a
          sound.
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-30">
          {exerciseData.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center text-center space-y-5 gap-5"
            >
              <div className="flex items-start gap-2">
                <span className="font-bold text-blue-600">{index + 1}</span>
                <img
                  src={item.img}
                  alt={item.word}
                  className="max-w-28 max-h-20 object-contain border rounded-lg p-1"
                />
              
              </div>
              <div className="flex flex-col justify-center gap-4">
                {item.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelect(item.id, opt)}
                    className={`w-16 h-10 flex items-center justify-center text-lg font-semibold rounded-full border-2 transition-all ${getButtonClass(item.id, opt)}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
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

export default WB_Unit4_Page26_Q1;

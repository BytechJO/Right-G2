import React, { useState, useRef, useEffect } from "react";
import backgroundImage from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page.png";
import page2_2 from "../../../assets/imgs/Voca.svg";
import num1 from "../../../assets/imgs/Num1.svg";
import num2 from "../../../assets/imgs/Num2.svg";
import num3 from "../../../assets/imgs/Num3.svg";
import num4 from "../../../assets/imgs/Num4.svg";
import num5 from "../../../assets/imgs/Num5.svg";
import num6 from "../../../assets/imgs/Num6.svg";
import num7 from "../../../assets/imgs/Num7.svg";
import num8 from "../../../assets/imgs/Num8.svg";
import num9 from "../../../assets/imgs/Num9.svg";
import { IoMdSettings } from "react-icons/io";
import { TbMessageCircle } from "react-icons/tb";
import { FaPlay, FaPause } from "react-icons/fa";
import "../../../index.css";
import soundFull from "../../../assets/audio/ClassBook/U 1/Pg4_Vocabulary_Adult Lady.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 1/sound1.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 1/sound2.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 1/sound3.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 1/sound4.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 1/sound5.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 1/sound6.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 1/sound7.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 1/sound8.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 1/sound9.mp3";

const Page4_vocabulary = () => {
  const mainAudioRef = useRef(null);

  const [clickedIndex, setClickedIndex] = useState(null);
  const [paused, setPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeIndex2, setActiveIndex2] = useState(null);
  const [showContinue, setShowContinue] = useState(false);

  const stopAtSecond = 3.85;

  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1);

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
      end: 3.85,
      text: "Page four, unit one vocabulary.",
    },
    { start: 4.02, end: 6.45, text: "1 father" },
    { start: 6.52, end: 9.18, text: "2 knock" },
    { start: 9.24, end: 12.05, text: "3 brother" },
    { start: 12.12, end: 15.0, text: "4 mother" },
    { start: 15.06, end: 16.9, text: "5 sister" },
    { start: 17.0, end: 20.0, text: "6 play" },
    { start: 20.78, end: 22.18, text: "7 cousin" },
    { start: 22.8, end: 25.6, text: "8 aunt" },
    { start: 26.7, end: 28.12, text: "9 uncle" },
  ];

  // ================================
  // ✔ Word timings
  // ================================
  const wordTimings = [
    { start: 4.02, end: 6.45, text: "1 father" },
    { start: 6.52, end: 9.18, text: "2 knock" },
    { start: 9.24, end: 12.05, text: "3 brother" },
    { start: 12.12, end: 15.0, text: "4 mother" },
    { start: 15.06, end: 16.9, text: "5 sister" },
    { start: 17.0, end: 20.0, text: "6 play" },
    { start: 20.78, end: 22.18, text: "7 cousin" },
    { start: 22.8, end: 25.6, text: "8 aunt" },
    { start: 26.7, end: 28.12, text: "9 uncle" },
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

  // ================================
  // ✔ Update Word highlight
  // ================================
  const updateWord = (time) => {
    const wordIndex = wordTimings.findIndex(
      (w) => time >= w.start && time <= w.end,
    );
    setActiveIndex2(wordIndex);
  };

  // ================================
  // ✔ INITIAL PLAY & STOP AT SECOND
  // ================================
  useEffect(() => {
    const audio = mainAudioRef.current;
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
      mainAudioRef.current.currentTime = 0;
      setIsPlaying(false);
      setPaused(true);
      setShowContinue(true);
      setActiveIndex(null);
      setActiveIndex2(null);
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      clearInterval(interval);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // ================================
  // ✔ Play/Pause toggle
  // ================================
  const togglePlay = () => {
    const audio = mainAudioRef.current;
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

  const wordAudios = [
    sound1,
    sound2,
    sound3,
    sound4,
    sound5,
    sound6,
    sound7,
    sound8,
    sound9,
  ];
  const playWordAudio = (index) => {
    // أوقفي الأوديو الرئيسي
    mainAudioRef.current.pause();

    // أوقفي أي كلمة شغالة
    wordRefs.current.forEach((ref) => {
      if (ref.current) {
        ref.current.pause();
        ref.current.currentTime = 0;
      }
    });

    const audio = wordRefs.current[index].current;
    if (!audio) return;

    // تشغيل الصوت من البداية
    audio.currentTime = 0;
    audio.play();

    // 🔥 فعل الأنيميشن على طول فترة التشغيل
    setClickedIndex(index);

    // 🔥 عند انتهاء الصوت -> أطفئ الأنيميشن
    audio.onended = () => {
      setClickedIndex(null);
    };
  };

  const wordRefs = useRef(wordAudios.map(() => React.createRef()));

  const nums = [num1, num2, num3, num4, num5, num6, num7, num8, num9];

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* ============================
           AUDIO PLAYER
      ============================= */}
      <div
        className="audio-popup-vocab-container"
        style={{
          width: "30%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          margin: "0px 20px",
          position: "relative",
          alignItems: "center",
        }}
      >
        <div className="audio-popup-vocab">
          <div className="audio-inner player-ui">
            <audio
              ref={mainAudioRef}
              src={soundFull}
              onTimeUpdate={(e) => {
                const t = e.target.currentTime;
                setCurrent(t);
                updateCaption(t);
                updateWord(t); // 🔥 أهم خطوة
              }}
              onLoadedMetadata={(e) => setDuration(e.target.duration)}
            ></audio>

            {/* Time + Slider */}
            <div className="top-row">
              <span className="audio-time">
                {new Date(current * 1000).toISOString().substring(14, 19)}
              </span>

              <input
                type="range"
                min="0"
                max={duration}
                value={current}
                className="audio-slider"
                onChange={(e) => {
                  mainAudioRef.current.currentTime = e.target.value;
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

            {/* Buttons */}
            <div className="bottom-row">
              <div
                className={`round-btn ${showCaption ? "active" : ""}`}
                onClick={() => setShowCaption(!showCaption)}
              >
                <TbMessageCircle size={36} />
              </div>

              <button className="play-btn2" onClick={togglePlay}>
                {isPlaying ? <FaPause size={26} /> : <FaPlay size={26} />}
              </button>

              <div>
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
                        mainAudioRef.current.volume = e.target.value;
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================
           IMAGE + WORDS
      ============================= */}
      <div
        style={{ position: "relative", marginTop: "5px", width: "fit-content" }}
      >
        <div className={`caption-inPopup ${showCaption ? "show" : ""}`}>
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
        {/* Image + Words */}
        <img
          src={page2_2}
          style={{
            height: "260px",
            position: "absolute",
            bottom: "0%",
            right: "0%",
            borderRadius: "5%",
          }}
        />

        <div className="vocab_container" style={{ bottom: "2%", right: "6%" }}>
          {[
            "father",
            "knock",
            "brother",
            "mother",
            "sister",
            "play",
            "cousin",
            "aunt",
            "uncle",
          ].map((text, i) => (
            <h6
              key={i}
              className={
                (activeIndex2 === i && current >= 2.8) || clickedIndex === i
                  ? "active"
                  : ""
              }
              onClick={() => playWordAudio(i)}
            >
              {i + 1} {text}
            </h6>
          ))}
        </div>

        {/* Numbers */}
        {nums.map((num, i) => (
          <img
            key={i}
            src={num}
            id={`num-${i + 1}-unit1`}
            className={`num-img ${
              (activeIndex2 === i && current >= 2.8) || clickedIndex === i
                ? "active"
                : ""
            }`}
            style={{
              height: "20px",
              position: "absolute",
            }}
          />
        ))}

        {/* Background */}
        <img src={backgroundImage} style={{ height: "75vh" }} />
      </div>
      {wordAudios.map((src, i) => (
        <audio key={i} ref={wordRefs.current[i]} src={src} />
      ))}
    </div>
  );
};

export default Page4_vocabulary;
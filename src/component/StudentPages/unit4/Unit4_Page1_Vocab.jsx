import React, { useState, useRef, useEffect } from "react";
import backgroundImage from "../../../assets/imgs/test.png";
import page2_2 from "../../../assets/imgs/test.png";
import vocabulary from "../../../assets/audio/ClassBook/U 4/Pg28_Vocab_Adult Lady.mp3";
import "./unit4_Page1.css";
import num1 from "../../../assets/imgs/test.png";
import num2 from "../../../assets/imgs/test.png";
import num3 from "../../../assets/imgs/test.png";
import num4 from "../../../assets/imgs/test.png";
import num5 from "../../../assets/imgs/test.png";
import num6 from "../../../assets/imgs/test.png";
import num7 from "../../../assets/imgs/test.png";
import num8 from "../../../assets/imgs/test.png";
import num9 from "../../../assets/imgs/test.png";
import num10 from "../../../assets/imgs/test.png";
import num11 from "../../../assets/imgs/test.png";
import num12 from "../../../assets/imgs/test.png";
// import sound1 from "../../../assets/img_unit4/sounds-unit4/U2-01.mp3";
// import sound2 from "../../../assets/img_unit4/sounds-unit4/U2-02.mp3";
// import sound3 from "../../../assets/img_unit4/sounds-unit4/U2-03.mp3";
// import sound4 from "../../../assets/img_unit4/sounds-unit4/U2-04.mp3";
// import sound5 from "../../../assets/img_unit4/sounds-unit4/U2-05.mp3";
// import sound6 from "../../../assets/img_unit4/sounds-unit4/U2-06.mp3";
// import sound7 from "../../../assets/img_unit4/sounds-unit4/U2-07.mp3";
// import sound8 from "../../../assets/img_unit4/sounds-unit4/U2-07.mp3";
// import sound9 from "../../../assets/img_unit4/sounds-unit4/U2-07.mp3";
// import sound10 from "../../../assets/img_unit4/sounds-unit4/U2-07.mp3";
// import sound11 from "../../../assets/img_unit4/sounds-unit4/U2-07.mp3";
// import sound12 from "../../../assets/img_unit4/sounds-unit4/U2-07.mp3";
import { TbMessageCircle } from "react-icons/tb";
import { IoMdSettings } from "react-icons/io";
import { FaPlay, FaPause } from "react-icons/fa";
const Unit4_Page1_Vocab = () => {
  const mainAudioRef = useRef(null);
  const clickAudioRef = useRef(null);

  const [paused, setPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeIndex2, setActiveIndex2] = useState(null);
  const [showContinue, setShowContinue] = useState(false);
  const stopAtSecond = 3.0;
  const [clickedIndex, setClickedIndex] = useState(null);
  // إعدادات الصوت
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1);
  const [activeSpeed, setActiveSpeed] = useState(1);
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
    { start: 0, end: 3.1, text: "Page 10, Unit 2, Vocabulary." },
    { start: 3.12, end: 5.15, text: " 1. Party Hat. " },
    { start: 5.17, end: 7.16, text: "2. Jello." },
    { start: 7.18, end: 9.27, text: "3. Cake. " },
    { start: 9.29, end: 12.2, text: "4. Happy Birthday." },
    { start: 12.22, end: 15.07, text: " 5. Balloons." },
    { start: 15.09, end: 17.13, text: " 6. Present. " },
    { start: 17.15, end: 19.26, text: "7.card" },
  ];
  // 🎵 فترات الكلمات داخل الأوديو الرئيسي
  const wordTimings = [
    { start: 3.2, end: 5.15 }, // party hat
    { start: 5.22, end: 7.2 }, // jellow
    { start: 7.23, end: 9.43 }, // cake
    { start: 9.43, end: 12.25 }, // Hello
    { start: 12.27, end: 15.05 }, // Good morning
    { start: 15.04, end: 17.13 },
    { start: 17.15, end: 19.26 },
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

    // عند انتهاء الأوديو يرجع يبطل أنيميشن + يظهر Continue
    const handleEnded = () => {
      audio.currentTime = 0;
      setActiveIndex(null);
      setActiveIndex2(null);
      setPaused(true);
      setShowContinue(true);
      setIsPlaying(false);
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

    return () => clearInterval(timer);
  }, []);

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
    sound10,
    sound11,
    sound12,
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

  const nums = [
    num1,
    num2,
    num3,
    num4,
    num5,
    num6,
    num7,
    num8,
    num9,
    num10,
    num11,
    num12,
  ];
  const wordRefs = useRef(wordAudios.map(() => React.createRef()));

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
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
              src={vocabulary}
              onTimeUpdate={(e) => {
                const time = e.target.currentTime;
                setCurrent(time);
                updateCaption(time);
                updateWord(time); // 🔥 أهم خطوة
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

      <div
        style={{
          position: "relative",
          marginTop: "5px",
          width: "fit-content",
        }}
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
        {/* كلمة + صورة صغيرة */}

        <img
          src={page2_2}
          style={{
            height: "210px",
            width: "auto",
            position: "absolute",
            bottom: "0%",
            right: "0%",
            borderRadius: "5%",
          }}
        />

        {/* النصوص */}
        <div
          className="vocab_container"
          style={{ bottom: "1.4%", right: "4.5%" }}
        >
          {[
            "nurse",
            "pilot",
            "grow food",
            "taxi driver",
            "vet",
            "clerk",
            "photographer",
            "fix cars",
            "police officer",
            "farmer",
            "mechanic",
            "chef",
          ].map((text, i) => (
            <h6
              key={i}
              className={
                (activeIndex2 === i && current >= 3.2) || clickedIndex === i
                  ? "active"
                  : ""
              }
              onClick={() => playWordAudio(i)}
            >
              {i + 1} {text}
            </h6>
          ))}
        </div>

        {/* الأرقام */}
        {nums.map((num, i) => (
          <img
            key={i}
            src={num}
            id={`num-${i + 1}`}
            className={`num-img ${
              (activeIndex2 === i && current >= 3.2) || clickedIndex === i
                ? "active"
                : ""
            }`}
            style={{
              height: "20px",
              width: "auto",
              position: "absolute",
            }}
          />
        ))}

        {/* الصورة الرئيسية */}
        <img
          src={backgroundImage}
          alt="interactive"
          style={{ height: "75vh" }}
        />
      </div>
      {wordAudios.map((src, i) => (
        <audio key={i} ref={wordRefs.current[i]} src={src} />
      ))}
    </div>
  );
};

export default Unit4_Page1_Vocab;

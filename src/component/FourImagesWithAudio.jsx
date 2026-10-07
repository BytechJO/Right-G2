import React, { useState, useEffect, useRef } from "react";
import "./FourImagesWithAudio.css";
import { IoMdSettings } from "react-icons/io";
import { FaPlay, FaPause, FaRedo } from "react-icons/fa";
import { TbMessageCircle } from "react-icons/tb";
import SquirrelGif from "../assets/Squirrel_1164_1433px.gif";

// أقل مكان محفوظ بيعتبر "تقدّم" (أقل من هيك بنبدأ من الأول)
const MIN_RESUME_SECONDS = 1;

const formatTime = (s) =>
  Number.isFinite(s) && s >= 0
    ? new Date(s * 1000).toISOString().substring(14, 19)
    : "00:00";

const FourImagesWithAudio = ({
  images,
  audioSrc,
  checkpoints,
  titleQ,
  audioArr = [],
  captions,
  pageId,
  subHeader,
  imageAlts = [],
}) => {
  const audioRef = useRef(null);
  const audioFinishedRef = useRef(false);
  const resumedFromStorageRef = useRef(false);
  const settingsRef = useRef(null);

  const [clickedIndex, setClickedIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const AUDIO_TIME_KEY = pageId ? `audio-position-${pageId}` : null;
  const stopAtSecond = checkpoints[1] - 0.2;

  // إعدادات الصوت
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);

  // ▶️ false لحد ما الصوت يشتغل فعلاً، وبعدها بتتحدّث من أحداث الـ audio
  const [isPlaying, setIsPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeIndex2, setActiveIndex2] = useState(null);
  const [showCaption, setShowCaption] = useState(false);

  // ================================
  // ✔ Update caption highlight
  // ================================
  const updateCaption = (time) => {
    const index = captions.findIndex(
      (cap) => time >= cap.start && time <= cap.end,
    );
    setActiveIndex2(index);
  };

  const stopImageSounds = (exceptIndex = -1) => {
    audioArr.forEach((sound, i) => {
      if (sound && i !== exceptIndex) {
        sound.pause();
        sound.currentTime = 0;
      }
    });
  };

  const playImageSound = (index) => {
    const sound = audioArr[index];
    const mainAudio = audioRef.current;

    if (!sound || !mainAudio) return;

    // وقف الصوت الرئيسي (حدث pause بيحدّث الأيقونة لحاله)
    mainAudio.pause();

    // وقف أصوات الصور الثانية
    stopImageSounds(index);

    sound.currentTime = 0;
    sound.onended = () => setClickedIndex(null);
    sound.play().catch(() => setClickedIndex(null));

    setClickedIndex(index);
  };

  const handleImageKeyDown = (e, index) => {
    if (e.key !== "Enter" && e.key !== " ") return;

    e.preventDefault();
    playImageSound(index);
  };

  /* =====================================================
     MAIN AUDIO: تشغيل تلقائي + حفظ/مسح المكان
  ===================================================== */

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audioFinishedRef.current = false;

    const savedTime = AUDIO_TIME_KEY
      ? Number(localStorage.getItem(AUDIO_TIME_KEY) || 0)
      : 0;

    // 🎵 الأيقونة بتتبع حالة الصوت الفعلية
    const handlePlay = () => {
      audioFinishedRef.current = false;
      setIsPlaying(true);

      // الصوت الرئيسي اشتغل: نوقف أصوات الصور عشان ما يتداخلوا
      stopImageSounds();
      setClickedIndex(null);
    };

    const handlePause = () => setIsPlaying(false);

    const handleEnded = () => {
      // ================================
      // الصوت خلص كامل:
      // امسح المكان المحفوظ، وأي فتحة جاية بتبدأ من الأول وبتشتغل لحالها
      // ================================
      audioFinishedRef.current = true;

      if (AUDIO_TIME_KEY) {
        localStorage.removeItem(AUDIO_TIME_KEY);
      }

      audio.currentTime = 0;

      setCurrent(0);
      setActiveIndex(null);
      setActiveIndex2(null);
      setIsPlaying(false);
    };

    const begin = () => {
      setDuration(audio.duration);

      // ================================
      // في مكان محفوظ (خرج بنص الصوت):
      // رجّعه لنفس المكان بدون تشغيل تلقائي
      // ================================
      if (
        savedTime >= MIN_RESUME_SECONDS &&
        savedTime < audio.duration - 0.5
      ) {
        resumedFromStorageRef.current = true;

        audio.currentTime = savedTime;

        setCurrent(savedTime);
        updateCaption(savedTime);

        return;
      }

      // ================================
      // أول مرة / ما في حفظ / الصوت كان خلص:
      // شغّله من الأول
      // ================================
      resumedFromStorageRef.current = false;

      audio.currentTime = 0;

      setCurrent(0);

      audio.play().catch((err) => {
        // المتصفح منع التشغيل التلقائي: الأيقونة بتضل Play
        console.log("Autoplay blocked:", err);
        setIsPlaying(false);
      });
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    // إذا الـ metadata حمّلت قبل ما نركّب الـ listener (كاش) نبدأ مباشرة
    if (audio.readyState >= 1) {
      begin();
    } else {
      audio.addEventListener("loadedmetadata", begin, { once: true });
    }

    // الوقفة التلقائية الموجودة عندك
    const interval = setInterval(() => {
      if (
        !resumedFromStorageRef.current &&
        !audio.paused &&
        audio.currentTime >= stopAtSecond &&
        audio.currentTime < stopAtSecond + 0.3
      ) {
        audio.pause();

        // احفظ مكان الوقوف
        if (AUDIO_TIME_KEY) {
          localStorage.setItem(AUDIO_TIME_KEY, String(audio.currentTime));
        }

        clearInterval(interval);
      }
    }, 100);

    return () => {
      clearInterval(interval);

      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadedmetadata", begin);

      // ================================
      // إذا تسكر الـ popup قبل انتهاء الصوت
      // احفظ المكان الحالي
      // ================================
      if (
        AUDIO_TIME_KEY &&
        !audioFinishedRef.current &&
        audio.currentTime >= MIN_RESUME_SECONDS &&
        audio.duration &&
        audio.currentTime < audio.duration
      ) {
        localStorage.setItem(AUDIO_TIME_KEY, String(audio.currentTime));
      }

      audio.pause();
      stopImageSounds();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioSrc, AUDIO_TIME_KEY]);

  /* =====================================================
     CONTROLS
  ===================================================== */

  const handleRestart = () => {
    const audio = audioRef.current;

    if (!audio) return;

    stopImageSounds();

    audio.pause();
    audio.currentTime = 0;

    resumedFromStorageRef.current = false;
    audioFinishedRef.current = false;

    if (AUDIO_TIME_KEY) {
      localStorage.removeItem(AUDIO_TIME_KEY);
    }

    setCurrent(0);
    setActiveIndex(null);
    setActiveIndex2(null);
    setClickedIndex(null);

    audio.play().catch(() => setIsPlaying(false));
  };

  const togglePlay = () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  };

  const progress = duration ? (current / duration) * 100 : 0;

  return (
    <div className="four-wrapper">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          width: "60%",
          alignItems: "flex-start",
          marginTop: "25px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          <img
            src={SquirrelGif}
            alt="An animated squirrel"
            style={{
              height: "100px",
              width: "auto",
              objectFit: "contain",
              flexShrink: 0,
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "8px",
            }}
          >
            <h5
              className="header-title-page8"
              style={{
                fontSize: "25px",
                display: "flex",
                gap: "5px",
                alignItems: "center",
                margin: 0,
              }}
            >
              {titleQ}
            </h5>

            <p className="sub-header">{subHeader}</p>
          </div>
        </div>
      </div>

      <div
        className="audio-popup-read-container"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          margin: "0px 20px",
          position: "relative",
          width: "33%",
        }}
      >
        <div className="audio-popup-read">
          <div className="audio-inner player-ui">
            <audio
              ref={audioRef}
              src={audioSrc}
              preload="auto"
              onTimeUpdate={(e) => {
                const time = e.target.currentTime;

                setCurrent(time);

                // نحفظ آخر نقطة وصلها الصوت (بعد أول ثانية بس)
                if (
                  AUDIO_TIME_KEY &&
                  !audioFinishedRef.current &&
                  time >= MIN_RESUME_SECONDS
                ) {
                  localStorage.setItem(AUDIO_TIME_KEY, String(time));
                }

                const idx = checkpoints.findIndex(
                  (cp) => time >= cp && time < cp + 0.8,
                );

                setActiveIndex(idx !== -1 ? idx : null);

                updateCaption(time);
              }}
              onLoadedMetadata={(e) => setDuration(e.target.duration)}
            ></audio>

            {/* الوقت - السلايدر - الوقت */}
            <div className="top-row">
              <span className="audio-time">{formatTime(current)}</span>

              <input
                type="range"
                className="audio-slider"
                aria-label="Audio progress"
                min="0"
                max={duration || 0}
                value={current}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  audioRef.current.currentTime = value;
                  setCurrent(value);
                  updateCaption(value);
                }}
                style={{
                  background: `linear-gradient(to right, #430f68 ${progress}%, #d9d9d9ff ${progress}%)`,
                }}
              />

              <span className="audio-time">{formatTime(duration)}</span>
            </div>

            <div className="bottom-row">
              {/* فقاعة */}
              <div className="caption-control" style={{ position: "relative" }}>
                <button
                  type="button"
                  className={`round-btn caption-toggle-btn ${
                    showCaption ? "active" : ""
                  }`}
                  onClick={() => setShowCaption(!showCaption)}
                  aria-label={showCaption ? "Hide captions" : "Show captions"}
                  aria-expanded={showCaption}
                  title={showCaption ? "Hide captions" : "Show captions"}
                  aria-controls={`caption-panel-${pageId}`}
                >
                  <TbMessageCircle size={36} aria-hidden="true" />
                </button>

                <div
                  id={`caption-panel-${pageId}`}
                  className={`caption-inPopup ${showCaption ? "show" : ""}`}
                  style={{ top: "100%", left: "10%" }}
                >
                  {captions.map((cap, i) => (
                    <p
                      key={i}
                      id={`caption-${i}`}
                      className={`caption-inPopup-line2 ${
                        activeIndex2 === i ? "active" : ""
                      }`}
                    >
                      {cap.text}
                    </p>
                  ))}
                </div>
              </div>

              {/* Play / Restart */}
              <div className="main-audio-controls">
                <button
                  type="button"
                  className="main-audio-btn"
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause audio" : "Play audio"}
                  title={isPlaying ? "Pause audio" : "Play audio"}
                >
                  {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
                </button>

                <button
                  type="button"
                  className="main-audio-btn"
                  onClick={handleRestart}
                  aria-label="Restart audio"
                  title="Restart"
                >
                  <FaRedo size={22} />
                </button>
              </div>

              {/* Settings */}
              <div className="settings-wrapper" ref={settingsRef}>
                <button
                  type="button"
                  className={`round-btn ${showSettings ? "active" : ""}`}
                  onClick={() => setShowSettings(!showSettings)}
                  title={
                    showSettings ? "Close audio settings" : "Audio settings"
                  }
                  aria-label="Audio settings"
                  aria-expanded={showSettings}
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
                        const value = Number(e.target.value);
                        setVolume(value);
                        audioRef.current.volume = value;
                      }}
                    />

                    <label style={{ marginRight: "10px", marginTop: "10px" }}>
                      Speed :
                    </label>
                    <select
                      value={playbackRate}
                      onChange={(e) => {
                        const rate = Number(e.target.value);
                        setPlaybackRate(rate);
                        audioRef.current.playbackRate = rate;
                      }}
                    >
                      <option value="0.5">0.5x</option>
                      <option value="0.75">0.75x</option>
                      <option value="1">1x</option>
                      <option value="1.25">1.25x</option>
                      <option value="1.5">1.5x</option>
                      <option value="2">2x</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="images-layout">
        {/* الصور الصغيرة */}
        <div className="small-images">
          {images.slice(1).map((src, i) => {
            const globalIndex = i + 1;
            const label = imageAlts[i] || `Image ${i + 1}`;

            return (
              <div
                key={i}
                className={`small-box2 ${
                  activeIndex === globalIndex || clickedIndex === globalIndex
                    ? "active"
                    : ""
                }`}
                role="button"
                tabIndex={0}
                aria-label={`${label}. Press Enter or Space to play its audio.`}
                aria-pressed={clickedIndex === globalIndex}
                onClick={() => playImageSound(globalIndex)}
                onKeyDown={(e) => handleImageKeyDown(e, globalIndex)}
              >
                <img
                  src={src}
                  className="small-img2"
                  alt={label}
                  aria-hidden="true"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FourImagesWithAudio;
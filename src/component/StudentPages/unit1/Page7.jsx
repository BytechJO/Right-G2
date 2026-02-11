import React, { useState, useRef, useEffect } from "react";
import page_7 from "../../../assets/imgs/pages/Right 2 Unit 1 Stellas Family_00001/Right 2 Unit 1 Stellas Family_00007.jpg";
import grammarSound from "../../../assets/audio/ClassBook/U 1/CD4.Pg7_Right Grammar2_Adult Lady.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 1/Pg7_2.1_Adult Lady.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 1/Pg7_2.2_Adult Lady.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 1/Pg7_2.3_Adult Lady.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 1/Pg7_2.4_Adult Lady.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 1/Pg7_2.5_Adult Lady.mp3";
import "./Page7.css"
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
// import video2 from "../../../assets/unit1/sounds/p7 1920.mp4";
import AudioWithCaption from "../../AudioWithCaption";
import pauseBtn from "../../../assets/Page 01/Right Video Button.svg";
const Page7 = ({ openPopup }) => {
  const audioRef = useRef(null);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

    console.log("X%:", xPercent.toFixed(2), "Y%:", yPercent.toFixed(2));

    checkAreaAndPlaySound(xPercent, yPercent);
  };
  const captionsExample = [
    { start: 0, end: 4.05, text: "Page 7, exercise 2. Right grammar. " },
    { start: 4.09, end: 4.45, text: "Good morning." },
    { start: 4.47, end: 6.16, text: "Good afternoon." },
    { start: 6.2, end: 7.27, text: "Good evening. " },
    { start: 7.3, end: 9.01, text: "Goodbye. " },
    { start: 9.05, end: 10.16, text: "Good morning, Mom. " },
    { start: 10.2, end: 12.05, text: "Good morning, Stella. " },
    { start: 12.09, end: 13.12, text: "Good afternoon. " },
    { start: 13.16, end: 15.01, text: "Good afternoon." },
    { start: 15.05, end: 16.13, text: "Good evening" },
    { start: 16.17, end: 17.24, text: "Good evening" },
    { start: 17.27, end: 19.04, text: "Goodbye, Stella." },
  ];

  const clickableAreas = [
    { x1: 6.33, y1: 9.4, x2: 28.43, y2: 13.3, sound: sound1 },
    { x1: 29.25, y1: 9.4, x2: 50.14, y2: 13.3, sound: sound2 },
    { x1: 51.0, y1: 9.4, x2: 72.0, y2: 13.3, sound: sound3 },
    { x1: 73.0, y1: 9.4, x2: 89.0, y2: 13.3, sound: sound4 },
    { x1: 6.5, y1: 16.3, x2: 31.7, y2: 19.6, sound: sound5 },

  ];

  const checkAreaAndPlaySound = (x, y) => {
    const area = clickableAreas.find(
      (a) => x >= a.x1 && x <= a.x2 && y >= a.y1 && y <= a.y2,
    );

    console.log("Matched Area:", area);

    if (area) playSound(area.sound);
  };
  const playSound = (soundPath) => {
    if (audioRef.current) {
      audioRef.current.src = soundPath;
      audioRef.current.play();
      setIsPlaying(true);
      setHoveredAreaIndex(null); // إزالة الهايلايت عند بدء الصوت

      audioRef.current.onended = () => {
        setIsPlaying(false);
        setHoveredAreaIndex(null);
        setActiveAreaIndex(null); // مسح الهايلايت بعد انتهاء الصوت
      };
    }
  };

  return (
    <div
      className="page1-img-wrapper"
      onClick={handleImageClick}
      style={{ backgroundImage: `url(${page_7})` }}
    >
      {/* <img src={page_7} onClick={handleImageClick} /> */}
      {clickableAreas.map((area, index) => (
        <div
          key={index}
          className={`clickable-area ${
            hoveredAreaIndex === index || activeAreaIndex === index
              ? "highlight"
              : ""
          }`}
          style={{
            position: "absolute",
            left: `${area.x1}%`,
            top: `${area.y1}%`,
            width: `${area.x2 - area.x1}%`,
            height: `${area.y2 - area.y1}%`,
          }}
          onClick={() => {
            setActiveAreaIndex(index); // لتثبيت الهايلايت أثناء الصوت
            playSound(area.sound);
          }}
          onMouseEnter={() => {
            if (!isPlaying) setHoveredAreaIndex(index);
          }}
          onMouseLeave={() => {
            if (!isPlaying) setHoveredAreaIndex(null);
          }}
        ></div>
      ))}
      <div
        className="headset-icon-CD-page7 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() =>
            openPopup(
              "audio",
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <AudioWithCaption
                  src={grammarSound}
                  captions={captionsExample}
                />
              </div>,
              true,
            )
          }
          style={{ overflow: "visible" }}
        >
          <image
            className="svg-img"
            href={audioBtn}
            x="0"
            y="0"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
          />
        </svg>
      </div>

      <div
        className="pauseBtn-icon-CD-page7 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() =>
            openPopup(
              "video",
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  height: "100%",
                  width: "100%",
                }}
              >
                <video
                  autoPlay
                  controls
                  style={{
                    width: "auto",
                    height: "80%",
                    objectFit: "fill",
                    borderRadius: "20px",
                  }}
                >
                  {/* <source src={video2} type="video/mp4" /> */}
                </video>
              </div>,
            )
          }
          style={{ overflow: "visible" }}
        >
          <image
            className="svg-img"
            href={pauseBtn}
            x="0"
            y="0"
            width="90"
            height="90"
          />
        </svg>
      </div>
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
};

export default Page7;

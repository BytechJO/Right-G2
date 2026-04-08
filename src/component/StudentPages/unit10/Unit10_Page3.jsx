import React, { useState, useRef } from "react";
import page_3 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 84.png";
import "./Unit10_Page3.css";
import grammarSound from "../../../assets/audio/ClassBook/U 10/cd59pg84-grammar1-adult-lady_QBWCLEuD.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 10/Pg84_1.1_Adult Lady.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 10/Pg84_2.1_Adult Lady.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 10/Pg84_3.1_Adult Lady.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 10/Pg84_4.1_Adult Lady.mp3";


import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import pauseBtn from "../../../assets/Page 01/Right Video Button.svg";
import video from "../../../assets/video/grade2-unit10-page84.mp4";
const Unit10_Page3 = ({ openPopup }) => {
  const audioRef = useRef(null);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
 const captionsExample = [
  { start: 0.479, end: 3.839, text: "Page 84, exercise one. Write grammar." },
  { start: 4.880, end: 7.639, text: "What's he doing? He's taking a shower." },
  { start: 8.659, end: 11.279, text: "What's she doing? She's cooking." },
  { start: 12.340, end: 15.259, text: "What's it doing? It's drinking milk." },
  { start: 16.279, end: 18.899, text: "What's she doing? She's cooking." },
  { start: 20.000, end: 22.760, text: "What's he doing? He's taking a shower." },
  { start: 23.840, end: 26.760, text: "What's it doing? It's drinking milk" }
];

  const clickableAreas = [
    { x1: 6.66, y1: 10.42, x2: 35.75, y2: 20.16, sound: sound1 },
    { x1: 60.96, y1: 10.42, x2: 93.34, y2: 20.16, sound: sound1 },
    { x1: 5.50, y1: 48.49, x2: 27.61, y2: 54.43, sound: sound2 },
    { x1: 69.10, y1: 48.49, x2: 93.54, y2: 54.59, sound: sound3 },
    { x1: 5.69, y1: 59.76, x2: 25.67, y2: 65.70, sound: sound4 },
   
  ];
  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
    console.log("X%:", xPercent.toFixed(2), "Y%:", yPercent.toFixed(2));
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
      style={{ backgroundImage: `url(${page_3})` }}
    >
      {/* <img
        src={page_3}
        style={{ display: "block" }}
        onClick={handleImageClick}
      /> */}
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
        className="headset-icon-CD-unit10-page3-1 hover:scale-110 transition"
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
            )
          }
          style={{ overflow: "visible" }}
        >
          <image
            className="svg-img"
            href={audioBtn}
            x="0"
            y="0"
            width="90"
            height="90"
          />
        </svg>
      </div>
      <div
        className="pauseBtn-icon-CD-unit10-page3-1 hover:scale-110 transition"
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
                  <source src={video} type="video/mp4" />
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

export default Unit10_Page3;

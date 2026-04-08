import React, { useState, useRef } from "react";
import page_4 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 85.png";
import "./Unit10_Page4.css";
import grammarSound from "../../../assets/audio/ClassBook/U 10/cd60pg85-grammar2-adult-lady_FsmkLkEB.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 10/Pg85_2.1_Adult Lady.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 10/Pg85_2.2_Adult Lady.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 10/Pg85_3.1_Adult Lady.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 10/Pg85_4.1_Adult Lady.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 10/Pg85_5.1_Adult Lady.mp3";

import video from "../../../assets/video/grade2-unit10-page85.mp4";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import pauseBtn from "../../../assets/Page 01/Right Video Button.svg";
import AudioWithCaption from "../../AudioWithCaption";

const Unit10_Page4 = ({ openPopup }) => {
  const audioRef = useRef(null);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
const captionsExample = [
  { start: 0.479, end: 4.099, text: "Page 85, exercise two, write grammar." },
  { start: 5.119, end: 7.639, text: "What are you doing? What are they doing?" },
  { start: 8.679, end: 12.139, text: "They're washing the dishes. We're preparing lunch." },
  { start: 13.259, end: 16.239, text: "What are they doing? They're washing the dishes." },
  { start: 17.279, end: 20.079, text: "What are you doing? We're preparing lunch." },
  { start: 21.199, end: 24.239, text: "What are you doing? We're playing chess" }
];
  const clickableAreas = [
    { x1: 7.15, y1: 10.11, x2: 38.18, y2: 20.32, sound: sound1 },
    { x1: 58.35, y1: 10.26, x2: 92.67, y2: 20.16, sound: sound2 },
    { x1: 5.80, y1: 22.75, x2: 37.21, y2: 28.85, sound: sound3 },
    { x1: 53.69, y1: 48.65, x2: 79.87, y2: 54.59, sound: sound4 },
    { x1: 7.73, y1: 59.61, x2: 31.97, y2: 65.55, sound: sound5 },


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
    <div className="page1-img-wrapper"
          onClick={handleImageClick}
          style={{ backgroundImage: `url(${page_4})` }}>
   
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
        className="headset-icon-CD-unit10-page4-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() =>
            openPopup(
             "audio", <div
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
              </div>
            )
          }
          style={{ overflow: "visible" }}
        >
          <image className="svg-img" href={audioBtn} x="0" y="0" width="90" height="90" />
        </svg>
      </div>
      <div
        className="pauseBtn-icon-CD-unit10-page4-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() =>
            openPopup(
             "video", <div
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
              </div>
            )
          }
          style={{ overflow: "visible" }}
        >
          <image className="svg-img" href={pauseBtn} x="0" y="0" width="90" height="90" />
        </svg>
      </div>
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
};

export default Unit10_Page4;

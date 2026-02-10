import React, { useState, useRef } from "react";
import page_3 from "../../../assets/imgs/pages/Right 2 Unit 1 Stellas Family_00001/Right 2 Unit 1 Stellas Family_00012.jpg";
import "./Unit2_Page3.css";
import grammarSound from "../../../assets/audio/ClassBook/U 2/CD8.Pg12_Right Grammar1_Adult Lady.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 2/Pg12_1.1_Adult Lady.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 2/Pg12_1.2_Adult Lady.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 2/Pg12_2.1_Helen.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 2/Pg12_2.1_Helen_Take 2.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 2/Pg12_2.1_Helen_Take 3.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 2/Pg12_3.1_Stella.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 2/Pg12_4.1_Tom.mp3";

import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import pauseBtn from "../../../assets/Page 01/Right Video Button.svg";
// import video from "../../../assets/img_unit2/sounds-unit2/p12 1920.mp4";
const Unit2_Page3 = ({ openPopup }) => {
  const audioRef = useRef(null);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
  const captionsExample = [
    { start: 0, end: 3.22, text: "Page 12, Exercise 1. Right Grammar." },
    { start: 3.25, end: 7.11, text: " How old are you? I'm seven years old." },
    {
      start: 7.15,
      end: 11.02,
      text: " When is your birthday? My birthday is in August.",
    },
    {
      start: 11.06,
      end: 13.11,
      text: "It is on Tuesday. ",
    },
    { start: 13.15, end: 14.22, text: "How old are you, Sara? " },
    { start: 14.26, end: 16.05, text: "I'm three years old. " },
    { start: 16.09, end: 17.24, text: "When is your birthday party, Stella? " },
    { start: 17.27, end: 19.16, text: "It is on Tuesday. " },
    {
      start: 19.2,
      end: 22.1,
      text: "Happy birthday! This is for you, Stella. ",
    },
    { start: 22.14, end: 23.1, text: "Thank you.  " },
    { start: 23.14, end: 25.05, text: "You're welcome. Open it." },
  ];

  const clickableAreas = [
    { x1: 6.5, y1: 10.7, x2: 30.0, y2: 15.0, sound: sound1 },
    { x1: 54.2, y1: 9.5, x2: 78.3, y2: 13.0, sound: sound2 },
    { x1: 6.5, y1: 15.8, x2: 35.6, y2: 20.0, sound: sound3 },
    { x1: 54.2, y1: 13.5, x2: 83.5, y2: 16.7, sound: sound4 },
    { x1: 54.2, y1: 17.0, x2: 74.1, y2: 20.4, sound: sound5 },
    { x1: 14.08, y1: 27.0, x2: 29.6, y2: 31.7, sound: sound6 },
    { x1: 7.0, y1: 47.5, x2: 29.2, y2: 50.4, sound: sound7 },
    
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
        className="headset-icon-CD-unit2-page3-1 hover:scale-110 transition"
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
        className="pauseBtn-icon-CD-unit2-page3-1 hover:scale-110 transition"
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
                  {/* <source src={video} type="video/mp4" /> */}
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

export default Unit2_Page3;

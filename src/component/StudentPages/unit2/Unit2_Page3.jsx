import React, { useState, useRef } from "react";
import page_3 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 12.png";
import "./Unit2_Page3.css";
import grammarSound from "../../../assets/audio/ClassBook/U 2/cd8pg12-right-grammar1-adult-lady_fZEpARCe.mp3";
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
import video from "../../../assets/video/grade2-unit2-page12.mp4";
const Unit2_Page3 = ({ openPopup }) => {
  const audioRef = useRef(null);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
  const captionsExample = [
    { start: 0.52, end: 4.74, text: "Page 12, exercise 1. Write grammar." },
    { start: 5.86, end: 7.38, text: "This is a bird." },
    { start: 8.48, end: 12.42, text: "That's a blue bird. Is this a flower?" },
    { start: 13.72, end: 15.16, text: "Yes, it is." },
    { start: 16.48, end: 17.58, text: "Is that a cloud?" },
    { start: 18.68, end: 20.26, text: "No, it isn't." },
    {
      start: 21.34,
      end: 24.44,
      text: "This is a butterfly. This is a red butterfly.",
    },
    {
      start: 25.46,
      end: 29.8,
      text: "Is that a yellow bird? No, it isn't. That's a blue bird.",
    },
    {
      start: 30.84,
      end: 36.04,
      text: "Is this a brown rabbit? Yes, it is. And that is a white dog.",
    },
  ];

  const clickableAreas = [
    { x1: 7.27, y1: 9.65, x2: 32.48, y2: 20.32, sound: sound1 },
    { x1: 56.52, y1: 9.5, x2: 93.36, y2: 20.32, sound: sound2 },
    { x1: 15.99, y1: 25.65, x2: 41.02, y2: 31.50, sound: sound5 },
    { x1: 56.33, y1: 25.04, x2: 87.93, y2: 30.37, sound: sound6 },
    { x1: 5.72, y1: 59.31, x2: 42.36, y2: 65.09, sound: sound7 },
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

export default Unit2_Page3;

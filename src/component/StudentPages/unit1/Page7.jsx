import React, { useState, useRef, useEffect } from "react";
import page_7 from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 7.png";
import grammarSound from "../../../assets/audio/ClassBook/U 1/grammer-2.mp3";

import sound2 from "../../../assets/audio/ClassBook/U 1/g2-marge1.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 1/g2-marge2.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 1/Pg6_4.2_Jack.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 1/Pg6_5.1_Adult Lady.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 1/pg6-51-adult-lady_AXjN0mkr.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 1/Pg6a_3.1_Adult Lady.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 1/Pg6b_3.1_Adult Lady.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 1/Pg6b_4.1_Adult Lady.mp3";
import sound10 from "../../../assets/audio/ClassBook/U 1/Pg7_2.1_Adult Lady.mp3"
import sound11 from "../../../assets/audio/ClassBook/U 1/pg7-21-adult-lady_UAKOFhvX.mp3"
import sound12 from "../../../assets/audio/ClassBook/U 1/Pg7_2.3_Adult Lady.mp3"
import sound13 from "../../../assets/audio/ClassBook/U 1/Pg7_2.4_Adult Lady.mp3"
import "./Page7.css";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
import video2 from "../../../assets/video/grade2-unit1-page7.mp4";
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
    {
      start: 0.379,
      end: 4.739,
      text: "Page 7, exercise 2. Right grammar.",
    },
    {
      start: 5.819,
      end: 7.039,
      text: "Who are you?",
    },
    {
      start: 8.059,
      end: 9.039,
      text: "Who are they?",
    },
    {
      start: 10.059,
      end: 12.319,
      text: "They are Stella's father and brother.",
    },
    {
      start: 13.46,
      end: 14.359,
      text: "Who are you?",
    },
    {
      start: 15.539,
      end: 16.879,
      text: "I'm Stella's cousin.",
    },
    {
      start: 18.02,
      end: 19.739,
      text: "We're Stella's family.",
    },
    {
      start: 20.899,
      end: 25.159,
      text: "Who are they? They're Stella's father and brother.",
    },
    {
      start: 26.34,
      end: 31.599,
      text: "I'm Stella's cousin. I like to play. I'm Sarah's best friend.",
    },
    {
      start: 32.819,
      end: 34.559,
      text: "We're Stella's family.",
    },
  ];

  const clickableAreas = [
    { x1: 67.87, y1: 26.41, x2: 90.95, y2: 33.57, sound: sound4 },
    { x1: 49.8, y1: 29.9, x2: 66.9, y2: 33.2, sound: sound9 },
    { x1: 8.34, y1: 25.19, x2: 30.64, y2: 32.35, sound: sound11 },
    { x1: 9.31, y1: 62.51, x2: 32.97, y2: 68.2, sound: sound6 },
    { x1: 6.15, y1: 8.74, x2: 30.23, y2: 19.6, sound: sound3 },
    { x1: 58.65, y1: 8.28, x2: 93.56, y2: 20.01, sound: sound2 },
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
                  <source src={video2} type="video/mp4" />
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

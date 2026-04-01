import React, { useState, useRef } from "react";
import page_4 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 49.png";
import "./unit6_Page4.css";
import grammarSound from "../../../assets/audio/ClassBook/U 6/CD35.Pg49_Grammar2_Adult Lady.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 6/pg49-21-adult-lady_QAwcb4YH.mp3";

import sound3 from "../../../assets/audio/ClassBook/U 6/Pg49_3.1_Adult Lady.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 6/Pg49_4.1_Adult Lady.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 6/Pg49_5.1_Adult Lady.mp3";

// import video from "../../../assets/img_unit6/sounds-unit6/p13.mp4";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import pauseBtn from "../../../assets/Page 01/Right Video Button.svg";
import AudioWithCaption from "../../AudioWithCaption";

const Unit6_Page4 = ({ openPopup }) => {
  const audioRef = useRef(null);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
  const captionsExample = [
    { start: 0.479, end: 4.279, text: "Page 49, exercise two. Write grammar." },
    { start: 5.359, end: 7.819, text: "Jack eats breakfast at seven o'clock." },
    {
      start: 9.0,
      end: 12.359,
      text: "Jack eats lunch at half past four in the afternoon.",
    },
    {
      start: 13.639,
      end: 16.479,
      text: "Jack eats dinner at nine thirty in the evening.",
    },
    { start: 17.68, end: 19.939, text: "They eat breakfast at seven o'clock." },
    {
      start: 21.0,
      end: 34.68,
      text: "They eat lunch at half past four in the afternoon. They eat dinner at nine thirty in the evening. What time does Jack eat breakfast? Jack eats breakfast at seven o'clock in the morning.",
    },
    {
      start: 35.719,
      end: 41.04,
      text: "What time does Helen go home? She goes home at two o'clock in the afternoon.",
    },
    {
      start: 42.159,
      end: 47.38,
      text: "What time does Harley go to bed? He goes to bed at nine o'clock in the evening",
    },
  ];

  const clickableAreas = [
    { x1: 7.15, y1: 9.96, x2: 92.67, y2: 19.71, sound: sound1 },
    { x1: 5.60, y1: 52.61, x2: 47.10, y2: 60.53, sound: sound3 },
    { x1: 57.57, y1: 52.30, x2: 94.61, y2: 60.53, sound: sound4 },
    { x1: 45.16, y1: 85.81, x2: 83.56, y2: 92.97, sound: sound5 },
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
      style={{ backgroundImage: `url(${page_4})` }}
    >
      {/* <img
        src={page_4}
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
        className="headset-icon-CD-unit6-page4-1 hover:scale-110 transition"
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
        className="pauseBtn-icon-CD-unit6-page4-1 hover:scale-110 transition"
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

export default Unit6_Page4;

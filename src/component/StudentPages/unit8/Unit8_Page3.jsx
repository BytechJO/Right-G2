import React, { useState, useRef } from "react";
import page_3 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 66.png";
import "./Unit8_Page3.css";
import grammarSound from "../../../assets/audio/ClassBook/U 8/cd46pg66-grammar1-adult-lady_jYzfLavn.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 8/grammar-marge1.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 8/Pg66_1.2_Adult Lady.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 8/Pg66_1.3_Helen.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 8/Pg66_2.1_Helen_Take 2.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 8/Pg66_2.1_Tom.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 8/Pg66_3.1_Adult Lady.mp3";

import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import pauseBtn from "../../../assets/Page 01/Right Video Button.svg";
import video from "../../../assets/video/grade2-unit8-page66.mp4";
const Unit8_Page3 = ({ openPopup }) => {
  const audioRef = useRef(null);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
 const captionsExample = [
  { start: 0.219, end: 14.960, text: "Page 66, exercise one, write grammar. How many dresses do you have? I have two dresses. How many caps do we have? We have three caps." },
  { start: 14.960, end: 19.379, text: "How many pairs of shorts do they have? They have five pairs of shorts." },
  { start: 20.600, end: 25.039, text: "I have two dresses, but I don't have any skirts." },
  { start: 25.039, end: 31.699, text: "You have two caps and two hats, and we only have two caps  We don't have any hats" }
];
  const clickableAreas = [
    { x1: 6.86, y1: 9.81, x2: 85.97, y2: 20.16, sound: sound1 },
    { x1: 19.85, y1: 48.80, x2: 47.58, y2: 54.89, sound: sound5 },
    { x1: 56.30, y1: 47.27, x2: 93.73, y2: 54.89, sound: sound6 },
    { x1: 30.51, y1: 86.11, x2: 66.19, y2: 91.75, sound: sound4 },
    // { x1: 54.2, y1: 17.0, x2: 74.1, y2: 20.4, sound: sound5 },
    // { x1: 54.2, y1: 17.0, x2: 74.1, y2: 20.4, sound: sound6},
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
        className="headset-icon-CD-unit5-page3-1 hover:scale-110 transition"
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
        className="pauseBtn-icon-CD-unit5-page3-1 hover:scale-110 transition"
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

export default Unit8_Page3;

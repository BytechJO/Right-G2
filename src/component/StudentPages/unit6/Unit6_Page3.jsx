import React, { useState, useRef } from "react";
import page_3 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 48.png";
import "./Unit6_Page3.css";
import grammarSound from "../../../assets/audio/ClassBook/U 6/cd34pg48-grammar1-adult-lady_lw2IZGTc.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 6/Pg48_1.1_Adult Lady.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 6/Pg48_2.1_Adult Lady.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 6/Pg48_3.1_Adult Lady.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 6/Pg48_4.1_Adult Lady.mp3";

import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import pauseBtn from "../../../assets/Page 01/Right Video Button.svg";
// import video from "../../../assets/img_unit6/sounds-unit6/p12 1920.mp4";
const Unit6_Page3 = ({ openPopup }) => {
  const audioRef = useRef(null);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
  const captionsExample = [
    {
      start: 0.5,
      end: 8.319,
      text: "Page 48. Exercise one: Write grammar. What time does Tom go to school?",
    },
    {
      start: 9.359,
      end: 19.139,
      text: "What time do they have lunch? What time does Hansel come home? Hansel comes home at half past three in the afternoon.",
    },
    {
      start: 20.219,
      end: 25.599,
      text: "What time does Tom go to school? He goes to school at seven thirty in the morning.",
    },
    {
      start: 26.68,
      end: 31.52,
      text: "What time does Stella get up? Stella gets up at six o'clock",
    },
  ];

  const clickableAreas = [
    { x1: 7.63, y1: 10.26, x2: 91.79, y2: 19.40, sound: sound1 },
    { x1: 5.89, y1: 52.45, x2: 47.19, y2: 60.53, sound: sound2 },
    { x1: 52.23, y1: 52.76, x2: 93.73, y2: 60.53, sound: sound3 },
    { x1: 49.52, y1: 87.33, x2: 83.26, y2: 92.8, sound: sound4 },
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
        className="headset-icon-CD-unit6-page3-1 hover:scale-110 transition"
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
        className="pauseBtn-icon-CD-unit6-page3-1 hover:scale-110 transition"
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

export default Unit6_Page3;

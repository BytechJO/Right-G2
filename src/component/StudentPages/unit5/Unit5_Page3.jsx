import React, { useState, useRef } from "react";
import page_3 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 42.png";
import "./Unit5_Page3.css";
import grammarSound from "../../../assets/audio/ClassBook/U 5/cd29pg42-grammar1-adult-lady_XxgWQruP.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 5/Pg42_1.1_Adult Lady.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 5/Pg42_1.2_Adult Lady.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 5/Pg42_2.1_Helen.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 5/Pg42_3.1_John.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 5/Pg42_4.1_Adult Lady.mp3";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import pauseBtn from "../../../assets/Page 01/Right Video Button.svg";
import video from "../../../assets/video/grade2-unit5-page42.mp4";
const Unit5_Page3 = ({ openPopup }) => {
  const { audioRef, activeId, setActiveId } = useContext(AudioContext);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const captionsExample = [
  { start: 0.439, end: 4.759, text: "Page 42, exercise 1. Right Grammar." },
  { start: 5.9, end: 11.239, text: "He likes chicken. She likes chicken. It likes chicken." },
  { start: 12.359, end: 21.199, text: "He doesn't like burgers. She doesn't like burgers. It doesn't like burgers." },
  { start: 22.5, end: 25.34, text: "He likes cheese. He doesn't like meat." },
  { start: 26.379, end: 29.319, text: "She likes stew. She doesn't like burgers." },
  { start: 30.399, end: 31.5, text: "It likes milk." },
  { start: 32.559, end: 33.9, text: "It doesn't like tea" }
];

  const clickableAreas = [
    { id: "pg9-1",x1: 6.66, y1: 9.05, x2: 34.97, y2: 19.86, sound: sound1 },
    { id: "pg9-2",x1: 61.35, y1: 9.05, x2: 92.37, y2: 19.86, sound: sound2 },
    { id: "pg9-3",x1: 8.21, y1: 26.71, x2: 33.5, y2: 32.5, sound: sound3 },
    { id: "pg9-4",x1: 64.84, y1: 25.34, x2: 92.76, y2: 31.28, sound: sound4 },
    { id: "pg9-5",x1: 7.83, y1: 64.94, x2: 28.38, y2: 70.27, sound: sound5 },

    
  ];
  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
    console.log("X%:", xPercent.toFixed(2), "Y%:", yPercent.toFixed(2));
  };
 const playSound = (soundPath, id) => {
    if (!audioRef.current) return;

    // 🔥 وقف أي صوت شغال بأي صفحة
    audioRef.current.pause();
    audioRef.current.currentTime = 0;

    audioRef.current.src = soundPath;
    audioRef.current.play();

    setActiveId(id); // 🔥 هذا المهم

    audioRef.current.onended = () => {
      setActiveId(null);
    };
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
            activeId === area.id ? "highlight" : ""
          }`}
          style={{
            position: "absolute",
            left: `${area.x1}%`,
            top: `${area.y1}%`,
            width: `${area.x2 - area.x1}%`,
            height: `${area.y2 - area.y1}%`,
          }}
          onClick={() => {
            playSound(area.sound, area.id);
          }}
          onMouseEnter={() => {
            if (!isPlaying) setHoveredAreaIndex(index);
          }}
          onMouseLeave={() => {
            if (!isPlaying ) setHoveredAreaIndex(null);
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

export default Unit5_Page3;

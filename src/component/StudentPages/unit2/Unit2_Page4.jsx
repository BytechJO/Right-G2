import React, { useState, useRef } from "react";
import page_4 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 13.png";
import "./Unit2_Page4.css";
import grammarSound from "../../../assets/audio/ClassBook/U 2/cd9pg13-right-grammar2-adult-lady_q2Vq2y9A.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 2/Pg13_2.1_Adult Lady.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 2/Pg13_2.2_Adult Lady.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 2/Pg13_2.3_Adult Lady.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 2/Pg13_2.4_Adult Lady.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 2/Pg13_3.1_Hansel.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 2/Pg13_4.1_Tom.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 2/Pg13_5.1_Harley.mp3";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
import video from "../../../assets/video/grade2-unit2-page13.mp4";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import pauseBtn from "../../../assets/Page 01/Right Video Button.svg";
import AudioWithCaption from "../../AudioWithCaption";

const Unit2_Page4 = ({ openPopup }) => {
  const { audioRef, activeId, setActiveId } = useContext(AudioContext);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const captionsExample = [
    { start: 0.56, end: 5.0, text: "Page 13, exercise two, write grammar." },
    { start: 6.18, end: 7.5, text: "This is a tree." },
    { start: 8.8, end: 10.5, text: "That is a cloud." },
    { start: 11.58, end: 13.22, text: "Are these red flowers?" },
    { start: 14.46, end: 15.88, text: "Yes, they are." },
    { start: 16.98, end: 18.24, text: "These are trees." },
    { start: 19.56, end: 20.88, text: "Those are clouds." },
    {
      start: 21.98,
      end: 26.18,
      text: "Are these yellow ducks? No, they aren't.",
    },
    {
      start: 27.34,
      end: 30.94,
      text: "These are green trees. Those are white clouds.",
    },
    {
      start: 31.98,
      end: 37.4,
      text: "Are these white ducks? Yes, they are white ducks.",
    },
    {
      start: 37.4,
      end: 42.8,
      text: "Are those black horses? No, they aren't. Those are gray horses.",
    },
  ];

  const clickableAreas = [
    { id: "pg4-1", x1: 6.21, y1: 8.89, x2: 29.47, y2: 14.5, sound: sound1 },
    { id: "pg4-2", x1: 49.06, y1: 8.89, x2: 92.3, y2: 14.5, sound: sound2 },
    { id: "pg4-3", x1: 6.21, y1: 15.9, x2: 29.47, y2: 21.38, sound: sound3 },
    { id: "pg4-4", x1: 49.06, y1: 15.9, x2: 92.3, y2: 21.38, sound: sound4 },
    { id: "pg4-5", x1: 5.82, y1: 39.2, x2: 32.77, y2: 44.38, sound: sound5 },
    { id: "pg4-6", x1: 62.25, y1: 30.37, x2: 91.8, y2: 36, sound: sound6 },
    { id: "pg4-7", x1: 5.3, y1: 63.9, x2: 47.4, y2: 69.35, sound: sound7 },
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
        className="headset-icon-CD-unit2-page4-1 hover:scale-110 transition"
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
        className="pauseBtn-icon-CD-unit2-page4-1 hover:scale-110 transition"
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

export default Unit2_Page4;

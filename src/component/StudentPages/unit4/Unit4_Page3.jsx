import React, { useState, useRef } from "react";
import page_3 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 30.png";
import "./Unit4_Page3.css";
import grammarSound from "../../../assets/audio/ClassBook/U 4/cd22pg30-grammar1-adult-lady_zqCjverC.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 4/pg30-11-grammer1Marge1.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 4/Pg30_2.1_Harley.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 4/Pg30_2.2_Stella.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 4/Pg30_3.1_Hansel.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 4/Pg30_3.2_Helen.mp3";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import pauseBtn from "../../../assets/Page 01/Right Video Button.svg";
import video from "../../../assets/video/grade2-unit4-page30.mp4";
const Unit4_Page3 = ({ openPopup }) => {
  const { audioRef, activeId, setActiveId } = useContext(AudioContext);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const captionsExample = [
    {
      start: 0.52,
      end: 8.4,
      text: "Page 30, exercise one. Write grammar. What's his job? He's a nurse.",
    },
    { start: 9.52, end: 10.58, text: "What's her job?" },
    { start: 11.82, end: 14.78, text: "She's a nurse. What's your job?" },
    { start: 15.98, end: 16.88, text: "I'm a doctor." },
    { start: 17.94, end: 19.06, text: "What's their job?" },
    { start: 20.08, end: 22.42, text: "They're police officers." },
    {
      start: 22.42,
      end: 28.82,
      text: "They wear uniforms. They drive police cars. What's their job?",
    },
    { start: 28.82, end: 31.2, text: "They're police officers." },
    {
      start: 31.2,
      end: 36.72,
      text: "He works in a store. He sells toys. What's his job?",
    },
    { start: 36.72, end: 38.36, text: "He's a toy sales clerk." },
  ];

  const clickableAreas = [
    { id: "pg7-1", x1: 7.27, y1: 9.5, x2: 92.59, y2: 20.32, sound: sound1 },
    { id: "pg7-2", x1: 5.72, y1: 53.37, x2: 31.7, y2: 60.53, sound: sound5 },
    { id: "pg7-3", x1: 58.85, y1: 30.67, x2: 84.83, y2: 33.72, sound: sound6 },
    { id: "pg7-4", x1: 8.62, y1: 63.72, x2: 31.89, y2: 70.88, sound: sound7 },
    { id: "pg7-5", x1: 47.79, y1: 89.16, x2: 62.34, y2: 92.05, sound: sound8 },
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
        className="headset-icon-CD-unit4-page3-1 hover:scale-110 transition"
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
        className="pauseBtn-icon-CD-unit4-page3-1 hover:scale-110 transition"
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

export default Unit4_Page3;

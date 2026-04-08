import React, { useState, useRef } from "react";
import page_4 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 43.png";
import "./Unit5_Page4.css";
import grammarSound from "../../../assets/audio/ClassBook/U 5/cd30pg43-grammar2-adult-lady_sBLFcCdt.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 5/pg43-21-adult-lady_ckRFNr8L.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 5/pg43-22-adult-lady_uzzpifUp.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 5/Pg43_3.1_Adult Lady.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 5/Pg43_4.1_Adult Lady.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 5/Pg43_5.1_Helen.mp3";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
import video from "../../../assets/video/grade2-unit5-page43.mp4";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import pauseBtn from "../../../assets/Page 01/Right Video Button.svg";
import AudioWithCaption from "../../AudioWithCaption";

const Unit5_Page4 = ({ openPopup }) => {
  const { audioRef, activeId, setActiveId } = useContext(AudioContext);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
  const captionsExample = [
    {
      start: 0.599,
      end: 8.5,
      text: "Page 43, exercise two, write grammar. Does he like fruit? Does he like tea?",
    },
    { start: 9.599, end: 11.0, text: "Yes, he does." },
    { start: 12.099, end: 13.539, text: "No, he doesn't." },
    {
      start: 14.559,
      end: 17.719,
      text: "Does she like fruit? Does she like tea?",
    },
    {
      start: 18.92,
      end: 26.599,
      text: "Yes, she does. No, she doesn't. Does it like fruit? Does it like tea?",
    },
    { start: 27.739, end: 31.779, text: "Yes, it does. No, it doesn't." },
    { start: 32.84, end: 34.2, text: "Does he like chicken?" },
    { start: 35.259, end: 36.819, text: "No, he doesn't." },
    { start: 37.86, end: 42.379, text: "Does she like tea? Yes, she does." },
    { start: 42.379, end: 45.02, text: "Does it like fruit? No, it doesn't." },
  ];

  const clickableAreas = [
    { id: "pg10-1",x1: 7.15, y1: 9.00, x2: 39.73, y2: 19.86, sound: sound1 },
    { id: "pg10-2",x1: 61.06, y1: 9.00, x2: 92.67, y2: 19.86, sound: sound2 },
    { id: "pg10-3",x1: 8.90, y1: 26.41, x2: 33.9, y2: 31.28, sound: sound7 },
    { id: "pg10-4",x1: 68.44, y1: 26.26, x2: 89.76, y2: 31.29, sound: sound8 },
    { id: "pg10-5",x1: 63.00, y1: 65.55, x2: 81.81, y2: 70.73, sound: sound9 },
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
        className="headset-icon-CD-unit5-page4-1 hover:scale-110 transition"
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
        className="pauseBtn-icon-CD-unit5-page4-1 hover:scale-110 transition"
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

export default Unit5_Page4;

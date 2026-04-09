import React, { useState, useRef } from "react";
import page_4 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 61.png";
import "./Unit7_Page4.css";
import grammarSound from "../../../assets/audio/ClassBook/U 7/cd42pg61-grammar2-adult-lady-2_RSBVfrn1.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 7/Pg61_2.1_Adult Lady.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 7/Pg61_3.1_Boy.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 7/Pg61_4.1_Woman.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 7/Pg61_5.1_Girl.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 7/Pg61_5.2_Girl.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 7/Pg61_6.1_Woman.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 7/CD43.Pg62_Instruction1_Adult Lady.mp3";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
import video from "../../../assets/video/grade2-unit7-page61.mp4";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import pauseBtn from "../../../assets/Page 01/Right Video Button.svg";
import AudioWithCaption from "../../AudioWithCaption";

const Unit7_Page4 = ({ openPopup }) => {
  const { audioRef, activeId, setActiveId } = useContext(AudioContext);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const captionsExample = [
    {
      start: 0.479,
      end: 8.519,
      text: "Page 61, exercise 2. Right Grammar. What day is today? It's Monday.",
    },
    { start: 8.519, end: 11.039, text: "What month is it? It's January." },
    {
      start: 12.059,
      end: 17.799,
      text: "Hi. Can you book me two tickets to Amman for Monday, September 12th, please?",
    },
    {
      start: 18.859,
      end: 23.839,
      text: "Sure, sir. The flight is at a quarter to 11 in the morning.",
    },
    {
      start: 23.84,
      end: 30.579,
      text: "Good morning. I need to book six tickets to Rome for September 6th. Are there any flights available?",
    },
    {
      start: 31.619,
      end: 39.84,
      text: "Yes, there is one, but only four seats are available. What about September 7th at a quarter past 12?",
    },
    { start: 40.959, end: 43.619, text: "September 7th is fine. Thank you." },
  ];
  const clickableAreas = [
    { id: "pg14-1",x1: 24.64, y1: 9.65, x2: 65.72, y2: 14.07, sound: sound1 },
    { id: "pg14-2",x1: 24.61, y1: 15.44, x2: 65.52, y2: 20.01, sound: sound2 },
    { id: "pg14-3",x1: 5.60, y1: 21.53, x2: 39.9, y2: 28.85, sound: sound3 },
    { id: "pg14-4",x1: 37.79, y1: 42.40, x2: 75.41, y2: 48.95, sound: sound4 },
    { id: "pg14-5",x1: 5.60, y1: 53.8, x2: 43.22, y2: 60.83, sound: sound6 },
    { id: "pg14-6",x1: 45.35, y1: 50.47, x2: 77.35, y2: 60.53, sound: sound5 },
    { id: "pg14-7",x1: 7.15, y1: 79.11, x2: 32.17, y2: 84.74, sound: sound7 },
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
        className="headset-icon-CD-unit7-page4-1 hover:scale-110 transition"
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
        className="pauseBtn-icon-CD-unit7-page4-1 hover:scale-110 transition"
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

export default Unit7_Page4;

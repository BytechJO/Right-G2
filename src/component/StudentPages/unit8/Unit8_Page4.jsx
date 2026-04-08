import React, { useState, useRef } from "react";
import page_4 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 67.png";
import "./Unit8_Page4.css";
import grammarSound from "../../../assets/audio/ClassBook/U 8/cd47pg67-grammar2-adult-lady_Nvm2IAr0.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 8/grammar-marge2.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 8/Pg67_2.2_Adult Lady.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 8/Pg67_3.1_Adult Lady (2).mp3";
import sound4 from "../../../assets/audio/ClassBook/U 8/Pg67_4.1_Adult Lady.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 8/Pg67_5.1_Adult Lady.mp3";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
import video from "../../../assets/video/grade2-unit8-page67.mp4";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import pauseBtn from "../../../assets/Page 01/Right Video Button.svg";
import AudioWithCaption from "../../AudioWithCaption";

const Unit8_Page4 = ({ openPopup }) => {
  const { audioRef, activeId, setActiveId } = useContext(AudioContext);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const captionsExample = [
    {
      start: 0.459,
      end: 18.959,
      text: "Page 67, exercise two. Write grammar. Does she have any skirts? Yes, she has four skirts. Does he have any ties? Yes, he has 10 ties. No, he doesn't have any ties.",
    },
    { start: 20.18, end: 24.299, text: "She has four skirts. He has 10 ties." },
    { start: 25.379, end: 26.92, text: "She has one scarf" },
  ];
  const clickableAreas = [
    { id: "pg16-1",x1: 6.96, y1: 10.11, x2: 77.74, y2: 19.86, sound: sound1 },
    { id: "pg16-2",x1: 5.99, y1: 23.51, x2: 27.51, y2: 26.41, sound: sound3 },
    { id: "pg16-3",x1: 75.6, y1: 26.41, x2: 93.83, y2: 29.61, sound: sound4 },
    // { x1: 54.2, y1: 15.27, x2: 78.3, y2: 19.5, sound: sound5 },
    { id: "pg16-4",x1: 8.9, y1: 86.72, x2: 30.62, y2: 90.07, sound: sound5 },
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

export default Unit8_Page4;

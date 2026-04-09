import React, { useState, useRef } from "react";
import page_3 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 24.png";
import "./Unit3_Page3.css";
import grammarSound from "../../../assets/audio/ClassBook/U 3/cd17pg24-grammar1.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 3/Pg24_1.1_Adult Lady.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 3/Pg24_1.2_Adult Lady.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 3/Pg24_2.1_Adult Lady.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 3/Pg24_3.1_Adult Lady.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 3/Pg24_4.1_Adult Lady.mp3";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import pauseBtn from "../../../assets/Page 01/Right Video Button.svg";
import video from "../../../assets/video/grade2-unit3-page24.mp4";
const Unit3_Page3 = ({ openPopup }) => {
  const { audioRef, activeId, setActiveId } = useContext(AudioContext);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const captionsExample = [
 { start: 0.58, end: 5.72, text: "Page 24. Right Grammar. Can he ride a bike?" },
  { start: 6.76, end: 8.3, text: "Yes, he can." },
  { start: 9.34, end: 10.96, text: "Can she fly a kite?" },
  { start: 12.14, end: 16.1, text: "Yes, she can. Can he ride a bike?" },
  { start: 17.4, end: 21.46, text: "Yes, he can. Can she take a photo?" },
  { start: 22.68, end: 24.18, text: "Yes, she can." },
  { start: 25.22, end: 26.7, text: "Can she fly a kite?" },
  { start: 28.1, end: 29.64, text: "Yes, she can." },
  ];

  const clickableAreas = [
    { id: "pg5-1",x1: 6.88, y1: 9.35, x2: 35.58, y2: 20.01, sound: sound1 },
    { id: "pg5-2",x1: 68.74, y1: 9.35, x2: 92.59, y2: 20.01, sound: sound2 },
    { id: "pg5-3",x1: 6.30, y1: 27.17, x2: 29.18, y2: 32.99, sound: sound3 },
    { id: "pg5-4",x1: 50.32, y1: 26.87, x2: 76.88, y2: 32.35, sound: sound4 },
    { id: "pg5-5",x1: 9.40, y1: 59.61, x2: 31.31, y2: 65.40, sound: sound5 },

    
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
        className="headset-icon-CD-unit3-page3-1 hover:scale-110 transition"
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
        className="pauseBtn-icon-CD-unit3-page3-1 hover:scale-110 transition"
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

export default Unit3_Page3;

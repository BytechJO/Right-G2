import React, { useState, useRef } from "react";
import page_3 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 78.png";
import "./Unit9_Page3.css";
import grammarSound from "../../../assets/audio/ClassBook/U 7/cd41pg60-grammar1-adult-lady_TsMLtlcC.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 9/grammar1-marge1.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 9/grammar1-marge2.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 9/Pg78_1.3_Adult Lady.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 9/Pg78_1.4_Adult Lady.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 9/Pg78_2.1_Adult Lady.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 9/Pg78_3.1_Adult Lady.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 9/Pg78_4.1_Adult Lady.mp3";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import pauseBtn from "../../../assets/Page 01/Right Video Button.svg";
import video from "../../../assets/video/grade2-unit9-page78.mp4";
const Unit9_Page3 = ({ openPopup }) => {
   const { audioRef, activeId, setActiveId } = useContext(AudioContext);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
 const captionsExample = [
  { start: 0.479, end: 10.880, text: "Page 78, exercise one. Write grammar. He's ironing clothes. He's playing chess. He's listening to the radio." },
  { start: 11.920, end: 18.039, text: "She's ironing clothes. She's playing chess. She's listening to the radio." },
  { start: 19.139, end: 22.899, text: "He isn't cooking lunch. He isn't playing soccer." },
  { start: 23.959, end: 42.040, text: "She isn't cooking lunch. She isn't playing soccer. Mom is ironing clothes. She isn't cooking lunch. Dad is listening to the radio. He isn't reading the newspaper. The hens are eating corn. They aren't eating grass" }
];
  const clickableAreas = [
    { id: "pg17-1",x1: 6.66, y1: 9.81, x2: 43.31, y2: 20.16, sound: sound1 },
    { id: "pg17-2",x1: 56.11, y1: 9.81, x2: 92.57, y2: 20.16, sound: sound2 },
    { id: "pg17-3",x1: 18.88, y1: 30.22, x2: 46.61, y2: 36.16, sound: sound5 },
    { id: "pg17-4",x1: 49.13, y1: 30.22, x2: 85.00, y2: 36.16, sound: sound6 },
    { id: "pg17-5",x1: 64.26, y1: 89.92, x2: 93.54, y2:95.56, sound: sound7}

    
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

export default Unit9_Page3;

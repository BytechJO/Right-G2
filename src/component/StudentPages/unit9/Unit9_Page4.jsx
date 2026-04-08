import React, { useState, useRef } from "react";
import page_4 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 79.png";
import "./Unit9_Page4.css";
import grammarSound from "../../../assets/audio/ClassBook/U 9/cd54pg79-grammar2-adult-lady_0qrFJAUH.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 9/Pg79_2.1_Adult Lady.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 9/Pg79_2.2_Adult Lady.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 9/Pg79_3.1_Girl.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 9/Pg79_4.1_Grandparents.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 9/Pg79_5.1_Adult Lady.mp3";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
import video from "../../../assets/video/grade2-unit9-page79.mp4";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import pauseBtn from "../../../assets/Page 01/Right Video Button.svg";
import AudioWithCaption from "../../AudioWithCaption";

const Unit9_Page4 = ({ openPopup }) => {
  const { audioRef, activeId, setActiveId } = useContext(AudioContext);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const captionsExample = [
    { start: 0.5, end: 3.959, text: "Page 79, exercise two, write grammar." },
    {
      start: 5.159,
      end: 9.679,
      text: "They're shouting. We're writing. You're walking.",
    },
    {
      start: 10.719,
      end: 16.459,
      text: "They aren't singing. We aren't reading. You aren't running.",
    },
    {
      start: 16.459,
      end: 18.84,
      text: "They're shouting. They aren't singing.",
    },
    { start: 19.899, end: 22.859, text: "You're walking. You aren't running." },
    {
      start: 24.019,
      end: 27.379,
      text: "We're watching TV. We aren't reading",
    },
  ];
  const clickableAreas = [
    { id: "pg18-1",x1: 6.66, y1: 9.81, x2: 39.54, y2: 20.16, sound: sound1 },
    { id: "pg18-2",x1: 60.09, y1: 9.81, x2: 92.57, y2: 20.16, sound: sound2 },
    { id: "pg18-3",x1: 12.39, y1: 57.78, x2: 35.08, y2: 63.57, sound: sound3 },
    { id: "pg18-4",x1: 66.88, y1: 57.63, x2: 88.6, y2: 63.42, sound: sound4 },
    { id: "pg18-5",x1: 70.95, y1: 69.05, x2: 93.83, y2: 74.54, sound: sound5 },
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

export default Unit9_Page4;

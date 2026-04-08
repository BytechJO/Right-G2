import page24 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 20.png";
import React, { useState, useRef } from "react";
import "./Reading_Unit2_Page1.css";
import sound1 from "../../../assets/audio/ClassBook/U 2/pg20-11-adult-lady_ptTUU2uW.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 2/Pg20_1.1_Adult Lady.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 2/Pg20_1.2_Adult Lady.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 2/Pg20_1.3_Adult Lady.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 2/Pg20_1.4_Adult Lady.mp3";
import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import pauseBtn from "../../../assets/Page 01/Right Video Button.svg";
import video3 from "../../../assets/video/reading/grade2-unit2-page20-21reading.mp4";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";

const Reading_Unit2_Page1 = ({ openPopup }) => {
  const { audioRef, activeId, setActiveId } = useContext(AudioContext);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
  const captionsExample = [
    {
      start: 0.46,
      end: 13.76,
      text: "Who's she? She's my mother. She's in the kitchen cooking food. Who are they? They're my father and brother. They are shopping for school supplies.",
    },
    {
      start: 14.84,
      end: 20.9,
      text: "There is Jack. He's Sarah's cousin. He's Sarah's best friend.",
    },
    {
      start: 21.94,
      end: 31.12,
      text: "Who are they? They're Stella's aunt and uncle. They're in the car. John has new art supplies for school.",
    },
    {
      start: 32.18,
      end: 39.44,
      text: "Stella is sad. She wants new art supplies like John. He has supplies for Stella, too.",
    },
    {
      start: 40.58,
      end: 51.74,
      text: "Sarah plays with Stella's new art supplies. John is surprised. Sarah paints a picture of Stella. Stella is surprised, too.",
    },
  ];
  const clickableAreas = [
    { id: "p1-1", x1: 15.9, y1: 39.4, x2: 51.14, y2: 44.0, sound: sound2 },
    { id: "p1-2", x1: 56.0, y1: 39.1, x2: 93.9, y2: 45.9, sound: sound3 },
    { id: "p1-3", x1: 16.0, y1: 84.0, x2: 52.9, y2: 89.5, sound: sound4 },
    { id: "p1-4", x1: 56.0, y1: 84.5, x2: 93.7, y2: 90.9, sound: sound5 },
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
      style={{ backgroundImage: `url(${page24})` }}
    >
      {/* <img
        src={page24}
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
        className="headset-icon-CD-unit2-page11-1 hover:scale-110 transition"
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
                <AudioWithCaption src={sound1} captions={captionsExample} />
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
        className="pauseBtn-icon-CD-page21 hover:scale-110 transition"
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
                  <source src={video3} type="video/mp4" />
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

export default Reading_Unit2_Page1;

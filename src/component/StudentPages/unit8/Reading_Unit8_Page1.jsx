import page24 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 74.png";
import React, { useState, useRef } from "react";
import "./Reading_Unit8_Page1.css";
import sound1 from "../../../assets/audio/ClassBook/U 8/cd4pg74-reading-adult-lady_hsuFITMS.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 8/Pg74_1.1_Adult Lady.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 8/Pg74_1.2_Adult Lady.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 8/Pg74_1.3_Adult Lady.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 8/Pg75_1.4_Adult Lady.mp3";
import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import pauseBtn from "../../../assets/Page 01/Right Video Button.svg";
import video3 from "../../../assets/video/reading/grade2-unit8-page74-75reading.mp4";

import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
const Reading_Unit8_Page1 = ({ openPopup }) => {
  const { audioRef, activeId, setActiveId } = useContext(AudioContext);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
  const captionsExample = [
    {
      start: 0.599,
      end: 4.199,
      text: "Page 74 reading: Where are John's things?",
    },
    {
      start: 5.319,
      end: 11.639,
      text: "Stella and John are going to visit their grandma. John and Stella are packing their suitcases.",
    },
    {
      start: 12.819,
      end: 18.1,
      text: "Mom makes sure their suitcases are packed. They are staying at grandma's house all summer.",
    },
    {
      start: 19.239,
      end: 21.539,
      text: "Stella checked everything in her suitcase.",
    },
    {
      start: 22.619,
      end: 40.279,
      text: "She has her clothes, pajamas, toothbrush, and camera. She also has a pair of sandals. John has his pants, shirts, swimsuit, and toothbrush. He also has his comb. He has books and comics to read and a pair of sunglasses too.",
    },
    {
      start: 41.299,
      end: 46.759,
      text: "Mom reminds Stella to take her hairbrush. Stella packs her hairbrush in her suitcase.",
    },
    {
      start: 47.86,
      end: 58.739,
      text: "John tells mom he is packed. He has everything he needs to visit grandma. John opens his suitcase at grandma's. Sarah put her things in John's suitcase",
    },
  ];
  const clickableAreas = [
    { id: "p7-1", x1: 15.9, y1: 39.4, x2: 51.14, y2: 46.06, sound: sound2 },
    { id: "p7-2", x1: 56.0, y1: 39.1, x2: 93.9, y2: 46.06, sound: sound3 },
    { id: "p7-3", x1: 16.0, y1: 85.5, x2: 52.9, y2: 94.03, sound: sound4 },
    { id: "p7-4", x1: 56.0, y1: 85.5, x2: 93.7, y2: 94.03, sound: sound5 },
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
            if (!isPlaying) setHoveredAreaIndex(null);
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

export default Reading_Unit8_Page1;

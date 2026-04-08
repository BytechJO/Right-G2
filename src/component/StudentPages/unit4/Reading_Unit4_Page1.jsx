import page24 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 38.png";
import React, { useState, useRef } from "react";
import "./Reading_Unit4_Page1.css";
import sound1 from "../../../assets/audio/ClassBook/U 4/cd2pg38-reading1-adult-lady_KCb6Y6f6.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 4/Pg38_1.1_Adult Lady.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 4/Pg38_1.2_Adult Lady.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 4/Pg38_1.3_Adult Lady.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 4/Pg38_1.4_Adult Lady.mp3";
import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import pauseBtn from "../../../assets/Page 01/Right Video Button.svg";
import video3 from "../../../assets/video/reading/grade2-unit4-page38-39reading.mp4";

import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
const Reading_Unit4_Page1 = ({ openPopup }) => {
  const { audioRef, activeId, setActiveId } = useContext(AudioContext);

  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
 const captionsExample = [
  { start: 0.58, end: 4.24, text: "Page 38. Reading. Tom gets in trouble." },
  {
    start: 5.32,
    end: 8.94,
    text: "Tom feels sick. Helen gets the doctor to help him.",
  },
  {
    start: 9.98,
    end: 12.9,
    text: "Helen calls Tom to ask how he feels today.",
  },
  {
    start: 14.32,
    end: 21.26,
    text: "Tom tells Helen he feels fine now. Helen asks Tom to go with her to their art lesson.",
  },
  {
    start: 22.36,
    end: 37.64,
    text: "Tom tells Helen he is busy watching TV. Helen is upset. She tells Tom the art teacher already gave him one warning. The new art teacher is teaching the students how to draw a vase of flowers.",
  },
  {
    start: 38.72,
    end: 50.72,
    text: "Tom remembers the warning. The art teacher can call his mom if he doesn't go. The new art teacher calls to speak to Tom's mom. Tom knows he's in trouble now.",
  },
];
  const clickableAreas = [
    { id: "p3-1",x1: 15.9, y1: 39.4, x2: 51.14, y2: 44.0, sound: sound2 },
    { id: "p3-2",x1: 56.0, y1: 39.1, x2: 93.9, y2: 46.06, sound: sound3 },
    { id: "p3-3",x1: 16.0, y1: 84.0, x2: 52.9, y2: 89.5, sound: sound4 },
    { id: "p3-4",x1: 56.0, y1: 84.5, x2: 93.7, y2: 90.9, sound: sound5 },
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
              </div>
            )
          }
          style={{ overflow: "visible" }}
        >
          <image className="svg-img" href={audioBtn} x="0" y="0" width="90" height="90" />
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
              </div>
            )
          }
          style={{ overflow: "visible" }}
        >
          <image className="svg-img" href={pauseBtn} x="0" y="0" width="90" height="90" />
        </svg>
      </div>
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
};

export default Reading_Unit4_Page1;

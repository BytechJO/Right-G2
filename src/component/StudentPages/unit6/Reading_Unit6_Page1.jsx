import page24 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 56.png";
import React, { useState, useRef } from "react";
import "./Reading_Unit6_Page1.css";
import sound1 from "../../../assets/audio/ClassBook/U 6/pg56-11-adult-lady_gOidhXGA.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 6/Pg56_1.2_Adult Lady.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 6/Pg56_1.3_Adult Lady.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 6/Pg56_1.4_Adult Lady.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 6/Pg57_1.5_Adult Lady.mp3";
import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import pauseBtn from "../../../assets/Page 01/Right Video Button.svg";
import video3 from "../../../assets/video/reading/grade2-unit6-page56-57reading.mp4";

import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
const Reading_Unit6_Page1 = ({ openPopup }) => {
  const { audioRef, activeId, setActiveId } = useContext(AudioContext);

  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
  const captionsExample = [
    {
      start: 0.56,
      end: 11.38,
      text: "Page 56: Reading. Helen likes rice. Helen likes rice with meat, with fish, and with chicken. She eats rice every day.",
    },
    {
      start: 12.479,
      end: 44.559,
      text: "Mom is in the kitchen. It's twelve thirty. She cooks lunch at twelve thirty. Helen is really hungry. She hopes Mom is making rice for lunch. Harley hopes she cooks steak. Hansel hopes Mom cooks fish. Lunch is ready at half past three. Mom calls the children before the food gets cold. Harley likes eggs on top of his steak. He doesn't really like fish or chicken. He wants steak and eggs today.",
    },
    {
      start: 45.599,
      end: 69.739,
      text: "Helen isn't happy at lunchtime. There is no rice with the chicken or fish. Helen doesn't like bread. Hansel likes fish. Fish is his favorite dish. Hansel is very happy at lunchtime.There is rice. Helen, Harley, and Hansel thank Mom for the delicious food. Mom cooked everyone's favorite dish.",
    },
  ];
  const clickableAreas = [
    { id: "p5-1",x1: 15.9, y1: 39.4, x2: 51.14, y2: 44.0, sound: sound2 },
    { id: "p5-2",x1: 56.0, y1: 39.1, x2: 93.9, y2: 44.0, sound: sound3 },
    { id: "p5-3",x1: 16.0, y1: 86.2, x2: 52.9, y2: 94.6, sound: sound4 },
    { id: "p5-4",x1: 56.0, y1: 86.2, x2: 93.7, y2: 91.9, sound: sound5 },
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

export default Reading_Unit6_Page1;

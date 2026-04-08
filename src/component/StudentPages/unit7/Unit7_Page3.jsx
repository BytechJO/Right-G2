import React, { useState, useRef } from "react";
import page_3 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 60.png";
import "./Unit7_Page3.css";
import grammarSound from "../../../assets/audio/ClassBook/U 7/cd41pg60-grammar1-adult-lady_TsMLtlcC.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 7/grammer1-merge1.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 7/Pg60_2.1_Woman.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 7/Pg60_3.1_Girl.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 7/Pg60_4.1_Woman.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 7/Pg60_5.1_Girl.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 7/Pg60_4.2_Woman.mp3";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import pauseBtn from "../../../assets/Page 01/Right Video Button.svg";
import video from "../../../assets/video/grade2-unit7-page60.mp4";
const Unit7_Page3 = ({ openPopup }) => {
  const { audioRef, activeId, setActiveId } = useContext(AudioContext);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const captionsExample = [
    { start: 0.5, end: 4.079, text: "Page 60, exercise one. Write grammar." },
    { start: 5.159, end: 6.059, text: "What time is it?" },
    { start: 7.519, end: 9.039, text: "It's 5:00 in the morning." },
    {
      start: 10.199,
      end: 13.46,
      text: "What time is it? It's 1:00 in the afternoon.",
    },
    {
      start: 14.599,
      end: 22.479,
      text: "Hello. I'd like to book two tickets to London for Monday, August 2nd at 1:00 in the afternoon.",
    },
    {
      start: 22.479,
      end: 25.919,
      text: "Your booking is confirmed. Thank you.",
    },
    {
      start: 25.92,
      end: 32.639,
      text: "Good afternoon. Can I book a ticket for Saturday, August 6th to Cairo at 8:30 in the evening?",
    },
    {
      start: 33.719,
      end: 42.119,
      text: "I'm sorry, there aren't any flights available on that day. There is a flight on August 10th. Can I book you for that day?",
    },
    { start: 43.159, end: 44.459, text: "Yes. Thank you" },
  ];

  const clickableAreas = [
    { id: "pg13-1",x1: 6.86, y1: 9.81, x2: 65.42, y2: 17.88, sound: sound1 },
    { id: "pg13-2",x1: 16.94, y1: 22.14, x2: 55.14, y2: 29.61, sound: sound2 },
    { id: "pg13-3",x1: 55.72, y1: 45.29, x2: 86.17, y2: 50.78, sound: sound3 },
    { id: "pg13-4",x1: 16.75, y1: 55.65, x2: 57.08, y2: 62.96, sound: sound4 },
    { id: "pg13-5",x1: 51.84, y1: 71.95, x2: 93.54, y2: 81.70, sound: sound5 },
    { id: "pg13-6",x1: 19.27, y1: 81.09, x2: 38.27, y2: 84.89, sound: sound6 },
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
        className="headset-icon-CD-unit7-page3-1 hover:scale-110 transition"
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
        className="pauseBtn-icon-CD-unit7-page3-1 hover:scale-110 transition"
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

export default Unit7_Page3;

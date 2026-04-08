import React, { useState, useRef } from "react";
import page_4 from "../../../assets/imgs//Right 2 Unit 3 On a Picnic/Page 25.png";
import "./Unit3_Page4.css";
import grammarSound from "../../../assets/audio/ClassBook/U 3/cd18pg25-grammar2.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 3/pg25-21-marge1.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 3/pg25-22-marge2.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 3/Pg25_3.1_Adult Lady.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 3/Pg25_4.1_Adult Lady.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 3/Pg25_5.1_Boy.mp3";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
import video from "../../../assets/video/grade2-unit3-page25.mp4";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import pauseBtn from "../../../assets/Page 01/Right Video Button.svg";
import AudioWithCaption from "../../AudioWithCaption";

const Unit3_Page4 = ({ openPopup }) => {
  const { audioRef, activeId, setActiveId } = useContext(AudioContext);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const captionsExample = [
  { start: 0.64, end: 6.58, text: "Page 25, exercise two. Write grammar. Can he swim?" },
  { start: 7.64, end: 11.1, text: "No, he can't. Can she swim?" },
  { start: 12.3, end: 14.04, text: "No, she can't." },
  { start: 15.08, end: 16.1, text: "Can it swim?" },
  { start: 17.28, end: 18.92, text: "No, it can't." },
  { start: 20.0, end: 21.06, text: "Can it swim?" },
  { start: 22.4, end: 23.98, text: "No, it can't." },
  { start: 25.06, end: 26.12, text: "Can he sleep?" },
  { start: 27.24, end: 28.8, text: "No, he can't." },
  { start: 29.88, end: 32.96, text: "You can't play the guitar. Stop, please." },
];

  const clickableAreas = [
    { id: "pg6-1",x1: 6.98, y1: 9.35, x2: 32.58, y2: 20.30, sound: sound1 },
    { id: "pg6-2",x1: 66.90, y1: 9.35, x2: 92.69, y2: 20.30, sound: sound2 },
    { id: "pg6-3",x1: 6.01, y1: 27.32, x2: 22.30, y2: 33.26, sound: sound3 },
    { id: "pg6-4",x1: 52.36, y1: 27.47, x2: 69.61, y2: 32.5, sound: sound4 },
    { id: "pg6-5",x1: 42.66, y1: 90.07, x2: 65.8, y2: 95.56, sound: sound5 },


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
    <div className="page1-img-wrapper"
          onClick={handleImageClick}
          style={{ backgroundImage: `url(${page_4})` }}>
   
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
        className="headset-icon-CD-unit3-page4-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() =>
            openPopup(
             "audio", <div
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
              </div>
            )
          }
          style={{ overflow: "visible" }}
        >
          <image className="svg-img" href={audioBtn} x="0" y="0" width="90" height="90" />
        </svg>
      </div>
      <div
        className="pauseBtn-icon-CD-unit3-page4-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() =>
            openPopup(
             "video", <div
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

export default Unit3_Page4;

import React, { useRef, useState } from "react";
import page_6 from "../../../assets/imgs/pages/Right 2 Unit 1 Stellas Family_00001/Right 2 Unit 1 Stellas Family_00006.jpg";
import grammarSound from "../../../assets/audio/ClassBook/U 1/CD3.Pg6_Right Grammar1_Adult Lady.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 1/Pg6_1.1_Adult Lady.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 1/Pg6_1.2_Adult Lady.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 1/Pg6_1.3_Adult Lady.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 1/Pg6_1.4_Adult Lady.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 1/Pg6_2.1_Adult Lady.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 1/Pg6_2.2_Stella.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 1/Pg6_3.2_Stella.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 1/Pg6_4.2_Jack.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 1/Pg6_4.2_Stella.mp3";
import sound10 from "../../../assets/audio/ClassBook/U 1/Pg6_5.1_Adult Lady.mp3";
import sound11 from "../../../assets/audio/ClassBook/U 1/Pg6_5.2_Group-Stella's Family.mp3";
import sound12 from "../../../assets/audio/ClassBook/U 1/Pg6a_3.1_Adult Lady.mp3";
import sound13 from "../../../assets/audio/ClassBook/U 1/Pg6b_3.1_Adult Lady.mp3";
import sound14 from "../../../assets/audio/ClassBook/U 1/Pg6b_4.1_Adult Lady.mp3";
import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import pauseBtn from "../../../assets/Page 01/Right Video Button.svg";
// import video from "./ddddddddddd";
import "./Page6.css"
const Page6 = ({ openPopup }) => {
  const audioRef = useRef(null);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
  const captionsExample = [
    { start: 0, end: 4.05, text: "Page 6, exercise 1. Right grammar. " },
    { start: 4.09, end: 7.17, text: "Hello, I'm Stella. This is John." },
    { start: 7.2, end: 8.15, text: "Hello. " },
    { start: 8.19, end: 9.18, text: "How are you?  " },
    { start: 9.2, end: 11.12, text: "Fine. Thank you." },
    { start: 11.16, end: 13.02, text: "Goodbye, Harley. " },
    { start: 13.06, end: 15.23, text: "Nice to meet you. Nice to meet you." },
    { start: 15.27, end: 17.24, text: "Hello. How are you? " },
    { start: 17.27, end: 18.24, text: "Fine. Thank you." },
  ];

  // 🟩 مناطق مستطيلة (x1,y1,x2,y2)
  const clickableAreas = [
    { x1: 7.0, y1: 10.0, x2: 43.0, y2: 14.0, sound: sound1 },
    { x1: 61.5, y1: 10.0, x2: 75.14, y2: 14.0, sound: sound2 },
    { x1: 7.0, y1: 14.0, x2: 29.0, y2: 18.0, sound: sound3 },
    { x1: 61.5, y1: 14.0, x2: 82.0, y2: 18.0, sound: sound4 },
    { x1: 7.0, y1: 18.0, x2: 30.0, y2: 21.5, sound: sound5 },
    { x1: 61.5, y1: 18.0, x2: 83.0, y2: 21.5, sound: sound6 },
    { x1: 32.0, y1: 28.0, x2: 51.0, y2: 33.5, sound: sound7 },
    { x1: 62.0, y1: 32.0, x2: 71.02, y2: 35.5, sound: sound8 },
    { x1: 6.7, y1: 63.7, x2: 23.5, y2: 67.5, sound: sound9 },
    { x1: 47.4, y1: 65.0, x2: 67.3, y2: 68.6, sound: sound10 },
    { x1: 47.4, y1: 65.0, x2: 67.3, y2: 68.6, sound: sound11 },
    { x1: 47.4, y1: 65.0, x2: 67.3, y2: 68.6, sound: sound12 },
    { x1: 47.4, y1: 65.0, x2: 67.3, y2: 68.6, sound: sound13 },
    { x1: 47.4, y1: 65.0, x2: 67.3, y2: 68.6, sound: sound14 },
  ];
  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
    console.log("X%:", xPercent.toFixed(2), "Y%:", yPercent.toFixed(2));
  };
  const playSound = (soundPath) => {
    if (audioRef.current) {
      audioRef.current.src = soundPath;
      audioRef.current.play();
      setIsPlaying(true);
      setHoveredAreaIndex(null); // إزالة الهايلايت عند بدء الصوت

      audioRef.current.onended = () => {
        setIsPlaying(false);
        setHoveredAreaIndex(null);
        setActiveAreaIndex(null); // مسح الهايلايت بعد انتهاء الصوت
      };
    }
  };

  return (
    <div
      className="page1-img-wrapper"
      onClick={handleImageClick}
      style={{ backgroundImage: `url(${page_6})` }}
    >
   

      {/* رسم المستطيلات التفاعلية */}
      {clickableAreas.map((area, index) => (
        <div
          key={index}
          className={`clickable-area ${
            hoveredAreaIndex === index || activeAreaIndex === index
              ? "highlight"
              : ""
          }`}
          style={{
            position: "absolute",
            left: `${area.x1}%`,
            top: `${area.y1}%`,
            width: `${area.x2 - area.x1}%`,
            height: `${area.y2 - area.y1}%`,
          }}
          onClick={() => {
            setActiveAreaIndex(index); // لتثبيت الهايلايت أثناء الصوت
            playSound(area.sound);
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
        className="headset-icon-CD-page6 hover:scale-110 transition"
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
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
          />
        </svg>
      </div>
      <div
        className="pauseBtn-icon-CD-page6 hover:scale-110 transition"
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
                    display: "block",
                  }}
                >
                  {/* <source src={video} type="video/mp4" /> */}
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
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
          />
        </svg>
      </div>
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
};

export default Page6;

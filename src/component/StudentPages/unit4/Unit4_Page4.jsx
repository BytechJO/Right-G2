import React, { useState, useRef } from "react";
import page_4 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page31.png";
import "./unit4_Page4.css";
import grammarSound from "../../../assets/audio/ClassBook/U 4/cd23pg31-grammar2-adult-lady_lDlkhGMK.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 4/Pg31_3.1_Dad.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 4/Pg31_3.2_Hansel.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 4/Pg31_3.3_Dad.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 4/Pg31_3.4_Helen.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 4/steall and tom.mp3";


import sound9 from "../../../assets/audio/ClassBook/U 4/Pg31_2.1_Adult Lady.mp3";
// import video from "../../../assets/img_unit4/sounds-unit4/p13.mp4";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import pauseBtn from "../../../assets/Page 01/Right Video Button.svg";
import AudioWithCaption from "../../AudioWithCaption";

const Unit4_Page4 = ({ openPopup }) => {
  const audioRef = useRef(null);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
  const captionsExample = [
    { start: 0.52, end: 4.6, text: "Page 31, exercise two. Write grammar." },
    {
      start: 5.68,
      end: 15.6,
      text: "Do you want a doll? Yes, I do. No, I don't. Do you want a ball, Hansel?",
    },
    {
      start: 15.6,
      end: 19.62,
      text: "Yes, I do. I want a blue ball, please.",
    },
    { start: 19.62, end: 21.62, text: "Helen, do you want a ball?" },
    { start: 22.78, end: 25.16, text: "No, I don't. I want a doll." },
    {
      start: 26.18,
      end: 28.78,
      text: "Do you want cookies, Tom? What kind do you want?",
    },
    {
      start: 29.82,
      end: 33.54,
      text: "Yes, give me two of the strawberry and three of the vanilla, please.",
    },
    {
      start: 34.66,
      end: 37.56,
      text: "Tom, do you want all the cookies for yourself?",
    },
    {
      start: 38.66,
      end: 43.58,
      text: "No, I don't. I'm going to share with you, Hansel, Helen, and Harley.",
    },
  ];

  const clickableAreas = [
    { x1: 7.17, y1: 9.81, x2: 93.08, y2: 16.51, sound: sound9 },
    { x1: 11.25, y1: 23.97, x2: 42.66, y2: 27.17, sound: sound1 },
    { x1: 7.56, y1: 36.00, x2: 32.58, y2: 40.88, sound: sound2 },
    { x1: 50.22, y1: 29.00, x2: 79.50, y2: 32.04, sound: sound3 },
    { x1: 63.60, y1: 51.69, x2: 91.14, y2: 55.65, sound: sound4 },
    { x1: 9.5, y1: 84.28, x2: 89.59, y2: 94.18, sound: sound5 },
    // { x1: 55.0, y1: 30.7, x2: 74.1, y2: 33.9, sound: sound6 },
    // { x1: 55.0, y1: 30.7, x2: 74.1, y2: 33.9, sound: sound7 },
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
      style={{ backgroundImage: `url(${page_4})` }}
    >
      {/* <img
        src={page_4}
        style={{ display: "block" }}
        onClick={handleImageClick}
      /> */}
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
        className="headset-icon-CD-unit4-page4-1 hover:scale-110 transition"
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
        className="pauseBtn-icon-CD-unit4-page4-1 hover:scale-110 transition"
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
            width="90"
            height="90"
          />
        </svg>
      </div>
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
};

export default Unit4_Page4;

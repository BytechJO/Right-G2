import React, { useState, useRef } from "react";
import page_4 from "../../../assets/imgs/pages/Right 2 Unit 1 Stellas Family_00001/Right 2 Unit 1 Stellas Family_00085.jpg";
import "./Unit10_Page4.css";
import grammarSound from "../../../assets/audio/ClassBook/U 7/CD42.Pg61_Grammar2_Adult Lady (2).mp3";
import sound1 from "../../../assets/audio/ClassBook/U 5/Pg43_2.1_Adult Lady.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 5/Pg43_2.2_Adult Lady.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 5/Pg43_2.3_Adult Lady.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 5/Pg43_2.4_Adult Lady.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 5/Pg43_2.5_Adult Lady.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 5/Pg43_2.6_Adult Lady.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 5/Pg43_3.1_Adult Lady.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 5/Pg43_4.1_Adult Lady.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 5/Pg43_5.1_Helen.mp3";

// import video from "../../../assets/img_unit5/sounds-unit5/p13.mp4";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import pauseBtn from "../../../assets/Page 01/Right Video Button.svg";
import AudioWithCaption from "../../AudioWithCaption";

const Unit10_Page4 = ({ openPopup }) => {
  const audioRef = useRef(null);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
  const captionsExample = [
    { start: 0, end: 4.07, text: " Page 61, exercise 2. Right Grammar. " },
  ];

  const clickableAreas = [
    { x1: 6.53, y1: 10.4, x2: 23.43, y2: 14.2, sound: sound1 },
    { x1: 54.19, y1: 10.4, x2: 71.5, y2: 14.5, sound: sound2 },
    { x1: 6.53, y1: 15.27, x2: 30.7, y2: 19.4, sound: sound3 },
    { x1: 54.2, y1: 15.27, x2: 78.3, y2: 19.5, sound: sound4 },
    { x1: 6.7, y1: 32.3, x2: 21.8, y2: 36.2, sound: sound5 },
    { x1: 23.3, y1: 25.5, x2: 39.8, y2: 30.7, sound: sound6 },
    { x1: 55.0, y1: 30.7, x2: 74.1, y2: 33.9, sound: sound7 },
    { x1: 55.0, y1: 30.7, x2: 74.1, y2: 33.9, sound: sound8 },
    { x1: 55.0, y1: 30.7, x2: 74.1, y2: 33.9, sound: sound9 },

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
    <div className="page1-img-wrapper"
          onClick={handleImageClick}
          style={{ backgroundImage: `url(${page_4})` }}>
   
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
        className="headset-icon-CD-unit5-page4-1 hover:scale-110 transition"
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
        className="pauseBtn-icon-CD-unit5-page4-1 hover:scale-110 transition"
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
                  {/* <source src={video} type="video/mp4" /> */}
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

export default Unit10_Page4;

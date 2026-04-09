import { useState, useRef } from "react";
import page_1 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 58.png";
import "./Unit7_Page1.css";
import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
import allunit3 from "../../../assets/audio/ClassBook/U 7/unit7-all.mp3";
import Unit7_Page1_Read from "./Unit7_Pag1_Read";
import Unit7_Page1_Vocab from "./Unit7_Page1_Vocab";
import Unit7_Page1_find from "./Unit7_Page1_find";
import sound5 from "../../../assets/audio/ClassBook/U 7/unit7-sound5.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 7/unit7-sound8.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 7/unit7-sound9.mp3";
import sound10 from "../../../assets/audio/ClassBook/U 7/unit7-sound10.mp3";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
const Unit7_Page1 = ({ openPopup }) => {
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
   const { audioRef, activeId, setActiveId } = useContext(AudioContext);
  const captionsExample = [
    { start: 0.459, end: 4.199, text: "Page 58, Unit 7. It's boarding time." },
    {
      start: 5.279,
      end: 18.759,
      text: "Page 58, Unit 7, Vocabulary. 1, airplane. 2, souvenir shop. 3, flight attendant. 4, roll.",
    },
    {
      start: 19.84,
      end: 35.02,
      text: "5, pilot. 6, suitcase. 7, hold. 8, arrival. 9, reception. 10, airport.",
    },
    { start: 36.04, end: 39.02, text: "Page 58, Listen and Read Along." },
    { start: 40.159, end: 42.739, text: "Long O. Boat," },
    { start: 43.759, end: 44.299, text: "snow," },
    { start: 45.34, end: 45.84, text: "home." },
    {
      start: 46.86,
      end: 61.959,
      text: "Page 59. Helen's father is a pilot. Helen's father is a pilot. He flies airplanes. Today, Helen visits Dubai Airport with her father. She sees other people who work at the airport, too.",
    },
    {
      start: 63.0,
      end: 73.72,
      text: "Her father has a flight at a quarter past one in the afternoon. Helen waves goodbye to her dad. Page 59, Listen and Read Along.",
    },
    { start: 74.959, end: 76.119, text: "Long O." },
    { start: 77.279, end: 77.779, text: "Coat," },
    { start: 78.86, end: 79.519, text: "window," },
    { start: 80.619, end: 81.059, text: "note." },
  ];

  const areas = [
    // الصوت الأول – المنطقة الأساسية
    { x1: 86.4, y1: 49.6, sound: 5, isPrimary: true },

    // // الصوت الأول – منطقة إضافية
    { x1: 87.72, y1: 38.65, x2: 97.80, y2: 78.65, sound: 5, isPrimary: false },

  //   // // الصوت الثاني – الأساسية
    { x1: 42.2, y1: 19.9, sound: 8, isPrimary: true },

  //   // // الصوت الثاني – الإضافية
    { x1: 23.73, y1: 20.32, x2: 45.06, y2: 28.08, sound: 8, isPrimary: false },

  //   // // الصوت الثالث – الأساسية
    { x1: 64.8, y1: 62.2, sound: 9, isPrimary: true },

  //   // // الصوت الثالث – الإضافية
    { x1: 57.86, y1: 46.21, x2: 78.02, y2: 72.71, sound: 9, isPrimary: false },
  //   // // الصوت الرابع – الأساسية
    { x1: 13.2, y1: 24.9, sound: 10, isPrimary: true },

  //   // // الصوت الرابع – الإضافية
    { x1: 7.83, y1: 19.10, x2: 21.21, y2: 30.06, sound: 10, isPrimary: false },

];
  const sounds = {
    5: sound5,
    8: sound8,
    9: sound9,
    10: sound10,
  };

  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
    console.log("X%:", xPercent.toFixed(2), "Y%:", yPercent.toFixed(2));
  };
   const playSound = (path, id) => {
    if (!audioRef.current) return;

    // 🔥 وقف أي صوت شغال بأي صفحة
    audioRef.current.pause();
    audioRef.current.currentTime = 0;

    audioRef.current.src = path;
    audioRef.current.play();

    setActiveId(id); // 🔥 مهم للهايلايت

    audioRef.current.onended = () => {
      setActiveId(null);
    };
  };
  return (
    <div
      className="page1-img-wrapper"
      onClick={handleImageClick}
      style={{ backgroundImage: `url(${page_1})` }}
    >
      <audio ref={audioRef} style={{ display: "none" }} />

      {areas.map((area, index) => {
          const isActive = activeId === `p58-${area.sound}`;

        // ============================
        // 1️⃣ المنطقة الأساسية → دائرة تظهر فقط عندما تكون Active
        // ============================
        if (area.isPrimary) {
          return (
            <div
              key={index}
              className={`circle-area ${isActive ? "active" : ""}`}
              style={{
                left: `${area.x1}%`,
                top: `${area.y1}%`,
              }}
             onClick={() => {
                  playSound(sounds[area.sound], `p58-${area.sound}`);
                }}
            ></div>
          );
        }

        // ============================
        // 2️⃣ المناطق الفرعية → مربعات داكنة مخفية ولازم
        //    عند الضغط عليها → تفعّل الدائرة الأساسية
        // ============================
        return (
          <div
            key={index}
            className="clickable-area"
            style={{
              position: "absolute",
              left: `${area.x1}%`,
              top: `${area.y1}%`,
              width: `${area.x2 - area.x1}%`,
              height: `${area.y2 - area.y1}%`,
            }}
            onClick={() => {
                  playSound(sounds[area.sound], `p58-${area.sound}`);
                }}
          ></div>
        );
      })}

      <div
        className="headset-icon-CD-unit7-page1-1 hover:scale-110 transition"
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
                <AudioWithCaption src={allunit3} captions={captionsExample} />
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
        className="click-icon-unit7-page1-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() =>
            openPopup(
              "html",
              <>
                <Unit7_Page1_find />
              </>,
            )
          }
          style={{ overflow: "visible" }}
        >
          <image
            className="svg-img"
            href={arrowBtn}
            x="0"
            y="0"
            width="90"
            height="90"
          />
        </svg>
      </div>
      <div
        className="headset-icon-CD-unit7-page1-2 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() =>
            openPopup(
              "html",
              <>
                <Unit7_Page1_Vocab />
              </>,
            )
          }
          style={{ overflow: "visible" }}
        >
          <image
            className="svg-img"
            href={arrowBtn}
            x="0"
            y="0"
            width="90"
            height="90"
          />
        </svg>
      </div>
      <div
        className="click-icon-unit7-page1-2 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() =>
            openPopup(
              "html",
              <>
                <Unit7_Page1_Read />
              </>,
            )
          }
          style={{ overflow: "visible" }}
        >
          <image
            className="svg-img"
            href={arrowBtn}
            x="0"
            y="0"
            width="90"
            height="90"
          />
        </svg>
      </div>
    </div>
  );
};

export default Unit7_Page1;

import { useState, useRef } from "react";
import page_1 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 28.png";
import "./Unit4_Page1.css";
import Unit4_Page1_find from "./Unit4_Page1_find";
import Unit4_Page1_Vocab from "./Unit4_Page1_Vocab";
import Unit4_Page1_Read from "./Unit4_Pag1_Read";
import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
import allunit4 from "../../../assets/audio/ClassBook/U 4/unit4-all.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 4/unit4-sound1.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 4/unit4-sound2.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 4/unit4-sound3.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 4/unit4-sound4.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 4/unit4-sound5.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 4/unit4-sound6.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 4/unit4-sound7.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 4/unit4-sound8.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 4/unit4-sound9.mp3";
import sound10 from "../../../assets/audio/ClassBook/U 4/unit4-sound10.mp3";
import sound11 from "../../../assets/audio/ClassBook/U 4/unit4-sound11.mp3";
import sound12 from "../../../assets/audio/ClassBook/U 4/unit4-sound12.mp3";
import { TbMessageCircle } from "react-icons/tb";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
const Unit4_Page1 = ({ openPopup }) => {
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { audioRef, activeId, setActiveId } = useContext(AudioContext);
  const captionsExample = [
    {
      start: 0.54,
      end: 9.6,
      text: "Page 28, Unit 4. Helen's uncle is a photographer. Page 28, Unit 4 vocabulary.",
    },
    {
      start: 10.72,
      end: 18.26,
      text: "1, nurse. 2, pilot. 3, grow food.",
    },
    { start: 19.32, end: 21.62, text: "4, taxi driver." },
    { start: 22.68, end: 24.5, text: "5, vet." },
    { start: 25.76, end: 27.72, text: "6, clerk." },
    { start: 28.74, end: 34.48, text: "7, photographer. 8, fix cars." },
    { start: 35.58, end: 37.88, text: "9, police officer." },
    { start: 38.9, end: 40.78, text: "10, farmer." },
    {
      start: 41.82,
      end: 50.7,
      text: "11, mechanic. 12, chef. Page 28, listen and read along.",
    },
    { start: 51.9, end: 52.98, text: "Long A." },
    { start: 54.1, end: 54.6, text: "May," },
    { start: 55.7, end: 62.92, text: "rain, cake. Page 29, My uncle's job." },
    {
      start: 62.92,
      end: 71.9,
      text: "My uncle is a photographer. He takes pictures of animals. His favorite animals are tigers and panthers. I think they are scary.",
    },
    { start: 72.96, end: 76.24, text: "Page 29, listen and read along." },
    { start: 77.34, end: 78.32, text: "Long A." },
    { start: 79.38, end: 79.92, text: "Play," },
    { start: 81.04, end: 83.0, text: "paint, lake." },
  ];

  const areas = [
    // الصوت الأول – المنطقة الأساسية
    { x1: 22.3, y1: 44.4, sound: 1, isPrimary: true },

    // // // الصوت الأول – منطقة إضافية
    { x1: 26.46, y1: 38.75, x2: 31.7, y2: 57.48, sound: 1, isPrimary: false },

    // // // // الصوت الثاني – الأساسية
    { x1: 55.8, y1: 38.35, sound: 2, isPrimary: true },

    // // // // الصوت الثاني – الإضافية
    { x1: 50.7, y1: 25.15, x2: 57.1, y2: 43.01, sound: 2, isPrimary: false },

    // // // // الصوت الثالث – الأساسية
    { x1: 87.9, y1: 33.1, sound: 3, isPrimary: true },

    // // // // الصوت الثالث – الإضافية
    { x1: 86.19, y1: 29.0, x2: 91.23, y2: 32.35, sound: 3, isPrimary: false },
    // // // // الصوت الرابع – الأساسية
    { x1: 66.5, y1: 48.3, sound: 4, isPrimary: true },

    // // // // الصوت الرابع – الإضافية
    { x1: 55.74, y1: 49.25, x2: 70.09, y2: 60.37, sound: 4, isPrimary: false },

    // // // // الصوت الخامس – الأساسية
    { x1: 86.8, y1: 51.2, sound: 5, isPrimary: true },

    // // // // الصوت الخامس – الإضافية
    { x1: 90.26, y1: 48.04, x2: 96.47, y2: 64.33, sound: 5, isPrimary: false },

    // // // // الصوت السادس – الأساسية
    { x1: 36.5, y1: 61.3, sound: 6, isPrimary: true },

    // // // // الصوت السادس – الإضافية
    { x1: 31.31, y1: 63.42, x2: 45.86, y2: 78.8, sound: 6, isPrimary: false },

    // // // // الصوت السابع – الأساسية
    { x1: 63, y1: 73, sound: 7, isPrimary: true },

    // // // // الصوت السابع – الإضافية
    { x1: 57.3, y1: 68.44, x2: 63.5, y2: 82.76, sound: 7, isPrimary: false },

    // // // // الصوت السادس – الأساسية
    { x1: 87, y1: 19.3, sound: 8, isPrimary: true },

    // // // // الصوت السادس – الإضافية
    { x1: 80.37, y1: 19.4, x2: 85.3, y2: 25.8, sound: 8, isPrimary: false },

    // // // // // الصوت السابع – الأساسية
    { x1: 79, y1: 75.5, sound: 9, isPrimary: true },

    // // // // // الصوت السابع – الإضافية
    { x1: 80.95, y1: 71.58, x2: 95.3, y2: 87.33, sound: 9, isPrimary: false },
  ];

  const sounds = {
    1: sound1,
    2: sound2,
    3: sound3,
    4: sound4,
    5: sound5,
    6: sound6,
    7: sound7,
    8: sound10,
    9: sound12,
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
      {/* <img
        src={page_1}
        onClick={handleImageClick}
        style={{ display: "block" }}
      /> */}
      {areas.map((area, index) => {
        const isActive = activeId === `p28-${area.sound}`;

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
                  playSound(sounds[area.sound], `p28-${area.sound}`);
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
                playSound(sounds[area.sound], `p28-${area.sound}`);
              }}
          ></div>
        );
      })}

      <div
        className="headset-icon-CD-unit4-page1-1 hover:scale-110 transition"
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
                <AudioWithCaption src={allunit4} captions={captionsExample} />
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
        className="click-icon-unit4-page1-1 hover:scale-110 transition"
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
                <Unit4_Page1_find />
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
        className="headset-icon-CD-unit4-page1-2 hover:scale-110 transition"
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
                <Unit4_Page1_Vocab />
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
        className="click-icon-unit4-page1-2 hover:scale-110 transition"
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
                <Unit4_Page1_Read />
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

export default Unit4_Page1;

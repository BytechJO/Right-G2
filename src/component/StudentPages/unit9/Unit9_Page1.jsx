import { useState, useRef } from "react";
import page_1 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 76.png";
import "./Unit9_Page1.css";
import Unit9_Page1_Read from "./Unit9_Pag1_Read";
import Unit9_Page1_Vocab from "./Unit9_Page1_Vocab";
import Unit9_Page1_find from "./Unit9_Page1_find";
import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
import allunit3 from "../../../assets/audio/ClassBook/U 7/CD39.Pg58.U7_Intro1.mp3.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 9/unit9-sound1.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 9/unit9-sound2.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 9/unit9-sound3.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 9/unit9-sound4.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 9/unit9-sound5.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 9/unit9-sound6.mp3";


const Unit9_Page1 = ({ openPopup }) => {
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const captionsExample = [
    { start: 0, end: 4.0, text: " Page 58, Unit 7, It’s Boarding Time. " },
  ];

  const areas = [
    // الصوت الأول – المنطقة الأساسية
    { x1: 54.2, y1: 22.4, sound: 1, isPrimary: true },

    // // الصوت الأول – منطقة إضافية
    { x1: 50.68, y1: 12.5, x2: 68.33, y2: 22.91, sound: 1, isPrimary: false },

    // // // الصوت الثاني – الأساسية
    { x1: 27.8, y1: 22.80,  sound: 2, isPrimary: true },

    // // // الصوت الثاني – الإضافية
    { x1: 19.46, y1: 17.88, x2: 43.00, y2: 23.97, sound: 2, isPrimary: false },

    // // // الصوت الثالث – الأساسية
    { x1: 85.4, y1: 44.2,  sound: 4, isPrimary: true },

    // // // الصوت الثالث – الإضافية
    { x1: 77.83, y1: 46.97, x2: 93.73, y2: 63.11, sound: 4, isPrimary: false },
    // // // الصوت الرابع – الأساسية
    { x1: 69.2, y1: 58.2, sound: 3, isPrimary: true },

    // // // الصوت الرابع – الإضافية
    { x1: 69.88, y1: 57.78, x2: 80.74, y2: 69.67, sound: 3, isPrimary: false },

    // // // الصوت الخامس – الأساسية
    { x1: 38.4, y1: 46.2,sound: 5, isPrimary: true },

    // // // الصوت الخامس – الإضافية
    { x1: 33.04, y1: 26.26, x2: 47.38, y2: 54.89, sound: 5, isPrimary: false },

    //     // // الصوت الخامس – الأساسية
    { x1: 69, y1: 24.9,sound: 5, isPrimary: true },

    // // // الصوت الخامس – الإضافية
    { x1: 71.82, y1: 15.44, x2: 87.33, y2: 39.81, sound: 5, isPrimary: false },
  ];
  const sounds = {
    1: sound1,
    2: sound2,
    3: sound3,
    4: sound4,
    5: sound5,
    6: sound6,

  };

  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
    console.log("X%:", xPercent.toFixed(2), "Y%:", yPercent.toFixed(2));
  };
  const playSound = (path) => {
    if (audioRef.current) {
      audioRef.current.src = path;
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
      style={{ backgroundImage: `url(${page_1})` }}
    >
      <audio ref={audioRef} style={{ display: "none" }} />

      {areas.map((area, index) => {
        const isActive = activeAreaIndex === area.sound;

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
                setActiveAreaIndex(area.sound);
                playSound(sounds[area.sound]);
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
              setActiveAreaIndex(area.sound); // 👈 يفعل الدائرة فوق الرقم
              playSound(sounds[area.sound]);
            }}
          ></div>
        );
      })}

      <div
        className="headset-icon-CD-unit9-page1-1 hover:scale-110 transition"
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
        className="click-icon-unit9-page1-1 hover:scale-110 transition"
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
                <Unit9_Page1_find />
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
        className="headset-icon-CD-unit9-page1-2 hover:scale-110 transition"
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
                <Unit9_Page1_Vocab />
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
        className="click-icon-unit9-page1-2 hover:scale-110 transition"
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
                <Unit9_Page1_Read />
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

export default Unit9_Page1;

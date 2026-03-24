import { useState, useRef } from "react";
import page_1 from "../../../assets/imgs/pages/Right 2 Unit 1 Stellas Family_00001/Right 2 Unit 1 Stellas Family_00064.jpg";
import "./Unit8_Page1.css";
import Unit5_Page1_Read from "./Unit8_Pag1_Read";
import Unit5_Page1_Vocab from "./Unit8_Page1_Vocab";
import Unit5_Page1_find from "./Unit8_Page1_find";
import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
import allunit3 from "../../../assets/audio/ClassBook/U 7/CD39.Pg58.U7_Intro1.mp3.mp3";
// import sound1 from "../../../assets/img_unit3/sounds-unit3/U2-01.mp3";
// import sound2 from "../../../assets/img_unit3/sounds-unit3/U2-02.mp3";
// import sound3 from "../../../assets/img_unit3/sounds-unit3/U2-03.mp3";
// import sound4 from "../../../assets/img_unit3/sounds-unit3/U2-04.mp3";
// import sound5 from "../../../assets/img_unit3/sounds-unit3/U2-05.mp3";

const Unit8_Page1 = ({ openPopup }) => {
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const captionsExample = [
    { start: 0, end: 4.0, text: " Page 58, Unit 7, It’s Boarding Time. " },
  ];

  const areas = [
    // الصوت الأول – المنطقة الأساسية
    { x1: 72.8, y1: 26.6, x2: 77.0, y2: 30.0, sound: 1, isPrimary: true },

    // // الصوت الأول – منطقة إضافية
    { x1: 69.5, y1: 25.8, x2: 75.9, y2: 33.4, sound: 1, isPrimary: false },

    // // الصوت الثاني – الأساسية
    { x1: 63.2, y1: 56.35, x2: 67.2, y2: 59.3, sound: 2, isPrimary: true },

    // // الصوت الثاني – الإضافية
    { x1: 62.9, y1: 53.5, x2: 74.8, y2: 59.9, sound: 2, isPrimary: false },

    // // الصوت الثالث – الأساسية
    { x1: 60.8, y1: 47.9, x2: 64.9, y2: 50.9, sound: 3, isPrimary: true },

    // // الصوت الثالث – الإضافية
    { x1: 56.4, y1: 43.5, x2: 72.8, y2: 51.1, sound: 3, isPrimary: false },
    // // الصوت الرابع – الأساسية
    { x1: 88.2, y1: 11.45, x2: 92.1, y2: 14.4, sound: 4, isPrimary: true },

    // // الصوت الرابع – الإضافية
    { x1: 23.17, y1: 11.5, x2: 99.4, y2: 20.5, sound: 4, isPrimary: false },

    // // الصوت الخامس – الأساسية
    { x1: 13.4, y1: 23.7, x2: 17.3, y2: 26.7, sound: 5, isPrimary: true },

    // // الصوت الخامس – الإضافية
    { x1: 1.0, y1: 11.06, x2: 16.9, y2: 28.5, sound: 5, isPrimary: false },
  ];
  // const sounds = {
  //   1: sound1,
  //   2: sound2,
  //   3: sound3,
  //   4: sound4,
  //   5: sound5,

  // };

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
              // playSound(sounds[area.sound]);
            }}
          ></div>
        );
      })}

      <div
        className="headset-icon-CD-unit5-page1-1 hover:scale-110 transition"
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
        className="click-icon-unit5-page1-1 hover:scale-110 transition"
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
                <Unit5_Page1_find />
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
        className="headset-icon-CD-unit5-page1-2 hover:scale-110 transition"
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
                <Unit5_Page1_Vocab />
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
        className="click-icon-unit5-page1-2 hover:scale-110 transition"
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
                <Unit5_Page1_Read />
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

export default Unit8_Page1;

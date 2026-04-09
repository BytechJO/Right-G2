import { useState, useRef } from "react";
import page_1 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 64.png";
import "./Unit8_Page1.css";
import Unit8_Page1_Read from "./Unit8_Pag1_Read";
import Unit8_Page1_Vocab from "./Unit8_Page1_Vocab";
import Unit8_Page1_find from "./Unit8_Page1_find";
import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
import allunit3 from "../../../assets/audio/ClassBook/U 8/unit8-all.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 8/unit8-sound1.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 8/unit8-sound2.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 8/unit8-sound3.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 8/unit8-sound4.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 8/unit8-sound5.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 8/unit8-sound6.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 8/unit8-sound7.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 8/unit8-sound8.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 8/unit8-sound9.mp3";
import sound10 from "../../../assets/audio/ClassBook/U 8/unit8-sound10.mp3";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
const Unit8_Page1 = ({ openPopup }) => {
    const { audioRef, activeId, setActiveId } = useContext(AudioContext);
 const captionsExample = [
  { start: 0.579, end: 4.699, text: "Page 64, Unit 8. It's shopping time." },
  { start: 5.739, end: 8.460, text: "Page 64, Unit 8 vocabulary." },
  { start: 9.819, end: 34.219, text: "1: pay. 2: find. 3: cap. 4: jacket. 5: shorts. 6: tie. 7: socks. 8: closet. 9: dress. 10: clothing store." },
  { start: 35.239, end: 38.179, text: "Page 64. Listen and read along." },
  { start: 39.319, end: 40.399, text: "Long U." },
  { start: 41.479, end: 42.079, text: "Blue." },
  { start: 43.099, end: 43.779, text: "Glue." },
  { start: 44.819, end: 51.340, text: "Sue. Page 65. What do you have in your closet?" },
  { start: 51.340, end: 60.559, text: "I have a black jacket and blue jeans in my closet. I also have a green cap for hot days. I don't have a T-shirt or a tie." },
  { start: 60.559, end: 71.099, text: "That's great, Hansel. I have a green dress and a white T-shirt. I also have a pink hat and blue shoes. The blue shoes are my favorite." },
  { start: 72.159, end: 74.279, text: "I don't have a skirt or a scarf." },
  { start: 75.339, end: 78.279, text: "Page 65. Listen and read along." },
  { start: 79.459, end: 80.059, text: "Long" },
  { start: 81.639, end: 85.220, text: "U. Tune. June. Tube" }
];

  const areas = [
    // الصوت الأول – المنطقة الأساسية
    { x1: 22.9, y1: 24.3, sound: 1, isPrimary: true },

    // // الصوت الأول – منطقة إضافية
    { x1: 21.7, y1: 20.81, x2: 32.07, y2: 32.81, sound: 1, isPrimary: false },

    // // // الصوت الثاني – الأساسية
    { x1: 30.2, y1: 51.35, sound: 2, isPrimary: true },

    // // // الصوت الثاني – الإضافية
    { x1: 32.84, y1: 48.19, x2: 41.57, y2: 60.98, sound: 2, isPrimary: false },

    // // // الصوت الثالث – الأساسية
    { x1: 63.8, y1: 15.9, sound: 3, isPrimary: true },

    // // // الصوت الثالث – الإضافية
    { x1: 65.61, y1: 14.68, x2: 72.21, y2: 16.66, sound: 3, isPrimary: false },
    // // // الصوت الرابع – الأساسية
    { x1: 81.2, y1: 17.8, sound: 4, isPrimary: true },

    // // // الصوت الرابع – الإضافية
    { x1: 75.51, y1: 14.68, x2: 81.51, y2: 22.60, sound: 4, isPrimary: false },

    // // // الصوت الخامس – الأساسية
    { x1: 71, y1: 33.5, sound: 5, isPrimary: true },

    // // // الصوت الخامس – الإضافية
    { x1: 65.03, y1: 27.93, x2: 82.48, y2: 32.50, sound: 5, isPrimary: false },

    // // الصوت الأول – المنطقة الأساسية
    { x1: 48.8, y1: 39.6, sound: 6, isPrimary: true },

    // // // الصوت الأول – منطقة إضافية
    { x1: 50.68, y1: 35.85, x2: 60.38, y2: 45.90, sound: 6, isPrimary: false },

    // // // الصوت الثاني – الأساسية
    { x1: 57.7, y1: 53, sound: 7, isPrimary: true },

    // // // الصوت الثاني – الإضافية
    { x1: 59.02, y1: 48.65, x2: 64.06, y2: 55.96, sound: 7, isPrimary: false },

    // // // الصوت الثالث – الأساسية
    { x1: 76.4, y1: 24.2, sound: 8, isPrimary: true },

    // // // الصوت الثالث – الإضافية
    { x1: 72.98, y1: 22.60, x2: 84.03, y2: 28.08, sound: 8, isPrimary: false },
    // // // الصوت الرابع – الأساسية
    { x1: 70, y1: 66, sound: 9, isPrimary: true },

    // // // الصوت الرابع – الإضافية
    { x1: 66.19, y1: 61.44, x2: 96.06, y2: 76.36, sound: 9, isPrimary: false },

    // // // الصوت الخامس – الأساسية
    { x1: 47.4, y1: 19.5, sound: 10, isPrimary: true },

    // // // الصوت الخامس – الإضافية
    { x1: 43.51, y1: 13.16, x2: 54.56, y2: 28.54, sound: 10, isPrimary: false },
  ];
  const sounds = {
    1: sound1,
    2: sound2,
    3: sound3,
    4: sound4,
    5: sound5,
    6: sound6,
    7: sound7,
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
        const isActive = activeId === `p64-${area.sound}`;


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
                  playSound(sounds[area.sound], `p64-${area.sound}`);
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
                  playSound(sounds[area.sound], `p64-${area.sound}`);
                }}
          ></div>
        );
      })}

      <div
        className="headset-icon-CD-unit8-page1-1 hover:scale-110 transition"
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
        className="click-icon-unit8-page1-1 hover:scale-110 transition"
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
                <Unit8_Page1_find />
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
        className="headset-icon-CD-unit8-page1-2 hover:scale-110 transition"
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
                <Unit8_Page1_Vocab />
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
        className="click-icon-unit8-page1-2 hover:scale-110 transition"
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
                <Unit8_Page1_Read />
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

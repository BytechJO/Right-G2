import { useState, useRef } from "react";
import page_1 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 10.png";
import "./Unit2_Page1.css";
import Unit2_Page1_find from "./Unit2_Page1_find";
import Unit2_Page1_Vocab from "./Unit2_Page1_Vocab";
import Unit2_Page1_Read from "./Unit2_Pag1_Read";
import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
import allUnit2 from "../../../assets/audio/ClassBook/U 2/unit2-All.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 2/sound1-unit2.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 2/sound2-unit2.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 2/sound4-unit2.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 2/sound5-unit2.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 2/sound8-unit2.mp3";
import sound10 from "../../../assets/audio/ClassBook/U 2/sound10-unit2.mp3";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
const Unit2_Page1 = ({ openPopup }) => {
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { audioRef, activeId, setActiveId } = useContext(AudioContext);

  const captionsExample = [
    { start: 0.5, end: 4.67, text: "Page 10, Unit 2. A Day at the Park." },
    { start: 5.72, end: 8.56, text: "Page 10, Unit 2, Vocabulary." },
    { start: 10.4, end: 11.8, text: "1. Duck." },
    { start: 12.82, end: 14.47, text: "2. Swim." },
    { start: 15.54, end: 20.38, text: "3. Bird. 4. Sun." },
    { start: 21.52, end: 23.39, text: "5. Cloud." },
    { start: 24.78, end: 26.45, text: "6. Pink." },
    { start: 27.92, end: 29.6, text: "7. Blue." },
    { start: 30.9, end: 32.68, text: "8. Flower." },
    { start: 33.92, end: 35.62, text: "9. Fly." },
    { start: 36.8, end: 38.57, text: "10. Pond." },
    { start: 39.64, end: 43.02, text: "Page 10. Listen and read along." },
    { start: 44.6, end: 47.75, text: "C, Q. Cat." },
    { start: 48.8, end: 52.18, text: "Page 11. Listen and read along." },
    {
      start: 53.34,
      end: 66.79,
      text: "Dear diary, it was fun at the park. These are pictures of our day. This is a butterfly. That is a bird. These are ducks in the pond. Those are my friends.",
    },
    { start: 66.8, end: 69.58, text: "Page 11. At the park." },
    { start: 71.06, end: 74.83, text: "C, K, X. Clock, queen, fox." },
  ];

  const areas = [
    // الصوت الأول – المنطقة الأساسية
    { x1: 23.8, y1: 31.6, sound: 1, isPrimary: true },

    // // الصوت الأول – منطقة إضافية
    { x1: 25.3, y1: 27.78, x2: 32.48, y2: 30.98, sound: 1, isPrimary: false },

    // // الصوت الثاني – الأساسية
    { x1: 30.6, y1: 37.7, sound: 2, isPrimary: true },

    // // الصوت الثاني – الإضافية
    { x1: 31.48, y1: 31.28, x2: 41.4, y2: 36.16, sound: 2, isPrimary: false },

    // // الصوت الثالث – الأساسية
    { x1: 63, y1: 19.8, sound: 3, isPrimary: true },

    // // الصوت الثالث – الإضافية
    { x1: 49.15, y1: 15.75, x2: 61.95, y2: 25.04, sound: 3, isPrimary: false },
    // // الصوت الرابع – الأساسية
    { x1: 31.2, y1: 16.6, sound: 4, isPrimary: true },

    // // الصوت الرابع – الإضافية
    { x1: 23.17, y1: 13.5, x2: 43.92, y2: 16.51, sound: 4, isPrimary: false },

    // // الصوت الخامس – الأساسية
    { x1: 68.8, y1: 62.4, sound: 5, isPrimary: true },

    // // الصوت الخامس – الإضافية
    { x1: 71.45, y1: 59.61, x2: 88.32, y2: 73.93, sound: 5, isPrimary: false },
    // // الصوت السادس  – الأساسية
    { x1: 7.9, y1: 27.3, sound: 6, isPrimary: true },

    // // الصوت الخامس – الإضافية
    { x1: 3.19, y1: 24.73, x2: 16.9, y2: 28.5, sound: 6, isPrimary: false },
  ];
  const sounds = {
    1: sound1,
    2: sound2,
    3: sound4,
    4: sound5,
    5: sound8,
    6: sound10,
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
        const isActive = activeId === `p10-${area.sound}`;

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
  playSound(sounds[area.sound], `p10-${area.sound}`);
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
  playSound(sounds[area.sound], `p10-${area.sound}`);
}}
          ></div>
        );
      })}

      <div
        className="headset-icon-CD-unit2-page1-1 hover:scale-110 transition"
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
                <AudioWithCaption src={allUnit2} captions={captionsExample} />
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
        className="click-icon-unit2-page1-1 hover:scale-110 transition"
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
                <Unit2_Page1_find />
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
        className="headset-icon-CD-unit2-page1-2 hover:scale-110 transition"
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
                <Unit2_Page1_Vocab />
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
        className="click-icon-unit2-page1-2 hover:scale-110 transition"
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
                <Unit2_Page1_Read />
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

export default Unit2_Page1;

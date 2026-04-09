import { useState, useRef } from "react";
import page_1 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 82.png";
import "./Unit10_Page1.css";
import Unit10_Page1_Read from "./Unit10_Pag1_Read";
import Unit10_Page1_Vocab from "./Unit10_Page1_Vocab";
import Unit10_Page1_find from "./Unit10_Page1_find";
import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
import allunit3 from "../../../assets/audio/ClassBook/U 10/unit10-all.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 10/unit10-sound1.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 10/unit10-sound2.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 10/unit10-sound3.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 10/unit10-sound4.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 10/unit10-sound5.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 10/unit10-sound6.mp3";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
const Unit10_Page1 = ({ openPopup }) => {
   const { audioRef, activeId, setActiveId } = useContext(AudioContext);

const captionsExample = [
  { start: 0.599, end: 8.019, text: "Page 82, unit 10. At our home. Page 82, unit 10 vocabulary." },
  { start: 9.179, end: 16.279, text: "1, putting on a jacket. 2, taking a shower. 3, bathroom." },
  { start: 17.319, end: 19.599, text: "4, watching TV." },
  { start: 20.619, end: 22.359, text: "5, reading." },
  { start: 23.399, end: 25.219, text: "6, bedroom." },
  { start: 26.420, end: 34.399, text: "7, swinging. 8, yard. 9, kicking. 10," },
  { start: 35.459, end: 40.379, text: "watering the flowers. Page 82, listen and read along." },
  { start: 41.479, end: 42.399, text: "Short E." },
  { start: 43.479, end: 43.939, text: "Net." },
  { start: 45.059, end: 51.099, text: "Nest. Egg. Page 83. This is what we do at home." },
  { start: 52.139, end: 74.619, text: "Stella, John, Sarah, and Jack are in the yard in front of the house. Stella is watering the flowers. Sarah is swinging on the swing set. John is riding his bike. Jack is kicking his ball. What is Dad doing? He is watching from the window. Page 83, listen and read along." },
  { start: 75.639, end: 79.339, text: "Long E. Eat. Green." },
  { start: 80.519, end: 80.979, text: "Seal" }
];
  const areas = [
    // الصوت الأول – المنطقة الأساسية
    { x1: 60, y1: 30.2, sound: 1, isPrimary: true },

    // // الصوت الأول – منطقة إضافية
    { x1: 63.67, y1: 25.19, x2: 72.98, y2: 38.29, sound: 1, isPrimary: false },

    // // // الصوت الثاني – الأساسية
    { x1: 32.7, y1: 52, sound: 2, isPrimary: true },

    // // // الصوت الثاني – الإضافية
    { x1: 29.16, y1: 48.34, x2: 42.15, y2: 58.39, sound: 2, isPrimary: false },

    // // // الصوت الثالث – الأساسية
    { x1: 49.2, y1: 49.7, sound: 3, isPrimary: true },

    // // // الصوت الثالث – الإضافية
    { x1: 47.19, y1: 48.19, x2: 54.56, y2: 60.37, sound: 3, isPrimary: false },
    // // // الصوت الرابع – الأساسية
    { x1: 71.4, y1: 52.2,  sound: 4, isPrimary: true },

    // // // الصوت الرابع – الإضافية
    { x1: 60.76, y1: 47.27, x2: 87.14, y2: 60.83, sound: 4, isPrimary: false },

    // // // الصوت الخامس – الأساسية
    { x1: 42, y1: 73.7,  sound: 5, isPrimary: true },

    // // // الصوت الخامس – الإضافية
    { x1: 30.90, y1: 66.62, x2: 49.91, y2: 78.95, sound: 5, isPrimary: false },

    //   // // الصوت الخامس – الأساسية
    { x1: 80.4, y1: 69.5,  sound: 6, isPrimary: true },

    // // // الصوت الخامس – الإضافية
    { x1: 59.80, y1: 67.84, x2: 89.66, y2: 79.40, sound: 6, isPrimary: false },
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
          const isActive = activeId === `p82-${area.sound}`;

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
                  playSound(sounds[area.sound], `p82-${area.sound}`);
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
                  playSound(sounds[area.sound], `p82-${area.sound}`);
                }}
          ></div>
        );
      })}

      <div
        className="headset-icon-CD-unit10-page1-1 hover:scale-110 transition"
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
        className="click-icon-unit10-page1-1 hover:scale-110 transition"
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
                <Unit10_Page1_find />
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
        className="headset-icon-CD-unit10-page1-2 hover:scale-110 transition"
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
                <Unit10_Page1_Vocab />
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
        className="click-icon-unit10-page1-2 hover:scale-110 transition"
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
                <Unit10_Page1_Read />
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

export default Unit10_Page1;

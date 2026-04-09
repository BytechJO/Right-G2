import { useState, useRef } from "react";
import page_1 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 46.png";
import "./Unit6_Page1.css";
import Unit6_Page1_find from "./Unit6_Page1_find";
import Unit6_Page1_Vocab from "./Unit6_Page1_Vocab";
import Unit6_Page1_Read from "./Unit6_Page1_Read";
import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
import allunit4 from "../../../assets/audio/ClassBook/U 6/unit6-all.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 6/unit6-sound1.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 6/unit6-sound2.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 6/unit6-sound3.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 6/unit6-sound4.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 6/unit6-sound5.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 6/unit6-sound6.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 6/unit6-sound7.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 6/unit6-sound8.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 6/unit6-sound9.mp3";
import sound10 from "../../../assets/audio/ClassBook/U 6/unit6-sound10.mp3";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
const Unit6_Page1 = ({ openPopup }) => {
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { audioRef, activeId, setActiveId } = useContext(AudioContext);
  const captionsExample = [
    {
      start: 0.599,
      end: 8.3,
      text: "Page 46, Unit 6. Helen's Day. Page 46, Unit 6 vocabulary.",
    },
    {
      start: 9.599,
      end: 20.819,
      text: "1, get up. 2, make the bed. 3, brush teeth. 4, eat breakfast.",
    },
    { start: 22.899, end: 24.959, text: "5, go to school." },
    { start: 26.239, end: 28.539, text: "6, have a class." },
    { start: 29.599, end: 31.599, text: "7, go home." },
    { start: 32.739, end: 34.639, text: "8, eat lunch." },
    {
      start: 35.68,
      end: 44.68,
      text: "9, do homework. 10, go to sleep. Page 46, listen and read along.",
    },
    { start: 45.7, end: 46.899, text: "Long I." },
    { start: 47.939, end: 51.419, text: "Bike. Five. Kite." },
    { start: 52.539, end: 56.499, text: "Page 47, Helen's Diary." },
    {
      start: 56.5,
      end: 74.619,
      text: "This is what I do every day. I get up at 6:00. I eat my breakfast at 7:30. I go to school at 8:00. I learn many things in class. I go home at 2:00 in the afternoon. I eat my lunch at 3:00. I go to sleep at 9:00.",
    },
    { start: 74.619, end: 77.939, text: "Page 47, listen and read along." },
    { start: 79.099, end: 80.319, text: "Long I." },
    { start: 81.4, end: 81.919, text: "Light." },
    { start: 83.04, end: 85.139, text: "Night. Tight." },
  ];

  const areas = [
    // الصوت الأول – المنطقة الأساسية
    { x1: 26.1, y1: 49.6, sound: 1, isPrimary: true },

    // // الصوت الأول – منطقة إضافية
    { x1: 31.87, y1: 47.12, x2: 43.89, y2: 62.66, sound: 1, isPrimary: false },

    //   // // الصوت الثاني – الأساسية
    { x1: 45.6, y1: 29.8, sound: 2, isPrimary: true },

    //   // // الصوت الثاني – الإضافية
    { x1: 34.78, y1: 25.49, x2: 53.2, y2: 39.81, sound: 2, isPrimary: false },

    //   // // الصوت الثالث – الأساسية
    { x1: 49.8, y1: 50.9, sound: 3, isPrimary: true },

    //   // // الصوت الثالث – الإضافية
    { x1: 48.74, y1: 48.04, x2: 66.78, y2: 61.29, sound: 3, isPrimary: false },
    //   // // الصوت الرابع – الأساسية
    { x1: 73.2, y1: 70, sound: 4, isPrimary: true },

    //   // // الصوت الرابع – الإضافية
    { x1: 60.96, y1: 66.92, x2: 76.47, y2: 81.09, sound: 4, isPrimary: false },

    //   // // الصوت الخامس – الأساسية
    { x1: 74.4, y1: 50.7, sound: 5, isPrimary: true },

    //   // // الصوت الخامس – الإضافية
    { x1: 73.56, y1: 47.43, x2: 91.98, y2: 61.9, sound: 5, isPrimary: false },

    //   // // الصوت الخامس – الأساسية
    { x1: 91.8, y1: 26.3, sound: 6, isPrimary: true },

    //   // // الصوت الخامس – الإضافية
    { x1: 86.75, y1: 27.93, x2: 98.19, y2: 40.88, sound: 6, isPrimary: false },
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
      {/* <img
        src={page_1}
        onClick={handleImageClick}
        style={{ display: "block" }}
      /> */}
      {areas.map((area, index) => {
      const isActive = activeId === `p46-${area.sound}`;

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
                  playSound(sounds[area.sound], `p46-${area.sound}`);
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
                  playSound(sounds[area.sound], `p46-${area.sound}`);
                }}
          ></div>
        );
      })}

      <div
        className="headset-icon-CD-unit6-page1-1 hover:scale-110 transition"
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
        className="click-icon-unit6-page1-1 hover:scale-110 transition"
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
                <Unit6_Page1_find />
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
        className="headset-icon-CD-unit6-page1-2 hover:scale-110 transition"
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
                <Unit6_Page1_Vocab />
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
        className="click-icon-unit6-page1-2 hover:scale-110 transition"
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
                <Unit6_Page1_Read />
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

export default Unit6_Page1;

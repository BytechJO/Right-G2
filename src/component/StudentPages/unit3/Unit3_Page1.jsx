import { useState, useRef } from "react";
import page_1 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 22.png";
import "./Unit3_Page1.css";
import Unit3_Page1_Read from "./Unit3_Pag1_Read";
import Unit3_Page1_Vocab from "./Unit3_Page1_Vocab";
import Unit3_Page1_find from "./Unit3_Page1_find";
import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
import allunit3 from "../../../assets/audio/ClassBook/U 3/unit3-all.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 3/unit3-sound1.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 3/unit3-sound2.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 3/unit3-sound3.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 3/unit3-sound4.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 3/unit3-sound5.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 3/unit3-sound6.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 3/unit3-sound7.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 3/unit3-sound8.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 3/unit3-sound9.mp3";
import sound10 from "../../../assets/audio/ClassBook/U 3/unit3-sound10.mp3";
import sound11 from "../../../assets/audio/ClassBook/U 3/unit3-sound11.mp3";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
const Unit3_Page1 = ({ openPopup }) => {
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
 const { audioRef, activeId, setActiveId } = useContext(AudioContext);
  const captionsExample = [
    {
      start: 0.46,
      end: 8.58,
      text: "Page 22, Unit 3. On a picnic. Page 22, Unit 3, Vocabulary.",
    },
    { start: 9.8, end: 11.3, text: "1, swim." },
    { start: 12.42, end: 14.06, text: "2, kite." },
    { start: 15.2, end: 20.1, text: "3, sandwich. 4, picnic table." },
    { start: 21.1, end: 23.14, text: "5, play the drum." },
    { start: 24.18, end: 25.94, text: "6, drum." },
    { start: 27.06, end: 29.3, text: "7, take a photo." },
    { start: 30.44, end: 32.38, text: "8, ride a bike." },
    { start: 33.5, end: 35.34, text: "9, paint." },
    { start: 36.48, end: 38.4, text: "10, park." },
    {
      start: 39.46,
      end: 45.88,
      text: "11, bench. Page 22. Listen and read along.",
    },
    { start: 46.92, end: 47.28, text: "J." },
    { start: 48.38, end: 48.96, text: "Jacket," },
    { start: 49.98, end: 50.52, text: "jam," },
    { start: 51.62, end: 57.36, text: "jet. Page 23. People at the park." },
    {
      start: 57.36,
      end: 62.84,
      text: "The boy is watching his mom make a sandwich. A girl is riding a bike.",
    },
    {
      start: 63.9,
      end: 74.12,
      text: "The boy can't fly a kite. The man can play the drum. I can see a boy swimming. The man with a camera is taking a photo.",
    },
    { start: 75.24, end: 79.02, text: "Page 23. Listen and read along." },
    { start: 81.84, end: 82.4, text: "Y. Yellow," },
    { start: 83.5, end: 84.12, text: "yogurt," },
    { start: 85.16, end: 85.82, text: "yo-yo." },
  ];

  const areas = [
    // الصوت الأول – المنطقة الأساسية
    { x1: 24.8, y1: 34.6, sound: 1, isPrimary: true },

    // // // الصوت الأول – منطقة إضافية
    { x1: 30.54, y1: 30.67, x2: 34.41, y2: 37.22, sound: 1, isPrimary: false },

    // // // الصوت الثاني – الأساسية
    { x1: 57.8, y1: 57.35, sound: 2, isPrimary: true },

    // // // الصوت الثاني – الإضافية
    { x1: 50.70, y1: 55.5, x2: 56.91, y2: 59.9, sound:2, isPrimary: false },

    // // // الصوت الثالث – الأساسية
    { x1: 65.9, y1: 63.5, sound: 3, isPrimary: true },

    // // // الصوت الثالث – الإضافية
    { x1: 58.27, y1: 62.22, x2: 76.88, y2: 64.94, sound: 3, isPrimary: false },
    // // // الصوت الرابع – الأساسية
    { x1: 90.9, y1: 51.8, sound: 4, isPrimary: true },

    // // // الصوت الرابع – الإضافية
    { x1: 78.82, y1: 53.37, x2: 93.95, y2: 76.36, sound: 4, isPrimary: false },

    // // // الصوت الخامس – الأساسية
    { x1: 74.4, y1: 37.5, sound: 5, isPrimary: true },

    // // // الصوت الخامس – الإضافية
    { x1: 71.84, y1: 25.49, x2: 95.11, y2: 48.5, sound: 5, isPrimary: false },

    // // // الصوت السادس – الأساسية
    { x1: 33.2, y1: 50.3, sound: 6, isPrimary: true },

    // // // الصوت السادس – الإضافية
    { x1: 28.98, y1: 46.36, x2: 39.65, y2: 55.50, sound: 6, isPrimary: false },

    // // // الصوت السابع – الأساسية
    { x1: 56.4, y1: 70, sound: 7, isPrimary: true },

    // // // الصوت السابع – الإضافية
    { x1: 52.84, y1: 69.36, x2: 66.99, y2: 75.15, sound: 7, isPrimary: false },
  ];
  const sounds = {
    1: sound1,
    2: sound3,
    3: sound4,
    4: sound7,
    5: sound9,
    6: sound10,
    7: sound11,
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
         const isActive = activeId === `p22-${area.sound}`;

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
  playSound(sounds[area.sound], `p22-${area.sound}`);
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
  playSound(sounds[area.sound], `p22-${area.sound}`);
}}
          ></div>
        );
      })}

      <div
        className="headset-icon-CD-unit3-page1-1 hover:scale-110 transition"
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
        className="click-icon-unit3-page1-1 hover:scale-110 transition"
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
                <Unit3_Page1_find />
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
        className="headset-icon-CD-unit3-page1-2 hover:scale-110 transition"
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
                <Unit3_Page1_Vocab />
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
        className="click-icon-unit3-page1-2 hover:scale-110 transition"
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
                <Unit3_Page1_Read />
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

export default Unit3_Page1;

import { useState, useRef } from "react";
import page_1 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 40.png";
import "./Unit5_Page1.css";
import Unit5_Page1_Read from "./Unit5_Pag1_Read";
import Unit5_Page1_Vocab from "./Unit5_Page1_Vocab";
import Unit5_Page1_find from "./Unit5_Page1_find";
import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
import allunit3 from "../../../assets/audio/ClassBook/U 5/unit5-all.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 5/unit5-sound1.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 5/unit5-sound2.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 5/unit5-sound3.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 5/unit5-sound4.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 5/unit5-sound5.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 5/unit5-sound6.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 5/unit5-sound7.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 5/unit5-sound8.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 5/unit5-sound9.mp3";
import sound10 from "../../../assets/audio/ClassBook/U 5/unit5-sound10.mp3";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
const Unit5_Page1 = ({ openPopup }) => {
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
   const { audioRef, activeId, setActiveId } = useContext(AudioContext);
  const captionsExample = [
    {
      start: 0.359,
      end: 8.599,
      text: "Page 40, Unit 5. Yummy! I like it. Page 40, Unit 5, Vocabulary.",
    },
    {
      start: 9.859,
      end: 16.279,
      text: "1, kitchen. 2, carry. 3, fruit.",
    },
    { start: 17.34, end: 19.019, text: "4, meat." },
    { start: 20.059, end: 21.799, text: "5, fish." },
    { start: 22.92, end: 24.84, text: "6, rice." },
    { start: 25.939, end: 27.659, text: "7, chicken." },
    { start: 28.76, end: 30.639, text: "8, happy." },
    {
      start: 31.699,
      end: 45.679,
      text: "9, look. 10, tablecloth. Page 40, Listen and Read Along. Long E. Bee, feet,",
    },
    { start: 46.7, end: 51.18, text: "sleep. Page 41, Our Favorite Foods." },
    { start: 52.199, end: 53.899, text: "Tom and I are at a restaurant." },
    {
      start: 55.159,
      end: 73.479,
      text: "Tom likes rice, meat, carrots, apple juice, and ice cream. He doesn't like fish, eggs, or milk. I like ice cream. Rice is my favorite dish. I also like bananas and milk. I don't like carrots, grapes, or apple juice.",
    },
    { start: 74.519, end: 77.959, text: "Page 41, Listen and Read Along." },
    { start: 79.08, end: 80.159, text: "Long E." },
    { start: 81.199, end: 84.4, text: "Meat, read, tea" },
  ];

  const areas = [
    // الصوت الأول – المنطقة الأساسية
    { x1: 46.9, y1: 46.2, sound: 1, isPrimary: true },

    // // الصوت الأول – منطقة إضافية
    { x1: 49.13, y1: 44.69, x2: 63.29, y2: 53.52, sound: 1, isPrimary: false },

  //   // // الصوت الثاني – الأساسية
    { x1: 88.2, y1: 50.2, sound: 2, isPrimary: true },

  //   // // الصوت الثاني – الإضافية
    { x1: 75.11, y1: 49.10, x2: 94.89, y2: 52.00, sound: 2, isPrimary: false },

  //   // // الصوت الثالث – الأساسية
    { x1: 77.5, y1: 54.5, sound: 3, isPrimary: true },

  //   // // الصوت الثالث – الإضافية
    { x1: 64.26, y1: 53.21, x2: 82.68, y2: 56.26, sound: 3, isPrimary: false },
  //   // // الصوت الرابع – الأساسية
    { x1: 76.8, y1: 24.2, sound: 5, isPrimary: true },

  //   // // الصوت الرابع – الإضافية
    { x1: 79.38, y1: 21.84, x2: 84.23, y2: 41.49, sound: 5, isPrimary: false },

  //   // // الصوت الخامس – الأساسية
    { x1: 88.4, y1: 44.7, sound: 4, isPrimary: true },

  //   // // الصوت الخامس – الإضافية
    { x1: 77.64, y1: 43.01, x2: 93.54, y2: 47.88, sound: 4, isPrimary: false },

  //   // // الصوت الخامس – الأساسية
    { x1: 66.8, y1: 63.5, sound: 6, isPrimary: true },

  //   // // الصوت الخامس – الإضافية
    { x1: 60.76, y1: 58.70, x2: 82.48, y2: 68.44, sound: 6, isPrimary: false },
  ];
  const sounds = {
    1: sound3,
    2: sound5,
    3: sound6,
    4: sound7,
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

      {areas.map((area, index) => {
const isActive = activeId === `p40-${area.sound}`;

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
                  playSound(sounds[area.sound], `p40-${area.sound}`);
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
                  playSound(sounds[area.sound], `p40-${area.sound}`);
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

export default Unit5_Page1;

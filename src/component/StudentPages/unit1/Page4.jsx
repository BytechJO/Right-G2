import React, { useState, useRef, useEffect } from "react";
import page4 from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 4.png";
import allUnitSound from "../../../assets/audio/ClassBook/U 1/cd1pg4u1-intro-adult-lady_3vTraK6v.mp3";
import Rabbit from "../../../assets/Page 01/Rabbit.svg";
import img1 from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 4-5/1-08-01.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 4-5/1-02.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 4-5/1-03.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 4-5/1-04.svg";
import sound1_letter from "../../../assets/audio/ClassBook/U 1/Pg4_1.1_Adult Lady.mp3";
import sound2_letter from "../../../assets/audio/ClassBook/U 1/Pg4_1.2_Adult Lady.mp3";
import sound3_letter from "../../../assets/audio/ClassBook/U 1/Pg4_1.3_Adult Lady.mp3";
import sound4_letter from "../../../assets/audio/ClassBook/U 1/Pg4_1.4_Adult Lady.mp3";
import Page4_Interactive1 from "./Page4_Interactive1";
import Page4_vocabulary from "./Page4_vocabulary";
import AudioWithCaption from "../../AudioWithCaption";
import FourImagesWithAudio from "../../FourImagesWithAudio";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
import longAudio from "../../../assets/audio/ClassBook/U 1/Unit1-listen-page4.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 1/sound1.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 1/sound2.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 1/sound3.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 1/sound4.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 1/sound5.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 1/sound6.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 1/sound7.mp3";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
import "./Page4.css";
const Page4 = ({ openPopup }) => {
  const { audioRef, activeId, setActiveId } = useContext(AudioContext);
  // أصوات الصور
  const imageSounds = [
    null, // الصورة الأولى الكبيرة (إن ما بدك صوت إلها)
    new Audio(sound1_letter),
    new Audio(sound2_letter),
    new Audio(sound3_letter),
    new Audio(sound4_letter),
  ];

  const captionsExample = [
    {
      start: 0.439,
      end: 4.019,
      text: "Page 4, unit 1. Stella's Family.",
    },
    {
      start: 5.0,
      end: 7.579,
      text: "Page 4, unit 1, vocabulary.",
    },
    {
      start: 8.519,
      end: 15.5,
      text: "1, father. 2, knock. 3, brother.",
    },
    {
      start: 16.6,
      end: 18.399,
      text: "4, mother.",
    },
    {
      start: 19.539,
      end: 24.26,
      text: "5, sister. 6, play.",
    },
    {
      start: 25.299,
      end: 30.119,
      text: "7, cousin. 8, aunt.",
    },
    {
      start: 31.219,
      end: 33.139,
      text: "9, uncle.",
    },
    {
      start: 34.2,
      end: 36.88,
      text: "Page 4, listen and read along.",
    },
    {
      start: 38.139,
      end: 43.2,
      text: "L, lamb, leg, lemon.",
    },
    {
      start: 44.2,
      end: 47.239,
      text: "Page 5, Meet My Family.",
    },
    {
      start: 48.36,
      end: 66.599,
      text: "Hello friends, I'm Stella. These are my mother, my father, and my brother, John. The little girl is Sarah. She's my sister. This is my uncle's family. She's my aunt, and he's my uncle. The little boy is my cousin, Jack.",
    },
    {
      start: 67.619,
      end: 70.779,
      text: "Page 5, listen and read along.",
    },
    {
      start: 72.099,
      end: 77.279,
      text: "R, rabbit, red, run.",
    },
  ];

  const areas = [
    // الصوت الأول – المنطقة الأساسية
    { x1: 22.95, y1: 28.9, sound: 1, isPrimary: true },

    // // الصوت الأول – منطقة إضافية
    { x1: 27.63, y1: 17.42, x2: 35.2, y2: 30, sound: 1, isPrimary: false },

    // // الصوت الثاني – الأساسية
    { x1: 42.6, y1: 19.7, sound: 2, isPrimary: true },

    // // الصوت الثاني – الإضافية
    { x1: 44.5, y1: 23.82, x2: 49.15, y2: 28.09, sound: 2, isPrimary: false },

    // // الصوت الثالث – الأساسية
    { x1: 44, y1: 48.5, sound: 3, isPrimary: true },

    // // الصوت الثالث – الإضافية
    { x1: 38.49, y1: 33.41, x2: 47.6, y2: 58.09, sound: 3, isPrimary: false },
    // // الصوت الرابع – الأساسية
    { x1: 69.5, y1: 31.5, sound: 4, isPrimary: true },

    // // الصوت الرابع – الإضافية
    { x1: 55.9, y1: 17.88, x2: 65.63, y2: 54.28, sound: 4, isPrimary: false },
    // // الصوت الرابع – الأساسية
    { x1: 28, y1: 67.8, sound: 5, isPrimary: true },

    // // الصوت الرابع – الإضافية
    { x1: 29.76, y1: 59.31, x2: 36.74, y2: 78.8, sound: 5, isPrimary: false },

    { x1: 46.9, y1: 69.5, sound: 6, isPrimary: true },

    // // الصوت الرابع – الإضافية
    { x1: 43.92, y1: 61.44, x2: 45.47, y2: 75.28, sound: 6, isPrimary: false },

    // // الصوت الرابع – الإضافية
    { x1: 29.76, y1: 59.31, x2: 36.74, y2: 78.8, sound: 5, isPrimary: false },

    { x1: 67, y1: 73.7, sound: 7, isPrimary: true },

    // // الصوت الرابع – الإضافية
    { x1: 54.97, y1: 60.53, x2: 64.66, y2: 80.93, sound: 7, isPrimary: false },
  ];

  const sounds = {
    1: sound1,
    2: sound2,
    3: sound3,
    4: sound4,
    5: sound5,
    6: sound6,
    7: sound7,
  };
  const captions = [
    { start: 0, end: 3.0, text: "Page 4. Listen and read along." },
    { start: 3.02, end: 6.1, text: "Ll lamb leg lemon" },
  ];
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
    <>
      <div
        className="page1-img-wrapper"
        style={{ backgroundImage: `url(${page4})` }}
        onClick={handleImageClick}
      >
        <audio ref={audioRef} style={{ display: "none" }} />

        {areas.map((area, index) => {
          const isActive = activeId === `p4-${area.sound}`;

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
                  playSound(sounds[area.sound], `p4-${area.sound}`);
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
                playSound(sounds[area.sound], `p4-${area.sound}`);
              }}
            ></div>
          );
        })}

        <div
          className="headset-icon-CD-page4-1 hover:scale-110 transition"
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
                  <AudioWithCaption
                    src={allUnitSound}
                    captions={captionsExample}
                  />
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
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid meet"
            />
          </svg>
        </div>

        <div
          className="click-icon-page4-1 hover:scale-110 transition"
          style={{ overflow: "visible" }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 90 90"
            onClick={() => openPopup("html", <Page4_Interactive1 />)}
            style={{ overflow: "visible" }}
          >
            <image
              className="svg-img"
              href={arrowBtn}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid meet"
            />
          </svg>
        </div>

        <div
          className="headset-icon-CD-page4-2 hover:scale-110 transition"
          style={{ overflow: "visible" }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 90 90"
            onClick={() => openPopup("html", <Page4_vocabulary />)}
            style={{ overflow: "visible" }}
          >
            <image
              className="svg-img"
              href={arrowBtn}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid meet"
            />
          </svg>
        </div>
        <div
          className="click-icon-page4 hover:scale-110 transition"
          style={{ overflow: "visible" }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 90 90"
            onClick={() =>
              openPopup(
                "html",
                <FourImagesWithAudio
                  images={[Rabbit, img1, img2, img3, img4]}
                  audioSrc={longAudio}
                  checkpoints={[0, 4.0, 5.72, 7.38, 9.02]}
                  popupOpen={true}
                  titleQ={"Listen and read along."}
                  audioArr={imageSounds}
                  captions={captions}
                />,
              )
            }
            style={{ overflow: "visible" }}
          >
            <image
              className="svg-img"
              href={arrowBtn}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid meet"
            />
          </svg>
        </div>
      </div>
    </>
  );
};

export default Page4;

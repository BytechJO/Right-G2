import React, { useState, useEffect, useRef } from "react";
import page_2 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 83.png";
import img1_letter from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 86/Untitled-22-05.svg";
import img2_letter from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 86/Untitled-22-06.svg";
import img3_letter from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 86/Untitled-22-07.svg";
import img4_letter from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 86/Untitled-22-08.svg";
import Rabbit from "../../../assets/Page 01/Rabbit.svg";
import soundListen from "../../../assets/audio/ClassBook/U 10/pg83-reading-adult-lady_vLt0IrwG.mp3";

import sound1_letter from "../../../assets/audio/ClassBook/U 10/Pg83_1.2_Adult Lady.mp3";
import sound2_letter from "../../../assets/audio/ClassBook/U 10/Pg83_1.3_Adult Lady.mp3";
import sound3_letter from "../../../assets/audio/ClassBook/U 10/Pg83_1.4_Adult Lady.mp3";
import sound4_letter from "../../../assets/audio/ClassBook/U 10/Pg83_1.5_Adult Lady.mp3";
import letterSound from "../../../assets/audio/ClassBook/U 10/pg83b-11-liten.mp3";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
import AudioWithCaption from "../../AudioWithCaption";
import FourImagesWithAudio from "../../FourImagesWithAudio";
import sound1 from "../../../assets/audio/ClassBook/U 10/unit10-sound7.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 10/unit10-sound8.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 10/unit10-sound9.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 10/unit10-sound10.mp3";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
import "./Unit10_Page2.css";
import ReadChoose from "../../ReadChoose";
const Unit10_Page2 = ({ openPopup }) => {
    const { audioRef, activeId, setActiveId } = useContext(AudioContext);
  
  // أصوات الصور
  const imageSounds = [
    null, // الصورة الأولى الكبيرة (إن ما بدك صوت إلها)
    new Audio(sound1_letter),
    new Audio(sound2_letter),
    new Audio(sound3_letter),
    new Audio(sound4_letter),
  ];

  const readChooseData = {
    title: "Read and answer.",
    questions: [
      {
        text: "What is Sarah doing?",
        options: [
          "watering the flowers.",
          "swinging on the swing set.",
          "riding his bike",
        ],
        correct: "swinging on the swing set.",
      },
      {
        text: "What is Dad doing?",
        options: [
          "watering the flowers",
          "watching from the window.",
          "riding his bike",
        ],
        correct: "watching from the window.",
      },
    ],
  };
const captionsExample = [
  { start: 0.419, end: 3.539, text: "Page 83. This is what we do at home." },
  { start: 4.619, end: 23.280, text: "Stella, John, Sarah, and Jack are in the yard in front of the house. Stella is watering the flowers. Sarah is swinging on the swing set. John is riding his bike. Jack is kicking his ball. What is Dad doing? He is watching from the window" }
];
const captions2 = [
  { start: 0.560, end: 8.059, text: "Page 83. Listen and read along. Long E. Eat. Green." },
  { start: 9.239, end: 9.739, text: "Seal" }
];

  const areas = [
    // الصوت الأول – المنطقة الأساسية
    { x1: 13.24, y1: 35.8, sound: 1, isPrimary: true },

    // // // الصوت الأول – منطقة إضافية
    { x1: 10.45, y1: 34.94, x2: 16.27, y2: 49.56, sound: 1, isPrimary: false },

    // // // // الصوت الثاني – الأساسية
    { x1: 44.2, y1: 57.1, sound: 2, isPrimary: true },

    // // // // الصوت الثاني – الإضافية
    { x1: 41.48, y1: 52.76, x2: 44.38, y2: 61.74, sound: 2, isPrimary: false },

    //   // الصوت الأول – المنطقة الأساسية
    { x1: 7.7, y1: 64, sound: 3, isPrimary: true },

    // // // // الصوت الأول – منطقة إضافية
    { x1: 10.06, y1: 54.46, x2: 16.85, y2: 66.31, sound: 3, isPrimary: false },

    // // // // الصوت الثاني – الأساسية
    { x1: 36, y1: 63.6, sound: 4, isPrimary: true },

    // // // // الصوت الثاني – الإضافية
    { x1: 30.62, y1: 58.39, x2: 34.88, y2: 73.78, sound: 4, isPrimary: false },
  ];
  const sounds = {
    1: sound1,
    2: sound2,
    3: sound3,
    4: sound4,
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
      style={{ backgroundImage: `url(${page_2})` }}
    >
      <audio ref={audioRef} style={{ display: "none" }} />

      {areas.map((area, index) => {
         const isActive = activeId === `p83-${area.sound}`;

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
                  playSound(sounds[area.sound], `p83-${area.sound}`);
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
                  playSound(sounds[area.sound], `p83-${area.sound}`);
                }}
          ></div>
        );
      })}

      <div
        className="headset-icon-CD-unit10-page2-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() =>
            openPopup(
              "audio",
              <AudioWithCaption src={soundListen} captions={captionsExample} />,
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
        className="headset-icon-CD-unit10-page2-2 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() =>
            openPopup("html", <ReadChoose data={readChooseData} />)
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
        className="click-icon-unit10-page2-1 hover:scale-110 transition"
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
                images={[
                  Rabbit,
                  img1_letter,
                  img2_letter,
                  img3_letter,
                  img4_letter,
                ]}
                audioSrc={letterSound}
                checkpoints={[0, 4.36, 6.34, 7.50,9.42]}
                popupOpen={true}
                titleQ={"Listen and read along."}
                audioArr={imageSounds}
                captions={captions2}
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
            width="90"
            height="90"
          />
        </svg>
      </div>
    </div>
  );
};

export default Unit10_Page2;

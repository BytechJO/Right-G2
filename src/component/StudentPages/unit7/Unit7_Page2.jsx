import React, { useState, useEffect, useRef } from "react";
import page_2 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 59.png";
import img1_letter from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 58-59/1-05.svg";
import img2_letter from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 58-59/1-06.svg";
import img3_letter from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 58-59/1-07.svg";
import img4_letter from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 58-59/1-08.svg";
import Rabbit from "../../../assets/Page 01/Rabbit.svg";
import soundListen from "../../../assets/audio/ClassBook/U 7/pg59-reading-adult-lady_FZYPz290.mp3";

import sound1_letter from "../../../assets/audio/ClassBook/U 7/Pg59_1.2_Adult Lady.mp3";
import sound2_letter from "../../../assets/audio/ClassBook/U 7/Pg59_1.3_Adult Lady.mp3";
import sound3_letter from "../../../assets/audio/ClassBook/U 7/Pg59_1.4_Adult Lady.mp3";
import sound4_letter from "../../../assets/audio/ClassBook/U 7/Pg59_1.5_Adult Lady.mp3";
import letterSound from "../../../assets/audio/ClassBook/U 7/pg59-instruction1-adult-lady_rMGjo58y.mp3";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
import AudioWithCaption from "../../AudioWithCaption";
import FourImagesWithAudio from "../../FourImagesWithAudio";
import sound1 from "../../../assets/audio/ClassBook/U 7/unit7-sound1.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 7/unit7-sound2.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 7/unit7-sound3.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 7/unit7-sound4.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 7/unit7-sound6.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 7/unit7-sound7.mp3";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
import "./Unit7_Page2.css";
import ReadChoose from "../../ReadChoose";
const Unit7_Page2 = ({ openPopup }) => {
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
    title: "Read and complete the sentences.",
    questions: [
      {
        text: "What does Helen hope to be?",
        options: ["pilot", "doctor", "nurse"],
        correct: "pilot",
      },
      {
        text: "At what time is her father’s flight?",
        options: [
          "at a quarter past one",
          "at a quarter past nine",
          "a quarter past two",
        ],
        correct: "at a quarter past one",
      },
    ],
  };
  const captionsExample = [
    {
      start: 0.599,
      end: 15.699,
      text: "Page 59. Helen's father is a pilot. Helen's father is a pilot. He flies airplanes. Today, Helen visits Dubai Airport with her father. She sees other people who work at the airport too.",
    },
    {
      start: 16.76,
      end: 23.719,
      text: "Her father has a flight at a quarter past one in the afternoon. Helen waves goodbye to her dad",
    },
  ];

  const captions2 = [
    { start: 0.459, end: 3.22, text: "Page 59. Listen and read along." },
    { start: 4.42, end: 5.619, text: "Long O." },
    { start: 6.739, end: 7.279, text: "Coat." },
    { start: 8.34, end: 9.019, text: "Window." },
    { start: 10.119, end: 10.539, text: "Note" },
  ];
  const areas = [
    // الصوت الأول – المنطقة الأساسية
    { x1: 17.5, y1: 18.4, sound: 1, isPrimary: true },

    // // // الصوت الأول – منطقة إضافية
    { x1: 10.26, y1: 16.66, x2: 33.33, y2: 29.9, sound: 1, isPrimary: false },

    //   // // // الصوت الثاني – الأساسية
    { x1: 6.6, y1: 22.3, sound: 2, isPrimary: true },

    //   // // // الصوت الثاني – الإضافية
    { x1: 1.72, y1: 25.91, x2: 15.88, y2: 40.57, sound: 2, isPrimary: false },

    //   // الصوت الأول – المنطقة الأساسية
    { x1: 21.5, y1: 42.2, sound: 3, isPrimary: true },

    //   // // // الصوت الأول – منطقة إضافية
    { x1: 17.82, y1: 32.8, x2: 25.77, y2: 48.65, sound: 3, isPrimary: false },

    //   // // // الصوت الثاني – الأساسية
    { x1: 28, y1: 64, sound: 4, isPrimary: true },

    //   // // // الصوت الثاني – الإضافية
    { x1: 24.22, y1: 59.46, x2: 32.75, y2: 65.25, sound: 4, isPrimary: false },

    //   // الصوت الأول – المنطقة الأساسية
    { x1: 48.4, y1: 54.1, sound: 6, isPrimary: true },

    //   // // // الصوت الأول – منطقة إضافية
    { x1: 39.73, y1: 53.06, x2: 53.11, y2: 57.02, sound: 6, isPrimary: false },

    //   // // // الصوت الثاني – الأساسية
    { x1: 26.6, y1: 71, sound: 7, isPrimary: true },

    //   // // // الصوت الثاني – الإضافية
    { x1: 8.12, y1: 52.0, x2: 24, y2: 77.26, sound: 7, isPrimary: false },
  ];
  const sounds = {
    1: sound1,
    2: sound2,
    3: sound3,
    4: sound4,
    6: sound6,
    7: sound7,
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
        const isActive = activeId === `p59-${area.sound}`;

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
                  playSound(sounds[area.sound], `p59-${area.sound}`);
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
                  playSound(sounds[area.sound], `p59-${area.sound}`);
                }}
          ></div>
        );
      })}

      <div
        className="headset-icon-CD-unit7-page2-1 hover:scale-110 transition"
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
        className="headset-icon-CD-unit7-page2-2 hover:scale-110 transition"
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
        className="click-icon-unit7-page2-1 hover:scale-110 transition"
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
                checkpoints={[0, 4.2, 6.73, 8.34, 10.11]}
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

export default Unit7_Page2;

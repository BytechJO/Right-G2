import React, { useState, useEffect, useRef } from "react";
import page_2 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 77.png";
import img1_letter from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 76-77/1-05.svg";
import img2_letter from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 76-77/1-06.svg";
import img3_letter from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 76-77/1-07.svg";
import img4_letter from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 76-77/1-08.svg";
import Rabbit from "../../../assets/Page 01/Rabbit.svg";
import soundListen from "../../../assets/audio/ClassBook/U 9/pg77-reading-helen_YkitOOSY.mp3";

import sound1_letter from "../../../assets/audio/ClassBook/U 9/Pg77_1.2_Adult Lady.mp3";
import sound2_letter from "../../../assets/audio/ClassBook/U 9/Pg77_1.3_Adult Lady.mp3";
import sound3_letter from "../../../assets/audio/ClassBook/U 9/Pg77_1.4_Adult Lady.mp3";
import sound4_letter from "../../../assets/audio/ClassBook/U 9/Pg77_1.5._Adult Lady.mp3";
import letterSound from "../../../assets/audio/ClassBook/U 9/pg77-instruction1-adult-lady_7Edc4eCH.mp3";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
import AudioWithCaption from "../../AudioWithCaption";
import FourImagesWithAudio from "../../FourImagesWithAudio";

import sound7 from "../../../assets/audio/ClassBook/U 9/unit9-sound7.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 9/unit9-sound8.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 9/unit9-sound9.mp3";
import sound10 from "../../../assets/audio/ClassBook/U 9/unit9-sound10.mp3";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
import "./Unit9_Page2.css";
import ReadChoose from "../../ReadChoose";
const Unit9_Page2 = ({ openPopup }) => {
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
    title: "Read and circle.",
    questions: [
      {
        text: "Grandpa is listening to the radio because",
        options: ["grapes.", "carrots.", "rice."],
        correct: "rice.",
      },
      {
        text: "My dad and uncle are not playing soccer because",
        options: ["meat.", "apple juice.", "fish."],
        correct: "fish.",
      },
    ],
  };
  const captionsExample = [
    { start: 0.519, end: 3.519, text: "Page 77, at my grandparents' house." },
    {
      start: 4.599,
      end: 24.539,
      text: "My dad and uncle are playing chess. My dad always wins at chess. My brothers, Hansel and Harley, are playing soccer in the yard. Mom is ironing clothes, and Grandma is cooking lunch. Grandpa is listening to the radio. He is looking for his glasses",
    },
  ];
  const captions2 = [
    { start: 0.539, end: 3.72, text: "Page 77. Listen and read along." },
    { start: 4.779, end: 5.719, text: "Long A." },
    { start: 6.739, end: 7.2, text: "Day." },
    { start: 8.1, end: 8.639, text: "Game." },
    { start: 9.76, end: 10.319, text: "Pain" },
  ];
  const areas = [
    // الصوت الأول – المنطقة الأساسية
    { x1: 10.24, y1: 37.2, sound: 1, isPrimary: true },

    // // // الصوت الأول – منطقة إضافية
    { x1: 1.14, y1: 36.16, x2: 8.51, y2: 42.4, sound: 1, isPrimary: false },

    // // // // الصوت الثاني – الأساسية
    { x1: 7, y1: 48.1, sound: 2, isPrimary: true },

    // // // // الصوت الثاني – الإضافية
    { x1: 12.0, y1: 46.06, x2: 19.76, y2: 67.53, sound: 2, isPrimary: false },

    //  // الصوت الأول – المنطقة الأساسية
    { x1: 29, y1: 42.4, sound: 3, isPrimary: true },

    // // // // الصوت الأول – منطقة إضافية
    { x1: 17.24, y1: 41.33, x2: 39.15, y2: 63.57, sound: 3, isPrimary: false },

    // // // // الصوت الثاني – الأساسية
    { x1: 7.4, y1: 16.6, sound: 4, isPrimary: true },

    // // // // الصوت الثاني – الإضافية
    { x1: 9.48, y1: 7.37, x2: 28.87, y2: 33.11, sound: 4, isPrimary: false },
  ];
  const sounds = {
    1: sound7,
    2: sound8,
    3: sound9,
    4: sound10,
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
       const isActive = activeId === `p77-${area.sound}`;

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
                  playSound(sounds[area.sound], `p77-${area.sound}`);
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
                  playSound(sounds[area.sound], `p77-${area.sound}`);
                }}
          ></div>
        );
      })}

      <div
        className="headset-icon-CD-unit9-page2-1 hover:scale-110 transition"
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
        className="headset-icon-CD-unit9-page2-2 hover:scale-110 transition"
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
        className="click-icon-unit9-page2-1 hover:scale-110 transition"
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
                checkpoints={[0, 4.78, 6.47, 8.10, 9.76]}
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

export default Unit9_Page2;

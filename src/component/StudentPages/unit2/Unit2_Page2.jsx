import React, { useState, useEffect, useRef } from "react";
import page_2 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 11.png";
import img1_letter from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 10-11/10-02.svg";
import img2_letter from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 10-11/Untitled-10_Artboard 1 copy 3.svg";
import img3_letter from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 10-11/Untitled-10_Artboard 1 copy 5.svg";
import Rabbit from "../../../assets/Page 01/Rabbit.svg";
import soundListen from "../../../assets/audio/ClassBook/U 2/pg11-reading-adult-lady_LwfXrCnU.mp3";
import sound1_letter from "../../../assets/audio/ClassBook/U 2/Pg11_1.1_Adult Lady.mp3";
import sound2_letter from "../../../assets/audio/ClassBook/U 2/Pg11_1.2_Adult Lady.mp3";
import sound3_letter from "../../../assets/audio/ClassBook/U 2/Pg11_1.3_Adult Lady.mp3";
import letterSound from "../../../assets/audio/ClassBook/U 2/page11-unit2-listen.mp3";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
import AudioWithCaption from "../../AudioWithCaption";
import FourImagesWithAudio from "../../FourImagesWithAudio";
import sound3 from "../../../assets/audio/ClassBook/U 2/sound3-unit2.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 2/sound6-unit2.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 2/sound7-unit2.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 2/sound9-unit2.mp3";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
import "./Unit2_Page2.css";
import ReadChoose from "../../ReadChoose";
const Unit2_Page2 = ({ openPopup }) => {
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
 const { audioRef, activeId, setActiveId } = useContext(AudioContext);
  // أصوات الصور
  const imageSounds = [
    null, // الصورة الأولى الكبيرة (إن ما بدك صوت إلها)
    new Audio(sound1_letter),
    new Audio(sound2_letter),
    new Audio(sound3_letter),
  ];

  const readChooseData = {
    title: "Read and choose.",
    questions: [
      {
        text: "The sun is in the sky.",
        options: ["true", "false"],
        correct: "true",
      },
      {
        text: "There are ducks in the pond.",
        options: ["true", "false"],
        correct: "true",
      },
    ],
  };
  const captionsExample = [
    { start: 0.54, end: 3.28, text: "Page 11. At the park." },
    {
      start: 4.32,
      end: 16.86,
      text: "Dear diary, it was fun at the park. These are pictures of our day. This is a butterfly. That is a bird. These are ducks in the pond. Those are my friends.",
    },
  ];

  const captions2 = [
    { start: 0.52, end: 3.92, text: "Page 11. Listen and read along." },
    { start: 5.3, end: 7.62, text: "C, K, X." },
    { start: 8.76, end: 10.96, text: "Clock, fox." },
  ];

  const areas = [
    // // الصوت الثالث – الأساسية
    { x1: 19.8, y1: 12, sound: 1, isPrimary: true },

    // // الصوت الثالث – الإضافية
    { x1: 20.55, y1: 15.75, x2: 26.57, y2: 18.64, sound: 1, isPrimary: false },
  //   // // الصوت الرابع – الأساسية
    { x1: 7, y1: 63.6, sound: 2, isPrimary: true },

  //   // // الصوت الرابع – الإضافية
    { x1: 1.55, y1: 60.37, x2: 13.19, y2: 77.28, sound: 2, isPrimary: false },

  //   // // الصوت الخامس – الأساسية
    { x1: 41, y1: 41.6, sound: 3, isPrimary: true },

  //   // // الصوت الخامس – الإضافية
    { x1: 35.87, y1: 38.14, x2: 41.50, y2: 44.99, sound: 3, isPrimary: false },
  //   // // الصوت السادس  – الأساسية
    { x1: 9.7, y1: 10, sound: 4, isPrimary: true },

  //   // // الصوت الخامس – الإضافية
    { x1: 12.41, y1: 7.22, x2: 13.96, y2: 21.38, sound:4, isPrimary: false },
   ];
  const sounds = {
    1: sound3,
    2: sound6,
    3: sound7,
    4: sound9,
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
        const isActive = activeId === `p11-${area.sound}`;

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
  playSound(sounds[area.sound], `p11-${area.sound}`);
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
  playSound(sounds[area.sound], `p11-${area.sound}`);
}}
          ></div>
        );
      })}

      <div
        className="headset-icon-CD-unit2-page2-1 hover:scale-110 transition"
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
        className="headset-icon-CD-unit2-page2-2 hover:scale-110 transition"
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
        className="click-icon-unit2-page2-1 hover:scale-110 transition"
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
                images={[Rabbit, img1_letter, img2_letter, img3_letter]}
                audioSrc={letterSound}
                checkpoints={[0, 5.30, 8.76, 10.32]}
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

export default Unit2_Page2;

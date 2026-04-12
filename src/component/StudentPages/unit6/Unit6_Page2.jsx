import React, { useState, useEffect, useRef } from "react";
import page_2 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 47.png";
import img1_letter from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 46-47/Untitled-22-05.svg";
import img2_letter from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 46-47/Untitled-22-06.svg";
import img3_letter from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 46-47/Untitled-22-07.svg";
import img4_letter from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 46-47/Untitled-22-08.svg";
import Rabbit from "../../../assets/Page 01/Rabbit.svg";
import soundListen from "../../../assets/audio/ClassBook/U 6/pg47-reading-adult-lady_jBQCwsF7.mp3";

import sound1_letter from "../../../assets/audio/ClassBook/U 6/Pg47_1.1_Adult Lady.mp3";
import sound2_letter from "../../../assets/audio/ClassBook/U 6/Pg47_1.2_Adult Lady.mp3";
import sound3_letter from "../../../assets/audio/ClassBook/U 6/Pg47_1.3_Adult Lady.mp3";
import sound4_letter from "../../../assets/audio/ClassBook/U 6/Pg47_1.4_Adult Lady.mp3";

import letterSound from "../../../assets/audio/ClassBook/U 6/pg47-instruction1-adult-lady_WxO4XAUJ.mp3";

import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
import AudioWithCaption from "../../AudioWithCaption";
import FourImagesWithAudio from "../../FourImagesWithAudio";
import sound7 from "../../../assets/audio/ClassBook/U 6/unit6-sound7.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 6/unit6-sound8.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 6/unit6-sound9.mp3";
import sound10 from "../../../assets/audio/ClassBook/U 6/unit6-sound10.mp3";
import "./Unit6_Page2.css";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
import ReadChoose from "../../ReadChoose";
const Unit6_Page2 = ({ openPopup }) => {
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
    new Audio(sound4_letter),
  ];

  const readChooseData = {
    title: "Read and choose.",
    questions: [
      {
        text: "When does Helen go to school?",
        options: [
          "She goes to school at eight o’clock.",
          "She goes to school at six o’clock.",
          "She goes to school at nine o’clock.",
        ],
        correct: "She goes to school at eight o’clock.",
      },
      {
        text: "When does Helen go to sleep?",
        options: [
          "She goes to sleep at nine o’clock.",
          "She goes to sleep at six o’clock.",
          "She goes to sleep at eight o’clock.",
        ],
        correct: "She goes to sleep at nine o’clock.",
      },
    ],
  };
  const captionsExample = [
    { start: 0.599, end: 4.019, text: "Page 47. Helen's diary" },
    {
      start: 4.019,
      end: 7.47,
      text: "This is what I do every day. I get up at 6:00.",
    },
    {
      start: 8.22,
      end: 12.9,
      text: "I eat my breakfast at 7:30. I go to school at 8:00.",
    },
    {
      start: 13.06,
      end: 16.48,
      text: "I learn many things in class. I go home at 2:00 in the afternoon. ",
    },
    {
      start: 17.44,
      end: 22.179,
      text: "I eat my lunch at 3:00. I go to sleep at 9:00.",
    },
  ];

  const captions2 = [
    { start: 0.5, end: 3.819, text: "Page 47. Listen and read along." },
    { start: 4.94, end: 6.179, text: "Long I." },
    { start: 7.259, end: 7.779, text: "Light." },
    { start: 8.88, end: 10.979, text: "Night. Tight." },
  ];

  const areas = [
    // الصوت الأول – المنطقة الأساسية
    { x1: 13.24, y1: 47.4, sound: 1, isPrimary: true },

    // // // الصوت الأول – منطقة إضافية
    { x1: 2.31, y1: 44.4, x2: 15.10, y2: 59.61, sound: 1, isPrimary: false },

    // // // // الصوت الثاني – الأساسية
    { x1: 15.60, y1: 64.7, sound: 2, isPrimary: true },

    // // // // الصوت الثاني – الإضافية
    { x1: 11.81, y1: 65.40, x2: 28.87, y2: 79.72, sound: 2, isPrimary: false },

    //  // الصوت الأول – المنطقة الأساسية
    { x1: 29, y1: 53.8, sound: 3, isPrimary: true },

    // // // // الصوت الأول – منطقة إضافية
    { x1: 24.61, y1: 45.9, x2: 42.83, y2: 60.07, sound: 3, isPrimary: false },

    // // // // الصوت الثاني – الأساسية
    { x1: 21.9, y1:30, sound: 4, isPrimary: true },

    // // // // الصوت الثاني – الإضافية
    { x1: 24.80, y1: 24.28, x2: 42.83, y2: 38.59, sound: 4, isPrimary: false },
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
const isActive = activeId === `p47-${area.sound}`;

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
                  playSound(sounds[area.sound], `p47-${area.sound}`);
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
                  playSound(sounds[area.sound], `p47-${area.sound}`);
                }}
          ></div>
        );
      })}

      <div
        className="headset-icon-CD-unit6-page2-1 hover:scale-110 transition"
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
        className="headset-icon-CD-unit6-page2-2 hover:scale-110 transition"
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
        className="click-icon-unit6-page2-1 hover:scale-110 transition"
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
                checkpoints={[0, 4.94, 7.26, 8.88, 10.38]}
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

export default Unit6_Page2;

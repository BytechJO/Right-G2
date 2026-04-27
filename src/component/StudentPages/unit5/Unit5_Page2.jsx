import React, { useState, useEffect, useRef } from "react";
import page_2 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 41.png";
import img1_letter from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 40-41/1-05.svg";
import img2_letter from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 40-41/1-06.svg";
import img3_letter from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 40-41/1-07.svg";
import img4_letter from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 40-41/1-08.svg";
import Rabbit from "../../../assets/Page 01/Rabbit.svg";
import soundListen from "../../../assets/audio/ClassBook/U 5/pg41-reading-adult-lady_RORtRLQ4.mp3";
import sound1_letter from "../../../assets/audio/ClassBook/U 5/Pg41_1.1_Adult Lady.mp3";
import sound2_letter from "../../../assets/audio/ClassBook/U 5/Pg41_1.2_Adult Lady.mp3";
import sound3_letter from "../../../assets/audio/ClassBook/U 5/Pg41_1.3_Adult Lady.mp3";
import sound4_letter from "../../../assets/audio/ClassBook/U 5/Pg41_1.4_Adult Lady.mp3";
import letterSound from "../../../assets/audio/ClassBook/U 5/pg41-instruction1-adult-lady_uUfGJa3v.mp3";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
import AudioWithCaption from "../../AudioWithCaption";
import FourImagesWithAudio from "../../FourImagesWithAudio";
import sound1 from "../../../assets/audio/ClassBook/U 5/unit5-sound1.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 5/unit5-sound2.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 5/unit5-sound4.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 5/unit5-sound9.mp3";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
import "./Unit5_Page2.css";
import ReadChoose from "../../ReadChoose";
const Unit5_Page2 = ({ openPopup }) => {
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
    title: "Read and circle.",
    questions: [
      {
        text: "Helen likes",
        options: ["grapes.", "carrots.", "rice."],
        correct: "rice.",
      },
      {
        text: "Tom doesn’t like",
        options: ["meat.", "apple juice.", "fish."],
        correct: "fish.",
      },
    ],
  };
  const captionsExample = [
    { start: 0.419, end: 4.539, text: "Page 41. Our favorite foods" },
    { start: 4.539, end: 6.259, text: "Tom and I are at a restaurant." },
    {
      start: 7.5,
      end: 25.84,
      text: "Tom likes rice, meat, carrots, apple juice, and ice cream. He doesn't like fish, eggs, or milk. I like ice cream. Rice is my favorite dish. I also like bananas and milk. I don't like carrots, grapes, or apple juice",
    },
  ];
  const captions2 = [
    { start: 0.5, end: 3.959, text: "Page 41. Listen and read along." },
    { start: 5.059, end: 6.139, text: "Long E." },
    { start: 7.179, end: 10.46, text: "Meet. Read. Tea" },
  ];

  const areas = [
    // الصوت الأول – المنطقة الأساسية
    { x1: 7.24, y1: 25.6, sound: 1, isPrimary: true },

    // // // الصوت الأول – منطقة إضافية
    { x1: 2.11, y1: 17.57, x2: 24.61, y2: 29.0, sound: 1, isPrimary: false },

    // // // // الصوت الثاني – الأساسية
    { x1: 10.8, y1: 35.2, sound: 2, isPrimary: true },

    // // // // الصوت الثاني – الإضافية
    { x1: 5.6, y1: 31.43, x2: 16.85, y2: 36.46, sound: 2, isPrimary: false },

    // // الصوت الأول – المنطقة الأساسية
    { x1: 6.9, y1: 47.8, sound: 3, isPrimary: true },

    // // // // الصوت الأول – منطقة إضافية
    { x1: 2.69, y1: 44.99, x2: 13.16, y2: 48.95, sound: 3, isPrimary: false },

    // // // // الصوت الثاني – الأساسية
    { x1: 15.6, y1: 42, sound: 4, isPrimary: true },

    // // // // الصوت الثاني – الإضافية
    { x1: 14.52, y1: 41.03, x2: 25.57, y2: 67.07, sound: 4, isPrimary: false },
  ];
  const sounds = {
    1: sound1,
    2: sound2,
    3: sound4,
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
        const isActive = activeId === `p41-${area.sound}`;

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
                playSound(sounds[area.sound], `p41-${area.sound}`);
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
              playSound(sounds[area.sound], `p41-${area.sound}`);
            }}
          ></div>
        );
      })}

      <div
        className="headset-icon-CD-unit5-page2-1 hover:scale-110 transition"
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
        className="headset-icon-CD-unit5-page2-2 hover:scale-110 transition"
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
        className="click-icon-unit5-page2-1 hover:scale-110 transition"
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
                checkpoints={[0, 5.04, 7.18, 8.54, 9.92]}
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

export default Unit5_Page2;

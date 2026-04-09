import React, { useState, useEffect, useRef } from "react";
import page_2 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 29.png";
import img1_letter from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 28-29/Untitled-22-01.svg";
import img2_letter from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 28-29/Untitled-22-06.svg";
import img3_letter from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 28-29/Untitled-22-07.svg";
import img4_letter from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 28-29/Untitled-22-08.svg";
import Rabbit from "../../../assets/Page 01/Rabbit.svg";
import soundListen from "../../../assets/audio/ClassBook/U 4/pg29-reading-adult-lady_Ic3rdX1F.mp3";
import sound1_letter from "../../../assets/audio/ClassBook/U 4/Pg29_1.1_Adult Lady.mp3";
import sound2_letter from "../../../assets/audio/ClassBook/U 4/Pg29_1.2_Adult Lady.mp3";
import sound3_letter from "../../../assets/audio/ClassBook/U 4/Pg29_1.3_Adult Lady.mp3";
import sound4_letter from "../../../assets/audio/ClassBook/U 4/Pg29_1.4_Adult Lady.mp3";
import letterSound from "../../../assets/audio/ClassBook/U 4/pg29-instruction1-adult-lady_wI6B8Mcm (1).mp3";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
import AudioWithCaption from "../../AudioWithCaption";
import FourImagesWithAudio from "../../FourImagesWithAudio";
import sound8 from "../../../assets/audio/ClassBook/U 4/unit4-sound8.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 4/unit4-sound9.mp3";
import sound11 from "../../../assets/audio/ClassBook/U 4/unit4-sound11.mp3";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
import "./Unit4_Page2.css";
import ReadChoose from "../../ReadChoose";
const Unit4_Page2 = ({ openPopup }) => {
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
        text: "Helen’s uncle takes pictures of",
        options: ["zoos", "people", "animals"],
        correct: "animals",
      },
      {
        text: "Helen’s uncle is a",
        options: ["vet", "photographer", "nurse"],
        correct: "photographer",
      },
    ],
  };
  const captionsExample = [
    { start: 0.52, end: 4.78, text: "Page 29. My uncle's job." },
    {
      start: 4.78,
      end: 13.72,
      text: "My uncle is a photographer. He takes pictures of animals. His favorite animals are tigers and panthers. I think they are scary.",
    },
  ];

  const captions2 = [
    { start: 0.56, end: 3.86, text: "Page 29. Listen and read along." },
    { start: 4.94, end: 5.94, text: "Long A." },
    { start: 6.98, end: 7.54, text: "Play." },
    { start: 8.64, end: 10.6, text: "Paint. Lake." },
  ];

  const areas = [
    // الصوت الأول – المنطقة الأساسية
    { x1: 26.8, y1: 65.6, sound: 1, isPrimary: true },

    // // // الصوت الأول – منطقة إضافية
    { x1: 24.82, y1: 67.53, x2: 41.11, y2:75.15, sound: 1, isPrimary: false },

    // // // // الصوت الثاني – الأساسية
    { x1:25.6, y1: 43.1, sound: 2, isPrimary: true },

    // // // // الصوت الثاني – الإضافية
    { x1: 16.09, y1: 42.40, x2: 32.58, y2: 57.7, sound: 2, isPrimary: false },

    // // // // الصوت الثاني – الأساسية
    { x1: 14.7, y1: 69.7, sound: 3, isPrimary: true },

    // // // // الصوت الثاني – الإضافية
    { x1: 19.00, y1: 67.99, x2: 21.91, y2: 76.21, sound: 3, isPrimary: false },
  ];
  const sounds = {
    1: sound8,
    2: sound9,
    3: sound11,
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
        const isActive = activeId === `p29-${area.sound}`;


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
                  playSound(sounds[area.sound], `p29-${area.sound}`);
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
                playSound(sounds[area.sound], `p29-${area.sound}`);
              }}
          ></div>
        );
      })}

      <div
        className="headset-icon-CD-unit4-page2-1 hover:scale-110 transition"
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
        className="headset-icon-CD-unit4-page2-2 hover:scale-110 transition"
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
        className="click-icon-unit4-page2-1 hover:scale-110 transition"
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
                checkpoints={[0, 4.5, 6.68, 8.64, 9.64]}
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

export default Unit4_Page2;

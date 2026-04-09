import React, { useState, useRef, useEffect } from "react";
import steall from "../../../assets/audio/ClassBook/U 1/reading stella.mp3";
import page_5 from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 5.png";
import Rabbit from "../../../assets/Page 01/Rabbit.svg";
import img1_letter from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 4-5/1-08-05.svg"; //-------should change-------
import img2_letter from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 4-5/1-06.svg"; //-------should change-------
import img3_letter from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 4-5/1-07.svg"; //-------should change-------
import img4_letter from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 4-5/1-08.svg"; //-------should change-------
import allSound_letter from "../../../assets/audio/ClassBook/U 1/unit1-page5-lestine.mp3";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
import ReadChoose from "../../ReadChoose";
import FourImagesWithAudio from "../../FourImagesWithAudio";
import AudioWithCaption from "../../AudioWithCaption";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
import sound1_letter from "../../../assets/audio/ClassBook/U 1/Pg5_1.1_Adult Lady.mp3";
import sound2_letter from "../../../assets/audio/ClassBook/U 1/Pg5_1.2_Adult Lady.mp3";
import sound3_letter from "../../../assets/audio/ClassBook/U 1/Pg5_Instruction2_Adult Lady.mp3";
import sound4_letter from "../../../assets/audio/ClassBook/U 1/Pg5_2.1_Adult Lady.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 1/sound8.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 1/sound9.mp3";
import "./Page5.css";
const Page5 = ({ openPopup }) => {
   const { audioRef, activeId, setActiveId } = useContext(AudioContext);

  const captionsExample = [
    {
      start: 0.56,
      end: 3.599,
      text: "Page 5. Meet my family",
    },
    {
      start: 4.739,
      end: 5.619,
      text: "Hello, friends.",
    },
    {
      start: 5.94,
      end: 6.559,
      text: "I'm Stella.",
    },
    {
      start: 6.94,
      end: 10.719,
      text: "These are my mother, my father, and my brother, John.",
    },
    {
      start: 11.159,
      end: 12.899,
      text: "The little girl is Sarah.",
    },
    {
      start: 13.319,
      end: 14.219,
      text: "She's my sister.",
    },
    {
      start: 15.099,
      end: 16.68,
      text: "This is my uncle's family.",
    },
    {
      start: 17.219,
      end: 19.799,
      text: "She's my aunt, and he's my uncle.",
    },
    {
      start: 20.199,
      end: 22.959,
      text: "The little boy is my cousin, Jack.",
    },
  ];

  const readChooseData = {
    title: "Read and choose.",
    questions: [
      {
        text: "Who’s Jack?",
        options: ["Stella’s uncle", "Stella’s cousin"],
        correct: "Stella’s cousin",
      },
    ],
  };

  const captions2 = [
    { start: 0, end: 3.67, text: " Page 5. Listen and read along.  " },
    { start: 4.88, end: 9.78, text: "R. rabbit red run" },
  ];
  // أصوات الصور
  const imageSounds = [
    null, // الصورة الأولى الكبيرة (إن ما بدك صوت إلها)
    new Audio(sound1_letter),
    new Audio(sound2_letter),
    new Audio(sound3_letter),
    new Audio(sound4_letter),
  ];

  const areas = [
    // الصوت الأول – المنطقة الأساسية
    { id: "pn1-8",x1: 10.9, y1: 49, sound: 1, isPrimary: true },

    // الصوت الأول – منطقة إضافية
    { id: "pn1-8",x1: 1.94, y1: 39.2, x2: 9.7, y2: 60.8, sound: 1, isPrimary: false },

    // الصوت الثاني – الأساسية
    { id: "pn1-9",x1: 30.7, y1: 59.9, sound: 2, isPrimary: true },

    // الصوت الثاني – الإضافية
    { id: "pn1-9",x1: 22.5, y1: 38.44, x2: 30.8, y2: 68.9, sound: 2, isPrimary: false },
  ];
  const sounds = {
    1: sound8,
    2: sound9,
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
      style={{ backgroundImage: `url(${page_5})` }}
    >
      <audio ref={audioRef} style={{ display: "none" }} />

      {areas.map((area, index) => {
         const isActive = activeId === `p5-${area.sound}`;

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
  playSound(sounds[area.sound], `p5-${area.sound}`);
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
  playSound(sounds[area.sound], `p5-${area.sound}`);
}}
          ></div>
        );
      })}

      <div
        id="CD-1-page5"
        className="headset-icon-CD-page5 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() =>
            openPopup(
              "audio",
              <AudioWithCaption src={steall} captions={captionsExample} />,
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
        id="CD-2-page5"
        className="headset-icon-CD-page5 hover:scale-110 transition"
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
        className="click-icon-page5 hover:scale-110 transition"
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
                audioSrc={allSound_letter}
                checkpoints={[0, 4.5, 6.4, 8.18, 9.78]}
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

export default Page5;

import React, { useState, useRef, useEffect } from "react";
import page_5 from "../../../assets/imgs/pages/Right 2 Unit 1 Stellas Family_00001/Right 2 Unit 1 Stellas Family_00005.jpg";
import Rabbit from "../../../assets/Page 01/Rabbit.svg";
import img1_letter from "../../../assets/imgs/test.png"; //-------should change-------
import img2_letter from "../../../assets/imgs/test.png"; //-------should change-------
import img3_letter from "../../../assets/imgs/test.png"; //-------should change-------
import img4_letter from "../../../assets/imgs/test.png"; //-------should change-------
import repeat1_conversation from "../../../assets/imgs/test.png"; //-------should change-------
import repeat2_conversation from "../../../assets/imgs/test.png"; //-------should change-------
import sound_conversation from "../../../assets/imgs/test.png";
import allSound_letter from "../../../assets/audio/ClassBook/U 1/Pg5_Instruction1_Adult Lady.mp3";
import read from "../../../assets/Page 01/P1 listen and repeat 01.svg";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
import ReadChoose from "../../ReadChoose";
import FourImagesWithAudio from "../../FourImagesWithAudio";
import sound1_letter from "../../../assets/audio/ClassBook/U 1/Pg5_1.1_Adult Lady.mp3";
import sound2_letter from "../../../assets/audio/ClassBook/U 1/Pg5_1.2_Adult Lady.mp3";
import sound3_letter from "../../../assets/audio/ClassBook/U 1/Pg5_Instruction2_Adult Lady.mp3";
import sound4_letter from "../../../assets/audio/ClassBook/U 1/Pg5_2.1_Adult Lady.mp3";
// import sound1_paragraph from "../../../assets/audio/ClassBook/U 1/Pg5_1.1_Stella.mp3";
// import sound2_conversation from "../../../assets/audio/placeholders/song.mp3";
// import sound2_vocab from "../../../assets/audio/placeholders/song.mp3";
// import sound3_vocab from "../../../assets/audio/placeholders/song.mp3";
import "./Page5.css"
const Page5 = ({ openPopup }) => {
  const audioRef = useRef(null);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
  const captionsExample = [
    { start: 0, end: 3.09, text: "Page 5. Meet my cat." },
    { start: 3.13, end: 5.02, text: "Hello. How are you? " },
    {
      start: 5.06,
      end: 8.19,
      text: "I'm Stella. This is my cat. Her name is Lolo.",
    },
    { start: 8.25, end: 11.25, text: "She is one year old. She likes people." },
  ];

const readChooseData = {
  title: "Read and choose.",
  questions: [
    {
      text: "Who’s Jack?",
      options:["Stella’s uncle" ,"Stella’s cousin"],
      correct:"Stella’s cousin",
    },
    
  ],
};


  const captions2 = [
    { start: 0, end: 3.19, text: " Page 5. Listen and read along. " },
    { start: 3.21, end: 7.22, text: "T. Table. Taxi. Tiger." },
  ];
  // أصوات الصور
  const imageSounds = [
    null, // الصورة الأولى الكبيرة (إن ما بدك صوت إلها)
    new Audio(sound1_letter),
    new Audio(sound2_letter),
    new Audio(sound3_letter),
    new Audio(sound4_letter),
  ];
  const imageSounds2 = [
    null, // الصورة الأولى الكبيرة (إن ما بدك صوت إلها)
    // new Audio(sound1_conversation),
    // new Audio(sound2_conversation),
  ];

  const areas = [
    // الصوت الأول – المنطقة الأساسية
    { x1: 7.25, y1: 45.8, x2: 11.4, y2: 48.8, sound: 1, isPrimary: true },

    // الصوت الأول – منطقة إضافية
    { x1: 4.6, y1: 34.1, x2: 15.2, y2: 67.8, sound: 1, isPrimary: false },

    // الصوت الثاني – الأساسية
    { x1: 33.9, y1: 43.1, x2: 37.7, y2: 46.1, sound: 2, isPrimary: true },

    // الصوت الثاني – الإضافية
    { x1: 26.9, y1: 32.8, x2: 35.8, y2: 68.9, sound: 2, isPrimary: false },
  ];
  // const sounds = {
  //   1: sound2_vocab,
  //   2: sound3_vocab,
  // };
  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
    console.log("X%:", xPercent.toFixed(2), "Y%:", yPercent.toFixed(2));
  };
  const playSound = (path) => {
    if (audioRef.current) {
      audioRef.current.src = path;
      audioRef.current.play();
      setIsPlaying(true);
      setHoveredAreaIndex(null); // إزالة الهايلايت عند بدء الصوت

      audioRef.current.onended = () => {
        setIsPlaying(false);
        setHoveredAreaIndex(null);
        setActiveAreaIndex(null); // مسح الهايلايت بعد انتهاء الصوت
      };
    }
  };
  return (
    <div
      className="page1-img-wrapper"
      onClick={handleImageClick}
      style={{ backgroundImage: `url(${page_5})` }}
    >
      <audio ref={audioRef} style={{ display: "none" }} />

      {areas.map((area, index) => {
        const isActive = activeAreaIndex === area.sound;

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
                setActiveAreaIndex(area.sound);
                playSound(sounds[area.sound]);
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
              setActiveAreaIndex(area.sound); // 👈 يفعل الدائرة فوق الرقم
              playSound(sounds[area.sound]);
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
              // <AudioWithCaption src={page5_CD2} captions={captionsExample} />,
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
            openPopup(
              "html",
             <ReadChoose data={readChooseData}/>
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
                checkpoints={[0, 3.4, 4, 4.9, 6]}
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

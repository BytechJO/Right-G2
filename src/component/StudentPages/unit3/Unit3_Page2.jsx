import React, { useState, useEffect, useRef } from "react";
import page_2 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 23.png";
import img1_letter from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 22-23/Untitled-1-05.svg";
import img2_letter from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 22-23/Untitled-22-06.svg";
import img3_letter from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 22-23/Untitled-22-07.svg";
import img4_letter from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 22-23/Untitled-22-08.svg";
import Rabbit from "../../../assets/Page 01/Rabbit.svg";
import soundListen from "../../../assets/audio/ClassBook/U 3/pg23-reading.mp3";

import sound1_letter from "../../../assets/audio/ClassBook/U 3/Pg23_1.1_Adult Lady.mp3";
import sound2_letter from "../../../assets/audio/ClassBook/U 3/Pg23_1.2_Adult Lady.mp3";
import sound3_letter from "../../../assets/audio/ClassBook/U 3/Pg23_1.3_Adult Lady.mp3";
import sound4_letter from "../../../assets/audio/ClassBook/U 3/Pg23_1.4_Adult Lady.mp3";
import letterSound from "../../../assets/audio/ClassBook/U 3/pg23-instruction2.mp3";

import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
import AudioWithCaption from "../../AudioWithCaption";
import FourImagesWithAudio from "../../FourImagesWithAudio";
import sound2 from "../../../assets/audio/ClassBook/U 3/unit3-sound2.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 3/unit3-sound5.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 3/unit3-sound6.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 3/unit3-sound8.mp3";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
import "./Unit3_Page2.css";
import ReadChoose from "../../ReadChoose";
const Unit3_Page2 = ({ openPopup }) => {
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
    title: "Read and complete the sentences.",
    questions: [
      {
        text: "The boy is watching his mom",
        options: ["make a sandwich", "can take a nice photo"],
        correct: "make a sandwich",
      },
      {
        text: "The man with a camera",
        options: ["can take a nice photo", "make a sandwich"],
        correct: "can take a nice photo",
      },
    ],
  };
  const captionsExample = [
    { start: 0.5, end: 4.86, text: "Page 23. People at the park." },
    {
      start: 4.86,
      end: 10.34,
      text: "The boy is watching his mom make a sandwich. A girl is riding a bike.",
    },
    {
      start: 11.4,
      end: 21.62,
      text: "The boy can't fly a kite. The man can play the drum. I can see a boy swimming. The man with a camera is taking a photo.",
    },
  ];

  const captions2 = [
    { start: 0.58, end: 4.4, text: "Page 23. Listen and read along." },
    { start: 5.5, end: 6.06, text: "Y." },
    { start: 7.26, end: 7.78, text: "Yellow." },
    { start: 8.86, end: 11.2, text: "Yogurt. Yo-yo." },
  ];

  const areas = [
    // الصوت الأول – المنطقة الأساسية
    { x1: 43.3, y1: 23, sound: 1, isPrimary: true },

    // // // // الصوت الأول – منطقة إضافية
    { x1: 36.65, y1: 25.19, x2: 44.41, y2: 36.16, sound: 1, isPrimary: false },

    // // // // الصوت الثاني – الأساسية
    { x1: 15.1, y1: 44.1, sound: 2, isPrimary: true },

    // // // // الصوت الثاني – الإضافية
    { x1: 15.51, y1: 36.31, x2: 29.47, y2: 47.27, sound: 2, isPrimary: false },

    //     // // // الصوت الثاني – الأساسية
    { x1: 17.1, y1: 56.1, sound: 3, isPrimary: true },

    // // // // الصوت الثاني – الإضافية
    { x1: 13.96, y1: 49.86, x2: 26.18, y2: 57.33, sound: 3, isPrimary: false },

    //     // // // الصوت الثاني – الأساسية
    { x1: 23.9, y1: 26.1, sound: 4, isPrimary: true },

    // // // // الصوت الثاني – الإضافية
    { x1: 14.93, y1: 20.62, x2: 26.57, y2: 32.5, sound: 4, isPrimary: false },
  ];
  const sounds = {
    1: sound2,
    2: sound5,
    3: sound6,
    4: sound8,
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
        const isActive = activeId === `p23-${area.sound}`;

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
                playSound(sounds[area.sound], `p23-${area.sound}`);
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
              playSound(sounds[area.sound], `p23-${area.sound}`);
            }}
          ></div>
        );
      })}

      <div
        className="headset-icon-CD-unit3-page2-1 hover:scale-110 transition"
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
        className="headset-icon-CD-unit3-page2-2 hover:scale-110 transition"
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
        className="click-icon-unit3-page2-1 hover:scale-110 transition"
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
                checkpoints={[0, 4.4, 7.26, 8.86, 10]}
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

export default Unit3_Page2;

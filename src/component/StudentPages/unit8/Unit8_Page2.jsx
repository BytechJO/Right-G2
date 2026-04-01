import React, { useState, useEffect, useRef } from "react";
import page_2 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 65.png";
import img1_letter from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 64-65/Un 8/List 1 un 8 p65-01.svg";
import img2_letter from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 64-65/Un 8/List 1 un 8 p65-02.svg";
import img3_letter from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 64-65/Un 8/List 1 un 8 p65-03.svg";
import img4_letter from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 64-65/Un 8/List 1 un 8 p65-04.svg";
import Rabbit from "../../../assets/Page 01/Rabbit.svg";
import soundListen from "../../../assets/audio/ClassBook/U 5/Pg41_1.1_Helen.mp3";
import img1_conversation from "../../../assets/imgs/test.png";
import img2_conversation from "../../../assets/imgs/test.png";
import sound1_letter from "../../../assets/audio/ClassBook/U 5/Pg41_1.1_Adult Lady.mp3";
import sound2_letter from "../../../assets/audio/ClassBook/U 5/Pg41_1.2_Adult Lady.mp3";
import sound3_letter from "../../../assets/audio/ClassBook/U 5/Pg41_1.3_Adult Lady.mp3";
import sound4_letter from "../../../assets/audio/ClassBook/U 5/Pg41_1.4_Adult Lady.mp3";
import letterSound from "../../../assets/audio/ClassBook/U 5/Pg41_Instruction1_Adult Lady.mp3";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
import AudioWithCaption from "../../AudioWithCaption";
import FourImagesWithAudio from "../../FourImagesWithAudio";

import "./Unit8_Page2.css";
import ReadChoose from "../../ReadChoose";
const Unit8_Page2 = ({ openPopup }) => {
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
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
        options: ["grapes.", "carrots.","rice."],
        correct: "rice.",
      },
      {
        text: "Tom doesn’t like",
        options: ["meat.", "apple juice.","fish."],
        correct: "fish.",
      },
    ],
  };
  const captionsExample = [
    { start: 0, end: 2.0, text: "Page11. Birthdays Are Fun" },
    { start: 2.05, end: 5.2, text: "Hi, everyone. Today is my birthday." },
    { start: 5.24, end: 7.2, text: " I'm seven years old." },
    { start: 7.24, end: 9.0, text: "  My friends are here. It's fun." },
  ];

  const captions2 = [
    { start: 0, end: 3.18, text: "Page 11. Listen and read along. " },
    { start: 3.2, end: 7.01, text: "P, pencil, pink, pizza. " },
  ];


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
      style={{ backgroundImage: `url(${page_2})` }}
    >
   
      <div
        className="headset-icon-CD-unit8-page2-1 hover:scale-110 transition"
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
        className="headset-icon-CD-unit8-page2-2 hover:scale-110 transition"
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
        className="click-icon-unit8-page2-1 hover:scale-110 transition"
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
                images={[Rabbit, img1_letter, img2_letter, img3_letter,img4_letter]}
                audioSrc={letterSound}
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

export default Unit8_Page2;

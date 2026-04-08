import React, { useState, useEffect, useRef } from "react";
import page_2 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 65.png";
import img1_letter from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 64-65/1-05.svg";
import img2_letter from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 64-65/1-06.svg";
import img3_letter from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 64-65/1-07.svg";
import img4_letter from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 64-65/1-08.svg";
import Rabbit from "../../../assets/Page 01/Rabbit.svg";
import soundListen from "../../../assets/audio/ClassBook/U 8/pg65-reading-adult-lady_wE17e53C.mp3";

import sound1_letter from "../../../assets/audio/ClassBook/U 8/Pg65_1.1_Adult Lady.mp3";
import sound2_letter from "../../../assets/audio/ClassBook/U 8/Pg65_1.2_Adult Lady.mp3";
import sound3_letter from "../../../assets/audio/ClassBook/U 8/Pg65_1.3_Adult Lady.mp3";
import sound4_letter from "../../../assets/audio/ClassBook/U 8/Pg65_1.4_Adult Lady.mp3";
import letterSound from "../../../assets/audio/ClassBook/U 8/pg65-instruction1-adult-lady-2_lRuMfTLH.mp3";
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
    title: "Read and complete the sentences.",
    questions: [
      {
        text: "Hansel has?",
        options: [
          "black jacket, blue jeans, green cap",
          "green jacket and black jeans",
          "green jeans, white cap",
        ],
        correct: "black jacket, blue jeans, green cap",
      },
      {
        text: "Helen doesn’t have?",
        options: ["green jacket", "skirt or a scarf.", "white cap"],
        correct: "skirt or a scarf.",
      },
    ],
  };
  const captionsExample = [
    {
      start: 0.14,
      end: 5.619,
      text: "Page 65. What do you have in your closet?",
    },
    {
      start: 5.619,
      end: 14.799,
      text: "I have a black jacket and blue jeans in my closet. I also have a green cap for hot days. I don't have a T-shirt or a tie.",
    },
    {
      start: 14.799,
      end: 25.34,
      text: "That's great, Hansel. I have a green dress and a white T-shirt. I also have a pink hat and blue shoes. The blue shoes are my favorite.",
    },
    { start: 26.399, end: 28.52, text: "I don't have a skirt or a scarf" },
  ];
  const captions2 = [
    { start: 0.539, end: 3.5, text: "Page 65. Listen and read along." },
    { start: 4.659, end: 5.699, text: "Long U." },
    { start: 6.98, end: 10.5, text: "Tune. June. Tube" },
  ];

  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
    console.log("X%:", xPercent.toFixed(2), "Y%:", yPercent.toFixed(2));
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
                images={[
                  Rabbit,
                  img1_letter,
                  img2_letter,
                  img3_letter,
                  img4_letter,
                ]}
                audioSrc={letterSound}
                checkpoints={[0, 4.66, 6.98, 8.32, 9.82]}
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

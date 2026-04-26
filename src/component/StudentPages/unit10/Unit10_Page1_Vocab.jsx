import React, { useState, useRef, useEffect } from "react";
import backgroundImage from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page.png";
import page2_2 from "../../../assets/imgs/Voca.svg";
import vocabulary from "../../../assets/audio/ClassBook/U 10/Pg82_Vocabulary_Adult Lady.mp3";
import "./Unit10_Page1.css";
import ModernVocabularyComponent from "../../ModernVocabularyComponent";

import num1 from "../../../assets/imgs/Num1.svg";
import num2 from "../../../assets/imgs/Num2.svg";
import num3 from "../../../assets/imgs/Num3.svg";
import num4 from "../../../assets/imgs/Num4.svg";
import num5 from "../../../assets/imgs/Num5.svg";
import num6 from "../../../assets/imgs/Num6.svg";
import num7 from "../../../assets/imgs/Num7.svg";
import num8 from "../../../assets/imgs/Num8.svg";
import num9 from "../../../assets/imgs/Num9.svg";
import num10 from "../../../assets/imgs/Num10.svg";

import sound1 from "../../../assets/audio/ClassBook/U 10/unit10-sound1.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 10/unit10-sound2.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 10/unit10-sound3.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 10/unit10-sound4.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 10/unit10-sound5.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 10/unit10-sound6.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 10/unit10-sound7.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 10/unit10-sound8.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 10/unit10-sound9.mp3";
import sound10 from "../../../assets/audio/ClassBook/U 10/unit10-sound10.mp3";

const Unit10_Page1_Vocab = () => {
  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    { start: 0.459, end: 3.02, text: "Page 82, unit 10 vocabulary." },

    { start: 4.18, end: 6.1, text: "1, putting on a jacket." },
    { start: 6.76, end: 8.16, text: "2, taking a shower." },
    { start: 9.52, end: 11.28, text: "3, bathroom." },

    { start: 12.32, end: 14.58, text: "4, watching TV." },
    { start: 15.62, end: 16.86, text: "5, reading." },
    { start: 18.4, end: 20.18, text: "6, bedroom." },

    { start: 21.4, end: 22.36, text: "7, swinging." },
    { start: 23.84, end: 25.4, text: "8, yard." },
    { start: 26.34, end: 28.0, text: "9, kicking." },

    { start: 29.0, end: 31.76, text: "10, watering the flowers." },
  ];

  const wordAudios = [
    sound1,
    sound2,
    sound3,
    sound4,
    sound5,
    sound6,
    sound7,
    sound8,
    sound9,
    sound10,
  ];

  const nums = [num1, num2, num3, num4, num5, num6, num7, num8, num9, num10];

  return (
    <ModernVocabularyComponent
      backgroundImage={backgroundImage}
      mainAudio={vocabulary}
      wordAudios={wordAudios}
      nums={nums}
      vocabulary={[
        "putting on a jacket ",
        "taking a shower",
        "bathroom",
        "watching TV",
        "reading",
        "bedroom",
        "swinging",
        "yard",
        "kicking",
        "watering the flowers",
      ]}
      markers={[
        { id: 1, top: "26%", left: "32%" },

        { id: 2, top: "49%", left: "18%" }, // 100-51

        { id: 3, top: "44%", left: "27.5%" },

        { id: 4, top: "47%", left: "37%" },

        { id: 5, top: "65%", left: "24%" },

        { id: 6, top: "63%", left: "44%" }, // 100-37 , 100-56

        { id: 7, top: "36.5%", left: "60%" }, // 100-63.5 , 100-40

        { id: 8, top: "49%", left: "74%" },

        { id: 9, top: "60%", left: "57%" }, // 100-40 , 100-43

        { id: 10, top: "58.5%", left: "71%" }, // 100-41.5 , 100-29
      ]}
      captions={captions}
    />
  );
};

export default Unit10_Page1_Vocab;

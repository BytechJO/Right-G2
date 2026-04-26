import React, { useState, useRef, useEffect } from "react";
import backgroundImage from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page.png";
import page2_2 from "../../../assets/imgs/Voca.svg";
import vocabulary from "../../../assets/audio/ClassBook/U 9/CD52.Pg76_Instruction1_Adult Lady.mp3";
import "./Unit9_Page1.css";
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
import sound1 from "../../../assets/audio/ClassBook/U 9/unit9-sound1.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 9/unit9-sound2.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 9/unit9-sound3.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 9/unit9-sound4.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 9/unit9-sound5.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 9/unit9-sound6.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 9/unit9-sound7.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 9/unit9-sound8.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 9/unit9-sound9.mp3";
import sound10 from "../../../assets/audio/ClassBook/U 9/unit9-sound10.mp3";

const Unit9_Page1_Vocab = () => {

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    { start: 0.56, end: 2.5, text: "Page 76, Unit 9 vocabulary." },

    { start: 4.6, end: 5.92, text: "1, soccer." },
    { start: 6.76, end: 8.24, text: "2, hen." },
    { start: 9.1, end: 10.18, text: "3, chess." },
    { start: 11.7, end: 12.8, text: "4, thinking." },
    { start: 14.3, end: 16.3, text: "5, sending an email." },
    { start: 17.68, end: 19.46, text: "6, listening to the radio." },
    { start: 20.92, end: 21.9, text: "7, glasses." },
    { start: 23.54, end: 25.08, text: "8, looking." },

    { start: 26.16, end: 28.08, text: "9, ironing clothes." },
    { start: 29.36, end: 30.82, text: "10, cooking." },
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
        "soccer",
            "hen",
            "chess",
            "thinking",
            "sending an e-mail",
            "listening to the radio",
            "glasses",
            "looking",
            "ironing clothes",
            "cooking",
      ]}
 markers={[
  { id: 1, top: "25%", left: "28%" },

  { id: 2, top: "29%", left: "14%" }, // 100-71

  { id: 3, top: "55%", left: "35.5%" },

  { id: 4, top: "44%", left: "41%" },

  { id: 5, top: "46%", left: "19%" },

  { id: 6, top: "30%", left: "37%" }, // 100-70 , 100-63

  { id: 7, top: "38.5%", left: "56%" }, // 100-61.5 , 100-44

  { id: 8, top: "48%", left: "53%" },

  { id: 9, top: "45%", left: "65%" },

  { id: 10, top: "23%", left: "55%" }, // 100-77 , 100-45
]}
      captions={captions}
    />
  );
};

export default Unit9_Page1_Vocab;

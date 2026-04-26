import React, { useState, useRef, useEffect } from "react";
import backgroundImage from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page.png";
import page2_2 from "../../../assets/imgs/Voca.svg";
import vocabulary from "../../../assets/audio/ClassBook/U 5/Pg40_Vocab_Adult Lady.mp3";
import "./Unit5_Page1.css";
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

import sound1 from "../../../assets/audio/ClassBook/U 5/unit5-sound1.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 5/unit5-sound2.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 5/unit5-sound3.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 5/unit5-sound4.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 5/unit5-sound5.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 5/unit5-sound6.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 5/unit5-sound7.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 5/unit5-sound8.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 5/unit5-sound9.mp3";
import sound10 from "../../../assets/audio/ClassBook/U 5/unit5-sound10.mp3";

const Unit5_Page1_Vocab = () => {

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    { start: 0.459, end: 2.96, text: "Page 40, Unit 5 vocabulary." },
    {
      start: 4.239,
      end: 10.659,
      text: "1, kitchen. 2, carry. 3, fruit.",
    },
    { start: 11.719, end: 13.399, text: "4, meat." },
    { start: 14.42, end: 16.18, text: "5, fish." },
    { start: 17.299, end: 19.219, text: "6, rice." },
    { start: 20.299, end: 22.079, text: "7, chicken." },
    { start: 23.139, end: 25.0, text: "8, happy." },
    { start: 26.059, end: 30.719, text: "9, look. 10, tablecloth." },
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
  const wordRefs = useRef(wordAudios.map(() => React.createRef()));

  return (
    <ModernVocabularyComponent
      backgroundImage={backgroundImage}
      mainAudio={vocabulary}
      wordAudios={wordAudios}
      nums={nums}
      vocabulary={[
        "kitchen",
        "carry",
        "fruit",
        "meat",
        "fish",
        "rice",
        "chicken",
        "happy",
        "look",
        "tablecloth",
      ]}
      markers={[
        { id: 1, top: "30%", left: "53%" },

        { id: 2, top: "40%", left: "55%" }, // 100-60

        { id: 3, top: "48%", left: "26.5%" },

        { id: 4, top: "47%", left: "52%" },

        { id: 5, top: "49%", left: "46%" },

        { id: 6, top: "55%", left: "42%" }, // 100-45 , 100-58

        { id: 7, top: "47%", left: "48%" }, // 100-53 , 100-52

        { id: 8, top: "31%", left: "41%" }, // 100-69 , 100-59

        { id: 9, top: "46%", left: "61%" }, // 100-54 , 100-39

        { id: 10, top: "63%", left: "39%" }, // 100-37 , 100-61
      ]}
      captions={captions}
    />
  );
};

export default Unit5_Page1_Vocab;

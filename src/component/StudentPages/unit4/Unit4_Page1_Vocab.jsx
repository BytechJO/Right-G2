import React, { useState, useRef, useEffect } from "react";
import backgroundImage from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page.png";
import page2_2 from "../../../assets/imgs/Voca.svg";
import vocabulary from "../../../assets/audio/ClassBook/U 4/Pg28_Vocab_Adult Lady.mp3";
import "./Unit4_Page1.css";
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
import num11 from "../../../assets/imgs/Num11.svg";
import num12 from "../../../assets/imgs/Num12.svg";
import sound1 from "../../../assets/audio/ClassBook/U 4/unit4-sound1.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 4/unit4-sound2.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 4/unit4-sound3.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 4/unit4-sound4.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 4/unit4-sound5.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 4/unit4-sound6.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 4/unit4-sound7.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 4/unit4-sound8.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 4/unit4-sound9.mp3";
import sound10 from "../../../assets/audio/ClassBook/U 4/unit4-sound10.mp3";
import sound11 from "../../../assets/audio/ClassBook/U 4/unit4-sound11.mp3";
import sound12 from "../../../assets/audio/ClassBook/U 4/unit4-sound12.mp3";

const Unit4_Page1_Vocab = () => {

  // ================================
  // ✔ Captions Array
  // ================================
const captions = [
  { start: 0.5, end: 3.34, text: "Page 28, unit 4, vocabulary." },
  { start: 4.46, end: 12.0, text: "1: nurse. 2: pilot. 3: grow food." },
  { start: 13.06, end: 15.38, text: "4: taxi driver." },
  { start: 16.44, end: 18.26, text: "5: vet." },
  { start: 19.52, end: 21.46, text: "6: clerk." },
  { start: 22.48, end: 28.2, text: "7: photographer. 8: fix cars." },
  { start: 29.32, end: 31.58, text: "9: police officer." },
  { start: 32.66, end: 40.16, text: "10: farmer. 11: mechanic. 12: chef." },
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
    sound11,
    sound12,
  ];

  const nums = [
    num1,
    num2,
    num3,
    num4,
    num5,
    num6,
    num7,
    num8,
    num9,
    num10,
    num11,
    num12,
  ];
 
  return (
     <ModernVocabularyComponent
      backgroundImage={backgroundImage}
      mainAudio={vocabulary}
      wordAudios={wordAudios}
      nums={nums}
      vocabulary={[
         "nurse",
            "pilot",
            "grow food",
            "taxi driver",
            "vet",
            "clerk",
            "photographer",
            "fix cars",
            "police officer",
            "farmer",
            "mechanic",
            "chef",
      ]}
   markers={[
  { id: 1, top: "53%", left: "10%" },

  { id: 2, top: "49%", left: "26%" }, // 100-51

  { id: 3, top: "41%", left: "43.5%" },

  { id: 4, top: "53%", left: "34%" },

  { id: 5, top: "55%", left: "42%" },

  { id: 6, top: "70%", left: "22%" }, // 100-30 , 100-78

  { id: 7, top: "77.5%", left: "34%" }, // 100-22.5 , 100-66

  { id: 8, top: "68%", left: "61.5%" },

  { id: 9, top: "48%", left: "61%" },

  { id: 10, top: "27%", left: "42%" },

  { id: 11, top: "76%", left: "57%" }, // 100-24 , 100-43

  { id: 12, top: "75.5%", left: "46%" }, // 100-24.5 , 100-54
]}
      captions={captions}
    />
  );
};

export default Unit4_Page1_Vocab;

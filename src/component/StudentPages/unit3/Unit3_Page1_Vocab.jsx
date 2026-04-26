import React, { useState, useRef, useEffect } from "react";
import backgroundImage from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page.png";
import page2_2 from "../../../assets/imgs/Voca.svg";
import vocabulary from "../../../assets/audio/ClassBook/U 3/Pg22_Vocab_Adult Lady.mp3";
import "./Unit3_Page1.css";
import ModernVocabularyComponent from "../../ModernVocabularyComponent";

// import num1 from "../../../assets/imgs/Num1.svg";
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
import sound1 from "../../../assets/audio/ClassBook/U 3/unit3-sound1.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 3/unit3-sound2.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 3/unit3-sound3.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 3/unit3-sound4.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 3/unit3-sound5.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 3/unit3-sound6.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 3/unit3-sound7.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 3/unit3-sound8.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 3/unit3-sound9.mp3";
import sound10 from "../../../assets/audio/ClassBook/U 3/unit3-sound10.mp3";
import sound11 from "../../../assets/audio/ClassBook/U 3/unit3-sound11.mp3";

const Unit3_Page1_Vocab = () => {
  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    { start: 0.48, end: 3.46, text: "Page 22, unit 3, vocabulary." },
    { start: 4.68, end: 6.18, text: "1: swim." },
    { start: 7.3, end: 8.92, text: "2: kite." },
    { start: 10.06, end: 14.96, text: "3: sandwich. 4: picnic table." },
    { start: 15.98, end: 18.04, text: "5: play the drum." },
    { start: 19.06, end: 20.82, text: "6: drum." },
    { start: 21.94, end: 24.14, text: "7: take a photo." },
    { start: 25.32, end: 27.24, text: "8: ride a bike." },
    { start: 28.36, end: 30.22, text: "9: paint." },
    { start: 31.36, end: 33.28, text: "10: park." },
    { start: 34.3, end: 36.38, text: "11: bench." },
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
  ];

  return (
    <ModernVocabularyComponent
      backgroundImage={backgroundImage}
      mainAudio={vocabulary}
      wordAudios={[
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
      ]}
      nums={nums}
      vocabulary={[
        "swim",
        "kite",
        "sandwich",
        "picnic table",
        "play the drum",
        "drum",
        "take a photo",
        "ride a bike",
        "paint",
        "park",
        "bench",
      ]}
      markers={[
        { id: 1, top: "33%", left: "13%" },

        { id: 2, top: "24%", left: "72.5%" },

        { id: 3, top: "52%", left: "30.5%" },

        { id: 4, top: "57%", left: "35%" },

        { id: 5, top: "41%", left: "57%" },

        { id: 6, top: "57%", left: "62%" }, // 100-43 , 100-38

        { id: 7, top: "51.5%", left: "49%" }, // 100-48.5 , 100-51

        { id: 8, top: "25%", left: "62%" },

        { id: 9, top: "36%", left: "38%" },

        { id: 10, top: "54%", left: "14%" }, // 100-46 , 100-86

        { id: 11, top: "69.5%", left: "31%" }, // 100-30.5 , 100-69
      ]}
      captions={captions}
    />
  );
};

export default Unit3_Page1_Vocab;

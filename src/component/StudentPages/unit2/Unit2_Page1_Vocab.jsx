import React, { useState, useRef, useEffect } from "react";
import backgroundImage from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page.png";
import page2_2 from "../../../assets/imgs/Voca.svg";
import vocabulary from "../../../assets/audio/ClassBook/U 2/Pg10_Vocabulary_Adult Lady.mp3";
import "./Unit2_Page1.css";
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
import sound1 from "../../../assets/audio/ClassBook/U 2/sound1-unit2.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 2/sound2-unit2.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 2/sound3-unit2.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 2/sound4-unit2.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 2/sound5-unit2.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 2/sound6-unit2.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 2/sound7-unit2.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 2/sound8-unit2.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 2/sound9-unit2.mp3";
import sound10 from "../../../assets/audio/ClassBook/U 2/sound10-unit2.mp3";
import ModernVocabularyComponent from "../../ModernVocabularyComponent";

const Unit2_Page1_Vocab = () => {
  // ================================
  // ✔ Captions Array
  // ================================

  const captions = [
    { start: 0.58, end: 3.44, text: "Page 10, Unit 2, Vocabulary." },
    { start: 5.26, end: 6.66, text: "1. Duck." },
    { start: 7.7, end: 9.34, text: "2. Swim." },
    { start: 10.4, end: 12.38, text: "3. Bird." },
    { start: 13.32, end: 15.24, text: "4. Sun." },
    { start: 16.42, end: 18.28, text: "5. Cloud." },
    { start: 19.66, end: 21.34, text: "6. Pink." },
    { start: 22.78, end: 24.48, text: "7. Blue." },
    { start: 25.78, end: 27.54, text: "8. Flower." },
    { start: 28.76, end: 30.5, text: "9. Fly." },
    { start: 31.66, end: 33.44, text: "10. Pond." },
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

  const wordRefs = useRef(wordAudios.map(() => React.createRef()));

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
      ]}
      nums={[num1, num2, num3, num4, num5, num6, num7, num8, num9, num10]}
      vocabulary={[
        "duck",
        "swim",
        "bird",
        "sun",
        "cloud",
        "pink",
        "blue",
        "flower",
        "fly",
        "pond",
      ]}
      markers={[
        { id: 1, top: "36%", left: "13%" },

        { id: 2, top: "45%", left: "17%" }, // 100 - 55

        { id: 3, top: "17%", left: "60.5%" },

        { id: 4, top: "24%", left: "33%" },

        { id: 5, top: "22%", left: "17%" },

        { id: 6, top: "67%", left: "56%" }, // top: 100-33 , left: 100-44

        { id: 7, top: "45.5%", left: "73%" }, // top: 100-54.5 , left: 100-27

        { id: 8, top: "64.5%", left: "36%" }, // top: 100-35.5 , left: 100-64

        { id: 9, top: "18.5%", left: "56%" }, // top: 100-81.5 , left: 100-44

        { id: 10, top: "34.5%", left: "8%" }, // top: 100-65.5 , left: 100-92
      ]}
      captions={[
        { start: 0.58, end: 3.44, text: "Page 10, Unit 2, Vocabulary." },
        { start: 5.26, end: 6.66, text: "1. Duck." },
        { start: 7.7, end: 9.34, text: "2. Swim." },
        { start: 10.4, end: 12.38, text: "3. Bird." },
        { start: 13.32, end: 15.24, text: "4. Sun." },
        { start: 16.42, end: 18.28, text: "5. Cloud." },
        { start: 19.66, end: 21.34, text: "6. Pink." },
        { start: 22.78, end: 24.48, text: "7. Blue." },
        { start: 25.78, end: 27.54, text: "8. Flower." },
        { start: 28.76, end: 30.5, text: "9. Fly." },
        { start: 31.66, end: 33.44, text: "10. Pond." },
      ]}
    />
  );
};

export default Unit2_Page1_Vocab;

import backgroundImage from "../../../assets/imgs/Right 2 Unit 6 Helens Day/G4_U6_Pg_46_47.png";
import vocabulary from "../../../assets/audio/ClassBook/U 6/Pg46_Vocab_Adult Lady.mp3";
import "./Unit6_Page1.css";
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

import sound1 from "../../../assets/audio/ClassBook/U 6/unit6-sound1.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 6/unit6-sound2.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 6/unit6-sound3.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 6/unit6-sound4.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 6/unit6-sound5.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 6/unit6-sound6.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 6/unit6-sound7.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 6/unit6-sound8.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 6/unit6-sound9.mp3";
import sound10 from "../../../assets/audio/ClassBook/U 6/unit6-sound10.mp3";

const Unit6_Page1_Vocab = () => {

  // ================================
  // ✔ Captions Array
  // ================================
const captions = [
  { start: 0.6, end: 3.52, text: "Page 46, Unit 6 Vocabulary." },
  { start: 4.88, end: 6.42, text: "1 get up" },
  { start: 7.48, end: 9.56, text: "2 make the bed" },
  { start: 10.6, end: 12.7, text: "3 brush teeth" },
  { start: 13.7, end: 16.059, text: "4 eat breakfast" },
  { start: 18.12, end: 20.2, text: "5 go to school" },
  { start: 21.44, end: 23.74, text: "6 have a class" },
  { start: 24.82, end: 26.84, text: "7 go home" },
  { start: 27.98, end: 29.86, text: "8 eat lunch" },
  { start: 30.88, end: 33.08, text: "9 do homework" },
  { start: 34.04, end: 36.04, text: "10 go to sleep" },
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

  ];

  return (
    <ModernVocabularyComponent
      backgroundImage={backgroundImage}
      mainAudio={vocabulary}
      wordAudios={wordAudios}
      nums={nums}
      vocabulary={[
        "get up",
            "make the bed",
            "brush teeth",
            "eat breakfast",
            "go to school",
            "have a class",
            "go home",
            "eat lunch",
            "do homework",
            "go to sleep",
      ]}
 markers={[
  { id: 1, top: "50%", left: "13%" },

  { id: 2, top: "36%", left: "23%" }, // 100-64

  { id: 3, top: "52%", left: "25.5%" },

  { id: 4, top: "68%", left: "37%" },

  { id: 5, top: "52%", left: "37%" },

  { id: 6, top: "35%", left: "48%" }, // 100-65 , 100-52

  { id: 7, top: "50.5%", left: "59%" }, // 100-49.5 , 100-41

  { id: 8, top: "63%", left: "57%" },

  { id: 9, top: "58%", left: "66%" }, // 100-42 , 100-34

  { id: 10, top: "36.5%", left: "63%" }, // 100-63.5 , 100-37
]}
      captions={captions}
         pageId="sb-unit6-page1-vocab"
       height={70}
    />
  );
};

export default Unit6_Page1_Vocab;

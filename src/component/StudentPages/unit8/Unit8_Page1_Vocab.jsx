import backgroundImage from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page.png";
import vocabulary from "../../../assets/audio/ClassBook/U 8/Pg64_Vocabulary_Adult Lady.mp3";
import "./Unit8_Page1.css";
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
import sound1 from "../../../assets/audio/ClassBook/U 8/unit8-sound1.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 8/unit8-sound2.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 8/unit8-sound3.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 8/unit8-sound4.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 8/unit8-sound5.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 8/unit8-sound6.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 8/unit8-sound7.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 8/unit8-sound8.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 8/unit8-sound9.mp3";
import sound10 from "../../../assets/audio/ClassBook/U 8/unit8-sound10.mp3";

const Unit8_Page1_Vocab = () => {
  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    { start: 0.48, end: 3.2, text: "Page 64, unit 8, vocabulary" },
    { start: 4.58, end: 5.58, text: "1, pay." }, // party hat
    { start: 6.8, end: 8.52, text: "2, find." }, // jellow
    { start: 9.22, end: 10.34, text: "3, cap." }, // cake
    { start: 10.8, end: 12.84, text: "4, jacket." }, // Hello
    { start: 13.8, end: 15.34, text: "5, shorts." }, // Good morning
    { start: 16.74, end: 17.8, text: "6, tie." },
    { start: 19.24, end: 20.28, text: "7, socks." },
    { start: 21.7, end: 22.74, text: "8, closet." }, // Good morning
    { start: 24.3, end: 25.5, text: "9, dress." },
    { start: 26.94, end: 28.56, text: "10, clothing store." },
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
        "pay",
        "find",
        "cap",
        "jacket",
        "shorts",
        "tie",
        "socks",
        "closet",
        "dress",
        "clothing store",
      ]}
      markers={[
        { id: 1, top: "21%", left: "27%" },

        { id: 2, top: "64%", left: "35%" }, // 100-47

        { id: 3, top: "7%", left: "62.5%" },

        { id: 4, top: "11%", left: "81%" },

        { id: 5, top: "39%", left: "70%" },

        { id: 6, top: "46%", left: "51%" }, // 100-58 , 100-46

        { id: 7, top: "66.5%", left: "59%" }, // 100-44.5 , 100-37

        { id: 8, top: "22%", left: "72%" },

        { id: 9, top: "88%", left: "70%" }, // 100-37 , 100-24

        { id: 10, top: "12.5%", left: "51%" }, // 100-73.5 , 100-44
      ]}
      captions={captions}
    />
  );
};

export default Unit8_Page1_Vocab;

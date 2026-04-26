import backgroundImage from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/P58.png";
import vocabulary from "../../../assets/audio/ClassBook/U 7/Pg58_Vocab_Adult Lady.mp3";
import "./Unit7_Page1.css";
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

import sound1 from "../../../assets/audio/ClassBook/U 7/unit7-sound1.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 7/unit7-sound2.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 7/unit7-sound3.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 7/unit7-sound4.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 7/unit7-sound5.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 7/unit7-sound6.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 7/unit7-sound7.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 7/unit7-sound8.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 7/unit7-sound9.mp3";
import sound10 from "../../../assets/audio/ClassBook/U 7/unit7-sound10.mp3";

const Unit7_Page1_Vocab = () => {
  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    { start: 0.519, end: 4.0, text: "Page 58, unit 7 vocabulary." },

    { start: 4.22, end: 5.22, text: "1, airplane." },
    { start: 6.68, end: 8.32, text: "2, souvenir shop." },
    { start: 9.5, end: 10.96, text: "3, flight attendant." },
    { start: 11.58, end: 13.54, text: "4, roll." },

    { start: 14.5, end: 16.22, text: "5, pilot." },
    { start: 17.68, end: 18.82, text: "6, suitcase." },
    { start: 20.48, end: 21.74, text: "7, hold." },
    { start: 22.6, end: 24.02, text: "8, arrival." },
    { start: 25.0, end: 26.74, text: "9, reception." },
    { start: 28.34, end: 30.219, text: "10, airport." },
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
        "airplane",
        "souvenir shop",
        "flight attendant",
        "roll",
        "pilot",
        "suitcase",
        "hold",
        "arrival",
        "reception",
        "airport",
      ]}
      markers={[
        { id: 1, top: "19%", left: "59%" },

        { id: 2, top: "25%", left: "53%" }, // 100-75

        { id: 3, top: "37%", left: "59.5%" },

        { id: 4, top: "55%", left: "63%" },

        { id: 5, top: "43%", left: "48%" },

        { id: 6, top: "51%", left: "73%" }, // 100-49 , 100-27

        { id: 7, top: "64.5%", left: "64%" }, // 100-35.5 , 100-36

        { id: 8, top: "20%", left: "30%" },

        { id: 9, top: "60%", left: "37%" }, // 100-40 , 100-63

        { id: 10, top: "26.5%", left: "11%" }, // 100-73.5 , 100-89
      ]}
      captions={captions}
    />
  );
};

export default Unit7_Page1_Vocab;

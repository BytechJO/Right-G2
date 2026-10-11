import ModernVocabularyComponent from "../../ModernVocabularyComponent";

import backgroundImage from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page.png";

import num1 from "../../../assets/imgs/Num1.svg";
import num2 from "../../../assets/imgs/Num2.svg";
import num3 from "../../../assets/imgs/Num3.svg";
import num4 from "../../../assets/imgs/Num4.svg";
import num5 from "../../../assets/imgs/Num5.svg";
import num6 from "../../../assets/imgs/Num6.svg";
import num7 from "../../../assets/imgs/Num7.svg";
import num8 from "../../../assets/imgs/Num8.svg";
import num9 from "../../../assets/imgs/Num9.svg";

import "../../../index.css";
import soundFull from "../../../assets/audio/ClassBook/U 1/Pg4_Vocabulary_Adult Lady.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 1/sound1.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 1/sound2.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 1/sound3.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 1/sound4.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 1/sound5.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 1/sound6.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 1/sound7.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 1/sound8.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 1/sound9.mp3";

const Page4_vocabulary = () => {
  return (
    <ModernVocabularyComponent
      backgroundImage={backgroundImage}
      mainAudio={soundFull}
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
      ]}
      nums={[num1, num2, num3, num4, num5, num6, num7, num8, num9]}
      vocabulary={[
        "father",
        "knock",
        "brother",
        "mother",
        "sister",
        "play",
        "cousin",
        "aunt",
        "uncle",
      ]}
      markers={[
        { id: 1, top: "28%", left: "13%" },
        { id: 2, top: "22%", left: "24%" },
        { id: 3, top: "48%", left: "24%" },
        { id: 4, top: "30%", left: "36%" },
        { id: 5, top: "65%", left: "16%" },
        { id: 6, top: "65%", left: "26%" },
        { id: 7, top: "71%", left: "35%" },
        { id: 8, top: "54%", left: "56%" },
        { id: 9, top: "59%", left: "66%" },
      ]}
      captions={[
        { start: 0.54, end: 3.06, text: "Page 4, Unit 1 Vocabulary." },
        { start: 4.059, end: 5.68, text: "1 father" },
        { start: 6.52, end: 8.38, text: "2 knock" },
        { start: 9.24, end: 11.08, text: "3 brother" },
        { start: 12.1, end: 13.98, text: "4 mother" },
        { start: 15.02, end: 17.1, text: "5 sister" },
        { start: 17.94, end: 19.74, text: "6 play" },
        { start: 20.78, end: 22.76, text: "7 cousin" },
        { start: 23.8, end: 25.6, text: "8 aunt" },
        { start: 26.72, end: 28.62, text: "9 uncle" },
      ]}
      pageId="sb-unit1-page4-vocab"
      height={70}
    />
  );
};

export default Page4_vocabulary;

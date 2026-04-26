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

      wordAudios={[sound1, sound2, sound3, sound4, sound5, sound6, sound7, sound8, sound9]}
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
        { start: 0, end: 3.85, text: "Page 4, unit 1 vocabulary." },
        { start: 4.02, end: 6.45, text: "1 father" },
        { start: 6.52, end: 9.18, text: "2 knock" },
        { start: 9.24, end: 12.05, text: "3 brother" },
        { start: 12.12, end: 15.0, text: "4 mother" },
        { start: 15.06, end: 16.9, text: "5 sister" },
        { start: 17.0, end: 20.0, text: "6 play" },
        { start: 20.78, end: 22.18, text: "7 cousin" },
        { start: 22.8, end: 25.6, text: "8 aunt" },
        { start: 26.7, end: 28.12, text: "9 uncle" },
      ]}
    />
  );
};

export default Page4_vocabulary;
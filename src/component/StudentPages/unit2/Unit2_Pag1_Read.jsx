import sound1 from "../../../assets/audio/ClassBook/U 2/Pg10a_1.1_Adult Lady.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 2/Pg10a_1.2_Adult Lady.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 2/Pg10a_1.3_Adult Lady.mp3";
import Rabbit from "../../../assets/Page 01/Rabbit.svg";
import img1 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 10-11/10-01.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 10-11/Untitled-10_Artboard 1 copy.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 10-11/Untitled-10_Artboard 1 copy 2.svg";

import FourImagesWithAudio from "../../FourImagesWithAudio";
import longAudio from "../../../assets/audio/ClassBook/U 2/page10-unit2-listen.mp3";

const Unit2_Page1_Read = () => {
  const imageSounds = [
    null, // الصورة الأولى الكبيرة (إن ما بدك صوت إلها)
    new Audio(sound1),
    new Audio(sound2),
    new Audio(sound3),
  
  ];


const captions = [
  { start: 0.6, end: 3.98, text: "Page 10. Listen and read along." },
  { start: 5.28, end: 6.98, text: "C, Q." },
  { start: 8.14, end: 8.74, text: "Cat." },
  { start: 9.9, end: 10.56, text: "Queen." },
];


  return (
    <>
      <FourImagesWithAudio
        images={[Rabbit, img1, img2, img3]}
        audioSrc={longAudio}
        checkpoints={[0, 4.5, 8.14, 9.9]}
        popupOpen={true}
        titleQ={"Listen and read along."}
        audioArr={imageSounds}
        captions={captions}
      />
    </>
  );
};

export default Unit2_Page1_Read;

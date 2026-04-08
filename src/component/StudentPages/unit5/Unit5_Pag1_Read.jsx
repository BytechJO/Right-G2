import sound1 from "../../../assets/audio/ClassBook/U 5/Pg40b_1.1_Adult Lady.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 5/Pg40_1.2_Adult Lady.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 5/Pg40_1.3_Adult Lady.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 5/Pg40_1.4_Adult Lady.mp3"
import Rabbit from "../../../assets/Page 01/Rabbit.svg";
import img1 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 40-41/1-01.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 40-41/1-02.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 40-41/1-03.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 40-41/1-04.svg";
import FourImagesWithAudio from "../../FourImagesWithAudio";
import longAudio from "../../../assets/audio/ClassBook/U 5/cd28pg40-instruction1-adult-lady_T7fuBZhV.mp3";

const Unit5_Page1_Read = () => {
  const imageSounds = [
    null, // الصورة الأولى الكبيرة (إن ما بدك صوت إلها)
    new Audio(sound1),
    new Audio(sound2),
    new Audio(sound3),
    new Audio(sound4)
  
  ];

const captions = [
  { start: 0.459, end: 8.319, text: "Page 40. Listen and read along. Long E. Be," },
  { start: 8.319, end: 10.399, text: "feet, sleep" }
];
  return (
    <>
      <FourImagesWithAudio
        images={[Rabbit, img1, img2, img3,img4]}
        audioSrc={longAudio}
        checkpoints={[0, 4.60, 6.80, 8.30, 9.78]}
        popupOpen={true}
        titleQ={"Listen and read along."}
        audioArr={imageSounds}
        captions={captions}
      />
    </>
  );
};

export default Unit5_Page1_Read;

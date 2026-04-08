import sound1 from "../../../assets/audio/ClassBook/U 8/Pg64_1.1_Adult Lady.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 8/Pg64_1.2_Adult Lady.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 8/Pg64_1.3_Adult Lady.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 8/Pg64_1.4_Adult Lady.mp3"
import Rabbit from "../../../assets/Page 01/Rabbit.svg";
import img1 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 64-65/1-01.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 64-65/1-02.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 64-65/1-03.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 64-65/1-04.svg";
import FourImagesWithAudio from "../../FourImagesWithAudio";
import longAudio from "../../../assets/audio/ClassBook/U 8/cd45pg64-instruction1adult-lady_bXItgCSI.mp3";

const Unit8_Page1_Read = () => {
  const imageSounds = [
    null, // الصورة الأولى الكبيرة (إن ما بدك صوت إلها)
    new Audio(sound1),
    new Audio(sound2),
    new Audio(sound3),
    new Audio(sound4)
  
  ];

const captions = [
  { start: 0.459, end: 3.439, text: "Page 64. Listen and read along." },
  { start: 4.559, end: 5.52, text: "Long U." },
  { start: 6.72, end: 7.299, text: "Blue." },
  { start: 8.340, end: 9.000, text: "Glue." },
  { start: 10.039, end: 10.539, text: "Sue" }
];
  return (
    <>
      <FourImagesWithAudio
        images={[Rabbit, img1, img2, img3,img4]}
        audioSrc={longAudio}
        checkpoints={[0, 4.55, 6.72, 8.340, 10.039]}
        popupOpen={true}
        titleQ={"Listen and read along."}
        audioArr={imageSounds}
        captions={captions}
      />
    </>
  );
};

export default Unit8_Page1_Read;

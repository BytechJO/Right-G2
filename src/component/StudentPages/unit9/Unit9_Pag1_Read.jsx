import sound1 from "../../../assets/audio/ClassBook/U 9/Pg76_1.1_Adult Lady.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 9/Pg76_1.2_Adult Lady.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 9/Pg76_1.3_Adult Lady.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 9/Pg76_1.4._Adult Lady.mp3"
import Rabbit from "../../../assets/Page 01/Rabbit.svg";
import img1 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 76-77/1-01.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 76-77/1-02.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 76-77/1-03.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 76-77/1-04.svg";
import FourImagesWithAudio from "../../FourImagesWithAudio";
import longAudio from "../../../assets/audio/ClassBook/U 9/cd52pg76-instruction1-adult-lady-2_ps1vHADt.mp3";

const Unit9_Page1_Read = () => {
  const imageSounds = [
    null, // الصورة الأولى الكبيرة (إن ما بدك صوت إلها)
    new Audio(sound1),
    new Audio(sound2),
    new Audio(sound3),
    new Audio(sound4)
  
  ];

const captions = [
  { start: 0.519, end: 3.659, text: "Page 76. Listen and read along." },
  { start: 4.679, end: 5.759, text: "Short A." },
  { start: 6.839, end: 7.259, text: "Cap." },
  { start: 8.359, end: 8.859, text: "Man." },
  { start: 9.960, end: 10.499, text: "Sad" }
];
  return (
    <>
      <FourImagesWithAudio
        images={[Rabbit, img1, img2, img3,img4]}
        audioSrc={longAudio}
        checkpoints={[0, 4.67, 6.839, 8.359, 9.960]}
        popupOpen={true}
        titleQ={"Listen and read along."}
        audioArr={imageSounds}
        captions={captions}
      />
    </>
  );
};

export default Unit9_Page1_Read;

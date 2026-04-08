import sound1 from "../../../assets/audio/ClassBook/U 7/Pg58_1.1_Adult Lady.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 7/Pg58_1.2_Adult Lady.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 7/Pg58_1.3_Adult Lady.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 7/Pg58_1.4_Adult Lady.mp3";
import Rabbit from "../../../assets/Page 01/Rabbit.svg";
import img1 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 58-59/1-01.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 58-59/1-02.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 58-59/1-03.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 58-59/1-04.svg";
import FourImagesWithAudio from "../../FourImagesWithAudio";
import longAudio from "../../../assets/audio/ClassBook/U 7/cd40pg58-instruction1-adult-lady_8NWvMZwa.mp3";

const Unit7_Page1_Read = () => {
  const imageSounds = [
    null, // الصورة الأولى الكبيرة (إن ما بدك صوت إلها)
    new Audio(sound1),
    new Audio(sound2),
    new Audio(sound3),
    new Audio(sound4),
  ];

  const captions = [
    { start: 0.639, end: 3.639, text: "Page 58. Listen and read along." },
    { start: 4.759, end: 8.92, text: "Long O. Boat, snow," },
    { start: 9.939, end: 10.459, text: "home" },
  ];
  return (
    <>
      <FourImagesWithAudio
        images={[Rabbit, img1, img2, img3, img4]}
        audioSrc={longAudio}
        checkpoints={[0, 4.67, 6.92, 8.34, 9.94]}
        popupOpen={true}
        titleQ={"Listen and read along."}
        audioArr={imageSounds}
        captions={captions}
      />
    </>
  );
};

export default Unit7_Page1_Read;

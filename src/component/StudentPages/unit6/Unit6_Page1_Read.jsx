import sound1 from "../../../assets/audio/ClassBook/U 6/Pg46_1.1_Adult Lady.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 6/Pg46_1.2_Adult Lady.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 6/Pg46_1.3_Adult Lady.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 6/Pg46_1.4_Adult Lady.mp3";
import Rabbit from "../../../assets/Page 01/Rabbit.svg";
import img1 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 46-47/Untitled-22-01.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 46-47/Untitled-22-02.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 46-47/Untitled-22-03.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 46-47/Untitled-22-04.svg";
import FourImagesWithAudio from "../../FourImagesWithAudio";
import longAudio from "../../../assets/audio/ClassBook/U 6/cd33pg46-instruction1-adult-lady_52DjC2YG.mp3";

const Unit6_Page1_Read = () => {
  const imageSounds = [
    null, // الصورة الأولى الكبيرة (إن ما بدك صوت إلها)
    new Audio(sound1),
    new Audio(sound2),
    new Audio(sound3),
    new Audio(sound4),
  
  ];

const captions = [
  { start: 0.459, end: 5.639, text: "Page 46. Listen and read along. Long I." },
  { start: 6.679, end: 8.639, text: "Bike, five," },
  { start: 9.659, end: 10.159, text: "kite" }
];
  return (
    <>
      <FourImagesWithAudio
        images={[Rabbit, img1, img2, img3,img4]}
        audioSrc={longAudio}
        checkpoints={[0, 4.42, 6.6, 7.12, 9.66]}
        popupOpen={true}
        titleQ={"Listen and read along."}
        audioArr={imageSounds}
        captions={captions}
      />
    </>
  );
};

export default Unit6_Page1_Read;

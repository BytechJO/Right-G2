import sound1 from "../../../assets/audio/ClassBook/U 3/Pg22_1.1_Adult Lady.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 3/Pg22_1.2_Adult Lady.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 3/Pg22_1.3_Adult Lady.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 3/Pg22_1.4_Adult Lady.mp3"
import Rabbit from "../../../assets/Page 01/Rabbit.svg";
import img1 from "../../../assets/imgs/test.png";
import img2 from "../../../assets/imgs/test.png";
import img3 from "../../../assets/imgs/test.png";
import img4 from "../../../assets/imgs/test.png";
import FourImagesWithAudio from "../../FourImagesWithAudio";
import longAudio from "../../../assets/audio/ClassBook/U 3/CD16.Pg22_Instruction1_Adult Lady.mp3";

const Unit3_Page1_Read = () => {
  const imageSounds = [
    null, // الصورة الأولى الكبيرة (إن ما بدك صوت إلها)
    new Audio(sound1),
    new Audio(sound2),
    new Audio(sound3),
    new Audio(sound4)
  
  ];

const captions = [
   { start: 0, end: 3.05, text: "Page 10. Listen and read along." },
    { start: 3.07, end: 6.14, text: "B, bird, ball, boy " },
    
  ];
  return (
    <>
      <FourImagesWithAudio
        images={[Rabbit, img1, img2, img3,img4]}
        audioSrc={longAudio}
        checkpoints={[0, 2.9, 3.4, 4.2, 5.1]}
        popupOpen={true}
        titleQ={"Listen and read along."}
        audioArr={imageSounds}
        captions={captions}
      />
    </>
  );
};

export default Unit3_Page1_Read;

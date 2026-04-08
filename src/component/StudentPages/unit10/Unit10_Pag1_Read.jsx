import sound1 from "../../../assets/audio/ClassBook/U 10/Pg82_1.1_Adult Lady.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 10/Pg82_1.2_Adult Lady.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 10/Pg82_1.3_Adult Lady.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 10/Pg82_1.4_Adult Lady.mp3"
import Rabbit from "../../../assets/Page 01/Rabbit.svg";
import img1 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 86/Untitled-22-01.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 86/Untitled-22-02.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 86/Untitled-22-03.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 86/Untitled-22-04.svg";
import FourImagesWithAudio from "../../FourImagesWithAudio";
import longAudio from "../../../assets/audio/ClassBook/U 10/cd58pg82-instruction1-adult-lady_7cocaKEJ.mp3";

const Unit10_Page1_Read = () => {
  const imageSounds = [
    null, // الصورة الأولى الكبيرة (إن ما بدك صوت إلها)
    new Audio(sound1),
    new Audio(sound2),
    new Audio(sound3),
    new Audio(sound4)
  
  ];

const captions = [
  { start: 0.439, end: 3.119, text: "Page 82. Listen and read along." },
  { start: 4.199, end: 5.159, text: "Short E:" },
  { start: 6.239, end: 6.639, text: "net," },
  { start: 7.799, end: 8.380, text: "nest," },
  { start: 9.399, end: 9.819, text: "egg" }
];
  return (
    <>
      <FourImagesWithAudio
        images={[Rabbit, img1, img2, img3,img4]}
        audioSrc={longAudio}
        checkpoints={[0, 4.199, 6.239, 7.799, 9.399]}
        popupOpen={true}
        titleQ={"Listen and read along."}
        audioArr={imageSounds}
        captions={captions}
      />
    </>
  );
};

export default Unit10_Page1_Read;

import sound1 from "../../../assets/audio/ClassBook/U 4/Pg28_1.1_Adult Lady.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 4/Pg28_1.2_Adult Lady.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 4/Pg28_1.3_Adult Lady.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 4/Pg28_1.4_Adult Lady.mp3";
import Rabbit from "../../../assets/Page 01/Rabbit.svg";
import img1 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 28-29/Untitled-22-01.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 28-29/Untitled-22-02.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 28-29/Untitled-22-03.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 28-29/Untitled-22-04.svg";
import FourImagesWithAudio from "../../FourImagesWithAudio";
import longAudio from "../../../assets/audio/ClassBook/U 4/cd21pg28instruction1-adult-lady_kBDuFMKR.mp3";

const Unit4_Page1_Read = () => {
  const imageSounds = [
    null, // الصورة الأولى الكبيرة (إن ما بدك صوت إلها)
    new Audio(sound1),
    new Audio(sound2),
    new Audio(sound3),
    new Audio(sound4),
  ];

const captions = [
  { start: 0.5, end: 3.94, text: "Page 28. Listen and read along." },
  { start: 5.14, end: 6.22, text: "Long A." },
  { start: 7.34, end: 7.86, text: "May." },
  { start: 8.94, end: 10.98, text: "Rain. Cake." },
];
  return (
    <>
      <FourImagesWithAudio
        images={[Rabbit, img1, img2, img3, img4]}
        audioSrc={longAudio}
        checkpoints={[0, 3.94, 7.34, 8.94, 9.56]}
        popupOpen={true}
        titleQ={"Listen and read along."}
        audioArr={imageSounds}
        captions={captions}
      />
    </>
  );
};

export default Unit4_Page1_Read;

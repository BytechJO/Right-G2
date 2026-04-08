import sound1 from "../../../assets/audio/ClassBook/U 3/Pg22_1.1_Adult Lady.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 3/Pg22_1.2_Adult Lady.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 3/Pg22_1.3_Adult Lady.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 3/Pg22_1.4_Adult Lady.mp3";
import Rabbit from "../../../assets/Page 01/Rabbit.svg";
import img1 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 22-23/Untitled-1-01.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 22-23/Untitled-22-02.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 22-23/Untitled-22-03.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 22-23/Untitled-22-04.svg";
import FourImagesWithAudio from "../../FourImagesWithAudio";
import longAudio from "../../../assets/audio/ClassBook/U 3/cd16pg22-instruction1.mp3";

const Unit3_Page1_Read = () => {
  const imageSounds = [
    null, // الصورة الأولى الكبيرة (إن ما بدك صوت إلها)
    new Audio(sound1),
    new Audio(sound2),
    new Audio(sound3),
    new Audio(sound4),
  ];

  const captions = [
    { start: 0.56, end: 3.98, text: "Page 22. Listen and read along." },
    { start: 5.02, end: 5.4, text: "J." },
    { start: 6.48, end: 8.08, text: "Jacket." },
    { start: 8.08, end: 8.64, text: "Jam." },
    { start: 9.72, end: 10.2, text: "Jet." },
  ];
  return (
    <>
      <FourImagesWithAudio
        images={[Rabbit, img1, img2, img3, img4]}
        audioSrc={longAudio}
        checkpoints={[0, 3.98, 6.48, 8.08, 9.72]}
        popupOpen={true}
        titleQ={"Listen and read along."}
        audioArr={imageSounds}
        captions={captions}
      />
    </>
  );
};

export default Unit3_Page1_Read;

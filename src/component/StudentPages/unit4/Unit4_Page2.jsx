import page_2 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 29.png";
import img1_letter from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 28-29/Untitled-22-01.svg";
import img2_letter from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 28-29/Untitled-22-06.svg";
import img3_letter from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 28-29/Untitled-22-07.svg";
import img4_letter from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 28-29/Untitled-22-08.svg";
import Rabbit from "../../../assets/Page 01/Rabbit.svg";
import soundListen from "../../../assets/audio/ClassBook/U 4/pg29-reading-adult-lady_Ic3rdX1F.mp3";
import sound1_letter from "../../../assets/audio/ClassBook/U 4/Pg29_1.1_Adult Lady.mp3";
import sound2_letter from "../../../assets/audio/ClassBook/U 4/Pg29_1.2_Adult Lady.mp3";
import sound3_letter from "../../../assets/audio/ClassBook/U 4/Pg29_1.3_Adult Lady.mp3";
import sound4_letter from "../../../assets/audio/ClassBook/U 4/Pg29_1.4_Adult Lady.mp3";
import letterSound from "../../../assets/audio/ClassBook/U 4/pg29-instruction1-adult-lady_wI6B8Mcm (1).mp3";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
import AudioWithCaption from "../../AudioWithCaption";
import FourImagesWithAudio from "../../FourImagesWithAudio";
import sound8 from "../../../assets/audio/ClassBook/U 4/unit4-sound8.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 4/unit4-sound9.mp3";
import sound11 from "../../../assets/audio/ClassBook/U 4/unit4-sound11.mp3";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
import "./Unit4_Page2.css";
import ReadChoose from "../../ReadChoose";

import q1Audio from "../../../assets/audio/ClassBook/U 4/Page 29/Helen’s uncle is a.mp3";
import q1o1Audio from "../../../assets/audio/ClassBook/U 4/Page 29/Helen’s uncle takes pictures of.mp3";
import q1o2Audio from "../../../assets/audio/ClassBook/U 4/Page 29/animals.mp3";
import q1o3Audio from "../../../assets/audio/ClassBook/U 4/Page 29/nurse.mp3";
import q1o4Audio from "../../../assets/audio/ClassBook/U 4/Page 29/people.mp3";
import q1o5Audio from "../../../assets/audio/ClassBook/U 4/Page 29/photographer.mp3";
import q1o6Audio from "../../../assets/audio/ClassBook/U 4/Page 29/vet.mp3";
import q1o7Audio from "../../../assets/audio/ClassBook/U 4/Page 29/zoos.mp3";

const Unit4_Page2 = ({ openPopup }) => {
  const { audioRef, activeId, setActiveId } = useContext(AudioContext);
  // أصوات الصور
  const imageSounds = [
    null, // الصورة الأولى الكبيرة (إن ما بدك صوت إلها)
    new Audio(sound1_letter),
    new Audio(sound2_letter),
    new Audio(sound3_letter),
    new Audio(sound4_letter),
  ];

  const readChooseData = {
    title: "Read and tap or click the correct answer.",

    questions: [
      {
        text: "Helen’s uncle takes pictures of",
        audio: q1o1Audio, // صوت السؤال
        options: [
          { text: "zoos", audio: q1o7Audio },
          { text: "people", audio: q1o4Audio },
          { text: "animals", audio: q1o2Audio },
        ],
        correct: "animals",
      },
      {
        text: "Helen’s uncle is a",
        audio: q1Audio, // صوت السؤال
        options: [
          { text: "vet", audio: q1o6Audio },
          { text: "photographer", audio: q1o5Audio },
          { text: "nurse", audio: q1o3Audio },
        ],
        correct: "photographer",
      },
    ],
  };
  const captionsExample = [
    { start: 0.52, end: 4.78, text: "Page 29. My uncle's job." },
    {
      start: 4.78,
      end: 13.72,
      text: "My uncle is a photographer. He takes pictures of animals. His favorite animals are tigers and panthers. I think they are scary.",
    },
  ];

  const captions2 = [
    { start: 0.56, end: 3.86, text: "Page 29. Listen and read along." },
    { start: 4.94, end: 5.94, text: "Long A." },
    { start: 6.98, end: 7.54, text: "Play." },
    { start: 8.64, end: 10.6, text: "Paint. Lake." },
  ];

  const areas = [
    // الصوت الأول – المنطقة الأساسية
    { x1: 26.8, y1: 65.6, sound: 1, isPrimary: true },

    // // // الصوت الأول – منطقة إضافية
    { x1: 24.82, y1: 67.53, x2: 41.11, y2: 75.15, sound: 1, isPrimary: false },

    // // // // الصوت الثاني – الأساسية
    { x1: 25.6, y1: 43.1, sound: 2, isPrimary: true },

    // // // // الصوت الثاني – الإضافية
    { x1: 16.09, y1: 42.4, x2: 32.58, y2: 57.7, sound: 2, isPrimary: false },

    // // // // الصوت الثاني – الأساسية
    { x1: 14.7, y1: 69.7, sound: 3, isPrimary: true },

    // // // // الصوت الثاني – الإضافية
    { x1: 19.0, y1: 67.99, x2: 21.91, y2: 76.21, sound: 3, isPrimary: false },
  ];
  const sounds = {
    1: sound8,
    2: sound9,
    3: sound11,
  };
  const soundLabels = {
    1: "fix cars",
    2: "police officer",
    3: "mechanic",
  };
  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
    console.log("X%:", xPercent.toFixed(2), "Y%:", yPercent.toFixed(2));
  };
  const playSound = (path, id) => {
    if (!audioRef.current) return;

    // 🔥 وقف أي صوت شغال بأي صفحة
    audioRef.current.pause();
    audioRef.current.currentTime = 0;

    audioRef.current.src = path;
    audioRef.current.play();

    setActiveId(id); // 🔥 مهم للهايلايت

    audioRef.current.onended = () => {
      setActiveId(null);
    };
  };
  return (
    <div
      className="page1-img-wrapper"
      onClick={handleImageClick}
      style={{ backgroundImage: `url(${page_2})` }}
    >
      <audio ref={audioRef} style={{ display: "none" }} />

      {areas.map((area, index) => {
        const isActive = activeId === `p29-${area.sound}`;

        // ============================
        // 1️⃣ المنطقة الأساسية → دائرة تظهر فقط عندما تكون Active
        // ============================
        if (area.isPrimary) {
          return (
            <div
              key={index}
              className={`circle-area page5-audio-hotspot ${
                isActive ? "active" : ""
              }`}
              role="button"
              tabIndex={0}
              aria-label={`Play pronunciation: ${soundLabels[area.sound]}`}
              aria-pressed={isActive}
              style={{
                left: `${area.x1}%`,
                top: `${area.y1}%`,
              }}
              onClick={() => {
                playSound(sounds[area.sound], `p11-${area.sound}`);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  playSound(sounds[area.sound], `p11-${area.sound}`);
                }
              }}
            ></div>
          );
        }

        // ============================
        // 2️⃣ المناطق الفرعية → مربعات داكنة مخفية ولازم
        //    عند الضغط عليها → تفعّل الدائرة الأساسية
        // ============================
        return (
          <div
            key={index}
            className="clickable-area"
            aria-hidden="true"
            style={{
              position: "absolute",
              left: `${area.x1}%`,
              top: `${area.y1}%`,
              width: `${area.x2 - area.x1}%`,
              height: `${area.y2 - area.y1}%`,
            }}
            onClick={() => {
              playSound(sounds[area.sound], `p11-${area.sound}`);
            }}
          ></div>
        );
      })}

      <div
        className="headset-icon-CD-unit4-page2-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          tabIndex={0}
          role="button"
          aria-label="Open My Uncle’s Job audio"
          onClick={() =>
            openPopup(
              "audio",
              <AudioWithCaption
                src={soundListen}
                captions={captionsExample}
                pageId="sb-unit4-page2-MyUnclesJob"
              />,
            )
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPopup(
                "audio",
                <AudioWithCaption
                  src={soundListen}
                  captions={captionsExample}
                  pageId="sb-unit4-page2-MyUnclesJob"
                />,
              );
            }
          }}
          style={{ overflow: "visible" }}
        >
          <image
            className="svg-img"
            href={audioBtn}
            x="0"
            y="0"
            width="90"
            height="90"
          />
        </svg>
      </div>
      <div
        className="headset-icon-CD-unit4-page2-2 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          tabIndex={0}
          role="button"
          aria-label="Open listen read and repeat activity"
          onClick={() =>
            openPopup("html", <ReadChoose data={readChooseData} />)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPopup("html", <ReadChoose data={readChooseData} />);
            }
          }}
          style={{ overflow: "visible" }}
        >
          <image
            className="svg-img"
            href={arrowBtn}
            x="0"
            y="0"
            width="90"
            height="90"
          />
        </svg>
      </div>
      <div
        className="click-icon-unit4-page2-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() =>
            openPopup(
              "html",
              <FourImagesWithAudio
                images={[
                  Rabbit,
                  img1_letter,
                  img2_letter,
                  img3_letter,
                  img4_letter,
                ]}
                audioSrc={letterSound}
                checkpoints={[0, 4.5, 6.68, 8.64, 9.64]}
                popupOpen={true}
                titleQ={"Listen and read along."}
                audioArr={imageSounds}
                captions={captions2}
                pageId="sb-unit4-page2-listen-read"
                imageAlts={[
                  "Squirrel holding a circle with the letters long a",
                  "A play. The word play, with the letter long a in red",
                  "A paint. The word paint, with the letter long a in red",
                  "A lake. The word lake, with the letter long a in red",
                ]}
                subHeader="Press Play, follow the long a: play, paint, lake, then tap each card to hear it again"
              />,
            )
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPopup(
                "html",
                <FourImagesWithAudio
                  images={[
                    Rabbit,
                    img1_letter,
                    img2_letter,
                    img3_letter,
                    img4_letter,
                  ]}
                  audioSrc={letterSound}
                  checkpoints={[0, 4.5, 6.68, 8.64, 9.64]}
                  popupOpen={true}
                  titleQ={"Listen and read along."}
                  audioArr={imageSounds}
                  captions={captions2}
                  pageId="sb-unit4-page2-listen-read"
                  imageAlts={[
                    "Squirrel holding a circle with the letters long a",
                    "A play. The word play, with the letter long a in red",
                    "A paint. The word paint, with the letter long a in red",
                    "A lake. The word lake, with the letter long a in red",
                  ]}
                  subHeader="Press Play, follow the long a: play, paint, lake, then tap each card to hear it again"
                />,
              );
            }
          }}
          style={{ overflow: "visible" }}
        >
          <image
            className="svg-img"
            href={arrowBtn}
            x="0"
            y="0"
            width="90"
            height="90"
          />
        </svg>
      </div>
    </div>
  );
};

export default Unit4_Page2;

import React, { useRef, useState } from "react";
import page_6 from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 6.png";
import grammarSound from "../../../assets/audio/ClassBook/U 1/grammar-1.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 1/pg6a-31-adult-lady_58h0hPTj.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 1/pg6-11-adult-lady_h6tzN1h4.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 1/pg6-21-box-1.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 1/pg6-21-box-2.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 1/pg6-21-box-3.mp3";
import AudioWithCaption from "../../AudioWithCaption";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import pauseBtn from "../../../assets/Page 01/Right Video Button.svg";
import video from "../../../assets/video/grade2-unit1-page6.mp4";
import "./Page6.css";
const Page6 = ({ openPopup }) => {
  const { audioRef, activeId, setActiveId } = useContext(AudioContext);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const captionsExample = [
    {
      start: 0.539,
      end: 4.819,
      text: "Page 6, exercise 1. Right grammar.",
    },
    {
      start: 5.92,
      end: 8.84,
      text: "Who's he? Who's she?",
    },
    {
      start: 9.939,
      end: 10.739,
      text: "Who's he?",
    },
    {
      start: 11.84,
      end: 12.96,
      text: "He's my uncle.",
    },
    {
      start: 14.019,
      end: 17.039,
      text: "He's my brother. Who's she?",
    },
    {
      start: 18.159,
      end: 21.399,
      text: "She's my mother. She's my sister.",
    },
    {
      start: 22.439,
      end: 24.299,
      text: "Who's she?",
    },
    {
      start: 24.299,
      end: 29.779,
      text: "She's my sister. She's Sarah. He's my brother. He's John.",
    },
    {
      start: 30.92,
      end: 34.0,
      text: "She's my mother. She's Mrs. Dalton.",
    },
  ];
  // 🟩 مناطق مستطيلة (x1,y1,x2,y2)
  const clickableAreas = [
    { id: "pg1-1",x1: 5.91, y1: 8.44, x2: 30.54, y2: 20.01, sound: sound1 },
    { id: "pg1-2",x1: 58.65, y1: 8.28, x2: 93.56, y2: 20.01, sound: sound2 },
    { id: "pg1-3",x1: 7.46, y1: 24.43, x2: 26.08, y2: 31.59, sound: sound6 },
    { id: "pg1-4",x1: 56.91, y1: 24.73, x2: 77.66, y2: 32.2, sound: sound7 },
    { id: "pg1-5",x1: 8.82, y1: 62.66, x2: 41.4, y2: 68.14, sound: sound9 },
  ];
  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
    console.log("X%:", xPercent.toFixed(2), "Y%:", yPercent.toFixed(2));
  };
const playSound = (soundPath, id) => {
    if (!audioRef.current) return;

    // 🔥 وقف أي صوت شغال بأي صفحة
    audioRef.current.pause();
    audioRef.current.currentTime = 0;

    audioRef.current.src = soundPath;
    audioRef.current.play();

    setActiveId(id); // 🔥 هذا المهم

    audioRef.current.onended = () => {
      setActiveId(null);
    };
  };

  return (
    <div
      className="page1-img-wrapper"
      onClick={handleImageClick}
      style={{ backgroundImage: `url(${page_6})` }}
    >
      {/* رسم المستطيلات التفاعلية */}
      {clickableAreas.map((area, index) => (
        <div
          key={index}
          className={`clickable-area ${
            activeId === area.id ? "highlight" : ""
          }`}
          style={{
            position: "absolute",
            left: `${area.x1}%`,
            top: `${area.y1}%`,
            width: `${area.x2 - area.x1}%`,
            height: `${area.y2 - area.y1}%`,
          }}
          onClick={() => {
            playSound(area.sound, area.id);
          }}
          onMouseEnter={() => {
            if (!isPlaying) setHoveredAreaIndex(index);
          }}
          onMouseLeave={() => {
            if (!isPlaying ) setHoveredAreaIndex(null);
          }}
        ></div>
      ))}

      <div
        className="headset-icon-CD-page6 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() =>
            openPopup(
              "audio",
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <AudioWithCaption
                  src={grammarSound}
                  captions={captionsExample}
                />
              </div>,
            )
          }
          style={{ overflow: "visible" }}
        >
          <image
            className="svg-img"
            href={audioBtn}
            x="0"
            y="0"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
          />
        </svg>
      </div>
      <div
        className="pauseBtn-icon-CD-page6 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() =>
            openPopup(
              "video",
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  height: "100%",
                  width: "100%",
                }}
              >
                <video
                  autoPlay
                  controls
                  style={{
                    width: "auto",
                    height: "80%",
                    objectFit: "fill",
                    borderRadius: "20px",
                    display: "block",
                  }}
                >
                  <source src={video} type="video/mp4" />
                </video>
              </div>,
            )
          }
          style={{ overflow: "visible" }}
        >
          <image
            className="svg-img"
            href={pauseBtn}
            x="0"
            y="0"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
          />
        </svg>
      </div>
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
};

export default Page6;

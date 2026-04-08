import page24 from "../../../assets/imgs//Right 2 Unit 10 At Our Home/Page 92.png";
import React, { useState, useRef } from "react";
import "./Reading_Unit10_Page2.css";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
import sound1 from "../../../assets/audio/ClassBook/U 10/cd65pg92-reading-adult-lady_pZU1BSn3.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 10/Pg92_1.1_Adult Lady.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 10/Pg92_1.2_Adult Lady.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 10/Pg92_1.3_Adult Lady.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 10/Pg93_1.4_Adult Lady.mp3";
import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import pauseBtn from "../../../assets/Page 01/Right Video Button.svg";
import video3 from "../../../assets/video/reading/grade2-unit10-page92-93reading.mp4";

const Reading_Unit10_Page1 = ({ openPopup }) => {
const { audioRef, activeId, setActiveId } = useContext(AudioContext);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
const captionsExample = [
  { start: 0.519, end: 2.548, text: "Page 92 reading." },
  { start: 2.548, end: 4.577, text: "Sarah and Jack have fun." },
  { start: 4.577, end: 6.606, text: "\"Look, Mom and Dad, that's Uncle." },
  { start: 6.606, end: 8.635, text: "What's he doing?\"" },
  { start: 8.635, end: 10.664, text: "Jack asks." },
  { start: 10.664, end: 12.693, text: "\"He's driving a car,\"" },
  { start: 12.693, end: 14.722, text: "Dad answers." },
  { start: 14.722, end: 16.751, text: "\"What are those boys doing, Dad?\"" },
  { start: 16.751, end: 18.780, text: "Jack asks." },
  { start: 18.780, end: 20.809, text: "\"They are swimming in the water." },
  { start: 20.809, end: 22.838, text: "They are having a lot of fun,\"" },
  { start: 22.838, end: 24.867, text: "Dad replies." },
  { start: 24.867, end: 26.896, text: "\"I'm having a lot of fun watching them, too,\"" },
  { start: 26.896, end: 28.925, text: "Jack says." },
  { start: 28.925, end: 30.954, text: "\"Mom and Dad, what are you doing now?\"" },
  { start: 30.954, end: 32.983, text: "Jack asks." },
  { start: 32.983, end: 35.012, text: "\"We're watching TV." },
  { start: 35.012, end: 38.219, text: "There's a good program on about animals,\" Mom says." },

  { start: 39.239, end: 42.904, text: "\"What are you doing, Jack?" },
  { start: 42.904, end: 46.569, text: "Do you want to watch the program?\"" },
  { start: 46.569, end: 50.234, text: "Dad asks." },
  { start: 50.234, end: 53.899, text: "\"No, thanks, Dad,\" Jack replies." },
  { start: 53.899, end: 57.559, text: "\"Mom, when are Aunt and Uncle coming? I'm bored. I want to play with Sarah,\" Jack says. \"They are coming soon,\" Mom answers." },

  { start: 58.599, end: 62.931, text: "\"Look, Sarah, what's that cat doing?\"" },
  { start: 62.931, end: 67.263, text: "Jack asks." },
  { start: 67.263, end: 71.595, text: "\"It's playing with the mouse." },
  { start: 71.595, end: 75.927, text: "The cat likes to play, too,\" Sarah answers." },
  { start: 75.927, end: 80.259, text: "\"I'm glad Aunt and Uncle are visiting." },
  { start: 80.259, end: 84.591, text: "What are they doing?\"" },
  { start: 84.591, end: 88.923, text: "Jack asks." },
  { start: 88.923, end: 93.259, text: "\"Aunt is drinking coffee. Uncle is drinking juice,\" Dad says. \"What are you doing, children?\" Mom asks. \"We are having fun,\" Sarah says. \"We are having fun with ice cream,\" Jack adds. \"You are so funny,\" Dad laughs." }
];
  const clickableAreas = [
    { id: "p9-1",x1: 15.9, y1: 39.4, x2: 51.14, y2: 46.8, sound: sound2 },
    { id: "p9-2",x1: 56.0, y1: 39.1, x2: 93.9, y2: 49.5, sound: sound3 },
    { id: "p9-3",x1: 16.0, y1: 84.0, x2: 52.9, y2: 94.64, sound: sound4 },
    { id: "p9-4",x1: 56.0, y1: 84.5, x2: 93.7, y2: 90.9, sound: sound5 },
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
      style={{ backgroundImage: `url(${page24})` }}
    >
      {/* <img
        src={page24}
        style={{ display: "block" }}
        onClick={handleImageClick}
      /> */}

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
        className="headset-icon-CD-unit2-page11-1 hover:scale-110 transition"
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
                <AudioWithCaption src={sound1} captions={captionsExample} />
              </div>
            )
          }
          style={{ overflow: "visible" }}
        >
          <image className="svg-img" href={audioBtn} x="0" y="0" width="90" height="90" />
        </svg>
      </div>

      <div
        className="pauseBtn-icon-CD-page21 hover:scale-110 transition"
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
                  }}
                >
                  <source src={video3} type="video/mp4" />
                </video>
              </div>
            )
          }
          style={{ overflow: "visible" }}
        >
          <image className="svg-img" href={pauseBtn} x="0" y="0" width="90" height="90" />
        </svg>
      </div>
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
};

export default Reading_Unit10_Page1;

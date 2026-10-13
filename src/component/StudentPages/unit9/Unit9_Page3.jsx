import React, { useState } from "react";
import page_3 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 78.png";
import "./Unit9_Page3.css";
import grammarSound from "../../../assets/audio/ClassBook/U 7/cd41pg60-grammar1-adult-lady_TsMLtlcC.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 9/grammar1-marge1.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 9/grammar1-marge2.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 9/Pg78_2.1_Adult Lady.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 9/Pg78_3.1_Adult Lady.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 9/Pg78_4.1_Adult Lady.mp3";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import pauseBtn from "../../../assets/Page 01/Right Video Button.svg";
import video from "../../../assets/video/grade2-unit9-page78.mp4";
const Unit9_Page3 = ({ openPopup }) => {
  const { audioRef, activeId, setActiveId } = useContext(AudioContext);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const captionsExample = [
    {
      start: 0.479,
      end: 10.88,
      text: "Page 78, exercise 1. Right Grammar. He's ironing clothes. He's playing chess. He's listening to the radio.",
    },
    {
      start: 11.92,
      end: 18.039,
      text: "She's ironing clothes. She's playing chess. She's listening to the radio.",
    },
    {
      start: 19.139,
      end: 22.899,
      text: "He isn't cooking lunch. He isn't playing soccer.",
    },
    {
      start: 23.959,
      end: 42.04,
      text: "She isn't cooking lunch. She isn't playing soccer. Mom is ironing clothes. She isn't cooking lunch. Dad is listening to the radio. He isn't reading the newspaper. The hens are eating corn. They aren't eating grass",
    },
  ];
  const clickableAreas = [
    { id: "pg17-1", x1: 6.66, y1: 9.81, x2: 43.31, y2: 20.16, sound: sound1 },
    { id: "pg17-2", x1: 56.11, y1: 9.81, x2: 92.57, y2: 20.16, sound: sound2 },
    { id: "pg17-3", x1: 18.88, y1: 30.22, x2: 46.61, y2: 36.16, sound: sound5 },
    { id: "pg17-4", x1: 49.13, y1: 30.22, x2: 85.0, y2: 36.16, sound: sound6 },
    { id: "pg17-5", x1: 64.26, y1: 89.92, x2: 93.54, y2: 95.56, sound: sound7 },
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
      style={{ backgroundImage: `url(${page_3})` }}
    >
      <div
        className="headset-icon-CD-unit5-page3-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          tabIndex={0}
          role="button"
          aria-label="Open grammar audio"
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
                  pageId="sb-unit9-page3-grammar"
                />
              </div>,
            )
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
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
                    pageId="sb-unit9-page3-grammar"
                  />
                </div>,
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
        className="pauseBtn-icon-CD-unit5-page3-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          tabIndex={0}
          role="button"
          aria-label="Open grammar video"
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
                  <source src={video} type="video/mp4" />
                </video>
              </div>,
            )
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
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
                    <source src={video} type="video/mp4" />
                  </video>
                </div>,
              );
            }
          }}
          style={{ overflow: "visible" }}
        >
          <image
            className="svg-img"
            href={pauseBtn}
            x="0"
            y="0"
            width="90"
            height="90"
          />
        </svg>
      </div>

      {clickableAreas.map((area, index) => {
        const areaId = `p60-${index}`;

        return (
          <div
            key={index}
            tabIndex={0}
            role="button"
            aria-label={`Play sentence audio ${index + 1}`}
            aria-pressed={activeId === areaId}
            className={`clickable-area ${
              activeId === areaId || hoveredAreaIndex === index
                ? "highlight"
                : ""
            }`}
            style={{
              position: "absolute",
              left: `${area.x1}%`,
              top: `${area.y1}%`,
              width: `${area.x2 - area.x1}%`,
              height: `${area.y2 - area.y1}%`,
            }}
            onClick={() => {
              playSound(area.sound, areaId);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                playSound(area.sound, areaId);
              }
            }}
            onFocus={() => {
              setHoveredAreaIndex(index);
            }}
            onBlur={() => {
              setHoveredAreaIndex(null);
            }}
            onMouseEnter={() => {
              if (!isPlaying) setHoveredAreaIndex(index);
            }}
            onMouseLeave={() => {
              if (!isPlaying) setHoveredAreaIndex(null);
            }}
          />
        );
      })}
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
};

export default Unit9_Page3;

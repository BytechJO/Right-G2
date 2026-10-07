import React, {  useState } from "react";
import page25 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 21.png";
import "./Reading_Unit2_Page1.css";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
import sound1 from "../../../assets/audio/ClassBook/U 2/Pg21_1.5_Adult Lady.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 2/Pg21_1.6_Adult Lady.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 2/Pg21_1.7_Adult Lady.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 2/Pg21_1.8_Adult Lady.mp3";
const Reading_Unit2_Page2 = () => {
  const { audioRef, activeId, setActiveId } = useContext(AudioContext);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const clickableAreas = [
    { id: "p2-1", x1: 9.0, y1: 39.0, x2: 45.8, y2: 43.9, sound: sound1 },
    { id: "p2-2", x1: 49.0, y1: 39.2, x2: 85.4, y2: 44.53, sound: sound2 },
    { id: "p2-3", x1: 9.0, y1: 84.5, x2: 45.0, y2: 91.2, sound: sound3 },
    { id: "p2-4", x1: 49.0, y1: 84.5, x2: 86.5, y2: 91.0, sound: sound4 },
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
      style={{ backgroundImage: `url(${page25})` }}
    >
      {/* <img
        src={page25}
        style={{ display: "block" }}
        onClick={handleImageClick}
      /> */}

      {clickableAreas.map((area, index) => {
        const areaId = `p21-${index}`;

        return (
          <div
            key={index}
            role="button"
            tabIndex={0}
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

export default Reading_Unit2_Page2;

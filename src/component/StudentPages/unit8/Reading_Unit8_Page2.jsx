import React, { useEffect, useState, useRef } from "react";
import page25 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 75.png";
import "./Reading_Unit8_Page1.css";
import { useContext } from "react";
import { AudioContext } from "../../../AudioContext";
import sound1 from "../../../assets/audio/ClassBook/U 8/Pg75_1.5_Adult Lady.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 8/Pg75_1.6_Adult Lady.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 8/Pg75_1.7_Adult Lady.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 8/Pg75_1.8_Adult Lady.mp3";
const Reading_Unit8_Page2 = () => {
  const { audioRef, activeId, setActiveId } = useContext(AudioContext);

  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const clickableAreas = [
    { id: "sb_unit8_page75_reading_1", x1: 9.0, y1: 39.0, x2: 45.8, y2: 43.9, sound: sound1 },
    { id: "sb_unit8_page75_reading_2", x1: 49.0, y1: 39.2, x2: 85.4, y2: 43.1, sound: sound2 },
    { id: "sb_unit8_page75_reading_3", x1: 9.0, y1: 84.5, x2: 45.0, y2: 91.2, sound: sound3 },
    { id: "sb_unit8_page75_reading_4", x1: 49.0, y1: 84.5, x2: 86.5, y2: 91.0, sound: sound4 },
  ];

  const ownedPlayback = useRef(null);
  const [audioMessage, setAudioMessage] = useState("");
  const stopReading = () => {
    const owned = ownedPlayback.current;
    ownedPlayback.current = null;
    if (!owned) return;
    if (owned.audio.onended === owned.finish) {
      owned.audio.onended = null;
      owned.audio.onerror = null;
      owned.audio.pause();
    }
    setActiveId((current) => current === owned.id ? null : current);
  };
  const playSound = (soundPath, id) => {
    const audio = audioRef.current;
    if (!audio) return;
    stopReading();
    audio.onended = null;
    audio.onerror = null;
    audio.pause();
    const owned = { audio, id, finish: null };
    const ownsAudio = () => ownedPlayback.current === owned && audio.onended === owned.finish;
    const finish = () => {
      if (!ownsAudio()) return;
      ownedPlayback.current = null;
      audio.onended = null;
      audio.onerror = null;
      setActiveId((current) => current === id ? null : current);
    };
    const fail = () => {
      if (!ownsAudio()) return;
      audio.pause();
      finish();
      setAudioMessage("Audio could not be played. Please try again.");
    };
    owned.finish = finish;
    ownedPlayback.current = owned;
    audio.onended = finish;
    audio.onerror = fail;
    setAudioMessage("");
    setActiveId(id);
    try {
      audio.currentTime = 0;
      audio.src = soundPath;
      audio.play().catch(fail);
    } catch { fail(); }
  };
  useEffect(() => {
    const otherPlay = (event) => {
      const owned = ownedPlayback.current;
      if (!owned || event.target === owned.audio && owned.audio.onended === owned.finish) return;
      ownedPlayback.current = null;
      if (owned.audio.onended === owned.finish) {
        owned.audio.onended = null;
        owned.audio.onerror = null;
        owned.audio.pause();
      }
      setActiveId((current) => current === owned.id ? null : current);
    };
    document.addEventListener("play", otherPlay, true);
    return () => {
      document.removeEventListener("play", otherPlay, true);
      const owned = ownedPlayback.current;
      ownedPlayback.current = null;
      if (!owned) return;
      if (owned.audio.onended === owned.finish) {
        owned.audio.onended = null;
        owned.audio.onerror = null;
        owned.audio.pause();
      }
      setActiveId((current) => current === owned.id ? null : current);
    };
  }, [setActiveId]);


  return (
    <div
      className="page1-img-wrapper"
      style={{ backgroundImage: `url(${page25})` }}
    >

      {clickableAreas.map((area, index) => (
        <div
          key={area.id}
          role="button"
          tabIndex={0}
          aria-label={`Play sentence audio ${index + 1} on page 75`}
          aria-pressed={activeId === area.id}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); if (!e.repeat) playSound(area.sound, area.id); } }}
          onKeyUp={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); } }}
          onFocus={() => setHoveredAreaIndex(index)}
          onBlur={() => setHoveredAreaIndex(null)}
          className={`clickable-area rounded-md focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4! ${activeId === area.id || hoveredAreaIndex === index ? "highlight" : ""}`}
          style={{
            position: "absolute",
            left: `${area.x1}%`,
            top: `${area.y1}%`,
            width: `${area.x2 - area.x1}%`,
            height: `${area.y2 - area.y1}%`,
            borderRadius: "8px",
          }}
          onClick={() => {
            playSound(area.sound, area.id);
          }}
          onMouseEnter={() => {
            setHoveredAreaIndex(index);
          }}
          onMouseLeave={() => {
            setHoveredAreaIndex(null);
          }}
        ></div>
      ))}
      <div className="sr-only" role="status" aria-live="polite">{audioMessage}</div>
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
};

export default Reading_Unit8_Page2;

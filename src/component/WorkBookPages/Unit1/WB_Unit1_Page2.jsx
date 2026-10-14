import React, { useEffect, useRef, useState } from "react";
import page2 from "../../../assets/imgs/WorkBook/WB_Right Int.  WB  G2_Content Folder/WB_Right Int.  WB  G2_Content2.png";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
import unit1Audio from "../../../assets/audio/WorkBook/titel G2/Unit 1.mp3";
import unit2Audio from "../../../assets/audio/WorkBook/titel G2/Unit 2.mp3";
import unit3Audio from "../../../assets/audio/WorkBook/titel G2/Unit 3.mp3";
import unit4Audio from "../../../assets/audio/WorkBook/titel G2/Unit 4.mp3";
import unit5Audio from "../../../assets/audio/WorkBook/titel G2/Unit 5.mp3";
import unit6Audio from "../../../assets/audio/WorkBook/titel G2/Unit 6.mp3";
import unit7Audio from "../../../assets/audio/WorkBook/titel G2/Unit 7.mp3";
import unit8Audio from "../../../assets/audio/WorkBook/titel G2/Unit 8.mp3";
import unit9Audio from "../../../assets/audio/WorkBook/titel G2/Unit 9.mp3";
import unit10Audio from "../../../assets/audio/WorkBook/titel G2/Unit 10.mp3";

const units = [
  {
    number: 1,
    title: "Stella’s Family",
    page: 3,
    audio: unit1Audio,
    top: "18.1%",
    width: "16.5%",
  },
  {
    number: 2,
    title: "A Day at the Park",
    page: 9,
    audio: unit2Audio,
    top: "23.2%",
    width: "20%",
  },
  {
    number: 3,
    title: "On a Picnic",
    page: 15,
    audio: unit3Audio,
    top: "28.3%",
    width: "13%",
  },
  {
    number: 4,
    title: "Helen’s Uncle Is a Photographer",
    page: 21,
    audio: unit4Audio,
    top: "33.4%",
    width: "37%",
  },
  {
    number: 5,
    title: "Yummy... I Like It!",
    page: 27,
    audio: unit5Audio,
    top: "38.5%",
    width: "20%",
  },
  {
    number: 6,
    title: "Helen’s Day",
    page: 33,
    audio: unit6Audio,
    top: "43.6%",
    width: "14%",
  },
  {
    number: 7,
    title: "It’s Boarding Time",
    page: 39,
    audio: unit7Audio,
    top: "48.7%",
    width: "21%",
  },
  {
    number: 8,
    title: "It’s Shopping Time",
    page: 45,
    audio: unit8Audio,
    top: "53.8%",
    width: "22%",
  },
  {
    number: 9,
    title: "Visiting Our Grandparents",
    page: 51,
    audio: unit9Audio,
    top: "58.9%",
    width: "33%",
  },
  {
    number: 10,
    title: "At Our Home",
    page: 57,
    audio: unit10Audio,
    top: "64%",
    width: "16%",
  },
];
const focusClass =
  "focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-2!";

const WB_Unit1_Page2 = ({ goToUnit }) => {
  const audioRef = useRef(null);
  const [playingUnit, setPlayingUnit] = useState(null);
  const [message, setMessage] = useState("");

  const stopAudio = () => {
    const audio = audioRef.current;
    audioRef.current = null;
    setPlayingUnit(null);
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      try {
        audio.currentTime = 0;
      } catch {
        /* media not ready */
      }
    }
  };
  const playUnitAudio = (unit) => {
    stopAudio();
    const audio = new Audio(unit.audio);
    audioRef.current = audio;
    setPlayingUnit(unit.number);
    setMessage(`Playing Unit ${unit.number}: ${unit.title}.`);
    const finish = () => {
      if (audioRef.current !== audio) return;
      audioRef.current = null;
      audio.onended = null;
      audio.onerror = null;
      setPlayingUnit(null);
    };
    const fail = () => {
      if (audioRef.current !== audio) return;
      audio.pause();
      finish();
      setMessage("Audio could not be played. Please try again.");
    };
    audio.onended = finish;
    audio.onerror = fail;
    try {
      audio.play().catch(fail);
    } catch {
      fail();
    }
  };
  const handleGoToUnit = (unit) => {
    stopAudio();
    goToUnit(unit.page);
  };
  const onActivateKey = (event, action) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    event.stopPropagation();
    if (!event.repeat) action();
  };
  const onActivateKeyUp = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
    }
  };
  useEffect(() => {
    const otherPlay = (event) => {
      const audio = audioRef.current;
      if (!audio || event.target === audio) return;
      audioRef.current = null;
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      setPlayingUnit(null);
    };
    document.addEventListener("play", otherPlay, true);
    return () => {
      document.removeEventListener("play", otherPlay, true);
      const audio = audioRef.current;
      audioRef.current = null;
      if (audio) {
        audio.onended = null;
        audio.onerror = null;
        audio.pause();
      }
    };
  }, []);

  return (
    <div
      className="page1-img-wrapper"
      style={{ backgroundImage: `url(${page2})`, position: "relative" }}
    >
      <div className="sr-only" role="status" aria-live="polite">
        {message}
      </div>
      {units.map((unit) => (
        <React.Fragment key={unit.number}>
          <button
            type="button"
            aria-label={`Play Unit ${unit.number}: ${unit.title} audio`}
            aria-pressed={playingUnit === unit.number}
            onClick={() => playUnitAudio(unit)}
            onKeyDown={(event) =>
              onActivateKey(event, () => playUnitAudio(unit))
            }
            onKeyUp={onActivateKeyUp}
            className={`absolute cursor-pointer transition-all duration-150 ${focusClass} ${playingUnit === unit.number ? "ring-4 ring-green-500" : "hover:ring-2 hover:ring-blue-400"}`}
            style={{
              top: unit.top,
              left: "20%",
              width: unit.width,
              height: "2.6%",
              background: "transparent",
              border: "none",
              borderRadius: "8px",
            }}
          >
            {playingUnit === unit.number && (
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "-25px",
                  left: 0,
                  background: "#16a34a",
                  color: "#fff",
                  padding: "2px 8px",
                  borderRadius: "5px",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                }}
              >
                🔊 Playing
              </span>
            )}
          </button>
          <button
            type="button"
            aria-label={`Go to Unit ${unit.number}: ${unit.title}, page ${unit.page}`}
            onClick={() => handleGoToUnit(unit)}
            onKeyDown={(event) =>
              onActivateKey(event, () => handleGoToUnit(unit))
            }
            onKeyUp={onActivateKeyUp}
            className={`absolute z-20 flex items-center justify-center p-0 bg-transparent border-0 cursor-pointer transition-all duration-150 hover:scale-110 active:scale-95 rounded-full ${focusClass}`}
            style={{
              top: `calc(${unit.top} + 0.3%)`,
              left: `calc(20% + ${unit.width} + 1%)`,
              width: "18px",
              height: "18px",
              minWidth: "18px",
              minHeight: "18px",
              maxWidth: "18px",
              maxHeight: "18px",
              padding: 0,
            }}
          >
            <img
              src={arrowBtn}
              alt=""
              className="w-full h-full object-contain pointer-events-none"
            />
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default WB_Unit1_Page2;

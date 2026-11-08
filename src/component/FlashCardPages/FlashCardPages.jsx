import { useEffect, useRef } from "react";
import audioBtn from "../../assets/Page 01/Audio btn.svg";
import "./FlashCardViewer.css";

const activationKeys = {
  onKeyDown: (event) => {
    if (
      event.target !== event.currentTarget ||
      (event.key !== "Enter" && event.key !== " ")
    )
      return;
    event.preventDefault();
    event.stopPropagation();
    if (!event.repeat) event.currentTarget.click();
  },
  onKeyUp: (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
    }
  },
};

export default function FlashCardViewer({ card }) {
  const audioRef = useRef(null);
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (audio) {
        audio.pause();
        audio.removeAttribute("src");
      }
    };
  }, [card]);
  const playSound = (soundPath) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.src = soundPath;
    audio.play().catch(() => {});
  };

  return (
    <div
      data-flashcard
      className="page1-img-wrapper-flashcard"
      style={{ backgroundImage: `url(${card.img})` }}
    >
      <style>{`[data-flashcard] [data-flashcard-control]:focus-visible {outline:3px solid #2563eb !important;outline-offset:3px;border-radius:50%;}`}</style>
      {/* <img
        src={card.img}
        alt="flash"
        className="w-[350px] h-auto rounded-xl shadow-lg"
      /> */}

      {card.audio && (
        <div
          className="audio-btn-wrapper"
          role="button"
          tabIndex={0}
          data-flashcard-control
          {...activationKeys}
          aria-label="Play flashcard audio"
          onClick={() => playSound(card.audio)}
        >
          <svg width="22" height="22" viewBox="0 0 90 90">
            <image
              href={audioBtn}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid meet"
            />
          </svg>
        </div>
      )}
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
}

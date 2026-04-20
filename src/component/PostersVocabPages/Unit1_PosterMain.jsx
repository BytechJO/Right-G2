import React, { useState, useRef } from "react";
import audioBtn from "../../assets/Page 01/Audio btn.svg";
import AudioWithCaption from "../AudioWithCaption";
import "../../index.css";
import "./Unit1_PosterMain.css";

const PosterMain = ({ openPopup, data }) => {
  const {
    image,
    nums,
    words,
    sounds,
    positions,
    vocabularyAudio,
    captions,vocabBottom,vocabRight
  } = data;

  const [clickedIndex, setClickedIndex] = useState(null);
  const wordRefs = useRef(sounds.map(() => React.createRef()));

  const playWordAudio = (index) => {
    wordRefs.current.forEach((ref) => {
      if (ref.current) {
        ref.current.pause();
        ref.current.currentTime = 0;
      }
    });

    const audio = wordRefs.current[index].current;
    if (!audio) return;

    audio.currentTime = 0;
    audio.play();

    setClickedIndex(index);

    audio.onended = () => {
      setClickedIndex(null);
    };
  };

  return (
    <div>
      {/* Image + Words */}
      <div style={{ position: "relative", width: "fit-content" }}>
        
        {/* Words */}
        <div
          className="vocab_container_poster_vocab"
          style={{ bottom: vocabBottom, right:vocabRight }}
        >
          {words.map((text, i) => (
            <h6
              key={i}
              className={clickedIndex === i ? "active" : ""}
              onClick={() => playWordAudio(i)}
            >
              {i + 1} {text}
            </h6>
          ))}
        </div>

        {/* Numbers */}
        {nums.map((num, i) => (
          <img
            key={i}
            src={num}
            className={`num-img-posterVocab ${
              clickedIndex === i ? "active" : ""
            }`}
            style={{
              position: "absolute",
              top: positions[i]?.top,
              left: positions[i]?.left,
              height: "26px",
            }}
          />
        ))}

        {/* Poster Image */}
        <img
          src={image}
          alt="poster"
          className="poster-grammar-img max-w-full max-h-[80vh] object-fill rounded-xl shadow-lg"
        />
      </div>

      {/* Audio Button */}
      <div
        className="audio-btn-poster hover:scale-110 transition"
        onClick={() =>
          openPopup(
            "audio",
            <AudioWithCaption
              src={vocabularyAudio}
              captions={captions}
            />
          )
        }
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

      {/* Hidden audios */}
      {sounds.map((src, i) => (
        <audio key={i} ref={wordRefs.current[i]} src={src} />
      ))}
    </div>
  );
};

export default PosterMain;
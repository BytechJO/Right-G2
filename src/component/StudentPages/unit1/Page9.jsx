import React, { useState, useRef } from "react";
import page_9 from "../../../assets/imgs/pages/Right 2 Unit 1 Stellas Family_00001/Right 2 Unit 1 Stellas Family_00009.jpg";
import "./Page9.css"
// import song from "../../../assets/audio/placeholders/song.mp3";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
import AudioWithCaption from "../../AudioWithCaption";
const Page9 = ({ openPopup }) => {
  const audioRef = useRef(null);
  const captionsExample = [
    { start: 0, end: 2.29, text: " Page 9, exercise F." },
    { start: 2.32, end: 4.11, text: "Let's sing." },
    { start: 4.15, end: 6.0, text: "Good morning, good morning." },
    {
      start: 6.04,
      end: 10.02,
      text: " How are you? How are you? How are you?",
    },
    { start: 10.06, end: 11.19, text: " Good morning, good morning." },
    { start: 11.23, end: 15.19, text: "You are well? I am too." },
  ];

  return (
    <div
      className="page1-img-wrapper"
      style={{ backgroundImage: `url(${page_9})` }}
    >
      {/* <img src={page_9} /> */}
      <div
        className="headset-icon-CD-page9 hover:scale-110 transition"
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
                {/* <AudioWithCaption src={song} captions={captionsExample} /> */}
              </div>
            )
          }
          // className="headset-icon-CD-page9 hover:scale-110 transition"
          style={{ overflow: "visible" }}
        >
          <image className="svg-img"
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
        className="click-icon-page9-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() => openPopup("exercise", { startIndex: 4 })}
          style={{ overflow: "visible" }}
        >
          <image className="svg-img"
            href={arrowBtn}
            x="0"
            y="0"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
          />
        </svg>
      </div>
      <div
        className="click-icon-page9-2 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() => openPopup("exercise", { startIndex: 5 })}
          style={{ overflow: "visible" }}
        >
          <image className="svg-img"
            href={arrowBtn}
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

export default Page9;

import React from "react";
import "./Song_Page1.css";
import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import sound1 from "../../../assets/audio/ClassBook/U 10/CD67.Pg96_Song3_Adult Lady.mp3"
import page_1 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 96.png";
const Song_Page3 = ({openPopup}) => {
 const captions = [
  { start: 0.699, end: 2.759, text: "See the bird I have found." },

  { start: 4.599, end: 7.849, text: "It has two wings." },
  { start: 7.849, end: 11.099, text: "It has many feathers, and it's flying all around." },

  { start: 13.259, end: 17.859, text: "It looks very pretty, but it doesn't make a noisy sound." },
  { start: 17.859, end: 22.459, text: "See the bird I have found." },

  { start: 24.159, end: 27.159, text: "See the cat I have found." },

  { start: 28.539, end: 32.419, text: "It has a short tail." },
  { start: 32.419, end: 36.299, text: "It has fair hair, and it's meowing all around." },

  { start: 37.939, end: 42.419, text: "It's white, and it makes a meowing sound." },

  { start: 43.899, end: 46.439, text: "See the cat I have found." },

  { start: 47.799, end: 49.439, text: "Meow, meow, meow." }
];
  return (
    <div
      className="page1-img-wrapper"
      style={{ backgroundImage: `url(${page_1})` }}
    >
  <div
        className="headset-icon-CD-song-page3-1 hover:scale-110 transition"
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
                <AudioWithCaption src={sound1} captions={captions} />
              </div>
            )
          }
          style={{ overflow: "visible" }}
        >
          <image className="svg-img" href={audioBtn} x="0" y="0" width="90" height="90" />
        </svg>
      </div>



    </div>
  );
};

export default Song_Page3;

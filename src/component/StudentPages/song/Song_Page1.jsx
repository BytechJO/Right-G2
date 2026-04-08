import React from "react";
import "./Song_Page1.css";
import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import sound1 from "../../../assets/audio/ClassBook/U 10/CD66.Pg95_Song1_Adult Lady.mp3"
import page_1 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 94.png";
const Song_Page1 = ({openPopup}) => {
const captions = [
  { start: 0.579, end: 3.889, text: "I can see a restaurant down the street, down the street, down the street." },
  { start: 3.889, end: 7.199, text: "My sister is hungry and there's lots of food she can eat." },
  { start: 7.199, end: 10.509, text: "Oh, she's hungry." },
  { start: 10.509, end: 13.819, text: "Yes, she is." },
  { start: 13.819, end: 17.129, text: "Yes, she is." },
  { start: 17.129, end: 20.439, text: "Yes, she is." },
  { start: 20.439, end: 23.749, text: "Oh, she's hungry and there's lots of food she can eat." },
  { start: 23.749, end: 30.379, text: "She can eat some fish and some salad." },

  { start: 31.639, end: 35.355, text: "She can eat a burger, too." },
  { start: 35.355, end: 39.071, text: "She can eat meat and some potatoes." },
  { start: 39.071, end: 42.787, text: "She can eat some chicken, too." },
  { start: 42.787, end: 46.503, text: "That's what she can do." },
  { start: 46.503, end: 50.219, text: "That's what we can do." }
];
  return (
    <div
      className="page1-img-wrapper"
      style={{ backgroundImage: `url(${page_1})` }}
    >
  <div
        className="headset-icon-CD-song-page1-1 hover:scale-110 transition"
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

export default Song_Page1;

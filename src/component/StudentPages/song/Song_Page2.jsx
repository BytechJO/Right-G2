import React from "react";
import "./Song_Page1.css";
import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import sound1 from "../../../assets/audio/ClassBook/U 10/CD67.Pg96_Song2_Adult Lady.mp3"
import page_1 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 95.png";
const Song_Page2 = ({openPopup}) => {
  const captions = [
   { start: 0, end: 3.05, text: "Page 10. Listen and read along." },
    { start: 3.07, end: 6.14, text: "B, bird, ball, boy " },
    
  ];
  return (
    <div
      className="page1-img-wrapper"
      style={{ backgroundImage: `url(${page_1})` }}
    >
  <div
        className="headset-icon-CD-song-page2-1 hover:scale-110 transition"
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

export default Song_Page2;

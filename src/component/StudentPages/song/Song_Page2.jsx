import React from "react";
import "./Song_Page1.css";
import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/Page 01/Audio btn.svg";
import sound1 from "../../../assets/audio/ClassBook/U 10/CD67.Pg96_Song2_Adult Lady.mp3"
import page_1 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 95.png";
const Song_Page2 = ({openPopup}) => {
  const captions = [
  { start: 0.680, end: 3.340, text: "What are you doing?" },
  { start: 3.340, end: 6.000, text: "What are you doing?" },
  { start: 6.000, end: 8.660, text: "I'm riding my bike." },
  { start: 8.660, end: 11.320, text: "I'm riding my bike." },
  { start: 11.320, end: 13.980, text: "Do you want to come too?" },
  { start: 13.980, end: 16.640, text: "Do you want to come too?" },
  { start: 16.640, end: 19.300, text: "Do you want to come too?" },
  { start: 19.300, end: 21.960, text: "Do you want to come too?" },
  { start: 21.960, end: 24.620, text: "Why are you going?" },
  { start: 24.620, end: 27.280, text: "Why are you going?" },
  { start: 27.280, end: 29.940, text: "I'm going to see my friend." },
  { start: 29.940, end: 32.600, text: "I'm going to see my friend." },
  { start: 32.600, end: 35.260, text: "Do you want to come too?" },
  { start: 35.260, end: 37.920, text: "Do you want to come too?" },
  { start: 37.920, end: 39.020, text: "Do you want to come too?" },

  { start: 40.079, end: 42.412, text: "How are you feeling?" },
  { start: 42.412, end: 44.745, text: "How are you feeling?" },
  { start: 44.745, end: 47.078, text: "I'm feeling fine." },
  { start: 47.078, end: 49.411, text: "I'm feeling fine." },
  { start: 49.411, end: 51.744, text: "Are you feeling fine too?" },
  { start: 51.744, end: 54.077, text: "Are you feeling fine too?" },
  { start: 54.077, end: 56.410, text: "Are you feeling fine too?" },
  { start: 56.410, end: 58.739, text: "Are you feeling fine too?" }
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

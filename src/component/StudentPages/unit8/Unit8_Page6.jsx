import React from "react";
import page_6 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 69.png";
// import song from "../../../assets/img_unit5/sounds-unit5/Pg15.Sing_Adult Lady.mp3";
import "./Unit8_Page6.css";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";

const Unit8_Page6 = ({ openPopup }) => {


  return (
    <div
      className="page1-img-wrapper"
      style={{ backgroundImage: `url(${page_6})` }}
    >
      {/* <img src={page_6} /> */}

      <div
        className="click-icon-unit8-page6-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() => openPopup("exercise", { startIndex: 81 })}
          style={{ overflow: "visible" }}
        >
          <image
            className="svg-img"
            href={arrowBtn}
            x="0"
            y="0"
            width="90"
            height="90"
          />
        </svg>
      </div>
      <div
        className="click-icon-unit8-page6-2 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() => openPopup("exercise", { startIndex: 82 })}
          style={{ overflow: "visible" }}
        >
          <image
            className="svg-img"
            href={arrowBtn}
            x="0"
            y="0"
            width="90"
            height="90"
          />
        </svg>
      </div>
    </div>
  );
};

export default Unit8_Page6;

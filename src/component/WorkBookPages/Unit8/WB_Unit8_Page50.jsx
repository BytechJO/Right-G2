import React, { useRef } from "react";
import page2 from  "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 50.png";
import "./WB_unit8.css";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";

const WB_Unit8_Page50 = ({ openPopup }) => {
  return (
    <div
      className="page1-img-wrapper"
      style={{ backgroundImage: `url(${page2})` }}
    >

      <div
        className="wb-unit8-p6-q1 hover:scale-110 transition "
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() => openPopup("exercise", { startIndex: 100 })}
          style={{ overflow: "visible" }}
        // className="click-icon-page8-2 hover:scale-110 transition"
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
        className="wb-unit8-p6-q2 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() => openPopup("exercise", { startIndex: 101 })}
          style={{ overflow: "visible" }}
        // className="click-icon-page8-2 hover:scale-110 transition"
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
        className="wb-unit8-p6-q3 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() => openPopup("exercise", { startIndex: 102 })}
          style={{ overflow: "visible" }}
        // className="click-icon-page8-2 hover:scale-110 transition"
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

    </div>
  );
};

export default WB_Unit8_Page50;

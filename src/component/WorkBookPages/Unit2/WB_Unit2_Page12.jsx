import React, { useRef } from "react";
import page2 from "./../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 12.png";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
import "./WB_Unit2_Page9.css";

const WB_Unit2_Page12 = ({ openPopup }) => {
  return (
    <div
      className="page1-img-wrapper"
      style={{ backgroundImage: `url(${page2})` }}
    >
      <div
        className="wb-unit2-p12-q1 hover:scale-110 transition "
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() => openPopup("exercise", { startIndex: 21 })}
          // className="click-icon-page8-1 hover:scale-110 transition"
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
        className="wb-unit2-p12-q2 hover:scale-110 transition "
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() => openPopup("exercise", { startIndex: 22 })}
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

export default WB_Unit2_Page12;

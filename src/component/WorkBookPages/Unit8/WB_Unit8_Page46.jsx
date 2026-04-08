import React from 'react'
import page_1 from  "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46.png";
import "./WB_unit8.css";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";

const WB_Unit8_Page46 = ({ openPopup }) => {
  return (
    <div className="page1-img-wrapper"

      style={{ backgroundImage: `url(${page_1})` }} >

      <div
        className="wb-unit8-p2-q1 hover:scale-110 transition "
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() => openPopup("exercise", { startIndex: 92 })}
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
        className="wb-unit8-p2-q2 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() => openPopup("exercise", { startIndex: 93 })}
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
  )
}

export default WB_Unit8_Page46;

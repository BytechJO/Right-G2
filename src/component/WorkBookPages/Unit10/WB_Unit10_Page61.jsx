import React from 'react'
import page_1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 61.png";
import "./WB_unit10.css"
import arrowBtn from "../../../assets/Page 01/Arrow.svg";

const WB_Unit10_Page61 = ({ openPopup }) => {
  return (
    <div className="page1-img-wrapper"

      style={{ backgroundImage: `url(${page_1})` }} >

      <div
        className="wb-unit10-p5-q1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() => openPopup("exercise", { startIndex: 122 })}
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
        className="wb-unit10-p5-q2 hover:scale-110 transition "
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() => openPopup("exercise", { startIndex: 123 })}
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

export default WB_Unit10_Page61;

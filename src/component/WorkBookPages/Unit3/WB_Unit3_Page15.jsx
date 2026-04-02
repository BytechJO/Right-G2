import React from 'react'
import page_1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 15.png";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
import "./WB_unit3.css"
const WB_Unit3_Page15 = ({ openPopup }) => {
  return (
    <div className="page1-img-wrapper"

      style={{ backgroundImage: `url(${page_1})` }} >

      <div
        className="wb-unit3-p1-q1 hover:scale-110 transition "
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() => openPopup("exercise", { startIndex: 27 })}
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
        className="wb-unit3-p1-q2 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() => openPopup("exercise", { startIndex: 28 })}
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

export default WB_Unit3_Page15;

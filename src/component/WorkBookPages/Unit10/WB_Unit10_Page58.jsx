import React from 'react'
import page_1 from "../../../assets/imgs/pages/workbook-images/50.jpg";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";

const WB_Unit10_Page58 = ({ openPopup }) => {
  return (
    <div className="page1-img-wrapper"

      style={{ backgroundImage: `url(${page_1})` }} >

      <div
        className="wb-unit2-p3-q2 hover:scale-110 transition ml-52 mt-25"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() => openPopup("exercise", { startIndex: 116 })}
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
        className="wb-unit2-p3-q2 hover:scale-110 transition ml-52 mt-90"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() => openPopup("exercise", { startIndex: 117 })}
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

export default WB_Unit10_Page58;

import React, { useRef } from "react";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
import page2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page 24.png";
import "./WB_unit4.css"
const WB_Unit4_Page24 = ({ openPopup }) => {
  return (
    <div
      className="page1-img-wrapper"
      style={{ backgroundImage: `url(${page2})` }}
    >

      <div
              className="wb-unit4-p4-q1 hover:scale-110 transition "
              style={{ overflow: "visible" }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 90 90"
                onClick={() => openPopup("exercise", { startIndex: 46 })}
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
                    className="wb-unit4-p4-q2 hover:scale-110 transition"
                    style={{ overflow: "visible" }}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 90 90"
                      onClick={() => openPopup("exercise", { startIndex: 47 })}
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

export default WB_Unit4_Page24;

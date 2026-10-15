import React, { useRef } from "react";
import page_4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4.png";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
import "./WB_Unit1_Page4.css"
const WB_Unit1_Page4 = ({ openPopup }) => {
  const audioRef = useRef(null);

  return (
    <div className="page1-img-wrapper"
            
              style={{ backgroundImage: `url(${page_4})` }}>
      {/* <img src={page_4} /> */}
     
      <div
        className="wb-unit1-p4-q1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
            tabIndex={0}
          role="button"
          aria-label="Open exercise 3"
          onClick={() => openPopup("exercise", { startIndex: 2 })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPopup("exercise", { startIndex: 2 });
            }
          }}
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
        className="wb-unit1-p4-q2 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
            tabIndex={0}
          role="button"
          aria-label="Open exercise 4"
          onClick={() => openPopup("exercise", { startIndex: 3 })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPopup("exercise", { startIndex: 3 });
            }
          }}
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
        className="wb-unit1-p4-q3 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
           tabIndex={0}
          role="button"
          aria-label="Open exercise 5"
          onClick={() => openPopup("exercise", { startIndex: 4 })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPopup("exercise", { startIndex: 4 });
            }
          }}
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

      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
};

export default WB_Unit1_Page4;

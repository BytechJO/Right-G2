
import page_5 from "../../../assets/imgs/pages/Right 2 Unit 1 Stellas Family_00001/Right 2 Unit 1 Stellas Family_00044.jpg";
import "./unit5_Page5.css";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
const Unit5_Page5 = ({ openPopup }) => {
  return (
    <div
      className="page1-img-wrapper"
   
      style={{ backgroundImage: `url(${page_5})` }}
    >
      {/* <img src={page_5} /> */}

      <div
        className="click-icon-unit5-page5-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() => openPopup("exercise", { startIndex: 47 })}
          style={{ overflow: "visible" }}
        >
          <image className="svg-img" href={arrowBtn} x="0" y="0" width="90" height="90" />
        </svg>
      </div>

      <div
        className="click-icon-unit5-page5-2 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() => openPopup("exercise", { startIndex: 48 })}
          style={{ overflow: "visible" }}
        >
          <image className="svg-img" href={arrowBtn} x="0" y="0" width="90" height="90" />
        </svg>
      </div>

      <div
        className="click-icon-unit5-page5-3 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() => openPopup("exercise", { startIndex: 49 })}
          style={{ overflow: "visible" }}
        >
          <image className="svg-img" href={arrowBtn} x="0" y="0" width="90" height="90" />
        </svg>
      </div>

        <div
        className="click-icon-unit5-page5-4 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() => openPopup("exercise", { startIndex: 50 })}
          style={{ overflow: "visible" }}
        >
          <image className="svg-img" href={arrowBtn} x="0" y="0" width="90" height="90" />
        </svg>
      </div>

    </div>
  );
};

export default Unit5_Page5;

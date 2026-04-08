import React, { useEffect, useState } from "react";
import Button from "../Button";

import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/Ex D 1-1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/Ex B 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/Ex B 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/Ex B 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/Ex B 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/Ex B 6.svg";

import img7 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/Ex B 7.svg";
import img8 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/Ex B 8.svg";
import img9 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/Ex B 9.svg";
import img10 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/Ex B 10.svg";
import img11 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/Ex B 11.svg";
import img12 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/Ex B 12.svg";

const topItems = [
  { id: "dress", x: 90, y: 90, img: img1 },
  { id: "bag", x: 220, y: 90, img: img2 },
  { id: "kite", x: 350, y: 90, img: img3 },
  { id: "skirt", x: 500, y: 90, img: img4 },
  { id: "jacket", x: 640, y: 90, img: img5 },
  { id: "shirt", x: 780, y: 90, img: img6 },
];

const bottomItems = [
  { id: "boy1", x: 180, y: 320, img: img7 },
  { id: "girl1", x: 290, y: 320, img: img8 },
  { id: "boy2", x: 400, y: 320, img: img9 },
  { id: "girl2", x: 510, y: 320, img: img10 },
  { id: "boy3", x: 620, y: 320, img: img11 },
  { id: "boy4", x: 730, y: 320, img: img12 },
];

const correctMatches = {
  dress: "girl1",
  bag: "girl2",
  kite: "boy1",
  skirt: "boy4",
  jacket: "boy2",
  shirt: "boy3",
};

const lineStyleMap = {
  dress: "solid",
  bag: "dashed",
  kite: "wave",
  skirt: "dotted",
  jacket: "dashed",
  shirt: "solid",
};

const LookAndMatch = () => {
  const [connections] = useState(correctMatches);

  // 🎨 states
  const [activeItem, setActiveItem] = useState(null);
  const [colors, setColors] = useState({});
  const [svgContent, setSvgContent] = useState({});

  const palette = ["#ef4444", "#3b82f6", "#22c55e", "#eab308", "#a855f7"];

  // ✅ تحميل svg كنص
  useEffect(() => {
    topItems.forEach((item) => {
      fetch(item.img)
        .then((res) => res.text())
        .then((data) => {
          setSvgContent((prev) => ({ ...prev, [item.id]: data }));
        });
    });
  }, []);

  // ----------------------

  const renderTopPlaceholder = (id) => (
    <div
      onClick={() => setActiveItem(id)}
      className="w-[100px] h-[100px] flex items-center justify-center rounded-2xl bg-white text-sm font-semibold text-gray-700 relative"
    >
      {svgContent[id] ? (
        <div
          style={{ width: "90px", height: "90px" }}
          dangerouslySetInnerHTML={{
            __html: svgContent[id].replace(
              /fill=".*?"/g,
              `fill="${colors[id] || "#000"}"`
            ),
          }}
        />
      ) : (
        <div style={{ width: "90px", height: "90px" }} />
      )}

      {/* 🎨 palette */}
      {activeItem === id && (
        <div className="absolute top-[110px] flex gap-1 bg-white p-1 rounded shadow">
          {palette.map((color) => (
            <div
              key={color}
              onClick={(e) => {
                e.stopPropagation();
                setColors((prev) => ({ ...prev, [id]: color }));
                setActiveItem(null);
              }}
              style={{
                backgroundColor: color,
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderBottomPlaceholder = (label) => (
    <div
      className="flex items-center justify-center rounded-full border-2 border-gray-500 bg-white text-xs font-semibold text-gray-700 text-center px-2"
      style={{ height: "90px", width: "90px" }}
    >
      <img
        src={label}
        className="rounded-full"
        style={{ height: "90px", width: "90px" }}
      />
    </div>
  );

  // ----------------------

  const generateWavyPath = (x1, y1, x2, y2, amplitude = 20, frequency = 6) => {
    const points = [];
    const steps = 20;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = x1 + (x2 - x1) * t;
      const baseY = y1 + (y2 - y1) * t;
      const offset = Math.sin(t * Math.PI * frequency) * amplitude;
      const y = baseY + offset;
      points.push([x, y]);
    }

    let path = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i][0]} ${points[i][1]}`;
    }

    return path;
  };

  const renderLines = () => {
    return topItems.map((topItem) => {
      const matchedBottomId = connections[topItem.id];
      if (!matchedBottomId) return null;

      const bottomItem = bottomItems.find((b) => b.id === matchedBottomId);
      if (!bottomItem) return null;

      const startX = topItem.x;
      const startY = topItem.y + 45;
      const endX = bottomItem.x;
      const endY = bottomItem.y - 38;

      const styleType = lineStyleMap[topItem.id];

      const path =
        styleType === "wave"
          ? generateWavyPath(startX, startY, endX, endY, 25, 8)
          : generateWavyPath(startX, startY, endX, endY, 10, 3);

      const dashStyles = {
        dashed: "10 6",
        dotted: "2 6",
      };

      return (
        <g key={topItem.id}>
          <circle cx={startX} cy={startY} r="5" fill="#DC2626" />
          <circle cx={endX} cy={endY} r="5" fill="#DC2626" />

          <path
            d={path}
            fill="none"
            stroke="#DC2626"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={dashStyles[styleType] || "0"}
          />
        </g>
      );
    });
  };

  // ----------------------

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "20px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">B</span>Look and color.
        </h1>

        <div className="flex justify-center items-center">
          <div className="flex justify-center items-center relative w-full h-[430px]">

            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 900 430"
              style={{ width: "111%" }}
            >
              {renderLines()}
            </svg>

            {topItems.map((item) => (
              <div
                key={item.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                style={{ left: item.x, top: item.y }}
              >
                {renderTopPlaceholder(item.id)}
                <div className="mt-2 w-3 h-3"></div>
              </div>
            ))}

            {bottomItems.map((item) => (
              <div
                key={item.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                style={{ left: item.x, top: item.y }}
              >
                <div className="mb-2 w-3 h-3"></div>
                {renderBottomPlaceholder(item.img)}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Button />
        </div>
      </div>
    </div>
  );
};

export default LookAndMatch;
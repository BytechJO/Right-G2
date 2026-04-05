import React, { useMemo, useState } from "react";
import Button from "../Button";
const topItems = [
  { id: "dress", label: "Dress", x: 90, y: 90 },
  { id: "bag", label: "Bag", x: 220, y: 90 },
  { id: "kite", label: "Kite", x: 350, y: 90 },
  { id: "skirt", label: "Skirt", x: 500, y: 90 },
  { id: "jacket", label: "Jacket", x: 640, y: 90 },
  { id: "shirt", label: "Shirt", x: 780, y: 90 },
];

const bottomItems = [
  { id: "boy1", label: "Boy 1", x: 180, y: 320 },
  { id: "girl1", label: "Girl 1", x: 290, y: 320 },
  { id: "boy2", label: "Boy 2", x: 400, y: 320 },
  { id: "girl2", label: "Girl 2", x: 510, y: 320 },
  { id: "boy3", label: "Boy 3", x: 620, y: 320 },
  { id: "boy4", label: "Boy 4", x: 730, y: 320 },
];

// التوصيل الصحيح
const correctMatches = {
  dress: "girl1",
  bag: "girl2",
  kite: "boy1",
  skirt: "boy4",
  jacket: "boy2",
  shirt: "boy3",
};

// 🎯 أنواع الخطوط
const lineStyleMap = {
  dress: "solid",
  bag: "dashed",
  kite: "wave",
  skirt: "dotted",
  jacket: "dashed",
  shirt: "solid",
};

const getStrokeStyle = (style) => {
  switch (style) {
    case "dashed":
      return { strokeDasharray: "8 6" };
    case "dotted":
      return { strokeDasharray: "2 6" };
    default:
      return {};
  }
};

const LookAndMatch = () => {
  // ✅ جاهز من البداية
  const [connections] = useState(correctMatches);

  const renderTopPlaceholder = (label) => (
    <div className="w-[90px] h-[90px] flex items-center justify-center border-2 border-gray-600 rounded-2xl bg-white text-sm font-semibold text-gray-700">
      {label}{" "}
    </div>
  );

  const renderBottomPlaceholder = (label) => (
    <div className="w-[72px] h-[72px] flex items-center justify-center rounded-full border-2 border-gray-500 bg-white text-xs font-semibold text-gray-700 text-center px-2">
      {label}{" "}
    </div>
  );

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

      let path;

      if (styleType === "wave") {
        path = generateWavyPath(startX, startY, endX, endY, 25, 8);
      } else {
        path = generateWavyPath(startX, startY, endX, endY, 10, 3);
      }

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

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "20px" }}>
        {" "}
        <h1 className="WB-header-title-page8">
          {" "}
          <span className="WB-ex-A">B</span>Look and color.{" "}
        </h1>
        <div className="flex justify-center">
          <div className="relative w-[900px] h-[430px] bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
            {/* خطوط التوصيل */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 900 430"
            >
              {renderLines()}
            </svg>

            {/* العناصر العلوية */}
            {topItems.map((item) => (
              <div
                key={item.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                style={{ left: item.x, top: item.y }}
              >
                {renderTopPlaceholder(item.label)}
                <div className="mt-2 w-3 h-3 rounded-full bg-red-500"></div>
              </div>
            ))}

            {/* العناصر السفلية */}
            {bottomItems.map((item) => (
              <div
                key={item.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                style={{ left: item.x, top: item.y }}
              >
                <div className="mb-2 w-3 h-3 rounded-full bg-red-500"></div>
                {renderBottomPlaceholder(item.label)}
              </div>
            ))}
          </div>
        </div>
         <div className="mt-10 flex justify-center">
            <Button
            
            />
          </div>
      </div>
    </div>
  );
};

export default LookAndMatch;

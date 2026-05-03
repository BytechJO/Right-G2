import React, { useEffect, useState } from "react";
import Button from "../Button";
import { FaDownload } from "react-icons/fa";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/43.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/44.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/48.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/45_1.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/46.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/47.svg";

import img7 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/Ex B 7.svg";
import img8 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/Ex B 8.svg";
import img9 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/Ex B 9.svg";
import img10 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/Ex B 10.svg";
import img11 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/Ex B 11.svg";
import img12 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/Ex B 12.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
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

// ==================== دالة معالجة SVG ====================
/**
 * تحليل SVG وتعديل الـ CSS classes
 * الـ fill يصير currentColor (يتغير مع اللون)
 * الـ stroke يبقى كما هو (أسود)
 */
const processSvgForColoring = (svgContent) => {
  if (!svgContent) return svgContent;

  let modified = svgContent;

  // تعديل الـ <style> tag
  modified = modified.replace(/<style>[\s\S]*?<\/style>/g, (styleTag) => {
    // تعديل جميع الـ CSS rules
    // مثال: .cls-1 { fill: red; } → .cls-1 { fill: currentColor; }
    let newStyleTag = styleTag.replace(
      /fill:\s*[^;]*;?/g,
      "fill: currentColor;",
    );
    // التأكد من أن الـ stroke يبقى كما هو أو يتم تعيينه للون ثابت إذا لم يكن موجودًا
    // هنا، نفترض أن الـ stroke يجب أن يبقى كما هو إذا كان موجودًا، وإلا فلا نغيره.
    // إذا كان هناك .cls-2 { stroke: #231f20; } في الـ SVG الأصلي، فسيظل كما هو.
    return newStyleTag;
  });

  // تعديل fill في inline attributes فقط (بدون stroke)
  modified = modified.replace(/<[^>]*fill="[^"]*"[^>]*>/g, (tag) => {
    // التأكد من عدم تغيير الـ stroke إذا كان موجودًا كـ inline attribute
    if (tag.includes('stroke="')) {
      return tag.replace(/fill="[^"]*"/g, 'fill="currentColor"');
    } else {
      return tag.replace(/fill="[^"]*"/g, 'fill="currentColor"');
    }
  });

  return modified;
};

const LookAndMatch = () => {
  const [connections] = useState(correctMatches);

  // 🎨 states
  const [activeItem, setActiveItem] = useState(null);
  const [colors, setColors] = useState({});
  const [svgContent, setSvgContent] = useState({});
  const [processedSvgContent, setProcessedSvgContent] = useState({});

  const palette = [
    "#808080",
    "#00AA00",
    "#000000",
    "#FFFF00",
    "#8B4513",
    "#FF0000",
    "#FFA500",
    "#0000FF",
    "#FFC0CB",
    "#800080",
  ];

  // ✅ تحميل svg مع معالجة الألوان
  useEffect(() => {
    topItems.forEach((item) => {
      fetch(item.img)
        .then((res) => res.text())
        .then((data) => {
          // حفظ SVG الأصلي
          setSvgContent((prev) => ({ ...prev, [item.id]: data }));

          // معالجة SVG للتلوين
          const processed = processSvgForColoring(data);
          setProcessedSvgContent((prev) => ({ ...prev, [item.id]: processed }));
        })
        .catch((err) => {
          console.error(`Error loading SVG: ${item.img}`, err);
        });
    });
  }, []);

  // ----------------------

  const renderTopPlaceholder = (id) => {
    // اختيار محتوى SVG المناسب
    const displayContent = colors[id]
      ? processedSvgContent[id]
      : processedSvgContent[id]; // Always use processed content

    return (
      <div
        onClick={() => setActiveItem(id)}
        style={{
          width: "100px",
          height: "100px",
          cursor: "pointer",
          position: "relative",
          border: activeItem === id ? "2px solid #333" : "none",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "visible",
        }}
      >
        {displayContent ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              color: colors[id] || "transparent", // هذا اللون سيتم تطبيقه على currentColor داخل الـ SVG
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            dangerouslySetInnerHTML={{
              __html: displayContent,
            }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%" }} />
        )}

        {/* 🎨 palette */}
        {activeItem === id && (
          <div
            style={{
              position: "absolute",
              top: "110%",
              display: "flex",
              gap: "5px",
              background: "#fff",
              padding: "5px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              zIndex: 10,
            }}
          >
            {palette.map((color) => (
              <div
                key={color}
                onClick={(e) => {
                  e.stopPropagation();
                  setColors((prev) => ({ ...prev, [id]: color }));
                  setActiveItem(null);
                }}
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: color,
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };
  const areAllColored = () => {
    return topItems.every(
      (item) => colors[item.id] && colors[item.id] !== "transparent",
    );
  };

  const checkAnswers = () => {
    // 🔴 فاليديشن
    if (!areAllColored()) {
      ValidationAlert.info("Please color all the pictures first!");
      return;
    }

    ValidationAlert.success("Well done!");
  };
  const renderBottomPlaceholder = (label) => (
    <div
      className="flex items-center justify-center rounded-full border-2 border-gray-500 bg-white"
      style={{ height: "90px", width: "90px" }}
    >
      <img
        src={label}
        style={{ height: "85px", width: "85px", borderRadius: "50%" }}
      />
    </div>
  );

  // ----------------------
  const handledownload = async () => {
    const element = captureRef.current;

    const dataUrl = await toPng(element);

    const link = document.createElement("a");
    link.download = "activity.png";
    link.href = dataUrl;
    link.click();
  };
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

      // تصحيح نقاط البداية والنهاية
      const startX = topItem.x;
      const startY = topItem.y + 50;
      const endX = bottomItem.x;
      const endY = bottomItem.y - 45;

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

  // ==================== دالة Start Again ====================
  const handleStartAgain = () => {
    setColors({});
    setActiveItem(null);
  };

  // ----------------------

  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"20px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">B</span>Look and color.
        </h1>

        <div className="flex justify-center items-center">
          <div
            className="flex justify-center items-center relative w-full"
            style={{ height: "515px", minHeight: "430px" }}
          >
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 900 430"
              style={{ width: "100%", height: "100%" }}
              preserveAspectRatio="xMidYMid meet"
            >
              {renderLines()}
            </svg>

            {/* 🔼 TOP (colorable) */}
            {topItems.map((item) => (
              <div
                key={item.id}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${(item.x / 900) * 100}%`,
                  top: `${(item.y / 430) * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {renderTopPlaceholder(item.id)}
              </div>
            ))}

            {/* 🔽 BOTTOM */}
            {bottomItems.map((item) => (
              <div
                key={item.id}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${(item.x / 900) * 100}%`,
                  top: `${(item.y / 430) * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {renderBottomPlaceholder(item.img)}
              </div>
            ))}
          </div>
        </div>

        {/* ==================== الأزرار ====================*/}

        <div className="action-buttons-container">
          <button onClick={handleStartAgain} className="try-again-button">
            Start Again ↻
          </button>
          <button
            onClick={handledownload}
            className="flex items-center justify-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 shadow-md px-10"
          >
            <FaDownload />
          </button>
          <button onClick={checkAnswers} className="check-button2">
            Finish ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default LookAndMatch;

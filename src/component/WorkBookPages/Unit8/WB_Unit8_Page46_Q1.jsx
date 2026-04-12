import React, { useState, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";

// ==================== صور الشخصيات الأساسية ====================
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/Ex D 1_1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/Jwana.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/Asset 95.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/Ex D 4.svg";

// ==================== صور الطبقات للشخصية الأولى (Peter) ====================
import imgLayer1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/Asset 84.svg";
import imgLayer2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/Ex D 1-3.svg";
import imgLayer3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/Ex D 1-1.svg";

// ==================== صور الطبقات للشخصية الثانية (Joanna) ====================
import img2Layer1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/Dress new_1.svg";
import img2Layer2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/Shoes.svg";
import img2Layer3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/Shoes 3.svg";
import img2Layer4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/socks.svg";
import img2Layer5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/Socks 2.svg";

// ==================== صور الطبقات للشخصية الثالثة (Mark) ====================
import img3Layer1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/mark-top.svg";
import img3Layer2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/mark-short.svg";
import img3Layer3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/hat.svg";

// ==================== صور الطبقات للشخصية الرابعة (Susan) ====================
import img4Layer1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/susan-top.svg";
import img4Layer2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/Asset 110.svg";
import img4Layer3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/glass.svg";

// ==================== قائمة الألوان ====================
const colorsList = [
  { name: "Gray", value: "#808080" },
  { name: "Green", value: "#00AA00" },
  { name: "Black", value: "#000000" },
  { name: "Yellow", value: "#FFFF00" },
  { name: "White", value: "#FFFFFF" },
  { name: "Brown", value: "#8B4513" },
  { name: "Red", value: "#FF0000" },
  { name: "Orange", value: "#FFA500" },
  { name: "Blue", value: "#0000FF" },
  { name: "Pink", value: "#FFC0CB" },
  { name: "Purple", value: "#800080" },
];

// ==================== الإجابات الصحيحة ====================
const correctAnswers = {
  peter: { pants: "#808080", jacket: "#00AA00", shoes: "#000000" },
  joanna: { dress: "#FFFF00", socks: "#FFFFFF", shoes: "#8B4513" },
  mark: { shorts: "#FF0000", shirt: "#FFFFFF", hat: "#FFA500" },
  susan: { skirt: "#0000FF", shirt: "#FFC0CB", glasses: "#800080" },
};

// ==================== بيانات الشخصيات والطبقات ====================
const charactersData = {
  peter: {
    name: "Peter",
    baseImage: img1,
    layers: [
      {
        id: "pants",
        image: imgLayer1,
        label: "Pants",
        top: 140,
        left: 33,
        height: 47,
        width: 54,
      },
      {
        id: "jacket",
        image: imgLayer3,
        label: "Jacket",
        top: 41,
        left: 14,
        height: 51,
        width: 81,
      },
      {
        id: "shoes",
        image: imgLayer2,
        label: "Shoes",
        top: 213,
        left: 31,
        height: 49,
        width: 55,
      },
    ],
  },
  joanna: {
    name: "Joanna",
    baseImage: img2,
    layers: [
      {
        id: "dress",
        image: img2Layer1,
        label: "Dress",
        top: 62,
        left: 14,
        height: 61,
        width: 72,
      },
      {
        id: "Shoes1",
        image: img2Layer2,
        label: "Shoes1",
        top: 209,
        left: 65,
        height: 51,
        width: 26,
      },
      {
        id: "Shoes2",
        image: img2Layer3,
        label: "Shoes2",
        top: 208,
        left: 26,
        height: 51,
        width: 21,
      },
      {
        id: "sock1",
        image: img2Layer4,
        label: "sock1",
        top: 213,
        left: 31,
        height: 35,
        width: 17,
      },
      {
        id: "sock2",
        image: img2Layer5,
        label: "sock2",
        top: 218,
        left: 64,
        height: 35,
        width: 17,
      },
    ],
  },
  mark: {
    name: "Mark",
    baseImage: img3,
    layers: [
      {
        id: "shorts",
        image: img3Layer2,
        label: "Shorts",
        top: 110,
        left: 29,
        height: 49,
        width: 55,
      },
      {
        id: "hat",
        image: img3Layer1,
        label: "hat",
        top: 40,
        left: 14,
        height: 47,
        width: 75,
      },
      {
        id: "shirt",
        image: img3Layer3,
        label: "shirt",
        top: -45,
        left: 23,
        height: 49,
        width: 47,
      },
    ],
  },
  susan: {
    name: "Susan",
    baseImage: img4,
    layers: [
      {
        id: "skirt",
        image: img4Layer1,
        label: "Skirt",
        top: 35,
        left: 25,
        height: 49,
        width: 72,
      },
      {
        id: "shirt",
        image: img4Layer2,
        label: "Shirt",
        top: 108,
        left: 22,
        height: 49,
        width: 69,
      },
       {
        id: "glass",
        image: img4Layer3,
        label: "glass",
        top: -18,
        left: 55,
        height: 42,
        width: 34,
      },
    ],
  },
};

// ==================== دالة ذكية لتعديل SVG ====================
/**
 * تحليل SVG وتعديل فقط الـ fill الأساسي
 * الـ stroke يبقى أسود دائماً
 */
const processSvgForColoring = (svgContent) => {
  if (!svgContent) return svgContent;

  // استخراج جميع الـ classes المستخدمة في SVG
  const classMatches = svgContent.match(/class="([^"]*)"/g) || [];
  const usedClasses = new Set();

  classMatches.forEach((match) => {
    const className = match.replace(/class="|"/g, "");
    className.split(" ").forEach((cls) => {
      if (cls && !cls.includes("svg-")) {
        usedClasses.add(cls);
      }
    });
  });

  // إذا لم توجد classes، نعدّل الـ fill فقط والـ stroke يبقى أسود
  if (usedClasses.size === 0) {
    // تعديل الـ fill فقط في الـ SVG
    let modified = svgContent;

    // تعديل fill في الـ <style> tag (الـ stroke يبقى أسود)
    modified = modified.replace(/<style>[\s\S]*?<\/style>/g, (styleTag) => {
      // استخراج جميع الـ CSS rules
      const cssRules = styleTag.match(/\.[a-zA-Z0-9_-]+\s*\{[^}]*\}/g) || [];

      if (cssRules.length > 0) {
        // تعديل أول rule فقط
        return styleTag.replace(cssRules[0], (rule) => {
          // تعديل fill فقط ← المفتاح!
          return (
            rule
              .replace(/fill:\s*[^;]*;?/g, "fill: currentColor;")
              // الـ stroke يبقى أسود
              .replace(/stroke:\s*[^;]*;?/g, "stroke: #000000;")
          );
        });
      }

      return styleTag;
    });

    // تعديل fill في inline attributes
    modified = modified.replace(/<[^>]*fill="[^"]*"[^>]*>/g, (tag) => {
      return tag.replace(/fill="[^"]*"/g, 'fill="currentColor"');
    });

    // تعديل stroke ليكون أسود في inline attributes
    modified = modified.replace(/<[^>]*stroke="[^"]*"[^>]*>/g, (tag) => {
      return tag.replace(/stroke="[^"]*"/g, 'stroke="#000000"');
    });

    return modified;
  }

  return svgContent;
};

// ==================== مكوّن الطبقة الواحدة ====================
/**
 * مكوّن يعرض طبقة SVG قابلة للتلوين
 * يحمّل SVG ويعدّل فقط الـ fill و stroke الأساسية
 */
const ColorableLayer = ({
  layer,
  person,
  color,
  svgContent,
  processedSvgContent,
  onDoubleClick,
  isSelected,
}) => {
  // اختيار محتوى SVG المناسب
  const displayContent = color ? processedSvgContent : svgContent;

  return (
    <div
      className={`absolute cursor-pointer transition-all duration-200 ${
        isSelected ? "ring-2 ring-blue-500 ring-offset-2" : "hover:opacity-80"
      }`}
      style={{
        top: `${layer.top}px`,
        left: `${layer.left}px`,
        width: `${layer.width}%`,
        height: `${layer.height}%`,
        color: color || "transparent",
      }}
      onDoubleClick={() => onDoubleClick(person, layer.id)}
      onTouchStart={() => onDoubleClick(person, layer.id)}
      title={`اضغط مرتين لتلوين ${layer.label}`}
    >
      {displayContent ? (
        <div
          className="svg-wrapper w-full h-full"
          dangerouslySetInnerHTML={{ __html: displayContent }}
        />
      ) : (
        <div className="text-center text-gray-400">Loading...</div>
      )}
    </div>
  );
};

// ==================== مكوّن الشخصية ====================
const Character = ({
  personKey,
  personData,
  colors,
  activePart,
  svgContents,
  processedSvgContents,
  onLayerDoubleClick,
}) => {
  const personColors = colors[personKey] || {};

  return (
    <div className="flex flex-col items-center">
      {/* الصورة مع الطبقات */}
      <div
        className="relative inline-block bg-white rounded-lg overflow-hidden shadow-sm mb-3"
        style={{ height: "100%", width: "100%" }}
      >
        {/* الصورة الأساسية */}
        <img
          src={personData.baseImage}
          alt={personData.name}
          className="w-full h-full object-contain"
          style={{ height: "300px", width: "120px" }}
        />

        {/* الطبقات القابلة للتلوين */}
        {personData.layers.map((layer) => (
          <ColorableLayer
            key={`${personKey}-${layer.id}`}
            layer={layer}
            person={personKey}
            color={personColors[layer.id]}
            svgContent={svgContents[`${personKey}-${layer.id}`]}
            processedSvgContent={
              processedSvgContents[`${personKey}-${layer.id}`]
            }
            onDoubleClick={onLayerDoubleClick}
            isSelected={
              activePart?.person === personKey && activePart?.part === layer.id
            }
          />
        ))}
      </div>

      {/* اسم الشخصية */}
      <p className="text-sm font-semibold text-gray-800">{personData.name}</p>
    </div>
  );
};

// ==================== المكوّن الرئيسي ====================
const ReadAndColor = () => {
  // ==================== State Management ====================
  const [selectedColor, setSelectedColor] = useState(null);
  const [colors, setColors] = useState({});
  const [showPalette, setShowPalette] = useState(false);
  const [activePart, setActivePart] = useState(null);
  const [svgContents, setSvgContents] = useState({});
  const [processedSvgContents, setProcessedSvgContents] = useState({});

  // ==================== تحميل SVG كنص ====================
  useEffect(() => {
    const loadSvgs = async () => {
      const svgMap = {};
      const processedMap = {};

      // تجميع جميع الطبقات من جميع الشخصيات
      const layersToLoad = [];
      Object.entries(charactersData).forEach(([personKey, personData]) => {
        personData.layers.forEach((layer) => {
          layersToLoad.push({
            key: `${personKey}-${layer.id}`,
            url: layer.image,
          });
        });
      });

      // تحميل جميع الـ SVG بالتوازي
      await Promise.all(
        layersToLoad.map((item) =>
          fetch(item.url)
            .then((r) => r.text())
            .then((text) => {
              // حفظ SVG الأصلي
              svgMap[item.key] = text;

              // معالجة SVG للتلوين
              const processed = processSvgForColoring(text);
              processedMap[item.key] = processed;
            })
            .catch((err) => {
              console.error(`Error loading SVG: ${item.url}`, err);
              svgMap[item.key] = null;
              processedMap[item.key] = null;
            }),
        ),
      );

      setSvgContents(svgMap);
      setProcessedSvgContents(processedMap);
    };

    loadSvgs();
  }, []);

  // ==================== معالجات الأحداث ====================

  const handleLayerDoubleClick = (person, part) => {
    setActivePart({ person, part });
    setShowPalette(true);
  };

  const handleColorSelect = (colorValue) => {
    if (!activePart) return;

    const { person, part } = activePart;

    setColors((prev) => ({
      ...prev,
      [person]: {
        ...(prev[person] || {}),
        [part]: colorValue,
      },
    }));

    setSelectedColor(colorValue);
    setShowPalette(false);
    setActivePart(null);
  };

  const checkAnswers = () => {
    let score = 0;
    let total = 0;

    Object.keys(correctAnswers).forEach((person) => {
      Object.keys(correctAnswers[person]).forEach((part) => {
        total++;
        if (colors[person]?.[part] === correctAnswers[person][part]) {
          score++;
        }
      });
    });

    const msg = `Score: ${score} / ${total}`;
    if (score === total) {
      ValidationAlert.success(msg);
    } else {
      ValidationAlert.warning(msg);
    }
  };

  const handleStartAgain = () => {
    setColors({});
    setActivePart(null);
    setSelectedColor(null);
    setShowPalette(false);
  };

  // ==================== JSX ====================
  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "10px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">D</span>
          Read and color.
        </h1>

        {/* تلميح للمستخدم */}
        <p className="text-sm text-gray-500 mb-6">
          💡 Double-click on any part to color it
        </p>

        {/* الشخصيات - تخطيط أفقي */}
        <div className="flex justify-around items-start gap-4 mb-8">
          {Object.entries(charactersData).map(([key, data]) => (
            <Character
              key={key}
              personKey={key}
              personData={data}
              colors={colors}
              activePart={activePart}
              svgContents={svgContents}
              processedSvgContents={processedSvgContents}
              onLayerDoubleClick={handleLayerDoubleClick}
            />
          ))}
        </div>

        {/* النص الوصفي - تحت الصور */}
        <div className="text-start text-sm leading-relaxed text-gray-700 mb-8 bg-gray-50 p-4 rounded-lg">
          <p>
            Peter has gray pants and a green jacket. His shoes are black. Joanna
            has a yellow dress, white socks, and brown shoes. Mark has red
            shorts and a white shirt. His hat is orange. Susan has a blue skirt
            and a pink shirt. Her glasses are purple.
          </p>
        </div>

        {/* لوحة الألوان - Modal تظهر فقط عند الحاجة */}
        {showPalette && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full">
              <p className="text-center font-semibold mb-4 text-gray-800">
                Choose a color:
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {colorsList.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => handleColorSelect(c.value)}
                    className={`w-12 h-12 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                      selectedColor === c.value
                        ? "border-black ring-2 ring-black ring-offset-2"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                    aria-label={`Choose ${c.name} color`}
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  setShowPalette(false);
                  setActivePart(null);
                }}
                className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* الأزرار - في الأسفل */}
        <div className="flex justify-center gap-4 mt-8">
          <Button
            handleStartAgain={handleStartAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>

      {/* CSS للـ SVG wrapper */}
      <style>{`
        .svg-wrapper {
          display: inline-block;
          width: 100%;
          height: 100%;
        }

        .svg-wrapper svg {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      `}</style>
    </div>
  );
};

export default ReadAndColor;

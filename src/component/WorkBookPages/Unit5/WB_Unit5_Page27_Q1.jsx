import React, { useState, useRef } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page27/Ex A 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page27/Ex A 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page27/Ex A 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page27/Ex A 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page27/Ex A 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page27/Ex A 6.svg";
import img7 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page27/Ex A 7.svg";
import img8 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page27/Ex A 8.svg";
import img9 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page27/Ex A 9.svg";
import img10 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page27/Ex A 10.svg";
import img11 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page27/Ex A 11.svg";
import img12 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page27/Ex A 12.svg";

const leftParts = [
  { id: 1, text: "burgers" },
  { id: 2, text: "cake" },
  { id: 3, text: "bread" },
  { id: 4, text: "meat" },
  { id: 5, text: "fish" },
  { id: 6, text: "fruit" },
];

const images = [
  { id: "img1", src: img1 },
  { id: "img2", src: img2 },
  { id: "img3", src: img3 },
  { id: "img4", src: img4 },
  { id: "img5", src: img5 },
  { id: "img6", src: img6 },
];

const rightParts = [
  { id: "r1", src: img7 },
  { id: "r2", src: img8 },
  { id: "r3", src: img9 },
  { id: "r4", src: img10 },
  { id: "r5", src: img11 },
  { id: "r6", src: img12 },
];

const correctMatches = [
  { leftId: 2, centerId: "img1", rightId: "r2" },
  { leftId: 1, centerId: "img2", rightId: "r1" },
  { leftId: 6, centerId: "img3", rightId: "r4" },
  { leftId: 3, centerId: "img4", rightId: "r3" },
  { leftId: 4, centerId: "img5", rightId: "r6" },
  { leftId: 5, centerId: "img6", rightId: "r5" },
];

const WB_Unit5_Page27_Q1 = () => {
  const containerRef = useRef(null);

  const [lines, setLines] = useState([]);
  const [firstPoint, setFirstPoint] = useState(null);
  const [wrongLeft, setWrongLeft] = useState([]);
  const [locked, setLocked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [wrongLineIndexes, setWrongLineIndexes] = useState([]);
  const getDotCenter = (parent, selector = ".dot") => {
    const rect = containerRef.current.getBoundingClientRect();
    const dot = parent.querySelector(selector);
    if (!dot) return null;

    const r = dot.getBoundingClientRect();
    return {
      x: r.left - rect.left + r.width / 2,
      y: r.top - rect.top + r.height / 2,
    };
  };

  const getPointData = (element, preferredCenterDot = null) => {
    const data = element.dataset;

    let type = "";
    let id = "";
    let selector = ".dot";

    if (data.image) {
      type = data.image.startsWith("img") ? "leftImg" : "rightImg";
      id = data.image;
      selector = ".dot";
    } else if (data.leftId) {
      type = "centerText";
      id = Number(data.leftId);
      selector = preferredCenterDot || ".dot-top";
    }

    const pos = getDotCenter(element, selector);
    if (!pos) return null;

    return { id, type, x: pos.x, y: pos.y };
  };
  const handleStart = (e) => {
    if (locked) return;

    const point = getPointData(e.currentTarget, ".dot-top");
    if (!point) return;

    setFirstPoint(point);
  };

  const handleEnd = (e) => {
    if (!firstPoint || locked) return;

    let targetPoint = null;

    if (e.currentTarget.dataset.leftId) {
      targetPoint = getPointData(e.currentTarget, ".dot-top");
    } else {
      targetPoint = getPointData(e.currentTarget);
    }

    if (!targetPoint) return;

    const { type } = targetPoint;

    // 1) إذا البداية من صورة فوق، لازم النهاية تكون كلمة
    if (firstPoint.type === "leftImg" && type !== "centerText") {
      return;
    }

    // 2) إذا النهاية صورة تحت، لازم البداية تكون كلمة
    if (type === "rightImg" && firstPoint.type !== "centerText") {
      return;
    }

    // منع التوصيل بنفس النوع
    if (firstPoint.type === type) {
      setFirstPoint(targetPoint);
      return;
    }

    // منع التوصيل المباشر بين الصور
    if (firstPoint.type.includes("Img") && type.includes("Img")) {
      return;
    }

    let startPoint = firstPoint;
    let endPoint = targetPoint;

    // إذا البداية من النص والنهاية على صورة تحت → اطلع من الدوت السفلية
    if (firstPoint.type === "centerText" && type === "rightImg") {
      const centerEl = containerRef.current.querySelector(
        `[data-left-id="${firstPoint.id}"]`,
      );
      const bottomDotPos = getDotCenter(centerEl, ".dot-bottom");

      if (bottomDotPos) {
        startPoint = {
          ...firstPoint,
          x: bottomDotPos.x,
          y: bottomDotPos.y,
        };
      }
    }

    // إذا البداية من النص والنهاية على صورة فوق → اطلع من الدوت العلوية
    if (firstPoint.type === "centerText" && type === "leftImg") {
      const centerEl = containerRef.current.querySelector(
        `[data-left-id="${firstPoint.id}"]`,
      );
      const topDotPos = getDotCenter(centerEl, ".dot-top");

      if (topDotPos) {
        startPoint = {
          ...firstPoint,
          x: topDotPos.x,
          y: topDotPos.y,
        };
      }
    }

    const newLine = {
      x1: startPoint.x,
      y1: startPoint.y,
      x2: endPoint.x,
      y2: endPoint.y,
      leftId: startPoint.type === "centerText" ? startPoint.id : targetPoint.id,
      image: startPoint.type === "centerText" ? targetPoint.id : startPoint.id,
    };

    setLines((prev) => {
      let updated = [...prev];

      const isTopConnection =
        newLine.image.startsWith("img") && !newLine.image.startsWith("r");
      const isBottomConnection = newLine.image.startsWith("r");

      if (isTopConnection) {
        // كل صورة فوق إلها خط واحد فقط
        updated = updated.filter((line) => line.image !== newLine.image);

        // كل كلمة إلها خط واحد فقط من فوق
        updated = updated.filter(
          (line) =>
            !(
              line.leftId === newLine.leftId &&
              line.image.startsWith("img") &&
              !line.image.startsWith("r")
            ),
        );
      }

      if (isBottomConnection) {
        // كل صورة تحت إلها خط واحد فقط
        updated = updated.filter((line) => line.image !== newLine.image);

        // كل كلمة إلها خط واحد فقط من تحت
        updated = updated.filter(
          (line) =>
            !(line.leftId === newLine.leftId && line.image.startsWith("r")),
        );
      }

      updated.push(newLine);
      return updated;
    });

    // بعد أي توصيل، لا تضل ماسك الكلمة تلقائياً
    setFirstPoint(null);
  };
  const handleTryAgain = () => {
    setLines([]);
    setWrongLeft([]);
    setWrongLineIndexes([]);
    setLocked(false);
    setChecked(false);
    setFirstPoint(null);
  };

  const handleShowAnswer = () => {
    const finalLines = [];
    const container = containerRef.current;

    correctMatches.forEach((c) => {
      const leftImgEl = container.querySelector(`[data-image="${c.centerId}"]`);
      const centerTextEl = container.querySelector(
        `[data-left-id="${c.leftId}"]`,
      );
      const rightImgEl = container.querySelector(`[data-image="${c.rightId}"]`);

      if (!leftImgEl || !centerTextEl || !rightImgEl) return;

      const leftDot = getDotCenter(leftImgEl, ".dot");
      const centerTopDot = getDotCenter(centerTextEl, ".dot-top");
      const centerBottomDot = getDotCenter(centerTextEl, ".dot-bottom");
      const rightDot = getDotCenter(rightImgEl, ".dot");

      if (leftDot && centerTopDot) {
        finalLines.push({
          x1: leftDot.x,
          y1: leftDot.y,
          x2: centerTopDot.x,
          y2: centerTopDot.y,
          leftId: c.leftId,
          image: c.centerId,
        });
      }

      if (centerBottomDot && rightDot) {
        finalLines.push({
          x1: centerBottomDot.x,
          y1: centerBottomDot.y,
          x2: rightDot.x,
          y2: rightDot.y,
          leftId: c.leftId,
          image: c.rightId,
        });
      }
    });

    setLines(finalLines);
    setWrongLeft([]);
    setWrongLineIndexes([]);
    setLocked(true);
    setChecked(true);
  };

  const checkAnswers = () => {
    if (checked || locked) return;
    if (lines.length === 0) {
      ValidationAlert.warning("Please connect the items first.");
      return;
    }

    const wrong = [];
    let correctCount = 0;
    const wrongIndexes = [];

    const grouped = {};
    lines.forEach((line, index) => {
      if (!grouped[line.leftId]) grouped[line.leftId] = [];
      grouped[line.leftId].push(line.image);

      const match = correctMatches.find((m) => m.leftId === line.leftId);
      if (!match) {
        wrongIndexes.push(index);
        return;
      }

      const isCorrectLine =
        line.image === match.centerId || line.image === match.rightId;

      if (!isCorrectLine) {
        wrongIndexes.push(index);
      }
    });

    correctMatches.forEach((match) => {
      const userConnections = grouped[match.leftId] || [];
      if (
        userConnections.includes(match.centerId) &&
        userConnections.includes(match.rightId)
      ) {
        correctCount++;
      } else {
        wrong.push(match.leftId);
      }
    });

    setWrongLeft(wrong);
    setWrongLineIndexes(wrongIndexes);
    setChecked(true);
    setLocked(true);

    if (wrong.length === 0) {
      ValidationAlert.success(
        `Score: ${correctCount} / ${correctMatches.length}`,
      );
    } else if (wrong.length > 0) {
      ValidationAlert.warning(
        `Score: ${correctCount} / ${correctMatches.length}`,
      );
    } else {
      ValidationAlert.error(
        `Score: ${correctCount} / ${correctMatches.length}`,
      );
    }
  };

  return (
    <div className="main-container-component">
      <div className="div-forall mb-5" style={{gap:"45px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">A</span>Look, read, and match.
        </h1>

      <div className="flex flex-col items-center">
          <div
            className="flex flex-col items-center w-full relative"
            style={{
              justifyContent: "space-between",
              width: "85%",
              gap: "90px",
            }}
            ref={containerRef}
          >
            {/* Left Column (Images) */}
            <div className="flex flex-row gap-5 w-full justify-between">
              {images.map((img) => (
                <div
                  key={img.id}
                  className={`relative cursor-pointer ${locked ? "opacity-50" : ""} ${firstPoint?.id === img.id ? "ring-2 ring-red-600 rounded" : ""}`}
                  data-image={img.id}
                  onClick={(e) => (firstPoint ? handleEnd(e) : handleStart(e))}
                >
                  <div className="dot w-3 h-3 bg-red-500 rounded-full absolute -bottom-3 right-10" />
                  <img
                    src={img.src}
                    alt=""
                    className="object-cover"
                    style={{height:"80px",width:"100px"}}
                  />
                </div>
              ))}
            </div>

            {/* Center Column (Texts) */}
            <div className="flex flex-row gap-0 w-full justify-between">
              {leftParts.map((l, i) => (
                <div
                  key={i}
                  className={`w-[100px] flex flex-col items-center gap-5 p-2 cursor-pointer border rounded ${locked ? "opacity-50" : ""} ${firstPoint?.id === l.id && firstPoint?.type === "centerText" ? "bg-red-100 border-red-600" : "border-transparent"}`}
                  data-left-id={l.id}
                  onClick={(e) => (firstPoint ? handleEnd(e) : handleStart(e))}
                >
                  <div className="dot dot-top w-3 h-3 bg-red-500 rounded-full" />
                  <span>{l.text}</span>

                  <div className="dot dot-bottom w-3 h-3 bg-red-500 rounded-full" />
                </div>
              ))}
            </div>

            {/* Right Column (Images) */}
            <div className="flex flex-row gap-5 w-full justify-between">
              {rightParts.map((r) => (
                <div
                  key={r.id}
                  className={`relative cursor-pointer ${locked ? "opacity-50" : ""} ${firstPoint?.id === r.id ? "ring-2 ring-blue-400 rounded" : ""}`}
                  data-image={r.id}
                  onClick={(e) =>  handleEnd(e)}
                >
                  <div className="dot w-3 h-3 bg-red-500 rounded-full absolute -top-3 right-11" />
                  <img
                    src={r.src}
                    alt=""
                     style={{height:"90px",width:"100px"}}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* SVG Layer for Lines */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
              {lines.map((l, i) => {
                const midX = (l.x1 + l.x2) / 2;
                const midY = (l.y1 + l.y2) / 2;

                return (
                  <g key={i}>
                    <line
                      x1={l.x1}
                      y1={l.y1}
                      x2={l.x2}
                      y2={l.y2}
                      stroke="red"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {checked && wrongLineIndexes.includes(i) && (
                      <>
                        <circle
                          cx={midX + 12}
                          cy={midY - 12}
                          r="9"
                          fill="red"
                        />
                        <text
                          x={midX + 12}
                          y={midY - 12}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill="white"
                          fontSize="14"
                          fontWeight="bold"
                        >
                          ✕
                        </text>
                      </>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div>
            <Button
              handleShowAnswer={handleShowAnswer}
              handleStartAgain={handleTryAgain}
              checkAnswers={checkAnswers}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WB_Unit5_Page27_Q1;

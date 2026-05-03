import { useState, useRef, useLayoutEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page21/Asset 38.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page21/Asset 39.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page21/Asset 40.svg";

// بيانات التمرين
const exerciseData = {
  right: [
    { id: 1, img: img1 },
    { id: 2, img: img2 },
    { id: 3, img: img3 },
  ],
  left: [
    { id: 1, text: "I am a clerk." },
    { id: 2, text: "I am a farmer." },
    { id: 3, text: "I am a chef." },
  ],
  correctMatches: { 1: 2, 2: 3, 3: 1 }, // leftId -> rightId
};

const WB_Unit4_Page21_Q1 = () => {
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matches, setMatches] = useState({});
  const [showResults, setShowResults] = useState(false);

  const [selectedRight, setSelectedRight] = useState(null); // ⭐ جديد
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);
  const elementRefs = useRef({});

  // Hook لرسم وتحديث الخطوط
  useLayoutEffect(() => {
    const updateLines = () => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();

      const newLines = Object.entries(matches)
        .map(([leftId, rightId]) => {
          const leftEl = elementRefs.current[`left-${leftId}`];
          const rightEl = elementRefs.current[`right-${rightId}`];

          if (leftEl && rightEl) {
            const leftRect = leftEl.getBoundingClientRect();
            const rightRect = rightEl.getBoundingClientRect();

            return {
              id: `${leftId}-${rightId}`,
              x1: leftRect.right - containerRect.left,
              y1: leftRect.top + leftRect.height / 2 - containerRect.top,
              x2: rightRect.left - containerRect.left,
              y2: rightRect.top + rightRect.height / 2 - containerRect.top,
            };
          }
          return null;
        })
        .filter(Boolean);

      setLines(newLines);
    };

    updateLines();
    window.addEventListener("resize", updateLines);
    return () => window.removeEventListener("resize", updateLines);
  }, [matches]);

  // منطق التعامل مع النقرات
  const handleLeftClick = (id) => {
    if (showResults) return;
    setSelectedLeft(id);
  };
  const isWrongMatch = (leftId) => {
    if (!showResults) return false;

    // إذا ما في توصيل لا نعرض شيء
    if (!matches[leftId]) return false;

    return matches[leftId] !== exerciseData.correctMatches[leftId];
  };
  const handleRightClick = (rightId) => {
    if (selectedLeft !== null) {
      const newMatches = { ...matches };

      Object.keys(newMatches).forEach((key) => {
        if (newMatches[key] === rightId) {
          delete newMatches[key];
        }
      });

      setMatches({ ...newMatches, [selectedLeft]: rightId });

      setSelectedRight(rightId); // ⭐ تحديد الصورة

      // ⭐ إزالة الإيفكت بعد التوصيل
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 100);
    }
  };

  // منطق التحقق والأزرار
  const checkAnswers = () => {
    if (showResults) return;
    const totalQuestions = exerciseData.left.length;

    // 🔴 تحقق إنو كل العناصر متوصلة
    const allConnected = exerciseData.left.every((item) => matches[item.id]);

    if (!allConnected) {
      ValidationAlert.info("Please connect all items first.");
      return;
    }

    // بعدين نكمل التصحيح
    setShowResults(true);

    let currentScore = 0;

    Object.keys(exerciseData.correctMatches).forEach((leftId) => {
      if (matches[leftId] === exerciseData.correctMatches[leftId]) {
        currentScore++;
      }
    });

    if (currentScore === totalQuestions) {
      ValidationAlert.success(`Score: ${currentScore} / ${totalQuestions}`);
    } else if (currentScore > 0) {
      ValidationAlert.warning(`Score: ${currentScore} / ${totalQuestions}`);
    } else {
      ValidationAlert.error(`Score: ${currentScore} / ${totalQuestions}`);
    }
  };

  const handleShowAnswer = () => {
    setMatches(exerciseData.correctMatches);
    setShowResults(true);
  };

  const handleStartAgain = () => {
    setMatches({});
    setSelectedLeft(null);
    setShowResults(false);
    setLines([]);
  };

  // دوال تحديد الألوان
  const getLineColor = (lineId) => {
    if (!showResults) return "red";
    const [leftId] = lineId.split("-");
    const isCorrect = matches[leftId] === exerciseData.correctMatches[leftId];
    return isCorrect ? "#ef4444" : "#ef4444";
  };

  const getDotColor = (side, id) => {
    if (side === "left" && selectedLeft === id) return "bg-red-600 scale-125";

    const isConnected =
      side === "left" ? !!matches[id] : Object.values(matches).includes(id);
    if (!isConnected) return "bg-[#eb533c]";

    if (showResults) {
      const leftId =
        side === "left"
          ? id
          : Object.keys(matches).find((key) => matches[key] === id);
      if (!leftId) return "bg-red-600";
      const isCorrect = matches[leftId] === exerciseData.correctMatches[leftId];
      return isCorrect ? "bg-[#eb533c]" : "bg-[#eb533c]";
    }

    return "bg-[#eb533c]";
  };

  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"40px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">E</span>Look, read, and match.
        </h1>

        <div
          ref={containerRef}
          className="flex justify-between items-center gap-20 relative"
        >
          {/* Right Side (Text) */}
          <div className="space-y-32">
            {exerciseData.left.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-6 justify-start relative"
              >
                <div className="w-35">
                  <p
                    onClick={() => handleLeftClick(item.id)}
                    className={`text-xl cursor-pointer transition active:scale-105
    ${
      selectedLeft === item.id
        ? "text-red-600 underline"
        : "text-gray-700 hover:text-blue-600"
    }
  `}
                  >
                    {item.text}
                  </p>
                </div>
                <div
                  ref={(el) => (elementRefs.current[`left-${item.id}`] = el)}
                  onClick={() => handleLeftClick(item.id)}
                  className={`w-5 h-5 rounded-full cursor-pointer transition-all ${getDotColor("left", item.id)}`}
                />
                {isWrongMatch(item.id) && (
                  <div className="absolute -top-2 right-10 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold shadow border-2 border-white">
                    ✕
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-10">
            {exerciseData.right.map((item) => (
              <div key={item.id} className="flex items-center gap-6">
                <div
                  ref={(el) => (elementRefs.current[`right-${item.id}`] = el)}
                  onClick={() => handleRightClick(item.id)}
                  className={`w-5 h-5 rounded-full cursor-pointer transition-all ${getDotColor("right", item.id)}`}
                />
                <img
                  src={item.img}
                  alt={`Person ${item.id}`}
                  onClick={() => handleRightClick(item.id)}
                  className={`object-contain rounded-lg shadow-sm cursor-pointer transition
    ${
      selectedRight === item.id
        ? "border-2 border-red-600 scale-95 shadow-lg"
        : "hover:scale-105 active:scale-105"
    }
  `}
                  style={{ height: "120px", width: "auto" }}
                />
              </div>
            ))}
          </div>

          {/* SVG Container for Lines */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {lines.map((line) => (
              <line
                key={line.id}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={getLineColor(line.id)}
                strokeWidth="3"
                strokeLinecap="round"
              />
            ))}
          </svg>
        </div>

        <Button
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={handleStartAgain}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
};

export default WB_Unit4_Page21_Q1;

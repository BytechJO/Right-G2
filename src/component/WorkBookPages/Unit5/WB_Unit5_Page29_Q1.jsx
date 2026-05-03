import { useState, useRef, useLayoutEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page29/Ex E 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page29/Ex E 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page29/Ex E 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page29/Ex E 4.svg";

const exerciseData = {
  right: [
    { id: 1, img: img1 },
    { id: 2, img: img2 },
    { id: 3, img: img3 },
    { id: 4, img: img4 },
  ],
  left: [
    { id: 1, text: "What does he like?", answer: "He likes burgers." },
    { id: 2, text: "What does she like?", answer: "She likes grapes." },
    { id: 3, text: "What does she like?", answer: "She likes salad." },
    { id: 4, text: "What does he like?", answer: "He likes peaches." },
  ],
  correctMatches: { 1: 2, 2: 3, 3: 1, 4: 4 },
};

const WB_Unit5_Page29_Q1 = () => {
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matches, setMatches] = useState({});
  const [showResults, setShowResults] = useState(false);
const [selectedRight, setSelectedRight] = useState(null);
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
    setSelectedLeft(id);
    setShowResults(false);
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

    // ✅ التحقق إنو كل الجمل موصولة
    if (Object.keys(matches).length < totalQuestions) {
      ValidationAlert.warning("Please connect all sentences first.");
      return;
    }

    setShowResults(true);

    let currentScore = 0;

    Object.keys(exerciseData.correctMatches).forEach((leftId) => {
      if (matches[leftId] === exerciseData.correctMatches[leftId]) {
        currentScore++;
      }
    });

    if (currentScore === totalQuestions) {
      ValidationAlert.success(`Score: ${currentScore} / ${totalQuestions}`);
    } else if (currentScore === 0) {
      ValidationAlert.error(`Score: ${currentScore} / ${totalQuestions}`);
    } else {
      ValidationAlert.warning(`Score: ${currentScore} / ${totalQuestions}`);
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
    if (!showResults) return "#ef4444";
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
      if (!leftId) return "bg-[#eb533c]";
      const isCorrect = matches[leftId] === exerciseData.correctMatches[leftId];
      return isCorrect ? "bg-[#eb533c]" : "bg-[#eb533c]";
    }

    return "bg-[#eb533c]";
  };
  const isLeftWrong = (leftId) => {
    if (!showResults) return false;

    return matches[leftId] !== exerciseData.correctMatches[leftId];
  };
  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"45px"}}>
        <h1 className="WB-header-title-page8">
          <div className="WB-ex-A">E</div>Read, look, and match.
        </h1>

        <div
          ref={containerRef}
          className="flex justify-between items-center gap-20 relative"
        >
          <div className="space-y-14">
            {exerciseData.left.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-6 justify-end"
              >
                <div className="relative">
                 <div
  onClick={() => handleLeftClick(item.id)}
  className={`text-left cursor-pointer transition transform active:scale-95
    ${
      selectedLeft === item.id
        ? "scale-105"
        : "hover:scale-105"
    }
  `}
>
  <p
    className={`text-xl ${
      selectedLeft === item.id
        ? "text-red-600 underline"
        : "text-gray-700"
    }`}
  >
    {item.text}
  </p>

  <p
    className={`text-xl ${
      selectedLeft === item.id
        ? "text-red-600 underline"
        : "text-gray-700"
    }`}
  >
    {item.answer}
  </p>
</div>
                  {isLeftWrong(item.id) && (
                    <div className="absolute -top-2 -right-7 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold shadow border-2 border-white">
                      ✕
                    </div>
                  )}
                </div>

                <div
                  ref={(el) => (elementRefs.current[`left-${item.id}`] = el)}
                  onClick={() => handleLeftClick(item.id)}
                  className={`w-5 h-5 rounded-full cursor-pointer transition-all ${getDotColor("left", item.id)}`}
                />
              </div>
            ))}
          </div>

          <div className="space-y-8">
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
  className={`object-contain cursor-pointer transition transform active:scale-95
    ${
      selectedRight === item.id
        ? "border-2 border-red-600 scale-95 shadow-lg"
        : "hover:scale-105"
    }
  `}
  style={{ height: "80px", width: "auto" }}
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

export default WB_Unit5_Page29_Q1;

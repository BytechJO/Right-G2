import { useState, useRef, useLayoutEffect } from "react";
import img from "../../../assets/imgs/test6.png";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 43/Ex J 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 43/Ex J 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 43/Ex J 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 43/Ex J 4.svg";

const exerciseData = {
  right: [
    { id: 1, img: img1 },
    { id: 2, img: img2 },
    { id: 3, img: img3 },
    { id: 4, img: img4 },
  ],

  left: [
    { id: 1, text: "She talks at the reception desk." },
    { id: 2, text: " She rolls her suitcase in the airport." },
    { id: 3, text: "I carry the suitcase in my hand." },
    { id: 4, text: "The flight attendant smiles." },
  ],

  correctMatches: { 1: 4, 2: 3, 3: 1, 4: 2 },
};

const WB_Unit7_Page43_Q2 = () => {
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matches, setMatches] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [selectedRight, setSelectedRight] = useState(null);
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);
  const elementRefs = useRef({});

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

  const handleLeftClick = (id) => {
    if (showResults) return;

    setSelectedLeft(id);
    setSelectedRight(null); // يفك التحديد من اليمين
  };

  const handleRightClick = (rightId) => {
    if (showResults) return;

    setSelectedRight(rightId); // ⭐ effect على الصورة

    if (selectedLeft !== null) {
      const newMatches = { ...matches };

      Object.keys(newMatches).forEach((key) => {
        if (newMatches[key] === rightId) {
          delete newMatches[key];
        }
      });

      setMatches({ ...newMatches, [selectedLeft]: rightId });

      setSelectedLeft(null);
      setSelectedRight(null); // بعد الربط نشيل التحديد
    }
  };

  const checkAnswers = () => {
    if (showResults) return;
    setShowResults(true);

    const totalQuestions = exerciseData.left.length;

    const unanswered = Object.keys(exerciseData.correctMatches).some(
      (leftId) => !matches.hasOwnProperty(leftId),
    );
    if (unanswered) {
      ValidationAlert.info("You have unanswered questions.");
      return;
    }

    let currentScore = 0;

    Object.entries(exerciseData.correctMatches).forEach(
      ([leftId, correctRightId]) => {
        if (matches[leftId] === correctRightId) {
          currentScore++;
        }
      },
    );

    const scoreMessage = `Score: ${currentScore} / ${totalQuestions}`;

    if (currentScore === totalQuestions) {
      ValidationAlert.success(scoreMessage);
    } else if (currentScore === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
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
    if (!isConnected) return "bg-[#ef4444]";

    if (showResults) {
      const leftId =
        side === "left"
          ? id
          : Object.keys(matches).find((key) => matches[key] === id);
      if (!leftId) return "bg-[#ef4444]";
      const isCorrect = matches[leftId] === exerciseData.correctMatches[leftId];
    }

    return "bg-[#ef4444]";
  };

  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"20px"}}>
        <h1 className="WB-header-title-page8">
          {" "}
          <span className="WB-ex-A">J</span>Look, read, and match.
        </h1>

        <div
          ref={containerRef}
          className="flex justify-between items-center gap-20 relative mb-10"
        >
          <div className="space-y-20">
            {exerciseData.left.map((item) => {
              const isWrong =
                showResults &&
                matches[item.id] &&
                matches[item.id] !== exerciseData.correctMatches[item.id];

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-6 justify-end relative"
                >
                  {/* ❌ Wrong Icon */}
                  {isWrong && (
                    <div className="absolute -top-2 right-22 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow border-2 border-white">
                      ✕
                    </div>
                  )}
<span className="text-2xl text-blue-900 font-bold">
                      {item.id}
                    </span>
                  <div
                    className={`flex items-center gap-3 w-[315px] justify-start cursor-pointer transition transform active:scale-95
  ${
    selectedLeft === item.id
      ? "text-red-600 underline scale-110"
      : "hover:scale-105"
  }
`}
                    onClick={() => handleLeftClick(item.id)}
                  >
                    
                    <p
  className={`text-xl text-right ${
    selectedLeft === item.id ? "text-red-600" : "text-gray-700"
  }`}
>
  {item.text}
</p>
                  </div>
                  <div
                    ref={(el) => (elementRefs.current[`left-${item.id}`] = el)}
                    onClick={() => handleLeftClick(item.id)}
                    className={`w-5 h-5 rounded-full cursor-pointer transition-all ${getDotColor(
                      "left",
                      item.id,
                    )}`}
                  />
                </div>
              );
            })}
          </div>

          <div className="space-y-2">
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
                 className={`object-contain cursor-pointer transition transform active:scale-95
  ${
    selectedRight === item.id
      ? "scale-110 ring-2 ring-red-600 rounded-lg"
      : "hover:scale-105"
  }
`}
                  onClick={() => handleRightClick(item.id)}
                  style={{ height: "110px", width: "auto" }}
                />
              </div>
            ))}
          </div>

          {/* SVG Container for Lines */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {lines.map((line) => (
              <path
                key={line.id}
                d={`
    M ${line.x1} ${line.y1}
    C ${(line.x1 + line.x2) / 2} ${line.y1},
      ${(line.x1 + line.x2) / 2} ${line.y2},
      ${line.x2} ${line.y2}
  `}
                stroke={getLineColor(line.id)}
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="6 6"
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

export default WB_Unit7_Page43_Q2;

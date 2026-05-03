import { useState, useRef, useLayoutEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 36/Ex G 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 36/Ex G 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 36/Ex G 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 36/Ex G 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 36/Ex G 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 36/Ex G 6.svg";

const exerciseData = {
  right: [
    { id: 1, img: img1 },
    { id: 2, img: img2 },
    { id: 3, img: img3 },
    { id: 4, img: img4 },
    { id: 5, img: img5 },
    { id: 6, img: img6 },
  ],
  left: [
    { id: 1, text: "It’s half past three." },
    { id: 2, text: "It’s eleven o’clock." },
    { id: 3, text: "It’s half past nine." },
    { id: 4, text: "It’s seven o’clock." },
    { id: 5, text: "It’s four o’clock." },
    { id: 6, text: "It’s half past eight." },
  ],
  correctMatches: { 1: 4, 2: 5, 3: 3, 4: 2, 5: 6, 6: 1 },
};

const WB_Unit6_Page36_Q1 = () => {
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

  const isLeftMatchWrong = (leftId) => {
    if (!showResults) return false;
    if (!matches[leftId]) return false;

    return matches[leftId] !== exerciseData.correctMatches[leftId];
  };

  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"25px"}}>
        <h1 className="WB-header-title-page8">
          <div className="WB-ex-A">G</div>Read, look, and match.
        </h1>

        <div
          ref={containerRef}
          className="flex justify-between items-center gap-20 relative mb-10"
        >
          <div className="space-y-18">
            {exerciseData.left.map((item) => (
              <div key={item.id} className="flex items-center gap-6 w-full">
                <div className="text-right flex gap-5 items-center">
                  <span className="text-xl font-bold text-blue-900">
                    {item.id}
                  </span>

                  <div className="relative ">
                    <p
                      onClick={() => handleLeftClick(item.id)}
                      className={`text-xl border-2 rounded-lg p-2 text-left cursor-pointer transition transform active:scale-95 w-[200px]
    ${
      selectedLeft === item.id
        ? "text-red-600 underline border-red-600 scale-105 shadow-md"
        : "text-gray-700 hover:scale-105 hover:border-blue-400"
    }
  `}
                    >
                      {item.text}
                    </p>

                    {isLeftMatchWrong(item.id) && (
                      <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shadow-md z-10 border-2 border-white">
                        <span className="text-white text-sm font-bold leading-none">
                          ✕
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  ref={(el) => (elementRefs.current[`left-${item.id}`] = el)}
                  onClick={() => handleLeftClick(item.id)}
                  className={`w-5 h-5 rounded-full cursor-pointer transition-all ${getDotColor("left", item.id)}`}
                />
              </div>
            ))}
          </div>

          <div className="space-y-5">
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
        ? "border-2 border-red-600 scale-95 shadow-lg rounded"
        : "hover:scale-105"
    }
  `}
  style={{ height: "100px", width: "auto" }}
/>
              </div>
            ))}
          </div>

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

export default WB_Unit6_Page36_Q1;

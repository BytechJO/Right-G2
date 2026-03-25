import { useState, useRef, useLayoutEffect } from "react";
import img from "../../../assets/imgs/test6.png";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../button";

const exerciseData = {
  right: [
    { id: 1, text: "at 12:30 p.m." },
    { id: 2, text: "at 1:00 p.m." },
    { id: 3, text: "at 7:30 a.m." },
    { id: 4, text: "at 7:00 a.m." },
    { id: 5, text: "at 8:00 a.m." },
    { id: 6, text: "at 6:30 a.m." },
    { id: 7, text: "at 9:30 p.m." },
    { id: 8, text: "at 9:00 p.m." },
  ],
  left: [
    { id: 1, text: "Sandra goes to school" },
    { id: 2, text: "Molly eats breakfast" },
    { id: 3, text: "Wesley has English class" },
    { id: 4, text: "Albert goes to bed" },
    { id: 5, text: "Molly has English class" },
    { id: 6, text: "Wesley goes to bed" },
    { id: 7, text: "Sandra eats breakfast" },
    { id: 8, text: "Albert goes to school" },
  ],
  correctMatches: { 1: 3, 2: 6, 3: 1, 4: 7, 5: 2, 6: 8, 7: 4, 8: 5 },
};

const WB_Unit6_Page37_Q1 = () => {
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matches, setMatches] = useState({});
  const [showResults, setShowResults] = useState(false);

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
      setSelectedLeft(null);
    }
  };

  const checkAnswers = () => {
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
    if (side === "left" && selectedLeft === id) return "bg-blue-500 scale-125";

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
      return isCorrect ? "bg-green-500" : "bg-red-600";
    }

    return "bg-blue-500";
  };

  const isLeftMatchWrong = (leftId) => {
    if (!showResults) return false;
    if (!matches[leftId]) return false;

    return matches[leftId] !== exerciseData.correctMatches[leftId];
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "20px" }}>
        <h1 className="WB-header-title-page8">
          <div className="WB-ex-A">E</div>Read, look, and match.
        </h1>

        <div className="border rounded-xl overflow-hidden text-xs mb-10">
          <table className="w-full text-center">
            <thead>
              <tr>
                <th className="p-1 border"></th>
                <th className="p-1 border">eat breakfast</th>
                <th className="p-1 border">go to school</th>
                <th className="p-1 border">English class</th>
                <th className="p-1 border">go to bed</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-1 border">Molly</td>
                <td className="p-1 border"> 6:30 a.m. </td>
                <td className="p-1 border"> 7:00 a.m. </td>
                <td className="p-1 border"> 1:00 p.m. </td>
                <td className="p-1 border"> 8:00 p.m. </td>
              </tr>
              <tr>
                <td className="p-1 border">Sandra</td>
                <td className="p-1 border"> 7:00 a.m. </td>
                <td className="p-1 border"> 7:30 a.m. </td>
                <td className="p-1 border"> 11:00 a.m. </td>
                <td className="p-1 border"> 10:00 p.m. </td>
              </tr>
              <tr>
                <td className="p-1 border">Wesley</td>
                <td className="p-1 border"> 8:00 a.m. </td>
                <td className="p-1 border"> 8:10 a.m. </td>
                <td className="p-1 border"> 12:30 p.m. </td>
                <td className="p-1 border"> 9:00 p.m. </td>
              </tr>
              <tr>
                <td className="p-1 border">Albert</td>
                <td className="p-1 border"> 7:30 a.m. </td>
                <td className="p-1 border"> 8:00 a.m. </td>
                <td className="p-1 border"> 10:00 a.m. </td>
                <td className="p-1 border"> 9:30 p.m. </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          ref={containerRef}
          className="flex justify-between items-center gap-20 relative mb-20"
        >
          <div className="space-y-22">
            {exerciseData.left.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-6 justify-start"
              >
                <div className="relative">
                  <p className="text-xl text-gray-700 w-55">{item.text}</p>

                  {isLeftMatchWrong(item.id) && (
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shadow-md z-10 border-2 border-white">
                      <span className="text-white text-sm font-bold leading-none">
                        ✕
                      </span>
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

          <div className="space-y-22">
            {exerciseData.right.map((item) => (
              <div key={item.id} className="flex items-center gap-6">
                <div
                  ref={(el) => (elementRefs.current[`right-${item.id}`] = el)}
                  onClick={() => handleRightClick(item.id)}
                  className={`w-5 h-5 rounded-full cursor-pointer transition-all ${getDotColor("right", item.id)}`}
                />
                <div className="text-right">
                  <p className="text-xl text-gray-700">{item.text}</p>
                </div>
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

export default WB_Unit6_Page37_Q1;
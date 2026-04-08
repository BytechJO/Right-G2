import { useState, useRef, useEffect } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex E 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex E 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex E 3.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";

const WB_Unit1_Page4_Q3 = () => {
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matches, setMatches] = useState({}); // { leftId: rightId }
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const containerRef = useRef(null);
  const leftRefs = useRef({});
  const rightRefs = useRef({});
  const [lines, setLines] = useState([]);
  const [checked, setChecked] = useState(false);
  const data = {
    left: [
      { id: 1, text: "I'm Stella's ...", img: img1 },
      { id: 2, text: "I'm Stella's ...", img: img2 },
      { id: 3, text: "I'm Stella's ...", img: img3 },
    ],
    right: [
      { id: 1, text: "cousin." },
      { id: 2, text: "aunt." },
      { id: 3, text: "uncle." },
    ],
  };

  const correctMatches = { 1: 3, 2: 1, 3: 2 };

  const handleLeftClick = (id) => setSelectedLeft(id);
  const handleRightClick = (id) => {
    if (selectedLeft) {
      setMatches({ ...matches, [selectedLeft]: id });
      setSelectedLeft(null);
    }
  };

  const checkAnswers = () => {
    let currentScore = 0;
    const totalQuestions = Object.keys(correctMatches).length;

    Object.keys(correctMatches).forEach((leftId) => {
      const userMatch = matches[leftId];
      const correctMatch = correctMatches[leftId];

      if (userMatch && userMatch === correctMatch) {
        currentScore += 1;
      }
    });

    setScore(currentScore);
    setChecked(true);

    if (currentScore === totalQuestions) {
      ValidationAlert.success(`Score: ${currentScore} / ${totalQuestions}`);
    } else if (currentScore > 0) {
      ValidationAlert.warning(`Score: ${currentScore} / ${totalQuestions}`);
    } else {
      ValidationAlert.error(`Score: ${currentScore} / ${totalQuestions}`);
    }
  };

  const handleShowAnswer = () => {
    setMatches(correctMatches);
    setShowAnswers(true);
  };

  const handleStartAgain = () => {
    setMatches({});
    setShowResults(false);
    setShowAnswers(false);
  };

  useEffect(() => {
    const newLines = [];

    Object.keys(matches).forEach((leftId) => {
      const rightId = matches[leftId];

      const leftEl = leftRefs.current[leftId];
      const rightEl = rightRefs.current[rightId];

      if (leftEl && rightEl && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const leftRect = leftEl.getBoundingClientRect();
        const rightRect = rightEl.getBoundingClientRect();

        newLines.push({
          x1: leftRect.right - containerRect.left,
          y1: leftRect.top + leftRect.height / 2 - containerRect.top,
          x2: rightRect.left - containerRect.left,
          y2: rightRect.top + rightRect.height / 2 - containerRect.top,
        });
      }
    });

    setLines(newLines);
  }, [matches]);

  return (
    <div className="p-8 bg-white rounded-3xl max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <div className="WB-ex-A">E</div>
        <h1 className="WB-header-title-page8">Look, read, and match.</h1>
      </div>

      <div ref={containerRef} className="flex justify-between gap-20 relative">
        {/* Left Side */}
        <div className="space-y-12">
          {data.left.map((item) => {
            const isWrong =
              checked &&
              matches[item.id] &&
              matches[item.id] !== correctMatches[item.id];
            return (
              <div key={item.id} className="flex items-center gap-6 relative">
                 {isWrong && (
        <div className="wb-wrong-icon-unit1-page4-q3">
          ✕
        </div>
      )}

                <span className="font-bold text-blue-900 text-xl">
                  {item.id}
                </span>
                <img
                  src={item.img}
                  alt=""
                  className="max-w-16 max-h-16 rounded-full object-cover"
                />
                <span className="text-xl text-gray-700">{item.text}</span>
                <div
                  ref={(el) => (leftRefs.current[item.id] = el)}
                  onClick={() => handleLeftClick(item.id)}
                  className={`w-4 h-4 rounded-full cursor-pointer transition-all ${selectedLeft === item.id ? "bg-red-500 scale-125" : "bg-[#eb533c]"}`}
                />
              </div>
            );
          })}
        </div>

        {/* Right Side */}
        <div className="space-y-23.5">
          {data.right.map((item) => (
            <div key={item.id} className="flex items-center gap-6 justify-end">
              <div
                ref={(el) => (rightRefs.current[item.id] = el)}
                onClick={() => handleRightClick(item.id)}
                className={`w-4 h-4 rounded-full cursor-pointer transition-all ${Object.values(matches).includes(item.id) ? "bg-red-500" : "bg-[#eb533c]"}`}
              />
              <span className="text-xl text-gray-700 w-24">{item.text}</span>
            </div>
          ))}
        </div>
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {lines.map((line, index) => (
            <line
              key={index}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="red"
              strokeWidth="2"
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
  );
};

export default WB_Unit1_Page4_Q3;

import React, { useState } from "react";

// استيراد الصور ومكونات الأزرار والتنبيهات
import placeholderImg from "../../../assets/imgs/test6.png";
import Button from "../button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img from "../../../assets/imgs/test6.png";

const exerciseData = [
  { id: "b1", src: img, correctAnswer: "✘" },
  { id: "b2", src: img, correctAnswer: "✘" },
  { id: "b3", src: img, correctAnswer: "✓" },
  { id: "b4", src: img, correctAnswer: "✓" },
  { id: "b5", src: img, correctAnswer: "✘" },
  { id: "b6", src: img, correctAnswer: "✘" },
];

const WB_Unit6_Page38_Q2 = () => {
  const [selections, setSelections] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleBoxClick = (qId) => {
    if (showResults) return;

    setSelections((prev) => {
      const current = prev[qId];

      if (current === "✓") return { ...prev, [qId]: "✘" };
      if (current === "✘") return { ...prev, [qId]: undefined };
      return { ...prev, [qId]: "✓" };
    });
  };

  const getBoxClass = (qId) => {
    const isSelected = !!selections[qId];

    if (showResults) {
      const isCorrect =
        selections[qId] === exerciseData.find((q) => q.id === qId).correctAnswer;

      return isCorrect
        ? "border-green-500 bg-green-50"
        : "border-red-500 bg-red-50";
    }

    if (isSelected) return "border-blue-500";
    return "border-gray-400";
  };

  const isWrongAnswer = (qId) => {
    if (!showResults) return false;
    if (!selections[qId]) return false;

    const question = exerciseData.find((q) => q.id === qId);
    return selections[qId] !== question.correctAnswer;
  };

  const handleShowAnswer = () => {
    const correctSels = {};
    exerciseData.forEach((q) => {
      correctSels[q.id] = q.correctAnswer;
    });
    setSelections(correctSels);
    setShowResults(true);
  };

  const handleStartAgain = () => {
    setSelections({});
    setShowResults(false);
  };

  const checkAnswers = () => {
    const unanswered = exerciseData.filter((q) => !selections[q.id]);

    if (unanswered.length > 0) {
      ValidationAlert.warning("Please answer all items before checking.");
      return;
    }

    setShowResults(true);

    let score = 0;
    exerciseData.forEach((q) => {
      if (selections[q.id] === q.correctAnswer) score++;
    });

    if (score === exerciseData.length) {
      ValidationAlert.success(`Score: ${score} / ${exerciseData.length}`);
    } else if (score === 0) {
      ValidationAlert.error(`Score: ${score} / ${exerciseData.length}`);
    } else {
      ValidationAlert.warning(`Score: ${score} / ${exerciseData.length}`);
    }
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "20px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">C</span>Does it have long i? Listen and
          write <span className="text-blue-900">✓</span> or{" "}
          <span className="text-blue-900">✕</span>.
        </h1>

        <div className="flex flex-wrap gap-6 items-center ml-10">
          {exerciseData.map((item, index) => (
            <div key={item.id} className="flex flex-col items-center gap-2">
              <span className="font-bold text-blue-600">{index + 1}</span>
              <img src={item.src} className="max-w-45 max-h-45" />

              <div className="relative">
                <div
                  onClick={() => handleBoxClick(item.id)}
                  className={`w-8 h-8 border-2 rounded-md flex items-center justify-center cursor-pointer transition-all`}
                >
                  <span
                    className={`text-2xl font-bold ${
                      selections[item.id] === "✓"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selections[item.id]}
                  </span>
                </div>

                {isWrongAnswer(item.id) && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-md z-10 border-2 border-white">
                    <span className="text-white text-xs font-bold leading-none">
                      ✕
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleStartAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};

export default WB_Unit6_Page38_Q2;
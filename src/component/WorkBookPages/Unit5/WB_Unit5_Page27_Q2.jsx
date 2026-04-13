import React, { useState } from "react";

// استيراد الصور ومكونات الأزرار والتنبيهات
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import placeholderImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page27/Ex B 1.svg";

const exerciseData = [
  { id: "b1", sentence: "I don't like rice.", correctAnswer: "✘" },
  { id: "b2", sentence: "I like stew.", correctAnswer: "✘" },
  { id: "b3", sentence: "I don't like fish.", correctAnswer: "✓" },
  { id: "b4", sentence: "I like chicken.", correctAnswer: "✓" },
  { id: "b5", sentence: "I don't like spaghetti.", correctAnswer: "✘" },
  { id: "b6", sentence: "I like burgers.", correctAnswer: "✘" },
];

const WB_Unit5_Page27_Q2 = () => {
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
    if (isSelected) return "border-blue-500";
    return "border-gray-400";
  };
  const isWrong = (item) => {
    if (!showResults) return false;

    const selected = selections[item.id];
    if (!selected) return false;

    return selected !== item.correctAnswer;
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
    if (showResults) return;
    const hasEmptyAnswers = exerciseData.some((q) => !selections[q.id]);

    if (hasEmptyAnswers) {
      ValidationAlert.info("Please answer all questions first.");
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
      <div className="div-forall" style={{ gap: "30px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">B</span>Look, read, and write{" "}
          <span style={{ color: "navy" }}>✓</span> or{" "}
          <span style={{ color: "navy" }}>✕</span>.
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-30 items-center">
          <img
            src={placeholderImg}
            alt="Boy at dinner table"
            className="max-w-sm max-h-100 mx-auto "
          />
          <div className="space-y-4">
            {exerciseData.map((item, index) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="relative">
                  <div
                    onClick={() => handleBoxClick(item.id)}
                    className={`w-8 h-8 border-2 rounded-md flex items-center justify-center cursor-pointer transition-all ${getBoxClass(item.id)}`}
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

                  {isWrong(item) && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow border-2 border-white">
                      ✕
                    </div>
                  )}
                </div>

                <span className="font-bold text-blue-600">{index + 1}</span>
                <p className="text-lg">{item.sentence}</p>
              </div>
            ))}
          </div>
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

export default WB_Unit5_Page27_Q2;

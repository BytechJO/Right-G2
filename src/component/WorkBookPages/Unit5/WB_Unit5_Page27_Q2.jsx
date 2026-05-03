import React, { useState } from "react";

// استيراد الصور ومكونات الأزرار والتنبيهات
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import placeholderImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page27/Ex B 1.svg";
import trueIcon from "../../../assets/imgs/true.svg";
import falseIcon from "../../../assets/imgs/false.svg";
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

  const handleBoxClick = (qId, value) => {
    if (showResults) return;

    setSelections((prev) => ({
      ...prev,
      [qId]: value,
    }));
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
  const isThisOptionWrong = (item, value) => {
    if (!showResults) return false;

    return selections[item.id] === value && value !== item.correctAnswer;
  };
  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"25px"}}>
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
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2 relative">
                      {/* ✅ YES BOX */}
                      <div className="relative">
                        <div
                          onClick={() => handleBoxClick(item.id, "✓")}
                          className={`w-10 h-10 border-2 rounded-md flex items-center justify-center cursor-pointer transition-all
      ${
        selections[item.id] === "✓"
          ? "border-blue-900"
          : "border-gray-400"
      }
      ${isThisOptionWrong(item, "✓") ? "border-red-500 bg-white" : ""}
    `}
                        >
                          <span className="text-green-600 font-bold text-2xl">
                            <img src={trueIcon} style={{ height: "25px" }} />
                          </span>
                        </div>

                        {/* ❌ فوق البوكس الغلط فقط */}
                        {isThisOptionWrong(item, "✓") && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow border-2 border-white">
                            ✕
                          </div>
                        )}
                      </div>

                      {/* ❌ NO BOX */}
                      <div className="relative">
                        <div
                          onClick={() => handleBoxClick(item.id, "✘")}
                          className={`w-10 h-10 border-2 rounded-md flex items-center justify-center cursor-pointer transition-all
      ${
        selections[item.id] === "✘"
          ? "border-blue-900"
          : "border-gray-400"
      }
      ${isThisOptionWrong(item, "✘") ? "border-red-500  bg-white" : ""}
    `}
                        >
                          <span className="text-red-600 font-bold text-2xl">
                            <img src={falseIcon} style={{ height: "25px" }} />
                          </span>
                        </div>

                        {/* ❌ فوق البوكس الغلط فقط */}
                        {isThisOptionWrong(item, "✘") && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow border-2 border-white">
                            ✕
                          </div>
                        )}
                      </div>
                    </div>

                    <span className="font-bold text-blue-900 text-xl">{index + 1}</span>
                    <p className="text-xl">{item.sentence}</p>
                  </div>
                </div>
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

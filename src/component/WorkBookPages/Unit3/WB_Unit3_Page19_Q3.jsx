import React, { useState } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Ex K 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Ex K 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Ex K 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Ex K 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Ex K 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Ex K 6.svg";

import Button from "../button";
import ValidationAlert from "../../Popup/ValidationAlert";

const checkQuestions = [
  {
    id: "k1",
    sentence: "He can swim.",
    options: [
      { id: "opt1", img: img1, isCorrect: true },
      { id: "opt2", img: img2, isCorrect: false },
    ],
  },
  {
    id: "k2",
    sentence: "He can take a photo.",
    options: [
      { id: "opt3", img: img3, isCorrect: true },
      { id: "opt4", img: img4, isCorrect: false },
    ],
  },
  {
    id: "k3",
    sentence: "It can fly.",
    options: [
      { id: "opt5", img: img5, isCorrect: true },
      { id: "opt6", img: img6, isCorrect: false },
    ],
  },
];

const WB_Unit3_Page19_Q3 = () => {
  const [selections, setSelections] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (qId, optionId) => {
    setSelections((prev) => ({ ...prev, [qId]: optionId }));
    setShowResults(false);
  };

  const getBoxClass = (qId, option) => {
    const isSelected = selections[qId] === option.id;

    if (showResults) {
      if (option.isCorrect) return "border-green-500";
      if (isSelected && !option.isCorrect) return "border-red-500";
    }

    return isSelected ? "border-blue-500" : "border-gray-300";
  };

  const isWrongSelected = (qId, option) => {
    return showResults && selections[qId] === option.id && !option.isCorrect;
  };

  const isCorrectSelected = (qId, option) => {
    return showResults && option.isCorrect;
  };

  const handleShowAnswer = () => {
    const correctSels = {};
    checkQuestions.forEach((q) => {
      const correctOption = q.options.find((opt) => opt.isCorrect);
      correctSels[q.id] = correctOption.id;
    });
    setSelections(correctSels);
    setShowResults(true);
  };

  const handleStartAgain = () => {
    setSelections({});
    setShowResults(false);
  };

  const checkAnswers = () => {
    const allAnswered = checkQuestions.every((q) => selections[q.id]);

    if (!allAnswered) {
      ValidationAlert.warning("Please answer all questions first!");
      return;
    }

    setShowResults(true);

    let score = 0;
    checkQuestions.forEach((q) => {
      const correctOption = q.options.find((opt) => opt.isCorrect);
      if (selections[q.id] === correctOption.id) {
        score++;
      }
    });

    if (score === checkQuestions.length) {
      ValidationAlert.success(`Score: ${score} / ${checkQuestions.length}`);
    } else if (score > 0) {
      ValidationAlert.warning(`Score: ${score} / ${checkQuestions.length}`);
    } else {
      ValidationAlert.error(`Score: ${score} / ${checkQuestions.length}`);
    }
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "20px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">K</span>Look, read, and write{" "}
          <span style={{ color: "navy" }}>✓</span>.
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {checkQuestions.map((q, index) => (
            <div key={q.id} className="space-y-3">
              <span className="font-bold text-blue-600">{index + 1}</span>

              {q.options.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => handleSelect(q.id, opt.id)}
                  className={`p-2 border-2 rounded-lg cursor-pointer transition-colors relative`}
                >
                  <img
                    src={opt.img}
                    alt="option"
                    className="max-w-50 h-50 rounded-md"
                    style={{ height: "130px" }}
                  />

                  {/* مربع الاختيار الأساسي */}
                  <div className="absolute top-0 right-0 w-10 h-10 border-2 border-gray-400 rounded bg-white flex items-center justify-center">
                    {selections[q.id] === opt.id &&  (
                      <span className="text-xl font-bold text-blue-600">✓</span>
                    )}

        
                  </div>

                  {/* X أبيض داخل دائرة حمراء للاختيار الخاطئ */}
                  {isWrongSelected(q.id, opt) && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold shadow border-2 border-white">
                      ✕
                    </div>
                  )}
                </div>
              ))}

              <p className="text-center text-lg">{q.sentence}</p>
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

export default WB_Unit3_Page19_Q3;
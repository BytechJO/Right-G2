import React, { useState } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Asset 31.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Asset 32.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Asset 33.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Asset 34.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Asset 35.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Asset 36.svg";
import trueIcon from "../../../assets/imgs/true.svg";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";

const checkQuestions = [
  {
    id: "k1",
    sentence: "He can swim.",
    options: [
      { id: "opt1", img: img1, isCorrect: true },
      { id: "opt2", img: img5, isCorrect: false },
    ],
  },
  {
    id: "k2",
    sentence: "He can take a photo.",
    options: [
      { id: "opt3", img: img2, isCorrect: true },
      { id: "opt4", img: img3, isCorrect: false },
    ],
  },
  {
    id: "k3",
    sentence: "It can fly.",
    options: [
      { id: "opt5", img: img6, isCorrect: true },
      { id: "opt6", img: img4, isCorrect: false },
    ],
  },
];

const WB_Unit3_Page19_Q3 = () => {
  const [selections, setSelections] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (qId, optionId) => {
    if (showResults) return;
    setSelections((prev) => ({ ...prev, [qId]: optionId }));
    setShowResults(false);
  };

  const isWrongSelected = (qId, option) => {
    return showResults && selections[qId] === option.id && !option.isCorrect;
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
    if (showResults) return;
    const allAnswered = checkQuestions.every((q) => selections[q.id]);

    if (!allAnswered) {
      ValidationAlert.info("Please answer all questions first!");
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
      <div className="div-forall" style={{gap:"80px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">K</span>Look, read, and write{" "}
          <span style={{ color: "navy" }}>✓</span>.
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {checkQuestions.map((q, index) => (
            <div key={q.id} className="flex gap-5">
              <span className="font-bold text-blue-900 text-[20px]">
                {index + 1}
              </span>
                <div className="flex flex-col">
              {q.options.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => handleSelect(q.id, opt.id)}
                  className="cursor-pointer"
                >
                  <div className="relative inline-block">
                    <img
                      src={opt.img}
                      style={{ height: "150px" }}
                      className="block"
                    />
                    {/* مربع الاختيار الأساسي */}
                    <div
                      className={`absolute bottom-0 right-0 w-10 h-10 border-2 rounded-xl bg-white flex items-center justify-center
    ${isWrongSelected(q.id, opt) ? "border-red-500" : "border-black"}
  `}
                    >
                      {selections[q.id] === opt.id && (
                        <img src={trueIcon} style={{ height: "25px" }} />
                      )}
                    </div>
                  </div>

                  {/* X أبيض داخل دائرة حمراء للاختيار الخاطئ */}
                  {isWrongSelected(q.id, opt) && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold shadow border-2 border-white">
                      ✕
                    </div>
                  )}
                </div>
              ))}
               <p className="text-center text-[20px]">{q.sentence}</p>
</div>
             
            </div>
          ))}
        </div>

        <div className="flex justify-center">
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

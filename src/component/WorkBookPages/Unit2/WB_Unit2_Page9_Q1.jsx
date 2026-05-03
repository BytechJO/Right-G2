import { useState } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 9/Ex A 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 9/Ex A 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 9/Ex A 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 9/Ex A 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 9/Ex A 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 9/Ex A 6.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import "./WB_Unit2_Page9_Q1.css";
const WB_Unit2_Page9_Q1 = () => {
  const [userSelections, setUserSelections] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
  });
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState({});
  const data = [
    { id: 1, img: img1, options: ["tree", "sun"], correct: "sun" },
    { id: 2, img: img2, options: ["duck", "bird"], correct: "duck" },
    { id: 3, img: img3, options: ["cloud", "bird"], correct: "cloud" },

    { id: 4, img: img4, options: ["cloud", "butterfly"], correct: "butterfly" },
    { id: 5, img: img5, options: ["flower", "sun"], correct: "flower" },
    { id: 6, img: img6, options: ["flower", "bird"], correct: "bird" },
  ];

  const handleSelect = (id, option) => {
    if (!showAnswers) {
      setUserSelections({ ...userSelections, [id]: option });
    }
  };

  const checkAnswers = () => {
    if (showAnswers || showResults) return;
    const allAnswered = Object.values(userSelections).every(
      (val) => val !== null,
    );

    if (!allAnswered) {
      ValidationAlert.info("Please answer all questions!");
      return;
    }

    let currentScore = 0;
    const totalQuestions = data.length;

    const newWrong = {};

    data.forEach((item) => {
      const userAnswer = userSelections[item.id];

      if (userAnswer === item.correct) {
        currentScore++;
        newWrong[item.id] = false;
      } else {
        newWrong[item.id] = true;
      }
    });

    setWrongAnswers(newWrong);
    setScore(currentScore);
    setShowResults(true);
    if (currentScore === totalQuestions) {
      ValidationAlert.success(`Score: ${currentScore} / ${totalQuestions}`);
    } else if (currentScore > 0) {
      ValidationAlert.warning(`Score: ${currentScore} / ${totalQuestions}`);
    } else {
      ValidationAlert.error(`Score: ${currentScore} / ${totalQuestions}`);
    }
  };
  const handleShowAnswer = () => {
    const answers = {};
    data.forEach((item) => (answers[item.id] = item.correct));
    setUserSelections(answers);
    setShowAnswers(true);
  };

  const handleStartAgain = () => {
    setUserSelections({ 1: null, 2: null, 3: null, 4: null, 5: null, 6: null });
    setShowResults(false);
    setShowAnswers(false);
    setWrongAnswers({});
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{gap:"25px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">A</span>Look, read, and circle.
        </h1>

        <div className="grid grid-cols-2 gap-12">
          {data.map((item) => (
            <div key={item.id} className="flex flex-col items-center gap-6">
              <div
                className="flex items-center gap-3 text-xl text-gray-800 flex-wrap justify-center"
                style={{ width: "100%" }}
              >
                <span className="font-bold text-blue-900 text-2xl">
                  {item.id}
                </span>
                <img
                  src={item.img}
                  alt=""
                  className="max-w-32 max-h-32 object-contain rounded-xl"
                />
                <div
                  className="flex flex-col rounded-2xl overflow-hidden"
                  style={{ width: "40%" }}
                >
                  {item.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleSelect(item.id, option)}
                      className={`relative px-4 py-1 transition-all ${
                        userSelections[item.id] === option
                          ? "border-blue-500 bg-blue-100"
                          : "border-gray-300 hover:border-blue-400"
                      } ${
                        showAnswers && option === item.correct
                          ? "bg-green-500 text-white"
                          : ""
                      }`}
                    >
                      {option}{" "}
                      {wrongAnswers[item.id] &&
                        userSelections[item.id] === option && (
                          <div className="wrong-icon-unit2-page9-q1">✕</div>
                        )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div >
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

export default WB_Unit2_Page9_Q1;

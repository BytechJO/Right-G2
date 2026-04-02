import { useState } from "react";
import img from "../../../assets/imgs/test6.png";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 10/Ex C 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 10/Ex C 4.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 10/Ex C 2.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 10/Ex C 5.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 10/Ex C 3.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 10/Ex C 6.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../button";
import "./WB_Unit2_Page10_Q1.css"
const WB_Unit2_Page10_Q1 = () => {
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
    {
      id: 1,
      img: img1,
      options: ["This", "That"],
      correct: "This",
      sentence: "is a flower.",
    },
    {
      id: 2,
      img: img2,
      options: ["This", "That"],
      correct: "This",
      sentence: "is a clock.",
    },
    {
      id: 3,
      img: img3,
      options: ["Those", "These"],
      correct: "These",
      sentence: "are queens.",
    },

    {
      id: 4,
      img: img4,
      options: ["Those", "These"],
      correct: "Those",
      sentence: "are trees.",
    },
    {
      id: 5,
      img: img5,
      options: ["This", "That"],
      correct: "That",
      sentence: "is a dog.",
    },
    {
      id: 6,
      img: img6,
      options: ["That", "This"],
      correct: "That",
      sentence: "is a fox.",
    },
  ];

  const handleSelect = (id, option) => {
    if (!showAnswers) {
      setUserSelections({ ...userSelections, [id]: option });
    }
  };

  const checkAnswers = () => {
    const allAnswered = Object.values(userSelections).every(
      (value) => value !== null,
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

    if (currentScore === totalQuestions) {
      ValidationAlert.success(`Score: ${currentScore} / ${totalQuestions}`);
    } else if (currentScore > 0) {
      ValidationAlert.warning(`Score: ${currentScore} / ${totalQuestions}`);
    } else {
      ValidationAlert.info(`Score: ${currentScore} / ${totalQuestions}`);
    }
  };
  const handleShowAnswer = () => {
    const answers = {};
    data.forEach((item) => (answers[item.id] = item.correct));
    setUserSelections(answers);
    setShowAnswers(true);
  };

  const handleStartAgain = () => {
    setUserSelections({
      1: null,
      2: null,
      3: null,
      4: null,
      5: null,
      6: null,
    });
    setShowResults(false);
    setShowAnswers(false);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall">
        <h1 className="WB-header-title-page8">
          {" "}
          <span className="WB-ex-A">C</span>Look, read, and circle.
        </h1>

        <div
          className="grid grid-cols-2 gap-2"
          style={{ justifyItems: "start" }}
        >
          {data.map((item) => (
            <div key={item.id} className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-3 text-xl text-gray-800 justify-center">
                <span className="font-bold text-blue-900 text-2xl">
                  {item.id}
                </span>
                <img
                  src={item.img}
                  alt=""
                  className="max-w-32 max-h-32 object-contain rounded-xl"
                />
                <div className="flex flex-col rounded-2xl">
                  {item.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleSelect(item.id, option)}
                      className={`relative px-4 py-1 rounded-xl transition-all ${
                        userSelections[item.id] === option
                          ? "border-blue-500 bg-blue-100"
                          : "border-gray-300 hover:border-blue-400"
                      } ${showAnswers && option === item.correct ? "bg-green-500 text-white" : ""}`}
                    >
                      {option}
                      {/* ❌ علامة الخطأ */}
                      {wrongAnswers[item.id] &&
                        userSelections[item.id] === option && (
                          <div className="wrong-icon-unit2-p10-q1">✕</div>
                        )}
                    </button>
                  ))}
                </div>
                <h6>{item.sentence}</h6>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
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

export default WB_Unit2_Page10_Q1;

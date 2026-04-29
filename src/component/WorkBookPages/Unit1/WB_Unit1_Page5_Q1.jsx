import { useState } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 5/Ex F 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 5/Ex F 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 5/Ex F 3.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";

const WB_Unit1_Page5_Q1 = () => {
  const [userSelections, setUserSelections] = useState({
    1: null,
    2: null,
    3: null,
  });
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const [checked, setChecked] = useState(false);
  const data = [
    { id: 1, img: img1, options: ["brother.", "sister."], correct: "sister." },
    { id: 2, img: img2, options: ["uncle.", "aunt."], correct: "uncle." },
    { id: 3, img: img3, options: ["mother.", "aunt."], correct: "aunt." },
  ];

  const handleSelect = (id, option) => {
    if (!showAnswers) {
      setUserSelections({ ...userSelections, [id]: option });
    }
  };

  const checkAnswers = () => {
     if (showAnswers ||checked) return;
    const totalQuestions = data.length;
    const selectedAnswers = Object.values(userSelections);

    const hasEmptyAnswers = selectedAnswers.some((answer) => !answer);

    if (hasEmptyAnswers) {
      ValidationAlert.info("Please complete all answers first.");
      return;
    }

    let currentScore = 0;

    data.forEach((item) => {
      const userAnswer = userSelections[item.id];
      const correctAnswer = item.correct;

      if (userAnswer === correctAnswer) {
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
    const answers = {};
    data.forEach((item) => (answers[item.id] = item.correct));
    setUserSelections(answers);
    setShowAnswers(true);
  };

  const handleStartAgain = () => {
    setUserSelections({ 1: null, 2: null, 3: null });
    setShowResults(false);
    setShowAnswers(false);
    setChecked(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <div
        className="div-forall"
        style={{gap:"120px"}}
      
      >
        <h1 className="WB-header-title-page8">
          <div className="WB-ex-A">F</div>Look, read, and circle.
        </h1>
     

      <div className="grid grid-cols-3 gap-12">
        {data.map((item) => {
          const isWrong =
            checked &&
            userSelections[item.id] &&
            userSelections[item.id] !== item.correct;
          return (
            <div
              key={item.id}
              className="flex flex-col items-center justify-center gap-6 relative"
            >
              <div className="flex items-start gap-4 w-full justify-center">
                <span className="font-bold text-blue-900 text-2xl">
                  {item.id}
                </span>
                <img
                  src={item.img}
                  alt=""
                  className="max-w-32 max-h-32 object-contain rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 text-xl text-gray-800 flex-col justify-center">
                <span>This is Stella's</span>
                <div className="flex flex-col border-2 border-gray-400 rounded-2xl overflow-hidden w-[130px]">
                  {item.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleSelect(item.id, option)}
                      className={`px-4 py-1 transition-all relative ${
                        userSelections[item.id] === option
                          ? "bg-blue-500 text-white"
                          : "hover:bg-gray-100"
                      } ${showAnswers && option === item.correct ? "bg-green-500 text-white" : ""}`}
                    >
                      {option}
                    </button>
                  ))}
                  {isWrong && (
                    <div className="wb-wrong-icon-unit1-page5-q1">✕</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
 </div>
      <div className="mt-16 flex justify-center">
        <Button
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={handleStartAgain}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
};

export default WB_Unit1_Page5_Q1;

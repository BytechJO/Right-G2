import { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page21/Ex B 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page21/Ex B 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page21/Ex B 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page21/Ex B 4.svg";

const WB_Unit4_Page21_Q2 = () => {
  const data = [
    { id: 1, img: img1, options: ["nurse", "clerk"], correct: "nurse" },
    { id: 2, img: img2, options: ["pilot", "taxi driver"], correct: "pilot" },

    { id: 4, img: img3, options: ["vet", "mechanic"], correct: "mechanic" },
    { id: 5, img: img4, options: ["clerk", "vet"], correct: "vet" },
  ];
  const initialSelections = Object.fromEntries(
    data.map((item) => [item.id, null]),
  );

  const [userSelections, setUserSelections] = useState(initialSelections);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);

  const handleSelect = (id, option) => {
    if (showAnswers || showResults) return;
    if (!showAnswers) {
      setUserSelections({ ...userSelections, [id]: option });
    }
  };
  const isWrongOption = (itemId, option) => {
    if (!showResults) return false;

    const selected = userSelections[itemId];
    const correct = data.find((item) => item.id === itemId).correct;

    return selected === option && option !== correct;
  };
  const checkAnswers = () => {
    if (showResults || showAnswers) return;
    const totalQuestions = data.length;

    // 🔴 تحقق إذا كل الأسئلة مختارة
    const allSelected = data.every((item) => userSelections[item.id]);

    if (!allSelected) {
      ValidationAlert.info("Please select an answer for all questions.");
      return;
    }
    setShowResults(true);
    let currentScore = 0;

    data.forEach((item) => {
      const userAnswer = userSelections[item.id];
      const correctAnswer = item.correct;

      if (userAnswer === correctAnswer) {
        currentScore += 1;
      }
    });

    setScore(currentScore);

    if (currentScore === totalQuestions) {
      ValidationAlert.success(`Score: ${currentScore} / ${totalQuestions}`);
    } else if (currentScore === 0) {
      ValidationAlert.error(`Score: ${currentScore} / ${totalQuestions}`);
    } else {
      ValidationAlert.warning(`Score: ${currentScore} / ${totalQuestions}`);
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
  };

  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"90px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">B</span>Look, read, and circle.
        </h1>

        <div className="grid grid-cols-2 gap-22">
          {data.map((item) => (
            <div key={item.id} className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-3 text-xl text-gray-800 flex-wrap w-full">
                <div className="flex items-start gap-3 justify-center">
                  <span className="font-bold text-blue-900 text-2xl">
                    {item.id}
                  </span>
                  <img
                    src={item.img}
                    alt=""
                    className="max-w-32 max-h-32 object-contain rounded-xl"
                    style={{width:"150px"}}
                  />
                </div>
                <div className="flex flex-col rounded-2xl gap-2">
                  {item.options.map((option) => {
                    const isSelected = userSelections[item.id] === option;
                    const isCorrect = showAnswers && option === item.correct;

                    return (
                      <button
                        key={option}
                        onClick={() => handleSelect(item.id, option)}
                        className={`relative px-4 py-2 w-35 rounded-full border-2 transition-all${
                          userSelections[item.id] === option
                            ? "text-white border-blue-900"
                            : "bg-white text-gray-800 border-gray-300 hover:border-blue-400"
                        } ${isSelected && "border-blue-900"}`}
                      >
                        {option}

                        {isWrongOption(item.id, option) && (
                          <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold shadow border-2 border-white">
                            ✕
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
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

export default WB_Unit4_Page21_Q2;

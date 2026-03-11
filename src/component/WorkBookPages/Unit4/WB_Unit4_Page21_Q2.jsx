import { useState } from "react";
import img from "../../../assets/imgs/test6.png";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../button";

const WB_Unit4_Page21_Q2 = () => {
  const [userSelections, setUserSelections] = useState({ 1: null, 2: null, 3: null, 4: null, 5: null, 6: null });
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);

  const data = [
    { id: 1, img: img, options: ["nurse", "clerk"], correct: "nurse" },
    { id: 2, img: img, options: ["pilot", "taxi driver"], correct: "pilot" },

    { id: 4, img: img, options: ["vet", "mechanic"], correct: "mechanic" },
    { id: 5, img: img, options: ["clerk", "vet"], correct: "vet" },
  ];

  const handleSelect = (id, option) => {
    if (!showAnswers) {
      setUserSelections({ ...userSelections, [id]: option });
    }
  };

  const checkAnswers = () => {
    let currentScore = 0;

    const totalQuestions = data.length;

    data.forEach((item) => {
      const userAnswer = userSelections[item.id];
      const correctAnswer = item.correct;

      if (userAnswer && userAnswer === correctAnswer) {
        currentScore += 1;
      }
    });

    setScore(currentScore);

    if (currentScore === totalQuestions) {
      ValidationAlert.success(`Score: ${currentScore} / ${totalQuestions}`);
    }
    else if (currentScore > 0) {
      ValidationAlert.error(`Score: ${currentScore} / ${totalQuestions}`);
    }
    else {
      ValidationAlert.warning("No correct answers. Try again.");
    }
  };

  const handleShowAnswer = () => {
    const answers = {};
    data.forEach(item => answers[item.id] = item.correct);
    setUserSelections(answers);
    setShowAnswers(true);
  };

  const handleStartAgain = () => {
    setUserSelections({ 1: null, 2: null, 3: null });
    setShowResults(false);
    setShowAnswers(false);
  };

  return (
    <div className="p-8 bg-white rounded-3xl max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <div className="ex-A">A</div>
        <h1 className="header-title-page8">Look, read, and circle.</h1>
      </div>

      <div className="grid grid-cols-2 gap-12">
        {data.map((item) => (
          <div key={item.id} className="flex flex-col items-center gap-6">

            <div className="flex items-center gap-3 text-xl text-gray-800 flex-wrap justify-center">
              <span className="font-bold text-blue-900 text-2xl">{item.id}</span>
              <img src={item.img} alt="" className="max-w-32 max-h-32 object-contain rounded-xl" />
              <div className="flex flex-col rounded-2xl overflow-hidden">
                {item.options.map((option) => {
  const isSelected = userSelections[item.id] === option;      // هل هذا الزر مختار؟
  const isCorrect = showAnswers && option === item.correct;   // هل هذا هو الإجابة الصحيحة؟

  return (
    <button
      key={option}
      onClick={() => handleSelect(item.id, option)}
      className={`px-4 py-2 rounded-full border-2 transition-all
        ${isSelected ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-800 border-gray-300 hover:border-blue-400"}
        ${isCorrect ? "bg-green-500 text-white border-green-500" : ""}
      `}
    >
      {option}
    </button>
  );
})}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <Button handleShowAnswer={handleShowAnswer} handleStartAgain={handleStartAgain} checkAnswers={checkAnswers} />
      </div>

    </div>
  );
};

export default WB_Unit4_Page21_Q2;
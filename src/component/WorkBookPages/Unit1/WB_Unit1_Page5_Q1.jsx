import { useState } from "react";
import img from "../../../assets/imgs/test6.png";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../button";

const WB_Unit1_Page5_Q1 = () => {
  const [userSelections, setUserSelections] = useState({ 1: null, 2: null, 3: null });
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);

  const data = [
    { id: 1, img: img, options: ["brother.", "sister."], correct: "sister." },
    { id: 2, img: img, options: ["uncle.", "aunt."], correct: "uncle." },
    { id: 3, img: img, options: ["mother.", "aunt."], correct: "aunt." },
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

  // Validation
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
        <div className="ex-A">F</div>
        <h1 className="header-title-page8">Look, read, and circle.</h1>
      </div>

      <div className="grid grid-cols-3 gap-12">
        {data.map((item) => (
          <div key={item.id} className="flex flex-col items-center gap-6">
            <div className="flex items-start gap-4 w-full">
              <span className="font-bold text-blue-900 text-2xl">{item.id}</span>
              <img src={item.img} alt="" className="max-w-32 max-h-32 object-contain rounded-xl" />
            </div>
            
            <div className="flex items-center gap-2 text-xl text-gray-800 flex-wrap justify-center">
              <span>This is Stella's</span>
              <div className="flex flex-col border-2 border-gray-400 rounded-2xl overflow-hidden">
                {item.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelect(item.id, option)}
                    className={`px-4 py-1 transition-all ${
                      userSelections[item.id] === option 
                        ? 'bg-blue-500 text-white' 
                        : 'hover:bg-gray-100'
                    } ${showAnswers && option === item.correct ? 'bg-green-500 text-white' : ''}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 flex justify-center">
        <Button handleShowAnswer={handleShowAnswer} handleStartAgain={handleStartAgain} checkAnswers={checkAnswers} />
      </div>

    </div>
  );
};

export default WB_Unit1_Page5_Q1;
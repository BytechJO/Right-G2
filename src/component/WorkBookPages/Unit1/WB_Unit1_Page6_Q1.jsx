import { useState } from "react";
import img from "../../../assets/imgs/test6.png";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../button";

const WB_Unit1_Page6_Q1 = () => {
  const [userAnswers, setUserAnswers] = useState({
    1: "Stella",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
  });
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);

  const correctAnswers = {
    1: "Stella",
    2: "he is",
    3: "is",
    4: "uncle",
    5: "she is stella's",
    6: "is stella's",
    7: "she is",
    8: "sister",
    9: "stella's mother",
  };

  const handleInputChange = (id, value) => {
    setUserAnswers({ ...userAnswers, [id]: value });
  };

  const checkAnswers = () => {
    let currentScore = 0;
    const totalQuestions = Object.keys(correctAnswers).length;

    Object.keys(correctAnswers).forEach((id) => {
      const userAnswer = userAnswers[id]?.toLowerCase().trim();
      const correctAnswer = correctAnswers[id].toLowerCase();

      if (userAnswer && userAnswer === correctAnswer) {
        currentScore += 1;
      }
    });

    setScore(currentScore);

    // Validation Alerts
    if (currentScore === totalQuestions) {
      ValidationAlert.success(`Perfect! ${currentScore} / ${totalQuestions}`);
    }
    else if (currentScore > 1) {
      ValidationAlert.error(`Good job! You got ${currentScore} / ${totalQuestions}`);
    }
    else {
      ValidationAlert.warning("No correct answers. Try again!");
    }
  };

  const handleShowAnswer = () => {
    const answers = {
      1: "Stella",
      2: "he is",
      3: "is",
      4: "uncle",
      5: "she is stella's",
      6: "is stella's",
      7: "she is",
      8: "sister",
      9: "stella's mother",
    };
    setUserAnswers(answers);
  };

  const handleStartAgain = () => {
    setUserAnswers({ 1: "Stella", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "", 9: "" });
    setShowResults(false);
    setShowAnswers(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="ex-A">H</div>
        <h1 className="header-title-page8">Look, read, and complete.</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Family Image with Numbers */}
        <div className="relative flex-1 border-4 border-gray-200 rounded-2xl overflow-hidden">
          <img src={img} className="max-w-full max-h-87 grayscale" />
          {/* Simplified representation of numbers on image */}
          <div className="absolute inset-0 pointer-events-none">
          </div>
        </div>

        {/* Sentences */}
        <div className="flex-1 bg-white border-2 border-gray-300 rounded-2xl p-6 space-y-4 text-xl">
          <div className="flex items-center gap-2">
            <span>1. She is</span>
            <input
              type="text"
              value={userAnswers[1]}
              readOnly
              className="border-b-2 border-gray-400 outline-none w-40 text-center text-red-600 font-bold"
            />
            <span>.</span>
          </div>
          <div className="flex items-center gap-2">
            <span>2.</span>
            <input
              type="text"
              value={userAnswers[2]}
              onChange={(e) => handleInputChange(2, e.target.value)}
              className="border-b-2 border-gray-400 outline-none w-24 text-center focus:border-blue-500"
              placeholder="......"
            />
            <span>is John.</span>
          </div>
          <div className="flex items-center gap-2">
            <span>3. He</span>
            <input
              type="text"
              value={userAnswers[3]}
              onChange={(e) => handleInputChange(3, e.target.value)}
              className="border-b-2 border-gray-400 outline-none w-20 text-center focus:border-blue-500"
              placeholder="......"
            />
            <span>Stella's</span>
            <input
              type="text"
              value={userAnswers[4]}
              onChange={(e) => handleInputChange(3, e.target.value)}
              className="border-b-2 border-gray-400 outline-none w-20 text-center focus:border-blue-500"
              placeholder="......"
            />
          </div>
          <div className="flex items-center gap-2">
            <span>4.</span>
            <input
              type="text"
              value={userAnswers[5]}
              onChange={(e) => handleInputChange(4, e.target.value)}
              className="border-b-2 border-gray-400 outline-none w-48 text-center focus:border-blue-500"
              placeholder="......"
            />
            <span>aunt.</span>
          </div>
          <div className="flex items-center gap-2">
            <span>5. He</span>
            <input
              type="text"
              value={userAnswers[6]}
              onChange={(e) => handleInputChange(5, e.target.value)}
              className="border-b-2 border-gray-400 outline-none w-40 text-center focus:border-blue-500"
              placeholder="......"
            />
            <span>dad.</span>
          </div>
          <div className="flex items-center gap-2">
            <span>6.</span>
            <input
              type="text"
              value={userAnswers[7]}
              onChange={(e) => handleInputChange(6, e.target.value)}
              className="border-b-2 border-gray-400 outline-none w-24 text-center focus:border-blue-500"
              placeholder="......"
            />
            <span>Stella's.</span>
            <input
              type="text"
              value={userAnswers[8]}
              onChange={(e) => handleInputChange(3, e.target.value)}
              className="border-b-2 border-gray-400 outline-none w-20 text-center focus:border-blue-500"
              placeholder="......"
            />
          </div>
          <div className="flex items-center gap-2">
            <span>7. She is</span>
            <input
              type="text"
              value={userAnswers[9]}
              onChange={(e) => handleInputChange(7, e.target.value)}
              className="border-b-2 border-gray-400 outline-none w-48 text-center focus:border-blue-500"
              placeholder="......"
            />
            <span>.</span>
          </div>
        </div>
      </div>

        <Button handleShowAnswer={handleShowAnswer} handleStartAgain={handleStartAgain} checkAnswers={checkAnswers} />
      
    </div>
  );
};

export default WB_Unit1_Page6_Q1;
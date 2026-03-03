import { useState } from "react";
import img from "../../../assets/imgs/test6.png";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../button";

const WB_Unit1_Page4_Q2 = () => {
  const [userAnswers, setUserAnswers] = useState({ 1: "", 2: "", 3: "", 4: "", 5: "" });
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);

  const correctAnswers = {
    1: "mother",
    2: "father",
    3: "sister",
    4: "brother",
    5: "play",
  };

  const handleInputChange = (id, value) => {
    setUserAnswers({ ...userAnswers, [id]: value });
  };

  const checkAnswers = () => {
  let currentScore = 0;

  const totalQuestions = Object.keys(correctAnswers).length;

  Object.keys(correctAnswers).forEach((id) => {
    const userAnswer = userAnswers[id]?.toLowerCase().trim();
    const correctAnswer = correctAnswers[id]?.toLowerCase().trim();

    if (userAnswer && userAnswer === correctAnswer) {
      currentScore += 1;
    }
  });

  setScore(currentScore);
  setShowResults(true);

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
    setUserAnswers(correctAnswers);
    setShowAnswers(true);
  };

  const handleStartAgain = () => {
    setUserAnswers({ 1: "", 2: "", 3: "", 4: "", 5: "" });
    setShowResults(false);
    setShowAnswers(false);
  };

  return (
    <div className="p-8 bg-white rounded-3xl max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <div className="ex-A">D</div>
        <h1 className="header-title-page8">Look and complete. Read.</h1>
      </div>


      <div className="lg:ml-10 space-y-10 text-2xl text-gray-800 leading-relaxed">
        {/* Row 1 */}
        <div className="flex items-center gap-4 flex-wrap">
          <span>She's my</span>
          <input
            type="text"
            value={userAnswers[1]}
            onChange={(e) => handleInputChange(1, e.target.value)}
            className="border-b-2 border-gray-400 outline-none w-32 text-center focus:border-blue-500"
            placeholder="......"
          />
          <img src={img} alt="" className="max-w-12 max-h-12 rounded-full" />
          <span>. He's my</span>
          <input
            type="text"
            value={userAnswers[2]}
            onChange={(e) => handleInputChange(2, e.target.value)}
            className="border-b-2 border-gray-400 outline-none w-32 text-center focus:border-blue-500"
            placeholder="......"
          />
          <img src={img} alt="" className="max-w-12 max-h-12 rounded-full" />
          <span>.</span>
        </div>

        {/* Row 2 */}
        <div>I want no other.</div>

        {/* Row 3 */}
        <div className="flex items-center gap-4 flex-wrap">
          <span>This is my</span>
          <input
            type="text"
            value={userAnswers[3]}
            onChange={(e) => handleInputChange(3, e.target.value)}
            className="border-b-2 border-gray-400 outline-none w-32 text-center focus:border-blue-500"
            placeholder="......"
          />
          <img src={img} alt="" className="max-w-12 max-h-12 rounded-full" />
          <span>and my</span>
          <input
            type="text"
            value={userAnswers[4]}
            onChange={(e) => handleInputChange(4, e.target.value)}
            className="border-b-2 border-gray-400 outline-none w-32 text-center focus:border-blue-500"
            placeholder="......"
          />
          <img src={img} alt="" className="max-w-12 max-h-12 rounded-full" />
        </div>

        {/* Row 4 */}
        <div className="flex items-center gap-4 flex-wrap">
          <span>who like to</span>
          <input
            type="text"
            value={userAnswers[5]}
            onChange={(e) => handleInputChange(5, e.target.value)}
            className="border-b-2 border-gray-400 outline-none w-32 text-center focus:border-blue-500"
            placeholder="......"
          />
          <img src={img} alt="" className="max-w-12 max-h-12 rounded-full" />
          <span>.</span>
        </div>

        {/* Row 5 */}
        <div>We are a happy family together.</div>
      </div>

      <Button handleShowAnswer={handleShowAnswer} handleStartAgain={handleStartAgain} checkAnswers={checkAnswers} />
    </div>
  );
};

export default WB_Unit1_Page4_Q2;
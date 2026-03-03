import { useState } from "react";
import img from "../../../assets/imgs/test6.png";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../button";

const WB_Unit1_Page5_Q2 = () => {
  const [userAnswers, setUserAnswers] = useState({
    1: { q: "", a: "" },
    2: { q: "", a: "" },
    3: { q: "", a: "" },
    4: { q: "", a: "" },
  });
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);

  const correctAnswers = {
    1: { q: "she", a: "She's" },
    2: { q: "she", a: "She's" },
    3: { q: "he", a: "He's" },
    4: { q: "he", a: "He's" },
  };

  const handleInputChange = (id, field, value) => {
    setUserAnswers({
      ...userAnswers,
      [id]: { ...userAnswers[id], [field]: value },
    });
  };

  const checkAnswers = () => {
  let currentScore = 0;

  const totalQuestions = Object.keys(correctAnswers).length * 2;

  Object.keys(correctAnswers).forEach((id) => {
    const userQ = userAnswers[id]?.q?.toLowerCase().trim();
    const correctQ = correctAnswers[id]?.q?.toLowerCase().trim();

    const userA = userAnswers[id]?.a?.toLowerCase().trim();
    const correctA = correctAnswers[id]?.a?.toLowerCase().trim();

    if (userQ && userQ === correctQ) {
      currentScore += 1;
    }

    if (userA && userA === correctA) {
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
    setUserAnswers(correctAnswers);
    setShowAnswers(true);
  };

  const handleStartAgain = () => {
    setUserAnswers({
      1: { q: "", a: "" },
      2: { q: "", a: "" },
      3: { q: "", a: "" },
      4: { q: "", a: "" },
    });
    setShowResults(false);
    setShowAnswers(false);
  };

  const data = [
    { id: 1, img: img, name: "Stella." },
    { id: 2, img: img, name: "Sarah." },
    { id: 3, img: img, name: "John." },
    { id: 4, img: img, name: "Jack." },
  ];

  return (
    <div className="p-8 bg-white rounded-3xl max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <div className="ex-A">G</div>
        <h1 className="header-title-page8">Look, read, and complete.</h1>
      </div>

      <div className="grid grid-cols-2 gap-x-20 gap-y-10 lg:ml-10">
        {data.map((item) => (
          <div key={item.id} className="flex flex-col items-center gap-6">
            <div className="flex items-start gap-4 w-full">
              <span className="font-bold text-blue-900 text-2xl">{item.id}</span>
              <img src={item.img} alt="" className="max-w-32 max-h-48 object-contain rounded-xl" />
            </div>
            
            <div className="flex flex-col gap-4 w-full text-xl text-gray-800">
              <div className="flex items-center gap-2">
                <span>Who's</span>
                <input
                  type="text"
                  value={userAnswers[item.id].q}
                  onChange={(e) => handleInputChange(item.id, "q", e.target.value)}
                  className="border-b-2 border-gray-400 outline-none w-24 text-center focus:border-blue-500"
                  placeholder="......"
                />
                <span>?</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={userAnswers[item.id].a}
                  onChange={(e) => handleInputChange(item.id, "a", e.target.value)}
                  className="border-b-2 border-gray-400 outline-none w-24 text-center focus:border-blue-500"
                  placeholder="......"
                />
                <span>{item.name}</span>
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

export default WB_Unit1_Page5_Q2;
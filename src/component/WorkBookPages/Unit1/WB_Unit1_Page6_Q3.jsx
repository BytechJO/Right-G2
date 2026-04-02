import { useState } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 6/Ex J 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 6/Ex J 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 6/Ex J 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 6/Ex J 4.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../button";

const WB_Unit1_Page6_Q3 = () => {
  const [userAnswers, setUserAnswers] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);

  const data = [
    { id: 1, img: img1, text: "I'm Stella's uncle.", correct: "X" },
    { id: 2, img: img2, text: "I'm Stella's brother.", correct: "X" },
    { id: 3, img: img3, text: "I'm Stella's aunt.", correct: "✓" },
    { id: 4, img: img4, text: "I'm Stella's sister.", correct: "✓" },
  ];

  const handleSelect = (id, value) => {
    if (!showAnswers) {
      setUserAnswers({ ...userAnswers, [id]: value });
    }
  };

  const checkAnswers = () => {
    let currentScore = 0;
    const totalQuestions = data.length;

    data.forEach((item) => {
      const userAnswer = userAnswers[item.id]?.trim().toLowerCase();
      const correctAnswer = item.correct.toLowerCase();

      if (userAnswer && userAnswer === correctAnswer) {
        currentScore += 1;
      }
    });

    setScore(currentScore);

    // Validation Alerts
    if (currentScore === totalQuestions) {
      ValidationAlert.success(`Score: ${currentScore} / ${totalQuestions}`);
    } else if (currentScore > 0) {
      ValidationAlert.error(`Score: ${currentScore} / ${totalQuestions}`);
    } else {
      ValidationAlert.warning("No correct answers. Try again!");
    }
  };

  const handleShowAnswer = () => {
    const answers = {};
    data.forEach((item) => (answers[item.id] = item.correct));
    setUserAnswers(answers);
    setShowAnswers(true);
  };

  const handleStartAgain = () => {
    setUserAnswers({ 1: null, 2: null, 3: null, 4: null });
    setShowResults(false);
    setShowAnswers(false);
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
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">J</span>Look, read, and write <span style={{color:"navy"}}>✓</span> or <span style={{color:"navy"}}>✗</span>.
        </h1>
     

      <div className="grid grid-cols-2 gap-x-20 gap-y-12">
        {data.map((item) => (
          <div key={item.id} className="flex items-center gap-8">
            
            <div className="relative rounded-2xl p-2 w-32 h-32 flex items-center justify-center overflow-hidden">
             <span className="font-bold text-blue-900 text-2xl">{item.id}</span> <img
                src={item.img}
                alt=""
                className="max-w-full max-h-full object-contain"
              />
              <div className="absolute bottom-0 right-0 flex gap-1 p-1 bg-white/80 rounded-tl-xl">
                <button
                  onClick={() => handleSelect(item.id, "✓")}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 transition-all ${
                    userAnswers[item.id] === "✓"
                      ? "bg-gray-300 text-white border-green-600"
                      : "border-gray-300 hover:border-gray-400"
                  } ${showAnswers && item.correct === "✓" ? "bg-gray-500 text-white" : ""}`}
                >
                  ✓
                </button>
                <button
                  onClick={() => handleSelect(item.id, "X")}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 transition-all ${
                    userAnswers[item.id] === "X"
                      ? "bg-gray-300 text-white border-grat-600"
                      : "border-gray-300 hover:border-gray-400"
                  } ${showAnswers && item.correct === "X" ? "bg-gray-500 text-white" : ""}`}
                >
                  X
                </button>
              </div>
            </div>
            <span className="text-lg text-gray-800 font-medium">
              {item.text}
            </span>
          </div>
        ))}
      </div>

      <Button
        handleShowAnswer={handleShowAnswer}
        handleStartAgain={handleStartAgain}
        checkAnswers={checkAnswers}
      />
    </div>
     </div>
  );
};

export default WB_Unit1_Page6_Q3;

import { useState } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 6/Ex J 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 6/Ex J 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 6/Ex J 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 6/Ex J 4.svg";
import trueIcon from "../../../assets/imgs/true.svg"
import falseIcon from "../../../assets/imgs/false.svg"
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";

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
  const [checked, setChecked] = useState(false);

  const data = [
    { id: 1, img: img1, text: "I'm Stella's uncle.", correct: "X" },
    { id: 2, img: img2, text: "I'm Stella's brother.", correct: "X" },
    { id: 3, img: img3, text: "I'm Stella's aunt.", correct: "✓" },
    { id: 4, img: img4, text: "I'm Stella's sister.", correct: "✓" },
  ];

  const handleSelect = (id, value) => {
    if (!showAnswers && !checked) {
      setUserAnswers({ ...userAnswers, [id]: value });
    }
  };

  const isWrongSelection = (item, value) => {
    return checked && userAnswers[item.id] === value && value !== item.correct;
  };

  const checkAnswers = () => {
  if (showAnswers || checked) return;

  // ⭐ تحقق إذا في إجابة فاضية
  const hasEmpty = data.some((item) => !userAnswers[item.id]);

  if (hasEmpty) {
    ValidationAlert.info(
      "Oops!",
      "Please answer all questions first."
    );
    return;
  }

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
    data.forEach((item) => {
      answers[item.id] = item.correct;
    });
    setUserAnswers(answers);
    setShowAnswers(true);
    setChecked(false);
  };

  const handleStartAgain = () => {
    setUserAnswers({ 1: null, 2: null, 3: null, 4: null });
    setShowResults(false);
    setShowAnswers(false);
    setChecked(false);
    setScore(0);
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
       style={{gap:"45px"}}
      >
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">J</span>Look, read, and write{" "}
          <span style={{ color: "navy" }}>✓</span> or{" "}
          <span style={{ color: "navy" }}>✗</span>.
        </h1>

        <div className="grid grid-cols-2 gap-x-20 gap-y-25">
          {data.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <div className="relative rounded-2xl p-2 w-full h-full flex items-start justify-center gap-2">
                <span className="font-bold text-blue-900 text-2xl">
                  {item.id}
                </span>
                <img
                  src={item.img}
                  alt=""
                  className="max-w-full max-h-full object-contain"
                  style={{ height: "120px", width: "auto" }}
                />

                <div className="absolute -bottom-11 flex gap-5 p-1 bg-white/80 rounded-tl-xl">
                  <div className="relative">
                    <button
                      onClick={() => handleSelect(item.id, "✓")}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 transition-all text-lg ${
                        userAnswers[item.id] === "✓"
                          ? "text-black border-3 border-blue-600"
                          : "border-gray-300 hover:border-gray-400"
                      } ${showAnswers && item.correct === "✓" ? "bg-gray-300 text-black" : ""}`}
                    >
                                           <img src={trueIcon} style={{height:"25px"}} />

                    </button>

                    {isWrongSelection(item, "✓") && (
                      <div
                        style={{
                          position: "absolute",
                          top: "-8px",
                          right: "-8px",
                          width: "22px",
                          height: "22px",
                          borderRadius: "50%",
                          backgroundColor: "red",
                          color: "white",
                          border: "2px solid white",
                          boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: "bold",
                          lineHeight: 1,
                          zIndex: 10,
                        }}
                      >
                        ✕
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => handleSelect(item.id, "X")}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 transition-all text-lg ${
                        userAnswers[item.id] === "X"
                          ? "text-black border-3 border-blue-600"
                          : "border-gray-300 hover:border-gray-400"
                      } ${showAnswers && item.correct === "X" ? "bg-gray-300 text-black" : ""}`}
                    >
                      <img src={falseIcon} style={{height:"25px"}} />
                    </button>

                    {isWrongSelection(item, "X") && (
                      <div
                        style={{
                          position: "absolute",
                          top: "-8px",
                          right: "-8px",
                          width: "22px",
                          height: "22px",
                          borderRadius: "50%",
                          backgroundColor: "red",
                          color: "white",
                          border: "2px solid white",
                          boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: "bold",
                          lineHeight: 1,
                          zIndex: 10,
                        }}
                      >
                        ✕
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <span className="text-lg text-gray-800 font-medium w-full text-nowrap">
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
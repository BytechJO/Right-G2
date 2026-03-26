import { useState } from "react";
import img from "../../../assets/imgs/test6.png";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../button";
import "../Unit2/WB_Unit2_Page9_Q1.css";
import sound from "../../../assets/audio/WorkBook/titel G2/Unit 10.mp3";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
const WB_Unit9_Page56_Q2 = () => {
  const [userSelections, setUserSelections] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState({});
  const data = [
    { id: 1, img: img, options: ["long a", "short a"], correct: "short a" },
    { id: 2, img: img, options: ["long a", "short a"], correct: "long a" },
    { id: 3, img: img, options: ["long a", "short a"], correct: "long a" },
    { id: 4, img: img, options: ["long a", "short a"], correct: "long a" },
  ];

  const handleSelect = (id, option) => {
    if (!showAnswers) {
      setUserSelections({ ...userSelections, [id]: option });
    }
  };

  const checkAnswers = () => {
    const allAnswered = Object.values(userSelections).every(
      (val) => val !== null,
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
    setUserSelections({ 1: null, 2: null, 3: null, 4: null });
    setShowResults(false);
    setShowAnswers(false);
    setWrongAnswers({});
  };
  const captions = [
    {
      start: 0,
      end: 4.23,
      text: "Page 8. Right Activities. Exercise A, number 1. ",
    },
    {
      start: 4.25,
      end: 8.28,
      text: "Listen and write the missing letters. Number the pictures.  ",
    },
    { start: 8.3, end: 11.05, text: "1-tiger." },
    { start: 11.07, end: 13.12, text: "2-taxi." },
    { start: 13.14, end: 15.14, text: "3-duck." },
    { start: 15.16, end: 17.13, text: "4-deer." },
  ];

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "15px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">B</span>Does it have a{" "}
          <span className="text-blue-900">long a</span> or{" "}
          <span className="text-blue-900">short a</span>? Listen, look, and
          circle.
        </h1>
        <QuestionAudioPlayer src={sound} captions={captions} stopAtSecond={9} />
        <div className="grid grid-cols-2 gap-12">
          {data.map((item) => (
            <div key={item.id} className="flex flex-col items-center gap-6">
              <div
                className="flex items-center gap-3 text-xl text-gray-800 flex-wrap justify-center"
                style={{ width: "100%" }}
              >
                <span className="font-bold text-blue-900 text-2xl">
                  {item.id}
                </span>
                <img
                  src={item.img}
                  alt=""
                  className="max-w-32 max-h-32 object-contain rounded-xl"
                />
                <div
                  className="flex flex-col rounded-2xl"
                  style={{ width: "40%" }}
                >
                  {item.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleSelect(item.id, option)}
                      className={`relative px-4 py-1 transition-all ${
                        userSelections[item.id] === option
                          ? "border-blue-500 bg-blue-100"
                          : "border-gray-300 hover:border-blue-400"
                      } ${
                        showAnswers && option === item.correct
                          ? "bg-green-500 text-white"
                          : ""
                      }`}
                    >
                      {option}{" "}
                      {wrongAnswers[item.id] &&
                        userSelections[item.id] === option && (
                          <span className="absolute -top-2 right-0 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold border-2 border-white shadow">
                            ✕
                          </span>
                        )}
                    </button>
                  ))}
                </div>
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

export default WB_Unit9_Page56_Q2;

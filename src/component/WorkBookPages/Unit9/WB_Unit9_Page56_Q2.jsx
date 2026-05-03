import { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import "../Unit2/WB_Unit2_Page9_Q1.css";
import sound from "../../../assets/audio/WorkBook/p56q2.mp3";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 56/Ex B 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 56/Ex B 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 56/Ex B 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 56/Ex B 4.svg";
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
    { id: 1, img: img1, options: ["long a", "short a"], correct: "short a" },
    { id: 2, img: img2, options: ["long a", "short a"], correct: "long a" },
    { id: 3, img: img3, options: ["long a", "short a"], correct: "long a" },
    { id: 4, img: img4, options: ["long a", "short a"], correct: "long a" },
  ];

  const handleSelect = (id, option) => {
    if (showAnswers || showResults) return;

    if (!showAnswers) {
      setUserSelections({ ...userSelections, [id]: option });
    }
  };

  const checkAnswers = () => {
    if (showAnswers || showResults) return;
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
    setShowResults(true);
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
    { start: 0.42, end: 3.32, text: "Page 56, phonics exercise B." },

    { start: 4.72, end: 7.86, text: "Does it have a long A or short A?" },

    { start: 9.8, end: 11.58, text: "Listen, look, and circle." },

    {
      start: 12.64,
      end: 14.2,
      text: "1.cap.",
    },
    {
      start: 15.14,
      end: 17.26,
      text: "2.train.",
    },
    {
      start: 17.86,
      end: 19.81,
      text: "3.cake.",
    },
    {
      start: 20,
      end: 22.16,
      text: "4.rain.",
    },
  ];

  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"25px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">B</span>Does it have a{" "}
          <span className="text-blue-900">long a</span> or{" "}
          <span className="text-blue-900">short a</span>? Listen, look, and
          circle.
        </h1>
        <QuestionAudioPlayer
          src={sound}
          captions={captions}
          stopAtSecond={11.6}
        />
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
                  className="flex flex-col gap-3 rounded-2xl"
                  style={{ width: "40%" }}
                >
                  {item.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleSelect(item.id, option)}
                      className={`relative px-4 py-1 transition-all border-2 rounded-lg ${
                        userSelections[item.id] === option
                          ? "border-blue-900"
                          : "border-gray-300 hover:border-blue-900"
                      } ${wrongAnswers[item.id] &&
                        userSelections[item.id] === option &&"border-red-500 bg-white"}`}
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

export default WB_Unit9_Page56_Q2;

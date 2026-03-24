import { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../button";
import placeholderImg from "../../../assets/imgs/test6.png";

const questions = [
  {
    id: 1,
    question: "Do you want a chocolate bar?",
    correct: "yes",
  },
  {
    id: 2,
    question: "Do you want a yo-yo?",
    correct: "yes",
  },
  {
    id: 3,
    question: "Do you want a ball?",
    correct: "no",
  },
];

const WB_Unit4_Page24_Q1 = () => {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleChange = (id, value) => {
    setAnswers({ ...answers, [id]: value });
    setShowResults(false);
  };
  const isWrong = (q) => {
    if (!showResults) return false;
    if (!answers[q.id]) return false;

    return answers[q.id] !== q.correct;
  };
  const checkAnswers = () => {
    let score = 0;

    questions.forEach((q) => {
      if (answers[q.id] === q.correct) {
        score++;
      }
    });

    setShowResults(true);

    if (score === questions.length) {
      ValidationAlert.success(`Score: ${score} / ${questions.length}`);
    } else if (score > 0) {
      ValidationAlert.error(`Score: ${score} / ${questions.length}`);
    } else {
      ValidationAlert.warning("Try again.");
    }
  };

  const handleShowAnswer = () => {
    const correct = {};
    questions.forEach((q) => {
      correct[q.id] = q.correct;
    });
    setAnswers(correct);
    setShowResults(true);
  };

  const handleStartAgain = () => {
    setAnswers({});
    setShowResults(false);
  };

  const getColor = (q) => {
    if (!showResults) return "";
    return answers[q.id] === q.correct ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "20px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">G</span>Look, read, and write{" "}
          <span style={{ color: "navy" }}>✓</span>.
        </h1>

        <div className="space-y-10">
          {questions.map((q) => (
            <div
              key={q.id}
              className="flex flex-col items-center text-center gap-4"
            >
              <p className={`mr-50 text-lg font-medium`}>
                {q.id}. {q.question}
              </p>

              <div className="grid grid-cols-2 items-center gap-45">
                <img
                  src={placeholderImg}
                  className="max-w-28 max-h-24 object-contain"
                  alt="question"
                />
                <div>
                  <div className="relative">
                    <label className="flex items-center gap-2 cursor-pointer">
                      {isWrong(q) && answers[q.id] === "yes" && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow border-2 border-white">
                          ✕
                        </div>
                      )}
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        checked={answers[q.id] === "yes"}
                        onChange={() => handleChange(q.id, "yes")}
                        className="hidden"
                      />
                      <span
                        className={`w-10 h-10 border-2 border-gray-400 rounded-sm flex items-center justify-center text-lg font-bold ${
                          answers[q.id] === "yes"
                            ? "text-red"
                            : "text-transparent"
                        }`}
                      >
                        ✓
                      </span>
                      Yes, I do.
                    </label>
                  </div>
                  <div className="relative">
                    <label className="flex items-center gap-2 cursor-pointer">
                      {isWrong(q) && answers[q.id] === "no" && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow border-2 border-white">
                          ✕
                        </div>
                      )}
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        checked={answers[q.id] === "no"}
                        onChange={() => handleChange(q.id, "no")}
                        className="hidden"
                      />
                      <span
                        className={`w-10 h-10 border-2 border-gray-400 rounded-sm flex items-center justify-center text-lg font-bold ${
                          answers[q.id] === "no"
                            ? "text-red"
                            : "text-transparent"
                        }`}
                      >
                        ✓
                      </span>
                      No, I don’t.
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          checkAnswers={checkAnswers}
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={handleStartAgain}
        />
      </div>
    </div>
  );
};

export default WB_Unit4_Page24_Q1;

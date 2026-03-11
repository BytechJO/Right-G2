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
    <div className="p-8 rounded-3xl max-w-3xl mx-auto">

      <div className="flex items-center gap-4 mb-8">
        <div className="ex-A">G</div>
        <h1 className="header-title-page8">Look, read, and write ✓.</h1>
      </div>

      <div className="space-y-10">

        {questions.map((q) => (
          <div key={q.id} className="flex flex-col items-center text-center gap-4">

            {/* السؤال */}
            <p className={`mr-50 text-lg font-medium ${getColor(q)}`}>
              {q.id}. {q.question}
            </p>

            {/* الصورة + الإجابة */}
            <div className="grid grid-cols-2 items-center gap-45">



              <img
                src={placeholderImg}
                className="max-w-28 max-h-24 object-contain"
                alt="question"
              />
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`q${q.id}`}
                    checked={answers[q.id] === "yes"}
                    onChange={() => handleChange(q.id, "yes")}
                    className="cursor-pointer appearance-none w-5 h-5 border-2 border-gray-400 rounded-sm
              checked:bg-blue-500 checked:border-blue-500"
                  />
                  Yes, I do.
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`q${q.id}`}
                    checked={answers[q.id] === "no"}
                    onChange={() => handleChange(q.id, "no")}
                    className="cursor-pointer appearance-none w-5 h-5 border-2 border-gray-400 rounded-sm
              checked:bg-blue-500 checked:border-blue-500"
                  />
                  No, I don’t.
                </label>
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
  );
};

export default WB_Unit4_Page24_Q1;
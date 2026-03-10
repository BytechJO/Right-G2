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
    <div className="p-8 bg-white rounded-3xl max-w-3xl mx-auto">

      <div className="flex items-center gap-4 mb-8">
        <div className="ex-A">G</div>
        <h1 className="header-title-page8">Look, read, and write ✓.</h1>
      </div>

      <div className="space-y-6">

        {questions.map((q) => (
          <div key={q.id} className="flex items-center justify-between">
            
            <p className={`text-lg ${getColor(q)}`}>
              {q.id}. {q.question}
              <img src={placeholderImg} className="max-w-16 max-h-16"/>
            </p>
            
            <div className="flex gap-6">
                
              <label className="flex gap-2">
                <input
                  type="radio"
                  name={`q${q.id}`}
                  checked={answers[q.id] === "yes"}
                  onChange={() => handleChange(q.id, "yes")}
                />
                Yes, I do.
              </label>

              <label className="flex gap-2">
                <input
                  type="radio"
                  name={`q${q.id}`}
                  checked={answers[q.id] === "no"}
                  onChange={() => handleChange(q.id, "no")}
                />
                No, I don’t.
              </label>

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
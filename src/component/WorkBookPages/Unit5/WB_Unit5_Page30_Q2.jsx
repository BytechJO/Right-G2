import { useState } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";

export default function WB_Unit5_Page30_Q2() {
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      id: 1,
      text: "Megan’s dad likes ...",
      options: ["candy", "pasta", "bread"],
    },
    {
      id: 2,
      text: "Megan doesn’t like ...",
      options: ["vegetables", "bread", "fish"],
    },
    {
      id: 3,
      text: "Megan’s mom likes ...",
      options: ["meat", "soda", "vegetables"],
    },
    {
      id: 4,
      text: "Megan’s brother doesn’t like ...",
      options: ["candy", "nuts", "burgers"],
    },
  ];

  const handleSelect = (qId, option) => {
    if (showResults || showAnswers) return;

    setAnswers((prev) => {
      const current = prev[qId] || [];

      // إذا الخيار موجود → شيله (toggle)
      if (current.includes(option)) {
        return {
          ...prev,
          [qId]: current.filter((o) => o !== option),
        };
      }

      // ❌ إذا وصل 2 خيارات، لا تسمح بإضافة ثالث
      if (current.length >= 2) {
        return prev;
      }

      // ✅ أضف الخيار
      return {
        ...prev,
        [qId]: [...current, option],
      };
    });
  };
  const correctAnswers = {
    1: ["pasta", "bread"],
    2: ["bread", "fish"],
    3: ["meat", "vegetables"],
    4: ["candy", "burgers"],
  };

  const [showAnswers, setShowAnswers] = useState(false);
  const [score, setScore] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const checkAnswers = () => {
    if (showAnswers || showResults) return;
    const totalQuestions = questions.length;
    const answeredQuestions = Object.keys(answers).length;

    if (answeredQuestions < totalQuestions) {
      ValidationAlert.info(
        "Please complete all sentences before checking your answers.",
      );
      return;
    }

    let correct = 0;

    questions.forEach((q) => {
      const userAnswer = answers[q.id] || [];
      const correctAnswer = correctAnswers[q.id];

      const isCorrect =
        userAnswer.length === correctAnswer.length &&
        correctAnswer.every((ans) => userAnswer.includes(ans));

      if (isCorrect) correct++;
    });

    setShowResults(true); // ✅ مهم

    if (correct === totalQuestions) {
      ValidationAlert.success(`Score: ${correct}/${totalQuestions}`);
    } else if (correct === 0) {
      ValidationAlert.error(`Score: ${correct}/${totalQuestions}`);
    } else {
      ValidationAlert.warning(`Score: ${correct}/${totalQuestions}`);
    }

    setScore(correct);
  };
  const isWrong = (qId) => {
    if (!showResults) return false;

    const userAnswer = answers[qId] || [];
    const correctAnswer = correctAnswers[qId];

    if (userAnswer.length === 0) return false;

    return !(
      userAnswer.length === correctAnswer.length &&
      correctAnswer.every((ans) => userAnswer.includes(ans))
    );
  };
  const handleShowAnswer = () => {
    setAnswers(correctAnswers);
    setShowAnswers(true);
  };

  const handleStartAgain = () => {
    setAnswers({});
    setScore(null);
    setShowResults(false);
    setShowAnswers(false);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{gap:"30px" }}>
        <h1 className="WB-header-title-page8">
          {" "}
          <span className="WB-ex-A">H</span>Look, read, and circle
        </h1>

        <div className="flex flex-col gap-6">
          <p className="text-gray-700 leading-relaxed text-[18px]">
            Megan likes fruit, vegetables, and milk. She doesn’t like bread or
            fish. Her mom likes meat and vegetables. She doesn’t like candy,
            fruit, or soda. Her dad likes pasta, chicken, and bread. He doesn’t
            like coffee, tea, or milk. Megan’s brother, Jimmy, likes vegetables,
            nuts, and soup. He doesn’t like candy, burgers, or fruit.
          </p>

          <div className="space-y-4">
            {questions.map((q) => (
              <div key={q.id} className="relative p-3 rounded-lg">
                <div className="flex">
                  <span className="text-[18px] mb-2 w-80">
                    {" "}
                    {q.id}. {q.text}
                  </span>
                  <div className="flex gap-10">
                    {q.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSelect(q.id, opt)}
                        className={`w-30 h-10 px-3 py-1 border rounded-full transition
                    ${
                      answers[q.id]?.includes(opt)
                        ? "border-2 border-blue-900"
                        : "border-gray-500 hover:border-blue-900 hover:border-2"
                    }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                {isWrong(q.id) && (
                  <div className="absolute top-2 left-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow border-2 border-white">
                    ✕
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <Button
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={handleStartAgain}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
}

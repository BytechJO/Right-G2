// ExerciseI.jsx  —  Look, Read and Circle

import { useState } from "react";
import Button from "../button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img from "../../../assets/imgs/test6.png";

const questions = [
  { id: 1, src: img, subject: "She", food: "cheese", correct: "likes" },
  { id: 2, src: img, subject: "He", food: "cake", correct: "doesn't like" },
  { id: 3, src: img, subject: "She", food: "yogurt", correct: "doesn't like" },
  { id: 4, src: img, subject: "She", food: "pizza", correct: "likes" },
];

const correctAnswers = {
  1: "likes",
  2: "doesn't like",
  3: "doesn't like",
  4: "likes",
};

export default function WB_Unit5_Page31_Q1() {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const handleSelect = (qId, choice) => {
    if (showAnswer) return;
    setAnswers((prev) => ({ ...prev, [qId]: choice }));
  };

  const checkAnswers = () => {
    const answered = Object.keys(answers).length;

    if (answered < questions.length) {
      ValidationAlert.info(
        "Please complete all sentences before checking your answers.",
      );
      return;
    }

    let correct = 0;

    questions.forEach((q) => {
      if (answers[q.id] === correctAnswers[q.id]) correct++;
    });

    setShowResults(true); // ✅ مهم

    if (correct === questions.length) {
      ValidationAlert.success(`Score: ${correct}/${questions.length}`);
    } else if (correct === 0) {
      ValidationAlert.error(`Score: ${correct}/${questions.length}`);
    } else {
      ValidationAlert.warning(`Score: ${correct}/${questions.length}`);
    }

    setScore(correct);
  };

  const handleShowAnswer = () => {
    setAnswers(correctAnswers);
    setShowAnswer(true);
  };

  const handleStartAgain = () => {
    setAnswers({});
    setScore(null);
    setShowAnswer(false);
    setShowResults(false); // ✅ مهم
  };
  const isWrong = (qId) => {
    if (!showResults) return false;

    const selected = answers[qId];
    if (!selected) return false;

    return selected !== correctAnswers[qId];
  };
  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "20px", marginBottom: "50px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">I</span>Look, read and circle.
        </h1>

        {/* Questions */}
        <div className="space-y-15">
          {questions.map((q) => {
            const selected = answers[q.id];
            return (
              <div
                key={q.id}
                className="flex items-center gap-3 rounded-xl p-4"
              >
                {/* Number */}
                <span className="font-bold w-5 shrink-0">{q.id}</span>

                <img
                  src={q.src}
                  alt="exercise"
                  className="max-w-12 max-h-12 object-contain ml-auto rounded-lg"
                />

                <div className="relative flex flex-wrap items-center gap-2 flex-1">
                  <span className="font-semibold text-gray-700">
                    {q.subject}
                  </span>
                  <div className="flex flex-col">
                    <button
                      onClick={() => handleSelect(q.id, "likes")}
                      className={`px-3 py-1 rounded-full font-semibold text-sm transition-all
                    ${
                      selected === "likes"
                        ? showAnswer
                          ? correctAnswers[q.id] === "likes"
                            ? "text-black border-green-500"
                            : "text-white border-red-400"
                          : "border-2 text-black border-red-500"
                        : "text-gray-600 border-red-300 hover:border-red-400"
                    }`}
                    >
                      likes
                    </button>

                    <button
                      onClick={() => handleSelect(q.id, "doesn't like")}
                      className={`px-3 py-1 rounded-full font-semibold text-sm transition-all
                    ${
                      selected === "doesn't like"
                        ? showAnswer
                          ? correctAnswers[q.id] === "doesn't like"
                            ? " border-red-500 text-black border-green-500"
                            : "border-red-400 text-white border-red-400"
                          : "border-2 text-black border-red-500"
                        : "text-gray-600 border-gray-300 hover:border-red-400"
                    }`}
                    >
                      doesn't like
                    </button>
                  </div>
                  {isWrong(q.id) && (
                    <div className="absolute top-0 left-30 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow border-2 border-white">
                      ✕
                    </div>
                  )}
                  <span className="font-semibold text-gray-700">{q.food}.</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <div className="mt-6">
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleStartAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
}

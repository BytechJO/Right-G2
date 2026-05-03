// ExerciseI.jsx  —  Look, Read and Circle

import { useState } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 31/Ex I 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 31/Ex I 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 31/Ex I 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 31/Ex I 4.svg";

const questions = [
  { id: 1, src: img1, subject: "She", food: "cheese", correct: "likes" },
  { id: 2, src: img2, subject: "He", food: "cake", correct: "doesn't like" },
  { id: 3, src: img3, subject: "She", food: "yogurt", correct: "doesn't like" },
  { id: 4, src: img4, subject: "She", food: "pizza", correct: "likes" },
];

const correctAnswers = {
  1: "likes",
  2: "likes",
  3: "doesn't like",
  4: "likes",
};

export default function WB_Unit5_Page31_Q1() {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const handleSelect = (qId, choice) => {
    if (showAnswer || showResults) return;
    setAnswers((prev) => ({ ...prev, [qId]: choice }));
  };

  const checkAnswers = () => {
    if (showAnswer || showResults) return;
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
      <div className="div-forall"  style={{gap:"25px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">I</span>Look, read and circle.
        </h1>

        {/* Questions */}
        <div className="space-y-5">
          {questions.map((q) => {
            const selected = answers[q.id];
            return (
              <div
                key={q.id}
                className="flex items-center justify-between w-full gap-30 rounded-xl p-4 text-[20px]"
              >
                <div className="flex items-start">
                {/* Number */}
                <span className="font-bold w-5 shrink-0 text-xl text-blue-900">{q.id}</span>

                <img
                  src={q.src}
                  alt="exercise"
                  className="object-contain "
                  style={{ height: "100px", width: "250px" }}
                />
</div>
                <div className="relative flex flex-wrap items-center gap-2 flex-1">
                  <span className="font-semibold text-gray-700">
                    {q.subject}
                  </span>
                  <div className="flex flex-col gap-5">
                    <button
                      onClick={() => handleSelect(q.id, "likes")}
                      className={`px-3 py-1 rounded-full font-semibold text-[18px] border-2
${
  selected === "likes"
    ? isWrong(q.id)
      ? "border-red-500 text-black"
      : "border-blue-900 text-black"
    : "border-gray-300 hover:border-blue-900 text-gray-600"
}`}
                    >
                      likes
                    </button>

                    <button
                      onClick={() => handleSelect(q.id, "doesn't like")}
                      className={`px-3 py-1 rounded-full font-semibold text-[18px] border-2
${
  selected === "doesn't like"
    ? isWrong(q.id)
      ? "border-red-500 text-black"
      : "border-blue-900 text-black"
    : "border-gray-300 hover:border-blue-900 text-gray-600"
}`}
                    >
                      doesn't like
                    </button>
                  </div>
                  {isWrong(q.id) && (
                    <div className="absolute top-0 left-45 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow border-2 border-white">
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

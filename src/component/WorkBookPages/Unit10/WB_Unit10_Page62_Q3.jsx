// ExerciseC.jsx

import { useState } from "react";
import Button from "../button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img from "../../../assets/imgs/test6.png";

const questions = [
  { id: 1, emoji: "🦭", options: ["seal", "sell"], correct: "seal" },
  { id: 2, emoji: "🫘", options: ["ben", "bean"],  correct: "bean" },
  { id: 3, emoji: "💺", options: ["seat", "set"],  correct: "seat" },
  { id: 4, emoji: "🔟", options: ["teen", "ten"],  correct: "ten"  },
];

const correctAnswers = { 1: "seal", 2: "bean", 3: "seat", 4: "ten" };

export default function WB_Unit10_Page62_Q3() {
  const [answers, setAnswers]       = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore]           = useState(null);
  const [resetKey, setResetKey]     = useState(0);

  const handleCircle = (qId, val) => {
    if (showResult) return;
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const checkAnswers = () => {
    if (Object.keys(answers).length < questions.length) {
      ValidationAlert.warning("Please circle a word for each question.");
      return;
    }
    let correct = 0;
    questions.forEach(q => { if (answers[q.id] === correctAnswers[q.id]) correct++; });
    setScore(correct);
    setShowResult(true);
    correct === questions.length
      ? ValidationAlert.success(`Score: ${correct}/${questions.length}`)
      : ValidationAlert.error(`Score: ${correct}/${questions.length}`);
  };

  const handleShowAnswer = () => {
    setAnswers({ ...correctAnswers });
    setShowResult(true);
    setScore(questions.length);
  };

  const handleStartAgain = () => {
    setAnswers({});
    setShowResult(false);
    setScore(null);
    setResetKey(k => k + 1);
  };

  const getCircleClass = (qId, val) => {
    const isSelected = answers[qId] === val;
    const base = "px-4 py-2 rounded-full border-2 text-base font-bold transition-all cursor-pointer select-none ";
    if (!isSelected) return base + "border-transparent text-gray-600 hover:border-gray-400";
    if (!showResult)  return base + "border-blue-500 text-blue-600 bg-blue-50";
    return answers[qId] === correctAnswers[qId]
      ? base + "border-green-500 text-green-600 bg-green-50"
      : base + "border-red-400 text-red-500 bg-red-50";
  };

  return (
    <div key={resetKey} className="p-6 max-w-3xl mx-auto font-sans">
      <div className="flex items-center gap-4 mb-8">
        <span className="ex-A">C</span>
        <h1 className="header-title-page8">Listen, look, and circle the correct word.</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {questions.map(q => (
          <div key={q.id} className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-2xl border-2 border-gray-100">
            <span className="text-xs font-bold text-blue-500 self-start">{q.id}</span>
            <span className="text-5xl">{q.emoji}</span>

            {/* Words with circle effect */}
            <div className="flex gap-1 items-center flex-wrap justify-center">
              {q.options.map((opt, idx) => (
                <span key={opt} className="flex items-center gap-1">
                  <button onClick={() => handleCircle(q.id, opt)} className={getCircleClass(q.id, opt)}>
                    {opt}
                  </button>
                  {idx < q.options.length - 1 && (
                    <span className="text-gray-400 text-sm">/</span>
                  )}
                </span>
              ))}
            </div>

            {/* Show correct if wrong */}
            {showResult && answers[q.id] !== correctAnswers[q.id] && (
              <span className="text-xs text-green-600 font-semibold">✓ {correctAnswers[q.id]}</span>
            )}
          </div>
        ))}
      </div>

      

      <Button handleShowAnswer={handleShowAnswer} handleStartAgain={handleStartAgain} checkAnswers={checkAnswers} />
    </div>
  );
}
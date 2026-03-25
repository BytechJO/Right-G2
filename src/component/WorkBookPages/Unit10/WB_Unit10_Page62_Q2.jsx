// ExerciseB.jsx

import { useState } from "react";
import Button from "../button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img from "../../../assets/imgs/test6.png";

const questions = [
  { id: 1, emoji: "🪑", parts: ["d", "sk"],  options: ["e", "ee", "ea"], correct: "e"  },
  { id: 2, emoji: "💚", parts: ["gr", "n"],  options: ["e", "ee", "ea"], correct: "ee" },
  { id: 3, emoji: "✏️", parts: ["p", "n"],   options: ["e", "ee", "ea"], correct: "e"  },
  { id: 4, emoji: "📖", parts: ["r", "d"],   options: ["e", "ee", "ea"], correct: "ea" },
];

const correctAnswers = { 1: "e", 2: "ee", 3: "e", 4: "ea" };

export default function WB_Unit10_Page62_Q2() {
  const [answers, setAnswers]       = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore]           = useState(null);
  const [resetKey, setResetKey]     = useState(0);

  const handleSelect = (qId, val) => {
    if (showResult) return;
    setAnswers(prev => ({ ...prev, [qId]: prev[qId] === val ? undefined : val }));
  };

  const checkAnswers = () => {
    const answered = questions.filter(q => answers[q.id]).length;
    if (answered < questions.length) {
      ValidationAlert.warning("Please answer all questions before checking.");
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

  const getOptClass = (qId, val) => {
    const isSelected = answers[qId] === val;
    const base = "px-3 py-1 rounded-lg border-2 text-sm font-bold transition-all cursor-pointer ";
    if (!isSelected) return base + "border-gray-300 text-gray-500 hover:border-blue-400 hover:bg-blue-50";
    if (!showResult)  return base + "border-blue-500 bg-blue-500 text-white";
    return answers[qId] === correctAnswers[qId]
      ? base + "border-green-500 bg-green-500 text-white"
      : base + "border-red-400 bg-red-400 text-white";
  };

  const getCardClass = (qId) => {
    const base = "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ";
    if (!showResult || !answers[qId]) return base + "border-gray-200 bg-gray-50";
    return answers[qId] === correctAnswers[qId]
  };

  return (
    <div key={resetKey} className="p-6 max-w-3xl mx-auto font-sans">
      <div className="flex items-center gap-4 mb-8">
        <span className="ex-A">B</span>
        <h1 className="header-title-page8">Look and write the missing letters.</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {questions.map(q => (
          <div key={q.id} className={getCardClass(q.id)}>
            <span className="text-xs font-bold text-blue-500 self-start">{q.id}</span>
            <span className="text-4xl">{q.emoji}</span>

            {/* Word with blank */}
            <p className="text-base font-bold text-gray-700 tracking-wide">
              {q.parts[0]}
              <span className={`mx-1 px-1 rounded font-bold ${
                showResult
                  ? answers[q.id] === correctAnswers[q.id] ? "text-green-600" : "text-red-500"
                  : answers[q.id] ? "text-blue-600" : "text-gray-300"
              }`}>
                {answers[q.id] || "__"}
              </span>
              {q.parts[1]}
            </p>

            {/* Show correct if wrong */}
            {showResult && answers[q.id] !== correctAnswers[q.id] && (
              <span className="text-xs text-green-600 font-semibold">✓ {correctAnswers[q.id]}</span>
            )}

            {/* Options */}
            {!showResult && (
              <div className="flex gap-1 flex-wrap justify-center">
                {q.options.map(opt => (
                  <button key={opt} onClick={() => handleSelect(q.id, opt)} className={getOptClass(q.id, opt)}>
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {score !== null && (
        <p className={`text-center font-bold text-lg mb-4 ${score === questions.length ? "text-green-600" : "text-orange-500"}`}>
          Score: {score} / {questions.length}
        </p>
      )}

      <Button handleShowAnswer={handleShowAnswer} handleStartAgain={handleStartAgain} checkAnswers={checkAnswers} />
    </div>
  );
}
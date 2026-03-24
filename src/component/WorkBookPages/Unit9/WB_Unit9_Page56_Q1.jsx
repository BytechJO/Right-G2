// ExerciseA.jsx — Look, listen, and write (Select version)

import { useState } from "react";
import Button from "../button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img from "../../../assets/imgs/test6.png";

const questions = [
  { id: 1, src: img, correct: "cap" },
  { id: 2, src: img, correct: "game" },
  { id: 3, src: img, correct: "day" },
  { id: 4, src: img, correct: "sad" },
  { id: 5, src: img, correct: "pain" },
  { id: 6, src: img, correct: "man" },
];

const wordBank = ["cap", "game", "day", "sad", "pain", "man"];

const correctAnswers = {
  1: "cap", 2: "game", 3: "day", 4: "sad", 5: "pain", 6: "man",
};

export default function ExerciseA() {
  const [answers, setAnswers]       = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore]           = useState(null);
  const [resetKey, setResetKey]     = useState(0);

  // الكلمات المستخدمة (عشان ما تنتخب نفس الكلمة لسؤالين)
  const usedWords = Object.values(answers);

  const handleSelect = (qId, word) => {
    if (showResult) return;
    setAnswers(prev => {
      // إذا نفس الكلمة محددة، شيلها
      if (prev[qId] === word) {
        const updated = { ...prev };
        delete updated[qId];
        return updated;
      }
      return { ...prev, [qId]: word };
    });
  };

  const checkAnswers = () => {
    if (Object.keys(answers).length < questions.length) {
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

  const getWordBtnClass = (qId, word) => {
    const isSelected = answers[qId] === word;
    const isUsedElsewhere = usedWords.includes(word) && answers[qId] !== word;

    if (!isSelected)
      return `px-3 py-1 rounded-lg border-2 text-sm font-semibold transition-all
        ${isUsedElsewhere
          ? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50"
          : "border-gray-300 text-gray-600 hover:border-blue-400 hover:bg-blue-50 cursor-pointer"}`;

    if (!showResult)
      return "px-3 py-1 rounded-lg border-2 border-blue-500 bg-blue-500 text-white text-sm font-semibold";

    return answers[qId] === correctAnswers[qId]
      ? "px-3 py-1 rounded-lg border-2 border-green-500 bg-green-500 text-white text-sm font-semibold"
      : "px-3 py-1 rounded-lg border-2 border-red-400 bg-red-400 text-white text-sm font-semibold";
  };

  const getCardClass = (qId) => {
    if (!showResult || !answers[qId]) return "bg-gray-50 rounded-2xl p-4 flex flex-col items-center gap-3 border-2 border-transparent";
    return answers[qId] === correctAnswers[qId]
      ? "bg-green-50 rounded-2xl p-4 flex flex-col items-center gap-3 border-2 border-green-400"
      : "bg-red-50 rounded-2xl p-4 flex flex-col items-center gap-3 border-2 border-red-400";
  };

  return (
    <div key={resetKey} className="p-6 max-w-3xl mx-auto font-sans">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <span className="ex-A">A</span>
        <h1 className="header-title-page8">Look, listen, and write.</h1>
      </div>

     

      {/* Questions grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {questions.map(q => (
          <div key={q.id} className={getCardClass(q.id)}>
            {/* Number */}
            <span className="text-xs font-bold text-blue-500 self-start">{q.id}</span>

            <img src={q.src} alt="" srcset="" className="max-w-24 max-h-24"/>

            {/* Answer line */}
            <div className="w-full text-center border-b-2 border-gray-400 pb-1 min-h-[28px]">
              {answers[q.id] ? (
                <span className={`font-bold text-base ${
                  showResult
                    ? answers[q.id] === correctAnswers[q.id] ? "text-green-600" : "text-red-500"
                    : "text-blue-600"
                }`}>
                  {answers[q.id]}
                </span>
              ) : (
                <span className="text-gray-300 text-sm">_ _ _</span>
              )}
            </div>

            {/* Show correct if wrong */}
            {showResult && answers[q.id] !== correctAnswers[q.id] && (
              <span className="text-xs text-green-600 font-semibold">✓ {correctAnswers[q.id]}</span>
            )}

            {/* Word selector */}
            {!showResult && (
              <div className="flex flex-wrap justify-center gap-1 mt-1">
                {wordBank.map(word => (
                  <button
                    key={word}
                    onClick={() => {
                      if (usedWords.includes(word) && answers[q.id] !== word) return;
                      handleSelect(q.id, word);
                    }}
                    className={getWordBtnClass(q.id, word)}
                  >
                    {word}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Score */}
      {score !== null && (
        <p className={`text-center font-bold text-lg mb-4 ${score === questions.length ? "text-green-600" : "text-orange-500"}`}>
          Score: {score} / {questions.length}
        </p>
      )}

      <Button
        handleShowAnswer={handleShowAnswer}
        handleStartAgain={handleStartAgain}
        checkAnswers={checkAnswers}
      />
    </div>
  );
}
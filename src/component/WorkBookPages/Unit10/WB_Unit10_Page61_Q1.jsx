// ExerciseH.jsx — Look and write sentences

import { useState } from "react";
import Button from "../button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img from "../../../assets/imgs/test6.png";

const wordBank = ["making", "searching", "writing", "watching", "drawing", "reading"];

const questions = [
  { id: 2, subject: "She", correct: "She is searching." },
  { id: 3, subject: "She", correct: "She is making."    },
  { id: 4, subject: "She", correct: "She is watching."  },
  { id: 5, subject: "He",  correct: "He is drawing."    },
  { id: 6, subject: "He",  correct: "He is reading."    },
];

const correctAnswers = {
  2: "searching", 3: "making", 4: "watching", 5: "drawing", 6: "reading",
};

export default function ExerciseH() {
  const [answers, setAnswers]       = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore]           = useState(null);
  const [resetKey, setResetKey]     = useState(0);

  const usedWords = Object.values(answers);

  const handleSelect = (qId, word) => {
    if (showResult) return;
    setAnswers(prev => {
      if (prev[qId] === word) {
        const updated = { ...prev };
        delete updated[qId];
        return updated;
      }
      if (usedWords.includes(word) && prev[qId] !== word) return prev;
      return { ...prev, [qId]: word };
    });
  };

  const checkAnswers = () => {
    if (Object.keys(answers).length < questions.length) {
      ValidationAlert.warning("Please complete all sentences before checking your answers.");
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

  const getChipClass = (qId, word) => {
    const isSelected   = answers[qId] === word;
    const isUsed       = usedWords.includes(word) && !isSelected;
    const base         = "px-3 py-1 rounded-full border-2 text-sm font-semibold transition-all ";

    if (isUsed) return base + "border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed";
    if (!isSelected) return base + "border-gray-300 text-gray-600 hover:border-blue-400 hover:bg-blue-50 cursor-pointer";
    if (!showResult)  return base + "border-blue-500 bg-blue-500 text-white cursor-pointer";
    return answers[qId] === correctAnswers[qId]
  };

  const getLineClass = (qId) => {
    if (!showResult || !answers[qId]) return "border-gray-300";
    return answers[qId] === correctAnswers[qId]
  };

  return (
    <div key={resetKey} className="p-6 max-w-3xl mx-auto font-sans">

      {/* Header */}
      <div className="flex items-center gap-4 mb-5">
        <span className="ex-A">H</span>
        <h1 className="header-title-page8">Look and write sentences.</h1>
      </div>

      

      

      <div className="max-w-full max-h-48 flex items-center justify-center mb-6 text-gray-400 text-sm">
        <img src={img} className="max-w-full max-h-48"/>
      </div>

      <div className="space-y-6">

        <div className="flex items-center gap-3">
          <span className="text-blue-600 font-bold w-5 shrink-0">1</span>
          <div className="flex-1 border-b-2 border-gray-300 pb-1">
            <span className="text-gray-700 font-semibold ">She is writing.</span>
          </div>
        </div>

        {questions.map(q => (
          <div key={q.id} className="flex items-start gap-3">
            <span className="text-blue-600 font-bold w-5 shrink-0 pt-2">{q.id}</span>
            <div className="flex-1">

              <div className={` pb-1 mb-3 min-h-[32px] flex items-center gap-1 ${getLineClass(q.id)}`}>
                <span className="text-gray-700 font-semibold">{q.subject} is</span>
                {answers[q.id]
                  ? <span className={`font-bold ml-1 ${
                      showResult
                        ? answers[q.id] === correctAnswers[q.id] 
                        : "text-blue-600"
                    }`}>{answers[q.id]}.</span>
                  : <span className="text-gray-300 ml-1">___________</span>
                }
                
              </div>

              {!showResult && (
                <div className="flex flex-wrap gap-2">
                  {wordBank.map(word => (
                    <button
                      key={word}
                      onClick={() => handleSelect(q.id, word)}
                      disabled={usedWords.includes(word) && answers[q.id] !== word}
                      className={getChipClass(q.id, word)}
                    >
                      {word}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      

      <div className="mt-18">
        <Button
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={handleStartAgain}
          checkAnswers={checkAnswers}
        />
      </div>

    </div>
  );
}
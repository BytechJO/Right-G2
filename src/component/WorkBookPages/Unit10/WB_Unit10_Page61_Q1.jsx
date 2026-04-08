// ExerciseH.jsx — Look and write sentences

import { useState } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 61/SVG/Asset 1.svg";

const wordBank = [
  "making",
  "searching",
  "writing",
  "watching",
  "drawing",
  "reading",
];

const questions = [
  { id: 1, subject: "She", correct: "She is writing." },
  { id: 2, subject: "She", correct: "She is searching." },
  { id: 3, subject: "She", correct: "She is making." },
  { id: 4, subject: "She", correct: "She is watching." },
  { id: 5, subject: "He", correct: "He is drawing." },
  { id: 6, subject: "He", correct: "He is reading." },
];

const correctAnswers = {
  1: "writing",
  2: "searching",
  3: "making",
  4: "watching",
  5: "drawing",
  6: "reading",
};

export default function ExerciseH() {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);

  const usedWords = Object.values(answers);

  const handleDrop = (qId) => {
    if (!selectedWord || showResult) return;

    setAnswers((prev) => {
      const updated = { ...prev };

      // إذا نفس الكلمة مستخدمة بجملة ثانية، احذفها من هناك
      Object.keys(updated).forEach((key) => {
        if (updated[key] === selectedWord) {
          delete updated[key];
        }
      });

      updated[qId] = selectedWord;
      return updated;
    });

    setSelectedWord(null);
  };

  const handleRemoveAnswer = (qId) => {
    if (showResult) return;

    setAnswers((prev) => {
      const updated = { ...prev };
      delete updated[qId];
      return updated;
    });
  };

  const checkAnswers = () => {
    if (Object.keys(answers).length < questions.length) {
      ValidationAlert.warning(
        "Please complete all sentences before checking your answers.",
      );
      return;
    }

    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === correctAnswers[q.id]) correct++;
    });

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
    setSelectedWord(null);
  };

  const getChipClass = (word) => {
    const isUsed = usedWords.includes(word);
    const base = "px-4 py-2 rounded-lg border-2 font-semibold transition-all ";

    if (isUsed) {
      return (
        base + "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-200"
      );
    }

    return (
      base +
      "bg-white cursor-grab hover:bg-blue-50 border-blue-500 text-blue-700"
    );
  };

  const getLineClass = (qId) => {
    if (!showResult || !answers[qId]) return "border-gray-300";
    return answers[qId] === correctAnswers[qId]
      ? "border-gray-400"
      : "border-red-500";
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "10px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">H</span>Look and write sentences.
        </h1>

        <div className="max-w-full max-h-48 flex items-center justify-center mb-6 text-gray-400 text-sm">
          <img src={img} alt="exercise" style={{height:"240px"}} />
        </div>

        {/* Global Word Bank */}
        <div className="mb-8 flex flex-wrap justify-center gap-2 border-2 border-dashed border-blue-700 rounded-lg p-3 shadow-sm">
          {wordBank.map((word) => {
            const isUsed = usedWords.includes(word);

            return (
              <div
                key={word}
                draggable={!isUsed && !showResult}
                onDragStart={() => setSelectedWord(word)}
                className={getChipClass(word)}
              >
                {word}
              </div>
            );
          })}
        </div>

        <div className="space-y-6">
          {/* الجملة الأولى ثابتة */}
       

          {questions.map((q) => (
            <div key={q.id} className="flex items-start gap-3">
              <span className="text-blue-600 font-bold w-5 shrink-0 pt-2">
                {q.id}
              </span>

              <div className="flex-1">
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(q.id)}
                  className={`relative border-b-2 pb-1 mb-3 min-h-[38px] flex items-center gap-1 ${getLineClass(
                    q.id,
                  )}`}
                >
                  {showResult &&
                    answers[q.id] &&
                    answers[q.id] !== correctAnswers[q.id] && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow">
                        ✕
                      </div>
                    )}

                  <span className="text-gray-700 text-lg font-semibold">
                    {q.subject} is
                  </span>

                  {answers[q.id] ? (
                    <span
                      onClick={() => handleRemoveAnswer(q.id)}
                      className={`font-bold text-lg ml-1 ${
                        showResult
                          ? answers[q.id] === correctAnswers[q.id]
                            ? "text-blue-700"
                            : "text-blue-600"
                          : "text-blue-600 cursor-pointer"
                      }`}
                    >
                      {answers[q.id]}.
                    </span>
                  ) : (
                    <span className="text-gray-300 ml-1"></span>
                  )}
                </div>
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
    </div>
  );
}

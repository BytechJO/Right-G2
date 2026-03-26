// ExerciseA.jsx — Look, listen, and write (Select version)

import { useState } from "react";
import Button from "../button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img from "../../../assets/imgs/test6.png";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import sound from "../../../assets/audio/WorkBook/titel G2/Unit 2.mp3";

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
  1: "cap",
  2: "game",
  3: "day",
  4: "sad",
  5: "pain",
  6: "man",
};

export default function ExerciseA() {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [selectedWord, setSelectedWord] = useState(null);
  // الكلمات المستخدمة (عشان ما تنتخب نفس الكلمة لسؤالين)
  const usedWords = Object.values(answers);

  const checkAnswers = () => {
    if (Object.keys(answers).length < questions.length) {
      ValidationAlert.warning("Please answer all questions before checking.");
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
    setResetKey((k) => k + 1);
  };

  const getCardClass = (qId) => {
    if (!showResult || !answers[qId])
      return "bg-gray-50 rounded-2xl p-4 flex flex-col items-center gap-3 border-2 border-transparent";
    return answers[qId] === correctAnswers[qId]
      ? "rounded-2xl p-4 flex flex-col items-center gap-3 border-2 border-gray-400"
      : "rounded-2xl p-4 flex flex-col items-center gap-3 border-2 border-red-400";
  };
  const captions = [
    {
      start: 0,
      end: 4.23,
      text: "Page 8. Right Activities. Exercise A, number 1. ",
    },
    {
      start: 4.25,
      end: 8.28,
      text: "Listen and write the missing letters. Number the pictures.  ",
    },
    { start: 8.3, end: 11.05, text: "1-tiger." },
    { start: 11.07, end: 13.12, text: "2-taxi." },
    { start: 13.14, end: 15.14, text: "3-duck." },
    { start: 15.16, end: 17.13, text: "4-deer." },
  ];
  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "15px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">A</span>Look, listen, and write.
        </h1>

        <div className="mb-8 flex flex-wrap justify-center gap-2 border-2 border-dashed border-blue-700 rounded-lg p-2 shadow-2">
          {wordBank.map((word) => {
            const isUsed = usedWords.includes(word);

            return (
              <div
                key={word}
                draggable={!isUsed && !showResult}
                onDragStart={() => setSelectedWord(word)}
                className={`px-4 py-2 rounded-lg border-2 border-blue-500 font-semibold transition-all
    ${
      isUsed
        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
        : "bg-white cursor-grab hover:bg-blue-50 border-gray-300"
    }
  `}
              >
                {word}
              </div>
            );
          })}
        </div>
        <QuestionAudioPlayer src={sound} captions={captions} stopAtSecond={9} />
        {/* Questions grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {questions.map((q) => (
            <div key={q.id} className={getCardClass(q.id)}>
              {/* Number */}
              <span className="text-xs font-bold text-blue-500 self-start">
                {q.id}
              </span>

              <img src={q.src} alt="" srcset="" className="max-w-24 max-h-24" />

              {/* Answer line */}
              <div
                onDragOver={(e) => e.preventDefault()} // 🔥 مهم جداً
                onDrop={() => {
                  if (!selectedWord || showResult) return;

                  setAnswers((prev) => {
                    const updated = { ...prev };

                    // نشيل الكلمة إذا مستخدمة بمكان ثاني
                    Object.keys(updated).forEach((key) => {
                      if (updated[key] === selectedWord) {
                        delete updated[key];
                      }
                    });

                    updated[q.id] = selectedWord;
                    return updated;
                  });

                  setSelectedWord(null);
                }}
                className="relative w-full text-center border-b-2 border-gray-400 pb-1 min-h-[28px]"
              >
                {answers[q.id] ? (
                  <span
                    className={`font-bold text-base "text-blue-600"
                    `}
                  >
                    {answers[q.id]}
                    {/* Show correct if wrong */}
                  </span>
                ) : (
                  <span className="text-gray-300 text-sm">_ _ _</span>
                )}
                {showResult && answers[q.id] !== correctAnswers[q.id] && (
                  <span className="absolute -top-2 right-0 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-s, font-bold border-2 border-white shadow">
                    ✕
                  </span>
                )}
              </div>
            </div>
          ))}
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

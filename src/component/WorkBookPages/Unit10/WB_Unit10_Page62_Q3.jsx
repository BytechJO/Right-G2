// ExerciseC.jsx

import { useState } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img from "../../../assets/imgs/test6.png";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 62/SVG/Asset 13.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 62/SVG/Asset 14.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 62/SVG/Asset 15.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 62/SVG/Asset 16.svg";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import sound from "../../../assets/audio/WorkBook/p62q3.mp3";

const questions = [
  { id: 1, emoji: img1, options: ["seal", "sell"], correct: "seal" },
  { id: 2, emoji: img2, options: ["ben", "bean"], correct: "bean" },
  { id: 3, emoji: img3, options: ["seat", "set"], correct: "seat" },
  { id: 4, emoji: img4, options: ["teen", "ten"], correct: "ten" },
];

const correctAnswers = { 1: "seal", 2: "bean", 3: "seat", 4: "ten" };

export default function WB_Unit10_Page62_Q3() {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const captions = [
    { start: 0.56, end: 3.52, text: "Page 62, phonics exercise C." },

    {
      start: 4.7,
      end: 7.62,
      text: "Listen, look, and circle the correct word.",
    },
    {
      start: 8.62,
      end: 10.8,
      text: "1.seal.",
    },
    {
      start: 11.10,
      end: 13.6,
      text: "2.bean.",
    },
    { start: 14.6, end: 16.3, text: "3.seat." },
    { start: 16.9, end: 18.66, text: " 4.ten." },
  ];
  const handleCircle = (qId, val) => {
    if (showResult) return;
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const checkAnswers = () => {
     if (showResult) return;
    if (Object.keys(answers).length < questions.length) {
      ValidationAlert.info("Please circle a word for each question.");
      return;
    }
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === correctAnswers[q.id]) correct++;
    });
    setScore(correct);
    setShowResult(true);

    if (correct === questions.length) {
      ValidationAlert.success(`Score: ${correct}/${questions.length}`);
    } else if (correct === 0) {
      ValidationAlert.error(`Score: ${correct}/${questions.length}`);
    } else {
      ValidationAlert.warning(`Score: ${correct}/${questions.length}`);
    }
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
    // setResetKey((k) => k + 1);
  };

  const getCircleClass = (qId, val) => {
    const isSelected = answers[qId] === val;
    const base =
      "px-2 py-2 rounded-full border-2 text-xl font-bold transition-all cursor-pointer select-none ";
    if (!isSelected)
      return base + "border-transparent text-gray-600 hover:border-blue-900";
    if (!showResult) return base + "border-blue-900 text-blue-900";
    return answers[qId] === correctAnswers[qId]
      ? base + "border-blue-900 text-blue-900"
      : base + "border-red-500";
  };

  return (
    <div key={resetKey} className="main-container-component">
      <div className="div-forall" style={{gap:"45px"}}>
        {" "}
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">C</span> Listen, look, and circle the
          correct word.
        </h1>
        <QuestionAudioPlayer
          src={sound}
          captions={captions}
          stopAtSecond={7.8}
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {questions.map((q) => (
            <div
              key={q.id}
              className="relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-gray-300"
            >
              {/* ❌ Wrong Answer */}
              {showResult &&
                answers[q.id] &&
                answers[q.id] !== correctAnswers[q.id] && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow">
                    ✕
                  </div>
                )}

              <span className="text-lg font-bold text-blue-800 self-start">
                {q.id}
              </span>
              <img src={q.emoji} style={{height:"100px"}}/>

              {/* Words with circle effect */}
              <div className="flex gap-1 items-center flex-wrap justify-center">
                {q.options.map((opt, idx) => (
                  <span key={opt} className="flex items-center gap-1">
                    <button
                      onClick={() => handleCircle(q.id, opt)}
                      className={getCircleClass(q.id, opt)}
                    >
                      {opt}
                    </button>
                    {idx < q.options.length - 1 && (
                      <span className="text-gray-400 text-sm">/</span>
                    )}
                  </span>
                ))}
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

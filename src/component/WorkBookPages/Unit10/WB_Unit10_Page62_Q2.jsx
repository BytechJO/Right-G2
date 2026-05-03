// ExerciseB.jsx

import { useState } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img from "../../../assets/imgs/test6.png";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 62/SVG/Asset 9.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 62/SVG/Asset 10.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 62/SVG/Asset 11.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 62/SVG/Asset 12.svg";
const questions = [
  {
    id: 1,
    emoji: img1,
    parts: ["d", "sk"],
    options: ["e", "ee", "ea"],
    correct: "e",
  },
  {
    id: 2,
    emoji: img2,
    parts: ["gr", "n"],
    options: ["e", "ee", "ea"],
    correct: "ee",
  },
  {
    id: 3,
    emoji: img3,
    parts: ["p", "n"],
    options: ["e", "ee", "ea"],
    correct: "e",
  },
  {
    id: 4,
    emoji: img4,
    parts: ["r", "d"],
    options: ["e", "ee", "ea"],
    correct: "ea",
  },
];

const correctAnswers = { 1: "e", 2: "ee", 3: "e", 4: "ea" };

export default function WB_Unit10_Page62_Q2() {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  const handleSelect = (qId, val) => {
    if (showResult) return;

    setAnswers((prev) => ({
      ...prev,
      [qId]: prev[qId] === val ? undefined : val,
    }));
  };

  const checkAnswers = () => {
    if (showResult) return;
    const answered = questions.filter((q) => answers[q.id]).length;

    if (answered < questions.length) {
      ValidationAlert.info("Please answer all questions before checking.");
      return;
    }

    let correct = 0;

    questions.forEach((q) => {
      if (answers[q.id] === correctAnswers[q.id]) correct++;
    });

    setScore(correct);
    setShowResult(true);
    const msg = `Score: ${correct} / ${questions.length}`;

    if (correct === questions.length) ValidationAlert.success(msg);
    else if (correct > 0) ValidationAlert.warning(msg);
    else ValidationAlert.error(msg);
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

  // ✅ FIXED
  const getCardClass = (qId) => {
    const base =
      "relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-gray-300 transition-all duration-300 ";

    if (!showResult || !answers[qId]) {
      return base + "border-blue-900";
    }

    return answers[qId] === correctAnswers[qId]
      ? base + "border-blue-600"
      : base + "border-red-500";
  };

  const getOptClass = (qId, val) => {
    const isSelected = answers[qId] === val;

    const base =
      "px-3 py-1 rounded-lg border-2 text-lg font-bold transition-all cursor-pointer ";

    if (!isSelected) {
      return (
        base +
        "border-gray-300 hover:border-blue-900"
      );
    }

    if (!showResult) {
      return base + "border-blue-900";
    }

    return answers[qId] === correctAnswers[qId]
      ? base + "border-blue-900 bg-blue-100 text-white"
      : base + "border-blue-900 bg-blue-500 text-white";
  };

  return (
    <div key={resetKey} className="main-container-component">
      <div className="div-forall" style={{gap:"90px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">B</span>Look and write the missing letters.
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 w-full">
          {questions.map((q) => (
            <div key={q.id} className={`${getCardClass(q.id)} w-full`}>
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

              <img src={q.emoji} className="max-w-45 max-h-30" />

              {/* Word */}
              <p className="text-xl font-bold text-gray-700 tracking-wide">
                {q.parts[0]}
                <span className="mx-1 px-1 rounded font-bold text-blue-600">
                  {answers[q.id] || "__"}
                </span>
                {q.parts[1]}
              </p>

              {/* Options */}

              <div className="flex gap-1 flex-wrap justify-center">
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelect(q.id, opt)}
                    className={getOptClass(q.id, opt)}
                  >
                    {opt}
                  </button>
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

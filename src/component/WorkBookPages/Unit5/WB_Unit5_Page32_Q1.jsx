// ExerciseA.jsx

import { useState } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img from "../../../assets/imgs/test6.png";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex A 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex A 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex A 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex A 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex A 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex A 6.svg";

const questions = [
  {
    id: 1,
    src: img1,
    prefix: "b",
    suffix: "",
    blank: "ee",
    display: "b __ __",
    correct: "ee",
  },
  {
    id: 2,
    src: img2,
    prefix: "f",
    suffix: "t",
    blank: "ee",
    display: "f __ __ t",
    correct: "ee",
  },
  {
    id: 3,
    src: img3,
    prefix: "m",
    suffix: "t",
    blank: "ea",
    display: "m __ __ t",
    correct: "ea",
  },
  {
    id: 4,
    src: img4,
    prefix: "t",
    suffix: "",
    blank: "ea",
    display: "t __ __",
    correct: "ea",
  },
  {
    id: 5,
    src: img5,
    prefix: "sl",
    suffix: "p",
    blank: "ee",
    display: "sl __ __ p",
    correct: "ee",
  },
  {
    id: 6,
    src: img6,
    prefix: "r",
    suffix: "d",
    blank: "ea",
    display: "r __ __ d",
    correct: "ea",
  },
];

const correctAnswers = { 1: "ee", 2: "ee", 3: "ea", 4: "ea", 5: "ee", 6: "ea" };

export default function WB_Unit5_Page32_Q1() {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  const handleSelect = (id, val) => {
    if (showResult) return;
    setAnswers((prev) => ({ ...prev, [id]: val }));
  };

  const checkAnswers = () => {
    if (showResult) return;
    if (Object.keys(answers).length < questions.length) {
      ValidationAlert.info(
        "Please complete all words before checking your answers.",
      );
      return;
    }
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === correctAnswers[q.id]) correct++;
    });
    setScore(correct);
    setShowResult(true);

    if (correct === questions.length) {
      return ValidationAlert.success(`Score: ${correct}/${questions.length}`);
    } else if (correct === 0) {
      return ValidationAlert.error(`Score: ${correct}/${questions.length}`);
    } else {
      return ValidationAlert.warning(`Score: ${correct}/${questions.length}`);
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
    setResetKey((k) => k + 1);
  };

  const getBtnClass = (qId, val) => {
    const selected = answers[qId] === val;
    if (!selected)
      return "px-3 py-1 rounded-lg border-2 border-gray-300 text-gray-600 hover:border-blue-900 transition-all";
    if (!showResult)
      return "px-3 py-1 rounded-lg border-2 border-blue-800";
    return answers[qId] === correctAnswers[qId]
      ? "px-3 py-1 rounded-lg border-2"
      : "px-3 py-1 rounded-lg border-2 border-red-500 ";
  };

  const isIncorrect = (qId) => {
    if (!showResult) return false;
    if (!answers[qId]) return false;

    return answers[qId] !== correctAnswers[qId];
  };
  return (
    <div key={resetKey} className="main-container-component">
      <div className="div-forall"  style={{gap:"25px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">A</span> Look and write
          <span className="text-navy" style={{ color: "navy" }}>
            ee
          </span>
          or{" "}
          <span className="text-navy" style={{ color: "navy" }}>
            ea
          </span>
          to complete the words.
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
          {questions.map((q) => (
            <div
              key={q.id}
              className="relative flex flex-col items-center gap-2 rounded-xl p-4"
            >
              {isIncorrect(q.id) && (
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shadow-md border-2 border-white">
                  <span className="text-white text-sm font-bold">✕</span>
                </div>
              )}
              <div className="flex gap-4">
                <p className="text-xl text-blue-900 font-bold">{q.id}</p>
                <img src={q.src} style={{height:"100px",width:"120px"}}/>
              </div>
              <p className="text-2xl font-bold text-gray-700 tracking-widest">
                {q.prefix}
                <span
                  className={`mx-1 px-1 rounded ${
                    answers[q.id] ? "text-blue-800" : "text-gray-300"
                  }`}
                >
                  {answers[q.id] || "__"}
                </span>
                {q.suffix}
              </p>

              {/* Choice buttons */}
              <div className="flex gap-2">
                {["ee", "ea"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelect(q.id, opt)}
                    className={`${getBtnClass(q.id, opt)} text-lg text-blue-800 font-bold`}
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

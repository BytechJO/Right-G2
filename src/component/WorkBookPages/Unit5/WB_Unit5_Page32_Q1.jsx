// ExerciseA.jsx

import { useState } from "react";
import Button from "../button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img from "../../../assets/imgs/test6.png";

const questions = [
    { id: 1, src: img, prefix: "b", suffix: "", blank: "ee", display: "b __ __", correct: "ee" },
    { id: 2, src: img, prefix: "f", suffix: "t", blank: "ee", display: "f __ __ t", correct: "ee" },
    { id: 3, src: img, prefix: "m", suffix: "t", blank: "ea", display: "m __ __ t", correct: "ea" },
    { id: 4, src: img, prefix: "t", suffix: "", blank: "ea", display: "t __ __", correct: "ea" },
    { id: 5, src: img, prefix: "sl", suffix: "p", blank: "ee", display: "sl __ __ p", correct: "ee" },
    { id: 6, src: img, prefix: "r", suffix: "d", blank: "ea", display: "r __ __ d", correct: "ea" },
];

const correctAnswers = { 1: "ee", 2: "ee", 3: "ea", 4: "ea", 5: "ee", 6: "ea" };

export default function WB_Unit5_Page32_Q1() {
    const [answers, setAnswers] = useState({});
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(null);
    const [resetKey, setResetKey] = useState(0);

    const handleSelect = (id, val) => {
        if (showResult) return;
        setAnswers(prev => ({ ...prev, [id]: val }));
    };

    const checkAnswers = () => {
        if (Object.keys(answers).length < questions.length) {
            ValidationAlert.warning("Please complete all words before checking your answers.");
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

    const getBtnClass = (qId, val) => {
        const selected = answers[qId] === val;
        if (!selected) return "px-3 py-1 rounded-lg border-2 border-gray-300 text-gray-600 hover:border-blue-400 font-bold text-sm transition-all";
        if (!showResult) return "px-3 py-1 rounded-lg border-2 border-blue-500 bg-blue-500 text-white font-bold text-sm";
        return answers[qId] === correctAnswers[qId]
            ? "px-3 py-1 rounded-lg border-2 border-green-500 bg-green-500 text-white font-bold text-sm"
            : "px-3 py-1 rounded-lg border-2 border-red-400 bg-red-400 text-white font-bold text-sm";
    };

    return (
        <div key={resetKey} className="p-6 max-w-3xl mx-auto font-sans">
            <div className="flex items-center gap-4 mb-8">
                <span className="ex-A">A</span>
                <h1 className="header-title-page8">
                    Look and write
                    <span className="text-blue-600">
                        ee
                    </span>
                    or{" "}
                    <span className="text-blue-600">
                        ea
                    </span>
                    to complete the words.</h1>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
                {questions.map((q) => (
                    <div key={q.id} className="flex flex-col items-center gap-2 bg-gray-50 rounded-xl p-4">
                        <img src={q.src} className="max-w-20 max-h-20" />
                        <p className="text-xs text-gray-400 font-semibold">{q.id}</p>

                        <p className="text-lg font-bold text-gray-700 tracking-widest">
                            {q.prefix}
                            <span className={`mx-1 px-1 rounded ${showResult
                                ? answers[q.id] === correctAnswers[q.id]
                                    ? "text-green-600"
                                    : "text-red-500"
                                : answers[q.id]
                                    ? "text-blue-600"
                                    : "text-gray-300"
                                }`}>
                                {answers[q.id] || "__"}
                            </span>
                            {q.suffix}
                        </p>

                        {/* Choice buttons */}
                        <div className="flex gap-2">
                            {["ee", "ea"].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => handleSelect(q.id, opt)}
                                    className={getBtnClass(q.id, opt)}
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
    );
}
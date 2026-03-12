// ExerciseB.jsx

import { useState } from "react";
import Button from "../button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img from "../../../assets/imgs/test6.png";

const questions = [
    {
        id: 1, word: "bee", sound: "ee",
        options: [
            { src: img, label: "sleep" },
            { src: img, label: "meat" },
            { src: img, label: "sleep" },
        ],
        correct: [0, 2], // sleep & sleep share "ee"
    },
    {
        id: 2, word: "tree", sound: "ee",
        options: [
            { src: img, label: "bread" },
            { src: img, label: "green" },
            { src: img, label: "feet" },
        ],
        correct: [1, 2],
    },
    {
        id: 3, word: "bread", sound: "ea",
        options: [
            { src: img, label: "sleep" },
            { src: img, label: "bee" },
            { src: img, label: "green" },
        ],
        correct: [0],
    },
    {
        id: 4, word: "meat", sound: "ea",
        options: [
            { src: img, label: "feet" },
            { src: img, label: "horse" },
            { src: img, label: "bread" },
        ],
        correct: [2],
    },
];


export default function WB_Unit5_Page32_Q2() {
    const [selected, setSelected] = useState({});
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(null);
    const [resetKey, setResetKey] = useState(0);

    const toggle = (qId, idx) => {
        if (showResult) return;
        setSelected(prev => {
            const cur = prev[qId] || [];
            return {
                ...prev,
                [qId]: cur.includes(idx) ? cur.filter(i => i !== idx) : [...cur, idx],
            };
        });
    };

    const checkAnswers = () => {
        const unanswered = questions.filter(q => !(selected[q.id]?.length > 0));
        if (unanswered.length > 0) {
            ValidationAlert.warning("Please circle at least one picture for each row.");
            return;
        }
        let correct = 0;
        questions.forEach(q => {
            const userSel = (selected[q.id] || []).sort().join(",");
            const rightSel = q.correct.sort().join(",");
            if (userSel === rightSel) correct++;
        });
        setScore(correct);
        setShowResult(true);
        correct === questions.length
            ? ValidationAlert.success(`Score: ${correct}/${questions.length}`)
            : ValidationAlert.error(`Score: ${correct}/${questions.length}`);
    };

    const handleShowAnswer = () => {
        const all = {};
        questions.forEach(q => { all[q.id] = [...q.correct]; });
        setSelected(all);
        setShowResult(true);
        setScore(questions.length);
    };

    const handleStartAgain = () => {
        setSelected({});
        setShowResult(false);
        setScore(null);
        setResetKey(k => k + 1);
    };

    const getCellClass = (qId, idx) => {
        const isSelected = (selected[qId] || []).includes(idx);
        const q = questions.find(x => x.id === qId);
        const isCorrectOption = q.correct.includes(idx);
        if (!isSelected) return "cursor-pointer rounded-xl p-2 border-2 border-transparent hover:border-blue-300 transition-all";
        if (!showResult) return "cursor-pointer rounded-xl p-2 border-2 border-blue-500 bg-blue-50";
        return isCorrectOption
            ? "cursor-pointer rounded-xl p-2 border-2 border-green-500 bg-green-50"
            : "cursor-pointer rounded-xl p-2 border-2 border-red-400 bg-red-50";
    };

    return (
        <div key={resetKey} className="p-6 max-w-3xl mx-auto font-sans">
            
            <div className="flex items-center gap-4 mb-8">
                <span className="ex-A">B</span>
                <h1 className="header-title-page8">
                    Listen and circle the pictures that have the same{" "}
                    <span className="text-blue-600 font-bold">vowel sound</span>.
                </h1>
            </div>
        

    <div className="rounded-xl overflow-hidden border border-gray-200 mb-6">
        {questions.map((q, qi) => (
            <div
                key={q.id}
                className={`flex items-center gap-2 px-4 py-3 ${qi % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
            >
                {/* Row number + word */}
                <div className="w-20 shrink-0">
                    <span className="text-blue-600 font-bold mr-1">{q.id}</span>
                    <span className="font-semibold text-gray-700">{q.word}</span>
                </div>

                {/* Options */}
                <div className="flex flex-1 justify-around">
                    {q.options.map((opt, idx) => (
                        <div
                            key={idx}
                            onClick={() => toggle(q.id, idx)}
                            className={getCellClass(q.id, idx)}
                        >
                            <img src={opt.src} className="max-w-20 max-h-10" />
                            
                            <p className="text-xs text-center text-gray-500 mt-1">{opt.label}</p>
                        </div>
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
    </div >
  );
}
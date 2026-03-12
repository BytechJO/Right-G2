// ExerciseC.jsx

import { useState } from "react";
import Button from "../button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img from "../../../assets/imgs/test6.png";

const wordBank = ["bee", "leaf", "sheep", "sleep", "tree", "meat", "beach", "read"];

const correctAnswers = {
    feet: ["bee", "sheep", "sleep", "tree"],
    beak: ["leaf", "meat", "beach", "read"],
};

export default function WB_Unit5_Page32_Q3() {
    const [columns, setColumns] = useState({ feet: [], beak: [] });
    const [remaining, setRemaining] = useState([...wordBank]);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(null);
    const [resetKey, setResetKey] = useState(0);

    const addWord = (col, word) => {
        if (showResult) return;
        setColumns(prev => ({ ...prev, [col]: [...prev[col], word] }));
        setRemaining(prev => prev.filter(w => w !== word));
    };

    const removeWord = (col, word) => {
        if (showResult) return;
        setColumns(prev => ({ ...prev, [col]: prev[col].filter(w => w !== word) }));
        setRemaining(prev => [...prev, word].sort((a, b) => wordBank.indexOf(a) - wordBank.indexOf(b)));
    };

    const checkAnswers = () => {
        if (remaining.length > 0) {
            ValidationAlert.warning("Please place all words before checking your answers.");
            return;
        }
        let correct = 0;
        ["feet", "beak"].forEach(col => {
            const userSorted = [...columns[col]].sort().join(",");
            const rightSorted = [...correctAnswers[col]].sort().join(",");
            if (userSorted === rightSorted) correct++;
        });
        setScore(correct);
        setShowResult(true);
        correct === 2
            ? ValidationAlert.success(`Score: ${correct}/2`)
            : ValidationAlert.error(`Score: ${correct}/2`);
    };

    const handleShowAnswer = () => {
        setColumns({ feet: [...correctAnswers.feet], beak: [...correctAnswers.beak] });
        setRemaining([]);
        setShowResult(true);
        setScore(2);
    };

    const handleStartAgain = () => {
        setColumns({ feet: [], beak: [] });
        setRemaining([...wordBank]);
        setShowResult(false);
        setScore(null);
        setResetKey(k => k + 1);
    };

    const getWordClass = (col, word) => {
        const base = "px-3 py-1 rounded-lg text-sm font-semibold cursor-pointer transition-all border-2 ";
        if (!showResult) return base + "bg-blue-500 text-white border-blue-500 hover:bg-blue-600";
        const isCorrect = correctAnswers[col].includes(word);
        return base + (isCorrect ? "bg-green-500 text-white border-green-500" : "bg-red-400 text-white border-red-400");
    };

    const getColClass = (col) => {
        if (!showResult) return "border-2 border-dashed border-gray-300 rounded-xl p-4 min-h-[120px]";
        const userSorted = [...columns[col]].sort().join(",");
        const rightSorted = [...correctAnswers[col]].sort().join(",");
        return userSorted === rightSorted
            ? "border-2 border-green-400 rounded-xl p-4 min-h-[120px] bg-green-50"
            : "border-2 border-red-400 rounded-xl p-4 min-h-[120px] bg-red-50";
    };

    return (
        <div key={resetKey} className="p-6 max-w-3xl mx-auto font-sans">
            
            <div className="flex items-center gap-4 mb-8">
                <span className="ex-A">C</span>
                <h1 className="header-title-page8">Write the words in the correct column.</h1>
            </div>

            <div className="flex flex-wrap gap-2 p-4 bg-gray-100 rounded-xl mb-8">
                {remaining.map(word => (
                    <span key={word} className="text-sm font-semibold text-gray-600 px-3 py-1 bg-white border border-gray-300 rounded-lg">
                        {word}
                    </span>
                ))}
                {remaining.length === 0 && <p className="text-gray-400 text-sm">All words placed ✓</p>}
            </div>

            {/* Columns */}
            <div className="grid grid-cols-2 gap-6 mb-6">
                {["feet", "beak"].map(col => (
                    <div key={col}>
                        {/* Column header */}
                        <div className="flex items-center gap-2 mb-3">
                            
  {col === "feet" ? <img src= {img} alt="Feet" className="max-w-20 max-h-20"/> : <img src={img} alt="Hand" className="max-w-20 max-h-20"/>}

                            <span className="font-bold text-gray-700 text-lg">{col}</span>
                            <span className="text-xs text-gray-400">({col === "feet" ? "ee" : "ea"})</span>
                        </div>

                        {/* Drop zone */}
                        <div className={getColClass(col)}>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {columns[col].map(word => (
                                    <button key={word} onClick={() => removeWord(col, word)} className={getWordClass(col, word)}>
                                        {word}
                                    </button>
                                ))}
                            </div>

                            {/* Add words from bank */}
                            {!showResult && remaining.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-dashed border-gray-200">
                                    {remaining.map(word => (
                                        <button
                                            key={word}
                                            onClick={() => addWord(col, word)}
                                            className="px-2 py-1 text-xs bg-white border border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
                                        >
                                            + {word}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {score !== null && (
                <p className={`text-center font-bold text-lg mb-4 ${score === 2 ? "text-green-600" : "text-orange-500"}`}>
                    Score: {score} / 2
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
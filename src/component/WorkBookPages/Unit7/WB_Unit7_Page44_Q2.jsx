import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../button";

import coatImg from "../../../assets/imgs/test6.png";
import boneImg from "../../../assets/imgs/test6.png";
import bowImg from "../../../assets/imgs/test6.png";

const exerciseBWords = ["row", "goat", "globe", "note", "grow", "home", "soap", "road", "snow"];

const exerciseBColumns = [
    { id: "oa", title: "coat", image: coatImg, correctWords: ["goat", "soap", "road"] },
    { id: "o-e", title: "bone", image: boneImg, correctWords: ["globe", "note", "home"] },
    { id: "ow", title: "bow", image: bowImg, correctWords: ["row", "grow", "snow"] },
];

const WB_Unit7_Page44_Q2 = () => {
    const [availableWords, setAvailableWords] = useState(exerciseBWords);
    const [columnsB, setColumnsB] = useState({ oa: [], "o-e": [], ow: [] });
    const [draggedWord, setDraggedWord] = useState(null);
    const [checked, setChecked] = useState(false);
    const [locked, setLocked] = useState(false);

    const onDragStart = (word, fromColumn = null) => {
        if (locked) return;
        setDraggedWord({ word, fromColumn });
    };

    const onDrop = (toColumn) => {
        if (locked || !draggedWord) return;
        const { word, fromColumn } = draggedWord;

        if (fromColumn === toColumn) return;

        // Remove from source
        if (fromColumn) {
            setColumnsB(prev => ({ ...prev, [fromColumn]: prev[fromColumn].filter(w => w !== word) }));
        } else {
            setAvailableWords(prev => prev.filter(w => w !== word));
        }

        // Add to destination
        setColumnsB(prev => ({ ...prev, [toColumn]: [...prev[toColumn], word] }));
        setDraggedWord(null);
    };

    const returnToPool = () => {
        if (locked || !draggedWord || !draggedWord.fromColumn) return;
        const { word, fromColumn } = draggedWord;
        setColumnsB(prev => ({ ...prev, [fromColumn]: prev[fromColumn].filter(w => w !== word) }));
        setAvailableWords(prev => [...prev, word]);
        setDraggedWord(null);
    };

    const checkAnswers = () => {
    let correctB = 0;
    let total = exerciseBWords.length;

    // ✅ تحقق إذا في أعمدة فاضية
    const hasEmpty = exerciseBColumns.some(
        (col) => !columnsB[col.id] || columnsB[col.id].length === 0
    );

    if (hasEmpty) {
        ValidationAlert.info();
        return;
    }

    // ✅ حساب الصح
    exerciseBColumns.forEach((col) => {
        const userWords = columnsB[col.id] || [];

        userWords.forEach((word) => {
            if (col.correctWords.includes(word)) {
                correctB++;
            }
        });
    });

    setChecked(true);
    setLocked(true);

    // ✅ الحالات
    if (correctB === total) {
        ValidationAlert.success(`Score: ${correctB}/${total}`);
    } else if (correctB === 0) {
        ValidationAlert.error(`Score: ${correctB}/${total}`);
    } else {
        ValidationAlert.warning(`Score: ${correctB}/${total}`);
    }
};

    const handleShowAnswer = () => {
        const correctB = { oa: [], "o-e": [], ow: [] };
        exerciseBColumns.forEach(col => correctB[col.id] = col.correctWords);
        setColumnsB(correctB);
        setAvailableWords([]);
        setChecked(true);
        setLocked(true);
    };

    const handleTryAgain = () => {
        setAvailableWords(exerciseBWords);
        setColumnsB({ oa: [], "o-e": [], ow: [] });
        setChecked(false);
        setLocked(false);
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <div className="ex-A">B</div>
                <h2 className="header-title-page8">Look, read, and write the words under the correct column.</h2>
            </div>

            <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={returnToPool}
                className="border-2 border-gray-300 rounded-full px-8 py-4 flex flex-wrap justify-center gap-6 mb-12 bg-gray-50 shadow-inner"
            >
                {availableWords.map(word => (
                    <div
                        key={word}
                        draggable={!locked}
                        onDragStart={() => onDragStart(word)}
                        className={`cursor-grab active:cursor-grabbing text-xl font-bold hover:text-blue-600 transition-colors
                            ${locked ? "opacity-50 cursor-not-allowed" : ""}
                        `}
                    >
                        {word}
                    </div>
                ))}
                {availableWords.length === 0 && !locked && <span className="text-gray-400 italic">All words placed!</span>}
            </div>

            {/* Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {exerciseBColumns.map((col) => (
                    <div key={col.id} className="flex flex-col items-center">
                        <img src={col.image} alt={col.title} className="max-w-32 max-h-24 object-contain mb-3" />
                        <span className="font-bold text-2xl mb-6 text-gray-700">{col.title}</span>
                        
                        <div 
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => onDrop(col.id)}
                            className={`w-full flex flex-col gap-3 min-h-[180px] p-4 rounded-xl transition-all
                                ${!locked && "hover:bg-blue-50/50"}
                            `}
                        >
                            {[0, 1, 2].map((idx) => {
                                const word = columnsB[col.id][idx];
                                const isCorrect = word && col.correctWords.includes(word);
                                return (
                                    <div 
                                        key={idx}
                                        draggable={word && !locked}
                                        onDragStart={() => onDragStart(word, col.id)}
                                        className={`h-12 border-b-2 flex items-center justify-center text-xl font-serif italic transition-all
                                            ${!word ? "border-gray-300" : "border-red-400 cursor-grab"}
                                            ${checked && word ? (isCorrect ? "text-green-600" : "text-red-600") : ""}
                                        `}
                                    >
                                        {word}
                                        {checked && word && (
                                            <span className="ml-2 text-sm">{isCorrect ? "✅" : "❌"}</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-16 flex justify-center">
                <Button 
                    handleShowAnswer={handleShowAnswer} 
                    handleStartAgain={handleTryAgain} 
                    checkAnswers={checkAnswers} 
                />
            </div>
        </div>
    );
};

export default WB_Unit7_Page44_Q2;
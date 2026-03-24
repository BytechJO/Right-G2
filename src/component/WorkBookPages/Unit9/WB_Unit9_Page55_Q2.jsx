import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert"; 
import Button from "../button"; 

import img1 from "../../../assets/imgs/test6.png";
import img2 from "../../../assets/imgs/test6.png";
import img3 from "../../../assets/imgs/test6.png";
import img4 from "../../../assets/imgs/test6.png";

const exerciseJData = [
    { id: 1, image: img1, before: "He's", after: "TV.", correct: "watching" },
    { id: 2, image: img2, before: "He's", after: "a book.", correct: "reading" },
    { id: 3, image: img3, before: "She's", after: "her bike.", correct: "riding" },
    { id: 4, image: img4, before: "He's", after: "basketball.", correct: "playing" },
];

const wordBank = ["reading", "watching", "playing", "riding"];

const WB_Unit9_Page55_Q2 = () => {
    const [userAnswers, setUserAnswers] = useState({ 1: "", 2: "", 3: "", 4: "" });
    const [draggedWord, setDraggedWord] = useState(null);
    const [checked, setChecked] = useState(false);
    const [locked, setLocked] = useState(false);

    const onDragStart = (word) => {
        if (locked) return;
        setDraggedWord(word);
    };

    const onDrop = (id) => {
        if (locked || !draggedWord) return;
        setUserAnswers(prev => ({ ...prev, [id]: draggedWord }));
        setDraggedWord(null);
    };

    const checkAnswers = () => {
        let correctCount = 0;
        exerciseJData.forEach(item => {
            if (userAnswers[item.id] === item.correct) correctCount++;
        });

        setChecked(true);
        setLocked(true);

        if (correctCount === exerciseJData.length) {
            ValidationAlert.success(`Excellent! Score: ${correctCount}/${exerciseJData.length}`);
        } else {
            ValidationAlert.error(`Keep trying! Score: ${correctCount}/${exerciseJData.length}`);
        }
    };

    const handleShowAnswer = () => {
        const correctAnswers = {};
        exerciseJData.forEach(item => correctAnswers[item.id] = item.correct);
        setUserAnswers(correctAnswers);
        setChecked(true);
        setLocked(true);
    };

    const handleTryAgain = () => {
        setUserAnswers({ 1: "", 2: "", 3: "", 4: "" });
        setChecked(false);
        setLocked(false);
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="ex-A">J</div>
                <h1 className="header-title-page8">Look and write. Read.</h1>
            </div>

            <div className="mb-12 border-2 border-gray-800 rounded-2xl p-4 flex justify-center gap-8 bg-gray-50 shadow-sm">
                {wordBank.map(word => (
                    <div
                        key={word}
                        draggable={!locked}
                        onDragStart={() => onDragStart(word)}
                        className="px-6 py-2 bg-white border border-gray-300 rounded-xl cursor-grab shadow-sm hover:bg-blue-50 transition-all font-bold text-gray-700 text-lg"
                    >
                        {word}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {exerciseJData.map((item) => (
                    <div key={item.id} className="flex flex-col items-center gap-6">
                        <div className="flex items-start gap-4 w-full">
                            <span className="text-2xl font-bold text-blue-800 w-6">{item.id}</span>
                            
                            <div className="w-48 h-40 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xl font-medium text-gray-800 w-full pl-10">
                            <span>{item.before}</span>
                            <div
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => onDrop(item.id)}
                                className={`min-w-[120px] h-10 border-b-2 flex items-center justify-center transition-all px-2
                                    ${!userAnswers[item.id] ? "border-gray-300 border-dashed" : "border-gray-800"}
                                    ${checked && userAnswers[item.id] === item.correct ? "text-green-600" : ""}
                                    ${checked && userAnswers[item.id] !== item.correct && userAnswers[item.id] !== "" ? "text-red-600" : ""}
                                `}
                            >
                                <span className="font-serif italic font-bold">
                                    {userAnswers[item.id]}
                                </span>
                                {checked && userAnswers[item.id] !== "" && (
                                    <span className="ml-2 text-sm">
                                        {userAnswers[item.id] === item.correct ? "✅" : "❌"}
                                    </span>
                                )}
                            </div>
                            <span>{item.after}</span>
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

export default WB_Unit9_Page55_Q2;
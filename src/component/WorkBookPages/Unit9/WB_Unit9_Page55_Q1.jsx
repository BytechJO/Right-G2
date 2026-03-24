import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert"; 
import Button from "../button"; 

import img1 from "../../../assets/imgs/test6.png";
import img2 from "../../../assets/imgs/test6.png";
import img3 from "../../../assets/imgs/test6.png";
import img4 from "../../../assets/imgs/test6.png";

const exerciseIData = [
    { id: 1, image: img1, correct: "drawing" },
    { id: 2, image: img2, correct: "reading" },
    { id: 3, image: img3, correct: "writing" },
    { id: 4, image: img4, correct: "painting" },
];

const wordBank = ["reading", "writing", "drawing", "painting"];

const WB_Unit9_Page55_Q1 = () => {
    const [userAnswers, setUserAnswers] = useState({ 1: "drawing", 2: "", 3: "", 4: "" }); 
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
        exerciseIData.forEach(item => {
            if (userAnswers[item.id] === item.correct) correctCount++;
        });

        setChecked(true);
        setLocked(true);

        if (correctCount === exerciseIData.length) {
            ValidationAlert.success(`Excellent! Score: ${correctCount}/${exerciseIData.length}`);
        } else {
            ValidationAlert.error(`Keep trying! Score: ${correctCount}/${exerciseIData.length}`);
        }
    };

    const handleShowAnswer = () => {
        const correctAnswers = {};
        exerciseIData.forEach(item => correctAnswers[item.id] = item.correct);
        setUserAnswers(correctAnswers);
        setChecked(true);
        setLocked(true);
    };

    const handleTryAgain = () => {
        setUserAnswers({ 1: "drawing", 2: "", 3: "", 4: "" });
        setChecked(false);
        setLocked(false);
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">

            <div className="flex items-center gap-4 mb-8">
                <div className="ex-A">I</div>
                <h1 className="header-title-page8">Look and write.</h1>
            </div>

            {/* Word Bank */}
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

            {/* Grid of Speech Bubbles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {exerciseIData.map((item) => (
                    <div key={item.id} className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-4 w-full">
                            <span className="text-2xl font-bold text-blue-800 w-6">{item.id}</span>
                            
                            {/* Speech Bubble */}
                            <div className="relative flex-1">
                                <div className="border-2 border-gray-800 rounded-3xl p-4 min-h-[80px] flex items-center gap-2 bg-white shadow-sm">
                                    <span className="text-xl font-bold">I'm</span>
                                    <div
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={() => onDrop(item.id)}
                                        className={`flex-1 h-10 border-b-2 flex items-center justify-center font-serif italic text-xl transition-all
                                            ${!userAnswers[item.id] ? "border-gray-300 border-dashed" : "border-gray-800"}
                                            ${checked && userAnswers[item.id] === item.correct ? "text-green-600" : ""}
                                            ${checked && userAnswers[item.id] !== item.correct && userAnswers[item.id] !== "" ? "text-red-600" : ""}
                                        `}
                                    >
                                        {userAnswers[item.id]}
                                        {checked && userAnswers[item.id] !== "" && (
                                            <span className="ml-2 text-sm">
                                                {userAnswers[item.id] === item.correct ? "✅" : "❌"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {/* Bubble Tail */}
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 border-r-2 border-b-2 border-gray-800 bg-white rotate-45"></div>
                            </div>
                        </div>

                        {/* Image */}
                        <div className="w-48 h-40 rounded-2xl overflow-hidden border border-gray-200 shadow-sm mt-4">
                            <img src={item.image} alt="" className="w-full h-full object-cover" />
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

export default WB_Unit9_Page55_Q1;
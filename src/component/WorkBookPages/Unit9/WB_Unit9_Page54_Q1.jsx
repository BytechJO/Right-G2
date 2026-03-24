import React, { useState, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert"; 
import Button from "../button";

import imgA from "../../../assets/imgs/test6.png";
import imgB from "../../../assets/imgs/test6.png";

const exerciseGData = [
    { id: 1, img: "A", correct: "The man is wearing a hat.", scrambled: ["man", "is", "wearing", "The", "a", "hat."] },
    { id: 1, img: "B", correct: "The man isn't wearing a hat.", scrambled: ["man", "isn't", "wearing", "The", "a", "hat."] },
    { id: 2, img: "A", correct: "The girl is building a sandcastle.", scrambled: ["girl", "is", "building", "The", "a", "sandcastle."] },
    { id: 2, img: "B", correct: "She isn't building a sandcastle. She is eating.", scrambled: ["isn't", "building", "a", "sandcastle.", "She", "is", "eating.", "She"] },
    { id: 3, img: "A", correct: "The boy is holding a bucket.", scrambled: ["boy", "is", "holding", "The", "a", "bucket."] },
    { id: 3, img: "B", correct: "The boy isn't carrying a bucket. He is swimming and waving.", scrambled: ["isn't", "carrying", "a", "bucket.", "The", "boy", "He", "is", "swimming", "and", "waving."] },
    { id: 4, img: "A", correct: "The woman is eating an ice cream.", scrambled: ["woman", "is", "eating", "The", "an", "ice", "cream."] },
    { id: 4, img: "B", correct: "She isn't eating ice cream. She is reading a book.", scrambled: ["isn't", "eating", "ice", "cream.", "She", "She", "is", "reading", "a", "book."] },
    { id: 5, img: "A", correct: "The girl is playing with a doll.", scrambled: ["girl", "is", "playing", "The", "with", "a", "doll."] },
    { id: 5, img: "B", correct: "The girl is playing with a yellow balloon.", scrambled: ["girl", "is", "playing", "The", "with", "a", "yellow", "balloon."] },
];

const WB_Unit9_Page54_Q1 = () => {
    const [userAnswers, setUserAnswers] = useState({});
    const [checked, setChecked] = useState(false);
    const [locked, setLocked] = useState(false);

    // Initialize answers
    useEffect(() => {
        const initial = {};
        exerciseGData.forEach((item, index) => {
            initial[`${item.img}-${item.id}`] = "";
        });
        setUserAnswers(initial);
    }, []);

    const handleWordClick = (key, word) => {
        if (locked) return;
        setUserAnswers(prev => {
            const current = prev[key] || "";
            const newAnswer = current ? `${current} ${word}` : word;
            return { ...prev, [key]: newAnswer };
        });
    };

    const clearAnswer = (key) => {
        if (locked) return;
        setUserAnswers(prev => ({ ...prev, [key]: "" }));
    };

    const checkAnswers = () => {
        let correctCount = 0;
        exerciseGData.forEach((item) => {
            const key = `${item.img}-${item.id}`;
            const userAns = (userAnswers[key] || "").trim().toLowerCase().replace(/\s+/g, ' ');
            const correctAns = item.correct.toLowerCase().replace(/\s+/g, ' ');
            if (userAns === correctAns) {
                correctCount++;
            }
        });

        setChecked(true);
        setLocked(true);

        if (correctCount === exerciseGData.length) {
            ValidationAlert.success(`Excellent! Score: ${correctCount}/${exerciseGData.length}`);
        } else {
            ValidationAlert.error(`Keep trying! Score: ${correctCount}/${exerciseGData.length}`);
        }
    };

    const handleShowAnswer = () => {
        const answers = {};
        exerciseGData.forEach((item) => {
            answers[`${item.img}-${item.id}`] = item.correct;
        });
        setUserAnswers(answers);
        setChecked(true);
        setLocked(true);
    };

    const handleTryAgain = () => {
        const initial = {};
        exerciseGData.forEach((item) => initial[`${item.img}-${item.id}`] = "");
        setUserAnswers(initial);
        setChecked(false);
        setLocked(false);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">

            <div className="flex items-center gap-3 mb-6">
                <div className="ex-A">G</div>
                <h1 className="header-title-page8">What is different? Look and write.</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="relative ">
                    <img src={imgA} alt="Scene A" className="max-w-full max-h-64 object-cover" />
                    <div className="absolute top-2 left-2 bg-white w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-gray-800">A</div>
                </div>
                <div className="relative">
                    <img src={imgB} alt="Scene B" className="max-w-full max-h-64 object-cover" />
                    <div className="absolute top-2 left-2 bg-white w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-gray-800">B</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                
                <div className="flex flex-col gap-8">
                    {exerciseGData.filter(d => d.img === "A").map((item) => {
                        const key = `A-${item.id}`;
                        return (
                            <div key={key} className="flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-gray-600 w-4">{item.id}</span>
                                    <div className="flex-1 min-h-[40px] border-b-2 border-gray-400 font-serif italic text-lg px-2 flex items-center relative">
                                        {userAnswers[key]}
                                        {userAnswers[key] && !locked && (
                                            <button onClick={() => clearAnswer(key)} className="absolute right-0 text-xs text-red-400 hover:text-red-600">clear</button>
                                        )}
                                        {checked && (
                                            <span className="absolute -right-6 text-sm">
                                                {(userAnswers[key] || "").trim().toLowerCase() === item.correct.toLowerCase() ? "✅" : "❌"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 pl-7">
                                    {item.scrambled.map((word, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleWordClick(key, word)}
                                            disabled={locked}
                                            className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm hover:bg-blue-50 hover:border-blue-300 transition-all disabled:opacity-50"
                                        >
                                            {word}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                
                <div className="flex flex-col gap-8">
                    {exerciseGData.filter(d => d.img === "B").map((item) => {
                        const key = `B-${item.id}`;
                        return (
                            <div key={key} className="flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-gray-600 w-4">{item.id}</span>
                                    <div className="flex-1 min-h-[40px] border-b-2 border-gray-400 font-serif italic text-lg px-2 flex items-center relative">
                                        {userAnswers[key]}
                                        {userAnswers[key] && !locked && (
                                            <button onClick={() => clearAnswer(key)} className="absolute right-0 text-xs text-red-400 hover:text-red-600">clear</button>
                                        )}
                                        {checked && (
                                            <span className="absolute -right-6 text-sm">
                                                {(userAnswers[key] || "").trim().toLowerCase() === item.correct.toLowerCase() ? "✅" : "❌"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 pl-7">
                                    {item.scrambled.map((word, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleWordClick(key, word)}
                                            disabled={locked}
                                            className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm hover:bg-red-50 hover:border-red-300 transition-all disabled:opacity-50"
                                        >
                                            {word}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
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

export default WB_Unit9_Page54_Q1;
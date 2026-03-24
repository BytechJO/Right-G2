import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert"; 
import Button from "../button"; 

import img1 from "../../../assets/imgs/test6.png";
import img2 from "../../../assets/imgs/test6.png";
import img3 from "../../../assets/imgs/test6.png";

const exerciseHData = [
    { id: 1, image: img1, correctLetter: "C", correctSentence: "He isn't wearing boots.", options: ["A", "B", "C", "D"] },
    { id: 2, image: img2, correctLetter: "B", correctSentence: "He isn't wearing a purple shirt.", options: ["A", "B", "C", "D"] },
    { id: 3, image: img3, correctLetter: "D", correctSentence: "She isn't holding a doll.", options: ["A", "B", "C", "D"] },
];

const sentenceBank = [
    "He isn't wearing boots.",
    "He isn't wearing a purple shirt.",
    "She isn't holding a doll.",
];

const WB_Unit9_Page54_Q2 = () => {
    const [answers, setAnswers] = useState({
        1: { letter: "C", sentence: "He isn't wearing boots." }, 
        2: { letter: "", sentence: "" },
        3: { letter: "", sentence: "" },
    });
    const [draggedItem, setDraggedItem] = useState(null);
    const [checked, setChecked] = useState(false);
    const [locked, setLocked] = useState(false);

    const onDragStart = (type, value) => {
        if (locked) return;
        setDraggedItem({ type, value });
    };

    const onDrop = (id, targetType) => {
        if (locked || !draggedItem || draggedItem.type !== targetType) return;
        setAnswers(prev => ({
            ...prev,
            [id]: { ...prev[id], [targetType]: draggedItem.value }
        }));
        setDraggedItem(null);
    };

    const checkAnswers = () => {
        let correctCount = 0;
        exerciseHData.forEach(item => {
            if (answers[item.id].letter === item.correctLetter && 
                answers[item.id].sentence === item.correctSentence) {
                correctCount++;
            }
        });

        setChecked(true);
        setLocked(true);

        if (correctCount === exerciseHData.length) {
            ValidationAlert.success(`Excellent! Score: ${correctCount}/${exerciseHData.length}`);
        } else {
            ValidationAlert.error(`Keep trying! Score: ${correctCount}/${exerciseHData.length}`);
        }
    };

    const handleShowAnswer = () => {
        const correctOnes = {};
        exerciseHData.forEach(item => {
            correctOnes[item.id] = { letter: item.correctLetter, sentence: item.correctSentence };
        });
        setAnswers(correctOnes);
        setChecked(true);
        setLocked(true);
    };

    const handleTryAgain = () => {
        setAnswers({ 1: { letter: "C", sentence: "He isn't wearing boots." }, 2: { letter: "", sentence: "" }, 3: { letter: "", sentence: "" } });
        setChecked(false);
        setLocked(false);
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="ex-A">H</div>
                <h1 className="header-title-page8">Which one is different? Look and write.</h1>
            </div>

            {/* Sentence Bank */}
            <div className="mb-10 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex flex-wrap justify-center gap-4">
                {sentenceBank.map((s, i) => (
                    <div
                        key={i}
                        draggable={!locked}
                        onDragStart={() => onDragStart("sentence", s)}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-grab shadow-sm hover:bg-blue-50 transition-all font-serif italic"
                    >
                        {s}
                    </div>
                ))}
            </div>

            {/* Exercise Rows */}
            <div className="flex flex-col gap-4">
                {exerciseHData.map((item) => (
                    <div key={item.id} className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex items-center gap-4">
                            <span className="text-2xl font-bold text-blue-800 w-6">{item.id}</span>
                            <div className="border-2 border-gray-800 rounded-2xl p-4 bg-white shadow-sm">
                                <img src={item.image} alt="" className="max-h-20 object-contain" />
                                <div className="flex justify-around mt-2 font-bold text-gray-600">
                                    {item.options.map(opt => (
                                        <span 
                                            key={opt} 
                                            draggable={!locked}
                                            onDragStart={() => onDragStart("letter", opt)}
                                            className="cursor-grab hover:text-blue-600"
                                        >
                                            {opt}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 flex-1 w-full">
                            {/* Letter Drop Zone */}
                            <div
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => onDrop(item.id, "letter")}
                                className={`w-12 h-12 border-2 rounded-xl flex items-center justify-center font-bold text-xl transition-all
                                    ${!answers[item.id].letter ? "border-gray-300 border-dashed" : "border-gray-800 bg-gray-50"}
                                    ${checked && answers[item.id].letter === item.correctLetter ? "text-green-600 border-green-500" : ""}
                                    ${checked && answers[item.id].letter !== item.correctLetter && answers[item.id].letter !== "" ? "text-red-600 border-red-500" : ""}
                                `}
                            >
                                {answers[item.id].letter}
                            </div>

                            <div
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => onDrop(item.id, "sentence")}
                                className={`flex-1 h-12 border-b-2 flex items-center px-4 font-serif italic text-lg transition-all
                                    ${!answers[item.id].sentence ? "border-gray-300 border-dashed" : "border-gray-800"}
                                    ${checked && answers[item.id].sentence === item.correctSentence ? "text-green-600" : ""}
                                    ${checked && answers[item.id].sentence !== item.correctSentence && answers[item.id].sentence !== "" ? "text-red-600" : ""}
                                `}
                            >
                                {answers[item.id].sentence}
                                {checked && answers[item.id].sentence !== "" && (
                                    <span className="ml-auto text-sm">
                                        {answers[item.id].sentence === item.correctSentence ? "✅" : "❌"}
                                    </span>
                                )}
                            </div>
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

export default WB_Unit9_Page54_Q2;
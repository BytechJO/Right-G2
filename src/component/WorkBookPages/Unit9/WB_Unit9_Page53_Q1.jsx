import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../button";

import img1 from "../../../assets/imgs/test6.png";
import img2 from "../../../assets/imgs/test6.png";
import img3 from "../../../assets/imgs/test6.png";
import img4 from "../../../assets/imgs/test6.png";
import img5 from "../../../assets/imgs/test6.png";

const exerciseData = [
    { id: 1, name: "", before: "", after: "a song.", correct: "She is singing", image: img1 },
    { id: 2, name: "", before: "", after: "dinner.", correct: "she is cooking", image: img2 },
    { id: 3, name: " ", before: "", after: "sunglasses.", correct: "They are wearing", image: img3 },
    { id: 4, name: "", before: "", after: "a horse.", correct: "They are riding", image: img4 },
    { id: 5, name: "", before: "", after: "sandwiches.", correct: "They are eating", image: img5 },
];

const wordBank = [
    "She is singing",
    "she is cooking",
    "They are wearing",
    "They are riding",
    "They are eating"
];

const WB_Unit9_Page53_Q2 = () => {
    const [userAnswers, setUserAnswers] = useState({
        1: "She is singing", 
        2: "",
        3: "",
        4: "",
        5: ""
    });
    const [draggedWord, setDraggedWord] = useState(null);
    const [checked, setChecked] = useState(false);
    const [locked, setLocked] = useState(false);

    const onDragStart = (word) => {
        if (locked) return;
        setDraggedWord(word);
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const onDrop = (id) => {
        if (locked || !draggedWord) return;
        setUserAnswers((prev) => ({
            ...prev,
            [id]: draggedWord,
        }));
        setDraggedWord(null);
    };

    const handleWordClick = (word) => {
        if (locked) return;
        // البحث عن أول فراغ متاح
        const firstEmptyId = Object.keys(userAnswers).find(id => userAnswers[id] === "" && id !== "1");
        if (firstEmptyId) {
            setUserAnswers(prev => ({ ...prev, [firstEmptyId]: word }));
        }
    };

    const checkAnswers = () => {
        let correctCount = 0;
        exerciseData.forEach((item) => {
            if (userAnswers[item.id] === item.correct) {
                correctCount++;
            }
        });

        setChecked(true);
        setLocked(true);

        if (correctCount === exerciseData.length) {
            ValidationAlert.success(`Excellent! Score: ${correctCount} / ${exerciseData.length}`);
        } else {
            ValidationAlert.error(`Keep trying! Score: ${correctCount} / ${exerciseData.length}`);
        }
    };

    const handleShowAnswer = () => {
        const answers = {};
        exerciseData.forEach((item) => {
            answers[item.id] = item.correct;
        });
        setUserAnswers(answers);
        setChecked(true);
        setLocked(true);
    };

    const handleTryAgain = () => {
        setUserAnswers({ 1: "She is singing", 2: "", 3: "", 4: "", 5: "" });
        setChecked(false);
        setLocked(false);
        setDraggedWord(null);
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">


            <div className="flex items-center gap-3 mb-6">
                <div className="ex-A">D</div>
                <h1 className="header-title-page8">Look and write.</h1>
            </div>

            <div className="mb-12 border-2 border-gray-800 rounded-xl overflow-hidden shadow-sm">
                <div className="grid grid-cols-3 divide-x-2 divide-gray-800">
                    <div className="p-4 flex flex-col gap-2">
                        <div className="flex justify-between text-xl font-medium"><span>ride</span> <span>-</span> <span className="text-blue-700">riding</span></div>
                        <div className="flex justify-between text-xl font-medium"><span>wear</span> <span>-</span> <span className="text-blue-700">wearing</span></div>
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                        <div className="flex justify-between text-xl font-medium"><span>eat</span> <span>-</span> <span className="text-blue-700">eating</span></div>
                        <div className="flex justify-between text-xl font-medium"><span>iron</span> <span>-</span> <span className="text-blue-700">ironing</span></div>
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                        <div className="flex justify-between text-xl font-medium"><span>cook</span> <span>-</span> <span className="text-blue-700">cooking</span></div>
                        <div className="flex justify-between text-xl font-medium"><span>sing</span> <span>-</span> <span className="text-blue-700">singing</span></div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-12 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                {wordBank.map((word) => (
                    <div
                        key={word}
                        draggable={!locked}
                        onDragStart={() => onDragStart(word)}
                        onClick={() => handleWordClick(word)}
                        className={`px-6 py-2 bg-white border-2 border-blue-400 text-blue-700 font-bold rounded-lg cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-all text-lg
                            ${locked ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-50"}
                        `}
                    >
                        {word}
                    </div>
                ))}
            </div>

            {/* Sentences Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                {exerciseData.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-blue-800 w-6">{item.id}</span>

                        <div className="flex items-center gap-4 w-full">
                            
                            <div className="w-24 h-20 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0 shadow-sm">
                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-xl font-medium text-gray-800 w-full">
                                <span>{item.name}</span>
                                <div
                                    onDragOver={onDragOver}
                                    onDrop={() => onDrop(item.id)}
                                    className={`min-w-[140px] h-10 border-b-2 flex items-center justify-center transition-all px-2
                                        ${!userAnswers[item.id] ? "border-gray-300 border-dashed" : "border-gray-800"}
                                        ${checked && userAnswers[item.id] === item.correct ? "text-green-600" : ""}
                                        ${checked && userAnswers[item.id] !== item.correct && userAnswers[item.id] !== "" ? "text-red-600" : ""}
                                        ${!locked && "hover:bg-blue-50"}
                                    `}
                                >
                                    <span className="font-bold">
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
                    </div>
                ))}
            </div>

            {/* Controls */}
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

export default WB_Unit9_Page53_Q2;
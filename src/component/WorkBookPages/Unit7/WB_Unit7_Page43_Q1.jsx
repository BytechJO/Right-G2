import React, { useState } from "react";
import ValidationAlert from '../../Popup/ValidationAlert';
import Button from '../button';
import squirrelImg from "../../../assets/imgs/test6.png";

const exerciseData = [
    {
        id: 1,
        clue: "It's the second month in a year.",
        correctAnswer: "February",
    },
    {
        id: 2,
        clue: "It's the third day in the week.",
        correctAnswer: "Tuesday",
    },
    {
        id: 3,
        clue: "It's the eleventh month in the year.",
        correctAnswer: "November",
    },
    {
        id: 4,
        clue: "It's the seventh day in the week.",
        correctAnswer: "Saturday",
    },
];

const wordsToDrag = ["February", "Tuesday", "November", "Saturday"];

const LookReadWriteExercise = () => {
    const [userAnswers, setUserAnswers] = useState({
        1: "",
        2: "",
        3: "",
        4: "",
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

    const checkAnswers = () => {
        const values = Object.values(userAnswers);

        // ✅ إذا في حقول فاضية
        const hasEmpty = values.some((val) => !val || val.trim() === "");
        if (hasEmpty) {
            ValidationAlert.info();
            return;
        }

        let correctCount = 0;

        exerciseData.forEach((item) => {
            if (userAnswers[item.id] === item.correctAnswer) {
                correctCount++;
            }
        });

        setChecked(true);
        setLocked(true);

        const total = exerciseData.length;
        if (correctCount === total) {
            ValidationAlert.success(`Score: ${correctCount} / ${total}`);
        }
        else if (correctCount === 0) {
            ValidationAlert.error(`Score: ${correctCount} / ${total}`);
        }
        else {
            ValidationAlert.warning(`Score: ${correctCount} / ${total}`);
        }
    };

    const handleShowAnswer = () => {
        const answers = {};
        exerciseData.forEach((item) => {
            answers[item.id] = item.correctAnswer;
        });
        setUserAnswers(answers);
        setChecked(true);
        setLocked(true);
    };

    const handleTryAgain = () => {
        setUserAnswers({ 1: "", 2: "", 3: "", 4: "" });
        setChecked(false);
        setLocked(false);
        setDraggedWord(null);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto ">
            <div className="flex items-center gap-4 mb-10">
                <div className="ex-A">I</div>
                <h1 className="header-title-page8">Look, read the clue, and write.</h1>
            </div>

            {/* قائمة الكلمات القابلة للسحب */}
            <div className="flex flex-wrap justify-center gap-6 max-w-155 mb-10 p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                {wordsToDrag
                    .filter((word) => !Object.values(userAnswers).includes(word))
                    .map((word) => (
                        <div
                            key={word}
                            draggable={!locked}
                            onDragStart={() => onDragStart(word)}
                            className={`px-4 py-2 bg-white border-2 border-blue-400 text-blue-700 font-bold rounded-full cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-all text-xl
                            ${locked ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-50"}
                        `}
                        >
                            {word}
                        </div>
                    ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-7">
                {exerciseData.map((item) => (
                    <div key={item.id} className="flex items-start gap-6 relative">

                        <div className="flex flex-col items-center">

                            <div className="relative mb-4">
                                <div className="bg-white border-2 border-gray-300 p-4 rounded-lg shadow-sm max-w-[220px] text-center font-medium text-lg leading-tight mb-2">
                                    {item.clue}
                                </div>
                                <img src={squirrelImg} alt="squirrel" className="max-w-32 max-h-32 object-contain mx-auto" />
                            </div>

                            {/* منطقة الإسقاط */}
                            <div
                                onDragOver={onDragOver}
                                onDrop={() => onDrop(item.id)}
                                className={`w-full min-w-[180px] h-12 border-b-2 flex items-center justify-center transition-all
                                    ${!userAnswers[item.id] ? "border-gray-400 border-dashed" : "border-red-500"}
                                    ${checked && userAnswers[item.id] === item.correctAnswer ? "text-green-600" : "text-red-600"}
                                    ${!locked && "hover:bg-blue-50"}
                                `}
                            >
                                <span className="text-2xl font-bold font-serif italic">
                                    {userAnswers[item.id]}
                                </span>
                                {checked && (
                                    <span className="ml-2">
                                        {userAnswers[item.id] === item.correctAnswer ? "✅" : "❌"}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-20 flex justify-center">
                <Button
                    handleShowAnswer={handleShowAnswer}
                    handleStartAgain={handleTryAgain}
                    checkAnswers={checkAnswers}
                />
            </div>
        </div>
    );
};

export default LookReadWriteExercise;
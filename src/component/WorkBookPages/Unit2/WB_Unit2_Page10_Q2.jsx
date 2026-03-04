import React, { useState } from "react";
import img from "../../../assets/imgs/test6.png";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../button";

const exerciseData = [
    {
        id: 1,
        scrambled: "this a Is bird?",
        correctQuestion: "Is this a bird?",
        options: ["Yes, it is.", "No, it isn't."],
        correctOption: "No, it isn't.",
        image: img,
    },
    {
        id: 2,
        scrambled: "these Are dogs?",
        correctQuestion: "Are these dogs?",
        options: ["Yes, they are.", "No, they aren't."],
        correctOption: "No, they aren't.",
        image: img,
    },
    {
        id: 3,
        scrambled: "clouds those Are?",
        correctQuestion: "Are those clouds?",
        options: ["Yes, they are.", "No, they aren't."],
        correctOption: "Yes, they are.",
        image: img,
    },
    {
        id: 4,
        scrambled: "pond a that Is?",
        correctQuestion: "Is that a pond?",
        options: ["Yes, it is.", "No, it isn't."],
        correctOption: "No, it isn't.",
        image: img,
    },
];

const WB_Unit2_Page10_Q2 = () => {
    const [userAnswers, setUserAnswers] = useState(
        exerciseData.reduce((acc, item) => {
            acc[item.id] = { question: "", selectedOption: null };
            return acc;
        }, {})
    );
    const [checked, setChecked] = useState(false);
    const [locked, setLocked] = useState(false);

    const handleInputChange = (id, value) => {
        if (locked) return;
        setUserAnswers((prev) => ({
            ...prev,
            [id]: { ...prev[id], question: value },
        }));
    };

    const handleOptionClick = (id, option) => {
        if (locked) return;
        setUserAnswers((prev) => ({
            ...prev,
            [id]: { ...prev[id], selectedOption: option },
        }));
    };

    const checkAnswers = () => {
        let correctCount = 0;
        let totalItems = exerciseData.length * 2;

        exerciseData.forEach((item) => {
            const userAns = userAnswers[item.id];
            if (userAns.question.trim().toLowerCase() === item.correctQuestion.toLowerCase()) {
                correctCount++;
            }
            if (userAns.selectedOption === item.correctOption) {
                correctCount++;
            }
        });

        setChecked(true);

        if (correctCount === totalItems) {
            ValidationAlert.success(`Score: ${correctCount}/${totalItems}`);
        } else {
            ValidationAlert.error(`Score: ${correctCount}/${totalItems}`);
        }
    };

    const handleShowAnswer = () => {
        const answers = {};
        exerciseData.forEach((item) => {
            answers[item.id] = {
                question: item.correctQuestion,
                selectedOption: item.correctOption,
            };
        });
        setUserAnswers(answers);
        setChecked(true);
    };

    const handleTryAgain = () => {
        setUserAnswers(
            exerciseData.reduce((acc, item) => {
                acc[item.id] = { question: "", selectedOption: null };
                return acc;
            }, {})
        );
        setChecked(false);
        setLocked(false);
    };

    return (
        <div className="p-6 max-w-5xl mx-auto bg-white rounded-xl">
            <div className="flex items-center gap-4 mb-8">
                <div className="ex-A">D</div>
                <h1 className="header-title-page8">Unscramble, look, write, and answer.</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {exerciseData.map((item) => (
                    <div key={item.id} className="flex flex-col gap-4 relative">
                        <div className="flex items-start gap-3">
                            <span className="text-blue-700 font-bold text-xl">{item.id}</span>
                            <p className="text-lg text-gray-700 font-medium">{item.scrambled}</p>
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                value={userAnswers[item.id].question}
                                onChange={(e) => handleInputChange(item.id, e.target.value)}
                                disabled={locked}
                                placeholder="Write the question here..."
                                className={`w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-1 px-2 text-lg transition-colors
                                    ${checked && userAnswers[item.id].question.trim().toLowerCase() !== item.correctQuestion.toLowerCase() ? "text-red-500 border-red-300" : ""}
                                    ${checked && userAnswers[item.id].question.trim().toLowerCase() === item.correctQuestion.toLowerCase() ? "text-green-600 border-green-300" : ""}
                                `}
                            />
                            {checked && (
                                <span className="absolute right-0 top-1">
                                    {userAnswers[item.id].question.trim().toLowerCase() === item.correctQuestion.toLowerCase() ? "✅" : "❌"}
                                </span>
                            )}
                        </div>

                        <div className="flex justify-between items-center mt-2">
                            <div className="flex flex-col gap-2">
                                {item.options.map((option) => (
                                    <div
                                        key={option}
                                        onClick={() => handleOptionClick(item.id, option)}
                                        className={`cursor-pointer px-4 py-1 rounded-full border-2 transition-all text-lg
                                            ${userAnswers[item.id].selectedOption === option ? "border-gray-500 bg-gray-50" : "border-transparent hover:bg-gray-50"}
                                        `}
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                            <div className="w-32 h-32 flex items-center justify-center">
                                <img src={item.image} alt="exercise" className="max-w-full max-h-full object-contain" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 flex justify-center">
                <Button 
                    handleShowAnswer={handleShowAnswer} 
                    handleStartAgain={handleTryAgain} 
                    checkAnswers={checkAnswers} 
                />
            </div>
        </div>
    );
};

export default WB_Unit2_Page10_Q2;
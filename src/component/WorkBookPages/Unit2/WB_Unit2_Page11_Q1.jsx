import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../button";
import img from "../../../assets/imgs/test6.png";
// بيانات التمرين
const exerciseData = [
    { id: 1, questionText: "Is that a duck?", correctQuestion: "yes, it is.", correctOption: "option1", src: img },
    { id: 2, questionText: "Is that a bird?", correctQuestion: "No, it isn't", correctOption: "option2", src: img },
    { id: 3, questionText: "Is that a sun?", correctQuestion: "No, it isn't", correctOption: "option1", src: img },
    { id: 4, questionText: "Is that a flower?", correctQuestion: "No, it isn't", correctOption: "option2", src: img },
    { id: 5, questionText: "Is that a pond?", correctQuestion: "yes, it is.", correctOption: "option1", src: img },
];

const WB_Unit2_Page11_Q1 = () => {
    const [userAnswers, setUserAnswers] = useState(
        exerciseData.reduce((acc, item) => {
            acc[item.id] = { question: "", selectedOption: null };
            return acc;
        }, {})
    );
    const [checked, setChecked] = useState(false);
    const [locked, setLocked] = useState(false);

    // Function للتحقق من الإجابات
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
        <div className="max-w-xl mx-auto p-6 rounded-md">
            <div className="flex items-center gap-4 mb-8">
                <div className="ex-A">E</div>
                <h1 className="header-title-page8">Look and answer the questions.</h1>
            </div>

            {exerciseData.map((item) => (
                <div key={item.id} className="mb-6 flex items-center gap-4">

                    <div className="flex-1">
                        <label className="block text-lg font-medium mb-2">{item.id}. {item.questionText}</label>
                        <input
                            type="text"
                            disabled={locked}
                            value={userAnswers[item.id].question}
                            onChange={(e) =>
                                setUserAnswers({
                                    ...userAnswers,
                                    [item.id]: { ...userAnswers[item.id], question: e.target.value },
                                })
                            }
                            className="w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="____________________________________________________________________"
                        />
                    </div>
                    <img
                        src={item.src}
                        className="max-w-20 max-h-20 object-cover rounded-md border"
                    />
                </div>
            ))}
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

export default WB_Unit2_Page11_Q1;
import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../button";

import placeholderImg from "../../../assets/imgs/test6.png";

const QUESTIONS = [
    {
        id: 1,
        image: placeholderImg,
        options: ["eats breakfast", "sleeps"],
        correct: "eats breakfast",
    },
    {
        id: 2,
        image: placeholderImg,
        options: ["does homework", "makes bed"],
        correct: "does homework",
    },
    {
        id: 3,
        image: placeholderImg,
        options: ["gets up", "goes to school"],
        correct: "gets up",
    },
];

const WB_Unit6_Page34_Q2 = () => {
    const [answers, setAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSelect = (questionId, option) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: option,
        }));
    };

    const checkAnswers = () => {
        if (Object.keys(answers).length !== QUESTIONS.length) {
            ValidationAlert.info();
            return;
        }

        let score = 0;

        QUESTIONS.forEach((q) => {
            if (answers[q.id] === q.correct) score++;
        });

        const message = `Your score: ${score} / ${QUESTIONS.length}`;

        if (score === QUESTIONS.length) {
            ValidationAlert.success(message);
        } else if (score === 0) {
            ValidationAlert.error(message);
        } else {
            ValidationAlert.warning(message);
        }

        setIsSubmitted(true);
    };

    return (
        <>
            <div className="flex items-center gap-4 mt-10 ml-70">
                <div className="ex-A">D</div>
                <h1 className="header-title-page8">Look, read, and circle.</h1>
            </div>
            <div className="p-6 max-w-4xl mx-auto">

                <div className="space-y-6">
                    {QUESTIONS.map((q) => (
                        <div
                            key={q.id}
                            className="flex items-center gap-6 p-4"
                        >
                            <img
                                src={q.image}
                                alt="question"
                                className="max-w-32 max-h-24 object-cover rounded-lg"
                            />

                            <div className="flex flex-col gap-3">
                                {q.options.map((opt) => {
                                    const isSelected = answers[q.id] === opt;
                                    const isCorrect = opt === q.correct;

                                    return (
                                        <button
                                            key={opt}
                                            onClick={() => handleSelect(q.id, opt)}
                                            className={`px-4 py-2 rounded-lg  transition
                    ${isSubmitted
                                                    ? isCorrect
                                                        ? "border-blue-500 bg-blue-100"
                                                        : isSelected
                                                            ? "border-blue-500 bg-blue-100"
                                                            : "border-blue-300"
                                                    : isSelected
                                                        ? "border-blue-500 bg-blue-100"
                                                        : "border-blue-300"
                                                }`}
                                        >
                                            {opt}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8">
                    <Button
                        checkAnswers={checkAnswers}
                        handleStartAgain={() => {
                            setAnswers({});
                            setIsSubmitted(false);
                        }}
                        handleShowAnswer={() => {
                            const correct = {};
                            QUESTIONS.forEach((q) => {
                                correct[q.id] = q.correct;
                            });
                            setAnswers(correct);
                            setIsSubmitted(true);
                        }}
                    />
                </div>
            </div>
        </>

    );
};

export default WB_Unit6_Page34_Q2;
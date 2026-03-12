import { useState } from "react";
import Button from "../button";
import ValidationAlert from "../../Popup/ValidationAlert";

export default function WB_Unit5_Page30_Q2() {
    const [answers, setAnswers] = useState({});

    const questions = [
        {
            id: 1,
            text: "Megan’s dad likes ...",
            options: ["candy", "pasta", "bread"],
        },
        {
            id: 2,
            text: "Megan doesn’t like ...",
            options: ["vegetables", "bread", "fish"],
        },
        {
            id: 3,
            text: "Megan’s mom likes ...",
            options: ["meat", "soda", "vegetables"],
        },
        {
            id: 4,
            text: "Megan’s brother doesn’t like ...",
            options: ["candy", "nuts", "burgers"],
        },
    ];

    const handleSelect = (qId, option) => {
        setAnswers((prev) => {
            const current = prev[qId] || [];

            if (current.includes(option)) {
                return {
                    ...prev,
                    [qId]: current.filter((o) => o !== option)
                };
            } else {
                return {
                    ...prev,
                    [qId]: [...current, option]
                };
            }
        });
    };
    const correctAnswers = {
        1: ["pasta", "bread"],
        2: ["bread", "fish"],
        3: ["meat", "vegetables"],
        4: ["candy", "burgers"],
    };

    const [showAnswers, setShowAnswers] = useState(false);
    const [score, setScore] = useState(null);

    const checkAnswers = () => {
        const totalQuestions = questions.length;
        const answeredQuestions = Object.keys(answers).length;

        if (answeredQuestions < totalQuestions) {
            ValidationAlert.warning(
                "Please complete all sentences before checking your answers."
            );
            return;
        }

        let correct = 0;

        questions.forEach((q) => {
            const userAnswer = answers[q.id] || [];
            const correctAnswer = correctAnswers[q.id];

            const isCorrect =
                userAnswer.length === correctAnswer.length &&
                correctAnswer.every((ans) => userAnswer.includes(ans));

            if (isCorrect) correct++;
        });

        if (correct === totalQuestions) {
            ValidationAlert.success(`Score: ${correct}/${totalQuestions}`);
        } else {
            ValidationAlert.error(`Score: ${correct}/${totalQuestions}`);
        }

        setScore(correct);
    };

    const handleShowAnswer = () => {
        setAnswers(correctAnswers);
        setShowAnswers(true);
    };

    const handleStartAgain = () => {
        setAnswers({});
        setScore(null);
        setShowAnswers(false);
    };

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">

            <div className="flex items-center gap-4 mb-8">
                <span className="ex-A">H</span>
                <h1 className="header-title-page8">Look, read, and circle</h1>
            </div>

            <p className="text-gray-700 leading-relaxed">
                Megan likes fruit, vegetables, and milk. She doesn’t like bread or fish.
                Her mom likes meat and vegetables. She doesn’t like candy, fruit, or
                soda. Her dad likes pasta, chicken, and bread. He doesn’t like coffee,
                tea, or milk. Megan’s brother, Jimmy, likes vegetables, nuts, and soup.
                He doesn’t like candy, burgers, or fruit.
            </p>

            <div className="space-y-4">
                {questions.map((q) => (
                    <div key={q.id} className="p-3 rounded-lg">

                        <p className="font-medium mb-2">
                            {q.id}. {q.text} 
                            {q.options.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => handleSelect(q.id, opt)}
                                    className={`lg:ml-10 px-3 py-1 border rounded-full transition
                    ${answers[q.id]?.includes(opt)
                                            ? "bg-blue-500 text-white border-blue-500"
                                            : "bg-white hover:bg-blue-100"
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </p>
                    </div>
                ))}
            </div>

            <Button
                handleShowAnswer={handleShowAnswer}
                handleStartAgain={handleStartAgain}
                checkAnswers={checkAnswers} />

        </div>
    );
}
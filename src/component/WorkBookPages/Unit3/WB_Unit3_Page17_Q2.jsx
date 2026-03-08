import React, { useState } from 'react';

// استيراد مكونات الأزرار والتنبيهات
import Button from '../button';
import ValidationAlert from '../../Popup/ValidationAlert';

// بيانات التمرين
const unscrambleQuestions = [
    { id: 'u1', scrambled: 'aekt a tpoho', correctAnswer: 'take a photo' },
    { id: 'u2', scrambled: 'kema a chasdiwn', correctAnswer: 'make a sandwich' },
    { id: 'u3', scrambled: 'deri a ekib', correctAnswer: 'ride a bike' },
    { id: 'u4', scrambled: 'lyf a tiek', correctAnswer: 'fly a kite' },
    { id: 'u5', scrambled: 'chneb', correctAnswer: 'bench' },
    { id: 'u6', scrambled: 'lyap het mrud', correctAnswer: 'play the drum' },
];

const WB_Unit3_Page17_Q2 = () => {
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    const handleInputChange = (qId, value) => {
        setAnswers(prev => ({ ...prev, [qId]: value }));
        setShowResults(false);
    };

    const getInputClass = (qId) => {
        if (!showResults || !answers[qId]) return 'border-gray-300';
        return answers[qId].trim().toLowerCase() === unscrambleQuestions.find(q => q.id === qId).correctAnswer ? 'border-green-500' : 'border-red-500';
    };

    const handleShowAnswer = () => {
        const correctAns = {};
        unscrambleQuestions.forEach(q => {
            correctAns[q.id] = q.correctAnswer;
        });
        setAnswers(correctAns);
        setShowResults(true);
    };

    const handleStartAgain = () => {
        setAnswers({});
        setShowResults(false);
    };

    const checkAnswers = () => {
        setShowResults(true);
        let score = 0;
        unscrambleQuestions.forEach(q => {
            if (answers[q.id]?.trim().toLowerCase() === q.correctAnswer) {
                score++;
            }
        });

        if (score === unscrambleQuestions.length) {
            ValidationAlert.success(`Score: ${score} / ${unscrambleQuestions.length}`);
        } else if (score > 0) {
            ValidationAlert.error(`Score: ${score} / ${unscrambleQuestions.length}`);
        } else {
            ValidationAlert.warning("No matches. Try again.");
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto font-sans mt-8">
            <div className="flex items-center gap-4 mb-6">
                <span className="ex-A">F</span>
                <h1 className="header-title-page8">Unscramble and write.</h1>
            </div>

            <div className="space-y-4">
                {unscrambleQuestions.map((q, index) => (
                    <div key={q.id} className="grid grid-cols-[auto_1fr_2fr] items-baseline gap-x-4">
                        <span className="font-bold text-blue-600">{index + 1}</span>
                        <span className="text-gray-500 text-lg">{q.scrambled}</span>
                        <input
                            type="text"
                            value={answers[q.id] || ''}
                            onChange={(e) => handleInputChange(q.id, e.target.value)}
                            className={`w-full bg-transparent border-b-2 pb-1 focus:outline-none transition-colors text-lg ${getInputClass(q.id)}`}
                        />
                    </div>
                ))}
            </div>

            <div className='mt-10 flex justify-center'>
                <Button handleShowAnswer={handleShowAnswer} handleStartAgain={handleStartAgain} checkAnswers={checkAnswers} />
            </div>
        </div>
    );
};

export default WB_Unit3_Page17_Q2;

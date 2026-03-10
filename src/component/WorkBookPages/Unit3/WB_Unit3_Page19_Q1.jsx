import React, { useState } from 'react';

import placeholderImg from '../../../assets/imgs/test6.png';
import Button from '../button';
import ValidationAlert from '../../Popup/ValidationAlert';

const fillInQuestions = [
    { id: 'i1', img: placeholderImg, startText: 'Can it', endText: 'fly?', answer: 'No, it can\'t.', correctAnswer: 'it' },
    { id: 'i2', img: placeholderImg, startText: 'Can', endText: 'run?', answer: 'Yes, they can.', correctAnswer: 'they' },
    { id: 'i3', img: placeholderImg, startText: 'Can', endText: 'walk?', answer: 'No, they can\'t.', correctAnswer: 'they' },
    { id: 'i4', img: placeholderImg, startText: 'Can', endText: 'swim?', answer: 'Yes, it can.', correctAnswer: 'it' },
];

const WB_Unit3_Page19_Q1 = () => {
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    const handleInputChange = (qId, value) => {
        setAnswers(prev => ({ ...prev, [qId]: value }));
        setShowResults(false);
    };

    const getInputClass = (qId) => {
        if (!showResults || !answers[qId]) return 'border-gray-300';
        return answers[qId].trim().toLowerCase() === fillInQuestions.find(q => q.id === qId).correctAnswer ? 'border-green-500' : 'border-red-500';
    };

    const handleShowAnswer = () => {
        const correctAns = {};
        fillInQuestions.forEach(q => {
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
        fillInQuestions.forEach(q => {
            if (answers[q.id]?.trim().toLowerCase() === q.correctAnswer) {
                score++;
            }
        });

        if (score === fillInQuestions.length) {
            ValidationAlert.success(`Score: ${score} / ${fillInQuestions.length}`);
        } else if (score > 0) {
            ValidationAlert.error(`Score: ${score} / ${fillInQuestions.length}`);
        } else {
            ValidationAlert.warning("No matches. Try again.");
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto font-sans">
            <div className="flex items-center gap-4 mb-6">
                <span className="ex-A">I</span>
                <h1 className="header-title-page8">Look, read, and write.</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {fillInQuestions.map((q, index) => (
                    <div key={q.id} className="space-y-2">
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-blue-600">{index + 1}</span>
                            <img src={q.img} alt={`Question ${index + 1}`} className="max-w-20 max-h-20" />
                            <div className="flex items-baseline gap-2 text-lg">
                                <span>{q.startText}</span>
                                <input
                                    type="text"
                                    value={answers[q.id] || ''}
                                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                                    className={`w-16 text-center bg-transparent border-b-2 pb-1 focus:outline-none transition-colors ${getInputClass(q.id)}`}
                                />
                                <span>{q.endText}</span>
                            </div>
                        </div>
                        <p className="ml-12 text-gray-600">{q.answer}</p>
                    </div>
                ))}
            </div>

                <Button handleShowAnswer={handleShowAnswer} handleStartAgain={handleStartAgain} checkAnswers={checkAnswers} />
            
        </div>
    );
};

export default WB_Unit3_Page19_Q1;

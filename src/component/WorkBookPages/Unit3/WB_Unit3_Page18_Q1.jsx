import React, { useState } from 'react';

import placeholderImg from '../../../assets/imgs/test6.png';

import Button from '../button';
import ValidationAlert from '../../Popup/ValidationAlert';

// بيانات التمرين
const writeQuestions = [
    { id: 'g1', img: placeholderImg, prompt: 'I can fly a kite.', correctAnswer: 'I can fly a kite.' },
    { id: 'g2', img: placeholderImg, prompt: 'can', correctAnswer: 'I can paint a picture.' },
    { id: 'g3', img: placeholderImg, prompt: 'can', correctAnswer: 'I can climb a tree.' },
    { id: 'g4', img: placeholderImg, prompt: 'can\'t', correctAnswer: 'I can\'t ride a bike.' },
    { id: 'g5', img: placeholderImg, prompt: 'can', correctAnswer: 'I can sleep.' },
    { id: 'g6', img: placeholderImg, prompt: 'can\'t', correctAnswer: 'It can\'t swim.' },
];

const WB_Unit3_Page18_Q1 = () => {
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    const handleInputChange = (qId, value) => {
        setAnswers(prev => ({ ...prev, [qId]: value }));
        setShowResults(false);
    };

    const getInputClass = (qId) => {
        if (!showResults || !answers[qId]) return 'border-gray-300';
        // إزالة النقطة من نهاية الجملة للمقارنة
        const userAnswer = answers[qId].trim().toLowerCase().replace(/\.$/, '');
        const correctAnswer = writeQuestions.find(q => q.id === qId).correctAnswer.toLowerCase().replace(/\.$/, '');
        return userAnswer === correctAnswer ? 'border-green-500' : 'border-red-500';
    };

    const handleShowAnswer = () => {
        const correctAns = {};
        writeQuestions.forEach(q => {
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
        writeQuestions.forEach(q => {
            const userAnswer = answers[q.id]?.trim().toLowerCase().replace(/\.$/, '');
            const correctAnswer = q.correctAnswer.toLowerCase().replace(/\.$/, '');
            if (userAnswer === correctAnswer) {
                score++;
            }
        });

        if (score === writeQuestions.length) {
            ValidationAlert.success(`Score: ${score} / ${writeQuestions.length}`);
        } else if (score > 0) {
            ValidationAlert.error(`Score: ${score} / ${writeQuestions.length}`);
        } else {
            ValidationAlert.warning("No matches. Try again.");
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto font-sans">
            <div className="flex items-center gap-4 mb-6">
                <span className="ex-A">G</span>
                <h1 className="header-title-page8">Look, read, and write.</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {writeQuestions.map((q, index) => (
                    <div key={q.id} className="space-y-2">
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-blue-600">{index + 1}</span>
                            <img src={q.img} alt={`Question ${index + 1}`} className="w-full max-h-24 object-cover rounded-lg shadow-sm" />
                        </div>
                        <input
                            type="text"
                            value={answers[q.id] || ''}
                            onChange={(e) => handleInputChange(q.id, e.target.value)}
                            placeholder={q.prompt}
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

export default WB_Unit3_Page18_Q1;

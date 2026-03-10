import React, { useState } from 'react';

// استيراد الصور ومكونات الأزرار والتنبيهات
import placeholderImg from '../../../assets/imgs/test6.png';
import Button from '../button';
import ValidationAlert from '../../Popup/ValidationAlert';

// بيانات التمرين
const answerQuestions = [
    { id: 'j1', img: placeholderImg, question: 'Can she sing?', correctAnswer: 'Yes, she can.' },
    { id: 'j2', img: placeholderImg, question: 'Can it swim?', correctAnswer: 'Yes, it can.' },
    { id: 'j3', img: placeholderImg, question: 'Can it hop?', correctAnswer: 'Yes, it can.' },
    { id: 'j4', img: placeholderImg, question: 'Can she fly?', correctAnswer: 'No, she can\'t.' },
];

const WB_Unit3_Page19_Q2 = () => {
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    const handleInputChange = (qId, value) => {
        setAnswers(prev => ({ ...prev, [qId]: value }));
        setShowResults(false);
    };

    const getInputClass = (qId) => {
        if (!showResults || !answers[qId]) return 'border-gray-300';
        const userAnswer = answers[qId].trim().toLowerCase().replace(/[.,!?]/g, '');
        const correctAnswer = answerQuestions.find(q => q.id === qId).correctAnswer.toLowerCase().replace(/[.,!?]/g, '');
        return userAnswer === correctAnswer ? 'border-green-500' : 'border-red-500';
    };

    const handleShowAnswer = () => {
        const correctAns = {};
        answerQuestions.forEach(q => {
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
        answerQuestions.forEach(q => {
            const userAnswer = answers[q.id]?.trim().toLowerCase().replace(/[.,!?]/g, '');
            const correctAnswer = q.correctAnswer.toLowerCase().replace(/[.,!?]/g, '');
            if (userAnswer === correctAnswer) {
                score++;
            }
        });

        if (score === answerQuestions.length) {
            ValidationAlert.success(`Score: ${score} / ${answerQuestions.length}`);
        } else if (score > 0) {
            ValidationAlert.error(`Score: ${score} / ${answerQuestions.length}`);
        } else {
            ValidationAlert.warning("No matches. Try again.");
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto font-sans mt-8">
            <div className="flex items-center gap-4 mb-6">
                <span className="ex-A">J</span>
                <h1 className="header-title-page8">Read, look, and write the answers.</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {answerQuestions.map((q, index) => (
                    <div key={q.id} className="space-y-2">
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-blue-600">{index + 1}</span>
                            <p className="text-lg">{q.question}</p>
                        </div>
                        <img src={q.img} alt={`Question ${index + 1}`} className="max-w-24 max-h-24 rounded-lg shadow-sm ml-8" />
                        <input
                            type="text"
                            value={answers[q.id] || ''}
                            onChange={(e) => handleInputChange(q.id, e.target.value)}
                            className={`w-full bg-transparent border-b-2 pb-1 focus:outline-none transition-colors text-lg ml-8 ${getInputClass(q.id)}`}
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

export default WB_Unit3_Page19_Q2;

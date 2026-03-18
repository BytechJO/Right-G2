import React, { useState } from 'react';

// استيراد الصور ومكونات الأزرار والتنبيهات
import placeholderImg from "../../../assets/imgs/test6.png";
import Button from '../button';
import ValidationAlert from '../../Popup/ValidationAlert';
import img from "../../../assets/imgs/test6.png";

const exerciseData = [
    { id: 'b1', src: img, correctAnswer: '✘' },
    { id: 'b2', src: img, correctAnswer: '✘' },
    { id: 'b3', src: img, correctAnswer: '✔' },
    { id: 'b4', src: img, correctAnswer: '✔' },
    { id: 'b5', src: img, correctAnswer: '✘' },
    { id: 'b6', src: img, correctAnswer: '✘' },
];

const WB_Unit6_Page38_Q2 = () => {
    const [selections, setSelections] = useState({});
    const [showResults, setShowResults] = useState(false);

    const handleBoxClick = (qId) => {
        if (showResults) return;
        setSelections(prev => {
            const current = prev[qId];
            if (current === '✔') return { ...prev, [qId]: '✘' };
            if (current === '✘') return { ...prev, [qId]: undefined };
            return { ...prev, [qId]: '✔' };
        });
    };

    const getBoxClass = (qId) => {
        const isSelected = !!selections[qId];
        if (showResults) {
            const isCorrect = selections[qId] === exerciseData.find(q => q.id === qId).correctAnswer;
            if (isCorrect) return 'border-green-500 bg-green-100';
            if (isSelected && !isCorrect) return 'border-red-500 bg-red-100';
        }
        if (isSelected) return 'border-blue-500';
        return 'border-gray-400';
    };

    const handleShowAnswer = () => {
        const correctSels = {};
        exerciseData.forEach(q => { correctSels[q.id] = q.correctAnswer; });
        setSelections(correctSels);
        setShowResults(true);
    };

    const handleStartAgain = () => {
        setSelections({});
        setShowResults(false);
    };

    const checkAnswers = () => {
        setShowResults(true);
        let score = 0;
        exerciseData.forEach(q => {
            if (selections[q.id] === q.correctAnswer) score++;
        });
        if (score === exerciseData.length) ValidationAlert.success(`Score: ${score} / ${exerciseData.length}`);
        else if (score > 0) ValidationAlert.error(`Score: ${score} / ${exerciseData.length}`);
        else ValidationAlert.warning("No correct answers. Try again.");
    };

    return (
        <div className="p-6 max-w-4xl mx-auto font-sans mt-8">
            <div className="flex items-center gap-4 mb-6">
                <span className="ex-A">C</span>
                <h1 className="header-title-page8">Does it have long i? Listen and write ✓ or ✕ .</h1>
            </div>

            <div className="flex flex-wrap gap-6 items-center ml-10">
                {exerciseData.map((item, index) => (
                    <div key={item.id} className="flex flex-col items-center gap-2">
                        <span className="font-bold text-blue-600">{index + 1}</span>
                        <img src={item.src} className='max-w-24 max-h-24' />
                        <div
                            onClick={() => handleBoxClick(item.id)}
                            className={`w-8 h-8 border-2 rounded-md flex items-center justify-center cursor-pointer transition-all ${getBoxClass(item.id)}`}
                        >
                            <span className={`text-2xl font-bold ${selections[item.id] === '✔' ? 'text-green-600' : 'text-red-600'}`}>
                                {selections[item.id]}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className='mt-10 flex justify-center'>
                <Button handleShowAnswer={handleShowAnswer} handleStartAgain={handleStartAgain} checkAnswers={checkAnswers} />
            </div>
        </div>
    );
};

export default WB_Unit6_Page38_Q2;

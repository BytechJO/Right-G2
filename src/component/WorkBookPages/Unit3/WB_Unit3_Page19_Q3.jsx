import React, { useState } from 'react';

import placeholderImg from '../../../assets/imgs/test6.png';
import Button from '../button';
import ValidationAlert from '../../Popup/ValidationAlert';

const checkQuestions = [
    { id: 'k1', sentence: 'He can swim.', options: [{ id: 'opt1', img: placeholderImg, isCorrect: true }, { id: 'opt2', img: placeholderImg, isCorrect: false }] },
    { id: 'k2', sentence: 'He can take a photo.', options: [{ id: 'opt3', img: placeholderImg, isCorrect: true }, { id: 'opt4', img: placeholderImg, isCorrect: false }] },
    { id: 'k3', sentence: 'It can fly.', options: [{ id: 'opt5', img: placeholderImg, isCorrect: true }, { id: 'opt6', img: placeholderImg, isCorrect: false }] },
];

const WB_Unit3_Page19_Q3 = () => {
    const [selections, setSelections] = useState({});
    const [showResults, setShowResults] = useState(false);

    const handleSelect = (qId, optionId) => {
        setSelections(prev => ({ ...prev, [qId]: optionId }));
        setShowResults(false);
    };

    const getBoxClass = (qId, option) => {
        const isSelected = selections[qId] === option.id;
        if (showResults) {
            if (option.isCorrect) return 'border-green-500';
            if (isSelected && !option.isCorrect) return 'border-red-500';
        }
        return isSelected ? 'border-blue-500' : 'border-gray-300';
    };

    const handleShowAnswer = () => {
        const correctSels = {};
        checkQuestions.forEach(q => {
            const correctOption = q.options.find(opt => opt.isCorrect);
            correctSels[q.id] = correctOption.id;
        });
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
        checkQuestions.forEach(q => {
            const correctOption = q.options.find(opt => opt.isCorrect);
            if (selections[q.id] === correctOption.id) {
                score++;
            }
        });

        if (score === checkQuestions.length) {
            ValidationAlert.success(`Score: ${score} / ${checkQuestions.length}`);
        } else if (score > 0) {
            ValidationAlert.error(`Score: ${score} / ${checkQuestions.length}`);
        } else {
            ValidationAlert.warning("No matches. Try again.");
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto font-sans mt-8">
            <div className="flex items-center gap-4 mb-6">
                <span className="ex-A">K</span>
                <h1 className="header-title-page8">Look, read, and write ✔.</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {checkQuestions.map((q, index) => (
                    <div key={q.id} className="space-y-3">
                        <span className="font-bold text-blue-600">{index + 1}</span>
                        {q.options.map(opt => (
                            <div key={opt.id} onClick={() => handleSelect(q.id, opt.id)}
                                className={`p-2 border-2 rounded-lg cursor-pointer transition-colors relative ${getBoxClass(q.id, opt)}`}>
                                <img src={opt.img} alt="option" className="max-w-50 max-h-50 rounded-md" />
                                <div className="absolute top-2 right-2 w-6 h-6 border-2 border-gray-400 rounded bg-white flex items-center justify-center">
                                    {selections[q.id] === opt.id && <span className="text-xl text-blue-600">✔</span>}
                                </div>
                            </div>
                        ))}
                        <p className="text-center text-lg">{q.sentence}</p>
                    </div>
                ))}
            </div>

            <div className='mt-10 flex justify-center'>
                <Button handleShowAnswer={handleShowAnswer} handleStartAgain={handleStartAgain} checkAnswers={checkAnswers} />
            </div>
        </div>
    );
};

export default WB_Unit3_Page19_Q3;

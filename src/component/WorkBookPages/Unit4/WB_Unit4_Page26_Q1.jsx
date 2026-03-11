import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';

import placeholderImg from "../../../assets/imgs/test6.png";
import Button from '../button';
import ValidationAlert from '../../Popup/ValidationAlert';

const exerciseData = [
    { id: 'a1', img: placeholderImg, word: 'rain', options: ['ay', 'ai'], correctAnswer: 'ai', audioSrc: '/audio/rain.mp3' },
    { id: 'a2', img: placeholderImg, word: 'play', options: ['a-e', 'ay'], correctAnswer: 'ay', audioSrc: '/audio/play.mp3' },
    { id: 'a3', img: placeholderImg, word: 'cake', options: ['ay', 'a-e'], correctAnswer: 'a-e', audioSrc: '/audio/cake.mp3' },
    { id: 'a4', img: placeholderImg, word: 'paint', options: ['ai', 'ay'], correctAnswer: 'ai', audioSrc: '/audio/paint.mp3' },
    { id: 'a5', img: placeholderImg, word: 'May', options: ['ay', 'a-e'], correctAnswer: 'ay', audioSrc: '/audio/may.mp3' },
    { id: 'a6', img: placeholderImg, word: 'lake', options: ['a-e', 'ai'], correctAnswer: 'a-e', audioSrc: '/audio/lake.mp3' },
];

const WB_Unit4_Page26_Q1 = () => {
    const [selections, setSelections] = useState({});
    const [showResults, setShowResults] = useState(false);

    const handleSelect = (qId, option) => {
        if (showResults) return;
        setSelections(prev => ({ ...prev, [qId]: option }));
    };

    const getButtonClass = (qId, option) => {
        const isSelected = selections[qId] === option;
        const isCorrect = exerciseData.find(q => q.id === qId).correctAnswer === option;

        if (showResults) {
            if (isCorrect) return 'border-green-500 bg-green-100 text-green-800';
            if (isSelected && !isCorrect) return 'border-red-500 bg-red-100 text-red-800';
        }
        if (isSelected) return 'border-blue-500 bg-blue-100 text-blue-800';
        return 'border-gray-300 bg-white hover:bg-gray-50';
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
        <div className="p-6 max-w-4xl mx-auto font-sans">
            <div className="flex items-center gap-4 mb-8">
                <span className="ex-A">A</span>
                <h1 className="header-title-page8">Listen and circle the correct long a sound.</h1>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-30">
                {exerciseData.map((item, index) => (
                    <div key={item.id} className="flex flex-col items-center text-center space-y-5">
                        <div className="flex items-start gap-2">
                            <span className="font-bold text-blue-600">{index + 1}</span>
                            <img src={item.img} alt={item.word} className="max-w-28 max-h-20 object-contain border rounded-lg p-1" />
                            <button onClick={() => new Audio(item.audioSrc).play()} className="p-1 rounded-full hover:bg-gray-100">
                                <Volume2 className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="flex justify-center gap-4">
                            {item.options.map(opt => (
                                <button key={opt} onClick={() => handleSelect(item.id, opt)}
                                    className={`w-16 h-10 flex items-center justify-center text-lg font-semibold rounded-full border-2 transition-all ${getButtonClass(item.id, opt)}`}>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className='mt-12 flex justify-center'>
                <Button handleShowAnswer={handleShowAnswer} handleStartAgain={handleStartAgain} checkAnswers={checkAnswers} />
            </div>
        </div>
    );
};

export default WB_Unit4_Page26_Q1;

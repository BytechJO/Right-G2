import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import ValidationAlert from '../../Popup/ValidationAlert';
import Button from '../button';

import clockImg from "../../../assets/imgs/test6.png";
import brickImg from "../../../assets/imgs/test6.png";
import candyImg from "../../../assets/imgs/test6.png";
import sockImg from "../../../assets/imgs/test6.png";
import lockImg from "../../../assets/imgs/test6.png";
import foxImg from "../../../assets/imgs/test6.png";
import mugImg from "../../../assets/imgs/test6.png";
import featherImg from "../../../assets/imgs/test6.png";
import queenImg from "../../../assets/imgs/test6.png";

const listenQuestions = [
    {
        id: 'q1',
        audioSrc: '/audio/clock.mp3',
        options: [
            { id: 'opt1_1', img: clockImg, isCorrect: true },
            { id: 'opt1_2', img: brickImg, isCorrect: false },
            { id: 'opt1_3', img: candyImg, isCorrect: false },
        ],
    },
    {
        id: 'q2',
        audioSrc: '/audio/fox.mp3',
        options: [
            { id: 'opt2_1', img: sockImg, isCorrect: false },
            { id: 'opt2_2', img: lockImg, isCorrect: false },
            { id: 'opt2_3', img: foxImg, isCorrect: true },
        ],
    },
    {
        id: 'q3',
        audioSrc: '/audio/queen.mp3',
        options: [
            { id: 'opt3_1', img: mugImg, isCorrect: false },
            { id: 'opt3_2', img: featherImg, isCorrect: false },
            { id: 'opt3_3', img: queenImg, isCorrect: true },
        ],
    },
    {
        id: 'q4',
        audioSrc: '/audio/queen.mp3',
        options: [
            { id: 'opt4_1', img: mugImg, isCorrect: false },
            { id: 'opt4_2', img: featherImg, isCorrect: false },
            { id: 'opt4_3', img: queenImg, isCorrect: true },
        ],
    },

];

const WB_Unit2_Page14_Q1 = () => {
    const [selectedOptions, setSelectedOptions] = useState({});
    const [showResults, setShowResults] = useState(false);

    const handleSelectOption = (questionId, optionId) => {
        setSelectedOptions(prev => ({ ...prev, [questionId]: optionId }));
        setShowResults(false); 
    };

    const playAudio = (audioSrc) => {
        const audio = new Audio(audioSrc);
        audio.play();
    };

    const getCircleClass = (questionId, option) => {
        const isSelected = selectedOptions[questionId] === option.id;
        if (!isSelected) return 'border-transparent'; 

        if (showResults) {
            return option.isCorrect ? 'border-gray-500' : 'border-gray-500';
        }

        return 'border-blue-500';
    };

    const handleShowAnswer = () => {
        const correctAnswers = {};
        listenQuestions.forEach(q => {
            const correctOption = q.options.find(opt => opt.isCorrect);
            if (correctOption) correctAnswers[q.id] = correctOption.id;
        });
        setSelectedOptions(correctAnswers);
        setShowResults(true);
    };

    const handleStartAgain = () => {
        setSelectedOptions({});
        setShowResults(false);
    };

    const checkAnswers = () => {
        if (Object.keys(selectedOptions).length < listenQuestions.length) {
            ValidationAlert.warning('Please answer all questions before checking.');
            return;
        }
        setShowResults(true);
        let correctCount = 0;
        listenQuestions.forEach(q => {
            const selectedId = selectedOptions[q.id];
            const selectedOption = q.options.find(opt => opt.id === selectedId);
            if (selectedOption?.isCorrect) correctCount++;
        });
        if (correctCount === listenQuestions.length) {
            ValidationAlert.success(`Score: ${correctCount}/${listenQuestions.length}`);
        } else {
            ValidationAlert.error(`Score: ${correctCount}/${listenQuestions.length}`);
        }
    };

    return (

        <div className="max-w-4xl mx-auto font-sans">
            <div className="flex items-center gap-4">
                <span className="ex-A">A</span>
                <h1 className="header-title-page8">Listen, look, and circle.</h1>
            </div>

            <div className="">
                {listenQuestions.map((question, index) => (
                    <div key={question.id} className="flex items-center ">
                        <span className="font-bold text-blue-600 text-xl">{index + 1}</span>
                        <button onClick={() => playAudio(question.audioSrc)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                            <Volume2 className="w-6 h-6 text-gray-600" />
                        </button>
                        <div className="flex-1 grid grid-cols-3 gap-4">
                            {question.options.map(option => (
                                <div
                                    key={option.id}
                                    onClick={() => handleSelectOption(question.id, option.id)}
                                    className={`w-24 h-24 rounded-full border-4 cursor-pointer overflow-hidden transition-colors ${getCircleClass(question.id, option)}`}
                                >
                                    <img src={option.img} alt="option" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className='mt-10 flex justify-center'>
                <Button
                    handleShowAnswer= {handleShowAnswer}
                    handleStartAgain= {handleStartAgain}
                    checkAnswers= {checkAnswers}
                />
            </div>
        </div>
    );
};

export default WB_Unit2_Page14_Q1;

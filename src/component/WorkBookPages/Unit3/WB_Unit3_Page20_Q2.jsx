import React, { useState } from 'react';
import { Volume2 } from 'lucide-react'; // `npm install lucide-react`

import placeholderImg from '../../../assets/imgs/test6.png';
import Button from '../button';
import ValidationAlert from '../../Popup/ValidationAlert';

const conversations = [
    {
        id: 'conv1',
        audioSrc: '/audio/conversation1.mp3',
        lines: [
            { speaker: 'Stella', text: ["Where's my ", { id: 'c1_1', correct: 'y' }, "o-", { id: 'c1_2', correct: 'y' }, "o, John?"] },
            { speaker: 'John', text: ["Which one?"] },
            { speaker: 'Stella', text: ["The ", { id: 'c1_3', correct: 'y' }, "ellow one. It's ", { id: 'c1_4', correct: 'y' }, "ellow like a banana."] },
            { speaker: 'John', text: ["Oh yes! Here ", { id: 'c1_5', correct: 'y' }, "ou are."] },
        ]
    },
    {
        id: 'conv2',
        audioSrc: '/audio/conversation2.mp3',
        lines: [
            { speaker: 'Stella', text: ["Where are my ", { id: 'c2_1', correct: 'j' }, "eans, ", { id: 'c2_2', correct: 'J' }, "ohn?"] },
            { speaker: 'John', text: ["Which ones?"] },
            { speaker: 'Stella', text: ["The blue ones that I bought with the red ", { id: 'c2_3', correct: 'j' }, "acket?"] },
            { speaker: 'John', text: ["Here ", { id: 'c2_4', correct: 'y' }, "ou are."] },
        ]
    }
];

const WB_Unit3_Page20_Q2 = () => {
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    const handleInputChange = (inputId, value) => {
        // السماح بإدخال حرف واحد فقط
        setAnswers(prev => ({ ...prev, [inputId]: value.slice(-1) }));
        setShowResults(false);
    };

    const getInputClass = (inputId, correctLetter) => {
        if (!showResults || !answers[inputId]) return 'border-gray-400';
        return answers[inputId].toLowerCase() === correctLetter.toLowerCase() ? 'border-green-500' : 'border-red-500';
    };

    const handleShowAnswer = () => {
        const correctAns = {};
        conversations.forEach(conv => {
            conv.lines.forEach(line => {
                line.text.forEach(part => {
                    if (typeof part === 'object') {
                        correctAns[part.id] = part.correct;
                    }
                });
            });
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
        let total = 0;
        conversations.forEach(conv => {
            conv.lines.forEach(line => {
                line.text.forEach(part => {
                    if (typeof part === 'object') {
                        total++;
                        if (answers[part.id]?.toLowerCase() === part.correct.toLowerCase()) {
                            score++;
                        }
                    }
                });
            });
        });

        if (score === total) {
            ValidationAlert.success(`Score: ${score} / ${total}`);
        } else if (score > 0) {
            ValidationAlert.error(`Score: ${score} / ${total}`);
        } else {
            ValidationAlert.warning("No correct letters. Try again.");
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto font-sans mt-8">
            <div className="flex items-center gap-4 mb-6">
                <span className="ex-A">B</span>
                <h1 className="header-title-page8">Listen and write the missing letters. Practice the conversation in pairs.</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8">
                <img src={placeholderImg} alt="conversation" className="max-w-50 max-h-48 rounded-lg shadow-md mx-auto md:mx-0 mt-25" />
                <div className="space-y-6">
                    {conversations.map((conv, index) => (
                        <div key={conv.id}>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="font-bold text-blue-600">{index + 1}</span>
                                <button onClick={() => new Audio(conv.audioSrc).play()} className="p-1 rounded-full hover:bg-gray-200">
                                    <Volume2 className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                            {conv.lines.map((line, lineIndex) => (
                                <p key={lineIndex} className="text-lg">
                                    <span className="font-bold w-20 inline-block">{line.speaker}:</span>
                                    {line.text.map((part, partIndex) =>
                                        typeof part === 'string' ? (
                                            <span key={partIndex}>{part}</span>
                                        ) : (
                                            <input
                                                key={part.id}
                                                type="text"
                                                maxLength="1"
                                                value={answers[part.id] || ''}
                                                onChange={(e) => handleInputChange(part.id, e.target.value)}
                                                className={`w-6 text-center mx-1 bg-transparent border-b-2 pb-1 focus:outline-none transition-colors font-bold text-red-600 ${getInputClass(part.id, part.correct)}`}
                                            />
                                        )
                                    )}
                                </p>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className='mt-10 flex justify-center'>
                <Button handleShowAnswer={handleShowAnswer} handleStartAgain={handleStartAgain} checkAnswers={checkAnswers} />
            </div>
        </div>
    );
};

export default WB_Unit3_Page20_Q2;

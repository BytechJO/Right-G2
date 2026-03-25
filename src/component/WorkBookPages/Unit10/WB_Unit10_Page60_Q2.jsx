import React, { useState } from 'react';
import ValidationAlert from '../../Popup/ValidationAlert';
import Button from '../button';

const WB_Unit10_Page60_Q2 = () => {
    const [answers, setAnswers] = useState({ q1: [], q2: [], q3: [], q4: [], q5: [] });
    const [showResults, setShowResults] = useState(false);

    const DATA = [
        { id: 'q1', scrambled: ['ball', 'she', 'yard', 'in', '.', 'playing', 'is', 'the'], correct: 'She is playing ball in the yard.' },
        { id: 'q2', scrambled: ['TV', 'they', '.', 'are', 'watching'], correct: 'They are watching TV.' },
        { id: 'q3', scrambled: ['he', 'shower', '.', 'bathroom', 'taking', 'is', 'a', 'the', 'in'], correct: 'He is taking a shower in the bathroom.' },
        { id: 'q4', scrambled: ['studying', 'the', '.', 'we', 'bedroom', 'are', 'in'], correct: 'We are studying in the bedroom.' },
        { id: 'q5', scrambled: ["I'm", 'yard', 'flowers', '.', 'watering', 'the', 'in', 'the'], correct: "I'm watering the flowers in the yard." },
    ];

    const checkAnswers = () => {
        const unanswered = DATA.filter(d => answers[d.id].length === 0);
        if (unanswered.length > 0) { ValidationAlert.info(); return; }
        setShowResults(true);
        let score = 0;
        DATA.forEach(d => {
            const userSentence = answers[d.id].join(' ').replace(' .', '.');
            if (userSentence.toLowerCase() === d.correct.toLowerCase()) score++;
        });
        const total = DATA.length;
        const msg = `Score: ${score} / ${total}`;
        if (score === total) ValidationAlert.success(msg);
        else if (score > 0) ValidationAlert.warning(msg);
        else ValidationAlert.error(msg);
    };

    const handleReset = () => { setAnswers({ q1: [], q2: [], q3: [], q4: [], q5: [] }); setShowResults(false); };

    const handleWordClick = (qId, word, idx) => {
        if (showResults) return;
        setAnswers(prev => ({ ...prev, [qId]: [...prev[qId], word] }));
    };

    const handleRemoveWord = (qId, wordIdx) => {
        if (showResults) return;
        setAnswers(prev => ({
            ...prev,
            [qId]: prev[qId].filter((_, i) => i !== wordIdx)
        }));
    };

    return (
        <div className="p-8 max-w-5xl mx-auto font-sans">

            <div className="flex items-center gap-3 mb-6">
                <div className="ex-A">G</div>
                <h1 className="header-title-page8">Unscramble and write each sentence.</h1>
            </div>

            <div className="space-y-10">
                {DATA.map((item, idx) => {
                    const userSentence = answers[item.id].join(' ').replace(' .', '.');
                    const isCorrect = userSentence.toLowerCase() === item.correct.toLowerCase();

                    return (
                        <div key={item.id} className="space-y-4 p-4 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-blue-600">{idx + 1}</span>
                                <div className="flex flex-wrap gap-2">
                                    {item.scrambled.map((word, wIdx) => {
                                        const countInAnswer = answers[item.id].filter(w => w === word).length;
                                        const countInScrambled = item.scrambled.filter(w => w === word).length;
                                        const isUsed = countInAnswer >= countInScrambled;

                                        return (
                                            <button
                                                key={wIdx}
                                                onClick={() => handleWordClick(item.id, word, wIdx)}
                                                disabled={isUsed || showResults}
                                                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${isUsed ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border-2 border-blue-100 text-blue-700 hover:border-blue-400 hover:shadow-sm'
                                                    }`}
                                            >
                                                {word}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className={`min-h-[50px] p-3 border-b-2 flex flex-wrap gap-2 items-center transition-all`}>
                                {answers[item.id].length === 0 && <span className="text-gray-300 italic text-sm">Click words to build the sentence...</span>}
                                {answers[item.id].map((word, wIdx) => (
                                    <span
                                        key={wIdx}
                                        onClick={() => handleRemoveWord(item.id, wIdx)}
                                        className={`cursor-pointer px-2 py-1 rounded bg-blue-100 text-blue-800 font-bold text-sm hover:bg-red-100 hover:text-red-600 transition-colors ${showResults ? 'pointer-events-none' : ''}`}
                                    >
                                        {word}
                                    </span>
                                ))}
                            </div>
                            {showResults && !isCorrect && (
                                <p className="text-xs text-red-400 font-medium">Correct: {item.correct}</p>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-12 flex justify-center">
                <Button
                    handleShowAnswer={() => {
                        const correctAnswers = {};
                        DATA.forEach(d => {
                            // تحويل الجملة الصحيحة إلى مصفوفة كلمات مع مراعاة النقطة
                            correctAnswers[d.id] = d.correct.replace('.', ' .').split(' ').filter(w => w !== '');
                        });
                        setAnswers(correctAnswers);
                        setShowResults(true);
                    }}
                    handleStartAgain={handleReset}
                    checkAnswers={checkAnswers}
                />
            </div>
        </div>
    );
};

export default WB_Unit10_Page60_Q2;

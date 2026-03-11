import React, { useState } from 'react';

// استيراد الصور ومكونات الأزرار والتنبيهات
import placeholderImg from "../../../assets/imgs/test6.png";
import Button from '../button';
import ValidationAlert from '../../Popup/ValidationAlert';

// بيانات التمرين
const scrambledWords = [
    { id: 1, scrambled: 'yaM', correct: 'May' },
    { id: 2, scrambled: 'layp', correct: 'play' },
    { id: 3, scrambled: 'tpani', correct: 'paint' },
    { id: 4, scrambled: 'nair', correct: 'rain' },
    { id: 5, scrambled: 'keac', correct: 'cake' },
    { id: 6, scrambled: 'kael', correct: 'lake' },
];

const WB_Unit4_Page26_Q2 = () => {
    const [placedWords, setPlacedWords] = useState({});
    const [showResults, setShowResults] = useState(false);

    const handleWordClick = (word) => {
        if (showResults) return;
        if (Object.values(placedWords).includes(word.correct)) return;
        setPlacedWords(prev => ({ ...prev, [word.id]: word.correct }));
    };

    const removeWordFromBlank = (blankId) => {
        if (showResults) return;
        const newPlacedWords = { ...placedWords };
        delete newPlacedWords[blankId];
        setPlacedWords(newPlacedWords);
    };

    const getBlankClass = (blankId) => {
        if (!showResults || !placedWords[blankId]) return 'border-gray-400';
        return 'border-green-500 text-green-700';
    };

    const handleShowAnswer = () => {
        const correctPlacements = {};
        scrambledWords.forEach(w => { correctPlacements[w.id] = w.correct; });
        setPlacedWords(correctPlacements);
        setShowResults(true);
    };

    const handleStartAgain = () => {
        setPlacedWords({});
        setShowResults(false);
    };

    const checkAnswers = () => {
        setShowResults(true);
        const score = Object.keys(placedWords).length;
        const total = scrambledWords.length;

        if (score === total) ValidationAlert.success(`Score: ${score} / ${total}`);
        else if (score > 0) ValidationAlert.error(`Score: ${score} / ${total}`);
        else ValidationAlert.warning("No words placed. Try again.");
    };

    return (
        <div className="p-6 max-w-4xl mx-auto font-sans mt-8">
            <div className="flex items-center gap-4 mb-6">
                <span className="ex-A">B</span>
                <h1 className="header-title-page8">Unscramble the words. Complete the story.</h1>
            </div>

            <div className="flex flex-wrap justify-center gap-4 p-3 mb-8 border-2 border-dashed border-gray-300 rounded-lg">
                {scrambledWords.map(word => {
                    const isPlaced = Object.values(placedWords).includes(word.correct);
                    return (
                        <button key={word.id} onClick={() => handleWordClick(word)}
                            disabled={isPlaced}
                            className={`px-4 py-2 rounded-lg text-lg font-medium transition-all 
                                        ${isPlaced ? 'bg-gray-200 text-gray-400 line-through' : 'bg-white border border-gray-400 hover:bg-gray-50'}`}>
                            <span className="font-bold text-blue-600 mr-2">{word.id}</span>
                            {word.scrambled}
                        </button>
                    );
                })}
            </div>

            <div className="space-y-4 mb-13">
                <img src={placeholderImg} className="mx-auto max-w-400 max-h-80 object-cover rounded-lg mb-6" />
                <p className="text-2xl leading-relaxed">
                    <Blank id={1} value={placedWords[1]} onClick={removeWordFromBlank} className={getBlankClass(1)} /> likes to
                    <Blank id={2} value={placedWords[2]} onClick={removeWordFromBlank} className={getBlankClass(2)} /> and
                    <Blank id={3} value={placedWords[3]} onClick={removeWordFromBlank} className={getBlankClass(3)} /> in the
                    <Blank id={4} value={placedWords[4]} onClick={removeWordFromBlank} className={getBlankClass(4)} />. She also likes to eat
                    <Blank id={5} value={placedWords[5]} onClick={removeWordFromBlank} className={getBlankClass(5)} /> near the
                    <Blank id={6} value={placedWords[6]} onClick={removeWordFromBlank} className={getBlankClass(6)} />.
                </p>
            </div>
                <Button handleShowAnswer={handleShowAnswer} handleStartAgain={handleStartAgain} checkAnswers={checkAnswers} />
        </div>
    );
};

// مكون مساعد للفراغ
const Blank = ({ id, value, onClick, className }) => (
    <button onClick={() => onClick(id)}
        className={`inline-block w-28 text-center mx-2 border-b-2 focus:outline-none text-2xl font-bold ${className}`}>
        {value || <span className="text-transparent">.</span>}
    </button>
);

export default WB_Unit4_Page26_Q2;

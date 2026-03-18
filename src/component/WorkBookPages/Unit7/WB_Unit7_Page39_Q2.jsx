import React, { useState } from 'react';
import img from '../../../assets/imgs/test6.png';
import Button from '../button';
import ValidationAlert from '../../Popup/ValidationAlert';

const exerciseDataL = {
    sentences: [
        { id: 'l1', correctSentence: "It's eight thirty.", words: ['eight', 'It\'s', 'thirty.'] },
        { id: 'l2', correctSentence: "It's four o'clock.", words: ['four', 'It\'s', "o'clock."] },
        { id: 'l3', correctSentence: "It's a quarter past two.", words: ['quarter', 'two.', 'It\'s', 'a', 'past'] },
        { id: 'l4', correctSentence: "It's a quarter to two.", words: ['two.', 'quarter', 'It\'s', 'a', 'to'] },
    ],
};

const WB_Unit7_Page39_Q2 = () => {
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [draggedWord, setDraggedWord] = useState(null);

    const handleDragStart = (sentenceId, word) => {
        setDraggedWord({ sentenceId, word });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDropOnBlank = (sentenceId) => {
        if (!draggedWord || draggedWord.sentenceId !== sentenceId) return;

        const currentAnswer = userAnswers[sentenceId] || [];
        const newAnswer = [...currentAnswer, draggedWord.word];

        setUserAnswers((prev) => ({
            ...prev,
            [sentenceId]: newAnswer,
        }));

        setDraggedWord(null);
    };

    const handleRemoveWord = (sentenceId, index) => {
        const currentAnswer = userAnswers[sentenceId] || [];
        const newAnswer = currentAnswer.filter((_, i) => i !== index);

        setUserAnswers((prev) => ({
            ...prev,
            [sentenceId]: newAnswer,
        }));
    };

    const checkAnswers = () => {
        const unanswered = exerciseDataL.sentences.filter(
            (s) => !userAnswers[s.id] || userAnswers[s.id].length === 0
        );

        if (unanswered.length > 0) {
            ValidationAlert.info();
            return;
        }

        setShowResults(true);
        let score = 0;
        let total = exerciseDataL.sentences.length;

        exerciseDataL.sentences.forEach((sentence) => {
            const userSentence = (userAnswers[sentence.id] || []).join(' ');
            const correctSentence = sentence.correctSentence;

            if (userSentence === correctSentence) {
                score++;
            }
        });

        if (score === total) {
            ValidationAlert.success(`Score: ${score} / ${total}`);
        } else if (score > 0) {
            ValidationAlert.warning(`Score: ${score} / ${total}`);
        } else {
            ValidationAlert.error(`Score: ${score} / ${total}`);
        }
    };

    const handleStartAgain = () => {
        setUserAnswers({});
        setShowResults(false);
    };

    const getBlankClass = (sentenceId) => {
        if (!showResults) {
            return 'min-h-12 border-2 border-dashed border-gray-300 rounded-lg p-2 bg-gray-50';
        }

        const sentence = exerciseDataL.sentences.find((s) => s.id === sentenceId);
        const userSentence = (userAnswers[sentenceId] || []).join(' ');
        const isCorrect = userSentence === sentence?.correctSentence;

        if (isCorrect) {
            return 'min-h-12 border-2 border-solid border-green-500 rounded-lg p-2 bg-green-50';
        }
        return 'min-h-12 border-2 border-solid border-red-500 rounded-lg p-2 bg-red-50';
    };

    const handleShowAnswer = () => {
        const correctAnswers = {};

        exerciseDataL.sentences.forEach((sentence) => {
            correctAnswers[sentence.id] = sentence.correctSentence.split(' ');
        });

        setUserAnswers(correctAnswers);
        setShowResults(true);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto bg-white rounded-lg">
            <div className="flex items-center gap-3 mb-6">
                <div className="ex-A">B</div>
                <h1 className="header-title-page8">Look and write sentences.</h1>
            </div>

            {/* Sentences */}
            <div className="grid grid-cols-2 gap-8 mb-8">
                {exerciseDataL.sentences.map((sentence, idx) => (
                    <div key={sentence.id} className="space-y-4">
                        <div className="flex flex-col items-center">
                            <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                                <img src={img} alt={`Clock ${idx + 1}`} className="max-w-28 max-h-28 object-cover" />
                            </div>
                            <span className="font-bold text-lg text-gray-700 mb-4">{idx + 1}</span>
                        </div>

                        {/* Blank for answer */}
                        <div
                            className={getBlankClass(sentence.id)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDropOnBlank(sentence.id)}
                        >
                            <div className="flex flex-wrap gap-2">
                                {(userAnswers[sentence.id] || []).map((word, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleRemoveWord(sentence.id, i)}
                                        className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
                                    >
                                        {word} ✕
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {sentence.words
                                .filter((word) => !(userAnswers[sentence.id] || []).includes(word))
                                .map((word) => (
                                    <button
                                        key={word}
                                        draggable
                                        onDragStart={() => handleDragStart(sentence.id, word)}
                                        className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors cursor-move"
                                    >
                                        {word}
                                    </button>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
            <Button handleShowAnswer={handleShowAnswer} handleStartAgain={handleStartAgain} checkAnswers={checkAnswers} />
        </div>
    );
}

export default WB_Unit7_Page39_Q2;
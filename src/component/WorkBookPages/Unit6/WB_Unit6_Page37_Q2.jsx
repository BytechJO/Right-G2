import React, { useState } from 'react';
import Button from '../button';
import ValidationAlert from '../../Popup/ValidationAlert';

const SentenceBuilder = ({ id, scrambled, correct, onUpdate, showResult, forceAnswer }) => {
    const [availableWords, setAvailableWords] = useState(
        scrambled.split(' ').map((word, index) => ({ id: `${id}-word-${index}`, text: word }))
    );

    const [chosenWords, setChosenWords] = useState([]);

    React.useEffect(() => {
        if (forceAnswer) {
            const words = correct.replace(/[.,!?]/g, '').split(' ').map((word, index) => ({
                id: `${id}-word-${index}`,
                text: word
            }));
            setChosenWords(words);
            setAvailableWords([]); // إزالة كل الكلمات المتاحة
        }
    }, [forceAnswer, correct, id]);

    const handleWordClick = (wordToAdd) => {
        const newChosenWords = [...chosenWords, wordToAdd];
        setChosenWords(newChosenWords);

        setAvailableWords(availableWords.filter(w => w.id !== wordToAdd.id));
        onUpdate(newChosenWords.map(w => w.text).join(' '));
    };

    const handleRemoveWord = (wordToRemove) => {
        // إزالة الكلمة من جملة المستخدم
        const newChosenWords = chosenWords.filter(w => w.id !== wordToRemove.id);
        setChosenWords(newChosenWords);

        // إعادة الكلمة إلى قائمة الكلمات المتاحة (مع الحفاظ على الترتيب الأصلي إن أمكن)
        setAvailableWords(prev => [...prev, wordToRemove].sort((a, b) => a.id.localeCompare(b.id)));

        // إعلام المكون الأب بالجملة الجديدة
        onUpdate(newChosenWords.map(w => w.text).join(' '));
    };

    const getBoxClassName = () => {
        if (!showResult) {
            return 'border-gray-300 bg-white';
        }
        const userAnswer = chosenWords.map(w => w.text).join(' ');
        if (userAnswer.length === 0) {
            return 'border-gray-300 bg-white';
        }
        return userAnswer === correct ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50';
    };

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2 p-3 bg-gray-100 rounded-lg min-h-[50px] items-center">
    
    {availableWords.length > 0 ? (
        availableWords.map(word => (
            <button
                key={word.id}
                onClick={() => handleWordClick(word)}
                className="px-3 py-1 bg-white border border-gray-400 rounded-md shadow-sm hover:bg-blue-100 hover:border-blue-500 transition-all text-gray-800 font-medium"
            >
                {word.text}
            </button>
        ))
    ) : (
        <p className="text-gray-400 text-sm"></p>
    )}

    
</div>

            <div className={`flex flex-wrap gap-2 p-3 border-2 rounded-lg min-h-[60px] transition-colors duration-300 items-center ${getBoxClassName()}`}>
                {chosenWords.map(word => (
                    <button
                        key={word.id}
                        onClick={() => handleRemoveWord(word)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md shadow-sm cursor-pointer"
                        title="Click to remove"
                    >
                        {word.text}
                    </button>
                ))}
            </div>
        </div>
    );
};

const WB_Unit6_Page37_Q2 = () => {

    const exerciseSentences = [
        { id: 's1', scrambled: 'sleepy was at nine I thirty .', correct: 'I was sleepy at ten thirty' },
        { id: 's2', scrambled: 'morning . the she teeth brushes in her', correct: 'She brushes her teeth in the morning' },
    ];
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(null);
    const [resetKey, setResetKey] = useState(0);

    const handleAnswerUpdate = (id, answer) => {
        setUserAnswers(prev => ({ ...prev, [id]: answer }));
        if (showResults) {
            setShowResults(false);
            setScore(null);
        }
    };
    const checkAnswers = () => {
        const unanswered = exerciseSentences.filter(
            sentence => !userAnswers[sentence.id] || userAnswers[sentence.id].trim() === ''
        );
        if (unanswered.length > 0) {
            ValidationAlert.warning('Please complete all sentences before checking your answers.');
            return;
        }
        setShowResults(true);
        let correctCount = 0;
        exerciseSentences.forEach(sentence => {
            const userWords = userAnswers[sentence.id].replace(/[.,!?]/g, '').trim().split(/\s+/);
            const correctWords = sentence.correct.replace(/[.,!?]/g, '').trim().split(/\s+/);
            const isCorrect = userWords.length === correctWords.length &&
                userWords.every((word, idx) => word === correctWords[idx]);

            if (isCorrect) correctCount++;
        });
        setScore({ correct: correctCount, total: exerciseSentences.length });
        if (correctCount === exerciseSentences.length) {
            ValidationAlert.success(`Score: ${correctCount}/${exerciseSentences.length}`);
        } else {
            ValidationAlert.error(`Score: ${correctCount}/${exerciseSentences.length}`);
        }
    };

    const handleStartAgain = () => {
        setUserAnswers({});
        setShowResults(false);
        setScore(null);
        setShowAnswers(false);
        setResetKey(prevKey => prevKey + 1);
    };

    const [showAnswers, setShowAnswers] = useState(false);

    const handleShowAnswer = () => {
        setShowAnswers(true);
        const allAnswers = {};
        exerciseSentences.forEach(sentence => {
            allAnswers[sentence.id] = sentence.correct;
        });
        setUserAnswers(allAnswers);
        setShowResults(true);
        setScore({ correct: exerciseSentences.length, total: exerciseSentences.length });
    };

    return (
        <div key={resetKey} className="p-6 max-w-3xl mx-auto font-sans">
            <div className="flex items-center gap-4 mb-8">
                <span className="ex-A">J</span>
                <h1 className="header-title-page8">Unscramble and write.</h1>
            </div>

            <div className="space-y-8">

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <span className="font-bold text-blue-600 text-xl">1.</span>
                    
                    <div className="flex-1">
                        <p className="text-lg text-gray-400 line-through">I math at o’clock morning ten . in the have class</p>
                        <p className="text-lg text-gray-900 font-semibold">I have math class at ten o’clock in the morning</p>
                    </div>
                </div>

                {exerciseSentences.map((sentence, index) => (
                    <div key={sentence.id} className="flex items-start gap-4 p-4 rounded-xl transition-all hover:bg-gray-50">
                        <span className="font-bold text-blue-600 text-xl pt-2">{index + 2}.</span>
                        <div className="flex-1">
                            <SentenceBuilder
                                id={sentence.id}
                                scrambled={sentence.scrambled}
                                correct={sentence.correct}
                                onUpdate={(answer) => handleAnswerUpdate(sentence.id, answer)}
                                showResult={showResults}
                                forceAnswer={showAnswers}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className='mt-20'>
                <Button
                    handleShowAnswer={handleShowAnswer}
                    handleStartAgain={handleStartAgain}
                    checkAnswers={checkAnswers} />
            </div>
        </div>
    );
};

export default WB_Unit6_Page37_Q2;

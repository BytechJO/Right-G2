import React, { useState } from 'react';

// استيراد الصور ومكونات الأزرار والتنبيهات
import sandwichImg from '../../../assets/imgs/test6.png';
import drumImg from '../../../assets/imgs/test6.png';
import bikeImg from '../../../assets/imgs/test6.png';
import kiteImg from '../../../assets/imgs/test6.png';

import Button from '../button';
import ValidationAlert from '../../Popup/ValidationAlert';

// بيانات التمرين
const circleQuestions = [
    { id: 'q1', img: sandwichImg, options: ['make', 'take'], phrase: 'a sandwich', correctAnswer: 'make' },
    { id: 'q2', img: drumImg, options: ['paint', 'play'], phrase: 'the drum', correctAnswer: 'play' },
    { id: 'q3', img: bikeImg, options: ['fly', 'ride'], phrase: 'a bike', correctAnswer: 'ride' },
    { id: 'q4', img: kiteImg, options: ['play', 'fly'], phrase: 'a kite', correctAnswer: 'fly' },
];

const WB_Unit3_Page17_Q1 = () => {
    // حالة لتخزين الفعل المختار لكل سؤال
    const [selections, setSelections] = useState({});
    // حالة لتخزين الإجابات المكتوبة
    const [writtenAnswers, setWrittenAnswers] = useState({});
    // حالة لإظهار النتائج
    const [showResults, setShowResults] = useState(false);

    // دالة لتحديث الاختيار والكتابة معاً
    const handleSelect = (qId, choice) => {
        setSelections(prev => ({ ...prev, [qId]: choice }));
        const question = circleQuestions.find(q => q.id === qId);
        setWrittenAnswers(prev => ({ ...prev, [qId]: `${choice} ${question.phrase}` }));
        setShowResults(false);
    };

    // دالة لتحديث النص المكتوب يدوياً
    const handleTextChange = (qId, value) => {
        setWrittenAnswers(prev => ({ ...prev, [qId]: value }));
        setShowResults(false);
    };

    // دالة لتحديد تنسيق الأزرار (الدائرة)
    const getButtonClass = (qId, choice) => {
        const isSelected = selections[qId] === choice;
        if (showResults) {
            const isCorrect = circleQuestions.find(q => q.id === qId).correctAnswer === choice;
            if (isCorrect) return 'border-green-500 bg-green-100 text-green-700';
            if (isSelected && !isCorrect) return 'border-red-500 bg-red-100 text-red-700';
        }
        return isSelected ? 'border-blue-500 bg-blue-100 text-blue-700' : 'border-gray-300 bg-white';
    };

    // دالة لتحديد تنسيق حقل الكتابة
    const getInputClass = (qId) => {
        if (!showResults || !writtenAnswers[qId]) return 'border-gray-300';
        const question = circleQuestions.find(q => q.id === qId);
        const fullCorrectAnswer = `${question.correctAnswer} ${question.phrase}`;
        return writtenAnswers[qId].trim().toLowerCase() === fullCorrectAnswer ? 'border-green-500' : 'border-red-500';
    };

    const handleShowAnswer = () => {
        const correctSels = {};
        const correctWrites = {};
        circleQuestions.forEach(q => {
            correctSels[q.id] = q.correctAnswer;
            correctWrites[q.id] = `${q.correctAnswer} ${q.phrase}`;
        });
        setSelections(correctSels);
        setWrittenAnswers(correctWrites);
        setShowResults(true);
    };

    const handleStartAgain = () => {
        setSelections({});
        setWrittenAnswers({});
        setShowResults(false);
    };

    const checkAnswers = () => {
        setShowResults(true);
        let score = 0;
        circleQuestions.forEach(q => {
            const fullCorrectAnswer = `${q.correctAnswer} ${q.phrase}`;
            if (selections[q.id] === q.correctAnswer && writtenAnswers[q.id]?.trim().toLowerCase() === fullCorrectAnswer) {
                score++;
            }
        });

        if (score === circleQuestions.length) {
            ValidationAlert.success(`Score: ${score} / ${circleQuestions.length}`);
        } else if (score > 0) {
            ValidationAlert.error(`Score: ${score} / ${circleQuestions.length}`);
        } else {
            ValidationAlert.warning("No matches. Try again.");
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto font-sans">
            <div className="flex items-center gap-4 mb-6">
                <span className="ex-A">E</span>
                <h1 className="header-title-page8">Look, read and circle. Write.</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {circleQuestions.map((q, index) => (
                    <div key={q.id} className="space-y-3">
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-blue-600">{index + 1}</span>
                            <img src={q.img} alt={q.phrase} className="max-w-24 max-h-24 rounded-lg shadow-sm" />
                            <div className="flex flex-col items-start gap-2">
                                {q.options.map(opt => (
                                    <button key={opt} onClick={() => handleSelect(q.id, opt)}
                                        className={`px-4 py-1 border-2 rounded-full font-semibold transition-all ${getButtonClass(q.id, opt)}`}>
                                        {opt}
                                    </button>
                                ))}
                            </div>
                            <span className="text-gray-700">{q.phrase}</span>
                        </div>
                        <input
                            type="text"
                            value={writtenAnswers[q.id] || ''}
                            onChange={(e) => handleTextChange(q.id, e.target.value)}
                            className={`w-full bg-transparent border-b-2 pb-1 focus:outline-none transition-colors ${getInputClass(q.id)}`}
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

export default WB_Unit3_Page17_Q1;

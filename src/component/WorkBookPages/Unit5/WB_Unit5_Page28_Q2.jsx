import React, { useState } from 'react';

// استيراد الصور ومكونات الأزرار والتنبيهات
import placeholderImg from "../../../assets/imgs/test6.png";
import Button from '../button';
import ValidationAlert from '../../Popup/ValidationAlert';

// بيانات التمرين
const exerciseDataD = [
    { id: 'd1', img: placeholderImg, options: ["Does she like fish?", "Does she like chicken?"], correctOption: "Does she like fish?", correctAnswer: "No, she doesn't." },
    { id: 'd2', img: placeholderImg, options: ["Does he like stew?", "Does he like fruit?"], correctOption: "Does he like stew?", correctAnswer: "No, he doesn't." },
    { id: 'd3', img: placeholderImg, options: ["Does he like meat?", "Does he like rice?"], correctOption: "Does he like meat?", correctAnswer: "No, he doesn't." },
    { id: 'd4', img: placeholderImg, options: ["Does she like fish?", "Does she like fruit?"], correctOption: "Does she like fruit?", correctAnswer: "Yes, she does." },
    { id: 'd5', img: placeholderImg, options: ["Does she like soup?", "Does she like chicken?"], correctOption: "Does she like chicken?", correctAnswer: "Yes, she does." },
];

const WB_Unit5_Page28_Q2 = () => {
    const [selections, setSelections] = useState({}); // { d1: "Does she like fish?" }
    const [answers, setAnswers] = useState({}); // { d1: "No, she doesn't." }
    const [showResults, setShowResults] = useState(false);

    const handleSelect = (qId, option) => {
        if (showResults) return;
        setSelections(prev => ({ ...prev, [qId]: option }));
    };

    const handleInputChange = (qId, value) => {
        if (showResults) return;
        setAnswers(prev => ({ ...prev, [qId]: value }));
    };

    const getOptionClass = (qId, option, correctOption) => {
        const isSelected = selections[qId] === option;
        if (showResults) {
            if (option === correctOption) return 'border-green-500 bg-green-100 text-green-800';
            if (isSelected && option !== correctOption) return 'border-red-500 bg-red-100 text-red-800';
        }
        if (isSelected) return 'border-blue-500 bg-blue-100 text-blue-800';
        return 'border-gray-300 bg-white hover:bg-gray-50';
    };

    const getInputClass = (qId, correctAnswer) => {
        if (!showResults || !answers[qId]) return 'border-gray-300';
        const userAnswer = answers[qId].trim().toLowerCase().replace(/[?.]/g, '');
        const correct = correctAnswer.toLowerCase().replace(/[?.]/g, '');
        return userAnswer === correct ? 'border-green-500' : 'border-red-500';
    };

    const handleShowAnswer = () => {
        const correctSels = {};
        const correctAns = {};
        exerciseDataD.forEach(q => {
            correctSels[q.id] = q.correctOption;
            correctAns[q.id] = q.correctAnswer;
        });
        setSelections(correctSels);
        setAnswers(correctAns);
        setShowResults(true);
    };

    const handleStartAgain = () => {
        setSelections({});
        setAnswers({});
        setShowResults(false);
    };

    const checkAnswers = () => {
        setShowResults(true);
        let score = 0;
        const total = exerciseDataD.length * 2;
        exerciseDataD.forEach(q => {
            if (selections[q.id] === q.correctOption) score++;
            const userAnswer = (answers[q.id] || '').trim().toLowerCase().replace(/[?.]/g, '');
            const correctAnswer = q.correctAnswer.toLowerCase().replace(/[?.]/g, '');
            if (userAnswer === correctAnswer) score++;
        });
        if (score === total) ValidationAlert.success(`Score: ${score} / ${total}`);
        else if (score > 0) ValidationAlert.error(`Score: ${score} / ${total}`);
        else ValidationAlert.warning("No correct answers. Try again.");
    };

    return (
        <div className="p-6 max-w-5xl mx-auto font-sans mt-10">
            <div className="flex items-center gap-4 mb-6">
                <span className="ex-A">D</span>
                <h1 className="header-title-page8">Look, read, and circle. Answer.</h1>
            </div>

            <div className="space-y-6 mb-20">
                {exerciseDataD.map((q, index) => (
                    <div key={q.id} className="grid grid-cols-[auto_1fr_1fr] items-center gap-x-6 gap-y-2">
                        <span className="font-bold text-blue-600">{index + 1}</span>
                        <img src={q.img} alt={`Question ${index + 1}`} className="max-w-24 max-h-24 object-contain rounded-lg bg-gray-50 border row-span-2" />

                        <div className="col-start-2 col-span-2 space-y-2">
                            {q.options.map(opt => (
                                <button key={opt} onClick={() => handleSelect(q.id, opt)}
                                    className={`max-w-full text-left px-4 py-2 rounded-full border-2 text-lg transition-all ${getOptionClass(q.id, opt, q.correctOption)}`}>
                                    {opt}
                                </button>
                            ))}
                            <div className="col-start-3 ">
                                <select
                                    value={answers[q.id] || ''}
                                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                                    className={`cursor-pointer w-full bg-transparent border-b-2 pb-1 focus:outline-none text-lg ${getInputClass(q.id, q.correctAnswer)}`}
                                >
                                    <option value="" disabled>select</option>
                                    <option value="No, she doesn't.">No, she doesn't.</option>
                                    <option value="No, he doesn't.">No, he doesn't.</option>
                                    <option value="Yes, she does.">Yes, she does.</option>
                                </select>
                            </div>
                        </div>


                    </div>
                ))}
            </div>

            <Button handleShowAnswer={handleShowAnswer} handleStartAgain={handleStartAgain} checkAnswers={checkAnswers}/>

        </div>
    );
};

export default WB_Unit5_Page28_Q2;

import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable, closestCenter } from '@dnd-kit/core';

// استيراد الصور ومكونات الأزرار والتنبيهات
import placeholderImg from "../../../assets/imgs/test6.png";
import Button from '../button';
import ValidationAlert from '../../Popup/ValidationAlert';

// بيانات التمرين
const exerciseData = [
    {
        id: 'q1',
        img: placeholderImg,
        correctQuestion: "What's their job?",
        correctAnswer: "They're police officers.",
    },
    {
        id: 'q2',
        img: placeholderImg,
        correctQuestion: "What's his job?",
        correctAnswer: "He's a taxi driver.",
    },
    {
        id: 'q3',
        img: placeholderImg,
        correctQuestion: "What's his job?",
        correctAnswer: "He's a teacher.",
    },
    {
        id: 'q4',
        img: placeholderImg,
        correctQuestion: "What's his job?",
        correctAnswer: "He's a farmer.",
    },
];

const wordBank = [
    " What's","a ","What's ", "his", "their", 
    "He's", "They're", " a", "an","job?"," What's ", "job?", "police officers.", "taxi driver.", "teacher.", "farmer.","a","  What's", "job?",
];

const DraggableWord = ({ word }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: word });
    const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 100 } : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}
            className="px-3 py-1 bg-white border border-gray-300 rounded-md shadow-sm cursor-grab active:cursor-grabbing touch-none">
            {word}
        </div>
    );
};

const DropZone = ({ id, children, isOver, className }) => {
    const { setNodeRef } = useDroppable({ id });
    return (
        <div ref={setNodeRef} className={`flex flex-wrap items-center gap-2 p-2 border-b-2 transition-colors ${className} ${isOver ? 'bg-blue-50' : ''}`}>
            {children || <span className="text-transparent">.</span>}
        </div>
    );
};

const WB_Unit4_Page22_Q2 = () => {
    const [droppedWords, setDroppedWords] = useState({}); 
    const [showResults, setShowResults] = useState(false);
    const usedWords = Object.values(droppedWords).flat();

    const handleDragEnd = (event) => {
        const { over, active } = event;
        if (!over) return;

        const word = active.id;
        const dropZoneId = over.id; 

        setDroppedWords(prev => {
            const newDropped = { ...prev };
            Object.keys(newDropped).forEach(key => {
                newDropped[key] = newDropped[key].filter(w => w !== word);
            });
            const currentWords = newDropped[dropZoneId] || [];
            newDropped[dropZoneId] = [...currentWords, word];
            return newDropped;
        });
        setShowResults(false);
    };

    const removeWord = (zoneId, wordToRemove) => {
        setDroppedWords(prev => ({
            ...prev,
            [zoneId]: prev[zoneId].filter(w => w !== wordToRemove),
        }));
    };

    const getZoneClass = (zoneId, correctSentence) => {
        if (!showResults) return 'border-gray-300';
        const userSentence = (droppedWords[zoneId] || []).join(' ');
        if (!userSentence) return 'border-gray-300';
        return userSentence === correctSentence ? 'border-green-500' : 'border-red-500';
    };

    const handleShowAnswer = () => {
        const correctPlacements = {};
        exerciseData.forEach(q => {
            correctPlacements[`${q.id}-question`] = q.correctQuestion.split(' ');
            correctPlacements[`${q.id}-answer`] = q.correctAnswer.split(' ');
        });
        setDroppedWords(correctPlacements);
        setShowResults(true);
    };

    const handleStartAgain = () => {
        setDroppedWords({});
        setShowResults(false);
    };

    const checkAnswers = () => {
        setShowResults(true);
        let score = 0;
        const total = exerciseData.length * 2; // سؤال وجواب لكل صورة

        exerciseData.forEach(q => {
            const userQuestion = (droppedWords[`${q.id}-question`] || []).join(' ');
            const userAnswer = (droppedWords[`${q.id}-answer`] || []).join(' ');
            if (userQuestion === q.correctQuestion) score++;
            if (userAnswer === q.correctAnswer) score++;
        });

        if (score === total) {
            ValidationAlert.success(`Score: ${score} / ${total}`);
        } else if (score > 0) {
            ValidationAlert.error(`Score: ${score} / ${total}`);
        } else {
            ValidationAlert.warning("No correct answers. Try again.");
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
            <div className="p-6 max-w-5xl mx-auto font-sans">
                <div className="flex items-center gap-4 mb-6">
                    <span className="ex-A">D</span>
                    <h1 className="header-title-page8">Look and write the question and answer.</h1>
                </div>

                <div className="flex flex-wrap justify-center gap-3 p-4 mb-8 border-2 border-dashed border-gray-300 rounded-lg">
                    {wordBank
    .filter(word => !usedWords.includes(word))
    .map(word => (
        <DraggableWord key={word} word={word} />
))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 mb-20">
                    {exerciseData.map((q, index) => (
                        <div key={q.id} className="space-y-2">
                            <div className="flex items-center gap-4">
                                <span className="font-bold text-blue-600">{index + 1}</span>
                                <img src={q.img} alt={`Job ${index + 1}`} className="max-w-full max-h-32 object-contain rounded-lg bg-gray-50 p-2" />
                            </div>
                            <div className="space-y-3 pl-6">
                                <DropZone id={`${q.id}-question`} className={getZoneClass(`${q.id}-question`, q.correctQuestion)}>
                                    {(droppedWords[`${q.id}-question`] || []).map(word => (
                                        <button key={word} onClick={() => removeWord(`${q.id}-question`, word)}
                                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-lg">
                                            {word}
                                        </button>
                                    ))}
                                </DropZone>
                                <DropZone id={`${q.id}-answer`} className={getZoneClass(`${q.id}-answer`, q.correctAnswer)}>
                                    {(droppedWords[`${q.id}-answer`] || []).map(word => (
                                        <button key={word} onClick={() => removeWord(`${q.id}-answer`, word)}
                                            className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-lg">
                                            {word}
                                        </button>
                                    ))}
                                </DropZone>
                            </div>
                        </div>
                    ))}
                </div>

                    <Button handleShowAnswer={handleShowAnswer} handleStartAgain={handleStartAgain} checkAnswers={checkAnswers} />
                
            </div>
        </DndContext>
    );
};

export default WB_Unit4_Page22_Q2;

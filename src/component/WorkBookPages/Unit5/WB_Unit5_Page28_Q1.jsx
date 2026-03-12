import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable, closestCenter } from '@dnd-kit/core';
import placeholderImg from "../../../assets/imgs/test6.png";
import Button from '../button';
import ValidationAlert from '../../Popup/ValidationAlert';

const exerciseDataC = [
    { id: 'c1', img: placeholderImg, correctQuestion: "Does he like chicken?", correctAnswer: "No, he doesn't." },
    { id: 'c2', img: placeholderImg, correctQuestion: "Does she like fruit?", correctAnswer: "No, she doesn't." },
    { id: 'c3', img: placeholderImg, correctQuestion: "Does he like cheese?", correctAnswer: "No, he doesn't." },
    { id: 'c4', img: placeholderImg, correctQuestion: "Does she like tea?", correctAnswer: "Yes, she does." },
];
const wordBank = [
    'Does', 'he', 'she', 'like', 'chicken?', 'fruit?', 'cheese?', 'tea?',
    'Yes,', 'No,', 'does.', "doesn't."
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
const DropZone = ({ id, children, className }) => {
    const { setNodeRef, isOver } = useDroppable({ id });
    return (
        <div ref={setNodeRef} className={`flex flex-wrap items-center gap-2 p-2 border-b-2 min-h-[48px] transition-colors ${className} ${isOver ? 'bg-blue-50' : ''}`}>
            {children.length > 0 ? children : <span className="text-transparent">.</span>}
        </div>
    );
};
const WB_Unit5_Page28_Q1 = () => {
    const [droppedWords, setDroppedWords] = useState({});
    const [showResults, setShowResults] = useState(false);
    const handleDragEnd = (event) => {
  const { over, active } = event;
  if (!over) return;

  const word = active.id;
  const dropZoneId = over.id;

  setDroppedWords(prev => {
    const newDropped = { ...prev };
    const currentWords = newDropped[dropZoneId] || [];

    newDropped[dropZoneId] = [...currentWords, word];

    return newDropped;
  });

  setShowResults(false);
};
    const removeWord = (zoneId, wordToRemove) => {
        setDroppedWords(prev => ({ ...prev, [zoneId]: prev[zoneId].filter(w => w !== wordToRemove) }));
    };
    const getZoneClass = (zoneId, correctSentence) => {
        if (!showResults) return 'border-gray-300';
        const userSentence = (droppedWords[zoneId] || []).join(' ');
        if (!userSentence) return 'border-gray-300';
        return userSentence === correctSentence ? 'border-green-500' : 'border-red-500';
    };
    const handleShowAnswer = () => {
        const correctPlacements = {};
        exerciseDataC.forEach(q => {
            correctPlacements[`${q.id}-q`] = q.correctQuestion.split(' ');
            correctPlacements[`${q.id}-a`] = q.correctAnswer.split(' ');
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
        const total = exerciseDataC.length * 2;
        exerciseDataC.forEach(q => {
            if ((droppedWords[`${q.id}-q`] || []).join(' ') === q.correctQuestion) score++;
            if ((droppedWords[`${q.id}-a`] || []).join(' ') === q.correctAnswer) score++;
        });
        if (score === total) ValidationAlert.success(`Score: ${score} / ${total}`);
        else if (score > 0) ValidationAlert.error(`Score: ${score} / ${total}`);
        else ValidationAlert.warning("No correct answers. Try again.");
    };
    return (
        <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
            <div className="p-6 max-w-5xl mx-auto font-sans">
                <div className="flex items-center gap-4 mb-6">
                    <span className="ex-A">C</span>
                    <h1 className="header-title-page8">Look, read, and write.</h1>
                </div>
                <div className="flex flex-wrap justify-center gap-3 p-4 mb-8 border-2 border-dashed border-gray-300 rounded-lg">
                    {wordBank.map(word => <DraggableWord key={word} word={word} />)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {exerciseDataC.map((q, index) => (
                        <div key={q.id} className="flex items-center gap-4">
                            <span className="font-bold text-blue-600 self-start">{index + 1}</span>
                            <div className="flex-1 space-y-3">
                                <img src={q.img} alt={`Question ${index + 1}`} className="max-w-full max-h-32 object-contain rounded-lg bg-gray-50 border" />
                                <DropZone id={`${q.id}-q`} className={getZoneClass(`${q.id}-q`, q.correctQuestion)}>
                                    {(droppedWords[`${q.id}-q`] || []).map(word => (
                                        <button key={word} onClick={() => removeWord(`${q.id}-q`, word)} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-lg">{word}</button>
                                    ))}
                                </DropZone>
                                <DropZone id={`${q.id}-a`} className={getZoneClass(`${q.id}-a`, q.correctAnswer)}>
                                    {(droppedWords[`${q.id}-a`] || []).map(word => (
                                        <button key={word} onClick={() => removeWord(`${q.id}-a`, word)} className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-lg">{word}</button>
                                    ))}
                                </DropZone>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='mt-12 flex justify-center'>
                    <Button handleShowAnswer={handleShowAnswer} handleStartAgain={handleStartAgain} checkAnswers={checkAnswers} />
                </div>
            </div>
        </DndContext>
    );
};
export default WB_Unit5_Page28_Q1;

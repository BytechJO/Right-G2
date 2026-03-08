import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable, closestCenter } from '@dnd-kit/core';

// استيراد الصور ومكونات الأزرار والتنبيهات
import placeholderImg from "../../../assets/imgs/test6.png";
import Button from '../button';
import ValidationAlert from '../../Popup/ValidationAlert';

// بيانات التمرين
const matchQuestions = [
    { id: 'q1', question: 'Can he play the drum?', answer: 'Yes, he can.' },
    { id: 'q2', question: 'Can she swim?', answer: 'Yes, she can.' },
    { id: 'q3', question: 'Can she drive the car?', answer: 'No, she can\'t.' },
    { id: 'q4', question: 'Can she make sandwiches?', answer: 'Yes, she can.' },
];

const matchImages = [
    { id: 'img1', img: placeholderImg, correctQuestionId: 'q2' }, 
    { id: 'img2', img: placeholderImg, correctQuestionId: 'q4' }, 
    { id: 'img3', img: placeholderImg, correctQuestionId: 'q3' }, 
    { id: 'img4', img: placeholderImg, correctQuestionId: 'q1' }, 
];

const DraggableQuestion = ({ id, question, answer, isPlaced }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
    const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 100 } : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}
            className={`p-3 border rounded-lg shadow-sm cursor-grab active:cursor-grabbing touch-none transition-opacity ${isPlaced ? 'opacity-20' : 'bg-white'}`}>
            <p className="font-semibold">{question}</p>
            <p className="text-gray-600">{answer}</p>
        </div>
    );
};

const DropZone = ({ id, children, isOver, borderColor }) => {
    const { setNodeRef } = useDroppable({ id });
    return (
        <div ref={setNodeRef} className={`relative w-48 h-40 flex flex-col items-center justify-end p-2 border-2 border-dashed rounded-lg transition-colors ${isOver ? 'bg-blue-50' : ''} ${borderColor}`}>
            {children}
        </div>
    );
};

const WB_Unit3_Page18_Q2 = () => {
    const [placedQuestions, setPlacedQuestions] = useState({}); // { img1: 'q2', img2: 'q1' }
    const [showResults, setShowResults] = useState(false);

    const handleDragEnd = (event) => {
        const { over, active } = event;
        if (!over) return;

        const questionId = active.id;
        const imageId = over.id;

        const newPlaced = { ...placedQuestions };
        // إزالة السؤال من أي مكان كان فيه سابقاً
        Object.keys(newPlaced).forEach(key => {
            if (newPlaced[key] === questionId) delete newPlaced[key];
        });

        // إذا كانت منطقة الإفلات تحتوي على سؤال، أعده
        const existingQuestion = newPlaced[imageId];
        if (existingQuestion) {
            delete newPlaced[imageId];
        }

        // وضع السؤال في المكان الجديد
        newPlaced[imageId] = questionId;
        setPlacedQuestions(newPlaced);
        setShowResults(false);
    };

    const getBorderColor = (imgId) => {
        if (!showResults || !placedQuestions[imgId]) return 'border-gray-300';
        const correctId = matchImages.find(img => img.id === imgId).correctQuestionId;
        return placedQuestions[imgId] === correctId ? 'border-green-500' : 'border-red-500';
    };

    const handleShowAnswer = () => {
        const correctPlacements = {};
        matchImages.forEach(img => {
            correctPlacements[img.id] = img.correctQuestionId;
        });
        setPlacedQuestions(correctPlacements);
        setShowResults(true);
    };

    const handleStartAgain = () => {
        setPlacedQuestions({});
        setShowResults(false);
    };

    const checkAnswers = () => {
        setShowResults(true);
        let score = 0;
        matchImages.forEach(img => {
            if (placedQuestions[img.id] === img.correctQuestionId) {
                score++;
            }
        });

        if (score === matchImages.length) {
            ValidationAlert.success(`Score: ${score} / ${matchImages.length}`);
        } else if (score > 0) {
            ValidationAlert.error(`Score: ${score} / ${matchImages.length}`);
        };
        if (!score) {
            ValidationAlert.warning("No matches. Try again.");
        }
    };

    const unplacedQuestions = matchQuestions.filter(q => !Object.values(placedQuestions).includes(q.id));

    return (
        <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
            <div className="p-6 max-w-5xl mx-auto font-sans mt-8">
                <div className="flex items-center gap-4 mb-6">
                    <span className="ex-A">H</span>
                    <h1 className="header-title-page8">Read, look, and match.</h1>
                </div>

                {/* منطقة الأسئلة القابلة للسحب */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {unplacedQuestions.map(q => (
                        <DraggableQuestion key={q.id} id={q.id} question={q.question} answer={q.answer} isPlaced={false} />
                    ))}
                    {/* عرض الأسئلة التي تم وضعها ولكن بشكل شفاف لإبقاء التنسيق */}
                     {matchQuestions.filter(q => Object.values(placedQuestions).includes(q.id)).map(q => (
                        <DraggableQuestion key={q.id} id={q.id} question={q.question} answer={q.answer} isPlaced={true} />
                    ))}
                </div>

                {/* مناطق إفلات الصور */}
                <div className="flex flex-wrap justify-center gap-10 mt-40">
                    {matchImages.map(img => (
                        <DropZone key={img.id} id={img.id} borderColor={getBorderColor(img.id)}>
                            <img src={img.img} alt={`Match for ${img.id}`} className="max-w-full max-h-full object-contain rounded-md" />
                            {placedQuestions[img.id] && (
                                <div className="absolute  max-w-44">
                                    <DraggableQuestion
                                        id={placedQuestions[img.id]}
                                        {...matchQuestions.find(q => q.id === placedQuestions[img.id])}
                                    />
                                </div>
                            )}
                        </DropZone>
                    ))}
                </div>

                <div className='mt-16 flex justify-center'>
                    <Button handleShowAnswer={handleShowAnswer} handleStartAgain={handleStartAgain} checkAnswers={checkAnswers} />
                </div>
            </div>
        </DndContext>
    );
};

export default WB_Unit3_Page18_Q2;

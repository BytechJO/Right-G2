import React, { useState } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor, DragOverlay } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ValidationAlert from '../../Popup/ValidationAlert';
import Button from '../button';
import img from "../../../assets/imgs/test6.png";

const images = [
    { id: 'img1', src: img },
    { id: 'img2', src: img },
    { id: 'img3', src: img },
    { id: 'img4', src: img }
];

const QUESTIONS = [
    { id: 'q1', text: '1 What time is it?' },
    { id: 'q2', text: '2 What time is it?' },
    { id: 'q3', text: '3 What time is it?' },
    { id: 'q4', text: '3 What time is it?' },
];

const ANSWERS_POOL = [
    { id: 'a1', text: 'It is four thirty in the afternoon' },
    { id: 'a2', text: 'It\'s eight o\'clock' },
    { id: 'a3', text: 'It is one o\'clock in the' },
    { id: 'a4', text: 'It is twelve o\'clock' },
];

const CORRECT_MAP = { q1: 'a1', q2: 'a4', q3: 'a2', q4: 'a3' };

function DraggableSentence({ answer, isUsed }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: answer.id });
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging || isUsed ? 0.5 : 1 };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`p-2 bg-white border rounded shadow-sm cursor-grab text-sm ${isUsed ? 'bg-gray-100 text-gray-400' : 'text-blue-700 hover:border-blue-500'}`}
        >
            {answer.text}
        </div>
    );
}

function AnswerDropZone({ id, content, isCorrect, isSubmitted }) {
    const { setNodeRef, isOver } = useSortable({ id });
    const bg = isSubmitted ? (isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500') : (isOver ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 border-gray-300');

    return (
        <div
            ref={setNodeRef}
            className={`mt-1 min-h-[40px] border-b-2 p-2 transition-all ${bg}`}
        >
            {content ? <span className="text-blue-800 font-medium">{ANSWERS_POOL.find(a => a.id === content).text}</span> : <span className="text-gray-300 italic text-sm">Drag answer here...</span>}
        </div>
    );
}

const WB_Unit7_Page40_Q2 = () => {
    const [placedAnswers, setPlacedAnswers] = useState({ q1: null, q2: null, q3: null, q4: null });
    const [activeId, setActiveId] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (over && over.id.startsWith('q')) {
            setPlacedAnswers(prev => ({ ...prev, [over.id]: active.id }));
        }
        setActiveId(null);
    };

    const checkAnswers = () => {
        const hasEmpty = Object.values(placedAnswers).some(v => v === null);
        if (hasEmpty) {
            ValidationAlert.info();
            return;
        }
        let currentScore = 0;
        Object.keys(CORRECT_MAP).forEach(qId => {
            if (placedAnswers[qId] === CORRECT_MAP[qId]) {
                currentScore++;
            }
        });
        setScore(currentScore);
        setIsSubmitted(true);
        const total = Object.keys(CORRECT_MAP).length;
        const scoreMessage = `Score: ${currentScore} / ${total}`;
        if (currentScore === total) {
            ValidationAlert.success(scoreMessage);
        }
        else if (currentScore === 0) {
            ValidationAlert.error(scoreMessage);
        }
        else {
            ValidationAlert.warning(scoreMessage);
        }
    };

    const handleShowAnswer = () => {

        setPlacedAnswers(CORRECT_MAP);

        const total = Object.keys(CORRECT_MAP).length;

        setScore(total);
        setIsSubmitted(true);

        const scoreMessage = `Score: ${total} / ${total}`;

    };

    return (
        <>

            <div className="flex items-center gap-4 mt-10 ml-70">
                <div className="ex-A">D</div>
                <h1 className="header-title-page8">Look and complete the conversations.</h1>
            </div>
            <DndContext sensors={sensors} onDragStart={(e) => setActiveId(e.active.id)} onDragEnd={handleDragEnd}>

                <div className="p-6 max-w-5xl mx-auto flex flex-col md:flex-row gap-6">


                    <div className="flex-1 space-y-6">
                        {QUESTIONS.map((q, index) => {
                            const image = images[index];

                            return (
                                <div key={q.id} className="flex items-center gap-4 pl-4">
                                    <img
                                        src={image.src}
                                        className="max-w-24 max-h-24 object-cover"
                                    />

                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800">{q.text}</p>
                                        <AnswerDropZone
                                            id={q.id}
                                            content={placedAnswers[q.id]}
                                            isCorrect={placedAnswers[q.id] === CORRECT_MAP[q.id]}
                                            isSubmitted={isSubmitted}
                                        />
                                    </div>

                                </div>
                            );
                        })}
                    </div>

                    <div className="w-full md:w-80 space-y-4">

                        <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                            <h3 className="font-bold text-blue-800 mb-3 text-center">Answers Bank</h3>
                            <div className="space-y-2">
                                <SortableContext items={ANSWERS_POOL.map(a => a.id)}>
                                    {ANSWERS_POOL.map(ans => (
                                        <DraggableSentence key={ans.id} answer={ans} isUsed={Object.values(placedAnswers).includes(ans.id)} />
                                    ))}
                                </SortableContext>
                            </div>
                        </div>
                    </div>
                </div>

                <Button handleShowAnswer={handleShowAnswer} handleStartAgain={() => { setPlacedAnswers({ q1: null, q2: null, q3: null, q4: null }); setIsSubmitted(false); }} checkAnswers={checkAnswers} />


                <DragOverlay>
                    {activeId ? (
                        <div className="p-2 bg-white border-2 border-blue-500 rounded shadow-xl text-blue-800 text-sm font-bold">
                            {ANSWERS_POOL.find(a => a.id === activeId).text}
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </>

    );
};

export default WB_Unit7_Page40_Q2;

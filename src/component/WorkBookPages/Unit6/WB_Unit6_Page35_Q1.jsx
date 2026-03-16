import React, { useState } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor, DragOverlay } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ValidationAlert from '../../Popup/ValidationAlert';
import Button from '../button';

import placeholderImg from "../../../assets/imgs/test6.png";



const SENTENCES = [
    { id: 's1', text: 'John goes to school at eight o\'clock in the morning.' },
    { id: 's2', text: 'John comes home at 2:30 in the afternoon.' },
    { id: 's3', text: 'John does his homework at 4:00 in the afternoon.' },
    { id: 's4', text: 'John goes to bed at 8:30 in the evening.' },
];

const CORRECT_ANSWERS = {
    drop_school: 's1',
    drop_home: 's2',
    drop_homework: 's3',
    drop_bed: 's4',
};

// مكون الجملة القابلة للسحب
function DraggableSentence({ sentence, isUsed }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: sentence.id });
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging || isUsed ? 0.5 : 1 };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`p-3 bg-white border-2 border-blue-100 rounded-xl shadow-sm cursor-grab text-blue-800 font-medium text-sm transition-all ${isUsed ? 'bg-gray-100 text-gray-400 border-gray-200 pointer-events-none' : 'hover:border-blue-400 hover:shadow-md'}`}
        >
            {sentence.text}
        </div>
    );
}

// مكون منطقة الإسقاط تحت كل صورة
function PictureDropZone({ id, imgSrc, title, content, isCorrect, isSubmitted }) {
    const { setNodeRef, isOver } = useSortable({ id });
    const borderColor = isSubmitted ? (isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : (isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300');

    return (
        <div className="flex flex-col items-center space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="relative w-full h-40 overflow-hidden rounded-xl border-2 border-white shadow-inner">
                <img src={imgSrc} alt={title} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-white/90 px-3 py-1 rounded-lg text-xs font-bold text-gray-700 shadow-sm border border-gray-200">
                    {title}
                </div>
            </div>

            <div
                ref={setNodeRef}
                className={`w-full min-h-[60px] border-2 border-dashed rounded-xl flex items-center justify-center p-2 text-center transition-all ${borderColor}`}
            >
                {content ? (
                    <span className="text-blue-900 font-bold text-sm leading-tight">
                        {SENTENCES.find(s => s.id === content).text}
                    </span>
                ) : (
                    <span className="text-gray-300 text-xs italic">Drag the correct sentence here...</span>
                )}
            </div>
        </div>
    );
}

const WB_Unit6_Page35_Q1 = () => {
    const [placed, setPlaced] = useState({ drop_school: null, drop_home: null, drop_homework: null, drop_bed: null });
    const [activeId, setActiveId] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (over && over.id.startsWith('drop')) {
            setPlaced(prev => ({ ...prev, [over.id]: active.id }));
        }
        setActiveId(null);
    };

    const checkAnswers = () => {
        const hasEmpty = Object.values(placed).some(value => value === null);
        if (hasEmpty) {
            ValidationAlert.info();
            return;
        }

        let currentScore = 0;
        Object.keys(CORRECT_ANSWERS).forEach(key => {
            if (placed[key] === CORRECT_ANSWERS[key]) currentScore++;
        });

        const total = Object.keys(CORRECT_ANSWERS).length;
        const scoreMessage = `Your score: ${currentScore} / ${total}`;

        if (currentScore === total) {
            ValidationAlert.success(scoreMessage);
        } else if (currentScore === 0) {
            ValidationAlert.error(scoreMessage);
        } else {
            ValidationAlert.warning(scoreMessage);
        }
        setIsSubmitted(true);
    };

    const handleReset = () => {
        setPlaced({ drop_school: null, drop_home: null, drop_homework: null, drop_bed: null });
        setIsSubmitted(false);
    };

    const handleShowAnswer = () => {
        setPlaced(CORRECT_ANSWERS);
        setIsSubmitted(true);
    };

    return (
        <>
            <div className="flex items-center gap-4 mt-10 ml-50">
                <div className="ex-A">E</div>
                <h1 className="header-title-page8">Look, read, and write.</h1>
            </div>
            <DndContext sensors={sensors} onDragStart={(e) => setActiveId(e.active.id)} onDragEnd={handleDragEnd}>
                <div className="p-8 max-w-6xl mx-auto font-sans border border-gray-100">
                    <div className="flex flex-col lg:flex-row gap-10">
                        
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <PictureDropZone id="drop_school" imgSrc={placeholderImg} title="morning" content={placed.drop_school} isCorrect={placed.drop_school === CORRECT_ANSWERS.drop_school} isSubmitted={isSubmitted} />
                            <PictureDropZone id="drop_home" imgSrc={placeholderImg} title="afternoon" content={placed.drop_home} isCorrect={placed.drop_home === CORRECT_ANSWERS.drop_home} isSubmitted={isSubmitted} />
                            <PictureDropZone id="drop_homework" imgSrc={placeholderImg} title="afternoon" content={placed.drop_homework} isCorrect={placed.drop_homework === CORRECT_ANSWERS.drop_homework} isSubmitted={isSubmitted} />
                            <PictureDropZone id="drop_bed" imgSrc={placeholderImg} title="evening" content={placed.drop_bed} isCorrect={placed.drop_bed === CORRECT_ANSWERS.drop_bed} isSubmitted={isSubmitted} />
                        </div>

                        {/* بنك الجمل */}
                        <div className="w-full lg:w-80">
                            <div className="sticky top-6 bg-blue-50 p-6 rounded-3xl border-2 border-blue-100 shadow-sm">
                                <h3 className="font-black text-blue-900 mb-5 text-center uppercase tracking-wider">Sentences Bank</h3>
                                <div className="flex flex-col gap-3">
                                    <SortableContext items={SENTENCES.map(s => s.id)}>
                                        {SENTENCES.map(sentence => (
                                            <DraggableSentence key={sentence.id} sentence={sentence} isUsed={Object.values(placed).includes(sentence.id)} />
                                        ))}
                                    </SortableContext>
                                </div>
                                <p className="mt-6 text-xs text-blue-400 text-center font-medium italic">
                                    Drag the sentences to match John's activities!
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col items-center">
                        <Button
                            handleShowAnswer={handleShowAnswer}
                            handleStartAgain={handleReset}
                            checkAnswers={checkAnswers}
                        />
                    </div>
                </div>

                <DragOverlay>
                    {activeId ? (
                        <div className="p-4 bg-white border-2 border-blue-500 rounded-2xl shadow-2xl text-blue-900 font-bold text-sm scale-105 rotate-2">
                            {SENTENCES.find(s => s.id === activeId).text}
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </>

    );
};

export default WB_Unit6_Page35_Q1;

import React, { useState } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor, DragOverlay } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ValidationAlert from '../../Popup/ValidationAlert';
import Button from '../button';

// استيراد الصور (تأكد من تسميتها ومساراتها)
import placeholderImg from "../../../assets/imgs/test6.png";

const NUMBERS = [
    { id: 'n1', val: '1' }, { id: 'n2', val: '2' }, { id: 'n3', val: '3' },
    { id: 'n4', val: '4' }, { id: 'n5', val: '5' }, { id: 'n6', val: '6' }
];

const CORRECT_ANSWERS = {
    slot_getup: 'n1',
    slot_brushteeth: 'n2',
    slot_washface: 'n3',
    slot_brushhair: 'n4',
    slot_eatbreakfast: 'n5',
    slot_goschool: 'n6',
};

function DraggableNumber({ num, isUsed }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: num.id });
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging || isUsed ? 0.5 : 1 };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`w-10 h-10 flex items-center justify-center bg-orange-500 text-white rounded-full font-bold text-xl cursor-grab shadow-md ${isUsed ? 'opacity-30 pointer-events-none' : 'hover:scale-110'}`}
        >
            {num.val}
        </div>
    );
}

function ImageSlot({ id, imgSrc, content, isCorrect, isSubmitted }) {
    const { setNodeRef, isOver } = useSortable({ id });
    const borderColor = isSubmitted ? (isCorrect ? 'border-green-500' : 'border-red-500') : (isOver ? 'border-blue-500' : 'border-gray-200');

    return (
        <div ref={setNodeRef} className="relative group">
            <img src={imgSrc} alt="activity" className={`max-w-32 max-h-32 rounded-full border-4 object-cover transition-all ${borderColor}`} />
            <div className={`absolute bottom-0 right-0 w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-lg shadow-inner ${content ? 'bg-orange-500 text-white border-orange-600' : 'bg-white border-gray-300'}`}>
                {content ? NUMBERS.find(n => n.id === content).val : ''}
            </div>
        </div>
    );
}

const WB_Unit6_Page34_Q1 = () => {
    const [placedNumbers, setPlacedNumbers] = useState({ slot_getup: null, slot_brushteeth: null, slot_washface: null, slot_brushhair: null, slot_eatbreakfast: null, slot_goschool: null });
    const [activeId, setActiveId] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (over && over.id.startsWith('slot')) {
            setPlacedNumbers(prev => ({ ...prev, [over.id]: active.id }));
        }
        setActiveId(null);
    };

    const checkAnswers = () => {
        const hasEmpty = Object.values(placedNumbers).some(value => value === null);
        if (hasEmpty) {
            ValidationAlert.info();
            return;
        }

        let currentScore = 0;
        Object.keys(CORRECT_ANSWERS).forEach(key => {
            if (placedNumbers[key] === CORRECT_ANSWERS[key]) currentScore++;
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

    return (
        <>
            <div className="flex items-center gap-4 mt-10 ml-70">
                <div className="ex-A">C</div>
                <h1 className="header-title-page8">Read, look, and number.</h1>
            </div>
            <DndContext sensors={sensors} onDragStart={(e) => setActiveId(e.active.id)} onDragEnd={handleDragEnd}>
                <div className="p-6 max-w-4xl mx-auto">



                    <div className="flex flex-col md:flex-row gap-8">

                        <div className="flex-1 space-y-3 text-lg font-medium text-gray-600">
                            <p>1 Helen gets up.</p>
                            <p>2 She brushes her teeth.</p>
                            <p>3 Helen washes her face.</p>
                            <p>4 She brushes her hair.</p>
                            <p>5 She eats breakfast.</p>
                            <p>6 Helen goes to school.</p>

                            <div className="mt-10 p-4 bg-orange-50 rounded-lg border-2 border-dashed border-orange-200">
                                <p className="text-sm text-orange-600 mb-3 text-center font-bold">Drag numbers to the images:</p>
                                <div className="flex justify-center gap-3">
                                    <SortableContext items={NUMBERS.map(n => n.id)}>
                                        {NUMBERS.map(n => (
                                            <DraggableNumber key={n.id} num={n} isUsed={Object.values(placedNumbers).includes(n.id)} />
                                        ))}
                                    </SortableContext>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <ImageSlot id="slot_brushteeth" imgSrc={placeholderImg} content={placedNumbers.slot_brushteeth} isCorrect={placedNumbers.slot_brushteeth === CORRECT_ANSWERS.slot_brushteeth} isSubmitted={isSubmitted} />
                            <ImageSlot id="slot_getup" imgSrc={placeholderImg} content={placedNumbers.slot_getup} isCorrect={placedNumbers.slot_getup === CORRECT_ANSWERS.slot_getup} isSubmitted={isSubmitted} />
                            <ImageSlot id="slot_brushhair" imgSrc={placeholderImg} content={placedNumbers.slot_brushhair} isCorrect={placedNumbers.slot_brushhair === CORRECT_ANSWERS.slot_brushhair} isSubmitted={isSubmitted} />
                            <ImageSlot id="slot_washface" imgSrc={placeholderImg} content={placedNumbers.slot_washface} isCorrect={placedNumbers.slot_washface === CORRECT_ANSWERS.slot_washface} isSubmitted={isSubmitted} />
                            <ImageSlot id="slot_goschool" imgSrc={placeholderImg} content={placedNumbers.slot_goschool} isCorrect={placedNumbers.slot_goschool === CORRECT_ANSWERS.slot_goschool} isSubmitted={isSubmitted} />
                            <ImageSlot id="slot_eatbreakfast" imgSrc={placeholderImg} content={placedNumbers.slot_eatbreakfast} isCorrect={placedNumbers.slot_eatbreakfast === CORRECT_ANSWERS.slot_eatbreakfast} isSubmitted={isSubmitted} />
                        </div>
                    </div>

                        <Button
                            handleShowAnswer={() => { setPlacedNumbers(CORRECT_ANSWERS); setIsSubmitted(true); }}
                            handleStartAgain={() => { setPlacedNumbers({ slot_getup: null, slot_brushteeth: null, slot_washface: null, slot_brushhair: null, slot_eatbreakfast: null, slot_goschool: null }); setIsSubmitted(false); }}
                            checkAnswers={checkAnswers}
                        />
                </div>

                <DragOverlay>
                    {activeId ? (
                        <div className="max-w-10 max-h-10 flex items-center justify-center bg-orange-600 text-white rounded-full font-bold text-xl shadow-2xl scale-110">
                            {NUMBERS.find(n => n.id === activeId).val}
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </>

    );
};

export default WB_Unit6_Page34_Q1;

import React, { useState, useRef } from 'react';
import ValidationAlert from '../../Popup/ValidationAlert';
import Button from '../button';

import imgJohn from "../../../assets/imgs/test6.png";
import imgMomAunt from "../../../assets/imgs/test6.png";
import imgDad from "../../../assets/imgs/test6.png";
import imgGrandpa from "../../../assets/imgs/test6.png";
import imgSarahJack from "../../../assets/imgs/test6.png";
import imgHelenStella from "../../../assets/imgs/test6.png";

import imgBike from "../../../assets/imgs/test6.png";
import imgDress from "../../../assets/imgs/test6.png";
import imgTie from "../../../assets/imgs/test6.png";
import imgGlasses from "../../../assets/imgs/test6.png";
import imgDollRobot from "../../../assets/imgs/test6.png";
import imgDresses from "../../../assets/imgs/test6.png";

const CORRECT_ANSWERS = {
    q1: 'chip1',
    q2: 'chip2',
    q3: 'chip3',
    q4: 'chip4',
    q5: 'chip5',
    q6: 'chip6',
};

const QUESTIONS = [
    { key: 'q1', personImg: imgJohn,       itemImg: imgBike,      prefix: 'John',             suffix: ''  },
    { key: 'q2', personImg: imgMomAunt,    itemImg: imgDress,     prefix: 'Mom and my aunt',  suffix: ''  },
    { key: 'q3', personImg: imgDad,        itemImg: imgTie,       prefix: 'Dad',              suffix: ''  },
    { key: 'q4', personImg: imgGrandpa,    itemImg: imgGlasses,   prefix: 'Grandpa has',      suffix: ''  },
    { key: 'q5', personImg: imgSarahJack,  itemImg: imgDollRobot, prefix: 'Sarah and Jack',   suffix: ''  },
    { key: 'q6', personImg: imgHelenStella,itemImg: imgDresses,   prefix: 'Helen and Stella', suffix: ''  },
];

// الـ chips المبعثرة (ترتيبها عشوائي)
const ALL_CHIPS = [
    { id: 'chip1', label: 'has a bike' },
    { id: 'chip2', label: 'have a dress' },
    { id: 'chip3', label: 'has a tie' },
    { id: 'chip4', label: 'glasses' },
    { id: 'chip5', label: 'have a doll and a robot' },
    { id: 'chip6', label: 'have dresses' },
];

// خلط عشوائي ثابت عند التحميل
const SHUFFLED_CHIPS = [...ALL_CHIPS].sort(() => Math.random() - 0.5);

const INITIAL_DROPS = { q1: null, q2: null, q3: null, q4: null, q5: null, q6: null };

const WB_Unit_LookAndWrite_DnD = () => {
    const [drops, setDrops] = useState({ ...INITIAL_DROPS });   
    const [dragOver, setDragOver] = useState(null);              
    const [showResults, setShowResults] = useState(false);
    const draggingChip = useRef(null);                          

    const usedChips = new Set(Object.values(drops).filter(Boolean));
    const availableChips = SHUFFLED_CHIPS.filter(c => !usedChips.has(c.id));

    const onChipDragStart = (e, chipId) => {
        draggingChip.current = chipId;
        e.dataTransfer.effectAllowed = 'move';
    };

    const onDropZoneDragOver = (e, qKey) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOver(qKey);
    };

    const onDropZoneDragLeave = () => setDragOver(null);

    const onDropZoneDrop = (e, qKey) => {
        e.preventDefault();
        setDragOver(null);
        const chipId = draggingChip.current;
        if (!chipId) return;

        setDrops(prev => {
            const next = { ...prev };
            Object.keys(next).forEach(k => { if (next[k] === chipId) next[k] = null; });
            next[qKey] = chipId;
            return next;
        });
        draggingChip.current = null;
        setShowResults(false);
    };

    const onDropZoneChipDragStart = (e, chipId, qKey) => {
        draggingChip.current = chipId;
        e.dataTransfer.effectAllowed = 'move';
    };

    const onPoolDrop = (e) => {
        e.preventDefault();
        const chipId = draggingChip.current;
        if (!chipId) return;
        setDrops(prev => {
            const next = { ...prev };
            Object.keys(next).forEach(k => { if (next[k] === chipId) next[k] = null; });
            return next;
        });
        draggingChip.current = null;
        setShowResults(false);
    };

    const onPoolDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };

    // ── Check ──
    const checkAnswers = () => {
        const allKeys = Object.keys(INITIAL_DROPS);
        const unanswered = allKeys.filter(k => !drops[k]);
        if (unanswered.length > 0) { ValidationAlert.info(); return; }

        let score = 0;
        allKeys.forEach(k => { if (drops[k] === CORRECT_ANSWERS[k]) score++; });
        const total = allKeys.length;
        const msg = `Score: ${score} / ${total}`;
        if (score === total) ValidationAlert.success(msg);
        else if (score > 0) ValidationAlert.warning(msg);
        else ValidationAlert.error(msg);
        setShowResults(true);
    };

    const handleReset = () => { setDrops({ ...INITIAL_DROPS }); setShowResults(false); };

    const handleShowAnswer = () => {
        setDrops({ ...CORRECT_ANSWERS });
        setShowResults(true);
    };

    // helper: لون الـ drop zone حسب الحالة
    const getDropZoneStyle = (qKey) => {
        const chipId = drops[qKey];
        const isOver = dragOver === qKey;
        const isCorrect = showResults && chipId === CORRECT_ANSWERS[qKey];
        const isWrong   = showResults && chipId && chipId !== CORRECT_ANSWERS[qKey];
        return {
            minWidth: 160,
            minHeight: 32,
            borderBottom: `2px dashed ${isOver ? '#3b82f6' : isCorrect ? '#16a34a' : isWrong ? '#dc2626' : '#9ca3af'}`,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 6px',
            transition: 'border-color 0.2s, background 0.2s',
            background: isOver ? '#eff6ff' : isCorrect ? '#f0fdf4' : isWrong ? '#fef2f2' : 'transparent',
            cursor: chipId ? 'grab' : 'default',
        };
    };

    const getChipStyle = (chipId, inZone = false, qKey = null) => {
        const isCorrect = showResults && qKey && chipId === CORRECT_ANSWERS[qKey];
        const isWrong   = showResults && qKey && chipId !== CORRECT_ANSWERS[qKey];
        return {
            display: 'inline-flex',
            alignItems: 'center',
            padding: '3px 10px',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'grab',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            border: `1.5px solid ${isCorrect ? '#16a34a' : isWrong ? '#dc2626' : '#3b82f6'}`,
            color:  isCorrect ? '#16a34a' : isWrong ? '#dc2626' : '#2563eb',
            background: isCorrect ? '#f0fdf4' : isWrong ? '#fef2f2' : '#eff6ff',
            transition: 'all 0.2s',
        };
    };

    return (
        <div className="p-6 max-w-4xl mx-auto font-sans">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="ex-A">I</div>
                <h1 className="header-title-page8">Look and write.</h1>
            </div>

            {/* Chips pool */}
            <div
                onDrop={onPoolDrop}
                onDragOver={onPoolDragOver}
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    padding: '10px 14px',
                    marginBottom: 24,
                    minHeight: 48,
                    border: '1.5px dashed #d1d5db',
                    borderRadius: 10,
                    background: '#f9fafb',
                }}
            >
                {availableChips.length === 0 && (
                    <span style={{ color: '#9ca3af', fontSize: 13 }}>Drag the world</span>
                )}
                {availableChips.map(chip => (
                    <span
                        key={chip.id}
                        draggable
                        onDragStart={e => onChipDragStart(e, chip.id)}
                        style={getChipStyle(chip.id)}
                    >
                        {chip.label}
                    </span>
                ))}
            </div>

            <div className="flex gap-4">
                <div className="flex flex-col gap-2" style={{ minWidth: 64 }}>
                    {QUESTIONS.map(q => (
                        <div key={q.key} className="flex items-center justify-center" style={{ height: 56 }}>
                            <img src={q.personImg} alt="person" className="object-contain" style={{ maxWidth: 52, maxHeight: 52 }} />
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-2" style={{ minWidth: 12 }}>
                    {QUESTIONS.map(q => (
                        <div key={q.key} style={{ height: 56 }} className="flex items-center">
                            <span style={{ width: 8, height: 8, borderRadius: '50%', border: '2px solid #aaa', display: 'inline-block' }} />
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-2" style={{ minWidth: 64 }}>
                    {QUESTIONS.map(q => (
                        <div key={q.key} className="flex items-center justify-center" style={{ height: 56 }}>
                            <img src={q.itemImg} alt="item" className="object-contain" style={{ maxWidth: 52, maxHeight: 52 }} />
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-2 flex-1">
                    {QUESTIONS.map((q, idx) => {
                        const droppedChipId = drops[q.key];
                        const droppedChip = droppedChipId ? ALL_CHIPS.find(c => c.id === droppedChipId) : null;
                        return (
                            <div key={q.key} className="flex items-center gap-2" style={{ height: 56 }}>
                                <span className="font-bold text-gray-400 text-sm" style={{ minWidth: 18 }}>
                                    {idx + 1}
                                </span>
                                <span className="text-gray-700 font-semibold text-sm whitespace-nowrap">
                                    {q.prefix}
                                </span>
                                <div
                                    style={getDropZoneStyle(q.key)}
                                    onDragOver={e => onDropZoneDragOver(e, q.key)}
                                    onDragLeave={onDropZoneDragLeave}
                                    onDrop={e => onDropZoneDrop(e, q.key)}
                                >
                                    {droppedChip ? (
                                        <span
                                            draggable
                                            onDragStart={e => onDropZoneChipDragStart(e, droppedChip.id, q.key)}
                                            style={getChipStyle(droppedChip.id, true, q.key)}
                                        >
                                            {droppedChip.label}
                                        </span>
                                    ) : (
                                        <span style={{ color: '#d1d5db', fontSize: 12, pointerEvents: 'none' }}>
                                            Drop here ...
                                        </span>
                                    )}
                                </div>

                                <span className="text-gray-700 font-semibold">.</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Buttons */}
            <div className="mt-10 flex justify-center">
                <Button
                    handleShowAnswer={handleShowAnswer}
                    handleStartAgain={handleReset}
                    checkAnswers={checkAnswers}
                />
            </div>
        </div>
    );
};

export default WB_Unit_LookAndWrite_DnD;
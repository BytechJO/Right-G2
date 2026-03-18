import React, { useState } from 'react';
import ValidationAlert from '../../Popup/ValidationAlert';
import Button from '../button';

import imgElephant from "../../../assets/imgs/test6.png";
import imgTube from "../../../assets/imgs/test6.png";
import imgGlue from "../../../assets/imgs/test6.png";
import imgBlue from "../../../assets/imgs/test6.png";
import imgCube from "../../../assets/imgs/test6.png";
import imgTune from "../../../assets/imgs/test6.png";

// FIX 5: تعريف واحد فقط للإجابات الصحيحة
const CORRECT_A = {
    q1_1: 'u', q1_2: 'e',
    q2_1: 'u', q2_2: 'e',
    q3_1: 'u', q3_2: 'e',
    q4_1: 'u', q4_2: 'e',
    q5_1: 'u', q5_2: 'e',
    q6_1: 'u', q6_2: 'e'
};

const OPTIONS = ['u', 'e', 'o', 'a', 'i'];

// FIX 3 + 6: تعريف صريح لأجزاء كل كلمة بدل split('_')
const WORD_PARTS = [
    { before: 'h', middle: 'g', after: '' },   // h_g_ → huge
    { before: 't', middle: 'b', after: '' },   // t_b_ → tube
    { before: 'gl', middle: '', after: '' },   // gl_ _ → glue
    { before: 'bl', middle: '', after: '' },   // bl_ _ → blue
    { before: 'c', middle: 'b', after: '' },   // c_b_ → cube
    { before: 't', middle: 'n', after: '' },   // t_n_ → tune
];

const IMGS = [imgElephant, imgTube, imgGlue, imgBlue, imgCube, imgTune];

// FIX 4: الـ reset state الصحيح
const INITIAL_STATE = {
    q1_1: '', q1_2: '',
    q2_1: '', q2_2: '',
    q3_1: '', q3_2: '',
    q4_1: '', q4_2: '',
    q5_1: '', q5_2: '',
    q6_1: '', q6_2: ''
};

const WB_Unit8_Page50_Q1 = () => {
    const [answers, setAnswers] = useState({ ...INITIAL_STATE });
    const [showResults, setShowResults] = useState(false);

    const checkAnswers = () => {
        const allKeys = Object.keys(INITIAL_STATE);
        const unanswered = allKeys.filter(k => !answers[k]);
        if (unanswered.length > 0) { ValidationAlert.info(); return; }

        let score = 0;
        const total = allKeys.length;
        allKeys.forEach(k => { if (answers[k] === CORRECT_A[k]) score++; });

        const msg = `Score: ${score} / ${total}`;
        if (score === total) ValidationAlert.success(msg);
        else if (score > 0) ValidationAlert.warning(msg);
        else ValidationAlert.error(msg);
    };

    // FIX 4: handleReset يستخدم INITIAL_STATE الصحيح
    const handleReset = () => {
        setAnswers({ ...INITIAL_STATE });
        setShowResults(false);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto font-sans">
            <div className="flex items-center gap-3 mb-6">
                <div className="ex-A">A</div>
                <h1 className="header-title-page8">Listen and write the missing letters.</h1>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
                {[1, 2, 3, 4, 5, 6].map((num, idx) => {
                    const parts = WORD_PARTS[idx];
                    // FIX 1: مفاتيح ديناميكية لكل سؤال
                    const key1 = `q${num}_1`;
                    const key2 = `q${num}_2`;
                    return (
                        <div key={num} className="flex flex-col items-center gap-3 p-4">
                            <span className="self-start font-bold text-gray-400">{num}</span>
                            <img src={IMGS[idx]} alt="phonics" className="max-w-20 max-h-20 object-contain" />
                            <div className="flex items-center gap-2 text-xl font-bold text-gray-600">
                                <span>{parts.before}</span>

                                {/* FIX 1: قيمة وـ onChange ديناميكيين */}
                                <select
                                    value={answers[key1]}
                                    onChange={e => setAnswers({ ...answers, [key1]: e.target.value })}
                                    className='border-b-2 cursor-pointer'
                                >
                                    <option value=""></option>
                                    {OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>

                                {/* FIX 3: عرض الجزء الوسطي من القاموس الصريح */}
                                {parts.middle && <span>{parts.middle}</span>}

                                <select
                                    value={answers[key2]}
                                    onChange={e => setAnswers({ ...answers, [key2]: e.target.value })}
                                    className='border-b-2 cursor-pointer'
                                >
                                    <option value=""></option>
                                    {OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>

                                {parts.after && <span>{parts.after}</span>}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="mt-10 flex justify-center">
                <Button
                    handleShowAnswer={() => { setAnswers({ ...CORRECT_A }); setShowResults(true); }}
                    handleStartAgain={handleReset}
                    checkAnswers={checkAnswers}
                />
            </div>
        </div>
    );
};

export default WB_Unit8_Page50_Q1;
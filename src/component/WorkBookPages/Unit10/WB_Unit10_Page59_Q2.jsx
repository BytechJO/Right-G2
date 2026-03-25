import React, { useState } from 'react';
import ValidationAlert from '../../Popup/ValidationAlert';
import Button from '../button';

import imgIceCream from "../../../assets/imgs/test6.png";
import imgSwimming from "../../../assets/imgs/test6.png";
import imgAtSchool from "../../../assets/imgs/test6.png";
import imgAtPark from "../../../assets/imgs/test6.png";
import imgBoyAvatar from "../../../assets/imgs/test6.png";

const WB_Unit10_Page59_Q2 = () => {
    const [answers, setAnswers] = useState({ q1: '', q2: '', q3: '', q4: '' });
    

    const CORRECT_E = {
        q1: 'are eating',
        q2: 'are swimming',
        q3: 'are',
        q4: 'are'
    };

    const OPTIONS = {
        q1: ['are eating', 'is eating', 'are playing'],
        q2: ['are swimming', 'is swimming', 'are running'],
        q3: ['are', 'is', 'am'],
        q4: ['are', 'is', 'am']
    };

    const checkAnswers = () => {
        const unanswered = Object.keys(CORRECT_E).filter(id => !answers[id]);
        if (unanswered.length > 0) { ValidationAlert.info(); return; }
        
        let score = 0;
        Object.keys(CORRECT_E).forEach(id => { if (answers[id] === CORRECT_E[id]) score++; });
        const total = Object.keys(CORRECT_E).length;
        const msg = `Score: ${score} / ${total}`;
        if (score === total) ValidationAlert.success(msg);
        else if (score > 0) ValidationAlert.warning(msg);
        else ValidationAlert.error(msg);
    };

    const handleReset = () => { setAnswers({ q1: '', q2: '', q3: '', q4: '' }); };

    const CustomSelect = ({ id }) => (
        <select
            value={answers[id]}
            onChange={(e) => setAnswers({ ...answers, [id]: e.target.value })}
            className={` cursor-pointer mx-1 p-1 border-b-2 bg-transparent focus:outline-none transition-all font-bold`}
        >
            <option value="">...</option>
            {OPTIONS[id].map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    );

    return (
        <div className="p-8 max-w-5xl mx-auto font-sans">
            <div className="flex items-center gap-3 mb-6">
                <div className="ex-A">E</div>
                <h1 className="header-title-page8">Look and write. Read.</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
                
                <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <img src={imgBoyAvatar} alt="avatar" className="max-w-24 max-h-24 object-contain mt-20" />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-blue-600">1</span>
                        <img src={imgIceCream} alt="ice cream" className="max-w-32 max-h-24 object-cover rounded-xl border" />
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 relative">
                        <div className="absolute -top-2 left-4 w-4 h-4 bg-gray-50 rotate-45 border-l border-t border-gray-100"></div>
                        <p className="text-gray-700">They <CustomSelect id="q1" /> ice cream.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-4 justify-end">
                        <img src={imgSwimming} alt="swimming" className="max-w-32 max-h-24 object-cover rounded-xl border" />
                        <span className="font-bold text-blue-600">2</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 relative">
                        <div className="absolute -top-2 right-4 w-4 h-4 bg-gray-50 rotate-45 border-l border-t border-gray-100"></div>
                        <p className="text-gray-700">They <CustomSelect id="q2" /> in the pool.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-blue-600">3</span>
                        <img src={imgAtSchool} alt="school" className="max-w-32 max-h-24 object-cover rounded-xl border" />
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 relative">
                        <div className="absolute -top-2 left-4 w-4 h-4 bg-gray-50 rotate-45 border-l border-t border-gray-100"></div>
                        <p className="text-gray-700">We <CustomSelect id="q3" /> at school.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-4 justify-end">
                        <img src={imgAtPark} alt="park" className="max-w-32 max-h-24 object-cover rounded-xl border" />
                        <span className="font-bold text-blue-600">4</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 relative">
                        <div className="absolute -top-2 right-4 w-4 h-4 bg-gray-50 rotate-45 border-l border-t border-gray-100"></div>
                        <p className="text-gray-700">We <CustomSelect id="q4" /> at the park.</p>
                    </div>
                </div>
            </div>

            <div className="mt-12 flex justify-center">
                <Button handleShowAnswer={() => { setAnswers(CORRECT_E); }} handleStartAgain={handleReset} checkAnswers={checkAnswers} />
            </div>
        </div>
    );
};

export default WB_Unit10_Page59_Q2;

import React, { useState } from 'react';
import ValidationAlert from '../../Popup/ValidationAlert';
import Button from '../button';

import imgBlueInk from "../../../assets/imgs/test6.png";
import imgTubeItem from "../../../assets/imgs/test6.png";

const WB_Unit8_Page50_Q2 = () => {
    const [answers, setAnswers] = useState({ b1: '', b2: '', b3: '', t1: '', t2: '', t3: '', t4: '' });
    const [showResults, setShowResults] = useState(false);

    const WORDS = ['cute', 'cube', 'chute', 'Sue', 'glue', 'true', 'mute'];
    const CORRECT_B = {
        b1: 'glue', b2: 'true', b3: 'Sue',
        t1: 'mute', t2: 'cube', t3: 'cute', t4: 'chute'
    };

    const checkAnswers = () => {
        const unanswered = Object.keys(CORRECT_B).filter(id => !answers[id]);
        if (unanswered.length > 0) { ValidationAlert.info(); return; }
        setShowResults(true);
        let score = 0;
        Object.keys(CORRECT_B).forEach(id => { if (answers[id] === CORRECT_B[id]) score++; });
        const total = Object.keys(CORRECT_B).length;
        const msg = `Score: ${score} / ${total}`;
        if (score === total) ValidationAlert.success(msg);
        else if (score > 0) ValidationAlert.warning(msg);
        else ValidationAlert.error(msg);
    };

    const handleReset = () => { setAnswers({ b1: '', b2: '', b3: '', t1: '', t2: '', t3: '', t4: '' }); setShowResults(false); };

    const SelectBox = ({ id }) => (
        <select
            value={answers[id]}
            onChange={(e) => setAnswers({ ...answers, [id]: e.target.value })}
            disabled={showResults}
            className={`cursor-pointer w-full p-2 border-b-2 bg-transparent focus:outline-none transition-all text-center font-bold ${showResults ? (answers[id] === CORRECT_B[id] ? 'border-green-500 text-green-700' : 'border-red-500 text-red-700') : 'border-gray-300 focus:border-blue-400 text-blue-800'
                }`}
        >
            <option value="">Choose word</option>
            {WORDS.map(w => <option key={w} value={w}>{w}</option>)}
        </select>
    );

    return (
        <div className="p-8 max-w-5xl mx-auto font-sans">
            <div className="flex items-center gap-3 mb-6">
                <div className="ex-A">B</div>
                <h1 className="header-title-page8">Read and write the words in the correct column.</h1>
            </div>

            {/* <div className="flex flex-wrap justify-center gap-3 mb-10 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                {WORDS.map(w => <span key={w} className="px-4 py-1 bg-white border rounded-full shadow-sm text-gray-600 font-medium">{w}</span>)}
            </div> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {/* Column Blue */}
                <div className="space-y-6">
                    <div className="flex flex-col items-center gap-4 mb-8">
                        <img src={imgBlueInk} alt="blue" className="max-w-24 max-h-24 object-contain" />
                        <span className="text-2xl font-black text-blue-900">blue</span>
                    </div>
                    <div className="space-y-4 px-10">
                        <SelectBox id="b1" /> <SelectBox id="b2" /> <SelectBox id="b3" />
                    </div>
                </div>

                {/* Column Tube */}
                <div className="space-y-6">
                    <div className="flex flex-col items-center gap-4 mb-8">
                        <img src={imgTubeItem} alt="tube" className="max-w-24 max-h-24 object-contain" />
                        <span className="text-2xl font-black text-blue-900">tube</span>
                    </div>
                    <div className="space-y-4 px-10">
                        <SelectBox id="t1" /> <SelectBox id="t2" /> <SelectBox id="t3" /> <SelectBox id="t4" />
                    </div>
                </div>
            </div>

            <div className="mt-12 flex justify-center">
                <Button handleShowAnswer={() => { setAnswers(CORRECT_B); setShowResults(true); }} handleStartAgain={handleReset} checkAnswers={checkAnswers} />
            </div>
        </div>
    );
};

export default WB_Unit8_Page50_Q2;

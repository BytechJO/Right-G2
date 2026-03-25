import React, { useState } from 'react';
import ValidationAlert from '../../Popup/ValidationAlert';
import Button from '../button';

import imgGirl from "../../../assets/imgs/test6.png";
import imgBoy from "../../../assets/imgs/test6.png";

const WB_Unit10_Page58_Q2 = () => {
    const [answers, setAnswers] = useState({
        c1_1: '', c1_2: '', c1_3: '', c1_4: '', c1_5: '',
        c2_1: '', c2_2: '', c2_3: '', c2_4: ''
    });
    const [showResults, setShowResults] = useState(false);

    const COLORS = ['blue', 'green', 'yellow', 'black', 'red', 'white', 'pink'];

    const CORRECT_C = {
        c1_1: 'blue', c1_2: 'green', c1_3: 'yellow', c1_4: 'black', c1_5: 'red',
        c2_1: 'yellow', c2_2: 'red', c2_3: 'green', c2_4: 'black'
    };

    const checkAnswers = () => {
        const unanswered = Object.keys(CORRECT_C).filter(id => !answers[id]);
        if (unanswered.length > 0) { ValidationAlert.info(); return; }
        setShowResults(true);
        let score = 0;
        Object.keys(CORRECT_C).forEach(id => { if (answers[id] === CORRECT_C[id]) score++; });
        const total = Object.keys(CORRECT_C).length;
        const msg = `Score: ${score} / ${total}`;
        if (score === total) ValidationAlert.success(msg);
        else if (score > 0) ValidationAlert.warning(msg);
        else ValidationAlert.error(msg);
    };

    const handleReset = () => {
        setAnswers({ c1_1: '', c1_2: '', c1_3: '', c1_4: '', c1_5: '', c2_1: '', c2_2: '', c2_3: '', c2_4: '' });
        setShowResults(false);
    };

    const ColorSelect = ({ id }) => (
        <select
            value={answers[id]}
            onChange={(e) => setAnswers({ ...answers, [id]: e.target.value })}
            disabled={showResults}
            className={`mx-1 p-1 border-b-2 bg-transparent focus:outline-none transition-all font-bold ${showResults ? (answers[id] === CORRECT_C[id] ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600') : 'border-gray-300 focus:border-blue-400 text-blue-800'
                }`}
        >
            <option value="">color</option>
            {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
    );

    return (
        <div className="p-8 max-w-5xl mx-auto font-sans">
            <div className="flex items-center gap-3 mb-6">
                <div className="ex-A">C</div>
                <h1 className="header-title-page8">Read, look, and write.</h1>
            </div>

            <div className="space-y-16">
                {/* الفقرة الأولى - البنت */}
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <img src={imgGirl} alt="girl" className="max-w-32 max-h-32 object-contain" />
                    <div className="flex-1 text-lg leading-loose text-gray-700">
                        <span className="font-bold text-blue-600 mr-2">1</span>
                        She is wearing a <ColorSelect id="c1_1" /> T-shirt, a <ColorSelect id="c1_2" /> hat,
                        <ColorSelect id="c1_3" /> socks, and <ColorSelect id="c1_4" /> shoes.
                        She is carrying some <ColorSelect id="c1_5" /> flowers.
                    </div>
                </div>

                {/* الفقرة الثانية - الولد */}
                <div className="flex flex-col md:flex-row items-center gap-10">
                    
                    <div className="flex-1 text-lg leading-loose text-gray-700">
                        <span className="font-bold text-blue-600 mr-2">2</span>
                        He is wearing a <ColorSelect id="c2_1" /> T-shirt, a <ColorSelect id="c2_2" /> cap,
                        <ColorSelect id="c2_3" /> socks and <ColorSelect id="c2_4" /> shoes.
                    </div>
                    <img src={imgBoy} alt="boy" className="max-w-32 max-h-32 object-contain" />
                </div>
            </div>

            <div className="mt-12 flex justify-center">
                <Button handleShowAnswer={() => { setAnswers(CORRECT_C); setShowResults(true); }} handleStartAgain={handleReset} checkAnswers={checkAnswers} />
            </div>
        </div>
    );
};

export default WB_Unit10_Page58_Q2;

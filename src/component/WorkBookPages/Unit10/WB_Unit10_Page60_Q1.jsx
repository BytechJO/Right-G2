import React, { useState } from 'react';
import ValidationAlert from '../../Popup/ValidationAlert';
import Button from '../button';

import imgRun from "../../../assets/imgs/test6.png";
import imgDrink from "../../../assets/imgs/test6.png";
import imgListen from "../../../assets/imgs/test6.png";
import imgWatch from "../../../assets/imgs/test6.png";
import imgWork from "../../../assets/imgs/test6.png";

const WB_Unit10_Page60_Q1 = () => {
    const [answers, setAnswers] = useState({ q1: '', q2: '', q3: '', q4: '', q5: '' });
    const [showResults, setShowResults] = useState(false);

    const CORRECT_F = {
        q1: 'running', q2: 'drinking', q3: 'listening', q4: 'watching', q5: 'working'
    };

    const OPTIONS = ['running', 'drinking', 'listening', 'watching', 'working', 'eating', 'sleeping'];

    const checkAnswers = () => {
        const unanswered = Object.keys(CORRECT_F).filter(id => !answers[id]);
        if (unanswered.length > 0) { ValidationAlert.info(); return; }
        setShowResults(true);
        let score = 0;
        Object.keys(CORRECT_F).forEach(id => { if (answers[id] === CORRECT_F[id]) score++; });
        const total = Object.keys(CORRECT_F).length;
        const msg = `Score: ${score} / ${total}`;
        if (score === total) ValidationAlert.success(msg);
        else if (score > 0) ValidationAlert.warning(msg);
        else ValidationAlert.error(msg);
    };

    const handleReset = () => { setAnswers({ q1: '', q2: '', q3: '', q4: '', q5: '' }); setShowResults(false); };

    const QUESTIONS = [
        { id: 'q1', img: imgRun, num: '1', prefix: "They're (run) ", suffix: "." },
        { id: 'q2', img: imgDrink, num: '2', prefix: "It's (drink) ", suffix: " milk." },
        { id: 'q3', img: imgListen, num: '3', prefix: "He's (listen) ", suffix: " to the radio." },
        { id: 'q4', img: imgWatch, num: '4', prefix: "I'm (watch) ", suffix: " a movie." },
        { id: 'q5', img: imgWork, num: '5', prefix: "We're (work) ", suffix: " on the computer." },
    ];


    return (
        <div className="p-6 max-w-5xl mx-auto font-sans">
            <div className="flex items-center gap-3 mb-6">
                <div className="ex-A">F</div>
                <h1 className="header-title-page8">Complete. Look and match.</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                {QUESTIONS.map(q => (
                    <div key={q.id} className="relative group">
                        <img src={q.img} alt="activity" className="max-w-full max-h-32 object-cover rounded-xl border-2 border-gray-100 group-hover:border-blue-200 transition-all" />

                        <select className='cursor-pointer absolute top-2 right-2 bg-white text-black w-6 h-6 flex items-center justify-center rounded-md font-bold text-xs shadow-md'>
                            <option value="">-</option>
                            
                            {QUESTIONS.map(opt => (
                                <option key={opt} value={opt}>
                                    {opt.num}
                                </option>
                            ))}

                        </select>

                    </div>
                ))}
            </div>

            <div className="space-y-4 max-w-3xl mx-auto">
                {QUESTIONS.map(q => (
                    <div key={q.id} className="flex items-center text-lg p-2 rounded-lg hover:bg-gray-50 transition-all">
                        <span className="font-bold text-blue-600 w-8">{q.num}</span>
                        <div className="flex-1 flex items-center flex-wrap">
                            <span className="text-gray-700">{q.prefix}</span>
                            <select
                                value={answers[q.id]}
                                onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                                disabled={showResults}
                                className={`cursor-pointer mx-2 p-1 border-b-2 bg-transparent focus:outline-none transition-all font-bold `}
                            >
                                <option value="">...</option>
                                {OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                            <span className="text-gray-700">{q.suffix}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-10 flex justify-center">
                <Button handleShowAnswer={() => { setAnswers(CORRECT_F); setShowResults(true); }} handleStartAgain={handleReset} checkAnswers={checkAnswers} />
            </div>
        </div>
    );
};

export default WB_Unit10_Page60_Q1;

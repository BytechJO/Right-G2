import React, { useState } from 'react';

// استيراد الصور ومكونات الأزرار
import placeholderImg from "../../../assets/imgs/test6.png";
import ValidationAlert from '../../Popup/ValidationAlert';
import Button from '../button';

const activityData = [
    { id: 'e1', item: 'teddy bears', img: placeholderImg, isPlural: true },
    { id: 'e2', item: 'trains', img: placeholderImg, isPlural: true },
    { id: 'e3', item: 'tennis rackets', img: placeholderImg, isPlural: true },
    { id: 'e4', item: 'a basketball', img: placeholderImg, isPlural: false },
];

const WB_Unit4_Page23_Q1 = () => {
    const [choices, setChoices] = useState({});

    const handleChoice = (itemId, mood) => {
        setChoices(prev => ({ ...prev, [itemId]: mood }));
    };

    const handleStartAgain = () => {
        setChoices({});
    };

    const checkAnswers = () => {
        ValidationAlert.success("Good Job!!")
    };

    return (
        <div className="p-6 max-w-3xl mx-auto font-sans">
            <div className="flex items-center gap-4 mb-8">
                <span className="ex-A">E</span>
                <h1 className="header-title-page8">What do you want? Circle and write "Yes, I do." or "No, I don't."</h1>
            </div>

            <div className="space-y-6">
                {activityData.map((item, index) => {
                    const currentChoice = choices[item.id];
                    let answerText = '';
                    if (currentChoice === 'happy') answerText = 'Yes, I do.';
                    if (currentChoice === 'sad') answerText = 'No, I don\'t.';

                    return (
                        <div key={item.id} className="flex items-center gap-4">
                            <span className="font-bold text-blue-600">{index + 1}</span>
                            <p className="text-lg">Do you want {item.item}?</p>
                            <img src={item.img} alt={item.item} className="max-w-16 max-h-16 object-contain" />

                            {/* الوجوه القابلة للنقر */}
                            <div className="flex gap-2">
                                <button onClick={() => handleChoice(item.id, 'happy')}
                                    className={`text-3xl transition-transform transform ${currentChoice === 'happy' ? 'scale-125' : 'opacity-50 hover:opacity-100'}`}>
                                    🙂
                                </button>
                                <button onClick={() => handleChoice(item.id, 'sad')}
                                    className={`text-3xl transition-transform transform ${currentChoice === 'sad' ? 'scale-125' : 'opacity-50 hover:opacity-100'}`}>
                                    ☹️
                                </button>
                            </div>

                            {/* مربع الحوار */}
                            <div className="flex-1 h-12 px-4 flex items-center bg-gray-100 rounded-full border border-gray-300 relative">
                                <p className="text-lg font-medium text-gray-700">{answerText}</p>
                                {/* شكل ذيل مربع الحوار */}
                                <div className="absolute left-0 -ml-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-gray-300"></div>
                                <div className="absolute left-0 -ml-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-gray-100"></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="action-buttons-container">
                <button onClick={handleStartAgain} className="try-again-button">
                    Start Again ↻
                </button>
                <button onClick={checkAnswers} className="check-button2">
                    Finish ✓
                </button>
            </div>

        </div>
    );
};

export default WB_Unit4_Page23_Q1;

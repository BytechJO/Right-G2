import React, { useState } from 'react';
import img from "../../../assets/imgs/test6.png";
import Button from "../button";
import ValidationAlert from '../../Popup/ValidationAlert';

const correctAnswers = {
    input2_1: 'Is this a squirrel',
    input2_2: 'Yes it is.',
    input3_1: 'Is this a horse',
    input3_2: 'Yes it is.',
    input4_1: 'Are these rabbits',
    input4_2: 'No, they aren\'t.',
};

export default function WritingExercise() {
    const [inputs, setInputs] = useState({
        input2_1: '',
        input2_2: '',
        input3_1: '',
        input3_2: '',
        input4_1: '',
        input4_2: '',
    });

    const [results, setResults] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const checkAnswers = () => {
        
    for (const key in inputs) {
        if (inputs[key].trim() === "") {
            ValidationAlert.warning("Please fill in all the answers first!");
            return;
        }
    }

    const newResults = {};
    let score = 0;

    for (const key in correctAnswers) {
        const isCorrect =
            inputs[key].trim().toLowerCase() === correctAnswers[key].toLowerCase();

        newResults[key] = isCorrect;

        if (isCorrect) {
            score++;
        }
    }

    setResults(newResults);

    const total = Object.keys(correctAnswers).length;

    if (score === total) {
        ValidationAlert.success(`Score: ${score} / ${total}`);
    } else {
        ValidationAlert.error(`Score: ${score} / ${total}`);
    }
};

    const resetExercise = () => {
        setInputs({
            input2_1: '', input2_2: '',
            input3_1: '', input3_2: '',
            input4_1: '', input4_2: '',
        });
        setResults({}); // مسح نتائج التصحيح
    };

    const handleShowAnswer = () => {
        setInputs(correctAnswers);

        const showResults = {};
        for (const key in correctAnswers) {
            showResults[key] = true;
        }
        setResults(showResults);
    };

    // دالة مساعدة لتحديد لون حدود حقل الإدخال بناءً على النتيجة
    const getInputBorderColor = (inputName) => {
        // إذا لم يتم التحقق من الإجابات بعد، استخدم اللون الافتراضي
        if (results[inputName] === undefined) {
            return 'border-gray-400 focus:border-blue-500';
        }
        // إذا كانت الإجابة صحيحة، استخدم اللون الأخضر
        return results[inputName] ? 'border-green-500' : 'border-red-500';
    };

    return (
        <>
            <div className="flex items-center gap-4 ml-50 mt-10 mb-2">
                <div className="ex-A">H</div>
                <h1 className="header-title-page8">Look, trace, and write.</h1>
            </div>
            <div className="p-8 font-sans max-w-6xl mx-auto">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                    {/* ----- القسم الأيسر: حقول الكتابة ----- */}
                    <div className="space-y-8">
                        {/* السؤال 1 (مثال محلول) */}
                        <div className="flex items-start space-x-3 text-xl">
                            <span className="font-bold text-gray-500">1</span>
                            <div>
                                <p className="text-gray-400">Are these dogs?</p>
                                <p className="text-gray-400 border-t border-gray-300 w-full">Yes, they are.</p>
                            </div>
                        </div>

                        {/* السؤال 2 */}
                        <div className="flex items-start space-x-3 text-xl">
                            <span className="font-bold text-gray-500">2</span>
                            <div className="w-full">
                                <input
                                    type="text"
                                    name="input2_1"
                                    value={inputs.input2_1}
                                    onChange={handleInputChange}
                                    className={`w-full bg-transparent border-b-2 ${getInputBorderColor('input2_1')} focus:outline-none pb-1`}
                                />
                                <input
                                    type="text"
                                    name="input2_2"
                                    value={inputs.input2_2}
                                    onChange={handleInputChange}
                                    className={`w-full bg-transparent border-b-2 ${getInputBorderColor('input2_2')} focus:outline-none mt-2 pb-1`}
                                />
                            </div>
                        </div>

                        {/* السؤال 3 */}
                        <div className="flex items-start space-x-3 text-xl">
                            <span className="font-bold text-gray-500">3</span>
                            <div className="w-full">
                                <input
                                    type="text"
                                    name="input3_1"
                                    value={inputs.input3_1}
                                    onChange={handleInputChange}
                                    className={`w-full bg-transparent border-b-2 ${getInputBorderColor('input3_1')} focus:outline-none pb-1`}
                                />
                                <input
                                    type="text"
                                    name="input3_2"
                                    value={inputs.input3_2}
                                    onChange={handleInputChange}
                                    className={`w-full bg-transparent border-b-2 ${getInputBorderColor('input3_2')} focus:outline-none mt-2 pb-1`}
                                />
                            </div>
                        </div>

                        {/* السؤال 4 */}
                        <div className="flex items-start space-x-3 text-xl">
                            <span className="font-bold text-gray-500">4</span>
                            <div className="w-full">
                                <input
                                    type="text"
                                    name="input4_1"
                                    value={inputs.input4_1}
                                    onChange={handleInputChange}
                                    className={`w-full bg-transparent border-b-2 ${getInputBorderColor('input4_1')} focus:outline-none pb-1`}
                                />
                                <input
                                    type="text"
                                    name="input4_2"
                                    value={inputs.input4_2}
                                    onChange={handleInputChange}
                                    className={`w-full bg-transparent border-b-2 ${getInputBorderColor('input4_2')} focus:outline-none mt-2 pb-1`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ----- القسم الأيمن: الصورة ----- */}
                    <div className="flex justify-center items-center">
                        <img
                            src={img}
                            className="max-w-80 max-h-100 rounded-lg shadow-md"
                        />
                    </div>
                </div>


                <div className='mt-10'>
                    <Button handleShowAnswer={handleShowAnswer} handleStartAgain={resetExercise} checkAnswers={checkAnswers} />
                </div>
            </div>
        </>
    );
}

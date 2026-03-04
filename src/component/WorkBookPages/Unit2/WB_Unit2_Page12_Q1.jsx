import React, { useState } from 'react';
import img from "../../../assets/imgs/test6.png";
import Button from "../button";
import ValidationAlert from "../../Popup/ValidationAlert";

const WB_Unit2_Page12_Q1 = () => {
    const [showAlert, setShowAlert] = useState(false);
    const [score, setScore] = useState({ correct: 0, total: 0 });
    const [answers, setAnswers] = useState({
        sentence1: '',
        sentence2: '',
        sentence3: '',
        sentence4: '',
        sentence5: '',
        sentence6: ''
    });

    const correctAnswers = {
        sentence1: 'Those',
        sentence2: 'These',
        sentence3: 'Those',
        sentence4: 'These',
        sentence5: 'Those',
        sentence6: 'Those'
    };

    const handleShowAnswer = () => setAnswers(correctAnswers);
    const handleStartAgain = () => {
        setAnswers({ sentence1: '', sentence2: '', sentence3: '', sentence4: '', sentence5: '', sentence6: '' });
        setShowAlert(false);
    };

    const checkAnswers = () => {
        const allFilled = Object.values(answers).every(answer => answer.trim() !== "");

        if (!allFilled) {
            ValidationAlert.warning("Please fill in all answers!");
            return; // نوقف التنفيذ إذا هناك input فارغ
        }

        let correct = 0;
        const total = 6;

        if (answers.sentence1 === correctAnswers.sentence1) correct++;
        if (answers.sentence2 === correctAnswers.sentence2) correct++;
        if (answers.sentence3 === correctAnswers.sentence3) correct++;
        if (answers.sentence4 === correctAnswers.sentence4) correct++;
        if (answers.sentence5 === correctAnswers.sentence5) correct++;
        if (answers.sentence6 === correctAnswers.sentence6) correct++;

        setScore({ correct, total });

        if (correct === total) {
            ValidationAlert.success(`Score: ${correct}/${total}`);
        } else {
            ValidationAlert.error(`Score: ${correct}/${total}`);
        }
    };

    const handleAnswerChange = (field, value) => {
        setAnswers(prev => ({ ...prev, [field]: value }));
    };


    return (
        <>
            <div className="flex items-center gap-4 ml-90 mt-10 mb-2">
                <div className="ex-A">G</div>
                <h1 className="header-title-page8">Look and write.</h1>
            </div>
            <div className="family-completion-activity p-6 max-w-4xl mx-auto" dir="ltr">
                <div className="sentences ">
                    <div className="flex items-center gap-4 p-5 rounded-xl ">
                        <span className="font-semibold text-blue-600 mr-2">1.</span>
                        <img src={img} className="max-w-16 max-h-16 object-contain" />
                        <div className="flex-1">
                            <p className="text-xl text-gray-800 curesor-pointer">
                                <select
                                    value={answers.sentence1}
                                    onChange={(e) => handleAnswerChange('sentence1', e.target.value)}
                                    className="mx-3 p-2 w-28 text-center text-lg rounded"
                                >
                                    <option value="" disabled>_______________</option>
                                    <option value="These">These</option>
                                    <option value="Those">Those</option>
                                </select>
                                are ducks.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-5 rounded-xl ">
                        <span className="font-semibold text-blue-600 mr-2">2.</span>
                        <img src={img} className="max-w-16 max-h-16 object-contain" />
                        <div className="flex-1">
                            <p className="text-xl text-gray-800">
                                <select
                                    value={answers.sentence2}
                                    onChange={(e) => handleAnswerChange('sentence2', e.target.value)}
                                    className="mx-3 p-2 w-28 text-center text-lg rounded"
                                >
                                    <option value="" disabled>_______________</option>
                                    <option value="These">These</option>
                                    <option value="Those">Those</option>
                                </select>
                                are flowers
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-5 rounded-xl ">
                        <span className="font-semibold text-blue-600 mr-2">3.</span>
                        <img src={img} className="max-w-16 max-h-16 object-contain" />
                        <div className="flex-1">
                            <p className="text-xl text-gray-800">

                                <select
                                    value={answers.sentence3}
                                    onChange={(e) => handleAnswerChange('sentence3', e.target.value)}
                                    className="mx-3 p-2 w-28 text-center text-lg rounded"
                                >
                                    <option value="" disabled>_______________</option>
                                    <option value="These">These</option>
                                    <option value="Those">Those</option>
                                </select>
                                are butterflies
                            </p>
                        </div>

                    </div>
                    <div className="flex items-center gap-4 p-5 rounded-xl ">
                        <span className="font-semibold text-blue-600 mr-2">4.</span>
                        <img src={img} className="max-w-16 max-h-16 object-contain" />
                        <div className="flex-1">
                            <p className="text-xl text-gray-800">

                                <select
                                    value={answers.sentence4}
                                    onChange={(e) => handleAnswerChange('sentence4', e.target.value)}
                                    className="mx-3 p-2 w-28 text-center text-lg rounded"
                                >
                                    <option value="" disabled>_______________</option>
                                    <option value="These">These</option>
                                    <option value="Those">Those</option>
                                </select>
                                are birds.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-5 rounded-xl ">
                        <span className="font-semibold text-blue-600 mr-2">5.</span>
                        <img src={img} className="max-w-16 max-h-16 object-contain" />
                        <div className="flex-1">
                            <p className="text-xl text-gray-800">
                                <select
                                    value={answers.sentence5}
                                    onChange={(e) => handleAnswerChange('sentence5', e.target.value)}
                                    className="mx-3 p-2 w-28 text-center text-lg rounded"
                                >
                                    <option value="" disabled>_______________</option>
                                    <option value="These">These</option>
                                    <option value="Those">Those</option>
                                </select>
                                are rabbits.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-5 rounded-xl ">
                        <span className="font-semibold text-blue-600 mr-2">6.</span>
                        <img src={img} className="max-w-16 max-h-16 object-contain" />
                        <div className="flex-1">
                            <p className="text-xl text-gray-800">
                                <select
                                    value={answers.sentence6}
                                    onChange={(e) => handleAnswerChange('sentence6', e.target.value)}
                                    className="mx-3 p-2 w-28 text-center text-lg rounded"
                                >
                                    <option value="" disabled>_______________</option>
                                    <option value="These">These</option>
                                    <option value="Those">Those</option>
                                </select>
                                are dogs.
                            </p>
                        </div>

                    </div>
                </div>
                <div className='mt-10'>
                    <Button handleShowAnswer={handleShowAnswer} handleStartAgain={handleStartAgain} checkAnswers={checkAnswers} />
                </div>
                {showAlert && (
                    <ValidationAlert correct={score.correct} total={score.total} onClose={() => setShowAlert(false)} />
                )}
            </div>
        </>
    );
};

export default WB_Unit2_Page12_Q1;
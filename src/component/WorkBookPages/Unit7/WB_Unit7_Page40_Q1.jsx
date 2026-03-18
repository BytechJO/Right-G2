import React, { useState } from 'react';
import img from "../../../assets/imgs/test6.png";
import Button from "../button";
import ValidationAlert from "../../Popup/ValidationAlert";

const WB_Unit7_Page40_Q1 = () => {
    const [showAlert, setShowAlert] = useState(false);
    const [score, setScore] = useState({ correct: 0, total: 0 });
    const [answers, setAnswers] = useState({
        sentence1: '',
        sentence2: '',
        sentence3: '',
    });

    const correctAnswers = {
        sentence1: 'Wednesday',
        sentence2: 'Monday',
        sentence3: 'Friday',
    };

    const handleShowAnswer = () => setAnswers(correctAnswers);
    const handleStartAgain = () => {
        setAnswers({ sentence1: '', sentence2: '', sentence3: '' });
        setShowAlert(false);
    };

    const checkAnswers = () => {
    const values = Object.values(answers);

    const allEmpty = values.every(answer => !answer || answer.trim() === "");
    const allFilled = values.every(answer => answer && answer.trim() !== "");

    // 1️⃣ إذا كله فاضي
    if (allEmpty) {
        ValidationAlert.info("Please fill in the answers first!");
        return;
    }

    // 2️⃣ إذا في أشياء ناقصة
    if (!allFilled) {
        ValidationAlert.info("Please complete all answers!");
        return;
    }

    let correct = 0;
    const total = 3;

    if (answers.sentence1 === 'Wednesday') correct++;
    if (answers.sentence2 === 'Monday') correct++;
    if (answers.sentence3 === 'Friday') correct++;

    setScore({ correct, total });

    // 3️⃣ كلهم صح
    if (correct === total) {
        ValidationAlert.success(`Score: ${correct}/${total}`);
    }
    // 4️⃣ ولا واحد صح
    else if (correct === 0) {
        ValidationAlert.error(`Score: ${correct}/${total}`);
    }
    // 5️⃣ بعضهم صح
    else {
        ValidationAlert.warning(`Score: ${correct}/${total}`);
    }
};

    const handleAnswerChange = (field, value) => {
        setAnswers(prev => ({ ...prev, [field]: value }));
    };


    return (
        <>
            <div className="flex items-center gap-4 ml-90 mt-10 mb-2">
                <div className="ex-A">G</div>
                <h1 className="header-title-page8">Look, read and write.</h1>
            </div>
            <div className="p-6 max-w-4xl mx-auto" dir="ltr">
                <div className="sentences ">

                    <div className="flex items-center gap-4 p-5  ">
                        <span className="font-semibold text-blue-600 mr-2">1.</span>
                        <img src={img} className="max-w-16 max-h-16 object-contain" />
                        <div className="flex-1">
                            
                            <p className="text-xl text-black curesor-pointer">what day is it today?</p>
                            <p className="text-xl text-gray-800 curesor-pointer">
                                it is 
                                <select
                                    value={answers.sentence1}
                                    onChange={(e) => handleAnswerChange('sentence1', e.target.value)}
                                    className="mx-3 p-2 w-100 text-center text-lg border-b-2 cursor-pointer"
                                >
                                    <option value="" disabled></option>
                                    <option value="Friday">Friday</option>
                                    <option value="Saturday">Saturday</option>
                                    <option value="Tuesday">Tuesday</option>
                                    <option value="Sunday">Sunday</option>
                                    <option value="Wednesday">Wednesday</option>
                                    <option value="Thursday">Thursday</option>
                                    <option value="Monday">Monday</option>
                                </select>
                                
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-5 rounded-xl ">
                        <span className="font-semibold text-blue-600 mr-2">2.</span>
                        <img src={img} className="max-w-16 max-h-16 object-contain" />
                        <div className="flex-1">
                            <p className="text-xl text-black curesor-pointer">what day is it today?</p>
                            <p className="text-xl text-gray-800">
                                It is 
                                <select
                                    value={answers.sentence2}
                                    onChange={(e) => handleAnswerChange('sentence2', e.target.value)}
                                    className="mx-3 p-2 w-100 border-b-2 text-center text-lg cursor-pointer"
                                >
                                    <option value="" disabled></option>
                                    <option value="Friday">Friday</option>
                                    <option value="Saturday">Saturday</option>
                                    <option value="Tuesday">Tuesday</option>
                                    <option value="Sunday">Sunday</option>
                                    <option value="Wednesday">Wednesday</option>
                                    <option value="Thursday">Thursday</option>
                                    <option value="Monday">Monday</option>
                                </select>
                                
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-5 rounded-xl ">
                        <span className="font-semibold text-blue-600 mr-2">3.</span>
                        <img src={img} className="max-w-16 max-h-16 object-contain" />
                        <div className="flex-1">
                            <p className="text-xl text-black curesor-pointer">what day is it today?</p>
                            <p className="text-xl text-gray-800">
                                It
                                <select
                                    value={answers.sentence3}
                                    onChange={(e) => handleAnswerChange('sentence3', e.target.value)}
                                    className="mx-3 p-2 w-100 text-center text-lg border-b-2 cursor-pointer"
                                >
                                    <option value="" disabled></option>
                                    <option value="Friday">Friday</option>
                                    <option value="Saturday">Saturday</option>
                                    <option value="Tuesday">Tuesday</option>
                                    <option value="Sunday">Sunday</option>
                                    <option value="Wednesday">Wednesday</option>
                                    <option value="Thursday">Thursday</option>
                                    <option value="Monday">Monday</option>
                                </select>
                                
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

export default WB_Unit7_Page40_Q1;
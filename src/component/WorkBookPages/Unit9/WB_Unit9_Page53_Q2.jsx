import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert"; // تأكد من صحة المسار في مشروعك
import Button from "../button"; // تأكد من صحة المسار في مشروعك

// استيراد الصور (تأكد من تغيير المسارات لتناسب مشروعك)
import imgA from "../../../assets/imgs/test6.png";
import imgB from "../../../assets/imgs/test6.png";
import imgC from "../../../assets/imgs/test6.png";
import imgD from "../../../assets/imgs/test6.png";
import imgE from "../../../assets/imgs/test6.png";
import imgF from "../../../assets/imgs/test6.png";

const exerciseFData = [
    { id: 1, sentence: "She isn't playing chess with her friend.", correct: "e" },
    { id: 2, sentence: "I'm sending an e-mail to my friend.", correct: "f" },
    { id: 3, sentence: "I'm cooking dinner for my family.", correct: "a" },
    { id: 4, sentence: "He isn't listening to the radio.", correct: "b" },
    { id: 5, sentence: "They aren't playing soccer.", correct: "d" },
    { id: 6, sentence: "We are looking at the hens.", correct: "c" },
];

const imagesData = [
    { id: "a", src: imgA, check: true },
    { id: "b", src: imgB, check: false },
    { id: "c", src: imgC, check: true },
    { id: "d", src: imgD, check: false },
    { id: "e", src: imgE, check: false },
    { id: "f", src: imgF, check: true },
];

const WB_Unit9_Page53_Q2 = () => {
    const [userAnswers, setUserAnswers] = useState({ 1: "", 2: "", 3: "", 4: "", 5: "", 6: "" });
    const [checked, setChecked] = useState(false);
    const [locked, setLocked] = useState(false);

    const handleSelect = (id, value) => {
        if (locked) return;
        setUserAnswers(prev => ({ ...prev, [id]: value }));
    };

    const checkAnswers = () => {
        let correctCount = 0;
        exerciseFData.forEach(item => {
            if (userAnswers[item.id] === item.correct) correctCount++;
        });

        setChecked(true);
        setLocked(true);

        if (correctCount === exerciseFData.length) {
            ValidationAlert.success(`Excellent! Score: ${correctCount}/${exerciseFData.length}`);
        } else {
            ValidationAlert.error(`Keep trying! Score: ${correctCount}/${exerciseFData.length}`);
        }
    };

    const handleShowAnswer = () => {
        const correctAnswers = {};
        exerciseFData.forEach(item => correctAnswers[item.id] = item.correct);
        setUserAnswers(correctAnswers);
        setChecked(true);
        setLocked(true);
    };

    const handleTryAgain = () => {
        setUserAnswers({ 1: "", 2: "", 3: "", 4: "", 5: "", 6: "" });
        setChecked(false);
        setLocked(false);
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">

            <div className="flex items-center gap-3 mb-6">
                <div className="ex-A">F</div>
                <h1 className="header-title-page8">Read and look. Match pictures with sentences.</h1>
            </div>



            <div className="flex flex-col md:flex-row gap-12">
                {/* Sentences with Select */}
                <div className="flex-1 flex flex-col gap-6">
                    {exerciseFData.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 text-lg">
                            <div className="relative">
                                <select
                                    value={userAnswers[item.id]}
                                    onChange={(e) => handleSelect(item.id, e.target.value)}
                                    disabled={locked}
                                    className={`w-12 h-10 border-b-2 border-gray-400 bg-transparent text-center font-bold text-blue-700 focus:outline-none appearance-none cursor-pointer
                                        ${checked && userAnswers[item.id] === item.correct ? "text-green-600 border-green-500" : ""}
                                        ${checked && userAnswers[item.id] !== item.correct && userAnswers[item.id] !== "" ? "text-red-600 border-red-500" : ""}
                                    `}
                                >
                                    <option value=""></option>
                                    {["a", "b", "c", "d", "e", "f"].map(letter => (
                                        <option key={letter} value={letter}>{letter}</option>
                                    ))}
                                </select>
                                {checked && (
                                    <span className="absolute -right-6 top-2 text-sm">
                                        {userAnswers[item.id] === item.correct ? "✅" : "❌"}
                                    </span>
                                )}
                            </div>
                            <span className="font-bold text-blue-800 w-4">{item.id}</span>
                            <span className="text-gray-800 font-medium">{item.sentence}</span>
                        </div>
                    ))}
                </div>

                {/* Images Grid */}
                <div className="grid grid-cols-2 gap-4 w-full md:w-1/3">
                    {imagesData.map((img) => (
                        <div key={img.id} className="relative border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-gray-50">
                            <img src={img.src} alt={img.id} className="max-w-full max-h-24 object-cover" />
                            <div className="absolute top-1 left-1 bg-white/80 px-1.5 rounded font-bold text-sm border border-gray-300">
                                {img.id}
                            </div>
                            <div className="absolute bottom-1 right-1 w-6 h-6 border border-gray-400 rounded bg-white flex items-center justify-center">
                                {img.check ? <span className="text-green-600 font-bold text-sm">✓</span> : <span className="text-red-600 font-bold text-sm">✕</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-12 flex justify-center">
                <Button 
                    handleShowAnswer={handleShowAnswer} 
                    handleStartAgain={handleTryAgain} 
                    checkAnswers={checkAnswers} 
                />
            </div>
        </div>
    );
};

export default WB_Unit9_Page53_Q2;
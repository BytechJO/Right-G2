import React, { useState } from 'react';
import ValidationAlert from '../../Popup/ValidationAlert';
import Button from '../button';

import img from "../../../assets/imgs/test6.png";

// الإجابات الأولية والفارغة
const initialAnswers = {
  1: { first: '', second: '' },
  2: { first: '' },
  3: { first: '' },
};

// الإجابات الصحيحة
const correctAnswers = {
  1: { first: 'r', second: 'r' },
  2: { first: 'l' },
  3: { first: 'l' },
};

const WB_Unit1_Page8_Q3 = () => {
  const [answers, setAnswers] = useState(initialAnswers);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validation, setValidation] = useState({ show: false, score: 0, total: 4 });

  // دالة لتحديد لون حدود حقل الإدخال بناءً على الإجابة
  const getBorderColor = (answer, correctAnswer) => {
    if (!isSubmitted) return 'border-gray-300 focus:ring-blue-500';
    return answer.toLowerCase() === correctAnswer
      ? 'border-green-500 bg-green-50'
      : 'border-red-500 bg-red-50';
  };

  // التعامل مع تغيير النص في حقول الإدخال
  const handleChange = (e, question, part) => {
    if (isSubmitted) return;
    const { value } = e.target;
    // اسمح فقط بحرف واحد
    if (value.length > 1) return;

    setAnswers(prev => ({
      ...prev,
      [question]: { ...prev[question], [part]: value },
    }));
  };

  // التحقق من الإجابات وحساب النتيجة
  const checkAnswers = () => {
    let currentScore = 0;
    if (answers[1].first.toLowerCase() === correctAnswers[1].first) currentScore++;
    if (answers[1].second.toLowerCase() === correctAnswers[1].second) currentScore++;
    if (answers[2].first.toLowerCase() === correctAnswers[2].first) currentScore++;
    if (answers[3].first.toLowerCase() === correctAnswers[3].first) currentScore++;
    
    setValidation({ show: true, score: currentScore, total: 4 });
    setIsSubmitted(true);
  };

  // إعادة التمرين من البداية
  const handleStartAgain = () => {
    setAnswers(initialAnswers);
    setIsSubmitted(false);
    setValidation({ show: false, score: 0, total: 4 });
  };

  // إظهار الإجابات الصحيحة
  const handleShowAnswer = () => {
    setAnswers(correctAnswers);
    setIsSubmitted(true);
    setValidation({ show: false, score: 0, total: 4 });
  };

  // كلاسات مشتركة لحقول الإدخال لتجنب التكرار
  const inputClass = "inline-block w-10 h-10 mx-1 text-center text-xl font-semibold border-2 rounded-md transition-colors duration-300 disabled:bg-gray-200 disabled:cursor-not-allowed";

  return (
    <div className="p-6 font-sans bg-white rounded-lg shadow-lg max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-orange-600 mb-6 flex items-center">
        <span className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">C</span>
        Listen. Write and read the sentences.
      </h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* --- القسم الأيسر: الأسئلة --- */}
        <div className="w-full md:w-1/2 space-y-8">
          {/* السؤال الأول */}
          <div className="flex items-center text-xl">
            <span className="font-bold text-blue-600 mr-2">1</span>
            <p className="flex items-center flex-wrap">
              Look! There's a
              <input type="text" value={answers[1].first} onChange={(e) => handleChange(e, 1, 'first')} disabled={isSubmitted} className={`${inputClass} ${getBorderColor(answers[1].first, correctAnswers[1].first)}`} />
              abbit on the
              <input type="text" value={answers[1].second} onChange={(e) => handleChange(e, 1, 'second')} disabled={isSubmitted} className={`${inputClass} ${getBorderColor(answers[1].second, correctAnswers[1].second)}`} />
              oad.
            </p>
          </div>

          {/* السؤال الثاني */}
          <div className="flex items-center text-xl">
            <span className="font-bold text-blue-600 mr-2">2</span>
            <p className="flex items-center flex-wrap">
              Larry has long
              <input type="text" value={answers[2].first} onChange={(e) => handleChange(e, 2, 'first')} disabled={isSubmitted} className={`${inputClass} ${getBorderColor(answers[2].first, correctAnswers[2].first)}`} />
              egs.
            </p>
          </div>

          {/* السؤال الثالث */}
          <div className="flex items-center text-xl">
            <span className="font-bold text-blue-600 mr-2">3</span>
            <p className="flex items-center flex-wrap">
              There is a
              <input type="text" value={answers[3].first} onChange={(e) => handleChange(e, 3, 'first')} disabled={isSubmitted} className={`${inputClass} ${getBorderColor(answers[3].first, correctAnswers[3].first)}`} />
              amp on the table.
            </p>
          </div>
        </div>

        {/* --- القسم الأيمن: الصور --- */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-around space-y-4">
          <img src={img} alt="Rabbit on a road" className="max-w-[200px] object-contain" />
        </div>
      </div>

      {/* أزرار التحكم والنتيجة */}
      <div className="mt-8 text-center">
        {validation.show && <ValidationAlert score={validation.score} total={validation.total} />}
        <div className="mt-4">
            <Button
              handleShowAnswer={handleShowAnswer}
              handleStartAgain={handleStartAgain}
              checkAnswers={checkAnswers}
            />
        </div>
      </div>
    </div>
  );
};

export default WB_Unit1_Page8_Q3;

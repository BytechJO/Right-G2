import React, { useState } from 'react';
import ValidationAlert from '../../Popup/ValidationAlert';
import Button from '../button';
import img from "../../../assets/imgs/test6.png";

const exerciseDataM = {
  questions: [
    { id: 'm1', number: 2, correctMonth: 'February', image: img },
    { id: 'm2', number: 7, correctMonth: 'July', image: img },
    { id: 'm3', number: 11, correctMonth: 'November', image: img },
    { id: 'm4', number: 5, correctMonth: 'May', image: img },
  ],
  months: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
};

const WB_Unit7_Page41_Q1 = () => {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleSelectMonth = (questionId, month) => {
    if (showResults) return;
    setAnswers((prev) => ({ ...prev, [questionId]: month }));
  };

  const checkAnswers = () => {
    const unanswered = exerciseDataM.questions.filter(
      (q) => !answers[q.id]
    );

    if (unanswered.length > 0) {
      ValidationAlert.info();
      return;
    }

    setShowResults(true);
    let score = 0;
    let total = exerciseDataM.questions.length;

    exerciseDataM.questions.forEach((question) => {
      if (answers[question.id] === question.correctMonth) {
        score++;
      }
    });

    if (score === total) {
      ValidationAlert.success(`Score: ${score} / ${total}`);
    } else if (score > 0) {
      ValidationAlert.warning(`Score: ${score} / ${total}`);
    } else {
      ValidationAlert.error(`Score: ${score} / ${total}`);
    }
  };

  const handleShowAnswer = () => {
    const correctAnswers = {};
    exerciseDataM.questions.forEach((question) => {
      correctAnswers[question.id] = question.correctMonth;
    });
    setAnswers(correctAnswers);
    setShowResults(true);
  };

  const handleStartAgain = () => {
    setAnswers({});
    setShowResults(false);
  };

  const getSelectClass = (questionId) => {
    if (!showResults) {
      return 'border-2 border-gray-300 focus:border-blue-500 focus:outline-none px-3 py-2 rounded-lg font-semibold';
    }

    const question = exerciseDataM.questions.find((q) => q.id === questionId);
    const isCorrect = answers[questionId] === question?.correctMonth;

    if (isCorrect) {
      return 'border-2 border-green-500 bg-green-50 px-3 py-2 rounded-lg font-semibold text-green-800';
    }
    return 'border-2 border-red-500 bg-red-50 px-3 py-2 rounded-lg font-semibold text-red-800';
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white rounded-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="ex-A">E</div>
        <h1 className="header-title-page8">Look, read, and write.</h1>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8 ml-10">
        {/* Questions */}
        <div className="grid grid-cols-2 gap-6">
          {exerciseDataM.questions.map((question, idx) => (
            <div key={question.id} className="space-y-2">
              <p className="font-bold text-lg text-gray-700">{idx + 1}. What month is it?</p>
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  <img src={question.image} className="max-w-16 max-h-16 object-cover" />
                </div>
              </div>
              <select
                value={answers[question.id] || ''}
                onChange={(e) => handleSelectMonth(question.id, e.target.value)}
                disabled={showResults}
                className={getSelectClass(question.id)}
              >
                <option value="">Select a month</option>
                {exerciseDataM.months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Month Calendar */}
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-2 gap-3 p-4">
            {exerciseDataM.months.map((month, idx) => (
              <div
                key={month}
                className="w-20 h-20 bg-white border-2 rounded-lg flex flex-col items-center justify-center p-2"
              >
                <span className="text-xs font-semibold text-gray-600">{month}</span>
                <span className="text-2xl font-bold text-gray-800">{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <Button 
        handleStartAgain={handleStartAgain}
        handleShowAnswer={handleShowAnswer}
        checkAnswers={checkAnswers}
      />
    </div>
  );
}
export default WB_Unit7_Page41_Q1;
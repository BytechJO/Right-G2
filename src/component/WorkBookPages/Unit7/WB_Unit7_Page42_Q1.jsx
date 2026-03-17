import React, { useState } from 'react';
import ValidationAlert from '../../Popup/ValidationAlert';
import Button from '../button';

const exerciseDataO = {
  words: [
    { id: 'o1', word: 'March', missingIndex: 2, missing: 'r', fullWord: 'March' },
    { id: 'o2', word: 'September', missingIndex: 4, missing: 't', fullWord: 'September' },
    { id: 'o3', word: 'November', missingIndex: 0, missing: 'N', fullWord: 'November' },
    { id: 'o4', word: 'January', missingIndex: 0, missing: 'J', fullWord: 'January' },
    { id: 'o5', word: 'February', missingIndex: 0, missing: 'F', fullWord: 'February' },
  ],
};

 const WB_Unit7_Page42_Q1 = () => {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleSelectLetter = (wordId, letter) => {
    if (showResults) return;
    setAnswers((prev) => ({ ...prev, [wordId]: letter }));
  };

  const checkAnswers = () => {
    const unanswered = exerciseDataO.words.filter(
      (w) => !answers[w.id]
    );

    if (unanswered.length > 0) {
      ValidationAlert.info();
      return;
    }

    setShowResults(true);
    let score = 0;
    let total = exerciseDataO.words.length;

    exerciseDataO.words.forEach((word) => {
      if (answers[word.id] === word.missing) {
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
    exerciseDataO.words.forEach((word) => {
      correctAnswers[word.id] = word.missing;
    });
    setAnswers(correctAnswers);
    setShowResults(true);
  };

  const handleStartAgain = () => {
    setAnswers({});
    setShowResults(false);
  };

  const getSelectClass = (wordId) => {
    if (!showResults) {
      return 'border-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 rounded-lg font-bold w-10 h-10 text-center text-lg';
    }

    const word = exerciseDataO.words.find((w) => w.id === wordId);
    const isCorrect = answers[wordId] === word?.missing;

    if (isCorrect) {
      return 'border-2 border-green-500 bg-green-50 px-2 py-1 rounded-lg font-bold w-10 h-10 text-center text-lg text-green-800';
    }
    return 'border-2 border-red-500 bg-red-50 px-2 py-1 rounded-lg font-bold w-10 h-10 text-center text-lg text-red-800';
  };

  const renderWord = (word) => {
    return word.fullWord.split('').map((char, idx) => {
      if (idx === word.missingIndex) {
        return (
          <select
            key={idx}
            value={answers[word.id] || ''}
            onChange={(e) => handleSelectLetter(word.id, e.target.value)}
            disabled={showResults}
            className={getSelectClass(word.id)}
          >
            <option value="">_</option>
            <option value={word.missing}>{word.missing}</option>
          </select>
        );
      }
      return (
        <span key={idx} className="text-2xl font-bold text-gray-800">
          {char}
        </span>
      );
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gray-400 rounded-lg flex items-center justify-center font-bold text-white text-lg">G</div>
        <h1 className="text-2xl font-bold text-gray-800">Look and write missing letters.</h1>
      </div>

      {/* Months with bubbles - Left side */}
      <div className="flex gap-8 mb-8">
        <div className="flex-1 bg-gradient-to-b from-blue-50 to-white p-8 rounded-lg border-2 border-blue-200">
          <div className="flex flex-wrap gap-6 justify-center">
            {exerciseDataO.words.map((word) => (
              <div key={word.id} className="flex items-center justify-center">
                <div className="border-4 border-gray-800 rounded-full px-4 py-3 bg-white min-w-max">
                  <div className="text-xl font-bold text-gray-800 tracking-wider flex gap-1">
                    {renderWord(word)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Word list - Right side */}
        <div className="w-40 bg-gray-100 p-4 rounded-lg border-2 border-gray-300">
          <div className="space-y-2">
            {['November', 'March', 'September', 'February', 'January'].map((month) => (
              <div key={month} className="border-2 border-gray-400 px-3 py-2 bg-white text-center font-semibold text-gray-800 rounded">
                {month}
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

export default WB_Unit7_Page42_Q1
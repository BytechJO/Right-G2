import React, { useState } from 'react';
import img from "../../../assets/imgs/test6.png";
import Button from "../button";
import ValidationAlert from "../../Popup/ValidationAlert";

const FamilyCompletionActivity = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [answers, setAnswers] = useState({
    sentence1a: '',
    sentence1b: '',
    sentence2b: '',
    sentence2: '',
    sentence3: '',
    sentence4: ''
  });

  const correctAnswers = {
    sentence1a: 'sister',
    sentence1b: 'cousin',
    sentence2b: 'play',
    sentence2: 'aunt',
    sentence3: 'brother',
    sentence4: 'uncle'
  };

  const handleShowAnswer = () => setAnswers(correctAnswers);
  const handleStartAgain = () => {
    setAnswers({ sentence1a: '', sentence1b: '', sentence2b: '', sentence2: '', sentence3: '', sentence4: '' });
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

    if (answers.sentence1a === correctAnswers.sentence1a) correct++;
    if (answers.sentence1b === correctAnswers.sentence1b) correct++;
    if (answers.sentence2b === correctAnswers.sentence2b) correct++;
    if (answers.sentence2 === correctAnswers.sentence2) correct++;
    if (answers.sentence3 === correctAnswers.sentence3) correct++;
    if (answers.sentence4 === correctAnswers.sentence4) correct++;

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

  const words = ['play', 'aunt', 'uncle', 'sister', 'brother', 'cousin'];

  return (
    <>
      <div className="flex items-center gap-4 ml-90 mt-10">
        <div className="ex-A">L</div>
        <h1 className="header-title-page8">Look,read,and complete. Use the words from the box.</h1>
      </div>
      <div className="family-completion-activity p-6 max-w-4xl mx-auto" dir="ltr">

        {/* Word Box */}
        <div className="words-box mb-8 p-4  border-2 border-blue-200 rounded-xl flex flex-wrap justify-center items-center">
          {words.map(word => (
            <span
              key={word}
              className="m-1 px-4 py-2 bg-white border-2 border-blue-300 rounded-full text-blue-700 font-medium shadow-sm hover:bg-blue-50 transition-colors"
            >
              {word}
            </span>
          ))}
        </div>

        <div className="sentences ">
          <div className="flex items-center gap-4 p-5 rounded-xl ">
            <div className="flex-1">
              <p className="text-xl text-gray-800">
                <span className="font-semibold text-blue-600 mr-2">1.</span>
                "My
                <input
                  type="text"
                  value={answers.sentence1a}
                  onChange={(e) => handleAnswerChange('sentence1a', e.target.value)}
                  className="mx-3 p-2  w-28 text-center text-lg"
                  placeholder="_______________"
                />
                and
                <input
                  type="text"
                  value={answers.sentence1b}
                  onChange={(e) => handleAnswerChange('sentence1b', e.target.value)}
                  className="mx-3 p-2 w-28 text-center text-lg"
                  placeholder="_______________"
                />
                <br />
                <input
                  type="text"
                  value={answers.sentence2b}
                  onChange={(e) => handleAnswerChange('sentence2b', e.target.value)}
                  className="mx-3 p-2 w-28 text-center text-lg"
                  placeholder="_______________"
                />
                all day," Stella says.
              </p>
            </div>
            <img src={img} alt="sentence1" className="max-w-16 max-h-16 object-contain" />
          </div>
          <div className="flex items-center gap-4 p-5 rounded-xl ">
            <div className="flex-1">
              <p className="text-xl text-gray-800">
                <span className="font-semibold text-blue-600 mr-2">2.</span>
                I'm Stella's
                <input
                  type="text"
                  value={answers.sentence2}
                  onChange={(e) => handleAnswerChange('sentence2', e.target.value)}
                  className="mx-3 p-2 w-28 text-center text-lg"
                  placeholder="_______________"
                />
                .
              </p>
            </div>
            <img src={img} alt="sentence2" className="max-w-16 max-h-16 object-contain" />
          </div>
          <div className="flex items-center gap-4 p-5 rounded-xl ">
            <div className="flex-1">
              <p className="text-xl text-gray-800">
                <span className="font-semibold text-blue-600 mr-2">3.</span>
                He's my
                <input
                  type="text"
                  value={answers.sentence3}
                  onChange={(e) => handleAnswerChange('sentence3', e.target.value)}
                  className="mx-3 p-2 w-28 text-center text-lg"
                  placeholder="_______________"
                />
                .
              </p>
            </div>
            <img src={img} alt="sentence3" className="max-w-16 max-h-16 object-contain" />
          </div>
          <div className="flex items-center gap-4 p-5 rounded-xl ">
            <div className="flex-1">
              <p className="text-xl text-gray-800">
                <span className="font-semibold text-blue-600 mr-2">4.</span>
                I'm Stella's
                <input
                  type="text"
                  value={answers.sentence4}
                  onChange={(e) => handleAnswerChange('sentence4', e.target.value)}
                  className="mx-3 p-2 rounded-lg w-28 text-center text-lg"
                  placeholder="_______________"
                />
                .
              </p>
            </div>
            <img src={img} alt="sentence4" className="max-w-16 max-h-16 object-contain" />
          </div>
        </div>

        <Button handleShowAnswer={handleShowAnswer} handleStartAgain={handleStartAgain} checkAnswers={checkAnswers} />

        {showAlert && (
          <ValidationAlert correct={score.correct} total={score.total} onClose={() => setShowAlert(false)} />
        )}
      </div>
    </>
  );
};

export default FamilyCompletionActivity;
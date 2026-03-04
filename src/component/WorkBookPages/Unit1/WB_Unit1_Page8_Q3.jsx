import React, { useState } from 'react';
import img from "../../../assets/imgs/test6.png";
import Button from "../button";
import ValidationAlert from "../../Popup/ValidationAlert";

const WB_Unit1_Page8_Q3 = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [answers, setAnswers] = useState({
    sentence1a: '',
    sentence1b: '',
    sentence2: '',
    sentence3: ''
  });

  const correctAnswers = {
    sentence1a: 'r',
    sentence1b: 'r',
    sentence2: 'l',
    sentence3: 'l'
  };

  const handleShowAnswer = () => setAnswers(correctAnswers);
  const handleStartAgain = () => {
    setAnswers({ sentence1a: '', sentence1b: '', sentence2: '', sentence3: '' });
    setShowAlert(false);
  };

  const checkAnswers = () => {
    const allFilled = Object.values(answers).every(answer => answer.trim() !== "");

    if (!allFilled) {
      ValidationAlert.warning("Please fill in all answers!");
      return; // نوقف التنفيذ إذا هناك input فارغ
    }

    let correct = 0;
    const total = 4;

    if (answers.sentence1a === correctAnswers.sentence1a) correct++;
    if (answers.sentence1b === correctAnswers.sentence1b) correct++;
    if (answers.sentence2 === correctAnswers.sentence2) correct++;
    if (answers.sentence3 === correctAnswers.sentence3) correct++;

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
      <div className="flex items-center gap-4 ml-90 mt-10">
        <div className="ex-A">C</div>
        <h1 className="header-title-page8">Listen. Write and read the sentences.</h1>
      </div>
      <div className="family-completion-activity p-6 max-w-4xl mx-auto" dir="ltr">

        <div className="flex items-start gap-8">
          <div className="sentences flex-1">
            <div className="flex items-center gap-4 p-5 rounded-xl ">
              <div className="flex-1">
                <p className="text-xl text-gray-800">
                  <span className="font-semibold text-blue-600 mr-2">1.</span>
                  "Look There's a
                  <input
                    type="text"
                    maxLength={1}
                    value={answers.sentence1a}
                    onChange={(e) => handleAnswerChange('sentence1a', e.target.value)}
                    className="mx-3 p-2  w-12 text-center text-lg"
                    placeholder="_______________"
                  />
                  abbit on the
                  <input
                    type="text"
                    maxLength={1}
                    value={answers.sentence1b}
                    onChange={(e) => handleAnswerChange('sentence1b', e.target.value)}
                    className="mx-3 p-2 w-12 text-center text-lg"
                    placeholder="_______________"
                  />
                  oad.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 rounded-xl ">
              <div className="flex-1">
                <p className="text-xl text-gray-800">
                  <span className="font-semibold text-blue-600 mr-2">2.</span>
                  Larry has long
                  <input
                    type="text"
                    maxLength={1}
                    value={answers.sentence2}
                    onChange={(e) => handleAnswerChange('sentence2', e.target.value)}
                    className="mx-3 p-2 w-12 text-center text-lg"
                    placeholder="_______________"
                  />
                  egs.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 rounded-xl ">
              <div className="flex-1">
                <p className="text-xl text-gray-800">
                  <span className="font-semibold text-blue-600 mr-2">3.</span>
                  There is a
                  <input
                    type="text"
                    maxLength={1}
                    value={answers.sentence3}
                    onChange={(e) => handleAnswerChange('sentence3', e.target.value)}
                    className="mx-3 p-2 w-12 text-center text-lg"
                    placeholder="_______________"
                  />
                  amp on the table.
                </p>
              </div>
            </div>
          </div>
          <div className="w-64">
            <img
              src= {img}
              alt="Rabbit"
              className="rounded-xl shadow-lg max-w-100 max-h-75 object-cover"
            />
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

export default WB_Unit1_Page8_Q3;
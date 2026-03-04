import React, { useState } from "react";
import img from "../../../assets/imgs/test6.png";
import Button from "../button";
import ValidationAlert from "../../Popup/ValidationAlert";

const LookWriteActivityGrid = () => {
  const [answers, setAnswers] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: ""
  });

  const correctAnswers = {
    q1: "L",
    q2: "R",
    q3: "R",
    q4: "R",
    q5: "L",
    q6: "R"
  };

  const handleAnswerChange = (field, value) => {
    setAnswers(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleShowAnswer = () => setAnswers(correctAnswers);

  const handleStartAgain = () => {
    setAnswers({
      q1: "",
      q2: "",
      q3: "",
      q4: "",
      q5: "",
      q6: ""
    });
  };

  const checkAnswers = () => {
    const total = Object.keys(correctAnswers).length;
    let correct = 0;

    // تحقق من الإجابات الفارغة
    const anyEmpty = Object.values(answers).some(a => !a.trim());
    if (anyEmpty) {
      ValidationAlert.warning("Please fill in all the missing letters!");
      return;
    }

    // تحقق من الإجابات الصحيحة
    Object.keys(correctAnswers).forEach(key => {
      const userInput = answers[key].trim().toLowerCase();
      const correctLetter = correctAnswers[key].toLowerCase();

      if (userInput === correctLetter) {
        correct++;
      }
    });

    if (correct === total) {
      ValidationAlert.success(`Score: ${correct}/${total}`);
    } else {
      ValidationAlert.error(`Score: ${correct}/${total}`);
    }
  };

  const questions = [
    { key: "q1", word: "Lemon", colStart: 2, colEnd: 3, rowStart: 2, rowEnd: 3 },
    { key: "q2", word: "Rat", colStart: 3, colEnd: 4, rowStart: 2, rowEnd: 3 },
    { key: "q3", word: "Rabbit", colStart: 4, colEnd: 5, rowStart: 2, rowEnd: 3 },
    { key: "q4", word: "Robot", colStart: 2, colEnd: 3, rowStart: 3, rowEnd: 4 },
    { key: "q5", word: "Lamp", colStart: 3, colEnd: 4, rowStart: 3, rowEnd: 4 },
    { key: "q6", word: "Ruler", colStart: 4, colEnd: 5, rowStart: 3, rowEnd: 4 }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4">
        <div className="ex-A">A</div>
        <h1 className="header-title-page8">Look and write the missing letters. Read.</h1>
      </div>
      {/* Grid */}
      <div className="grid grid-cols-4 gap-20">
        {questions.map(q => (
          <div
            key={q.key}
            className={`flex items-center justify-between p-3 rounded-lg`}
            style={{
              gridColumnStart: q.colStart,
              gridColumnEnd: q.colEnd,
              gridRowStart: q.rowStart,
              gridRowEnd: q.rowEnd
            }}
          >
            {/* أول حرف مفقود والباقي مبين */}
            <input
              type="text"
              maxLength={1}
              value={answers[q.key]}
              onChange={e => handleAnswerChange(q.key, e.target.value)}
              className="border-b-2 border-black-300 p-1 w-12 text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            />
            <span className="text-lg font-semibold">
              {q.word.slice(1)}
            </span>

            <img src={img} alt={q.word} className="max-w-12 max-h-12 object-contain" />
          </div>
        ))}
      </div>

      <Button
        handleShowAnswer={handleShowAnswer}
        handleStartAgain={handleStartAgain}
        checkAnswers={checkAnswers}
      />
    </div>
  );
};

export default LookWriteActivityGrid;
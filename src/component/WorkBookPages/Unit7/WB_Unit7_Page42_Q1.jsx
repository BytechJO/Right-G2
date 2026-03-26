import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../button";

const exerciseDataO = {
  words: [
    {
      id: "o1",
      fullWord: "March",
      pattern: ["M", "a", null, "c", "h"],
      bubbleClass: "top-2 left-24",
    },
    {
      id: "o2",
      fullWord: "September",
      pattern: [null, null, "e", "p", "t", null, null, null, null],
      bubbleClass: "top-30 left-1/2 -translate-x-1/2",
    },
    {
      id: "o3",
      fullWord: "November",
      pattern: ["N", "o", null, null, null, null, null, null],
      bubbleClass: "top-2 right-12",
    },
    {
      id: "o4",
      fullWord: "January",
      pattern: [null, "a", "n", null, null, null, "r", null],
      bubbleClass: "bottom-4 left-28",
    },
    {
      id: "o5",
      fullWord: "February",
      pattern: ["F", null, "b", null, "u", null, null, null, "y"],
      bubbleClass: "bottom-4 right-20",
    },
  ],
};

const WB_Unit7_Page42_Q1 = () => {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleSelectLetter = (wordId, blankIndex, letter) => {
    if (showResults) return;

    setAnswers((prev) => {
      const currentWordAnswers = prev[wordId] || [];
      const updatedAnswers = [...currentWordAnswers];
      updatedAnswers[blankIndex] = letter;

      return {
        ...prev,
        [wordId]: updatedAnswers,
      };
    });
  };

  const getCorrectLetters = (word) => {
    return word.fullWord
      .split("")
      .filter((_, idx) => word.pattern[idx] === null);
  };

  const isWordCorrect = (word) => {
    const correctLetters = getCorrectLetters(word);
    const userAnswers = answers[word.id] || [];

    if (userAnswers.length !== correctLetters.length) return false;

    return correctLetters.every((letter, idx) => userAnswers[idx] === letter);
  };

  const checkAnswers = () => {
    const hasUnanswered = exerciseDataO.words.some((word) => {
      const blankCount = word.pattern.filter((char) => char === null).length;
      const userAnswers = answers[word.id] || [];

      if (userAnswers.length < blankCount) return true;
      return userAnswers.some((answer) => !answer);
    });

    if (hasUnanswered) {
      ValidationAlert.info("Please complete all answers before checking.");
      return;
    }

    let score = 0;
    const total = exerciseDataO.words.length;

    exerciseDataO.words.forEach((word) => {
      if (isWordCorrect(word)) {
        score++;
      }
    });

    const scoreMessage = `Score: ${score} / ${total}`;
    setShowResults(true);

    if (score === total) {
      ValidationAlert.success(scoreMessage);
    } else if (score > 0) {
      ValidationAlert.warning(scoreMessage);
    } else {
      ValidationAlert.error(scoreMessage);
    }
  };

  const handleShowAnswer = () => {
    const correctAnswers = {};

    exerciseDataO.words.forEach((word) => {
      correctAnswers[word.id] = getCorrectLetters(word);
    });

    setAnswers(correctAnswers);
    setShowResults(true);
  };

  const handleStartAgain = () => {
    setAnswers({});
    setShowResults(false);
  };

  const getSelectClass = (word) => {
    if (!showResults) {
      return "w-8 text-center text-lg font-semibold bg-transparent border-0 border-b-2 border-gray-500 focus:outline-none";
    }

    return isWordCorrect(word)
      ? "w-8 text-center text-lg font-semibold bg-green-50 text-green-700 border-0 border-b-2 border-green-500 focus:outline-none"
      : "w-8 text-center text-lg font-semibold bg-red-50 text-red-700 border-0 border-b-2 border-red-500 focus:outline-none";
  };

  const renderWord = (word) => {
    let blankCounter = -1;

    return word.pattern.map((char, idx) => {
      if (char === null) {
        blankCounter++;

        const correctLetters = getCorrectLetters(word);
        const currentOptions = [...new Set(correctLetters)];

        return (
          <select
            key={`${word.id}-${idx}`}
            value={answers[word.id]?.[blankCounter] || ""}
            onChange={(e) =>
              handleSelectLetter(word.id, blankCounter, e.target.value)
            }
            disabled={showResults}
            className={getSelectClass(word)}
          >
            <option value="">_</option>
            {currentOptions.map((letter, optionIdx) => (
              <option key={optionIdx} value={letter}>
                {letter}
              </option>
            ))}
          </select>
        );
      }

      return (
        <span
          key={`${word.id}-${idx}`}
          className="text-lg font-semibold text-gray-800 tracking-wider"
        >
          {char}
        </span>
      );
    });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white rounded-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="ex-A">G</div>
        <h1 className="header-title-page8">Look and write missing letters.</h1>
      </div>

      <div className="flex gap-8 items-start">
        <div className="w-40 pt-24">
          <div className="space-y-2">
            {["November", "March", "September", "February", "January"].map(
              (month) => (
                <div
                  key={month}
                  className="border border-gray-400 px-3 py-1 bg-white text-sm rounded-md shadow-sm text-center font-medium text-gray-800"
                >
                  {month}
                </div>
              )
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="relative h-[420px] bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
            {exerciseDataO.words.map((word) => (
              <div
                key={word.id}
                className={`absolute ${word.bubbleClass} flex flex-col items-center`}
              >
                <div className="min-w-[170px] min-h-[78px] px-6 py-4 bg-white border-2 border-gray-500 rounded-[999px] flex items-center justify-center shadow-sm">
                  <div className="flex items-center gap-1 flex-wrap justify-center">
                    {renderWord(word)}
                  </div>
                </div>

                <div className="w-[2px] h-16 bg-gray-500 mt-1"></div>
              </div>
            ))}

            <div className="absolute bottom-2 left-0 right-0 h-16"></div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Button
          handleStartAgain={handleStartAgain}
          handleShowAnswer={handleShowAnswer}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
};

export default WB_Unit7_Page42_Q1;
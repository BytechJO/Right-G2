import React, { useState, useMemo } from "react";
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
      pattern: [null, "e", "p", "t", null, null, null, null, null],
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
      pattern: [null, "a", "n", null, null, "r", null],
      bubbleClass: "bottom-4 left-28",
    },
    {
      id: "o5",
      fullWord: "February",
      pattern: ["F", null, "b", null, "u", null, null, "y"],
      bubbleClass: "bottom-4 right-20",
    },
  ],
};

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

const getOptionsForLetter = (correctLetter) => {
  const wrongLetters = alphabet.filter((l) => l !== correctLetter);

  const randomWrong = wrongLetters.sort(() => 0.5 - Math.random()).slice(0, 2);

  const options = [correctLetter, ...randomWrong];
  return options.sort(() => 0.5 - Math.random());
};

const WB_Unit7_Page42_Q1 = () => {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleSelectLetter = (wordId, index, letter) => {
    if (showResults) return;

    setAnswers((prev) => ({
      ...prev,
      [wordId]: {
        ...(prev[wordId] || {}),
        [index]: letter,
      },
    }));
  };

  const isLetterCorrect = (word, idx) => {
    const userAnswers = answers[word.id] || {};
    return userAnswers[idx] === word.fullWord[idx];
  };

  const isWordCorrect = (word) => {
    const userAnswers = answers[word.id] || {};

    return word.pattern.every((char, idx) => {
      if (char === null) {
        return userAnswers[idx] === word.fullWord[idx];
      }
      return true;
    });
  };

  // ✅ تثبيت الخيارات (حل المشكلة)
  const optionsMap = useMemo(() => {
    const map = {};

    exerciseDataO.words.forEach((word) => {
      map[word.id] = {};

      word.pattern.forEach((char, idx) => {
        if (char === null) {
          const correctLetter = word.fullWord[idx];
          map[word.id][idx] = getOptionsForLetter(correctLetter);
        }
      });
    });

    return map;
  }, []);

  const checkAnswers = () => {
    const hasUnanswered = exerciseDataO.words.some((word) => {
      const blanks = word.pattern
        .map((char, idx) => (char === null ? idx : null))
        .filter((v) => v !== null);

      const userAnswers = answers[word.id] || {};

      return blanks.some((idx) => !userAnswers[idx]);
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
      const wordAnswers = {};
      word.pattern.forEach((char, idx) => {
        if (char === null) {
          wordAnswers[idx] = word.fullWord[idx];
        }
      });
      correctAnswers[word.id] = wordAnswers;
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
      return "w-10 text-center text-lg font-semibold bg-transparent border-0 border-b-2 border-gray-500 focus:outline-none";
    }

    return isWordCorrect(word)
      ? "w-10 text-center text-lg font-semibold border-0 border-b-2 focus:outline-none"
      : "w-10 text-center text-lg font-semibold border-0 border-b-2 focus:outline-none";
  };

  const renderWord = (word) => {
    return word.pattern.map((char, idx) => {
      if (char === null) {
        const options = optionsMap[word.id][idx];
        const userValue = answers[word.id]?.[idx];
        const isCorrect = userValue === word.fullWord[idx];

        return (
          <div key={`${word.id}-${idx}`} className="relative">
            <select
              value={userValue || ""}
              onChange={(e) => handleSelectLetter(word.id, idx, e.target.value)}
              disabled={showResults}
              className={getSelectClass(word)}
            >
              <option value=""> </option>
              {options.map((letter, i) => (
                <option key={i} value={letter}>
                  {letter}
                </option>
              ))}
            </select>

            {/* ❌ */}
            {showResults && userValue && !isCorrect && (
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full border-2 border-white font-bold">
                ✕
              </div>
            )}
          </div>
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
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "20px" }}>
        {" "}
        <h1 className="WB-header-title-page8">
          {" "}
          <span className="WB-ex-A">G</span>Look and write missing letters.{" "}
        </h1>
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
                ),
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
    </div>
  );
};

export default WB_Unit7_Page42_Q1;

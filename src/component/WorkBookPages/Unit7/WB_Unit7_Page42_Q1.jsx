import React, { useState, useMemo } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 42/Ex H 1.svg";

const exerciseDataO = {
  words: [
    {
      id: "o1",
      fullWord: "March",
      pattern: ["M", "a", null, "c", "h"],
      bubbleClass: "top-[21%] left-[7%]",
    },
    {
      id: "o2",
      fullWord: "September",
      pattern: [null, "e", "p", "t", null, null, null, null, null],
      bubbleClass: "top-[21%] right-[47%]",
    },
    {
      id: "o3",
      fullWord: "November",
      pattern: ["N", "o", null, null, null, null, null, null],
      bubbleClass: "top-[18%] left-[56%]",
    },
    {
      id: "o4",
      fullWord: "January",
      pattern: [null, "a", "n", null, null, "r", null],
      bubbleClass: "bottom-[55%] left-[17%]",
    },
    {
      id: "o5",
      fullWord: "February",
      pattern: ["F", null, "b", null, "u", null, null, "y"],
      bubbleClass: "bottom-[55%] right-[28%]",
    },
  ],
};

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

const getOptionsForLetter = (correctLetter) => {
  const wrongLetters = alphabet.filter((l) => l !== correctLetter);
  const randomWrong = wrongLetters.sort(() => 0.5 - Math.random()).slice(0, 2);
  return [correctLetter, ...randomWrong].sort(() => 0.5 - Math.random());
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

  const isWordCorrect = (word) => {
    const userAnswers = answers[word.id] || {};
    return word.pattern.every((char, idx) => {
      if (char === null) {
        return userAnswers[idx] === word.fullWord[idx];
      }
      return true;
    });
  };

  const optionsMap = useMemo(() => {
    const map = {};
    exerciseDataO.words.forEach((word) => {
      map[word.id] = {};
      word.pattern.forEach((char, idx) => {
        if (char === null) {
          map[word.id][idx] = getOptionsForLetter(word.fullWord[idx]);
        }
      });
    });
    return map;
  }, []);
  const areAllInputsFilled = () => {
  return exerciseDataO.words.every((word) => {
    const userAnswers = answers[word.id] || {};

    return word.pattern.every((char, idx) => {
      if (char === null) {
        return userAnswers[idx] !== undefined && userAnswers[idx] !== "";
      }
      return true;
    });
  });
};
  const checkAnswers = () => {
    if (showResults) return;

    // 🔴 التحقق من تعبئة كل الانبوتات
    if (!areAllInputsFilled()) {
      ValidationAlert.info("Please fill all the missing letters first!");
      return;
    }

    let score = 0;
    const total = exerciseDataO.words.length;

    exerciseDataO.words.forEach((word) => {
      if (isWordCorrect(word)) score++;
    });

    setShowResults(true);

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
  const isLetterWrong = (word, idx) => {
    if (!showResults) return false;

    const userValue = answers[word.id]?.[idx];
    const correctValue = word.fullWord[idx];

    return userValue && userValue !== correctValue;
  };
  const renderWord = (word) => {
    return word.pattern.map((char, idx) => {
      if (char === null) {
        const options = optionsMap[word.id][idx];
        const userValue = answers[word.id]?.[idx];

        return (
          <div key={`${word.id}-${idx}`} className="relative">
            <select
              value={userValue || ""}
              onChange={(e) => handleSelectLetter(word.id, idx, e.target.value)}
              disabled={showResults}
             className={`w-4 text-center text-lg font-semibold border-0 border-b-2 appearance-none focus:outline-none
  ${isLetterWrong(word, idx) ? "border-red-500 text-black bg-white" : "border-black text-black bg-white"}
`}
            >
              <option value=""></option>
              {options.map((letter, i) => (
                <option key={i} value={letter}>
                  {letter}
                </option>
              ))}
            </select>

            {/* ❌ الأيقونة */}
            {isLetterWrong(word, idx) && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold border-2 border-white">
                ✕
              </div>
            )}
          </div>
        );
      }

      return (
        <span key={`${word.id}-${idx}`} className="text-lg font-semibold">
          {char}
        </span>
      );
    });
  };

  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"25px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">G</span>
          Look and write missing letters.
        </h1>

        <div className="flex flex-col">
          {/* الكلمات الجانبية */}
          <div className="w-full rounded-lg">
            <div className="flex gap-5 justify-center items-center text-lg">
              {["November", "March", "September", "February", "January"].map(
                (month) => (
                  <div
                    key={month}
                    className="WB-word-bank"
                      style={{padding:"9px 22px"}}
                  >
                    {month}
                  </div>
                ),
              )}
            </div>
          </div>

          {/* الصورة + الانبوت */}
          <div className="flex-1 flex justify-center items-center">
            <div className="relative w-[70%] flex justify-center items-center">
              <img
                src={img}
                alt="exercise"
                className="w-full"
                style={{ height: "100%", width: "auto" }}
              />

              {exerciseDataO.words.map((word) => (
                <div key={word.id} className={`absolute ${word.bubbleClass}`}>
                  <div className="flex items-center gap-1">
                    {renderWord(word)}
                  </div>
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

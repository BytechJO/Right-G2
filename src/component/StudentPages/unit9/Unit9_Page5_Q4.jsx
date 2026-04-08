import React, { useState, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit9_Page5_Q4.css";
import img1 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 80/Ex C 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 80/Ex C 2.svg";

const Unit9_Page5_Q4 = () => {
  const [locked, setLocked] = useState(false);

  const grid = [
    "i",
    "t",
    "c",
    "e",
    "d",
    "r",
    "m",
    "d",
    "v",
    "e",
    "w",
    "e",
    "k",
    "i",
    "l",
    "x",
    "s",
    "z",
    "e",
    "z",
    "s",
    "e",
    "n",
    "d",
    "z",
    "q",
    "t",
    "b",
    "n",
    "r",
    "r",
    "t",
    "h",
    "e",
    "t",
    "j",
    "l",
    "e",
    "m",
    "a",
    "i",
    "l",
    "s",
    "e",
    "o",
    "d",
    "h",
    "y",
    "d",
    "e",
    "u",
    "s",
    "i",
    "n",
    "g",
    "n",
    "a",
    "p",
    "l",
    "t",
    "c",
    "o",
    "m",
    "p",
    "u",
    "t",
    "e",
    "r",
    "t",
    "x",
  ];

  const wordsToFind = ["we", "send", "emails", "using", "a", "computer"];

  // ✅ الحل بالـ index
  const correctAnswers = [
    { word: "we", indexes: [10, 11] },
    { word: "send", indexes: [20, 21, 22, 23] },
    { word: "emails", indexes: [36, 37, 38, 39, 40, 41] },
    { word: "using", indexes: [49, 50, 51, 52, 53] },
    { word: "a", indexes: [56] },
    { word: "computer", indexes: [60, 61, 62, 63, 64, 65, 66, 67] },
  ];

  const letters = grid;

  const [sentence, setSentence] = useState("");
  const [selected, setSelected] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [foundWords, setFoundWords] = useState([]); // ⬅️ index
  const [coloredCells, setColoredCells] = useState([]);

  const handleClick = (letter, index) => {
    if (coloredCells.includes(index)) return;

    if (selected.includes(index)) {
      const cutIndex = selected.indexOf(index);
      const newSelected = selected.slice(0, cutIndex);

      const newWord = newSelected.map((i) => letters[i]).join("");

      setSelected(newSelected);
      setCurrentWord(newWord);
      return;
    }

    setSelected((prev) => [...prev, index]);
    setCurrentWord((prev) => prev + letter);
  };

  useEffect(() => {
    const matchedIndex = correctAnswers.findIndex(
      (item) =>
        item.word === currentWord &&
        JSON.stringify(item.indexes) === JSON.stringify(selected),
    );

    if (matchedIndex !== -1 && !foundWords.includes(matchedIndex)) {
      setFoundWords((prev) => [...prev, matchedIndex]);
      setColoredCells((prev) => [...prev, ...selected]);

      setSentence((prev) =>
        prev === "" ? currentWord : prev + " " + currentWord,
      );

      setSelected([]);
      setCurrentWord("");
    }
  }, [currentWord]);

  const checkAnswers = () => {
    if (locked) return;

    const total = wordsToFind.length;
    const score = foundWords.length;

    if (score === 0) {
      ValidationAlert.info(`Find all the words first!`);
      return;
    }

    setLocked(true);

    if (score === total) {
      ValidationAlert.success(`<b>Score: ${score} / ${total}</b>`);
    } else {
      ValidationAlert.warning(`<b>Score: ${score} / ${total}</b>`);
    }
  };

  const reset = () => {
    setSelected([]);
    setCurrentWord("");
    setFoundWords([]);
    setColoredCells([]);
    setSentence("");
    setLocked(false);
  };

  const showAnswers = () => {
    let allCells = [];

    correctAnswers.forEach((item) => {
      allCells.push(...item.indexes);
    });

    setFoundWords(correctAnswers.map((_, i) => i));
    setColoredCells(allCells);
    setSelected([]);
    setCurrentWord("");
    setSentence(correctAnswers.map((w) => w.word).join(" "));
    setLocked(true);
  };

  const isMissingWord = (index) => {
    if (!locked) return false;
    return !foundWords.includes(index);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall gap-2">
        <h5 className="header-title-page8">
          <span className="ex-A">C </span>What electronic item do we use to send
          e-mails?
        </h5>

        <div className="words-list-CB-unit3-p5-q4">
          {wordsToFind.map((word, i) => (
            <span
              key={i}
              style={{ position: "relative", display: "inline-block" }}
              className={`word-CB-unit3-p5-q4 ${
                foundWords.includes(i) ? "found-CB-unit3-p5-q4" : ""
              }`}
            >
              {word}

              {isMissingWord(i) && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white z-10">
                  ✕
                </div>
              )}
            </span>
          ))}
        </div>

        <div className="wordsearch-wrapper-CB-unit3-p5-q4">
          <div className="grid-CB-unit3-p5-q4">
            {letters.map((letter, index) => {
              const isSelected = selected.includes(index);
              const isFound = coloredCells.includes(index);

              return (
                <span
                  key={index}
                  className={`cell-CB-unit3-p5-q4 
                  ${isSelected ? "selected-CB-unit3-p5-q4" : ""}
                  ${isFound ? "found-cell-CB-unit3-p5-q4" : ""}`}
                  onClick={() => handleClick(letter, index)}
                >
                  {letter}
                </span>
              );
            })}
          </div>

          <div className="flex">
            <img src={img1} style={{ height: "80px", width: "80px" }} />
            <input
              className="answer-input-CB-unit3-p5-q4"
              value={sentence}
              readOnly
            />
            <img src={img2} style={{ height: "80px", width: "80px" }} />
          </div>
        </div>
      </div>

      <div className="action-buttons-container">
        <button onClick={reset} className="try-again-button">
          Start Again ↻
        </button>
        <button onClick={showAnswers} className="show-answer-btn">
          Show Answer
        </button>
        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit9_Page5_Q4;

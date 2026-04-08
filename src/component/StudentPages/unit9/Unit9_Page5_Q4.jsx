import React, { useState, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit9_Page5_Q4.css";
import img1 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 80/Ex C 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 80/Ex C 2.svg";

const Unit9_Page5_Q4 = () => {
  const grid = [
    "i","t","c","e","d","r","m","d","v","e","w","e","k","i","l","x","s","z","e","z",
    "s","e","n","d","z","q","t","b","n","r","r","t","h","e","t","j","l","e","m","a",
    "i","l","s","e","o","d","h","y","d","e","u","s","i","n","g","n","a","p","l","t",
    "c","o","m","p","u","t","e","r","t","x",
  ];

  const correctPositions = {
    we: [10, 11],
    send: [20, 21, 22, 23],
    emails: [ 37, 38, 39, 40, 41,42],
    using: [ 50, 51, 52, 53,54],
    a: [56],
    computer: [60, 61, 62, 63, 64, 65, 66, 67],
  };

  const wordsToFind = ["we", "send", "emails", "using", "a", "computer"];

  const fullSentence = ["we", "send", "emails", "using", "a", "computer"];

  const letters = grid;

  const [locked, setLocked] = useState(false);
  const [selected, setSelected] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [foundWords, setFoundWords] = useState([]); // index
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
    const keys = Object.keys(correctPositions);

    const matchedIndex = keys.findIndex((word) => {
      const correctIdx = correctPositions[word];

      if (correctIdx.length !== selected.length) return false;

      for (let i = 0; i < correctIdx.length; i++) {
        if (correctIdx[i] !== selected[i]) return false;
      }

      return word === currentWord;
    });

    if (matchedIndex !== -1 && !foundWords.includes(matchedIndex)) {
      setFoundWords((prev) => [...prev, matchedIndex]);
      setColoredCells((prev) => [...prev, ...selected]);

      setSelected([]);
      setCurrentWord("");
    }
  }, [currentWord]);

  // 🔥 slots زي Unit6
  const displayedSentence = fullSentence.map((word) => {
    const isFound = foundWords.some(
      (i) => Object.keys(correctPositions)[i] === word
    );

    const SLOT_LENGTH = 12;

    return isFound
      ? word.padEnd(SLOT_LENGTH, "")
      : "_".repeat(SLOT_LENGTH);
  });

  const checkAnswers = () => {
    if (locked) return;

    const total = wordsToFind.length;
    const score = foundWords.length;

    if (foundWords.length === 0) {
      ValidationAlert.info(`Find all the words first!`);
      return;
    }

    if (score === total) {
      ValidationAlert.success(`<b>Score: ${score} / ${total}</b>`);
    } else {
      ValidationAlert.warning(`<b>Score: ${score} / ${total}</b>`);
    }

    setLocked(true);
  };

  const reset = () => {
    setSelected([]);
    setCurrentWord("");
    setFoundWords([]);
    setColoredCells([]);
    setLocked(false);
  };

  const showAnswers = () => {
    let allCells = [];
    const keys = Object.keys(correctPositions);

    keys.forEach((word) => {
      allCells.push(...correctPositions[word]);
    });

    setFoundWords(keys.map((_, i) => i));
    setColoredCells(allCells);
    setSelected([]);
    setCurrentWord("");
    setLocked(true);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall gap-2">
        <h5 className="header-title-page8">
          <span className="ex-A">C </span>What electronic item do we use to send e-mails?
        </h5>

        <div className="words-list-CB-unit3-p5-q4">
          {wordsToFind.map((word, i) => (
            <span
              key={i}
              className={`word-CB-unit3-p5-q4 ${
                foundWords.includes(i) ? "found-CB-unit3-p5-q4" : ""
              }`}
            >
              {word}
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
              value={displayedSentence.join(" ")}
              readOnly
              style={{ fontFamily: "monospace" }}
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
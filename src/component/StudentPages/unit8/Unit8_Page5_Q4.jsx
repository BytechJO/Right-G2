import React, { useState, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit8_Page5_Q4.css";
import img1 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 68/Ex C 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 68/Ex C 2.svg";

const Unit8_Page5_Q4 = () => {
  const grid = [
    "e","d","t","h","e","f","g","f","t","e","i","m","t","s","u","m","m","e","r","s",
    "u","e","e","i","x","n","b","n","s","s","e","e","v","a","c","a","t","i","o","n",
    "x","e","r","s","t","a","r","t","s","v","f","i","n","s","k","j","u","n","e","n",
    "b","g","f","s","k","r",
  ];

  const correctPositions = {
    the: [2, 3, 4],
    summer: [13, 14, 15, 16, 17, 18],
    vacation: [32, 33, 34, 35, 36, 37, 38, 39],
    starts: [43, 44, 45, 46, 47, 48],
    in: [51, 52],
    june: [55, 56, 57, 58],
  };

  const wordsToFind = ["the", "summer", "vacation", "starts", "in", "june"];

  const fullSentence = ["the", "summer", "vacation", "starts", "in", "june"];

  const letters = grid;

  const [locked, setLocked] = useState(false);
  const [selected, setSelected] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [foundWords, setFoundWords] = useState([]); // 🔥 index
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

  // 🔥 نفس Unit6 slots
  const displayedSentence = fullSentence.map((word, index) => {
    const isFound = foundWords.some(
      (i) => Object.keys(correctPositions)[i] === word
    );

    const SLOT_LENGTH = 12;

    if (isFound) {
      return word.padEnd(SLOT_LENGTH, "");
    }

    return "_".repeat(SLOT_LENGTH);
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
      <div className="div-forall">
        <h5 className="header-title-page8">
          <span className="ex-A">C </span>When does summer vacation start?
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
        <button onClick={showAnswers} className="show-answer-btn swal-continue">
          Show Answer
        </button>
        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit8_Page5_Q4;
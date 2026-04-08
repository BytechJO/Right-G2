import React, { useState, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit7_Page5_Q4.css";
import img1 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 62/Ex C 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 62/Ex C 2.svg";

const Unit7_Page5_Q4 = () => {
  const [locked, setLocked] = useState(false);

  const grid = [
    "o","u","p","i","l","o","t","s","i","v","a","l","t","w","p","d","f","r","s","k",
    "c","a","n","v","d","t","a","v","r","y","x","f","l","y","x","c","l","f","c","x",
    "v","c","s","x","t","e","b","t","x","z","a","i","r","p","l","a","n","e","s","x",
    "o","y",
  ];

  const letters = grid;

  const wordsToFind = ["pilots", "fly", "planes"];

  // 🔥 نفس فكرة Unit4 → object positions
  const correctPositions = {
    pilots: [2, 3, 4, 5, 6, 7],
    fly: [31, 32, 33],
    planes: [53, 54, 55, 56, 57, 58],
  };

  // 🔥 الجملة الكاملة
  const fullSentence = ["pilots", "fly", "planes"];

  const [selected, setSelected] = useState([]);
  const [foundWords, setFoundWords] = useState([]); // index
  const [coloredCells, setColoredCells] = useState([]);

  const handleClick = (letter, index) => {
    if (coloredCells.includes(index)) return;

    if (selected.includes(index)) {
      const cutIndex = selected.indexOf(index);
      setSelected(selected.slice(0, cutIndex));
      return;
    }

    // 🔥 نفس Unit4 → حركة متجاورة
    if (selected.length > 0) {
      const last = selected[selected.length - 1];
      if (Math.abs(last - index) !== 1) return;
    }

    setSelected((prev) => [...prev, index]);
  };

  // 🔥 نفس Unit4 → تشييك index فقط (بدون currentWord)
  useEffect(() => {
    const keys = Object.keys(correctPositions);

    const matchedIndex = keys.findIndex((word) => {
      const correctIdx = correctPositions[word];

      if (correctIdx.length !== selected.length) return false;

      for (let i = 0; i < correctIdx.length; i++) {
        if (correctIdx[i] !== selected[i]) return false;
      }

      return true;
    });

    if (matchedIndex !== -1 && !foundWords.includes(matchedIndex)) {
      setFoundWords((prev) => [...prev, matchedIndex]);
      setColoredCells((prev) => [...prev, ...selected]);
      setSelected([]);
    }
  }, [selected]);

  // 🔥 slots مثل Unit4
  const displayedSentence = fullSentence.map((word, index) => {
    const isFound = foundWords.some(
      (i) => Object.keys(correctPositions)[i] === word
    );

    const SLOT_LENGTH = 10;

    return isFound
      ? word.padEnd(SLOT_LENGTH, " ")
      : "_".repeat(SLOT_LENGTH);
  });

  const checkAnswers = () => {
    if (locked) return;

    const total = wordsToFind.length;
    const score = foundWords.length;

    if (score === 0) {
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
    setLocked(true);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "20px" }}>
        <h5 className="header-title-page8">
          <span className="ex-A">C </span>What do pilots do?
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

export default Unit7_Page5_Q4;
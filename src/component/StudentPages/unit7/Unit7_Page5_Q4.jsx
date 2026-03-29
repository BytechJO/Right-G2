
import React, { useState, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit7_Page5_Q4.css";

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

  // ✅ أماكن الكلمات (حسب الاندكس)
  const wordPositions = {
    pilots: [2, 3, 4, 5, 6, 7],
    fly: [31, 32, 33],
    planes: [ 53, 54, 55, 56, 57,58],
  };

  const [sentence, setSentence] = useState("");
  const [selected, setSelected] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [coloredCells, setColoredCells] = useState([]);

  const handleClick = (letter, index) => {
    if (coloredCells.includes(index)) return;

    if (selected.includes(index)) {
      const cutIndex = selected.indexOf(index);
      const newSelected = selected.slice(0, cutIndex);
      setSelected(newSelected);
      return;
    }

    // ✅ فقط حروف قريبة (يمين/يسار)
    if (selected.length > 0) {
      const last = selected[selected.length - 1];
      if (Math.abs(last - index) !== 1) return;
    }

    setSelected((prev) => [...prev, index]);
  };

  // ✅ التصحيح بالـ index
  useEffect(() => {
    const sortedSelected = [...selected].sort((a, b) => a - b);

    const foundWord = Object.keys(wordPositions).find((word) => {
      const positions = wordPositions[word];
      return JSON.stringify(positions) === JSON.stringify(sortedSelected);
    });

    if (foundWord && !foundWords.includes(foundWord)) {
      setFoundWords((prev) => [...prev, foundWord]);
      setColoredCells((prev) => [...prev, ...selected]);

      setSentence((prev) =>
        prev === "" ? foundWord : prev + " " + foundWord
      );

      setSelected([]);
    }
  }, [selected]);

  const checkAnswers = () => {
    if (locked) return;

    const total = wordsToFind.length;
    const score = foundWords.length;

    if (score === 0) {
      ValidationAlert.info(`
        <div style="font-size:20px;text-align:center;">
          <b>Find all the words first!</b><br/>
          <span style="color:#1d4f7b;font-weight:bold;">
            Score: ${score} / ${total}
          </span>
        </div>
      `);
      return;
    }

    const color =
      score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <b style="color:${color};">Score: ${score} / ${total}</b>
      </div>
    `;

    if (score === total) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);

    setLocked(true);
  };

  const reset = () => {
    setSelected([]);
    setFoundWords([]);
    setColoredCells([]);
    setSentence("");
    setLocked(false);
  };

  const showAnswers = () => {
    let allCells = [];

    Object.values(wordPositions).forEach((positions) => {
      allCells.push(...positions);
    });

    setFoundWords(wordsToFind);
    setColoredCells(allCells);
    setSelected([]);
    setSentence(wordsToFind.join(" "));
    setLocked(true);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "20px" }}>
        <h5 className="header-title-page8" style={{ marginBottom: "20px" }}>
          <span className="ex-A">C </span>What do pilots do?
        </h5>

        <div className="words-list-CB-unit3-p5-q4">
          {wordsToFind.map((word) => (
            <span
              key={word}
              className={`word-CB-unit3-p5-q4 ${
                foundWords.includes(word) ? "found-CB-unit3-p5-q4" : ""
              }`}
            >
              {word}
            </span>
          ))}
        </div>

        <div className="wordsearch-wrapper-CB-unit7-p5-q4">
          <div className="grid-CB-unit3-p5-q4">
            {letters.map((letter, index) => {
              const isSelected = selected.includes(index);
              const isFound = coloredCells.includes(index);

              return (
                <span
                  key={index}
                  className={`cell-CB-unit3-p5-q4 
                    ${isSelected ? "selected-CB-unit3-p5-q4" : ""}
                    ${isFound ? "found-cell-CB-unit3-p5-q4" : ""}
                  `}
                  onClick={() => handleClick(letter, index)}
                >
                  {letter}
                </span>
              );
            })}
          </div>

          <input
            className="answer-input-CB-unit3-p5-q4"
            value={sentence}
            readOnly
          />
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

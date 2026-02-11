import React, { useState, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Page8_Q4.css";

const Page8_Q4 = () => {
  const grid = [
  "d","t","h","e","y","t","a","d","g","b","n","m","v","g","l","i","k","e","x","n","s","r","o","l","t","o",
  "h","f","e","a","t","b","x","a","z","b","k","g","r","a","s","s","h","a","f","g","h","r","t","f","b","i",
  "p","m","o","l","k","i"
];

  const letters = grid; // نفس الـ array اللي عندك
  const wordsToFind = ["they", "like", "to", "eat","grass"];
  const [sentence, setSentence] = useState("");

  const [selected, setSelected] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [foundWords, setFoundWords] = useState([]);
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
    if (
      wordsToFind.includes(currentWord) &&
      !foundWords.includes(currentWord)
    ) {
      setFoundWords((prev) => [...prev, currentWord]);
      setColoredCells((prev) => [...prev, ...selected]);

      setSentence((prev) =>
        prev === "" ? currentWord : prev + " " + currentWord,
      );

      setSelected([]);
      setCurrentWord("");
    }
  }, [currentWord]);

  const checkAnswers = () => {
    const total = wordsToFind.length;
    const score = foundWords.length;

    if (foundWords.length === 0) {
      ValidationAlert.info(`
        <div style="font-size:20px;text-align:center;">
          <b>Find all the words first!</b><br/>
          <span style="color:#1d4f7b;font-weight:bold;">
            Current Score: ${score} / ${total}
          </span>
        </div>
      `);
      return;
    }

    if (score === 0) {
      ValidationAlert.error(`
        <div style="font-size:20px;text-align:center;">
          <b style="color:red;">Score: 0 / ${total}</b>
        </div>
      `);
    } else if (score < total) {
      ValidationAlert.warning(`
        <div style="font-size:20px;text-align:center;">
          <b style="color:orange;">Score: ${score} / ${total}</b>
        </div>
      `);
    } else {
      ValidationAlert.success(`
        <div style="font-size:20px;text-align:center;">
          <b style="color:green;">Score: ${score} / ${total}</b>
        </div>
      `);
    }
  };
  const reset = () => {
    setSelected([]);
    setCurrentWord("");
    setFoundWords([]);
    setColoredCells([]);
    setSentence(""); // 👈 مهم
  };

  const showAnswers = () => {
    let allCells = [];
    const fullString = letters.join("");

    wordsToFind.forEach((word) => {
      const startIndex = fullString.indexOf(word);

      if (startIndex !== -1) {
        for (let i = 0; i < word.length; i++) {
          allCells.push(startIndex + i);
        }
      }
    });

    setFoundWords(wordsToFind);
    setColoredCells(allCells);
    setSelected([]);
    setCurrentWord("");
    setSentence(wordsToFind.join(" "));
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      <div className="div-forall" style={{ width: "60%" }}>
        {/* ❌ الهيدر كما هو */}
        <h5 className="header-title-page8">
          <span className="ex-A">C</span>What do photographers use?
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

export default Page8_Q4;

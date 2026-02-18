import React, { useState, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit5_Page5_Q4.css";

const Unit5_Page5_Q4 = () => {
 const grid = [
  "s","n","q","i","b","e","e","s","r","e","n","m","k","j","u","t","e","u","s","e","o","r","i","t","e",
  "p","o","k","j","i","w","s","f","l","o","w","e","r","s","h","s","t","o","s","k","m","a","k","e","e",
  "x","h","o","n","e","y","a","t","p","l","k","o"
];

  const letters = grid; // نفس الـ array اللي عندك

  const wordsToFind = ["bees", "use", "flowers","to","make","honey"];
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
          <span className="ex-A">C</span>What do bees use to make honey?
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

export default Unit5_Page5_Q4;

import React, { useState, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit8_Page5_Q4.css";

const Unit8_Page5_Q4 = () => {
  const [locked, setLocked] = useState(false);
  const grid = [
    "e",
    "d",
    "t",
    "h",
    "e",
    "f",
    "g",
    "f",
    "t",
    "e",
    "i",
    "m",
    "t",
    "s",
    "u",
    "m",
    "m",
    "e",
    "r",
    "s",
    "u",
    "e",
    "e",
    "i",
    "x",
    "n",
    "b",
    "n",
    "s",
    "s",
    "e",
    "e",
    "v",
    "a",
    "c",
    "a",
    "t",
    "i",
    "o",
    "n",
    "x",
    "e",
    "r",
    "s",
    "t",
    "a",
    "r",
    "t",
    "s",
    "v",
    "f",
    "i",
    "n",
    "s",
    "k",
    "j",
    "u",
    "n",
    "e",
    "n",
    "b",
    "g",
    "f",
    "s",
    "k",
    "r",
  ];
  const letters = grid;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const wordsToFind = ["the", "summer", "vacation", "starts", "in", "june"];
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
  }, [currentWord, foundWords, selected, wordsToFind]);

  const checkAnswers = () => {
    if (locked) return;

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
    setSentence("");
    setLocked(false);
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
    setLocked(true);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      <div className="div-forall" style={{ width: "60%" }}>
        <h5 className="header-title-page8" style={{ marginBottom: "20px" }}>
          <span className="ex-A">C </span>When does summer vacation start?
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

export default Unit8_Page5_Q4;

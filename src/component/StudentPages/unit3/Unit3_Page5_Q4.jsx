import React, { useState, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit3_Page5_Q4.css";
import img1 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 26/Ex C 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 26/Ex C 2.svg";

const Unit3_Page5_Q4 = () => {
  const grid = [
    "w",
    "e",
    "y",
    "u",
    "t",
    "b",
    "w",
    "e",
    "a",
    "r",
    "e",
    "r",
    "l",
    "p",
    "l",
    "j",
    "a",
    "c",
    "k",
    "e",
    "t",
    "s",
    "i",
    "o",
    "h",
    "v",
    "n",
    "x",
    "h",
    "e",
    "a",
    "i",
    "n",
    "y",
    "o",
    "y",
    "c",
    "o",
    "l",
    "d",
    "t",
    "d",
    "t",
    "x",
    "d",
    "y",
    "r",
    "w",
    "e",
    "a",
    "t",
    "h",
    "e",
    "r",
    "p",
    "x",
    "y",
    "v",
    "t",
    "f",
    "o",
    "l",
  ];

  const letters = grid;

  const wordsToFind = ["we", "wear", "jackets", "in", "cold", "weather"];

  const correctAnswers = [
    { word: "we", indexes: [0, 1] },
    { word: "wear", indexes: [6, 7, 8, 9] },
    { word: "jackets", indexes: [15, 16, 17, 18, 19, 20, 21] },
    { word: "in", indexes: [31, 32] },
    { word: "cold", indexes: [36, 37, 38, 39] },
    { word: "weather", indexes: [47, 48, 49, 50, 51, 52, 53] },
  ];

  const [sentence, setSentence] = useState("");
  const [selected, setSelected] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [foundWords, setFoundWords] = useState([]);
  const [coloredCells, setColoredCells] = useState([]);
  const [locked, setLocked] = useState(false);
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
  }, [currentWord, selected, foundWords]);

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
    setLocked(true);

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

    correctAnswers.forEach((item) => {
      allCells.push(...item.indexes);
    });

    setFoundWords(correctAnswers.map((_, i) => i));
    setColoredCells(allCells);
    setSelected([]);
    setCurrentWord("");
    setLocked(true);
    setSentence(correctAnswers.map((w) => w.word).join(" "));
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      <div className="div-forall" style={{ width: "60%" }}>
        <h5 className="header-title-page8">
          <span className="ex-A">C</span>When do we wear jackets?
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

export default Unit3_Page5_Q4;

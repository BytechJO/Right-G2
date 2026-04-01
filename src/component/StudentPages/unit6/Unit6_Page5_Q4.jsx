import React, { useState, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit6_Page5_Q4.css";

import img2 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page50/Ex C 1.svg";
const Unit4_Page5_Q4 = () => {
  const grid = [
    "f",
    "t",
    "e",
    "r",
    "y",
    "u",
    "w",
    "e",
    "o",
    "b",
    "n",
    "x",
    "n",
    "m",
    "j",
    "h",
    "g",
    "o",
    "k",
    "n",
    "j",
    "l",
    "k",
    "m",
    "g",
    "t",
    "o",
    "s",
    "x",
    "d",
    "o",
    "b",
    "e",
    "d",
    "f",
    "o",
    "n",
    "g",
    "u",
    "a",
    "t",
    "v",
    "f",
    "m",
    "e",
    "i",
    "g",
    "h",
    "t",
    "i",
    "k",
    "e",
    "o",
    "c",
    "l",
    "o",
    "c",
    "k",
    "x",
  ];
  const correctPositions = {
    we: [6, 7],
    go: [16, 17],
    to: [25, 26],
    bed: [31, 32, 33],
    at: [39, 40],
    eight: [44, 45, 46, 47, 48],
    oclock: [52, 53, 54, 55, 56, 57],
  };
  const letters = grid; // نفس الـ array اللي عندك

  const wordsToFind = ["we", "go", "to", "bed", "at", "eight", "oclock"];
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
    const matchedWord = Object.keys(correctPositions).find((word) => {
      const correctIdx = correctPositions[word];

      return (
        word === currentWord &&
        correctIdx.length === selected.length &&
        correctIdx.every((idx, i) => idx === selected[i])
      );
    });

    if (matchedWord && !foundWords.includes(matchedWord)) {
      setFoundWords((prev) => [...prev, matchedWord]);
      setColoredCells((prev) => [...prev, ...selected]);

      setSentence((prev) =>
        prev === "" ? matchedWord : prev + " " + matchedWord,
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
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "20px" }}>
        <h5 className="header-title-page8">
          <span className="ex-A">C </span>When do we go to bed?
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
          <div className="flex">
            <input
              className="answer-input-CB-unit3-p5-q4"
              value={sentence}
              readOnly
            />
            <img src={img2} style={{ height: "80px", width: "80px" }} />
          </div>{" "}
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

export default Unit4_Page5_Q4;

import React, { useState, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit4_Page5_Q4.css";
import img1 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 32/Ex C 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 32/Ex C 2.svg";

const Unit4_Page5_Q4 = () => {
  const grid = [
    "w","x","t","h","e","o","s","d","t","p","h","o","t","o","g","r","a","p","h","e","r","s","x","d",
    "u","l","t","h","a","x","m","k","l","i","o","p","a","s","e","i","j","u","s","e","x","s","q","w",
    "z","f","h","c","a","m","e","r","a","s","x","s","y","p",
  ];

  const letters = grid;

  const wordsToFind = ["the", "photographers", "use", "cameras"];

  // ✅ الحل بالـ index
  const correctAnswers = [
    { word: "the", indexes: [2, 3, 4] },
    { word: "photographers", indexes: [9,10,11,12,13,14,15,16,17,18,19,20,21] },
    { word: "use", indexes: [41,42,43] },
    { word: "cameras", indexes: [50,51,52,53,54,55,56] },
  ];

  const [sentence, setSentence] = useState("");
  const [locked, setLocked] = useState(false);
  const [selected, setSelected] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [foundWords, setFoundWords] = useState([]); // ⬅️ indexes
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
        JSON.stringify(item.indexes) === JSON.stringify(selected)
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
    setLocked(false);
    setSentence("");
  };

  const showAnswers = () => {
    let allCells = [];

    correctAnswers.forEach((item) => {
      allCells.push(...item.indexes);
    });

    setFoundWords(correctAnswers.map((_, i) => i)); // ✅ مهم
    setColoredCells(allCells);
    setSelected([]);
    setCurrentWord("");
    setSentence(correctAnswers.map((w) => w.word).join(" "));
    setLocked(true);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      <div className="div-forall" style={{ width: "60%" }}>
        <h5 className="header-title-page8">
          <span className="ex-A">C</span>What do photographers use?
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

export default Unit4_Page5_Q4;
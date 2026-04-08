import React, { useState, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit6_Page5_Q4.css";
import img2 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page50/Ex C 1.svg";

const Unit6_Page5_Q4 = () => {
  const grid = [
    "f","t","e","r","y","u","w","e","o","b","n","x","n","m","j","h","g","o","k","n",
    "j","l","k","m","g","t","o","s","x","d","o","b","e","d","f","o","n","g","u","a",
    "t","v","f","m","e","i","g","h","t","i","k","e","o","c","l","o","c","k","x",
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

  const wordsToFind = ["we", "go", "to", "bed", "at", "eight", "oclock"];

  // 🔥 تعديل 1: الجملة الكاملة بالترتيب الصحيح
  const fullSentence = ["we", "go", "to", "bed", "at", "eight", "oclock"];

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

  // 🔥 لازم يكون نفس الطول
  if (correctIdx.length !== selected.length) return false;

  // 🔥 لازم كل index يكون مطابق 100%
  for (let i = 0; i < correctIdx.length; i++) {
    if (correctIdx[i] !== selected[i]) {
      return false;
    }
  }

  // 🔥 الكلمة نفسها لازم تطابق
  return word === currentWord;
});

    if (matchedIndex !== -1 && !foundWords.includes(matchedIndex)) {
      setFoundWords((prev) => [...prev, matchedIndex]);
      setColoredCells((prev) => [...prev, ...selected]);

      // 🔥 تعديل 2: حذفنا setSentence

      setSelected([]);
      setCurrentWord("");
    }
  }, [currentWord]);

  // 🔥 تعديل 3 (المهم جداً)
  const displayedSentence = fullSentence.map((word, index) => {
    const isFound = foundWords.some(
      (i) => Object.keys(correctPositions)[i] === word
    );

    const SLOT_LENGTH = 10;

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

    // 🔥 تعديل 4: ما في setSentence
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "20px" }}>
        <h5 className="header-title-page8">
          <span className="ex-A">C </span>When do we go to bed?
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
            {/* 🔥 تعديل 5: عرض الجملة بالـ slots */}
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

export default Unit6_Page5_Q4;
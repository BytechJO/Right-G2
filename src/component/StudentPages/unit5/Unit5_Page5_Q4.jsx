import React, { useState, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit5_Page5_Q4.css";
import img1 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 44/Ex C 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 44/Ex C 2.svg";

const Unit5_Page5_Q4 = () => {
  const grid = [
    "s",
    "n",
    "q",
    "i",
    "b",
    "e",
    "e",
    "s",
    "r",
    "e",
    "n",
    "m",
    "k",
    "j",
    "u",
    "t",
    "e",
    "u",
    "s",
    "e",
    "o",
    "r",
    "i",
    "t",
    "e",
    "p",
    "o",
    "k",
    "j",
    "i",
    "w",
    "s",
    "f",
    "l",
    "o",
    "w",
    "e",
    "r",
    "s",
    "h",
    "s",
    "t",
    "o",
    "s",
    "k",
    "m",
    "a",
    "k",
    "e",
    "e",
    "x",
    "h",
    "o",
    "n",
    "e",
    "y",
    "a",
    "t",
    "p",
    "l",
    "k",
    "o",
  ];

  const letters = grid;

  const wordsToFind = ["bees", "use", "flowers", "to", "make", "honey"];

  // 🔥 تعديل 1: الجملة الكاملة بالترتيب الصحيح
  const fullSentence = ["bees", "use", "flowers", "to", "make", "honey"];
  // 🔥 تعديل 1: أضفنا order
  const correctAnswers = [
    { word: "bees", indexes: [4, 5, 6, 7], order: 0 },
    { word: "use", indexes: [17, 18, 19], order: 1 },
    { word: "flowers", indexes: [32,33, 34, 35, 36, 37, 38], order: 2 },
    { word: "to", indexes: [41, 42], order: 3 },
    { word: "make", indexes: [45,46, 47, 48], order: 4 },
    { word: "honey", indexes: [51,52, 53, 54, 55], order: 5 },
  ];

  const [locked, setLocked] = useState(false);
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
    const matchedIndex = correctAnswers.findIndex(
      (item) =>
        item.word === currentWord &&
        JSON.stringify(item.indexes) === JSON.stringify(selected),
    );

    if (matchedIndex !== -1 && !foundWords.includes(matchedIndex)) {
      setFoundWords((prev) => [...prev, matchedIndex]);
      setColoredCells((prev) => [...prev, ...selected]);

      // 🔥 تعديل 3: حذفنا setSentence

      setSelected([]);
      setCurrentWord("");
    }
  }, [currentWord]);

  // 🔥 تعديل 4 (المهم)
  const displayedSentence = fullSentence.map((word, index) => {
    const isFound = foundWords.some((i) => correctAnswers[i].order === index);

    const SLOT_LENGTH = 14; // أكبر لأنه في كلمة طويلة (photographers)

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

    correctAnswers.forEach((item) => {
      allCells.push(...item.indexes);
    });

    setFoundWords(correctAnswers.map((_, i) => i));
    setColoredCells(allCells);
    setSelected([]);
    setCurrentWord("");
    setLocked(true);

    // 🔥 تعديل 5: حذفنا setSentence
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      <div className="div-forall" style={{ width: "60%" }}>
        <h5 className="header-title-page8">
          <span className="ex-A">C</span>What do bees use to make honey?
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

            {/* 🔥 تعديل 6: عرض الجملة بالـ slots */}
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

export default Unit5_Page5_Q4;

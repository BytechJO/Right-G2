import React, { useState, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 14/Ex C 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 14/Ex C 2.svg";

const Unit2_Page5_Q3 = () => {
  const grid = [
    "x","t","h","e","x","y","s","b","i","r","d","s","x","e","r","f","l","y","q","n",
    "m","i","z","o","p","i","n","m","k","i","l","o","p","x","e","f","t","h","e","i",
    "c","k","m","k","m","k","l","o","a","b","f","n","d","s","s","b","v","r","w","s",
    "k","y","c","s","j",
  ];

  const letters = grid;

  const wordsToFind = ["the", "birds", "fly", "in", "the", "sky"];

  // 🔥 تعديل 1: أضفنا order عشان نحدد مكان كل كلمة بالجملة
  const correctAnswers = [
    { word: "the", indexes: [1, 2, 3], order: 0 },
    { word: "birds", indexes: [7, 8, 9, 10, 11], order: 1 },
    { word: "fly", indexes: [15, 16, 17], order: 2 },
    { word: "in", indexes: [25, 26], order: 3 },
    { word: "the", indexes: [36, 37, 38], order: 4 },
    { word: "sky", indexes: [59,60,61], order: 5 },
  ];

  // 🔥 تعديل 2: الجملة الكاملة (بدل sentence state)
  const fullSentence = ["the", "birds", "fly", "in", "the", "sky"];

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
        JSON.stringify(item.indexes) === JSON.stringify(selected)
    );

    if (matchedIndex !== -1 && !foundWords.includes(matchedIndex)) {
      setFoundWords((prev) => [...prev, matchedIndex]);
      setColoredCells((prev) => [...prev, ...selected]);

      // 🔥 تعديل 3: حذفنا setSentence
      setSelected([]);
      setCurrentWord("");
    }
  }, [currentWord]);

  // 🔥 تعديل 4 (أهم شي): بناء الجملة بالـ slots
  const displayedSentence = fullSentence.map((word, index) => {
    const isFound = foundWords.some(
      (i) => correctAnswers[i].order === index
    );

    const SLOT_LENGTH = 8; // طول ثابت لكل كلمة

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

    // 🔥 تعديل 5: ما في setSentence
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

            {/* 🔥 تعديل 6: استخدمنا displayedSentence بدل sentence */}
            <input
              className="answer-input-CB-unit3-p5-q4"
              value={displayedSentence.join(" ")}
              readOnly
              style={{ fontFamily: "monospace" }} // مهم عشان يصطف صح
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

export default Unit2_Page5_Q3;
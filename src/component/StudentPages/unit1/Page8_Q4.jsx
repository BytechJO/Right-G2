import React, { useState, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Page8_Q4.css";
import img1 from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex C 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex C 2.svg";

const Page8_Q4 = () => {
  const grid = [
    "d",
    "t",
    "h",
    "e",
    "y",
    "t",
    "a",
    "d",
    "g",
    "b",
    "n",
    "m",
    "v",
    "g",
    "l",
    "i",
    "k",
    "e",
    "x",
    "n",
    "s",
    "r",
    "o",
    "l",
    "t",
    "o",
    "h",
    "f",
    "e",
    "a",
    "t",
    "b",
    "x",
    "a",
    "z",
    "b",
    "k",
    "g",
    "r",
    "a",
    "s",
    "s",
    "h",
    "a",
    "f",
    "g",
    "h",
    "r",
    "t",
    "f",
    "b",
    "i",
    "p",
    "m",
    "o",
    "l",
    "k",
    "i",
  ];

  const letters = grid;

  const wordsToFind = ["they", "like", "to", "eat", "grass"];

  // 🔥 تعديل 1: أضفنا order لكل كلمة عشان نعرف مكانها بالجملة
  const correctAnswers = [
    { word: "they", indexes: [1, 2, 3, 4], order: 0 },
    { word: "like", indexes: [14, 15, 16, 17], order: 1 },
    { word: "to", indexes: [24, 25], order: 2 },
    { word: "eat", indexes: [28, 29, 30], order: 3 },
    { word: "grass", indexes: [37, 38, 39, 40, 41], order: 4 },
  ];

  // 🔥 تعديل 2: عرفنا الجملة الكاملة بدل ما نبنيها ديناميك
  const fullSentence = ["they", "like", "to", "eat", "grass"];

  const [selected, setSelected] = useState([]);
  const [locked, setLocked] = useState(false);
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

      // 🔥 تعديل 3: حذفنا setSentence بالكامل (ما عاد نستخدم sentence state)

      setSelected([]);
      setCurrentWord("");
    }
  }, [currentWord]);

  // 🔥 تعديل 4 (أهم جزء):
  // هون بنبني الجملة المخفية / المنكشفة حسب الكلمات اللي انوجدت
  const displayedSentence = fullSentence.map((word, index) => {
    const isFound = foundWords.some((i) => correctAnswers[i].order === index);

    const SLOT_LENGTH = 8; // 🔥 طول ثابت لكل كلمة

    if (isFound) {
      return word.padEnd(SLOT_LENGTH, "");
    }

    return "_".repeat(SLOT_LENGTH);
  });

  const checkAnswers = () => {
    if (locked) return;

    const total = wordsToFind.length;
    const score = foundWords.length;

    if (score === 0) {
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

    // 🔥 تعديل 5: حذفنا setSentence هون كمان
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

          <div className="flex justify-center items-center">
            <img src={img1} style={{ height: "90px", width: "90px" }} />

            {/* 🔥 تعديل 6: بدل sentence استخدمنا displayedSentence */}
            <input
              className="answer-input-CB-unit3-p5-q4"
              value={displayedSentence.join(" ")}
              readOnly
              style={{ fontFamily: "monospace" }} // 🔥 مهم جدا
            />
            <img src={img2} style={{ height: "90px", width: "90px" }} />
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

export default Page8_Q4;

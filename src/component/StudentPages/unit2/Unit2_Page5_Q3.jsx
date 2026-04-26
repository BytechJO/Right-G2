import React, { useState, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 14/Ex C 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 14/Ex C 2.svg";
import Button from "../../WorkBookPages/Button";
const Unit2_Page5_Q3 = () => {
  const grid = [
    [
      "x",
      "t",
      "h",
      "e",
      "x",
      "y",
      "s",
      "b",
      "i",
      "r",
      "d",
      "s",
      "x",
      "e",
      "r",
      "f",
      "l",
      "y",
      "q",
      "n",
      "m",
      "i",
      "z",
      "o",
      "p",
    ],

    [
      "i",
      "n",
      "m",
      "k",
      "i",
      "l",
      "o",
      "p",
      "x",
      "e",
      "f",
      "t",
      "h",
      "e",
      "i",
      "c",
      "k",
      "m",
      "k",
      "m",
      "k",
      "l",
      "o",
      "a",
      "b",
    ],
    ["f", "n", "d", "s", "s", "b", "v", "r", "w", "s", "k", "y", "c", "s", "j"],
  ];

  const letters = grid;
  const wordsToFind = [
    { id: "the1", word: "the" },
    { id: "birds", word: "birds" },
    { id: "fly", word: "fly" },
    { id: "in", word: "in" },
    { id: "the2", word: "the" },
    { id: "sky", word: "sky" },
  ];
  const correctPositions = {
    the1: [1, 2, 3],
    birds: [7, 8, 9, 10, 11],
    fly: [15, 16, 17],
    in: [100 + 0, 100 + 1],
    the2: [100 + 11, 100 + 12, 100 + 13],
    sky: [200 + 9, 200 + 10, 200 + 11],
  };
  const correctAnswers = [
    { word: "the1", order: 0 },
    { word: "birds", order: 1 },
    { word: "fly", order: 2 },
    { word: "in", order: 3 },
    { word: "the2", order: 4 },
    { word: "sky", order: 5 },
  ];
  const fullSentence = ["the", "birds", "fly", "in", "the", "sky"];
  const [locked, setLocked] = useState(false);
  const [sentence, setSentence] = useState("");
  const [selected, setSelected] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [foundWords, setFoundWords] = useState([]);
  const [coloredCells, setColoredCells] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (index) => {
    if (locked) return;

    const row = Math.floor(index / 100);
    const col = index % 100;

    setIsDragging(true);
    setSelected([index]);
    setCurrentWord(letters[row][col]);
  };
  const handleMouseEnter = (index) => {
    if (!isDragging || locked) return;

    const lastIndex = selected[selected.length - 1];

    if (index === lastIndex + 1 || index === lastIndex - 1) {
      if (!selected.includes(index)) {
        const row = Math.floor(index / 100);
        const col = index % 100;

        setSelected((prev) => [...prev, index]);
        setCurrentWord((prev) => prev + letters[row][col]);
      }
    }
  };
  const displayedSentence = fullSentence.map((word, index) => {
    const isFound = foundWords.some(
      (foundWord) =>
        correctAnswers.find((c) => c.word === foundWord)?.order === index,
    );

    const SLOT_LENGTH = 8;

    if (isFound) {
      return word.padEnd(SLOT_LENGTH, "");
    }

    return "_".repeat(SLOT_LENGTH);
  });
  const handleTouchMove = (e) => {
    if (!isDragging || locked) return;
    e.preventDefault(); // منع التمرير في الصفحة أثناء السحب

    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!element) return;

    const index = element.getAttribute("data-index");
    if (index !== null) {
      handleMouseEnter(Number(index));
    }
  };

  const handleMouseUp = () => {
    if (locked) return;
    setIsDragging(false);

    const reversedWord = currentWord.split("").reverse().join("");

    const matchedWord = wordsToFind.find(
      (item) =>
        (item.word === currentWord || item.word === reversedWord) &&
        !foundWords.includes(item.id),
    );

    if (matchedWord && !foundWords.includes(matchedWord.id)) {
      setFoundWords((prev) => [...prev, matchedWord.id]);
      setColoredCells((prev) => [...prev, ...selected]);
      setSentence(
        wordsToFind
          .filter((item) => [...foundWords, matchedWord.id].includes(item.id))
          .map((item) => item.word)
          .join(" "),
      );
    }

    setSelected([]);
    setCurrentWord("");
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
    wordsToFind.forEach((item) => {
      if (correctPositions[item.id]) {
        allCells.push(...correctPositions[item.id]);
      }
    });
    setFoundWords(wordsToFind.map((item) => item.id));
    setColoredCells(allCells);
    setSelected([]);
    setCurrentWord("");
    setSentence(wordsToFind.map((item) => item.word).join(" "));
    setLocked(true);
  };

  const checkAnswers = () => {
    if (locked) return;
    const total = wordsToFind.length;
    const score = foundWords.length;

    if (score === 0) {
      ValidationAlert.info();
      return;
    }

    if (score < total) {
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
    setLocked(true);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "30px",

        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div className="div-forall">
        <h5 className="header-title-page8 pb-2.5">
          <span className="ex-A" style={{ marginRight: "10px" }}>
            C
          </span>
         What do photographers use?
        </h5>

        {/* Words List
        <div className="flex flex-wrap justify-center gap-3 mb-5 border-2 border-dashed border-gray-300 rounded-[14px] p-3">
          {wordsToFind.map((item) => (
            <span
              key={item.id}
              className={`px-3 py-1.5 rounded-[10px] border-2 border-blue-800 ${
                foundWords.includes(item.id)
                  ? "bg-[#2c5287] text-white"
                  : "bg-white text-black"
              }`}
            >
              {item.word}
            </span>
          ))}
        </div> */}

        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          {/* Grid Wrapper */}
          <div
            className="px-4 pt-4 pb-5"
            style={{ width: "fit-content", margin: "0 auto" }}
          >
            <div
              className="bg-[#daf5ff] rounded-[15px] p-2 sm:p-[15px] mb-10"
              style={{
                userSelect: "none",
                width: "max-content",
                touchAction: "none", // 🔥 الحل السحري لمنع تحريك الصفحة أثناء السحب على الآيباد
                WebkitOverflowScrolling: "touch",
              }}
            >
              {letters.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  style={{
                    display: "flex",
                    gap: "clamp(1px, 0.3vw, 4px)", // مسافة تتغير حسب الشاشة
                    width: "fit-content",
                  }}
                >
                  {row.map((letter, colIndex) => {
                    const index = rowIndex * 100 + colIndex;
                    const isSelected = selected.includes(index);
                    const isFound = coloredCells.includes(index);

                    return (
                      <span
                        key={index}
                        data-index={index}
                        onMouseDown={() => handleMouseDown(index)}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseUp={handleMouseUp}
                        onDragStart={(e) => e.preventDefault()}
                        onTouchStart={(e) => {
                          e.preventDefault(); // 🔥 منع تحريك الصفحة عند بدء اللمس
                          handleMouseDown(index);
                        }}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleMouseUp}
                        className={`
                          flex items-center justify-center
                          cursor-pointer
                          transition
                          ${isSelected ? "bg-[#ffd54f] rounded-sm" : ""}
                          ${isFound ? "bg-[#4caf50] text-white rounded-sm" : ""}
                        `}
                        style={{
                          width: "clamp(16px, 2.5vw, 25px)", // 🔥 عرض ديناميكي
                          height: "clamp(22px, 3.5vw, 35px)", // 🔥 طول ديناميكي
                          fontSize: "clamp(12px, 1.8vw, 18px)", // 🔥 حجم خط ديناميكي
                        }}
                      >
                        {letter}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>

            <div
             className="flex justify-center items-center"
            >
              <img
                src={img1}
                alt="start"
                style={{
                  width: "clamp(40px, 10vw, 100px)", // 🔥 حجم ديناميكي للصور
                  height: "auto",
                }}
              />

             <input
                className="answer-input-CB-unit3-p5-q4"
                value={displayedSentence.join(" ")}
                readOnly
                style={{ fontFamily: "monospace" }} // 🔥 مهم جدا
              />

              <img
                src={img2}
                alt="end"
                style={{
                  width: "clamp(40px, 10vw, 100px)", // 🔥 حجم ديناميكي للصور
                  height: "auto",
                }}
              />
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <Button
          handleShowAnswer={showAnswers}
          handleStartAgain={reset}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
};

export default Unit2_Page5_Q3;

import React, { useState, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit6_Page5_Q4.css";
import img2 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page50/Ex C 1.svg";
import Button from "../../WorkBookPages/Button";

const Unit1_Page5_Q4 = () => {
  const grid = [
    [
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
    ],

    [
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
    ],
    ["k", "e", "o", "c", "l", "o", "c", "k", "x"],
  ];

  const correctAnswers = [
    { word: "we", order: 0 },
    { word: "go", order: 1 },
    { word: "to", order: 2 },
    { word: "bed", order: 3 },
    { word: "at", order: 4 },
    { word: "eight", order: 5 },
    { word: "oclock", order: 6 },
  ];

  const correctPositions = {
    we: [6, 7],
    go: [16, 17],
    to: [100 + 0, 100 + 1],
    bed: [100 + 6, 100 + 7, 100 + 8],
    at: [100 + 14, 100 + 15],
    eight: [100 + 19, 100 + 20, 100 + 21, 100 + 22, 100 + 23],
    oclock: [200 + 2, 200 + 3, 200 + 4, 200 + 5, 200 + 6, 200 + 7],
  };

  const wordsToFind = ["we", "go", "to", "bed", "at", "eight", "oclock"];
  // 🔥 تعديل 1: الجملة الكاملة بالترتيب الصحيح
  const fullSentence = ["we", "go", "to", "bed", "at", "eight", "oclock"];
  const letters = grid;

  const [locked, setLocked] = useState(false);
  const [sentence, setSentence] = useState("");
  const [selected, setSelected] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [coloredCells, setColoredCells] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (index) => {
    if (locked) return;
    setIsDragging(true);
    setSelected([index]);
  };
  const handleMouseEnter = (index) => {
    if (!isDragging || locked) return;

    const lastIndex = selected[selected.length - 1];

    if (index === lastIndex + 1 || index === lastIndex - 1) {
      if (!selected.includes(index)) {
        setSelected((prev) => [...prev, index]);
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

    const matchedWord = wordsToFind.find((word) => {
      const positions = correctPositions[word];
      if (!positions) return false;

      // تحقق نفس الترتيب
      const isSame =
        positions.length === selected.length &&
        positions.every((pos, i) => pos === selected[i]);

      // تحقق بالعكس (reverse)
      const isReverse =
        positions.length === selected.length &&
        positions
          .slice()
          .reverse()
          .every((pos, i) => pos === selected[i]);

      return isSame || isReverse;
    });
    if (matchedWord && !foundWords.includes(matchedWord)) {
      setFoundWords((prev) => [...prev, matchedWord]);
      setColoredCells((prev) => [...prev, ...selected]);
      setSentence(
        wordsToFind
          .filter((word) => [...foundWords, matchedWord].includes(word))
          .join(" "),
      );
    }

    setSelected([]);
  };

  const reset = () => {
    setSelected([]);
    setFoundWords([]);
    setColoredCells([]);
    setSentence("");
    setLocked(false);
  };

  const showAnswers = () => {
    let allCells = [];
    wordsToFind.forEach((word) => {
      if (correctPositions[word]) {
        allCells.push(...correctPositions[word]);
      }
    });
    setFoundWords(wordsToFind);
    setColoredCells(allCells);
    setSelected([]);
    setSentence(wordsToFind.join(" "));
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
          When do we go to bed?
        </h5>

        {/* Words List */}
        {/* <div className="flex flex-wrap justify-center gap-3 mb-5 border-2 border-dashed border-gray-300 rounded-[14px] p-3">
          {wordsToFind.map((word) => (
            <span
              key={word}
              className={`px-3 py-1.5 rounded-[10px] border-2 border-[#2c5287] font-semibold transition duration-200 ${
                foundWords.includes(word)
                  ? "bg-[#2c5287] text-white border-[#2c5287]"
                  : "bg-white text-black"
              }`}
              style={{ fontSize: "clamp(12px, 2vw, 15px)" }}
            >
              {word}
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
              className="bg-[#daf5ff] mb-10 rounded-[15px] p-2 sm:p-[15px]"
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
                          flex items-center justify-center mb-2
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

            <div className="flex justify-center items-center">
            

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

export default Unit1_Page5_Q4;

import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

const wordsData = [
  {
    word: "boat",
    correct: true,
    top: "20px",
    left: "40px",
    color: "text-blue-500",
    rotate: "-rotate-12",
  },
  {
    word: "note",
    correct: true,
    top: "20px",
    left: "160px",
    color: "text-green-500",
    rotate: "rotate-6",
  },
  {
    word: "slow",
    correct: true,
    top: "20px",
    left: "280px",
    color: "text-red-500",
    rotate: "rotate-3",
  },
  {
    word: "green",
    correct: false,
    top: "20px",
    left: "400px",
    color: "text-purple-500",
    rotate: "-rotate-6",
  },
  {
    word: "name",
    correct: false,
    top: "20px",
    left: "520px",
    color: "text-blue-500",
    rotate: "rotate-2",
  },

  {
    word: "window",
    correct: true,
    top: "100px",
    left: "60px",
    color: "text-yellow-500",
    rotate: "-rotate-12",
  },
  {
    word: "home",
    correct: true,
    top: "110px",
    left: "300px",
    color: "text-orange-500",
    rotate: "rotate-6",
  },
  {
    word: "coat",
    correct: true,
    top: "100px",
    left: "500px",
    color: "text-green-500",
    rotate: "rotate-2",
  },

  {
    word: "goat",
    correct: true,
    top: "180px",
    left: "40px",
    color: "text-red-500",
    rotate: "-rotate-12",
  },
  {
    word: "snow",
    correct: true,
    top: "180px",
    left: "200px",
    color: "text-purple-500",
    rotate: "rotate-2",
  },
  {
    word: "kite",
    correct: false,
    top: "180px",
    left: "330px",
    color: "text-green-500",
    rotate: "-rotate-6",
  },
  {
    word: "yellow",
    correct: true,
    top: "180px",
    left: "450px",
    color: "text-blue-500",
    rotate: "rotate-6",
  },
  {
    word: "nine",
    correct: false,
    top: "180px",
    left: "580px",
    color: "text-yellow-500",
    rotate: "-rotate-3",
  },

  {
    word: "cop",
    correct: false,
    top: "260px",
    left: "80px",
    color: "text-blue-500",
    rotate: "-rotate-6",
  },
  {
    word: "shop",
    correct: false,
    top: "260px",
    left: "240px",
    color: "text-red-500",
    rotate: "rotate-6",
  },
  {
    word: "rope",
    correct: true,
    top: "260px",
    left: "360px",
    color: "text-yellow-500",
    rotate: "-rotate-12",
  },
  {
    word: "slope",
    correct: true,
    top: "260px",
    left: "500px",
    color: "text-purple-500",
    rotate: "rotate-3",
  },

  {
    word: "bot",
    correct: false,
    top: "340px",
    left: "60px",
    color: "text-purple-500",
    rotate: "-rotate-12",
  },
  {
    word: "five",
    correct: false,
    top: "360px",
    left: "200px",
    color: "text-green-500",
    rotate: "rotate-6",
  },
  {
    word: "sleep",
    correct: false,
    top: "360px",
    left: "320px",
    color: "text-blue-500",
    rotate: "-rotate-6",
  },
  {
    word: "row",
    correct: true,
    top: "360px",
    left: "450px",
    color: "text-red-500",
    rotate: "rotate-6",
  },
  {
    word: "cone",
    correct: true,
    top: "360px",
    left: "550px",
    color: "text-yellow-500",
    rotate: "rotate-3",
  },

  {
    word: "clip",
    correct: false,
    top: "420px",
    left: "60px",
    color: "text-red-500",
    rotate: "-rotate-3",
  },
];

const Review7_Page2_Q2 = () => {
  const [selected, setSelected] = useState([]);
  const [locked, setLocked] = useState(false);

  const toggleWord = (word) => {
    if (locked) return;

    setSelected((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word],
    );
  };

  const checkAnswers = () => {
    if (locked) return;
    if (selected.length === 0) {
      ValidationAlert.info("Please select at least one word.");
      return;
    }
    let correctCount = wordsData.filter((w) => w.correct).length;
    let userCorrect = selected.filter((w) =>
      wordsData.find((item) => item.word === w && item.correct),
    ).length;

    const color =
      userCorrect === correctCount
        ? "green"
        : userCorrect === 0
          ? "red"
          : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
        ${userCorrect} / ${correctCount}
        </span>
      </div>
    `;

    if (userCorrect === correctCount) ValidationAlert.success(msg);
    else if (userCorrect === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);

    setLocked(true);
  };

  const showAnswers = () => {
    const correctWords = wordsData.filter((w) => w.correct).map((w) => w.word);

    setSelected(correctWords);
    setLocked(true);
  };

  const resetAll = () => {
    setSelected([]);
    setLocked(false);
  };

  return (
    <div className="flex justify-center p-8">
      <div className="w-[80%]">
        {/* Title */}
        <h5 className="header-title-page8" style={{ marginBottom: "20px" }}>
          <span  style={{ marginRight: "20px" }}>
            E
          </span>
          Circle and count the<span style={{ color: "#2e3192" }}>long o</span>
          words.
        </h5>
        <div className="flex gap-10">
          {/* LEFT BOX */}
          <div className="bg-[#F9E5DC] rounded-3xl w-[650px] h-[500px] relative p-6">
            {wordsData.map((item, i) => (
              <span
                key={i}
                onClick={() => toggleWord(item.word)}
                className={`
        absolute cursor-pointer text-lg font-medium
        ${item.color}
        ${item.rotate}
        ${
          selected.includes(item.word)
            ? "border-2 border-red-500 rounded-full px-2 py-1"
            : ""
        }
      `}
                style={{
                  top: item.top,
                  left: item.left,
                }}
              >
                {item.word}
              </span>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col justify-center gap-6">
            <p className="text-lg">
              How many <span className="text-blue-700">long o</span> words?
            </p>

            <div className="w-[200px] border-b-2 border-gray-400 text-center text-2xl">
              <span className="text-red-500 font-bold">{selected.length}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="action-buttons-container">
          <button onClick={resetAll} className="try-again-button">
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
    </div>
  );
};

export default Review7_Page2_Q2;

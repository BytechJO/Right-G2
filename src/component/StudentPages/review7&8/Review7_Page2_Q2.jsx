import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

const wordsData = [
  { word: "boat", correct: true, top: "5%", left: "6%", color: "text-blue-500", rotate: "-rotate-12" },
  { word: "note", correct: true, top: "5%", left: "24.6%", color: "text-green-500", rotate: "rotate-6" },
  { word: "slow", correct: true, top: "5%", left: "43%", color: "text-red-500", rotate: "rotate-3" },
  { word: "green", correct: false, top: "5%", left: "61.5%", color: "text-purple-500", rotate: "-rotate-6" },
  { word: "name", correct: false, top: "5%", left: "80%", color: "text-blue-500", rotate: "rotate-2" },

  { word: "window", correct: true, top: "25%", left: "9.2%", color: "text-yellow-500", rotate: "-rotate-12" },
  { word: "home", correct: true, top: "27.5%", left: "46%", color: "text-orange-500", rotate: "rotate-6" },
  { word: "coat", correct: true, top: "25%", left: "77%", color: "text-green-500", rotate: "rotate-2" },

  { word: "goat", correct: true, top: "45%", left: "6%", color: "text-red-500", rotate: "-rotate-12" },
  { word: "snow", correct: true, top: "45%", left: "30.7%", color: "text-purple-500", rotate: "rotate-2" },
  { word: "kite", correct: false, top: "45%", left: "50.7%", color: "text-green-500", rotate: "-rotate-6" },
  { word: "yellow", correct: true, top: "45%", left: "69.2%", color: "text-blue-500", rotate: "rotate-6" },
  { word: "nine", correct: false, top: "45%", left: "89.2%", color: "text-yellow-500", rotate: "-rotate-3" },

  { word: "cop", correct: false, top: "60%", left: "12.3%", color: "text-blue-500", rotate: "-rotate-6" },
  { word: "shop", correct: false, top: "65%", left: "36.9%", color: "text-red-500", rotate: "rotate-6" },
  { word: "rope", correct: true, top: "65%", left: "55.3%", color: "text-yellow-500", rotate: "-rotate-12" },
  { word: "slope", correct: true, top: "65%", left: "77%", color: "text-purple-500", rotate: "rotate-3" },

  { word: "bot", correct: false, top: "80%", left: "9.2%", color: "text-purple-500", rotate: "-rotate-12" },
  { word: "five", correct: false, top: "90%", left: "30.7%", color: "text-green-500", rotate: "rotate-6" },
  { word: "sleep", correct: false, top: "90%", left: "49.2%", color: "text-blue-500", rotate: "-rotate-6" },
  { word: "row", correct: true, top: "90%", left: "69.2%", color: "text-red-500", rotate: "rotate-6" },
  { word: "cone", correct: true, top: "85%", left: "84.6%", color: "text-yellow-500", rotate: "rotate-3" },

  { word: "clip", correct: false, top: "90%", left: "16%", color: "text-red-500", rotate: "-rotate-3" },
];

const Review7_Page2_Q2 = () => {
  const [selected, setSelected] = useState([]);
  const [locked, setLocked] = useState(false);

 const MAX_SELECTION = 13;

const toggleWord = (word) => {
  if (locked) return;

  setSelected((prev) => {
    // إذا الكلمة موجودة → احذفها (عادي)
    if (prev.includes(word)) {
      return prev.filter((w) => w !== word);
    }

    // ❌ إذا وصل الحد 13 → لا تضيف
    if (prev.length >= MAX_SELECTION) {

      return prev;
    }

    // ✅ إضافة الكلمة
    return [...prev, word];
  });
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
        Score: ${userCorrect} / ${correctCount}
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
    <div className="main-container-component">
      <div className="div-forall">
        {/* Title */}
        <h5 className="header-title-page8" >
          <span style={{ marginRight: "20px" }}>E</span>
          Circle and count the<span style={{ color: "#2e3192" }}>long o</span>
          words.
        </h5>
        <div className="flex justify-center items-center gap-10 mb-10 flex-wrap">
          {/* LEFT BOX */}
          <div className="bg-[#F9E5DC] rounded-3xl w-[600px] h-[400px] relative p-6">
            {wordsData.map((item, i) => {
              const isWrong =
                locked && selected.includes(item.word) && !item.correct;
              return (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    top: item.top,
                    left: item.left,
                  }}
                >
                  <span
                    onClick={() => toggleWord(item.word)}
                    className={`
      relative cursor-pointer text-lg font-medium
      ${item.color}
      ${item.rotate}
      ${
        selected.includes(item.word)
          ? "border-2 border-red-500 rounded-full px-2 py-1"
          : ""
      }
    `}
                  >
                    {item.word}

                    {/* ❌ WRONG ICON */}
                    {isWrong && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow border-2 border-white">
                        ✕
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
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

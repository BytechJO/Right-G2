// ExerciseC.jsx

import { useState } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img from "../../../assets/imgs/test6.png";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex C 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex C 2.svg";

const wordBank = [
  "bee",
  "leaf",
  "sheep",
  "sleep",
  "tree",
  "meat",
  "beach",
  "read",
];

const correctAnswers = {
  feet: ["bee", "sheep", "sleep", "tree"],
  beak: ["leaf", "meat", "beach", "read"],
};

export default function WB_Unit5_Page32_Q3() {
  const [columns, setColumns] = useState({ feet: [], beak: [] });
  // const [remaining, setRemaining] = useState([...wordBank]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [draggedWord, setDraggedWord] = useState(null);
  const [dragSource, setDragSource] = useState(null);

  const addWordToColumn = (col, word) => {
    if (showResult) return;
    if (!word) return;

    setColumns((prev) => {
      if (prev[col].includes(word)) return prev;
      return {
        ...prev,
        [col]: [...prev[col], word],
      };
    });
  };

  const moveWordBetweenColumns = (fromCol, toCol, word) => {
    if (showResult) return;
    if (!word || fromCol === toCol) return;

    setColumns((prev) => {
      if (prev[toCol].includes(word)) return prev;

      return {
        ...prev,
        [fromCol]: prev[fromCol].filter((w) => w !== word),
        [toCol]: [...prev[toCol], word],
      };
    });
  };

  const returnWordToBank = (fromCol, word) => {
    if (showResult) return;
    if (!word) return;

    setColumns((prev) => ({
      ...prev,
      [fromCol]: prev[fromCol].filter((w) => w !== word),
    }));
  };

  const handleDragStart = (word, source) => {
    if (showResult) return;
    setDraggedWord(word);
    setDragSource(source);
  };

  const handleDragEnd = () => {
    setDraggedWord(null);
    setDragSource(null);
  };

  const handleDropOnColumn = (targetCol) => {
    if (showResult || !draggedWord || !dragSource) return;

    if (dragSource === "bank") {
      addWordToColumn(targetCol, draggedWord);
    } else if (dragSource === "feet" || dragSource === "beak") {
      moveWordBetweenColumns(dragSource, targetCol, draggedWord);
    }

    handleDragEnd();
  };

  const handleDropOnBank = () => {
    if (showResult || !draggedWord || !dragSource) return;

    if (dragSource === "feet" || dragSource === "beak") {
      returnWordToBank(dragSource, draggedWord);
    }

    handleDragEnd();
  };

const checkAnswers = () => {
  if (showResult) return;

  const totalPlaced = columns.feet.length + columns.beak.length;

  if (totalPlaced < wordBank.length) {
    ValidationAlert.info(
      "Please place all words before checking your answers.",
    );
    return;
  }

  let correct = 0;
  let total = wordBank.length;

  ["feet", "beak"].forEach((col) => {
    columns[col].forEach((word) => {
      if (correctAnswers[col].includes(word)) {
        correct++;
      }
    });
  });

  setScore(correct);
  setShowResult(true);

  if (correct === total) {
    return ValidationAlert.success(`Score: ${correct}/${total}`);
  } else if (correct === 0) {
    return ValidationAlert.error(`Score: ${correct}/${total}`);
  } else {
    return ValidationAlert.warning(`Score: ${correct}/${total}`);
  }
};

  const handleShowAnswer = () => { 
    setShowResult(true);
    setColumns({
      feet: [...correctAnswers.feet],
      beak: [...correctAnswers.beak],
    });
    setRemaining([]);
   
    setScore(2);
  };

  const handleStartAgain = () => {
    setColumns({ feet: [], beak: [] });
    setShowResult(false);
    setScore(null);
    setDraggedWord(null);
    setDragSource(null);
    setResetKey((k) => k + 1);
  };
  const isWordWrong = (col, word) => {
    if (!showResult) return false;

    return !correctAnswers[col].includes(word);
  };
  const isWordUsed = (word) => {
    return columns.feet.includes(word) || columns.beak.includes(word);
  };
  const getWordClass = (col, word) => {
    const base =
      "px-3 py-2 rounded-lg text-lg font-semibold cursor-move transition-all border-2 ";

    if (!showResult) {
      return base + "border-blue-900 hover:bg-blue-100";
    }

    const isCorrect = correctAnswers[col].includes(word);

    return (
      base +
      (isCorrect
        ? "bg-blue-500 text-white border-blue-500"
        : "bg-blue-500 text-white border-red-500") // 🔴 غلط
    );
  };

  const getColClass = (col) => {
    const base =
      "border-2 border-dashed border-gray-300 rounded-xl p-4 min-h-[160px] transition-all";

    if (!showResult) {
      return base + "border-gray-300 bg-white hover:border-blue-400";
    }

    const userSorted = [...columns[col]].sort().join(",");
    const rightSorted = [...correctAnswers[col]].sort().join(",");

    return userSorted === rightSorted
      ? base + "border-gray-300 bg-white"
      : base + "border-gray-300 bg-white";
  };

  return (
    <div key={resetKey} className="main-container-component">
      <div className="div-forall" style={{ gap: "40px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">C</span> Write the words in the correct
          column.
        </h1>

        {/* Word Bank */}
        <div>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropOnBank}
            className="flex flex-wrap gap-3 p-4 rounded-xl min-h-[80px] justify-between"
          >
            {wordBank.map((word) => {
              const used = isWordUsed(word);

              return (
                <button
                  key={word}
                  draggable={!showResult && !used}
                  onDragStart={() => {
                    if (!used) handleDragStart(word, "bank");
                  }}
                  onDragEnd={handleDragEnd}
                  className={`WB-word-bank 
        ${
          used
            ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
            : "bg-white border-gray-300 cursor-move hover:border-blue-400 hover:bg-blue-50"
        }
      `}
      // style={{justifyContent:"space-between"}}
                >
                  {word}
                </button>
              );
            })}
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {[
            { key: "feet", img: img1 },
            { key: "beak", img: img2 },
          ].map((col, id) => (
            <div key={id}>
              <div className="flex items-center gap-2 mb-3">
                <img src={col.img} alt={col.key} style={{ height: "120px" }} />

                <span className="font-bold text-gray-700 text-xl">
                  {col.key}
                </span>
                <span className="text-xs text-gray-400">
                  ({col.key === "feet" ? "ee" : "ea"})
                </span>
              </div>

              <div
                className={getColClass(col.key)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDropOnColumn(col.key)}
              >
                <div className="flex flex-wrap gap-2">
                  {columns[col.key].map((word) => (
                    <div key={word} className="relative">
                      <button
                        draggable={!showResult}
                        onDragStart={() => handleDragStart(word, col.key)}
                        onDragEnd={handleDragEnd}
                        onClick={() => {
                          if (!showResult) {
                            returnWordToBank(col.key, word);
                          }
                        }}
                        className={getWordClass(col.key, word)}
                      >
                        {word}
                      </button>

                      {/* ✕ فوق الكلمة الغلط */}
                      {isWordWrong(col.key, word) && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow border-2 border-white">
                          <span className="text-white text-sm font-bold">
                            ✕
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {columns[col.key].length === 0 && (
                  <div className="text-gray-400 text-sm mt-2">
                    Drag words here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <Button
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={handleStartAgain}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
}

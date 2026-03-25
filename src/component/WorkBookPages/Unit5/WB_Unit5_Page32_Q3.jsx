// ExerciseC.jsx

import { useState } from "react";
import Button from "../button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img from "../../../assets/imgs/test6.png";

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
  const [remaining, setRemaining] = useState([...wordBank]);
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

    setRemaining((prev) => prev.filter((w) => w !== word));
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

    setRemaining((prev) =>
      [...prev, word].sort((a, b) => wordBank.indexOf(a) - wordBank.indexOf(b)),
    );
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
    if (remaining.length > 0) {
      ValidationAlert.info(
        "Please place all words before checking your answers.",
      );
      return;
    }

    let correct = 0;

    ["feet", "beak"].forEach((col) => {
      const userSorted = [...columns[col]].sort().join(",");
      const rightSorted = [...correctAnswers[col]].sort().join(",");
      if (userSorted === rightSorted) correct++;
    });

    setScore(correct);
    setShowResult(true);

    if (correct === 2) {
      return ValidationAlert.success(`Score: ${correct}/2`);
    } else if (correct === 0) {
      return ValidationAlert.error(`Score: ${correct}/2`);
    } else {
      return ValidationAlert.error(`Score: ${correct}/2`);
    }
  };

  const handleShowAnswer = () => {
    setColumns({
      feet: [...correctAnswers.feet],
      beak: [...correctAnswers.beak],
    });
    setRemaining([]);
    setShowResult(true);
    setScore(2);
  };

  const handleStartAgain = () => {
    setColumns({ feet: [], beak: [] });
    setRemaining([...wordBank]);
    setShowResult(false);
    setScore(null);
    setDraggedWord(null);
    setDragSource(null);
    setResetKey((k) => k + 1);
  };

  const getWordClass = (col, word) => {
    const base =
      "px-3 py-2 rounded-lg text-sm font-semibold cursor-move transition-all border-2 ";

    if (!showResult) {
      return base + "bg-blue-500 text-white border-blue-500 hover:bg-blue-600";
    }

    const isCorrect = correctAnswers[col].includes(word);

    return (
      base +
      (isCorrect
        ? "bg-blue-500 text-white border-blue-500"
        : "bg-blue-500 text-white border-blue-500")
    );
  };

  const getColClass = (col) => {
    const base =
      "border-2 border-dashed rounded-xl p-4 min-h-[160px] transition-all";

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
      <div className="div-forall" style={{ gap: "20px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">C</span> Write the words in the correct
          column.
        </h1>

        {/* Word Bank */}
        <div className="mb-8">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropOnBank}
            className="flex flex-wrap gap-3 p-4 bg-gray-100 rounded-xl min-h-[80px] border-2 border-dashed border-gray-300"
          >
            {remaining.map((word) => (
              <button
                key={word}
                draggable={!showResult}
                onDragStart={() => handleDragStart(word, "bank")}
                onDragEnd={handleDragEnd}
                className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 shadow-sm cursor-move hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                {word}
              </button>
            ))}

            {remaining.length === 0 && (
              <p className="text-gray-400 text-sm">All words placed ✓</p>
            )}
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {["feet", "beak"].map((col) => (
            <div key={col}>
              <div className="flex items-center gap-2 mb-3">
                <img src={img} alt={col} className="max-w-20 max-h-20" />

                <span className="font-bold text-gray-700 text-lg">{col}</span>
                <span className="text-xs text-gray-400">
                  ({col === "feet" ? "ee" : "ea"})
                </span>
              </div>

              <div
                className={getColClass(col)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDropOnColumn(col)}
              >
                <div className="flex flex-wrap gap-2">
                  {columns[col].map((word) => (
                    <button
                      key={word}
                      draggable={!showResult}
                      onDragStart={() => handleDragStart(word, col)}
                      onDragEnd={handleDragEnd}
                      onClick={() => {
                        if (!showResult) {
                          returnWordToBank(col, word);
                        }
                      }}
                      className={getWordClass(col, word)}
                      title={
                        showResult
                          ? ""
                          : "Drag to move or click to return to word bank"
                      }
                    >
                      {word}
                    </button>
                  ))}
                </div>

                {columns[col].length === 0 && (
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

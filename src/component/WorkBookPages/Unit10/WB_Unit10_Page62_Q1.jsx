// ExerciseA.jsx

import { useState } from "react";
import Button from "../button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/test1.png";
import img2 from "../../../assets/imgs/test1.png";
import img3 from "../../../assets/imgs/test1.png";
import img4 from "../../../assets/imgs/test1.png";
import img5 from "../../../assets/imgs/test1.png";
import img6 from "../../../assets/imgs/test1.png";
import img7 from "../../../assets/imgs/test1.png";
import img8 from "../../../assets/imgs/test1.png"
const wordImages = {
  sleep: img1,
  feet: img2,
  ten: img3,
  bed: img4,
  net: img5,
  read: img6,
  bread: img7,
  green:img8
};
const wordBank = [
  "sleep",
  "feet",
  "ten",
  "bed",
  "net",
  "read",
  "bread",
  "green",
];

const fixedWords = { ee: [], e: [], ea: [] };

const correctAnswers = {
  ee: ["green","sleep", "feet"],
  e: ["ten", "bed", "net"],
  ea: ["read", "bread"],
};

const columns = [
  { id: "ee", label: "ee" },
  { id: "e", label: "e" },
  { id: "ea", label: "ea" },
];

export default function WB_Unit10_Page62_Q1() {
  const [placed, setPlaced] = useState({ ee: [], e: [], ea: [] });
  const [selectedWord, setSelectedWord] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(null);

  // 🔥 الكلمات المستخدمة
  const usedWords = Object.values(placed).flat();

  const checkAnswers = () => {
    const totalPlaced = placed.ee.length + placed.e.length + placed.ea.length;

    if (totalPlaced < wordBank.length) {
      ValidationAlert.warning(
        "Please place all words before checking your answers.",
      );
      return;
    }

    let correct = 0;

    columns.forEach((col) => {
      const userSorted = [...placed[col.id]].sort().join(",");
      const rightSorted = [...correctAnswers[col.id]].sort().join(",");
      if (userSorted === rightSorted) correct++;
    });

    setScore(correct);
    setShowResult(true);

    correct === columns.length
      ? ValidationAlert.success(`Score: ${correct}/${columns.length}`)
      : ValidationAlert.error(`Score: ${correct}/${columns.length}`);
  };

  const handleShowAnswer = () => {
    setPlaced({
      ee: [...correctAnswers.ee],
      e: [...correctAnswers.e],
      ea: [...correctAnswers.ea],
    });
    setShowResult(true);
    setScore(columns.length);
  };

  const handleStartAgain = () => {
    setPlaced({ ee: [], e: [], ea: [] });
    setSelectedWord(null);
    setShowResult(false);
    setScore(null);
  };

  const getPlacedWordClass = (colId, word) => {
    const base =
      "px-3 py-1 rounded-lg text-lg w-20 font-semibold border-2 cursor-pointer transition-all ";

    if (!showResult)
      return base + "text-blue border-blue-500 hover:bg-blue-600";

    return correctAnswers[colId].includes(word)
      ? base + "text-blue border-blue-500"
      : base + "text-blue border-red-400";
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "10px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">A</span>
          What are the middle letters of these words? Look and write the words
          in the correct place.
        </h1>

        {/* 🔥 Global Word Bank */}
        <div className="flex flex-wrap gap-2 p-4 bg-blue-50 border-2 border-blue-100 rounded-xl mb-6">
          {wordBank.map((word) => {
            const isUsed = usedWords.includes(word);

            return (
              <div key={word} className="flex flex-col items-center gap-1">
                {/* 🖼️ الصورة (NOT draggable) */}
                <img
                  src={wordImages[word]}
                  alt={word}
                  className="max-w-45 max-h-45 object-contain pointer-events-none"
                />

                {/* 🔥 الكلمة هي draggable */}
                <div
                  draggable={!isUsed && !showResult}
                  onDragStart={() => setSelectedWord(word)}
                  className={`px-3 py-1 rounded-lg text-lg font-semibold border transition-all
          ${
            isUsed
              ? "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
              : "bg-white text-gray-600 border-gray-300 cursor-grab hover:bg-blue-50"
          }
        `}
                >
                  {word}
                </div>
              </div>
            );
          })}
        </div>

        {/* 🔥 Columns */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {columns.map((col) => {
            const isWrong =
              showResult &&
              JSON.stringify([...placed[col.id]].sort()) !==
                JSON.stringify([...correctAnswers[col.id]].sort());

            return (
              <div
                key={col.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (!selectedWord || showResult) return;

                  setPlaced((prev) => {
                    const updated = { ...prev };

                    Object.keys(updated).forEach((key) => {
                      updated[key] = updated[key].filter(
                        (w) => w !== selectedWord,
                      );
                    });

                    updated[col.id] = [...updated[col.id], selectedWord];

                    return updated;
                  });

                  setSelectedWord(null);
                }}
                className="relative border-2 rounded-2xl p-4 min-h-[160px]"
              >
                {/* ❌ Wrong */}
                {isWrong && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow">
                    ✕
                  </div>
                )}

                {/* Header */}
                <div className="flex justify-center mb-3">
                  <span className="px-4 py-1 w-15 text-center rounded-lg border-2 border-gray-400 text-gray-800 font-bold text-lg bg-white">
                    {col.label}
                  </span>
                </div>

                {/* Fixed Words */}
                {fixedWords[col.id].map((w) => (
                  <p
                    key={w}
                    className="text-center text-green-500 font-semibold underline text-lg mb-1"
                  >
                    {w}
                  </p>
                ))}

                {/* Placed Words */}
                <div className="flex flex-col items-center gap-2 mb-3">
                  {placed[col.id].map((word) => (
                    <button
                      key={word}
                      onClick={() => {
                        if (showResult) return;

                        setPlaced((prev) => ({
                          ...prev,
                          [col.id]: prev[col.id].filter((w) => w !== word),
                        }));
                      }}
                      className={getPlacedWordClass(col.id, word)}
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
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

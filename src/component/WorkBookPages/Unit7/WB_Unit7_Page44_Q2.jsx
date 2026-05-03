import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import coatImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 44/Ex B 1.svg";
import boneImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 44/Ex B 2.svg";
import bowImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 44/Ex B 3.svg";

const exerciseBWords = [
  "row",
  "goat",
  "globe",
  "note",
  "grow",
  "home",
  "soap",
  "road",
  "snow",
];

const exerciseBColumns = [
  {
    id: "oa",
    title: "coat",
    image: coatImg,
    correctWords: ["goat", "soap", "road"],
  },
  {
    id: "o-e",
    title: "bone",
    image: boneImg,
    correctWords: ["globe", "note", "home"],
  },
  {
    id: "ow",
    title: "bow",
    image: bowImg,
    correctWords: ["row", "grow", "snow"],
  },
];

const WB_Unit7_Page44_Q2 = () => {
  const [columnsB, setColumnsB] = useState({ oa: [], "o-e": [], ow: [] });
  const [draggedWord, setDraggedWord] = useState(null);
  const [checked, setChecked] = useState(false);
  const [locked, setLocked] = useState(false);

  // 🔒 هل الكلمة مستخدمة؟
  const isUsed = (word) => {
    return Object.values(columnsB).some((col) => col.includes(word));
  };

  const onDragStart = (word, fromColumn = null) => {
    if (locked) return;
    setDraggedWord({ word, fromColumn });
  };

  const onDrop = (toColumn, index) => {
    if (locked || !draggedWord) return;

    const { word, fromColumn } = draggedWord;

    setColumnsB((prev) => {
      const newState = { ...prev };

      // 🔁 احذفها من مكانها القديم
      if (fromColumn) {
        newState[fromColumn] = newState[fromColumn].filter((w) => w !== word);
      }

      // 🔄 استبدال
      const existingWord = newState[toColumn][index];

      if (existingWord) {
        newState[toColumn] = newState[toColumn].filter((_, i) => i !== index);
      }

      newState[toColumn][index] = word;

      return newState;
    });

    setDraggedWord(null);
  };

  const returnToPool = () => {
    if (locked || !draggedWord || !draggedWord.fromColumn) return;

    const { word, fromColumn } = draggedWord;

    setColumnsB((prev) => ({
      ...prev,
      [fromColumn]: prev[fromColumn].filter((w) => w !== word),
    }));

    setDraggedWord(null);
  };
  const areAllFilled = () => {
    const totalPlaced = Object.values(columnsB).reduce(
      (sum, col) => sum + col.filter(Boolean).length,
      0,
    );

    return totalPlaced === exerciseBWords.length;
  };
  const checkAnswers = () => {
    if (locked || checked) return;

    // 🔴 الفاليديشن
    if (!areAllFilled()) {
      ValidationAlert.info("Please place all the words first!");
      return;
    }

    let correct = 0;
    let total = exerciseBWords.length;

    exerciseBColumns.forEach((col) => {
      (columnsB[col.id] || []).forEach((word) => {
        if (col.correctWords.includes(word)) correct++;
      });
    });

    setChecked(true);
    setLocked(true);

    if (correct === total) {
      ValidationAlert.success(`Score: ${correct}/${total}`);
    } else if (correct === 0) {
      ValidationAlert.error(`Score: ${correct}/${total}`);
    } else {
      ValidationAlert.warning(`Score: ${correct}/${total}`);
    }
  };

  const handleShowAnswer = () => {
    const correct = { oa: [], "o-e": [], ow: [] };
    exerciseBColumns.forEach((col) => (correct[col.id] = col.correctWords));
    setColumnsB(correct);
    setChecked(true);
    setLocked(true);
  };

  const handleTryAgain = () => {
    setColumnsB({ oa: [], "o-e": [], ow: [] });
    setChecked(false);
    setLocked(false);
  };

  return (
    <div className="main-container-component">
      {" "}
      <div className="div-forall"  style={{gap:"25px"}}>
        {" "}
        <h2 className="WB-header-title-page8">
          {" "}
          <span className="WB-ex-A">B</span>
          Look, read, and write the words under the correct column.{" "}
        </h2>
        <div className="flex flex-col gap-2">
        {/* WORD BANK */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={returnToPool}
          className="rounded-full px-8 py-4 flex flex-wrap justify-center gap-4"
        >
          {exerciseBWords.map((word) => {
            const used = isUsed(word);

            return (
              <div
                key={word}
                draggable={!used && !locked}
                onDragStart={() => {
                  if (!used) onDragStart(word);
                }}
                className={`WB-word-bank 
              ${
                used
                  ? "text-gray-400 cursor-not-allowed opacity-60"
                  : "cursor-grab hover:text-blue-600"
              }
            `}
              style={{padding:"9px 15px"}}
              >
                {word}
              </div>
            );
          })}
        </div>
        {/* COLUMNS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {exerciseBColumns.map((col) => (
            <div key={col.id} className="flex flex-col items-center">
              <img
                src={col.image}
                className="max-w-32 max-h-24 object-contain"
              />

              <span className="font-bold text-2xl text-gray-700">
                {col.title}
              </span>

              <div
                onDragOver={(e) => e.preventDefault()}
                className="w-full flex flex-col gap-3 min-h-[180px] p-4"
              >
                {[0, 1, 2].map((idx) => {
                  const word = columnsB[col.id][idx];
                  const isWrong =
                    checked &&
                    word &&
                    !exerciseBColumns
                      .find((c) => c.id === col.id)
                      .correctWords.includes(word);
                  return (
                    <div
                      key={idx}
                      onDrop={() => onDrop(col.id, idx)}
                      onDragOver={(e) => e.preventDefault()}
                      className="relative"
                    >
                      <div
                        draggable={word && !locked}
                        onDragStart={() => onDragStart(word, col.id)}
                        className={`h-12 border-b-2 flex items-center justify-center text-xl italic relative
  ${
    isWrong
      ? "border-red-500"
      : word
        ? "border-gray-500 cursor-grab"
        : "border-gray-300"
  }
`}
                      >
                        {word}
                      </div>
                      {isWrong && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow border-2 border-white">
                          ✕
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        </div>
        <div className="flex justify-center">
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleTryAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};

export default WB_Unit7_Page44_Q2;

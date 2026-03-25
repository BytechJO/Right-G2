// ExerciseA.jsx

import { useState } from "react";
import Button from "../button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img from "../../../assets/imgs/test6.png";

const wordBank = ["sleep", "feet", "ten", "bed", "net", "read", "bread"];

const fixedWords = { ee: ["green"], e: [], ea: [] };

const correctAnswers = {
  ee: ["sleep", "feet"],
  e:  ["ten", "bed", "net"],
  ea: ["read", "bread"],
};

const columns = [
  { id: "ee", label: "ee" },
  { id: "e",  label: "e"  },
  { id: "ea", label: "ea" },
];

export default function WB_Unit10_Page62_Q1() {
  const [placed, setPlaced]         = useState({ ee: [], e: [], ea: [] });
  const [remaining, setRemaining]   = useState([...wordBank]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore]           = useState(null);
  const [resetKey, setResetKey]     = useState(0);

  const addWord = (colId, word) => {
    if (showResult) return;
    setPlaced(prev => ({ ...prev, [colId]: [...prev[colId], word] }));
    setRemaining(prev => prev.filter(w => w !== word));
  };

  const removeWord = (colId, word) => {
    if (showResult) return;
    setPlaced(prev => ({ ...prev, [colId]: prev[colId].filter(w => w !== word) }));
    setRemaining(prev => [...prev, word].sort((a, b) => wordBank.indexOf(a) - wordBank.indexOf(b)));
  };

  const checkAnswers = () => {
    if (remaining.length > 0) {
      ValidationAlert.warning("Please place all words before checking your answers.");
      return;
    }
    let correct = 0;
    columns.forEach(col => {
      const userSorted  = [...placed[col.id]].sort().join(",");
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
    setPlaced({ ee: [...correctAnswers.ee], e: [...correctAnswers.e], ea: [...correctAnswers.ea] });
    setRemaining([]);
    setShowResult(true);
    setScore(columns.length);
  };

  const handleStartAgain = () => {
    setPlaced({ ee: [], e: [], ea: [] });
    setRemaining([...wordBank]);
    setShowResult(false);
    setScore(null);
    setResetKey(k => k + 1);
  };

  

  const getPlacedWordClass = (colId, word) => {
    const base = "px-3 py-1 rounded-lg text-sm font-semibold border-2 cursor-pointer transition-all ";
    if (!showResult) return base + "bg-blue-500 text-white border-blue-500 hover:bg-blue-600";
    return correctAnswers[colId].includes(word)
      ? base + "bg-gray-500 text-white border-green-500"
      : base + "bg-gray-400 text-white border-red-400";
  };

  return (
    <div key={resetKey} className="p-6 max-w-3xl mx-auto font-sans">
      <div className="flex items-center gap-4 mb-6">
        <span className="ex-A">A</span>
        <h1 className="header-title-page8">
          What are the middle letters of these words? Look and write the words in the correct place.
        </h1>
      </div>

      {/* Word bank */}
      <div className="flex flex-wrap gap-2 p-4 bg-blue-50 border-2 border-blue-100 rounded-xl mb-6">
        <span className="text-xs text-blue-400 font-bold w-full mb-1">Words:</span>
        {remaining.map(word => (
          <span key={word} className="px-3 py-1 rounded-lg text-sm font-semibold border bg-white text-gray-600 border-gray-300">
            {word}
          </span>
        ))}
        {remaining.length === 0 && <p className="text-gray-400 text-sm">All words placed ✓</p>}
      </div>

      {/* Columns */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {columns.map(col => (
          <div key={col.id} className={`border-2 rounded-2xl p-4 min-h-[160px] transition-all`}>
            {/* Header bubble */}
            <div className="flex justify-center mb-3">
              <span className="px-4 py-1 rounded-full border-2 border-gray-400 text-gray-600 font-bold text-sm bg-white">
                {col.label}
              </span>
            </div>

            {/* Fixed example words */}
            {fixedWords[col.id].map(w => (
              <p key={w} className="text-center text-green-500 font-semibold underline text-sm mb-1">{w}</p>
            ))}

            {/* Placed words */}
            <div className="flex flex-col items-center gap-2 mb-3">
              {placed[col.id].map(word => (
                <button key={word} onClick={() => removeWord(col.id, word)} className={getPlacedWordClass(col.id, word)}>
                  {word}
                </button>
              ))}
            </div>

            {!showResult && remaining.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1 mt-2 pt-2 border-t border-dashed border-gray-200">
                {remaining.map(word => (
                  <button
                    key={word}
                    onClick={() => addWord(col.id, word)}
                    className="px-2 py-1 text-xs bg-white border border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
                  >
                    + {word}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      

      <Button handleShowAnswer={handleShowAnswer} handleStartAgain={handleStartAgain} checkAnswers={checkAnswers} />
    </div>
  );
}
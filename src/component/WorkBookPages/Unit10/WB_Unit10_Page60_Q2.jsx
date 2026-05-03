import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";

const WB_Unit10_Page60_Q2 = () => {
  const [answers, setAnswers] = useState({
    q1: [],
    q2: [],
    q3: [],
    q4: [],
    q5: [],
  });
  const [showResults, setShowResults] = useState(false);

  const DATA = [
    {
      id: "q1",
      scrambled: ["ball", "She", "yard", "in", ".", "playing", "is", "the"],
      correct: "She is playing ball in the yard.",
    },
    {
      id: "q2",
      scrambled: ["TV", "They", ".", "are", "watching"],
      correct: "They are watching TV.",
    },
    {
      id: "q3",
      scrambled: [
        "He",
        "shower",
        ".",
        "bathroom",
        "taking",
        "is",
        "a",
        "the",
        "in",
      ],
      correct: "He is taking a shower in the bathroom.",
    },
    {
      id: "q4",
      scrambled: ["studying", "the", ".", "We", "bedroom", "are", "in"],
      correct: "We are studying in the bedroom.",
    },
    {
      id: "q5",
      scrambled: [
        "I'm",
        "yard",
        "flowers",
        ".",
        "watering",
        "the",
        "in",
        "the",
      ],
      correct: "I'm watering the flowers in the yard.",
    },
  ];

  const checkAnswers = () => {
    if (showResults) return;
    const unanswered = DATA.filter((d) => answers[d.id].length === 0);
    if (unanswered.length > 0) {
      ValidationAlert.info();
      return;
    }
    setShowResults(true);
    let score = 0;
    DATA.forEach((d) => {
      const userSentence = answers[d.id].join(" ").replace(" .", ".");
      if (userSentence.toLowerCase() === d.correct.toLowerCase()) score++;
    });
    const total = DATA.length;
    const msg = `Score: ${score} / ${total}`;
    if (score === total) ValidationAlert.success(msg);
    else if (score > 0) ValidationAlert.warning(msg);
    else ValidationAlert.error(msg);
  };

  const handleReset = () => {
    setAnswers({ q1: [], q2: [], q3: [], q4: [], q5: [] });
    setShowResults(false);
  };

  const handleWordClick = (qId, word, idx) => {
    if (showResults) return;
    setAnswers((prev) => ({ ...prev, [qId]: [...prev[qId], word] }));
  };

  const handleRemoveWord = (qId, wordIdx) => {
    if (showResults) return;
    setAnswers((prev) => ({
      ...prev,
      [qId]: prev[qId].filter((_, i) => i !== wordIdx),
    }));
  };

  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"25px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">G</span>Unscramble and write each sentence.
        </h1>

        <div>
          {DATA.map((item, idx) => {
            const userSentence = answers[item.id].join(" ").replace(" .", ".");
            const isCorrect =
              userSentence.toLowerCase() === item.correct.toLowerCase();

            return (
              <div key={item.id} className="space-y-1 p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <h2 className="font-semibold text-black-600 text-lg flex gap-2 items-center">
                      {" "}
                      <span className="font-bold text-blue-900 text-xl">
                        {idx + 1}
                      </span>{" "}
                      {item.scrambled.join(" ")}
                    </h2>
                    <div className="flex flex-wrap gap-2 w-160 p-2 rounded-lg">
                      {item.scrambled.map((word, wIdx) => {
                        const countInAnswer = answers[item.id].filter(
                          (w) => w === word,
                        ).length;
                        const countInScrambled = item.scrambled.filter(
                          (w) => w === word,
                        ).length;
                        const isUsed = countInAnswer >= countInScrambled;

                        return (
                          <button
                            key={wIdx}
                            onClick={() => handleWordClick(item.id, word, wIdx)}
                            disabled={isUsed || showResults}
                            className={`WB-word-bank ${
                              isUsed
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-white border-2 border-blue-900 text-blue-900 hover:border-blue-400 hover:shadow-sm"
                            }`}
                          >
                            {word}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div
                  className={`relative min-h-[50px] p-3 border-b-2 border-gray-400 flex flex-wrap gap-1 items-center transition-all ${showResults && answers[item.id].length > 0 && !isCorrect &&"border-red-500"}`}
                >
                  {/* ❌ Wrong Answer */}
                  {showResults && answers[item.id].length > 0 && !isCorrect && (
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow">
                      ✕
                    </div>
                  )}

                  {answers[item.id].length === 0 && (
                    <span className="text-gray-300 italic text-sm">
                      Click words to build the sentence...
                    </span>
                  )}

                  {answers[item.id].map((word, wIdx) => (
                    <span
                      key={wIdx}
                      onClick={() => handleRemoveWord(item.id, wIdx)}
                      className={`cursor-pointer text-lg hover:text-red-600 transition-colors ${
                        showResults ? "pointer-events-none" : ""
                      }`}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            handleShowAnswer={() => {
              const correctAnswers = {};
              DATA.forEach((d) => {
                // تحويل الجملة الصحيحة إلى مصفوفة كلمات مع مراعاة النقطة
                correctAnswers[d.id] = d.correct
                  .replace(".", " .")
                  .split(" ")
                  .filter((w) => w !== "");
              });
              setAnswers(correctAnswers);
              setShowResults(true);
            }}
            handleStartAgain={handleReset}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};

export default WB_Unit10_Page60_Q2;

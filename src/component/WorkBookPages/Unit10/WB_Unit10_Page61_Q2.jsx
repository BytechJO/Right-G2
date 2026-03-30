import React, { useState } from "react";
import Button from "../button";

const words = ["reading", "wearing", "watching", "carrying"];

// نقاط الصورة
const dots = [
  { x: 40, y: 40 },
  { x: 120, y: 60 },
  { x: 180, y: 30 },
  { x: 220, y: 100 },
  { x: 140, y: 140 },
  { x: 60, y: 120 },
];

const DrawAndAsk = () => {
  const [selectedWord, setSelectedWord] = useState("");
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);

  // توصيل النقاط
  const handleDotClick = (dot, index) => {
    if (index !== selectedPoints.length) return;
    setSelectedPoints((prev) => [...prev, { ...dot, index }]);
  };

  const isCompleted = selectedPoints.length === dots.length;

  // ✅ إظهار الإجابة
  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  // 🔄 إعادة التمرين
  const handleStartAgain = () => {
    setSelectedWord("");
    setSelectedPoints([]);
    setShowAnswer(false);
  };

  // ✅ التحقق
  const checkAnswers = () => {
    if (!isCompleted) {
      alert("Finish connecting the dots first!");
      return;
    }

    if (!selectedWord) {
      alert("Choose a word!");
      return;
    }

    alert("Good job! 🎉");
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "20px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">I</span>Draw, and then ask and answer.
        </h1>

        {/* ✏️ التوصيل */}
        <div className="flex justify-center mt-6">
          <div className="relative w-[300px] h-[200px] border rounded-lg bg-white">
            {/* الخطوط */}
            <svg className="absolute inset-0 w-full h-full">
              {selectedPoints.map((p, i) => {
                if (i === 0) return null;

                const prev = selectedPoints[i - 1];

                return (
                  <line
                    key={i}
                    x1={prev.x}
                    y1={prev.y}
                    x2={p.x}
                    y2={p.y}
                    stroke="black"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>

            {/* النقاط */}
            {dots.map((dot, index) => (
              <div
                key={index}
                onClick={() => handleDotClick(dot, index)}
                className={`absolute w-5 h-5 rounded-full cursor-pointer flex items-center justify-center text-xs text-white ${
                  index <= selectedPoints.length ? "bg-blue-500" : "bg-gray-400"
                }`}
                style={{ left: dot.x, top: dot.y }}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* 🎯 الكلمات */}
        <div className="flex justify-center gap-4 mt-6">
          {words.map((word) => (
            <button
              key={word}
              onClick={() => setSelectedWord(word)}
              className={`px-4 py-2 rounded-lg border ${
                selectedWord === word ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              {word}
            </button>
          ))}
        </div>

        {/* 💬 السؤال */}
        <div className="flex justify-center mt-8">
          <div className="bg-white border rounded-xl px-6 py-3 shadow-sm text-lg">
            What’s he {selectedWord || "_____"}?
          </div>
        </div>

        {/* 💬 الجواب */}
        <div className="flex justify-center mt-4">
          <div className="bg-white border rounded-xl px-6 py-3 shadow-sm text-lg">
            He’s {showAnswer ? selectedWord : "_____"} ...
          </div>
        </div>

        {/* 🔘 الأزرار */}
        <div className="mt-18">
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleStartAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};

export default DrawAndAsk;

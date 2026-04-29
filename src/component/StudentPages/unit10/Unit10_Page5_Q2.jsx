import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

const Unit10_Page5_Q3 = () => {
  const questions = [
    {
      id: 1,
      base: "nest",
      words: ["feet", "rest", "eat", "desk"],
      correct: ["rest", "desk"],
    },
    {
      id: 2,
      base: "egg",
      words: ["beg", "meat", "vet", "seal"],
      correct: ["beg", "vet"],
    },
    {
      id: 3,
      base: "net",
      words: ["tea", "pen", "pet", "ten"],
      correct: ["pen", "pet", "ten"],
    },
  ];

  const [selected, setSelected] = useState({});
  const [checked, setChecked] = useState(false);
  const [locked, setLocked] = useState(false);

  const toggleWord = (qId, word) => {
    if (locked) return;

    const question = questions.find((q) => q.id === qId);
    const maxSelections = question.correct.length;

    setSelected((prev) => {
      const current = prev[qId] || [];

      // إذا الكلمة موجودة → احذفها
      if (current.includes(word)) {
        return {
          ...prev,
          [qId]: current.filter((w) => w !== word),
        };
      }

      // ❌ إذا وصل الحد (عدد الإجابات الصحيحة)
      if (current.length >= maxSelections) {
        return prev;
      }

      // ✅ إضافة
      return {
        ...prev,
        [qId]: [...current, word],
      };
    });
  };
  const reset = () => {
    setSelected({});
    setChecked(false);
    setLocked(false);
  };

  const showAnswers = () => {
    const correct = {};
    questions.forEach((q) => {
      correct[q.id] = q.correct;
    });
    setSelected(correct);
    setChecked(true);
    setLocked(true);
  };

  const checkAnswers = () => {
    if (locked) return;

    const empty = questions.some(
      (q) => !(selected[q.id] && selected[q.id].length > 0),
    );

    if (empty) {
      ValidationAlert.info(
        "Please select at least one word for each question.",
      );
      return;
    }

    let score = 0;
    let total = 0;

    questions.forEach((q) => {
      const selectedWords = selected[q.id] || [];

      // عدد الكلمات الصح
      total += q.correct.length;

      selectedWords.forEach((word) => {
        if (q.correct.includes(word)) {
          score++;
        }
      });
    });

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${score} / ${total}
      </span>
    </div>
  `;

    if (score === total) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);

    setChecked(true);
    setLocked(true);
  };

  const isWrongWord = (q, word) => {
    if (!checked) return false;

    const isSelected = (selected[q.id] || []).includes(word);
    const isCorrect = q.correct.includes(word);

    return isSelected && !isCorrect;
  };
  return (
    <div className="main-container-component">
      <div className="div-forall"style={{gap:"30px"}}>
        <h5 className="header-title-page8 mb-8">
          <span style={{ color: "#2e3192", marginRight: "20px" }}>2</span>
          Read and circle the words with the same vowel sound.
        </h5>

        {questions.map((q) => (
          <div
            key={q.id}
            className="flex items-center gap-10 mb-4 px-4 py-3 rounded-xl bg-[#f5eee8]"
          >
            {/* رقم */}
            <span className="font-bold text-[22px] w-5">{q.id}</span>

            {/* الكلمات */}
            <div className="flex gap-10 flex-wrap items-center">
              {/* الكلمة الأساسية */}
              <div className="bg-[#e8ddd5] px-3 py-1 rounded-full font-medium text-[22px]">
                {q.base}
              </div>

              {/* باقي الكلمات */}
              {q.words.map((word, i) => {
                const isSelected = (selected[q.id] || []).includes(word);
                const isCorrect = q.correct.includes(word);

                return (
                  <div
                    key={i}
                    onClick={() => toggleWord(q.id, word)}
                    className={`
                      relative px-3 py-1 rounded-full cursor-pointer transition text-[22px]
                      ${
                        isSelected
                          ? checked
                            ? isCorrect
                              ? "border-2 border-blue-800 text-black"
                              : "border-2 border-red-500"
                            : "border-2 border-blue-800"
                          : "border-2 border-transparent hover:bg-gray-100"
                      }
                    `}
                  >
                    {word}
                    {isWrongWord(q, word) && (
                      <div
                        className="
      absolute -top-2 -right-2
      w-5 h-5
      bg-red-500 text-white
      rounded-full
      flex items-center justify-center
      text-xs font-bold
      border-2 border-white
      z-10
    "
                      >
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

      {/* buttons */}
      <div className="action-buttons-container">
        <button onClick={reset} className="try-again-button">
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
  );
};

export default Unit10_Page5_Q3;

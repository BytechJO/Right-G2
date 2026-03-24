import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

const Unit10_Page5_Q3 = () => {
  const questions = [
    {
      id: 1,
      base: "nest",
      words: ["feet", "rest", "eat", "desk"],
      correct: [ "rest", "desk"],
    },
    {
      id: 2,
      base: "egg",
      words: ["beg", "meat", "vet", "seal"],
      correct: [ "beg", "vet"],
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

    setSelected((prev) => {
      const current = prev[qId] || [];

      if (current.includes(word)) {
        return {
          ...prev,
          [qId]: current.filter((w) => w !== word),
        };
      } else {
        return {
          ...prev,
          [qId]: [...current, word],
        };
      }
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

    const msg = `
    <div style="font-size:20px;text-align:center;">
      <span style="color:#2e7d32;font-weight:bold;">
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

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      <div className="div-forall" style={{ width: "60%" }}>
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
            <span className="font-bold w-5">{q.id}</span>

            {/* الكلمات */}
            <div className="flex gap-10 flex-wrap items-center">
              {/* الكلمة الأساسية */}
              <div className="bg-[#e8ddd5] px-3 py-1 rounded-full font-medium">
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
                      px-3 py-1 rounded-full cursor-pointer transition text-[17px]
                      ${
                        isSelected
                          ? checked
                            ? isCorrect
                              ? "border-2 border-green-500 text-green-600 bg-green-50"
                              : "border-2 border-gray-300 text-gray-400"   
                            : "border-2 border-red-400"
                          : "border-2 border-transparent hover:bg-gray-100"
                      }
                    `}
                  >
                    {word}
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

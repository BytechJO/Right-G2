import React, { useState, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";

import imgA from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 54/with numbers 2.svg";
import imgB from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 54/with numbers 1.svg";

const exerciseGData = [
  {
    id: 1,
    img: "A",
    correct: "The man is wearing a hat.",
    scrambled: ["wearing", "man", "is", "hat.", "The", "a"],
  },
  {
    id: 1,
    img: "B",
    correct: "The man isn't wearing a hat.",
    scrambled: ["isn't", "man", "The", "a", "wearing", "hat."],
  },
  {
    id: 2,
    img: "A",
    correct: "The girl is building a sandcastle.",
    scrambled: ["is", "sandcastle.", "building", "The", "a", "girl"],
  },
  {
    id: 2,
    img: "B",
    correct: "She isn't building a sandcastle. She is eating.",
    scrambled: [
      "building",
      "isn't",
      "eating.",
      "a",
      "She",
      "She",
      "is",
      "sandcastle.",
    ],
  },
  {
    id: 3,
    img: "A",
    correct: "The boy is holding a bucket.",
    scrambled: ["is", "boy", "bucket.", "The", "a", "holding"],
  },
  {
    id: 3,
    img: "B",
    correct: "The boy isn't carrying a bucket. He is swimming and waving.",
    scrambled: [
      "isn't",
      "a",
      "carrying",
      "bucket.",
      "boy",
      "The",
      "swimming",
      "is",
      "He",
      "waving.",
      "and",
    ],
  },
  {
    id: 4,
    img: "A",
    correct: "The woman is eating an ice cream.",
    scrambled: ["an", "is", "woman", "The", "eating", "cream.", "ice"],
  },
  {
    id: 4,
    img: "B",
    correct: "She isn't eating ice cream. She is reading a book.",
    scrambled: [
      "isn't",
      "ice",
      "reading",
      "She",
      "She",
      "is",
      "cream.",
      "book.",
      "a",
      "eating",
    ],
  },
  {
    id: 5,
    img: "A",
    correct: "The girl is playing with a doll.",
    scrambled: ["girl", "doll.", "playing", "The", "a", "with", "is"],
  },
  {
    id: 5,
    img: "B",
    correct: "The girl is playing with a yellow balloon.",
    scrambled: [
      "playing",
      "girl",
      "is",
      "with",
      "The",
      "balloon.",
      "a",
      "yellow",
    ],
  },
];

const WB_Unit9_Page54_Q1 = () => {
  const [userAnswers, setUserAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [locked, setLocked] = useState(false);

  // Initialize answers
  useEffect(() => {
    const initial = {};
    exerciseGData.forEach((item) => {
      initial[`${item.img}-${item.id}`] = [];
    });
    setUserAnswers(initial);
  }, []);

  const handleWordClick = (key, word, index) => {
    if (locked) return;

    setUserAnswers((prev) => {
      const current = prev[key] || [];
      return { ...prev, [key]: [...current, index] };
    });
  };

  const clearAnswer = (key) => {
    if (locked) return;
    setUserAnswers((prev) => ({ ...prev, [key]: [] }));
  };

  const checkAnswers = () => {
    const unanswered = Object.values(userAnswers).filter(
      (val) => !val || val.length === 0
    );

    if (unanswered.length > 0) {
      ValidationAlert.info("Please complete all sentences first!");
      return;
    }

    let correctCount = 0;

    exerciseGData.forEach((item) => {
      const key = `${item.img}-${item.id}`;

      const userAns = (userAnswers[key] || [])
        .map((i) => item.scrambled[i])
        .join(" ")
        .toLowerCase()
        .replace(/\s+/g, " ");

      const correctAns = item.correct.toLowerCase().replace(/\s+/g, " ");

      if (userAns === correctAns) {
        correctCount++;
      }
    });

    setChecked(true);
    setLocked(true);

    if (correctCount === exerciseGData.length) {
      ValidationAlert.success(`Score: ${correctCount}/${exerciseGData.length}`);
    } else if (correctCount > 0) {
      ValidationAlert.warning(`Score: ${correctCount}/${exerciseGData.length}`);
    } else {
      ValidationAlert.error(`Score: ${correctCount}/${exerciseGData.length}`);
    }
  };

  const handleShowAnswer = () => {
    const answers = {};
    exerciseGData.forEach((item) => {
      answers[`${item.img}-${item.id}`] = item.correct;
    });
    setUserAnswers(answers);
    setChecked(true);
    setLocked(true);
  };

  const handleTryAgain = () => {
    const initial = {};
    exerciseGData.forEach((item) => (initial[`${item.img}-${item.id}`] = []));
    setUserAnswers(initial);
    setChecked(false);
    setLocked(false);
  };
const handleRemoveWord = (key, wordIndex) => {
  if (locked) return;

  setUserAnswers((prev) => {
    const updated = [...(prev[key] || [])];

    // حذف الكلمة حسب موقعها في الجملة
    updated.splice(wordIndex, 1);

    return {
      ...prev,
      [key]: updated,
    };
  });
};
 const renderSentence = (key, item) => {
  if (!Array.isArray(userAnswers[key])) return userAnswers[key];

  return (userAnswers[key] || []).map((i, idx) => {
    const word = item.scrambled[i];

    return (
      <span
        key={idx}
        onClick={() => handleRemoveWord(key, idx)}
       className="mr-1 cursor-pointer hover:text-red-500 transition"
      >
        {word}
      </span>
    );
  });
};

  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"35px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">G</span> What is different? Look and write.
        </h1>
          <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-2" style={{justifyItems:"center"}}>
          <div className="relative ">
            <img src={imgA} alt="Scene A" className="max-w-full max-h-45 object-contain" />
          </div>
          <div className="relative">
            <img src={imgB} alt="Scene B" className="max-w-full max-h-45 object-contain" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {["A", "B"].map((side) => (
            <div key={side} className="flex flex-col gap-8">
              {exerciseGData
                .filter((d) => d.img === side)
                .map((item) => {
                  const key = `${side}-${item.id}`;
                  return (
                    <div key={key} className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-600 w-4">{item.id}</span>
                        <div className="flex-1 min-h-[40px] border-b-2 border-gray-400 font-serif text-lg px-2 flex items-center relative">
                          {renderSentence(key, item)}

                      
                          {checked &&
                            renderSentence(key, item).toLowerCase().trim() !==
                              item.correct.toLowerCase() && (
                              <span className="absolute -right-6 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold border-2 border-white shadow">
                                ✕
                              </span>
                            )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pl-7">
                        {item.scrambled.map((word, i) => {
                          const isUsed = (userAnswers[key] || []).includes(i);

                          return (
                            <button
                              key={i}
                              onClick={() => !isUsed && handleWordClick(key, word, i)}
                              disabled={locked || isUsed}
                              className={`WB-word-bank
                                ${
                                  isUsed
                                    ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed"
                                    : "border-blue-900 hover:bg-blue-50 hover:border-blue-300"
                                }
                                ${locked && "opacity-50"}
                              `}
                              style={{fontSize:"16px"}}
                            >
                              {word}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
</div>
        <div className="mt-16 flex justify-center">
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

export default WB_Unit9_Page54_Q1;
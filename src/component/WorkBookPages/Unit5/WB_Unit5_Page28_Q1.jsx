import React, { useState } from "react";

import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page28/Ex C 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page28/Ex C 3.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page28/Ex C 2.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page28/Ex C 4.svg";

import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";

const exerciseData = [
  {
    id: "q1",
    img: img1,
    correctQuestion: "Dose he like chicken?",
    correctAnswer: "No, he doesn't.",
    questionWords: ["Dose", "like", "chicken?", "he"],
    answerWords: ["No,", "doesn't.", "he"],
  },
  {
    id: "q2",
    img: img2,
    correctQuestion: "Dose she like fruit?",
    correctAnswer: "No, she doesn't.",
    questionWords: ["she", "Dose", "fruit?", "like"],
    answerWords: ["No,", "she", "doesn't."],
  },
  {
    id: "q3",
    img: img3,
    correctQuestion: "Dose he like cheese?",
    correctAnswer: "No, he doesn't",
    questionWords: ["cheese?", "like", "Dose", "he"],
    answerWords: ["No,", "doesn't", "he"],
  },
  {
    id: "q4",
    img: img4,
    correctQuestion: "Dose she like tea?",
    correctAnswer: "Yes, she does",
    questionWords: ["she", "Dose", "like", "tea?"],
    answerWords: ["Yes,", "does", "she"],
  },
];

const WB_Unit5_Page28_Q1 = () => {
  const [droppedWords, setDroppedWords] = useState({});
  const [showResults, setShowResults] = useState(false);

  const removeWord = (zoneId, word) => {
    if (showResults) return;
    setDroppedWords((prev) => ({
      ...prev,
      [zoneId]: prev[zoneId].filter((w) => w !== word),
    }));
  };
  const handleWordClick = (qId, type, word, index) => {
    if (showResults) return;

    const zoneId = `${qId}-${type}`;
    const wordId = `${qId}-${type === "question" ? "q" : "a"}-${index}|${word}`;

    setDroppedWords((prev) => {
      const newState = { ...prev };

      const currentWords = newState[zoneId] || [];

      // إذا الكلمة موجودة → احذفها
      if (currentWords.includes(wordId)) {
        newState[zoneId] = currentWords.filter((w) => w !== wordId);
      } else {
        // احذفها من أي مكان ثاني
        Object.keys(newState).forEach((key) => {
          newState[key] = newState[key].filter((w) => w !== wordId);
        });

        // أضفها
        newState[zoneId] = [...currentWords, wordId];
      }

      return newState;
    });
  };
  const extractText = (wordId) => wordId.split("|")[1];

  const cleanSentence = (arr) => arr.map(extractText).join(" ");

  const getZoneClass = (zoneId, correctSentence) => {
    if (!showResults) return "border-gray-300";

    const userSentence = cleanSentence(droppedWords[zoneId] || []);
    if (!userSentence) return "border-gray-300";

    return userSentence === correctSentence
      ? "border-gray-300"
      : "border-gray-300";
  };

  const isWrong = (zoneId, correctSentence) => {
    if (!showResults) return false;

    const userSentence = cleanSentence(droppedWords[zoneId] || []);
    if (!userSentence) return false;

    return userSentence !== correctSentence;
  };
  const checkAnswers = () => {
    if (showResults) return;
    // ✅ تحقق أولاً من أن كل الحقول ممتلئة
    for (let q of exerciseData) {
      const questionWords = droppedWords[`${q.id}-question`] || [];
      const answerWords = droppedWords[`${q.id}-answer`] || [];

      if (questionWords.length === 0 || answerWords.length === 0) {
        ValidationAlert.info("Please complete all answers first.");
        return; // ⛔ وقف التنفيذ
      }
    }

    // ✅ إذا كله معبّي → كمل التصحيح
    setShowResults(true);

    let score = 0;
    const total = exerciseData.length * 2;

    exerciseData.forEach((q) => {
      const userQ = cleanSentence(droppedWords[`${q.id}-question`] || []);
      const userA = cleanSentence(droppedWords[`${q.id}-answer`] || []);

      if (userQ === q.correctQuestion) score++;
      if (userA === q.correctAnswer) score++;
    });

    if (score === total) {
      ValidationAlert.success(`Score: ${score} / ${total}`);
    } else if (score === 0) {
      ValidationAlert.error(`Score: ${score} / ${total}`);
    } else {
      ValidationAlert.warning(`Score: ${score} / ${total}`);
    }
  };
  const handleShowAnswer = () => {
    const correctPlacements = {};

    exerciseData.forEach((q) => {
      correctPlacements[`${q.id}-question`] = q.correctQuestion
        .split(" ")
        .map((w, i) => `${q.id}-q-${i}|${w}`);

      correctPlacements[`${q.id}-answer`] = q.correctAnswer
        .split(" ")
        .map((w, i) => `${q.id}-a-${i}|${w}`);
    });

    setDroppedWords(correctPlacements);
    setShowResults(true);
  };

  const handleStartAgain = () => {
    setDroppedWords({});
    setShowResults(false);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ marginBottom: "50px" ,gap:"35px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">C</span> Look, read, and write.
        </h1>

        <div className="space-y-5">
          {exerciseData.map((q, index) => {
            const usedQ = droppedWords[`${q.id}-question`] || [];
            const usedA = droppedWords[`${q.id}-answer`] || [];

            return (
              <div key={q.id} className="space-y-4 flex items-center">
                <div className="flex items-start gap-4">
                  <span className="text-xl text-blue-900 font-semibold">{index + 1}</span>
                  <img src={q.img} style={{height:"100px"}} />
                </div>
                  <div className="flex w-full justify-around">
                  <div>
                {/* Question Word Bank */}
                <div className="flex flex-wrap gap-2 p-2 rounded">
                  {q.questionWords.map((word, i) => {
                    const id = `${q.id}-q-${i}|${word}`;
                    const isUsed = usedQ.some((w) => w.startsWith(`${q.id}-q-${i}|`));

                    return (
                      <div
                        key={id}
                        onClick={() =>
                          handleWordClick(q.id, "question", word, i)
                        }
                        className={`WB-word-bank 
          ${
            isUsed
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
          }`}
                      >
                        {word}
                      </div>
                    );
                  })}
                </div>

                {/* Question Drop */}
                <div className="relative">
                  <div className={`flex flex-wrap gap-2 p-2 border-b-2 min-h-[40px] ${getZoneClass(
    `${q.id}-question`,
    q.correctQuestion
  )}`}>
                    {usedQ.map((word) => (
                      <span
                        key={word}
                        onClick={() => removeWord(`${q.id}-question`, word)}
                        className="cursor-pointer hover:text-red-500"
                      >
                        {extractText(word)}
                      </span>
                    ))}
                  </div>

                  {isWrong(`${q.id}-question`, q.correctQuestion) && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                      ✕
                    </div>
                  )}
                </div>
            </div>

            <div>
                {/* Answer Word Bank */}
                <div className="flex flex-wrap gap-2 p-2 rounded">
                  {q.answerWords.map((word, i) => {
                    const id = `${q.id}-a-${i}|${word}`;
                  const isUsed = usedA.some((w) => w.startsWith(`${q.id}-a-${i}|`));

                    return (
                      <div
                        key={id}
                        onClick={() => handleWordClick(q.id, "answer", word, i)}
                        className={`WB-word-bank 
          ${
            isUsed
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
          }`}
                      >
                        {word}
                      </div>
                    );
                  })}
                </div>
                {/* Answer Drop */}
                <div className="relative">
                  <div   className={`flex flex-wrap gap-2 p-2 border-b-2 min-h-[40px] ${getZoneClass(
    `${q.id}-answer`,
    q.correctAnswer
  )}`}>
                    {usedA.map((word) => (
                      <span
                        key={word}
                        onClick={() => removeWord(`${q.id}-answer`, word)}
                        className="cursor-pointer hover:text-red-500"
                      >
                        {extractText(word)}
                      </span>
                    ))}
                  </div>

                  {isWrong(`${q.id}-answer`, q.correctAnswer) && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                      ✕
                    </div>
                  )}
                </div>
                </div>
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
};

export default WB_Unit5_Page28_Q1;

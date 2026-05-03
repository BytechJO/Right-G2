import React, { useState } from "react";

import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page22/Ex D 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page22/Ex D 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page22/Ex D 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page22/Ex D 4.svg";

import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";

const exerciseData = [
  {
    id: "q1",
    img: img1,
    correctQuestion: "What's their job?",
    correctAnswer: "They're police officers.",
    questionWords: ["their", "job?", "What's"],
    answerWords: ["police", "They're", "officers."],
  },
  {
    id: "q2",
    img: img2,
    correctQuestion: "What's his job?",
    correctAnswer: "He's a taxi driver.",
    questionWords: ["job?", "What's", "his"],
    answerWords: ["a", "He's", "driver.", "taxi"],
  },
  {
    id: "q3",
    img: img3,
    correctQuestion: "What's his job?",
    correctAnswer: "He's a teacher.",
    questionWords: ["his", "job?", "What's"],
    answerWords: ["a", "He's", "teacher."],
  },
  {
    id: "q4",
    img: img4,
    correctQuestion: "What's his job?",
    correctAnswer: "He's a farmer.",
    questionWords: ["his", "What's", "job?"],
    answerWords: ["farmer.", "He's", "a"],
  },
];

const WB_Unit4_Page22_Q2 = () => {
  const [droppedWords, setDroppedWords] = useState({});
  const [showResults, setShowResults] = useState(false);

  const addWord = (zoneId, wordId, type) => {
    if (showResults) return;

    setDroppedWords((prev) => {
      const newDropped = { ...prev };

      // 🔥 منع الخلط (سؤال/جواب)
      if (type === "q" && !zoneId.includes("question")) return prev;
      if (type === "a" && !zoneId.includes("answer")) return prev;

      // احذف الكلمة من أي مكان سابق
      Object.keys(newDropped).forEach((key) => {
        newDropped[key] = (newDropped[key] || []).filter((w) => w !== wordId);
      });

      // أضفها
      const current = newDropped[zoneId] || [];
      newDropped[zoneId] = [...current, wordId];

      return newDropped;
    });
  };
  const removeWord = (zoneId, word) => {
    if (showResults) return;
    setDroppedWords((prev) => ({
      ...prev,
      [zoneId]: prev[zoneId].filter((w) => w !== word),
    }));
  };

  const extractText = (wordId) => wordId.split("|")[1];

  const cleanSentence = (arr) => arr.map(extractText).join(" ");

  const getZoneClass = (zoneId, correctSentence) => {
    if (!showResults) return "border-gray-400";

    const userSentence = cleanSentence(droppedWords[zoneId] || []);
    if (!userSentence) return "border-gray-400";

    return userSentence === correctSentence
      ? "border-gray-400"
      : "border-gray-400";
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
      <div className="div-forall" style={{ marginBottom: "10px",gap:"30px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">D</span>Look and write the question and
          answer.
        </h1>

        <div>
          {exerciseData.map((q, index) => {
            const usedQ = droppedWords[`${q.id}-question`] || [];
            const usedA = droppedWords[`${q.id}-answer`] || [];

            return (
              <div key={q.id} className="space-y-4 flex mb-10">
                <div className="flex items-start gap-4">
                  <span className="text-[22px] text-blue-900 font-semibold">
                    {index + 1}
                  </span>
                  <img src={q.img} className="max-h-32" style={{width:"150px"}} />
                </div>

                <div className="flex justify-around w-full items-center">
                <div className="w-[40%]">

                  {/* Question Word Bank */}
                  <div className="flex flex-wrap gap-2 p-2 rounded">
                    {q.questionWords.map((word, i) => {
                      const id = `${q.id}-q-${i}|${word}`;
                      const isUsed = usedQ.some((w) =>
                        w.startsWith(`${q.id}-q-${i}|`),
                      );
                      return (
                        <div
                          key={id}
                          onClick={() => addWord(`${q.id}-question`, id, "q")}
                          className={`WB-word-bank 
          ${
            isUsed
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-blue-50"
          }
        `}
                        >
                          {word}
                        </div>
                      );
                    })}
                  </div>

                  {/* Question Drop */}
                  <div className="relative">
                    <div
                      className={`flex flex-wrap gap-2 p-2 border-b-2 min-h-[40px] ${getZoneClass(
                        `${q.id}-question`,
                        q.correctQuestion,
                      )}`}
                    >
                      {usedQ.map((word) => (
                        <button
                          key={word}
                          onClick={() => removeWord(`${q.id}-question`, word)}
                          className="hover:text-red-500"
                        >
                          {extractText(word)}
                        </button>
                      ))}
                    </div>

                    {isWrong(`${q.id}-question`, q.correctQuestion) && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        ✕
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-[40%]">
                  {/* Answer Word Bank */}
                  <div className="flex flex-wrap gap-2 p-2 rounded">
                    {q.answerWords.map((word, i) => {
                      const id = `${q.id}-a-${i}|${word}`;
                      const isUsed = usedA.some((w) =>
                        w.startsWith(`${q.id}-a-${i}|`),
                      );
                      return (
                        <div
                          key={id}
                          onClick={() => addWord(`${q.id}-answer`, id, "a")}
                          className={`WB-word-bank 
                        
          ${
            isUsed
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-blue-50"
          }
        `}
                        >
                          {word}
                        </div>
                      );
                    })}
                  </div>

                  {/* Answer Drop */}
                  <div className="relative">
                    <div
                      className={`flex flex-wrap gap-2 p-2 border-b-2 min-h-[40px] ${getZoneClass(
                        `${q.id}-answer`,
                        q.correctAnswer,
                      )}`}
                    >
                      {usedA.map((word) => (
                        <button
                          key={word}
                          onClick={() => removeWord(`${q.id}-answer`, word)}
                          className="hover:text-red-500 transition"
                        >
                          {extractText(word)}
                        </button>
                      ))}
                    </div>

                    {/* ❌ error */}
                    {isWrong(`${q.id}-answer`, q.correctAnswer) && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow border-2 border-white">
                        ✕
                      </div>
                    )}
                  </div>
                </div>{" "}
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

export default WB_Unit4_Page22_Q2;

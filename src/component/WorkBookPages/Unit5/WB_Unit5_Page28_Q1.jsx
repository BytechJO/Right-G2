import React, { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  closestCenter,
} from "@dnd-kit/core";

import placeholderImg from "../../../assets/imgs/test6.png";
import Button from "../button";
import ValidationAlert from "../../Popup/ValidationAlert";

const exerciseData = [
  {
    id: "q1",
    img: placeholderImg,
    correctQuestion: "Dose he like chicken?",
    correctAnswer: "No, he doesn't.",
    questionWords: ["Dose", "like", "chicken?","he"],
    answerWords: ["No,", "doesn't.", "he"],
  },
  {
    id: "q2",
    img: placeholderImg,
    correctQuestion: "Dose she like fruit?",
    correctAnswer: "No, she doesn't.",
    questionWords: ["she", "Dose", "fruit?","like"],
    answerWords: ["No,", "she", "doesn't."],
  },
  {
    id: "q3",
    img: placeholderImg,
    correctQuestion: "Dose he like cheese?",
    correctAnswer: "No, he doesn't",
    questionWords: ["cheese?", "like", "Dose","he"],
    answerWords: ["No,", "he", "doesn't"],
  },
  {
    id: "q4",
    img: placeholderImg,
    correctQuestion: "Dose she like tea?",
    correctAnswer: "Yes, she does",
    questionWords: ["she", "Dose", "like","tea?"],
    answerWords: ["Yes,", "she", "does"],
  },
];

const DraggableWord = ({ id, text }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 100,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="px-3 py-1 bg-white border rounded shadow cursor-grab active:cursor-grabbing"
    >
      {text}
    </div>
  );
};

const DropZone = ({ id, children, className, showError }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="relative">
      <div
        ref={setNodeRef}
        className={`flex flex-wrap gap-2 p-2 border-b-2 ${className} min-h-[40px]`}
      >
        {children || <span className="text-transparent">.</span>}
      </div>

      {/* ❌ Error Icon */}
      {showError && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow border-2 border-white">
          ✕
        </div>
      )}
    </div>
  );
};

const WB_Unit5_Page28_Q1 = () => {
  const [droppedWords, setDroppedWords] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleDragEnd = (event) => {
    const { over, active } = event;
    if (!over) return;

    const wordId = active.id;
    const dropZoneId = over.id;

    setDroppedWords((prev) => {
      const newDropped = { ...prev };

      Object.keys(newDropped).forEach((key) => {
        newDropped[key] = newDropped[key].filter((w) => w !== wordId);
      });

      const currentWords = newDropped[dropZoneId] || [];
      newDropped[dropZoneId] = [...currentWords, wordId];

      return newDropped;
    });

    setShowResults(false);
  };

  const removeWord = (zoneId, word) => {
    setDroppedWords((prev) => ({
      ...prev,
      [zoneId]: prev[zoneId].filter((w) => w !== word),
    }));
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
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      <div className="main-container-component">
        <div
          className="div-forall"
          style={{ gap: "20px", marginBottom: "50px" }}
        >
          <h1 className="WB-header-title-page8">
            <span className="WB-ex-A">C</span>Look, read, and write.
          </h1>

          <div
            className="grid gap-10"
            style={{ gridTemplateColumns: "1fr 1fr" }}
          >
            {exerciseData.map((q, index) => {
              const usedQ = droppedWords[`${q.id}-question`] || [];
              const usedA = droppedWords[`${q.id}-answer`] || [];

              return (
                <div key={q.id} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span>{index + 1}</span>
                    <img src={q.img} className="max-h-32" />
                  </div>

                  {/* Question Word Bank */}
                  <div className="flex flex-wrap gap-2 p-2 border rounded h-12">
                    {q.questionWords.map((word, i) => {
                      const id = `${q.id}-q-${i}|${word}`;
                      if (usedQ.includes(id)) return null;

                      return <DraggableWord key={id} id={id} text={word} />;
                    })}
                  </div>

                  {/* Question Drop */}
                  <DropZone
                    id={`${q.id}-question`}
                    className={getZoneClass(
                      `${q.id}-question`,
                      q.correctQuestion,
                    )}
                    showError={isWrong(`${q.id}-question`, q.correctQuestion)}
                  >
                    {usedQ.map((word) => (
                      <button
                        key={word}
                        onClick={() => removeWord(`${q.id}-question`, word)}
                      >
                        {extractText(word)}
                      </button>
                    ))}
                  </DropZone>

                  {/* Answer Word Bank */}
                  <div className="flex flex-wrap gap-2 p-3 border rounded h-12">
                    {q.answerWords.map((word, i) => {
                      const id = `${q.id}-a-${i}|${word}`;
                      if (usedA.includes(id)) return null;

                      return <DraggableWord key={id} id={id} text={word} />;
                    })}
                  </div>

                  {/* Answer Drop */}
                  <DropZone
                    id={`${q.id}-answer`}
                    className={getZoneClass(`${q.id}-answer`, q.correctAnswer)}
                    showError={isWrong(`${q.id}-answer`, q.correctAnswer)}
                  >
                    {usedA.map((word) => (
                      <button
                        key={word}
                        onClick={() => removeWord(`${q.id}-answer`, word)}
                      >
                        {extractText(word)}
                      </button>
                    ))}
                  </DropZone>
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
    </DndContext>
  );
};

export default WB_Unit5_Page28_Q1;

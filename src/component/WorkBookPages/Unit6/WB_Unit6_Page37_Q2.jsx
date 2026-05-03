import React, { useState, useEffect } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img from "../../../assets/imgs/test6.png";

const SentenceBuilder = ({
  id,
  scrambled,
  correct,
  onUpdate,
  showResult,
  src,
  forceAnswer,
}) => {
  // ✅ البنك ثابت
  const [availableWords] = useState(
    scrambled.split(" ").map((word, index) => ({
      id: `${id}-word-${index}`,
      text: word,
    })),
  );

  const [chosenWords, setChosenWords] = useState([]);

  // ✅ force answer
  useEffect(() => {
    if (forceAnswer) {
      const correctWords = correct.replace(/[,!?]/g, "").split(" ");

      const mappedWords = correctWords.map((wordText) => {
        // 🔥 دور على نفس الكلمة بالبنك وخد ID تبعها
        return availableWords.find((w) => w.text === wordText);
      });

      setChosenWords(mappedWords.filter(Boolean));
    }
  }, [forceAnswer, correct, availableWords]);

  // ✅ هل الكلمة مستخدمة؟
  const isUsed = (wordId) => {
    return chosenWords.some((w) => w.id === wordId);
  };

  // ✅ إضافة كلمة بدون تكرار
  const handleWordClick = (wordToAdd) => {
    if (showResult || forceAnswer) return;
    if (isUsed(wordToAdd.id)) return;

    const newChosenWords = [...chosenWords, wordToAdd];
    setChosenWords(newChosenWords);

    onUpdate(newChosenWords.map((w) => w.text).join(" "));
  };

  // ✅ حذف كلمة (ترجع usable تلقائي)
  const handleRemoveWord = (wordToRemove) => {
    const newChosenWords = chosenWords.filter((w) => w.id !== wordToRemove.id);

    setChosenWords(newChosenWords);

    onUpdate(newChosenWords.map((w) => w.text).join(" "));
  };

  const isIncorrectAnswer = () => {
    if (!showResult) return false;

    const userAnswer = chosenWords
      .map((w) => w.text)
      .join(" ")
      .replace(/[,!?]/g, "")
      .trim()
      .toLowerCase();

    const correctAnswer = correct.replace(/[,!?]/g, "").trim().toLowerCase();

    if (!userAnswer) return false;

    return userAnswer !== correctAnswer;
  };

  const getBoxClassName = () => {
    if (!showResult) return "border-gray-300 bg-white";

    const userAnswer = chosenWords.map((w) => w.text).join(" ");
    if (!userAnswer) return "border-gray-300 bg-white";

    return "border-gray-300 bg-white";
  };

  return (
    <div className="space-y-3">
      {/* WORD BANK */}{" "}
      <div className="flex flex-wrap gap-2 p-3 rounded-lg min-h-[50px] items-center">
        {availableWords.map((word) => {
          const used = isUsed(word.id);

          return (
            <button
              key={word.id}
              onClick={() => {
                if (!used) handleWordClick(word);
              }}
              className={`WB-word-bank 
            ${
              used
                ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                : "bg-white border-blue-900 hover:bg-blue-100 cursor-pointer"
            }`}
            style={{padding:"4px 10px"}}
            >
              {word.text}
            </button>
          );
        })}
      </div>
      {/* ANSWER */}
      <div className="relative">
        <div
          className={`flex flex-wrap gap-2 p-3 border-2 rounded-lg min-h-[60px] ${getBoxClassName()} ${isIncorrectAnswer() && "border-red-500"}`}
        >
          {chosenWords.map((word) => (
            <button
              key={word.id}
              onClick={() => {
                if (showResult || forceAnswer) return;
                if (!showResult || !forceAnswer) {
                  return handleRemoveWord(word);
                }
              }}
              className="px-1 py-1 rounded-md cursor-pointer hover:text-red-500"
            >
              {word.text}
            </button>
          ))}
        </div>

        {isIncorrectAnswer() && (
          <div className="absolute top-1/2 right-3 -translate-y-1/2 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shadow-md border-2 border-white">
            <span className="text-white text-sm font-bold">✕</span>
          </div>
        )}
      </div>
    </div>
  );
};

const WB_Unit6_Page37_Q2 = () => {
  const exerciseSentences = [
    {
      id: "s1",
      scrambled: "I math at o'clock morning ten . in the have class",
      correct: "I have math class at ten o'clock in the morning .",
    },
    {
      id: "s2",
      scrambled: "sleepy was at nine I thirty .",
      correct: "I was sleepy at nine thirty .",
    },
    {
      id: "s3",
      scrambled: "morning . the She teeth brushes in her",
      correct: "She brushes her teeth in the morning .",
    },
  ];

  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const handleAnswerUpdate = (id, answer) => {
    if (showAnswers || showResults) return;

    setUserAnswers((prev) => ({ ...prev, [id]: answer }));
    if (showResults) {
      setShowResults(false);
      setScore(null);
    }
  };

  const checkAnswers = () => {
    if (showAnswers || showResults) return;
    const unanswered = exerciseSentences.filter(
      (sentence) =>
        !userAnswers[sentence.id] || userAnswers[sentence.id].trim() === "",
    );

    if (unanswered.length > 0) {
      ValidationAlert.info(
        "Please complete all sentences before checking your answers.",
      );
      return;
    }

    setShowResults(true);

    let correctCount = 0;
    exerciseSentences.forEach((sentence) => {
      const userWords = userAnswers[sentence.id]
        .replace(/[.,!?]/g, "")
        .trim()
        .split(/\s+/);
      const correctWords = sentence.correct
        .replace(/[.,!?]/g, "")
        .trim()
        .split(/\s+/);

      const isCorrect =
        userWords.length === correctWords.length &&
        userWords.every((word, idx) => word === correctWords[idx]);

      if (isCorrect) correctCount++;
    });

    setScore({ correct: correctCount, total: exerciseSentences.length });

    if (correctCount === exerciseSentences.length) {
      ValidationAlert.success(
        `Score: ${correctCount}/${exerciseSentences.length}`,
      );
    } else if (correctCount > 0) {
      ValidationAlert.warning(
        `Score: ${correctCount}/${exerciseSentences.length}`,
      );
    } else {
      ValidationAlert.error(
        `Score: ${correctCount}/${exerciseSentences.length}`,
      );
    }
  };

  const handleStartAgain = () => {
    setUserAnswers({});
    setShowResults(false);
    setScore(null);
    setShowAnswers(false);
    setResetKey((prevKey) => prevKey + 1);
  };

  const handleShowAnswer = () => {
    setShowAnswers(true);
    const allAnswers = {};
    exerciseSentences.forEach((sentence) => {
      allAnswers[sentence.id] = sentence.correct;
    });
    setUserAnswers(allAnswers);
    setShowResults(true);
    setScore({
      correct: exerciseSentences.length,
      total: exerciseSentences.length,
    });
  };

  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"50px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">J</span>Unscramble and write.
        </h1>

        <div className="space-y-4 flex flex-col">
          {exerciseSentences.map((sentence, index) => (
            <div
              key={sentence.id}
              className="flex items-start gap-4 p-y-4 p-x-3 rounded-xl transition-all hover:bg-gray-50"
            >
              <span className="font-bold text-blue-600 text-xl pt-2">
                {index + 1}.
              </span>
              <div className="flex-1">
                <SentenceBuilder
                  key={`${sentence.id}-${resetKey}`}
                  id={sentence.id}
                  scrambled={sentence.scrambled}
                  correct={sentence.correct}
                  onUpdate={(answer) => handleAnswerUpdate(sentence.id, answer)}
                  showResult={showResults}
                  src={img}
                  forceAnswer={showAnswers}
                />
              </div>
            </div>
          ))}
        </div>
      
      </div>  <div>
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleStartAgain}
            checkAnswers={checkAnswers}
          />
        </div>
    </div>
  );
};

export default WB_Unit6_Page37_Q2;

import React, { useState } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 13/Ex I 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 13/Ex I 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 13/Ex I 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 13/Ex I 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 13/Ex I 5.svg";

const SentenceBuilder = ({
  id,
  scrambled,
  correct,
  onUpdate,
  showResult,
  src,
  forceAnswer,
  isWrong,
}) => {
  const [availableWords, setAvailableWords] = useState(
    scrambled
      .split(" ")
      .map((word, index) => ({ id: `${id}-word-${index}`, text: word })),
  );

  const [chosenWords, setChosenWords] = useState([]);

  React.useEffect(() => {
    if (forceAnswer) {
      const words = correct
        .replace(/[.,!?]/g, "")
        .split(" ")
        .map((word, index) => ({
          id: `${id}-word-${index}`,
          text: word,
        }));
      setChosenWords(words);
      setAvailableWords([]); // إزالة كل الكلمات المتاحة
    }
  }, [forceAnswer, correct, id]);

  const handleWordClick = (wordToAdd) => {
    const newChosenWords = [...chosenWords, wordToAdd];
    setChosenWords(newChosenWords);

    setAvailableWords(availableWords.filter((w) => w.id !== wordToAdd.id));
    onUpdate(newChosenWords.map((w) => w.text).join(" "));
  };

  const handleRemoveWord = (wordToRemove) => {
    // إزالة الكلمة من جملة المستخدم
    const newChosenWords = chosenWords.filter((w) => w.id !== wordToRemove.id);
    setChosenWords(newChosenWords);

    // إعادة الكلمة إلى قائمة الكلمات المتاحة (مع الحفاظ على الترتيب الأصلي إن أمكن)
    setAvailableWords((prev) =>
      [...prev, wordToRemove].sort((a, b) => a.id.localeCompare(b.id)),
    );

    // إعلام المكون الأب بالجملة الجديدة
    onUpdate(newChosenWords.map((w) => w.text).join(" "));
  };

  const getBoxClassName = () => {
    if (!showResult) {
      return "border-gray-300 bg-white";
    }
    const userAnswer = chosenWords.map((w) => w.text).join(" ");
    if (userAnswer.length === 0) {
      return "border-gray-300 bg-white";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 p-3 bg-gray-100 rounded-lg min-h-[50px] items-center">
        <img src={src} className="max-w-24 max-h-24 object-contain" />
        {availableWords.length > 0 ? (
          availableWords.map((word) => (
            <button
              key={word.id}
              onClick={() => handleWordClick(word)}
              className="px-3 py-1 bg-white border border-gray-400 rounded-md shadow-sm hover:bg-blue-100 hover:border-blue-500 transition-all text-gray-800 font-medium"
            >
              {word.text}
            </button>
          ))
        ) : (
          <p className="text-gray-400 text-sm"></p>
        )}
      </div>

      <div className="relative">
        <div
          className={`flex flex-wrap gap-2 p-3 border-2 rounded-lg min-h-[60px] transition-colors duration-300 items-center ${getBoxClassName()}`}
        >
          {chosenWords.map((word) => (
            <button
              key={word.id}
              onClick={() => handleRemoveWord(word)}
              className="px-3 py-1 bg-blue-600 text-white rounded-md shadow-sm cursor-pointer"
              title="Click to remove"
            >
              {word.text}
            </button>
          ))}
        </div>

        {isWrong && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white w-7 h-7 flex items-center justify-center rounded-full text-base font-bold shadow-lg border-2 border-white">
            ✕
          </div>
        )}
      </div>
    </div>
  );
};

const WB_Unit2_Page13_Q1 = () => {
  const exerciseSentences = [
    {
      id: "s1",
      scrambled: "are horses Those black",
      correct: "Those are black horses.",
      isExample: true, // 👈 هذا المهم
      img: img1,
    },
    {
      id: "s2",
      scrambled: "small This rabbit is a",
      correct: "This is a small rabbit.",
      img: img2,
    },
    {
      id: "s3",
      scrambled: "ducks These are",
      correct: "These are ducks.",
      img: img3,
    },
    {
      id: "s4",
      scrambled: "sun That the is",
      correct: "That is the sun.,",
      img: img4,
    },
    {
      id: "s5",
      scrambled: "white Those clouds are",
      correct: "Those are white clouds.",
      img: img5,
    },
  ];

  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  const handleAnswerUpdate = (id, answer) => {
    setUserAnswers((prev) => ({ ...prev, [id]: answer }));
    if (showResults) {
      setShowResults(false);
      setScore(null);
    }
  };

  const checkAnswers = () => {
    const unanswered = exerciseSentences.filter(
      (sentence) =>
        !userAnswers[sentence.id] || userAnswers[sentence.id].trim() === "",
    );

    if (unanswered.length > 0) {
      ValidationAlert.info("Please complete all sentences first!");
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

  const [showAnswers, setShowAnswers] = useState(false);

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
    <div key={resetKey} className="main-container-component">
      <div className="div-forall">
        <h1 className="WB-header-title-page8">
          {" "}
          <span className="WB-ex-A">I</span>Look, unscramble, and write.
        </h1>

        <div className="space-y-4">
          {exerciseSentences.map((sentence, index) => (
            <div
              key={sentence.id}
              className="flex items-start gap-4 p-4 rounded-xl transition-all hover:bg-gray-50"
            >
              <span className="font-bold text-blue-600 text-xl pt-2">
                {index + 1}.
              </span>
              <div className="flex-1">
                <SentenceBuilder
                  id={sentence.id}
                  scrambled={sentence.scrambled}
                  correct={sentence.correct}
                  onUpdate={(answer) => handleAnswerUpdate(sentence.id, answer)}
                  showResult={showResults}
                  src={sentence.img}
                  forceAnswer={showAnswers}
                  isWrong={
                    showResults &&
                    (() => {
                      const userWords = (userAnswers[sentence.id] || "")
                        .replace(/[.,!?]/g, "")
                        .trim()
                        .split(/\s+/);

                      const correctWords = sentence.correct
                        .replace(/[.,!?]/g, "")
                        .trim()
                        .split(/\s+/);

                      return !(
                        userWords.length === correctWords.length &&
                        userWords.every(
                          (word, idx) => word === correctWords[idx],
                        )
                      );
                    })()
                  }
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-20">
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

export default WB_Unit2_Page13_Q1;

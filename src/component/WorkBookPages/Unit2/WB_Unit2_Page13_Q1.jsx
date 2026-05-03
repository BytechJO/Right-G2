import React, { useState, useEffect } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 13/Ex I 2.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 13/Ex I 3.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 13/Ex I 4.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 13/Ex I 5.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 13/Ex I 6.svg";

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
    scrambled.split(" ").map((word, index) => ({
      id: `${id}-word-${index}`,
      text: word,
      used: false,
    })),
  );

  const [chosenWords, setChosenWords] = useState([]);

  useEffect(() => {
    if (forceAnswer) {
      const words = correct
        .replace(/[.,!?]/g, "")
        .split(" ")
        .map((word, index) => ({
          id: `${id}-word-${index}`,
          text: word,
          used: true,
        }));

      setChosenWords(words);
      setAvailableWords((prev) => prev.map((w) => ({ ...w, used: true })));
    } else {
      // ✅ reset لما Start Again
      setChosenWords([]);

      setAvailableWords(
        scrambled.split(" ").map((word, index) => ({
          id: `${id}-word-${index}`,
          text: word,
          used: false,
        })),
      );
    }
  }, [forceAnswer, correct, id, scrambled]);

  const handleWordClick = (wordToAdd) => {
    if (wordToAdd.used) return;

    const newChosenWords = [...chosenWords, wordToAdd];
    setChosenWords(newChosenWords);

    setAvailableWords((prev) =>
      prev.map((w) => (w.id === wordToAdd.id ? { ...w, used: true } : w)),
    );

    onUpdate(newChosenWords.map((w) => w.text).join(" "));
  };

  const handleRemoveWord = (wordToRemove) => {
    if (forceAnswer || showResult) return;
    const newChosenWords = chosenWords.filter((w) => w.id !== wordToRemove.id);
    setChosenWords(newChosenWords);

    setAvailableWords((prev) =>
      prev.map((w) => (w.id === wordToRemove.id ? { ...w, used: false } : w)),
    );

    onUpdate(newChosenWords.map((w) => w.text).join(" "));
  };

  return (
    <div className="space-y-1 w-full">
      {/* WORD BANK */}
      <div className="flex gap-2 rounded-lg min-h-[50px] items-center">
        <img src={src} className="object-contain" style={{ height: "120px" }} />
        <div className="flex flex-col gap-5 w-full">
          <div  className="flex gap-5 w-full">
            {availableWords.map((word) => (
              <button
                key={word.id}
                disabled={word.used}
                onClick={() => handleWordClick(word)}
                className={`WB-word-bank
              ${
                word.used
                  ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed opacity-50"
                  : "bg-white text-gray-800 border-gray-400 hover:bg-blue-100 hover:border-blue-500"
              }  
            `}
              >
                {word.text}
              </button>
            ))}
          </div>
          {/* ANSWER BOX */}
          <div className="relative">
            <div
              className={`flex flex-wrap gap-2 p-3 border-2 rounded-lg min-h-[60px] items-center ${isWrong ? "border-red-500" : "border-gray-400"}`}
            >
              {chosenWords.map((word) => (
                <button
                  key={word.id}
                  onClick={() => handleRemoveWord(word)}
                  className="px-1 py-1 cursor-pointer hover:text-red-500"
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
      correct: "That is the sun.",
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
  const [showAnswers, setShowAnswers] = useState(false);
const [resetKey, setResetKey] = useState(0);
  const handleShowAnswer = () => {
    const filledAnswers = {};

    exerciseSentences.forEach((sentence) => {
      filledAnswers[sentence.id] = sentence.correct
        .replace(/[.,!?]/g, "")
        .trim();
    });

    setUserAnswers(filledAnswers);
    setShowAnswers(true);
    setShowResults(true);
  };
  const handleAnswerUpdate = (id, answer) => {
    setUserAnswers((prev) => ({ ...prev, [id]: answer }));
  };

  const checkAnswers = () => {
    if (showAnswers || showResults) return;
    // ✅ أول شي: تحقق من الفراغ
    const hasEmpty = exerciseSentences.some(
      (sentence) =>
        !userAnswers[sentence.id] || userAnswers[sentence.id].trim() === "",
    );

    if (hasEmpty) {
      ValidationAlert.info("Please answer all questions first!");
      return; // ❌ وقف هون
    }

    // ✅ إذا كله معبّي، كمل التصحيح
    let correctCount = 0;

    exerciseSentences.forEach((sentence) => {
      const user = userAnswers[sentence.id].replace(/[.,!?]/g, "").trim();

      const correct = sentence.correct.replace(/[.,!?]/g, "").trim();

      if (user === correct) correctCount++;
    });

    const total = exerciseSentences.length;

    if (correctCount === total) {
      ValidationAlert.success(`Score: ${correctCount}/${total}`);
    } else if (correctCount > 0) {
      ValidationAlert.warning(`Score: ${correctCount}/${total}`);
    } else {
      ValidationAlert.error(`Score: ${correctCount}/${total}`);
    }

    setShowResults(true);
  };

 const handleStartAgain = () => {
  setUserAnswers({});
  setShowResults(false);
  setShowAnswers(false);
  setResetKey((prev) => prev + 1); // ⭐ trigger
};
  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"25px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">I</span>
          Look, unscramble, and write.
        </h1>

        <div className="space-y-4">
          {exerciseSentences.map((sentence, index) => (
            <div key={sentence.id} className="flex items-start gap-4 p-4">
              <span className="font-bold text-blue-900 text-xl">
                {index + 1}.
              </span>

          <SentenceBuilder
  key={sentence.id + resetKey}
                id={sentence.id}
                scrambled={sentence.scrambled}
                correct={sentence.correct}
                onUpdate={(ans) => handleAnswerUpdate(sentence.id, ans)}
                showResult={showResults}
                src={sentence.img}
                forceAnswer={showAnswers} // ✅ هاي المهمة
                isWrong={
                  showResults &&
                  userAnswers[sentence.id] !==
                    sentence.correct.replace(/[.,!?]/g, "")
                }
              />
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Button
            handleStartAgain={handleStartAgain}
            handleShowAnswer={handleShowAnswer} // ✅
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};

export default WB_Unit2_Page13_Q1;

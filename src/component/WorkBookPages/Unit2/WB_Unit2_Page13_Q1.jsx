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
    scrambled.split(" ").map((word, index) => ({
      id: `${id}-word-${index}`,
      text: word,
      used: false,
    }))
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
          used: true,
        }));

      setChosenWords(words);

      setAvailableWords((prev) =>
        prev.map((w) => ({ ...w, used: true }))
      );
    }
  }, [forceAnswer, correct, id]);

  const handleWordClick = (wordToAdd) => {
    if (wordToAdd.used) return;

    const newChosenWords = [...chosenWords, wordToAdd];
    setChosenWords(newChosenWords);

    setAvailableWords((prev) =>
      prev.map((w) =>
        w.id === wordToAdd.id ? { ...w, used: true } : w
      )
    );

    onUpdate(newChosenWords.map((w) => w.text).join(" "));
  };

  const handleRemoveWord = (wordToRemove) => {
    const newChosenWords = chosenWords.filter(
      (w) => w.id !== wordToRemove.id
    );
    setChosenWords(newChosenWords);

    setAvailableWords((prev) =>
      prev.map((w) =>
        w.id === wordToRemove.id ? { ...w, used: false } : w
      )
    );

    onUpdate(newChosenWords.map((w) => w.text).join(" "));
  };

  return (
    <div className="space-y-3 w-full">
      {/* WORD BANK */}
      <div className="flex flex-wrap gap-2 p-3 bg-gray-100 rounded-lg min-h-[50px] items-center">
        <img src={src} className="object-contain" style={{ height: "100px" }} />

        {availableWords.map((word) => (
          <button
            key={word.id}
            disabled={word.used}
            onClick={() => handleWordClick(word)}
            className={`px-3 py-1 border rounded-md shadow-sm transition-all font-medium
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
        <div className="flex flex-wrap gap-2 p-3 border-2 border-gray-400 rounded-lg min-h-[60px] items-center">
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

  const handleAnswerUpdate = (id, answer) => {
    setUserAnswers((prev) => ({ ...prev, [id]: answer }));
  };

  const checkAnswers = () => {
    let correctCount = 0;

    exerciseSentences.forEach((sentence) => {
      const user = (userAnswers[sentence.id] || "").replace(/[.,!?]/g, "").trim();
      const correct = sentence.correct.replace(/[.,!?]/g, "").trim();

      if (user === correct) correctCount++;
    });

    const total = exerciseSentences.length;

    if (correctCount === total) {
      ValidationAlert.success(`Score: ${correctCount}/${total}`);
    } else {
      ValidationAlert.error(`Score: ${correctCount}/${total}`);
    }

    setShowResults(true);
  };

  const handleStartAgain = () => {
    setUserAnswers({});
    setShowResults(false);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall">
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">I</span>
          Look, unscramble, and write.
        </h1>

        <div className="space-y-4">
          {exerciseSentences.map((sentence, index) => (
            <div key={sentence.id} className="flex items-start gap-4 p-4">
              <span className="font-bold text-blue-600 text-xl">
                {index + 1}.
              </span>

              <SentenceBuilder
                id={sentence.id}
                scrambled={sentence.scrambled}
                correct={sentence.correct}
                onUpdate={(ans) => handleAnswerUpdate(sentence.id, ans)}
                showResult={showResults}
                src={sentence.img}
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
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};

export default WB_Unit2_Page13_Q1;
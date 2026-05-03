import React, { useState } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 51/Ex B 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 51/Ex B 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 51/Ex B 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 51/Ex B 4.svg";

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

  // 🔥 الكلمات المستخدمة
  const usedWords = new Set(chosenWords.map((w) => w.id));

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
      setAvailableWords(words); // 👈 خليهم موجودين
    }
  }, [forceAnswer, correct, id]);

  const handleWordClick = (wordToAdd) => {
    const newChosenWords = [...chosenWords, wordToAdd];
    setChosenWords(newChosenWords);

    // ❌ ما نحذف الكلمة من الورد بانك

    onUpdate(newChosenWords.map((w) => w.text).join(" "));
  };

  const handleRemoveWord = (wordToRemove) => {
    if (showResult || forceAnswer) return;
    const newChosenWords = chosenWords.filter((w) => w.id !== wordToRemove.id);
    setChosenWords(newChosenWords);

    onUpdate(newChosenWords.map((w) => w.text).join(" "));
  };

  const getBoxClassName = () => {
    if (!showResult) return "border-gray-300 bg-white";

    const userAnswer = chosenWords.map((w) => w.text).join(" ");

    if (!userAnswer) return "border-gray-300 bg-white";

    const userWords = userAnswer
      .replace(/[.,!?]/g, "")
      .trim()
      .split(/\s+/);

    const correctWords = correct
      .replace(/[.,!?]/g, "")
      .trim()
      .split(/\s+/);

    const isCorrect =
      userWords.length === correctWords.length &&
      userWords.every((word, idx) => word === correctWords[idx]);

    return isCorrect ? "border-blue-400 bg-blue-50" : "border-red-500";
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 border-2 border-gray-500 rounded-[20px] min-h-[50px] items-center">
        <img src={src} className="object-contain" style={{ height: "150px" }} />

        <div className="flex flex-col justify-center gap-4 w-80 p-3">
          <h5 className="text-lg">{scrambled.split(" ").join("/")}</h5>

          <div className="flex gap-2 flex-wrap">
            {availableWords.map((word) => {
              const isUsed = usedWords.has(word.id);

              return (
                <button
                  key={word.id}
                  onClick={() => {
                    if (!isUsed) handleWordClick(word);
                  }}
                  disabled={isUsed}
                  className={`WB-word-bank 
                    ${
                      isUsed
                        ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed opacity-50"
                        : "bg-white text-gray-800 border-gray-400 hover:bg-blue-100 hover:border-blue-500"
                    }
                  `}
                >
                  {word.text}
                </button>
              );
            })}
          </div>
          <div className="relative">
            <div
              className={`flex flex-wrap gap-2 px-3 border-2 border-dashed rounded-lg h-[40px] transition-colors duration-300 items-center ${getBoxClassName()}`}
            >
              {chosenWords.map((word) => (
                <button
                  key={word.id}
                  onClick={() => handleRemoveWord(word)}
                  className="px-1 py-1 cursor-pointer hover:text-red-500"
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

const WB_Unit9_Page51_Q2 = () => {
  const exerciseSentences = [
    {
      id: "s1",
      scrambled: "are they soccer playing",
      correct: "they are playing soccer",
    },
    {
      id: "s2",
      scrambled: "are we chess playing",
      correct: "we are playing chess",
    },
    { id: "s3", scrambled: "is she helping", correct: "she is helping" },
    {
      id: "s4",
      scrambled: "is she clothes washing",
      correct: "she is washing clothes",
    },
  ];

  const images = [img1, img2, img3, img4];

  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);

  const handleAnswerUpdate = (id, answer) => {
    if (showResults || showAnswers) return;
    setUserAnswers((prev) => ({ ...prev, [id]: answer }));
    if (showResults) {
      setShowResults(false);
      setScore(null);
    }
  };

  const checkAnswers = () => {
    if (showResults || showAnswers) return;
    const unanswered = exerciseSentences.filter(
      (s) => !userAnswers[s.id] || userAnswers[s.id].trim() === "",
    );

    if (unanswered.length > 0) {
      ValidationAlert.info("Please complete all sentences first!");
      return;
    }

    setShowResults(true);

    let correctCount = 0;

    exerciseSentences.forEach((s) => {
      const userWords = (userAnswers[s.id] || "")
        .replace(/[.,!?]/g, "")
        .trim()
        .split(/\s+/);

      const correctWords = s.correct
        .replace(/[.,!?]/g, "")
        .trim()
        .split(/\s+/);

      const isCorrect =
        userWords.length === correctWords.length &&
        userWords.every((w, i) => w === correctWords[i]);

      if (isCorrect) correctCount++;
    });

    setScore({ correct: correctCount, total: exerciseSentences.length });

    if (correctCount === exerciseSentences.length)
      ValidationAlert.success(
        `Score: ${correctCount}/${exerciseSentences.length}`,
      );
    else if (correctCount > 0)
      ValidationAlert.warning(
        `Score: ${correctCount}/${exerciseSentences.length}`,
      );
    else
      ValidationAlert.error(
        `Score: ${correctCount}/${exerciseSentences.length}`,
      );
  };

  const handleStartAgain = () => {
    setUserAnswers({});
    setShowResults(false);
    setScore(null);
    setShowAnswers(false);
    setResetKey((prev) => prev + 1);
  };

  const handleShowAnswer = () => {
    setShowAnswers(true);
    const allAnswers = {};
    exerciseSentences.forEach((s) => {
      allAnswers[s.id] = s.correct;
    });
    setUserAnswers(allAnswers);
    setShowResults(true);
    setScore({
      correct: exerciseSentences.length,
      total: exerciseSentences.length,
    });
  };

  const isAnswerWrong = (sentence) => {
    if (!showResults) return false;

    const userAnswer = userAnswers[sentence.id] || "";

    const userWords = userAnswer
      .replace(/[.,!?]/g, "")
      .trim()
      .split(/\s+/);

    const correctWords = sentence.correct
      .replace(/[.,!?]/g, "")
      .trim()
      .split(/\s+/);

    const isCorrect =
      userWords.length === correctWords.length &&
      userWords.every((w, i) => w === correctWords[i]);

    return userAnswer && !isCorrect;
  };
  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ marginBottom: "10px",gap:"20px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">B</span>Look and write sentences.
        </h1>

        <div className="space-y-4">
          {exerciseSentences.map((sentence, index) => (
            <div key={sentence.id} className="flex items-start gap-4">
              <span className="font-bold text-blue-900 text-xl pt-2">
                {index + 1}.
              </span>

              <div className="flex-1">
                <SentenceBuilder
                  key={sentence.id + resetKey}
                  id={sentence.id}
                  scrambled={sentence.scrambled}
                  correct={sentence.correct}
                  onUpdate={(answer) => handleAnswerUpdate(sentence.id, answer)}
                  showResult={showResults}
                  src={images[index]}
                  forceAnswer={showAnswers}
                  isWrong={isAnswerWrong(sentence)}
                />
              </div>
            </div>
          ))}
        </div>

        <div>
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

export default WB_Unit9_Page51_Q2;

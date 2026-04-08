import React, { useState, useEffect } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img from "../../../assets/imgs/test6.png";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 30/Ex G 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 30/Ex G 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 30/Ex G 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 30/Ex G 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 30/Ex G 5.svg";

const SentenceBuilder = ({
  id,
  scrambled,
  correct,
  onUpdate,
  showResult,
  src,
  forceAnswer,
}) => {
  // ✅ خلي البنك ثابت (ما يتغير)
  const [availableWords] = useState(
    scrambled.split(" ").map((word, index) => ({
      id: `${id}-word-${index}`,
      text: word,
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
        }));
      setChosenWords(words);
    }
  }, [forceAnswer, correct, id]);

  // ✅ تحديد إذا الكلمة مستخدمة
  const isUsed = (wordId) => {
    return chosenWords.some((w) => w.id === wordId);
  };

  // ✅ إضافة كلمة (بدون تكرار)
  const handleWordClick = (wordToAdd) => {
    if (isUsed(wordToAdd.id)) return;

    const newChosenWords = [...chosenWords, wordToAdd];
    setChosenWords(newChosenWords);

    onUpdate(newChosenWords.map((w) => w.text).join(" "));
  };

  // ✅ حذف كلمة (ترجع تشتغل تلقائي)
  const handleRemoveWord = (wordToRemove) => {
    const newChosenWords = chosenWords.filter((w) => w.id !== wordToRemove.id);

    setChosenWords(newChosenWords);

    onUpdate(newChosenWords.map((w) => w.text).join(" "));
  };

  const isWrong = () => {
    if (!showResult) return false;

    const userAnswer = chosenWords.map((w) => w.text).join(" ");
    if (!userAnswer) return false;

    const cleanUser = userAnswer.replace(/[.,!?]/g, "").trim();
    const cleanCorrect = correct.replace(/[.,!?]/g, "").trim();

    return cleanUser !== cleanCorrect;
  };

  return (
    <div className="space-y-3">
      {/* WORD BANK */}{" "}
      <div className="flex flex-wrap gap-2 p-3 bg-gray-100 rounded-lg min-h-[50px] items-center"  style={{justifyContent:"space-between"}}>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
          {availableWords.map((word) => {
            const used = isUsed(word.id);

            return (
              <button
                key={word.id}
                onClick={() => {
                  if (!used) handleWordClick(word);
                }}
                className={`px-3 py-1 border rounded-md transition
            ${
              used
                ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                : "bg-white border-gray-400 hover:bg-blue-100 cursor-pointer"
            }`}
              >
                {word.text}
              </button>
            );
          })}</div>
          <div className="relative w-90">
            <div className="flex flex-wrap gap-2 p-3 border-2 border-gray-500 rounded-lg min-h-[60px]">
              {chosenWords.map((word) => (
                <button
                  key={word.id}
                  onClick={() => handleRemoveWord(word)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md"
                >
                  {word.text}
                </button>
              ))}
            </div>

            {isWrong() && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow border-2 border-white">
                ✕
              </div>
            )}
          </div>
        </div>
        <img src={src} style={{height:"120px"}} />
      </div>
      {/* ANSWER */}
    </div>
  );
};

const WB_Unit5_Page30_Q1 = () => {
  const exerciseSentences = [
    {
      id: "s1",
      scrambled: "He likes fish.",
      correct: "He doesn't like fish.",
      img: img2,
    },
    {
      id: "s2",
      scrambled: "He doesn’t like chicken.",
      correct: "He doesn't like meat.",
      img: img3,
    },
    { id: "s3", scrambled: "I like meat.", correct: "I like stew.", img: img4 },
    {
      id: "s4",
      scrambled: "He likes rice.",
      correct: "He doesn't like rice.",
      img: img5,
    },
  ];

  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);

  const handleAnswerUpdate = (id, answer) => {
    setUserAnswers((prev) => ({ ...prev, [id]: answer }));
    if (showResults) {
      setShowResults(false);
      setScore(null);
    }
  };

  const checkAnswers = () => {
    const unanswered = exerciseSentences.filter(
      (s) => !userAnswers[s.id] || userAnswers[s.id].trim() === "",
    );

    if (unanswered.length > 0) {
      ValidationAlert.warning(
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
        userWords.every((w, i) => w === correctWords[i]);

      if (isCorrect) correctCount++;
    });

    setScore({ correct: correctCount, total: exerciseSentences.length });

    if (correctCount === exerciseSentences.length) {
      ValidationAlert.success(
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
    setResetKey((prev) => prev + 1); // ✅ هذا المهم
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

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "20px", marginBottom: "50px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">G</span> Look, read, and write{" "}
          <span style={{ color: "navy" }}>✕</span> over the mistake. Rewrite the
          sentence.
        </h1>

        <div className="space-y-2">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <span className="font-bold text-blue-600 text-xl">1.</span>

            <div className="flex-1">
              <p className="text-lg text-gray-400 line-through">
                She doesn’t like rice.
              </p>
              <p className="text-lg text-gray-900 font-semibold">
                she doesn't like fruit.
              </p>
            </div>

            <img src={img1}  style={{height:"120px"}} />
          </div>
          {exerciseSentences.map((sentence, index) => (
            <div
              key={`${sentence.id}-${resetKey}`} // ✅ الحل هنا
              className="flex items-start gap-4 p-4 rounded-xl"
            >
              <span className="font-bold text-blue-600 text-xl pt-2">
                {index + 2}.
              </span>

              <div className="flex-1">
                <SentenceBuilder
                  id={sentence.id}
                  scrambled={sentence.scrambled}
                  correct={sentence.correct}
                  onUpdate={(ans) => handleAnswerUpdate(sentence.id, ans)}
                  showResult={showResults}
                  src={sentence.img}
                  forceAnswer={showAnswers}
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

export default WB_Unit5_Page30_Q1;

import React, { useState } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 39/Ex B 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 39/Ex B 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 39/Ex B 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 39/Ex B 4.svg";

const exerciseDataL = {
  sentences: [
    {
      id: "l1",
      correctSentence: "It's eight thirty.",
      words: ["eight", "It's", "thirty."],
    },
    {
      id: "l2",
      correctSentence: "It's four o'clock.",
      words: ["four", "It's", "o'clock."],
    },
    {
      id: "l3",
      correctSentence: "It's a quarter past two.",
      words: ["quarter", "two.", "It's", "a", "past"],
    },
    {
      id: "l4",
      correctSentence: "It's a quarter to two.",
      words: ["two.", "quarter", "It's", "a", "to"],
    },
  ],
};

const WB_Unit7_Page39_Q2 = () => {
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [draggedWord, setDraggedWord] = useState(null);

  const images = [img1, img2, img3, img4];

  const handleDragStart = (sentenceId, word) => {
    if (showResults) return;
    setDraggedWord({ sentenceId, word });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropOnBlank = (sentenceId) => {
    if (!draggedWord || draggedWord.sentenceId !== sentenceId || showResults) {
      return;
    }

    const currentAnswer = userAnswers[sentenceId] || [];

    // 🔒 منع التكرار
    if (currentAnswer.includes(draggedWord.word)) {
      setDraggedWord(null);
      return;
    }

    const sentence = exerciseDataL.sentences.find((s) => s.id === sentenceId);
    if (!sentence) return;

    if (currentAnswer.length >= sentence.words.length) {
      setDraggedWord(null);
      return;
    }

    const newAnswer = [...currentAnswer, draggedWord.word];

    setUserAnswers((prev) => ({
      ...prev,
      [sentenceId]: newAnswer,
    }));

    setDraggedWord(null);
  };

  const handleRemoveWord = (sentenceId, index) => {
    if (showResults) return;

    const currentAnswer = userAnswers[sentenceId] || [];
    const newAnswer = currentAnswer.filter((_, i) => i !== index);

    setUserAnswers((prev) => ({
      ...prev,
      [sentenceId]: newAnswer,
    }));
  };

  const isSentenceComplete = (sentence) => {
    return (userAnswers[sentence.id] || []).length === sentence.words.length;
  };

  const checkAnswers = () => {
    const incomplete = exerciseDataL.sentences.filter(
      (sentence) => !isSentenceComplete(sentence),
    );

    if (incomplete.length > 0) {
      ValidationAlert.warning(
        "Please complete all sentences before checking your answers.",
      );
      return;
    }

    setShowResults(true);

    let score = 0;
    const total = exerciseDataL.sentences.length;

    exerciseDataL.sentences.forEach((sentence) => {
      const userSentence = (userAnswers[sentence.id] || []).join(" ").trim();
      const correctSentence = sentence.correctSentence.trim();

      if (userSentence === correctSentence) {
        score++;
      }
    });

    if (score === total) {
      ValidationAlert.success(`Score: ${score} / ${total}`);
    } else if (score > 0) {
      ValidationAlert.warning(`Score: ${score} / ${total}`);
    } else {
      ValidationAlert.error(`Score: ${score} / ${total}`);
    }
  };

  const handleStartAgain = () => {
    setUserAnswers({});
    setShowResults(false);
    setDraggedWord(null);
  };

  const handleShowAnswer = () => {
    const correctAnswers = {};

    exerciseDataL.sentences.forEach((sentence) => {
      correctAnswers[sentence.id] = sentence.correctSentence.split(" ");
    });

    setUserAnswers(correctAnswers);
    setShowResults(true);
  };

  const isWrongSentence = (sentence) => {
    if (!showResults) return false;

    const userSentence = (userAnswers[sentence.id] || []).join(" ").trim();
    if (!userSentence) return false;

    return userSentence !== sentence.correctSentence.trim();
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "20px" }}>
        {" "}
        <h1 className="WB-header-title-page8">
          {" "}
          <div className="WB-ex-A">B</div>Look and write sentences.{" "}
        </h1>
        <div className="grid grid-cols-2 gap-8 mb-8">
          {exerciseDataL.sentences.map((sentence, idx) => {
            const builtSentence = (userAnswers[sentence.id] || []).join(" ");

            return (
              <div key={sentence.id} className="space-y-4">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-lg text-blue-700 mb-4">
                    {idx + 1}
                  </span>

                  <img
                    src={images[idx]}
                    className="max-w-85 max-h-40 object-cover"
                  />
                </div>

                {/* WORD BANK */}
                <div className="flex flex-wrap gap-2 min-h-14 p-2 border-2 border-dashed border-gray-400 rounded-lg bg-white">
                  {sentence.words.map((word) => {
                    const isUsed = (userAnswers[sentence.id] || []).includes(
                      word,
                    );

                    return (
                      <button
                        key={word}
                        draggable={!isUsed && !showResults}
                        onDragStart={() => {
                          if (!isUsed) handleDragStart(sentence.id, word);
                        }}
                        className={`px-3 py-2 rounded-lg font-semibold transition
                      ${
                        isUsed
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                          : "bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-move"
                      }`}
                      >
                        {word}
                      </button>
                    );
                  })}
                </div>

                {/* ANSWER */}
                <div className="relative">
                  <div
                    className="min-h-20 border-2 border-dashed border-gray-300 rounded-lg p-3 bg-gray-50"
                    onDragOver={handleDragOver}
                    onDrop={() => handleDropOnBlank(sentence.id)}
                  >
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(userAnswers[sentence.id] || []).map((word, i) => (
                        <button
                          key={`${word}-${i}`}
                          onClick={() => handleRemoveWord(sentence.id, i)}
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600"
                        >
                          {word} {!showResults && "✕"}
                        </button>
                      ))}
                    </div>

                    {builtSentence ? (
                      <p className="text-gray-800 font-medium">
                        {builtSentence}
                      </p>
                    ) : (
                      <p className="text-gray-400 text-sm italic">
                        Drag words here to build the sentence
                      </p>
                    )}
                  </div>

                  {isWrongSentence(sentence) && (
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shadow-md border-2 border-white">
                      <span className="text-white text-sm font-bold leading-none">
                        ✕
                      </span>
                    </div>
                  )}
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

export default WB_Unit7_Page39_Q2;

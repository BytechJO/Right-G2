import React, { useState } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import falseIcon from "../../../assets/imgs/false.svg";
// صور الجمل (استبدل المسارات بالمسارات الفعلية)
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 30/Ex G 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 30/Ex G 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 30/Ex G 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 30/Ex G 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 30/Ex G 5.svg";

// بيانات التمرين
const sentencesData = [
  {
    id: 1,
    incorrectSentence: "She doesn't like rice.",
    correctSentence: "She doesn't like fruit.",
    incorrectWordIndex: 3, // "rice" هي الكلمة الخاطئة (الفهرس 3)
    correctWord: "fruit",
    image: img1,
    wordBank: ["fruit", "meat", "fish"],
  },
  {
    id: 2,
    incorrectSentence: "He likes fish.",
    correctSentence: "He doesn't like fish.",
    incorrectWordIndex: 1, // "likes" هي الكلمة الخاطئة
    correctWord: "doesn't",
    image: img2,
    wordBank: ["likes", "doesn't", "loves"],
  },
  {
    id: 3,
    incorrectSentence: "He doesn't like chicken.",
    correctSentence: "He doesn't like meat.",
    incorrectWordIndex: 3, // "chicken" هي الكلمة الخاطئة
    correctWord: "meat",
    image: img3,
    wordBank: ["meat", "rice", "chicken"],
  },
  {
    id: 4,
    incorrectSentence: "I like meat.",
    correctSentence: "I like stew.",
    incorrectWordIndex: 2, // "meat" هي الكلمة الخاطئة
    correctWord: "stew",
    image: img4,
    wordBank: ["stew", "meat", "fish"],
  },
  {
    id: 5,
    incorrectSentence: "He likes rice.",
    correctSentence: "He doesn't like rice.",
    incorrectWordIndex: 1, // "likes" هي الكلمة الخاطئة
    correctWord: "doesn't",
    image: img5,
    wordBank: ["likes", "doesn't", "loves"],
  },
];

const CorrectSentenceExercise = () => {
  const [markedWords, setMarkedWords] = useState({}); // {sentenceId: wordIndex}
  const [userAnswers, setUserAnswers] = useState({}); // {sentenceId: selectedWord}
  const [showResults, setShowResults] = useState(false);
  const [draggedWord, setDraggedWord] = useState(null);

  // معالج النقر على كلمة لوضع علامة X
  const handleWordClick = (sentenceId, wordIndex) => {
    if (showResults) return;

    // إذا كانت نفس الكلمة مضغوطة، أزلها
    if (markedWords[sentenceId] === wordIndex) {
      setMarkedWords((prev) => {
        const newMarked = { ...prev };
        delete newMarked[sentenceId];
        return newMarked;
      });
    } else {
      // ضع علامة على كلمة واحدة فقط لكل جملة
      setMarkedWords((prev) => ({
        ...prev,
        [sentenceId]: wordIndex,
      }));
    }
  };

  // معالج بدء السحب
  const handleDragStart = (word) => {
    setDraggedWord(word);
  };

  // معالج السماح بالإفلات
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // معالج الإفلات
  const handleDrop = (sentenceId) => {
    if (showResults || !draggedWord) return;
    setUserAnswers((prev) => ({
      ...prev,
      [sentenceId]: draggedWord,
    }));
    setDraggedWord(null);
  };

  // معالج إزالة الكلمة من الفراغ
  const handleRemoveWord = (sentenceId) => {
    if (showResults) return;
    setUserAnswers((prev) => {
      const newAnswers = { ...prev };
      delete newAnswers[sentenceId];
      return newAnswers;
    });
  };

  // الحصول على الجملة الصحيحة مقسمة إلى أجزاء
  const getSentenceParts = (sentence) => {
    const words = sentence.split(" ");
    return words;
  };

  // التحقق من صحة الإجابة
  const isAnswerCorrect = (sentenceId) => {
    const sentence = sentencesData.find((s) => s.id === sentenceId);
    return userAnswers[sentenceId] === sentence.correctWord;
  };

  // معالج التحقق من الإجابات
  const checkAnswers = () => {
    if (showResults) return;

    // تحقق من أن جميع الجمل تم ملؤها
    const allFilled = sentencesData.every(
      (sentence) => userAnswers[sentence.id],
    );

    if (!allFilled) {
      ValidationAlert.info("Please complete all sentences first.");
      return;
    }

    setShowResults(true);

    let score = 0;
    sentencesData.forEach((sentence) => {
      if (isAnswerCorrect(sentence.id)) {
        score++;
      }
    });

    const total = sentencesData.length;

    if (score === total) ValidationAlert.success(`Score: ${score} / ${total}`);
    else if (score > 0) ValidationAlert.warning(`Score: ${score} / ${total}`);
    else ValidationAlert.error(`Score: ${score} / ${total}`);
  };

  // معالج عرض الإجابات
  const handleShowAnswer = () => {
    const correctAnswers = {};
    const correctMarked = {};

    sentencesData.forEach((sentence) => {
      // ملء الإجابات الصحيحة
      correctAnswers[sentence.id] = sentence.correctWord;
      // وضع علامة X على الكلمة الخاطئة تلقائياً
      correctMarked[sentence.id] = sentence.incorrectWordIndex;
    });

    setUserAnswers(correctAnswers);
    setMarkedWords(correctMarked);
    setShowResults(true);
  };

  // معالج إعادة التشغيل
  const handleStartAgain = () => {
    setUserAnswers({});
    setMarkedWords({});
    setShowResults(false);
    setDraggedWord(null);
  };
  const isWordUsed = (word) => {
    return Object.values(userAnswers).includes(word);
  };
  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ marginBottom: "30px" ,gap:"30px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">G</span> Look, read, and write{" "}
          <span className="text-blue-900">✕</span> over the mistake. Rewrite the
          sentence.
        </h1>

        {/* الجمل التفاعلية */}
        <div className="space-y-8">
          {sentencesData.map((sentence) => {
            const correctWords = getSentenceParts(sentence.correctSentence);
            const incorrectWords = getSentenceParts(sentence.incorrectSentence);

            return (
              <div
                key={sentence.id}
                className="border-2 border-blue-900 rounded-[23px] flex justify-between gap-5"
              >
                {/* رقم الجملة والجملة الخاطئة مع إمكانية النقر على الكلمات */}
                <div className="flex items-start gap-2 w-full p-[20px]">
                  <span className="text-xl font-semibold text-blue-900 mt-1">
                    {sentence.id}
                  </span>
                  <div className="flex-1 space-y-3">
                    {/* الجملة الخاطئة - الكلمات قابلة للنقر */}
                    <div className="flex flex-wrap items-center gap-2 text-[18px]">
                      {incorrectWords.map((word, wordIndex) => (
                        <button
                          key={wordIndex}
                          onClick={() =>
                            handleWordClick(sentence.id, wordIndex)
                          }
                          disabled={showResults}
                          className={`relative px-2 py-1 rounded transition-all ${
                            markedWords[sentence.id] === wordIndex
                              ? "text-red-600 font-bold"
                              : "text-gray-800 hover:bg-gray-100"
                          } ${showResults ? "cursor-default" : "cursor-pointer"}`}
                        >
                          {word}
                          {markedWords[sentence.id] === wordIndex && (
                            <span className="absolute -top-2 -right-2 text-2xl text-red-600 font-bold">
                              <img src={falseIcon} style={{ height: "25px" }} />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Word Bank لهذه الجملة */}
                    <div className="rounded-lg">
                      <div className="flex flex-wrap gap-2">
                        {sentence.wordBank.map((word) => {
                          const used = isWordUsed(word);

                          return (
                            <div
                              key={word}
                              draggable={!used && !showResults}
                              onDragStart={() => handleDragStart(word)}
                              className={`WB-word-bank 
        ${
          used
            ? "bg-gray-200 opacity-40 cursor-not-allowed border border-gray-400"
            : "border-2 border-blue-900 hover:bg-blue-50 cursor-move"
        }
        ${draggedWord === word ? "opacity-40" : ""}
      `}
                            >
                              {word}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* منطقة الإجابة - السحب والإفلات */}
                    <div
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(sentence.id)}
                      className={`relative p-2 rounded-lg transition-all ${
                        userAnswers[sentence.id]
                          ? showResults
                            ? isAnswerCorrect(sentence.id)
                              ? "border-gray-400"
                              : "border-gray-400"
                            : "border-blue-500"
                          : "border-blue-500"
                      }`}
                    >
                      {showResults &&
                        userAnswers[sentence.id] &&
                        !isAnswerCorrect(sentence.id) && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold shadow border-2 border-white">
                            ✕
                          </div>
                        )}
                      <div className="flex flex-wrap items-center gap-2 text-lg">
                        {/* عرض الجملة مع الفراغ */}
                        {correctWords.map((word, wordIndex) => {
                          if (wordIndex === sentence.incorrectWordIndex) {
                            // هذا هو مكان الفراغ - منطقة السحب والإفلات
                            return (
                              <div
                                key={wordIndex}
                                className={`px-3 py-2 border-b-2 transition-all ${
                                  userAnswers[sentence.id]
                                    ? showResults
                                      ? isAnswerCorrect(sentence.id)
                                        ? "border-blue-500"
                                        : "border-red-500"
                                      : "border-blue-900 bg-blue-50"
                                    : "border-blue-900"
                                }`}
                              >
                                {userAnswers[sentence.id] ? (
                                  <button
                                    onClick={() =>
                                      handleRemoveWord(sentence.id)
                                    }
                                    disabled={showResults}
                                    className={`font-bold transition-all ${
                                      showResults
                                        ? isAnswerCorrect(sentence.id)
                                          ? "text-blue-700 cursor-default"
                                          : "text-blue-700 cursor-default"
                                        : "text-blue-700 hover:text-blue-900 cursor-pointer"
                                    }`}
                                  >
                                    {userAnswers[sentence.id]}
                                  </button>
                                ) : (
                                  <span className="text-gray-500 italic text-sm">
                                    [Drop here]
                                  </span>
                                )}
                              </div>
                            );
                          } else {
                            // الكلمات الأخرى
                            return (
                              <span key={wordIndex} className="text-gray-800">
                                {word}
                              </span>
                            );
                          }
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* الصورة */}

                <img
                  src={sentence.image}
                  alt={`Sentence ${sentence.id}`}
                  className="rounded-lg object-contain"
                  style={{ height: "200px", width: "auto" }}
                />
              </div>
            );
          })}
        </div>

        {/* أزرار التحكم */}
        <Button
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={handleStartAgain}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
};

export default CorrectSentenceExercise;

import React, { useState } from "react";

// استيراد الصور ومكونات الأزرار والتنبيهات
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import placeholderImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page26/Ex B 1.svg";

// بيانات التمرين
const scrambledWords = [
  { id: 1, scrambled: "yaM", correct: "May", letters: ["y", "a", "M"] },
  { id: 2, scrambled: "layp", correct: "play", letters: ["l", "a", "y", "p"] },
  {
    id: 3,
    scrambled: "tpani",
    correct: "paint",
    letters: ["t", "p", "a", "n", "i"],
  },
  { id: 4, scrambled: "nair", correct: "rain", letters: ["n", "a", "i", "r"] },
  { id: 5, scrambled: "keac", correct: "cake", letters: ["k", "e", "a", "c"] },
  { id: 6, scrambled: "kael", correct: "lake", letters: ["k", "a", "e", "l"] },
];

const WB_Unit4_Page26_Q2 = () => {
  // حفظ الكلمات المرتبة بناءً على ترتيب الحروف
  const [userArrangements, setUserArrangements] = useState({});
  const [showResults, setShowResults] = useState(false);

  // معالج إضافة حرف إلى الترتيب
  const handleLetterClick = (wordId, letter, letterIndex) => {
    if (showResults) return;

    setUserArrangements((prev) => {
      const current = prev[wordId] || [];
      // تجنب إضافة نفس الحرف مرتين
      if (current.includes(letterIndex)) return prev;
      return {
        ...prev,
        [wordId]: [...current, letterIndex],
      };
    });
  };

  // معالج حذف حرف محدد من الترتيب
  const handleDeleteLetterAtPosition = (wordId, position) => {
    if (showResults) return;

    setUserArrangements((prev) => {
      const current = prev[wordId] || [];
      if (position < 0 || position >= current.length) return prev;
      return {
        ...prev,
        [wordId]: current.filter((_, idx) => idx !== position),
      };
    });
  };

  // الحصول على الكلمة المرتبة من قبل الطالب
  const getArrangedWord = (wordId) => {
    const word = scrambledWords.find((w) => w.id === wordId);
    if (!word) return "";

    const arrangement = userArrangements[wordId] || [];
    return arrangement.map((letterIndex) => word.letters[letterIndex]).join("");
  };

  // التحقق من صحة الترتيب
  const isWordCorrect = (wordId) => {
    const word = scrambledWords.find((w) => w.id === wordId);
    return getArrangedWord(wordId) === word.correct;
  };

const handleShowAnswer = () => {
  const correctArrangements = {};

  scrambledWords.forEach((word) => {
    const usedIndexes = [];

    const correctIndexes = word.correct.split("").map((char) => {
      const foundIndex = word.letters.findIndex(
        (letter, idx) =>
          letter.toLowerCase() === char.toLowerCase() &&
          !usedIndexes.includes(idx),
      );

      usedIndexes.push(foundIndex);
      return foundIndex;
    });

    correctArrangements[word.id] = correctIndexes;
  });

  setUserArrangements(correctArrangements);
  setShowResults(true);
};

  // معالج إعادة التشغيل
  const handleStartAgain = () => {
    setUserArrangements({});
    setShowResults(false);
  };

  // معالج التحقق من الإجابات
  const checkAnswers = () => {
    if (showResults) return;

    // تحقق من أن جميع الكلمات مكتملة
    const allFilled = scrambledWords.every((word) => {
      const arranged = getArrangedWord(word.id);
      return arranged.length === word.correct.length;
    });

    if (!allFilled) {
      ValidationAlert.info("Please complete all words first.");
      return;
    }

    // إذا كانت جميع الكلمات مكتملة
    setShowResults(true);

    let score = 0;

    scrambledWords.forEach((word) => {
      if (isWordCorrect(word.id)) {
        score++;
      }
    });

    const total = scrambledWords.length;

    if (score === total) ValidationAlert.success(`Score: ${score} / ${total}`);
    else if (score > 0) ValidationAlert.warning(`Score: ${score} / ${total}`);
    else ValidationAlert.error(`Score: ${score} / ${total}`);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall mbb-5"  style={{gap:"25px"}}>
        <h1 className="WB-header-title-page8">
          {" "}
          <span className="WB-ex-A">B</span> Unscramble the words. Complete the
          story.
        </h1>
        <img
          src={placeholderImg}
          className="object-cover rounded-lg"
          style={{height:"90%",width:"93%"}}
        />

        {/* الصورة والفراغات */}
        <div className="space-y-4 mb-13">
          {/* عرض الحروف المبعثرة لكل كلمة */}
          <div className="space-y-3 p-4 rounded-lg grid grid-cols-3">
            {scrambledWords.map((word) => (
              <div key={word.id} className="space-y-2">
                {/* عرض الحروف المبعثرة */}
                <div className="flex gap-2 w-50">
                  {word.letters.map((letter, letterIndex) => {
                    const isSelected =
                      userArrangements[word.id]?.includes(letterIndex);
                    return (
                      <button
                        key={letterIndex}
                        onClick={() =>
                          handleLetterClick(word.id, letter, letterIndex)
                        }
                        disabled={isSelected || showResults}
                        className={`WB-word-bank
                        ${
                          isSelected
                            ? "bg-gray-300 text-gray-500 line-through cursor-not-allowed"
                            : "bg-blue-100 text-blue-600 border-2 border-blue-400 hover:bg-blue-200"
                        }`}
                        // style={{flexWrap:"nowrap"}}
                      >
                        {letter}
                      </button>
                    );
                  })}
                </div>

                {/* إنبوتات لترتيب الحروف */}
                <div className="flex items-center gap-3 w-full">
                  <div className="flex gap-1 bg-white border-2 border-gray-300 rounded-lg p-2">
                    {Array.from({ length: word.correct.length }).map(
                      (_, idx) => {
                        const letterIndex = userArrangements[word.id]?.[idx];
                        const letter =
                          letterIndex !== undefined
                            ? word.letters[letterIndex]
                            : "";
                        return (
                          <button
                            key={idx}
                            onClick={() =>
                              handleDeleteLetterAtPosition(word.id, idx)
                            }
                            disabled={!letter || showResults}
                            className={`w-8 h-8 border-2 border-gray-400 rounded-lg flex items-center justify-center font-bold text-lg bg-gray-50 transition-all ${
                              letter
                                ? "cursor-pointer hover:bg-red-100 hover:border-red-500 hover:text-red-600"
                                : "cursor-default"
                            }`}
                          >
                            {letter}
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-2xl leading-relaxed">
            <Blank
              id={1}
              value={getArrangedWord(1)}
              isCorrect={isWordCorrect(1)}
              showResults={showResults}
            />{" "}
            likes to
            <Blank
              id={2}
              value={getArrangedWord(2)}
              isCorrect={isWordCorrect(2)}
              showResults={showResults}
            />{" "}
            and
            <Blank
              id={3}
              value={getArrangedWord(3)}
              isCorrect={isWordCorrect(3)}
              showResults={showResults}
            />{" "}
            in the
            <Blank
              id={4}
              value={getArrangedWord(4)}
              isCorrect={isWordCorrect(4)}
              showResults={showResults}
            />
            . She also likes to eat
            <Blank
              id={5}
              value={getArrangedWord(5)}
              isCorrect={isWordCorrect(5)}
              showResults={showResults}
            />{" "}
            near the
            <Blank
              id={6}
              value={getArrangedWord(6)}
              isCorrect={isWordCorrect(6)}
              showResults={showResults}
            />
            .
          </p>
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

// مكون مساعد للفراغ
const Blank = ({ id, value, isCorrect, showResults }) => {
  let borderClass = "border-gray-400";

  if (showResults) {
    borderClass = isCorrect ? "border-gray-400" : "border-red-500";
  }

  return (
    <button
      className={`relative inline-block w-28 text-center mx-2 border-b-2 focus:outline-none text-2xl transition-all ${borderClass}`}
    >
      {value || <span className="text-transparent">.</span>}
      {/* ❌ Wrong Icon */}
                    {showResults && value && !isCorrect && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold shadow border-2 border-white">
                        ✕
                      </div>
                    )}
    </button>
  );
};

export default WB_Unit4_Page26_Q2;
